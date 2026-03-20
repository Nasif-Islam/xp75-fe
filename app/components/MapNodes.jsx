import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useUserContext } from "../context/UserContext";
import { gridItems } from "./GridLayout";
import ReflectionModal from "./ReflectionModal";
export default function MapNodes({ imgWidth, imgHeight }) {
  const { accessToken } = useUserContext();
  const [data, setData] = useState([]);
  const [err, setErr] = useState(null);

  const columns = 10;
  const rows = 80;

  const cellWidth = imgWidth / columns;
  const cellHeight = imgHeight / rows;

  let latestDayId = 0;
  if (data.length > 0) {
    latestDayId = Math.max(...data.map((day) => day.day_number));
  }

  const toCell = (row, col) => ({
    position: "absolute",
    left: (col - 1) * cellWidth,
    top: (row - 1) * cellHeight,
    width: cellWidth,
    height: cellHeight,
    justifyContent: "center",
    alignItems: "center",
  });

  useEffect(() => {
    if (!accessToken) return;
    const asyncFetchDay = async () => {
      try {
        const response = await axios.get(`https://xp75-be.onrender.com/api/days/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = response.data;
        setData(Array.isArray(result) ? result : [result]);
      } catch (error) {
        setErr(error);
        console.log(error);
      }
    };
    asyncFetchDay();
  }, [accessToken]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {gridItems.map(({ dayId, row, col }) => (
        <View key={dayId} style={toCell(row, col)}>
          <ReflectionModal dayId={dayId} isLatest={dayId === latestDayId} data={data} />
        </View>
      ))}
    </View>
  );
}
