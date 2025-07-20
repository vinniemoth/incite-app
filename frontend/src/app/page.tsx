import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-8">
        <Image src="/incite_logo.png" alt={""} width={150} height={150}></Image>
        <h1 className="font-ultra text-center text-5xl px-5">
          Read. Share. Discover. <br /> Show it to the world.
        </h1>
        <div className="sm:w-1/3 w-1/2">
          <h2 className="font-roboto text-center text-lg">
            Share moments from the books you love, connect with fellow readers,
            and explore new perspectives.
          </h2>
        </div>

        <div className="flex gap-10 flex-col md:flex-row">
          <Link
            href={`/auth`}
            className="rounded-2xl px-10 py-2 bg-zinc-400/50 hover:bg-zinc-400/70 hover:cursor-pointer font-roboto text-center"
          >
            Start Now
          </Link>
        </div>
        <Image
          src="/reader.svg"
          width={200}
          height={200}
          priority
          alt=""
        ></Image>
      </div>
    </>
  );
}
