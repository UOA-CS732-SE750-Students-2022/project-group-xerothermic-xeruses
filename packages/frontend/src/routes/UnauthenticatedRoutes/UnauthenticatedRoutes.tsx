import { Routes, Route } from 'react-router-dom';
import SignOut from '../../auth/SignOut';
import HomeView from '../../views/HomeView';
import SignInToJoinView from '../../views/SignInToJoinView';
import NotFoundView from '../../views/NotFoundView';

const UnauthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<HomeView />} />
    <Route path="/meeting/:id" element={<SignInToJoinView />} />
    <Route path="/signout" element={<SignOut />} />
    <Route path="*" element={<NotFoundView goBackLink="/" />} />
  </Routes>
);

export default UnauthenticatedRoutes;
