import React from 'react';
import styles from './ProductItem.module.css';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { ImageContainer } from '../ImageContainer/ImageContainer';

export function ProductItem({ className, product }) {
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
        <ImageContainer imageUrl={product.imageUrl} alt={product.name}/>
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{product.price}</h6>
        </div>
      </div>
    </>
  );
}
