import React, { useMemo } from 'react';
import { Canvas, Path as SkiaPath, Skia } from '@shopify/react-native-skia';
import type { CollectedDrawing, StrokePoint } from './useRoundState';

interface Props {
  drawing: CollectedDrawing;
  size:    number;
}

export function DrawingCard({ drawing, size }: Props): React.ReactElement {
  const path = useMemo(() => {
    const pts = drawing.strokePoints;
    if (pts.length === 0) return null;
    const scale = size / drawing.canvasSize;
    const p = Skia.Path.Make();
    const segs: StrokePoint[][] = [];
    let cur: StrokePoint[] = [];
    for (const pt of pts) {
      if (pt.newStroke && cur.length > 0) { segs.push(cur); cur = []; }
      cur.push(pt);
    }
    if (cur.length > 0) segs.push(cur);
    for (const seg of segs) {
      if (seg.length === 1) {
        p.addCircle(seg[0].x * scale, seg[0].y * scale, 11 * scale);
      } else {
        p.moveTo(seg[0].x * scale, seg[0].y * scale);
        for (let i = 1; i < seg.length; i++) p.lineTo(seg[i].x * scale, seg[i].y * scale);
      }
    }
    return p;
  }, [drawing, size]);

  const strokeWidth = Math.max(2, Math.round(22 * size / drawing.canvasSize));

  return (
    <Canvas style={{ width: size, height: size }}>
      {path && (
        <SkiaPath
          path={path}
          color="#43A047"
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          strokeJoin="round"
        />
      )}
    </Canvas>
  );
}
