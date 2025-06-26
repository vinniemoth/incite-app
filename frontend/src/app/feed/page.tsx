// src/app/feed/page.tsx
"use client";

import Post from "@/components/post";
import { FaLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { moduleApi } from "@/api/api";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Keyboard, Mousewheel, FreeMode } from "swiper/modules";

interface PostData {
  id: string;
  bookName: string;
  authorName: string;
  coverImage: string | null;
  createdAt: string;
  quote: string;
  owner: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  ownerId: string;
}

export default function Feed() {
  const router = useRouter();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedPosts: PostData[] = await moduleApi.fetchPosts();
      console.log("Posts recebidos da API:", fetchedPosts);

      const formattedPosts = fetchedPosts.map((post) => {
        return {
          id: post.id,
          username: post.owner.username,
          createdAt: formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: ptBR,
          }),
          coverImage: post.coverImage,
          bookName: post.bookName,
          authorName: post.authorName,
          quote: post.quote,
          owner: post.owner,
          ownerId: post.ownerId,
        };
      });

      setPosts(formattedPosts);
    } catch (err: any) {
      console.error("Erro ao buscar posts:", err);
      setError(
        "Não foi possível carregar as citações. Por favor, tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {" "}
      {loading && <p className="text-lg mt-8">Carregando citações...</p>}
      {error && <p className="text-red-400 text-lg mt-8">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="text-zinc-400 text-lg mt-8">
          Nenhuma citação para exibir. Que tal postar a primeira?
        </p>
      )}
      {!loading && !error && posts.length > 0 && (
        <Swiper
          direction={"vertical"}
          slidesPerView={1}
          spaceBetween={0}
          mousewheel={true}
          keyboard={{ enabled: true }}
          modules={[Keyboard, Mousewheel, FreeMode]}
          className="mySwiper w-2/3 h-full"
        >
          {posts.map((postData) => (
            <SwiperSlide
              key={postData.id}
              className="w-full h-full flex justify-center items-center"
            >
              <div className="flex flex-col items-center justify-center gap-4 p-4">
                <div
                  onClick={() =>
                    router.push(`/user/${postData.owner.username}`)
                  }
                  className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center text-3xl font-bold text-white border-2 border-purple-500 cursor-pointer"
                >
                  {postData.owner.username.charAt(0).toUpperCase()}
                </div>
                <p className="text-xl">{postData.owner.username}</p>
              </div>
              <Post {...postData} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <FaLeftLong
        onClick={() => router.push("/home")}
        size={50}
        className="absolute top-5 left-5 bg-zinc-800 p-3 rounded-xl cursor-pointer hover:bg-zinc-700 z-50"
      ></FaLeftLong>
    </div>
  );
}
