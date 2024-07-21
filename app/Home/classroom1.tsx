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
import DropDownPicker from "react-native-dropdown-picker-plus";
import { SelectList } from "@venedicto/react-native-dropdown";

const { width } = Dimensions.get("window");

const initialState = {
  step1Data: { name: "", number: "", classroom: "" },
  step2Data: { content: "", anonymous: false },
  selectedOptionType: "Select Type",
  selectedOptionDomain: "Select Domain",
  classroom: "Select Option",
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
    case "SET_CLASSROOM":
      return { ...state, classroom: action.payload };
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
  const [openClassroom, setOpenClassroom] = useState(false);

  const handleSwitchChange = (value: any) => {
    dispatch({ type: "SET_STEP2_DATA", payload: { anonymous: value } });
  };

  // Close other dropdowns when one is opened
  useEffect(() => {
    if (openType) {
      setOpenDomain(false);
      setOpenClassroom(false);
    }
  }, [openType]);

  useEffect(() => {
    if (openDomain) {
      setOpenType(false);
      setOpenClassroom(false);
    }
  }, [openDomain]);

  useEffect(() => {
    if (openClassroom) {
      setOpenType(false);
      setOpenDomain(false);
    }
  }, [openClassroom]);

  return (
    <View style={styles.container}>
      <ProgressSteps
        activeStepIconBorderColor="#a2c2e8"
        activeStepIconColor="#e9f7ff"
        completedStepIconColor="#a2c2e8"
        activeLabelColor="#a2c2e8"
        completedProgressBarColor="#a2c2e8"
        progressBarColor="#eeecef"
        activeStepIconContainer={styles.activeStepIconContainer}
        completedStepIconContainer={styles.completedStepIconContainer}
      >
        <ProgressStep
          label=""
          nextBtnStyle={styles.nextBtn}
          previousBtnStyle={styles.previousBtn}
          scrollViewProps={{
            contentContainerStyle: { flexGrow: 1, justifyContent: "center" },
          }}
        >
          <Text style={styles.main}>Classroom</Text>
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
            
          </View>
          <Text style={styles.label}>Classroom Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Number"
              value={state.step1Data.number}
              onChangeText={(text) =>
                dispatch({ type: "SET_STEP1_DATA", payload: { number: text } })
              }
            />
        </ProgressStep>
        <ProgressStep
          label=""
          nextBtnStyle={styles.nextBtn}
          previousBtnStyle={styles.previousBtn}
          scrollViewProps={{
            contentContainerStyle: { flexGrow: 1, justifyContent: "center", marginTop:"-30%" },
          }}
        >
          <Text style={styles.pickerLabel}>Type</Text>
          <SelectList
            setSelected={(value: any) =>
              dispatch({ type: "SET_SELECTED_OPTION_TYPE", payload: value })
            }
            data={["Complaint", "Feedback", "Suggestion"]}
            search={false}
            save="value"
          />
          <Text style={styles.pickerLabel}>Domain</Text>
          <SelectList
            setSelected={(value: any) =>
              dispatch({ type: "SET_SELECTED_OPTION_DOMAIN", payload: value })
            }
            data={["Cleaning", "Plumbing", "Civil & Carpentry", "Electrical","AV and Projectors","Others"]}
            save="value"
          />
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
    fontSize: 20,
    marginTop: Platform.OS === 'ios' ? "-35%" : "-13%",
    
    textAlign: "center",
    marginBottom: "5%",
  },
  nextBtn: {
    marginTop: Platform.OS === 'ios' ? "-130%" : "-100%",
   
  },
  previousBtn: {
    marginTop: Platform.OS === 'ios' ? "-113%" : "-100%",
    
  },
  activeStepIconContainer: {
    marginTop: Platform.OS === 'ios' ? "-2%" : "-1%",
  },
  completedStepIconContainer: {
    marginTop: Platform.OS === 'ios' ? "-2%" : "-2%",
  },
  switchContainer: {
    marginTop:"5%",
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
    marginTop: Platform.OS === 'ios' ? "11%" : "0%",
    marginBottom: "3%",
    textAlign: "left",
  },
  stepContainer: {
    marginTop: Platform.OS === 'ios' ? "10%" : "0%",
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
  container: {
    flex: 1,
    padding: "5%",
  },
  label: {
    fontSize: 16,
    marginBottom: "3%",
  },
  input: {
    width: "100%",
    height: width * 0.15,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: "5%",
    marginBottom: "2%",
    justifyContent: "center",
  },
});

export default ProgressStepsComponent;
