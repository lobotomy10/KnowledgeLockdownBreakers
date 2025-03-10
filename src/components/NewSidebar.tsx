import React, { useState } from 'react';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  HomeIcon, 
  LayoutDashboardIcon, 
  FileTextIcon, 
  UsersIcon, 
  SettingsIcon,
  HelpCircleIcon
} from 'lucide-react';

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
