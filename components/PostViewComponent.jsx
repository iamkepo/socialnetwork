import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome, AntDesign, MaterialIcons } from 'react-native-vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, AVPlaybackStatus } from 'expo-av';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction, setPostAction, userAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { setpost, getpost, setuser, getuser } from "../utils/sender";

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction,
    setPostAction,
    userAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");

function PostViewComponent(props) {
  const [heart, setheart] = React.useState((props.post.like.find(item => item == props.data.user._id)) != undefined ? true : false);
  const [dislike, setdislike] = React.useState((props.post.dislike.find(item => item == props.data.user._id)) != undefined ? true : false);
  const [share, setshare] = React.useState((props.post.share.find(item => item == props.data.user._id)) != undefined ? true : false);
  const [vue, setvue] = React.useState((props.post.vue.find(item => item == props.data.user._id)) != undefined ? true : false);
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

  const suivre = (him)=>{
    var data = {
      me: props.data.user._id,
      him: him,
      option: "followingpush"
    }
    setuser(data).then(()=>{
      getuser(props.data.user._id).then((response)=>{
        props.userAction(response.data);
      })
    })
  }
  return (
    <View style={styles.posts}>

      {
        props.post.type == "image" ?
        <Image source={{uri: props.post.uri}} style={{ resizeMode: "contain", width: "100%", height: "100%"}} />
        :
        image &&
        play ?
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={() => video.current.pauseAsync()}
          onPressOut={() => video.current.playAsync()}
          style={{ width: "100%", height: "100%", alignItems: "center",justifyContent: "center",}}
        >
          <Video
            ref={video}
            style={{ width: "100%", height: "100%"}}
            source={{ uri: props.post.uri }}
            shouldPlay={ props.i ==  props.onScreen && play ? true : false}
            // useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={status => (props.i !=  props.onScreen ? setplay(false) : false ,setStatus(() => status))}
          />

        </TouchableOpacity>
        :
        <ImageBackground source={{ uri: image }} style={{ resizeMode: "contain", width: "100%", height: "100%", alignItems: "center",justifyContent: "center",}}>
          <TouchableOpacity style={styles.play}
            onPress={()=>{
              setplay(true);
              if (vue == false) {
                setvue(true);
                setpost({ post_id: props.post._id, option: "vue", value: props.data.user._id});
                getpost(props.post._id).then((response)=>{
                  props.setPostAction(props.data.posts.indexOf(props.post), response.data);
                }).catch((error)=>{
                  console.log(error);
                })
              }
            }}>
            <Ionicons name="play" size={40} color={"#FFF"}/>
          </TouchableOpacity>
        </ImageBackground>
      }

      <View style={styles.boxaction}>

        <TouchableOpacity
          disabled={dislike ? true : false}
          onPress={()=> {
            setheart(!heart);
            setpost({ post_id: props.post._id, option: heart ? "likeremove" : "likepush", value: props.data.user._id});
            getpost(props.post._id).then((response)=>{
              props.setPostAction(props.data.posts.indexOf(props.post), response.data);
            }).catch((error)=>{
              console.log(error);
            })
          }}
        >
          <Ionicons name="heart" size={40} color={heart ? "#F00" : "#FFF"}/>
        </TouchableOpacity>

        <Text style={styles.number} > {props.post.like.length - props.post.like.filter(item=> item == null).length} </Text>


        <TouchableOpacity
          disabled={heart ? true : false}
          onPress={()=> {
            setdislike(!dislike);
            setpost({ post_id: props.post._id, option: dislike ? "dislikeremove" : "dislikepush", value: props.data.user._id});
            getpost(props.post._id).then((response)=>{
              props.setPostAction(props.data.posts.indexOf(props.post), response.data);
            }).catch((error)=>{
              console.log(error);
            })
          }}
        >
          <Ionicons name="heart-dislike" size={40} color={dislike ? "#F00" : "#FFF"}/>
        </TouchableOpacity>

        <Text style={styles.number} > {props.post.dislike.length - props.post.dislike.filter(item=> item == null).length} </Text>

        <TouchableOpacity onPress={()=> props.gotocomment()}>
          <FontAwesome name="commenting" size={30} color="#FFF"/>
        </TouchableOpacity>

        <Text style={styles.number} > {props.post.comment.length - props.post.comment.filter(item=> item == null).length} </Text>

        <TouchableOpacity
        disabled={share ? true : false}
        onPress={()=> props.repost()}>
          <FontAwesome name="send" size={30} color={share ? "#F00" : "#FFF"}/>
        </TouchableOpacity>

        <Text style={styles.number} >{props.post.share.length}</Text>

        {
          props.post.user._id == props.data.user._id ?
          <TouchableOpacity onPress={()=> {
            setpost({ post_id: props.post._id, option: "delete", value: props.post}).then(()=> props.onRefresh());
          }}>
            <MaterialIcons name="delete" size={30} color="#F00"/>
          </TouchableOpacity>
          :
          <TouchableOpacity style={styles.profil} onPress={()=> props.gotouser()}>
            {
              props.post.user.photo == "" ?
              <AntDesign name="user" size={normalize(20)} color="#FFF"/>
              :
              <Image source={{uri: props.post.user.photo}} resizeMode="cover" style={{width: "100%", height: "100%"}} />
            }
          </TouchableOpacity>
        }

        {
          (props.data.user.following.find(item => item  == props.post.user._id)) == undefined && props.post.user._id != props.data.user._id ?
          <TouchableOpacity style={styles.number} onPress={()=> suivre(props.post.user._id)}>
            <AntDesign name="pluscircle" size={normalize(20)} color="#F00"/>
          </TouchableOpacity>
          : false
        }

      </View>

      <Text style={styles.text}>
        {props.post.description}
        {"\n"}
        {props.post.type == "video" ?
        <><AntDesign name="eye" size={normalize(20)} color={vue ? "#F00" : "#FFF"}/>
        {" " + (props.post.vue.length)}</>
        : false}
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
    width: 70,
    height: 70,
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
    bottom: 20,
    paddingRight: 50,
  },
  boxaction: {
    width: 50,
    height: "50%",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "space-evenly",
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 3,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  number: {
    fontSize: normalize(15),
    color: "#FFF",
    marginTop: -20
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PostViewComponent);
