<template>
    <v-card class="inspect" v-if="device">
        <v-card-row>
            <v-card-title>
                <h4>Chromebook Inspection</h4>
            </v-card-title>
        </v-card-row>
        <v-card-text>
            <table>
                <tr><td><b>Bag Tag:</b></td><td>{{device.bag_tag}}</td>
                <td><b>Inventory Number:</b></td><td>{{device.inventory_number}}</td></tr>
                <tr><td><b>Serial Number:</b></td><td>{{device.serial_number}}</td>
                <td><b>User:</b></td><td>{{device.user}}</td></tr>
                <tr><td><b>Notes:</b></td></tr>
            </table>

            <div class="notes">{{device.notes}}</div>

            <v-checkbox class="charge" v-for="charge in charges" :label="charge.description + ': $' + charge.value" v-model="charge.active" :key="charge.description" hide-details error></v-checkbox>

            <h6>Other:</h6>
            <div class="add-charge">
                <v-text-field label="Description" v-model="other.description"></v-text-field>
                <v-text-field class="currency" type="number" label="Value" v-model="other.value"></v-text-field>
                <v-btn class="secondary" @click.native="addCharge(other.description, parseFloat(other.value))" :disabled="other.description == '' || other.value == ''">Add Charge</v-btn>
            </div>

            <div class="total"><strong>Total: </strong><span :class="{'secondary--text': total > 0.0}">${{total}}</span></div>
        </v-card-text>
        <v-card-row actions>
            <v-btn flat class="accent--text" @click.native="submit(charges)">Check In</v-btn>
        </v-card-row>
    </v-card>
</template>

<script>
/* global CHARGE_BASE*/
import api from "../js/api.js"
import bus from "../js/bus.js"
export default {
    name: "inspect",
    props: ["device"],
    data: function() {
        return {
            charges: [
                {description: "Screen damaged", value: 30.00, active: false, group: "chromebook_damage"},
                {description: "Trackpad cracked", value: 30.00, active: false, group: "chromebook_damage"},
                {description: "Body damaged", value: 30.00, active: false, group: "chromebook_damage"},
                {description: "Chromebook missing", value: 250.00, active: false},
                {description: "Powerbrick damaged/missing", value: 15.00, active: false},
                {description: "Bag damaged/missing", value: 35.00, active: false},
                {description: "Key(s) missing", value: 0.00, active: false},
                {description: "Chromebook not charging", value: 0.00, active: false},
            ],
            other: {
                description: "",
                value: "",
            },
        }
    },
    computed: {
        total: function() {
            let t = 0.00
            const groups = {}
            for (let i = 0; i < this.charges.length; i++) {
                if (this.charges[i].active) {
                    if (this.charges[i].group == null) {
                        t += this.charges[i].value
                        // use groups to group similar charges into one price
                    } else {
                        if (!(this.charges[i].group in groups)) {
                            t += this.charges[i].value
                            groups[this.charges[i].group] = true
                        }
                    }
                }
            }
            return t
        },
    },
    methods: {
        addCharge: function(description, value) {
            this.charges.push({"description": description, "value": value, "active": true})
            this.other.description = ""
            this.other.value = ""
        },
        submit: function(charges) {
            const newCharges = []
            const groups = {}
            for (let i = 0; i < charges.length; i++) {
                if (!charges[i].active) {
                    continue
                }
                if (charges[i].group == null) {
                    newCharges.push({description: charges[i].description, value: charges[i].value})
                    continue
                }
                if (groups[charges[i].group] == null) {
                    groups[charges[i].group] = {description: charges[i].description, value: charges[i].value}
                } else {
                    groups[charges[i].group].description += ", " + charges[i].description
                }
            }
            for (const key in groups) {
                if (Object.prototype.hasOwnProperty.call(groups, key)) {
                    newCharges.push(groups[key])
                }
            }

            const promise = api.checkinDevice(this.device.bag_tag, newCharges)

            promise.then(response => {
                if (response.data.charge_id) {
                    window.open(CHARGE_BASE + response.data.charge_id, "_blank")
                }
                this.$router.push({name: "search"})
                bus.$emit("saved")
            }).catch(error => {
                if (error.response) {
                    if (error.response.status === 401) {
                        return
                    }
                    console.error(error)
                    bus.$emit("api-error", error.response.statusText)
                } else if (error.request) {
                    console.error(error)
                    bus.$emit("api-error", error.request)
                } else {
                    console.error(error)
                    bus.$emit("api-error", error.message)
                }
            })
        },
    },
    created: function() {
        if (!this.device) {
            this.$router.push({name: "search"})
        }
    },
}
</script>
<style lang="stylus">
.inspect
    .card__text
        font-size: 1.5em

    td
        padding: 5px

    .notes
        font-size: 0.75em
        flex: 1
        padding: 5px
        white-space: pre
        border: 1px solid #ddd
        overflow-y: auto
        max-height: 200px

    .charge
        display: inline-block
        max-width: 50%
        margin: 5px 0

        .input-group__details
            display: none

    h6
        font-size: 1em
        width: 100%
        display: block
        margin-top: 25px

    .add-charge
        display: flex
        align-items: center
        justify-content: center

        .input-group
            max-width: 40%
            margin: 5px
            display: inline-block

        .currency
            &.input-group--focused, &.input-group--dirty
                .input-group__input:before
                    content: "$"
                    padding-right: 5px

        button
            align-self: center

    .total
        width: 100%
        text-align: center
</style>
