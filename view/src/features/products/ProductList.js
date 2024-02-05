import React, { useEffect } from "react";
import styles from './ProductList.module.css';
import { useDispatch, useSelector } from "react-redux";
import { loadProducts } from "./productListSlice";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import { PrototypeProductItem } from "../../components/ProductItem/PrototypeProductItme";

export function ProductList() {
  const products = useSelector(state => state.productList.products);
  const loadProductsPending = useSelector(state => state.productList.loadProductsPending);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProducts());
  }, []);

  return (
    <>
      <div className="container-fluid py-3">
        <div className="row">
          <h2 className="col">Products</h2>
        </div>
        <div className={`row ${styles.productsContainer}`}>
          {
            loadProductsPending ? (

              Array.from({ length: 6 }, (_, i) =>
                <div className="p-0" key={i}>
                  <PrototypeProductItem />
                </div>
              )
            ) : (
              products.map(product => {
                return (
                  <div className="p-0" key={product.id}>
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