import React, { useReducer } from "react";
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
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const initialState = {
  type: "Select Type",
  content: "",
  anonymous: false,
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_ANONYMOUS":
      return { ...state, anonymous: action.payload };
    default:
      return state;
  }
}

const SinglePageForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSwitchChange = (value: any) => {
    dispatch({ type: "SET_ANONYMOUS", payload: value });
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", state);
    router.push("/Home/submitPage"); 
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView}
      enableOnAndroid={true}
      extraHeight={100}
    >
      <View style={styles.container}>
        <Text style={styles.main}>Maintenance Form</Text>

        <Text style={styles.pickerLabel}>Type</Text>
        <View style={styles.dropdownWrapper}>
          <SelectList
            setSelected={(value: any) =>
              dispatch({ type: "SET_TYPE", payload: value })
            }
            data={["Complaint", "Feedback", "Suggestion"]}
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
            dispatch({ type: "SET_CONTENT", payload: text })
          }
        />

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
    alignItems: 'flex-end',
    marginLeft: '39%',  
  },
  submitBtn: {
    backgroundColor: "#8283e9",
    paddingVertical: '3%',
    paddingHorizontal: '3%',
    borderRadius: 5,
    marginTop: '1%',
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
