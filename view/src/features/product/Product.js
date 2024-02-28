import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProduct, setQuantityToBuy } from "./productSlice";
import { Button } from "../../components/Button";
import { Carousel } from "../../components/Carousel";
import { IncreaseDecreaseButtons } from "../../components/IncreaseDecreaseButtons";
import { addItemToCartAsync } from "../cart/cartSlice";
import { setIntendedDestination } from "../intendedDestination/intendedDestinationSlice";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

export function Product() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('p');
  const isAuthenticated = useSelector(state => state.signIn.isAuthenticated);
  const items = useSelector(state => state.cart.items);
  const {
    isPending: addItemToCartAsyncPending
  } = useSelector(state => state.cart.addItemToCartAsync);
  const {
    isPending: loadProductPending
  } = useSelector(state => state.product.loadProduct);
  const { product, quantityToBuy } = useSelector(state => state.product.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load product info
  useEffect(() => {
    const func = async () => {
      await dispatch(loadProduct({ productId }))
    }
    if (productId && productId != product.id) func();
  }, [dispatch, productId]);

  // Handle add to cart button click
  const handleAddToCartClick = async () => {
    const productIndex = items.findIndex(item => item.productId === productId);
    if (productIndex === -1) {
      if (!isAuthenticated) {
        const searchQueryString = createSearchParams({ p: productId });
        dispatch(setIntendedDestination({ pathname: '/product', search: searchQueryString }));
        navigate('/user/sign-in');
      }
      if (isAuthenticated) await dispatch(addItemToCartAsync({ productId, quantity: quantityToBuy, include: true }));
    }
  }

  return (
    <>
      {
        loadProductPending ? (
          <p>Pending...</p>
        ) : (
          <div className="container-fluid">
            <div className="row g-2 flex-column">
              <div className="col">
                <h1>{product.name}</h1>
                <p>{product.price}</p>
              </div>
              <div className="col">
                <Carousel
                  images={[product.imageUrl, product.imageUrl]}
                />
              </div>
              <div className="col">
                <p className="m-0">{product.description}</p>
              </div>
              <div className="col-5">
                <IncreaseDecreaseButtons
                  quantity={quantityToBuy}
                  setQuantity={(quantity) => dispatch(setQuantityToBuy(quantity))}
                />
              </div>
              <div className="col-12">
                <Button
                  value={'Add to Cart'}
                  onClick={handleAddToCartClick}
                  isPending={addItemToCartAsyncPending}
                />
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};