// import { useGetOpenOrderQuery } from "../reducers/orderproduct";
import { memo, useEffect, useState } from "react";
import { useGetOrderProductQuery, useGetBookByIdQuery } from "../reducers/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteOrderProductMutation } from "../reducers/api";
import { removeFromGuestCart, clearGuestCart } from "../reducers/guestSlice";
import { useDispatch } from "react-redux";
import CartItemDB from "../components/CartItemDB";
import CartItemLS from "../components/CartItemLS";

const ViewCart = () => {
  const { data, isLoading } = useGetOrderProductQuery();
  console.log(data);

  const { refetch } = useGetOrderProductQuery();

  console.log("cart data", data);

  useGetOrderProductQuery();
  const cart = useSelector((state) => state.cart);
  console.log(cart);
  const guestCart = useSelector((state) => state.guestCart);
  console.log(`guest cart`, guestCart);
  const me = useSelector((state) => state.auth.credentials.token);
  console.log("me", me);

  const [removeItem] = useDeleteOrderProductMutation();
  const onDelete = async (id) => {
    await removeItem(id)
      .then(() => {
        console.log("delete");
      })
      .then(() => refetch())
      .catch(() => {
        console.log("error");
      });
  };

  // const loggedIn = false
  const loggedIn = !!me;
  const dispatch = useDispatch();
  const handleRemoveFromGuestCart = (bookId) => {
    dispatch(removeFromGuestCart(bookId));
  };

  const handleClearCart = () => {
    dispatch(clearGuestCart());
  };
  function CheckOutMsg() {
    alert("You have sucessfully placed your order");
  }

  const totalPrice = cart.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );
  const totalGuestPrice = guestCart.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );

  return (
    <div className="content">
      {loggedIn ? (
        <>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#333",
              borderBottom: "2px solid #333",
              paddingBottom: "10px",
              paddingLeft: "10px",
            }}
          >
            My Cart
          </h2>
          <div className="bookContainer">
            {cart.map((i) => (
              <CartItemDB onClickFunc={onDelete} book={i} />
            ))}
          </div>

          <h2 className="totalPrice">Total Price: ¥{totalPrice}</h2>
          <section>
            <Link to="/checkout">Checkout</Link>
          </section>
        </>
      ) : (
        <>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#333",
              borderBottom: "2px solid #333",
              paddingBottom: "10px",
              paddingLeft: "10px",
            }}
          >
            My Cart
          </h2>

          <div className="guestCart">
            {guestCart.map((i) => (
              <CartItemLS onClickFunc={handleRemoveFromGuestCart} book={i} />
            ))}
          </div>

          <h2 className="totalPrice">Total Price: ¥{totalGuestPrice}</h2>
          <button
            className="checkoutBtn"
            style={{
              marginTop: "90px",
              transform: "translateX(40%)",
              height: "100px",
            }}
            onClick={(event) => {
              handleClearCart();
              CheckOutMsg();
            }}
          >
            Guest Checkout
          </button>
        </>
      )}
      <section>
        <Link to="/home">Keep Shopping</Link>
      </section>
    </div>
  );
};

export default ViewCart;
