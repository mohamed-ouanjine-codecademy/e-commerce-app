import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCartAsync } from "../features/cart/cartSlice";
import { setIntendedDestination } from "../features/intendedDestination/intendedDestinationSlice";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

export function AddToCartButton({ product, quantity }) {
  const { pathname, search } = useLocation();
  const isAuthenticated = useSelector(state => state.signIn.isAuthenticated);
  const { id: productId } = product;
  const items = useSelector(state => state.cart.items);
  const {
    isPending: addItemToCartAsyncPending
  } = useSelector(state => state.cart.addItemToCartAsync);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const productIndex = items.findIndex(item => item.productId === productId);
    if (productIndex === -1) {
      if (!isAuthenticated) {
        const searchQueryString = createSearchParams({ p: productId });
        dispatch(setIntendedDestination({ pathname: '/product', search: searchQueryString}));
        navigate('/user/sign-in');
      }
      if (isAuthenticated) await dispatch(addItemToCartAsync({ productId, quantity, include: true }));
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
