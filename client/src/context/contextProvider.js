import * as React from "react";
import { createContext, useContext } from "react";

const initialState = {
  user: {},
};

const roomDataContext = React.createContext();
