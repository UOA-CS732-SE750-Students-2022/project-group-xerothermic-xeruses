import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../../auth/SignIn';
import DashboardView from '../../views/DashboardView';

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/signin" />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/dashboard" element={<DashboardView />} />
  </Routes>
);

export default AuthenticatedRoutes;
