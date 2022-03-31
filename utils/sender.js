import axios from "axios";
import * as FileSystem from 'expo-file-system';

const baseURL = "http://192.168.100.26:3000";
// const baseURL = "https://api-socialnet.herokuapp.com";
export function checkversion() {
  return axios({
    method: 'get',
    url: baseURL+"/version/0.0.1",
  })
}

export function getposts(param) {
  return axios({
    method: 'get',
    url: baseURL+"/posts/"+ (param ? param : "")
  })
}

export async function upload({file, user, description }) {
  if (file.uri[0] != "h") {
    return await FileSystem.uploadAsync(''+baseURL+'/upload', file.uri, {
      httpMethod: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        source_id : file.source_id ? file.source_id : user.id,
        user_id : user.id,
        description : description,
        type : file.type,
      },
      sessionType : FileSystem.FileSystemSessionType.BACKGROUND,
      uploadType : FileSystem.FileSystemUploadType.BINARY_CONTENT,
      fieldName : "test",
      mimeType : file.type == 'image' ? "png" : "mp4",
      parameters : "*/*",
    })
  }else{
    return axios({
      method: 'post',
      url: baseURL+"/repost",
      data: {
        source_id : file.source_id,
        user_id : user.id,
        description : description,
        uri: file.uri,
        type : file.type,
      }
    })
  }

}
