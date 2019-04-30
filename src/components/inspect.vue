<template>
    <v-card width="100%" max-width="960">
        <v-card-title primary-title>
            <div class="headline">Chromebook Inspection</div>
        </v-card-title>

        <v-card-text>
            <v-container>
                <v-layout row>
                    <v-flex xs6 style="font-size: 1.5em">
                        <strong>Bag Tag:</strong>
                        <span v-if="device">{{device.bag_tag}}</span>
                    </v-flex>
                    <v-flex xs6 style="font-size: 1.5em">
                        <strong>Inventory Number:</strong>
                        <span v-if="device">{{device.inventory_number}}</span>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs6 style="font-size: 1.5em">
                        <strong>Serial Number:</strong>
                        <span v-if="device">{{device.serial_number}}</span>
                    </v-flex>
                    <v-flex xs6 style="font-size: 1.5em">
                        <strong>User:</strong>
                        <span v-if="device">{{device.user}}</span>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12 style="font-size: 1.5em">
                        <strong>Notes:</strong>
                        <div class="notes" v-if="device">{{device.notes}}</div>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs8>
                        <h6 class="title">Chromebook:</h6>
                        <v-checkbox class="charge" v-model="charges.chromebook.missing" label="Missing ($250.00)"></v-checkbox>
                        <v-layout row v-show="!charges.chromebook.missing">
                            <v-flex xs6>
                                <div class="subheading">Damage ($40.00):</div>
                                <v-checkbox class="charge" v-model="charges.chromebook.damages.screen" label="Screen"></v-checkbox>
                                <v-checkbox class="charge" v-model="charges.chromebook.damages.body" label="Body"></v-checkbox>
                                <v-checkbox class="charge" v-model="charges.chromebook.damages.touchpad" label="Touchpad"></v-checkbox>
                                <v-checkbox class="charge" v-model="charges.chromebook.damages.keyboard" label="Keyboard"></v-checkbox>
                            </v-flex>
                            <v-flex xs6>
                                <div class="subheading">Warranty ($0.00):</div>
                                <v-checkbox class="charge" v-model="charges.chromebook.warranty.charge" label="Won't Charge"></v-checkbox>
                                <v-checkbox class="charge" v-model="charges.chromebook.warranty.boot" label="Won't Boot"></v-checkbox>
                                <v-checkbox class="charge" v-model="charges.chromebook.warranty.screen" label="Screen"></v-checkbox>
                                <v-checkbox class="charge" v-model="charges.chromebook.warranty.missing" label="Missing Key"></v-checkbox>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs4>
                        <h6 class="title">Power Brick:</h6>
                        <v-checkbox class="charge" v-if="!charges.power_brick.damaged" v-model="charges.power_brick.missing" label="Missing ($15.00)"></v-checkbox>
                        <v-checkbox class="charge" v-if="!charges.power_brick.missing" v-model="charges.power_brick.damaged" label="Damaged ($15.00)"></v-checkbox>
                        <h6 class="title">Bag:</h6>
                        <v-checkbox class="charge" v-if="!charges.bag.damaged" v-model="charges.bag.missing" label="Missing ($40.00)"></v-checkbox>
                        <v-checkbox class="charge" v-if="!charges.bag.missing" v-model="charges.bag.damaged" label="Damaged ($40.00)"></v-checkbox>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <div class="subheading">Other:</div>
                        <v-checkbox class="charge"
                                    v-for="(charge, idx) in charges.other" :key="idx"
                                    v-model="charge.selected" :label="charge | charge"
                                    ></v-checkbox>
                    </v-flex>
                </v-layout>

                <v-form @submit.prevent="add_charge(description, amount)">
                    <v-layout row>
                        <v-flex xs4>
                            <v-text-field v-model="description" label="Description"></v-text-field>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs4>
                            <v-text-field type="number" prefix="$" v-model.number="amount" label="Amount"></v-text-field>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-btn type="submit"
                               color="accent"
                               :disabled="is_loading || !description || amount === ''"
                               @click="add_charge(description, amount)"
                               >Add Charge</v-btn>
                    </v-layout>
                </v-form>

                <v-layout row>
                    <v-flex xs12>
                        <h6 class="title" style="text-align: center">Total: ${{total}}</h6>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs12>
                        <v-textarea
                            v-model="notes"
                            label="Add Notes"
                            ></v-textarea>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary"
                   flat
                   @click="$router.push({name: 'match', params: {'bag_tag': bag_tag}})"
                   >Back</v-btn>
                <v-btn color="accent"
                       flat
                       :loading="is_loading"
                       :disabled="is_loading"
                       @click="do_checkin_device(bag_tag, compiled_charges, charges.chromebook.missing, notes)"
                       >Check In</v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
import {mapState, mapGetters, mapActions} from "vuex"
import AuthorizedMixin from "./authorized-mixin.js"
export default {
    name: "app-inspect",
    mixins: [AuthorizedMixin],
    props: {
        bag_tag: String,
    },
    data() {
        return {
            device: null,
            description: "",
            amount: 0.0,
            charges: {
                chromebook: {
                    missing: false,
                    damages: {
                        screen: false,
                        body: false,
                        touchpad: false,
                        keyboard: false,
                    },
                    warranty: {
                        charge: false,
                        boot: false,
                        screen: false,
                        keyboard: false,
                    },
                },
                power_brick: {
                    missing: false,
                    damaged: false,
                },
                bag: {
                    missing: false,
                    damaged: false,
                },
                other: [],
            },
            notes: "",
        }
    },
    filters: {
        charge(charge) {
            return `${charge.description} ($${charge.amount.toFixed(2)})`
        },
    },
    computed: {
        ...mapState(["search_error"]),
        ...mapGetters(["is_loading"]),
        compiled_charges() {
            const charges = []
            if (this.charges.chromebook.missing) {
                charges.push({description: "Missing Chromebook", amount: 250.0})
            } else {
                const damages = []
                if (this.charges.chromebook.damages.screen) {
                    damages.push("Screen")
                }
                if (this.charges.chromebook.damages.body) {
                    damages.push("Body")
                }
                if (this.charges.chromebook.damages.touchpad) {
                    damages.push("Touchpad")
                }
                if (this.charges.chromebook.damages.keyboard) {
                    damages.push("Keyboard")
                }
                if (damages.length > 0) {
                    charges.push({description: `Chromebook Damage: ${damages.join(", ")}`, amount: 40.0})
                }
            }

            const warranty = []
            if (this.charges.chromebook.warranty.charge) {
                warranty.push("Won't Charge")
            }
            if (this.charges.chromebook.warranty.boot) {
                warranty.push("Won't Boot")
            }
            if (this.charges.chromebook.warranty.screen) {
                warranty.push("Screen")
            }
            if (this.charges.chromebook.warranty.keyboard) {
                warranty.push("Missing Key")
            }
            if (warranty.length > 0) {
                charges.push({description: `Chromebook Warranty: ${warranty.join(", ")}`, amount: 0.0})
            }

            if (this.charges.power_brick.missing) {
                charges.push({description: "Missing Power Brick", amount: 15.0})
            } else if (this.charges.power_brick.damaged) {
                charges.push({description: "Damaged Power Brick", amount: 15.0})
            }

            if (this.charges.bag.missing) {
                charges.push({description: "Missing Bag", amount: 15.0})
            } else if (this.charges.bag.damaged) {
                charges.push({description: "Damaged Bag", amount: 40.0})
            }

            for (const c of this.charges.other) {
                if (c.selected) {
                    charges.push({description: c.description, amount: c.amount})
                }
            }

            return charges
        },
        total() {
            let t = 0
            for (const c of this.compiled_charges) {
                t += c.amount
            }
            return t.toFixed(2)
        },
    },
    watch: {
        async bag_tag(val) {
            this.reload(val)
        },
    },
    methods: {
        ...mapActions(["get_device", "checkin_device"]),
        async reload(bag_tag) {
            this.device = Object.assign({}, await this.get_device(bag_tag))
            if (this.search_error != null) {
                this.$router.push({name: "search"})
            }
        },
        add_charge(description, amount) {
            if (this.is_loading || !description || amount === "") {
                return
            }
            this.charges.other.push({description, amount, selected: true})
            this.description = ""
            this.amount = 0.0
        },
        async do_checkin_device(bag_tag, charges, missing, notes) {
            if (this.is_loading) {
                return
            }

            try {
                if (!(await this.$validator.validateAll())) {
                    return
                }
            } catch (err) {
                this.UPDATE_ERROR("Form validation error")
            }

            const charge_id = await this.checkin_device({bag_tag, charges, missing, notes})
            if (charge_id != null) {
                this.$router.push({name: "search"})
            }
        },
    },
    async created() {
        this.reload(this.bag_tag)
    },
}
</script>

<style lang="stylus" scoped>
.title
    margin-top: 15px

.subheading
    font-weight: bold

.notes
    flex: 1
    font-size: 0.75em
    padding: 5px
    white-space: pre
    border: 1px solid #ddd
    overflow-y: auto
    max-height: 200px

.charge
    margin: 0px
    margin-bottom: -15px
</style>
