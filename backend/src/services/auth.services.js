class AuthServices {
  constructor(dbClient, cryptoClient, jwtManager) {
    this.dbClient = dbClient;
    this.cryptoClient = cryptoClient;
    this.jwtManager = jwtManager;
  }

  async createAccount(username, email, password) {
    if (!username || !email || !password) {
      return null;
    }

    const hashedPassword = await this.cryptoClient.hash(password);

    try {
      const newUser = await this.dbClient.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      return newUser;
    } catch (err) {
      throw new Error(err);
    }
  }

  async login(email, password) {
    console.log(email, password);
    if (!email || !password) {
      return null;
    }

    const user = await this.dbClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const passwordIsValid = await this.cryptoClient.compare(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return null;
    }

    const token = this.jwtManager.sign(user.id, user.email);

    return { user, token };
  }
}

export default AuthServices;
