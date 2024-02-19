import React from "react";
import styles from "./ImageContainer.module.css";

export function ImageContainer ({ className, imageUrl, alt }) {
  return (
    <>
      <div className={`${className} ${styles.imageContainer}`} style={{ backgroundImage: `url(${imageUrl})`}}>
          <img src={imageUrl} className={`img-fluid rounded-start card-img-top`} alt={alt} />
        </div>
    </>
  );
};