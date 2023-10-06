import React, { useState } from 'react'
import { useUpdateOrderProductMutation } from "../reducers/api";

function CartItemDB({onClickFunc, book}) {
  const [quantity, setQuantity] = useState(book.quantity);
  const handleDecrement = () => {
    if (quantity > 1){
      setQuantity(prevCount => prevCount -1 );
    }
  }
  const handleIncrement = () => {
    if (quantity < 100){
      setQuantity(prevCount => prevCount +1 );
    }
  }
 

const {refetch} =  useUpdateOrderProductMutation();
const [updateItem] = useUpdateOrderProductMutation();
const onUpdate = async (id,qty) => {
  console.log("qty", quantity)
  await updateItem({id:book.id,body:{qty}}) .then(() => {
    console.log("update");
  }).then(()=> refetch())
  .catch(() => {
    console.log("error");
  });
};

  return (
    <div>
    <h2>Title:{book.title}</h2>
    <div className="input">
      <button onClick={handleDecrement}>-</button>
      <div>{quantity}</div>
      <button type='button' onClick={handleIncrement}>+</button>
      <button onClick={()=> onUpdate(book.id,quantity)}>Update Item</button>
    </div>
    <h2>Price: ¥{book.price}</h2>
    <button onClick={() => onClickFunc(book.id)}>Remove Item</button>
  </div>
  )
}

export default CartItemDB
