<template>
    <v-snackbar v-model="snackbar" bottom>
        Changes Saved
    </v-snackbar>
</template>
<script>
import bus from "../js/bus.js";
export default {
    name: "snackbar",
    data: function() {
        return {
            snackbar: false
        };
    },
    methods: {
        trigger: function() {
            this.snackbar = true;
        }
    },
    created: function() {
        bus.$on("saved", () => {
            this.trigger();
        });
    }
};
</script>
