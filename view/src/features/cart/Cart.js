import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartByUserId, removeItemFromCartSync, removeItemFromCartAsync } from './cartSlice';
import { CartItem } from '../../components/cartItem/CartItem';
import { PrototypeCartItem } from '../../components/cartItem/PrototypeCartItem';

export function Cart() {
  const isAuthenticated = useSelector(state => state.signIn.isAuthenticated);
  const cartId = useSelector(state => state.cart.cartId);
  const items = useSelector(state => state.cart.items);
  const {
    isPending: getCartByUserIdPending,
    isRejected: getCartByUserIdRejected
  } = useSelector(state => state.cart.getCartByUserId);
  const {
    isPending: removeItemFromCartAsyncPending
  } = useSelector(state => state.cart.removeItemFromCartAsync);
  const {
    getCartByUserId: getCartByUserIdError
  } = useSelector(state => state.cart.error);
  const dispatch = useDispatch();

  // Retrieve cart
  useEffect(() => {
    const getCartByUserIdFunc = async () => {
      await dispatch(getCartByUserId({ include: true }));
    };
    getCartByUserIdFunc();
  }, [dispatch]);

  const renderItems = () => {
    return items.map((item, i) => (
      <div key={i} className='col'>
        <CartItem
          item={item}
          onRemove={async () => {
              // if there is a true cart
              isAuthenticated && await dispatch(removeItemFromCartAsync({ cartId, productId: item.productId }));
              // if there is a false cart
              dispatch(removeItemFromCartSync({ productId: item.productId }));
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
        <div className='row row-cols-1 g-3'>
          {(getCartByUserIdPending) && (
            Array.from({ length: 6 }, (_, i) =>
              <div key={i} className='col' style={{ height: '160px'}}>
                <PrototypeCartItem />
              </div>
            )
          )}
          {renderItems()}
          {getCartByUserIdRejected && <p>Error: {getCartByUserIdError}</p>}
        </div>
      </div>
    </>
  );
}