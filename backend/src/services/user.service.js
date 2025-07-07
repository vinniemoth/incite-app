class UserService {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async fetchUser(username) {
    const resultedUser = await this.dbClient.user.findUnique({
      where: {
        username,
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
  }

  async fetchFollow(followerId, followingId) {
    const following = await this.dbClient.userFollows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return following ? true : false;
  }

  async handleFollow(isFollower, followerId, followingId) {
    if (isFollower === false) {
      await this.dbClient.userFollows.create({
        data: {
          followerId,
          followingId,
        },
      });
      return !isFollower;
    }
    await this.dbClient.userFollows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return !isFollower;
  }
}
export default UserService;
