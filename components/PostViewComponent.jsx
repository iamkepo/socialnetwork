import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from 'react-native-vector-icons';

import { normalize } from "../utils/fonts";

const screen = Dimensions.get("screen");

export default function PostViewComponent(props) {
  const [heart, setheart] = React.useState(false);
  const [dislike, setdislike] = React.useState(false);
  const [send, setsend] = React.useState(false);

  return (
    <View style={styles.posts}>
      <Image source={{uri: props.post.uri}} style={{ resizeMode: "contain", width: "100%", height: "100%"}} />
      <View style={styles.boxaction}>
        <TouchableOpacity disabled={heart || dislike ? true : false} onPress={()=> setheart(true)}>
          <Ionicons name="heart" size={30} color={heart ? "#F00" : "#FFF"}/>
        </TouchableOpacity>
        <TouchableOpacity disabled={heart || dislike ? true : false} onPress={()=> setdislike(true)}>
          <Ionicons name="heart-dislike" size={30} color={dislike ? "#F00" : "#FFF"}/>
        </TouchableOpacity>
        <TouchableOpacity disabled={send ? true : false} onPress={()=> setsend(true)}>
          <FontAwesome name="send" size={30} color={send ? "#F00" : "#FFF"}/>
        </TouchableOpacity>
      </View>
      <Text style={styles.text} >{props.post.title}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  posts: {
    width: screen.width,
    height: screen.height-110,
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "space-between",
    // borderWidth: 1,
    // borderColor: "#FFF",
    marginBottom: 70,
    position: "relative"
  },
  text: {
    fontSize: normalize(15),
    color: "#FFF",
    position: "absolute",
    bottom: 50,
  },
  boxaction: {
    width: 60,
    height: "40%",
    borderRadius: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "space-evenly",
    position: "absolute",
    bottom: 100,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  }
});
