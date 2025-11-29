import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';

/**
 * Capacitor Utilities
 * Provides platform detection and native feature integration
 */

/**
 * Check if running in Capacitor (native app)
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Get the current platform
 */
export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

/**
 * Initialize native features
 */
export const initializeNativeFeatures = async (): Promise<void> => {
  if (!isNative()) {
    return;
  }

  try {
    // Configure status bar
    if (Capacitor.getPlatform() === 'ios') {
      await StatusBar.setStyle({ style: Style.Default });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }

    // Configure keyboard
    await Keyboard.setAccessoryBarVisible({ isVisible: true });
    await Keyboard.setScroll({ isDisabled: false });
  } catch (error) {
    console.error('Error initializing native features:', error);
  }
};

/**
 * Handle app state changes
 */
export const setupAppStateListeners = async (): Promise<() => void> => {
  if (!isNative()) {
    return () => {}; // No-op cleanup
  }

  // Handle app state changes
  const handleAppStateChange = await App.addListener('appStateChange', ({ isActive }) => {
    if (isActive) {
      console.log('App became active');
      // Could sync data, refresh content, etc.
    } else {
      console.log('App went to background');
      // Could save state, pause operations, etc.
    }
  });

  // Handle app URL open (deep linking)
  const handleAppUrlOpen = await App.addListener('appUrlOpen', (data) => {
    console.log('App opened with URL:', data.url);
    // Handle deep linking if needed
  });

  // Handle back button (Android)
  const handleBackButton = await App.addListener('backButton', () => {
    // Handle Android back button if needed
    // Could navigate back in React Router
  });

  // Cleanup function
  return () => {
    handleAppStateChange.remove();
    handleAppUrlOpen.remove();
    handleBackButton.remove();
  };
};

/**
 * Show keyboard (if needed)
 */
export const showKeyboard = async (): Promise<void> => {
  if (isNative()) {
    await Keyboard.show();
  }
};

/**
 * Hide keyboard
 */
export const hideKeyboard = async (): Promise<void> => {
  if (isNative()) {
    await Keyboard.hide();
  }
};

/**
 * Get keyboard height
 */
export const getKeyboardHeight = async (): Promise<number> => {
  if (isNative()) {
    // Keyboard height is available through window events in Capacitor
    // This is a placeholder - actual implementation would use keyboard events
    return 0;
  }
  return 0;
};

