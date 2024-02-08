import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProducts } from "./productListSlice";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import { PrototypeProductItem } from "../../components/ProductItem/PrototypeProductItme";

export function ProductList() {
  const products = useSelector(state => state.productList.products);
  const loadProductsPending = useSelector(state => state.productList.loadProductsPending);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!products.length) {
      dispatch(loadProducts());
    }
  }, [products, dispatch]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h2 className="col">Products</h2>
        </div>
        <div className={`row g-3 row-cols-2 row-cols-md-3 row-cols-lg-4`}>
          {
            loadProductsPending ? (

              Array.from({ length: 8 }, (_, i) =>
                <div className="col" key={i}>
                  <PrototypeProductItem />
                </div>
              )
            ) : (
              products.map(product => {
                return (
                  <div className="col" key={product.id}>
                    <ProductItem product={product} />
                  </div>
                )
              })
            )
          }
        </div>
      </div>
    </>
  )
}