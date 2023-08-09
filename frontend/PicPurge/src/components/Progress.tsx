import React, { useState, useEffect } from 'react';
import * as Progress from '@radix-ui/react-progress';
import './Progress.css';

const ProgressDemo: React.FC = () => {
  const [progress, setProgress] = useState<number>(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ProgressContainer">
      <Progress.Root className="ProgressRoot" value={progress}>
        <Progress.Indicator
          className="ProgressIndicator"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
    </div>
  );
};

export default ProgressDemo;