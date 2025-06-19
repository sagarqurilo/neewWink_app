import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URl = "https://winkapi.qurilo.com"; // Replace with your actual API URL
export const token = async () => {
  const token = await AsyncStorage.getItem("token");
  return token;
};