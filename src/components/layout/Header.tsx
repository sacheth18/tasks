import type { FC } from 'react';
import { TimerIcon } from 'lucide-react';

const Header: FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 bg-card shadow-md">
      <div className="container mx-auto flex items-center">
        <TimerIcon className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold text-primary">TrackStar</h1>
      </div>
    </header>
  );
};

export default Header;
