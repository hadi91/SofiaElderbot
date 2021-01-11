<template>
<v-container id="overall-container">
  <div id="top-nav">
    <v-avatar id="avatar">
      <img v-on:click="saveToken" src="../../public/img/icons/myavatar.png" alt="avatar">
    </v-avatar>
    <div id="title-grp">
      <h3 id="sofia-title">Sofia</h3>
      <div id="online-grp">
        <span id="online-circle"></span>
        <p id="online-text">Online</p>
      </div>
    </div>
  </div>
  <div id="msg-container" :style="{maxHeight: screenHeight + 'px'}">
    <v-row dense>
      <v-col cols="12">
        <v-card
          style="width: fit-content"
          v-for="(message,index) in messages"
          :key="index"
          :class="message.isRobot? 'robot' : 'noRobot'"
          :color="message.isRobot? '#F5F3FF' :'#C66BCC'" 
          id="convo-space"
        >
          <div id="left-triangle" v-if="message.isRobot"></div>
          <div id="right-triangle" v-else></div>
          <v-card-text
            id="msg-text" :style="{'color': message.isRobot ? 'black' : 'white', 'font-size': '16px'}"
          >
            {{message.text}}
          </v-card-text>
          <p id="timestamp" :style="{'color': message.isRobot? '#808080' : '#36454f'}">{{message.timestamp}}</p>

        </v-card>
        <div id="bottom-scroll" ref="last-message"></div>   
      </v-col>
    </v-row>
  </div>    

  <div id="bottom-container">
    <div class="col-text">
      <input type="text" placeholder="Type here" id="text-input" v-model="userMessage">
    </div>
    <div class="col-btn">
      <button @click="sendMessage" id="btn-color-text"> Send </button>
    </div>
  </div>
</v-container>
        

</template>

<script>

  import {config} from "../config.js"
  const token = config.dialogflow.clientBot;
  import { ApiAiClient } from 'api-ai-javascript';
  const client = new ApiAiClient({accessToken: token});
  import { mapGetters } from "vuex";
  import firebase from "firebase";

  export default {
    data: () => ({
      messages: [],
      userMessage: "",
      screenHeight: "",
    }),
    methods: {
      sendMessage(){
        // var storeTimestamp = new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', second: '2-digit'});
        var uiTimestamp = new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'});
        const usrMessage = {
          text: this.userMessage,
          isRobot: false,
          timestamp: uiTimestamp
        };

        this.messages.push(usrMessage);

        client.textRequest(this.userMessage).then((response) => {
          const robotMessage = {
            text: response.result.fulfillment.speech,
            isRobot: true,
            timestamp: uiTimestamp
          };

          
          async function database_num(){
            var id_num;
            await firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection("messages")
            .get()
            .then((res) => 
            { console.log(res.size);
              return id_num = res.size;
            });     
              
              
          firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("messages")
          .add({
            userMessage: usrMessage.text,
            robotMessage: robotMessage.text,
            timestamp: uiTimestamp,
            id: id_num + 1
          });
          }
          database_num();

          
          const delay = ms => new Promise(res => setTimeout(res,ms));

          const pushMsg = async () => {
            let randNum = Math.floor(Math.random() * 8000);
            await delay(randNum);
            await this.messages.push(robotMessage);
            this.scrollToEnd();
          };

          pushMsg();
          this.scrollToEnd();
        });
          
        this.userMessage = "";
        console.log(firebase.auth().currentUser.uid);
      },
      scrollToEnd(){
        var container = this.$el.querySelector('#msg-container');
        container.scrollTop = container.scrollHeight + container.clientHeight + 150;
      },
      saveToken(user){
        const messaging = firebase.messaging();
        var user_id = user;
        
        messaging.getToken(user)
        .then((token) => {
          firebase
          .firestore()
          .collection("users")
          .doc(user_id)
          .collection("tokens")
          .add({
            token_id: token
          });
          console.log('token: ', token);
        })
        .catch(err => console.log(err, 'Unable to get token'));
        console.log('token clicked');
      }
    },
    created(){
      var oldMessages = [];

      firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("messages")
      .get()
      .then( (querySnapshot) => {
        querySnapshot.forEach(function(doc){
          var snapMsg = doc.data();
          let robot = {
            text: snapMsg.robotMessage,
            timestamp: snapMsg.timestamp,
            isRobot: true,
            id: snapMsg.id
          }

          let human = {
            text: snapMsg.userMessage,
            timestamp: snapMsg.timestamp,
            isRobot: false,
            id: snapMsg.id
          }
          
          if(human.text){
            oldMessages.unshift(human, robot);
          } else {
            oldMessages.unshift(robot);
          }
          });
          oldMessages.sort(function(a,b){return a.id - b.id});
          console.log(oldMessages);
          this.messages = oldMessages;
      });

      var screenHeight = window.innerHeight;
      this.screenHeight = screenHeight - 110;
      console.log(screenHeight);
    },
    mounted(){
      var user_id = firebase.auth().currentUser.uid;
      this.saveToken(user_id);
      
      navigator.serviceWorker.addEventListener('message', (e) => {
        // console.log(e.data.firebaseMessagingData.notification.body);
        console.log(e);
        var timestamp = new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'});
        const robotMessage = {
          text: e.data.notification.body,
          isRobot: true,
          timestamp: timestamp
        }
        async function database_num(){
          var id_num;
          await firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("messages")
          .get()
          .then((res) => 
          { console.log(res.size);
            return id_num = res.size;
          });     
            
              
          firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("messages")
          .add({
            robotMessage: robotMessage.text,
            timestamp: robotMessage.timestamp,
            id: id_num
          });
        }
        database_num();
        this.messages.push(robotMessage);
      });
    },
    computed: {
      ...mapGetters({
        user: "user"
      })
    },
    watch: {
      messages: function () {
        this.$nextTick(function(){
          this.scrollToEnd()
        });
      }
    }
  }
</script>

<style scoped>

#no-radius {
  border-radius: 0;
  width: 100%;
}

#btn-color-text {
  color: #fff;
  font-family: sans-serif;
  font-weight: 900;
  background-color: #c223ce;
  min-width: 100px;
  padding: 8px 0;
  border-radius: 5px;
  box-shadow: 1px 1px #000;
  outline: none;
}

#convo-space {
  margin: 15px 10px;
  font-weight: 900;
  font-family: sans-serif;
}


#right-triangle {
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 5px solid #C66BCC;
  border-right: 5px solid transparent;
border-top: 5px solid #C66BCC;
  border-bottom: 5px solid transparent;
  top: 0;
  right: -10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

#left-triangle {
  width: 0px;
  height: 0px;
  position: absolute;
  border-right: 5px solid #F5F3FF;
  border-left: 5px solid transparent;
  border-top: 5px solid #F5F3FF;
  border-bottom: 5px solid transparent;
  top: 0;
  left: -10px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
}


#text-input {
  font-family: sans-serif;
  border: 1px solid #000;
  border-radius: 3px;
  font-size: 16px;
  height: 40px;
  width: 100%;
  margin-left: 5px;
}

#bottom-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  background-color: #fff;
  padding: 5px;
}

.container {
  padding: 0;
}

.col-btn {
  width: 27%;
  display: inline-block;
  margin-left: 10px;
}

.col-text {
  width: 70%;
  display: inline-block;
  color: #000;
} 

.col-text > input {
  padding: 5px;
}

#msg-container {
  overflow-y: scroll;
  margin-top: 60px;
  overflow-x: hidden;
  margin-bottom: 40px;
}

#top-nav {
  position: fixed; 
  top: 0;
  background-color: #c223ce;
  border-color: #c223ce;
  left: 0;
  right: 0;
  transform: translateY(0px);
  height: 60px;
}

#sofia-title {
  font-family: sans-serif;
  display: inline-block;
  color: #fff;
  line-height:
}

#online-circle {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #21D628;
  display: inline-block;
}

#online-text {
  margin: 0;
  font-size: 14px;
  color: #fff;
  display: inline-block;
  margin-left: 2px;
}

#title-grp {
  display: inline-block;
  align-content: center;
  margin: 10px 0 0 5px;
  line-height: 1.2;
}

#avatar {
  vertical-align: top;
  padding: 30px;
  margin-left: 10px;
}

#msg-text {
  padding: 7px 50px 7px 10px; 
}

#timestamp {
  margin: 0;
  padding-right: 5px;
  font-weight: 400;
  font-size: 12px;
  text-align: right;
}

.robot {
  margin-left: none !important;
  border-top-left-radius: 0 !important;
}

.noRobot {
  margin-left: auto !important;
  border-top-right-radius: 0 !important;
}

#overall-container {
  overflow-y: hidden;
  height: 100%;
}
</style>