import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/Auth.middleware.js";

const router = Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  const { author, bookTitle, bookId, bookCover, quote } = req.body;
  if (!quote || !author || !bookTitle) {
    return res.status(400).json({ message: "Todos os campos obrigatórios" });
  }
  try {
    const post = await prisma.post.create({
      data: {
        bookName: bookTitle,
        authorsName: author,
        quote,
        bookId,
        coverImage: bookCover,
        owner: {
          connect: {
            id: res.user_id,
          },
        },
      },
    });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  const followerUsersRecords = await prisma.userFollows.findMany({
    where: {
      followerId: res.user_id,
    },
    select: {
      followingId: true,
    },
  });

  const followingIds = followerUsersRecords.map((record) => record.followingId);

  try {
    const post = await prisma.post.findMany({
      where: {
        ownerId: {
          in: followingIds,
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: {
        bookId: bookId,
      },
      select: {
        authorsName: true,
        bookId: true,
        bookName: true,
        createdAt: true,
        coverImage: true,
        id: true,
        quote: true,
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

router.post("/react/:postId", async (req, res) => {
  const { postId } = req.params;
  const userId = res.user_id;
  const { type } = req.body;

  if (type) {
    const creatingReaction = await prisma.reaction.upsert({
      where: { userId_postId: { userId, postId } },
      update: { type: type },
      create: { userId, postId, type },
    });
    res.status(201).json(creatingReaction);
  } else {
    await prisma.reaction.delete({
      where: { userId_postId: { userId, postId } },
    });
    res.status(200).json("Reaction deleted");
  }
});

router.get("/react/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const counts = await prisma.reaction.groupBy({
      by: ["type"],
      where: { postId },
      _count: { type: true },
    });

    const defaultCounts = {
      LIKE: 0,
      LOVE: 0,
      FUNNY: 0,
      SAD: 0,
    };

    const reactionCounts = counts.reduce(
      (acc, current) => {
        acc[current.type] = current._count.type;
        return acc;
      },
      { ...defaultCounts }
    );

    const userReaction = await prisma.reaction.findUnique({
      where: { userId_postId: { userId: res.user_id, postId } },
      select: { type: true },
    });

    const responseData = {
      counts: reactionCounts,
      userReaction: userReaction?.type || null,
    };
    res.status(200).json(responseData);
  } catch (err) {
    res.status(500).json({ message: "Erro interno do servidor.", err });
  }
});

export default router;
