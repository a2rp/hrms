import { useMemo, useState } from "react";
import { FiActivity, FiDownload, FiEdit3, FiSearch } from "react-icons/fi";
import EmployeeAvatar from "../../components/employeeAvatar/index.jsx";
import useApp from "../../context/useApp.js";
import { todayKey } from "../../data/seedData.js";
import { downloadCsv, formatDate } from "../../utils.js";
import styles from "./styles.module.css";

const AttendanceEditor = ({ employee, date, record }) => {
    const { recordAttendance, closeModal } = useApp();
    const [form, setForm] = useState({ status: record?.status || "Present", clockIn: record?.clockIn === "--:--" ? "" : record?.clockIn || "09:00", clockOut: record?.clockOut === "--:--" ? "" : record?.clockOut || "", note: record?.note || "" });
    const submit = (event) => {
        event.preventDefault();
        const result = recordAttendance(employee.id, { ...form, date });
        if (result.error) return;
        closeModal();
    };
    const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    return <form className={styles.editor} onSubmit={submit}>
        <div className={styles.editPerson}><EmployeeAvatar name={employee.name} initials={employee.initials} color={employee.color} /><div><strong>{employee.name}</strong><span>{formatDate(date)}</span></div></div>
        <label><span>Attendance status</span><select value={form.status} onChange={(event) => change("status", event.target.value)}>{["Present", "Remote", "Late", "Not started", "On leave"].map((status) => <option key={status}>{status}</option>)}</select></label>
        <div className={styles.timeFields}><label><span>Clock in</span><input type="time" value={form.clockIn} onChange={(event) => change("clockIn", event.target.value)} disabled={form.status === "Not started" || form.status === "On leave"} /></label><label><span>Clock out</span><input type="time" value={form.clockOut} onChange={(event) => change("clockOut", event.target.value)} disabled={form.status === "Not started" || form.status === "On leave"} /></label></div>
        <label><span>Note</span><textarea rows="3" maxLength="180" value={form.note} onChange={(event) => change("note", event.target.value)} placeholder="Add a helpful note for the team" /></label>
        <div className={styles.formActions}><button type="button" onClick={closeModal}>Cancel</button><button type="submit">Save attendance</button></div>
    </form>;
};

const Attendance = () => {
    const { employees, attendance, openModal, showToast } = useApp();
    const [date, setDate] = useState(todayKey());
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [query, setQuery] = useState("");
    const records = useMemo(() => employees.map((employee) => ({ employee, record: attendance.find((entry) => entry.employeeId === employee.id && entry.date === date) }))
        .filter(({ employee, record }) => {
            const matchesQuery = !query.trim() || `${employee.name} ${employee.role} ${employee.department}`.toLowerCase().includes(query.trim().toLowerCase());
            const status = record?.status || "Not started";
            return matchesQuery && (statusFilter === "All statuses" || status === statusFilter);
        }), [employees, attendance, date, statusFilter, query]);
    const dayRecords = employees.map((employee) => ({ employee, record: attendance.find((entry) => entry.employeeId === employee.id && entry.date === date) }));
    const presentCount = dayRecords.filter(({ record }) => ["Present", "Remote", "Late"].includes(record?.status)).length;
    const openEditor = (employee, record) => openModal({ title: "Attendance detail", description: "Keep today’s people records accurate.", content: <AttendanceEditor employee={employee} record={record} date={date} /> });
    const exportDay = () => {
        const ok = downloadCsv(`morrow-attendance-${date}.csv`, records.map(({ employee, record }) => ({ date, employee: employee.name, role: employee.role, department: employee.department, status: record?.status || "Not started", clockIn: record?.clockIn || "", clockOut: record?.clockOut || "", note: record?.note || "" })));
        if (ok) showToast(`${records.length} attendance records exported.`);
        else showToast("There are no attendance records to export.", "info");
    };

    return <div className={styles.page}>
        <section className={styles.heading}><div><p className={styles.eyebrow}>A STEADY RHYTHM</p><h1>Attendance</h1><p>See how your team is spending the workday.</p></div><button className={styles.export} type="button" onClick={exportDay}><FiDownload aria-hidden="true" /> Export day</button></section>
        <section className={styles.summary} aria-label="Attendance totals"><div><span>Checked in</span><strong>{presentCount}<small> / {employees.length}</small></strong></div><div><span>Working remotely</span><strong>{dayRecords.filter(({ record }) => record?.status === "Remote").length}</strong></div><div><span>Running late</span><strong>{dayRecords.filter(({ record }) => record?.status === "Late").length}</strong></div><div><span>Not started</span><strong>{dayRecords.filter(({ record }) => !record || record.status === "Not started").length}</strong></div></section>
        <section className={styles.panel} aria-label="Daily attendance list">
            <div className={styles.toolbar}><label className={styles.date}><span>Day</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label className={styles.search}><FiSearch aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a colleague" aria-label="Search attendance" /></label><label className={styles.filter}><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{["All statuses", "Present", "Remote", "Late", "Not started", "On leave"].map((value) => <option key={value}>{value}</option>)}</select></label></div>
            <div className={styles.dateHeading}><div><span className={styles.calendarIcon}><FiActivity aria-hidden="true" /></span><div><h2>{formatDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h2><p>{records.length} colleague{records.length === 1 ? "" : "s"} in this view</p></div></div><span className={styles.dayTotal}>{presentCount} checked in</span></div>
            <div className={styles.list}>{records.length ? records.map(({ employee, record }) => {
                const status = record?.status || "Not started";
                return <article className={styles.row} key={employee.id}><EmployeeAvatar name={employee.name} initials={employee.initials} color={employee.color} /><div className={styles.person}><strong>{employee.name}</strong><span>{employee.role} · {employee.department}</span></div><div className={styles.clock}><span>Clock in</span><strong>{record?.clockIn || "--:--"}</strong></div><div className={styles.clock}><span>Clock out</span><strong>{record?.clockOut || "--:--"}</strong></div><span className={`${styles.status} ${styles[status.toLowerCase().replaceAll(" ", "")] || ""}`}><i />{status}</span><button className={styles.edit} type="button" onClick={() => openEditor(employee, record)}><FiEdit3 aria-hidden="true" /><span>Update</span></button></article>;
            }) : <div className={styles.empty}><FiActivity aria-hidden="true" /><strong>No matching attendance</strong><p>Try another name, date, or status.</p></div>}</div>
            <div className={styles.panelFoot}><span>Showing attendance for {formatDate(date)}</span><button type="button" onClick={() => { setDate(todayKey()); setQuery(""); setStatusFilter("All statuses"); }}>Back to today</button></div>
        </section>
    </div>;
};

export default Attendance;
