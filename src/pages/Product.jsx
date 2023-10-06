import React, { useState } from "react";
import {
  useCreateOrderProductMutation,
  useGetOrderProductQuery,
} from "../reducers/api";
import { addToGuestCart } from "../reducers/guestSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Product({ book }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [createOrderProduct] = useCreateOrderProductMutation();
  const { refetch } = useGetOrderProductQuery();

  const me = useSelector((state) => state.auth.credentials);
  const loggedIn = !!me;
  console.log(me);

  const guestAddToCart = (book) => {
    dispatch(addToGuestCart(book));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevCount) => prevCount - 1);
    }
  };
  const handleIncrement = () => {
    if (quantity < 10) {
      setQuantity((prevCount) => prevCount + 1);
    }
  };
  return (
    <div>
      <Link to={`/book/${book.id}`}>
        <h2>{book.title}</h2>
      </Link>
      <h4>{book.author}</h4>
      <p>{book.description}</p>
      <p>¥{book.price}</p>

      <div className="input">
        <button type="button" onClick={handleDecrement}>
          -
        </button>
        <div>{quantity}</div>
        <button type="button" onClick={handleIncrement}>
          +
        </button>
      </div>
      <button
        onClick={async () => {
          if (loggedIn) {
            console.log("hit");
            await createOrderProduct({
              booksId: book.id,
              quantity: quantity,
              price: book.price,
              title: book.title,
            });
            refetch();
          } else {
            dispatch(addToGuestCart(book));
          }
        }}
      >
        Add To Cart
      </button>
    </div>
  );
}

export default Product;