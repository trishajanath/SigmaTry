import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { Appbar, Text } from "react-native-paper";
import { QrCodeIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

const index = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  return (
    <>
      <View
        style={{
          height: "8%",
          backgroundColor: "white",
          marginTop: "12%",
          padding: "5%",
          paddingLeft: "7%",
          flexDirection: "row",
        }}
      >
        <Text
          variant="headlineSmall"
          style={{
            fontWeight: "bold",
            fontFamily: "SpaceMono",
            shadowColor: "black",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          S I G M A
        </Text>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: "5%",
            top: "30%",
          }}
        >
          <QrCodeIcon
            size={30}
            color="black"
            style={{
              marginTop: "25%",
            }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default index;

const styles = StyleSheet.create({});
