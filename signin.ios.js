import React, { Component } from 'react';
import {
  AppRegistry,
  TabBarIOS,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Linking,
} from 'react-native';

var Boards = require('./boards.ios');
var t = require('tcomb-form-native');
var Form = t.form.Form;

var User = t.struct({
  netid: t.String,
  password: t.String,
  remember_me: t.Boolean
});

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        netid: this.props.netid,
      },
    };
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      this.post(value.netid, value.password, value.remember_me);
    }
  }

  post(netid, password, remember_me) {
    var data = new FormData();
    data.append("netid", netid);
    data.append("password", password);
    data.append("remember_me", remember_me);

    var p = this;

    fetch('http://localhost:5000/signin2/', {
      method: 'POST',
      body: data
    }).then(function(response) {
      if (response.status == 200) {
        response.json().then(function(data) {
          if (data["status"] == "OK") {
            p.props.navigator.push({
              title: 'Boards',
              navigationBarHidden: true,
              component: Boards,
            });
          } else {
            p.showErrorMessage(data["message"]);
          }
        });
      } else {   // response.status != 200
        response.json().then(function(data) {
          if (data["message"]) {
            p.showErrorMessage(data["message"]);
          } else {
            p.showErrorMessage("Network error. Please try again.");
          }
        });
      }
    })
  }

  showErrorMessage(errorMessage) {
    alert(errorMessage);
  }

  render() {
    return (
      <View style={styles.main} >
        <Text style={styles.heading}>CoCornell{'\n'}</Text>
        <Text>{this.props.message}{'\n'}</Text>
        <Form
          ref="form"
          type={User}
          value={this.state.value}
        />
        <TouchableHighlight style={styles.loginButton}>
          <Text style={styles.loginText} onPress={this.onPress}>
            Login
          </Text>
        </TouchableHighlight>

      </View>
    )
  }
}


const styles = StyleSheet.create({
  main: {
    marginTop: 70,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 46,
    color: 'red',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: "800",
  },
  label: {
    fontSize: 22,
  },
  input: {
    height: 40,
    width: 200,
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: 'red',
    width: 80,
    height: 40,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 6,
  },
  loginText: {
    fontSize: 24,
    fontWeight: "300",
    textAlign: 'center',
  },
});

module.exports = Signin;
