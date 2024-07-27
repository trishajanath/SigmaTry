import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text as RNText,
  Dimensions,
  TextInput,
  FlatList,
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

const rectangularContainers = [
  {
    anonymity: "false",
    comments: [
      {
        by: "21Z202",
        content: "Floor Dirty",
        date: "03-12-23 12:06 PM",
      },
      {
        by: "21Z202",
        content: "Cleaned.",
        date: "03-12-23 19:22",
      },
      {
        by: "21Z202",
        content: "Cleaned.",
        date: "03-12-23 19:22",
      },
      {
        by: "21Z202",
        content: "Cleaned.",
        date: "03-12-23 19:22",
      },
    ],
    date: "03/12/23",
    delay_days: 10,
    issue: {
      actionItem: "K428",
      block: "K",
      floor: "3",
      issueCat: "Cleaning",
      issueContent: "Floor Dirty",
      issueLastUpdateDate: "17/07/24",
      issueLastUpdateTime: "11:26 PM",
      issueType: "Issue",
    },
    issueNo: "4ESF0",
    log: [
      {
        action: "opened",
        by: "21Z202",
        date: "03-12-23 12:06",
      },
      {
        action: "closed",
        by: "21Z202",
        date: "03-12-23 19:23",
      },
      {
        action: "opened",
        by: "21Z202",
        date: "11-02-24 00:08",
      },
      {
        action: "closed",
        by: "22N228",
        date: "17-07-24 22:59",
      },
      {
        action: "closed",
        by: "22N228",
        date: "17-07-24 23:11",
      },
      {
        action: "opened",
        by: "22N228",
        date: "17-07-24 23:26",
      },
    ],
    priority: 1,
    raised_by: {
      name: "Aaditya Rengarajan",
      personId: "21Z202",
    },
    status: "OPEN",
    survey: {},
    time: "12:06 PM",
  },
  {
    anonymity: "false",
    comments: [
      {
        by: "21Z202",
        content: "Lift is not working",
        date: "03-12-23 07:15 PM",
      },
    ],
    date: "03/12/23",
    delay_days: 0,
    issue: {
      actionItem: "Lift",
      block: "J",
      floor: "0",
      issueCat: "Miscellaneous",
      issueContent: "Lift is not working",
      issueLastUpdateDate: "27/07/24",
      issueLastUpdateTime: "07:54 AM",
      issueType: "Issue",
    },
    issueNo: "GPM73",
    log: [
      {
        action: "opened",
        by: "21Z202",
        date: "03-12-23 19:15",
      },
      {
        action: "closed",
        by: "21Z202",
        date: "03-12-23 19:16",
      },
      {
        action: "opened",
        by: "21Z202",
        date: "26-06-24 01:02",
      },
      {
        action: "closed",
        by: "21Z202",
        date: "26-06-24 01:03",
      },
      {
        action: "opened",
        by: "22z201",
        date: "27-07-24 07:54",
      },
    ],
    priority: 1,
    raised_by: {
      name: "Aaditya Rengarajan",
      personId: "21Z202",
    },
    status: "OPEN",
    survey: {
      "Cleanliness ": "satisfactory",
    },
    time: "07:15 PM",
  },
  {
    anonymity: "false",
    comments: [
      {
        by: "UKS.AMCS",
        content: "",
        date: "11-01-24 12:34 PM",
      },
      {
        by: "22N228",
        content: "close",
        date: "17-07-24 23:28",
      },
      {
        by: "22N228",
        content: "hi",
        date: "17-07-24 23:35",
      },
    ],
    date: "11/01/24",
    delay_days: 10,
    issue: {
      actionItem: "M401",
      block: "M",
      floor: "3",
      issueCat: "Miscellaneous",
      issueContent: "",
      issueLastUpdateDate: "17/07/24",
      issueLastUpdateTime: "11:35 PM",
      issueType: "Issue",
    },
    issueNo: "IHU1B",
    log: [
      {
        action: "opened",
        by: "UKS.AMCS",
        date: "11-01-24 12:34",
      },
    ],
    priority: 1,
    raised_by: {
      name: "Sridevi",
      personId: "UKS.AMCS",
    },
    status: "OPEN",
    survey: {},
    time: "12:34 PM",
  },
  {
    anonymity: "false",
    comments: [
      {
        by: "22Z323",
        content: "Not working ",
        date: "03-12-23 07:23 PM",
      },
      {
        by: "21Z202",
        content: "Thank You.",
        date: "03-12-23 19:31",
      },
    ],
    date: "03/12/23",
    issue: {
      actionItem: "",
      block: "Y",
      floor: "3",
      issueCat: "Plumbing",
      issueContent: "Not working ",
      issueLastUpdateDate: "03/12/23",
      issueLastUpdateTime: "07:31 PM",
      issueType: "Issue",
    },
    issueNo: "5986Y",
    log: [
      {
        action: "opened",
        by: "22Z323",
        date: "03-12-23 19:23",
      },
      {
        action: "closed",
        by: "21Z202",
        date: "03-12-23 19:31",
      },
    ],
    raised_by: {
      name: "Giri prassath.S",
      personId: "22Z323",
    },
    status: "CLOSE",
    survey: {},
    time: "07:23 PM",
  },
];
const Index = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedComplaints, setSortedComplaints] = useState(
    rectangularContainers
  );

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

  const handleSort = () => {
    const sorted = [...rectangularContainers].sort((a, b) => {
    
      if (a.status === "OPEN" && b.status !== "OPEN") return -1;
      if (a.status !== "OPEN" && b.status === "OPEN") return 1;
  
      // If statuses are the same, sort by date (latest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setSortedComplaints(sorted);
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

  const renderComplaintItem = ({
    item,
  }: {
    item: (typeof rectangularContainers)[0];
  }) => (
    <View
      key={item.issueNo}
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
          <RNText style={styles.issueTypeText}>{item.issue.issueType}</RNText>
          <RNText style={styles.dateText}>{item.date}</RNText>
        </View>
        <View style={styles.complaintBody}>
          <RNText style={styles.categoryText}> {item.issue.issueCat}</RNText>
          <RNText style={styles.statusText}> {item.status}</RNText>
        </View>
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => {
            router.replace({
              pathname: "/Home/readMore",
              params: {
                issue: JSON.stringify(item),
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
          <View style={styles.iconButtonContainer}>
            <AdjustmentsHorizontalIcon
              size={20}
              color="#555555"
              onPress={handleSort}
            />
          </View>
          <View style={styles.iconButtonContainer}>
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
          data={sortedComplaints}
          renderItem={renderComplaintItem}
          keyExtractor={(item) => item.issueNo}
        />
      </ScrollView>
    </>
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
    width: '11%',
    height: 43,
    marginLeft:'2%',
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
    textAlign: "right", // Align text to the right
    flex: 1, // Allow text to take up available space
  },
  issueTypeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
