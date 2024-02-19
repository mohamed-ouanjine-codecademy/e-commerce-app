import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCartSync, addItemToCartAsync } from "../features/cart/cartSlice";

export function AddToCartButton({ product }) {
  const isAuthenticated = useSelector(state => state.signIn.isAuthenticated);
  const { id: productId } = product;
  const items = useSelector(state => state.cart.items);
  const {
    isPending: addItemToCartAsyncPending
  } = useSelector(state => state.cart.addItemToCartAsync);
  const dispatch = useDispatch();

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const productIndex = items.findIndex(item => item.productId === productId);
    if (productIndex === -1) {
      if (!isAuthenticated) dispatch(addItemToCartSync({ productId, quantity: 1, productInfo: product }));
      if (isAuthenticated) await dispatch(addItemToCartAsync({ productId, quantity: 1, include: true }));
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary w-100"
        aria-label="Add to Cart"
        onClick={handleAddToCart}
      >
        {
          addItemToCartAsyncPending ? 'Pending...' : 'Add to Cart'
        }
      </button>
    </>
  );
};
