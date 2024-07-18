import AnimatedButton from "@/components/AnimatedButton";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SegmentedButtons, Surface } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window");

const App = () => {
  const [value, setValue] = React.useState("first");

  return (
    <View style={styles.container}>
      <Surface
        style={{
          width: width * 0.8,
          height: height * 0.5,
          backgroundColor: "white",
          borderRadius: 10,
          padding: wp("5%"),
          borderWidth: 1,
          borderColor: "#f5f5f5",
        }}
        elevation={3}
      >
        <AnimatedButton />
      </Surface>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("5%"),
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    marginBottom: hp("2%"),
  },
  paragraph: {
    fontSize: wp("5%"),
    textAlign: "center",
  },
});

export default App;
