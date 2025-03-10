import React, { useState } from 'react';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom icon components to replace lucide-react
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LayoutDashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const HelpCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "../components/ui/sidebar";

interface NewSidebarProps {
  items?: string[];
  sidebar?: boolean; // left or right
}

const NewSidebar: React.FC<NewSidebarProps> = ({ items = [], sidebar = true }) => {
  // グラフの表示用サンプル
  const initialNodes = [
    { id: '1', position: { x: 180, y: 40 }, data: { label: '1' } },
    { id: '2', position: { x: 180, y: 100 }, data: { label: '2' } },
    { id: '3', position: { x: 300, y: 200 }, data: { label: '3' } },
    { id: '4', position: { x: 180, y: 250 }, data: { label: '4' } }
  ];
  
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e2-4', source: '2', target: '4' }
  ];

  // カスタムノードタイプ
  const nodeTypes = {
    custom: ({ data }: any) => (
      <div style={{ 
        background: '#fff', 
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        width: '150px',
        textAlign: 'center'
      }}>
        {data.label}
      </div>
    ),
  };

  // Define navigation items with icons
  const navigationItems = [
    { icon: <HomeIcon className="mr-2 h-4 w-4" />, label: 'ホーム', active: true },
    { icon: <LayoutDashboardIcon className="mr-2 h-4 w-4" />, label: 'ダッシュボード' },
    { icon: <FileTextIcon className="mr-2 h-4 w-4" />, label: 'ドキュメント' },
    { icon: <UsersIcon className="mr-2 h-4 w-4" />, label: 'チーム' },
  ];

  // Define settings items with icons
  const settingsItems = [
    { icon: <SettingsIcon className="mr-2 h-4 w-4" />, label: '設定' },
    { icon: <HelpCircleIcon className="mr-2 h-4 w-4" />, label: 'ヘルプ' },
  ];

  return (
    <SidebarProvider>
      <Sidebar side={sidebar ? "left" : "right"} collapsible="icon">
        <SidebarHeader className="border-b px-4 py-2">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="font-semibold">Fujitsu</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>ナビゲーション</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton isActive={item.active}>
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>カテゴリー</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton>
                      {item}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {!sidebar && (
            <SidebarGroup>
              <SidebarGroupLabel>エージェントステータス</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="bg-white rounded-lg p-2 mb-4" style={{ height: '250px' }}>
                  <ReactFlow 
                    nodes={initialNodes.map(node => ({ ...node, type: 'custom' }))}
                    edges={initialEdges}
                    nodeTypes={nodeTypes}
                    fitView
                    defaultEdgeOptions={{ 
                      type: 'default',
                      markerEnd: 'arrow',
                    }}
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">関連データ</h3>
                  <ul className="space-y-2">
                    <li><a href="https://google.co.jp/" target="_blank" className="text-blue-500 hover:underline">参照データ</a></li>
                    <li><a href="https://google.co.jp/" target="_blank" className="text-blue-500 hover:underline">参照データ</a></li>
                    <li><a href="https://google.co.jp/" target="_blank" className="text-blue-500 hover:underline">参照データ</a></li>
                  </ul>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          
          <SidebarGroup>
            <SidebarGroupLabel>設定</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton>
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <div className="text-xs text-muted-foreground">
            © 2025 Fujitsu
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

export default NewSidebar;
