import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { loadProduct } from "./productSlice";
import { ImageContainer } from "../../components/ImageContainer/ImageContainer";
import { AddToCartButton } from "../../components/AddToCartButton";

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
                <ImageContainer imageUrl={product.imageUrl} alt={product.name} />
              </div>
              <div className="col">
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};