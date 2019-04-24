import Vue from "vue"

export default new Vue({
    data: {
        session_key: null,
        user: null,
    },
    methods: {
        config: function() {
            const c = {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 5000,
            }
            if (this.session_key) {
                c.headers["X-Session-Key"] = this.session_key
            }
            return c
        },
        clear: function() {
            this.session_key = null
            this.user = null
        },
        update: function(session_key, user) {
            this.session_key = session_key
            this.user = user
        },
    },
    created: function() {
        const session_key = localStorage.getItem("session_key")
        const user = localStorage.getItem("user")

        if (session_key) {
            this.session_key = session_key
        }

        if (user) {
            this.user = JSON.parse(user)
        }

        this.$watch("session_key", function(val) {
            if (val) {
                localStorage.setItem("session_key", val)
            } else {
                localStorage.removeItem("session_key")
            }
        })

        this.$watch("user", function(val) {
            if (val) {
                localStorage.setItem("user", JSON.stringify(val))
            } else {
                localStorage.removeItem("user")
            }
        })
    },
})
