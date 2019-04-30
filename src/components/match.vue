<template>
    <v-card width="100%" max-width="600px">
        <v-card-title primary-title>
            <div class="headline">Do these match?</div>
        </v-card-title>

        <form novalidate @submit.prevent>
            <v-card-text>
                <div style="font-size: 1.5em"><strong>Inventory Number:</strong>
                    <span v-if="device">{{device.inventory_number}}</span>
                </div>
                <div style="font-size: 1.5em"><strong>Bag Tag:</strong>
                    <span v-if="device">{{device.bag_tag}}</span>
                </div>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary"
                       flat
                       @click="$router.push({name: 'search'})"
                       >Back</v-btn>
                <v-btn color="primary"
                       flat
                       :loading="is_loading"
                       :disabled="is_loading"
                       @click="not_match()"
                       >Don't Match</v-btn>
                <v-btn color="accent"
                       flat
                       :loading="is_loading"
                       :disabled="is_loading"
                       @click="match(bag_tag)"
                       >Match</v-btn>
            </v-card-actions>
        </form>

    </v-card>
</template>

<script>
import {mapState, mapMutations, mapGetters, mapActions} from "vuex"
import AuthorizedMixin from "./authorized-mixin.js"
export default {
    name: "app-match",
    mixins: [AuthorizedMixin],
    props: {
        bag_tag: String,
    },
    data() {
        return {
            device: null,
        }
    },
    computed: {
        ...mapState(["search_error"]),
        ...mapGetters(["is_loading"]),
    },
    watch: {
        async bag_tag(val) {
            this.reload(val)
        },
    },
    methods: {
        ...mapMutations(["UPDATE_ERROR"]),
        ...mapActions(["get_device"]),
        async reload(bag_tag) {
            this.device = Object.assign({}, await this.get_device(bag_tag))
            if (this.search_error != null) {
                this.$router.push({name: "search"})
            }
        },
        not_match() {
            this.UPDATE_ERROR("This device must be checked in manually.")
        },
        match(bag_tag) {
            this.$router.push({name: "inspect", params: {bag_tag}})
        },
    },
    async created() {
        this.reload(this.bag_tag)
    },
}
</script>
