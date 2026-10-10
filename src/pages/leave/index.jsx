import { useMemo, useState } from "react";
import { FiCalendar, FiCheck, FiDownload, FiPlus, FiX } from "react-icons/fi";
import EmployeeAvatar from "../../components/employeeAvatar/index.jsx";
import useApp from "../../context/useApp.js";
import { countWorkingDays, downloadCsv, formatDate } from "../../utils.js";
import { todayKey } from "../../data/seedData.js";
import styles from "./styles.module.css";

const RequestForm = () => {
    const { employees, leaveRequests, createLeaveRequest, closeModal } = useApp();
    const [form, setForm] = useState({ employeeId: employees[0]?.id || "", type: "Annual", startDate: todayKey(), endDate: todayKey(), reason: "" });
    const [error, setError] = useState("");
    const employee = employees.find((person) => person.id === form.employeeId);
    const bucket = form.type === "Sick" ? "sick" : form.type === "Personal" ? "personal" : "annual";
    const reserved = leaveRequests.filter((request) => request.employeeId === form.employeeId && request.type === form.type && request.status === "Pending").reduce((total, request) => total + request.days, 0);
    const available = Math.max((employee?.leave[bucket] || 0) - reserved, 0);
    const days = countWorkingDays(form.startDate, form.endDate);
    const field = (name, value) => { setError(""); setForm((current) => ({ ...current, [name]: value })); };
    const submit = (event) => {
        event.preventDefault();
        if (days < 1) { setError("Choose a date range with at least one weekday."); return; }
        if (!form.reason.trim()) { setError("Add a short reason for your request."); return; }
        const result = createLeaveRequest({ ...form, days });
        if (result.error) { setError(result.error); return; }
        closeModal();
    };
    return <form className={styles.requestForm} onSubmit={submit}>
        <label><span>Colleague</span><select value={form.employeeId} onChange={(event) => field("employeeId", event.target.value)} required>{employees.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.department}</option>)}</select></label>
        <label><span>Time off type</span><select value={form.type} onChange={(event) => field("type", event.target.value)}><option>Annual</option><option>Sick</option><option>Personal</option></select></label>
        <div className={styles.dateFields}><label><span>First day</span><input type="date" value={form.startDate} onChange={(event) => field("startDate", event.target.value)} required /></label><label><span>Last day</span><input type="date" min={form.startDate} value={form.endDate} onChange={(event) => field("endDate", event.target.value)} required /></label></div>
        <div className={styles.balancePreview}><FiCalendar aria-hidden="true" /><span><strong>{days} working day{days === 1 ? "" : "s"}</strong><small>{available} {form.type.toLowerCase()} days available after pending requests</small></span></div>
        <label><span>Reason</span><textarea rows="3" maxLength="220" value={form.reason} onChange={(event) => field("reason", event.target.value)} placeholder="Share a little context for the approver" /></label>
        {days > available && <p className={styles.formWarning}>This request is longer than the remaining balance. You can adjust the dates before submitting.</p>}
        {error && <p className={styles.formError} role="alert">{error}</p>}
        <div className={styles.formActions}><button type="button" onClick={closeModal}>Cancel</button><button type="submit" disabled={days < 1 || days > available}>Submit request</button></div>
    </form>;
};

const Leave = () => {
    const { employees, leaveRequests, openModal, askConfirmation, reviewLeaveRequest, showToast } = useApp();
    const [statusFilter, setStatusFilter] = useState("All requests");
    const [typeFilter, setTypeFilter] = useState("All types");
    const requests = useMemo(() => [...leaveRequests].filter((request) => (statusFilter === "All requests" || request.status === statusFilter) && (typeFilter === "All types" || request.type === typeFilter)).sort((a, b) => b.submitted.localeCompare(a.submitted)), [leaveRequests, statusFilter, typeFilter]);
    const pending = leaveRequests.filter((request) => request.status === "Pending").length;
    const approved = leaveRequests.filter((request) => request.status === "Approved").reduce((sum, request) => sum + request.days, 0);
    const openRequest = () => openModal({ title: "Request time away", description: "A little rest goes a long way. Add the dates and a note for your approver.", content: <RequestForm /> });
    const review = (request, status) => {
        const person = employees.find((employee) => employee.id === request.employeeId);
        askConfirmation({
            title: `${status} this request?`,
            message: status === "Approved" ? `${request.days} day${request.days === 1 ? "" : "s"} will be deducted from ${person?.name || "this colleague"}’s ${request.type.toLowerCase()} balance.` : `The ${request.type.toLowerCase()} request from ${person?.name || "this colleague"} will be declined.`,
            confirmLabel: status,
            tone: status === "Declined" ? "danger" : "default",
            onConfirm: () => { const result = reviewLeaveRequest(request.id, status); if (result.error) showToast(result.error, "error"); },
        });
    };
    const exportRequests = () => {
        const ok = downloadCsv("morrow-time-off.csv", requests.map((request) => ({ employee: employees.find((person) => person.id === request.employeeId)?.name || "Removed colleague", type: request.type, startDate: request.startDate, endDate: request.endDate, workingDays: request.days, status: request.status, reason: request.reason, submitted: request.submitted })));
        if (ok) showToast(`${requests.length} time off requests exported.`);
        else showToast("There are no requests to export from this view.", "info");
    };

    return <div className={styles.page}>
        <section className={styles.heading}><div><p className={styles.eyebrow}>REST IS PART OF GOOD WORK</p><h1>Time off</h1><p>Keep leave balances and requests in one clear place.</p></div><div className={styles.headingActions}><button className={styles.export} type="button" onClick={exportRequests}><FiDownload aria-hidden="true" /> Export</button><button className={styles.primary} type="button" onClick={openRequest}><FiPlus aria-hidden="true" /> Request time off</button></div></section>
        <section className={styles.metrics} aria-label="Time off summary"><article><span>Waiting for review</span><strong>{pending}</strong><small>Requests need an answer</small></article><article><span>Days approved</span><strong>{approved}</strong><small>Across this demo workspace</small></article><article><span>Team members</span><strong>{employees.length}</strong><small>With active leave balances</small></article></section>
        <section className={styles.balanceSection}><div className={styles.sectionHead}><div><h2>Leave balances</h2><p>Remaining allowance by colleague. Pending requests are not deducted yet.</p></div><span className={styles.balanceLegend}><i /> Available days</span></div><div className={styles.balanceList}>{employees.map((person) => <article className={styles.balanceCard} key={person.id}><div className={styles.balancePerson}><EmployeeAvatar name={person.name} initials={person.initials} color={person.color} /><span><strong>{person.name}</strong><small>{person.department}</small></span></div><div><small>Annual</small><strong>{person.leave.annual} days</strong></div><div><small>Sick</small><strong>{person.leave.sick} days</strong></div><div><small>Personal</small><strong>{person.leave.personal} days</strong></div></article>)}</div></section>
        <section className={styles.requestsPanel}>
            <div className={styles.panelHead}><div><h2>Requests</h2><p>{requests.length} request{requests.length === 1 ? "" : "s"} in this view</p></div><div className={styles.filters}><label><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{["All requests", "Pending", "Approved", "Declined"].map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Type</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>{["All types", "Annual", "Sick", "Personal"].map((value) => <option key={value}>{value}</option>)}</select></label></div></div>
            <div className={styles.requestList}>{requests.length ? requests.map((request) => {
                const person = employees.find((employee) => employee.id === request.employeeId);
                if (!person) return null;
                return <article className={styles.requestRow} key={request.id}><EmployeeAvatar name={person.name} initials={person.initials} color={person.color} /><div className={styles.person}><strong>{person.name}</strong><span>{person.role}</span></div><div className={styles.type}><strong>{request.type}</strong><small>{request.days} working day{request.days === 1 ? "" : "s"}</small></div><div className={styles.dates}><strong>{formatDate(request.startDate, { year: undefined })}{request.startDate !== request.endDate ? ` – ${formatDate(request.endDate, { year: undefined })}` : ""}</strong><small>Submitted {formatDate(request.submitted)}</small></div><p className={styles.reason}>{request.reason}</p><span className={`${styles.status} ${styles[request.status.toLowerCase()]}`}>{request.status}</span>{request.status === "Pending" ? <div className={styles.actions}><button className={styles.approve} type="button" onClick={() => review(request, "Approved")} aria-label={`Approve ${person.name}’s request`}><FiCheck aria-hidden="true" /><span>Approve</span></button><button className={styles.decline} type="button" onClick={() => review(request, "Declined")} aria-label={`Decline ${person.name}’s request`}><FiX aria-hidden="true" /><span>Decline</span></button></div> : <span className={styles.reviewed}>Submitted {formatDate(request.submitted, { month: "short", day: "numeric" })}</span>}</article>;
            }) : <div className={styles.empty}><FiCalendar aria-hidden="true" /><strong>No requests in this view</strong><p>Adjust the filters or create a new request.</p><button type="button" onClick={openRequest}>Request time off</button></div>}</div>
            <p className={styles.footnote}>Approvals update the employee balance in this browser session. No external payroll or calendar action is triggered.</p>
        </section>
    </div>;
};

export default Leave;
