import "./style/app.styl";

import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

import router from "./js/router.js";
import auth from "./js/auth.js";

import toolbar from "./components/toolbar.vue";
import snackbar from "./components/snackbar.vue";

var app = new Vue({
    el: "#root",
    router: router,
    components: {toolbar, snackbar}
});

if (!auth.session_key) {
    router.push({name: "signin"});
}

export default app;
