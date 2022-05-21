import React, { useState } from 'react';
import styles from './ImportCalModal.module.css';
import Button from '../Button';
import { Modal } from '@mui/material';
import { useMutation } from '@apollo/client';
import { AddiCalInput, AddiCalResult, ADD_ICAL } from '../../apollo';

type ImportCalModalProps = { open: boolean; onClose?: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void };

const ImportCalModal: React.FC<ImportCalModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState<string>('');
  const [icalLink, setIcalLink] = useState<string>('');
  const [importSuccessText, setImportSuccessText] = useState<string>('');
  const [importErrorText, setImportErrorText] = useState<string>('');

  const [importCal] = useMutation<AddiCalResult, AddiCalInput>(ADD_ICAL, {
    onCompleted: () => setImportSuccessText('Import successful'),
    onError: () => setImportErrorText('Sorry, something went wrong :('),
  });

  const importCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    setImportSuccessText('');
    importCal({ variables: { userAvailabilitySources: [{ type: 'ical', name, uri: icalLink }] } });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
    >
      <div className={styles.modal}>
        <h1 className={styles.title}>Import Calendar</h1>
        <p className={`${styles.successText} ${styles.statusText}`}>{importSuccessText}</p>
        <p className={`${styles.errorText} ${styles.statusText}`}>{importErrorText}</p>
        <form className={styles.form} onSubmit={importCalendar}>
          <div>
            <label htmlFor="calendar-name">Name</label>
            <input type="text" id="calendar-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="calendar-link">Calendar link</label>
            <input
              type="text"
              id="calendar-link"
              value={icalLink}
              onChange={(e) => setIcalLink(e.target.value)}
              required
            />
          </div>
          <Button color="primary" type="submit">
            Import
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default ImportCalModal;
