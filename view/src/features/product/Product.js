import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { loadProduct } from "./productSlice";
import { AddToCartButton } from "../../components/AddToCartButton";
import { Carousel } from "../../components/Carousel";
import { IncreaseDecreaseButtons } from "../../components/IncreaseDecreaseButtons";

export function Product() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get('p');
  const {
    isPending: loadProductPending
  } = useSelector(state => state.product.loadProduct);
  const product = useSelector(state => state.product.data);
  const dispatch = useDispatch();

  useEffect(() => {
    const func = async () => {
      await dispatch(loadProduct({ productId }))
    }
    if (productId) func();
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
              <div className="col-12">
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};