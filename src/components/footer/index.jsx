import { Tooltip } from "react-tooltip";
import { FiMail, FiCoffee, FiGlobe, FiHeart } from "react-icons/fi";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaPatreon, FaYoutube } from "react-icons/fa6";
import { SiCodepen } from "react-icons/si";
import styles from "./styles.module.css";

const links = [
    { label: "Portfolio", href: "https://www.ashishranjan.net", detail: "ashishranjan.net", icon: FiGlobe },
    { label: "GitHub", href: "https://github.com/a2rp", detail: "github.com/a2rp", icon: FaGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", detail: "codepen.io/ash1198", icon: SiCodepen },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", detail: "linkedin.com/in/aashishranjan", icon: FaLinkedinIn },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", detail: "facebook.com/theash.ashish", icon: FaFacebookF },
    { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", detail: "youtube.com/@ashishranjan-ashz", icon: FaYoutube },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", detail: "ash.ranjan09@gmail.com", icon: FiMail },
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/", detail: "a2rp-donation-page.netlify.app", icon: FiHeart },
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/ashishranjan", detail: "buymeacoffee.com/ashishranjan", icon: FiCoffee },
    { label: "Patreon", href: "https://www.patreon.com/ashishranjan", detail: "patreon.com/ashishranjan", icon: FaPatreon },
];

const Footer = () => <footer className={styles.footer}>
    <div className={styles.identity}>
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" />
        <span><strong>Morrow HR</strong><small>People operations workspace</small></span>
    </div>
    <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p>
        <nav className={styles.social} aria-label="Connect and support">
            {links.map(({ label, href, detail, icon: Icon }) => <a key={label} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel={href.startsWith("mailto:") ? undefined : "noreferrer"} aria-label={label} data-tooltip-id="morrow-footer-tooltip" data-tooltip-content={`${label}\n${detail}`}>
                <Icon aria-hidden="true" />
            </a>)}
            <Tooltip id="morrow-footer-tooltip" place="top" className={styles.tooltip} />
        </nav>
    </div>
</footer>;

export default Footer;

