import { useContext } from "react";
import AppContext from "./context.js";

const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used inside AppProvider.");
    return context;
};

export default useApp;
