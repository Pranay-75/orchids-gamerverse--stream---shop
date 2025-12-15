import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  xpReward: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items, totalXP } = await req.json() as { items: CartItem[]; totalXP: number };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const amount = Math.round(
      items.reduce((sum, item) => sum + item.price * item.quantity * 100, 0)
    );

    if (amount < 50) {
      return NextResponse.json(
        { error: "Amount must be at least $0.50" },
        { status: 400 }
      );
    }

    const lineItems = items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        totalXP: totalXP.toString(),
        items: JSON.stringify(lineItems),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
