import express from "express";

function setupPostRoutes(postService) {
  const router = express.Router();

  router.post("/", async (req, res) => {
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

  router.delete("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const userId = res.user_id;
    try {
      await postService.deletePost(postId, userId);
      return res.status(200).json("Post Deleted");
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/", async (req, res) => {
    const userId = res.user_id;
    try {
      const post = await postService.fetchFollowerPost(userId);
      return res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  router.get("/:postId", async (req, res) => {
    const { postId } = req.params;

    try {
      const post = await postService.fetchSinglePost(postId);
      console.log(post);
      return res.status(200).json(post);
    } catch (err) {
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  router.get("/:bookId", async (req, res) => {
    const { bookId } = req.params;

    try {
      const posts = await postService.fetchBookPost(bookId);
      return res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  router.get("/userReaction/:postId", async (req, res) => {
    const userId = res.user_id;
    const { postId } = req.params;

    const userReaction = await postService.fetchUserReaction(userId, postId);

    return res.status(200).json(userReaction);
  });

  router.post("/userReaction/:postId", async (req, res) => {
    const { type } = req.body;
    const userId = res.user_id;
    const { postId } = req.params;

    try {
      const reaction = await postService.handleReaction(type, userId, postId);
      return res.status(201).json(reaction);
    } catch (err) {
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  router.get("/react/:postId", async (req, res) => {
    const { postId } = req.params;
    const userId = res.user_id;

    try {
      const reactions = await postService.fetchReactions(postId, userId);
      return res.status(200).json(reactions);
    } catch (err) {
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  });

  return router;
}

export default setupPostRoutes;
