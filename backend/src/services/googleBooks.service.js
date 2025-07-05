class GoogleBooksService {
  constructor() {
    this.BASE_URL = "https://www.googleapis.com/books/v1/volumes";
    this.API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  }

  async searchBook(q) {
    if (!q) {
      return null;
    }
    try {
      const searchResult = await fetch(
        `${this.BASE_URL}?q=${q}&key=${this.API_KEY}`
      );
      return searchResult.json();
    } catch (err) {
      throw new Error(err);
    }
  }

  async fetchBookInfo(id) {
    if (!id) {
      return null;
    }
    try {
      const bookInfo = await fetch(
        `${this.BASE_URL}/${id}/?key${this.API_KEY}`
      );
      return bookInfo.json();
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default GoogleBooksService;
// `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${googleBooksApiKey}`
