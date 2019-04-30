<template>
    <v-card width="100%" max-width="600px">
        <v-card-title primary-title>
            <div class="headline">Search</div>
        </v-card-title>

        <form novalidate @submit.prevent="do_get_device(bag_tag)">
            <v-card-text>
                <v-text-field
                    ref="search"
                    label="Bag Tag"
                    v-model="bag_tag"
                    v-validate="'required'"
                    :error-messages="errors.collect('bag_tag')"
                    data-vv-name="bag_tag"
                    required>
                </v-text-field>

                <span class="error--text" v-if="search_error">{{search_error}}</span>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit"
                       color="accent"
                       flat
                       :loading="is_loading"
                       :disabled="bag_tag.length !== 4"
                       >Search</v-btn>
            </v-card-actions>
        </form>

    </v-card>
</template>

<script>
import {mapState, mapMutations, mapGetters, mapActions} from "vuex"
import AuthorizedMixin from "./authorized-mixin.js"
export default {
    name: "app-search",
    mixins: [AuthorizedMixin],
    computed: {
        ...mapState({"error": "last_error"}),
        ...mapState(["search_error"]),
        ...mapGetters(["is_loading"]),
    },
    data() {
        return {
            bag_tag: "",
        }
    },
    methods: {
        ...mapMutations(["UPDATE_ERROR"]),
        ...mapActions(["get_device"]),
        async do_get_device(bag_tag) {
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

            if (await this.get_device(bag_tag)) {
                this.$router.push({name: "match", params: {bag_tag}})
            }
        },
    },
    mounted() {
        this.$refs.search.focus()
    },
}
</script>
