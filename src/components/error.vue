<template>
    <div class="api-error">
        An error occurred when trying to search:
        <div>{{error}}</div>
    </div>
</template>
<script>
export default {
    name: "api-error",
    computed: {
        error: function() {
            return this.$route.params.error;
        }
    },
    created: function() {
        if (!this.$route.params.error) {
            this.$router.push({name: "search"});
        }
    }
};
</script>
<style lang="stylus">
.api-error
    text-align: center
    font-size: 2em
    margin-top: 100px
</style>
