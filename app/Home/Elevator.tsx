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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width } = Dimensions.get("window");

const initialState = {
  step1Data: { name: "", number: "", elevator: "" },
  step2Data: { content: "", anonymous: false },
  selectedOptionType: "Select Type",
  selectedOptionDomain: "Select Domain",
  elevator: "Select Option",
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
    case "SET_ELEVATOR":
      return { ...state, elevator: action.payload };
    default:
      return state;
  }
}

const SinglePageForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [openType, setOpenType] = useState(false);
  const [openDomain, setOpenDomain] = useState(false);
  const [openElevator, setOpenElevator] = useState(false);

  const handleSwitchChange = (value: any) => {
    dispatch({ type: "SET_STEP2_DATA", payload: { anonymous: value } });
  };

  useEffect(() => {
    if (openType) {
      setOpenDomain(false);
      setOpenElevator(false);
    }
  }, [openType]);

  useEffect(() => {
    if (openDomain) {
      setOpenType(false);
      setOpenElevator(false);
    }
  }, [openDomain]);

  useEffect(() => {
    if (openElevator) {
      setOpenType(false);
      setOpenDomain(false);
    }
  }, [openElevator]);

  const handleSubmit = () => {
    console.log("Form submitted with data:", state);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView}
      enableOnAndroid={true}
      extraHeight={100}
    >
      <View style={styles.container}>
        <Text style={styles.main}>Elevator Report Form</Text>
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
              data={["Hygiene", "Maintenance", "Amenities", "Accessibility"]}
              search={false}
              save="value"
            />
          </View>
          
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.input}
            placeholder="Content"
            value={state.step2Data.content}
            onChangeText={(text) =>
              dispatch({ type: "SET_STEP2_DATA", payload: { content: text } })
            }
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Anonymous Replies</Text>
            <Switch
              style={styles.switch}
              value={state.step2Data.anonymous}
              onValueChange={handleSwitchChange}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: '2%',
  },
  main: {
    fontSize: 20,
    marginTop: Platform.OS === 'ios' ? '1%' : '1%',
    textAlign: "center",
    marginBottom: '10%',  
  },
  stepContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: '10%',  
    width: "100%",
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
  dropdownWrapper: {
    width: "100%",
    marginBottom: '4%',
      
  },
  pickerLabel: {
    fontSize: 16,
    marginTop: Platform.OS === 'ios' ? '2%' : 0,
    marginBottom: '3%',  
  },
  switchContainer: {
    marginTop: 20,  
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: '5%',  
    padding: '1%',
    borderRadius: 5,
  },
  switchLabel: {
    fontSize: 16,
  },
  switch: {
    alignItems:'flex-end',
    marginLeft: '39%',  
  },
  submitBtn: {
    backgroundColor: "#8283e9",
    paddingVertical: '3%',
    paddingHorizontal: '3%',
    borderRadius: 5,
    marginTop: '-5%',
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: '5%',
  },
});

export default SinglePageForm;
