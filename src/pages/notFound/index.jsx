import { FiArrowLeft, FiGrid } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const NotFound = () => {
    const navigate = useNavigate();
    return <div className={styles.page}><div className={styles.illustration}><span>4</span><i>✿</i><span>4</span></div><p className={styles.eyebrow}>A SMALL DETOUR</p><h1>This page isn’t in the directory.</h1><p className={styles.copy}>The address may have changed, or the page may have wandered off.</p><div className={styles.actions}><button type="button" onClick={() => navigate(-1)}><FiArrowLeft aria-hidden="true" /> Go back</button><Link to="/"><FiGrid aria-hidden="true" /> Return to overview</Link></div></div>;
};

export default NotFound;
