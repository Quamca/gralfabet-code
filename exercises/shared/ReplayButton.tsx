import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const ICON = require('../../assets/images/shared/repeat-button.png');

interface Props {
  onPress: () => void;
  disabled?: boolean;
}

export function ReplayButton({ onPress, disabled = false }: Props): React.ReactElement {
  return (
    <TouchableOpacity
      style={[styles.btn, disabled && styles.dim]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Image source={ICON} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn:  { alignSelf: 'center', marginBottom: 16 },
  dim:  { opacity: 0.35 },
  icon: { width: 72, height: 72, resizeMode: 'contain' },
});
