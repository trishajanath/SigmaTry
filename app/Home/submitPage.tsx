import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const SubmitPage: React.FC = () => {
  const handleRedirect = () => {
    router.push("/Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.acknowledgmentContainer}>
        <Text style={styles.title}>Thank You!</Text>
        <Text style={styles.message}>
          Your form has been successfully submitted. 
        </Text>
        <TouchableOpacity style={styles.homeButton} onPress={handleRedirect}>
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2", // Light background for contrast
  },
  acknowledgmentContainer: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: "#bbbef3", // Your shade of blue
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  homeButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SubmitPage;
