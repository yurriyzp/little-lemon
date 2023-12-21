import React, { useState, useRef, useContext, useCallback } from "react";
import { View, Image,  StyleSheet, Text, TextInput, Pressable,KeyboardAvoidingView, Platform,} from "react-native";
import * as ImagePicker from "expo-image-picker";
import PagerView from "react-native-pager-view";
import { AuthContext } from "../contexts/AuthContext";
import { validateEmail, validateName, validatePhone } from "../utils/validation";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Hero from "../components/Hero";

const Onboarding = () => {
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [phoneNumber,onChangePhoneNumber]=useState("");
  const [image,setImage]=useState("");

  const isEmailValid = validateEmail(email);
  const isPhoneNumberValid=validatePhone(phoneNumber);
  const isFirstNameValid = validateName(firstName);
  const isLastNameValid = validateName(lastName);
  const viewPagerRef = useRef(PagerView);

  const { onboard } = useContext(AuthContext);

  const [fontsLoaded] = useFonts({
    "Karla-ExtraBold": require("../assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Medium": require("../assets/fonts/MarkaziText-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    };

    const deleteImage = () => {
      setImage("");
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
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
      </View>
      <Hero/>
      <Text style={styles.welcome}>
        Welcome, enter your data!
      </Text>
       <PagerView
        style={styles.viewPager}
        scrollEnabled={false}
        initialPage={0}
        ref={viewPagerRef}
      >
        <View style={styles.page} key="1">
          <View style={styles.pageContainer}>
            <Text style={styles.text}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={onChangeFirstName}
              placeholder={"First Name"}
            />
             <Text style={styles.text}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={onChangeLastName}
              placeholder={"Last Name"}
            />
          </View>
          <View style={styles.progress}>
            <View style={[styles.circle, styles.circleActive]}></View>
            <View style={styles.circle}></View>
            <View style={styles.circle}></View>
          </View>
          <Pressable
            style={[styles.btn, (isFirstNameValid&&isLastNameValid) ? "" : styles.btnDisabled]}
            onPress={() => viewPagerRef.current.setPage(1)}
            disabled={!isFirstNameValid}
          >
            <Text style={styles.btntext}>Next</Text>
          </Pressable>
        </View>
     
        <View style={styles.page} key="2">
         
          <View style={styles.pageContainer}>
          <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={onChangeEmail}
              placeholder={"Email"}
              keyboardType="email-address"
            />
             <Text style={styles.text}>Phone Number-10 digits</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={onChangePhoneNumber}
              placeholder={"Phone Number"}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.progress}>
            <View style={styles.circle}></View>
            <View style={[styles.circle, styles.circleActive]}></View>
            <View style={styles.circle}></View>
          </View>
          <View style={styles.buttons}>
            <Pressable
              style={styles.btnSmall}
              onPress={() => viewPagerRef.current.setPage(0)}
            >
              <Text style={styles.btntext}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.btnSmall, (isEmailValid && isPhoneNumberValid) ? "" : styles.btnDisabled]}
              onPress={() => viewPagerRef.current.setPage(2)}
              disabled={!(isEmailValid && isPhoneNumberValid)}
            >
              <Text style={styles.btntext}>Next</Text>
            </Pressable>
          </View>
       </View>
       <View style={styles.page} key="3">
         
         <View style={styles.pageContainer}>
         <Text style={styles.text}>Avatar</Text>
         {image ? (
            <Image source={{ uri: image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarVoid}>
              <Text style={styles.avatarVoidText}>
                {firstName.substring(0,1)+lastName.substring(0,1)}
              </Text>
            </View>
          )}
         <View style={styles.avatarView}>
         
          <View style={styles.avatarButtons}>
            <Pressable
              style={styles.selectBtn}
              onPress={selectImage}
            >
              <Text style={styles.selectBtnText}>Select</Text>
            </Pressable>
            <Pressable
              style={styles.deleteBtn}
              onPress={deleteImage}
            >
              <Text style={styles.deleteBtnText}>Remove</Text>
            </Pressable>
          </View>
        </View>
        
         </View>
         <View style={styles.progress}>
           <View style={styles.circle}></View>
           <View style={styles.circle}></View>
           <View style={[styles.circle, styles.circleActive]}></View>
         </View>
         <View style={styles.buttons}>
           <Pressable
             style={styles.btnSmall}
             onPress={() => viewPagerRef.current.setPage(1)}
           >
             <Text style={styles.btntext}>Back</Text>
           </Pressable>
           <Pressable
             style={styles.btnSmall}
             onPress={() => onboard({ firstName, lastName, email, phoneNumber, image })}
             disabled={!(isEmailValid && isPhoneNumberValid)}
           >
             <Text style={styles.btntext}>Submit</Text>
           </Pressable>
         </View>
      </View>
         
      </PagerView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#e8e8e8",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  welcome:{
    fontSize: 28,
    paddingVertical: 30,
    fontFamily: "Karla-ExtraBold",
    color: "#495E57",
    textAlign: "center",
  },    
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 26,
    fontFamily: "MarkaziText-Medium",
    color: "#495E57",
  },
  input: {
    borderColor: "#dee3e9",
    backgroundColor: "#e8e8e8",
    alignSelf: "stretch",
    height: 40,
    margin: 20,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    borderRadius: 10,
    fontFamily: "MarkaziText-Medium",
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderColor: "#f4ce14",
    borderRadius: 10,
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginBottom: 50,
    padding: 10,
    borderWidth: 1,
  },
  btnDisabled: {
    backgroundColor: "#e8e8e8",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
    marginBottom: 50,
  },
  btnSmall: {
    flex: 1,
    borderColor: "#f4ce14",
    backgroundColor: "#f4ce14",
    borderRadius: 10,
    alignSelf: "stretch",
    marginRight: 20,
    padding: 10,
    borderWidth: 1,
  },
  btntext: {
    fontSize: 26,
    color: "#495E57",
    fontFamily: "MarkaziText-Medium",
    alignSelf: "center",
  },
  progress: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  circle: {
    backgroundColor: "#495E57",
    width: 30,
    height: 30,
    marginHorizontal: 10,
    borderRadius: 15,
  },
  circleActive: {
    backgroundColor: "#f4ce14",
    width: 30,
    height: 30,
    borderRadius: 15,
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
    backgroundColor: "#F4CE14",
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
    borderColor: "#3f554d",
  },
  deleteBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#83918c",
  },
  selectBtnText: {
    fontSize: 16,
    color: "#FFFFFF",
    alignSelf: "center",
    fontFamily: "Karla-Bold",
  },

  deleteBtnText: {
    fontSize: 16,
    color: "#34463f",
    alignSelf: "center",
    fontFamily: "Karla-Bold",
  },
});

export default Onboarding;
