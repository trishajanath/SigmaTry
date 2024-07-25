import React, { useReducer, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Platform,
  Dimensions,
} from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "@venedicto/react-native-dropdown";

const { width } = Dimensions.get("window");

const initialState = {
  step1Data: { name: "", number: "", department: "" },
  step2Data: { content: "", anonymous: false },
  selectedOptionType: "Select Type",
  selectedOptionDomain: "Select Domain",
  department: "Select Option",
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_STEP1_DATA":
      return { ...state, step1Data: { ...state.step1Data, ...action.payload } };
    case "SET_STEP2_DATA":
      return { ...state, step2Data: { ...state.step2Data, ...action.payload } };
    case "SET_SELECTED_OPTION_TYPE":
      return { ...state, selectedOptionType: action.payload };
    case "SET_SELECTED_OPTION_DOMAIN":
      return { ...state, selectedOptionDomain: action.payload };
    case "SET_DEPARTMENT":
      return { ...state, department: action.payload };
    default:
      return state;
  }
}

const ProgressStepsComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();
  navigation.setOptions({ headerTitle: "" });

  const [openType, setOpenType] = useState(false);
  const [openDomain, setOpenDomain] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);

  const handleSwitchChange = (value: any) => {
    dispatch({ type: "SET_STEP2_DATA", payload: { anonymous: value } });
  };

  useEffect(() => {
    if (openType) {
      setOpenDomain(false);
      setOpenDepartment(false);
    }
  }, [openType]);

  useEffect(() => {
    if (openDomain) {
      setOpenType(false);
      setOpenDepartment(false);
    }
  }, [openDomain]);

  useEffect(() => {
    if (openDepartment) {
      setOpenType(false);
      setOpenDomain(false);
    }
  }, [openDepartment]);

  return (
    <View style={styles.container}>
      <ProgressSteps
        activeStepIconBorderColor="#8283e9"
        activeStepIconColor="#d6d7f8"
        completedStepIconColor="#8283e9"
        activeLabelColor="#8283e9"
        completedProgressBarColor="#8283e9"
        progressBarColor="#eeecef"
        activeStepIconContainer={styles.activeStepIconContainer}
        completedStepIconContainer={styles.completedStepIconContainer}
      >
        <ProgressStep
          label=""
          nextBtnStyle={styles.nextBtn}
          previousBtnStyle={styles.previousBtn}
          nextBtnTextStyle={styles.nextBtnText}
          previousBtnTextStyle={styles.previousBtnText}
          scrollViewProps={{
            contentContainerStyle: { flexGrow: 1, justifyContent: "center" },
          }}
        >
          <Text style={styles.main}>Department</Text>
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Block Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={state.step1Data.name}
              onChangeText={(text) =>
                dispatch({ type: "SET_STEP1_DATA", payload: { name: text } })
              }
            />
            <Text style={styles.label}>Floor Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Number"
              value={state.step1Data.number}
              onChangeText={(text) =>
                dispatch({ type: "SET_STEP1_DATA", payload: { number: text } })
              }
            />
            <Text style={styles.label}>Department Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Department Name"
              value={state.step1Data.department}
              onChangeText={(text) =>
                dispatch({ type: "SET_STEP1_DATA", payload: { department: text } })
              }
            />
            <Text style={styles.pickerLabel}>Cabin</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                setSelected={(value: any) =>
                  dispatch({ type: "SET_SELECTED_OPTION_TYPE", payload: value })
                }
                data={["Faculty Cabin", "HoD Cabin", "Department Office", "Labs"]}
                search={false}
                save="value"
              />
            </View>
          </View>
        </ProgressStep>
        <ProgressStep
          label=""
          nextBtnStyle={styles.nextBtn}
          previousBtnStyle={styles.previousBtn}
          nextBtnTextStyle={styles.nextBtnText}
          previousBtnTextStyle={styles.previousBtnText}
          scrollViewProps={{
            contentContainerStyle: { flexGrow: 1, justifyContent: "flex-start" },
          }}
        >
          <Text style={styles.pickerLabel}>Type</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: any) =>
                dispatch({ type: "SET_SELECTED_OPTION_TYPE", payload: value })
              }
              data={["Complaint", "Feedback", "Suggestion"]}
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
              data={["Cleaning", "Plumbing", "Civil & Carpentry", "Electrical", "Others"]}
              save="value"
            />
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={state.step2Data.content}
              onChangeText={(text) =>
                dispatch({ type: "SET_STEP2_DATA", payload: { content: text } })
              }
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Anonymous Replies</Text>
            <Switch
              value={state.step2Data.anonymous}
              onValueChange={handleSwitchChange}
            />
          </View>
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    fontSize: 22,
    marginTop: Platform.OS === 'ios' ? "-17%" : "-10%",
    marginBottom:'5%',
    textAlign: "left",
  },
  nextBtn: {
    backgroundColor: "transparent", 
    marginTop: Platform.OS === 'ios' ? "-130%" : "-10%",
  },
  previousBtn: {
    backgroundColor: "transparent", 
    marginTop: Platform.OS === 'ios' ? "-112%" : "-10%",
  },
  nextBtnText: {
    color: "#8283e9", // Text color
    fontSize: 16,
  },
  previousBtnText: {
    color: "#8283e9", // Text color
    fontSize: 16,
  },
  activeStepIconContainer: {
    marginTop: Platform.OS === 'ios' ? "-2%" : "-1%",
  },
  completedStepIconContainer: {
    marginTop: Platform.OS === 'ios' ? "-2%" : "-2%",
  },
  switchContainer: {
    marginTop: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
    padding: "2%",
    borderRadius: 5,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: "Raleway_200ExtraLight",
  },
  pickerLabel: {
    fontSize: 16,
    marginTop: Platform.OS === 'ios' ? "7%" : "0%",
    marginBottom: "3%",
    textAlign: "left",
  },
  stepContainer: {
    marginTop: Platform.OS === 'ios' ? "3%" : "0%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: "5%",
    width: "100%",
  },
  picker: {
    height: "4%",
    width: "100%",
    color: "#344953",
    justifyContent: "center",
  },
  pickerContainer: {
    marginBottom: "2%",
    height: "13%",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#a2c2e8",
    backgroundColor: "#fff",
  },
  dropdown: {
    width: "100%",
    height: width * 0.15,
    marginTop: "2%",
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#a2c2e8",
    borderRadius: 10,
    paddingHorizontal: "5%",
    marginBottom: "2%",
    justifyContent: "center",
  },
  dropdownWrapper: {
    width: "100%", // Ensure the dropdown wrapper takes the full width
    borderWidth: 0, // Remove the border width
    borderColor: "transparent", // Set border color to transparent
    paddingHorizontal: 0, // Adjust padding to fit your design
    marginBottom: "2%",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: "5%",
  },
  label: {
    fontSize: 16,
    marginBottom: '4%',  
  },
  input: {
    width: "100%",
    height: 40, 
    backgroundColor: "#f5f5f5",
    paddingHorizontal: '2%',
    marginBottom: '5%',  
    shadowColor: "#8283e9",  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: "5%",
    paddingLeft: "2%",
  },
  icon: {
    position: "absolute",
    left: "5%",
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
});

export default ProgressStepsComponent;
