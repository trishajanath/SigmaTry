import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useReducer } from "react";
import { Button, TextInput } from "react-native-paper";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");

const initialState = {
  collegeId: "",
  password: "",
  loading: false,
  error: "",
};

interface Action {
  type: string;
  payload: string;
}

interface State {
  collegeId: string;
  password: string;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "collegeId":
      return { ...state, collegeId: action.payload };
    case "password":
      return { ...state, password: action.payload };
    case "loading":
      return { ...state, loading: true };
    case "error":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const Signup = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <View style={styles.container}>
      <TextInput
        label={"College ID"}
        style={styles.input}
        value={state.collegeId}
        mode="outlined"
        onChangeText={(text) => {
          dispatch({ type: "collegeId", payload: text });
        }}
      />
      <TextInput
        label={"Password"}
        style={styles.input}
        mode="outlined"
        secureTextEntry
        value={state.password}
        onChangeText={(text) => {
          dispatch({ type: "password", payload: text });
        }}
      />
      <Text style={styles.forgotPassword}>Forgot password?</Text>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.replace("Home")}
      >
        Signup
      </Button>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  input: {
    width: "100%",
    marginBottom: height * 0.02,
    borderRadius: 10,
  },
  forgotPassword: {
    alignSelf: "center",
    textDecorationLine: "underline",
    color: "blue",
    marginTop: height * 0.02,
  },
  button: {
    width: "100%",
    marginTop: height * 0.02,
    borderRadius: 10,
  },
});
