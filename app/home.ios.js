import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

var Signin = require("./signin.ios");
var Signup = require("./signup.ios");


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLearnMore: false
    };
  }

  goSignup() {
    this.props.navigator.push({
      title: 'Sign Up',
      navigationBarHidden: false,
      component: Signup,
    });
  }

  goSignin() {
    this.props.navigator.push({
      title: 'Sign In',
      navigationBarHidden: false,
      component: Signin,
    });
  }

  learnMore() {
    this.setState({showLearnMore: this.state.showLearnMore ^ 1});
  }

  render() {
    if (this.state.showLearnMore) {
      var learnMoreButton = (
        <TouchableHighlight
          onPress={() => this.learnMore()}
          style={styles.learnMoreButton}
        >
          <Text style={styles.learnMoreButtonText}>HIDE</Text>
        </TouchableHighlight>
      );
      var learnMore = (
        <View style={styles.hidden}>
          <Text style={styles.learnMoreText}>
          CoCornell is a both web and Android app based, production­ready, SaaS application
          designed for systematic team and project management. It facilitates people
          and teams to organize their projects in a highly visual and interactive way
          thus enhance productivity. {'\n\n'}

          In this application, a project is abstracted as a board. A board contains
          several lists, which are abstraction of tasks. Also, tasks can be separated
          into sub­tasks, which are abstracted as cards. Team members can add lists to
          their boards, and append cards to corresponding lists. At the same time, other
          teammates can also keep track of those lists and cards. Cards can be all kinds
          of announcements that post to members, such as to-do list, known bugs, issue tracking and wiki.
          </Text>
        </View>
      );
    } else {
      var placeholder = (<View style={styles.placeholder} />);
      var learnMoreButton = (
        <TouchableHighlight
          onPress={() => this.learnMore()}
          style={styles.learnMoreButton}
        >
          <Text style={styles.learnMoreButtonText}>LEARN MORE</Text>
        </TouchableHighlight>
      );
    }

    return (
      <Image
        source={require('../images/background-photo-mobile-devices.jpg')}
        style={styles.backgroundImage}
      >

        {placeholder}

        <Text style={styles.head}>
          CO-CORNELL
          <View style={styles.mid}>
            <Text style={styles.smallHead}>ACHIEVE GOALS, MANAGE PROJECTS, GET THINGS DONE.</Text>
          </View>
        </Text>

        {learnMoreButton}

        {learnMore}

        {placeholder}

        <View style={styles.sign}>
          <TouchableHighlight
            onPress={() => this.goSignup()}
          >
            <Text style={styles.signText}>Sign Up</Text>
          </TouchableHighlight>
          <Text style={styles.smallHead}>&nbsp;|&nbsp;</Text>
          <TouchableHighlight
            onPress={() => this.goSignin()}
          >
            <Text style={styles.signText}>Sign In</Text>
        </TouchableHighlight>
        </View>
      </Image>
    );
  }
}

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  placeholder: {
    height: height * 0.2,
  },
  head: {
    fontSize: 32,
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight: '500',
    fontFamily: 'Cochin',
  },
  mid: {
    width: width * 1,
    height: height * 0.1,
    marginTop: height * 0.08,
  },
  smallHead: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Cochin',
    textAlign: 'center',
    fontWeight: '400',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  learnMoreButton: {
    width: width * 0.3,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
    marginLeft: width * 0.35,
    marginTop: height * 0.1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#cafaea',
    borderRadius: 3,
  },
  learnMoreButtonText: {
    color: '#cafaea',
    fontWeight: '700',
  },
  sign: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  signText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Cochin',
    textAlign: 'center',
    fontWeight: '400',
    backgroundColor: 'rgba(0,0,0,0)',
    textDecorationLine: 'underline',
  },
  hidden: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  learnMoreText: {
    color: '#FFFFFF',
    marginTop: 10,
    width: width * 0.95,
    marginLeft: width * 0.025,
  }
});

module.exports = Home;
