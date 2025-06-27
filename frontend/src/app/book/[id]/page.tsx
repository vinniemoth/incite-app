"use client";

import { moduleApi } from "@/api/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Keyboard, Mousewheel, FreeMode } from "swiper/modules";
import Post from "@/components/post";

interface BookInfo {
  id: string;
  volumeInfo: {
    title: string;
    authors: [];
    publisher: string;
    publishedDate: string;
    description: string;
    imageLinks: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
  };
}

interface Post {
  id: string;
  username: string;
  quote: string;
  authorName: string;
  bookName: string;
  bookId: string;
  coverImage: string;
  createdAt: string;
  owner: {
    id: string;
    username: string;
  };
}

export default function BookPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [book, setBook] = useState<BookInfo | null>(null);
  const [posts, setPosts] = useState<Post[] | null>([]);

  const fetchBookInfo = async () => {
    try {
      const data = await moduleApi.fetchBookInfo(id);
      setBook(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPostsByBookId = async () => {
    const postResponse = await moduleApi.fetchPostsByBookId(id);
    setPosts(postResponse);
    return postResponse;
  };

  useEffect(() => {
    fetchBookInfo();
    fetchPostsByBookId();
  }, [id]);

  if (book && book.volumeInfo.imageLinks.medium && posts) {
    // const dateObject = parseISO(book?.volumeInfo.publishedDate);
    // const formattedDate = format(dateObject, "dd/MM/yyyy", { locale: ptBR });

    return (
      <div className="flex flex-col items-center w-full min-h-screen bg-zinc-900 text-white">
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
            <SwiperSlide key="user-profile-header slide">
              <div className="flex flex-col h-full justify-center items-center gap-3">
                <Image
                  src={book.volumeInfo.imageLinks.medium}
                  alt={book.volumeInfo.title}
                  height={160}
                  width={160}
                ></Image>
                <h1 className="font-ultra">{book.volumeInfo.title}</h1>
                <h1 className="font-ultra text-purple-400">
                  {book.volumeInfo.authors}
                </h1>
                <p className="w-2/3 text-center">
                  {book.volumeInfo.description}
                </p>
              </div>
            </SwiperSlide>
            {posts
              ? posts.map((postData) => (
                  <SwiperSlide
                    key={postData.id}
                    className="w-full h-full flex justify-center items-center"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="sm:w-2/3 h-full flex justify-center items-center p-5">
                        <Post
                          username={postData.owner.username}
                          id={postData.id}
                          createdAt={formatDistanceToNow(postData.createdAt, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                          coverImage={postData.coverImage}
                          bookName={postData.bookName}
                          bookId={postData.bookId}
                          authorName={postData.authorName}
                          quote={postData.quote}
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              : null}
          </Swiper>
        </div>
      </div>
    );
  }
}
