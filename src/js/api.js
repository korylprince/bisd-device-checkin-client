/* global API_BASE */

import axios from "axios"

import auth from "./auth.js"

export default {
    handlePromise: function(promise) {
        promise.catch(function(error) {
            if (error.response && error.response.status === 401) {
                auth.clear()
            }
        })
    },
    authenticate: function(username, password) {
        const promise = axios.post(API_BASE + "/auth", {"username": username, "password": password}, auth.config())
        return promise
    },
    readDevice: function(bagTag) {
        const promise = axios.get(API_BASE + "/devices/" + bagTag, auth.config())
        this.handlePromise(promise)
        return promise
    },
    checkinDevice: function(bagTag, charges) {
        const promise = axios.post(API_BASE + "/devices/" + bagTag + "/checkin", {charges: charges}, auth.config())
        this.handlePromise(promise)
        return promise
    },
}
