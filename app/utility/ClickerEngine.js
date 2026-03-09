// services/ClickerEngine.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLICK_COUNT_KEY = 'ad_click_count';
const LAST_RESET_KEY = 'last_reset_date';

export class ClickerEngine {
  constructor(clickCallback, onCountUpdate) {
    this.intervalId = null;
    this.clickCount = 0;
    this.targetCount = 1000000;
    this.clickCallback = clickCallback;
    this.onCountUpdate = onCountUpdate;
    this.rate = 20;
    this.loadState();
  }

  async loadState() {
    try {
      const savedCount = await AsyncStorage.getItem(CLICK_COUNT_KEY);
      const lastReset = await AsyncStorage.getItem(LAST_RESET_KEY);
      const today = new Date().toDateString();

      if (lastReset !== today) {
        this.clickCount = 0;
        await AsyncStorage.setItem(LAST_RESET_KEY, today);
        await AsyncStorage.setItem(CLICK_COUNT_KEY, '0');
      } else if (savedCount) {
        this.clickCount = parseInt(savedCount, 10);
      }
      if (this.onCountUpdate) this.onCountUpdate(this.clickCount);
    } catch (error) {
      console.error('Failed to load click state', error);
    }
  }

  async saveCount() {
    try {
      await AsyncStorage.setItem(CLICK_COUNT_KEY, this.clickCount.toString());
      if (this.onCountUpdate) this.onCountUpdate(this.clickCount);
    } catch (error) {
      console.error('Failed to save click count', error);
    }
  }

  start(rate = 20) {
    if (this.intervalId) return;
    this.rate = rate;
    const intervalMs = 1000 / rate;
    this.intervalId = setInterval(() => {
      if (this.clickCount >= this.targetCount) {
        this.stop();
        return;
      }
      this.clickCallback();
      this.clickCount++;
      this.saveCount();
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getCount() {
    return this.clickCount;
  }

  setTarget(target) {
    this.targetCount = target;
  }
}