

class GoogleBooksService {
  constructor(BASE_URL, API_KEY, fetchFn) {
    this.BASE_URL = BASE_URL;
    this.API_KEY = API_KEY;
    this.fetchFn = fetchFn;
  }

  async searchBook(q) {
    if (!q) {
      return new Error();
    }
    const searchResult = await this.fetchFn(
      `${this.BASE_URL}?q=${q}&key=${this.API_KEY}`
    );
    return searchResult.json();
  }

  async fetchBookInfo(id) {
    if (!id) {
      return null;
    }
    const bookInfo = await this.fetchFn(
      `${this.BASE_URL}/${id}/?key${this.API_KEY}`
    );
    return bookInfo.json();
  }
}

export default GoogleBooksService;
// `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${googleBooksApiKey}`
