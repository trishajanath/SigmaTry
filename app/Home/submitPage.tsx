import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { router, useNavigation } from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';

const { width } = Dimensions.get("window");

const SubmitPage: React.FC = () => {
  const [issueId, setIssueId] = useState<string>("");

  useEffect(() => {
    const fetchIssueId = async () => {
      try {
        const response = await fetch("https://api.gms.intellx.in/tasks");
        const data = await response.json();
        
        // Log the response to verify the structure
        console.log("API Response:", data);
  
        // Check if issue_id exists in the response
        if (data.issue_id) {
          setIssueId(data.issue_id);
        } else {
          console.error("Issue ID not found in the response:", data);
        }
      } catch (error) {
        console.error("Failed to fetch issue number:", error);
      }
    };
  
    fetchIssueId();
  }, []);
  

  const handleRedirect = () => {
    router.push("/Home");
  };

  const handleTrackIssue = () => {
    router.push("/Status"); // Adjust the route to your status tracking page
  };

  const navigation = useNavigation();
  
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Entypo name="check" size={33} color="#bbbef3" style={styles.checkIcon} />  
        <Text style={styles.message}>
          Your Issue/Suggestion was reported with ID{" "}
          <Text style={styles.issueId}>{issueId}</Text>. You can track it in the Status menu.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleTrackIssue}>
            <Text style={styles.buttonText}>View Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRedirect}>
            <Text style={styles.buttonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    width: "90%",
    alignContent: "center",
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#888",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkIcon: {
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  issueId: {
    fontWeight: "bold",
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#bbbef3",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center", // Aligns content vertically in the center
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SubmitPage;
