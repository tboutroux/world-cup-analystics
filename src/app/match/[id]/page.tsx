import { getMatchSummary, getScoreboard } from "@/lib/api";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Activity, ChevronLeft } from "lucide-react";
import Link from "next/link";
import MatchTabs from "@/components/MatchTabs";

export default async function MatchPage({ params }: { params: { id: string } }) {
  const [summary, scoreboardData] = await Promise.all([
    getMatchSummary(params.id),
    getScoreboard()
  ]);

  const competition = summary.header.competitions[0];
  const homeTeam = competition.competitors.find(c => c.homeAway === "home")!;
  const awayTeam = competition.competitors.find(c => c.homeAway === "away")!;
  const isStarted = competition.status.type.state !== "pre";

  const liveMatches = scoreboardData.events.filter(e => e.status.type.state === "in");

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto">
      <Header liveCount={liveMatches.length} activePage="calendar" />

      <Link href="/calendar" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Retour au calendrier</span>
      </Link>

      {/* Match Header */}
      <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Activity className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <span className={cn(
            "text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-8",
            competition.status.type.state === "in" ? "bg-wc-red text-white animate-pulse" : "bg-white/10 text-white/70"
          )}>
            {competition.status.type.detail}
          </span>

          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-12">
            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-wc-blue/20 blur-3xl rounded-full group-hover:bg-wc-blue/40 transition-colors" />
                <img 
                  src={homeTeam.team.logo || homeTeam.team.logos?.[0]?.href} 
                  className="w-24 h-24 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" 
                  alt={homeTeam.team.displayName} 
                />
              </div>
              <div className="flex items-center gap-3">
                <img src={homeTeam.team.logo || homeTeam.team.logos?.[0]?.href} className="w-8 h-6 object-cover rounded-sm shadow-sm shrink-0 border border-white/10" alt="" />
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">{homeTeam.team.displayName}</h1>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center min-w-[150px]">
              {competition.status.type.state === "pre" ? (
                <div className="text-6xl md:text-8xl font-black italic opacity-20 italic">VS</div>
              ) : (
                <div className="text-7xl md:text-9xl font-black italic tracking-tighter flex items-center gap-4">
                  <span>{homeTeam.score}</span>
                  <span className="text-wc-blue opacity-30">-</span>
                  <span>{awayTeam.score}</span>
                </div>
              )}
              {competition.status.type.state === "in" && (
                <div className="mt-4 bg-wc-red/10 text-wc-red px-4 py-1 rounded-full font-mono text-xl font-bold border border-wc-red/20">
                  {competition.status.displayClock}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-wc-red/20 blur-3xl rounded-full group-hover:bg-wc-red/40 transition-colors" />
                <img 
                  src={awayTeam.team.logo || awayTeam.team.logos?.[0]?.href} 
                  className="w-24 h-24 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500" 
                  alt={awayTeam.team.displayName} 
                />
              </div>
              <div className="flex items-center gap-3">
                <img src={awayTeam.team.logo || awayTeam.team.logos?.[0]?.href} className="w-8 h-6 object-cover rounded-sm shadow-sm shrink-0 border border-white/10" alt="" />
                <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">{awayTeam.team.displayName}</h1>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-[10px] opacity-50 uppercase font-black mb-1">Stade</div>
              <div className="font-bold text-sm">{competition.venue?.fullName || "TBD"}</div>
            </div>
            <div>
              <div className="text-[10px] opacity-50 uppercase font-black mb-1">Lieu</div>
              <div className="font-bold text-sm">{competition.venue?.address?.city}, {competition.venue?.address?.country}</div>
            </div>
            <div>
              <div className="text-[10px] opacity-50 uppercase font-black mb-1">Date</div>
              <div className="font-bold text-sm">{new Date(competition.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
            <div>
              <div className="text-[10px] opacity-50 uppercase font-black mb-1">Affluence</div>
              <div className="font-bold text-sm">{competition.attendance ? competition.attendance.toLocaleString() : "TBD"}</div>
            </div>
          </div>
        </div>
      </div>

      <MatchTabs summary={summary} isStarted={isStarted} />
    </main>
  );
}
