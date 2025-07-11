import bcrypt from "bcryptjs";

class BcryptCryptoClient {
  async hash(password) {
    return bcrypt.hash(password, 10);
  }

  async compare(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

export default BcryptCryptoClient;
