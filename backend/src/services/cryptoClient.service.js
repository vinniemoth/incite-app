import bcrypt from "bcryptjs";

class BcryptCryptoClient {
  async hash(password) {
    return await bcrypt.hash(password, 10);
  }
}

export default BcryptCryptoClient;
