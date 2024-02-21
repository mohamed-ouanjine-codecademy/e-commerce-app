import React from 'react';

export function Carousel({ images, activeCarousel = 0 }) {
  return (
    <div id="productShow" className="carousel slide">
      <div className="carousel-indicators">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#productShow"
            data-bs-slide-to={i}
            className={activeCarousel === i ? 'active' : ''}
            aria-current={activeCarousel === i ? 'true' : undefined}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((image, i) => (
          <div
            key={i}
            className={`carousel-item ${activeCarousel === i ? 'active' : ''}`}
          >
            <img src={image} className="rounded d-block w-100" alt={`Slide ${i + 1}`} />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#productShow"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#productShow"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
