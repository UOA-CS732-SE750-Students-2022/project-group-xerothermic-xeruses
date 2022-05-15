import React, { useEffect, useState } from 'react';

const ViewportHeightLayout: React.FC = ({ children }) => {
  const [height, setHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight);
    });
  }, []);

  return <div style={{ height }}>{children}</div>;
};

export default ViewportHeightLayout;
