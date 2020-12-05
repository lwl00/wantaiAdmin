<template>
    <div class="dashboard-container">
        <div class="dashboard-text">Name：{{ name }}</div>
        <!-- <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div> -->
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { getDictsData } from 'api/interface';

    export default {
        name: 'Dashboard',
        computed: {
            ...mapGetters([
                'name',
                'roles',
                'device',
            ])
        },
        components: {

        },
        data() {
            return {

            }
        },
        created() {
			// console.log(mapGetters)
			// console.log(this.device)
        },
        methods: {

        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
