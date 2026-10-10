import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiPlus, FiSearch, FiX } from "react-icons/fi";
import useApp from "../../context/useApp.js";
import EmployeeForm from "../employeeForm/index.jsx";
import styles from "./styles.module.css";

const titles = { "/": "Overview", "/people": "People directory", "/attendance": "Attendance", "/leave": "Time off", "/payroll": "Payroll" };

const Header = ({ onMenu }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { openModal } = useApp();
    const [search, setSearch] = useState("");
    const title = titles[location.pathname] || "Workspace";

    const submitSearch = (event) => {
        event.preventDefault();
        navigate(`/people?search=${encodeURIComponent(search.trim())}`);
    };

    const addEmployee = () => openModal({
        title: "Add a person",
        description: "Create a profile in your Morrow people workspace.",
        content: <EmployeeForm />,
    });

    return <header className={styles.header}>
        <div className={styles.left}>
            <button className={styles.menu} type="button" aria-label="Open navigation" onClick={onMenu}><FiMenu aria-hidden="true" /></button>
            <div className={styles.breadcrumb}><span>Workspace</span><i aria-hidden="true">/</i><strong>{title}</strong></div>
        </div>
        <div className={styles.actions}>
            <form className={styles.search} role="search" onSubmit={submitSearch}>
                <FiSearch aria-hidden="true" />
                <input aria-label="Search people" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find someone" />
                {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}><FiX aria-hidden="true" /></button>}
                <kbd>Enter</kbd>
            </form>
            <button className={styles.add} type="button" onClick={addEmployee}><FiPlus aria-hidden="true" /><span>New person</span></button>
            <a className={styles.repository} href="https://github.com/a2rp/hrms" target="_blank" rel="noreferrer" aria-label="Open Morrow HR repository">
                <span>Repository</span><FiArrowUpRight aria-hidden="true" />
            </a>
        </div>
    </header>;
};

export default Header;
