<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h3>DailyDrinks</h3>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <OrderList/>
    </v-main>
  </v-app>
</template>

<script>
 import OrderList from './components/OrderList';

export default {
  name: 'App',

  components: {
    OrderList
  },

  data: () => ({
    //
  }),
};
</script>
