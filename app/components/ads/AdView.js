// components/AdView.js
import React, { forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import BannerAdComponent from './BannerAd';

const AdView = forwardRef(({ onPress, style }, ref) => {
  const handlePress = () => {
    if (onPress) onPress();
    console.log('Ad clicked (simulated)');
  };

  useImperativeHandle(ref, () => ({
    click: handlePress,
  }));

  return (
    <TouchableOpacity onPress={handlePress} style={[{ padding: 20, backgroundColor: '#e0e0e0' }, style]}>
      {BannerAdComponent}
    </TouchableOpacity>
  );
});

export default AdView;