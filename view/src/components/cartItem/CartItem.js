import React from "react";
import styles from './CartItem.module.css';
import { Trash } from "../icons/Trash";
import { ImageContainer } from "../ImageContainer/ImageContainer";

export function CartItem({ className, item, onRemove, removeItemPending }) {
  const product = item.productInfo;
  return (
    <>
      <div className={`${className} ${styles.itemContainer} card mb-3 bg-light `}>
        <div className="row g-0">
          <div className="col-4">
            <ImageContainer imageUrl={product.imageUrl} alt={product.name} />
          </div>
          <div className="col-6">
            <div className="row card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">{product.description}</p>
              <h6 className="card-subtitle mb-2 text-body-secondary">Quantity: {item.quantity}</h6>
            </div>
          </div>
          <div className="col-2 d-flex flex-column align-items-center justify-content-between">
            <div>
              <Trash onRemove={onRemove} removeItemPending={removeItemPending} />
            </div>
            <div>
              <h6 className="card-subtitle mb-2 text-body-secondary">{product.price}</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};