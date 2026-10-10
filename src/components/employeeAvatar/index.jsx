import styles from "./styles.module.css";

const EmployeeAvatar = ({ name, initials, color = "plum", size = "regular" }) => (
    <span className={`${styles.avatar} ${styles[color] || ""} ${styles[size] || ""}`} aria-hidden="true">
        {initials || name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")}
    </span>
);

export default EmployeeAvatar;
