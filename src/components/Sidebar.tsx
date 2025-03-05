import React from 'react';
import './css/Sidebar.css';
import { ReactFlow, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomEdge from './edges/CustomEdge';

// Import useState and useEffect directly from the React object
const { useState, useEffect } = React;

// Define types for ReactFlow nodes and edges
interface NodeData {
  label: string;
}

interface Node {
  id: string;
  position: { x: number; y: number };
  data: NodeData;
  type?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  // Add properties for edge styling
  type?: string;       // 'default' | 'straight' | 'step' | 'smoothstep' | 'bezier'
  animated?: boolean;  // For animated edges
  style?: React.CSSProperties; // For custom styling
  markerEnd?: string;  // For arrow markers
  label?: string;      // For edge labels
}

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
    const [showSidebar, setShowSidebar] = useState(false)

    // 表示/非表示を切り替える関数
    function sidebarOpen() {
        setShowSidebar(!showSidebar)
    }

    // receive graf ////api////
    const receivegraf = () => {

    }

    // グラフの表示用サンプル - Mermaid diagram implementation
    const initialNodes: Node[] = [
        { id: 'start', position: { x: 100, y: 40 }, data: { label: '__start__' } },
        { id: 'user_interface', position: { x: 100, y: 100 }, data: { label: 'user_interface' } },
        { id: 'predict_category', position: { x: 0, y: 160 }, data: { label: 'predict_category' } },
        { id: 'clarify_requirements', position: { x: 100, y: 160 }, data: { label: 'clarify_requirements' } },
        { id: 'summary_customer_requirements', position: { x: 200, y: 160 }, data: { label: 'summary_customer_requirements' } },
        { id: 'search_previous_opportunities', position: { x: 100, y: 220 }, data: { label: 'search_previous_opportunities' } },
        { id: 'summary_current_opportunity', position: { x: 100, y: 280 }, data: { label: 'summary_current_opportunity' } },
        { id: 'end', position: { x: 100, y: 340 }, data: { label: '__end__' } }
      ];
    // Solid edges (normal arrows)
    const solidEdges: Edge[] = [
      { id: 'e-start-user', source: 'start', target: 'user_interface', type: 'custom', markerEnd: 'arrow' },
      { id: 'e-search-summary', source: 'search_previous_opportunities', target: 'summary_current_opportunity', type: 'custom', markerEnd: 'arrow' },
      { id: 'e-summary-end', source: 'summary_current_opportunity', target: 'end', type: 'custom', markerEnd: 'arrow' },
    ];

    // Dotted edges (dotted arrows)
    const dottedEdges: Edge[] = [
      { id: 'e-user-predict', source: 'user_interface', target: 'predict_category', type: 'custom', style: { strokeDasharray: '5, 5' }, markerEnd: 'arrow' },
      { id: 'e-user-clarify', source: 'user_interface', target: 'clarify_requirements', type: 'custom', style: { strokeDasharray: '5, 5' }, markerEnd: 'arrow' },
      { id: 'e-user-summary', source: 'user_interface', target: 'summary_customer_requirements', type: 'custom', style: { strokeDasharray: '5, 5' }, markerEnd: 'arrow' },
      { id: 'e-predict-clarify', source: 'predict_category', target: 'clarify_requirements', type: 'custom', style: { strokeDasharray: '5, 5' }, markerEnd: 'arrow' },
      { id: 'e-predict-user', source: 'predict_category', target: 'user_interface', type: 'custom', style: { strokeDasharray: '5, 5' }, markerEnd: 'arrow' },
      { id: 'e-clarify-summary', source: 'clarify_requirements', target: 'summary_customer_requirements', type: 'custom', style: { strokeDasharray: '5, 5' }, markerEnd: 'arrow' },
      { id: 'e-clarify-user', source: 'clarify_requirements', target: 'user_interface', type: 'custom', style: { strokeDasharray: '5, 5' }, markerEnd: 'arrow' },
      { id: 'e-summary-search', source: 'summary_customer_requirements', target: 'search_previous_opportunities', type: 'custom', style: { strokeDasharray: '5, 5' }, markerEnd: 'arrow' },
      { id: 'e-summary-user', source: 'summary_customer_requirements', target: 'user_interface', type: 'custom', style: { strokeDasharray: '5, 5' }, markerEnd: 'arrow' },
    ];

    // Combine all edges
    const initialEdges: Edge[] = [...solidEdges, ...dottedEdges];
    
    // Custom node types to match Mermaid diagram styling
    const nodeTypes = {
      custom: ({ data }: { data: NodeData & { id?: string } }) => (
        <div
          style={{
            background: data.id === 'start' ? 'transparent' : data.id === 'end' ? '#bfb6fc' : '#f2f0ff',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            lineHeight: '1.2',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {data.label}
        </div>
      ),
    };
    
    // カスタムエッジタイプの定義
    const edgeTypes = {
      custom: CustomEdge,
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
                      nodes={initialNodes}
                      edges={initialEdges}
                      nodeTypes={nodeTypes}
                      edgeTypes={edgeTypes}
                      fitView
                      defaultEdgeOptions={{ 
                        type: 'custom',
                        markerEnd: 'arrow',
                      }}
                      defaultNodeType="custom"
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
