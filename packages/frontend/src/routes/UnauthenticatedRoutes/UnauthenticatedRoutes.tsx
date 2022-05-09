import { Routes, Route } from 'react-router-dom';
import HomeView from '../../views/HomeView';
import NotFoundView from '../../views/NotFoundView';

const UnauthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<HomeView />}></Route>
    <Route path="*" element={<NotFoundView goBackLink="/" />} />
  </Routes>
);

export default UnauthenticatedRoutes;
