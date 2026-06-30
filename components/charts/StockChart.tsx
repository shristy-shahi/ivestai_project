"use client";
import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface StockChartProps {
  ticker: string;
}

export default function StockChart({ ticker }: StockChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ticker) return;
    let mounted = true;

    const fetchStock = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stock-data?ticker=${ticker}`);
        const result = await res.json();
        
        if (!mounted) return;
        
        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch stock data");
        }
        
        setData(result);
      } catch (err: any) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStock();
    return () => { mounted = false; };
  }, [ticker]);

  if (loading) {
    return (
      <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
        <div style={{ color: "#6b7280", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ animation: "blink 1.5s infinite" }}>Loading market data...</span>
        </div>
      </div>
    );
  }

  if (error || data.length === 0) {
    // If Alpha Vantage rate limits us, show a graceful fallback mock chart
    return <MockChart ticker={ticker} />;
  }

  // Calculate min/max for better Y-axis scaling
  const prices = data.map(d => d.price);
  const min = Math.min(...prices) * 0.95;
  const max = Math.max(...prices) * 1.05;

  return (
    <div style={{ height: 260, width: "100%", padding: "12px 0 0" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00d1b2" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00d1b2" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} dy={8} />
          <YAxis domain={[min, max]} stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toFixed(0)}`} dx={-4} />
          <Tooltip 
            contentStyle={{ background: "#1a1a26", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, color: "#fff" }}
            itemStyle={{ color: "#00d1b2", fontWeight: "bold" }}
            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Price"]}
          />
          <Area type="monotone" dataKey="price" stroke="#00d1b2" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Fallback chart if API limit hit
function MockChart({ ticker }: { ticker: string }) {
  const mockData = [
    { date: "Jan", price: 120 }, { date: "Feb", price: 125 },
    { date: "Mar", price: 132 }, { date: "Apr", price: 128 },
    { date: "May", price: 140 }, { date: "Jun", price: 155 },
  ];
  return (
    <div style={{ height: 260, width: "100%", padding: "12px 0 0", position: "relative" }}>
      <div style={{ position: "absolute", top: -10, right: 10, fontSize: 10, color: "#6b7280", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 4 }}>
        Simulated Data (API Limit Hit)
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData}>
          <defs>
            <linearGradient id="colorMock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#6b7280" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
          <Area type="monotone" dataKey="price" stroke="#6b7280" strokeWidth={2} fillOpacity={1} fill="url(#colorMock)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
