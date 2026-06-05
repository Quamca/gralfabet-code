import { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from 'react-native';

const BCG = require('../assets/images/shared/bcg.png') as number;
const IMG_W = 1475;
const IMG_H = 1066;

type Props = {
  panel: 'left' | 'center' | 'right';
  children?: React.ReactNode;
};

export function AlignedBackground({ panel, children }: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const [containerH, setContainerH] = useState(screenH);

  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setContainerH(h);
  };

  const scale = Math.max(containerH / IMG_H, (3 * screenW) / IMG_W);
  const dispW = IMG_W * scale;
  const dispH = IMG_H * scale;
  const top = (containerH - dispH) / 2;
  const panelOffset = panel === 'left' ? 0 : panel === 'center' ? screenW : 2 * screenW;

  return (
    <View style={styles.fill} onLayout={onLayout}>
      <View style={[StyleSheet.absoluteFill, styles.clip]}>
        <Image
          source={BCG}
          style={{ position: 'absolute', left: -panelOffset, top, width: dispW, height: dispH }}
        />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  clip: { overflow: 'hidden' },
});
