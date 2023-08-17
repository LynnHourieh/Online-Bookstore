import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../../store";

export default function AdminRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />;
}


//Check if the route is for admin only 
//if not then go to signin 