import { useEventListener } from "expo";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import { Modal, StyleSheet, View } from "react-native";

const VIDEOS = {
  balloon: require("../assets/add-a-character-in-a-hot-air-balloon-floating-upwa.mp4"),
  bronze: require("../assets/bronze-achievement-medal-flying-into-frame-like-a-.mp4"),
  silver: require("../assets/silver-achievement-medal-shooting-into-frame-like-.mp4"),
  gold: require("../assets/gold-achievement-medal-shooting-into-frame-like-a-.mp4"),
};

function getVideoForDay(dayNumber) {
  if (dayNumber === 75) return VIDEOS.gold;
  if (dayNumber === 50) return VIDEOS.silver;
  if (dayNumber === 25) return VIDEOS.bronze;
  return VIDEOS.balloon;
}

export default function SubmitSuccessModal({ visible, onClose, dayNumber }) {
  const source = getVideoForDay(dayNumber);
  const player = useVideoPlayer(source);
  player.loop = false;
  player.muted = true;

  useEffect(() => {
    if (visible) {
      player.replay();
    }
  }, [visible]);

  useEventListener(player, "playToEnd", () => {
    onClose();
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
