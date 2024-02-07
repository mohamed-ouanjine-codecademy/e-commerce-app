import React from 'react';
import { AddToCartButton } from '../AddToCartButton';

export function ProductItem({ className, product }) {
  return (
    <>
      <div className={`${className} card`} >
          <img src={product.imageUrl} className="card-img-top" alt={product.name} />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{product.price}</h6>
          <p className="card-text">{product.description}</p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </>
  );
}
