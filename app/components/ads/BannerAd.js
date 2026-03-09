// BannerAd.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Use test ID during development
const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-5237584635684225/5724740289';

export default function BannerAdComponent() {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={{ height: loaded ? 'auto' : 0 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // adjust based on user consent
        }}
        onAdLoaded={() => setLoaded(true)}
        onAdFailedToLoad={(error) => console.log('Ad failed to load:', error)}
      />
    </View>
  );
}