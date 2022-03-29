import axios from "axios";
import * as FileSystem from 'expo-file-system';

export function checkversion(param) {
  return axios({
    method: 'get',
    url:"https://api-socialnet.herokuapp.com/version/"+param,
  })
}

export function senderPost(url, data) {
  axios({
    method: 'post',
    url: url,
    data: data
  }).then((response)=>{
    console.log(response);
  }).catch((error)=>{
    console.log(error);
  })
}

export async function upload(data) {
  var date = Date.now();
  await FileSystem.uploadAsync('http://192.168.206.26:3000/upload', data.uri, {
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
