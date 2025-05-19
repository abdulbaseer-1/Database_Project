import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/Home/Home.jsx';
import BookingsPage from './pages/Bookings/Bookings.jsx';
import ProfilePage from './pages/Profile/Profile.jsx';
import SettingsPage from './pages/Settings/Settings.jsx';
import AboutPage from './pages/ContactUs/ContactUs.jsx';
import NotFoundPage from './pages/NotFound/NotFound.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Bookings" element={<BookingsPage />} />
        <Route path="/Settings" element={<SettingsPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/ContactUs" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
