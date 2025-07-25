import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Incite | Home",
};

export default function Home() {
  return (
    <>
      <div className="flex w-screen h-screen flex-col md:flex-row justify-between">
        <Image
          className="hidden md:block"
          src={"/book.png"}
          alt={""}
          width={700}
          height={700}
        />
        <div className="flex flex-col items-center justify-center gap-8 md:pr-20">
          <Image
            src="/incite_logo.png"
            alt={""}
            width={150}
            height={150}
          ></Image>
          <h1 className="font-ultra text-center text-5xl px-5">INCITE</h1>
          <h1 className="font-ultra text-center text-3xl px-5">
            Read. Share. Discover.
          </h1>
          <div className="">
            <h2 className="font-roboto text-center text-lg">
              Share moments from the books you love,
              <br /> connect with fellow readers, <br />
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
        </div>
      </div>
    </>
  );
}
