"use client";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa6";

export default function Page() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleMode = () => {
    mode === "login" ? setMode("register") : setMode("login");
  };

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Logado!");
  };

  const register = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Registrado!");
  };

  return (
    <div className="flex items-center h-screen justify-center">
      <div className="bg-zinc-800 items-center flex flex-col m-20 gap-5 w-2/3 p-5 rounded">
        <h1 className="font-ultra text-2xl text-center">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <form
          onSubmit={mode === "login" ? login : register}
          action=""
          className="flex flex-col items-center gap-6 w-full mx-auto"
        >
          <div className="relative sm:w-3/4">
            <FaEnvelope className="absolute left-3 top-3" size={15} />
            <input
              className="w-full pl-8 h-10 rounded border-1 border-white mx-auto focus:outline-none"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative sm:w-3/4">
            <FaLock className="absolute left-2 top-3" size={15} />
            <input
              className="w-full pl-8 h-10 rounded border-1 border-white focus:outline-none"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="p-2 bg-zinc-400 cursor-pointer rounded">
            {mode === "login" ? "Login" : "Signup"}
          </button>
          <button onPointerDown={toggleMode}>
            <small className="text-center m-0 p-0 underline cursor-pointer">
              {mode === "login" ? "Signup now!" : "Already have an account?"}
            </small>
          </button>
        </form>
      </div>
    </div>
  );
}
