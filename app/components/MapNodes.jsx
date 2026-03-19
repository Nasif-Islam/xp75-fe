import { View, StyleSheet } from "react-native";
import ReflectionModal from "./ReflectionModal";
import { mockReflections } from "../mockData/reflectionsData";

export default function MapNodes({ imgWidth, imgHeight }) {
  const columns = 10;
  const rows = 80;

  const cellWidth = imgWidth / columns;
  const cellHeight = imgHeight / rows;

  const latestDayId = Math.max(...mockReflections.map((r) => r.day_id));
  const toCell = (row, col) => ({
    position: "absolute",
    left: (col - 1) * cellWidth,
    top: (row - 1) * cellHeight,
    width: cellWidth,
    height: cellHeight,
    justifyContent: "center",
    alignItems: "center",
  });

  const gridItems = [
    { dayId: 1, row: 80, col: 5 },
    { dayId: 2, row: 79, col: 6 },
    { dayId: 3, row: 78, col: 7 },
    { dayId: 4, row: 77, col: 8 },
    { dayId: 5, row: 76, col: 7 },
    { dayId: 6, row: 75, col: 6 },
    { dayId: 7, row: 74, col: 5 },
    { dayId: 8, row: 73, col: 4 },
    { dayId: 9, row: 72, col: 3 },
    { dayId: 10, row: 71, col: 4 },
    { dayId: 11, row: 70, col: 5 },
    { dayId: 12, row: 69, col: 6 },
    { dayId: 13, row: 68, col: 7 },
    { dayId: 14, row: 67, col: 8 },
    { dayId: 15, row: 66, col: 7 },
    { dayId: 16, row: 65, col: 6 },
    { dayId: 17, row: 64, col: 5 },
    { dayId: 18, row: 63, col: 4 },
    { dayId: 19, row: 62, col: 3 },
    { dayId: 20, row: 61, col: 4 },
    { dayId: 21, row: 60, col: 5 },
    { dayId: 22, row: 59, col: 6 },
    { dayId: 23, row: 58, col: 7 },
    { dayId: 24, row: 57, col: 8 },
    { dayId: 25, row: 56, col: 7 },
    { dayId: 26, row: 55, col: 6 },
    { dayId: 27, row: 54, col: 5 },
    { dayId: 28, row: 53, col: 4 },
    { dayId: 29, row: 52, col: 3 },
    { dayId: 30, row: 51, col: 4 },
    { dayId: 31, row: 50, col: 5 },
    { dayId: 32, row: 49, col: 6 },
    { dayId: 33, row: 48, col: 7 },
    { dayId: 34, row: 47, col: 8 },
    { dayId: 35, row: 46, col: 7 },
    { dayId: 36, row: 45, col: 6 },
    { dayId: 37, row: 44, col: 5 },
    { dayId: 38, row: 43, col: 4 },
    { dayId: 39, row: 42, col: 3 },
    { dayId: 40, row: 41, col: 4 },
    { dayId: 41, row: 40, col: 5 },
    { dayId: 42, row: 39, col: 6 },
    { dayId: 43, row: 38, col: 7 },
    { dayId: 44, row: 37, col: 8 },
    { dayId: 45, row: 36, col: 7 },
    { dayId: 46, row: 35, col: 6 },
    { dayId: 47, row: 34, col: 5 },
    { dayId: 48, row: 33, col: 4 },
    { dayId: 49, row: 32, col: 3 },
    { dayId: 50, row: 31, col: 4 },
    { dayId: 51, row: 30, col: 5 },
    { dayId: 52, row: 29, col: 6 },
    { dayId: 53, row: 28, col: 7 },
    { dayId: 54, row: 27, col: 8 },
    { dayId: 55, row: 26, col: 7 },
    { dayId: 56, row: 25, col: 6 },
    { dayId: 57, row: 24, col: 5 },
    { dayId: 58, row: 23, col: 4 },
    { dayId: 59, row: 22, col: 3 },
    { dayId: 60, row: 21, col: 4 },
    { dayId: 61, row: 20, col: 5 },
    { dayId: 62, row: 19, col: 6 },
    { dayId: 63, row: 18, col: 7 },
    { dayId: 64, row: 17, col: 8 },
    { dayId: 65, row: 16, col: 7 },
    { dayId: 66, row: 15, col: 6 },
    { dayId: 67, row: 14, col: 5 },
    { dayId: 68, row: 13, col: 4 },
    { dayId: 69, row: 12, col: 3 },
    { dayId: 70, row: 11, col: 4 },
    { dayId: 71, row: 10, col: 5 },
    { dayId: 72, row: 9, col: 6 },
    { dayId: 73, row: 8, col: 6 },
    { dayId: 74, row: 7, col: 6 },
    { dayId: 75, row: 5, col: 6 },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {gridItems.map(({ dayId, row, col }) => (
        <View key={dayId} style={toCell(row, col)}>
          <ReflectionModal
            dayId={dayId}
            userId={1}
            isLatest={dayId === latestDayId}
          />
        </View>
      ))}
    </View>
  );
}
