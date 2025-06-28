"use client";

import Image from "next/image";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import Reactions from "./reactions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PostProps {
  id: string;
  authorsName: string[];
  username: string;
  bookName: string;
  bookId: string;
  coverImage: string | null;
  createdAt: string;
  quote: string;
}

export default function Post(Props: PostProps) {
  const displayAuthors = Props.authorsName.join(", ");

  const router = useRouter();

  return (
    <div className="w-full max-w-2xl mx-auto bg-zinc-800 rounded-2xl shadow-xl flex flex-col sm:flex-row items-stretch p-6 sm:p-8">
      <div className="flex-shrink-0 flex justify-center items-center mb-6 sm:mb-0 sm:mr-8">
        <Image
          onClick={() => router.push(`/book/${Props.bookId}`)}
          src={Props.coverImage || "/path/to/placeholder-cover.jpg"}
          alt={`Capa do livro ${Props.bookName}`}
          width={180}
          height={270}
          className="rounded-lg shadow-md border-2 border-zinc-700 object-cover cursor-pointer hover:border-purple-500 transition-colors duration-200"
          priority
        />
      </div>

      <div className="flex-grow flex flex-col justify-between text-center sm:text-left">
        <div>
          <div className="flex items-center gap-4 mb-4 justify-center sm:justify-start">
            <Link href={`/user/${Props.username}`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-xl font-bold text-white border-2 border-purple-500 cursor-pointer hover:bg-purple-600 transition-colors duration-200">
                {Props.username.slice(0, 2).toUpperCase()}
              </div>
            </Link>
            <Link href={`/user/${Props.username}`}>
              <h1 className="text-2xl font-semibold text-purple-400 cursor-pointer hover:underline">
                {Props.username}
              </h1>
            </Link>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-zinc-100">
              {Props.bookName}
            </h2>
            <p className="text-md text-purple-400">{displayAuthors}</p>
          </div>

          <div className="mb-4 text-zinc-300">
            <span className="flex items-start text-lg italic leading-relaxed">
              <FaQuoteLeft className="text-gray-500 text-base sm:text-lg mr-2 mt-1 flex-shrink-0" />
              <p className="flex-grow break-words overflow-hidden">
                {Props.quote}
              </p>
              <FaQuoteRight className="text-gray-500 text-base sm:text-lg ml-2 mt-1 flex-shrink-0" />
            </span>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end mt-4">
          <small className="text-zinc-500 text-sm">{Props.createdAt}</small>
        </div>
      </div>
    </div>
  );
}
