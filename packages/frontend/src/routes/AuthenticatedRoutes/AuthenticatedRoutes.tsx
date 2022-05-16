import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../../auth/SignIn';
import SignOut from '../../auth/SignOut';
import DashboardLayout from '../../layouts/DashboardLayout';
import CalendarView from '../../views/CalendarView';
import CreateMeetingView from '../../views/CreateMeetingView';
import MeetingsView from '../../views/MeetingsView';
import NotFoundView from '../../views/NotFoundView';

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/signin" />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<Navigate to="meetings" />} />
      <Route path="meetings" element={<MeetingsView />} />
      <Route path="create-meeting" element={<CreateMeetingView />} />
    </Route>
    <Route path="/:flockCode">
      <Route index element={<Navigate to="calendar" />} />
      <Route path="calendar" element={<CalendarView />} />
    </Route>
    <Route path="/signout" element={<SignOut />} />
    <Route path="*" element={<NotFoundView goBackLink="/dashboard" />} />
  </Routes>
);

export default AuthenticatedRoutes;
