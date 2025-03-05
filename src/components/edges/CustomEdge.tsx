import React from 'react';
import {
  getBezierPath,
  useStore,
  BaseEdge,
  type EdgeProps,
  type ReactFlowState,
} from '@xyflow/react';
 
export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};
 
export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number,
) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;
 
  return `M ${sourceX} ${sourceY} Q ${centerX} ${
    centerY + offset
  } ${targetX} ${targetY}`;
};

// カスタム矢印マーカー（→）を表示するエッジコンポーネント
export default function CustomEdge({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
}: EdgeProps) {
  // 双方向エッジかどうかを確認
  const isBiDirectionEdge = useStore((s: ReactFlowState) => {
    const edgeExists = s.edges.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target),
    );
 
    return edgeExists;
  });
 
  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };
 
  let path = '';
 
  if (isBiDirectionEdge) {
    // 双方向エッジの場合は曲線を描画
    path = getSpecialPath(edgePathParams, sourceX < targetX ? 25 : -25);
  } else {
    // 単方向エッジの場合はベジェ曲線を描画
    [path] = getBezierPath(edgePathParams);
  }
 
  // エッジの中央に矢印マーカー（→）を表示
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;
  
  // エッジの角度を計算
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  return (
    <>
      <BaseEdge path={path} style={style} markerEnd={markerEnd} />
      {/* すべてのエッジに矢印マーカー（→）を表示 */}
      <text
        x={centerX}
        y={centerY}
        dy={-5}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          transform: `rotate(${angle}deg)`,
          transformOrigin: `${centerX}px ${centerY}px`,
          fontSize: '12px',
          fontWeight: 'bold',
          fill: '#666',
          pointerEvents: 'none',
        }}
      >
        →
      </text>
    </>
  );
}
