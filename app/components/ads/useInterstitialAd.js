// useInterstitialAd.js
import { useEffect, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function useInterstitialAd() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const closeListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      interstitial.load(); // preload next ad
    });

    interstitial.load();

    return () => {
      loadListener.remove();
      closeListener.remove();
    };
  }, []);

  const showAd = () => {
    if (loaded) {
      interstitial.show();
    }
  };

  return { showAd, loaded };
}