import { describe, expect, test, vi, beforeEach } from "vitest";
import GoogleBooksService from "../googleBooks.service";

describe("GoogleBooksService", () => {
  const BASE_URL = "http://example.com/api";
  const API_KEY = "testApiKey";

  let googleBooksService;
  let fetchSpy;

  beforeEach(() => {
    googleBooksService = new GoogleBooksService(BASE_URL, API_KEY);

    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  test("fetches book search successfully", async () => {
    const q = "testQuery";
    const expectedUrl = `${BASE_URL}?q=${q}&key=${API_KEY}`;

    const mockBookData = { title: "mockBookTitle", author: "mockBookAuthor" };

    fetchSpy.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockBookData),
    });

    const result = await googleBooksService.searchBook(q);

    expect(fetchSpy).toHaveBeenCalledWith(expectedUrl);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockBookData);

    fetchSpy.mockRestore();
  });

  test("should handle fetch errors", async () => {
    const errorMessage = "Network Error: Failed to fetch";

    const q = "testQuery";
    const expectedUrl = `${BASE_URL}?q=${q}&key=${API_KEY}`;

    fetchSpy.mockRejectedValueOnce(new Error(errorMessage));

    const result = await googleBooksService.searchBook(q);

    expect(fetchSpy).toBeCalledTimes(1);
    expect(fetchSpy).toBeCalledWith(expectedUrl);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toContain(errorMessage);
  });

  test("should handle errors when no query is provided", async () => {
    const q = undefined;
    const result = await googleBooksService.searchBook(q);

    expect(result).toBeInstanceOf(Error);
  });
});
