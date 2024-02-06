import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartById, getCartByUserId } from './cartSlice';
import { CartItem } from '../../components/cartItem/CartItem';
import { PrototypeProductItem } from '../../components/ProductItem/PrototypeProductItme';
import { Navigate } from 'react-router-dom';

export function Cart() {
  const isSignedIn = useSelector((state) => state.signIn.signInFulfilled);
  const userId = useSelector((state) => state.userInfo.user.id);
  const cartId = useSelector((state) => state.cart.id);
  const items = useSelector((state) => state.cart.items);
  const getCartByUserIdPending = useSelector(
    (state) => state.cart.getCartByUserIdPending
  );
  const getCartByIdPending = useSelector((state) => state.cart.getCartByIdPending);
  const getCartByUserIdFulfilled = useSelector(
    (state) => state.cart.getCartByUserIdFulfilled
  );
  const getCartByIdFulfilled = useSelector(
    (state) => state.cart.getCartByIdFulfilled
  );
  const getCartByUserIdRejected = useSelector(
    (state) => state.cart.getCartByUserIdRejected
  );
  const getCartByIdRejected = useSelector((state) => state.cart.getCartByIdRejected);
  const dispatch = useDispatch();

  // Retrieve cart
  useEffect(() => {
    const getCartByUserIdFunc = async () => {
      await dispatch(getCartByUserId({ userId }));
    };
    getCartByUserIdFunc();
  }, []);

  useEffect(() => {
    const getCartByIdFunc = async () => {
      if (cartId) {
        await dispatch(getCartById({ cartId, include: true }));
      }
    };
    getCartByIdFunc();
  }, [cartId]);

  const renderItems = () => {
    if (getCartByIdFulfilled) {
      return items.map((item, i) => (
        <div key={i}>
          <CartItem item={item} />
        </div>
      ));
    } else {
      return null; // Or a placeholder if needed
    }
  };

  if (!isSignedIn) {
    return <Navigate to="/user/sign-in" />;
  }

  return (
    <>
      <h1>My Cart</h1>
      {(getCartByUserIdPending || getCartByIdPending) && (
        Array.from({ length: 6 }, (_, i) =>
          <div key={i}>
            <PrototypeProductItem />
          </div>
        )
      )}
      {renderItems()}
      {getCartByUserIdRejected && <p>Error: {getCartByUserIdRejected.message}</p>}
      {getCartByIdRejected && <p>Error: {getCartByIdRejected.message}</p>}
    </>
  );
}