"use client";

import { moduleApi } from "@/api/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookInfo {
  id: string;
  volumeInfo: {
    title: string;
    authors: [];
    publisher: string;
    publishedDate: string;
    description: string;
    imageLinks: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
  };
}

export default function BookPage() {
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<BookInfo | null>(null);

  const fetchBookInfo = async () => {
    try {
      const data = await moduleApi.fetchBookInfo(id);
      setBook(data);
      console.log(book?.volumeInfo);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookInfo();
  }, [id]);

  if (book && book.volumeInfo.imageLinks.medium) {
    const dateObject = parseISO(book?.volumeInfo.publishedDate);
    const formattedDate = format(dateObject, "dd/MM/yyyy", { locale: ptBR });

    return (
      <div className="flex w-full items-center">
        <div className="flex flex-col w-full items-center gap-3 p-5">
          <Image
            src={book?.volumeInfo.imageLinks.medium}
            alt={""}
            height={250}
            width={250}
          />
          <h1 className="text-2xl font-ultra">{book?.volumeInfo.title}</h1>
          <small>{book.volumeInfo.authors}</small>
          <h2>Publisher: {book.volumeInfo.publisher}</h2>
          <h2>Published in {formattedDate}</h2>
        </div>
      </div>
    );
  }
}
