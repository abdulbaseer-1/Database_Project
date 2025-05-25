import Signin_Signup_Component from "../../components/SigninSignup/SigninSignup.jsx";
import styles from "./SigninSignupPage.module.css";

function SiginSignup({ children }) {
    return (
        <div className={styles.siginSignupPage}>
            <div className={styles.siginSignupContent}>
                <h1 className={styles.siginSignupTitle}>Welcome to the Signup Page</h1>
                {children}
                <Signin_Signup_Component />
            </div>
        </div>
    );
}

export default SiginSignup;
