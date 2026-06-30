"use client";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import type { FinancialData, RiskData } from "@/lib/types";

const CARD: React.CSSProperties = {
  background:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(255,255,255,0.08)",
  borderRadius:16, padding:24,
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#1f2937", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"10px 14px" }}>
      <div style={{ color:"#9ca3af", fontSize:12, marginBottom:4 }}>{label}</div>
      <div style={{ color:"#f9fafb", fontSize:15, fontWeight:700 }}>${payload[0].value}B</div>
    </div>
  );
};

export function RevenueChart({ data }: { data: FinancialData }) {
  return (
    <div style={CARD}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>Revenue ($B)</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:10, marginTop:6 }}>
          <span style={{ fontSize:28, fontWeight:800, color:"#f9fafb" }}>${data.revenue.toFixed(1)}B</span>
          <span style={{ fontSize:14, fontWeight:700, color: data.revenueGrowth>=0?"#06d6a0":"#ef476f" }}>
            {data.revenueGrowth>=0?"▲":"▼"} {Math.abs(data.revenueGrowth)}%
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <AreaChart data={data.revenueHistory}>
          <defs>
            <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ff6b35" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fontSize:11, fill:"#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke="#ff6b35" strokeWidth={2.5} fill="url(#revG)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProfitChart({ data }: { data: FinancialData }) {
  return (
    <div style={CARD}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>Net Income ($B)</div>
        <div style={{ display:"flex", alignItems:"baseline", gap:10, marginTop:6 }}>
          <span style={{ fontSize:28, fontWeight:800, color:"#f9fafb" }}>${data.netIncome.toFixed(1)}B</span>
          <span style={{ fontSize:14, fontWeight:600, color:"#00d1b2" }}>{data.operatingMargin.toFixed(1)}% margin</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <AreaChart data={data.profitHistory}>
          <defs>
            <linearGradient id="profG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#00d1b2" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#00d1b2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fontSize:11, fill:"#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="value" stroke="#00d1b2" strokeWidth={2.5} fill="url(#profG)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskRadar({ data }: { data: RiskData }) {
  const riskColor = data.overall==="Low"?"#06d6a0":data.overall==="Medium"?"#ffd166":"#ef476f";
  const radarData = Object.entries(data.scores).map(([k,v])=>({
    subject: k.charAt(0).toUpperCase()+k.slice(1), value: v,
  }));
  return (
    <div style={CARD}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:11, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>Risk Radar</div>
          <div style={{ fontSize:22, fontWeight:800, color:riskColor, marginTop:4 }}>{data.overall} Risk</div>
        </div>
        <div style={{ fontSize:40 }}>{data.overall==="Low"?"🟢":data.overall==="Medium"?"🟡":"🔴"}</div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize:11, fill:"#6b7280" }} />
          <Radar name="Risk" dataKey="value" stroke={riskColor} fill={riskColor} fillOpacity={0.2} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
