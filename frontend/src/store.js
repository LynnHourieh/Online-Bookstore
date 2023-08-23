import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  cart: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  productInfo: {
    products: {},
    loading: true,
    error: "",
  },
  wishlist: {
    wishlistItems: localStorage.getItem("wishlistItems")
      ? JSON.parse(localStorage.getItem("wishlistItems"))
      : [],
  },
};
function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "Fetch_REQUEST":
      return {
        ...state,
        productInfo: { ...state.productInfo, loading: true },
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        productInfo: {
          ...state.productInfo,
          products: payload,
          loading: false,
        },
      };
    case "FETCH_FAIL":
      return {
        ...state,
        productInfo: {
          ...state.productInfo,
          error: payload,
          loading: false,
        },
      };
      
    case "CART_ADD_ITEM":
      // add to cart
      const newItem = payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case "ADD_ITEM_TO_WISHLIST":
      const newproduct = payload;
      const existproduct = state.wishlist.wishlistItems.find(
        (item) => item._id === newproduct._id
      );
      const wishlistItems = existproduct
        ? state.wishlist.wishlistItems.map((item) =>
            item._id === existproduct._id ? newproduct : item
          )
        : [...state.wishlist.wishlistItems, newproduct];
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
      return { ...state, wishlist: { ...state.wishlist, wishlistItems } };
    case "REMOVE_ITEM_FROM_WISHLIST":{const wishlistItems = state.wishlist.wishlistItems.filter(
        (item) => item._id !== payload._id
      );
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
      return { ...state, wishlist: { ...state.wishlist, wishlistItems } };}
      
    case "USER_SIGNIN":
      return { ...state, userInfo: payload };

    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {} },
        wishlist:{wishlistItems:[]}
      };
    case "SAVE_SHIPPING_ADDRESS":
      return { ...state, cart: { ...state.cart, shippingAddress: payload } };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
