import { useAuth } from '../../contexts/AuthContext';
import BeforeFirstLoadView from '../../views/BeforeFirstLoadView';
import AuthenticatedRoutes from '../AuthenticatedRoutes';
import UnauthenticatedRoutes from '../UnauthenticatedRoutes';

const Routes = () => {
  const { signedIn, authLoaded } = useAuth();
  if (!authLoaded) return <BeforeFirstLoadView />;
  return signedIn ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
};

export default Routes;
