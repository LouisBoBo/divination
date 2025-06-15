<template>
    <view :style="'height:' + this.height + 'upx'"><qiun-data-charts type="ring" :opts="opts" :chartData="chartData"></qiun-data-charts></view>
</template>

<script>
/**
 * 设备状态圆环图
 */
export default {
    name: "device-ring",
    props:{
        width: {
            type: Number | String,
            default(){
                return '100%'
            }
        },
        height: {
            type: Number ,
            default: 360
        }
    },
    data(){
        return {
            opts:{},
            chartData:{}
        }
    },
    mounted(){
        this.setOpts();
        this.setData();

    },
    methods:{
        setOpts(){
            this.opts = {
                rotate: false,
                rotateLock: false,
                color: [this.$config.color.run, this.$config.color.stop, this.$config.color.breakOff],
                padding: [5,5,5,5],
                dataLabel: false,
                enableScroll: false,
                legend: {
                    show: false,
                    position: "right",
                    lineHeight: 25
                },
                title: {show: false},
                subtitle: {},
                extra: {
                    ring: {
                        ringWidth: 25,
                        activeOpacity: 0.5,
                        activeRadius: 10,
                        offsetAngle: 0,
                        labelWidth: 15,
                        border: false,
                        borderWidth: 3,
                        borderColor: "#FFFFFF"
                    }
                }
            }
        },
        setData(){
            let res = {
                series: [
                    {
                        data: [{"name":"运行","value":50},{"name":"停机","value":30},{"name":"离线","value":20}]
                    }
                ]
            };
            this.chartData = JSON.parse(JSON.stringify(res));
        }
    }
}
</script>

<style scoped>

</style>
