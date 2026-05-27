import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

type Props = {
  source: number;
  align: 'left' | 'center' | 'right';
  children?: React.ReactNode;
};

export function AlignedBackground({ source, align, children }: Props) {
  const { width: screenW, height: screenH } = useWindowDimensions();
  const asset = Image.resolveAssetSource(source);
  const scale = Math.max(screenW / asset.width, screenH / asset.height);
  const dispW = asset.width * scale;
  const dispH = asset.height * scale;

  const left =
    align === 'right'  ? screenW - dispW :
    align === 'center' ? (screenW - dispW) / 2 :
    0;
  const top = (screenH - dispH) / 2;

  return (
    <View style={styles.fill}>
      <View style={[StyleSheet.absoluteFill, styles.clip]}>
        <Image
          source={source}
          style={{ position: 'absolute', left, top, width: dispW, height: dispH }}
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
