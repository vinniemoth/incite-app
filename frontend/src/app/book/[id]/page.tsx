"use client";

import { moduleApi } from "@/api/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Keyboard, Mousewheel, FreeMode, Pagination } from "swiper/modules";
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
    console.log(postResponse);
    return postResponse;
  };

  useEffect(() => {
    fetchBookInfo();
    fetchPostsByBookId();
  }, [id]);

  if (!book || !book.volumeInfo) {
    return (
      <div className="text-zinc-500 text-center py-10">
        Carregando detalhes do livro...
      </div>
    );
  }

  if (!book || !book.volumeInfo) {
    return (
      <div className="text-zinc-500 text-center py-10">
        Carregando detalhes do livro...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-zinc-900 text-white">
      <div className="w-full h-screen flex justify-center items-center">
        <Swiper
          direction={"vertical"}
          slidesPerView={1}
          spaceBetween={0}
          mousewheel={true}
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          modules={[Keyboard, Mousewheel, FreeMode, Pagination]}
          className="mySwiperVertical w-full h-full"
        >
          <SwiperSlide className="flex items-center justify-center p-4">
            <div className="w-full h-full max-w-6xl mx-auto bg-zinc-800 rounded-2xl shadow-xl flex items-center justify-center p-4">
              <Swiper
                direction={"horizontal"}
                slidesPerView={1}
                spaceBetween={0}
                mousewheel={true}
                keyboard={{ enabled: true }}
                pagination={{ clickable: true }}
                modules={[Keyboard, Mousewheel, FreeMode, Pagination]}
                className="mySwiperHorizontal w-full h-full"
              >
                <SwiperSlide className="flex items-center justify-center p-4">
                  <div className="flex flex-col items-center gap-6 text-center justify-center">
                    {book.volumeInfo.imageLinks?.large ||
                    book.volumeInfo.imageLinks?.medium ? (
                      <Image
                        src={
                          book.volumeInfo.imageLinks.large ||
                          book.volumeInfo.imageLinks.medium!
                        }
                        alt={`Capa do livro ${book.volumeInfo.title}`}
                        width={300}
                        height={450}
                        className="rounded-lg shadow-2xl border-4 border-purple-500 object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-[300px] h-[450px] bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-400 text-center text-lg p-6">
                        Capa
                        <br />
                        Não
                        <br />
                        Disponível
                      </div>
                    )}
                    <h2 className="font-extrabold text-2xl text-purple-400 mt-4">
                      {book.volumeInfo.title}
                    </h2>
                    <p className="font-ultra text-lg text-zinc-300">
                      {Array.isArray(book.volumeInfo.authors)
                        ? book.volumeInfo.authors.join(", ")
                        : book.volumeInfo.authors || "Autor Desconhecido"}
                    </p>
                  </div>
                </SwiperSlide>

                <SwiperSlide className="flex items-center justify-center p-4">
                  <div className="flex flex-col text-center lg:text-left items-center lg:items-start max-w-3xl mx-auto">
                    <h1 className="font-extrabold text-4xl lg:text-5xl text-purple-400 mb-2 leading-tight">
                      {book.volumeInfo.title}
                    </h1>
                    <h2 className="font-ultra text-xl lg:text-2xl text-zinc-300 mb-4">
                      {Array.isArray(book.volumeInfo.authors)
                        ? book.volumeInfo.authors.join(", ")
                        : book.volumeInfo.authors || "Autor Desconhecido"}
                    </h2>
                    <p
                      className="text-base sm:text-lg lg:text-xl text-zinc-300 leading-relaxed
                                  overflow-y-auto custom-scrollbar break-words
                                 p-4 bg-zinc-700 rounded-lg shadow-inner"
                      dangerouslySetInnerHTML={{
                        __html:
                          book.volumeInfo.description ||
                          "Nenhuma descrição disponível para este livro.",
                      }}
                    ></p>
                    {book.volumeInfo.publishedDate && (
                      <p className="text-zinc-400 text-sm sm:text-base mt-4">
                        Publicado:{" "}
                        {format(
                          new Date(book.volumeInfo.publishedDate),
                          "dd/MM/yyyy",
                          { locale: ptBR }
                        )}
                      </p>
                    )}
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </SwiperSlide>

          {posts && posts.length > 0 ? (
            posts.map((postData) => (
              <SwiperSlide
                key={postData.id}
                className="flex justify-center items-center p-4 "
              >
                <div className="flex items-center mx-auto h-full">
                  <Post
                    id={postData.id}
                    username={
                      postData.owner?.username ?? "Usuário Desconhecido"
                    }
                    createdAt={formatDistanceToNow(
                      new Date(postData.createdAt),
                      {
                        addSuffix: true,
                        locale: ptBR,
                      }
                    )}
                    coverImage={postData.coverImage}
                    bookName={postData.bookName}
                    bookId={postData.bookId}
                    authorName={postData.authorName}
                    quote={postData.quote}
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className="flex justify-center items-center">
              <p className="text-zinc-500 text-lg text-center p-4">
                Nenhuma citação encontrada para este livro ainda.
              </p>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
}
