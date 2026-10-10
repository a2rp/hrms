import { useMemo, useState } from "react";
import { FiArrowDown, FiArrowUp, FiDownload, FiMapPin, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import EmployeeAvatar from "../../components/employeeAvatar/index.jsx";
import EmployeeForm from "../../components/employeeForm/index.jsx";
import EmployeeProfile from "../../components/employeeProfile/index.jsx";
import useApp from "../../context/useApp.js";
import { departments } from "../../data/seedData.js";
import { downloadCsv } from "../../utils.js";
import styles from "./styles.module.css";

const People = () => {
    const { employees, openModal, showToast } = useApp();
    const [params, setParams] = useSearchParams();
    const search = params.get("search") || "";
    const [department, setDepartment] = useState("All departments");
    const [status, setStatus] = useState("All statuses");
    const [sort, setSort] = useState("name");
    const [direction, setDirection] = useState("asc");

    const visible = useMemo(() => employees.filter((person) => {
        const query = search.trim().toLowerCase();
        const matchesText = !query || [person.name, person.email, person.role, person.department, person.location].some((value) => value.toLowerCase().includes(query));
        return matchesText && (department === "All departments" || person.department === department) && (status === "All statuses" || person.status === status);
    }).sort((left, right) => {
        const a = sort === "startDate" ? left.startDate : left[sort];
        const b = sort === "startDate" ? right.startDate : right[sort];
        const compared = String(a).localeCompare(String(b), undefined, { numeric: true });
        return direction === "asc" ? compared : -compared;
    }), [employees, search, department, status, sort, direction]);

    const addPerson = () => openModal({ title: "Add a person", description: "Create a profile in your Morrow people workspace.", content: <EmployeeForm /> });
    const openPerson = (person) => openModal({ title: "A little more about them", description: "A clear view of their current people record.", content: <EmployeeProfile employee={person} /> });
    const exportPeople = () => {
        const result = downloadCsv("morrow-people.csv", visible.map(({ id, name, email, phone, role, department: team, location, manager, employmentType, status: employmentStatus, startDate, salary }) => ({ id, name, email, phone, role, department: team, location, manager, employmentType, status: employmentStatus, startDate, annualSalaryUSD: salary })));
        if (result) showToast(`${visible.length} people exported to CSV.`);
        else showToast("There are no people to export from this view.", "info");
    };
    const toggleSort = (value) => {
        if (sort === value) setDirection((current) => current === "asc" ? "desc" : "asc");
        else { setSort(value); setDirection("asc"); }
    };
    const SortIcon = direction === "asc" ? FiArrowUp : FiArrowDown;

    return <div className={styles.page}>
        <section className={styles.heading}>
            <div><p className={styles.eyebrow}>THE PEOPLE WHO MAKE IT WORK</p><h1>People directory</h1><p>A thoughtful home for every colleague’s work details.</p></div>
            <button className={styles.export} type="button" onClick={exportPeople}><FiDownload aria-hidden="true" /> Export view</button>
        </section>
        <section className={styles.directory} aria-label="Employee directory">
            <div className={styles.toolbar}>
                <label className={styles.search}><FiSearch aria-hidden="true" /><input value={search} onChange={(event) => setParams(event.target.value ? { search: event.target.value } : {}, { replace: true })} placeholder="Search name, role, email..." aria-label="Search people directory" /></label>
                <label className={styles.selectLabel}><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option>All departments</option>{departments.map((team) => <option key={team}>{team}</option>)}</select></label>
                <label className={styles.selectLabel}><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option>{["Active", "Probation", "On leave", "Offboarding"].map((value) => <option key={value}>{value}</option>)}</select></label>
                <label className={styles.selectLabel}><span>Sort by</span><select value={sort} onChange={(event) => { setSort(event.target.value); setDirection("asc"); }}><option value="name">Name</option><option value="department">Department</option><option value="role">Role</option><option value="startDate">Start date</option></select></label>
                <button className={styles.add} type="button" onClick={addPerson}><FiPlus aria-hidden="true" /> Add person</button>
            </div>
            <div className={styles.listSummary}><span><strong>{visible.length}</strong> of {employees.length} colleagues</span><span className={styles.sortHint}>Currently sorted by <button type="button" onClick={() => toggleSort(sort)}>{sort === "startDate" ? "start date" : sort} <SortIcon aria-hidden="true" /></button></span></div>
            <div className={styles.tableHead} aria-hidden="true"><button type="button" onClick={() => toggleSort("name")}>COLLEAGUE <SortIcon aria-hidden="true" /></button><button type="button" onClick={() => toggleSort("role")}>ROLE <SortIcon aria-hidden="true" /></button><span>DEPARTMENT</span><span>LOCATION</span><span>STATUS</span><span>PROFILE</span></div>
            {visible.length ? <div className={styles.peopleList}>{visible.map((person) => <article className={styles.person} key={person.id}>
                <div className={styles.identity}><EmployeeAvatar name={person.name} initials={person.initials} color={person.color} /><span><strong>{person.name}</strong><small>{person.email}</small></span></div>
                <div className={styles.role}><strong>{person.role}</strong><small>{person.employmentType}</small></div>
                <div className={styles.department}>{person.department}</div>
                <div className={styles.location}><FiMapPin aria-hidden="true" /><span>{person.location}</span></div>
                <span className={`${styles.status} ${styles[person.status.toLowerCase().replaceAll(" ", "")] || ""}`}>{person.status}</span>
                <button className={styles.view} type="button" onClick={() => openPerson(person)}>View profile</button>
            </article>)}</div> : <div className={styles.empty}><span><FiUsers aria-hidden="true" /></span><h2>No colleagues found</h2><p>Try a different name, department, or status.</p><button type="button" onClick={() => { setParams({}, { replace: true }); setDepartment("All departments"); setStatus("All statuses"); }}>Clear filters</button></div>}
        </section>
        <p className={styles.privacyNote}>People details are sample workspace data. Changes reset when you refresh this page.</p>
    </div>;
};

export default People;


