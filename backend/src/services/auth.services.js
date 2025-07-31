class AuthServices {
  constructor(dbClient, cryptoClient, jwtManager) {
    this.dbClient = dbClient;
    this.cryptoClient = cryptoClient;
    this.jwtManager = jwtManager;
  }

  async createAccount(username, email, password) {
    if (!username || !email || !password) {
      throw new Error("missing_credentials");
    }

    const hashedPassword = await this.cryptoClient.hash(password);

    const foundEmail = await this.dbClient.user.findUnique({
      where: {
        email,
      },
    });

    const foundUsername = await this.dbClient.user.findUnique({
      where: {
        username,
      },
    });

    if (foundUsername) {
      throw new Error("username_already_exists");
    } else if (foundEmail) {
      throw new Error("email_already_exists");
    } else {
      const newUser = await this.dbClient.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      return newUser;
    }
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("missing_credentials");
    }

    const user = await this.dbClient.user.findUnique({
      where: {
        email,
      },
    });

    const passwordIsValid = await this.cryptoClient.compare(
      password,
      user.password
    );

    if (!passwordIsValid) {
      throw new Error("invalid_password");
    }

    const token = this.jwtManager.sign(user.id, user.email);

    return { user, token };
  }
}

export default AuthServices;
