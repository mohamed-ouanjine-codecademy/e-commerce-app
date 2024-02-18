import React from "react";
import styles from './CartItem.module.css';
import { Trash } from "../icons/Trash";

export function CartItem({ className, item, onRemove, removeItemPending }) {
  const product = item.productInfo;
  return (
    <>
      <div className={`${className} ${styles.itemContainer} card mb-3 bg-light `}>
        <div className="row g-0">
          <div className={`col-4 ${styles.imageContainer}`}>
            <img src={product.imageUrl} className="img-fluid rounded-start" alt={product.name} />
          </div>
          <div className="col-8">
            <div className="row card-body">
              <div className="col-9 p-0">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <h6 className="card-subtitle mb-2 text-body-secondary">Quantity: {item.quantity}</h6>
              </div>
              <div className="col-3 p-0">
                <div className="d-flex flex-column justify-content-between">
                  <div className="align-self-center p-1">
                    <Trash onRemove={onRemove} removeItemPending={removeItemPending} />
                  </div>
                  <div className="align-self-center">
                    <h6 className="card-subtitle mb-2 text-body-secondary">{product.price}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};