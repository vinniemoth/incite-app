const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const moduleApi = {
  createUser: async (username: string, email: string, password: string) => {
    const response = await fetch(`${backendURL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    try {
      let json = await response.json();
      return json;
    } catch (err) {
      throw new Error("Failed to create account.");
    }
  },

  loginUser: async (email: string, password: string) => {
    const response = await fetch(`${backendURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  fetchBooks: async (q: string) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${backendURL}/api/books-search?q=${encodeURIComponent(q)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch books.");
      }

      const json = await response.json();
      return json;
    } catch (err) {
      throw new Error("Failed to fetch books.");
    }
  },

  fetchBookInfo: async (id: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/api/book/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    const json = await response.json();
    return json;
  },

  fetchPostsByBookId: async (id: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/post/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    const json = await response.json();
    return json;
  },

  createPost: async (
    quote: string,
    author: string | null,
    bookTitle: string | null,
    bookId: string | null,
    bookCover: string | null
  ) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },

      body: JSON.stringify({ quote, author, bookTitle, bookId, bookCover }),
    });
    return response.json;
  },

  deletePost: async (postId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/post/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response.json();
  },

  fetchPosts: async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/post`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response.json();
  },

  fetchUsers: async (search: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${backendURL}/user/search?username=${search.trim()}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
    return response.json();
  },

  fetchUser: async (username: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${backendURL}/user/profile?username=${username}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
    return response.json();
  },

  logout: async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response.json();
  },

  // Follow Requests:

  fetchFollow: async (userId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/user/follow/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response;
  },

  setFollow: async (isFollower: boolean, userId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/user/follow/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ isFollower }),
    });
    return response;
  },

  // Reaction Request

  postReact: async (postId: string, type: string | null) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/post/userReaction/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ type }),
    });
    return response.json();
  },

  fetchReactions: async (postId: string) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/post/react/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response.json();
  },

  // Notification Request

  fetchNotifications: async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${backendURL}/notifications`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response.json();
  },

  markNotificationAsRead: async (notificationId: string) => {
    const token = localStorage.getItem("authToken");
    console.log(token, notificationId);
    const response = await fetch(
      `${backendURL}/notifications/${notificationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
    return response.json();
  },
};
