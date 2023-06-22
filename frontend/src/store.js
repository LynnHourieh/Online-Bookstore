import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
};
function reducer(state, action) {
    const{type,payload}=action
  switch (type) {
    case "CART_ADD_ITEM":
      // add to cart
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [...state.cart.cartItems, payload],
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
