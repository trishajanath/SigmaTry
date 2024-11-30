import React, { useReducer, useState, useEffect } from "react";
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
import { router, useNavigation } from "expo-router";
import axios from "axios";
import { useUser } from "@/Hooks/userContext";
import { Appbar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { BACKEND_URL } from "@/production.config";

const { width } = Dimensions.get("window");

interface State {
  name: string;
  number: string;
  department: string;
  cabin: string;
  type: string;
  domain: string;
  content: string;
  anonymous: boolean;
  ratingCleanliness?: number;
  issuesList: string[];  // Added to store matching issues
  selectedIssue: string | null; // Store the selected issue (if any)
}

const initialState: State = {
  name: "",
  number: "",
  department: "",
  cabin: "Select Option",
  type: "Select Type",
  domain: "Select Domain",
  content: "",
  anonymous: false,
  ratingCleanliness: undefined,
  issuesList: [],
  selectedIssue: null,
};

type Action =
  | {
      type: "SET_FIELD";
      field: keyof State;
      value: string | boolean;
    }
  | { type: "SET_RATING"; category: string; rating: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_RATING":
      return {
        ...state,
        [action.category]: action.rating,
      };
    default:
      return state;
  }
}

const SinglePageForm: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const user = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [openType, setOpenType] = useState(false);
  const [openDomain, setOpenDomain] = useState(false);
  const [openCabin, setOpenCabin] = useState(false);
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
              issue.actionItem === "Department" &&
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
    dispatch({ type: "SET_FIELD", field: "anonymous", value });
  };

  useEffect(() => {
    if (openType) {
      setOpenDomain(false);
      setOpenCabin(false);
    }
  }, [openType]);

  useEffect(() => {
    if (openDomain) {
      setOpenType(false);
      setOpenCabin(false);
    }
  }, [openDomain]);

  useEffect(() => {
    if (openCabin) {
      setOpenType(false);
      setOpenDomain(false);
    }
  }, [openCabin]);

  const handleSubmit = async () => {
    if (
      !state.name ||
      !state.number ||
      !state.department ||
      state.cabin === "Select Option" ||
      state.type === "Select Type" ||
      
      (state.type === "Feedback" && state.ratingCleanliness === undefined)
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
      const Submit = {
        name: user.name,
        id: user.id,
        issueType: state.type,

        issueCat: state.domain,
        actionItem: "Department",
        block: state.name,

        floor: state.number,
        issueContent: `  Department-${state.department} Cabin-${state.cabin}`,

        comments: [
          {
            by: user.name,
            content: state.content,
          },
        ],
        "survey-cleanliness": state.ratingCleanliness,
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
        console.log(Response);
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
          <Text style={styles.main}>Department Complaint</Text>
          <View style={styles.formContainer}>
          <Text style={styles.label}>Block Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Block Name as - A"
              value={state.name}
              onChangeText={(text) =>
                dispatch({ type: "SET_FIELD", field: "name", value: text })
              }
            />
            <Text style={styles.label}>Floor Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Floor Number as - 1"
              value={state.number}
              onChangeText={(text) =>
                dispatch({ type: "SET_FIELD", field: "number", value: text })
              }
            />
            <Text style={styles.label}>Department Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Department Name"
              value={state.department}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "department",
                  value: text,
                })
              }
            />
            <Text style={styles.label}>Cabin</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                data={[
                  "Faculty Cabin",
                  "HoD Cabin",
                  "Department Office",
                  "Labs",
                ]}
                setSelected={(value: string) =>
                  dispatch({ type: "SET_FIELD", field: "cabin", value })
                }
                search={false}
                save="value"
              />
            </View>

            <Text style={styles.pickerLabel}>Type</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                setSelected={(value: string) =>
                  dispatch({ type: "SET_FIELD", field: "type", value })
                }
                data={["Complaint", "Feedback"]}
                search={false}
                save="value"
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
          value: `Description: ${issue.comments} | Date: ${issue.date}`, 
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
                setSelected={(value: string) =>
                  dispatch({ type: "SET_FIELD", field: "domain", value })
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
              />
            </View>

            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={state.content}
              onChangeText={(text) =>
                dispatch({ type: "SET_FIELD", field: "content", value: text })
              }
              
            />
            </>
)}
            {state.type === "Feedback" && (
              <View style={styles.ratingContainer}>
                <Text style={styles.lab}>Give your ratings</Text>
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
  label: {
    fontSize: 15,
    marginBottom: "4%",
  },
  labe: {
    fontSize: 15,
    marginBottom: "2%",
    marginTop: "2%",
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
  ratingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20, // Adjust spacing between items if needed
  },
  formContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: "10%",
    width: "100%",
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
