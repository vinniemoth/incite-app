import jwt from "jsonwebtoken";

class JwtManager {
  sign(id, email) {
    const payload = {
      id,
      email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }
}

export default JwtManager;
