import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { router, useNavigation } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { useGlobalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

const SubmitPage: React.FC = () => {
  const [issueId, setIssueId] = useState<string>("");
  const params = useGlobalSearchParams();
  
  console.log("Search Params:", params); // Debugging if issue_id is fetched

  useEffect(() => {
    if (params.issue_id) {
      setIssueId(params.issue_id as string);
    }
  }, [params]);

  const handleRedirect = () => {
    router.push("/Home");
  };

  const handleTrackIssue = () => {
    if (issueId) {
      router.push(`/Home/readMore?id=${issueId}`);
    } else {
      console.warn("Issue ID is missing!"); // Adding a warning if issueId is empty
    }
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
        <Entypo
          name="check"
          size={33}
          color="#bbbef3"
          style={styles.checkIcon}
        />
        <Text style={styles.message}>
          Your Issue/Suggestion was reported with ID {issueId}.
          You can track it in the Status menu.
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
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    fontStyle:'italic',
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    padding:'1%'
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
    paddingVertical: '2%',
    paddingHorizontal: '6%',
    borderRadius: 10,
    marginHorizontal: '4%',
    justifyContent: "center", 
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SubmitPage;
