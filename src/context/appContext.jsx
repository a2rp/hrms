import { useCallback, useState } from "react";
import AppContext from "./context.js";
import { attendance as seedAttendance, employees as seedEmployees, leaveRequests as seedLeaveRequests, payroll as seedPayroll, todayKey } from "../data/seedData.js";

const makeId = (prefix) => `${prefix}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

export const AppProvider = ({ children }) => {
    const [employees, setEmployees] = useState(seedEmployees);
    const [attendance, setAttendance] = useState(seedAttendance);
    const [leaveRequests, setLeaveRequests] = useState(seedLeaveRequests);
    const [payrollRecords, setPayrollRecords] = useState(seedPayroll);
    const [toasts, setToasts] = useState([]);
    const [modal, setModal] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

    const showToast = useCallback((message, type = "success") => {
        const id = makeId("toast");
        setToasts((current) => [...current, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const openModal = useCallback((options) => setModal(options), []);
    const closeModal = useCallback(() => setModal(null), []);
    const askConfirmation = useCallback((options) => setConfirmation(options), []);
    const closeConfirmation = useCallback(() => setConfirmation(null), []);
    const completeConfirmation = useCallback(() => {
        const action = confirmation?.onConfirm;
        setConfirmation(null);
        action?.();
    }, [confirmation]);

    const addEmployee = (values) => {
        const email = values.email.trim().toLowerCase();
        if (employees.some((employee) => employee.email.toLowerCase() === email)) {
            return { error: "That work email is already assigned to an employee." };
        }
        const employee = {
            ...values,
            id: makeId("EMP"),
            name: values.name.trim(),
            email,
            salary: Number(values.salary),
            initials: values.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join(""),
            status: values.status || "Active",
            leave: { annual: 18, sick: 8, personal: 3 },
            color: ["lilac", "rose", "gold", "blue", "mint", "peach", "plum", "teal", "coral"][employees.length % 9],
        };
        setEmployees((current) => [employee, ...current]);
        setPayrollRecords((current) => [{ employeeId: employee.id, period: todayKey().slice(0, 7), status: "Ready", bonus: 0, deductions: 0, paidDate: "" }, ...current]);
        showToast(`${employee.name} added to the people directory.`);
        return { ok: true, employee };
    };

    const updateEmployee = (id, values) => {
        const email = values.email.trim().toLowerCase();
        if (employees.some((employee) => employee.id !== id && employee.email.toLowerCase() === email)) {
            return { error: "That work email is already assigned to another employee." };
        }
        setEmployees((current) => current.map((employee) => employee.id === id ? {
            ...employee,
            ...values,
            name: values.name.trim(),
            email,
            salary: Number(values.salary),
            initials: values.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join(""),
        } : employee));
        showToast(`${values.name.trim()}’s profile was updated.`);
        return { ok: true };
    };

    const removeEmployee = (id) => {
        const employee = employees.find((entry) => entry.id === id);
        if (!employee) return;
        setEmployees((current) => current.filter((entry) => entry.id !== id).map((entry) => entry.manager === employee.name ? { ...entry, manager: "Olivia Chen" } : entry));
        setAttendance((current) => current.filter((entry) => entry.employeeId !== id));
        setLeaveRequests((current) => current.filter((entry) => entry.employeeId !== id));
        setPayrollRecords((current) => current.filter((entry) => entry.employeeId !== id));
        showToast(`${employee.name} was removed from this demo workspace.`, "info");
    };

    const recordAttendance = (employeeId, values) => {
        const employee = employees.find((entry) => entry.id === employeeId);
        if (!employee) return { error: "Choose an employee in the directory." };
        const date = values.date || todayKey();
        const existing = attendance.find((entry) => entry.employeeId === employeeId && entry.date === date);
        const entry = {
            ...existing,
            ...values,
            id: existing?.id || makeId("ATT"),
            employeeId,
            date,
            status: values.status || "Present",
            clockIn: values.clockIn || "--:--",
            clockOut: values.clockOut || "--:--",
            note: values.note?.trim() || "",
        };
        setAttendance((current) => existing
            ? current.map((item) => item.id === existing.id ? entry : item)
            : [entry, ...current]);
        showToast(`${employee.name}’s attendance was updated.`);
        return { ok: true, entry };
    };

    const createLeaveRequest = (values) => {
        const employee = employees.find((entry) => entry.id === values.employeeId);
        if (!employee) return { error: "Choose an employee in the directory." };
        if (values.startDate > values.endDate) return { error: "The end date must be on or after the start date." };
        const days = Number(values.days);
        if (!Number.isFinite(days) || days < 1) return { error: "Enter at least one working day." };
        const bucket = values.type === "Sick" ? "sick" : values.type === "Personal" ? "personal" : "annual";
        const reservedDays = leaveRequests.filter((request) => request.employeeId === values.employeeId && request.type === values.type && request.status === "Pending").reduce((sum, request) => sum + request.days, 0);
        if (employee.leave[bucket] - reservedDays < days) return { error: `Only ${Math.max(employee.leave[bucket] - reservedDays, 0)} ${values.type.toLowerCase()} days are available after pending requests.` };
        const overlaps = leaveRequests.some((request) => request.employeeId === values.employeeId
            && request.status !== "Declined"
            && values.startDate <= request.endDate
            && values.endDate >= request.startDate);
        if (overlaps) return { error: "This request overlaps another pending or approved request." };
        const request = {
            ...values,
            id: makeId("LV"),
            days,
            reason: values.reason.trim(),
            status: "Pending",
            submitted: todayKey(),
        };
        setLeaveRequests((current) => [request, ...current]);
        showToast(`Time off request for ${employee.name} was submitted.`, "info");
        return { ok: true, request };
    };

    const reviewLeaveRequest = (id, status) => {
        const request = leaveRequests.find((entry) => entry.id === id);
        if (!request || request.status !== "Pending") return { error: "This request is no longer waiting for review." };
        const employee = employees.find((entry) => entry.id === request.employeeId);
        if (status === "Approved" && employee) {
            const bucket = request.type === "Sick" ? "sick" : request.type === "Personal" ? "personal" : "annual";
            if (employee.leave[bucket] < request.days) {
                return { error: `${employee.name} does not have enough ${request.type.toLowerCase()} days remaining.` };
            }
            setEmployees((current) => current.map((person) => person.id === employee.id ? {
                ...person,
                leave: { ...person.leave, [bucket]: person.leave[bucket] - request.days },
            } : person));
        }
        setLeaveRequests((current) => current.map((entry) => entry.id === id ? { ...entry, status } : entry));
        showToast(`${employee?.name || "Employee"}’s request was ${status.toLowerCase()}.`, status === "Approved" ? "success" : "info");
        return { ok: true };
    };

    const updatePayrollStatus = (employeeId, status, selectedPeriod = todayKey().slice(0, 7)) => {
        const employee = employees.find((entry) => entry.id === employeeId);
        if (!employee) return { error: "This employee is no longer in the directory." };
        const period = selectedPeriod;
        setPayrollRecords((current) => {
            const existing = current.find((entry) => entry.employeeId === employeeId && entry.period === period);
            const record = { ...existing, employeeId, period, status, bonus: existing?.bonus || 0, deductions: existing?.deductions ?? Math.round(employee.salary * 0.22 / 12), paidDate: status === "Paid" ? todayKey() : "" };
            return existing
                ? current.map((entry) => entry === existing ? record : entry)
                : [record, ...current];
        });
        showToast(status === "Paid" ? `${employee.name}’s demo payroll is marked paid. No payment was sent.` : status === "Review" ? `${employee.name}’s payroll is flagged for review.` : `${employee.name}’s payroll is marked ready.`, status === "Paid" ? "success" : "info");
        return { ok: true };
    };

    const value = {
        employees,
        attendance,
        leaveRequests,
        payrollRecords,
        toasts,
        modal,
        confirmation,
        showToast,
        dismissToast,
        openModal,
        closeModal,
        askConfirmation,
        closeConfirmation,
        completeConfirmation,
        addEmployee,
        updateEmployee,
        removeEmployee,
        recordAttendance,
        createLeaveRequest,
        reviewLeaveRequest,
        updatePayrollStatus,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};





