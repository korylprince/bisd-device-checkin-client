<template>
    <v-card class="signin">
        <v-card-row>
            <v-card-title>
                <h4>Sign in</h4>
                <v-spacer></v-spacer>
            </v-card-title>
        </v-card-row>
        <v-card-text>
            <form novalidate @keyup.enter="authenticate(username, password)">
                <v-text-field label="Username" v-model="username" required></v-text-field>
                <v-text-field label="Password" type="password" v-model="password" required></v-text-field>
            </form>
            <div class="error--text" v-if="error_text">{{error_text}}</div>
        </v-card-text>
        <v-card-row actions>
            <v-btn ref="signin" class="secondary" @click.native="authenticate(username, password)">Sign in</v-btn>
        </v-card-row>
    </v-card>
</template>

<script>
import api from "../js/api.js"
import auth from "../js/auth.js"
export default {
    name: "signin",
    data: function() {
        return {
            username: null,
            password: null,
            error_text: null,
        }
    },
    methods: {
        authenticate: function(username, password) {
            this.error_text = null
            this.$refs.signin.$el.focus()

            if (!username || !password) {
                this.error_text = "You must enter a username or password"
                return
            }

            const promise = api.authenticate(username, password)

            promise.then(response => {
                auth.update(response.data.session_key, response.data.user)
            }).catch(error => {
                if (error.response && error.response.status === 401) {
                    this.error_text = "Bad username or password"
                } else {
                    this.error_text = "Unknown error occurred"
                    console.error(error)
                }
            })
        },
    },
}
</script>
<style lang="stylus">
.signin
    max-width: 600px
    margin: 100px auto auto auto
</style>
