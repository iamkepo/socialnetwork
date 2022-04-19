/** Importation globale : */
import React from 'react';
import { SafeAreaView, View, Dimensions, Text, TouchableOpacity, BackHandler, Image, TextInput, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SimpleLineIcons, Ionicons, AntDesign, MaterialIcons } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { upload } from "../utils/sender";

import MessageComponent from '../components/MessageComponent';

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
    this.scrollView = null
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
    this.setState({messages: list_messages_test});
    // getmessages(this.route.params.discussion._id).then((response)=>{
    //   //console.log(response.data);
    //   this.setState({messages: response.data});
    // }).catch((error)=>{
    //   console.log("getmessages: "+error);
    // })
    wait(2000).then(() => this.setState({refreshing: false}));
  };

  pushmessage(){
    var data = { 
      _id: "message",
      discussion_id: "discussion_id",
      user:  { _id: undefined, psoeudo: "user", photo: "" }, 
      message: this.state.message,
      date: Date(),
      type: "text"
    };
    this.setState({message: '', messages: [...this.state.messages, data]});
    this.scrollView.scrollToEnd({animated: true});
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
            {this.route.params.discussion.users.map((user, i)=>( user.user_id != undefined ? user.psoeudo+" " : ""))}
          </Text>

          <TouchableOpacity onPress={()=> console.log(1)}>
            <SimpleLineIcons name="options-vertical" size={20} color="#FFF"/>
          </TouchableOpacity>

        </View>

        <View style={[styles.sous, {height: this.state.height}]}>
          
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={()=>this.onRefresh()}
              />
            }
            ref={(ref)=> this.scrollView = ref}

          >

            {
              this.state.messages.map((message, i)=>(
                <MessageComponent 
                  key={i} 
                  message={message}
                  me={message.user._id == undefined}
                  goto={()=> this.navigation.navigate("ProfileScreen", { user: message.user._id == this.props.data.user._id ? this.props.data.user : message.user })}
                />
              ))
            }
            <View style={{height: 30}} />
          </ScrollView>

        </View>

        <View style={styles.sendbox}>
          <TextInput
            style={styles.input}
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
            }]}
          >
            <MaterialIcons name="send" size={30} color="#FFF"/>

          </TouchableOpacity>

        </View>

			</SafeAreaView>
		);

	}

}

const list_messages_test = [
  { 
    _id: "message",
    discussion_id: "discussion_id",
    user:  { _id: "user2", psoeudo: "user2", photo: "" }, 
    message: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam tenetur adipisci, perspiciatis neque praesentium error asperiores accusantium. Dolorum, libero aliquam vitae optio, rem dolores reprehenderit, rerum error nostrum veniam recusandae.",
    date: Date(),
    type: "text"
  }
];

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
    alignItems: 'flex-start',
    justifyContent: "flex-start",
  },
  sendbox: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 10
  },
  input: {
    width: "80%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    marginVertical: "5%",
    color: "#FFF",
    padding: 10,
  },
  btnsend: {
    width: 50,
    height: 50,
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
