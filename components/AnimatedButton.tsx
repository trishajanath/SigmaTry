import Login from "@/app/(tabs)/Login";
import Signup from "@/app/(tabs)/Signup";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

const AnimatedButton = () => {
  const [selectedButton, setSelectedButton] = useState("login");
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleButtonPress = (button: any) => {
    setSelectedButton(button);
    Animated.timing(slideAnim, {
      toValue: button === "login" ? 0 : 1,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  const slideInterpolation = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Animated.View
          style={[styles.selectedBackground, { left: slideInterpolation }]}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("login")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedButton === "login" && styles.selectedText,
            ]}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress("signup")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedButton === "signup" && styles.selectedText,
            ]}
          >
            Signup
          </Text>
        </TouchableOpacity>
      </View>
      {selectedButton === "login" ? <Login /> : <Signup />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "80%",
    height: 50,
    backgroundColor: "#ddd",
    borderRadius: 25,
    overflow: "hidden",
    position: "relative",
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  selectedBackground: {
    position: "absolute",
    width: "50%",
    height: "100%",
    backgroundColor: "#61198c",
    borderRadius: 25,
  },
  selectedText: {
    color: "#fff",
  },
});

export default AnimatedButton;
