import Post from "@/components/post";
import Reactions from "@/components/reactions";

export default function Feed() {
  return (
    <div className="w-screen flex flex-col h-full">
      <Post></Post>
      <Reactions></Reactions>
    </div>
  );
}
