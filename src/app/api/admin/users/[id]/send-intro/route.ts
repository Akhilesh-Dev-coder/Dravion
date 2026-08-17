import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = user.email;
    const name = user.name;

    // Log the simulated email send to the console
    console.log(`\n========================================`);
    console.log(`📧 SIMULATED INTRO EMAIL SENT`);
    console.log(`To: ${name} <${email}>`);
    console.log(`Subject: Welcome to Dravion - Introduction to Our Services`);
    console.log(`----------------------------------------`);
    console.log(`Dear ${name},`);
    console.log(`Welcome to Dravion SaaS suite! We are pleased to introduce our digital business platform.`);
    console.log(`Dravion is a custom development and software design studio offering premium high-performance web systems, custom cloud applications, and AI integrations.`);
    console.log(`You can manage and customize your free digital visiting card inside your profile space:`);
    console.log(`👉 https://dravion.site/dashboard`);
    console.log(`Best Regards,\nDravion Tech Studio Team`);
    console.log(`========================================\n`);

    return NextResponse.json({ 
      success: true, 
      message: `Introduction email successfully sent to user's registered Gmail: ${email}` 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Send intro email error:", error);
    return NextResponse.json({ error: "Server error during email dispatch simulation" }, { status: 500 });
  }
}
