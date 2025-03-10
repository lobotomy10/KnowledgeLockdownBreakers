import React from 'react';
import '../css/Chat.css';
import { SidebarProvider } from '../../components/ui/sidebar';
import NewSidebar from '../NewSidebar';
import Header from '../Header';
import NewResponder from './NewResponder';

const NewChatComponent: React.FC = () => {
  // menuItem ////api////
  const getMyHistory = () => {
    // Implementation would go here
  };

  const menuItems = ['商談推進', '技術検証', '営業支援', 'その他'];
  const leftSidebar = true;
  const rightSidebar = false;

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar */}
        <NewSidebar items={menuItems} sidebar={leftSidebar} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Header title="エージェント" subtitle="コミュニケーション" />
            <div className="mt-6">
              <NewResponder />
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <NewSidebar items={menuItems} sidebar={rightSidebar} />
      </div>
    </SidebarProvider>
  );
};

export default NewChatComponent;
