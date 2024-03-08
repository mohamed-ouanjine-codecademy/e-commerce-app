import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShippingMethod from "./components/ShippingMethod";
import { getShippingMethods, setSelectedMethodId } from "./shippingMethodsSlice";
import MonoChoiceCardPrototype from "../../components/MonoChoiceCardPrototype";

function ShippingMethods() {
  const shippingMethods = useSelector(state => state.shippingMethods.shippingMethods);
  const selectedMethodId = useSelector(state => state.shippingMethods.sideEffects.selectedMethodId);
  const {
    isPending: getShippingMethodsPending,
    isFulfilled: getShippingMethodsFulfilled
  } = useSelector(state => state.shippingMethods.getShippingMethods);

  const dispatch = useDispatch();

  // Load shipping methods on first render.
  useEffect(() => {
    const getShippingMethodsFunc = async () => {
      await dispatch(getShippingMethods());
    }
    if (!getShippingMethodsFulfilled) getShippingMethodsFunc();
  }, [dispatch, getShippingMethodsFulfilled]);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h2 className="col">Shipping Methods</h2>
        </div>
        <div className="row g-2">
          {
            getShippingMethodsPending ? (
              Array.from({ length: 3 }, ((_, index) =>
                <div className="col-12" key={index}>
                  <MonoChoiceCardPrototype />
                </div>
              ))
            ) : (
              shippingMethods.map(shippingMethod => {
                const shippingMethodId = shippingMethod.id;
                return (
                  <div className="col-12" key={shippingMethodId}>
                    <ShippingMethod
                      shippingMethod={shippingMethod}
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

export default ShippingMethods;