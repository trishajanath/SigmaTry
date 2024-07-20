import React, { useReducer, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  Dimensions,
} from "react-native";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker-plus";
import { SelectList } from "@venedicto/react-native-dropdown";

const { width } = Dimensions.get("window");

const initialState = {
  step1Data: { name: "", number: "", restroom: "" },
  step2Data: { content: "", anonymous: false },
  selectedOptionType: "Select Type",
  selectedOptionDomain: "Select Domain",
  restroom: "Select Option",
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
    case "SET_RESTROOM":
      return { ...state, restroom: action.payload };
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
  const [openRestroom, setOpenRestroom] = useState(false);

  const handleSwitchChange = (value: any) => {
    dispatch({ type: "SET_STEP2_DATA", payload: { anonymous: value } });
  };

  // Close other dropdowns when one is opened
  useEffect(() => {
    if (openType) {
      setOpenDomain(false);
      setOpenRestroom(false);
    }
  }, [openType]);

  useEffect(() => {
    if (openDomain) {
      setOpenType(false);
      setOpenRestroom(false);
    }
  }, [openDomain]);

  useEffect(() => {
    if (openRestroom) {
      setOpenType(false);
      setOpenDomain(false);
    }
  }, [openRestroom]);

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
          <Text style={styles.main}>Restroom</Text>
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
            <Text style={styles.label}>Restroom</Text>
            <SelectList
              data={["Gents", "Ladies", "Differently Abled"]}
              setSelected={(value: any) =>
                dispatch({ type: "SET_RESTROOM", payload: value })
              }
              save="value"
              boxStyles={{
                height: width * 0.15,
                width: "100%",
                backgroundColor: "#f5f5f5",
                paddingHorizontal: "5%",
                marginBottom: "2%",
              }}
            />
          </View>
        </ProgressStep>
        <ProgressStep
          label=""
          nextBtnStyle={styles.nextBtn}
          previousBtnStyle={styles.previousBtn}
          scrollViewProps={{
            contentContainerStyle: { flexGrow: 1, justifyContent: "center" },
          }}
        >
          <Text style={styles.pickerLabel}>Type</Text>
          <SelectList
            setSelected={(value: any) =>
              dispatch({ type: "SET_SELECTED_OPTION_TYPE", payload: value })
            }
            data={["Complaint", "Feedback", "Suggestion"]}
            save="value"
          />
          <Text style={styles.pickerLabel}>Domain</Text>
          <SelectList
            setSelected={(value: any) =>
              dispatch({ type: "SET_SELECTED_OPTION_DOMAIN", payload: value })
            }
            data={["Hygiene", "Maintenance", "Amenities", "Accessibility"]}
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
    marginTop: "-13%",
    textAlign: "center",
    marginBottom: "5%",
  },
  nextBtn: {
    marginTop: 20,
  },
  previousBtn: {
    marginTop: 20,
  },
  activeStepIconContainer: {
    marginTop: -10,
  },
  completedStepIconContainer: {
    marginTop: -10,
  },
  switchContainer: {
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
    marginBottom: "2%",
    textAlign: "left",
  },
  stepContainer: {
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
    marginBottom: "1%",
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
