import React from 'react';
import { Animated, StyleSheet, Dimensions, ScrollView, BackHandler, TouchableOpacity, RefreshControl, StatusBar, ActivityIndicator, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, EvilIcons, AntDesign } from 'react-native-vector-icons';
import PagerView from 'react-native-pager-view';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction, getPostsAction } from '../store/ActivityActions';

import { checkversion, getposts } from "../utils/sender";
import { normalize } from "../utils/fonts";

import PostViewComponent from "../components/PostViewComponent";
import AddPostComponent from '../components/AddPostComponent';

const AnimatedPager = Animated.createAnimatedComponent(PagerView);

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
      ready: true,
      i: 0
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
  async init(){
    if (this.props.data.user._id == undefined) {
      this.navigation.navigate("StarterScreen");
    } else {
      checkversion().then((response)=>{
        //console.log(response.data.response);
        if (response.data.response == false) {
          this.navigation.navigate("UpdateScreen");
        }else{
          this.onRefresh();
        }
      }).catch((error)=>{
        console.log(error);
      })
    }
  }
  async componentDidMount(){
    this.init();

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

          <TouchableOpacity
            onPress={()=> this.navigation.navigate("ProfileScreen", { user: this.props.data.user })}
            style={styles.profil}
          >
            <AntDesign name="user" size={25} color="#FFF"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>  this.navigation.navigate("CashScreen")}>
            <Text style={styles.text} > {this.props.data.user.solde} </Text>
          </TouchableOpacity>
          
          <View style={styles.groupicon} >
            <TouchableOpacity onPress={()=> this.navigation.navigate("DiscussionScreen")}>
              <EvilIcons name="comment" size={40} color="#FFF"/>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> this.navigation.navigate("SearchScreen")}>
              <AntDesign name="search1" size={30} color="#FFF"/>
            </TouchableOpacity>
          </View>
          
        </View>

        {
          this.state.ready ?
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              this.state.i == 0 ?
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={()=>this.onRefresh()}
              />
              :
              false
            }
          >
            <AnimatedPager
              style={styles.pagerView}
              initialPage={this.state.i}
              onPageSelected={(e)=> this.setState({i: e.nativeEvent.position})}
              orientation="vertical"
            >
              {
                this.props.data.posts.map((post, i)=>(
                  <PostViewComponent key={i}
                    repost={()=>this.navigation.navigate('UploadScreen', { post: post })}
                    gotouser={()=> this.navigation.navigate("ProfileScreen", { user: post.user })}
                    gotocomment={()=> this.navigation.navigate("CommentScreen", { post: post })}
                    post={post}
                    i={i}
                    onScreen={this.state.i == i}
                    onRefresh={()=>this.onRefresh()}
                  />
                ))
              }
            </AnimatedPager>
          </ScrollView>
          :
          <ActivityIndicator size="large" color="F00" />
        }

        <AddPostComponent navigation={this.navigation} />

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
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    zIndex: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: "5%"
  },
  profil: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F00",
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
  groupicon: {
    width: 90,
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: normalize(18),
    color: "#FFF",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
