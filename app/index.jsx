import { Redirect } from "expo-router";
import { useUserContext } from "./context/UserContext";
export default function Index() {
  const { user } = useUserContext();
  return user ? <Redirect href="HomeScreen" /> : <Redirect href="Login" />;
}
