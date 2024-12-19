import React, { Suspense, useReducer, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { MaterialCommunityIcons, AntDesign, Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BACKEND_URL } from "@/production.config";
import { SelectList } from "@venedicto/react-native-dropdown";

const LazyHomeScreen = React.lazy(() => import("./index"));

const HomeScreenLoader = () => {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="small" color="#a3c3e7" />
        </View>
      }
    >
      <LazyHomeScreen />
    </Suspense>
  );
};

type State = {
  fullName: string;
  email: string;
  number: string;
  password: string;
  confirmPassword: string;
  signup:string
  dept:string
  clubname:string
  clubemail:string
};

type Action =
  | { type: "SET_FULL_NAME"; payload: string }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_NUMBER"; payload: string }
  | { type: "SET_DEPT" ; payload: string}
  | { type: "SET_CLUBNAME" ; payload: string}
  | { type: "SET_CLUBEMAIL" ; payload:string}
  | { type: "SET_SIGNUP"; payload:string}
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FULL_NAME":
      return { ...state, fullName: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
      case "SET_SIGNUP":
      return { ...state, signup: action.payload };
      case "SET_DEPT":
        return { ...state, dept: action.payload };
      case "SET_NUMBER":
        return { ...state, number: action.payload };
        case "SET_CLUBEMAIL":
          return { ...state, clubemail: action.payload };
          case "SET_CLUBNAME":
        return { ...state, clubname: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    default:
      return state;
  }
};
const phoneNumberRegex = /^[6-9][0-9]{9}$/;
const SignUpScreen = () => {
  const [state, dispatch] = useReducer(reducer, {
    fullName: "",
    email: "",
    number: "",
    signup:"",
    dept:"",
    clubemail:"",
    clubname:"",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  navigation.setOptions({
    headerTitle: "",
  });

  const validateInputs = () => {
    const { fullName, email,number,signup, password, confirmPassword, clubemail,clubname,dept } = state;
    
   

    if (!fullName || !number || !signup || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return false;
    }
    if (!phoneNumberRegex.test(number)) {
      Toast.show({
        type: "info",
        text1: "Phone number is invalid.",
       
        visibilityTime: 2000,
      });
      return;
    }

    // Conditional validation based on signup type
    if (signup === 'Club') {
      if (!clubname || !clubemail) {
        Toast.show({
          type: "info",
          text1: "Club name and supervisor email are required.",
         
          visibilityTime: 2000,
        });
        return;
      }
    } else if (signup === 'Department') {
      if (!dept) {
        Toast.show({
          type: "info",
          text1: "Department name is required.",
         
          visibilityTime: 2000,
        });
        return;
      }
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return false;
    }

  
    return true;
  };

  const CreateNewUser = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/client/register`,
        {
          name: state.fullName,
          id: state.email,
          password: state.password,
          phone_number: state.number,
          club:state.clubname,
          club_email:state.clubemail,
          department:state.dept
        }
      );

      if (response.status === 201) {
        Toast.show({
          type: "info",
          text1: "Success",
          text2: "Please check your email to verify your account.",
          visibilityTime: 2000,
        });
        router.back(); // Navigate back to the previous screen
      } else {
        Alert.alert("Error", "Failed to create user.");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Invalid information or user already registered",
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollView}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === "ios"} // Adjust scroll behavior for iOS
      extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
        >
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/sigmalogowithpsglogo-.png")}
        style={styles.logo}
      />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Create Account</Text>
      </View>
      <Text style={styles.ti}>
        Enter your full name as per college ID Card
      </Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="account-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={state.fullName}
          onChangeText={(text) =>
            dispatch({ type: "SET_FULL_NAME", payload: text })
          }
        />
      </View>
      <Text style={styles.ti}>
        Enter your college ID, like "21Z202", or for staff, it is the email
        prefix name - like "xyz.eee"
      </Text>
      <View style={styles.inputContainer}>
        <AntDesign name="user" size={17} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="ID"
          placeholderTextColor="#999"
          value={state.email}
          onChangeText={(text) =>
            dispatch({ type: "SET_EMAIL", payload: text })
          }
        />
      </View>
      <Text style={styles.ti}>
        Enter your phone number
      </Text>
      <View style={styles.inputContainer}>
      <AntDesign name="phone" size={17} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#999"
          value={state.number}
          onChangeText={(text) =>
            dispatch({ type: "SET_NUMBER", payload: text })
          }
        />
      </View>
      <Text style={styles.ti}>Sign up on behalf of</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                data={[
                  
                  
                  "Department",
                  "Club",
                ]}
                setSelected={(value: string) =>
                  dispatch({ type: "SET_SIGNUP", payload: value })
                }
                search={false}
                save="value"
                boxStyles={{
                  borderColor: "#BCBCBC", // Change the border color of the dropdown box
                  borderWidth: 1, 
                  borderRadius: 8,
                  backgroundColor: "#f9f9f9", // Background color of the dropdown
                  paddingVertical: 10, // Adjust padding for dropdown box
                }}
                inputStyles={{
                  color: "#555", // Change the text color of the input
                  fontSize: 14, // Adjust font size of the input text
                }}
                dropdownStyles={{
                  backgroundColor: "#fff", 
                  borderColor: "#BCBCBC", // Border color for dropdown list
                  borderWidth: 1,
                }}
                dropdownTextStyles={{
                  color: "#555", // Change the text color of the dropdown items
                  fontSize: 12, // Adjust font size for dropdown items
                }}
              />
            </View>
            {state.signup === "Department" && (
              <>
              <Text style={styles.ti}>Department Name</Text>
            <View style={styles.dropdownWrapper}>
              <SelectList
                data={[
                  "Apparel & Fashion Design",
        "Applied Mathematics & Computational Sciences",
        "Applied Science",
        "Automobile Engineering",
        "Biotechnology",
        "Biomedical Engineering",
        "Chemistry",
        "Civil Engineering",
        "Computer Science & Engineering",
        "Electronics & Communication Engineering",
        "Electrical & Electronics Engineering",
        "English",
        "Fashion Technology",
        "Humanities",
        "Instrumentation & Control Systems Engineering",
        "Information Technology",
        "Mathematics",
        "Computer Applications",
        "Mechanical Engineering",
        "Metallurgical Engineering",
        "Physics",
        "Production Engineering",
        "Robotics & Automation Engineering",
        "Textile Technology"
                ]}
                setSelected={(value: string) =>
                  dispatch({ type: "SET_DEPT", payload: value })
                }
                search={false}
                save="value"
                boxStyles={{
                  borderColor: "#BCBCBC", // Change the border color of the dropdown box
                  borderWidth: 1, 
                  borderRadius: 8,
                  backgroundColor: "#f9f9f9", // Background color of the dropdown
                  paddingVertical: 10, // Adjust padding for dropdown box
                }}
                inputStyles={{
                  color: "#555", // Change the text color of the input
                  fontSize: 14, // Adjust font size of the input text
                }}
                dropdownStyles={{
                  backgroundColor: "#fff", 
                  borderColor: "#BCBCBC", // Border color for dropdown list
                  borderWidth: 1,
                }}
                dropdownTextStyles={{
                  color: "#555", // Change the text color of the dropdown items
                  fontSize: 12, // Adjust font size for dropdown items
                }}
              />
            </View>
              </>
            )}
        {state.signup === 'Club' && (
          <>
           <Text style={styles.ti}>
        Enter Club Name
      </Text>
      <View style={styles.inputContainer}>
      <AntDesign name="book" size={17} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Club Name"
          placeholderTextColor="#999"
        
          value={state.clubname}
          onChangeText={(text) =>
            dispatch({ type: "SET_CLUBNAME", payload: text })
          }
        />
      </View>
      <Text style={styles.ti}>
        Enter Club Supervisor Email
      </Text>
      <View style={styles.inputContainer}>
        <Fontisto name="email" size={17} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Supervisor Email"
          placeholderTextColor="#999"
      
          value={state.clubemail}
          onChangeText={(text) =>
            dispatch({ type: "SET_CLUBEMAIL", payload: text })
          }
        />
      </View>
          </>
        )}
        <Text style={styles.ti}>
        Enter a strong password you will always remember. It is suggested to be
        a combination of capital letters, small letters, and numbers.
      </Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={state.password}
          onChangeText={(text) =>
            dispatch({ type: "SET_PASSWORD", payload: text })
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#999" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={state.confirmPassword}
          onChangeText={(text) =>
            dispatch({ type: "SET_CONFIRM_PASSWORD", payload: text })
          }
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={CreateNewUser}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "SIGNING UP..." : "SIGN UP"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.signInContainer}
      >
        <Text style={styles.signUpText}>
          Already have an account? <Text style={styles.signUpLink}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 15,
    backgroundColor: "#fff",
  },
  titleContainer: {
    padding: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  ti:{
    fontSize: 11,
    width: "100%",
    textAlign: "left",
    color:'#333333',
    marginTop:'-4%',
    marginLeft:'4%'
  },
  
  scrollView: {
    flexGrow: 1,
    padding: "2%",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    fontVariant: ["small-caps"],
    marginLeft: "-30%",
    marginBottom: 20,
  },
  dropdownWrapper: {
    width: "100%",
    marginBottom: "4%",
  },
  
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#ddd",
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#8283e9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "40%",
    marginRight: "-60%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signInContainer: {
    position: "absolute",
    bottom: 0,
    marginBottom: "2%",
  },
  signUpText: {
    marginTop:'-1%',
    fontSize: 14,
    color: "#999",
  },
  signUpLink: {
    color: "#8283e9",
  },
  logo: {
    width: 200, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    marginBottom: "-20%",
    marginTop: Platform.OS === "ios" ? "-50%" : "-25%"
  },
});

export default SignUpScreen;
