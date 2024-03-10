import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeliveryMethod from "./components/DeliveryMethod";
import { getDeliveryMethods, setSelectedMethodId } from "./deliveryMethodsSlice";
import MonoChoiceCardPrototype from "../../components/MonoChoiceCardPrototype";

function DeliveryMethods() {
  const deliveryMethods = useSelector(state => state.deliveryMethods.deliveryMethods);
  const selectedMethodId = useSelector(state => state.deliveryMethods.sideEffects.selectedMethodId);
  const {
    isPending: getDeliveryMethodsPending,
    isFulfilled: getDeliveryMethodsFulfilled
  } = useSelector(state => state.deliveryMethods.getDeliveryMethods);

  const dispatch = useDispatch();

  // Load shipping methods on first render.
  useEffect(() => {
    const getDeliveryMethodsFunc = async () => {
      await dispatch(getDeliveryMethods());
    }
    if (!getDeliveryMethodsFulfilled) getDeliveryMethodsFunc();
  }, [dispatch, getDeliveryMethodsFulfilled]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h2 className="col">Shipping Methods</h2>
        </div>
        <div className="row g-2">
          {
            getDeliveryMethodsPending ? (
              Array.from({ length: 3 }, ((_, index) =>
                <div className="col-12" key={index}>
                  <MonoChoiceCardPrototype />
                </div>
              ))
            ) : (
              deliveryMethods.map(deliveryMethod => {
                const shippingMethodId = deliveryMethod.id;
                return (
                  <div className="col-12" key={shippingMethodId}>
                    <DeliveryMethod
                      deliveryMethod={deliveryMethod}
                      isSelected={selectedMethodId === shippingMethodId}
                      onSelectMethod={() => dispatch(setSelectedMethodId(shippingMethodId))}
                    />
                  </div>
                )
              })
            )
          }
        </div>
      </div>
    </>
  );
};

export default DeliveryMethods;