import jwt from "jsonwebtoken";

class AuthServices {
  constructor(dbClient, cryptoClient) {
    this.dbClient = dbClient;
    this.cryptoClient = cryptoClient;
  }

  async createAccount(username, email, password) {
    if (!username || !email || !password) {
      return null;
    }

    const hashedPassword = await this.cryptoClient.hash(password, 10);

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

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { user: { id: user.id, email: user.email }, token };
  }
}

export default AuthServices;
