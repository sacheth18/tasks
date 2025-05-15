import type { FC } from 'react';

interface TimeDisplayProps {
  formattedTime: string;
  className?: string;
}

const TimeDisplay: FC<TimeDisplayProps> = ({ formattedTime, className }) => {
  return (
    <div className={`text-5xl font-mono font-semibold text-center ${className}`}>
      {formattedTime}
    </div>
  );
};

export default TimeDisplay;
