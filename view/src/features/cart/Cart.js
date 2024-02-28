import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartByUserId, removeItemFromCartSync, removeItemFromCartAsync, updateItemQuantityAsync, calcTotalAmount } from './cartSlice';
import { CartItem } from '../../components/cartItem/CartItem';
import { PrototypeCartItem } from '../../components/cartItem/PrototypeCartItem';

export function Cart() {
  const isAuthenticated = useSelector(state => state.signIn.isAuthenticated);
  const cartId = useSelector(state => state.cart.cartId);
  const items = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const {
    isPending: getCartByUserIdPending,
    isRejected: getCartByUserIdRejected
  } = useSelector(state => state.cart.getCartByUserId);
  const {
    isPending: updateItemQuantityAsyncPending
  } = useSelector(state => state.cart.updateItemQuantityAsync);
  const {
    isPending: removeItemFromCartAsyncPending
  } = useSelector(state => state.cart.removeItemFromCartAsync);
  const {
    getCartByUserId: getCartByUserIdError
  } = useSelector(state => state.cart.error);
  const dispatch = useDispatch();

  // Calc cart's total amount whenever the items change.
  useEffect(() => {
    dispatch(calcTotalAmount());
  }, [dispatch, items]);

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
            isAuthenticated ? (
              // if there is a true cart
              await dispatch(removeItemFromCartAsync({ cartId, productId: item.productId }))
            ) : (
              // if there is a false cart
              dispatch(removeItemFromCartSync({ productId: item.productId }))
            )
          }}
          removeItemPending={item.isRemoving}
          onQuantityChange={async (quantity) => {
            if (quantity > 0) {
              if (isAuthenticated) {
                await dispatch(updateItemQuantityAsync({ cartId, productId: item.productId, quantity }))
              }
            }
          }}
          changeQuantityPending={item.changeQuantityPending}
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
        <div className='row row-cols-1 g-2'>
          {(getCartByUserIdPending) && (
            Array.from({ length: 6 }, (_, i) =>
              <div key={i} className='col' style={{ height: '160px' }}>
                <PrototypeCartItem />
              </div>
            )
          )}
          {renderItems()}
          <h3>Total is ${totalAmount}</h3>
          {getCartByUserIdRejected && <p>Error: {getCartByUserIdError}</p>}
        </div>
      </div>
    </>
  );
}