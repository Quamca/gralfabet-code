import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

const BCG = require('../assets/images/shared/bcg.png') as number;
const IMG_W = 1475;
const IMG_H = 1066;

type Props = {
  panel: 'left' | 'center' | 'right';
  children?: React.ReactNode;
};

export function AlignedBackground({ panel, children }: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const scale = screenH / IMG_H;
  const dispW = IMG_W * scale;

  const panelOffset = panel === 'left' ? 0 : panel === 'center' ? screenW : 2 * screenW;
  const left = -panelOffset;
  const top = 0;

  return (
    <View style={styles.fill}>
      <View style={[StyleSheet.absoluteFill, styles.clip]}>
        <Image
          source={BCG}
          style={{ position: 'absolute', left, top, width: dispW, height: screenH }}
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
