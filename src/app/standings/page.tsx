import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStandings, getScoreboard } from "@/lib/api";
import Header from "@/components/Header";

export default async function StandingsPage() {
  const [standingsData, scoreboardData] = await Promise.all([
    getStandings(),
    getScoreboard()
  ]);

  const liveMatches = scoreboardData.events.filter(e => e.status.type.state === "in");

  const getStat = (entry: any, statName: string) => {
    return entry.stats.find((s: any) => s.name === statName)?.value ?? 0;
  };

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
      <Header liveCount={liveMatches.length} activePage="standings" />

      <div className="mb-12">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">
          Classement <span className="text-wc-green">Groupes</span>
        </h2>
        <p className="text-white/50 text-sm font-bold uppercase tracking-widest">Phase de poules - World Cup 2026</p>
      </div>

      {/* Grid of Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {standingsData.children?.map((group) => (
          <div 
            key={group.id} 
            className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6 hover:border-wc-green/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-wc-green/20 p-2 rounded-xl">
                <Shield className="w-5 h-5 text-wc-green" />
              </div>
              <h3 className="font-black uppercase italic tracking-tighter text-xl">
                {group.name}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase opacity-50 font-black border-b border-white/10">
                    <th className="pb-2">Equipe</th>
                    <th className="pb-2 text-center">MJ</th>
                    <th className="pb-2 text-center">DB</th>
                    <th className="pb-2 text-center">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {group.standings.entries
                    .sort((a: any, b: any) => {
                      const pointsA = getStat(a, "points");
                      const pointsB = getStat(b, "points");
                      if (pointsB !== pointsA) return pointsB - pointsA;
                      const gdA = getStat(a, "pointDifferential");
                      const gdB = getStat(b, "pointDifferential");
                      return gdB - gdA;
                    })
                    .map((entry, idx) => (
                    <tr key={entry.team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group/row">
                      <td className="py-3 font-bold flex items-center gap-2 truncate">
                        <span className={cn(
                          "text-[10px] w-4",
                          idx < 2 ? "text-wc-green" : "opacity-30"
                        )}>{idx + 1}.</span>
                        <img src={entry.team.logos?.[0]?.href} className="w-4 h-4 object-contain" alt="" />
                        <span className="truncate text-sm">{entry.team.abbreviation}</span>
                      </td>
                      <td className="py-3 text-center text-xs opacity-50">{getStat(entry, "gamesPlayed")}</td>
                      <td className="py-3 text-center text-xs opacity-50">{getStat(entry, "pointDifferential")}</td>
                      <td className={cn(
                        "py-3 text-center text-sm font-black",
                        idx < 2 ? "text-wc-green" : "text-white"
                      )}>
                        {getStat(entry, "points")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
