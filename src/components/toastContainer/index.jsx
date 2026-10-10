import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import useApp from "../../context/useApp.js";
import styles from "./styles.module.css";

const icons = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo };

const ToastItem = ({ toast, onDismiss }) => {
    useEffect(() => {
        const timer = window.setTimeout(() => onDismiss(toast.id), 5200);
        return () => window.clearTimeout(timer);
    }, [onDismiss, toast.id]);
    const Icon = icons[toast.type] || FiInfo;
    return <div className={`${styles.toast} ${styles[toast.type] || ""}`} role={toast.type === "error" ? "alert" : "status"}>
        <Icon aria-hidden="true" />
        <p>{toast.message}</p>
        <button type="button" aria-label="Dismiss notification" onClick={() => onDismiss(toast.id)}><FiX aria-hidden="true" /></button>
    </div>;
};

const ToastContainer = () => {
    const { toasts, dismissToast } = useApp();
    return <div className={styles.container} aria-live="polite" aria-relevant="additions removals">
        {toasts.map((toast) => <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />)}
    </div>;
};

export default ToastContainer;
