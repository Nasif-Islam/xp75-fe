import { useEffect, useState } from "react";

const BASE_URL = "https://xp75-be.onrender.com";

export const useApiStatus = () => {
  const [apiStatus, setApiStatus] = useState("checking...");

  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 4700));
    const apiCheck = fetch(`${BASE_URL}/api/version`)
      .then((res) => res.json())
      .then(() => "connected")
      .catch(() => "unreachable");

    Promise.all([minDelay, apiCheck]).then(([, status]) => {
      setApiStatus(status === "connected" ? "API connected ✓" : "API unreachable ✗");
    });
  }, []);

  return apiStatus;
};
