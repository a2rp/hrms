import { FiBriefcase, FiCalendar, FiEdit2, FiMapPin, FiTrash2 } from "react-icons/fi";
import EmployeeAvatar from "../employeeAvatar/index.jsx";
import EmployeeForm from "../employeeForm/index.jsx";
import useApp from "../../context/useApp.js";
import { formatCurrency, formatDate } from "../../utils.js";
import styles from "./styles.module.css";

const EmployeeProfile = ({ employee }) => {
    const { closeModal, openModal, askConfirmation, removeEmployee } = useApp();

    const editProfile = () => openModal({
        title: "Edit employee profile",
        description: `Update ${employee.name}’s people record.`,
        content: <EmployeeForm employee={employee} />,
    });

    const confirmRemoval = () => {
        closeModal();
        askConfirmation({
            title: "Remove employee?",
            message: `${employee.name} and their demo attendance, time off, and payroll records will be removed from this workspace. This cannot be undone.`,
            confirmLabel: "Remove employee",
            tone: "danger",
            onConfirm: () => removeEmployee(employee.id),
        });
    };

    return (
        <div className={styles.profile}>
            <section className={styles.person}>
                <EmployeeAvatar name={employee.name} initials={employee.initials} color={employee.color} size="large" />
                <div>
                    <h3>{employee.name}</h3>
                    <p>{employee.role}</p>
                    <span className={`${styles.status} ${styles[employee.status.toLowerCase().replaceAll(" ", "")] || ""}`}>{employee.status}</span>
                </div>
            </section>
            <section className={styles.section}>
                <h4>Work details</h4>
                <dl className={styles.details}>
                    <div><dt><FiBriefcase aria-hidden="true" /> Department</dt><dd>{employee.department}</dd></div>
                    <div><dt><FiMapPin aria-hidden="true" /> Location</dt><dd>{employee.location}</dd></div>
                    <div><dt>Manager</dt><dd>{employee.manager}</dd></div>
                    <div><dt>Employment</dt><dd>{employee.employmentType}</dd></div>
                    <div><dt><FiCalendar aria-hidden="true" /> Start date</dt><dd>{formatDate(employee.startDate)}</dd></div>
                    <div><dt>Annual salary</dt><dd>{formatCurrency(employee.salary)}</dd></div>
                </dl>
            </section>
            <section className={styles.section}>
                <h4>Contact</h4>
                <dl className={styles.details}>
                    <div><dt>Work email</dt><dd><a href={`mailto:${employee.email}`}>{employee.email}</a></dd></div>
                    <div><dt>Phone</dt><dd>{employee.phone || "Not added"}</dd></div>
                </dl>
            </section>
            <section className={styles.leave}>
                <div><span>Annual</span><strong>{employee.leave.annual} days</strong></div>
                <div><span>Sick</span><strong>{employee.leave.sick} days</strong></div>
                <div><span>Personal</span><strong>{employee.leave.personal} days</strong></div>
            </section>
            <div className={styles.actions}>
                <button className={styles.remove} type="button" onClick={confirmRemoval}><FiTrash2 aria-hidden="true" /> Remove</button>
                <button className={styles.edit} type="button" onClick={editProfile}><FiEdit2 aria-hidden="true" /> Edit profile</button>
            </div>
        </div>
    );
};

export default EmployeeProfile;
