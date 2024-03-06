import React from "react";

function HouseAdd({ onClick, size }) {
  return (
    <>
      <i className="btn bi bi-house-add" onClick={onClick} style={{ fontSize: size }}></i>
    </>
  );
};

export default HouseAdd;