/** Importation globale : */
import React from 'react';
import { View, Dimensions, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { AntDesign} from 'react-native-vector-icons';

import { normalize } from "../utils/fonts";

const screen = Dimensions.get("screen");

export default function DiscussionComponent (props) {
  const [click, setclick] = React.useState(false);

  return(
    <TouchableOpacity
      style={[styles.discussion, {backgroundColor: props.discussion.last.vue ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.4)",}]}
      onPress={()=> props.goto()}
    >
      {
        props.discussion.users[0].photo == "" ?
        <View style={styles.profil}>
          <AntDesign name="user" size={normalize(20)} color="#FFF"/>
        </View>
        :
        <Image 
          source={{uri: props.discussion.users[0].photo}} 
          resizeMode="cover" 
          style={styles.profil} 
        />
      }

      <View style={styles.textbox}>
        <Text style={styles.name}>{props.discussion.users[0].psoeudo} </Text>
        <Text style={styles.lastmessage}>{props.discussion.last.message}</Text>
        <Text style={styles.date}>{props.discussion.last.date} </Text>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  discussion: {
    width: "95%",
    height: 80,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderRadius: 5,
    borderColor: "#FFF",
    marginTop: "5%",
    padding: "2%"
  },
  textbox: {
    width: "85%",
    height: "100%",
    alignItems: 'center',
    justifyContent: "space-evenly",
  },
  name: {
    width: "100%",
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#FFF"
  },
  lastmessage: {
    width: "100%",
    height: "55%",
    fontSize: normalize(15),
    color: "#FFF",
    overflow: "hidden"
  },
  date: {
    width: "100%",
    fontSize: normalize(10),
    color: "#FFF",
    textAlign: "right"
  },
  profil: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F00",
    borderRadius: 50,
  }
});