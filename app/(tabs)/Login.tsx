import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, TextInput } from "react-native-paper";

const Login = () => {
  return (
    <View
      style={{
        flex: 1,
        padding: "10%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      <TextInput
        label={"College id"}
        style={{
          width: "100%",
          marginBottom: "5%",
          borderRadius: 10,
        }}
        mode="outlined"
      />
      <TextInput
        label={"College id"}
        style={{
          width: "100%",
          marginBottom: "5%",
          borderRadius: 10,
          marginTop: "5%",
        }}
        mode="outlined"
      />
      <Text
        style={{
          alignSelf: "center",
          textDecorationLine: "underline",
          color: "blue",
          marginTop: "5%",
        }}
      >
        Forgot password?
      </Text>
      <Button
        mode="contained"
        style={{
          width: "100%",
          marginTop: "5%",
          borderRadius: 10,
        }}
      >
        Login
      </Button>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
