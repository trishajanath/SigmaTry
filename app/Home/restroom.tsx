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

const initialState = {
  name: "",
  number: "",
  restroom: "Select Option",
  type: "Select Type",
  domain: "Select Domain",
  content: "",
  anonymous: false,
  ratings: {
    mirror: "",
    urinals: "",
    toilets: "",
    floor: "",
    lights: "",
  },
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_NUMBER":
      return { ...state, number: action.payload };
    case "SET_RESTROOM":
      return { ...state, restroom: action.payload };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_DOMAIN":
      return { ...state, domain: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "SET_ANONYMOUS":
      return { ...state, anonymous: action.payload };
    case "SET_RATING":
      return {
        ...state,
        ratings: { ...state.ratings, [action.payload.field]: action.payload.value },
      };
    default:
      return state;
  }
}

const RatingComponent = ({ label, field, dispatch, state }: any) => (
  <View style={styles.ratingRow}>
    <Text style={styles.labe}>{label}</Text>
    <View style={styles.ratingOptionsContainer}>
      {["Poor", "Satisfactory", "Average"].map((rating) => (
        <TouchableOpacity
          key={rating}
          style={styles.ratingOption}
          onPress={() => dispatch({ type: "SET_RATING", payload: { field, value: rating } })}
        >
          <View
            style={[
              styles.circle,
              state.ratings[field] === rating && styles.selectedCircle,
            ]}
          />
          <Text style={styles.ratingText}>{rating}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const SinglePageForm = () => {
  const user = useUser();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSwitchChange = (value: boolean) => {
    dispatch({ type: "SET_ANONYMOUS", payload: value });
  };

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const handleSubmit = async () => {
    if (!state.name || !state.number || state.restroom === "Select Option" || state.type === "Select Type" || state.domain === "Select Domain" || !state.content) {
      Toast.show({
        type: "error",
        text1: "Please fill out of all the fields before submitting.",
        visibilityTime: 2000,
      });
      return;
    }
    try {
      const Submit = {
        name: user.name,
        id: user.id,
        issueType: state.type,
        issueCat: state.domain,
        actionType: state.department,
        block: state.name,
        floor: state.number,
        issueContent: `${state.restroom}\n${state.content}`,
        ratings: state.ratings,
        comments: [
          {
            by: user.id,
            content: "",
          },
        ],
      };
      const response = await axios.post(
        "https://api.gms.intellx.in/client/issue/report",
        Submit
      );
      console.log(response.data);
      router.push("/Home/submitPage");
     
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
        extraHeight={100}
      >
        <View style={styles.container}>
          <Text style={styles.main}>Restroom Complaint</Text>

          <Text style={styles.label}>Block Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Block Designation"
            value={state.name}
            onChangeText={(text) =>
              dispatch({ type: "SET_NAME", payload: text })
            }
          />

          <Text style={styles.label}>Floor Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Floor Number"
            value={state.number}
            onChangeText={(text) =>
              dispatch({ type: "SET_NUMBER", payload: text })
            }
          />

          <Text style={styles.label}>Restroom</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              data={["Gents", "Ladies", "Differently Abled"]}
              setSelected={(value: any) =>
                dispatch({ type: "SET_RESTROOM", payload: value })
              }
              search={false}
              save="value"
              placeholder={state.restroom}
            />
          </View>

          <Text style={styles.pickerLabel}>Type</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: any) =>
                dispatch({ type: "SET_TYPE", payload: value })
              }
              data={["Complaint", "Feedback"]}
              search={false}
              save="value"
              placeholder={state.type}
            />
          </View>

          <Text style={styles.pickerLabel}>Domain</Text>
          <View style={styles.dropdownWrapper}>
            <SelectList
              setSelected={(value: any) =>
                dispatch({ type: "SET_DOMAIN", payload: value })
              }
              data={["Cleaning", "Plumbing", "Civil & Carpentry", "Electrical", "Others"]}
              search={false}
              save="value"
              placeholder={state.domain}
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

          {state.type === "Feedback" && (
            <View style={styles.ratingsContainer}>
              <Text style={styles.lab}>Give your ratings</Text>
              <RatingComponent label="Mirror & Washbasin" field="mirror" dispatch={dispatch} state={state} />
              <RatingComponent label="Urinals" field="urinals" dispatch={dispatch} state={state} />
              <RatingComponent label="Toilets" field="toilets" dispatch={dispatch} state={state} />
              <RatingComponent label="Floor" field="floor" dispatch={dispatch} state={state} />
              <RatingComponent label="Lights" field="lights" dispatch={dispatch} state={state} />
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
  lab: {
    fontSize: 20,
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
    marginRight: 10,
  },
  container: {
    flex: 1,
    padding: "5%",
  },switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  submitBtn: {
    backgroundColor: "#8283e9",
    paddingVertical: "3%",
    paddingHorizontal: "3%",
    borderRadius: 5,
    marginTop: "0%",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  
  labe: {
    fontSize: 15,
    marginBottom: "2%",
    marginTop:"2%"
  },
  ratingsContainer: {
    width: "100%",
    marginTop: 20,
  },

  ratingRow: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  ratingOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop:'2%',
    marginBottom:"-4%"
  },
  ratingOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 10,
  },
  selectedCircle: {
    backgroundColor: "#8283e9",
  },
  ratingText: {
    fontSize: 16,
  },
});

export default SinglePageForm;
