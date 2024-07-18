import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';


import ModalDropdown from "react-native-modal-dropdown";


const ProgressStepsComponent = () => {
  const [step1Data, setStep1Data] = useState({ name: '', number: '', restroom:'' });
  const [step2Data, setStep2Data] = useState({ type: '', domain: '', content:'', anonymous:false});
  const [selectedOption, setSelectedOption] = useState('Select Type');
  const handleSwitchChange = (value: boolean) => {
    setStep2Data({ ...step2Data, anonymous: value });
  };
  

  return (
    <View style={styles.container}>
      <ProgressSteps>
        <ProgressStep label="Step 1">
          <View style={styles.container}>
            <Text style={styles.label}>Block Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={step1Data.name}
              onChangeText={text => setStep1Data({ ...step1Data, name: text })}
            />
            <Text style={styles.label}>Floor Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Number"
              value={step1Data.number}
              onChangeText={text => setStep1Data({ ...step1Data, number: text })}
            />
      
          <Picker
          selectedValue={step1Data.restroom}
          style={styles.input}
          onValueChange={(itemValue) =>
            setStep1Data({ ...step1Data, restroom: itemValue })
          }>
          <Picker.Item label="Option 1" value="option1" />
          <Picker.Item label="Option 2" value="option2" />
          <Picker.Item label="Option 3" value="option3" />
        </Picker>
      </View>
        </ProgressStep>
        <ProgressStep label="Step 2">
        <Text  style={styles.pickerLabel}>
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
      <Text  style={styles.pickerLabel}>
        Domain
      </Text>
      <View style={styles.pickerContainer}>
        <ModalDropdown
          options={["Cleaning", "Plumbing","Civil & Carpentry","Electrical","Others"]}
          defaultValue={selectedOption}
          onSelect={(index, value) => setSelectedOption(value)}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownOptions}
          dropdownTextStyle={styles.dropdownOptionText}
        />
      </View>
          <View style={styles.container}>
          
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={step2Data.content}
              onChangeText={text => setStep2Data({ ...step2Data, content: text })}
            />
          </View>
          <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>
          Anonymous Replies
        </Text>
        <Switch
          value={step2Data.anonymous}
          onValueChange={handleSwitchChange}
        />
      </View>
        </ProgressStep>
        
      </ProgressSteps>
    </View>
  );
};

const styles = StyleSheet.create({
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
  pickerLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownOptions: {
    width: '80%',
  },
  dropdownOptionText: {
    fontSize: 16,
    padding: 10,
  },
  container: {
    flex:1,
    padding: 20,
  },
  label:{
    fontSize:16,
    marginHorizontal:5,
    marginTop:10

  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop:10
  },
});

export default ProgressStepsComponent;