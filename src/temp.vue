<template>
    <RealTemp :dataSource="propReal.dataSource" :updateProcess="propReal.updateProcess"
        :componentId="propReal.componentId" :options="propReal.options" />
</template>

<script>
import RealTemp from './App.vue'
export default {
    components: {
        RealTemp
    },
    props: {
        tValue: Object,

        eventBus: Object,
    },
    data() {
        return { propReal: this.tValue }
    },

    mounted() {

        this.eventBus.on((Newval) => {
            this.propReal = JSON.parse(JSON.stringify(Newval))
        })
    },
    destroyed() {
        this.eventBus.remove()
    }



}
</script>

<style>

</style>