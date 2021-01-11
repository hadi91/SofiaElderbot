<template>
  <v-app id="main-app">
    <router-view></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
#main-app {
  height: 100%;
  overflow-y: hidden;
}

*:focus {
  outline: none;
}

</style>
