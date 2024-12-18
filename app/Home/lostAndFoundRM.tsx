import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Image,
  Linking,
} from "react-native";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import { AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { useUser } from "@/Hooks/userContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar } from "react-native-paper";
import { BACKEND_URL } from "@/production.config";

const { width, height } = Dimensions.get("window");

interface Issue {
  _id: { $oid: string };
  issueNo: string;
  time: string;
  date: string;
  raised_by: { name: string; personId: string };
  issue: {
    issueLastUpdateTime: string;
    issueLastUpdateDate: string;
    issueType: string;
    issueCat: string;
    issueContent: string;
    block: string;
    floor: string;
    actionItem: string;
  };
  comments: {
    date: string;
    by: string;
    content: [
      {
        by: string;
        content: string;
      }
    ];
  }[];
  status: string;
  log: { date: string; action: string; by: string }[];
  survey: {
    Cleanliness: number;
    Functionality: number;
    Chair: number;
    Projector: number;
    Table: number;
    Urinals: number;
    Floor: number;
    Lights: number;
    Mirror: number;
    Toilets: number;
  };
  anonymity: string;
  assignee: string;
}

export default function IssueDetails() {
  const navigation = useNavigation();
  const user = useUser();
  const params = useGlobalSearchParams();
  let issue = params.issue
    ? JSON.parse(Array.isArray(params.issue) ? params.issue[0] : params.issue)
    : null;

  console.log(issue);

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const CloseIssue = async () => {
    // Check if the logged-in user is authorized to close the issue
    if (user?.id !== issue?.user_account_id) {
      Alert.alert(
        "Unauthorized",
        "You are not authorized to close this issue."
      );
      return;
    }
  
    try {
      const body = {
        item_id: issue.item_id,
      };
      const response = await axios.post(`${BACKEND_URL}/remove_lost_item`, body);
  
      if (response.status === 200) {
        Alert.alert("Success", "Issue has been closed successfully.");
        navigation.goBack();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to close issue", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to close issue", "An unexpected error occurred.");
      }
    }
  };
  

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sigma - GMS" />
      </Appbar.Header>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={100}
      >
        <View style={styles.container}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontStyle: "italic", fontSize: 10 }}>
                Category :
              </Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "black" }}
              >
                {issue?.item_details?.category || "N/A"}
              </Text>
            </View>
            <View>
              {issue?.status === "CLOSE" ? (
                <Feather name="check-circle" size={27} color="green" />
              ) : (
                <SimpleLineIcons name="close" size={27} color="red" />
              )}
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "black",
              marginTop: 17,
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View>
              <Text>Lastly seen: {issue?.date_lost || "N/A"}</Text>
            </View>
          </View>
          <View style={{ marginTop: 20, gap: 10 }}>
            <Text style={styles.detailsText}>
              Date reported: {issue?.reported_on || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Issue ID: {issue?._id || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Reported By: {issue?.name || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Roll No: {issue?.roll_no || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Contact: {issue?.contact_number || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Department: {issue?.department || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Location: {issue?.last_seen_location || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Item Name: {issue?.item_details?.item_name || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Description: {issue?.item_details?.description || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Comments: {issue?.comments || "N/A"}
            </Text>
            <Text style={styles.detailsText}>
              Email: {issue?.email || "N/A"}
            </Text>
            <Text style={styles.commentsHeading}>Attached Images</Text>
            {issue?.images?.length > 0 ? (
              issue.images.map((image: any, index: any) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={{ width: 100, height: 100, margin: 5 }}
                />
              ))
            ) : (
              <Text>No images attached.</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              CloseIssue();
            }}
          >
            <Text style={styles.closeButtonText}>FOUND THE ITEM</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    padding: "2%",
    marginBottom: "5%",
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#FFFFFF",
    minHeight: height,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
    marginBottom: 10,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#003366",
  },
  commentsHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 10,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
  },
  commentContent: {
    fontSize: 12,
    marginTop: 1,
  },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    fontSize: 12,
    color: "#333333",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDE6F0",
  },
  logsContainer: {
    marginTop: 20,
  },
  logsHeading: {
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 10,
  },
  logBox: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
  },
  logDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  logAction: {
    fontSize: 12,
    marginTop: 2,
  },
  logBy: {
    fontSize: 12,
    fontStyle: "italic",
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 5,
  },
});