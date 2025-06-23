import Image from "next/image";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";

export default function Post() {
  return (
    <div className="h-full w-screen items-center justify-around">
      <div className="flex w-full items-center flex-col p-3">
        <Image
          className="border-2 flex border-red-400 rounded-xl"
          src="https://github.com/vinniemoth.png"
          width={80}
          height={80}
          alt=""
        />
        <p>VinnieMoth</p>
        <small>Há 20 minutos.</small>
      </div>
      <div className="flex flex-col items-center p-3 sm:h-full">
        <div className="sm:w-3/4 sm:flex-row flex-col items-center rounded-lg flex p-5 gap-5 w-full bg-zinc-800">
          <Image
            className="rounded-lg flex-1/4"
            src="https://m.media-amazon.com/images/I/81+0Ps-egGL._SL1500_.jpg"
            width={150}
            height={150}
            alt=""
          />
          <div className="flex flex-col gap-2">
            <FaQuoteLeft size={120} opacity={0.1}></FaQuoteLeft>
            <h1 className="text-lg font-ultra">Wild Dark Shore: A Novel</h1>
            <small>Charlotte McConaghy</small>
            <div className="py-1">
              <h1 className="text-2xl">
                “But here is the nature of life. That we must love things with
                our whole selves, knowing they will die.”
              </h1>
            </div>
            <FaQuoteRight
              className="self-end"
              size={120}
              opacity={0.1}
            ></FaQuoteRight>
          </div>
        </div>
      </div>
    </div>
  );
}
