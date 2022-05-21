import { useMutation, useLazyQuery, ApolloError } from '@apollo/client';
import { User } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_CURRENT_USER_NAME, CREATE_NEW_USER } from '../apollo/queries';
import { useAuth } from '../contexts/AuthContext';
import BeforeFirstLoadView from '../views/BeforeFirstLoadView';

const SignIn: React.FC = () => {
  const [createUser] = useMutation(CREATE_NEW_USER);
  const [getCurrentUser, { data, error }] = useLazyQuery(GET_CURRENT_USER_NAME);
  const [userCreated, setUserCreated] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const createFlockerUser = useCallback(
    async (user: User) => {
      const name = user.displayName;
      await createUser({
        variables: {
          addUserInput: {
            name,
          },
        },
      });
    },
    [createUser],
  );

  const handleError = useCallback(
    async (err: ApolloError) => {
      const errorCode = err.graphQLErrors[0].extensions.code;
      if (errorCode === '404' && user) {
        // User does not exist
        setUserCreated(true);
        await createFlockerUser(user);
        getCurrentUser();
      } else {
        navigate('/', { replace: true }); // TODO: redirect to an "account could not be created" page
      }
    },
    [createFlockerUser, getCurrentUser, navigate, user],
  );

  const handleSuccess = useCallback(() => navigate('/dashboard', { replace: true }), [navigate]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (error && !userCreated) {
      handleError(error);
    }
  }, [error, userCreated, handleError]);

  useEffect(() => {
    if (data) handleSuccess();
  }, [data, handleSuccess]);

  return <BeforeFirstLoadView />;
};

export default SignIn;
