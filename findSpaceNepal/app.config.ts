import { ExpoConfig, ConfigContext } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "findSpaceNepal",
  slug: "findSpaceNepal",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "com.saroj3921.findSpaceNepal",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  platforms: ["ios", "android", "web"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.saroj3921.findSpaceNepal",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.saroj3921.findSpaceNepal",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/icon.png",
  },
  plugins: [
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme:
          "com.googleusercontent.apps.322864680846-jltqs3enn4uqoug67lohrshl3m0v3nq9",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    googleClientIdWeb: process.env.EXPO_GOOGLE_CLIENT_ID_WEB,
    googleClientIdIos: process.env.EXPO_GOOGLE_CLIENT_ID_IOS,
    googleClientIdAndroid: process.env.EXPO_GOOGLE_CLIENT_ID_ANDROID,
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
    router: {
      origin: false,
    },
  },
});
