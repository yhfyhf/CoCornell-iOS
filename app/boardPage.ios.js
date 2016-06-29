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
  AsyncStorage,
  Dimensions,
  ListView,
} from 'react-native';

var Config = require('./config');
var base64 = require('base-64');
var SearchBar = require('react-native-search-bar');

const ACCESS_TOKEN = Config.ACCESS_TOKEN;

class BoardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      boardLoaded: false,
      numLists: 0,
    }
  }

  componentWillMount() {
    AsyncStorage.getItem(ACCESS_TOKEN, (err, token) => {
      this.getBoard(token, this.props.boardId);
    });
    // FOR TEST
    // this.getBoard("eyJhbGciOiJIUzI1NiIsImV4cCI6MTQ2NzE4NDgxOSwiaWF0IjoxNDY3MTc4ODE5fQ.eyJuZXRpZCI6Imh5NDU2In0.aeDtD1Mcit7P8F77mokX0F3LIi-af2x4X8z73U0HH_E", this.props.boardId);
  }

  getBoard(token, boardId) {
    fetch(Config.serverAddress + "api/board/" + boardId + "/", {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(token + ':unused'),
      },
    }).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          if (data.status == "OK") {
            this.setState({
              boardLoaded: true,
              numLists: data.lists.length,
              dataSource: this.state.dataSource.cloneWithRows(data.lists),
            });
          }
        });
      } else {
        console.log("Authorization failed");
      }
    }).catch(error => {
      console.warn(error);
    });
  }

  renderRow(list, sectionId) {
    return (
      <TouchableHighlight>
        <Text numberOfLines={1}>{list.name}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    let lists = (<Text style={styles.loading}>loading...</Text>);
    if (this.state.boardLoaded) {
      if (this.state.numLists > 0) {
        lists = (<ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)}/>);
      } else {
        lists = (<Text>Empty board.</Text>);
      }
    }
    return (
      <View>
        <Text>{'\n\n\n\n'}</Text>
        <SearchBar
          ref='searchBar'
          placeholder='Search'
        />
        {lists}
      </View>
    )
  }
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
});

module.exports = BoardPage;
