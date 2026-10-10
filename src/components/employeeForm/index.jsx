import { useState } from "react";
import { departments, todayKey } from "../../data/seedData.js";
import useApp from "../../context/useApp.js";
import styles from "./styles.module.css";

const EmployeeForm = ({ employee = null }) => {
    const { employees, addEmployee, updateEmployee, closeModal } = useApp();
    const [form, setForm] = useState(() => employee ? {
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        department: employee.department,
        location: employee.location,
        manager: employee.manager,
        employmentType: employee.employmentType,
        status: employee.status,
        startDate: employee.startDate,
        salary: String(employee.salary),
    } : {
        name: "",
        email: "",
        phone: "",
        role: "",
        department: "People",
        location: "San Francisco",
        manager: "Olivia Chen",
        employmentType: "Full time",
        status: "Active",
        startDate: todayKey(),
        salary: "",
    });
    const [error, setError] = useState("");
    const field = (name, value) => setForm((current) => ({ ...current, [name]: value }));

    const handleSubmit = (event) => {
        event.preventDefault();
        const result = employee
            ? updateEmployee(employee.id, form)
            : addEmployee(form);
        if (result.error) {
            setError(result.error);
            return;
        }
        closeModal();
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fields}>
                <label className={styles.field}>
                    <span>Full name</span>
                    <input autoFocus required maxLength="70" value={form.name} onChange={(event) => field("name", event.target.value)} placeholder="e.g. Jordan Lee" />
                </label>
                <label className={styles.field}>
                    <span>Work email</span>
                    <input required type="email" maxLength="100" value={form.email} onChange={(event) => field("email", event.target.value)} placeholder="name@company.com" />
                </label>
                <label className={styles.field}>
                    <span>Job title</span>
                    <input required maxLength="80" value={form.role} onChange={(event) => field("role", event.target.value)} placeholder="e.g. Product Designer" />
                </label>
                <label className={styles.field}>
                    <span>Department</span>
                    <select value={form.department} onChange={(event) => field("department", event.target.value)}>
                        {departments.map((department) => <option key={department}>{department}</option>)}
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Location</span>
                    <input required maxLength="60" value={form.location} onChange={(event) => field("location", event.target.value)} placeholder="City or remote" />
                </label>
                <label className={styles.field}>
                    <span>Manager</span>
                    <select value={form.manager} onChange={(event) => field("manager", event.target.value)}>
                        <option>Olivia Chen</option>
                        {employees.filter((person) => person.id !== employee?.id && person.name !== "Olivia Chen").map((person) => <option key={person.id}>{person.name}</option>)}
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Employment type</span>
                    <select value={form.employmentType} onChange={(event) => field("employmentType", event.target.value)}>
                        <option>Full time</option>
                        <option>Part time</option>
                        <option>Contract</option>
                        <option>Intern</option>
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Employment status</span>
                    <select value={form.status} onChange={(event) => field("status", event.target.value)}>
                        <option>Active</option>
                        <option>Probation</option>
                        <option>On leave</option>
                        <option>Offboarding</option>
                    </select>
                </label>
                <label className={styles.field}>
                    <span>Start date</span>
                    <input required type="date" value={form.startDate} onChange={(event) => field("startDate", event.target.value)} />
                </label>
                <label className={styles.field}>
                    <span>Annual salary (USD)</span>
                    <input required type="number" min="1000" step="500" value={form.salary} onChange={(event) => field("salary", event.target.value)} placeholder="85000" />
                </label>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <div className={styles.actions}>
                <button className={styles.cancel} type="button" onClick={closeModal}>Cancel</button>
                <button className={styles.save} type="submit">{employee ? "Save changes" : "Add employee"}</button>
            </div>
        </form>
    );
};

export default EmployeeForm;
