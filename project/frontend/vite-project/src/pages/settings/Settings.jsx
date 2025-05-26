import setting_style from './settings.module.css';
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const URL = import.meta.env.VITE_BACKEND_URL;

if (!URL) {
    throw new Error("VITE_BACKEND_URL is not defined in the environment file");
}

function Settings() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const logout = async () => {
    try {
        const response = await axios.post(`${URL}/api/users/logout`, {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Logout response:', response.data);
        
        localStorage.clear('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        navigate("/SigninSignup");
    } catch (error) {
        console.error("Logout error:", error);
        alert("Logout failed. Please try again.");
    }
  };
  
    const deleteAccount = async () => {
      try {
          const response = await axios.delete(`${URL}/api/users/deleteAccount`, {} ,{ //You're passing the config options as the request body//incorrect
              withCredentials: true,
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          if(!response){
            return console.log("not deleted :)");
          }
          console.log("deleted :(");
          navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
      };

  return(
    <>
      <Header/>
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
      <Footer/>
    </>
  );
}

export default Settings;