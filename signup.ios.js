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

var t = require('tcomb-form-native');
var Form = t.form.Form;

var User = t.struct({
  netid: t.String,
  password: t.String
});

class Signup extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      this.post(value.netid, value.password)
    }
  }

  post(netid, password) {
    var payload = {
      netid: netid,
      password: password
    };

    var data = new FormData();
    data.append( "netid", netid);
    data.append( "password", password);

    fetch('http://localhost:5000/signin2/', {
      method: 'POST',
      body: data
    }).then(function(response) {
      console.log(response.json());
    })
  }

  render() {
    return (
      <View style={styles.main} >
        <Text style={styles.heading}>CoCornell</Text>
        <Form
          ref="form"
          type={User}
        />
        <TouchableHighlight style={styles.loginButton}>
          <Text style={styles.loginText} onPress={this.onPress}>
            Sign up
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

module.exports = Signup;
