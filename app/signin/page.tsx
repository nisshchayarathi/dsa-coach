"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignin = async () => {
    // Use NextAuth credentials provider
    const result = await signIn("credentials", {
      redirect: false, // prevent automatic redirect
      username,
      password,
    });

    if (result?.error) {
      // Wrong credentials
      alert("Signin failed. Please check your credentials.");
    } else {
      // Success → redirect manually
      router.push("/chats");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <h2>Sign In</h2>
      <input
        style={{ padding: 10, margin: 10, border: "1px solid white" }}
        placeholder="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={{ padding: 10, margin: 10, border: "1px solid white" }}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignin}
        style={{ padding: 10, margin: 10, border: "1px solid white" }}
      >
        Sign in
      </button>
      <p>
        Don't have an account?{" "}
        <a href="/signup" style={{ color: "blue", cursor: "pointer" }}>
          Sign up
        </a>
      </p>
    </div>
  );
}
