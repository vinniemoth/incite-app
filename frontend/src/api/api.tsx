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
};
