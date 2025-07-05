import { Router } from "express";

function setupUserRoutes(userService) {
  const router = Router();

  router.get("/profile", async (req, res) => {
    const { username } = req.query;

    try {
      const fetchedUser = userService.fetchUser(username);
      res.status(200).json(fetchedUser);
    } catch (err) {
      throw new Error(err);
    }
  });

  router.get("/follow/:userId", async (req, res) => {
    const { userId } = req.params;
    const followingId = res.user_id;

    const fetchedFollow = await userService.fetchFollow(followingId, userId);
    res.status(200).json(fetchedFollow);
  });

  router.post("/follow/:userId", async (req, res) => {
    const { isFollower } = req.body;
    const followerId = res.user_id;
    const { userId } = req.params;

    const followResult = await userService.handleFollow(
      isFollower,
      followerId,
      userId
    );
    res.status(201).json({ followResult });
  });

  return router;
}

export default setupUserRoutes;
