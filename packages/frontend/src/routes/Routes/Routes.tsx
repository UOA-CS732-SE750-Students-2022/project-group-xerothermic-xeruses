import { useAuth } from '../../contexts/AuthContext';
import AuthenticatedRoutes from '../AuthenticatedRoutes';
import UnauthenticatedRoutes from '../UnauthenticatedRoutes';

const Routes = () => {
  const { signedIn, authLoaded } = useAuth();
  if (!authLoaded) return null;
  return signedIn ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
};

export default Routes;
