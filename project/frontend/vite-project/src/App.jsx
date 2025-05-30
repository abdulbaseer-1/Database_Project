import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/Home/Home.jsx';
import BookingsPage from './pages/Bookings/Bookings.jsx';
import BookBus from './pages/Book_Bus/Book_Bus.jsx';
import ProfilePage from './pages/Profile/Profile.jsx';
import SettingsPage from './pages/settings/settings.jsx';
import AboutPage from './pages/ContactUs/ContactUs.jsx';
import NotFoundPage from './pages/NotFound/NotFound.jsx';
import SiginSignup from './pages/SigninSignupPage/SigninSignupPage.jsx';
import Query from './pages/Query_Page/query_page.jsx';
import BusManagementForm from './pages/Bus_Page/Bus_page.jsx';
import RouteManager from './pages/Route_Page/Route_Page.jsx';
import { UserProvider } from './components/contexts/userContexts.jsx';
import { BusProvider } from './components/contexts/bustableContext.jsx';

const App = () => {
  return (
  <BusProvider>
  <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SiginSignup />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Bookings" element={<BookingsPage />} />
        <Route path="/BookBus" element={<BookBus />} />
        <Route path="/Settings" element={<SettingsPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/ContactUs" element={<AboutPage />} />
        <Route path="/Query" element={<Query />}/>
        <Route path="/Routes" element={<RouteManager/>}/>
        <Route path="/Buses" element={<BusManagementForm/>}/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  </UserProvider>
  </BusProvider>
  );
};

export default App;
