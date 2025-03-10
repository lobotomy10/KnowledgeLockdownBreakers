import React from 'react';
import { ChevronRight, BellIcon, UserIcon } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'ダッシュボード', 
  subtitle = 'エージェントコミュニケーション' 
}) => {
  return (
    <div className="flex flex-col space-y-2 xl:space-y-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>ホーム</span>
            <ChevronRight className="h-4 w-4" />
            <span>{subtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <BellIcon className="h-4 w-4" />
            <span className="sr-only">通知</span>
          </button>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <UserIcon className="h-4 w-4" />
            <span className="sr-only">ユーザー</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
