// app/details.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import { AntDesign, Feather, SimpleLineIcons } from "@expo/vector-icons";
import { useUser } from "@/Hooks/userContext";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Appbar } from "react-native-paper";

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
  comments:{ date: string; by: string;content: string }[];
  status: string;
  log: { date: string; action: string; by: string }[];
  survey: { Cleanliness: number; Functionality: number; Chair: number; Projector: number;Table: number; Urinals: number; Floor: number; Lights:number; Mirror:number; Toilets:number};
  anonymity: string;
}
const getRatingText = (rating: number | null | undefined) => {
  if (rating === null || rating === undefined) {
    return "Unknown rating";
  }

  switch (rating) {
    case 1:
      return "Poor";
    case 2:
      return "Satisfactory";
    case 3:
      return "Average";
    default:
      return "Unknown rating";
  }
};

export default function IssueDetails() {
  const navigation = useNavigation();
  const params = useGlobalSearchParams();
  const issueID = params.id;
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [issue, setIssue] = useState<Issue | undefined>();
  const [comments, setComments] = useState(issue?.comments || []);

  const fetchIssue = async () => {
    try {
      const body = {
        user_id: user.id,
      };
      const response = await axios.post(
        `https://api.gms.intellx.in/client/issue/status/${issueID}`,
        body
      );
      setIssue(response.data.issue);
      setComments(response.data.issue.comments);
      console.log(response.data.issue.comments[0].content)
     
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      console.log(error.response);
      Alert.alert("Error", "Failed to fetch issue details", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, []);

  const reopenIssue = async () => {
    try {
      const body = {
        user_id: user.id,
      };
      const response = await axios.post(
        `https://api.gms.intellx.in/task/open/${issue?.issueNo}`,
        body
      );
      if (response.status === 200) {
        Alert.alert("Issue has been reopened successfully");
        navigation.goBack();
      }
    } catch (error) {
      // Check if error is an Axios error
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to reopen issue", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to reopen issue", "An unexpected error occurred.");
      }
    }
  };

    console.log(issue?.comments[0].content)


  
  const CloseISsue = async () => {
    try {
      const body = {
        user_id: user.id,
      };
      const response = await axios.post(
        `https://api.gms.intellx.in/task/close/${issue?.issueNo}`,
        body
      );
      if (response.status === 200) {
        Alert.alert("Issue has been closed successfully");
        navigation.goBack();
      } 
    } catch (error) {
      // Check if error is an Axios error
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to close issue", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to close issue", "An unexpected error occurred.");
      }
    }
  };

  const handleAddComment = async () => {
    try {
      if (newComment.trim()) {
        const newCommentObj = {
          date: new Date().toLocaleString(),
          by: user.id, // replace with actual current user ID
          content: newComment,
        };
        setComments((prevComments) => [newCommentObj, ...prevComments]); // Add new comment at the top
        const body = {
          user_id: user.id,
          content: newComment,
        };
        const response = await axios.post(
          `https://api.gms.intellx.in/client/issue/add-comment/${issue?.issueNo}`,
          body
        );
        if (response.status === 200) {
          Alert.alert("Comment added successfully");
        }
        setNewComment("");
      }
    } catch (error) {
      // Check if error is an Axios error
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        Alert.alert("Failed to add comment", `Error: ${error.message}`);
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Failed to add comment", "An unexpected error occurred.");
      }
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }
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
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={styles.cat}>Category</Text>
              <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }}>
                {issue?.issue.actionItem === "Miscellaneous" ? "Miscellaneous" : issue?.issue.issueCat}
              </Text>
            </View>
            <View>
              {issue?.status == "CLOSE" ? (
                <Feather name="check-circle" size={27} color="green" />
              ) : (
                <SimpleLineIcons name="close" size={27} color="red" />
              )}
            </View>
          </View>
          <View
            style={{
              width: "100%",
              height: "0.1%",
              backgroundColor: "black",
              marginTop: 17,
            }}
          ></View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <View>
              <Text>Lastly Updated Date: {issue?.issue.issueLastUpdateDate}{" "} </Text>
            </View>
            <View>
              <Text>Time: {issue?.issue.issueLastUpdateTime}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 15 }}>
            <View>
              <Text>Raised on: {issue?.date} </Text>
            </View>
            <View>
              <Text>Time: {issue?.time}</Text>
            </View>
          </View>
          
          <View style={{ marginTop: 20, gap: 10 }}>
            <Text style={styles.detailsText}>Raised By: {issue?.raised_by.name} </Text>
            <Text style={styles.detailsText}>
      Location:
      {issue?.issue.actionItem === "Department" ? " Floor -" : issue?.issue.actionItem === "Miscellaneous" ? "Not Available " : " Block -"} {issue?.issue.block}  
      {issue?.issue.actionItem === "Department" ? "  Department - " : issue?.issue.actionItem === "Lift -" ? "" :issue?.issue.actionItem === "Miscellaneous" ? "": issue?.issue.actionItem === "Lift" ? "" : "  Floor -"} {issue?.issue.floor}  
      {issue?.issue.actionItem === "Restroom" ? "  Restroom:" : issue?.issue.actionItem === "Classroom" ? " Room No: " : issue?.issue.actionItem === "Department" ? "\nCabin: " : issue?.issue.actionItem === "Water Dispenser" ? " Dispenser No: " : ""}
    
  {issue?.issue.issueContent}
</Text>

          
            <Text style={styles.detailsText}>Type: { issue?.issue.issueType}</Text>
            <Text style={styles.detailsText}>Action Item: {issue?.issue.actionItem}</Text>
            {issue?.issue.issueType === "Complaint" && (
              <Text style={styles.detailsText}>Status: {issue?.status}</Text>
            )}
          </View>
            {issue?.status === "OPEN" ? (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                CloseISsue();
              }}
            >
              <Text style={styles.closeButtonText}>CLOSE THIS ISSUE</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                reopenIssue();
              }}
            >
              <Text style={styles.closeButtonText}>REOPEN THIS ISSUE</Text>
            </TouchableOpacity>
          )}

          
            {/* Conditionally display issue status for complaints */}
            
          

          <Text style={styles.commentsHeading}>Survey Details</Text>
          <View
            style={{
              width: "100%",
              height: "0.1%",
              backgroundColor: "black",
              marginBottom: 10,
            }}
          ></View>
          {issue?.issue.issueType === "Complaint" ? (
            <Text>No survey details to display</Text>
          ) : (
            <>
              {issue?.issue.actionItem === "Classroom" && (
                <>
                  <Text style={styles.detailsText}>Table: {getRatingText(issue?.survey.Table)}</Text>
                  <Text style={styles.detailsText}>Chair: {getRatingText(issue?.survey.Chair)}</Text>
                  <Text style={styles.detailsText}>Projector: {getRatingText(issue?.survey.Projector)}</Text>
                  <Text style={styles.detailsText}>Cleanliness: {getRatingText(issue?.survey.Cleanliness)}</Text>
                </>
              )}
              {issue?.issue.actionItem === "Restroom" && (
                <>
                  <Text style={styles.detailsText}>Mirror & Washbasin: {getRatingText(issue?.survey.Mirror)}</Text>
                  <Text style={styles.detailsText}>Urinals: {getRatingText(issue?.survey.Urinals)}</Text>
                  <Text style={styles.detailsText}>Toilets: {getRatingText(issue?.survey.Toilets)}</Text>
                  <Text style={styles.detailsText}>Floor: {getRatingText(issue?.survey.Floor)}</Text>
                  <Text style={styles.detailsText}>Lights: {getRatingText(issue?.survey.Lights)}</Text>
                </>
              )}
              {issue?.issue.actionItem === "Department" && (
                <>
                  <Text style={styles.detailsText}>Cleanliness: {getRatingText(issue?.survey.Cleanliness)}</Text>
                </>
              )}
              {issue?.issue.actionItem === "Miscellaneous" && (
                <Text>No survey details to display</Text>
              )}
              {issue?.issue.actionItem === "Water Dispenser" && (
                <>
                  <Text>Cleanliness: {getRatingText(issue?.survey.Cleanliness)}</Text>
                  <Text>Functionality: {getRatingText(issue?.survey.Functionality)}</Text>
                </>
              )}
              {issue?.issue.actionItem === "Lift" && (
                <Text>Cleanliness: {getRatingText(issue?.survey.Cleanliness)}</Text>
              )}
            </>
          )}
         
<Text style={styles.commentsHeading}>COMMENTS</Text>
<View
            style={{
              width: "100%",
              height: "0.1%",
              backgroundColor: "black",
              marginBottom: 10,
            }}
          ></View>
          
          
          {issue?.comments && issue.comments.length > 0 ? (
  issue.comments.map((comment, index) => (
    <View key={index} style={styles.commentBox}>
      <Text style={styles.commentUser}>{comment.by}</Text>
      <Text style={styles.commentContent}>{comment.date}</Text>
      
      {Array.isArray(comment.content) && comment.content.length > 0 ? (
        comment.content.map((nestedComment, nestedIndex) => (
          <View key={nestedIndex}>
            <Text style={styles.commentContent}>Comment : {nestedComment.content}</Text>
          </View>
        ))
      ) : null}
    </View>
  ))
) : (
  <Text style={{ alignSelf: "center", margin: 10 }}>No comments available</Text>
)}







          {/* Display Report Log */}
          <Text style={styles.commentsHeading}>Report Log</Text>
          <View
            style={{
              width: "100%",
              height: "0.1%",
              backgroundColor: "black",
              marginBottom: 10,
            }}
          ></View>
          {issue?.log.map((log, index) => (
            <View key={index} style={styles.commentBox}>
              <Text style={styles.commentUser}>{log.by}</Text>
              <Text style={styles.commentContent}>
                {log.action} on {log.date}
              </Text>
            </View>
          ))}
         
         
          
        
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}




const styles = StyleSheet.create({
  cat:{
    fontStyle:"italic",
    fontSize: 10,

  },
  scrollView: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    padding: "2%",
   
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: width * 0.05,
    backgroundColor: "#FFFFFF",
    minHeight: height,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    // shadowColor: "#000000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
  },
  headingText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
  },
  detailsContainer: {
    // borderWidth: 1,
    // borderColor: "#DDE6F0",
    // borderRadius: 10,
    padding: 20,
    backgroundColor: "#FFFFFF",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#E6F0FF",
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 14,
    marginBottom:'3%',
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
    marginTop :1 ,
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
});
