import React, { ChangeEvent, useEffect, useState } from 'react';
import Button from '../../components/Button';
import Datepicker from '../../components/Datepicker';
import Timepicker from '../../components/Timepicker';
import TitleLayout from '../../layouts/TitleLayout';
import LabeledContainerLayout from '../../layouts/LabeledContainerLayout';
import styles from './CreateMeetingView.module.css';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { FlockDayDTO } from '@flocker/api-types';
import {
  CREATE_FLOCK,
  GET_CURRENT_USER_NAME,
  JOIN_FLOCK,
  AddFlockInput,
  AddFlockResult,
  GetCurrentUserResult,
  JoinFlockInput,
  JoinFlockResult,
} from '../../apollo';

const NINE_AM = 9;
const FIVE_PM = 17;

export const CreateMeeting: React.FC = () => {
  const [meetingName, setMeetingName] = useState('New Meeting');
  const [errorText, setErrorText] = useState('');
  const [datesPicked, setDatesPicked] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState<Date>(new Date(0, 0, 0, NINE_AM));
  const [endTime, setEndTime] = useState<Date>(new Date(0, 0, 0, FIVE_PM));
  const navigate = useNavigate();

  const { loading: userLoading, data: userData } = useQuery<GetCurrentUserResult>(GET_CURRENT_USER_NAME);
  const [createFlock, { loading: addFlockLoading }] = useMutation<AddFlockResult, AddFlockInput>(CREATE_FLOCK, {
    onCompleted: (data) => joinMeeting(data.addFlock.flockCode),
    onError: () => setErrorText("Sorry, we couldn't create your meeting"),
  });
  const [joinFlock, { loading: joinFlockLoading }] = useMutation<JoinFlockResult, JoinFlockInput>(JOIN_FLOCK, {
    onCompleted: (data) => navigate(`/meeting/${data.joinFlock.flockCode}`),
    onError: () => setErrorText("Sorry, we couldn't create your meeting"),
  });

  const handleCreateClicked = () => {
    // Error handling
    if (!meetingName.trim()) return setErrorText('Please enter a meeting name');
    if (!datesPicked.length) return setErrorText('Please select at least one date');
    if (startTime >= endTime) return setErrorText('Please select a valid time range');
    setErrorText('');
    createMeeting();
  };

  const createMeeting = () => {
    const startTimeHours = startTime.getHours();
    const endTimeHours = endTime.getHours();
    const flockDays: FlockDayDTO[] = datesPicked.map((d) => ({
      start: new Date(new Date(d).setHours(startTimeHours)),
      end: new Date(new Date(d).setHours(endTimeHours)),
    }));
    createFlock({ variables: { addFlockInput: { name: meetingName, flockDays } } });
  };

  const joinMeeting = (flockCode: string) => joinFlock({ variables: { flockCode } });
  const meetingNameChanged = (e: ChangeEvent<HTMLInputElement>) => setMeetingName(e.target.value);

  useEffect(() => {
    if (userData) setMeetingName(`${userData.getCurrentUser.name}'s Meeting`);
  }, [userData]);

  if (userLoading || addFlockLoading || joinFlockLoading) return <CircularProgress />;
  return (
    <div className={styles.container}>
      <div className={styles.meetingName}>
        <label htmlFor="meeting-name">Name your meeting</label>
        <input type="text" id="meeting-name" value={meetingName} onChange={meetingNameChanged} required />
      </div>

      <div className={styles.pickers}>
        <div>
          <LabeledContainerLayout label="Choose your dates" content={<Datepicker datesPicked={setDatesPicked} />} />
        </div>
        <div>
          <LabeledContainerLayout
            label="Choose your times"
            content={
              <div className={styles.times}>
                <Timepicker timeChanged={setStartTime} label="No earlier than" defaultValue="9:00 am" />
                <Timepicker timeChanged={setEndTime} label="No later than" defaultValue="5:00 pm" />
              </div>
            }
          />
        </div>
      </div>
      <div className={styles.bottom}>
        <em className={styles.errorText}>{errorText}</em>
        <Button variant="filled" color="primary" onClick={handleCreateClicked}>
          Create
        </Button>
      </div>
    </div>
  );
};

const CreateMeetingView: React.FC = () => <TitleLayout title="Create New Meeting" content={<CreateMeeting />} />;

export default CreateMeetingView;
