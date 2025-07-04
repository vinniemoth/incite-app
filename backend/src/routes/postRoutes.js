import express from "express";
import authMiddleware from "../middleware/Auth.middleware.js";

function setupPostRoutes(postService) {
  const router = express.Router();

  router.post("/", authMiddleware, async (req, res) => {
    const { author, bookTitle, bookId, bookCover, quote } = req.body;
    const userId = res.user_id;
    if (!quote || !author || !bookTitle) {
      return res.status(400).json({ message: "Todos os campos obrigatórios" });
    }
    try {
      const newPost = await postService.createPost(
        author,
        bookTitle,
        bookId,
        bookCover,
        quote,
        userId
      );
      return res.status(201).json(newPost);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/", authMiddleware, async (req, res) => {
    try {
      const userId = res.user_id;
      const feedPosts = await postService.fetchFeedPosts(userId);
      return feedPosts;
    } catch (err) {
      throw new Error(err);
    }
  });

  router.get("/:bookId", authMiddleware, async (req, res) => {
    const bookId = req.params;

    try {
      const posts = await postService.fetchBookPosts(bookId);
      return posts;
    } catch (err) {
      throw new Error(err);
    }
  });

  return router;
}

export default setupPostRoutes;

// router.post("/react/:postId", async (req, res) => {
//   const { postId } = req.params;
//   const userId = res.user_id;
//   const { type } = req.body;

//   if (type) {
//     const creatingReaction = await prisma.reaction.upsert({
//       where: { userId_postId: { userId, postId } },
//       update: { type: type },
//       create: { userId, postId, type },
//     });
//     res.status(201).json(creatingReaction);
//   } else {
//     await prisma.reaction.delete({
//       where: { userId_postId: { userId, postId } },
//     });
//     res.status(200).json("Reaction deleted");
//   }
// });

// router.get("/react/:postId", async (req, res) => {
//   const { postId } = req.params;
//   try {
//     const counts = await prisma.reaction.groupBy({
//       by: ["type"],
//       where: { postId },
//       _count: { type: true },
//     });

//     const defaultCounts = {
//       LIKE: 0,
//       LOVE: 0,
//       FUNNY: 0,
//       SAD: 0,
//     };

//     const reactionCounts = counts.reduce(
//       (acc, current) => {
//         acc[current.type] = current._count.type;
//         return acc;
//       },
//       { ...defaultCounts }
//     );

//     const userReaction = await prisma.reaction.findUnique({
//       where: { userId_postId: { userId: res.user_id, postId } },
//       select: { type: true },
//     });

//     const responseData = {
//       counts: reactionCounts,
//       userReaction: userReaction?.type || null,
//     };
//     res.status(200).json(responseData);
//   } catch (err) {
//     res.status(500).json({ message: "Erro interno do servidor.", err });
//   }
// });
