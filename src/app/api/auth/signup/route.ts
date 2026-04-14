// // app/api/auth/signup/route.ts
// import { corsHeaders } from "@/lib/cors";
// import prisma from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";


// //  Handle preflight requests (browser sends this automatically)
// export async function OPTIONS() {
//   return NextResponse.json({}, { status: 200, headers: corsHeaders });
// }

// // Main Signup Route
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { username, email, phoneNumber,password } = body;

//     // --- Validation ---
//     if (!phoneNumber || phoneNumber.trim().length === 0) {
//       return NextResponse.json(
//         { success: false, message: "Phone number is required" },
//         { status: 400, headers: corsHeaders }
//       );
//     }
//     if (!username || username.trim().length === 0) {
//       return NextResponse.json(
//         { success: false, message: "Username is required" },
//         { status: 400, headers: corsHeaders }
//       );
//     }
//      if (!password || password.trim().length === 0) {
//       return NextResponse.json(
//         { success: false, message: "Password is required" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // --- Check if user exists ---
//     const existingUser = await prisma.user.findUnique({
//       where: { phoneNumber },
//     });

//     if (existingUser) {
//       return NextResponse.json(
//         { success: false, message: "User already exists" },
//         { status: 409, headers: corsHeaders }
//       );
//     }



//     // --- Create user ---
//     const newUser = await prisma.user.create({
//       data: {
//         username,
//         email,
//         phoneNumber,
//         password,
//         details: {
//           create: {
//             codeWord:"help", // default code word
//             message: "HELP!!! I am in danger.", // default message
//           },
//         },
//       },
//       omit:{password}
//     });

//     return NextResponse.json(
//       { success: true, message: "User registered successfully", user: newUser },
//       { status: 201, headers: corsHeaders }
//     );
//   } catch (error: any) {
//     console.error("Error in signup:", error);
//     return NextResponse.json(
//       { success: false, message: "Error creating user", error: error.message },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// app/api/auth/signup/route.ts
import { corsHeaders } from "@/lib/cors";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

//  Handle preflight requests (browser sends this automatically)
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

// Main Signup Route
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, phoneNumber, password } = body;

    // --- Validation ---
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!password || password.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // --- Check if user exists ---
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409, headers: corsHeaders }
      );
    }

    // HASH PASSWORD (IMPORTANT CHANGE)
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Create user ---
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        phoneNumber,
        password: hashedPassword, // store hashed password
        details: {
          create: {
            codeWord: "help",
            message: "HELP!!! I am in danger.",
          },
        },
      },
      omit: { password: true }, // hides password from response
    });

    return NextResponse.json(
      { success: true, message: "User registered successfully", user: newUser },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error in signup:", error);
    return NextResponse.json(
      { success: false, message: "Error creating user", error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}