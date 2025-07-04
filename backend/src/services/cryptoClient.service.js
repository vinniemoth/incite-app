import bcrypt from "bcryptjs";

class BcryptCryptoClient {
  hash(password) {
    return bcrypt.hash(password, 10);
  }

  compare(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

export default BcryptCryptoClient;
