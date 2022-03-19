import AsyncStorage from "@react-native-async-storage/async-storage";

async function setsession (key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
async function mergesession (key, value) {
  await AsyncStorage.mergeItem(key, JSON.stringify(value));
}
export async function getsession (key) {
  const jsonValue = await AsyncStorage.getItem(key);
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}
export async function session(key, value) {
  let list = await getsession(key).then(()=>{
    if (list != null && list != undefined) {
      mergesession (key, value)
    } else {
      setsession (key, value)
    }
    //return value;
  })
}
