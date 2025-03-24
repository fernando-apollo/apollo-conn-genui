import {useContext} from "react";
import { AppContext } from "../context/appContext.ts";

export const useAppState = () => useContext(AppContext);