"use client";

import { useState, useEffect } from "react";
import { fetchMatchesForDate } from "@/app/calendar/actions";
import { ScoreboardResponse, Event } from "@/lib/api";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  initialDate: string; // YYYYMMDD
  initialData: ScoreboardResponse;
}

export default function CalendarView({ initialDate, initialData }: CalendarViewProps) {
  const [selectedDateStr, setSelectedDateStr] = useState(initialDate);
  const [matches, setMatches] = useState<Event[]>(initialData.events || []);
  const [isLoading, setIsLoading] = useState(false);

  // Generate an array of dates around the current date for the selector
  // From 2026-06-11 (start) to 2026-07-19 (end) - rough dates for WC
  const generateDates = () => {
    const dates = [];
    const startDate = new Date(2026, 5, 11); // June 11, 2026
    const endDate = new Date(2026, 6, 19); // July 19, 2026
    let current = startDate;

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      dates.push({
        dateStr: `${year}${month}${day}`,
        displayDate: current.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }),
        fullDateObj: new Date(current)
      });
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const allDates = generateDates();

  const handleDateSelect = async (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setIsLoading(true);
    try {
      const data = await fetchMatchesForDate(dateStr);
      setMatches(data.events || []);
    } catch (error) {
      console.error("Failed to fetch matches", error);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedDateObj = allDates.find(d => d.dateStr === selectedDateStr);

  return (
    <div className="flex flex-col gap-8">
      {/* Date Selector */}
      <div className="flex items-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 overflow-x-auto custom-scrollbar">
        <div className="flex gap-2 min-w-max px-2">
          {allDates.map((d) => {
            const isSelected = d.dateStr === selectedDateStr;
            return (
              <button
                key={d.dateStr}
                onClick={() => handleDateSelect(d.dateStr)}
                className={cn(
                  "px-4 py-3 rounded-2xl flex flex-col items-center justify-center transition-all min-w-[100px]",
                  isSelected 
                    ? "bg-wc-blue text-white shadow-[0_0_20px_rgba(42,57,141,0.5)] scale-105" 
                    : "bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100"
                )}
              >
                <span className="text-[10px] uppercase font-bold opacity-70">{d.fullDateObj.toLocaleDateString('fr-FR', { weekday: 'long' })}</span>
                <span className="font-black text-lg">{d.fullDateObj.getDate()}</span>
                <span className="text-[10px] uppercase font-bold">{d.fullDateObj.toLocaleDateString('fr-FR', { month: 'short' })}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matches Grid */}
      <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-wc-blue" />
            Matchs du <span className="text-wc-blue">{selectedDateObj?.displayDate}</span>
          </h2>
          {isLoading && <Activity className="w-5 h-5 animate-spin text-wc-blue" />}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48 opacity-50 italic">
            Chargement du calendrier...
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map(match => (
              <div key={match.id} className="bg-black/20 border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-6">
                  <span className={cn(
                    "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
                    match.status.type.state === "in" ? "bg-wc-red text-white animate-pulse" : "bg-white/10 text-white/70"
                  )}>
                    {match.status.type.shortDetail}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-bold">{new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-[10px] opacity-50 uppercase truncate max-w-[150px]">{match.competitions[0].venue?.fullName || "TBD"}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <img 
                      src={match.competitions[0].competitors[0].team.logo} 
                      alt="" 
                      className="w-16 h-16 mx-auto mb-2 object-contain group-hover:scale-110 transition-transform"
                    />
                    <div className="font-black uppercase tracking-tighter truncate">{match.competitions[0].competitors[0].team.shortDisplayName}</div>
                  </div>

                  <div className="px-4 text-center">
                    {match.status.type.state === "pre" ? (
                      <div className="text-3xl font-black italic tracking-tighter opacity-30">VS</div>
                    ) : (
                      <div className="text-4xl md:text-5xl font-black italic tracking-tighter flex items-center gap-2">
                        <span>{match.competitions[0].competitors[0].score}</span>
                        <span className="text-wc-blue opacity-50">-</span>
                        <span>{match.competitions[0].competitors[1].score}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center">
                    <img 
                      src={match.competitions[0].competitors[1].team.logo} 
                      alt="" 
                      className="w-16 h-16 mx-auto mb-2 object-contain group-hover:scale-110 transition-transform"
                    />
                    <div className="font-black uppercase tracking-tighter truncate">{match.competitions[0].competitors[1].team.shortDisplayName}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-48 opacity-50 italic text-center gap-4">
            <CalendarIcon className="w-12 h-12 opacity-20" />
            <p>Aucun match programmé pour cette date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
