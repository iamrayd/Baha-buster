import { useState } from "react";
import { RiskLevel } from "@/src/types/global";

export function useFloodFilter() {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  return { riskFilter, setRiskFilter };
}