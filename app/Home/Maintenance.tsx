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
import { router, useNavigation } from "expo-router";
import axios from "axios";
import { useUser } from "@/Hooks/userContext";
import { Appbar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { BACKEND_URL } from "@/production.config";

const { width } = Dimensions.get("window");

const initialState = {
  type: "Select Type",
  block: "",
  content: "",
  anonymous: false,
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_BLOCK":
      return { ...state, block: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_ANONYMOUS":
      return { ...state, anonymous: action.payload };
    default:
      return state;
  }
}

const SinglePageForm = () => {
  const users = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [similarIssues, setSimilarIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<string>("");

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // Fetch similar issues when block changes
  
    useEffect(() => {
      const fetchSimilarIssues = async () => {
        if (!state.block.trim()) {
          setSimilarIssues([]);
          return;
        }
    
        try {
          const response = await axios.post(
            `${BACKEND_URL}/client/get_similar_issues`,
            {
              block: state.block, // Value from your form
              floor: "", // Default value for floor
            }
          );
    
          console.log("API Response:", JSON.stringify(response.data, null, 2));
    
          if (Array.isArray(response.data)) {
            response.data.forEach((issue: any, index: number) => {
              console.log(`Issue ${index + 1}:`, issue);
            });
    
            // Adjusted filter logic to match API response structure
            const issues = response.data.filter(
              (issue: any) =>
                issue.actionItem === "Miscellaneous" &&
              
                issue.block.toLowerCase() === state.block.toLowerCase()
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
    }, [state.block]);
    
  

  const handleSwitchChange = (value: any) => {
    dispatch({ type: "SET_ANONYMOUS", payload: value });
  };

  const handleSubmit = async () => {
    if (state.type === "Select Type") {
      Toast.show({
        type: "error",
        text1: "Please select a Type.",
        visibilityTime: 2000,
      });
      return;
    }
    if (!state.content.trim()) {
      Toast.show({
        type: "error",
        text1: "Content is required.",
        visibilityTime: 2000,
      });
      return;
    }
    if (selectedIssue === "None of the Above") {
      Toast.show({
        type: "info",
        text1: "You can continue entering your complaint.",
        visibilityTime: 2000,
      });
    
      return;
    }

    try {
      const Submit = {
        name: users.name,
        id: users.id,
        issueType: state.type,
        issueCat: "",
        actionItem: "Miscellaneous",
        block: state.block,
        floor: "",
        issueContent: "",
        comments: [
          {
            by: users.id,
            content: state.content,
          },
        ],
      };
      const response = await axios.post(
        `${BACKEND_URL}/client/issue/report`,
        Submit
      );
      router.replace({
        pathname: "/Home/submitPage",
        params: response.data,
      });
    } catch (error) {
      console.log(error);
    }
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
          <Text style={styles.main}>Miscellaneous Form</Text>
          <Text style={styles.label}>Block Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Block Name"
            value={state.block}
            onChangeText={(text) =>
              dispatch({ type: "SET_BLOCK", payload: text })
            }
          />



          <Text style={styles.pickerLabel}>Type</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: any) =>
                dispatch({ type: "SET_TYPE", payload: value })
              }
              data={["Complaint", "Feedback"]}
              search={false}
              save="value"
            />
          </View>
          {state.type === "Complaint" && similarIssues.length > 0 && (
  <>
    <Text style={styles.label}>Similar Issues Found</Text>
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
          value: `Description: ${issue.comments} Raised On: ${issue.date}, `,
        })),
        { key: "none",  value: "None of the Above" },
      ]}
      save="value"
      placeholder="Select an issue"
    />
  </>
)}


          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Content Here"
            value={state.content}
            onChangeText={(text) =>
              dispatch({ type: "SET_CONTENT", payload: text })
            }
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Anonymous Complaints</Text>
            <Switch
              style={styles.switch}
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
    marginTop: "2%",
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
