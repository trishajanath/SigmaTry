import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text as RNText,
  Dimensions,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Appbar, Text, Button } from "react-native-paper";
import {
  FontAwesome6,
  FontAwesome5,
  Foundation,
  Feather,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
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
      icon: <Ionicons name="qr-code-outline" size={22} color="#555555" />,
    },
    {
      id: 2,
      icon: (
        <Feather
          name="book-open"
          size={25}
          color="#555555"
          style={{ padding: 20 }}
        />
      ),
      onPress: "/Home/classroom1",
    },
    {
      id: 3,
      icon: <FontAwesome5 name="restroom" size={20} color="#555555" />,
      onPress: "/Home/restroom",
    },
    {
      id: 4,
      icon: (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={28}
          color="#555555"
        />
      ),
    },
    {
      id: 5,
      icon: (
        <FontAwesome6 name="glass-water-droplet" size={20} color="#555555" />
      ),
    },
    {
      id: 6,
      icon: <Foundation name="elevator" size={30} color="#555555" />,
    },
    {
      id: 7,
      icon: (
        <FontAwesome6 name="screwdriver-wrench" size={20} color="#555555" s />
      ),
    },
  ];

  const rectangularContainers = [
    { id: 1, text: "Rectangular Container 1", color: "#e7bceb" },
    { id: 2, text: "Rectangular Container 2", color: "#bbbef3" },
    { id: 3, icon: "", text: "Rectangular Container 3", color: "#a2d9da" },
  ];

  return (
    <>
      <View
        style={{
          height: "8%",
          backgroundColor: "#f2f2f2",
          marginTop: "12%",
          padding: "3%",
          paddingLeft: "7%",
          flexDirection: "row",
        }}
      >
        <Text
          variant="headlineSmall"
          style={{
            fontWeight: "bold",
            fontFamily: "",
          }}
        >
          sigma
        </Text>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: "5%",
            top: "30%",
          }}
        ></TouchableOpacity>
      </View>
      <ScrollView style={{ marginTop: "1%", paddingHorizontal: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: "3%",
            marginTop: "0%",
          }}
        >
          <View style={styles.searchContainer}>
            <MaterialIcons
              name="search"
              size={20}
              color="#555555"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search for complaints"
              onChangeText={onChangeSearch}
              value={searchQuery}
              placeholderTextColor="#555555"
              style={styles.searchInput}
            />
          </View>
          <View
            style={[
              styles.circle,
              {
                backgroundColor: "#e6e6e4",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <AdjustmentsHorizontalIcon size={20} color="#555555" />
          </View>
          <View
            style={[
              styles.circle,
              {
                backgroundColor: "#e6e6e4",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 10,
              },
            ]}
          >
            <UserCircleIcon
              size={20}
              color="#555555"
              onPress={() => router.push("/Home/profile")}
            />
          </View>
        </View>
        <RNText style={styles.boldText}>Write a Complaint</RNText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: "2%", paddingHorizontal: 7.5 }}
          contentContainerStyle={{ paddingRight: width * 0.3 }}
        >
          {ovalContainers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                backgroundColor: "white",
                borderRadius: 35,
                width: width * 0.16,
                height: width * 0.2,
                marginTop: "1%",
                marginHorizontal: "1%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
              onPress={() => router.push(item.onPress ? item.onPress : "/")}
            >
              <RNText style={{ fontSize: 18 }}>{item.icon}</RNText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <RNText style={styles.boldText}>My Complaints</RNText>
        {rectangularContainers.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: item.color,
              borderRadius: 10,
              height: width * 0.3,
              padding: "10%",
              marginLeft: "5%",
              marginTop: "5%",
              marginRight: "5%",
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
              style={{ marginTop: "2%", alignSelf: "flex-start" }}
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

const styles = StyleSheet.create({
  boldText: {
    marginTop: "5%",
    marginLeft: "5%",
    fontSize: 16,
    fontWeight: "bold",
  },
  circle: {
    width: 40,
    height: 43,
    borderRadius: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e4",
    borderRadius: 30,
    marginRight: "3%",
    flex: 1,
  },
  searchIcon: {
    marginLeft: "7%",
  },
  searchInput: {
    flex: 1,
    height: width * 0.11,
    textAlign: "left",
    color: "#333333",
    marginLeft: "5%",
  },
});
