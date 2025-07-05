class UserService {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async fetchUser(username) {
    try {
      const resultedUser = await this.dbClient.user.findUnique({
        where: {
          username: username,
        },
        select: {
          id: true,
          username: true,
          email: true,
          posts: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
      if (!resultedUser) {
        return null;
      }
      return resultedUser;
    } catch (err) {
      throw new Error(err);
    }
  }

  async fetchFollow(followerId, followingId) {
    try {
      const following = await this.dbClient.userFollows.findUnique({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: followingId,
          },
        },
      });
      return following ? true : false;
    } catch (err) {
      throw new Error(err);
    }
  }

  async handleFollow(isFollower, followerId, userId) {
    if (isFollower == false) {
      console.log(isFollower, followerId, userId);
      await this.dbClient.userFollows.create({
        data: {
          followerId,
          followingId: userId,
        },
      });
    } else if (isFollower == true) {
      await this.dbClient.userFollows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId: userId,
          },
        },
      });
    }
    return !isFollower;
  }
}
export default UserService;
