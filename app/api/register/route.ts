import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const {
      username,
      email,
      password,
      secretWords,
    } = await req.json();

    if (
      !username ||
      !email ||
      !password ||
      !secretWords
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    const existingUser = db
      .prepare(
        `
        SELECT id
        FROM users
        WHERE email = ?
      `
      )
      .get(email);

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered.",
        },
        { status: 400 }
      );
    }

    const result = db
      .prepare(
        `
        INSERT INTO users
        (
          username,
          email,
          password,
          secret_words,
          points
        )
        VALUES (?, ?, ?, ?, 0)
      `
      )
      .run(
        username,
        email,
        password,
        secretWords.trim()
      );

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully.",
    });

    response.cookies.set(
      "userId",
      String(result.lastInsertRowid),
      {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      }
    );

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed.",
      },
      { status: 500 }
    );
  }
}