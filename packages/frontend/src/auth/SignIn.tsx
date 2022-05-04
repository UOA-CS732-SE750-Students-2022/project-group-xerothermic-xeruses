import { useMutation, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_CURRENT_USER_NAME, CREATE_NEW_USER } from '../apollo/queries';
import { useAuth } from '../contexts/AuthContext';

const SignIn: React.FC = () => {
  const [getCurrentUser, { loading, error }] = useLazyQuery(GET_CURRENT_USER_NAME);
  const [createUser] = useMutation(CREATE_NEW_USER);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser(); // This will trigger `loading` to change
  }, [user]);

  useEffect(() => {
    if (loading || !error) return;

    const errorCode = error?.graphQLErrors[0].extensions.code;
    if (errorCode === '404') createFlockerUser(); // User does not exist -> create one
  }, [loading]);

  const createFlockerUser = () => {
    if (!user) return; // TODO: redirect to an "account could not be created" page
    const name = user.displayName;

    createUser({
      variables: {
        addUserInput: {
          name,
        },
      },
    });

    navigate('/dashboard', { replace: true });
  };

  return <></>;
};

export default SignIn;
