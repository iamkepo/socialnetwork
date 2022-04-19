/** Importation globale : */
import React from 'react';
import { View, Dimensions, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { AntDesign, MaterialIcons} from 'react-native-vector-icons';

import { normalize } from "../utils/fonts";

const screen = Dimensions.get("screen");

export default function UserComponent (props) {
  const [click, setclick] = React.useState(false);

  return(
    <View style={styles.discussion}>
      <TouchableOpacity
        onPress={()=> props.goto()}
        style={styles.profil}
        >
        {
          props.user.photo == "" ?
          <AntDesign name="user" size={normalize(20)} color="#FFF"/>
          :
          <Image source={{uri: props.user.photo}} resizeMode="cover" style={{width: "100%", height: "100%"}} />
        }
      </TouchableOpacity>
      <View style={styles.textbox}>
        <Text style={styles.psoeudo}>
          {props.user.psoeudo}
        </Text>
        <Text style={styles.solde}> {props.user.solde} </Text>
      </View>

      { props.add &&
        <TouchableOpacity style={styles.btnfollow} onPress={()=> props.suivre()}>
          <Text style={styles.btntext}> suivre { props.addback ? "en retour" : "" }</Text>
        </TouchableOpacity>}
      { props.remote &&
        <TouchableOpacity style={styles.btnretier} onPress={()=> props.suivre()}>
          <Text style={styles.btntext}> retirer </Text>
        </TouchableOpacity>}
      { props.me && <Text > moi meme </Text>}
    </View>
  )
}
const styles = StyleSheet.create({
  
  discussion: {
    width: "90%",
    height: 60,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 0.5,
    borderColor: "#FFF",
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
    width: "50%",
  },
  psoeudo: {
    width: "100%",
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#FFF"
  },
  solde: {
    width: "100%",
    fontSize: normalize(15),
    color: "#FFF"
  },
  btnfollow: {
    backgroundColor: "#BB0000",
    width: "25%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  btnretier: {
    width: "25%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "#F00",
  },
  btntext: {
    fontSize: normalize(15),
    color: "#FFF",
    fontWeight: "bold",
  },
});