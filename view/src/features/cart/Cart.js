import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCartByUserId, removeItemFromCartSync, removeItemFromCartAsync, updateItemQuantityAsync } from './cartSlice';
import { CartItem } from '../../components/cartItem/CartItem';
import { PrototypeCartItem } from '../../components/cartItem/PrototypeCartItem';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

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
    getCartByUserId: getCartByUserIdError
  } = useSelector(state => state.cart.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieve cart
  useEffect(() => {
    const getCartByUserIdFunc = async () => {
      await dispatch(getCartByUserId({ include: true }));
    };
    (items.length === 0) && getCartByUserIdFunc();
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

  // handle checkout click
  const handleCheckout = () => {
    if (isAuthenticated && items.length > 0) {
      navigate('/checkout');
    }
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row flex-column g-2'>
          <h1 className='col'>My Cart</h1>
          <div className='col row row-cols-1 g-2'>
            {
              getCartByUserIdPending ? (
                Array.from({ length: 6 }, (_, i) =>
                  <div key={i} className='col' style={{ height: '160px' }}>
                    <PrototypeCartItem />
                  </div>
                )
              ) : (
                renderItems()
              )
            }
          </div>
          <h3 className='col'>Total is ${totalAmount}</h3>
          <div className='col'>
            <Button
              value={'Checkout'}
              onClick={handleCheckout}
            />
          </div>
          <div className='col'>
            {getCartByUserIdRejected && <p>Error: {getCartByUserIdError}</p>}
          </div>
        </div>
      </div>
    </>
  );
}