import { Router } from "express";

function setupApiRoutes(googleBooks, prisma) {
  const router = Router();

  router.get("/books-search", async (req, res) => {
    const { q } = req.query;

    try {
      const bookSearch = await googleBooks.searchBook(q);
      return res.status(200).json(bookSearch);
    } catch (err) {
      res
        .status(500)
        .json({ error: "Erro interno do servidor ao buscar livros" });
    }
  });

  router.get("/book/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const bookInfo = await googleBooks.fetchBookInfo(id);
      return res.status(200).json(bookInfo);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/users/profile", async (req, res) => {
    const { username } = req.query;

    if (!username) {
      return res
        .status(400)
        .json({ message: "O parâmetro 'username' é obrigatório" });
    }
  });

  router.get("/follow/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const following = await prisma.userFollows.findUnique({
        where: {
          followerId_followingId: {
            followerId: res.user_id,
            followingId: userId,
          },
        },
      });
      return res.status(200).json({
        following: following ? true : false,
      });
    } catch (err) {
      return res.status(500).json({ message: "Erro interno do servidor", err });
    }
  });

  router.post("/follow/:userId", async (req, res) => {
    const { userId } = req.params;
    const { isFollower } = req.body;

    if (!isFollower) {
      const newFollow = await prisma.userFollows.create({
        data: {
          followerId: res.user_id,
          followingId: userId,
        },
      });
      return res.status(200).json({
        following: newFollow ? true : false,
      });
    } else if (isFollower) {
      const removeFollow = await prisma.userFollows.delete({
        where: {
          followerId_followingId: {
            followerId: res.user_id,
            followingId: userId,
          },
        },
      });
      return res.status(200).json({
        following: removeFollow ? false : true,
      });
    }
  });

  return router;
}

export default setupApiRoutes;
