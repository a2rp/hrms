import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading/index.jsx";
import ScrollToTop from "./components/scrollToTop/index.jsx";
import styles from "./AppRoutes.module.css";

const Overview = lazy(() => import("./pages/overview/index.jsx"));
const People = lazy(() => import("./pages/people/index.jsx"));
const Attendance = lazy(() => import("./pages/attendance/index.jsx"));
const Leave = lazy(() => import("./pages/leave/index.jsx"));
const Payroll = lazy(() => import("./pages/payroll/index.jsx"));
const NotFound = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = () => {
    const location = useLocation();
    return <>
        <ScrollToTop />
        <Suspense key={location.pathname} fallback={<div className={styles.loading}><Loading /></div>}>
            <Routes location={location}>
                <Route path="/" element={<Overview />} />
                <Route path="/people" element={<People />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leave" element={<Leave />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    </>;
};

export default AppRoutes;
