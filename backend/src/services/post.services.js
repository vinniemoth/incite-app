class PostService {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async createPost(authorsName, bookName, bookId, coverImage, quote, userId) {
    const newPost = await this.dbClient.post.create({
      data: {
        bookName,
        authorsName,
        quote,
        bookId,
        coverImage,
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return newPost;
  }

  async fetchFollowerPost(followerId) {
    const followerUsersRecords = await this.dbClient.userFollows.findMany({
      where: {
        followerId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = followerUsersRecords.map(
      (record) => record.followingId
    );

    const post = await this.dbClient.post.findMany({
      where: {
        ownerId: {
          in: followingIds,
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return post;
  }

  async fetchBookPost(bookId) {
    const posts = await this.dbClient.post.findMany({
      where: {
        bookId,
      },
      select: {
        authorsName: true,
        bookId: true,
        bookName: true,
        createdAt: true,
        coverImage: true,
        id: true,
        quote: true,
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  }

  async fetchUserReaction(userId, postId) {
    const userReaction = await this.dbClient.reaction.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
      select: {
        type: true,
      },
    });
    return userReaction;
  }

  async handleReaction(type, userId, postId) {
    const existingReaction = await this.dbClient.reaction.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (!existingReaction || existingReaction.type !== type) {
      const creatingReaction = await this.dbClient.reaction.upsert({
        where: { userId_postId: { userId, postId } },
        update: { type },
        create: { userId, postId, type },
      });
      return creatingReaction;
    }
    const deletedReaction = await this.dbClient.reaction.delete({
      where: { userId_postId: { userId, postId } },
    });
    console.log("oi");
    return "Reaction Deleted";
  }

  async fetchReactions(postId, userId) {
    const counts = await this.dbClient.reaction.groupBy({
      by: ["type"],
      where: { postId },
      _count: { type: true },
    });

    const defaultCounts = {
      LIKE: 0,
      LOVE: 0,
      FUNNY: 0,
      SAD: 0,
    };

    const reactionCounts = counts.reduce(
      (acc, current) => {
        acc[current.type] = current._count.type;
        return acc;
      },
      { ...defaultCounts }
    );

    const userReaction = await this.dbClient.reaction.findUnique({
      where: { userId_postId: { userId, postId } },
      select: { type: true },
    });

    const responseData = {
      counts: reactionCounts,
      userReaction: userReaction?.type || null,
    };

    return responseData;
  }
}

export default PostService;
