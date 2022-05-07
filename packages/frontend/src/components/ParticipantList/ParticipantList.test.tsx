import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ParticipantList from './ParticipantList';

type Participant = {
  name: string;
  id: string;
};

const participant1: Participant = {
  name: 'John Smith',
  id: '1',
};

const participant2: Participant = {
  name: 'Jane Doe',
  id: '2',
};

it('should render', () => {
  const { container } = render(<ParticipantList participants={[]} />);
  expect(container).toBeVisible();
});

it('should show all participant names', () => {
  render(<ParticipantList participants={[participant1, participant2]} />);
  const participantName1 = screen.getByText(/John Smith/i);
  const participantName2 = screen.getByText(/Jane Doe/i);
  expect(participantName1).toBeVisible();
  expect(participantName2).toBeVisible();
});

it('should have avatars with the first letter of the participant name', () => {
  render(<ParticipantList participants={[participant1]} />);
  const participantName1 = screen.getAllByText(/J/i);
  expect(participantName1).toHaveLength(2);
});
