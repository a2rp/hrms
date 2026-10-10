import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import useApp from "../../context/useApp.js";
import styles from "./styles.module.css";

const DialogHost = () => {
    const { modal, closeModal, confirmation, closeConfirmation, completeConfirmation } = useApp();
    const modalRef = useRef(null);
    const confirmationRef = useRef(null);
    const cancelRef = useRef(null);

    useEffect(() => {
        const element = modalRef.current;
        if (modal && element && !element.open) element.showModal();
        return () => {
            if (element?.open) element.close();
        };
    }, [modal]);

    useEffect(() => {
        const element = confirmationRef.current;
        if (confirmation && element && !element.open) element.showModal();
        if (confirmation) cancelRef.current?.focus();
        return () => {
            if (element?.open) element.close();
        };
    }, [confirmation]);

    return <>
        {modal && <dialog
            ref={modalRef}
            className={styles.dialog}
            aria-labelledby="modal-title"
            aria-describedby={modal.description ? "modal-description" : undefined}
            onCancel={(event) => { event.preventDefault(); closeModal(); }}
            onClick={(event) => { if (event.target === modalRef.current) closeModal(); }}
        >
            <section className={styles.panel}>
                <header className={styles.header}>
                    <div>
                        <h2 id="modal-title">{modal.title}</h2>
                        {modal.description && <p id="modal-description">{modal.description}</p>}
                    </div>
                    <button className={styles.close} type="button" aria-label="Close dialog" onClick={closeModal}><FiX aria-hidden="true" /></button>
                </header>
                <div className={styles.content}>{modal.content}</div>
            </section>
        </dialog>}
        {confirmation && <dialog
            ref={confirmationRef}
            className={`${styles.dialog} ${styles.confirmation}`}
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-message"
            onCancel={(event) => { event.preventDefault(); closeConfirmation(); }}
            onClick={(event) => { if (event.target === confirmationRef.current) closeConfirmation(); }}
        >
            <section className={styles.confirmPanel}>
                <div className={`${styles.confirmIcon} ${confirmation.tone === "danger" ? styles.danger : ""}`}><FiAlertTriangle aria-hidden="true" /></div>
                <div className={styles.confirmText}>
                    <h2 id="confirmation-title">{confirmation.title}</h2>
                    <p id="confirmation-message">{confirmation.message}</p>
                </div>
                <div className={styles.confirmActions}>
                    <button ref={cancelRef} className={styles.cancel} type="button" onClick={closeConfirmation}>Cancel</button>
                    <button className={`${styles.confirm} ${confirmation.tone === "danger" ? styles.dangerButton : ""}`} type="button" onClick={completeConfirmation}>{confirmation.confirmLabel || "Confirm"}</button>
                </div>
            </section>
        </dialog>}
    </>;
};

export default DialogHost;
