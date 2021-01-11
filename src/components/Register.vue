<template>
  <div class="register-container">
    <div class="register-form">
      <h1>Enter Your Name</h1>
      <div v-if="error" class="alert alert-danger">{{error}}</div>
      <form action="#" @submit.prevent="submit">
        <input 
          id="name"
          type="name"
          name="name"
          label="Type here"
          value
          required
          autofocus
          v-model="form.email" 
          placeholder="Type here"
        />
        <button type="submit">Let's Chat! >></button>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data(){
    return {
      form: {
        email: "",
        password: "123456"
      },
      error: null
    };
  },
  methods: {
    submit(){
      firebase
        .auth()
        .createUserWithEmailAndPassword((this.form.email + '@test.com'), this.form.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.form.email
            })
            .then(()=>{
              this.$router.replace({ name: "Chatbot"});
            })
          
        })
        .catch(err =>{
          this.error = err.message;
        });
    }
  }
};
</script>

<style scoped>

h1 {
  color: #c223ce;
}

button {
  display: block;
  border-radius: 30px;
  padding: 15px 20px;
  margin: 20px auto;
  background-color: #c223ce;
  color: #fff;
  box-shadow: 1px 3px 1px;
  outline: none;
}

input {
  border: 1px solid #000;
  font-size: 24px;
  margin-top: 20px;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 5px;
  width: 100%;
}

.register-form {
  text-align: center;
  font-family: sans-serif;
  width: 340px;
  padding: 40px;
  margin: 150px auto; 
  background-color: #fff;
  box-shadow: 1px 2px 1px; 
  border-radius: 10px; 
}

.register-container {
  background-color: #c223ce;
  width: 100%;
  height: 100%;
}
</style>