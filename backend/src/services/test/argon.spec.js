import { test, describe, expect } from "vitest";
import Argon2 from "../argon2.service";

describe("Argon2", () => {
  test("should hash and compare password", async () => {
    const ag = new Argon2();
    const password = "foo";
    const hash = await ag.hash(password);

    expect(ag.compare(password, hash)).toBeTruthy();
  });
});
