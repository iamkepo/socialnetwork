/** Importation globale : */
import React from 'react';
import { View, Dimensions, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { AntDesign, MaterialIcons} from 'react-native-vector-icons';

import { normalize } from "../utils/fonts";

const screen = Dimensions.get("screen");

export default function MessageComponent (props) {
  const [click, setclick] = React.useState(false);

  return(
    <View style={[styles.discussion, {flexDirection: props.me ? "row-reverse" : "row",}]}>
      <TouchableOpacity
        onPress={()=> props.goto()}
        style={styles.profil}
      >
        {
          props.message.user.photo == "" ?
          <AntDesign name="user" size={normalize(20)} color="#FFF"/>
          :
          <Image source={{uri: props.message.user.photo}} resizeMode="cover" style={{width: "100%", height: "100%"}} />
        }
      </TouchableOpacity>
      <View style={styles.textbox}>
        <Text style={styles.message}>{props.message.message}</Text>
      </View>
      <MaterialIcons name="delete" size={20} color="#000"/>
    </View>
  )
}
const styles = StyleSheet.create({
  discussion: {
    width: "95%",
    minHeight: 40,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    marginTop: "5%",
  },
  profil: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#F00",
    borderRadius: 50,
  },
  textbox: {
    width: "75%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 0.5,
    borderColor: "#FFF",
    borderRadius: 5,
    padding: "2%"
  },
  message: {
    fontSize: normalize(15),
    color: "#FFF"
  },
});