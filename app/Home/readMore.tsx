// app/details.tsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

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
  comments: { date: string; by: string; content: string }[];
  status: string;
  log: { date: string; action: string; by: string }[];
  survey: {};
  anonymity: string;
}

export default function IssueDetails() {
  const navigation = useNavigation();
  const params = useGlobalSearchParams();
  const issue: Issue = params.issue
    ? JSON.parse(Array.isArray(params.issue) ? params.issue[0] : params.issue)
    : null;

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(issue.comments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        date: new Date().toLocaleString(),
        by: "CurrentUser",
        content: newComment,
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign name="left" size={20} color="#555555" />
          </TouchableOpacity>
          <Text style={styles.headingText}>Issue Details</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <View style={styles.box}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{issue.issue.issueCat}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{issue.status}</Text>
            </View>
          </View>
          <View style={styles.detailsBox}>
            <Text style={styles.detailsText}>Block: {issue.issue.block}</Text>
            <Text style={styles.detailsText}>Floor: {issue.issue.floor}</Text>
            <Text style={styles.detailsText}>
              Type: {issue.issue.issueType}
            </Text>
            <Text style={styles.detailsText}>
              Content: {issue.issue.issueContent}
            </Text>
            <Text style={styles.detailsText}>
              Action Item: {issue.issue.actionItem}
            </Text>
            <Text style={styles.detailsText}>
              Last Update: {issue.issue.issueLastUpdateDate}{" "}
              {issue.issue.issueLastUpdateTime}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeButtonText}>CLOSE THIS ISSUE</Text>
          </TouchableOpacity>
          <Text style={styles.commentsHeading}>COMMENTS</Text>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentBox}>
              <Text style={styles.commentUser}>{comment.by}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddComment}
            >
              <AntDesign name="plus" size={20} color="#555555" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFFFFF",
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  headingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
  },
  detailsContainer: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
    fontSize: 16,
    color: "#003366",
    marginBottom: 5,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#003366",
  },
  commentsHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 10,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: "#DDE6F0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
  },
  commentContent: {
    fontSize: 14,
    color: "#666666",
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
    fontSize: 16,
    color: "#333333",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F0FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDE6F0",
  },
});
