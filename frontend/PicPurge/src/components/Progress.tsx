import React from 'react';
import * as Progress from '@radix-ui/react-progress';
import './Progress.css';

interface ProgressBarProps {
  progress: number; // Receive the progress value as a prop
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
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

export default ProgressBar;
