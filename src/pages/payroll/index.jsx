import { useMemo, useState } from "react";
import { FiArrowUpRight, FiCheck, FiDownload, FiEye, FiFlag, FiRefreshCw, FiWallet } from "react-icons/fi";
import EmployeeAvatar from "../../components/employeeAvatar/index.jsx";
import EmployeeProfile from "../../components/employeeProfile/index.jsx";
import useApp from "../../context/useApp.js";
import { departments } from "../../data/seedData.js";
import { downloadCsv, formatCurrency, formatPeriod } from "../../utils.js";
import styles from "./styles.module.css";

const PayStatement = ({ employee, record, period, gross, deductions, net }) => {
    const { closeModal, openModal } = useApp();
    return <div className={styles.statement}>
        <div className={styles.statementPerson}><EmployeeAvatar name={employee.name} initials={employee.initials} color={employee.color} size="large" /><div><strong>{employee.name}</strong><span>{employee.role} · {employee.department}</span><small>{formatPeriod(period)} · Demo statement</small></div></div>
        <div className={styles.statementRows}><div><span>Annual salary</span><strong>{formatCurrency(employee.salary)}</strong></div><div><span>Base monthly pay</span><strong>{formatCurrency(employee.salary / 12)}</strong></div><div><span>Additional bonus</span><strong>{formatCurrency(record.bonus || 0)}</strong></div><div><span>Gross estimate</span><strong>{formatCurrency(gross)}</strong></div><div><span>Estimated deductions</span><strong>−{formatCurrency(deductions)}</strong></div><div className={styles.net}><span>Estimated take home</span><strong>{formatCurrency(net)}</strong></div></div>
        <div className={styles.statementNote}><FiWallet aria-hidden="true" /><p>This is a planning preview only. Morrow does not submit payroll or transfer money.</p></div>
        <div className={styles.statementActions}><button type="button" onClick={() => openModal({ title: "A little more about them", description: "Update their work record and annual salary.", content: <EmployeeProfile employee={employee} /> })}><FiArrowUpRight aria-hidden="true" /> Edit people record</button><button type="button" onClick={closeModal}>Close</button></div>
    </div>;
};

const Payroll = () => {
    const { employees, payrollRecords, openModal, askConfirmation, updatePayrollStatus, showToast } = useApp();
    const months = Array.from({ length: 8 }, (_, index) => {
        const date = new Date();
        date.setDate(1);
        date.setMonth(date.getMonth() - index);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    });
    const [period, setPeriod] = useState(months[0]);
    const [department, setDepartment] = useState("All departments");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const records = useMemo(() => employees.map((employee) => {
        const record = payrollRecords.find((entry) => entry.employeeId === employee.id && entry.period === period) || { employeeId: employee.id, period, status: "Ready", bonus: 0, deductions: Math.round(employee.salary * 0.22 / 12), paidDate: "" };
        const gross = Math.round(employee.salary / 12) + Number(record.bonus || 0);
        const deductions = Number(record.deductions ?? Math.round(employee.salary * 0.22 / 12));
        return { employee, record, gross, deductions, net: gross - deductions };
    }).filter(({ employee, record }) => (department === "All departments" || employee.department === department) && (statusFilter === "All statuses" || record.status === statusFilter)), [employees, payrollRecords, period, department, statusFilter]);
    const allPeriodRecords = employees.map((employee) => payrollRecords.find((entry) => entry.employeeId === employee.id && entry.period === period)?.status || "Ready");
    const totalNet = records.reduce((sum, record) => sum + record.net, 0);
    const ready = allPeriodRecords.filter((status) => status === "Ready").length;
    const reviews = allPeriodRecords.filter((status) => status === "Review").length;
    const paid = allPeriodRecords.filter((status) => status === "Paid").length;

    const inspect = (entry) => openModal({ title: "Monthly pay preview", description: "A transparent view of the estimate for this colleague.", content: <PayStatement {...entry} period={period} /> });
    const updateStatus = (entry, nextStatus) => {
        if (nextStatus === "Paid") {
            askConfirmation({ title: "Mark this demo payroll as paid?", message: `This will mark ${entry.employee.name} as paid for ${formatPeriod(period)} in the preview. No payment or bank transfer will be made.`, confirmLabel: "Mark paid", tone: "default", onConfirm: () => { const result = updatePayrollStatus(entry.employee.id, "Paid", period); if (result.error) showToast(result.error, "error"); } });
            return;
        }
        const result = updatePayrollStatus(entry.employee.id, nextStatus, period);
        if (result.error) showToast(result.error, "error");
    };
    const exportPayroll = () => {
        const ok = downloadCsv(`morrow-payroll-${period}.csv`, records.map(({ employee, record, gross, deductions, net }) => ({ period, employee: employee.name, department: employee.department, annualSalaryUSD: employee.salary, bonusUSD: record.bonus || 0, grossUSD: gross, estimatedDeductionsUSD: deductions, estimatedTakeHomeUSD: net, status: record.status, paidDate: record.paidDate || "" })));
        if (ok) showToast(`${records.length} payroll previews exported.`);
        else showToast("There are no payroll records to export from this view.", "info");
    };

    return <div className={styles.page}>
        <section className={styles.heading}><div><p className={styles.eyebrow}>A CLEARER PAYDAY PREVIEW</p><h1>Payroll</h1><p>Review monthly estimates and keep every pay record in view.</p></div><button className={styles.export} type="button" onClick={exportPayroll}><FiDownload aria-hidden="true" /> Export month</button></section>
        <section className={styles.periodPanel}>
            <div><span className={styles.kicker}>PAY PERIOD</span><strong>{formatPeriod(period)}</strong><small>Monthly estimate for the current team.</small></div>
            <label><span>Choose a month</span><select value={period} onChange={(event) => setPeriod(event.target.value)}>{months.map((month) => <option value={month} key={month}>{formatPeriod(month)}</option>)}</select></label>
        </section>
        <section className={styles.metrics} aria-label="Payroll summary"><article><span>Estimated take home</span><strong>{formatCurrency(totalNet, true)}</strong><small>For {records.length} people in this view</small></article><article><span>Ready to review</span><strong>{ready}</strong><small>Pending payroll entries</small></article><article><span>Flagged for a second look</span><strong>{reviews}</strong><small>Needs a closer review</small></article><article><span>Marked paid</span><strong>{paid}</strong><small>Demo status only</small></article></section>
        <section className={styles.panel}>
            <div className={styles.toolbar}><div><h2>Monthly payroll</h2><p>{formatPeriod(period)} · {records.length} people in this view</p></div><div className={styles.filters}><label><span>Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option>All departments</option>{departments.map((team) => <option key={team}>{team}</option>)}</select></label><label><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{["All statuses", "Ready", "Review", "Paid"].map((value) => <option key={value}>{value}</option>)}</select></label></div></div>
            <div className={styles.tableHead}><span>COLLEAGUE</span><span>BASE PAY</span><span>BONUS</span><span>DEDUCTIONS</span><span>ESTIMATED TAKE HOME</span><span>STATUS</span><span>ACTIONS</span></div>
            <div className={styles.list}>{records.length ? records.map((entry) => <article className={styles.row} key={entry.employee.id}>
                <div className={styles.person}><EmployeeAvatar name={entry.employee.name} initials={entry.employee.initials} color={entry.employee.color} /><span><strong>{entry.employee.name}</strong><small>{entry.employee.department} · {entry.employee.role}</small></span></div>
                <strong className={styles.money}>{formatCurrency(entry.employee.salary / 12)}</strong><span className={styles.money}>{formatCurrency(entry.record.bonus || 0)}</span><span className={styles.money}>{formatCurrency(entry.deductions)}</span><strong className={`${styles.money} ${styles.net}`}>{formatCurrency(entry.net)}</strong>
                <span className={`${styles.status} ${styles[entry.record.status.toLowerCase()]}`}><i />{entry.record.status}</span>
                <div className={styles.actions}><button className={styles.view} type="button" onClick={() => inspect(entry)} aria-label={`View ${entry.employee.name}’s payslip`}><FiEye aria-hidden="true" /><span>Details</span></button>{entry.record.status === "Paid" ? <button className={styles.mark} type="button" onClick={() => inspect(entry)}><FiCheck aria-hidden="true" /><span>Paid</span></button> : entry.record.status === "Review" ? <button className={styles.mark} type="button" onClick={() => updateStatus(entry, "Ready")}><FiRefreshCw aria-hidden="true" /><span>Mark ready</span></button> : <><button className={styles.flag} type="button" onClick={() => updateStatus(entry, "Review")} aria-label={`Flag ${entry.employee.name}’s payroll for review`}><FiFlag aria-hidden="true" /><span>Flag</span></button><button className={styles.mark} type="button" onClick={() => updateStatus(entry, "Paid")}><FiCheck aria-hidden="true" /><span>Mark paid</span></button></>}</div>
            </article>) : <div className={styles.empty}><FiWallet aria-hidden="true" /><strong>No payroll entries found</strong><p>Adjust the department or status filters.</p><button type="button" onClick={() => { setDepartment("All departments"); setStatusFilter("All statuses"); }}>Clear filters</button></div>}</div>
            <div className={styles.disclaimer}><FiWallet aria-hidden="true" /><p>Frontend preview only. Pay estimates are calculated from annual salary and sample deductions. Marking a row paid changes its demo status only; no money moves.</p></div>
        </section>
    </div>;
};

export default Payroll;

