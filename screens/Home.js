import { useEffect, useState, useCallback, useMemo, useRef} from "react";
import {  View,  Text, StyleSheet, SectionList, Alert, Image, Pressable,} from "react-native";
import { Searchbar } from "react-native-paper";
import { createTable, saveMenuItems, getMenuItems, getSectionListData,filterByQueryAndCategories} from "../utils/db";
import Filters from "../components/Filters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import debounce from "lodash.debounce";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Hero from "../components/Hero";

const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

const sections = ["starters", "mains", "desserts"];

const Item = ({ name, price, description, image }) => (
  <View style={styles.item}>
    <View style={styles.itemBody}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description.substring(0,80)}{description.length>=80?"...":""}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
    <Image
      style={styles.itemImage}
      source={{
        uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
      }}
    />
  </View>
);

const Home = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    image: "",
 });
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      const menu = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category,
      }));
      return menu;
    } catch (error) {
      console.error(error);
    } 
  };
  useEffect(() => {
    (async () => {
      let menuItems = [];
      try {
        await createTable();
        menuItems = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
        const image= await AsyncStorage.getItem("image");
        const firstName=await AsyncStorage.getItem("firstName");
        const lastName=await AsyncStorage.getItem("lastName");
        setProfile({image:image,firstName:firstName,lastName:lastName});
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);
 const useUpdateEffect=(effect, dependencies = []) => {
    const isInitialMount = useRef(true);
    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        return effect();
      }
    }, dependencies);
  };



  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every(item => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback(q => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = text => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async index => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
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

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../img/littleLemonLogo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
        <Pressable
          style={styles.avatarBtn}
          onPress={() => navigation.navigate("Profile")}
        >
          {(profile&&profile.image) ? (
            <Image source={{ uri: profile.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarVoid}>
              <Text style={styles.avatarVoidText}>
                {profile&&profile.firstName.substring(0,1)}
                {profile&&profile.lastName.substring(0,1)}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      <Hero/>
      <View style={styles.search}>
      <Searchbar
          placeholder="Search"
          placeholderTextColor="#433c3c"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor="#433c3c"
          inputStyle={{ color: "#433c3c" }}
          elevation={0}
        />
        </View>      
      <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <SectionList
        style={styles.sectionList}
        sections={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Item
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
          />
        )}
        renderSectionHeader={({ section: { category } }) => (
          <Text style={styles.itemHeader}>{category.substring(0,1).toUpperCase()+category.substring(1)}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Constants.statusBarHeight,
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
  sectionList: {
    paddingHorizontal: 20,
  },
  search:{
    backgroundColor: "#495e57",
      },
  searchBar: {
    marginVertical: 10,
    backgroundColor: "#e8e8e8",
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#848181",
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 10,
    color: "#495e57",
    backgroundColor: "#fff",
    fontFamily: "Karla-ExtraBold",
  },
  name: {
    fontSize: 20,
    color: "#000000",
    paddingBottom: 5,
    fontFamily: "Karla-Bold",
  },
  description: {
    color: "#495e57",
    paddingRight: 5,
    fontFamily: "Karla-Medium",
  },
  price: {
    fontSize: 20,
    color: "#495e57",
    paddingTop: 5,
    fontFamily: "Karla-Medium",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarBtn: {
    flex: 1,
    position: "absolute",
    right: 10,
    top: 10,
  },
  avatarVoid: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F4CE14",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarVoidText: {
    fontSize:20,
    fontFamily: "Karla-ExtraBold",
  },
 
  delivery: {
    fontSize: 18,
    padding: 10,
    fontFamily: "Karla-ExtraBold",
  },
});

export default Home;
