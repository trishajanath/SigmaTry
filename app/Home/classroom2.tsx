import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Switch} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import ModalDropdown from "react-native-modal-dropdown";

const FormTemplate = () => {
  
  const [room, setroom] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  

  const handleSubmit = () => {
    console.log("Form submitted with values:", { room, selectedOption});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        Classroom Information
      </Text>
      
      <Text variant="titleMedium" style={styles.pickerLabel}>
          Classroom Number
        </Text>
      <TextInput
        label="Enter Classroom Number"
        value={room}
        onChangeText={(text) => setroom(text)}
        style={styles.input}
        mode="outlined"
      />
      <Text variant="titleMedium" style={styles.pickerLabel}>
          Type
        </Text>
       <View style={styles.pickerContainer}>
        
        <ModalDropdown
          options={["Complaint", "Feedback"]}
          defaultValue={selectedOption}
          onSelect={(index, value) => setSelectedOption(value)}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownOptions}
          dropdownTextStyle={styles.dropdownOptionText}
        />
      </View>
      
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Next
      </Button>
    </ScrollView>
  );
};

export default FormTemplate;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: "5%",
    marginTop:"5%",
    backgroundColor: "#f5f5f5",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  switchLabel: {
    fontSize: 16,
  },
  header: {
    marginTop: "0%",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: "2%",
    padding: "2%",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  pickerLabel: {
    marginBottom: 5,
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownOptions: {
    width: "80%",
    marginLeft: "0%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  dropdownOptionText: {
    fontSize: 16,
    padding: 10,
  },
  picker: {
    marginTop:"10%",
    height:"10%",  
        width: "100%",  
        color: '#344953',  
        justifyContent: 'center', 
  },
  button: {
    marginTop: 20,
  },
});