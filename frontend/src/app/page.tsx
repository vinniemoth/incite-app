import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-10 home-gradient">
        <h1 className="font-ultra text-center text-2xl">Share what you read</h1>
        <Image
          className="rounded-lg "
          src="https://m.media-amazon.com/images/I/81+0Ps-egGL._SL1500_.jpg"
          width={200}
          height={200}
          alt=""
        ></Image>
        <h1 className="font-ultra text-center text-2xl">
          With people you like
        </h1>
        <div className="flex gap-10 flex-col md:flex-row">
          <Link
            href={`/auth`}
            className="rounded-2xl px-10 py-2 bg-zinc-400/50 hover:bg-zinc-400/70 hover:cursor-pointer font-ultra text-center"
          >
            Start Now
          </Link>
        </div>
      </div>
    </>
  );
}
