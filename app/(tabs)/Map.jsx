import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  Pressable,
} from "react-native";

import MapNodes from "../components/MapNodes";

const image = require("../assets/mountain-peak-with-sun.jpeg");
const { width } = Dimensions.get("window");

const imgWidth = width;
const imgHeight = width * 8;

export default function GridOverlay() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <MapNodes imgHeight={imgHeight} imgWidth={imgWidth} />
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  image: {
    width: imgWidth,
    height: imgHeight,
  },
});
