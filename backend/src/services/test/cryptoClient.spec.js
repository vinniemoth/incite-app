import { test, describe, expect } from "vitest";
// import BcryptCryptoClient from "../cryptoclient.service.js";

describe("BcryptCryptoClient", () => {
  test("should hash and compare password", async () => {
    const bc = new BcryptCryptoClient();
    const password = "foo";
    const hash = await bc.hash(password);

    expect(bc.compare(password, hash)).toBeTruthy();
  });
});
