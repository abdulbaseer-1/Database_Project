import setting_style from './settings.module.css';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
    throw new Error("VITE_BACKEND_URL is not defined in the environment file");
}

function Settings() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Retrieve the token
    const role = localStorage.getItem('role');

    if (!token) {
        console.error("Token not found in local storage.");
    }

    const logout = async () => {
        try {
            const response = await axios.post(
                `${URL}/api/users/logout`, 
                {}, 
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include token
                    }
                }
            );
            
            console.log('Logout response:', response.data);
            localStorage.clear();
            sessionStorage.clear();
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        }
    };

    const deleteAccount = async () => {
        try {
            const response = await axios.delete(
                `${URL}/api/users/deleteAccount`, 
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include token
                    }
                }
            );
            console.log("Account deleted:", response.data);
            localStorage.clear();
            sessionStorage.clear();
            navigate('/');
        } catch (error) {
            console.error("Delete account error:", error);
            alert("Account deletion failed. Please try again.");
        }
    };

    return (
        <>
            <Header />
            <div className={setting_style.settingsContainer}>
                <a href="/Change_Password" className={setting_style.settingsLink}>
                    Change Password
                </a>
                <button 
                    onClick={logout} 
                    className={`${setting_style.settingsButton} ${setting_style.logoutButton}`}
                >
                    Logout
                </button>
                <button 
                    onClick={deleteAccount} 
                    className={`${setting_style.settingsButton} ${setting_style.deleteButton}`}
                >
                    Delete Account
                </button>
            </div>
            <Footer />
        </>
    );
}

export default Settings;
