<template>
    <view class="page">
        <view class="head" v-for="(item, index) in list" :key="index">
            <u-cell :title="item.title" :value="item.text" :isLink="false"></u-cell>
        </view>
        <view class="title-wrap">
            <ch-title :title="getChTitle" weight></ch-title>
        </view>

        <view class="infoList" v-if="cardList.length > 0">
            <view class="infoList_item" v-for="(item, index ) in cardList" :key="index">
                <view class="infoList_item_title">{{ item.mo }}</view>
                <view class="infoList_item_left">
                    <text>{{ detailData.itemName }}</text>
                    <text style="font-size: 12px;">{{ item.itemNo }}</text>
                </view>
                <view class="infoList_item_right">
                    <u--input style="height: 20px;" placeholder="请输入数量" border="surround" @change="change(index)"
                        @input="input" clearable></u--input>
                </view>
            </view>
        </view>
        <view class="infoList" v-else>
            <view v-for="(item, index ) in    metarialList   " :key="index">
                <u-cell :isLink="false" :style="{ backgroundColor: item.select ? '#FF6600' : '#FFFFFF' }"
                    @click="itemClick(index)">
                    <view slot="title">
                        <text :style="{ color: item.select ? '#fff' : '#333' }">{{ item.name }}</text>
                    </view>
                    <view slot="value">
                        <u-icon name="arrow-right" size="20" :color="item.select ? '#fff' : '#333'"></u-icon>
                    </view>
                </u-cell>
            </view>
        </view>

        <view class="bottom">
            <u-button class="bottom_button" :loading="btnLoading" size="large" :text="getBtnTitle"
                @click="confirmClick"></u-button>
        </view>
    </view>
</template>

<script>
import Api from "@/api/workbrench/index.js"
import moment from "moment/moment";
export default {
    data() {
        return {
            list: [
                {
                    title: "派工单号",
                    name: "dispatchNo",
                    text: ""
                },
                {
                    title: "派单项次",
                    name: "dispatchPrior",
                    text: ""
                },
                {
                    title: "产品名称",
                    name: "itemName",
                    text: ""
                },
                {
                    title: "产品编码",
                    name: "itemNo",
                    text: ""
                },
                {
                    title: "本班生产数",
                    name: "prodQty",
                    text: ""
                },
                {
                    title: "本班良品数",
                    name: "goodQty",
                    text: ""
                },
                {
                    title: "本班巡机数",
                    name: "patrolQty",
                    text: ""
                },
                {
                    title: "本班打磨数",
                    name: "polishQty",
                    text: ""
                },
            ],
            cardList: [],
            metarialList: [
                {
                    name: "巡机",
                    select: false,
                },
                {
                    name: "打磨",
                    select: false,
                }
            ],
            machineNo: null,
            target: [],
            childList: [],
            inputValue: null,
            detailData: {},
            startData: [],
            targetIdx: 0,
            btnLoading: false
        }
    },
    onLoad(options) {
        this.$store.state.permission.forEach(item => {
            if (item.tag === "RGB_Patro" || item.tag === "RGB_Polish") {
                this.target.push(item);
            }
        })

        console.log("传过来的数据=", JSON.parse(options.detail))
        let data = JSON.parse(options.detail)
        if (data != null) {
            this.machineNo = data.machineNo
            this.cardOrderInfo(data.id, data.tag)
            this.cardrecordList()
        }
    },
    computed: {
        getChTitle() {
            return this.cardList.length > 0 ? "子件" : "选择功能"
        },
        getBtnTitle() {
            return this.cardList.length > 0 ? "保 存" : "开 始"
        }
    },
    methods: {
        change(e) {
            console.log('change', e);
            this.cardList[e].num = this.inputValue
        },
        input(e) {
            console.log('input', e);
            this.inputValue = e
        },
        confirmClick() {
            console.log("提交的值是", this.cardList)

            if (this.cardList[0]) {
                if (!this.cardList[0].num > 0) {
                    this.$ch.toast("请输入数量")
                    return;
                }
                this.savesCard()
            } else {
                this.startEvent()
            }
        },
        itemClick(index) {
            console.log('item', index);
            this.targetIdx = index
            this.metarialList.forEach(item => {
                item.select = false
            });
            this.metarialList[index].select = true
            console.log("最后的数据=", this.metarialList)
        },
        //打卡工单信息
        cardOrderInfo(id, tag) {
            uni.$u.http.get(Api.cardOrderInfo + 'id=' + id + "&cardType=" + tag).then(result => {
                console.log('result', result);
                if (result.code === 200) {
                    this.detailData = result.data
                    if (this.detailData) {
                        this.list.forEach(item => {
                            item.text = this.detailData[item.name]
                            if (item.name === 'patrolQty' || item.name === "polishQty" || item.name === "prodQty" || item.name === "goodQty") {
                                item.text = this.detailData.params[item.name]
                            }
                        });
                    }
                }
            }).catch(er => {
                console.log('er', er);
            }).finally(() => {
                this.isGet = false
            })
        },
        //打卡记录
        cardrecordList() {
            this.$http.post(Api.cardrecordList, {
                machineNo: this.machineNo,
                "params": {
                    "cardTypeQt": "in",
                    "cardTypes": this.target.map(item => item.id),
                    "isNullColumns": [
                        "end_time",
                    ]
                }
            }).then(result => {
                if (result.code === 200) {
                    this.cardList = result.data
                    this.$forceUpdate()
                    console.log("cardList=", this.cardList)
                }
            })
        },
        //开始打卡
        startEvent() {
            let send = this.$ch.deepClone(this.detailData);
            delete send.id;
            send['cardType'] = this.target[this.targetIdx].id
            send['startTime'] = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            send['cardTypeTag'] = this.target[this.targetIdx].tag
            this.btnLoading = true
            this.$http.post(this.$api.base.startEvent, send).then(result => {
                // this.stateTarget = 2
                if (result.code === 200) {
                    this.startData = result.data
                    this.cardrecordList()
                    uni.$emit('returnCard', "start")
                }
            }).finally(() => {
                this.btnLoading = false
            })
        },

        savesCard() {
            let extList = []
            extList.push({
                checkQty: this.cardList[0].num,
                itemName: this.detailData.itemName,
                itemNo: this.detailData.itemNo,
                mo: this.detailData.mo
            })
            if (this.detailData.params.childrenList.length > 0) {
                this.detailData.params.childrenList.forEach(item => {
                    extList.push({
                        checkQty: item.num,
                        itemName: item.itemName,
                        itemNo: item.itemNo,
                        mo: item.mo
                    })
                })
            }
            this.btnLoading = true
            this.$http.post(`${this.$api.base.endEvent}${this.cardList[0].id}`, { endTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), extList }).then(result => {
                this.$ch.toast(result.msg);
                uni.$emit('returnCard', "success")
                this.$ch.sleep(1000).then(() => {
                    this.$nav.back();
                })
            }).finally(() => {
                this.btnLoading = false;
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.head {
    width: 100%;
    height: auto;
    background-color: white;
}

.infoList {
    height: auto;
    width: 100%;
    background-color: white;

    &_item {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        flex-direction: row;
        border-bottom: 1px solid rgb(228, 226, 226);

        &_title {
            width: 33%;
            padding-left: 10px;
        }

        &_left {
            width: 34%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        &_right {
            width: 33%;
            padding-right: 10px;
        }
    }
}

.bottom {
    width: 100%;
    height: 60px;
    position: absolute;
    bottom: 0;

    &_button {
        height: 40px;
        width: auto;
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 10px;
        background-color: #FF6600;
        color: white;
    }
}

.title-wrap {
    padding: 24upx;
    background-color: white;
    margin-top: 10px;
}
</style>