// useRewardedAd.js
import { useEffect, useState } from 'react';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxxxxx/zzzzzzzzzz';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export default function useRewardedAd() {
  const [loaded, setLoaded] = useState(false);
  const [reward, setReward] = useState(null);

  useEffect(() => {
    const loadListener = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const earnListener = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        setReward(reward);
        setLoaded(false);
        // Handle the reward (e.g., give coins)
        console.log('User earned reward:', reward);
      }
    );

    rewarded.load();

    return () => {
      loadListener.remove();
      earnListener.remove();
    };
  }, []);

  const showAd = () => {
    if (loaded) {
      rewarded.show();
    }
  };

  return { showAd, loaded, reward };
}