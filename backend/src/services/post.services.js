class PostService {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async createPost(author, bookTitle, bookId, bookCover, quote, userId) {
    if (!author || !bookTitle || !bookId || !bookCover || !quote) {
      return null;
    }
    try {
      const newPost = await this.dbClient.post.create({
        data: {
          bookName: bookTitle,
          authorsName: author,
          quote,
          bookId,
          coverImage: bookCover,
          owner: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return newPost;
    } catch (err) {
      throw new Error(err);
    }
  }

  async fetchFeedPosts(userId) {
    const followUserRecords = await this.dbClient.userFollows.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = followUserRecords.map((record) => {
      record.followingId;
    });
    try {
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
    } catch (err) {
      throw new Error(err);
    }
  }

  async fetchBookPosts(bookId) {
    try {
      const posts = this.dbClient.post.findMany({
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
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default PostService;
