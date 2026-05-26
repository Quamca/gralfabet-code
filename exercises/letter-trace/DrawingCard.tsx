import React, { useMemo } from 'react';
import { Canvas, Path as SkiaPath, Skia } from '@shopify/react-native-skia';
import type { CollectedDrawing } from './useRoundState';

interface Props {
  drawing: CollectedDrawing;
  size:    number;
}

export function DrawingCard({ drawing, size }: Props): React.ReactElement {
  const path = useMemo(() => {
    const pts = drawing.strokePoints;
    if (pts.length < 2) return null;
    const scale = size / drawing.canvasSize;
    const p = Skia.Path.Make();
    let started = false;
    for (const pt of pts) {
      if (pt.newStroke || !started) {
        p.moveTo(pt.x * scale, pt.y * scale);
        started = true;
      } else {
        p.lineTo(pt.x * scale, pt.y * scale);
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
