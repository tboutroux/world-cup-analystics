import { Activity, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScoreboard, getStandings, getPlayerStats } from "@/lib/api";
import PlayerStatsTile from "@/components/PlayerStatsTile";
import Header from "@/components/Header";
import Link from "next/link";

export default async function Home() {
  const [scoreboardData, standingsData, playerStatsData] = await Promise.all([
    getScoreboard(),
    getStandings(),
    getPlayerStats()
  ]);

  const liveMatches = scoreboardData.events.filter(e => e.status.type.state === "in");
  const upcomingMatches = scoreboardData.events.filter(e => e.status.type.state === "pre");
  const finishedMatches = scoreboardData.events.filter(e => e.status.type.state === "post");

  const mainMatch = liveMatches[0] || upcomingMatches[0] || finishedMatches[0];

  // Get the first group as featured standing
  const featuredGroup = standingsData.children?.[0];
  
  const getStat = (entry: any, statName: string) => {
    return entry.stats.find((s: any) => s.name === statName)?.value ?? 0;
  };

  // Calculate Tournament Stats from Standings
  let totalMatchesPlayedCount = 0;
  let totalGoalsScoredCount = 0;

  standingsData.children?.forEach(group => {
    group.standings.entries.forEach(entry => {
      totalMatchesPlayedCount += getStat(entry, "gamesPlayed");
      totalGoalsScoredCount += getStat(entry, "pointsFor");
    });
  });

  const actualMatchesPlayed = Math.floor(totalMatchesPlayedCount / 2);

  // Get Leaders
  const scorersLeaders = playerStatsData.stats.find(s => s.name === "goalsLeaders")?.leaders.slice(0, 3) || [];
  const assistsLeaders = playerStatsData.stats.find(s => s.name === "assistsLeaders")?.leaders.slice(0, 3) || [];

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
      <Header liveCount={liveMatches.length} activePage="home" />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
        
        {/* Main Event Tile - 2x2 */}
        {mainMatch && (
          <Link 
            href={`/match/${mainMatch.id}`}
            className={cn(
              "col-span-1 md:col-span-4 lg:col-span-4 row-span-2",
              "rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8",
              "relative overflow-hidden group hover:border-wc-blue/50 transition-all duration-500 cursor-pointer"
            )}
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
              <Activity className="w-12 h-12 text-wc-blue" />
            </div>
            <div className="flex flex-col h-full relative z-10">
              <div className="flex justify-between items-start">
                <span className={cn(
                  "text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                  mainMatch.status.type.state === "in" ? "bg-wc-red" : "bg-wc-blue"
                )}>
                  {mainMatch.status.type.shortDetail}
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="flex items-center justify-between w-full max-w-3xl gap-4 md:gap-8">
                  {/* Home Team */}
                  <div className="flex-1 text-center">
                    <img 
                      src={mainMatch.competitions[0].competitors[0].team.logo} 
                      alt={mainMatch.competitions[0].competitors[0].team.name} 
                      className="w-20 h-20 md:w-32 md:h-32 mb-6 mx-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500"
                    />
                    <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter line-clamp-1">
                      {mainMatch.competitions[0].competitors[0].team.displayName}
                    </h2>
                  </div>

                  {/* Score / Center Info */}
                  <div className="flex flex-col items-center justify-center px-4 min-w-[120px] md:min-w-[200px]">
                    <div className="text-5xl md:text-8xl font-black italic tracking-tighter flex items-center gap-3 leading-none">
                      <span>{mainMatch.competitions[0].competitors[0].score}</span>
                      <span className="text-wc-red opacity-50">-</span>
                      <span>{mainMatch.competitions[0].competitors[1].score}</span>
                    </div>
                    {mainMatch.status.type.state === "in" && (
                      <div className="mt-4 bg-wc-red/10 text-wc-red px-4 py-1 rounded-full font-mono text-lg md:text-xl font-bold animate-pulse border border-wc-red/20">
                        {mainMatch.status.displayClock}
                      </div>
                    )}
                    {mainMatch.status.type.state === "pre" && (
                      <div className="mt-4 bg-wc-blue/20 text-wc-blue px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-wc-blue/30">
                        Bientôt
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 text-center">
                    <img 
                      src={mainMatch.competitions[0].competitors[1].team.logo} 
                      alt={mainMatch.competitions[0].competitors[1].team.name} 
                      className="w-20 h-20 md:w-32 md:h-32 mb-6 mx-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500"
                    />
                    <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter line-clamp-1">
                      {mainMatch.competitions[0].competitors[1].team.displayName}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-auto pt-8 border-t border-white/10">
                <div className="text-center">
                  <div className="text-[10px] opacity-50 uppercase font-bold mb-1">Stade</div>
                  <div className="text-sm md:text-base font-bold truncate">{mainMatch.competitions[0].venue?.fullName || "TBD"}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] opacity-50 uppercase font-bold mb-1">Date</div>
                  <div className="text-sm md:text-base font-bold">
                    {new Date(mainMatch.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] opacity-50 uppercase font-bold mb-1">Heure</div>
                  <div className="text-sm md:text-base font-bold">
                    {new Date(mainMatch.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Live Sidebar - 1x2 */}
        <div className={cn(
          "col-span-1 md:col-span-2 lg:col-span-2 row-span-2",
          "rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6",
          "hover:border-wc-red/50 transition-all flex flex-col"
        )}>
          <h3 className="flex items-center gap-2 text-lg font-bold mb-6 italic uppercase tracking-tighter">
            <Activity className="w-5 h-5 text-wc-red" />
            Scores & Calendrier
          </h3>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {scoreboardData.events.slice(0, 8).map((event) => (
              <Link 
                href={`/match/${event.id}`}
                key={event.id} 
                className="block bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] opacity-50 uppercase font-black">{event.status.type.shortDetail}</span>
                  {event.status.type.state === "in" && (
                    <span className="text-[10px] bg-wc-red/20 text-wc-red px-2 py-0.5 rounded uppercase font-black animate-pulse">Live</span>
                  )}
                </div>
                <div className="space-y-2 mt-3">
                  {event.competitions[0].competitors.map(comp => (
                    <div key={comp.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={comp.team.logo} className="w-5 h-5 object-contain" alt="" />
                        <span className="font-bold text-sm uppercase">{comp.team.abbreviation}</span>
                      </div>
                      <span className="text-lg font-black tracking-tighter">{comp.score}</span>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Standing Tile - 2x1 */}
        <div className={cn(
          "col-span-1 md:col-span-2 lg:col-span-3 row-span-1",
          "rounded-3xl bg-wc-green/10 backdrop-blur-2xl border border-wc-green/20 p-6",
          "hover:border-wc-green/50 transition-all"
        )}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="flex items-center gap-2 text-lg font-bold italic uppercase tracking-tighter">
              <Shield className="w-5 h-5 text-wc-green" />
              Classement {featuredGroup?.name || "Direct"}
            </h3>
            <Link 
              href="/standings" 
              className="text-[10px] font-bold bg-wc-green/20 text-wc-green px-3 py-1 rounded-full uppercase hover:bg-wc-green/30 transition-colors"
            >
              Voir Tout
            </Link>
          </div>
          
          {featuredGroup ? (
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
                  {featuredGroup.standings.entries
                    .sort((a: any, b: any) => {
                      const pointsA = getStat(a, "points");
                      const pointsB = getStat(b, "points");
                      if (pointsB !== pointsA) return pointsB - pointsA;
                      const gdA = getStat(a, "pointDifferential");
                      const gdB = getStat(b, "pointDifferential");
                      return gdB - gdA;
                    })
                    .slice(0, 4)
                    .map((entry, idx) => (
                    <tr key={entry.team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-3 font-bold flex items-center gap-2 truncate max-w-[150px]">
                        <span className={cn(
                          "text-[10px] w-4",
                          idx < 2 ? "text-wc-green" : "opacity-30"
                        )}>{idx + 1}.</span>
                        <img src={entry.team.logo} className="w-4 h-4 object-contain" alt="" />
                        <span className="truncate">{entry.team.shortDisplayName}</span>
                      </td>
                      <td className="py-3 text-center text-xs opacity-50">{getStat(entry, "gamesPlayed")}</td>
                      <td className="py-3 text-center text-xs opacity-50">{getStat(entry, "pointDifferential")}</td>
                      <td className="py-3 text-center text-sm font-black text-wc-green">{getStat(entry, "points")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 opacity-50 italic">
              Aucune donnée de classement disponible.
            </div>
          )}
        </div>

        {/* Unified Player Stats Tile - 2x1 */}
        <PlayerStatsTile 
          scorers={scorersLeaders} 
          assists={assistsLeaders} 
          totalGoals={totalGoalsScoredCount}
          totalMatches={actualMatchesPlayed}
        />

      </div>
    </main>
  );
}
