import React from 'react';
import placeholderImage from '../../logo.svg';

export function PrototypeProductItem({ className }) {
  return (
    <>
      {/* <div class={`${className} card`} aria-hidden="true">
        <img src="..." class="card-img-top" alt="..." />
        <div class="card-body placeholder-wave">
          <h5 class="card-title">
            <span className='placeholder col-6'></span>
          </h5>
          <h6 class="card-subtitle mb-2 text-body-secondary"></h6>
          <p class="card-text">
          <span className='placeholder col-7 placeholder-xs'></span>
          <span className='placeholder col-4 placeholder-xs'></span>
          <span className='placeholder col-4 placeholder-xs'></span>
          <span className='placeholder col-6 placeholder-xs'></span>
          <span className='placeholder col-8 placeholder-xs'></span>
          </p>
          <a href="#" class="btn btn-primary disabled placeholder" aria-disabled="true">Add to Cart</a>
        </div>
      </div> */}
      <div className={`${className} card`} aria-hidden="true">
        <img src={placeholderImage} className="card-img-top" alt="placeholder image" />
        <div className="card-body">
          <h5 className="card-title placeholder-glow">
            <span className="placeholder col-6"></span>
          </h5>
          <p className="card-text placeholder-glow">
            <span className="placeholder col-7 placeholder-sm"></span>
            <span className="placeholder col-4 placeholder-sm"></span>
            <span className="placeholder col-4 placeholder-sm"></span>
            <span className="placeholder col-6 placeholder-sm"></span>
          </p>
        </div>
      </div>
    </>
  );
}