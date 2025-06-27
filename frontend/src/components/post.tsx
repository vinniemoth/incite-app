import Image from "next/image";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
import Reactions from "./reactions";
import { useRouter } from "next/navigation";

interface PostProps {
  id: string;
  authorName: string;
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
          width={350}
          height={350}
          className="mr-4 cursor-pointer"
        />
      </div>

      <div className="flex flex-col justify-center flex-grow">
        <div>
          <h2 className="text-lg font-semibold">{Props.bookName}</h2>
          <small className="text-purple-500">{Props.authorName}</small>
        </div>

        <div className="mb-4">
          <span className="flex items-start">
            <FaQuoteLeft className="text-gray-400 mr-2 flex-shrink-0" />{" "}
            <p className="flex-grow">{Props.quote}</p>{" "}
            <FaQuoteRight className="text-gray-400 ml-2 flex-shrink-0" />
          </span>
        </div>

        <div className="flex justify-end">
          <small className="text-purple-500">{Props.createdAt}</small>
        </div>
      </div>
    </div>
  );
}
