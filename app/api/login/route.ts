import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

type User = {
  id: number;
  password: string;
  secret_words: string;
};

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      password,
      secretWords,
    } = await req.json();

    const user = db
      .prepare(
        `
        SELECT
          id,
          password,
          secret_words
        FROM users
        WHERE email = ?
      `
      )
      .get(email) as User | undefined;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (
      user.password !== password ||
      user.secret_words.trim() !==
        secretWords.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set(
      "userId",
      String(user.id),
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
        message: "Login failed.",
      },
      { status: 500 }
    );
  }
}