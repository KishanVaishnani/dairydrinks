<!-- UI Template -->
<template>
  <v-data-table
    :headers="headers"
    :items="orderList"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Orders</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Order
            </v-btn>
          </template>
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                  <v-layout row class="container">
                      <v-flex xs12 md12 class="formitem">
                        <v-text-field v-model="editedItem.name" :rules="XXNameRules" label="Name" required></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row class="container">
                      <v-flex xs12 md12 class="formitem">
                        <v-text-field v-model="editedItem.price" :rules="XXPriceRules" @focus="$event.target.select()" maxlength=10 label="Price" required @blur="formatNumber(editedItem.price)"></v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row class="container">
                      <v-flex xs12 md12 class="formitem">
                        <v-textarea v-model="editedItem.notes" label="Notes" ></v-textarea>
                      </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
              :disabled="!valid"
                color="blue darken-1"
                text
                @click="validate"
              >
                Save
              </v-btn>
            </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.action`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      No data found!
    </template>
  </v-data-table>
</template>
  
<!-- Script -->
<script>
var numeral = require('numeral');

//register number format for specific culture

// numeral.register('locale', 'nl-nl', {
//   delimiters: {
//     thousands: '.',
//     decimal: ','
//   },
//   abbreviations: {
//     thousand: 'k',
//     million: 'mln',
//     billion: 'mrd',
//     trillion: 'bln'
//   },
//   ordinal: function(number) {
//     var remainder = number % 100;
//     return (number !== 0 && remainder <= 1 || remainder === 8 || remainder >= 20) ? 'ste' : 'de';
//   },
//   currency: {
//     symbol: '$ '
//   }
// });

// numeral.locale('nl-nl');

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    fullPage: true,
    valid:false,
    XXNameRules: [
        v => !!v || "Name field is required."
      ],
      XXPrice: 0,
      XXPriceRules: [
        v => !!v || "Price field is required."
      ],
    orderList: [],
    headers: [
      {
        text: "Name",
        value: "name",
        width: "40%",
        fixed: true,
        sortable: false,
      },
       {
        text: "Price",
        value: "price",
        width: "10%",
        fixed: true,
        sortable: false,
        align:'right'
      },
       {
        text: "Notes",
        value: "notes",
        width: "30%",
        fixed: true,
        sortable: false,
      },
      {
        text: "Actions",
        value: "action",
        width: "20%",
        sortable: false,
      }
    ],
    editedIndex: -1,
    editedItem: {
        name: '',
        price: 0,
        notes: '',
      },
      defaultItem: {
        name: '',
        price: 0,
        notes: '',
      },
  }),
  computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Order' : 'Edit Order'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {

      // This is Init method called when project run
      initialize () {
        let dataObj = window.localStorage.getItem("orderObj");
          this.orderList = dataObj!=null ?JSON.parse(dataObj) :[];
      },

      // method for edititem
      editItem (item) {
        this.editedIndex = this.orderList.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      // method for deletitem
      deleteItem (item) {
        this.editedIndex = this.orderList.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      // confirmation of delete item
      deleteItemConfirm () {
        this.orderList.splice(this.editedIndex, 1)
        window.localStorage.setItem("orderObj", JSON.stringify(this.orderList));
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      // Called when form is validated
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.orderList[this.editedIndex], this.editedItem)
        } else {
          this.orderList.push(this.editedItem)
        }
        // Storing data from array to localstorage
        window.localStorage.setItem("orderObj", JSON.stringify(this.orderList));
        this.close()
      },

      // Fired when save button clied on popup modal
      validate() {
        if (this.$refs.form.validate()) {
          this.snackbar = true;
          this.save()
        }
      },

      // This method is used for formatting number values to US culture
      formatNumber(val) {
        
        var maskNumber;
        maskNumber = numeral(val).format('$ 0,0.00');
        this.editedItem.price = maskNumber;
        console.log(maskNumber);
      },
  },
};
</script>