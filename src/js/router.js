import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

import bus from "./bus.js"
import auth from "./auth.js"

import signin from "../components/signin.vue"
import match from "../components/match.vue"
import inspect from "../components/inspect.vue"
import search from "../components/search.vue"
import notFound from "../components/not-found.vue"
import error from "../components/error.vue"

const router = new VueRouter({
    routes: [
        {name: "signin", path: "/signin", component: signin},
        {name: "match", path: "/match/:id", component: match, props: true},
        {name: "inspect", path: "/inspect/:id", component: inspect, props: true},
        {name: "search", path: "/search", component: search},
        {name: "not-found", path: "/not-found", component: notFound},
        {name: "error", path: "/error", component: error},
    ],
})

auth.$watch("session_key", function(val) {
    if (val) {
        router.push({name: "search"})
    } else {
        router.push({name: "signin"})
    }
})

bus.$on("search", function(device) {
    router.push({name: "match", params: {id: device.bag_tag, device: device}})
})

bus.$on("search-not-found", function() {
    router.push({name: "not-found"})
})

bus.$on("api-error", function(error) {
    router.push({name: "error", params: {"error": error}})
})

export default router
