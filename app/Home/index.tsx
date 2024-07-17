import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text as RNText,
  Dimensions,
} from "react-native";
import { Appbar, Text, Searchbar, Button } from "react-native-paper";
import { FontAwesome6, FontAwesome5, Foundation } from "@expo/vector-icons";
import {
  QrCodeIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get("window");
const Index = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const ovalContainers = [
    {
      id: 1,
      icon: <BookOpenIcon size={30} color="grey" style={{ padding: 20 }} />,
      text: "Classroom",
    },
    {
      id: 2,
      icon: <FontAwesome5 name="restroom" size={24} color="black" />,
      text: "Restroom",
    },
    {
      id: 3,
      icon: (
        <BuildingOffice2Icon size={30} color="grey" style={{ padding: 20 }} />
      ),
      text: "Department",
    },
    {
      id: 4,
      icon: <FontAwesome6 name="glass-water-droplet" size={24} color="black" />,
      text: "Water Dispenser",
    },
    {
      id: 5,
      icon: <Foundation name="elevator" size={24} color="black" />,
      text: "Lift",
    },
    {
      id: 6,
      icon: (
        <WrenchScrewdriverIcon size={30} color="grey" style={{ padding: 20 }} />
      ),
      text: "Miscellaneous",
    },
  ];

  const rectangularContainers = [
    { id: 1, text: "Rectangular Container 1", color: "#f5cdde" },
    { id: 2, text: "Rectangular Container 2", color: "#cce1f2" },
    { id: 3, icon: "", text: "Rectangular Container 3", color: "#c6f8e5" },
  ];

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
            shadowColor: "",
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
      <ScrollView style={{ marginTop: "1%", paddingHorizontal: 10 }}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={{
            backgroundColor: "white",
            marginTop: "5%",
            marginHorizontal: "3%",
          }}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: "1%", paddingHorizontal: 7.5 }}
          contentContainerStyle={{ paddingRight: width * 0.3 }}
        >
          {ovalContainers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                backgroundColor: "white",
                borderRadius: 50,
                width: width * 0.4,
                height: width * 0.4,
                marginTop: "1%",
                marginHorizontal: "1%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <RNText style={{ fontSize: 18 }}>{item.icon}</RNText>
              <RNText>{item.text}</RNText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {rectangularContainers.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: item.color,
              borderRadius: 10,
              padding: "10%",
              marginTop: "5%",
              marginVertical: "2%",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <RNText style={{ fontSize: 18 }}>{item.text}</RNText>
              <RNText>{item.icon}</RNText>
            </View>
            <Button
              style={{ marginTop: 10, alignSelf: "flex-start" }}
              labelStyle={{ color: "white" }}
              compact
            >
              Button {item.id}
            </Button>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default Index;

const styles = StyleSheet.create({});
