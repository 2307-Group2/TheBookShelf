import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {
  useDeleteBookMutation,
  useEditBookMutation,
} from "../../../reducers/api";
import { useState } from "react";

function BookCard({ book, onEdited, onDeleted }) {
  const [deleteBook] = useDeleteBookMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editBook] = useEditBookMutation();

  const [updatedTitle, setUpdatedTitle] = useState(book.title);
  const [updatedAuthor, setUpdatedAuthor] = useState(book.author);
  const [updatedPrice, setUpdatedPrice] = useState(book.price);
  const [updatedDescription, setUpdatedDescription] = useState(
    book.description
  );
  const [updatedPublisher, setUpdatedPublisher] = useState(book.publisher);
  const [updatedPublishDate, setUpdatedPublishDate] = useState(
    book.publish_date
  );
  const [updatedGenre, setUpdatedGenre] = useState(book.genre);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteClick = async () => {
    try {
      await deleteBook(book.id);
      onDeleted();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!updatedTitle || !updatedAuthor || !updatedPrice) {
      alert("Please fill in the mandatory fields: Title, Author, and Price.");
      return;
    }

    try {
      await editBook({
        id: book.id,
        title: updatedTitle,
        author: updatedAuthor,
        price: updatedPrice,
        description: updatedDescription,
        publisher: updatedPublisher,
        publish_date: updatedPublishDate,
        genre: updatedGenre,
      });
      alert("Book edited successfully!");
      onEdited && onEdited();
      toggleEdit();
    } catch (error) {
      console.error("Error editing book:", error);
      alert("Error editing book. Please try again.");
    }
  };

  return (
    <Card className="mb-4">
      {isEditing ? (
        <Form onSubmit={handleEditSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formAuthor">
            <Form.Label>Author</Form.Label>
            <Form.Control
              value={updatedAuthor}
              onChange={(e) => setUpdatedAuthor(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={updatedPrice}
              onChange={(e) => setUpdatedPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPublisher">
            <Form.Label>Publisher</Form.Label>
            <Form.Control
              value={updatedPublisher}
              onChange={(e) => setUpdatedPublisher(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPublish_date">
            <Form.Label>Publish Date</Form.Label>
            <Form.Control
              value={updatedPublishDate}
              onChange={(e) => setUpdatedPublishDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formGenre">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              value={updatedGenre}
              onChange={(e) => setUpdatedGenre(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" type="submit">
            Save
          </Button>
          <Button variant="secondary" onClick={toggleEdit}>
            Cancel
          </Button>
        </Form>
      ) : (
        <>
          <Card.Header>{book.title}</Card.Header>
          <Card.Body>
            <Card.Text>Author: {book.author}</Card.Text>
            <Card.Text>Price: {book.price}</Card.Text>
            <Card.Text>Publisher: {book.publisher}</Card.Text>
            <Card.Text>Publish Date: {book.publish_date}</Card.Text>
            <Card.Text>Genre: {book.genre}</Card.Text>
            <Card.Text>Description: {book.description}</Card.Text>
            <Button className="mr-2" variant="warning" onClick={toggleEdit}>
              Edit Book
            </Button>
            <Button
              onClick={handleDeleteClick}
              className="adminButton"
              variant="danger"
              style={{ marginLeft: "10px" }}
            >
              Delete Book
            </Button>
          </Card.Body>
        </>
      )}
    </Card>
  );
}

export default BookCard;
