import { useMutation, useLazyQuery, ApolloError } from '@apollo/client';
import { User } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_CURRENT_USER_NAME, CREATE_NEW_USER } from '../apollo/queries';
import { useAuth } from '../contexts/AuthContext';
import BeforeFirstLoadView from '../views/BeforeFirstLoadView';

const SignIn: React.FC = () => {
  const [createUser] = useMutation(CREATE_NEW_USER);
  const { user } = useAuth();
  const navigate = useNavigate();

  const createFlockerUser = async (user: User) => {
    const name = user.displayName;
    await createUser({
      variables: {
        addUserInput: {
          name,
        },
      },
    });
  };

  const handleError = async (err: ApolloError) => {
    const errorCode = err.graphQLErrors[0].extensions.code;
    if (errorCode === '404' && user) {
      // User does not exist
      await createFlockerUser(user);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true }); // TODO: redirect to an "account could not be created" page
    }
  };

  const [getCurrentUser] = useLazyQuery(GET_CURRENT_USER_NAME, {
    onCompleted: () => navigate('/dashboard', { replace: true }),
    onError: handleError,
  });

  useEffect(() => {
    getCurrentUser();
  }, [user, getCurrentUser]);

  return <BeforeFirstLoadView />;
};

export default SignIn;
