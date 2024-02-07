import React from "react";
import styles from './CartItem.module.css';

export function CartItem({ className, item }) {
  const product = item.productInfo;
  return (
    <>
      <div className={`${className} ${styles.itemContainer} card mb-3`}>
        <div className="row g-0">
          <div className={`col-4 ${styles.imageContainer}`}>
            <img src={product.imageUrl} className="img-fluid rounded-start" alt={product.name} />
          </div>
          <div className="col-8">
            <div className="card-body row">
              <div className="col-9">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <h6 className="card-subtitle mb-2 text-body-secondary">Quantity: {item.quantity}</h6>
              </div>
              <div className="col-3 align-self-end">
                <h6 className="card-subtitle mb-2 text-body-secondary">{product.price}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};