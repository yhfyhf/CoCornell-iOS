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

import Button from 'react-native-button';

var Config = require('./config');
var base64 = require('base-64');
var SearchBar = require('react-native-search-bar');
var BoardPage = require('./boardPage.ios');

const ACCESS_TOKEN = Config.ACCESS_TOKEN;

class Boards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      boardsLoaded: false,
      numBoards: 0,
    }
  }

  componentWillMount() {
    AsyncStorage.getItem(ACCESS_TOKEN, (err, token) => {
      console.log("In boards: " + token);
      this.getBoards(token);
    });
    // FOR TEST
    // this.getBoards("eyJhbGciOiJIUzI1NiIsImV4cCI6MTQ2NzQ0NDk2MywiaWF0IjoxNDY3NDM4OTYzfQ.eyJuZXRpZCI6Imh5NDU2In0.ydkEZyVKh-jb4ER49KDLaKMXH5Y3zbHfZsRfMCQQuJU");
  }

  getBoards(token) {
    fetch(Config.serverAddress + "api/board/", {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(token + ':unused'),
      },
    }).then((response) => {
      if (response.status == 200) {
        console.log("response status is 200");
        response.json().then((data) => {
          if (data.status == "OK") {
            this.setState({
              boardsLoaded: true,
              numBoards: data.boards.length,
              dataSource: this.state.dataSource.cloneWithRows(data.boards),
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

  goBoardPage(boardId, boardName) {
    this.props.navigator.push({
      title: boardName,
      component: BoardPage,
      navigationBarHidden: false,
      passProps: {
        boardId: boardId,
      },
    });
  }

  renderRow(board, sectionId) {
    return (
      <TouchableHighlight
        style={styles.boardButton}
        onPress={() => this.goBoardPage(board.id, board.name)}
      >
        <Text style={styles.boardName} numberOfLines={1}>{board.name}</Text>
      </TouchableHighlight>
    );
  }

  _handlePress() {
    this.props.navigator.pop();
  }

  render() {
    let boards = (<Text style={styles.loading}>loading...</Text>);
    if (this.state.boardsLoaded) {
      if (this.state.numBoards > 0) {
        boards = (<ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)}/>);
      } else {
        boards = (<Text>No board.</Text>);
      }
    }

    return (
      <View style={styles.container}>
        <SearchBar
          ref='searchBar'
          placeholder='Search'
        />
        <Text style={styles.heading}>MY BOARDS</Text>
        {boards}

        <Button
          style={{fontSize: 26, color: 'black', paddingBottom: 5}}
          styleDisabled={{color: 'red'}}
          onPress={() => this._handlePress()}>
          Log Out
        </Button>
      </View>
    )
  }
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.03,
    backgroundColor: '#F2F2F2',
  },
  heading: {
    fontWeight: '600',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: width * 0.02,
  },
  loading: {
    textAlign: 'center',
  },
  boardButton: {
    height: 50,
    paddingVertical: 13,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  boardName: {
    marginHorizontal: width * 0.05,
    textAlignVertical: 'center',
    fontSize: 18,
  },
});

module.exports = Boards;
