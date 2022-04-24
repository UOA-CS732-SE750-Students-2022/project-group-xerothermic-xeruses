import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedRoutes from '../AuthenticatedRoutes';
import UnauthenticatedRoutes from '../UnauthenticatedRoutes';

const Routes = () => {
  const { signedIn } = useAuth();
  return signedIn ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
};

export default Routes;
