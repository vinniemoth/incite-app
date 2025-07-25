"use client";

import Post from "@/components/post";
import { useRouter } from "next/navigation";
import { moduleApi } from "@/api/api";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Keyboard, Mousewheel, FreeMode } from "swiper/modules";
import BackButton from "@/components/backButton";

interface PostData {
  id: string;
  bookName: string;
  bookId: string;
  username: string;
  authorsName: string[];
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

export default function FeedClient() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPostsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedPosts: PostData[] = await moduleApi.fetchPosts();

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
          bookId: post.bookId,
          authorsName: post.authorsName,
          quote: post.quote,
          owner: post.owner,
          ownerId: post.ownerId,
        };
      });

      setPosts(formattedPosts);
    } catch (err: any) {
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
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-900 text-white">
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
          className="mySwiper w-full h-full flex items-center justify-center"
        >
          {posts.map((postData) => (
            <SwiperSlide
              key={postData.id}
              className="w-full h-full flex justify-center items-center p-4"
            >
              <div className="flex items-center mx-auto h-full">
                <Post {...postData} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <BackButton />
    </div>
  );
}
