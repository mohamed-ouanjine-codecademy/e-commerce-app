import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { loadProduct, setQuantityToBuy } from "./productSlice";
import { AddToCartButton } from "../../components/AddToCartButton";
import { Carousel } from "../../components/Carousel";
import { IncreaseDecreaseButtons } from "../../components/IncreaseDecreaseButtons";

export function Product() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('p');
  const {
    isPending: loadProductPending
  } = useSelector(state => state.product.loadProduct);
  const { product, quantityToBuy } = useSelector(state => state.product.data);
  const dispatch = useDispatch();

  useEffect(() => {
    const func = async () => {
      await dispatch(loadProduct({ productId }))
    }
    if (productId && productId != product.id) func();
  }, [dispatch, productId]);

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
                <AddToCartButton product={product} quantity={quantityToBuy}/>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};