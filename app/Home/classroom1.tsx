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
import { router } from "expo-router";
import axios from "axios";
import { useUser } from "@/Hooks/userContext";
const { width } = Dimensions.get("window");

interface FormData {
  name: string;
  number: string;
  classroom: string;
  content: string;
  anonymous: boolean;
  selectedOptionType: string;
  selectedOptionDomain: string;
}




const initialState: FormData = {
  name: "",
  number: "",
  classroom: "",
  content: "",
  anonymous: false,
  selectedOptionType: "Select Type",
  selectedOptionDomain: "Select Domain",
};

type Action =
  | { type: "SET_FORM_DATA"; payload: Partial<FormData> };

function reducer(state: FormData, action: Action): FormData {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const SinglePageForm: React.FC = () => {
  const users=useUser();
  
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSwitchChange = (value: boolean) => {
    dispatch({ type: "SET_FORM_DATA", payload: { anonymous: value } });
  };
  

  const handleSubmit =async () => {
    try {
      const Submit={
        name:users.name,
        id:users.id,
        type:state.selectedOptionType,
        cat:state.selectedOptionDomain,
        content:state.content,
        block:state.name,
        floor:state.number,
        class:state.classroom,
        comments:[]
        
      }
      console.log(Submit)

      const response=await axios.post("https://api.gms.intellx.in/client/issue/report",Submit)
      console.log(response.data);
      router.back();
    } catch (error) {
      console.log(error)
      
    }
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView}
      enableOnAndroid={true}
      extraHeight={100}
    >
      <View style={styles.container}>
        <Text style={styles.main}>Classroom Report Form</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Block Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={state.name}
            onChangeText={(text) =>
              dispatch({ type: "SET_FORM_DATA", payload: { name: text } })
            }
          />
          <Text style={styles.label}>Floor Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Number"
            value={state.number}
            onChangeText={(text) =>
              dispatch({ type: "SET_FORM_DATA", payload: { number: text } })
            }
          />
          <Text style={styles.label}>Classroom</Text>
          <TextInput
            style={styles.input}
            placeholder="Class"
            value={state.classroom}
            onChangeText={(text) =>
              dispatch({ type: "SET_FORM_DATA", payload: { classroom: text } })
            }
          />
          <Text style={styles.pickerLabel}>Type</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: string) =>
                dispatch({ type: "SET_FORM_DATA", payload: { selectedOptionType: value } })
              }
              data={["Issue", "Feedback","Suggestion"]}
              search={false}
              save="value"
            />
          </View>
          <Text style={styles.pickerLabel}>Domain</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: string) =>
                dispatch({ type: "SET_FORM_DATA", payload: { selectedOptionDomain: value } })
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
            value={state.content}
            onChangeText={(text) =>
              dispatch({ type: "SET_FORM_DATA", payload: { content: text } })
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
  formContainer: {
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
    marginTop: '-10%',
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
