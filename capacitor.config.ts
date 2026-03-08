import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.maco.experts',
  appName: 'MACO',
  webDir: 'dist',
  bundledWebRuntime: false, // recommended
  plugins: {
     PushNotifications: {
    presentationOptions: ["badge", "sound", "alert"]
  },
    SplashScreen: {
      launchShowDuration: 3000
    }
  }
};


export default config;
