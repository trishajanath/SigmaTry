import React, { useEffect, useReducer, useState, Suspense } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Alert,
  Platform,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Image } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/Hooks/userContext";
import * as jwt from "jwt-decode";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import { BACKEND_URL } from "@/production.config";

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type State = {
  email: string;
  password: string;
};

type Action =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    default:
      return state;
  }
};
const LazyHomeScreen = React.lazy(() => import("../Home/index"));

const HomeScreenLoader = () => {
  return (
    <Suspense
      fallback={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="small" color="#a3c3e7" />
        </View>
      }
    >
      <LazyHomeScreen />
    </Suspense>
  );
};
const LoginScreen = () => {
  const [state, dispatch] = useReducer(reducer, { email: "", password: "" });
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { updateUser } = useUser();

  const Login = async () => {
    setIsLoading(true); // Set loading to true when login starts
    try {
      Toast.show({
        type: "info",
        text1: "Logging in...",
        visibilityTime: 1000,
      });
      const body = {
        id: state.email,
        password: state.password,
      };
      const response = await axios.post(
        `${BACKEND_URL}/client/login`,
        body
      );
      await AsyncStorage.setItem("token", response.data.token);
      updateUser({
        name: response.data.user.name,
        id: response.data.user.id,
        confirmed: true,
      });
      console.log("Logged in successfully");
      router.replace("/Home");
      setIsLoggedIn(true);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Invalid Credentials",
        text2: "Please enter valid register number and password",
        visibilityTime: 2000,
      });
      console.log("Error logging in", error);
      console.log(error.response);
    } finally {
      setIsLoading(false); // Set loading to false when login ends
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const checkToken = async () => {
    try {
      setIsLoading(true); // Set loading to true when checking token
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded: any = jwt.jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp > currentTime) {
          updateUser({
            name: decoded.sub?.name,
            id: decoded.sub?.id,
            confirmed: true,
          });
          router.replace("/Home");
        }
      }
    } catch (error) {
      console.error("Error validating token", error);
    } finally {
      setIsLoading(false); // Set loading to false when token check ends
    }
  };
  const checkServerStatus = async () => {
    try {
      const response = await axios.get(BACKEND_URL);
      if (response.status === 200) {
        console.log("Server is up and running");
        return true;
      }
    } catch (error) {
      console.log("Server is down");
      return false;
    }
  };

  const loadApplication = async () => {
    const serverStatus = await checkServerStatus();
    if (serverStatus) {
      await checkToken();
    } else {
      Alert.alert("Server is down", "Please try again later", [
        {
          text: "Retry",
          onPress: () => loadApplication(),
        },
        {
          text: "Exit",
          onPress: () => BackHandler.exitApp(),
        },
      ]);
    }
  };
  useEffect(() => {
    loadApplication();
    navigation.setOptions({ headerShown: false });
  }, [navigation]);


  const resetPassword = async () => {
    if (state.email === "") {
      Toast.show({
        type: "error",
        text1: "Please Enter your Roll No",
        visibilityTime: 2000,
      });
    } else {
      try {
        const body = {
          id: state.email,
        };
        const response = await axios.post(
          `${BACKEND_URL}/client/forgot_password`,
          body
        );
        Toast.show({
          type: "success",
          text1: "Reset link sent to your registered email",
          visibilityTime: 3000,
        });
      } catch (error) {
        console.log("Error resetting password", error);
        Toast.show({
          type: "error",
          text1: "Failed to reset password",
          visibilityTime: 3000,
        });
      }
    }
  };
  return (
    <>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8283e9" />
        </View>
      ) : (
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollView}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === "ios"} // Adjust scroll behavior for iOS
      extraScrollHeight={Platform.OS === "ios" ? 20 : 0}
        >
         
          <View style={styles.container}>
            <Image
              source={require("../../assets/images/sigmalogo.png")}
              style={styles.logo}
            />

            <View style={{ padding: 20 }}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Please sign in to continue.</Text>
            </View>
            <Text style={styles.ti}>
              Enter your college ID, like "21z202", or for staff, it is the
              e-mail prefix name - like "xyz.eee"
            </Text>

            <View
              style={styles.inputContainer} // Removed inputContainerFocused
            >
              <AntDesign name="user" size={20} color="#999" />
              <TextInput
                style={styles.input}
                placeholder="ID"
                placeholderTextColor="#999"
                value={state.email}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onChangeText={(text) =>
                  dispatch({ type: "SET_EMAIL", payload: text })
                }
              />
            </View>
            
            <View style={styles.inputContainer}> 
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={secureText}
                value={state.password}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onChangeText={(text) =>
                  dispatch({ type: "SET_PASSWORD", payload: text })
                }
              />
              <TouchableOpacity
                onPress={() => {
                  setSecureText(!secureText);
                }}
              >
                <MaterialCommunityIcons
                  name={secureText ? "eye" : "eye-off"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{ alignItems: "flex-start", alignSelf: "flex-start" }}
              onPress={() => {
                resetPassword();
              }}
            >
              <Text
                style={{ textAlign: "left", marginLeft: 15, color: "#121212" }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Login();
                // router.replace("/Home");
              }}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/Signup")}
              style={{
                position: "absolute",
                bottom: "4%",
              }}
            >
              <Text style={styles.signUpText}>
                If you do not have an account with SIGMA GMS yet, click on "Sign
                Up" to create one.{" "}
                <Text style={styles.signUpLink}>Sign up</Text>
              </Text>
              </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 15,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    marginBottom: "-20%",
    marginTop: "-50%", // Add some margin if needed
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    fontVariant: ["small-caps"],
    marginBottom: 5,
    marginLeft: "-40%",
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginBottom: 20,
    marginLeft: "-40%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    borderColor: "#dddddd",
    borderBottomWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inputContainerFocused: {
    elevation: 5,
    shadowColor: "#dddddd",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  ti: {
    fontSize: 11,
    width: "100%",
    textAlign: "left",
    color: "#333333",
    marginLeft: "6%",
  },
  scrollView: {
    flexGrow: 1,
    padding: "2%",
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: "#333",
    borderBlockColor: "#ddd",
  },
  forgotText: {
    color: "#ff9f00",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#8283e9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "40%",
    marginRight: "-55%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signUpText: {
    fontSize: 12,
    color: "#999",
  },
  signUpLink: {
    color: "#8283e9",
    fontSize: 14,
  },
});

export default LoginScreen;
