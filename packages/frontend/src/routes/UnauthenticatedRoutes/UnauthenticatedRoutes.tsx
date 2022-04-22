import { Routes, Route } from 'react-router-dom';
import HomeView from '../../views/HomeView';

const UnauthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<HomeView />}></Route>
  </Routes>
);

export default UnauthenticatedRoutes;
