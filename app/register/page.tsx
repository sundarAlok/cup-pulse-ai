"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    secretWords: "",
  });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const res = await fetch(
      "/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    alert(data.message);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <input
            placeholder="Username"
            className="w-full rounded-xl border p-3"
            onChange={(e) =>
              setForm({
                ...form,
                username:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            type="email"
            className="w-full rounded-xl border p-3"
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="Password"
            type="password"
            className="w-full rounded-xl border p-3"
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value,
              })
            }
          />

          <input
            placeholder="3 Secret Words"
            className="w-full rounded-xl border p-3"
            onChange={(e) =>
              setForm({
                ...form,
                secretWords:
                  e.target.value,
              })
            }
          />

          <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}