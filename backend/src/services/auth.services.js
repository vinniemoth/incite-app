import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthService {
  constructor(dbClient) {
    this.dbClient = dbClient;
  }

  async registerUser(username, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
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

  async loginUser(email, password) {
    const user = await this.dbClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return null;
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { user: { id: user.id, email: user.email }, token };
  }
}

export default AuthService;
