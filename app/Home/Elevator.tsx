import React, { useEffect, useReducer } from "react";
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

const { width } = Dimensions.get("window");

// Initial state
const initialState = {
  name: "",
  content: "",
  anonymous: false,
  selectedOptionType: "Select Type",
  selectedOptionDomain: "Select Domain",
  ratingCleanliness:undefined
};

// Reducer function
function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };

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

const SinglePageForm = () => {
  const users = useUser();
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
    if (!state.name.trim()) {
      Toast.show({
        type: "error",
        text1: "Block name is missing",
        visibilityTime: 2000,
      });
      return;
    }
    if (state.selectedOptionType === "Select Type") {
      Toast.show({
        type: "error",
        text1: "Please select a Type.",
        visibilityTime: 2000,
      });
      return;
    }
    if (state.selectedOptionDomain === "Select Domain") {
      Toast.show({
        type: "error",
        text1: "Please select a Domain.",
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
    if (
      state.selectedOptionType === "Feedback" &&
      state.ratingCleanliness === undefined
    ) {
      Toast.show({
        type: "error",
        text1: "Ratings is required.",
        visibilityTime: 2000,
      });
      return;
    }
  
    try {
      const Submit = {
        name: state.name, // Ensure this is correctly passed
        id: users.id,
        issueType: state.selectedOptionType,
        issueCat: state.selectedOptionDomain,
        actionType: "",
        block: state.name,
        floor: "",
        issueContent: "",
        actionItem:"Lift", // Set actionItem to "Lift"
        comments: [
          {
            by: users.id,
            content: state.content,
          },
        ],
        "survey-cleanliness": state.ratingCleanliness,
      };
  
      console.log("Submitting data:", Submit);
      const response = await axios.post(
        "https://api.gms.intellx.in/client/issue/report",
        Submit
      );
  
      console.log(response.data);
      router.push({
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
          <Text style={styles.main}>Lift Complaint</Text>

          <Text style={styles.label}>Block Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Block Name"
            value={state.name}
            onChangeText={(text) =>
              dispatch({ type: "SET_NAME", payload: text })
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

          <Text style={styles.pickerLabel}>Domain</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: any) =>
                dispatch({ type: "SET_SELECTED_OPTION_DOMAIN", payload: value })
              }
              data={["Cleaning", "Light and Switches", "Fan", "Not Working"]}
              search={false}
              save="value"
            />
          </View>

          <Text style={styles.label}>Content</Text>
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
                 <Text style={styles.lab}>Give your ratings</Text>
                 <Text style={styles.labe}>Cleanliness</Text>
              <View style={styles.customRatingContainer}>
                {[1, 2, 3].map((rate) => (
                  <View key={rate} style={styles.ratingItem}>
                    <TouchableOpacity
                      style={[
                        styles.circle,
                        state.ratingCleanliness === rate && styles.selectedCircle,
                      ]}
                      onPress={() => handleRatingSelect('ratingCleanliness', rate)}
                    >
                      <Text style={styles.circleText}></Text>
                    </TouchableOpacity>
                    <Text style={styles.ratingText}>
                      {rate === 1 ? 'Poor' : rate === 2 ? 'Satisfactory' : 'Average'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
)}

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Anonymous Replies</Text>
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
      <View/>
      <Toast/>
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
    marginTop:"2%"
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
