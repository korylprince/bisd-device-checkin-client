/* global CHARGE_BASE */

import axios from "axios"

import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

import api from "./api.js"

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    state: {
        last_error: null,
        _loading_count: 0,
        username: window.localStorage.getItem("username"),
        display_name: window.localStorage.getItem("display_name"),
        session_id: window.localStorage.getItem("session_id"),
        _next_route: null,
        _next_dispatch_action: null,
        _next_dispatch_payload: null,
        _feedback: [],
        _feedback_delay: false,
        search_error: null,
        device: null,
    },
    getters: {
        is_loading(state) {
            return state._loading_count !== 0
        },
        next_route(state) {
            if (state._next_route == null) {
                return null
            }
            return {
                name: state._next_route.name,
                path: state._next_route.path,
                params: state._next_route.params,
                query: state._next_route.query,
            }
        },
        signed_in(state) {
            return state.session_id != null
        },
        show_dialog(state) {
            return state.last_error != null
        },
        $http(state) {
            return axios.create({
                headers: {Authorization: "Bearer " + state.session_id},
            })
        },
        current_feedback(state) {
            if (state._feedback_delay || state._feedback.length === 0) {
                return null
            }
            return state._feedback[0]
        },
    },
    mutations: {
        UPDATE_ERROR(state, error) {
            state.last_error = error
        },
        START_LOADING(state) {
            state._loading_count++
            state.last_error = null
        },
        STOP_LOADING(state) {
            state._loading_count--
        },
        UPDATE_CREDENTIALS(state, {username, display_name, session_id}) {
            state.username = username
            window.localStorage.setItem("username", username)
            state.display_name = display_name
            window.localStorage.setItem("display_name", display_name)
            state.session_id = session_id
            window.localStorage.setItem("session_id", session_id)
        },
        SIGNOUT(state) {
            state.username = null
            window.localStorage.removeItem("username")
            state.display_name = null
            window.localStorage.removeItem("display_name")
            state.session_id = null
            window.localStorage.removeItem("session_id")
        },
        UPDATE_NEXT_ROUTE(state, route) {
            state._next_route = route
        },
        UPDATE_NEXT_DISPATCH(state, {action, payload}) {
            state._next_dispatch_action = action
            state._next_dispatch_payload = payload
        },
        ADD_FEEDBACK(state, msg) {
            if (state._feedback[state._feedback.length - 1] !== msg) {
                state._feedback.push(msg)
            }
        },
        CLEAR_FEEDBACK(state) {
            // remove first element
            state._feedback.splice(0, 1)
            state._feedback_delay = true
        },
        CLEAR_FEEDBACK_DELAY(state) {
            state._feedback_delay = false
        },
        UPDATE_SEARCH_ERROR(state, error) {
            state.search_error = error
        },
        UPDATE_DEVICE(state, device) {
            state.device = device
        },
    },
    actions: {
        async authenticate(context, {username, password}) {
            context.commit("START_LOADING")

            try {
                const response = await api.authenticate(username, password)
                context.commit("STOP_LOADING")
                context.commit("UPDATE_CREDENTIALS", {
                    username,
                    display_name: response.data.display_name,
                    session_id: response.data.session_id,
                })
            } catch (err) {
                context.commit("STOP_LOADING")
                if (err.response !== null && err.response.status === 401) {
                    context.commit("UPDATE_ERROR", "Wrong username or password")
                    return
                }
                context.commit("UPDATE_ERROR", "Oops! Something bad happened. Contact your system administrator")
                console.error({error: err})
            }
        },
        async ping(context) {
            context.commit("START_LOADING")

            try {
                await api.ping()
                context.commit("STOP_LOADING")
            } catch (err) {
                context.commit("STOP_LOADING")
                if (err.response !== null && [400, 401].includes(err.response.status)) {
                    context.commit("SIGNOUT")
                    context.commit("ADD_FEEDBACK", "Session expired. Please sign back in")
                    return
                }
                context.commit("UPDATE_ERROR", "Oops! Something bad happened. Contact your system administrator")
                console.error({error: err})
            }
        },
        async signout(context) {
            context.commit("SIGNOUT")
        },
        next_route(context, router) {
            let next = context.getters.next_route
            if (next == null) {
                next = {name: "search"}
            }
            router.push(next)
            context.commit("UPDATE_NEXT_ROUTE", null)
        },
        async next_dispatch(context) {
            if (context.state._next_dispatch_action == null) {
                return
            }
            if (context.state._feedback === "Session expired. Please sign back in") {
                context.commit("CLEAR_FEEDBACK")
            }
            await context.dispatch(context.state._next_dispatch_action, context.state._next_dispatch_payload)
            context.commit("UPDATE_NEXT_DISPATCH", {action: null, payload: null})
        },
        clear_feedback(context) {
            context.commit("CLEAR_FEEDBACK")
            window.setTimeout(() => {
                context.commit("CLEAR_FEEDBACK_DELAY")
            }, 500)
        },
        async _get_device(context, bag_tag) {
            context.commit("START_LOADING")

            try {
                const response = await api.readDevice(bag_tag)
                context.commit("STOP_LOADING")
                context.commit("UPDATE_DEVICE", response.data)
                return response.data
            } catch (err) {
                context.commit("STOP_LOADING")
                if (err.response !== null && err.response.status === 401) {
                    context.commit("SIGNOUT")
                    context.commit("ADD_FEEDBACK", "Session expired. Please sign back in")
                    context.commit("UPDATE_NEXT_ROUTE", {name: "match", params: {bag_tag}})
                    context.commit("UPDATE_NEXT_DISPATCH", {action: "get_device", payload: bag_tag})
                } else if (err.response !== null && err.response.status === 404) {
                    context.commit("UPDATE_SEARCH_ERROR", `Bag Tag ${bag_tag} doesn't exist`)
                } else if (err.response !== null && err.response.status === 400) {
                    context.commit("UPDATE_SEARCH_ERROR", err.response.data.error)
                } else {
                    context.commit("UPDATE_ERROR", "Oops! Something bad happened. Contact your system administrator")
                    console.error({err: err})
                }
            }
        },
        async get_device(context, bag_tag) {
            context.commit("UPDATE_SEARCH_ERROR", null)

            if (context.state.device != null && context.state.device.bag_tag === bag_tag) {
                return context.state.device
            }
            return await context.dispatch("_get_device", bag_tag)
        },
        async checkin_device(context, {bag_tag, charges, missing, notes}) {
            context.commit("START_LOADING")

            try {
                const response = await api.checkinDevice(bag_tag, charges, missing, notes)
                context.commit("STOP_LOADING")
                context.commit("ADD_FEEDBACK", "Device checked in")
                context.commit("UPDATE_DEVICE", null)
                const charge_id = response.data.charge_id
                if (charge_id != 0) {
                    window.open(CHARGE_BASE + charge_id, "_blank")
                }
                return charge_id
            } catch (err) {
                context.commit("STOP_LOADING")
                if (err.response !== null && err.response.status === 401) {
                    context.commit("SIGNOUT")
                    context.commit("ADD_FEEDBACK", "Session expired. Please sign back in")
                    context.commit("UPDATE_NEXT_ROUTE", {name: "search"})
                    context.commit("UPDATE_NEXT_DISPATCH", {action: "checkin_device", payload: {bag_tag, charges, missing, notes}})
                } else {
                    context.commit("UPDATE_ERROR", "Oops! Something bad happened. Contact your system administrator")
                    console.error({err: err})
                }
            }
        },
    },
})

export default store
