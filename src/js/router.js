import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

import AppSignin from "../components/signin.vue"
import AppSearch from "../components/search.vue"
import AppMatch from "../components/match.vue"
import AppInspect from "../components/inspect.vue"

const router = new VueRouter({
    routes: [
        {name: "signin", path: "/signin", component: AppSignin},
        {name: "search", path: "/search", component: AppSearch},
        {name: "match", path: "/match/:bag_tag", component: AppMatch, props: true},
        {name: "inspect", path: "/inspect/:bag_tag", component: AppInspect, props: true},
        {path: "*", redirect: {name: "search"}},
    ],
})

export default router
