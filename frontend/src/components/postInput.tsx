"use client";

import { moduleApi } from "@/api/api";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function PostInput() {
  const [quoteContent, setQuoteContent] = useState("");
  const [authorSearchTerm, setAuthorSearchTerm] = useState("");
  const [bookNameSearchTerm, setBookNameSearchTerm] = useState("");

  const [suggestedAuthors, setSuggestedAuthors] = useState<string[]>([]);
  const [suggestedBooksByAuthor, setSuggestedBooksByAuthor] = useState<any[]>(
    []
  );

  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const [finalAuthor, setFinalAuthor] = useState<string | null>(null);
  const [finalBookTitle, setFinalBookTitle] = useState<string | null>(null);
  const [finalBookId, setFinalBookId] = useState<string | null>(null);
  const [selectedBookCover, setSelectedBookCover] = useState<string | null>(
    null
  );
  const [selectedFullBook, setSelectedFullBook] = useState<any | null>(null);

  const authorSuggestionsRef = useRef<HTMLDivElement>(null);
  const bookSuggestionsRef = useRef<HTMLDivElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);
  const bookInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      !authorSearchTerm.trim() ||
      authorSearchTerm.trim().length < 3 ||
      finalAuthor
    ) {
      setSuggestedAuthors([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    setSuggestionError(null);

    const handler = setTimeout(async () => {
      try {
        const query = `inauthor:${authorSearchTerm}`;
        const data = await moduleApi.fetchBooks(query);

        const uniqueAuthors: Set<string> = new Set();
        data.items?.forEach((item: any) => {
          item.volumeInfo?.authors?.forEach((author: string) => {
            uniqueAuthors.add(author);
          });
        });
        setSuggestedAuthors(Array.from(uniqueAuthors).sort());
      } catch (err: any) {
        console.error("Erro ao buscar sugestões de autor:", err);
        setSuggestionError(
          err.message || "Failed to fetch author suggestions."
        );
        setSuggestedAuthors([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [authorSearchTerm, finalAuthor]);

  useEffect(() => {
    if (
      !finalAuthor ||
      !bookNameSearchTerm.trim() ||
      bookNameSearchTerm.trim().length < 2 ||
      selectedFullBook
    ) {
      setSuggestedBooksByAuthor([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    setSuggestionError(null);

    const handler = setTimeout(async () => {
      try {
        const query = `inauthor:"${finalAuthor}" intitle:${bookNameSearchTerm}`;
        const data = await moduleApi.fetchBooks(query);
        setSuggestedBooksByAuthor(data.items || []);
      } catch (err: any) {
        console.error("Erro ao buscar sugestões de livro:", err);
        setSuggestionError(err.message || "Failed to fetch book suggestions.");
        setSuggestedBooksByAuthor([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [bookNameSearchTerm, finalAuthor, selectedFullBook, finalBookId]);

  const handleShareQuote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!quoteContent.trim()) {
      toast.error("Please enter your quote!");
      return;
    }
    if (!finalAuthor) {
      toast.error("Please select or confirm an author!");
      return;
    }
    if (!finalBookTitle) {
      toast.error("Please select or confirm the book name!");
      return;
    }

    const formattedData = await moduleApi.fetchBookInfo(finalBookId!);
    const json = await moduleApi.createPost(
      quoteContent,
      formattedData.volumeInfo.authors,
      finalBookTitle,
      finalBookId,
      selectedBookCover
    );
    console.log(json);
    toast.success("Quote shared successfully!");

    setQuoteContent("");
    setAuthorSearchTerm("");
    setBookNameSearchTerm("");
    setSuggestedAuthors([]);
    setSuggestedBooksByAuthor([]);
    setFinalAuthor(null);
    setFinalBookTitle(null);
    setFinalBookId(null);
    setSelectedBookCover(null);
    setSelectedFullBook(null);
    return json;
  };

  const handleSelectAuthor = (author: string) => {
    setAuthorSearchTerm(author);
    setFinalAuthor(author);
    setSuggestedAuthors([]);
    setBookNameSearchTerm("");
    setFinalBookTitle(null);
    setFinalBookId(null);
    setSelectedBookCover(null);
    setSelectedFullBook(null);
    setSuggestedBooksByAuthor([]);
    bookInputRef.current?.focus();
  };

  const handleSelectBook = (book: any) => {
    const title = book.volumeInfo?.title || "Título Desconhecido";
    setBookNameSearchTerm(title);
    setFinalBookTitle(title);
    setFinalBookId(book.id);
    setSelectedFullBook(book);

    let finalCoverUrl: string | null = null;

    if (book.volumeInfo?.imageLinks) {
      if (book.volumeInfo.imageLinks.medium) {
        finalCoverUrl = book.volumeInfo.imageLinks.medium;
      } else if (book.volumeInfo.imageLinks.large) {
        finalCoverUrl = book.volumeInfo.imageLinks.large;
      } else if (book.volumeInfo.imageLinks.thumbnail) {
        finalCoverUrl = book.volumeInfo.imageLinks.thumbnail;
      } else if (book.volumeInfo.imageLinks.smallThumbnail) {
        finalCoverUrl = book.volumeInfo.imageLinks.smallThumbnail;
      }

      if (finalCoverUrl) {
        finalCoverUrl = finalCoverUrl.split("&fife=")[0];

        finalCoverUrl += "&fife=w400";
      }

      setSelectedBookCover(finalCoverUrl);
      setSuggestedBooksByAuthor([]);
    }
  };
  return (
    <div className="flex flex-col w-full items-center py-8 px-4">
      <h2 className="font-ultra text-4xl text-white mb-6 text-center">
        Want to share a quote?
      </h2>
      <form
        onSubmit={handleShareQuote}
        className="w-full max-w-2xl flex flex-col items-center bg-zinc-900 rounded-xl shadow-lg p-8 m-5 border border-zinc-700"
      >
        <textarea
          className="w-full bg-zinc-800 border border-zinc-600 rounded-lg p-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg mb-4 resize-y"
          name="quoteContent"
          id="quoteContent"
          placeholder="Your insightful quote here..."
          value={quoteContent}
          onChange={(e) => setQuoteContent(e.target.value)}
          rows={5}
        ></textarea>

        <div className="flex flex-col sm:flex-row gap-4 w-full mb-6">
          <div className="relative w-full">
            <input
              ref={authorInputRef}
              className="border border-zinc-600 rounded-lg p-3 w-full bg-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              type="text"
              placeholder="Author's Name"
              name="author"
              value={authorSearchTerm}
              autoComplete="off"
              onChange={(e) => {
                setAuthorSearchTerm(e.target.value);
                setFinalAuthor(null);
                setFinalBookTitle(null);
                setSelectedBookCover(null);
                setSelectedFullBook(null);
                setBookNameSearchTerm("");
                setSuggestedBooksByAuthor([]);
              }}
            />
            {authorSearchTerm.trim().length >= 3 &&
              !finalAuthor &&
              (loadingSuggestions ||
                suggestedAuthors.length > 0 ||
                suggestionError) && (
                <div
                  ref={authorSuggestionsRef}
                  className="absolute top-full left-0 right-0 z-20 bg-zinc-700 border border-zinc-600 rounded-b-lg shadow-lg max-h-40 overflow-y-auto mt-1"
                >
                  {loadingSuggestions && (
                    <p className="p-3 text-zinc-400">
                      Searching for authors...
                    </p>
                  )}
                  {suggestionError && (
                    <p className="p-3 text-red-400">{suggestionError}</p>
                  )}
                  {!loadingSuggestions &&
                    suggestedAuthors.length === 0 &&
                    !suggestionError && (
                      <p className="p-3 text-zinc-400">
                        No authors found for "{authorSearchTerm}".
                      </p>
                    )}
                  {suggestedAuthors.map((authorName, index) => (
                    <div
                      key={authorName + index}
                      className="p-3 cursor-pointer hover:bg-zinc-600 border-b border-zinc-600 last:border-b-0 text-white text-sm"
                      onClick={() => handleSelectAuthor(authorName)}
                    >
                      {authorName}
                    </div>
                  ))}
                </div>
              )}
            {suggestionError && (
              <div className="absolute top-full left-0 right-0 z-20 bg-zinc-700 border border-zinc-600 rounded-b-lg shadow-lg max-h-40 overflow-y-auto mt-1">
                <p className="p-3 text-red-400">{suggestionError}</p>
              </div>
            )}
          </div>

          <div className="relative w-full">
            <input
              ref={bookInputRef}
              className="border border-zinc-600 rounded-lg p-3 w-full bg-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-zinc-300"
              type="text"
              placeholder={
                finalAuthor ? `Book Name by ${finalAuthor}` : "Book Name"
              }
              name="source"
              value={bookNameSearchTerm}
              autoComplete="off"
              onChange={(e) => {
                setBookNameSearchTerm(e.target.value);
                setFinalBookTitle(null);
                setSelectedBookCover(null);
                setSelectedFullBook(null);
              }}
              disabled={!finalAuthor}
            />

            {finalAuthor &&
              bookNameSearchTerm.trim().length >= 2 &&
              !selectedFullBook &&
              (loadingSuggestions ||
                suggestedBooksByAuthor.length > 0 ||
                suggestionError) && (
                <div
                  ref={bookSuggestionsRef}
                  className="absolute top-full left-0 right-0 z-10 bg-zinc-700 border border-zinc-600 rounded-b-lg shadow-lg max-h-60 overflow-y-auto mt-1"
                >
                  {loadingSuggestions && (
                    <p className="p-3 text-zinc-400">
                      Searching for books by {finalAuthor}...
                    </p>
                  )}
                  {suggestionError && (
                    <p className="p-3 text-red-400">{suggestionError}</p>
                  )}
                  {!loadingSuggestions &&
                    suggestedBooksByAuthor.length === 0 &&
                    !suggestionError && (
                      <p className="p-3 text-zinc-400">
                        No books found for "{bookNameSearchTerm}" by{" "}
                        {finalAuthor}.
                      </p>
                    )}
                  {suggestedBooksByAuthor.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-600 border-b border-zinc-600 last:border-b-0"
                      onClick={() => handleSelectBook(book)}
                    >
                      {book.volumeInfo?.imageLinks?.thumbnail && (
                        <img
                          src={book.volumeInfo.imageLinks.thumbnail}
                          alt={book.volumeInfo.title}
                          className="w-10 h-10 object-cover rounded-sm flex-shrink-0"
                        />
                      )}
                      <div className="flex-grow">
                        <p className="text-white font-semibold text-sm">
                          {book.volumeInfo?.title || "No Title"}
                        </p>
                        <p className="text-zinc-400 text-xs">
                          Published:{" "}
                          {book.volumeInfo?.publishedDate?.substring(0, 4) ||
                            "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        {(finalAuthor || finalBookTitle) && (
          <p className="text-zinc-300 text-sm mt-2 mb-4">
            Quote by:{" "}
            <span className="font-semibold text-white">
              {finalAuthor || "N/A"}
            </span>
            {finalBookTitle && (
              <span className="text-zinc-500"> - Book: {finalBookTitle}</span>
            )}
          </p>
        )}

        {selectedBookCover && (
          <div className="mt-6 flex flex-col items-center p-3">
            <h3 className="text-lg font-semibold text-white mb-2">
              Selected Book Cover
            </h3>
            <img
              src={selectedBookCover}
              alt={`Cover of ${finalBookTitle || "selected book"}`}
              className="max-w-xs h-auto rounded-md shadow-lg"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Share Quote
        </button>
      </form>
    </div>
  );
}
