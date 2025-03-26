import React, { useEffect, useReducer, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SelectList } from "@venedicto/react-native-dropdown";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";
import axios from "axios";
import { useUser } from "@/Hooks/userContext";
import { Appbar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { BACKEND_URL } from "@/production.config";

const initialState = {
  name: "",
  number: "",
  roomNo: "",
  content: "",
  anonymous: false,
  selectedOptionType: "Select Type",
  selectedOptionDomain: "Select Domain",
  ratingPriority: undefined,
  ratingUrgency: undefined,
  ratingImpact: undefined,
  issuesList: [],
  selectedIssue: null,
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_NUMBER":
      return { ...state, number: action.payload };
    case "SET_ROOM_NO":
      return { ...state, roomNo: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_ANONYMOUS":
      return { ...state, anonymous: action.payload };
    case "SET_SELECTED_OPTION_TYPE":
      return { ...state, selectedOptionType: action.payload };
    case "SET_SELECTED_OPTION_DOMAIN":
      return { ...state, selectedOptionDomain: action.payload };
    case "SET_RATING":
      return {
        ...state,
        [action.category]: action.rating,
      };
    default:
      return state;
  }
}

const NavigationPage = () => {
  const navigation = useNavigation();
  const users = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [similarIssues, setSimilarIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSubmit = async () => {
    if (
      !state.name.trim() ||
      !state.number.trim() ||
      !state.roomNo.trim() ||
      (state.selectedOptionType === "Complaint" && (state.selectedOptionDomain === "Select Domain" || !state.content.trim())) ||
      state.selectedOptionType === "Select Type" ||
      (state.selectedOptionType === "Feedback" &&
        (state.ratingPriority === undefined ||
          state.ratingUrgency === undefined ||
          state.ratingImpact === undefined))
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill out all the fields before submitting.",
        visibilityTime: 2000,
      });
      return;
    }

    if (state.selectedIssue && state.selectedIssue !== "None of the above") {
      Toast.show({
        type: "error",
        text1: "We are already working on this issue.",
        text2: "It will be resolved soon.",
        visibilityTime: 2000,
      });
      navigation.goBack();
      return;
    }

    try {
      const Submit = {
        name: users.name,
        id: users.id,
        issueType: state.selectedOptionType,
        issueCat: state.selectedOptionDomain,
        actionItem: "New Installation",
        block: state.name,
        floor: state.number,
        issueContent: state.roomNo,
        comments: [
          {
            by: users.id,
            content: state.content,
          },
        ],
        "survey-priority": state.ratingPriority,
        "survey-urgency": state.ratingUrgency,
        "survey-impact": state.ratingImpact,
      };

      console.log("Submitting data:", Submit);
      const response = await axios.post(
        `${BACKEND_URL}/client/issue/report`,
        Submit
      );
      console.log(response.data);
      router.replace({
        pathname: "/Home/submitPage",
        params: response.data,
      });
    } catch (error: any) {
      console.error("Error occurred during submission:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
      Toast.show({
        type: "error",
        text1: "Submission failed",
        text2: "Please try again later.",
        visibilityTime: 2000,
      });
    }
  };

  const handleRatingSelect = (category: string, rating: number) => {
    dispatch({ type: "SET_RATING", category, rating });
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sigma - GMS" />
      </Appbar.Header>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={100}
      >
        <View style={styles.container}>
          <Text style={styles.main}>New Installation Request</Text>

          <Text style={styles.label}>Block Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Block Name"
            value={state.name}
            onChangeText={(text) =>
              dispatch({ type: "SET_NAME", payload: text })
            }
          />

          <Text style={styles.label}>Floor Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Floor Number"
            value={state.number}
            onChangeText={(text) =>
              dispatch({ type: "SET_NUMBER", payload: text })
            }
          />

          <Text style={styles.label}>Room Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Room Number"
            value={state.roomNo}
            onChangeText={(text) =>
              dispatch({ type: "SET_ROOM_NO", payload: text })
            }
          />

          <Text style={styles.pickerLabel}>Type</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: any) =>
                dispatch({ type: "SET_SELECTED_OPTION_TYPE", payload: value })
              }
              data={["Complaint", "Feedback"]}
              search={false}
              save="value"
            />
          </View>

          {state.selectedOptionType === "Complaint" && (
            <>
              <Text style={styles.pickerLabel}>Domain</Text>
              <View style={styles.dropdownWrapper}>
                <SelectList
                  setSelected={(value: any) =>
                    dispatch({ type: "SET_SELECTED_OPTION_DOMAIN", payload: value })
                  }
                  data={[
                    "AC Installation",
                    "Electrical Installation",
                    "Plumbing Installation",
                    "Furniture Installation",
                    "Other"
                  ]}
                  search={false}
                  save="value"
                />
              </View>

              <Text style={styles.label}>Report Content</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Content Here"
                value={state.content}
                onChangeText={(text) =>
                  dispatch({ type: "SET_CONTENT", payload: text })
                }
              />
            </>
          )}

          {state.selectedOptionType === "Feedback" && (
            <>
              <Text style={styles.label}>Priority Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      state.ratingPriority === rating && styles.selectedRating,
                    ]}
                    onPress={() => handleRatingSelect("ratingPriority", rating)}
                  >
                    <Text
                      style={[
                        styles.ratingText,
                        state.ratingPriority === rating && styles.selectedRatingText,
                      ]}
                    >
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Urgency Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      state.ratingUrgency === rating && styles.selectedRating,
                    ]}
                    onPress={() => handleRatingSelect("ratingUrgency", rating)}
                  >
                    <Text
                      style={[
                        styles.ratingText,
                        state.ratingUrgency === rating && styles.selectedRatingText,
                      ]}
                    >
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Impact Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      state.ratingImpact === rating && styles.selectedRating,
                    ]}
                    onPress={() => handleRatingSelect("ratingImpact", rating)}
                  >
                    <Text
                      style={[
                        styles.ratingText,
                        state.ratingImpact === rating && styles.selectedRatingText,
                      ]}
                    >
                      {rating}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  main: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  dropdownWrapper: {
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRating: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  ratingText: {
    fontSize: 16,
    color: "#333",
  },
  selectedRatingText: {
    color: "#fff",
  },
});

export default NavigationPage; 