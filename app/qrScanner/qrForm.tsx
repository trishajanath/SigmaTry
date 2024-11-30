import React, { useReducer, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { SelectList } from "@venedicto/react-native-dropdown";
import { useUser } from "@/Hooks/userContext";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import { Appbar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { BACKEND_URL } from "@/production.config";

interface FormData {
  name: string;
  number: string;
  classroom: string;
  content: string;
  anonymous: boolean;
  selectedOptionType: string;
  selectedOptionDomain: string;
  ratingTable?: number;
  ratingChair?: number;
  ratingProjector?: number;
  ratingCleanliness?: number;
  issuesList: string[];  // Added to store matching issues
  selectedIssue: string | null; // Store the selected issue (if any)
}
const initialState: FormData = {
  name: "",
  number: "",
  classroom: "",
  content: "",
  anonymous: false,
  selectedOptionType: "Select Type",
  selectedOptionDomain: "Select Domain",
  ratingTable: undefined,
  ratingChair: undefined,
  ratingProjector: undefined,
  ratingCleanliness: undefined,
  issuesList: [],
  selectedIssue: null,
};

type Action =
  | { type: "SET_FORM_DATA"; payload: Partial<FormData> }
  | { type: "SET_RATING"; category: string; rating: number };

function reducer(state: FormData, action: Action): FormData {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, ...action.payload };
    case "SET_RATING":
      return {
        ...state,
        [action.category]: action.rating,
      };
    default:
      return state;
  }
}

const parseScannedData = (url: string) => {
  const queryString = url.split("?")[1];
  const params = new URLSearchParams(queryString);
  return {
    name: params.get("block") || "",
    number: params.get("floor") || "",
    classroom: params.get("room") || "",
  };
};

const SinglePageForm: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { scannedData } = useGlobalSearchParams();

  const users = useUser();

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...parseScannedData(scannedData ? scannedData.toString() : ""),
  });
  const [similarIssues, setSimilarIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<string>("");
  useEffect(() => {
    const fetchSimilarIssues = async () => {
      if (!state.name.trim() || !state.number.trim()) {
        setSimilarIssues([]);
        return;
      }
  
      try {
        const response = await axios.post(
          `${BACKEND_URL}/client/get_similar_issues`,
          {
            block: state.name, // Value from your form
            floor: state.number, // Default value for floor
          }
        );
        console.log("Response data:", response.data);

        console.log("API Response:", JSON.stringify(response.data, null, 2));
  
        if (Array.isArray(response.data)) {
          response.data.forEach((issue: any, index: number) => {
            console.log(`Issue ${index + 1}:`, issue);
          });
  
          // Adjusted filter logic to match API response structure
          const issues = response.data.filter(
            (issue: any) =>
              issue.actionItem === "Classroom" &&
            issue.floor === state.number &&
              issue.block.toLowerCase() === state.name.toLowerCase()
          );
  
          console.log("Filtered Issues:", issues);
          setSimilarIssues(issues);
        } else {
          console.warn("API did not return an array!");
          setSimilarIssues([]);
        }
      } catch (error) {
        console.error("Error fetching similar issues:", error);
      }
    };
  
    fetchSimilarIssues();
  }, [state.name,state.number]);

  const handleSwitchChange = (value: boolean) => {
    dispatch({ type: "SET_FORM_DATA", payload: { anonymous: value } });
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSubmit = async () => {
    if (
      !state.name.trim() ||
      !state.number.trim() ||
      !state.classroom.trim() ||
      state.selectedOptionType === "Select Type" ||
      (state.selectedOptionType==="Complaint" && (state.selectedOptionDomain === "Select Domain" ||
        !state.content.trim() )) ||
      state.selectedOptionDomain === "Select Domain" ||
      (state.selectedOptionType === "Feedback" &&
        (state.ratingTable === undefined ||
          state.ratingChair === undefined ||
          state.ratingProjector === undefined ||
          state.ratingCleanliness === undefined))
    ) {
      Toast.show({
        type: "error",
        text1: "Some fields are missing",
        text2: "Please fill all the fields",
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
      // Navigate back after showing the message
      navigation.goBack();
      return;
    }
    try {
      // Constructing the survey data dynamically with "survey-" prefix
      const Submit = {
        issueContent: state.classroom,
        block: state.name,
        floor: state.number,
        name: users.name,
        id: users.id,
        issueType: state.selectedOptionType,
        issueCat: state.selectedOptionDomain,
        actionItem: "Classroom",
        comments: [
          {
            by: users.id,
            content: state.content,
          },
        ],
        "survey-table": state.ratingTable,
        "survey-chair": state.ratingChair,
        "survey-projector": state.ratingProjector,
        "survey-cleanliness": state.ratingCleanliness,
      };
      const response = await axios.post(
        `${BACKEND_URL}/client/issue/report`,
        Submit
      );
      console.log("Response data:", response.data);
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
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      </Appbar.Header>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={100}
      >
        <View style={styles.container}>
          <Text style={styles.main}>Issue Report Form</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Block Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Block"
              value={state.name}
              onChangeText={(text) =>
                dispatch({ type: "SET_FORM_DATA", payload: { name: text } })
              }
            />
            <Text style={styles.label}>Floor Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Floor"
              value={state.number}
              onChangeText={(text) =>
                dispatch({ type: "SET_FORM_DATA", payload: { number: text } })
              }
            />
            <Text style={styles.label}>Classroom</Text>
            <TextInput
              style={styles.input}
              placeholder="Classroom"
              value={state.classroom}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  payload: { classroom: text },
                })
              }
            />
            <Text style={styles.pickerLabel}>Type</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                setSelected={(value: string) =>
                  dispatch({
                    type: "SET_FORM_DATA",
                    payload: { selectedOptionType: value },
                  })
                }
                data={["Complaint", "Feedback"]}
                search={false}
                save="value"
              />
            </View>
            {state.selectedOptionType === "Complaint" && similarIssues.length > 0 && (
  <>
    <Text style={styles.label}>Similar Issues Found</Text>
    <View style={styles.dropdownWrapper}>
    <SelectList
      setSelected={(value: string) => {
        setSelectedIssue(value);
        if (value !== "None of the Above") {
          alert("We are already working on this complaint.It will be resolved soon.")
          // Toast.show({
          //   type: "info",
          //   text1: "We are already working on this complaint.",
          //   text2: "It will be resolved soon.",
          //   visibilityTime: 3000,
          // });
          router.back();
        }
      }}
      
      data={[
        ...similarIssues.map((issue, index) => ({
          key: index.toString(),
          value: `Description: ${issue.comments} | Domain:${issue.issueCat} | Classroom: ${issue.issueContent} | Date: ${issue.date}`, 
        })),
        { key: "none",  value: "None of the Above" },
      ]}
      search={false}
      save="value"
      
    />
      </View>
  </>
    
)}
  
            {state.selectedOptionType !== "Feedback" && (
  <>
            <Text style={styles.pickerLabel}>Domain</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                setSelected={(value: string) =>
                  dispatch({
                    type: "SET_FORM_DATA",
                    payload: { selectedOptionDomain: value },
                  })
                }
                data={[
                  "Cleaning",
                  "Plumbing",
                  "Civil & Carpentry",
                  "Electrical",
                  "AV and Projectors",
                  "Others",
                ]}
                search={false}
                save="value"
              />
            </View>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={state.content}
              onChangeText={(text) =>
                dispatch({ type: "SET_FORM_DATA", payload: { content: text } })
              }
            />
            </>
            )}
            {state.selectedOptionType === "Feedback" && (
              <View style={styles.ratingContainer}>
                <Text style={styles.lab}>Give your ratings</Text>
                <Text style={styles.labe}>Table</Text>
                <View style={styles.customRatingContainer}>
                  {[1, 2, 3].map((rate) => (
                    <View key={rate} style={styles.ratingItem}>
                      <TouchableOpacity
                        style={[
                          styles.circle,
                          state.ratingTable === rate && styles.selectedCircle,
                        ]}
                        onPress={() => handleRatingSelect("ratingTable", rate)}
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

                <Text style={styles.labe}>Chair</Text>
                <View style={styles.customRatingContainer}>
                  {[1, 2, 3].map((rate) => (
                    <View key={rate} style={styles.ratingItem}>
                      <TouchableOpacity
                        style={[
                          styles.circle,
                          state.ratingChair === rate && styles.selectedCircle,
                        ]}
                        onPress={() => handleRatingSelect("ratingChair", rate)}
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

                <Text style={styles.labe}>Projector</Text>
                <View style={styles.customRatingContainer}>
                  {[1, 2, 3].map((rate) => (
                    <View key={rate} style={styles.ratingItem}>
                      <TouchableOpacity
                        style={[
                          styles.circle,
                          state.ratingProjector === rate &&
                            styles.selectedCircle,
                        ]}
                        onPress={() =>
                          handleRatingSelect("ratingProjector", rate)
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
              </View>
            )}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Anonymous Complaints</Text>
              <Switch
                style={styles.switch}
                value={state.anonymous}
                onValueChange={handleSwitchChange}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
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
    marginTop: "-10%",
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
