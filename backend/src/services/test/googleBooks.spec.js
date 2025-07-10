import { describe, expect, test, vi } from "vitest";

describe("GoogleBooksService", () => {
  let BASE_URL;
  let API_KEY;

  test("fetches book search successfully", async () => {
    BASE_URL = "http://example.com/api";
    API_KEY = "testApiKey";
    const mockResponse = { data: "testData" };

    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const q = "testQuery";

    const response = await fetch(`${BASE_URL}?q=${q}&key=${API_KEY}`);

    const data = await response.json();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}?q=${q}&key=${API_KEY}`);
    expect(data).toEqual(mockResponse);
  });
});
