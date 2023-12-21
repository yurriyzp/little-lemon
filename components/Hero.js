
import {  View,  Text, StyleSheet,  Image, } from "react-native";

const Hero=()=>{
    return (
<View style={styles.container}>
<Text style={styles.header}>Little Lemon</Text>
<View style={styles.body}>
  <View style={styles.content}>
    <Text style={styles.subheader}>Chicago</Text>
    <Text style={styles.text}>
      We are a family owned Mediterranean restaurant, focused on
      traditional recipes served with a modern twist.
    </Text>
  </View>
  <Image
    style={styles.image}
    source={require("../img/restauranfood.png")}
    accessible={true}
    accessibilityLabel={"Little Lemon Food"}
  />
</View>
</View>
)
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#495e57",
        padding: 15,
      },
     header: {
        color: "#f4ce14",
        fontSize: 54,
        fontFamily: "MarkaziText-Medium",
      },
      body: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
      subheader: {
        color: "#fff",
        fontSize: 30,
        fontFamily: "MarkaziText-Medium",
      },
      text: {
        color: "#fff",
        fontFamily: "Karla-Medium",
        fontSize: 14,
      },
     content: {
        flex: 1,
      },
      image: {
        width: 100,
        height: 100,
        borderRadius: 15,
      },
  });
  export default Hero;
