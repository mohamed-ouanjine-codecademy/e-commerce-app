import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCartSync, addItemToCartAsync } from "../features/cart/cartSlice";

export function AddToCartButton({ product }) {
  const isSignedIn = useSelector(state => state.signIn.signInFulfilled);
  const { id: productId } = product;
  const cartId = useSelector((state) => state.cart.id);
  const items = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const productIndex = items.findIndex(item => item.productId === productId);
    if (productIndex === -1) {
      try {
        dispatch(addItemToCartSync({ productId, quantity: 1, productInfo: product }));
        isSignedIn && await dispatch(addItemToCartAsync({ cartId, productId, quantity: 1, include: true }));
        // Handle successful API response here (e.g., display success message)
      } catch (error) {
        // Handle error here (e.g., dispatch a rejected action, display error message)
      }
    }
  };

  return (
    <button
      type="button"
      className="btn btn-primary"
      aria-label="Add to Cart"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};