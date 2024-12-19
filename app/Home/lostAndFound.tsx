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
import { Appbar, Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

import { BACKEND_URL } from "@/production.config";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width } = Dimensions.get("window");

interface Issue {
  item_details: {
    item_name: string;
    category: string;
  };
  name: string;
  roll_no: string;
  images: [];
  date_lost: string;
  last_seen_location: string;
  user_account_id: string;
}

const LostAndFound = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
 React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  // Fetch lost and found items
  const fetchAllLostAndFound = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/get_all_lost_items`);
      console.log("API Response:", response.data);
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
      <View style={styles.rowContainer}>
        <View style={styles.imageContainer}>
          {issue?.images?.length > 0 ? (
            issue.images.map((image: any, index: any) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))
          ) : (
            <Text>No images attached.</Text>
          )}
        </View>
        <View style={styles.textContainer}>
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
            <Text style={styles.userI}>View More</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      {/* Header */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sigma-GMS" />
      </Appbar.Header>

      {/* Main Content */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={10}
      >
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#555" style={styles.searchIcon} />
          <TextInput
            placeholder="Search by Item Name"
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholderTextColor="#555"
            style={styles.searchInput}
          />
        </View>

        <RNText style={styles.sectionTitle}>Lost and Found Items</RNText>

        {loading ? (
          <View style={styles.loaderContainer}>
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
        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/Home/lostAndFoundForm")}>
          <Ionicons name="add-circle" size={44} color="#8283e9" />
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </>
  );
};

export default LostAndFound;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    padding: "2%",
    marginBottom: "5%",
  },
  addButton: {
    position: "absolute",
    bottom: -25,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
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
  userI: {
    color: "#fff",
    fontSize: 9,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: "3%",
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
  imageContainer: {
    flex: 0.3,
    marginRight: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  textContainer: {
    flex: 0.7,
    flexDirection: "column",
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
});
