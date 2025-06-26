import Image from "next/image";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import Reactions from "./reactions";

interface PostProps {
  id: string;
  authorName: string;
  bookName: string;
  coverImage: string | null;
  createdAt: string;
  quote: string;
}

export default function Post(Props: PostProps) {
  return (
    <div className="bg-zinc-800 rounded-lg shadow-lg p-6 w-full justify-start gap-4 mx-auto my-30 items-center flex flex-row">
      <div>
        <Image
          src={Props.coverImage || ""}
          alt={Props.bookName}
          width={200}
          height={200}
          className="mr-4"
        />
      </div>
      <div className="flex flex-col">
        <div>
          <h2 className="text-lg font-semibold">{Props.bookName}</h2>
          <small className="text-purple-500">{Props.authorName}</small>
        </div>
        <div className="mb-4">
          <FaQuoteLeft className="text-gray-400 mr-2" />
          {Props.quote}
          <FaQuoteRight className="text-gray-400 ml-2" />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-purple-500">{Props.createdAt}</p>
        </div>
      </div>
    </div>
  );
}
