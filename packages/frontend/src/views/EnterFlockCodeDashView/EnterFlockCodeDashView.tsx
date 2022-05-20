import React from 'react';
import EnterFlockCodeInput from '../../components/EnterFlockCodeInput';
import TitleLayout from '../../layouts/TitleLayout';

const EnterFlockCodeDashView: React.FC = () => (
  <TitleLayout title="Join Meeting" content={<EnterFlockCodeInput showLabel />} />
);

export default EnterFlockCodeDashView;
