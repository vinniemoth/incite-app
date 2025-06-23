// src/app/feed/page.tsx
"use client";

import Post from "@/components/post";
import Reactions from "@/components/reactions"; // Consider where Reactions should truly live
import { FaLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { moduleApi } from "@/api/api";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Keyboard, Mousewheel, FreeMode } from "swiper/modules";

interface FetchedPost {
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

interface PostProps {
  id: string;
  username: string;
  userAvatarUrl: string;
  timeAgo: string;
  coverImageUrl: string | null;
  bookTitle: string;
  authorName: string;
  quoteContent: string;
}

export default function Feed() {
  const router = useRouter();

  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedPosts: FetchedPost[] = await moduleApi.fetchPosts();
      console.log("Posts recebidos da API:", fetchedPosts);

      const formattedPosts: PostProps[] = fetchedPosts.map((post) => {
        const userAvatar =
          post.owner.avatarUrl ||
          `https://ui-avatars.com/api/?name=${post.owner.username}&background=random&color=fff`;

        return {
          id: post.id,
          username: post.owner.username,
          userAvatarUrl: userAvatar,
          timeAgo: formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: ptBR,
          }),
          coverImageUrl: post.coverImage,
          bookTitle: post.bookName,
          authorName: post.authorName,
          quoteContent: post.quote,
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
    <div className="w-screen h-screen flex flex-col items-center justify-start overflow-hidden bg-black text-white">
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
          className="mySwiper w-full h-full"
        >
          {posts.map((postData) => (
            <SwiperSlide
              key={postData.id}
              className="w-full h-full flex justify-center items-center"
            >
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
