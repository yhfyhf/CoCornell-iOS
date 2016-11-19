import React, { Component } from 'react';
import {
  AppRegistry,
  TabBarIOS,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  Linking,
  AsyncStorage,
  Dimensions,
  ListView,
  Image,
} from 'react-native';


var Config = require('./config');
var base64 = require('base-64');
var SearchBar = require('react-native-search-bar');
var Swiper = require('react-native-swiper');
var t = require('tcomb-form-native');
var Form = t.form.Form;

var Card = t.struct({
  content: t.String,
});


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
      inputFocused: false,
      content: "",
    }
  }

  componentWillMount() {
    AsyncStorage.getItem(ACCESS_TOKEN, (err, token) => {
      this.getBoard(token, this.props.boardId);
    });
    // FOR TEST
    // this.getBoard("eyJhbGciOiJIUzI1NiIsImV4cCI6MTQ3OTMzMTY3MiwiaWF0IjoxNDc5MzI1NjcyfQ.eyJuZXRpZCI6Imh5NDU2In0.SOQk4JIPVZ1H2KDWp7wPWaZRL3luLDymbWGcejqrHDE", 8);
  }

  updateView() {
    this.componentWillMount();
    this.forceUpdate();
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
              lists: data.lists,
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

/**
  Swiper
     ScrollView
        Text
        View card
        View card
        View card
        ....
     ScrollView
        Text
        View card
        View card
        View card
        ....
 */

  onChange(value) {
    this.setState({
      content: value.content
    });
  }

  renderList(list) {
    let cards = list.cards.map(function(card) {
      if (!card.is_image) {
        return (
          <TouchableHighlight key={card.id} style={styles.card}>
            <Text style={styles.cardText}>{card.content}</Text>
          </TouchableHighlight>
        );
      } else {
        let uri = Config.serverAddress + "static/uploads/" + card.content;
        return (
          <View style={styles.card} key={card.id}>
            <Image
              source={{uri: uri}}
              key={card.id}
              style={styles.image}
            />
          </View>
        );
      }
    });

    let p = this;
    var options = {
      fields: {
        content: {
          // value: p.state.content,
          onFocus: function() {
            p.setState({
              inputFocused: true,
            });
          },
          onBlur: function() {
            p.setState({
              inputFocused: false,
              content: p.refs.form.getValue.content,
            });
          },
          onSubmitEditing: function() {
            p.setState({
              inputFocused: false,
              content: p.refs.form.getValue.content,
            });
            var content = p.state.content;
            AsyncStorage.getItem(ACCESS_TOKEN, (err, token) => {
              var payload = new FormData();
              payload.append("list_id", list.id)
              payload.append("content", content);

              // alert("token" + token);

              // add card
              fetch(Config.serverAddress + "api/card/", {
                method: 'POST',
                body: payload,
                headers: {
                  'Authorization': 'Basic ' + base64.encode(token + ':unused'),
                },
              }).then((response) => {
                if (response.status == 200) {
                  response.json().then((data) => {
                    if (data.status == "OK") {
                      p.updateView();
                    }
                  });
                } else {
                  console.log("Authorization failed");
                }
              }).catch(error => {
                console.warn(error);
              });
            });
          }
        }
      }
    }

    let listStyle = p.state.inputFocused ? styles.listFocused : styles.list;

    var value = {
      content: p.state.content
    };

    return (
      <View key={list.id} style={styles.main}>
        <ScrollView style={listStyle}>
          <Text style={styles.listName}>{list.name}</Text>
          {cards}
        </ScrollView>
        <Form
          key={list.id}
          style={styles.cardForm}
          ref="form"
          type={Card}
          onChange={this.onChange.bind(this)}
          options={options}
          value={value}
        />
      </View>
    );
  }

  render() {
    let lists = (<Text style={styles.loading}>loading...</Text>);
    if (this.state.boardLoaded) {
      if (this.state.numLists > 0) {
        lists = this.state.lists.map(this.renderList.bind(this));
      } else {
        lists = (<Text>Empty board.</Text>);
      }
    }
    return (
      <View>
        <Swiper style={styles.swiper} showsButtons={true} loop={false}>
            {lists}
        </Swiper>
      </View>
    );
  }
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: height * 0.03,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listsView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  list: {
    flex: 0,
    width: width * 0.85,
    marginHorizontal: 30,
    height: height * 0.85,
  },
  listFocused: {
    flex: 0,
    width: width * 0.85,
    marginHorizontal: 30,
    height: height * 0.5,
  },
  listName: {
    fontSize: 30,
    textAlign: "center",
    marginTop: 70,
    fontWeight: '900',
  },
  image: {
    width: 320,
    height: 320,
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
    resizeMode: 'contain',
  },
  card: {
    backgroundColor: "#e2e4e6",
    marginTop: 5,
    marginBottom: 5,
  },
  cardText: {
    textAlignVertical: 'center',
    fontSize: 20,
    left: 5,
    right: 5,
    paddingTop: 5,
    paddingBottom: 5,
    fontFamily: 'Verdana',
    fontWeight: '300',
  },
  main: {
    flex: 1,
    width: width * 0.85,
  },
  cardForm: {
    flex: 1,
    marginLeft: width * 0.075,
    paddingLeft: width * 0.075,
    alignItems: 'center',
    alignSelf: 'center',
  },
});

module.exports = BoardPage;
