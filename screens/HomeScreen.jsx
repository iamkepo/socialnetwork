import React from 'react';
import { StyleSheet, Dimensions, ScrollView, BackHandler, TouchableOpacity, RefreshControl, StatusBar, ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, Fontisto, AntDesign } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction, getPostsAction } from '../store/ActivityActions';

import { checkversion, getposts } from "../utils/sender";
import { normalize } from "../utils/fonts";

import PostViewComponent from "../components/PostViewComponent";

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction,
    getPostsAction
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
class HomeScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      refreshing: false,
      ready: false
    };
    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  backAction = () => {
    BackHandler.exitApp()
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }

  async componentDidMount(){
    checkversion("0.0.1").then((response)=>{
      //console.log(response.data.response);
      if (response.data.response == false) {
        this.navigation.navigate("UpdateScreen");
      }else{
        this.onRefresh();
      }
    }).catch((error)=>{
      console.log(error);
    })

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  onRefresh(){
    this.setState({refreshing: true});
    getposts().then((response)=>{
      //console.log(response.data[0]);
      this.props.getPostsAction(response.data);
      this.setState({ready: true});
    }).catch((error)=>{
      console.log(error);
    })
    wait(2000).then(() => this.setState({refreshing: false}));
  };

  render(){
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />

        <View style={styles.boxaction} >
          <TouchableOpacity onPress={()=> console.log(1)}>
            <AntDesign name="user" size={30} color="#FFF"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> console.log(1)}>
            <Text style={styles.text} >{this.props.data.profil.solde} </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> console.log(1)}>
            <Fontisto name="messenger" size={30} color="#FFF"/>
          </TouchableOpacity>
        </View>

        {
          this.state.ready ?
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this.onRefresh()} />}
          >
            { this.props.data.posts.map((post, i)=>( <PostViewComponent post={post} key={i} /> )) }
          </ScrollView>
          :
          <ActivityIndicator size="large" color="F00" />
        }

        <TouchableOpacity onPress={()=> this.navigation.navigate("UploadScreen") } style={styles.newpost}>
          <Entypo name="plus" size={30} color="#FFF"/>
        </TouchableOpacity>

      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#000",
  },
  boxaction: {
    width: "90%",
    height: 50,
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    zIndex: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: normalize(20),
    color: "#FFF",
  },
  newpost: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F00",
    borderRadius: 50,
    position: "absolute",
    bottom: 20,
    right: screen.width/2.5,
    zIndex: 5,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
