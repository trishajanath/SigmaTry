import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text as RNText,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Appbar, Text, Searchbar, Button } from "react-native-paper";
import { FontAwesome6, FontAwesome5, Foundation } from "@expo/vector-icons";
import {
  QrCodeIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  Squares2X2Icon,
  UserCircleIcon,
  AdjustmentsHorizontalIcon
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

  const onChangeSearch = (query:string) => setSearchQuery(query);

  const ovalContainers = [
    {
      id: 1,
      icon: (
        <Squares2X2Icon
          size={30}
          color="grey"
          style={{ padding: 20 }}
          onPress={() => router.push("/Home/classroom1")}
        />
      ),
    },
    {
      id: 2,
      icon: (
        <BookOpenIcon
          size={30}
          color="grey"
          style={{ padding: 20 }}
          onPress={() => router.push("/Home/classroom1")}
        />
      ),
    },
    {
      id: 3,
      icon: (
        <FontAwesome5
          name="restroom"
          size={30}
          color="black"
          onPress={() => router.push("/Home/restroom")}
        />
      ),
    },
    {
      id: 4,
      icon: (
        <BuildingOffice2Icon size={30} color="grey" style={{ padding: 20 }} />
      ),
    },
    {
      id: 5,
      icon: <FontAwesome6 name="glass-water-droplet" size={30} color="black" />,
    },
    {
      id: 6,
      icon: <Foundation name="elevator" size={30} color="black" />,
    },
    {
      id: 7,
      icon: (
        <WrenchScrewdriverIcon size={30} color="grey" style={{ padding: 20 }} />
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
          backgroundColor: "#eeecef",
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
          sigma
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: "3%",
            marginTop:'5%'
          }}
        >
          <Searchbar
            placeholder="Search for anything"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{
              backgroundColor: "#e6e6e4",
              flex: 1,
              marginRight: 10,
            }}
          />
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
            <AdjustmentsHorizontalIcon size={20} color="black" />
            
            
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
            <UserCircleIcon size={20} color="black" />
            
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
                borderRadius: 40,
                width: width * 0.21,
                height: width * 0.27,
                marginTop: "1%",
                marginHorizontal: "2%",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
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

const styles = StyleSheet.create({
  boldText: {
    marginTop: "5%",
    marginLeft: "5%",
    fontSize: 16,
    fontWeight: "bold",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
