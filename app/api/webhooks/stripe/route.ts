import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 });
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_placeholder"
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          // Upgrade user to pro
          await supabase.from("users").update({
            tier: "pro",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          }).eq("id", userId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        // Downgrade user if subscription is canceled
        await supabase.from("users").update({
          tier: "free"
        }).eq("stripe_subscription_id", subscription.id);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing failed:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
