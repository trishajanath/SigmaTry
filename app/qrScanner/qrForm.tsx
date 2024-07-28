import React, { useReducer, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { SelectList } from "@venedicto/react-native-dropdown";
import { useUser } from "@/Hooks/userContext";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import { Appbar } from "react-native-paper";

const initialState = {
  block: "",
  floor: "",
  classroom: "",
  selectedOptionType: "",
  selectedOptionDomain: "",
  content: "",
  anonymous: false,
};

const reducer = (state: any, action: { type: any; payload: any }) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const parseScannedData = (url: string) => {
  const queryString = url.split("?")[1];
  const params = new URLSearchParams(queryString);
  return {
    block: params.get("block") || "",
    floor: params.get("floor") || "",
    classroom: params.get("room") || "",
  };
};

const SinglePageForm: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { scannedData } = useGlobalSearchParams();

  const users = useUser();

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...parseScannedData(scannedData ? scannedData.toString() : ""),
  });

  const handleSwitchChange = (value: boolean) => {
    dispatch({ type: "SET_FORM_DATA", payload: { anonymous: value } });
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const submitData = {
        name: users.name,
        id: users.id,
        issueType: state.selectedOptionType,
        issueCat: state.selectedOptionDomain,
        actionItem: state.content,
        block: state.block,
        floor: state.floor,
        issueContent: state.classroom,
        comments: [
          {
            by: users.id,
            content: "",
          },
        ],
      };
      console.log(submitData);
      const response = await axios.post(
        "https://api.gms.intellx.in/client/issue/report",
        submitData
      );
      console.log(response.data);
      router.replace("/Home/submitPage");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      </Appbar.Header>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={100}
      >
        <View style={styles.container}>
          <Text style={styles.main}>Issue Report Form</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Block Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Block"
              value={state.block}
              onChangeText={(text) =>
                dispatch({ type: "SET_FORM_DATA", payload: { block: text } })
              }
            />
            <Text style={styles.label}>Floor Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Floor"
              value={state.floor}
              onChangeText={(text) =>
                dispatch({ type: "SET_FORM_DATA", payload: { floor: text } })
              }
            />
            <Text style={styles.label}>Classroom</Text>
            <TextInput
              style={styles.input}
              placeholder="Classroom"
              value={state.classroom}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  payload: { classroom: text },
                })
              }
            />
            <Text style={styles.pickerLabel}>Type</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                setSelected={(value: string) =>
                  dispatch({
                    type: "SET_FORM_DATA",
                    payload: { selectedOptionType: value },
                  })
                }
                data={["Complaint", "Feedback"]}
                search={false}
                save="value"
              />
            </View>
            <Text style={styles.pickerLabel}>Domain</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                setSelected={(value: string) =>
                  dispatch({
                    type: "SET_FORM_DATA",
                    payload: { selectedOptionDomain: value },
                  })
                }
                data={[
                  "Cleaning",
                  "Plumbing",
                  "Civil & Carpentry",
                  "Electrical",
                  "AV and Projectors",
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
                dispatch({ type: "SET_FORM_DATA", payload: { content: text } })
              }
            />
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Anonymous Replies</Text>
              <Switch
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
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: "2%",
  },
  container: {
    flex: 1,
    padding: "5%",
  },
  main: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: "10%",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: "4%",
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: "2%",
    marginBottom: "5%",
    borderRadius: 5,
  },
  dropdownWrapper: {
    width: "100%",
    marginBottom: "4%",
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: "3%",
  },
  switchContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5%",
  },
  switchLabel: {
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: "#8283e9",
    paddingVertical: "3%",
    paddingHorizontal: "3%",
    borderRadius: 5,
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SinglePageForm;
