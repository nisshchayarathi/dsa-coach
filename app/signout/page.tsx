"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })} // redirect to /login after logout
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
}
