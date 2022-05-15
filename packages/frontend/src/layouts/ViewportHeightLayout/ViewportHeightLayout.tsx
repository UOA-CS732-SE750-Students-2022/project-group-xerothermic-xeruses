import React from 'react';

const ViewportHeightLayout: React.FC = ({ children }) => <div style={{ height: window.innerHeight }}>{children}</div>;

export default ViewportHeightLayout;
