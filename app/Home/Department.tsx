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

interface State {
  name: string;
  number: string;
  department: string;
  cabin: string;
  type: string;
  domain: string;
  content: string;
  anonymous: boolean;
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
};

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: string | boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

const SinglePageForm: React.FC = () => {
  const user=useUser();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [openType, setOpenType] = useState(false);
  const [openDomain, setOpenDomain] = useState(false);
  const [openCabin, setOpenCabin] = useState(false);

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

  const handleSubmit =async () => {
    try{
      const Submit={
        name:user.name,
        id:user.id,
        issueType:state.type,
        issueCat:state.domain,
        issueContent:`${state.department}\n${state.content}`,
        block:state.name,
        floor:state.number,
        actionType:state.department,


      }
      console.log(Submit);
      //const response=await axios.post("https://api.gms.intellx.in/client/issue/report",Submit)
      //console.log(response.data);
      //router.back();
      

      }
      catch(error){
        console.log(error);
      }
    }
   
  


  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView}
      enableOnAndroid={true}
      extraHeight={100}
    >
      <View style={styles.container}>
        <Text style={styles.main}>Department Report Form</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Block Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={state.name}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "name", value: text })
            }
          />
          <Text style={styles.label}>Floor Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Number"
            value={state.number}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "number", value: text })
            }
          />
          <Text style={styles.label}>Department Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Department"
            value={state.department}
            onChangeText={(text) =>
              dispatch({ type: "SET_FIELD", field: "department", value: text })
            }
          />
          <Text style={styles.label}>Cabin</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              data={["Faculty Cabin", "HoD Cabin", "Department Office","Labs"]}
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
              data={["Complaint", "Feedback", "Suggestion"]}
              search={false}
              save="value"
            />
          </View>
          
          <Text style={styles.pickerLabel}>Domain</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: string) =>
                dispatch({ type: "SET_FIELD", field: "domain", value })
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
              dispatch({ type: "SET_FIELD", field: "content", value: text })
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
    marginTop: '-9%',
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
