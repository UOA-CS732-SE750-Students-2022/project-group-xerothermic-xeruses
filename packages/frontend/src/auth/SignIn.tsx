import { useMutation, useLazyQuery, ApolloError } from '@apollo/client';
import { User } from 'firebase/auth';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_CURRENT_USER_NAME, CREATE_NEW_USER } from '../apollo/queries';
import { useAuth } from '../contexts/AuthContext';
import BeforeFirstLoadView from '../views/BeforeFirstLoadView';

const SignIn: React.FC = () => {
  const [createUser] = useMutation(CREATE_NEW_USER);
  const [getCurrentUser, { data, error }] = useLazyQuery(GET_CURRENT_USER_NAME);
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
      getCurrentUser();
    } else {
      navigate('/', { replace: true }); // TODO: redirect to an "account could not be created" page
    }
  };

  const handleSuccess = () => navigate('/dashboard', { replace: true });

  const errorCallback = useCallback(handleError, []);
  const successCallback = useCallback(handleSuccess, []);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (error) errorCallback(error);
  }, [error, errorCallback]);

  useEffect(() => {
    if (data) successCallback();
  }, [data, successCallback]);

  return <BeforeFirstLoadView />;
};

export default SignIn;
