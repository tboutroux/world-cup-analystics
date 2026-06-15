"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Activity, Users, BarChart3, Clock, ArrowLeftRight, AlertCircle, Goal, LayoutList } from "lucide-react";

interface TabsProps {
  summary: any;
  isStarted: boolean;
}

export default function MatchTabs({ summary, isStarted }: TabsProps) {
  const [activeTab, setActiveTab] = useState("last-matches");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
        <TabButton 
          id="last-matches" 
          label="Derniers Matchs" 
          icon={<Activity className="w-4 h-4" />} 
          active={activeTab === "last-matches"} 
          onClick={() => setActiveTab("last-matches")}
        />
        {summary.standings && (
           <TabButton 
             id="standings" 
             label="Classement" 
             icon={<LayoutList className="w-4 h-4" />} 
             active={activeTab === "standings"} 
             onClick={() => setActiveTab("standings")}
           />
        )}
        {isStarted && (
          <>
            <TabButton 
              id="lineup" 
              label="Compositions" 
              icon={<Users className="w-4 h-4" />} 
              active={activeTab === "lineup"}
              onClick={() => setActiveTab("lineup")}
            />
            <TabButton 
              id="stats" 
              label="Statistiques" 
              icon={<BarChart3 className="w-4 h-4" />} 
              active={activeTab === "stats"}
              onClick={() => setActiveTab("stats")}
            />
            <TabButton 
              id="highlights" 
              label="Fil du match" 
              icon={<Clock className="w-4 h-4" />} 
              active={activeTab === "highlights"}
              onClick={() => setActiveTab("highlights")}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === "last-matches" && <LastMatches summary={summary} />}
        {activeTab === "standings" && summary.standings && <MatchStandings summary={summary} />}
        {activeTab === "lineup" && isStarted && <Lineup summary={summary} />}
        {activeTab === "stats" && isStarted && <Statistics summary={summary} />}
        {activeTab === "highlights" && isStarted && <Timeline summary={summary} />}
      </div>
    </div>
  );
}

function MatchStandings({ summary }: { summary: any }) {
  const standings = summary.standings?.groups?.[0]?.standings?.entries || [];

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-4 text-[10px] font-black uppercase opacity-50">Rang</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase opacity-50">Équipe</th>
              <th className="px-4 py-4 text-[10px] font-black uppercase opacity-50 text-center">MJ</th>
              <th className="px-4 py-4 text-[10px] font-black uppercase opacity-50 text-center">V</th>
              <th className="px-4 py-4 text-[10px] font-black uppercase opacity-50 text-center">N</th>
              <th className="px-4 py-4 text-[10px] font-black uppercase opacity-50 text-center">D</th>
              <th className="px-4 py-4 text-[10px] font-black uppercase opacity-50 text-center">BP/BC</th>
              <th className="px-4 py-4 text-[10px] font-black uppercase opacity-50 text-center">Diff</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase opacity-50 text-center">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {standings.map((entry: any) => {
              const getStat = (name: string) => entry.stats.find((s: any) => s.name === name)?.displayValue || "0";
              const rank = entry.stats.find((s: any) => s.name === "rank")?.displayValue || "-";
              
              return (
                <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5 font-black italic opacity-30 group-hover:opacity-100 transition-opacity">
                    {rank}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img src={entry.logo?.[0]?.href} className="w-8 h-6 object-cover rounded-sm shadow-sm border border-white/10" alt="" />
                      <span className="font-bold uppercase tracking-tight">{entry.team}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center font-bold">{getStat("gamesPlayed")}</td>
                  <td className="px-4 py-5 text-center opacity-70">{getStat("wins")}</td>
                  <td className="px-4 py-5 text-center opacity-70">{getStat("ties")}</td>
                  <td className="px-4 py-5 text-center opacity-70">{getStat("losses")}</td>
                  <td className="px-4 py-5 text-center opacity-50 text-xs font-mono">
                    {getStat("pointsFor")}/{getStat("pointsAgainst")}
                  </td>
                  <td className="px-4 py-5 text-center">
                    <span className={cn(
                      "font-bold",
                      parseInt(getStat("pointDifferential")) > 0 ? "text-wc-green" : 
                      parseInt(getStat("pointDifferential")) < 0 ? "text-wc-red" : "opacity-50"
                    )}>
                      {getStat("pointDifferential")}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-xl font-black italic text-wc-blue bg-wc-blue/10 px-3 py-1 rounded-lg border border-wc-blue/20">
                      {getStat("points")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Timeline({ summary }: { summary: any }) {
  const events = summary.keyEvents || [];
  const homeTeamId = summary.boxscore.teams[0].team.id;
  const awayTeamId = summary.boxscore.teams[1].team.id;

  const getEventIcon = (typeId: string) => {
    switch(typeId) {
      case "94": // Yellow Card
        return <div className="w-4 h-6 bg-yellow-400 rounded-sm shadow-sm" />;
      case "96": // Red Card
        return <div className="w-4 h-6 bg-red-600 rounded-sm shadow-sm" />;
      case "76": // Substitution
        return <ArrowLeftRight className="w-5 h-5 text-wc-blue" />;
      case "11": // Goal
      case "12": // Penalty Goal
        return <Goal className="w-6 h-6 text-wc-green" />;
      case "129": // Start Delay (Hydration break)
        return <Clock className="w-5 h-5 text-wc-blue opacity-50" />;
      case "80": // Kickoff
      case "82": // Start 2nd Half
        return <Activity className="w-5 h-5 text-wc-blue" />;
      case "81": // Halftime
      case "83": // Full Time
        return <Activity className="w-5 h-5 text-white/30" />;
      default:
        return <AlertCircle className="w-5 h-5 opacity-30" />;
    }
  };

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="relative border-l-2 border-white/10 ml-4 md:ml-32 py-8 space-y-12">
          {events.length > 0 ? (
            events.map((event: any, idx: number) => {
              const isHome = event.team?.id === homeTeamId;
              const isAway = event.team?.id === awayTeamId;
              
              return (
                <div key={event.id || idx} className="relative pl-8 md:pl-12">
                  <div className="absolute left-0 -translate-x-full pr-4 md:pr-12 text-right hidden md:block w-32">
                    <span className="text-2xl font-black italic tracking-tighter text-wc-blue">
                      {event.clock?.displayValue || "0'"}
                    </span>
                  </div>

                  <div className="absolute left-0 -translate-x-1/2 w-4 h-4 bg-wc-blue rounded-full border-4 border-wc-dark ring-4 ring-white/5" />

                  <div className={cn(
                    "bg-white/5 rounded-3xl p-6 border border-white/5 hover:bg-white/10 transition-all",
                    isHome && "border-l-4 border-l-wc-blue",
                    isAway && "border-l-4 border-l-wc-red"
                  )}>
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 mt-1">
                        {getEventIcon(event.type?.id)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 md:hidden">
                           <span className="text-sm font-black italic text-wc-blue">{event.clock?.displayValue}</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1">{event.shortText || event.type?.text}</h4>
                        <p className="text-sm text-white/50 leading-relaxed">{event.text}</p>
                        
                        {event.team && (
                          <div className="mt-3 flex items-center gap-2">
                            <img 
                              src={isHome ? summary.boxscore.teams[0].team.logo : summary.boxscore.teams[1].team.logo} 
                              className="w-6 h-4 object-cover rounded-sm shadow-sm border border-white/10" 
                              alt="" 
                            />
                            <span className="text-[10px] font-black uppercase text-white/50">
                              {event.team.displayName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }).reverse()
          ) : (
            <div className="text-center py-20 opacity-50 italic">
              Aucun événement notable enregistré pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LastMatches({ summary }: { summary: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {summary.boxscore.form.map((form: any, idx: number) => (
        <div key={form.team.id} className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8">
          <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-3">
            <img src={summary.boxscore.teams[idx].team.logo} className="w-8 h-6 object-cover rounded-sm shadow-sm border border-white/10" alt="" />
            Derniers Matchs - {summary.boxscore.teams[idx].team.displayName}
          </h3>
          <div className="space-y-4">
            {form.events.slice(0, 5).map((event: any) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0",
                    event.gameResult === "W" ? "bg-wc-green text-black" : 
                    event.gameResult === "L" ? "bg-wc-red text-white" : "bg-white/20 text-white"
                  )}>
                    {event.gameResult}
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={event.opponent.logo} className="w-6 h-4 object-cover rounded-sm shadow-sm border border-white/10" alt="" />
                    <div>
                      <div className="text-[10px] opacity-50 uppercase font-black">{new Date(event.gameDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</div>
                      <div className="font-bold text-sm uppercase">{event.opponent.displayName}</div>
                    </div>
                  </div>
                </div>
                <div className="text-lg font-black italic tracking-tighter">{event.score}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Statistics({ summary }: { summary: any }) {
  const teams = summary.boxscore.teams;
  if (!teams || teams.length < 2) return null;

  const getStat = (teamIdx: number, statName: string) => {
    return teams[teamIdx].statistics.find((s: any) => s.name === statName);
  };

  const statList = [
    { name: "possessionPct", label: "Possession" },
    { name: "totalShots", label: "Tirs" },
    { name: "shotsOnTarget", label: "Tirs Cadrés" },
    { name: "wonCorners", label: "Corners" },
    { name: "offsides", label: "Hors-jeu" },
    { name: "foulsCommitted", label: "Fautes" },
    { name: "yellowCards", label: "Cartons Jaunes" },
    { name: "redCards", label: "Cartons Rouges" },
    { name: "accuratePasses", label: "Passes Précises" },
    { name: "saves", label: "Arrêts" },
  ];

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-6 md:p-12">
      <div className="flex justify-between items-center mb-12">
        <div className="text-center flex-1">
          <img src={teams[0].team.logo} className="w-12 h-12 mx-auto mb-2 object-contain" alt="" />
          <div className="text-[10px] font-black uppercase opacity-50">{teams[0].team.abbreviation}</div>
        </div>
        <div className="flex flex-col items-center px-8">
           <BarChart3 className="w-8 h-8 text-wc-blue opacity-20" />
           <div className="text-[10px] font-black uppercase tracking-widest mt-2">VS</div>
        </div>
        <div className="text-center flex-1">
          <img src={teams[1].team.logo} className="w-12 h-12 mx-auto mb-2 object-contain" alt="" />
          <div className="text-[10px] font-black uppercase opacity-50">{teams[1].team.abbreviation}</div>
        </div>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        {statList.map((stat: any) => {
          const s1 = getStat(0, stat.name);
          const s2 = getStat(1, stat.name);
          if (!s1 || !s2) return null;

          const v1 = parseFloat(s1.displayValue);
          const v2 = parseFloat(s2.displayValue);
          const total = v1 + v2 === 0 ? 1 : v1 + v2;
          const p1 = (v1 / total) * 100;

          return (
            <div key={stat.name} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xl font-black italic">{s1.displayValue}{stat.name === "possessionPct" && "%"}</span>
                <span className="text-[10px] uppercase font-black opacity-50 mb-1">{stat.label}</span>
                <span className="text-xl font-black italic">{s2.displayValue}{stat.name === "possessionPct" && "%"}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-wc-blue transition-all duration-1000" 
                  style={{ width: `${p1}%` }} 
                />
                <div 
                  className="h-full bg-wc-red transition-all duration-1000" 
                  style={{ width: `${100 - p1}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Lineup({ summary }: { summary: any }) {
  const homeRoster = summary.rosters.find((r: any) => r.homeAway === "home")?.roster || [];
  const awayRoster = summary.rosters.find((r: any) => r.homeAway === "away")?.roster || [];

  const homeStarters = homeRoster.filter((p: any) => p.starter);
  const awayStarters = awayRoster.filter((p: any) => p.starter);

  return (
    <div className="space-y-8">
      <div className="relative aspect-[2/3] md:aspect-[3/2] w-full max-w-4xl mx-auto bg-wc-green/20 rounded-[40px] border-4 border-white/20 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_50%,transparent_50%)] bg-[length:10%_100%]" />
        <div className="absolute inset-0 border-2 border-white/10 m-4 rounded-[24px]" />
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/10 rounded-full" />
        
        <div className="absolute inset-y-0 left-0 w-1/2">
           {homeStarters.map((player: any) => (
             <PlayerPin key={player.athlete.id} player={player} side="home" />
           ))}
        </div>

        <div className="absolute inset-y-0 right-0 w-1/2">
           {awayStarters.map((player: any) => (
             <PlayerPin key={player.athlete.id} player={player} side="away" />
           ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-lg font-black uppercase italic mb-4">Remplaçants {summary.boxscore.teams[0].team.displayName}</h3>
          <div className="grid grid-cols-2 gap-2">
            {homeRoster.filter((p: any) => !p.starter).map((p: any) => (
              <div key={p.athlete.id} className="text-xs opacity-70 flex gap-2">
                <span className="font-bold w-4 text-wc-blue">{p.jersey}</span>
                <span>{p.athlete.displayName}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
          <h3 className="text-lg font-black uppercase italic mb-4">Remplaçants {summary.boxscore.teams[1].team.displayName}</h3>
          <div className="grid grid-cols-2 gap-2">
            {awayRoster.filter((p: any) => !p.starter).map((p: any) => (
              <div key={p.athlete.id} className="text-xs opacity-70 flex gap-2">
                <span className="font-bold w-4 text-wc-red">{p.jersey}</span>
                <span>{p.athlete.displayName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerPin({ player, side }: { player: any, side: 'home' | 'away' }) {
  const getPosition = (place: string, side: 'home' | 'away') => {
    const p = parseInt(place);
    let x = 0;
    let y = 0;

    switch(p) {
      case 1: x = 10; y = 50; break; // GK
      case 2: x = 25; y = 20; break; // RB
      case 3: x = 25; y = 40; break; // RCB
      case 4: x = 25; y = 60; break; // LCB
      case 5: x = 25; y = 80; break; // LB
      case 6: x = 45; y = 30; break; // RCM
      case 7: x = 45; y = 50; break; // CDM
      case 8: x = 45; y = 70; break; // LCM
      case 9: x = 75; y = 25; break; // RW
      case 10: x = 75; y = 50; break; // ST
      case 11: x = 75; y = 75; break; // LW
      default: x = 50; y = 50;
    }

    if (side === 'away') {
      x = 100 - x;
    }

    return { left: `${x}%`, top: `${y}%` };
  };

  const pos = getPosition(player.formationPlace, side);

  return (
    <div 
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-20 group"
      style={pos}
    >
      <div className={cn(
        "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white flex items-center justify-center font-black text-[10px] md:text-sm shadow-xl transition-transform group-hover:scale-110",
        side === 'home' ? "bg-wc-blue text-white" : "bg-wc-red text-white"
      )}>
        {player.jersey}
      </div>
      <div className="hidden group-hover:block absolute top-full mt-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold text-white whitespace-nowrap border border-white/10 z-30">
        {player.athlete.displayName}
      </div>
      <div className="text-[8px] md:text-[10px] font-black uppercase text-white/70 text-center leading-tight max-w-[60px] md:max-w-[80px]">
        {player.athlete.shortName}
      </div>
    </div>
  );
}

function TabButton({ id, label, icon, active, onClick }: { id: string, label: string, icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
        active ? "bg-wc-blue text-white shadow-lg shadow-wc-blue/20" : "text-white/50 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
