import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../../auth/SignIn';

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/signin" />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/dashboard" element={<></>} />
  </Routes>
);

export default AuthenticatedRoutes;
