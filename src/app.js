import "vuetify/src/stylus/main.styl"

import Vue from "vue"
import Vuetify from "vuetify"
import VeeValidate from "vee-validate"

import colors from "vuetify/es5/util/colors.js"

Vue.use(Vuetify, {
    theme: {
        primary: colors.blue.darken3,
        accent: colors.red.darken2,
        secondary: colors.blue.accent4,
    },
})
Vue.use(VeeValidate)

import router from "./js/router.js"
import store from "./js/store.js"

// check if actually signed in
if (store.getters.signed_in) {
    store.dispatch("ping")
}

// signin/signout actions
store.watch((state, getters) => getters.signed_in, signed_in => {
    if (!signed_in) {
        router.push({name: "signin"})
    } else {
        store.dispatch("next_route", router)
        store.dispatch("next_dispatch")
    }
})

import MyApp from "./components/app.vue"

const App = new (Vue.extend(MyApp))({
    el: "#root",
    router,
    store,
})

export default App
