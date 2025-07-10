import { describe, expect, test, vi, beforeEach } from "vitest";
import AuthServices from "../auth.services.js";

// function sum(a, b) {
//   if (typeof a === "number" && typeof b === "number") {
//     return a + b;
//   }
//   return NaN;
// }

// describe("sum test", () => {
//   test("should add two numbers", () => {
//     expect(sum(1, 2)).toBe(3);
//   });
//   test("should add a number and a string", () => {
//     expect(sum(2, "2")).toBe(NaN);
//   });
//   test("should add a string and a string", () => {
//     expect(sum("2", "2")).toBe(NaN);
//   });
//   test("should add a number and an undefined value", () => {
//     expect(sum(2, undefined)).toBe(NaN);
//   });
//   test("should add a null value and an undefined value", () => {
//     expect(sum(null, undefined)).toBe(NaN);
//   });
// });

describe("AuthServices", () => {
  let dbClient;
  let cryptoClient;
  let jwtManager;
  let authService;

  beforeEach(() => {
    dbClient = {
      user: {
        create: vi.fn(),
      },
    };
    cryptoClient = {
      hash: vi.fn((password) => `hashed_${password}`),
    };

    authService = new AuthServices(dbClient, cryptoClient, jwtManager);
  });

  //   Success
  test("should create a new account successfully", async () => {
    const username = "testUser";
    const email = "testEmail";
    const password = "testPassword";
    const hashedPassword = `hashed_${password}`;

    dbClient.user.create.mockResolvedValue({
      id: "123",
      username,
      email,
      password: hashedPassword,
    });

    const newUser = await authService.createAccount(username, email, password);

    expect(cryptoClient.hash).toHaveBeenCalledWith(password);
    expect(dbClient.user.create).toHaveBeenCalledWith({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    expect(newUser).toEqual({
      id: "123",
      username,
      email,
      password: hashedPassword,
    });
  });

  //   Missing Parameters
  test("should not create a new account with missing parameters", async () => {
    // Missing Username
    const missingUsername = await authService.createAccount(
      null,
      "testEmail",
      "testPassword"
    );
    expect(missingUsername).toBeNull();
    expect(cryptoClient.hash).not.toHaveBeenCalled();
    expect(dbClient.user.create).not.toHaveBeenCalled();

    vi.clearAllMocks();

    // Missing Email
    const missingEmail = await authService.createAccount(
      "testUsername",
      undefined,
      "testPassword"
    );
    expect(missingEmail).toBeNull();
    expect(cryptoClient.hash).not.toHaveBeenCalled();
    expect(dbClient.user.create).not.toHaveBeenCalled();

    vi.clearAllMocks();

    // Missing Password
    const missingPassword = await authService.createAccount(
      "testUserName",
      "testEmail",
      null
    );
    expect(missingPassword).toBeNull();
    expect(cryptoClient.hash).not.toHaveBeenCalled();
    expect(dbClient.user.create).not.toHaveBeenCalled();
  });
});
