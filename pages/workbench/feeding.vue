<template>
    <view class="page">
        <view class="head" v-for="(item, index) in list" :key="index">
            <u-cell :title="item.title" :value="item.text" :isLink="false"></u-cell>
        </view>
        <view class="title-wrap">
            <ch-title title="物料" weight></ch-title>
        </view>
        <view class="infoList">
            <view class="infoList_item" v-for="(item, index ) in  metarialList " :key="index">
                <view class="infoList_item_left">
                    <text>{{ item.itemName }}</text>
                    <text style="font-size: 12px;">{{ item.itemNo }}</text>
                </view>
                <view class="infoList_item_right">
                    <u--input style="height: 20px;" placeholder="请输入投料数量" border="surround" @change="change(index)"
                        @input="input" clearable></u--input>
                </view>
            </view>
        </view>
        <view class="bottom">
            <u-button class="bottom_button" size="large" text="保 存" @click="confirmClick"></u-button>
        </view>
    </view>
</template>

<script>
import moment from "moment";
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
            ],
            inputValue: null,
            detailData: {},
            cardType: null,
            cardTypeTag: null,
            metarialList: []
        }
    },
    onLoad(options) {
        console.log("传过来的数据=", JSON.parse(options.detail))
        let data = JSON.parse(options.detail)
        if (data != null) {
            this.detailData = data.detail
            this.cardType = data.id
            this.cardTypeTag = data.tag
            if (this.detailData) {
                this.getList()
                this.getMetarialList()
            }
        }
    },
    methods: {
        change(e) {
            console.log('change', e);
            this.metarialList[e].num = this.inputValue

        },
        input(e) {
            console.log('input', e);
            this.inputValue = e
        },

        confirmClick() {
            console.log("提交的值是", this.metarialList)
            let materialList = [];
            this.metarialList.forEach(item => {
                materialList.push({
                    feedingQty: Number(item.num) || 0,
                    feedingTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    materialName: item.itemName,
                    materialNo: item.itemNo
                })
            })
            this.loading = true;
            let send = this.$ch.deepClone(this.detailData)
            send['cardType'] = this.cardType
            send['params'] = { materialList }
            delete send.id
            this.loading = true
            send['startTime'] = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            send['cardTypeTag'] = this.cardTypeTag
            this.$http.post(this.$api.base.startEvent, send).then(result => {
                this.$ch.toast(result.msg);
            }).finally(() => {
                this.loading = false;
                setTimeout(() => {
                    uni.navigateBack({})
                }, 500)
            })
        },
        //派工单信息
        getList() {
            this.list.forEach(item => {
                item.text = this.detailData[item.name]
            });
        },
        //物料数据
        getMetarialList() {
            if (this.detailData.params.itemBomList) {
                this.metarialList = this.detailData.params.itemBomList
            }
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
    background-color: white;

    &_item {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        flex-direction: row;
        border-bottom: 1px solid rgb(228, 226, 226);

        &_left {
            width: 50%;
            display: flex;
            flex-direction: column;
            padding-left: 10px;
        }

        &_right {
            width: 50%;
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