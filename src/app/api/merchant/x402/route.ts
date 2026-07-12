import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await getServerSupabase();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the merchant's X402 payments
    const { data: payments, error } = await supabase
      .from("x402_payments")
      .select("*")
      .eq("merchant_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching x402 payments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(payments || []);
  } catch (error: any) {
    console.error("X402 History error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
