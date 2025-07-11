import argon2id from "argon2";

class Argon2 {
  async hash(password) {
    return argon2id.hash(password);
  }

  async compare(password, hash) {
    return argon2id.verify(hash, password);
  }
}

export default Argon2;
