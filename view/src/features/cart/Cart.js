import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartById, getCartByUserId, removeItemFromCartSync, removeItemFromCartAsync } from './cartSlice';
import { CartItem } from '../../components/cartItem/CartItem';
import { PrototypeProductItem } from '../../components/ProductItem/PrototypeProductItme';

export function Cart() {
  const isSignedIn = useSelector(state => state.signIn.signInFulfilled);
  const userId = useSelector(state => state.userInfo.user.id);
  const cartId = useSelector(state => state.cart.id);
  const items = useSelector(state => state.cart.items);
  const getCartByUserIdPending = useSelector(
    state => state.cart.getCartByUserIdPending
  );
  const getCartByIdPending = useSelector((state) => state.cart.getCartByIdPending);
  const getCartByUserIdFulfilled = useSelector(
    state => state.cart.getCartByUserIdFulfilled
  );
  const getCartByIdFulfilled = useSelector(
    state => state.cart.getCartByIdFulfilled
  );
  const getCartByUserIdRejected = useSelector(
    state => state.cart.getCartByUserIdRejected
  );
  const getCartByIdRejected = useSelector(state => state.cart.getCartByIdRejected);
  //
  const removeItemFromCartAsyncPending = useSelector(
    state => state.cart.removeItemFromCartAsyncPending
  );
  const dispatch = useDispatch();

  // Retrieve cart
  useEffect(() => {
    const getCartByUserIdFunc = async () => {
      await dispatch(getCartByUserId({ userId, include: true }));
    };
    isSignedIn && getCartByUserIdFunc();
  }, []);

  useEffect(() => {
    const getCartByIdFunc = async () => {
      await dispatch(getCartById({ cartId, include: true }));
    };
    (cartId !== 0) && getCartByIdFunc();
  }, [cartId]);


  const renderItems = () => {
    return items.map((item, i) => (
      <div key={i} >
        <CartItem
          className={'col'}
          item={item}
          onRemove={async () => {
            if (cartId !== 0) {
              // if there is a true cart
              await dispatch(removeItemFromCartAsync({ cartId, productId: item.productId }));
            } else {
              // if there is a false cart
              dispatch(removeItemFromCartSync({ productId: item.productId }));
            }
          }}
          removeItemPending={removeItemFromCartAsyncPending}
        />
      </div >
    ));
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <h1 className='col'>My Cart</h1>
        </div>
        <div className='row row-cols-1'>
          {(getCartByUserIdPending || getCartByIdPending) && (
            Array.from({ length: 6 }, (_, i) =>
              <div key={i}>
                <PrototypeProductItem className={'col'}/>
              </div>
            )
          )}
          {renderItems()}
          {getCartByUserIdRejected && <p>Error: {getCartByUserIdRejected}</p>}
          {getCartByIdRejected && <p>Error: {getCartByIdRejected}</p>}
        </div>
      </div>
    </>
  );
}