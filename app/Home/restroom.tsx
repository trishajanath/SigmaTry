import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, Dimensions } from 'react-native';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import ModalDropdown from "react-native-modal-dropdown";

const { width } = Dimensions.get("window");

const ProgressStepsComponent = () => {
  const [step1Data, setStep1Data] = useState({ name: '', number: '', restroom: '' });
  const [step2Data, setStep2Data] = useState({ content: '', anonymous: false });
  const [selectedOptionType, setSelectedOptionType] = useState('Select Type');
  const [selectedOptionDomain, setSelectedOptionDomain] = useState('Select Domain');
  const [restroom, setrestroom] = useState('Select Option');
  const handleSwitchChange = (value: boolean) => {
    setStep2Data({ ...step2Data, anonymous: value });
  };

  return (
    
    <View style={styles.container}>
      
      <ProgressSteps
        activeStepIconBorderColor="#a2c2e8"
        activeStepIconColor="#e9f7ff"
        completedStepIconColor="#a2c2e8"
        activeLabelColor="#a2c2e8"
        completedProgressBarColor="#a2c2e8"
        progressBarColor="#eeecef"
        activeStepIconContainer={styles.activeStepIconContainer}
        completedStepIconContainer={styles.completedStepIconContainer}
      >
        
        <ProgressStep label="" nextBtnStyle={styles.nextBtn} previousBtnStyle={styles.previousBtn}>
        <Text style={styles.main}>Restroom</Text>
          <View style={styles.stepContainer}>
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
            <Text style={styles.label}>Restroom</Text>
            <ModalDropdown
              options={["Gents", "Ladies", "Differently Abled"]}
              defaultValue={restroom}
              onSelect={(index, value) => setrestroom(value)}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownOptions}
              dropdownTextStyle={styles.dropdownOptionText}
            />
          </View>
        </ProgressStep>
        <ProgressStep label="" nextBtnStyle={styles.nextBtn} previousBtnStyle={styles.previousBtn}>
          <View style={styles.stepContainer}>
            <Text style={styles.pickerLabel}>Type</Text>
            <ModalDropdown
              options={["Complaint", "Feedback"]}
              defaultValue={selectedOptionType}
              onSelect={(index, value) => setSelectedOptionType(value)}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownOptions}
              dropdownTextStyle={styles.dropdownOptionText}
            />
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.pickerLabel}>Domain</Text>
            <ModalDropdown
              options={["Cleaning", "Plumbing", "Civil & Carpentry", "Electrical", "Others"]}
              defaultValue={selectedOptionDomain}
              onSelect={(index, value) => setSelectedOptionDomain(value)}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownOptions}
              dropdownTextStyle={styles.dropdownOptionText}
            />
          </View>
          <View style={styles.stepContainer}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={step2Data.content}
              onChangeText={text => setStep2Data({ ...step2Data, content: text })}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Anonymous Replies</Text>
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
  main: {
    fontSize:20,
    textAlign:"center",
    marginBottom:'10%'
  },
  nextBtn: {
    marginTop: -25, 
  },
  previousBtn: {
    marginTop: -20, 
  },
  activeStepIconContainer: {
    marginTop: -10, 
  },
  completedStepIconContainer: {
    marginTop: -10, 
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: '2%',
    padding: '2%',
    borderRadius: 5,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Raleway_200ExtraLight'
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: '2%',
    textAlign: 'left', // Align text to the left
  },
  stepContainer: {
    alignItems: 'flex-start', // Align items to the left
    justifyContent: 'center',
    marginBottom: '5%',
    width: '100%',
  },
  dropdown: {
    width: '100%',
    height: width * 0.15,
    marginTop: '2%',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#a2c2e8',
    borderRadius: 10,
    paddingHorizontal: '5%',
    marginBottom: '2%',
    textAlign: 'left',
    justifyContent: 'center'
  },
  dropdownText: {
    fontSize: 16,
    textAlign: 'left',
  },
  dropdownOptions: {
    width: '80%',
    backgroundColor: '#f5f5f5',
  },
  dropdownOptionText: {
    fontSize: 16,
    paddingLeft: '5%',
    textAlign: 'left',
  },
  container: {
    flex: 1,
    padding: '5%',
  },
  label: {
    fontSize: 16,
    marginBottom:'1%'
  },
  input: {
    width: '100%',
    height: width * 0.15,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#a2c2e8',
    borderRadius: 10,
    paddingHorizontal: '5%',
    marginBottom: '4%',
    marginTop: '4%',
  },
});

export default ProgressStepsComponent;
