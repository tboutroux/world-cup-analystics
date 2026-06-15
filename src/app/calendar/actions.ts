"use server";

import { getScoreboardByDate, ScoreboardResponse } from "@/lib/api";

export async function fetchMatchesForDate(dateString: string): Promise<ScoreboardResponse> {
  return await getScoreboardByDate(dateString);
}
