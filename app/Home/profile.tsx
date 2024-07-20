import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

const { width, height } = Dimensions.get("window");

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="person" size={28} color="#555555" style={styles.headerIcon} />
        <Text style={styles.headerTitle}>Student Profile</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileInfo}>
          <Text style={styles.profileText}>Name: John Doe</Text>
          <Text style={styles.profileText}>Roll No: 123456</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "white",
    width: width,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 4,
  },
  headerIcon: {
    position: "absolute",
    left: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileContainer: {
    flex: 1,
    backgroundColor: "white",
    width: width * 0.9,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  profileInfo: {
    marginBottom: 40,
    alignItems: "center",
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  profileText: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
    color: "#555",
  },
  logoutButton: {
    backgroundColor: "#a2c2e8",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
