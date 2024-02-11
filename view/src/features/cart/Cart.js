import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartByUserId, removeItemFromCartSync, removeItemFromCartAsync } from './cartSlice';
import { CartItem } from '../../components/cartItem/CartItem';
import { PrototypeCartItem } from '../../components/cartItem/PrototypeCartItem';

export function Cart() {
  const cartId = useSelector(state => state.cart.id);
  const items = useSelector(state => state.cart.items);
  const {
    getCartByUserIdPending,
    removeItemFromCartAsyncPending
  } = useSelector(state => state.cart.isPending);
  const {
    getCartByUserIdFulfilled
  } = useSelector(state => state.cart.isFulfilled);
  const {
    getCartByUserIdRejected
  } = useSelector(state => state.cart.isRejected);

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
        <div className='row row-cols-1 g-3'>
          {(getCartByUserIdPending) && (
            Array.from({ length: 6 }, (_, i) =>
              <div key={i} className='col' style={{ height: '160px'}}>
                <PrototypeCartItem />
              </div>
            )
          )}
          {items.length !== 0 && renderItems()}
          {getCartByUserIdRejected && <p>Error: {getCartByUserIdRejected}</p>}
        </div>
      </div>
    </>
  );
}