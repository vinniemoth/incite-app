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
    console.error(err);
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
    const posts = await prisma.post.findMany({
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
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
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
    console.log(posts);
    return res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default router;
