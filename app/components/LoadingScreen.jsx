import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { fontSizes, fontWeights } from "../styles/global";

const SOURCE = require("../assets/slow-zoom-in-on-the-mountain-peak-and-path-no-peop.mp4");
const { width, height } = Dimensions.get("window");

const VIDEO_ASPECT = 9 / 16;
const videoWidth = height * VIDEO_ASPECT;

export default function LoadingScreen({ onReady }) {
  const player = useVideoPlayer(SOURCE);
  const opacity = useRef(new Animated.Value(1)).current;

  player.loop = true;
  player.muted = true;

  useEffect(() => {
    player.play();
  }, []);

  useEffect(() => {
    if (!onReady) return;
    Animated.timing(opacity, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(onReady);
  }, [onReady]);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.videoWrapper}>
        <VideoView player={player} style={styles.video} contentFit="cover" nativeControls={false} />
      </View>
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>75XP</Text>
        <Text style={styles.subtitle}>connecting...</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 100,
  },
  videoWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: (width - videoWidth) / 2,
    width: videoWidth,
  },
  video: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 64,
    fontWeight: fontWeights.bold,
    color: "#FFFFFF",
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: "rgba(255,255,255,0.6)",
    fontWeight: fontWeights.medium,
    letterSpacing: 2,
  },
});
