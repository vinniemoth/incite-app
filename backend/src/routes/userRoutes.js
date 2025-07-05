import { Router } from "express";

function setupUserRoutes(userService) {
  const router = Router();

  router.get("/search", async (req, res) => {
    const { username } = req.query;

    try {
      const fetchedUser = userService.fetchUser(username);
      res.status(200).json(fetchedUser);
    } catch (err) {
      throw new Error(err);
    }
  });

  return router;
}

export default setupUserRoutes;
