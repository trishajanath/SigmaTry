import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';

const _layout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
      <Toast />
    </>
  );
};

export default _layout;

const styles = StyleSheet.create({});
