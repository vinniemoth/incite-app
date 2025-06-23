// src/app/home/page.tsx
"use client";
import PostInput from "@/components/postInput";
import { FaMagnifyingGlass, FaCircleArrowDown } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { moduleApi } from "@/api/api";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (search.trim().length < 3) {
      setSuggestedUsers([]);
      setLoadingSuggestions(false);
      setSuggestionError(null);
      return;
    }

    setLoadingSuggestions(true);
    setSuggestionError(null);

    const handler = setTimeout(async () => {
      try {
        const data = await moduleApi.fetchUsers(search);
        setSuggestedUsers(data);
      } catch (error: any) {
        console.error("Erro ao buscar sugestões de usuário:", error);
        setSuggestionError(
          error.message || "Não foi possível buscar sugestões de usuário."
        );
        setSuggestedUsers([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleSelectUser = (username: string) => {
    setSearch(username);
    setSuggestedUsers([]);

    console.log(`Usuário selecionado: ${username}`);
  };

  return (
    <div className="w-screen flex flex-col h-full items-center py-5">
      <div className="relative w-full max-w-md px-4">
        {" "}
        <FaMagnifyingGlass className="absolute top-3 left-6 text-zinc-400" />{" "}
        <input
          className="w-full pl-8 h-10 border border-zinc-600 rounded-lg p-3 bg-zinc-800 text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          type="text"
          placeholder="Search for your friends!"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search.trim().length >= 3 && (
          <div className="absolute top-full left-4 right-4 z-10 bg-zinc-700 border border-zinc-600 rounded-b-lg shadow-lg max-h-60 overflow-y-auto mt-1">
            {loadingSuggestions && (
              <p className="p-3 text-zinc-400">Buscando usuários...</p>
            )}
            {suggestionError && (
              <p className="p-3 text-red-400">{suggestionError}</p>
            )}
            {!loadingSuggestions &&
              suggestedUsers.length === 0 &&
              !suggestionError && (
                <p className="p-3 text-zinc-400">
                  Nenhum usuário encontrado para "{search}".
                </p>
              )}
            {suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-600 border-b border-zinc-600 last:border-b-0"
                onClick={() => handleSelectUser(user.username)}
              >
                <p className="text-white font-semibold text-sm">
                  {user.username}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <PostInput />
      <FaCircleArrowDown
        size={30}
        className="cursor-pointer hover:text-zinc-400"
        onClick={() => router.push("/feed")}
      ></FaCircleArrowDown>
    </div>
  );
}
