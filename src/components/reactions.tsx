import { FaLaugh } from "react-icons/fa";
import { FaHeart, FaFaceSadCry, FaThumbsUp } from "react-icons/fa6";

export default function Reactions() {
  return (
    <div className="flex gap-20 p-10">
      <FaThumbsUp
        size={50}
        className="cursor-pointer hover:text-blue-400 hover:scale-120 transition-all duration-150"
      ></FaThumbsUp>
      <FaHeart
        size={50}
        className="cursor-pointer hover:text-pink-400 hover:scale-120 transition-all duration-150"
      ></FaHeart>
      <FaLaugh
        size={50}
        className="cursor-pointer hover:text-amber-400 hover:scale-120 transition-all duration-150"
      ></FaLaugh>
      <FaFaceSadCry
        size={50}
        className="cursor-pointer hover:text-amber-400 hover:scale-120 transition-all duration-150"
      ></FaFaceSadCry>
    </div>
  );
}
