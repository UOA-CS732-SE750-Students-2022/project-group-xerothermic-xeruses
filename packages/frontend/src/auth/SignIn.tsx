import { useMutation, useLazyQuery } from '@apollo/client';
import { User } from 'firebase/auth';
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_CURRENT_USER_NAME, CREATE_NEW_USER } from '../apollo/queries';
import { useAuth } from '../contexts/AuthContext';

const SignIn: React.FC = () => {
  const [getCurrentUser, { loading, error, data }] = useLazyQuery(GET_CURRENT_USER_NAME);
  const [createUser] = useMutation(CREATE_NEW_USER);
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

  useEffect(() => {
    getCurrentUser(); // This will trigger `loading` to change
  }, [user, getCurrentUser]);

  useEffect(() => {
    if (loading) return;
    if (data) navigate('/dashboard', { replace: true }); // User exists, go to dashboard

    if (error) {
      const errorCode = error.graphQLErrors[0].extensions.code;
      (async () => {
        if (errorCode === '404' && user) {
          // User does not exist
          await createFlockerUser(user);
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/', { replace: true }); // TODO: redirect to an "account could not be created" page
        }
      })();
    }
  }, [createFlockerUser, loading, data, error, navigate, user]);

  return <></>;
};

export default SignIn;
