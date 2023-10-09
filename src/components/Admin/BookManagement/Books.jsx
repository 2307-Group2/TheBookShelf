import { useState } from "react";
import {
  useGetBooksQuery,
  useEditBookMutation,
  useAddBookMutation,
  useDeleteBookMutation,
} from "../../../reducers/api";
import BookCard from "./BooksCard";
import Button from "react-bootstrap/Button";
import AddBookForm from "./AddBookForm";

function Books() {
  const { data, isLoading, refetch } = useGetBooksQuery();
  const [isAddingBook, setIsAddingBook] = useState(false);
  // const [editBook] = useEditBookMutation();
  console.log("book", data);

  const handleBookEdited = () => {
    refetch();
  };

  return (
    <div className="container mt-5">
      <h2 className="display-4">The Bookshelf Inventory</h2>
      {isAddingBook ? (
        <AddBookForm onBookAdded={refetch} />
      ) : (
        <Button
          className="btn btn-primary mb-3"
          onClick={() => setIsAddingBook(true)}
        >
          Add New Book
        </Button>
      )}
      {isLoading ? (
        <h1 className="my-3">Loading...</h1>
      ) : data.length === 0 ? (
        <h1 className="my-3">No Books Found</h1>
      ) : (
        data.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdited={handleBookEdited}
            onDeleted={refetch}
          />
        ))
      )}
    </div>
  );
}
export default Books;
