import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from 'react-native-vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, AVPlaybackStatus } from 'expo-av';

import { normalize } from "../utils/fonts";

const screen = Dimensions.get("screen");

export default function PostViewComponent(props) {
  const [heart, setheart] = React.useState(false);
  const [dislike, setdislike] = React.useState(false);
  const [share, setshare] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [play, setplay] = React.useState(false);

  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        props.post.uri,
        { time: 1 }
      );
      setImage(uri);
    } catch (e) {
      generateThumbnail()
    }
  };
  React.useEffect(() => {
    generateThumbnail()
  }, []);

  return (
    <View style={styles.posts}>

      {
        props.post.type == "image" ?
        <Image source={{uri: props.post.uri}} style={{ resizeMode: "contain", width: "100%", height: "100%"}} />
        :
        image &&
        play ?
        <TouchableOpacity
          onPressIn={() => video.current.pauseAsync()}
          onPressOut={() => video.current.playAsync()}
          style={{ width: "100%", height: "100%"}}
        >
          <Video
            ref={video}
            style={{ width: "100%", height: "100%"}}
            source={{ uri: props.post.uri }}
            shouldPlay={ props.i ==  props.onScreen ? true : false}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          />
        </TouchableOpacity>
        :
        <ImageBackground source={{ uri: image }} style={{ resizeMode: "contain", width: "100%", height: "100%", alignItems: "center",justifyContent: "center",}}>
          <TouchableOpacity style={styles.play}  onPress={()=>setplay(true)}>
            <Ionicons name="play" size={50} color={"#FFF"}/>
          </TouchableOpacity>
        </ImageBackground>
      }

      <View style={styles.boxaction}>

        <TouchableOpacity disabled={dislike ? true : false} onPress={()=> setheart(!heart)}>
          <Ionicons name="heart" size={40} color={heart ? "#F00" : "#FFF"}/>
        </TouchableOpacity>

        <Text style={styles.number} >{props.post.like.length}</Text>

        <TouchableOpacity disabled={heart ? true : false} onPress={()=> setdislike(!dislike)}>
          <Ionicons name="heart-dislike" size={40} color={dislike ? "#F00" : "#FFF"}/>
        </TouchableOpacity>

        <Text style={styles.number} >{props.post.dislike.length}</Text>

        <TouchableOpacity onPress={()=> props.gotocomment()}>
          <FontAwesome name="commenting" size={30} color="#FFF"/>
        </TouchableOpacity>

        <Text style={styles.number} >
          {/* {props.post.comment.length} */}
          0
          </Text>

        <TouchableOpacity disabled={share ? true : false} onPress={()=> props.repost()}>
          <FontAwesome name="send" size={30} color={share ? "#F00" : "#FFF"}/>
        </TouchableOpacity>

        <Text style={styles.number} >{props.post.share.length}</Text>

        <TouchableOpacity style={styles.profil} onPress={()=> props.gotouser()}>
          <AntDesign name="user" size={normalize(20)} color="#FFF"/>
        </TouchableOpacity>

      </View>

      <Text style={styles.text}>
        {props.post.description}
        {"\n"}
        <AntDesign name="eye" size={normalize(20)} color="#FFF"/>
        {" " + props.post.vue.length}
      </Text>

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
    borderWidth: 1,
    borderColor: "#000",
    position: "relative"
  },
  play: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  profil: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F00",
    borderRadius: 50,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,
  },
  text: {
    width: "95%",
    fontSize: normalize(20),
    color: "#FFF",
    alignItems: 'flex-start',
    position: "absolute",
    bottom: 50,
  },
  boxaction: {
    width: 50,
    height: "60%",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "space-evenly",
    position: "absolute",
    bottom: 50,
    right: 0,
    zIndex: 3,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  number: {
    fontSize: normalize(15),
    color: "#FFF",
    marginTop: -20
  },
});
