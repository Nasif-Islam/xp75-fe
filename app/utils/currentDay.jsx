import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";

export default function CurrentDay() {
  const { accessToken } = useUserContext();
  const [data, setData] = useState([]);
  const [err, setErr] = useState(null);

  let latestDayId = 0;
  if (data.length > 0) {
    latestDayId = Math.max(...data.map((day) => day.day_number));
  }

  useEffect(() => {
    if (!accessToken) return;
    const asyncFetchDay = async () => {
      try {
        const response = await axios.get(
          `https://xp75-be.onrender.com/api/days/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const result = response.data;

        setData(result.days);
      } catch (error) {
        setErr(error);
        console.log(error);
      }
    };
    asyncFetchDay();
  }, []);

  return latestDayId;
}
