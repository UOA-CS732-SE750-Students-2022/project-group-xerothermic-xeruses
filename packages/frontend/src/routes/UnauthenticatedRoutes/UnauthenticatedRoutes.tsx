import { Routes, Route } from 'react-router-dom';
import HomeView from '../../views/HomeView';
import SignInToJoinView from '../../views/SignInToJoinView';

const UnauthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<HomeView />} />
    <Route path="/meeting/:id" element={<SignInToJoinView />} />
  </Routes>
);

export default UnauthenticatedRoutes;
