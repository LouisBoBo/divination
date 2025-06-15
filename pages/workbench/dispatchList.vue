<template>
    <view class="page">
        <view v-if="!isGet">
            <mescroll-uni v-if="list.length > 0" ref="mescrollRef" @init="mescrollInit" :topbar="false" :fixed="false"
                @down="downCallback" @up="upCallback" :down="downOption" :up="upOption">
                <view class="order-wrap">
                    <view class="ch-flex" v-for="(item, index) in list" :key="index"
                        @click="$nav.to('/pages/workbench/dispatchDetail?id=' + item.id + '&machineNo=' + item.machineNo)">
                        <view class="base">
                            <view class="ch-flex-title">
                                <view class="ch-flex-title_num"
                                    :style="{ backgroundColor: item.dispatchStatus === 1 ? '#FF6600' : '#999999' }">{{
                                        getIndex(index) }}</view>
                                <text>{{ $t('单号') + ': ' + item.dispatchNo }}</text>
                                <u-button type="success" v-if="item.dispatchStatus === $config.dispatchState.ASSIGN"
                                    style="width: 60px;height: 25px;position: absolute;right: 20px;" text="已派工"></u-button>
                                <u-button type="default" v-else
                                    style="width: 60px;height: 25px;position: absolute;right: 20px;" text="未派工"
                                    color="#999999"></u-button>
                            </view>
                            <view class="ch-flex-line"></view>
                            <view class="ch-flex-content">
                                <view class="headImage">
                                    <image class="headImage_img" src="/static/1024.png"></image>
                                </view>
                                <view class="ch-flex-1">
                                    <view class="ch-flex">
                                        <view class="ch-flex-1 value"
                                            style="width: auto; height: 20px; overflow: hidden; display: inline-block;color: black;padding-right: 10px;">
                                            {{ item.itemName }}</view>
                                    </view>
                                    <view class="ch-flex">
                                        <view class="label nowwidth">{{ $t('产品编号') }}：</view>
                                        <view class="ch-flex-1 value">{{ item.itemNo }}</view>
                                    </view>
                                    <view class="ch-flex">
                                        <view class="label nowwidth">{{ $t('派单项次') }}：</view>
                                        <view class="ch-flex-1 value">{{ item.dispatchPrior }}</view>
                                    </view>
                                    <view class="ch-flex">
                                        <view class="label nowwidth">{{ $t('当前产量') }}：</view>
                                        <view class="ch-flex-1 value">{{ item.prodQty }}</view>
                                    </view>
                                    <view class="ch-flex">
                                        <view class="label nowwidth">{{ $t('计划产量') }}：</view>
                                        <view class="ch-flex-1 value">{{ item.dispatchQty }}</view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </mescroll-uni>
            <view class="emptyView" v-else>
                <u-empty :text="$t('数据为空')" mode="list"></u-empty>
            </view>
        </view>
        <template v-else>
            <u-loading-icon text="loading"></u-loading-icon>
        </template>
    </view>
</template>

<script>
import listScroll from "@/mixins/listScroll";
import Api from "@/api/dispatch/index.js"
export default {
    mixins: [listScroll],
    data() {
        return {
            apiUrl: Api.list,
            method: 'post',
            query: {},
            machineNo: null
        }
    },

    onLoad(options){
        this.machineNo = options.machineNo
    },
    methods: {
        //请求前组合参数
        beforeGetList() {
            this.list = []
            if (!this.machineNo) {
                this.$nav.to(this.$config.main, {}, true)
                return;
            }
            this.query = {
                "checkStatus": 1,
                "machineNo": this.machineNo,
                "cmdStatus": 1,
                "params": {
                    "dispatchStatuss": [0, 1, 3],
                    "dispatchStatusQt": "in",
                    "ascColumns": "sort"
                }
            }
        },

        //完成率
        completionRate(item) {
            const rate = item.finishRate != null ? item.finishRate : 0.0
            return `${rate.toFixed(2)}`
        },
        //欠生产数
        remainder(item) {
            const num = item.dispatchQty - item.prodQty
            return num > 0 ? num : 0
        },

        //刷新界面
        refreshUI(data) {
            this.query = data
            this.pager.pageNum = 1 //如果是搜索从第一页开始
            this.getList();
        },
        getIndex(index) {
            index++
            return index > 9 ? index : '0' + index
        },
    }

}
</script>

<style lang="scss" scoped>
.base {
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    margin: 10px 10px 0 10px;
}

.ch-flex-title {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;

    &_num {
        width: 40upx;
        height: 40upx;
        font-size: 24upx;
        color: #fff;
        border-radius: 50%;
        text-align: center;
        line-height: 40upx;
        margin-right: 5px;
    }
}

.ch-flex-line {
    width: 100%;
    height: 1px;
    background-color: rgb(228, 226, 226);
}

.ch-flex-content {
    width: 100%;
    display: flex;
    margin: 10px;
    flex-direction: row;
    align-items: center;

    .headImage {
        width: 200upx;
        height: 200upx;
        padding-right: 10px;

        &_img {
            height: 100%;
            width: 100%;
        }
    }
}
</style>