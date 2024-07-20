import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Switch } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import ModalDropdown from "react-native-modal-dropdown";

const FormTemplate = () => {
  const [name, setName] = useState("");
  const [floor, setfloor] = useState("");
  const [room, setroom] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectOption, setSelectOption] = useState("");
  const [content, setcontent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted with values:", { name, floor });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} alwaysBounceVertical>
      <Text variant="headlineSmall" style={styles.header}>
        Classroom Information
      </Text>
      <Text variant="titleMedium" style={styles.pickerLabel}>
        Block Name
      </Text>
      <TextInput
        label="Enter Block Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
        mode="outlined"
      />
      <Text variant="titleMedium" style={styles.pickerLabel}>
        Floor Number
      </Text>
      <TextInput
        label="Enter Floor Number"
        value={floor}
        onChangeText={(text) => setfloor(text)}
        style={styles.input}
        mode="outlined"
      />
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
      <Text variant="titleMedium" style={styles.pickerLabel}>
        Domain
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectOption}
          onValueChange={(itemValue) => setSelectOption(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Cleaning" value="cleaning" />
          <Picker.Item label="Plumbing" value="plumbing" />
          <Picker.Item label="Civil & Carpentry" value="civil" />
          <Picker.Item label="Electrical" value="electrical" />
          <Picker.Item label="AV and Projectors" value="av" />
          <Picker.Item label="Others" value="others" />
        </Picker>
      </View>
      <Text variant="titleMedium" style={styles.pickerLabel}>
        Content
      </Text>
      <TextInput
        label="Content"
        value={content}
        onChangeText={(text) => setcontent(text)}
        style={styles.input}
        mode="outlined"
        multiline
      />
      <View style={styles.switchContainer}>
        <Text variant="titleMedium" style={styles.switchLabel}>
          Anonymous Replies
        </Text>
        <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
      </View>
      <Button mode="contained" onPress={handleSubmit} style={styles.button}>
        Submit
      </Button>
    </ScrollView>
  );
};

export default FormTemplate;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: "5%",
    paddingBottom: "15%",
    marginTop: "3%",
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
    marginTop: "10%",
    height: "10%",
    width: "100%",
    color: "#344953",
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
  },
});
