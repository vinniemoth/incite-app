"use client";
import { useState } from "react";
import {
  FaHeart,
  FaFaceSadCry,
  FaThumbsUp,
  FaFaceLaughBeam,
} from "react-icons/fa6";

export default function Reactions() {
  const [active, setActive] = useState("");

  const handleReaction = (reaction: string) => {
    setActive(reaction);
    if (reaction === active) {
      setActive("");
      console.log(reaction);
    }
  };

  return (
    <div className="flex fixed bottom-0 justify-evenly w-full py-10">
      <FaThumbsUp
        onPointerDown={() => handleReaction("like")}
        size={50}
        className={`cursor-pointer hover:text-blue-400 hover:scale-120 transition-all duration-150 ${
          active === "like" ? "text-blue-400 scale-120" : "text-white"
        }`}
      ></FaThumbsUp>
      <FaHeart
        onPointerDown={() => handleReaction("heart")}
        size={50}
        className={`cursor-pointer hover:text-pink-400 hover:scale-120 transition-all duration-150 ${
          active === "heart" ? "text-pink-400 scale-120" : ""
        }`}
      ></FaHeart>
      <FaFaceLaughBeam
        onPointerDown={() => handleReaction("laugh")}
        size={50}
        className={`cursor-pointer hover:text-amber-400 hover:scale-120 transition-all duration-150 ${
          active === "laugh" ? "text-amber-400 scale-120" : ""
        }`}
      ></FaFaceLaughBeam>
      <FaFaceSadCry
        onPointerDown={() => handleReaction("sad")}
        size={50}
        className={`cursor-pointer hover:text-amber-400 hover:scale-120 transition-all duration-150 hover:p-1 rounded-full ${
          active === "sad" ? "scale-120 text-amber-400" : ""
        }`}
      ></FaFaceSadCry>
    </div>
  );
}
