import Reactions from "./reactions";
import Image from "next/image";

export default function Post() {
  return (
    <div className="h-screen w-screen items-center justify-around">
      <div className="flex w-full items-center flex-col p-3">
        <Image
          className="border-2 border-red-400 rounded-xl"
          src="https://github.com/vinniemoth.png"
          width={80}
          height={80}
          alt=""
        />
        <p>VinnieMoth</p>
        <small>Há 20 minutos.</small>
      </div>
      <div className="flex flex-col items-center p-3">
        <div
          style={{ background: "rgba(136, 77, 38, 0.4)" }}
          className="sm:w-3/4 sm:flex-row flex-col items-center rounded-lg flex py-5 px-5 gap-5 w-full"
        >
          <Image
            className="rounded-lg flex-1/4"
            src="https://m.media-amazon.com/images/I/81+0Ps-egGL._SL1500_.jpg"
            width={150}
            height={150}
            alt=""
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-ultra">Wild Dark Shore: A Novel</h1>
            <small>Charlotte McConaghy</small>
            <div className="py-6">
              <h1 className="text-2xl">
                “But here is the nature of life. That we must love things with
                our whole selves, knowing they will die.”
              </h1>
            </div>
          </div>
        </div>
      </div>
      <Reactions></Reactions>
    </div>
  );
}
