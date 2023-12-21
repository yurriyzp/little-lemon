import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import Onboarding from "./screens/OnBoarding";
import Profile from "./screens/Profile";
import SplashScreen from "./screens/SplashScreen";
import Home from "./screens/Home";
import { StatusBar } from "expo-status-bar";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "./contexts/AuthContext";

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  const [loading,setLoading]=useState(true);
  const [onBoard,setOnBoard]=useState(false);
 

  useEffect(() => {
    (async () => {

      let filled=false;
      try {
        let firstName =  await AsyncStorage.getItem("firstName");
        let lastName =  await AsyncStorage.getItem("lastName");
        if (firstName&&lastName) filled=true;
      } catch (e) {
        console.error(e);
      } finally {
        if (filled) {
          setLoading(false);
          setOnBoard(true);
        } else {
          setLoading(false);
          setOnBoard(false);
        }
      }
    })();
  }, []);

  const authContext = useMemo(
    () => ({
      onboard: async data => {
        try {
          await AsyncStorage.setItem("firstName",data.firstName);
          await AsyncStorage.setItem("lastName",data.lastName);
          await AsyncStorage.setItem("email",data.email);
          await AsyncStorage.setItem("phoneNumber",data.phoneNumber);
          await AsyncStorage.setItem("image",data.image);
         
        } catch (e) {
          console.error(e);
        }

        setLoading(false);
        setOnBoard(true);
      },
      update: async data => {
        try {
          await AsyncStorage.setItem("firstName",data.firstName);
          await AsyncStorage.setItem("lastName",data.lastName);
          await AsyncStorage.setItem("email",data.email?data.email:"");
          await AsyncStorage.setItem("phoneNumber",data.phoneNumber);
          await AsyncStorage.setItem("image",data.image);
          await AsyncStorage.setItem("orders",data.orders?"1":"0");
          await AsyncStorage.setItem("passwords",data.passwords?"1":"0");
          await AsyncStorage.setItem("offers",data.offers?"1":"0");
          await AsyncStorage.setItem("newsletters",data.newsletters?"1":"0");
        } catch (e) {
          console.error(e);
        }

        Alert.alert("Success", "Successfully saved changes!");
      },
      logout: async () => {
        try {
          await AsyncStorage.clear();
        } catch (e) {
          console.error(e);
        }

        setLoading(false);
        setOnBoard(false);
      },
    }),
    []
  );

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          {onBoard ? (
            <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
