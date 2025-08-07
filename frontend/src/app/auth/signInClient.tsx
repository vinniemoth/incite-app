"use client";

import { moduleApi } from "@/api/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa6";

export default function SignInClient() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ username: "", email: "" });
  let hasError = false;
  const hasUserNameError = error.username;
  const hasEmailError = error.email;
  const router = useRouter();

  const toggleMode = () => {
    mode === "login" ? setMode("register") : setMode("login");
  };

  const handleChange = (field: string, value: string) => {
    if (field === "username") {
      setUsername(value);

      if (value.includes(" ")) {
        setError((prev) => ({
          ...prev,
          username: "Username cannot contain spaces.",
        }));
      } else {
        setError((prev) => ({ ...prev, username: "" }));
      }
    }

    if (field === "email") {
      setEmail(value);
      if (!value.includes("@") || !value.includes(".")) {
        setError((prev) => ({ ...prev, email: "Invalid Email" }));
      } else {
        setError((prev) => ({ ...prev, email: "" }));
      }
    }

    if (field === "password") {
      setPassword(value);
    }
  };

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser();
  };

  const register = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser();
  };

  const loginUser = async () => {
    if (!email || !password) {
      toast.error("There are fields missing.");
      return;
    }

    let json = await moduleApi.loginUser(email, password);

    if (json.token) {
      localStorage.setItem("authToken", json.token);
      toast.success("User successfully logged in.");
      router.push("/feed");
    } else {
      toast.error(json.message);
    }
  };

  const createUser = async () => {
    if (!email || !password || !username) {
      toast.error("There are fields missing.");
      return;
    }
    if (hasEmailError) {
      toast.error(error.email);
      hasError = true;
    }
    if (hasUserNameError) {
      toast.error(error.username);
      hasError = true;
    }
    if (hasError) {
      return;
    }
    let json = await moduleApi.createUser(username, email, password);
    if (json) {
      toast.success("User successfully registered.");
    } else {
      toast.error(json.message);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center gap-10">
      <Image src="/incite_logo.png" alt={""} width={150} height={150} />
      <h1 className="font-ultra text-4xl text-center">
        {mode === "login" ? "Welcome back" : "Create account"}
      </h1>
      <div className=" items-center flex flex-col gap-5 w-2/3 p-10 rounded">
        <form
          onSubmit={mode === "login" ? login : register}
          action=""
          className="flex flex-col items-center gap-6 w-full mx-auto"
        >
          {mode === "register" && (
            <div className="relative sm:w-3/4">
              <FaUser className="absolute left-3 top-3" size={15} />
              <input
                className="w-full pl-8 bg-zinc-900 h-10 rounded border-1 border-white mx-auto focus:outline-none focus:bg-zinc-800"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => handleChange("username", e.target.value)}
              />
            </div>
          )}
          <div className="relative sm:w-3/4">
            <FaEnvelope className="absolute left-3 top-3" size={15} />
            <input
              className="w-full pl-8 h-10 bg-zinc-900 rounded border-1 border-white mx-auto focus:outline-none focus:bg-zinc-800"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="relative sm:w-3/4">
            <FaLock className="absolute left-2 top-3" size={15} />
            <input
              className="w-full pl-8 h-10 bg-zinc-900 rounded border-1 border-white focus:outline-none focus:bg-zinc-800"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
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
