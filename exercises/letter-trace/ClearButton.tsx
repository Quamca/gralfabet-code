import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const CLEAR_ICON = require('../../assets/images/shared/clear-button.png') as number;

interface Props {
  onPress: () => void;
  active:  boolean;
}

export function ClearButton({ onPress, active }: Props): React.ReactElement {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!active}
      style={[styles.btn, !active && styles.dimmed]}
    >
      <Image source={CLEAR_ICON} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:    { alignSelf: 'center', paddingBottom: 4 },
  icon:   { width: 64, height: 64, resizeMode: 'contain' },
  dimmed: { opacity: 0.35 },
});
