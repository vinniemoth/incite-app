import { describe, expect, test, vi, beforeEach } from "vitest";
import GoogleBooksService from "../googleBooks.service";

describe("GoogleBooksService", () => {
  const BASE_URL = "http://example.com/api";
  const API_KEY = "testApiKey";

  let googleBooksService;
  let fetchFnMock;

  beforeEach(() => {
    fetchFnMock = vi.fn();
    googleBooksService = new GoogleBooksService(BASE_URL, API_KEY, fetchFnMock);
  });

  test("fetches book search successfully", async () => {
    const q = "testQuery";
    const expectedUrl = `${BASE_URL}?q=${q}&key=${API_KEY}`;

    const mockBookData = { title: "mockBookTitle", author: "mockBookAuthor" };

    fetchFnMock.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce(mockBookData),
    });

    const result = await googleBooksService.searchBook(q);

    expect(fetchFnMock).toHaveBeenCalledWith(expectedUrl);
    expect(fetchFnMock).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockBookData);

    fetchFnMock.mockRestore();
  });

  test("should handle fetch errors", async () => {
    const errorMessage = "Network Error: Failed to fetch";

    const q = "testQuery";
    const expectedUrl = `${BASE_URL}?q=${q}&key=${API_KEY}`;

    fetchFnMock.mockRejectedValueOnce(new Error(errorMessage));

    await expect(() => googleBooksService.searchBook(q)).rejects.toThrowError(
      errorMessage
    );

    expect(fetchFnMock).toBeCalledTimes(1);
    expect(fetchFnMock).toBeCalledWith(expectedUrl);
  });

  test("should handle errors when no query is provided", async () => {
    const q = undefined;
    const result = await googleBooksService.searchBook(q);

    expect(result).toBeInstanceOf(Error);
  });
});
