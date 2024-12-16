import React, { useReducer, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SelectList } from "@venedicto/react-native-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router, useNavigation } from "expo-router";
import axios from "axios";
import { useUser } from "@/Hooks/userContext";
import { Appbar } from "react-native-paper";
import Toast from "react-native-toast-message";
import { BACKEND_URL } from "@/production.config";
import { Image as SvgImage } from "react-native-svg";

const { width } = Dimensions.get("window");

interface FormData {
  name: string;
  cat: string;
 date:string;
  content: string;
  location: string;
  comments:string;
  image: string | null;
  
}

const initialState: FormData = {
  name: "",
  cat: "",
 date:"",
 location:"",
 comments:"",
  content: "",
  image:null,
  
};

type Action =
  | { type: "SET_FORM_DATA"; payload: Partial<FormData> };
 
 

function reducer(state: FormData, action: Action): FormData {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

const SinglePageForm: React.FC = () => {
  const users = useUser();
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Toast.show({
          type: "error",
          text1: "Permission denied",
          text2: "You need to grant permission to access media.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        dispatch({ type: "SET_FORM_DATA", payload: { image: result.assets[0].uri } });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleSubmit = async () => {
    if (
      !state.name ||
      !state.cat||
 !state.content || !state.date || !state.location || !state.comments 
      
    ) {
      Toast.show({
        type: "error",
        text1: "Some fields are missing",
        text2: "Please fill all the fields",
        visibilityTime: 2000,
      });
      return;
    }
    const formData = new FormData();
    formData.append("name", users.name);
    formData.append("roll_no", users.id);
    formData.append("contact_number", users.phone_number);
    formData.append("email", users.email);
    formData.append("department", users.department);
    formData.append("item_name", state.name);
    formData.append("category", state.cat);
    formData.append("description", state.content);
    formData.append("date_lost", state.date);
    formData.append("last_seen_location", state.location);
    formData.append("comments", state.comments);

    if (state.image) {
      const imageFile = {
        uri: state.image,
        type: "image/jpeg", // Assuming JPEG, change if needed
        name: "lost_item.jpg",
      };
      formData.append("images", imageFile as any);
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/raise_lost_item`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.replace({
        pathname: "/Home/submitPage",
        params: response.data,
      });
    } catch (error: any) {
      console.error("Error during submission:", error);
      Toast.show({
        type: "error",
        text1: "Submission failed",
        text2: "Please try again later.",
      });
    }
  };
 
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Sigma - GMS " />
      </Appbar.Header>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        extraHeight={10}
      >
        <View style={styles.container}>
          <Text style={styles.main}>Lost Item Form</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Item name</Text>
            <TextInput
              style={styles.input}
              placeholder="item name"
              value={state.name}
              onChangeText={(text) =>
                dispatch({ type: "SET_FORM_DATA", payload: { name: text } })
              }
            />
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="category"
              value={state.cat}
              onChangeText={(text) =>
                dispatch({ type: "SET_FORM_DATA", payload: { cat: text } })
              }
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={state.content}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  payload: { content: text },
                })
              }
            />
            <Text style={styles.label}>Date Lost</Text>
            <TextInput
              style={styles.input}
              placeholder="Date Lost"
              value={state.date}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  payload: { date: text },
                })
              }
            />
            <Text style={styles.label}>Last Seen Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Last seen Location"
              value={state.location}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  payload: { location: text },
                })
              }
            />
            <Text style={styles.label}>Comments</Text>
            <TextInput
              style={styles.input}
              placeholder="Comments"
              value={state.comments}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  payload: { comments: text },
                })
              }
            />
           <Text style={styles.label}>Please upload an image in the form of jpeg or png</Text>
            <TextInput
              style={styles.input}
              placeholder="Comments"
              value={state.comments}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_FORM_DATA",
                  payload: { comments: text },
                })
              }
            />
            
  


  
    

              
    <Text style={styles.label}>Content</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter Content Here"
      value={state.content}
      onChangeText={(text) =>
        dispatch({ type: "SET_FORM_DATA", payload: { content: text } })
      }
    />
  


            {/* Conditionally render rating section */}
           

            {/* <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Anonymous Complaints</Text>
              <Switch
                style={styles.switch}
                value={state.anonymous}
                onValueChange={handleSwitchChange}
              />
            </View> */}
              <Text style={styles.label}>Upload an Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
              <Text style={styles.imagePickerText}>
                {state.image ? "Change Image" : "Choose Image"}
              </Text>
            </TouchableOpacity>

            {state.image && (
              <Image source={{ uri: state.image }} style={styles.previewImage} />
            )}
          </View>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <Toast />
    </>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: "2%",
  },
  imagePicker: {
    backgroundColor: "#8283e9",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#fff",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginTop: 10,
  },
  main: {
    fontSize: 20,
    marginTop: Platform.OS === "ios" ? "1%" : "1%",
    marginBottom: "7%",
    fontWeight: "bold",
  },
  formContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginBottom: "10%",
    width: "100%",
  },
  label: {
    fontSize: 15,
    marginBottom: "4%",
  },
  labe: {
    fontSize: 15,
    marginBottom: "2%",
    marginTop: "2%",
  },
  ratingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20, // Adjust spacing between items if needed
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: "2%",
    marginBottom: "5%",
    shadowColor: "#8283e9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  dropdownWrapper: {
    width: "100%",
    marginBottom: "4%",
  },
  ratingContainer: {
    marginTop: 10,
    marginBottom: "5%",
    width: "100%",
  },
  ratingLabel: {
    fontSize: 15,
    marginBottom: "4%",
  },
  lab: {
    fontSize: 20,
    marginBottom: "3%",
  },
  customRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#171717",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCircle: {
    backgroundColor: "#171717",
  },
  circleText: {
    fontSize: 15,
    color: "#4B5563",
  },
  ratingText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 5,
    marginRight: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginTop: Platform.OS === "ios" ? "2%" : 0,
    marginBottom: "3%",
  },

  switchContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5%",
    padding: "1%",
    borderRadius: 5,
  },
  switchLabel: {
    fontSize: 16,
  },
  switch: {
    alignItems: "flex-end",
    marginLeft: "39%",
  },
  submitBtn: {
    backgroundColor: "#8283e9",
    paddingVertical: "3%",
    paddingHorizontal: "3%",
    borderRadius: 5,
    marginTop: "-10%",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: "5%",
  },
});

export default SinglePageForm;
