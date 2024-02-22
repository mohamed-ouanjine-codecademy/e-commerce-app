import React from "react";
import styles from './CartItem.module.css';
import { Trash } from "../icons/Trash";
import { ImageContainer } from "../ImageContainer/ImageContainer";
import { IncreaseDecreaseButtons } from "../IncreaseDecreaseButtons";

export function CartItem({
  className,
  item,
  onRemove,
  removeItemPending,
  onQuantityChange,
  changeQuantityPending
}) {
  const product = item.productInfo;
  return (
    <>
      <div className={`${className} ${styles.itemContainer} card mb-3 bg-light `}>
        <div className="row g-0">
          <div className="col-4">
            <ImageContainer imageUrl={product.imageUrl} alt={product.name} />
          </div>
          <div className="col-6">
            <div className="card-body row flex-column">
              <h5 className="col-12 card-title">{product.name}</h5>
              <p className="col-12 card-text">{product.description}</p>
              <div className="col-12">
                <IncreaseDecreaseButtons
                  quantity={item.quantity}
                  setQuantity={onQuantityChange}
                  setQuantityPending={changeQuantityPending}
                />
              </div>
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