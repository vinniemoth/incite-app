class UserService {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async fetchSearchUser(username) {
    const resultedUser = await this.dbClient.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
      },
    });
    if (!resultedUser) {
      return null;
    }
    return resultedUser;
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
    if (!isFollower) {
      await this.dbClient.userFollows.create({
        data: {
          followerId,
          followingId,
        },
      });
      return true;
    }
    await this.dbClient.userFollows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return false;
  }
}
export default UserService;
