import React from 'react';
import styles from './ProductItem.module.css';
import { AddToCartButton } from '../AddToCartButton';
import { createSearchParams, useNavigate } from 'react-router-dom';

export function ProductItem({ className, product, onAddItemToCart }) {
  const navigate = useNavigate();

  const handleProductItemClick = (e) => {
    e.preventDefault();
    const searchQueryString = createSearchParams({ p: product.id });
    navigate({
      pathname: '/product',
      search: `?${searchQueryString}`
    });
  }

  return (
    <>
      <div className={`${className} card ${styles.itemContainer}`} onClick={handleProductItemClick}>
        <div className={`${styles.imageContainer}`} style={{ backgroundImage: `url(${product.imageUrl})`}}>
          <img src={product.imageUrl} className={`${styles.image} card-img-top`} alt={product.name} />
        </div>
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{product.price}</h6>
          <p className="card-text">{product.description}</p>
          <AddToCartButton product={product} onAddItemToCart={onAddItemToCart}/>
        </div>
      </div>
    </>
  );
}
