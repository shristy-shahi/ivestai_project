import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { userId, priceId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // In a real app, you would look up the user in Supabase to see if they already have a stripe_customer_id
    // For now, we will just create a new checkout session and pass the userId in the metadata

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          // In production, use a real Stripe Price ID from your dashboard
          price: process.env.STRIPE_PRO_PRICE_ID || "price_1Placeholder",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/history?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/pricing?canceled=true`,
      metadata: {
        userId: userId, // We'll read this in the webhook to upgrade the user
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
