import { StackNavigator, TabNavigator } from "react-navigation";

import Discover from "../screens/Discover";
import Notification from "../screens/Notification";

export const SignedIn = TabNavigator({
  Discover: {
    screen: Discover,
    navigationOptons: {
      tabBarLabel: "Discover",
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require("../../assets/icons/discover_ic.png")}
          style={styles.image}
          resizeMode={"contain"}
        />
      )
    }
  },
  Notification: {
    screen: Notification,
    navigationOptons: {
      tabBarLabel: "Notification",
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require("../../assets/icons/search_ic.png")}
          style={styles.image}
          resizeMode={"contain"}
        />
      )
    }
  }
});
