class PostService {
  constructor(dbClient, notificationClient) {
    this.dbClient = dbClient;
    this.notificationClient = notificationClient;
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

  async deletePost(postId, userId) {
    await this.dbClient.post.delete({
      where: {
        id: postId,
        ownerId: userId,
      },
    });
    return;
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

    const feedUsersIds = [...followingIds, followerId];

    const post = await this.dbClient.post.findMany({
      where: {
        ownerId: {
          in: feedUsersIds,
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
    const post = await this.dbClient.post.findUnique({
      where: { id: postId },
    });
    const actor = await this.dbClient.user.findUnique({
      where: { id: userId },
    });

    const existingReaction = await this.dbClient.reaction.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (type === null) {
      await this.dbClient.reaction.delete({
        where: { userId_postId: { userId, postId } },
      });

      const deletingNotification =
        await this.notificationClient.deleteNotification({
          actorId: post.ownerId,
          userId,
          type: "REACTED",
          postId: post.id,
        });

      return "Reaction Deleted";
    }

    if (!existingReaction) {
      const creatingReaction = await this.dbClient.reaction.create({
        data: {
          userId,
          postId,
          type,
        },
      });

      const notification = await this.notificationClient.createNotification(
        post.ownerId,
        "REACTED",
        {
          userId,
          userName: actor.username,
          postId: post.id,
          bookName: post.bookName,
          type,
        }
      );

      return creatingReaction;
    } else if (existingReaction.type !== type) {
      const updatingReaction = await this.dbClient.reaction.update({
        where: { userId_postId: { userId, postId } },
        data: { type },
      });

      const notificationData = {
        userId,
        postId: post.id,
        bookName: post.bookName,
        type,
      };

      const updatingNotification =
        await this.notificationClient.updateNotification({
          actorId: post.ownerId,
          postId: post.id,
          data: notificationData,
        });

      if (post.ownerId !== userId) {
        await this.notificationClient.createNotification(
          post.ownerId,
          "REACTED",
          {
            userId,
            userName: actor.username,
            postId: post.id,
            bookName: post.bookName,
            type,
          }
        );
        return updatingReaction;
      }
    }
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

  async fetchSinglePost(postId) {
    const post = await this.dbClient.post.findUnique({
      where: { id: postId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return post;
  }
}

export default PostService;
