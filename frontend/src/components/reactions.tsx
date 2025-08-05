import { moduleApi } from "@/api/api";
import React, { useEffect, useState } from "react";
import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegHeart,
  FaHeart,
  FaRegFaceLaugh,
  FaFaceLaugh,
  FaRegFaceSadTear,
  FaFaceSadTear,
} from "react-icons/fa6";

type ReactionType = "LIKE" | "LOVE" | "FUNNY" | "SAD" | null;

type ReactionCounts = {
  LIKE: number;
  LOVE: number;
  FUNNY: number;
  SAD: number;
};

interface PostReactionsProps {
  postId: string;
}

export default function PostReactions(props: PostReactionsProps) {
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [totalReactionsCount, setTotalReactionsCount] = useState({
    LIKE: 0,
    LOVE: 0,
    FUNNY: 0,
    SAD: 0,
  });

  useEffect(() => {
    fetchReactions();
  }, [props.postId]);

  const handleReaction = async (type: ReactionType) => {
    const newReaction = userReaction === type ? null : type;
    setUserReaction(newReaction);
    const data = await moduleApi.postReact(props.postId, newReaction);

    setTotalReactionsCount({
      LIKE: data.counts?.LIKE || 0,
      LOVE: data.counts?.LOVE || 0,
      FUNNY: data.counts?.FUNNY || 0,
      SAD: data.counts?.SAD || 0,
    });
  };

  const fetchReactions = async () => {
    const data = await moduleApi.fetchReactions(props.postId);
    setTotalReactionsCount({
      LIKE: data.counts?.LIKE || 0,
      LOVE: data.counts?.LOVE || 0,
      FUNNY: data.counts?.FUNNY || 0,
      SAD: data.counts?.SAD || 0,
    });
    setUserReaction(data.userReaction);
  };

  const ReactionButton = ({
    type,
    Icon,
    FilledIcon,
  }: {
    type: ReactionType;
    Icon: React.ElementType;
    FilledIcon: React.ElementType;
  }) => (
    <button
      onClick={() => handleReaction(type)}
      className={`flex items-center gap-1 p-2 rounded-full transition-colors duration-200
        ${
          userReaction === type
            ? "text-blue-500 bg-blue-100 dark:bg-blue-900"
            : "text-zinc-500 hover:bg-zinc-700"
        }
      `}
    >
      {userReaction === type ? (
        <FilledIcon className="text-xl" />
      ) : (
        <Icon className="text-xl" />
      )}
      {(totalReactionsCount?.[type as Exclude<ReactionType, null>] || 0) >
        0 && (
        <span className="text-xs ml-1">
          {totalReactionsCount[type as Exclude<ReactionType, null>]}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex gap-4 mt-4 items-center">
      <ReactionButton
        type="LIKE"
        Icon={FaRegThumbsUp}
        FilledIcon={FaThumbsUp}
      />

      <ReactionButton type="LOVE" Icon={FaRegHeart} FilledIcon={FaHeart} />

      <ReactionButton
        type="FUNNY"
        Icon={FaRegFaceLaugh}
        FilledIcon={FaFaceLaugh}
      />

      <ReactionButton
        type="SAD"
        Icon={FaRegFaceSadTear}
        FilledIcon={FaFaceSadTear}
      />
    </div>
  );
}
