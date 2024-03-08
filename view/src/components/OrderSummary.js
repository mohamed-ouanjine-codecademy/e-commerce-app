import React from "react";
import { Pencil } from "./icons/Pencil";

function OrderSummary({
  items,
  subTotal,
  onItemsEdit,
  shippingAddress,
  onShippingAddressEdit,
  deliveryMethod,
  onDeliveryMethodEdit,
  totalCost
}) {
  const renderItems = () => {
    return items.map(item => {
      const quantity = item.quantity;
      const price = parseFloat(item.productInfo.price.replace(/[$,]/g, ''));
      return (
        <div className="col-12" key={item.productId}>
          <div className="row">
            <p className="col m-1">{item.productInfo.name}</p>
            <p className="col m-1">{`${quantity} x $${price} = $${quantity * price}`}</p>
          </div>
        </div>
      )
    })
  }
  console.log(typeof deliveryMethod.price);
  console.log(typeof subTotal);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h2 className="col">Order Summary</h2>
        </div>
        <div className="row mb-2 p-2 border-bottom border-primary border-2">
          <h3 className="col-10">Items</h3>
          <div className="col-2">
            <Pencil onClick={onItemsEdit}/>
          </div>
          {renderItems()}
        </div>
        <div className="row mb-2 p-2 border-bottom border-primary border-2">
          <h3 className="col-10">Shipping Address</h3>
          <div className="col-2">
            <Pencil onClick={onShippingAddressEdit}/>
          </div>
          <div className="col-6">{shippingAddress.name}</div>
          <div className="col-6">
            {`${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}`}
          </div>
        </div>
        <div className="row mb-2 p-2 border-bottom border-primary border-2">
          <h3 className="col-10">Delivery Method</h3>
          <div className="col-2">
            <Pencil onClick={onDeliveryMethodEdit}/>
          </div>
          <div className="col-6">{deliveryMethod.name}</div>
          <div className="col-6">
            {(deliveryMethod.price === 0) ? 'Free' : `$${deliveryMethod.price}`}
          </div>
        </div>
        <div className="row">
          <h3 className="col-12">Total</h3>
          <div className="col-6">
            {items.length > 1 ? 'Items cost' : "Item's cost"}
          </div>
          <div className="col-6">{`$${subTotal}`}</div>
          <div className="col-6">Delivery cost</div>
          <div className="col-6">
            {(deliveryMethod.price === 0) ? 'Free' : `$${deliveryMethod.price}`}
          </div>
          <div className="col-6" style={{ fontWeight: 'bold' }}>Total cost</div>
          <div className="col-6" style={{ fontWeight: 'bold' }}>{`$${totalCost}`}</div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;