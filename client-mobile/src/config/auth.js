import { AsyncStorage } from "react-native";
import { ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS } from "expo/build/IntentLauncherAndroid";

export const USER_KEY = "auth-demo-key";

export const onSignIn = async () => {
  try {
    AsyncStorage.setItem("userToken", USER_KEY);
    return true;
  } catch (exception) {
    return false;
  }
};

export const onSignOut = async () => {
  try {
    await AsyncStorage.removeItem("userToken");
    return true;
  } catch (exception) {
    return false;
  }
};

export const isSignedIn = async () => {
  const userToken = await AsyncStorage.getItem("userToken");
  if (userToken !== null) {
    return true;
  } else {
    return false;
  }
};
