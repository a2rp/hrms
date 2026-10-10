import { useState } from "react";
import DialogHost from "./components/dialogHost/index.jsx";
import Footer from "./components/footer/index.jsx";
import Header from "./components/header/index.jsx";
import Sidebar from "./components/sidebar/index.jsx";
import ToastContainer from "./components/toastContainer/index.jsx";
import AppRoutes from "./AppRoutes.jsx";
import styles from "./App.module.css";

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return <div className={styles.shell}>
        <a className={styles.skipLink} href="#main-content">Skip to main content</a>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className={styles.workspace}>
            <Header onMenu={() => setSidebarOpen(true)} />
            <main className={styles.main} id="main-content" tabIndex="-1">
                <AppRoutes />
            </main>
            <Footer />
        </div>
        <DialogHost />
        <ToastContainer />
    </div>;
};

export default App;
