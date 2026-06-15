"use client";

import { useState } from "react";
import { Star, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Leader {
  value: number;
  athlete: {
    id: string;
    displayName: string;
    team: {
      name: string;
      logos: { href: string }[];
    };
  };
}

interface PlayerStatsProps {
  scorers: Leader[];
  assists: Leader[];
  totalGoals: number;
  totalMatches: number;
}

export default function PlayerStatsTile({ scorers, assists, totalGoals, totalMatches }: PlayerStatsProps) {
  const [activeTab, setActiveTab] = useState<"scorers" | "assists">("scorers");

  const currentLeaders = activeTab === "scorers" ? scorers : assists;
  const activeColor = activeTab === "scorers" ? "text-wc-blue" : "text-wc-red";
  const activeBg = activeTab === "scorers" ? "bg-wc-blue/10" : "bg-wc-red/10";
  const activeBorder = activeTab === "scorers" ? "border-wc-blue/20" : "border-wc-red/20";

  return (
    <div className={cn(
      "col-span-1 md:col-span-4 lg:col-span-3 row-span-1",
      "rounded-3xl backdrop-blur-2xl border transition-all duration-500 p-6 flex flex-col md:flex-row gap-8",
      activeBg,
      activeBorder
    )}>
      {/* Left side: Selector & Global Stats */}
      <div className="flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8 w-full">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className={cn("w-5 h-5", activeColor)} />
            <h3 className="text-lg font-bold italic uppercase tracking-tighter">Performances</h3>
          </div>
          
          <div className="flex p-1 bg-white/5 rounded-2xl gap-1">
            <button 
              onClick={() => setActiveTab("scorers")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                activeTab === "scorers" ? "bg-wc-blue text-white shadow-lg" : "opacity-50 hover:opacity-100"
              )}
            >
              <Star className="w-3 h-3" />
              BUTEURS
            </button>
            <button 
              onClick={() => setActiveTab("assists")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                activeTab === "assists" ? "bg-wc-red text-white shadow-lg" : "opacity-50 hover:opacity-100"
              )}
            >
              <Users className="w-3 h-3" />
              PASSEURS
            </button>
          </div>
        </div>

        <div className="flex w-full mt-8">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={cn("text-3xl font-black italic tracking-tighter", activeColor)}>{totalGoals}</div>
            <div className="text-[10px] opacity-50 uppercase font-bold mt-1">Buts</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={cn("text-3xl font-black italic tracking-tighter", activeColor)}>{totalMatches}</div>
            <div className="text-[10px] opacity-50 uppercase font-bold mt-1">Matchs</div>
          </div>
        </div>
      </div>

      {/* Right side: Leaders List */}
      <div className="flex-[1.5] space-y-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">
            Top {activeTab === "scorers" ? "Buteurs" : "Passeurs"}
          </span>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5", activeColor)}>
            {activeTab === "scorers" ? "Buts" : "Assists"}
          </span>
        </div>
        
        {currentLeaders.length > 0 ? currentLeaders.map((leader, idx) => (
          <div key={leader.athlete.id} className="group flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black opacity-20 w-4 group-hover:opacity-100 transition-opacity">{idx + 1}</span>
              <img src={leader.athlete.team.logos[0].href} className="w-6 h-6 object-contain" alt="" />
              <div>
                <div className="font-bold text-sm leading-none">{leader.athlete.displayName}</div>
                <div className="text-[10px] opacity-50 uppercase mt-1">{leader.athlete.team.name}</div>
              </div>
            </div>
            <div className={cn("text-xl font-black italic tracking-tighter", activeColor)}>
              {leader.value}
            </div>
          </div>
        )) : (
          <div className="flex items-center justify-center h-full py-8 opacity-30 italic text-sm">
            Données indisponibles
          </div>
        )}
      </div>
    </div>
  );
}
