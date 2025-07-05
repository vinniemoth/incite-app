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
}

export default UserService;
