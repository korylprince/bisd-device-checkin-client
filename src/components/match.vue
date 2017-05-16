<template>
    <div v-if="device">
        <v-card class="match">
            <v-card-row>
                <v-card-title>
                    <h4>Do these match?</h4>
                    <v-spacer></v-spacer>
                </v-card-title>
            </v-card-row>
            <v-card-text>
                <table>
                    <tr>
                        <td><b>Bag Tag:</b></td><td>{{device.bag_tag}}</td>
                    </tr>
                    <tr>
                        <td><b>Inventory Number:</b></td><td>{{device.inventory_number}}</td>
                    </tr>
                </table>
            </v-card-text>
            <v-card-row actions>
                <v-btn flat class="secondary--text" @click.native.stop="openDialog()">Don't Match</v-btn>
                <v-btn flat class="accent--text" @click.native="match(device)">Match</v-btn>
            </v-card-row>
        </v-card>
        <v-dialog v-model="dialogActive" width=480>
            <v-card>
                <v-card-row>
                    <v-card-title>Information doesn't match</v-card-title>
                </v-card-row>
                <v-card-row>
                    <v-card-text>This Chromebook must be checked in manually. Please set it to the side.</v-card-text>
                </v-card-row>
                <v-card-row actions>
                    <v-btn flat class="primary--text" @click.native="closeDialog()">Close</v-btn>
                </v-card-row>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "match",
    props: ["device"],
    data: function() {
        return {
            dialogActive: false
        };
    },
    methods: {
        openDialog: function() {
            this.dialogActive = true;
        },
        closeDialog: function() {
            this.dialogActive = false;
            this.$router.push({name: "search"});
        },
        match: function(device) {
            this.$router.push({name: "inspect", params: {id: device.bag_tag, device: device}});
        }
    },
    created: function() {
        if (!this.device) {
            this.$router.push({name: "search"});
        }
    }
};
</script>
<style lang="stylus">
.match
    .card__text
        font-size: 1.5em
    td
        padding: 5px
</style>
