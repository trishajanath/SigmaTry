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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import axios from "axios";
import { useUser } from "@/Hooks/userContext";
import { Appbar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { BACKEND_URL } from "@/production.config";

const { width } = Dimensions.get("window");
interface FormData {
  name: string;
  number: string;
  restroom: string;
  type: string;
  domain: string;
  content: string;
  anonymous: boolean;
  ratingmirror?: number;
  ratingurinals?: number;
  ratingtoilets?: number;
  ratingfloor?: number;
  ratinglights?: number;
  issuesList: string[];  // Added to store matching issues
  selectedIssue: string | null; // Store the selected issue (if any)
}

const initialState: FormData = {
  name: "",
  number: "",
  restroom: "Select Option",
  type: "Select Type",
  domain: "Select Domain",
  content: "",
  anonymous: false,
  ratingmirror: undefined,
  ratingurinals: undefined,
  ratingtoilets: undefined,
  ratingfloor: undefined,
  ratinglights: undefined,
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
  };
};
const SinglePageForm: React.FC = () => {
  const users = useUser();
  const navigation = useNavigation();
  const { scannedData } = useGlobalSearchParams();

  const handleSwitchChange = (value: boolean) => {
    dispatch({ type: "SET_FORM_DATA", payload: { anonymous: value } });
  };
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...parseScannedData(scannedData ? scannedData.toString() : ""),
  });
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
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
              issue.actionItem === "Restroom" &&
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
  const handleSubmit = async () => {
    if (
      !state.name ||
      !state.number ||
      state.restroom === "Select Option" ||
      state.type === "Select Type" ||
      (state.type==="Complaint" && (state.domain === "Select Domain" ||
        !state.content )) ||
      (state.type === "Feedback" &&
        (state.ratingmirror === undefined ||
          state.ratingurinals === undefined ||
          state.ratingtoilets === undefined ||
          state.ratingfloor === undefined ||
          state.ratinglights === undefined))
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill out of all the fields before submitting.",
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
      const Submit = {
        name: users.name,
        id: users.id,
        issueType: state.type,
        issueCat: state.domain,
        actionItem: "Restroom",
        block: state.name,
        floor: state.number,
        issueContent: state.restroom,

        comments: [
          {
            by: users.id,
            content: state.content,
          },
        ],
        "survey-mirror": state.ratingmirror,
        "survey-urinals": state.ratingurinals,
        "survey-toilets": state.ratingtoilets,
        "survey-floor": state.ratingfloor,
        "survey-lights": state.ratinglights,
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
        <Appbar.Content title="Sigma - GMS " />
      </Appbar.Header>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={10}
      >
        <View style={styles.container}>
          <Text style={styles.main}>Restroom Complaint</Text>

          <Text style={styles.label}>Block Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Block Designation"
            value={state.name}
            onChangeText={(text) =>
              dispatch({ type: "SET_FORM_DATA", payload: { name: text } })
            }
          />

          <Text style={styles.label}>Floor Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Floor Number"
            value={state.number}
            onChangeText={(text) =>
              dispatch({ type: "SET_FORM_DATA", payload: { number: text } })
            }
          />

          <Text style={styles.label}>Restroom</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              data={["Gents", "Ladies", "Differently Abled"]}
              setSelected={(value: any) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  payload: { restroom: value },
                })
              }
              search={false}
              save="value"
              placeholder={state.restroom}
            />
          </View>

          <Text style={styles.pickerLabel}>Type</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: any) =>
                dispatch({ type: "SET_FORM_DATA", payload: { type: value } })
              }
              data={["Complaint", "Feedback"]}
              search={false}
              save="value"
              placeholder={state.type}
            />
          </View>
          {state.type === "Complaint" && similarIssues.length > 0 && (
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
          value: `Description: ${issue.comments} | Restroom: ${issue.issueContent} | Domain: ${issue.issueCat} | Date: ${issue.date}`,
        })),
        { key: "none",  value: "None of the Above" },
      ]}
      search={false}
      save="value"
      
    />
      </View>
  </>
    
)}
          {state.type !== "Feedback" && (
  <>
          <Text style={styles.pickerLabel}>Domain</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: any) =>
                dispatch({ type: "SET_FORM_DATA", payload: { domain: value } })
              }
              data={[
                "Cleaning",
                "Plumbing",
                "Civil & Carpentry",
                "Electrical",
                "Others",
              ]}
              search={false}
              save="value"
              placeholder={state.domain}
            />
          </View>

          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Content Here"
            value={state.content}
            onChangeText={(text) =>
              dispatch({ type: "SET_FORM_DATA", payload: { content: text } })
            }
          />
          </>
          )}
          {state.type === "Feedback" && (
            <View style={styles.ratingContainer}>
              <Text style={styles.lab}>Give your ratings</Text>
              <Text style={styles.labe}>Mirror & Washbasin</Text>
              <View style={styles.customRatingContainer}>
                {[1, 2, 3].map((rate) => (
                  <View key={rate} style={styles.ratingItem}>
                    <TouchableOpacity
                      style={[
                        styles.circle,
                        state.ratingmirror === rate && styles.selectedCircle,
                      ]}
                      onPress={() => handleRatingSelect("ratingmirror", rate)}
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

              <Text style={styles.labe}>Urinals</Text>
              <View style={styles.customRatingContainer}>
                {[1, 2, 3].map((rate) => (
                  <View key={rate} style={styles.ratingItem}>
                    <TouchableOpacity
                      style={[
                        styles.circle,
                        state.ratingurinals === rate && styles.selectedCircle,
                      ]}
                      onPress={() => handleRatingSelect("ratingurinals", rate)}
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

              <Text style={styles.labe}>Toilets</Text>
              <View style={styles.customRatingContainer}>
                {[1, 2, 3].map((rate) => (
                  <View key={rate} style={styles.ratingItem}>
                    <TouchableOpacity
                      style={[
                        styles.circle,
                        state.ratingtoilets === rate && styles.selectedCircle,
                      ]}
                      onPress={() => handleRatingSelect("ratingtoilets", rate)}
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

              <Text style={styles.labe}>Floor</Text>
              <View style={styles.customRatingContainer}>
                {[1, 2, 3].map((rate) => (
                  <View key={rate} style={styles.ratingItem}>
                    <TouchableOpacity
                      style={[
                        styles.circle,
                        state.ratingfloor === rate && styles.selectedCircle,
                      ]}
                      onPress={() => handleRatingSelect("ratingfloor", rate)}
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
              <Text style={styles.labe}>Lights</Text>
              <View style={styles.customRatingContainer}>
                {[1, 2, 3].map((rate) => (
                  <View key={rate} style={styles.ratingItem}>
                    <TouchableOpacity
                      style={[
                        styles.circle,
                        state.ratinglights === rate && styles.selectedCircle,
                      ]}
                      onPress={() => handleRatingSelect("ratinglights", rate)}
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

          {/* <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Anonymous Complaints</Text>
            <Switch
              style={styles.switch}
              value={state.anonymous}
              onValueChange={handleSwitchChange}
            />
          </View> */}

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
    marginTop: "0%",
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
