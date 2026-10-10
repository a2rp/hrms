import { NavLink } from "react-router-dom";
import { FiActivity, FiCalendar, FiGrid, FiUsers, FiWallet } from "react-icons/fi";
import useApp from "../../context/useApp.js";
import styles from "./styles.module.css";

const links = [
    { to: "/", label: "Overview", icon: FiGrid, end: true },
    { to: "/people", label: "People", icon: FiUsers },
    { to: "/attendance", label: "Attendance", icon: FiActivity },
    { to: "/leave", label: "Time off", icon: FiCalendar },
    { to: "/payroll", label: "Payroll", icon: FiWallet },
];

const Sidebar = ({ open, onClose }) => {
    const { employees, leaveRequests } = useApp();
    const pending = leaveRequests.filter((request) => request.status === "Pending").length;

    return <>
        <button className={`${styles.scrim} ${open ? styles.scrimVisible : ""}`} type="button" aria-label="Close navigation" onClick={onClose} />
        <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`} aria-label="Main navigation">
            <NavLink to="/" className={styles.brand} onClick={onClose} aria-label="Morrow HR home">
                <span className={styles.brandMark}><FiActivity aria-hidden="true" /></span>
                <span className={styles.brandName}>morrow<span>people</span></span>
            </NavLink>
            <div className={styles.workspace}>
                <span className={styles.sectionLabel}>WORKSPACE</span>
                <nav className={styles.nav}>
                    {links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>
                        <Icon aria-hidden="true" />
                        <span>{label}</span>
                        {label === "People" && <span className={styles.count}>{employees.length}</span>}
                        {label === "Time off" && pending > 0 && <span className={`${styles.count} ${styles.pending}`}>{pending}</span>}
                    </NavLink>)}
                </nav>
            </div>
            <div className={styles.bottom}>
                <div className={styles.cycleCard}>
                    <span className={styles.cycleIcon}><FiCalendar aria-hidden="true" /></span>
                    <div><strong>People first</strong><span>One day at a time</span></div>
                </div>
                <div className={styles.admin}>
                    <span className={styles.adminAvatar}>OC</span>
                    <span className={styles.adminInfo}><strong>Olivia Chen</strong><small>People administrator</small></span>
                </div>
            </div>
        </aside>
    </>;
};

export default Sidebar;
