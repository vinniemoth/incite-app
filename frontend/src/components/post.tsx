"use client";

import Image from "next/image";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import Reactions from "./reactions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PostProps {
  id: string;
  authorName: string;
  username: string;
  bookName: string;
  bookId: string;
  coverImage: string | null;
  createdAt: string;
  quote: string;
}

export default function Post(Props: PostProps) {
  const router = useRouter();

  return (
    <div className="bg-zinc-800 rounded-lg sm:h-2/3 shadow-lg p-6 w-full mx-auto flex sm:flex-row flex-col items-center justify-center gap-4">
      <div>
        <Image
          onClick={() => router.push(`/book/${Props.bookId}`)}
          src={Props.coverImage || ""}
          alt={"Cover image for " + Props.bookName}
          width={300}
          height={300}
          className="mr-4 cursor-pointer"
        />
      </div>

      <div className="h-full flex flex-col justify-between flex-grow">
        <div className="flex items-center gap-5">
          <Link href={`/user/${Props.username}`}>
            <div className="w-15 h-15 rounded-full bg-zinc-700 flex items-center justify-center text-3xl font-ultra font-bold text-white border-2 border-purple-500 cursor-pointer">
              {Props.username.charAt(0).toUpperCase()}
            </div>
          </Link>
          <h1>{Props.username}</h1>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{Props.bookName}</h2>
          <small className="text-purple-500">{Props.authorName}</small>
          <div className="mb-4">
            <span className="flex items-start">
              <FaQuoteLeft className="text-gray-400 mr-2 flex-shrink-0" />{" "}
              <p className="flex-grow">{Props.quote}</p>{" "}
              <FaQuoteRight className="text-gray-400 ml-2 flex-shrink-0" />
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <small className="text-purple-500">{Props.createdAt}</small>
        </div>
      </div>
    </div>
  );
}
