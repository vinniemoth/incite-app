"use client";

import { moduleApi } from "@/api/api";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { FaCircleArrowDown } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Mousewheel } from "swiper/modules";
import Post from "@/components/post";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Reactions from "@/components/reactions";
import Link from "next/link";
import BackButton from "@/components/backButton";
import FollowComponent from "@/components/followComponent";

interface PostData {
  id: string;
  authorsName: string[];
  username: string;
  bookName: string;
  bookId: string;
  coverImage: string;
  createdAt: string;
  quote: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  posts: PostData[];
}

export default function UserProfile() {
  const params = useParams();
  const usernameFromUrl = params.username as string;

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const uniqueBookCovers: PostData[] = [];
  const seenBookNames = new Set<string>();

  const fetchUserData = useCallback(async () => {
    if (!usernameFromUrl) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedData = await moduleApi.fetchUser(usernameFromUrl);
      setUserData(fetchedData);
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Failed to load user profile.");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [usernameFromUrl]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500 text-lg">
        <p>Error: {error}</p>
        <p className="text-zinc-400 text-sm mt-2">Please try again later.</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-zinc-400 text-lg">
        <p>User '{usernameFromUrl}' not found.</p>
        <p className="text-zinc-500 text-sm mt-2">
          The username you are looking for does not exist.
        </p>
      </div>
    );
  }

  userData.posts.forEach((post) => {
    if (!seenBookNames.has(post.bookName)) {
      uniqueBookCovers.push(post);
      seenBookNames.add(post.bookName);
    }
  });
  return (
    <div className="flex flex-col items-center  min-h-screen bg-zinc-900 text-white">
      <div className="flex justify-center items-center w-full h-screen">
        <Swiper
          direction={"vertical"}
          slidesPerView={1}
          spaceBetween={0}
          mousewheel={true}
          keyboard={{ enabled: true }}
          modules={[Keyboard, Mousewheel, FreeMode]}
          className="mySwiper w-full h-full flex items-center justify-center"
        >
          <SwiperSlide key="user-profile-header flex flex-col justify-center align-center">
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="flex flex-col items-center">
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center text-3xl font-bold text-white border-2 border-purple-500">
                    {userData.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="text-center mb-8">
                  <h1 className="text-5xl font-extrabold text-purple-400 break-words max-w-xs sm:max-w-md mx-auto">
                    {userData.username}
                  </h1>
                  <FollowComponent userId={userData.id} />
                </div>
              </div>
              <div className="flex flex-col gap-4 items-center font-ultra">
                <h2 className="text-3xl text-purple-300">Recently Quoted</h2>
                {uniqueBookCovers.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-6 p-2 max-w-xl mx-auto">
                    {uniqueBookCovers.slice(0, 4).map((post) => (
                      <div
                        key={post.id}
                        className="relative group flex flex-row "
                      >
                        {post.coverImage && (
                          <Link href={`/book/${post.bookId}`} key={post.id}>
                            <Image
                              src={post.coverImage}
                              alt={`Cover image for ${post.bookName}`}
                              width={60}
                              height={60}
                              sizes="(max-width: 414px) 200px, (max-width: 1100px) 120px, 120px"
                              className="w-full h-auto rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer border border-zinc-700"
                            />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-lg">
                    This user hasn't shared any book quotes yet.
                  </p>
                )}
                {userData.posts.length > 0 && (
                  <FaCircleArrowDown
                    size={30}
                    className="cursor-pointer hover:text-zinc-400 mt-4 animate-bounce"
                  />
                )}
              </div>
            </div>
          </SwiperSlide>

          {userData.posts.length > 0
            ? userData.posts.map((postData) => (
                <SwiperSlide
                  key={postData.id}
                  className="w-full h-full flex justify-center items-center"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="sm:w-2/3 h-full flex justify-center items-center p-5">
                      <Post
                        id={postData.id}
                        username={userData.username}
                        createdAt={formatDistanceToNow(postData.createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                        coverImage={postData.coverImage}
                        bookName={postData.bookName}
                        bookId={postData.bookId}
                        authorsName={postData.authorsName}
                        quote={postData.quote}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))
            : null}
        </Swiper>
      </div>
      <BackButton></BackButton>
    </div>
  );
}
