import React, { useState, useEffect, useContext, useCallback } from "react";
import { ScrollView, View, Image, StyleSheet, Text, TextInput,KeyboardAvoidingView, Platform,  Pressable,  } from "react-native";
import { validateName,validateEmail,validatePhone } from "../utils/validation";
import { AuthContext } from "../contexts/AuthContext";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    image: "",
    orders: false,
    passwords: false,
    offers: false,
    newsletters: false,
  });
  const [discard, setDiscard] = useState(false);
  useEffect(() => {

    (async () => {
      try {
        let firstName =  await AsyncStorage.getItem("firstName");
        let lastName =  await AsyncStorage.getItem("lastName");
        let email =  await AsyncStorage.getItem("email");
        let phoneNumber =  await AsyncStorage.getItem("phoneNumber");
        let image =  await AsyncStorage.getItem("image");
        let orders =  await AsyncStorage.getItem("orders");
        let passwords = await AsyncStorage.getItem("passwords");
        let offers = await AsyncStorage.getItem("offers");
        let newsletters = await AsyncStorage.getItem("newsletters");
     
        setProfile(oldValue=> {return {...oldValue, firstName,lastName,email,phoneNumber,image:image?image:"",orders:orders=="1"?true:false,passwords:passwords=="1"?true:false,offers:offers=="1"?true:false,newsletters:newsletters=="1"?true:false}});
        
        setDiscard(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {

    (async () => {
      try {
        let firstName =  await AsyncStorage.getItem("firstName");
        let lastName =  await AsyncStorage.getItem("lastName");
        let email =  await AsyncStorage.getItem("email");
        let phoneNumber =  await AsyncStorage.getItem("phoneNumber");
        let image =  await AsyncStorage.getItem("image");
        let orders =  await AsyncStorage.getItem("orders");
        let passwords = await AsyncStorage.getItem("passwords");
        let offers = await AsyncStorage.getItem("offers");
        let newsletters = await AsyncStorage.getItem("newsletters");
 
        setProfile(oldValue=> {return {...oldValue, firstName,lastName,email,phoneNumber,image:image?image:"",orders:orders=="1"?true:false,passwords:passwords=="1"?true:false,offers:offers=="1"?true:false,newsletters:newsletters=="1"?true:false}});

        setDiscard(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [discard]);

  const { update } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);

  const updateProfile = (key, value) => {
    setProfile(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const [fontsLoaded] = useFonts({
    "Karla-Medium": require("../assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("../assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
   
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const getIsFormValid = () => {
    return (
      validateName(profile.firstName) &&
      validateName(profile.lastName) &&
      validateEmail(profile.email) &&
      validatePhone(profile.phoneNumber)
    );
  };

  const selectImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setProfile(prevState => ({
        ...prevState,
        ["image"]: result.assets[0].uri,
      }));
    }
  };

  const deleteImage = () => {
    setProfile(prevState => ({
      ...prevState,
      ["image"]: "",
    }));
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      onLayout={onLayoutRootView}
    >
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../img/littleLemonLogo.png")}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.textHeader}>Personal information</Text>
        <Text style={styles.text}>Avatar</Text>
        <View style={styles.avatarView}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarVoid}>
              <Text style={styles.avatarVoidText}>
                {profile.firstName.substring(0,1)+profile.lastName.substring(0,1)}
              </Text>
            </View>
          )}
          <View style={styles.avatarButtons}>
            <Pressable
              style={styles.selectBtn}
              onPress={selectImage}
            >
              <Text style={styles.selectBtnText}>Change</Text>
            </Pressable>
            <Pressable
              style={styles.deleteBtn}
              onPress={deleteImage}
            >
              <Text style={styles.deleteBtnText}>Remove</Text>
            </Pressable>
          </View>
        </View>
        <Text
          style={[
            styles.text,
            validateName(profile.firstName) ? "" : styles.error,
          ]}
        >
          First Name
        </Text>
        <TextInput
          style={styles.input}
          value={profile.firstName}
          onChangeText={newValue => updateProfile("firstName", newValue)}
          placeholder={"First Name"}
        />
        <Text
          style={[
            styles.text,
            validateName(profile.lastName) ? "" : styles.error,
          ]}
        >
          Last Name
        </Text>
        <TextInput
          style={styles.input}
          value={profile.lastName}
          onChangeText={newValue => updateProfile("lastName", newValue)}
          placeholder={"Last Name"}
        />
        <Text
          style={[
            styles.text,
            validateEmail(profile.email) ? "" : styles.error,
          ]}
        >
          Email
        </Text>
        <TextInput
          style={styles.input}
          value={profile.email}
          keyboardType="email-address"
          onChangeText={newValue => updateProfile("email", newValue)}
          placeholder={"Email"}
        />
        <Text
          style={[
            styles.text,
            validatePhone(profile.phoneNumber) ? "" : styles.error,
          ]}
        >
          Phone number 
        </Text>
        <TextInput
          style={styles.input}
          value={profile.phoneNumber}
          keyboardType="phone-pad"
          onChangeText={newValue => updateProfile("phoneNumber", newValue)}
          placeholder={"Phone number"}
        />
        <Text style={styles.headertext}>Email notifications</Text>
        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={profile.orders}
            onValueChange={newValue => updateProfile("orders", newValue)}
            color={"#495e57"}
          />
          <Text style={styles.text}>Order statuses</Text>
        </View>
        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={profile.passwords}
            onValueChange={newValue =>
              updateProfile("passwords", newValue)
            }
            color={"#495e57"}
          />
          <Text style={styles.text}>Password changes</Text>
        </View>
        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={profile.offers}
            onValueChange={newValue => updateProfile("offers", newValue)}
            color={"#495e57"}
          />
          <Text style={styles.text}>Special offers</Text>
        </View>
        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={profile.newsletters}
            onValueChange={newValue => updateProfile("newsletters", newValue)}
            color={"#495e57"}
          />
          <Text style={styles.text}>Newsletter</Text>
        </View>
        <Pressable style={styles.btn} onPress={() => logout()}>
          <Text style={styles.btntext}>Log out</Text>
        </Pressable>
        <View style={styles.buttons}>
          <Pressable style={styles.discardBtn} onPress={() => setDiscard(true)}>
            <Text style={styles.discardBtnText}>Discard changes</Text>
          </Pressable>
          <Pressable
            style={[styles.saveBtn, getIsFormValid() ? "" : styles.btnDisabled]}
            onPress={() => update(profile)}
            disabled={!getIsFormValid()}
          >
            <Text style={styles.saveBtnText}>Save changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#e8e8e8",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  scrollView: {
    flex: 1,
    padding: 10,
  }, 
  textHeader: {
    fontSize: 20,
    paddingBottom: 10,
    fontFamily: "Karla-ExtraBold",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Karla-Medium",
  },
  avatarView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarVoid: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffff00",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarVoidText: {
    fontSize: 30,
    color: "#000000",
    fontWeight: "bold",
  },
  avatarButtons: {
    flexDirection: "row",
  },
  selectBtn: {
    backgroundColor: "#495e57",
    borderRadius: 10,
    marginHorizontal: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f524b",
  },
  deleteBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f524b",
  },
  selectBtnText: {
    fontSize: 16,
    color: "#FFFFFF",
    alignSelf: "center",
    fontFamily: "Karla-Bold",
  },

  deleteBtnText: {
    fontSize: 16,
    color: "#495e57",
    alignSelf: "center",
    fontFamily: "Karla-Bold",
  },
  input: {
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
    borderRadius: 9,
    borderColor: "#b5b5b5",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 10,
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderRadius: 10,
    alignSelf: "stretch",
    marginVertical: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cc9a22",
  },
  btnDisabled: {
    backgroundColor: "#98b3aa",
  },
  btntext: {
    fontSize: 16,
    color: "#3e524b",
    fontFamily: "Karla-Bold",
    alignSelf: "center",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#495e57",
    borderRadius: 10,
    alignSelf: "stretch",
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f524b",
  },
  saveBtnText: {
    fontSize: 16,
    color: "#FFFFFF",
    alignSelf: "center",
    fontFamily: "Karla-Bold",
  },
  discardBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignSelf: "stretch",
    marginRight: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#83918c",
  },
  discardBtnText: {
    fontSize: 16,
    color: "#3f524b",
    alignSelf: "center",
    fontFamily: "Karla-Bold",
  },
  error: {
    color: "#ff0000",
    fontWeight: "bold",
  },


});

export default Profile;
