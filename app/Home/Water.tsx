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
const { width } = Dimensions.get("window");

const initialState = {
  name: "",
  number: "",
  dispenserName: "",
  content: "",
  anonymous: false,
  selectedOptionType: "Select Type",
  ratingCleanliness: undefined,
  ratingFunctionality: undefined,
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_NUMBER":
      return { ...state, number: action.payload };
    case "SET_DISPENSER_NAME":
      return { ...state, dispenserName: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_ANONYMOUS":
      return { ...state, anonymous: action.payload };
    case "SET_SELECTED_OPTION_TYPE":
      return { ...state, selectedOptionType: action.payload };
    case "SET_RATING":
      return {
        ...state,
        [action.category]: action.rating,
      };
    default:
      return state;
  }
}

const SinglePageForm = () => {
  const user = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSwitchChange = (value: any) => {
    dispatch({ type: "SET_ANONYMOUS", payload: value });
  };

  const handleSubmit = async () => {
    if (
      !state.name.trim() ||
      !state.number.trim() ||
      !state.dispenserName.trim() ||
      !state.content.trim() ||
      state.selectedOptionType === "Select Type" ||
      (state.selectedOptionType === "Feedback" &&
        (state.ratingFunctionality === undefined ||
          state.ratingCleanliness === undefined))
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill out of all the fields before submitting.",
        visibilityTime: 2000,
      });
      return;
    }
    try {
      const Submit = {
        name: user.name,
        id: user.id,
        issueType: state.selectedOptionType,
        issueCat: "",
        actionItem: "Water Dispenser",
        block: state.name,
        floor: state.number,
        issueContent: state.dispenserName,
        ratingCleanliness: state.ratingCleanliness,
        ratingFunctionality: state.ratingFunctionality,
        comments: [
          {
            by: user.id,
            content: state.content,
          },
        ],
        "survey-cleanliness": state.ratingCleanliness,
        "survey-functionality": state.ratingFunctionality,
      };
      console.log("Submitting data:", Submit);
      const response = await axios.post(
        "https://api.gms.intellx.in/client/issue/report",
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
        <Appbar.Content title="Sigma - GMS " />
      </Appbar.Header>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={100}
      >
        <View style={styles.container}>
          <Text style={styles.main}>Water Dispenser Complaint</Text>

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
          <Text style={styles.label}>Dispenser Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Dispenser Number"
            value={state.dispenserName}
            onChangeText={(text) =>
              dispatch({ type: "SET_DISPENSER_NAME", payload: text })
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
          <Text style={styles.label}>Report Content</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Content Here"
            value={state.content}
            onChangeText={(text) =>
              dispatch({ type: "SET_CONTENT", payload: text })
            }
          />
          {state.selectedOptionType === "Feedback" && (
            <View style={styles.ratingContainer}>
              <Text style={styles.lab}>General Survey</Text>
              <Text style={styles.labe}>Cleanliness</Text>
              <View style={styles.customRatingContainer}>
                {[1, 2, 3].map((rate) => (
                  <View key={rate} style={styles.ratingItem}>
                    <TouchableOpacity
                      style={[
                        styles.circle,
                        state.ratingCleanliness === rate &&
                          styles.selectedCircle,
                      ]}
                      onPress={() =>
                        handleRatingSelect("ratingCleanliness", rate)
                      }
                    >
                      <Text style={styles.circleText}></Text>
                    </TouchableOpacity>
                    <Text style={styles.ratingText}>
                      {rate === 1
                        ? "Poor"
                        : rate === 2
                        ? "Satisfactory"
                        : "Average"}
                    </Text>
                  </View>
                ))}
              </View>

              <Text style={styles.labe}>Functionality</Text>
              <View style={styles.customRatingContainer}>
                {[1, 2, 3].map((rate) => (
                  <View key={rate} style={styles.ratingItem}>
                    <TouchableOpacity
                      style={[
                        styles.circle,
                        state.ratingFunctionality === rate &&
                          styles.selectedCircle,
                      ]}
                      onPress={() =>
                        handleRatingSelect("ratingFunctionality", rate)
                      }
                    >
                      <Text style={styles.circleText}></Text>
                    </TouchableOpacity>
                    <Text style={styles.ratingText}>
                      {rate === 1
                        ? "Poor"
                        : rate === 2
                        ? "Satisfactory"
                        : "Average"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Anonymous Replies</Text>
            <Switch
              value={state.anonymous}
              onValueChange={handleSwitchChange}
            />
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: "2%",
  },
  main: {
    fontSize: 20,
    marginTop: Platform.OS === "ios" ? "1%" : "1%",
    marginBottom: "7%",
    fontWeight: "bold",
  },
  formContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: "10%",
    width: "100%",
  },
  label: {
    fontSize: 15,
    marginBottom: "4%",
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: "2%",
    marginBottom: "5%",
    shadowColor: "#8283e9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  dropdownWrapper: {
    width: "100%",
    marginBottom: "4%",
  },

  labe: {
    fontSize: 15,
    marginBottom: "2%",
    marginTop: "2%",
  },
  ratingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20, // Adjust spacing between items if needed
  },
  ratingContainer: {
    marginTop: 10,
    marginBottom: "5%",
    width: "100%",
  },
  ratingLabel: {
    fontSize: 15,
    marginBottom: "4%",
  },
  lab: {
    fontSize: 20,
    marginBottom: "3%",
  },
  customRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#171717",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCircle: {
    backgroundColor: "#171717",
  },
  circleText: {
    fontSize: 15,
    color: "#4B5563",
  },
  ratingText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 5,
    marginRight: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginTop: Platform.OS === "ios" ? "2%" : 0,
    marginBottom: "3%",
  },
  switchContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5%",
    padding: "1%",
    borderRadius: 5,
  },
  switchLabel: {
    fontSize: 16,
  },
  switch: {
    alignItems: "flex-end",
    marginLeft: "39%",
  },
  submitBtn: {
    backgroundColor: "#8283e9",
    paddingVertical: "3%",
    paddingHorizontal: "3%",
    borderRadius: 5,
    marginTop: "3%",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: "5%",
  },
});
export default SinglePageForm;
