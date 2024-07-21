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

  const truncateText = (text: string, length: number): string => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const constantContainer = {
    id: 1,
    icon: <Ionicons name="qr-code-outline" size={23} color="#555555" />,
    title: "Scan",
  };

  const ovalContainers = [
    {
      id: 2,
      icon: <Feather name="book-open" size={23} color="#555555" />,
      title: "Classroom",
      onPress: "/Home/classroom1",
    },
    {
      id: 3,
      icon: <FontAwesome5 name="restroom" size={23} color="#555555" />,
      onPress: "/Home/restroom",
      title: "Toilet",
    },
    {
      id: 4,
      icon: (
        <MaterialCommunityIcons
          name="office-building-outline"
          size={23}
          color="#555555"
        />
      ),
      onPress: "/Home/Department",
      title: "Department",
    },
    {
      id: 5,
      icon: (
        <FontAwesome6 name="glass-water-droplet" size={23} color="#555555" />
      ),
      onPress: "/Home/Water",
      title: "Water",
    },
    {
      id: 6,
      icon: <Foundation name="elevator" size={23} color="#555555" />,
      onPress: "/Home/Elevator",
      title: "Elevator",
    },
    {
      id: 7,
      icon: (
        <FontAwesome6 name="screwdriver-wrench" size={23} color="#555555" />
      ),
      onPress: "/Home/Maintenance",
      title: "Miscellaneous",
    },
  ];

  const rectangularContainers = [
    {
      id: 1,
      issueType: "Feedback",
      action: "Opened",
      color: "#e7bceb",
      date: "21-07-2024",
    },
    {
      id: 2,
      issueType: "Feedback",
      action: "Closed",
      color: "#bbbef3",
      date: "22-07-2024",
    },
    {
      id: 3,
      issueType: "Complaint",
      action: "Closed",
      color: "#a3c3e7",
      date: "23-07-2024",
    },
    {
      id: 4,
      issueType: "Complaint",
      action: "Closed",
      color: "#e7bcec",
      date: "23-07-2024",
    },
  ];

  return (
    <>
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.headerText}>
          sigma
        </Text>
        <Text style={styles.headerSubText}>
          {truncateText("22Z334-Kavvya Subramani", 18)}
        </Text>
        <TouchableOpacity style={styles.headerIconContainer}></TouchableOpacity>
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
            <Feather
              name="power"
              size={16}
              color="#555555"
              onPress={() =>
                router.replace({
                  pathname: "/(tabs)",
                })
              }
            />
          </View>
        </View>
        <RNText style={styles.boldText}>Write a Complaint</RNText>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: "2%",
            paddingHorizontal: 7.5,
          }}
        >
          <TouchableOpacity style={styles.iconContainer}>
            {constantContainer.icon}
            <RNText style={styles.iconText}>
              {truncateText(constantContainer.title, 5)}
            </RNText>
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: width * 0.12 }}
          >
            {ovalContainers.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.iconContainer}
                onPress={() => router.push(item.onPress ? item.onPress : "/")}
              >
                {item.icon}
                <RNText style={styles.iconText}>
                  {truncateText(item.title, 5)}
                </RNText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <RNText style={styles.boldText}>My Complaints</RNText>
        {rectangularContainers.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: item.color,
              borderRadius: 12,
              width: width * 0.89,
              height: width * 0.32,
              padding: "5%",
              marginLeft: "3%",
              marginTop: "5%",
              marginRight: "5%",
              marginVertical: "0%",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <View style={styles.complaintContainer}>
              <View style={styles.complaintHeader}>
                <RNText style={styles.issueTypeText}>{item.issueType}</RNText>
                <RNText style={styles.dateText}>{item.date}</RNText>
              </View>
              <View style={styles.complaintBody}>
                <RNText style={styles.actionText}>{item.action}</RNText>
                <Button
                  style={styles.viewMoreButton}
                  labelStyle={{ color: "white", fontSize: 11 }}
                  compact
                >
                  View More
                </Button>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default Index;

const styles = StyleSheet.create({
  headerContainer: {
    height: "8%",
    backgroundColor: "#f2f2f2",
    marginTop: "12%",
    padding: "3%",
    paddingLeft: "7%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    color: "#444444",
    flex: 1,
  },
  headerSubText: {
    color: "#555555",
    marginLeft: 10,
    fontSize: 14,
    flex: 2,
    textAlign: "right",
  },
  headerIconContainer: {
    position: "absolute",
    right: "5%",
    top: "30%",
  },
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
    fontSize: 11,
  },
  iconText: {
    fontSize: 10,
    marginTop: "9%",
    textAlign: "center",
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: 35,
    width: width * 0.16,
    height: width * 0.22,
    marginTop: "1%",
    marginBottom: "0%",
    marginHorizontal: "1%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  dateText: {
    fontSize: 12,
    color: "#444444",
  },
  issueTypeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  actionText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  viewMoreButton: {
    alignSelf: "flex-end",
    backgroundColor: "#8283e9",
    paddingHorizontal: "0%",
    paddingVertical: "0%",
    width: width * 0.19,
    height: width * 0.09,
    borderRadius: 20,
    marginTop: 0,
  },
  complaintContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  complaintHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  complaintBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 10,
  },
});
