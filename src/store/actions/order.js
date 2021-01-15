import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData,
  };
};

export const purchaseBurgerFailed = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAILED,
    error: error,
  };
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START,
  };
};

export const purchaseBurger = (orderData) => {
  return (dispatch) => {
    dispatch(purchaseBurgerStart());
    axios
      .post("/orders.json", orderData)
      .then((resp) => {
        dispatch(purchaseBurgerSuccess(resp.data.name, orderData));
      })
      .catch((err) => {
        dispatch(purchaseBurgerFailed(err));
      });
  };
};

export const fetchOrdersSuccess = (fetchedOrders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: fetchedOrders,
  };
};

export const fetchOrdersFailed = (error) => {
  
  return {
    type: actionTypes.FETCH_ORDERS_FAILED,
    error: error,
  };
};

const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START,
  };
};

export const fetchOrders = () => {
  return (dispatch) => {
    dispatch(fetchOrdersStart())
    axios
      .get("/orders.json")
      .then((resp) => {
        const fetchedOrders = [];
        for (let key in resp.data) {
          fetchedOrders.push({ ...resp.data[key], id: key });
        }
        //console.log(fetchedOrders);
        dispatch(fetchOrdersSuccess(fetchedOrders));
      })
      .catch((error) => {
        dispatch(fetchOrdersFailed(error));
        console.log(error);
      });
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT,
  };
};
