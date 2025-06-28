import { useRouter } from "next/navigation";
import { FaLeftLong } from "react-icons/fa6";

export default function BackButton() {
  const router = useRouter();

  return (
    <FaLeftLong
      onClick={() => router.push("/home")}
      size={50}
      className="absolute top-5 left-5 bg-zinc-800 p-3 rounded-xl cursor-pointer hover:bg-zinc-700 z-50"
    />
  );
}
