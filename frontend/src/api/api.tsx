export const moduleApi = {
  createUser: async (username: string, email: string, password: string) => {
    const response = await fetch("http://localhost:5000/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    try {
      let json = await response.json();
      console.log(json);
      return json;
    } catch (err) {
      console.error("User creation failed.", err);
    }
  },

  loginUser: async (email: string, password: string) => {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  fetchBooks: async (q: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/books-search?q=${encodeURIComponent(q)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching books:", errorData);
        throw new Error(errorData.message || "Failed to fetch books.");
      }

      const json = await response.json();
      console.log("List of books:", json);
      return json;
    } catch (err) {
      console.error("Error fetching books:", err);
      throw new Error("Failed to fetch books.");
    }
  },

  fetchBookInfo: async (id: string) => {
    const response = await fetch(`http://localhost:5000/api/book/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log(json);
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
    const response = await fetch("http://localhost:5000/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },

      body: JSON.stringify({ quote, author, bookTitle, bookId, bookCover }),
    });
    return response.json;
  },

  fetchPosts: async () => {
    const token = localStorage.getItem("authToken");
    const response = await fetch("http://localhost:5000/post", {
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
      `http://localhost:5000/api/users/search?username=${search.trim()}`,
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
      `http://localhost:5000/api/users/profile?username=${username}`,
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
    const response = await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response.json();
  },
};
