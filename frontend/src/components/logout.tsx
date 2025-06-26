"use client;";
import { moduleApi } from "@/api/api";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function Logout() {
  const router = useRouter();

  const logout = async () => {
    const response = await moduleApi.logout();
    console.log(response);

    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="absolute top-5 right-5" onClick={logout}>
      <FaSignOutAlt
        size={40}
        className="cursor-pointer bg-zinc-800 p-2 rounded hover:bg-zinc-700 hover:ring-2 hover:ring-purple-500"
      />
    </div>
  );
}
