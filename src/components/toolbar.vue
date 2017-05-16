<template>
    <v-toolbar class="container container--fluid">
        <v-row>
            <v-col xl3><v-toolbar-title>BISD Chromebook Check-In</v-toolbar-title></v-col>
            <v-col class="search" xl6 v-if="name">
                <v-text-field ref="search" prepend-icon="search" label="Search Bag Tag..." type="number" v-model="search" @keyup.enter="doSearch(search)" @focus="select()" hide-details single-line dark></v-text-field>
                <v-progress-circular indeterminate class="secondary--text" :class="{'loading-visible': loading}" />
                </v-col>
                <v-col xl3><div class="toolbar-right">
                        <div class="name" v-if="name">{{name}}</div>
                        <v-toolbar-items v-if="name">
                            <v-menu bottom left offset-y origin="top right" transition="v-slide-y-transition">
                                <v-btn icon dark slot="activator">
                                    <v-icon>more_vert</v-icon>
                                </v-btn>
                                <v-list>
                                    <v-list-item>
                                        <v-list-tile>
                                            <v-list-tile-title @click="signout()">Sign out</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-toolbar-items>
                    </div></v-col>
            </v-row>
        </v-toolbar>
</template>
<script>
import auth from "../js/auth.js";
import api from "../js/api.js";
import bus from "../js/bus.js";
export default {
    name: "toolbar",
    data: function() {
        return {
            search: null,
            loading: false
        };
    },
    computed: {
        name: function() {
            if (auth.user) {
                return auth.user.display_name;
            }
            return null;
        }
    },
    methods: {
        signout: function() {
            auth.clear();
        },
        doSearch: function(query) {
            if (query.length === 4) {
                this.loading = true;
                var promise = api.readDevice(query);

                promise.then((response) => {
                    this.loading = false;
                    if (response.data.status !== "Checked Out") {
                        bus.$emit("api-error", "Chromebook already checked in");
                    } else {
                        bus.$emit("search", response.data);
                    }
                }).catch((error) => {
                    this.loading = false;
                    if (error.response) {
                        if (error.response.status === 401) {
                            return;
                        }
                        if (error.response.status === 404) {
                            bus.$emit("search-not-found");
                            return;
                        }
                        console.error(error);
                        bus.$emit("api-error", error.response.statusText);
                    } else if (error.request) {
                        console.error(error);
                        bus.$emit("api-error", error.request);
                    } else {
                        console.error(error);
                        bus.$emit("api-error", error.message);
                    }
                });
            }
        },
        select: function() {
            this.$refs.search.$refs.input.select();
        }
    },
    created: function() {
        this.$watch("search", this.doSearch);
    }
};
</script>
<style lang="stylus">
.toolbar
    &.container
        max-width: 100%

        .row
            width: 100%

    .input-group__details:after
        background-color: #82b1ff

    .toolbar-right
        display: flex
        float: right

        >div, >ul
            align-self: center

    .search
        display: flex
        justify-content: center

        .input-group
            max-width: 600px

        .progress-circular
            margin: 0 5px
            opacity: 0

            &.loading-visible
                opacity: 1.0


input::-webkit-outer-spin-button, input::-webkit-inner-spin-button
    -webkit-appearance: none
    margin: 0

input[type="number"]
    -moz-appearance: textfield
</style>
