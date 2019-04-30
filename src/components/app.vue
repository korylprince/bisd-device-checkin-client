<template>
    <v-app>
        <v-toolbar color="primary" dark dense app>
            <router-link to="/" tag="v-toolbar-title" class="toolbar-title">BISD Chromebook Check-in</router-link>
            <v-spacer></v-spacer>
            <v-tooltip bottom v-show="display_name">
                <span slot="activator">{{display_name}}</span>
                <span>{{username}}</span>
            </v-tooltip>
            <v-menu offset-y v-show="signed_in">
                <v-btn slot="activator" icon><v-icon>more_vert</v-icon></v-btn>
                <v-list>
                    <v-list-tile @click="do_signout">
                        <v-list-tile-title>Sign Out</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>

        <v-content>
            <v-container fluid :pa-0="$vuetify.breakpoint.xsOnly">
                <v-layout justify-center>
                    <router-view></router-view>
                </v-layout>
            </v-container>
        </v-content>

        <v-dialog :value="show_dialog" persistent max-width="480" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card>
                <v-card-title class="headline">Error</v-card-title>
                <v-card-text>{{error}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="UPDATE_ERROR(null)">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar :value="current_feedback != null" @input="clear_feedback">
            {{ current_feedback }}
        </v-snackbar>
    </v-app>
</template>

<script>
import {mapState, mapMutations, mapGetters, mapActions} from "vuex"
export default {
    name: "my-app",
    computed: {
        ...mapState(["display_name", "username"]),
        ...mapState({"error": "last_error"}),
        ...mapGetters(["signed_in", "current_feedback"]),
        ...mapGetters({"show_dialog_state": "show_dialog"}),
        show_dialog() {
            return this.$route.name !== "signin" && this.show_dialog_state
        },
    },
    methods: {
        ...mapMutations(["UPDATE_ERROR"]),
        ...mapActions(["clear_feedback", "signout"]),
        async do_signout() {
            await this.signout()
            this.$router.push({name: "signin"})
        },
    },
}
</script>

<style lang="stylus" scoped>
.toolbar-title
    color: inherit
    cursor: pointer

    &:hover
        font-weight: bold
</style>
