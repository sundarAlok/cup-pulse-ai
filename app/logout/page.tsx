"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    fetch("/api/logout", {
      method: "POST",
    }).then(() => {
      window.location.href = "/";
    });
  }, []);

  return (
    <div className="flex justify-center py-20">
      <h1 className="text-2xl font-bold">
        Logging out...
      </h1>
    </div>
  );
}