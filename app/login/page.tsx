"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    secretWords,
    setSecretWords,
  ] = useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const res = await fetch(
      "/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          secretWords,
        }),
      }
    );

    const data = await res.json();

    alert(data.message);

    if (data.success) {
      window.location.href =
        "/dashboard";
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="mt-6 space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border p-3"
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border p-3"
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <input
            placeholder="3 Secret Words"
            className="w-full rounded-xl border p-3"
            onChange={(e) =>
              setSecretWords(
                e.target.value
              )
            }
          />

          <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}