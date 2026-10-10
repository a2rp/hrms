import { FiArrowRight, FiCalendar, FiCheck, FiClock, FiCoffee, FiMapPin, FiPlus, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import EmployeeAvatar from "../../components/employeeAvatar/index.jsx";
import useApp from "../../context/useApp.js";
import { formatDate } from "../../utils.js";
import styles from "./styles.module.css";

const Overview = () => {
    const { employees, attendance, leaveRequests, askConfirmation, reviewLeaveRequest, showToast } = useApp();
    const active = employees.filter((person) => person.status === "Active" || person.status === "Probation").length;
    const present = attendance.filter((record) => ["Present", "Remote", "Late"].includes(record.status)).length;
    const pending = leaveRequests.filter((request) => request.status === "Pending");
    const departments = [...new Set(employees.map((person) => person.department))].map((department) => ({
        name: department,
        count: employees.filter((person) => person.department === department).length,
    })).sort((a, b) => b.count - a.count);
    const maxTeam = Math.max(...departments.map((team) => team.count), 1);
    const waiting = employees.filter((person) => !attendance.some((entry) => entry.employeeId === person.id && entry.status !== "Not started")).length;

    const review = (request, status) => askConfirmation({
        title: `${status} this time off request?`,
        message: `${status === "Approved" ? `${request.days} day${request.days === 1 ? "" : "s"} will be deducted from` : "This will decline the request from"} ${employees.find((person) => person.id === request.employeeId)?.name || "this employee"}’s ${request.type.toLowerCase()} balance.`,
        confirmLabel: status,
        tone: status === "Declined" ? "danger" : "default",
        onConfirm: () => {
            const result = reviewLeaveRequest(request.id, status);
            if (result.error) showToast(result.error, "error");
        },
    });

    return <div className={styles.page}>
        <section className={styles.intro}>
            <div><p className={styles.eyebrow}>{new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</p>
                <h1>Your people, in good company.</h1>
                <p>Everyday people operations, all in one considered view.</p>
            </div>
            <Link className={styles.primaryAction} to="/people"><FiUsers aria-hidden="true" /> Meet your people <FiArrowRight aria-hidden="true" /></Link>
        </section>

        <section className={styles.metrics} aria-label="People operations summary">
            <article className={styles.metric}><span className={styles.metricIcon}><FiUsers aria-hidden="true" /></span><div><span>People on the team</span><strong>{employees.length}</strong><small>{active} active colleagues</small></div></article>
            <article className={styles.metric}><span className={`${styles.metricIcon} ${styles.mint}`}><FiCheck aria-hidden="true" /></span><div><span>Here today</span><strong>{present}<em> / {employees.length}</em></strong><small>{waiting} yet to check in</small></div></article>
            <article className={styles.metric}><span className={`${styles.metricIcon} ${styles.gold}`}><FiCalendar aria-hidden="true" /></span><div><span>Time off to review</span><strong>{pending.length}</strong><small>{pending.length ? "Needs a thoughtful look" : "You’re all caught up"}</small></div></article>
            <article className={styles.metric}><span className={`${styles.metricIcon} ${styles.peach}`}><FiClock aria-hidden="true" /></span><div><span>On a different path</span><strong>{employees.filter((person) => person.status === "On leave" || person.status === "Offboarding").length}</strong><small>Leave or offboarding status</small></div></article>
        </section>

        <div className={styles.columns}>
            <section className={`${styles.panel} ${styles.teamPanel}`}>
                <div className={styles.panelHeading}><div><span className={styles.kicker}>THE PEOPLE</span><h2>A team taking shape</h2><p>A quick look at how we work together.</p></div><Link className={styles.textLink} to="/people">People directory <FiArrowRight aria-hidden="true" /></Link></div>
                <div className={styles.departments}>{departments.map((team) => <div className={styles.department} key={team.name}>
                    <div className={styles.departmentLabel}><span>{team.name}</span><strong>{team.count}</strong></div>
                    <div className={styles.track} aria-label={`${team.name}: ${team.count} people`}><span style={{ width: `${Math.max(team.count / maxTeam * 100, 9)}%` }} /></div>
                </div>)}</div>
                <div className={styles.teamImage}>
                    <img src={`${import.meta.env.BASE_URL}images/team-collaboration.jpg`} alt="Colleagues sharing ideas around a laptop" />
                    <div><span className={styles.imageKicker}>ROOM TO GROW</span><strong>Good work happens together.</strong><p>Keep the people details that help your team feel seen, close at hand.</p></div>
                </div>
            </section>

            <section className={`${styles.panel} ${styles.leavePanel}`}>
                <div className={styles.panelHeading}><div><span className={styles.kicker}>A LITTLE CARE</span><h2>Time off to review</h2><p>Make space for your team to recharge.</p></div><Link className={styles.iconAction} to="/leave" aria-label="Open all time off requests"><FiArrowRight aria-hidden="true" /></Link></div>
                {pending.length ? <div className={styles.requestList}>{pending.slice(0, 4).map((request) => {
                    const person = employees.find((employee) => employee.id === request.employeeId);
                    if (!person) return null;
                    return <article className={styles.request} key={request.id}>
                        <EmployeeAvatar name={person.name} initials={person.initials} color={person.color} />
                        <div className={styles.requestInfo}><strong>{person.name}</strong><span>{request.type} · {request.days} day{request.days === 1 ? "" : "s"}</span><small>{formatDate(request.startDate, { year: undefined })}{request.startDate !== request.endDate ? ` – ${formatDate(request.endDate, { year: undefined })}` : ""}</small></div>
                        <div className={styles.requestActions}><button type="button" onClick={() => review(request, "Approved")} aria-label={`Approve ${person.name}’s request`}><FiCheck aria-hidden="true" /></button><button type="button" onClick={() => review(request, "Declined")} aria-label={`Decline ${person.name}’s request`}><FiPlus aria-hidden="true" /></button></div>
                    </article>;
                })}</div> : <div className={styles.empty}><span><FiCoffee aria-hidden="true" /></span><strong>A moment to breathe</strong><p>No pending time off requests right now.</p></div>}
                <Link className={styles.panelFooterLink} to="/leave">View time off calendar <FiArrowRight aria-hidden="true" /></Link>
            </section>
        </div>

        <section className={styles.bottomGrid}>
            <div className={styles.attendancePanel}>
                <div className={styles.panelHeading}><div><span className={styles.kicker}>TODAY, TOGETHER</span><h2>Checking in</h2><p>Today’s attendance at a glance.</p></div><Link className={styles.iconAction} to="/attendance" aria-label="Manage attendance"><FiArrowRight aria-hidden="true" /></Link></div>
                <div className={styles.attendanceSummary}>
                    {["Present", "Remote", "Late", "Not started"].map((status) => <div className={styles.attendanceItem} key={status}><span className={`${styles.dot} ${styles[`dot${status.replaceAll(" ", "")}`]}`} /><span>{status}</span><strong>{attendance.filter((record) => record.status === status).length}</strong></div>)}
                </div>
                <Link className={styles.textLink} to="/attendance">Open attendance <FiArrowRight aria-hidden="true" /></Link>
            </div>
            <div className={styles.noteCard}>
                <div className={styles.noteIcon}><FiMapPin aria-hidden="true" /></div>
                <span className={styles.kicker}>THOUGHTFUL BY DESIGN</span>
                <h2>Make room for people.</h2>
                <p>Morrow gathers the little details that help teams make better everyday decisions.</p>
                <Link to="/people">Get to know the team <FiArrowRight aria-hidden="true" /></Link>
            </div>
        </section>
    </div>;
};

export default Overview;
