import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
  Text as RNText,
} from "react-native";
import { Provider, Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

import { BACKEND_URL } from "@/production.config";
import { router, useRouter } from "expo-router";
import { ArrowUpRightIcon } from "react-native-heroicons/outline";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Issue {
  item_details:{
    item_name: string;
    category:string;
  }
  name: string;
  roll_no: string;
  
  date_lost: string;
  last_seen_location: string;
  user_account_id: string;
}
const handlePress = () => {
  router.push('/Home/lostAndFoundForm');
};
const LostAndFound = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch lost and found items
  const fetchAllLostAndFound = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/get_all_lost_items`);
      console.log("API Response:", response.data); // Debug here
      setIssues(response.data?.lost_items || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
      Alert.alert("Error", "Failed to fetch lost and found items.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllLostAndFound();
    }, [])
  );

  
  const filteredIssues = issues.filter((issue) =>
    issue.item_details.item_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const renderComplaintItem = ({ item: issue }: { item: Issue }) => (
  <View style={styles.cardContainer}>
    <Text style={styles.cardTitle}>{issue.item_details.item_name}</Text>
    <View style={styles.rowContainer}>
      <View style={styles.infoBlock}>
        <Text style={styles.infoHeading}>Last Seen</Text>
        <Text style={styles.infoContent} numberOfLines={1} ellipsizeMode="tail">
          {issue.last_seen_location}
        </Text>
      </View>
      <View style={styles.infoBlock}>
        <Text style={styles.infoHeading}>Date Lost</Text>
        <Text style={styles.infoContent} numberOfLines={1} ellipsizeMode="tail">
          {issue.date_lost}
        </Text>
      </View>
    </View>
    <View style={styles.divider} />
    <View style={styles.userContainer}>
      <Ionicons name="person-circle" size={40} color="gray" />
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {issue.name}
        </Text>
        <Text style={styles.userRollNo} numberOfLines={1}>
          {issue.roll_no}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/Home/lostAndFoundRM",
            params: { issue: JSON.stringify(issue) },
          })
        }
      >
        <View>
          <Text style={styles.userI}> View More </Text>
        </View>
       
      </TouchableOpacity>
    </View>
  </View>
);
  

  return (
    <Provider>
     

      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#555" style={styles.searchIcon} />
          <TextInput
            placeholder="Search by category"
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholderTextColor="#555"
            style={styles.searchInput}
          />
        </View>

        <RNText style={styles.sectionTitle}>Lost and Found Items</RNText>

       
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
        ) : filteredIssues.length === 0 ? (
          <RNText style={styles.noComplaintsText}>No Items Found</RNText>
        ) : (
          <FlatList
            data={filteredIssues.slice().reverse()}
            renderItem={renderComplaintItem}
            keyExtractor={(item) => item.roll_no}
            showsVerticalScrollIndicator={false}
          />
        )}
              <TouchableOpacity style={styles.addButton} onPress={handlePress}>

<Ionicons name="add-circle" size={44} color="#8283e9" />
</TouchableOpacity>
      </ScrollView>
    </Provider>
  );
};

export default LostAndFound;

const styles = StyleSheet.create({
  // headerContainer: {
  //   height: 100,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#f2f2f2",
  // },
  addButton: {
    position: 'absolute',
    bottom:-25,
    right: 20,
  
   
    
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    color: "#333",
  },
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
    gap: 16,
  },
  infoBlock: {
    flex: 1,
  },
  infoHeading: {
    fontSize: 12,
    color: "gray",
    marginBottom: 4,
  },
  infoContent: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginVertical: 8,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userI:{
    color: "#fff",
    fontSize: 9, // Increase font size
    textAlign: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userRollNo: {
    fontSize: 12,
    color: "gray",
  },
  button: {
    backgroundColor: "#8283e9",
    paddingVertical: 10, // Increase vertical padding
    paddingHorizontal: 10, // Increase horizontal padding
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: "3%", // Adjust margin if needed
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  scrollViewContentContainer: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e4",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  noComplaintsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#f0f4fa",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
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
  // issueTypeText: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   marginBottom: 8,
  // },
  // categoryText: {
  //   fontSize: 14,
  //   color: "#555",
  //   marginBottom: 4,
  // },
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
  // readMoreButton: {
  //   backgroundColor: "#8283e9",
  //   paddingVertical: 8,
  //   paddingHorizontal: 16,
  //   borderRadius: 8,
  //   alignSelf: "flex-start",
  //   marginTop: 8,
  // },
  // readMoreButtonText: {
  //   color: "#fff",
  //   fontSize: 14,
  // },
  footer: {
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#555",
  },
});
