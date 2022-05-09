import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../../auth/SignIn';
import DashboardLayout from '../../layouts/DashboardLayout';
import MeetingsView from '../../views/MeetingsView';
import NotFoundView from '../../views/NotFoundView';

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/signin" />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<Navigate to="meetings" />} />
      <Route path="meetings" element={<MeetingsView />} />
    </Route>
    <Route path="*" element={<NotFoundView goBackLink="/dashboard" />} />
  </Routes>
);

export default AuthenticatedRoutes;
