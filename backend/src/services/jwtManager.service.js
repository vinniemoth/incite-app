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

  verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return null;
      }
      return decoded.id;
    });
  }
}

export default JwtManager;
