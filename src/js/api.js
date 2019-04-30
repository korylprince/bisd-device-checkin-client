/* global API_BASE */

import store from "./store.js"

const api = {
    authenticate: function(username, password) {
        return store.getters.$http.post(API_BASE + "/auth", {username, password})
    },
    ping: function() {
        return store.getters.$http.post(API_BASE + "/auth/ping")
    },
    readDevice: function(bag_tag) {
        return store.getters.$http.get(API_BASE + "/devices/" + bag_tag)
    },
    checkinDevice: function(bag_tag, charges, missing, notes) {
        return store.getters.$http.post(API_BASE + "/devices/" + bag_tag + "/checkin", {charges, missing, notes})
    },
}

export default api
