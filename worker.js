// Cloudflare Worker: HTTPS-proxy voor OVapi en haltezoekfunctie.
// Deploy als Worker zonder extra packages. Public endpoint, read-only.
const API = "http://v0.ovapi.nl";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=20"
};
function reply(data,status=200,extra={}) {
  return new Response(JSON.stringify(data), {status,headers:{...cors,"Content-Type":"application/json; charset=utf-8",...extra}});
}
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null,{status:204,headers:cors});
    if (request.method !== "GET") return reply({error:"Alleen GET is toegestaan"},405);
    try {
      if (url.pathname === "/health") return reply({ok:true,service:"R-Net OV Bordbouwer proxy"});
      if (url.pathname.startsWith("/tpc/")) {
        const code = decodeURIComponent(url.pathname.slice(5));
        if (!/^[A-Za-z0-9_,:-]{2,200}$/.test(code)) return reply({error:"Ongeldige haltecode"},400);
        const upstream = await fetch(`${API}/tpc/${encodeURIComponent(code)}`, {
          headers: {"Accept":"application/json","User-Agent":"RNet-OV-Bordbouwer/1.0"}
        });
        if (!upstream.ok) return reply({error:`OVapi HTTP ${upstream.status}`},502);
        return new Response(await upstream.text(),{status:200,headers:{...cors,"Content-Type":"application/json; charset=utf-8","Cache-Control":"public, max-age=20"}});
      }
      if (url.pathname === "/search") {
        const q=(url.searchParams.get("q")||"").trim().toLocaleLowerCase("nl-NL");
        if(q.length<2) return reply({results:[]});
        const cached = await fetch(`${API}/tpc/`,{headers:{"Accept":"application/json","User-Agent":"RNet-OV-Bordbouwer/1.0"}});
        if(!cached.ok) return reply({error:`OVapi HTTP ${cached.status}`},502);
        const all=await cached.json();
        const results=[];
        for(const [code,item] of Object.entries(all)){
          const stop=item?.Stop||item||{};
          const name=stop.TimingPointName||"";
          const town=stop.TimingPointTown||"";
          if((name+" "+town).toLocaleLowerCase("nl-NL").includes(q)){
            results.push({code:stop.TimingPointCode||code,name,town});
            if(results.length>=30)break;
          }
        }
        return reply({results});
      }
      return reply({error:"Niet gevonden",routes:["/health","/search?q=Bornholm","/tpc/30005071"]},404);
    } catch(e) {
      return reply({error:"Proxyfout",detail:String(e?.message||e)},502);
    }
  }
};
