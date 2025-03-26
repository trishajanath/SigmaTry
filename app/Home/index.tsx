import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text as RNText,
  Dimensions,
  TextInput,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Text, Button, Menu, Divider, Provider } from "react-native-paper";
import {
  FontAwesome6,
  FontAwesome5,
  Foundation,
  Feather,
  Ionicons,
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import {
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
} from "react-native-heroicons/outline";
import {
  useNavigation,
  useFocusEffect,
  CommonActions,
} from "@react-navigation/native";
import { useUser } from "@/Hooks/userContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URL } from "@/production.config";
import Toast from "react-native-toast-message";
import { SelectList } from "@venedicto/react-native-dropdown";
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get("window");
const menuTheme = {
  colors: {
    surface: "#000000", // Menu background color (black)
    text: "#FFFFFF", // Menu text color (white)
  },
};
interface Issue {
  category: string;
  code: string;
  issueType: string;
  status: string;
  date: string;
}

const constantContainer = {
  id: 1,
  icon: <Ionicons name="qr-code-outline" size={23} color="#555555" />,
  title: "Scan",
  onPress: "/qrScanner",
};

const ovalContainers = [
  {
    id: 1,
    icon: <Ionicons name="qr-code-outline" size={23} color="#555555" />,
    title: "Scan",
    onPress: "/qrScanner",
  },
  {
    id: 2,
    icon: <Feather name="book-open" size={23} color="#555555" />,
    title: "Classroom",
    onPress: "/Home/classroom1",
    category: "student"
  },
  {
    id: 3,
    icon: <FontAwesome5 name="restroom" size={23} color="#555555" />,
    onPress: "/Home/restroom",
    title: "Restroom",
    category: "student"
  },
  {
    id: 4,
    icon: <MaterialCommunityIcons name="office-building-outline" size={23} color="#555555" />,
    title: "Department",
    onPress: "/Home/Department",
    category: "employee"
  },
  {
    id: 5,
    icon: <FontAwesome6 name="glass-water-droplet" size={23} color="#555555" />,
    onPress: "/Home/Water",
    title: "Water",
    category: "student"
  },
  {
    id: 6,
    icon: <Foundation name="elevator" size={23} color="#555555" />,
    onPress: "/Home/Elevator",
    title: "Lift",
    category: "student"
  },
  {
    id: 7,
    icon: <FontAwesome6 name="screwdriver-wrench" size={23} color="#555555" />,
    onPress: "/Home/Maintenance",
    title: "Maintenance",
    category: "student"
  },
  {
    id: 8,
    icon: <MaterialCommunityIcons name="store-search-outline" size={24} color="#555555" />,
    onPress: "/Home/lostAndFound",
    title: "Lost & Found",
    category: "student"
  },
  {
    id: 9,
    icon: <MaterialCommunityIcons name="printer" size={23} color="#555555" />,
    title: "Printer",
    onPress: "/Home/printer",
    category: "employee"
  },
  {
    id: 10,
    icon: <MaterialCommunityIcons name="air-conditioner" size={23} color="#555555" />,
    title: "AC",
    onPress: "/Home/ac",
    category: "employee"
  },
  {
    id: 11,
    icon: <MaterialCommunityIcons name="lightbulb-outline" size={23} color="#555555" />,
    title: "Electrical",
    onPress: "/Home/electrical",
    category: "employee"
  },
  {
    id: 12,
    icon: <Entypo name="home" size={23} color="#555555" />,
    title: "Hostel",
    onPress: "/Home/hostel",
    category: "employee"
  },
  {
    id: 13,
    icon: <MaterialCommunityIcons name="view-list" size={23} color="#555555" />,
    title: "View All",
    onPress: "/Home/viewMore",
    category: "all"
  }
];

const complaintCategories = [
  {
    key: "student",
    label: "Student Complaints",
    options: [
      { key: "classroom", label: "Classroom", route: "/Home/classroom1" },
      { key: "restroom", label: "Washroom", route: "/Home/restroom" },
      { key: "water", label: "Water Dispenser", route: "/Home/Water" },
      { key: "elevator", label: "Elevator", route: "/Home/Elevator" },
      { key: "maintenance", label: "Maintenance", route: "/Home/Maintenance" },
      { key: "lostAndFound", label: "Lost & Found", route: "/Home/lostAndFound" },
    ]
  },
  {
    key: "employee",
    label: "Employee Complaints",
    options: [
      { key: "department", label: "Department", route: "/Home/Department" },
      { key: "printer", label: "Printer", route: "/Home/printer" },
      { key: "ac", label: "AC", route: "/Home/ac" },
      { key: "electrical", label: "Electrical", route: "/Home/electrical" },
      { key: "hostel", label: "Hostel", route: "/Home/hostel" },
      { key: "laundry", label: "Laundry", route: "/Home/laundry" },
      { key: "mess", label: "Mess", route: "/Home/mess" },
      { key: "commonAreas", label: "Common Areas", route: "/Home/commonAreas" },
      { key: "newInstallation", label: "New Installation Request", route: "/Home/newInstallation" },
      { key: "other", label: "Other Issues", route: "/Home/other" },
    ]
  },
  {
    key: "hod",
    label: "HOD Accessible",
    options: [
      { key: "department", label: "Department", route: "/Home/Department" },
      { key: "academic", label: "Academic Issues", route: "/Home/academic" },
      { key: "faculty", label: "Faculty Related", route: "/Home/faculty" },
      { key: "curriculum", label: "Curriculum", route: "/Home/curriculum" },
      { key: "research", label: "Research", route: "/Home/research" },
    ]
  }
];

const Index = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [sortOption, setSortOption] = useState<"status" | "date">("status");
  const [filterOption, setFilterOption] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSubOptions, setShowSubOptions] = useState(false);

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
      setLoading(true);
      const body = {
        user_id: user.id,
      };
      const response = await axios.post(
        `${BACKEND_URL}/client/issue/status`,
        body
      );
      setIssues(response.data.data);
    } catch (error: any) {
      console.log(error);
      console.log("Error in FetchAllIssues");
      console.log(error.response);
      Toast.show({
        type: "error",
        text1: "Failed to fetch complaints",
        text2: "Please try again later",
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
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
        issue.category.toLowerCase().includes(searchQuery.toLowerCase())
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
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "(tabs)" }],
          
        })
        
      );
    
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  const statusCounts = {
    OPEN: 0,
    CLOSE: 0,
  };

  const finalCount = (action: string): number => {
    let count = 0;
    issues.forEach((item) => {
      if (item.status === action) {
        count++;
      }
    });
    return count;
  };

  const getCardColor = (action: any) => {
    console.log(action);
    if (action.issueType === "Feedback") {
      return "#bbbef3";
    } else {
      switch (action.status) {
        case "OPEN":
          return "#a3c3e7";
        case "CLOSE":
          return "#bbbef3";
        case "Pending":
          return "#e7bcec";
        default:
          return "#ffffff";
      }
    }
  };

  const renderComplaintItem = ({ item }: { item: (typeof issues)[0] }) => (
    <View
      key={item.code}
      style={{
        backgroundColor: getCardColor(item),
        borderRadius: 12,
        width: width * 0.89,
        padding: "3%",
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
          <RNText style={styles.issueTypeText}>
            {item.category == ""
              ? "MISCELLANEOUS"
              : item.issueType == "Feedback"
              ? "Feedback"
              : item.category}
          </RNText>
          {item.status == "CLOSE" || item.issueType === "Feedback" ? (
            <Feather name="check-circle" size={20} color="green" />
          ) : (
            <SimpleLineIcons name="close" size={20} color="red" />
          )}
        </View>
        <View style={styles.complaintBody}>
          <RNText style={styles.categoryText}>TYPE : {item.issueType}</RNText>
          <RNText style={styles.categoryText}> | ID : {item.code}</RNText>
          <RNText style={styles.categoryText}> | DATE : {item.date}</RNText>
        </View>
        <View style={styles.readMoreContainer}>
          <RNText style={styles.dateText}>
            {" "}
            {item.issueType === "Feedback"
              ? "Thank you for your feedback!"
              : item.status === "OPEN"
              ? "Yet to be fixed!"
              : item.status === "PENDING"
              ? "Final Stages of the Work!"
              : "Issue Solved Thank you!"}{" "}
          </RNText>

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
            <Text style={styles.readMoreButtonText}>View More</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/client/issue/report/${user.id}`
      );
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      Toast.show({
        type: "error",
        text1: "Failed to fetch complaints",
        text2: "Please try again later",
        visibilityTime: 2000,
      });
    }
  };

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setShowSubOptions(true);
  };

  const handleComplaintSelect = (value: string) => {
    const category = complaintCategories.find(cat => cat.key === selectedCategory);
    if (category) {
      const selectedOption = category.options.find(option => option.key === value);
      if (selectedOption) {
        router.push(selectedOption.route);
        setShowSubOptions(false);
        setSelectedCategory("");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFA500";
      case "in progress":
        return "#007AFF";
      case "resolved":
        return "#4CD964";
      default:
        return "#FF3B30";
    }
  };

  return (
    <Provider>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/images/sigmalogowithpsglogo-.png")}
          style={styles.logo}
        />

        <Text style={styles.headerSubText}>
          {truncateText(
            `${user.id?.toUpperCase() ?? ""}-${user.name ?? ""}`,
            35
          )}
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
            theme={menuTheme}
          >
            <Menu.Item
              onPress={() => {
                setSortOption("status");
                setMenuVisible(false);
              }}
              title={<Text style={{ color: "white" }}>Sort by Status</Text>}
            />
            <Menu.Item
              onPress={() => {
                setSortOption("date");
                setMenuVisible(false);
              }}
              title={<Text style={{ color: "white" }}>Sort by Date</Text>}
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                setFilterOption(null);
                setMenuVisible(false);
              }}
              title={<Text style={{ color: "white" }}>All</Text>}
            />
            <Menu.Item
              onPress={() => {
                setFilterOption("OPEN");
                setMenuVisible(false);
              }}
              title={<Text style={{ color: "white" }}>Opened</Text>}
            />
            <Menu.Item
              onPress={() => {
                setFilterOption("CLOSE");
                setMenuVisible(false);
              }}
              title={<Text style={{ color: "white" }}>Closed</Text>}
            />
          </Menu>
         


         {/* <TouchableOpacity onPress={() => logout() }> <Text> Logout</Text></TouchableOpacity> */}
         <TouchableOpacity
  style={styles.iconButtonContainer}
  onPress={() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: logout, // Pass the function reference directly
      },
    ]);
  }}
>
  <MaterialIcons name="logout" size={18} color="#555555" />
</TouchableOpacity>

        </View>

        <RNText style={styles.boldText}>Write a Complaint</RNText>
        <View style={styles.dropdownContainer}>
          <SelectList
            setSelected={handleCategorySelect}
            data={complaintCategories.map(category => ({
              key: category.key,
              value: category.label
            }))}
            search={true}
            placeholder="Select complaint category"
            searchPlaceholder="Search categories..."
            boxStyles={styles.dropdownBox}
            inputStyles={styles.dropdownInput}
            dropdownStyles={styles.dropdownList}
            dropdownTextStyles={styles.dropdownText}
            maxHeight={300}
            save="key"
            defaultOption={{ key: "", value: "Select a complaint category" }}
          />
          
          {showSubOptions && selectedCategory && (
            <View style={[styles.dropdownContainer, { marginTop: 10 }]}>
              <SelectList
                setSelected={handleComplaintSelect}
                data={complaintCategories
                  .find(cat => cat.key === selectedCategory)
                  ?.options.map(option => ({
                    key: option.key,
                    value: option.label
                  })) || []}
                search={true}
                placeholder="Select specific complaint"
                searchPlaceholder="Search complaints..."
                boxStyles={styles.dropdownBox}
                inputStyles={styles.dropdownInput}
                dropdownStyles={styles.dropdownList}
                dropdownTextStyles={styles.dropdownText}
                maxHeight={300}
                save="key"
                defaultOption={{ key: "", value: "Select a specific complaint" }}
              />
            </View>
          )}
        </View>

        <RNText style={styles.boldText}>My Complaints</RNText>
        <Text style={styles.headerSubTex}>
          {truncateText(
            `Pending:${finalCount("OPEN")} Closed:${finalCount("CLOSE")}`,
            30
          )}
        </Text>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <ActivityIndicator size="large" color="#8283e9" />
          </View>
        ) : issues.length === 0 ? (
          <RNText style={styles.boldText}>No Complaints</RNText>
        ) : (
          <FlatList
            data={filteredIssues.slice().reverse()} // Reverse the array for stack display
            renderItem={renderComplaintItem}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.verticalScrollView}
          />
        )}

        <View style={styles.iconWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {ovalContainers.map((container) => (
              <TouchableOpacity
                key={container.id}
                style={styles.iconContainer}
                onPress={() => {
                  router.push(container.onPress);
                }}
              >
                {container.icon}
                <RNText style={styles.iconText}>
                  {truncateText(container.title, 5)}
                </RNText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.complaintsSection}>
          <Text style={styles.sectionTitle}>Your Complaints</Text>
          {complaints.length === 0 ? (
            <Text style={styles.noComplaints}>No complaints submitted yet</Text>
          ) : (
            complaints.map((complaint, index) => (
              <TouchableOpacity
                key={index}
                style={styles.complaintCard}
                onPress={() => router.push("/Home/readMore")}
              >
                <View style={styles.complaintHeader}>
                  <Text style={styles.complaintTitle}>
                    {complaint.actionItem} - {complaint.issueType}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(complaint.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{complaint.status}</Text>
                  </View>
                </View>
                <Text style={styles.complaintContent}>
                  {complaint.issueContent}
                </Text>
                <Text style={styles.complaintDate}>
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <RNText style={styles.footerText}>Powered by SIGMA</RNText>
        </View>
      </ScrollView>
    </Provider>
  );
};

export default Index;

const styles = StyleSheet.create({
  footer: {
    padding: 16,

    alignItems: "center",
    position: "relative",
    bottom: 0,
    marginTop: "1%",
    width: "100%",
  },
  footerText: {
    color: "#555",
  },
  scrollView: {
    marginTop: "1%",
    paddingHorizontal: 10,
  },
  scrollViewContentContainer: {
    paddingBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  searchAndSortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "3%",
    marginTop: "0%",
  },
  disabledButton: {
    backgroundColor: "#e0e0e0", // Greyed out background
    color: "#e0e0e0", // Greyed out text
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e4",
    borderRadius: 30,
    marginRight: "1%",
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
    marginLeft: "3%",
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
    marginLeft: "3%",
    marginRight: "2%",
  },
  iconButtonContainer1: {
    backgroundColor: "#e6e6e4",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "110%",
    height: 43,
    marginLeft: "3%",
    marginRight: "2%",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "2%",
    marginRight: "1%",
    paddingHorizontal: 7.5,
  },
  horizontalScrollContainer: {
    paddingRight: width * 0.15,
  },
  verticalScrollView: {},
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
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: "-1%", // Adjust margin if needed
  },
  readMoreButtonText: {
    color: "#fff",
    fontSize: 9, // Increase font size
    textAlign: "center",
  },
  readMoreContainer: {
    flexDirection: "row",
    // justifyContent: "end",
    justifyContent: "space-between",
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
  headerSubTex: {
    color: "#555555",
    marginLeft: 10,
    fontSize: 12,
    flex: 2,
    textAlign: "right",
    marginTop: "-5%",
    marginRight: "4%",
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

    marginBottom: 10,
  },
  categoryText: {
    fontSize: 10,
    color: "#0d0907",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 10,
    color: "#0d0907",
    marginBottom: 0,
    paddingRight: 2,
    textAlign: "right",
    flex: 1,
    fontWeight: "bold",
  },
  issueTypeText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  dropdownContainer: {
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: "5%",
    marginTop: "2%",
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
  },
  dropdownInput: {
    fontSize: 16,
    color: "#333",
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  complaintsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  noComplaints: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  complaintCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  complaintContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  complaintDate: {
    fontSize: 12,
    color: "#999",
  },
});
