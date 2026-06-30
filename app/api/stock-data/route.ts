import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "Ticker symbol required" }, { status: 400 });
  }

  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${ticker}&apikey=${apiKey}`
    );
    const data = await res.json();

    if (data["Note"] || data["Information"]) {
      // Rate limit hit
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const timeSeries = data["Monthly Time Series"];
    if (!timeSeries) {
      throw new Error("No time series data found");
    }

    // Convert object to array and get last 12 months
    const dates = Object.keys(timeSeries).slice(0, 12).reverse();
    const chartData = dates.map((date) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      price: parseFloat(timeSeries[date]["4. close"]),
      volume: parseInt(timeSeries[date]["5. volume"], 10)
    }));

    return NextResponse.json(chartData);
  } catch (err: any) {
    console.error("Stock data error:", err);
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
