/** Importation globale : */
import React from 'react';
import { SafeAreaView, View, Dimensions, Text, TouchableOpacity, BackHandler, Image, TextInput, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SimpleLineIcons, Ionicons, AntDesign, MaterialIcons } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { upload } from "../utils/sender";

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
class MessageScreen extends React.Component {

	constructor(props) {
		super(props);
    this.state= {
      messages: [],
      message: "",
      refreshing: false,
      height: "80%",
    }
    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  backAction = () => {
    this.back();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }

  componentDidMount(){
    //console.log(this.route.params.discussion);

    this.onRefresh();

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  onRefresh(){
    this.setState({refreshing: true});
    // getmessages(this.route.params.discussion._id).then((response)=>{
    //   //console.log(response.data);
    //   this.setState({messages: response.data});
    // }).catch((error)=>{
    //   console.log("getmessages: "+error);
    // })
    wait(2000).then(() => this.setState({refreshing: false}));
  };

  pushmessage(){
    // var data = {
    //   user: this.props.data.user,
    //   discussion_id: this.route.params.discussion._id,
    //   message: this.state.message,
    //   type: "text"
    // };
    // setmessage(data)
    // .then((response)=>{
    //   //console.log(response.data);
    //   this.setState({message: '', messages: [ data, ...this.state.messages]});
    //   if (response.data.insertedId) {
    //     setdiscussion({ discussion_id: this.route.params.discussion._id, option: "messagepush", value: response.data.insertedId});
    //   }
    // })
    // .catch((error)=> console.log(error))
  }

  back() {
    this.navigation.goBack()
  }
	render() {
		return (
			<SafeAreaView style={styles.container}>

        <View style={styles.head}>

          <TouchableOpacity onPress={()=> this.back()}>
            <Ionicons name="arrow-back" size={30} color="#FFF"/>
          </TouchableOpacity>

          <Text style={styles.title}>
            {this.route.params.user.psoeudo}
          </Text>

          <TouchableOpacity onPress={()=> console.log(1)}>
            <SimpleLineIcons name="options-vertical" size={20} color="#FFF"/>
          </TouchableOpacity>

        </View>
        <View style={[styles.sous, {height: this.state.height}]}>
          {
            this.state.messages.length > 0 ?
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={()=>this.onRefresh()}
                />
              }
            >

              {
                this.state.messages.map((message, i)=>(
                  <View key={i} style={styles.discussion}>
                    <TouchableOpacity
                      onPress={()=> this.navigation.navigate("ProfileScreen", { user: message.user._id == this.props.data.user._id ? this.props.data.user : message.user })}
                      style={styles.profil}
                    >
                      {
                        message.user.photo == "" ?
                        <AntDesign name="user" size={normalize(20)} color="#FFF"/>
                        :
                        <Image source={{uri: message.user.photo}} resizeMode="cover" style={{width: "100%", height: "100%"}} />
                      }
                    </TouchableOpacity>
                    <View style={styles.textbox}>
                      <Text style={styles.name}>
                        {message.user.psoeudo == "" ? message.user._id : message.user.psoeudo}
                      </Text>
                      <Text style={styles.message}> {message.message} </Text>
                    </View>
                    <MaterialIcons name="delete" size={20} color="#000"/>
                  </View>
                ))
              }
              <View style={{height: 30}} />
            </ScrollView>
            :
            <Text style={styles.text}> Aucun message disponible pour le moment </Text>
          }

        </View>

        <View style={styles.sendbox}>
          <TextInput
            style={[styles.input, {height: this.state.height == "80%" ? "60%" : "100%"}]}
            onChangeText={(text)=> this.setState({message: text})}
            value={this.state.message}
            placeholder="Ecrivez votre message ici ..."
            placeholderTextColor={"#FFF"}
            multiline={true}
            textAlignVertical="top"
            keyboardType="default"
            onBlur={()=> this.setState({height: "80%"})}
            onFocus={()=> this.setState({height: "60%"})}
          />

          <TouchableOpacity
            onPress={()=> this.pushmessage()}
            disabled={this.state.message != "" ? false : true}
            style={[styles.btnsend, {
              backgroundColor: this.state.message != "" ? "#F00" : "#555",
              height: this.state.height == "80%" ? "60%" : "100%"
            }]}
          >
            <MaterialIcons name="send" size={30} color="#FFF"/>

          </TouchableOpacity>

        </View>
			</SafeAreaView>
		);

	}

}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  head: {
    width: "95%",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    width: "70%",
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#FFF"
  },
  sous: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: "flex-start",
  },
  discussion: {
    width: "95%",
    minHeight: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: "#FFF",
    borderRadius: 20,
    marginTop: "5%",
    padding: "2%"
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
  },
  name: {
    width: "100%",
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#FFF"
  },
  message: {
    width: "100%",
    fontSize: normalize(15),
    color: "#FFF"
  },
  sendbox: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  input: {
    width: "80%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    marginVertical: "5%",
    color: "#FFF",
    padding: 10,
  },
  btnsend: {
    width: "13%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  text: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#FFF"
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen);
