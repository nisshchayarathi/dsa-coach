"use client";

import axios from "axios";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
        name,
        username,
        password,
      });

      if (res.data.userId) {
        alert("Signup successful! Please sign in.");
        router.push("/signin");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Email might already exist.");
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
      <h2>Sign Up</h2>
      <input
        style={{ padding: 10, margin: 10, width: 300 ,border: "1px solid white"}}
        placeholder="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        style={{ padding: 10, margin: 10, width: 300,border: "1px solid white" }}
        placeholder="Email"
        type="email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        style={{ padding: 10, margin: 10, width: 300,border: "1px solid white" }}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        style={{ padding: 10, margin: 10,border: "1px solid white" }}
      >
        Sign Up
      </button>
      <p>
        Already have an account?{" "}
        <a href="/signin" style={{ color: "blue", cursor: "pointer" }}>
          Sign in
        </a>
      </p>
    </div>
  );
}
