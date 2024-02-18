import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { loadProduct } from "./productSlice";

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
            <h1>{product.name}</h1>
          </div>
        )
      }
    </>
  );
};