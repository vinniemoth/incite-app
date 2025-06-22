"use client";
import { useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa6";
import { moduleApi } from "@/api/api";
import { useRouter } from "next/navigation";

export default function Page() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const toggleMode = () => {
    mode === "login" ? setMode("register") : setMode("login");
  };

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser();
    console.log("Logado!");
  };

  const register = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser();
    console.log("Registrado!");
  };

  const loginUser = async () => {
    if (!email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    let json = await moduleApi.loginUser(email, password);

    if (json.token) {
      localStorage.setItem("authToken", json.token);
      alert(json.message);
      router.push("/feed");
    } else {
      alert(json.message);
    }
  };

  const createUser = async () => {
    let json = await moduleApi.createUser(username, email, password);
    if (!email || !password || !username) {
      alert("Preencha todos os campos");
      return;
    }
    if (json) {
      alert("criação bem sucedida");
    } else {
      alert("Erro ao criar a conta");
    }
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
          {mode === "register" && (
            <div className="relative sm:w-3/4">
              <FaUser className="absolute left-3 top-3" size={15} />
              <input
                className="w-full pl-8 h-10 rounded border-1 border-white mx-auto focus:outline-none"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
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
          <button
            className="p-2 bg-zinc-400 cursor-pointer rounded"
            type="submit"
          >
            {mode === "login" ? "Login" : "Signup"}
          </button>
          <button type="button" onPointerDown={toggleMode}>
            <small className="text-center m-0 p-0 underline cursor-pointer">
              {mode === "login" ? "Signup now!" : "Already have an account?"}
            </small>
          </button>
        </form>
      </div>
    </div>
  );
}
