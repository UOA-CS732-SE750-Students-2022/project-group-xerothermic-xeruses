import { useLazyQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetCurrentFlockResult, GetFlockInput, GET_FLOCK_NAME } from '../../apollo';
import Button from '../Button';
import styles from './EnterFlockCodeInput.module.css';

type EnterFlockCodeInputProps = {
  showLabel?: boolean;
  centered?: boolean;
};

const EnterFlockCodeInput: React.FC<EnterFlockCodeInputProps> = ({ showLabel = false, centered = false }) => {
  const [flockCode, setFlockCode] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [getFlock, { data, error }] = useLazyQuery<GetCurrentFlockResult, GetFlockInput>(GET_FLOCK_NAME);
  const navigate = useNavigate();

  const join = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    getFlock({ variables: { flockCode } });
    if (error) {
      if (error.message.includes('Invalid flock code')) setErrorText('Flock code is invalid');
      else setErrorText('An error occurred');
    }
    if (data) navigate(`/meeting/${flockCode}`);
  };

  return (
    <form onSubmit={join}>
      <div className={`${styles.form} ${centered ? styles.centered : ''}`}>
        {showLabel && <label htmlFor="flock-code">Enter flock code</label>}
        <div className={styles.input}>
          <input
            placeholder="Flock Code"
            type="text"
            id="flock-code"
            value={flockCode}
            onChange={(e) => setFlockCode(e.target.value)}
            required
          />
          <Button color="primary" type="submit">
            Join
          </Button>
        </div>
        {errorText && <p className={styles.errorText}>{errorText}</p>}
      </div>
    </form>
  );
};

export default EnterFlockCodeInput;
