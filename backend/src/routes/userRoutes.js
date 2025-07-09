import express from "express";

function setupUserRoutes(userService) {
  const router = express.Router();

  router.get("/search", async (req, res) => {
    const { username } = req.query;
    const fetchedUser = await userService.fetchSearchUser(username);
    res.status(200).json(fetchedUser);
  });

  router.get("/profile", async (req, res) => {
    const { username } = req.query;

    const fetchedUser = await userService.fetchUser(username);
    res.status(200).json(fetchedUser);
  });

  router.get("/follow/:userId", async (req, res) => {
    const { userId } = req.params;
    const followingId = res.user_id;

    const fetchedFollow = await userService.fetchFollow(followingId, userId);
    console.log(fetchedFollow);
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
    res.status(201).json(followResult);
  });

  return router;
}

export default setupUserRoutes;
