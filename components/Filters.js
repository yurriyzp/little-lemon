import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: selections[index] ? "#495e57" : "#e8e8e8",
            borderRadius: 10,
            marginRight: 10,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Karla-ExtraBold",
                color: selections[index] ? "#e8e8e8" : "#495e57",
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingLeft: 20,
  },
});

export default Filters;
