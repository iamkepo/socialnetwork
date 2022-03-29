import axios from "axios";
import * as FileSystem from 'expo-file-system';

const baseURL = "http://192.168.117.26:3000";

export function checkversion(param) {
  return axios({
    method: 'get',
    url: baseURL+"/version/"+param,
  })
}

export function getposts(param) {
  return axios({
    method: 'get',
    url: baseURL+"/posts/"+ (param ? param : "")
  })
}

export async function upload(data) {
  var date = Date.now();
  await FileSystem.uploadAsync(baseURL+'upload', data.uri, {
    httpMethod: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      name : "user",
    },
    sessionType : FileSystem.FileSystemSessionType.BACKGROUND,
    uploadType : FileSystem.FileSystemUploadType.BINARY_CONTENT,
    fieldName : "test",
    mimeType : "png",
    parameters : "*/*",
  })
  .then( (response)=> {
    console.log(response);
  })
  .catch( (error)=> {
    console.log(error);
  });
}
