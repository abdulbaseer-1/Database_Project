import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/Home/Home.jsx';
import BookingsPage from './pages/Bookings/Bookings.jsx';
import ProfilePage from './pages/Profile/Profile.jsx';
import SettingsPage from './pages/settings/settings.jsx';
import AboutPage from './pages/ContactUs/ContactUs.jsx';
import NotFoundPage from './pages/NotFound/NotFound.jsx';
import SiginSignup from './pages/SigninSignupPage/SigninSignupPage.jsx';
import Query from './pages/Query_Page/query_page.jsx';
import { UserProvider } from './components/contexts/userContexts.jsx';

const App = () => {
  return (
  <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SiginSignup />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Bookings" element={<BookingsPage />} />
        <Route path="/Settings" element={<SettingsPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/ContactUs" element={<AboutPage />} />
        <Route path="/Query" element={<Query />}/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </UserProvider>
  );
};

export default App;
