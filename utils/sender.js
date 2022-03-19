import axios from "axios";

export function sender(param) {
  axios({
    method: 'post',
    url:"https://swiitch-bukar.herokuapp.com/api/user",
    data: param
  }).then((response)=>{
    console.log(response);
  }).catch((error)=>{
    console.log(error);
  })
}
