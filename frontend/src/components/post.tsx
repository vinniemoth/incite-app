import Image from "next/image";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import Reactions from "./reactions";

interface PostProps {
  id: string;
  username: string;
  timeAgo: string;
  coverImageUrl: string | null;
  bookTitle: string;
  authorName: string;
  quoteContent: string;
  userAvatarUrl: string;
}

export default function Post(Props: PostProps) {
  return (
    <div className="h-full w-screen items-center justify-around">
      <div className="flex w-full items-center flex-col p-3">
        <Image
          className="border-2 flex border-red-400 rounded-xl"
          src={Props.userAvatarUrl}
          width={50}
          height={50}
          alt=""
        />
        <p>{Props.username}</p>
        <small>{Props.timeAgo}</small>
      </div>
      <div className="flex flex-col items-center p-3 sm:h-full">
        <div className="sm:w-3/4 sm:h-3/4 sm:flex-row flex-col items-center rounded-lg flex p-5 gap-5 w-full bg-zinc-800">
          {Props.coverImageUrl && (
            <Image
              className="rounded-lg sm:w-130"
              src={Props.coverImageUrl}
              width={200}
              height={200}
              quality={100}
              alt=""
            />
          )}
          <div className=" relative not-[]:flex flex-col w-full gap-2">
            <FaQuoteLeft
              className="absolute -top-10 -left-5"
              size={80}
              opacity={0.1}
            ></FaQuoteLeft>
            <h1 className="text-lg font-ultra">{Props.bookTitle}</h1>
            <small>{Props.authorName}</small>
            <div className="py-1">
              <h1 className="text-2xl">{Props.quoteContent}</h1>
            </div>
            <FaQuoteRight
              className="absolute -bottom-5 -right-5"
              size={80}
              opacity={0.1}
            ></FaQuoteRight>
          </div>
        </div>
      </div>
      <Reactions></Reactions>
    </div>
  );
}
