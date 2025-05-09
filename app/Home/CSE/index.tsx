import React, { useReducer, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  Portal,
  Modal,
  List,
  Provider as PaperProvider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import axios from "axios";

const CSEIncidentForm = () => {
  const router = useRouter();
  const [showStatusModal, setShowStatusModal] = useState(false);

  const initialState = {
    name: "",
    employeeId: "",
    department: "",
    labRoom: "",
    equipmentType: "",
    issueDescription: "",
    stepsToReproduce: "",
    impact: "",
    priority: "",
    attachments: [],
    status: "Open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = async () => {
    if (!state.name || !state.employeeId || !state.department || !state.labRoom || !state.equipmentType) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields",
      });
      return;
    }

    try {
      const Submit = {
        name: state.name,
        id: state.employeeId,
        issueType: "Complaint",
        issueCat: "CSE Department",
        actionItem: "CSE Department",
        block: state.department,
        floor: state.labRoom,
        issueContent: state.issueDescription,
        comments: [
          {
            by: state.employeeId,
            content: state.stepsToReproduce,
          },
        ],
        "survey-impact": state.impact,
        "survey-priority": state.priority,
      };

      console.log("Submitting data:", Submit);
      const response = await axios.post(
        `${BACKEND_URL}/client/issue/report`,
        Submit
      );
      console.log(response.data);
      router.replace({
        pathname: "/Home/submitPage",
        params: response.data,
      });
    } catch (error: any) {
      console.error("Error occurred during submission:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
      Toast.show({
        type: "error",
        text1: "Submission failed",
        text2: "Please try again later.",
        visibilityTime: 2000,
      });
    }
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        dispatch({
          type: "ADD_ATTACHMENT",
          payload: {
            uri: result.assets[0].uri,
            type: "image",
            name: result.assets[0].uri.split("/").pop(),
          },
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to upload image",
      });
    }
  };

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.type === "success") {
        dispatch({
          type: "ADD_ATTACHMENT",
          payload: {
            uri: result.uri,
            type: "document",
            name: result.name,
          },
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to upload document",
      });
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>CSE Department Incident Report</Text>
            
            {/* Employee Details */}
            <TextInput
              label="Name"
              value={state.name}
              onChangeText={(text) => dispatch({ type: "SET_NAME", payload: text })}
              style={styles.input}
            />
            <TextInput
              label="Employee ID"
              value={state.employeeId}
              onChangeText={(text) => dispatch({ type: "SET_EMPLOYEE_ID", payload: text })}
              style={styles.input}
            />
            <TextInput
              label="Department"
              value={state.department}
              onChangeText={(text) => dispatch({ type: "SET_DEPARTMENT", payload: text })}
              style={styles.input}
            />

            {/* Lab Details */}
            <TextInput
              label="Lab Room Number"
              value={state.labRoom}
              onChangeText={(text) => dispatch({ type: "SET_LAB_ROOM", payload: text })}
              style={styles.input}
              placeholder="e.g., Lab 101, Lab 202"
            />
            <TextInput
              label="Equipment Type"
              value={state.equipmentType}
              onChangeText={(text) => dispatch({ type: "SET_EQUIPMENT_TYPE", payload: text })}
              style={styles.input}
              placeholder="e.g., Computer, Printer, Network Device"
            />

            {/* Issue Details */}
            <TextInput
              label="Issue Description"
              value={state.issueDescription}
              onChangeText={(text) => dispatch({ type: "SET_ISSUE_DESCRIPTION", payload: text })}
              style={styles.input}
              multiline
              placeholder="Please provide detailed description of the issue"
            />
            <TextInput
              label="Steps to Reproduce"
              value={state.stepsToReproduce}
              onChangeText={(text) => dispatch({ type: "SET_STEPS", payload: text })}
              style={styles.input}
              multiline
              placeholder="List the steps to reproduce the issue"
            />
            <TextInput
              label="Impact"
              value={state.impact}
              onChangeText={(text) => dispatch({ type: "SET_IMPACT", payload: text })}
              style={styles.input}
              multiline
              placeholder="Describe the impact on lab operations"
            />

            {/* Priority Selection */}
            <View style={styles.priorityContainer}>
              <Text style={styles.label}>Priority Level</Text>
              <View style={styles.priorityButtons}>
                <Button
                  mode={state.priority === "Low" ? "contained" : "outlined"}
                  onPress={() => dispatch({ type: "SET_PRIORITY", payload: "Low" })}
                  style={styles.priorityButton}
                >
                  Low
                </Button>
                <Button
                  mode={state.priority === "Medium" ? "contained" : "outlined"}
                  onPress={() => dispatch({ type: "SET_PRIORITY", payload: "Medium" })}
                  style={styles.priorityButton}
                >
                  Medium
                </Button>
                <Button
                  mode={state.priority === "High" ? "contained" : "outlined"}
                  onPress={() => dispatch({ type: "SET_PRIORITY", payload: "High" })}
                  style={styles.priorityButton}
                >
                  High
                </Button>
              </View>
            </View>

            {/* Status Tracking */}
            <View style={styles.statusContainer}>
              <Text style={styles.label}>Status</Text>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => setShowStatusModal(true)}
              >
                <Text style={styles.statusText}>{state.status}</Text>
              </TouchableOpacity>
            </View>

            {/* File Upload */}
            <View style={styles.uploadContainer}>
              <Text style={styles.label}>Attachments</Text>
              <View style={styles.uploadButtons}>
                <Button
                  mode="outlined"
                  onPress={handleImageUpload}
                  style={styles.uploadButton}
                >
                  Upload Image
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleDocumentUpload}
                  style={styles.uploadButton}
                >
                  Upload Document
                </Button>
              </View>
            </View>

            {/* Analytics Dashboard */}
            <View style={styles.analyticsContainer}>
              <Text style={styles.label}>Analytics</Text>
              <View style={styles.analyticsGrid}>
                <AnalyticsCard
                  title="Resolution Time"
                  value="2.5 days"
                  icon="clock-outline"
                  color="#4169E1"
                />
                <AnalyticsCard
                  title="Similar Issues"
                  value="3"
                  icon="chart-bar"
                  color="#32CD32"
                />
                <AnalyticsCard
                  title="Priority Level"
                  value={state.priority || "Not Set"}
                  icon="alert-circle-outline"
                  color="#FFA500"
                />
              </View>
            </View>

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              Submit Incident
            </Button>
          </Card.Content>
        </Card>

        {/* Status Update Modal */}
        <Portal>
          <Modal
            visible={showStatusModal}
            onDismiss={() => setShowStatusModal(false)}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.modalTitle}>Update Status</Text>
            <List.Section>
              <List.Item
                title="Open"
                onPress={() => {
                  dispatch({ type: "SET_STATUS", payload: "Open" });
                  setShowStatusModal(false);
                }}
              />
              <List.Item
                title="In Progress"
                onPress={() => {
                  dispatch({ type: "SET_STATUS", payload: "In Progress" });
                  setShowStatusModal(false);
                }}
              />
              <List.Item
                title="Resolved"
                onPress={() => {
                  dispatch({ type: "SET_STATUS", payload: "Resolved" });
                  setShowStatusModal(false);
                }}
              />
            </List.Section>
          </Modal>
        </Portal>
      </ScrollView>
    </PaperProvider>
  );
};

// Form Reducer
const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMPLOYEE_ID":
      return { ...state, employeeId: action.payload };
    case "SET_DEPARTMENT":
      return { ...state, department: action.payload };
    case "SET_LAB_ROOM":
      return { ...state, labRoom: action.payload };
    case "SET_EQUIPMENT_TYPE":
      return { ...state, equipmentType: action.payload };
    case "SET_ISSUE_DESCRIPTION":
      return { ...state, issueDescription: action.payload };
    case "SET_STEPS":
      return { ...state, stepsToReproduce: action.payload };
    case "SET_IMPACT":
      return { ...state, impact: action.payload };
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload, updatedAt: new Date().toISOString() };
    case "ADD_ATTACHMENT":
      return { ...state, attachments: [...state.attachments, action.payload] };
    case "REMOVE_ATTACHMENT":
      return {
        ...state,
        attachments: state.attachments.filter((_, index) => index !== action.payload),
      };
    default:
      return state;
  }
};

// Analytics Card Component
const AnalyticsCard = ({ title, value, icon, color }) => (
  <Card style={[styles.analyticsCard, { borderLeftColor: color }]}>
    <Card.Content style={styles.analyticsContent}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={styles.analyticsValue}>{value}</Text>
      <Text style={styles.analyticsTitle}>{title}</Text>
    </Card.Content>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  priorityContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  priorityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusButton: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  statusText: {
    fontSize: 16,
    color: "#333",
  },
  uploadContainer: {
    marginBottom: 16,
  },
  uploadButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  analyticsContainer: {
    marginBottom: 16,
  },
  analyticsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  analyticsCard: {
    width: "30%",
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  analyticsContent: {
    alignItems: "center",
    padding: 8,
  },
  analyticsValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
    color: "#333",
  },
  analyticsTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#8283e9",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
});

export default CSEIncidentForm; 