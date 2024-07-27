import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text as RNText,
  Dimensions,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Text, Button, Menu, Divider, Provider } from "react-native-paper";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useUser } from "@/Hooks/userContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

interface Issue {
  category: string;
  code: string;
  desc: string;
  status: string;
}

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
    icon: <FontAwesome6 name="glass-water-droplet" size={23} color="#555555" />,
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
    icon: <FontAwesome6 name="screwdriver-wrench" size={23} color="#555555" />,
    onPress: "/Home/Maintenance",
    title: "Miscellaneous",
  },
];

const Index = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [sortOption, setSortOption] = useState<"status" | "date">("status");
  const [filterOption, setFilterOption] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const user = useUser();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      FetchAllIssues();
    }, [])
  );

  useEffect(() => {
    applyFilters();
  }, [issues, searchQuery, sortOption, filterOption]);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const truncateText = (text: string, length: number): string => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const FetchAllIssues = async () => {
    try {
      const body = {
        user_id: user.id,
      };
      const response = await axios.post(
        "https://api.gms.intellx.in/client/issue/status",
        body
      );
      setIssues(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilters = () => {
    let updatedIssues = [...issues];

    // Filter issues
    if (filterOption) {
      updatedIssues = updatedIssues.filter(
        (issue) => issue.status === filterOption
      );
    }

    // Search issues
    if (searchQuery) {
      updatedIssues = updatedIssues.filter((issue) =>
        issue.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort issues
    if (sortOption === "status") {
      updatedIssues.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortOption === "date") {
      updatedIssues.sort(
        (a, b) => new Date(b.code).getTime() - new Date(a.code).getTime()
      );
    }

    setFilteredIssues(updatedIssues);
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/(tabs)");
    } catch (error) {}
  };

  const getCardColor = (action: string) => {
    switch (action) {
      case "OPEN":
        return "#e7bcec";
      case "CLOSE":
        return "#bbbef3";
      case "Pending":
        return "#a3c3e7";
      default:
        return "#ffffff";
    }
  };

  const renderComplaintItem = ({ item }: { item: (typeof issues)[0] }) => (
    <View
      key={item.code}
      style={{
        backgroundColor: getCardColor(item.status),
        borderRadius: 12,
        width: width * 0.89,
        padding: "3%", // Adjusted padding inside container
        marginLeft: "3%",
        marginTop: "4%",
        marginRight: "5%",
        marginVertical: "0%",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <View style={styles.complaintContainer}>
        <View style={styles.complaintHeader}>
          <RNText style={styles.issueTypeText}>{item.category}</RNText>
          <RNText style={styles.dateText}>{item.code}</RNText>
        </View>
        <View style={styles.complaintBody}>
          <RNText style={styles.categoryText}> {item.desc}</RNText>
          <RNText style={styles.statusText}> {item.status}</RNText>
        </View>
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => {
            router.push({
              pathname: "/Home/readMore",
              params: {
                id: item.code,
              },
            });
          }}
        >
          <Text style={styles.readMoreButtonText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Provider>
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.headerText}>
          sigma
        </Text>
        <Text style={styles.headerSubText}>
          {truncateText(`${user.id}-${user.name}`, 18)}
        </Text>
        <TouchableOpacity style={styles.headerIconContainer}></TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContentContainer}
      >
        <View style={styles.searchAndSortContainer}>
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
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={styles.iconButtonContainer1}
              >
                <AdjustmentsHorizontalIcon size={20} color="#555555" />
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                setSortOption("status");
                setMenuVisible(false);
              }}
              title="Sort by Status"
            />
            <Menu.Item
              onPress={() => {
                setSortOption("date");
                setMenuVisible(false);
              }}
              title="Sort by Date"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                setFilterOption(null);
                setMenuVisible(false);
              }}
              title="All"
            />
            <Menu.Item
              onPress={() => {
                setFilterOption("OPEN");
                setMenuVisible(false);
              }}
              title="Open"
            />
            <Menu.Item
              onPress={() => {
                setFilterOption("CLOSE");
                setMenuVisible(false);
              }}
              title="Close"
            />
            <Menu.Item
              onPress={() => {
                setFilterOption("Pending");
                setMenuVisible(false);
              }}
              title="Pending"
            />
          </Menu>
          <TouchableOpacity
            style={styles.iconButtonContainer}
            onPress={() => {
              Alert.alert("Logout", "Are you sure you want to logout?", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: () => logout() },
              ]);
            }}
          >
            <Feather name="power" size={16} color="#555555" />
          </TouchableOpacity>
        </View>

        <RNText style={styles.boldText}>Write a Complaint</RNText>
        <View style={styles.iconWrapper}>
          <TouchableOpacity style={styles.iconContainer}>
            {constantContainer.icon}
            <RNText style={styles.iconText}>
              {truncateText(constantContainer.title, 5)}
            </RNText>
          </TouchableOpacity>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
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
        <FlatList
          data={filteredIssues}
          renderItem={renderComplaintItem}
          keyExtractor={(item) => item.code}
        />
      </ScrollView>
    </Provider>
  );
};

export default Index;

const styles = StyleSheet.create({
  scrollView: {
    marginTop: "1%",
    paddingHorizontal: 10,
  },
  scrollViewContentContainer: {
    paddingBottom: 20,
  },
  searchAndSortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "3%",
    marginTop: "0%",
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
  button: {
    backgroundColor: "#8283e9",
    paddingVertical: 12,
    paddingHorizontal: "2%",
    borderRadius: 25,
    width: "25%",
    height: width * 0.09,
    marginRight: "-45%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  iconButtonContainer: {
    backgroundColor: "#e6e6e4",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "11%",
    height: 43,
    marginLeft: "2%",
  },
  iconButtonContainer1: {
    backgroundColor: "#e6e6e4",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "120%",
    height: 43,
    marginLeft: "2%",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "2%",
    paddingHorizontal: 7.5,
  },
  horizontalScrollContainer: {
    paddingRight: width * 0.12,
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
  complaintContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  complaintHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2%",
  },
  readMoreButton: {
    backgroundColor: "#8283e9",
    paddingVertical: 10, // Increase vertical padding
    paddingHorizontal: 10, // Increase horizontal padding
    borderRadius: 25,
    alignSelf: "flex-start",
    marginTop: "-1%", // Adjust margin if needed
  },
  readMoreButtonText: {
    color: "#fff",
    fontSize: 10, // Increase font size
    textAlign: "center",
  },
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
  dateText: {
    fontSize: 12,
    color: "#040200",
  },
  complaintBody: {
    flexDirection: "row", // Set to row to place items horizontally
    justifyContent: "space-between", // Distribute space between items
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    color: "#0d0907",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: "#0d0907",
    marginBottom: 0,
    textAlign: "right", 
    flex: 1, 
  },
  issueTypeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
