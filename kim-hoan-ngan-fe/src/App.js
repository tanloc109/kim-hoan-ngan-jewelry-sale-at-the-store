import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Staff from './staff/Staff.js';
import Manager from './manager/Manager.js';
import Admin from './admin/Admin.js';
import Login from './staff/Login.js';
import ProtectedRoute from './staff/ProtectedRoute.js';
import ResetPassword from '../src/staff/ResetPassword.js';
import NotAuthorized from '../src/staff/NotAuthorized.js';
import NotFound from './staff/NotFound.js';
import CircularColor from './staff/CircularColor.js';
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/staff/*" element={
          <ProtectedRoute roles={['ROLE_STAFF']} element={Staff} />
        } />
        <Route path="/manager/*" element={
          <ProtectedRoute roles={['ROLE_MANAGER']} element={Manager} />
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute roles={['ROLE_ADMIN']} element={Admin} />
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    // <CircularColor />
  );

}

export default App;
