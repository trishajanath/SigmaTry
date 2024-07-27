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
    id: 1,
    issueType: "Feedback",
    action: "Opened",
    date: "21-07-2024",
    category: "Plumbing",
  },
  {
    id: 2,
    issueType: "Feedback",
    action: "Closed",
    date: "22-07-2024",
    category: "Electrical",
    status: "Resolved",
  },
  {
    id: 3,
    issueType: "Complaint",
    action: "Pending",
    date: "23-07-2024",
    category: "Others",
    status: "Resolved",
  },
  {
    id: 4,
    issueType: "Complaint",
    action: "Closed",
    date: "23-07-2024",
    category: "Cleaning",
    status: "Resolved",
  },
];

const Index = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedComplaints, setSortedComplaints] = useState(rectangularContainers);

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
    const sorted = [...rectangularContainers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSortedComplaints(sorted);
  };

  const getCardColor = (action: string) => {
    switch (action) {
      case "Opened":
        return "#e7bcec";
      case "Closed":
        return "#bbbef3";
      case "Pending":
        return "#a3c3e7"; 
      default:
        return "#ffffff"; 
    }
  };

  const renderComplaintItem = ({ item }: { item: typeof rectangularContainers[0] }) => (
    <View
      key={item.id}
      style={{
        backgroundColor: getCardColor(item.action),
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
          <RNText style={styles.issueTypeText}>{item.issueType}</RNText>
          <RNText style={styles.dateText}>{item.date}</RNText>
        </View>
        <View style={styles.complaintBody}>
          <RNText style={styles.categoryText}> {item.category}</RNText>
          <RNText style={styles.statusText}> {item.action}</RNText>
        </View>
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => {
            router.replace("/Home/readMore");
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
        <View
          style={styles.searchAndSortContainer}
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
          <View style={styles.iconButtonContainer}>
            <AdjustmentsHorizontalIcon size={20} color="#555555" onPress={handleSort} />
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
          keyExtractor={(item) => item.id.toString()}
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
    paddingBottom: 20, // Ensure there's padding at the bottom for better scrolling
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
    paddingHorizontal:'2%',
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
    width: 40,
    height: 43,
    marginLeft: 10,
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
    marginBottom: '2%',
  },
  readMoreButton: {
    backgroundColor: "#8283e9",
    paddingVertical: 10, // Increase vertical padding
    paddingHorizontal: 10, // Increase horizontal padding
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginTop: '-1%', // Adjust margin if needed
  },
  readMoreButtonText: {
    color: "#fff",
    fontSize: 10, // Increase font size
    textAlign: 'center',
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
    textAlign: 'right', // Align text to the right
    flex: 1, // Allow text to take up available space
  },
  issueTypeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
