import React, { useState, useEffect } from 'react';
import './css/Sidebar.css';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface SidebarProps {
  items: string[];
  // left or right
  sidebar: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ items, sidebar }) => {
    useEffect(() => {
      // sidebar
      const leftBarElement = document.getElementById('leftSidebar');
      const rightBarElement = document.getElementById('rightSidebar');
      const chatContent = document.getElementsByClassName('content');

      // クラスの変更を監視する関数
      const handleClassChange = () => {
        // init
        if (chatContent && chatContent.length > 0) {
          chatContent[0].classList.remove("full_sidebar");
          chatContent[0].classList.remove("left_sidebar");
          chatContent[0].classList.remove("right_sidebar");
          chatContent[0].classList.remove("not_sidebar");

          if (leftBarElement?.classList.contains('leftsidebar-show') && rightBarElement?.classList.contains('rightsidebar-show')){
              chatContent[0].classList.add("full_sidebar");
          } else if (leftBarElement?.classList.contains('leftsidebar-show')) {
              chatContent[0].classList.add("left_sidebar");
          } else if (rightBarElement?.classList.contains('rightsidebar-show')) {
              chatContent[0].classList.add("right_sidebar");
          } else {
              chatContent[0].classList.add("not_sidebar");
          }
        }
      };
  
      // MutationObserverを使用してクラスの変更を監視
      if (leftBarElement && rightBarElement) {
        const observer = new MutationObserver(handleClassChange);
        observer.observe(leftBarElement, { attributes: true, attributeFilter: ['class'] });
        observer.observe(rightBarElement, { attributes: true, attributeFilter: ['class'] });
    
        // Clean
        return () => {
          observer.disconnect();
        };
      }
    }, []);

    // 表示/非表示を切り替える状況変数
    const [showSidebar, setShowSidebar] = useState(false);

    // 表示/非表示を切り替える関数
    function sidebarOpen() {
        setShowSidebar(!showSidebar);
    }

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

    return (
    <div id={sidebar ?'leftSidebar':'rightSidebar'} className={sidebar ? showSidebar ? 'sidebar leftsidebar-show' : 'sidebar leftsidebar-hidden': showSidebar ? 'sidebar rightsidebar-show' : 'sidebar rightsidebar-hidden'}>

      <button className={sidebar ?'leftSidebarButton': 'rightSidebarButton'} onMouseEnter={() => sidebarOpen()}>{sidebar ?showSidebar?"⇐":"⇒":showSidebar?"⇒":"⇐"}</button>

      <div className="sidebar-header">
        <div style={{fontSize: '25px'}}>{sidebar ? 'My History':''}</div>
      </div>
      
      <div className="sidebar-content">
        {sidebar?
            items.map((item, index) => (
                <div key={index}>
                    <details className="accordion-004">
                    <summary>{item}</summary>
                    <p>{"┗ "+index+"agent"}</p>
                    <p>{"┗ "+index+"agent"}</p>
                    <p>{"┗ "+index+"agent"}</p>
                    </details>
                </div>
            )):
            <div>
                <h2>Agent Status</h2>
                <div style={{ width: '500px', height: '350px', backgroundColor:'#fff' }}>
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
                <div className="list-4">
                    <div>関連データ</div>
                    <ul>
                    <li><a href="https://google.co.jp/" target="_blank">参照データ</a></li>
                    <li><a href="https://google.co.jp/" target="_blank">参照データ</a></li>
                    <li><a href="https://google.co.jp/" target="_blank">参照データ</a></li>
                    </ul>
                </div>
            </div>
        }
      </div>
    </div>
    );
};

export default Sidebar;
