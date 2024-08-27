import React, { useEffect, useReducer, useState,Suspense } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { AntDesign,MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { Image } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/Hooks/userContext";
import * as jwt from "jwt-decode";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from 'react-native-toast-message';



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
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
  const navigation = useNavigation();
  const { updateUser } = useUser();

  const Login = async () => {
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
        "https://api.gms.intellx.in/client/login",
        body
      );
      // console.log(response.data);
      await AsyncStorage.setItem("token", response.data.token);
      updateUser({
        name: response.data.user.name,
        id: response.data.user.id,
        confirmed: true,
      });
      setIsLoggedIn(true);
    } catch (error: any) {
      // Alert.alert("Error", error.response.data.message);
      // console.error(error.response);
      Toast.show({
        type:"error",
        text1:"Invalid Credentials",
        text2:"Please enter valid register number and password",
        visibilityTime:2000,
        
      })
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const decode = jwt.jwtDecode(token ? token : "");
      const body = {
        id: decode.sub,
      };
      const response = await axios.post(
        "https://api.gms.intellx.in/client/account",
        body
      );
      updateUser({
        name: response.data.user.name,
        id: response.data.user.id,
        confirmed: true,
      });
      router.replace("/Home");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);
  console.log(state.email);
    const resetPassword = async () => {
        if(state.email === ""){
          Toast.show({
            type:"error",
            text1:"Please Enter you Roll No",
            visibilityTime:2000,
            
          })
        }
        else 
        {
          try{
            const body = {
              id: state.email,
            };
            const response = await axios.post(
              "https://api.gms.intellx.in/client/forgot_password",
              body
            );
            console.log(response.data);
            Toast.show({
              type:"success",
              text1:"Reset link sent to your registered email",
              visibilityTime:3000,
              
            })
          }catch(error){  
            console.log(error);
        }
        }
      
  }
  return (
    <>
    {!isLoggedIn ? ( 
      <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView}
      enableOnAndroid={true}
      extraHeight={100}
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
        <Text style={styles.ti}>Enter your college ID, like "21z202", or for staff, it is the e-mail prefix name - like "xyz.eee"</Text>
        <View
          style={[
            styles.inputContainer,
            isEmailFocused && styles.inputContainerFocused,
          ]}
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
        <Text style={styles.ti}>If you forgot your password, click "Forgot Password".</Text>
        <View
          style={[
            styles.inputContainer,
            isPasswordFocused && styles.inputContainerFocused,
          ]}
        >
          <MaterialCommunityIcons name="lock-outline" size={20} color="#999" />
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

        <TouchableOpacity style={{ alignItems: "flex-start", alignSelf: "flex-start" }} onPress={()=>
          {
            resetPassword();
          }
        }>
  <Text style={{ textAlign: "left" , marginLeft : 15}}>Forgot Password</Text>
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
          If you do not have an account with SIGMA GMS yet, click on "Sign Up" to create one.{" "}
            <Text style={styles.signUpLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
    ) : (
      <HomeScreenLoader />

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
  ti:{
    fontSize: 11,
    width: "100%",
    textAlign: "left",
    color:'#333333',
    marginLeft:'6%'
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
    fontSize:14
  },
});

export default LoginScreen;
