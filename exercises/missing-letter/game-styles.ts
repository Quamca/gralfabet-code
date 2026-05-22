import { StyleSheet } from 'react-native';
import { CONTAINER_PAD, TILE_H, TILE_W } from './gameUtils';

export const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#FFFDE7' },
  content:        { flex: 1, padding: CONTAINER_PAD },
  centerArea:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration:   { width: 180, height: 180, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  hidden:         { opacity: 0 },
  image:          { width: 160, height: 160, resizeMode: 'contain' },
  imgPlaceholder: { width: 160, height: 160, backgroundColor: '#E0E0E0', borderRadius: 12 },
  bottom:         { alignItems: 'center', paddingVertical: 20 },
  grid:           { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 16 },
  tile:           { width: TILE_W, height: TILE_H, backgroundColor: '#FFF3CD', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E8C83A' },
  tileWrong:      { backgroundColor: '#FFCDD2', borderColor: '#E53935' },
  tileHint:       { backgroundColor: '#C8E6C9', borderColor: '#43A047' },
  tileUpper:      { fontSize: 48, fontWeight: 'bold', color: '#333' },
  tileLower:      { fontSize: 24, color: '#666', marginTop: 4 },
  exitIcon:       { width: 80, height: 80, resizeMode: 'contain' },
  flyCard:        { position: 'absolute', zIndex: 999, width: 100, height: 100, backgroundColor: '#C8E6C9', borderRadius: 12, borderWidth: 2, borderColor: '#43A047', alignItems: 'center', justifyContent: 'center' },
  flyImage:       { width: 84, height: 84, resizeMode: 'contain' },
  flyPlaceholder: { width: 84, height: 84, backgroundColor: '#B0BEC5', borderRadius: 8 },
});
