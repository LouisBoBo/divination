<template>
    <view class="page bgwhite">
        <u-cell-group v-for="(item, index) in urlList" :key="index">
            <u-cell :title="item.url" @click="setService(index)">
                <view slot="value" v-if="item.select">
                    <u-icon name="checkmark-circle-fill" :color="$config.color.primary" size="20"></u-icon>
                </view>
                <view slot="value" v-else>
                    <u-icon name="checkmark-circle" color="#999" size="20"></u-icon>
                </view>
            </u-cell>
        </u-cell-group>

        <u-action-sheet round :actions="list" @select="selectClick" @close="closeSheet" :show="showSheet"
            :cancelText="$t('取消')"></u-action-sheet>

        <view class="fixed_bottom_bar" @click="openFirmDialog">{{ $t('增加企业') }}</view>


        <u-popup :show="firmDialog" @close="closePopup" mode="bottom" round>
            <view class="popup-page">
                <view class="popup-title">
                    {{$t('请输入租户编码')}}
                    <view class="cancle" @click="firmDialog = false">{{ $t('取消') }}</view>
                    <view class="enter" @click="confirmClick">{{ $t('确认') }}</view>
                </view>
                <view class="popup-input">
                    <u-input :placeholder="$t('租户编码')" v-model="code"></u-input>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import Config from '@/config';
import Api from "@/api/base/index.js"
export default {
    data() {
        return {
            showSheet: false,
            list: [
                { name: this.$t('设定'), color: this.$config.color.primary, },
                { name: this.$t('删除'), color: "#666", }
            ],
            firmDialog: false,
            code: '',
            urlList: [],
            selectIndex: 0
        };
    },
    onLoad() {
        this.urlList = this.$db.get(this.$config.store.baseurls)
        console.log("本地存储的url=", this.urlList)
    },
    methods: {
        setService(idx) {
            this.showSheet = !this.showSheet
            this.selectIndex = idx
        },
        selectClick(item) {
            if (item.name === this.$t('设定')) { // 设定
                this.urlList.forEach(item => {
                    item.select = false
                });
                this.urlList[this.selectIndex].select = true
                //设定当前域名为选中的域名
                Config.baseURl = this.urlList[this.selectIndex].url
                //存储选中的域名
                this.$db.set(this.$config.store.baseurl, Config.baseURl)
            } else { // 删除
                if (this.urlList[this.selectIndex].select) {
                    Config.baseURl = ""
                    this.$db.set(this.$config.store.baseurl, "")
                    uni.$u.toast(this.$t("当前没有设定域名，请重新设定"))
                }
                this.urlList.splice(this.selectIndex, 1)
            }

            //修改后重新存储
            this.$db.set(this.$config.store.baseurls, this.urlList)
        },
        closeSheet() {
            this.showSheet = !this.showSheet
        },

        openFirmDialog() {
            this.firmDialog = !this.firmDialog
        },
        closePopup() {

        },
        confirmClick() {
            this.firmDialog = false
            this.getUrl()
        },
        getUrl() {
            let url = ''
            // #ifdef APP-PLUS
            url = Config.baseURl + Api.getFirm + this.code
            // #endif
            // #ifdef H5
            url = Api.getFirm + this.code
            // #endif
            uni.$u.http.get(`${url}`, {
                custom: { isGetFirm: true }
            }).then(result => {
                console.log('result************', result);
                if (result != null && result.length > 0) {
                    this.saveUrl({ url: Config.url1.replace('${*}', result), select: false })
                }
            }).catch(er => {
                console.log('er', er);
            })
        },
        saveUrl(data) {
            //先取出数据
            let urls = this.$db.get(this.$config.store.baseurls) ? this.$db.get(this.$config.store.baseurls) : []
            var baseurls = urls.slice();

            let result = false
            baseurls.forEach(item => {
                if (item.url === data.url) {
                    result = true
                }
            });

            if (!result) {
                baseurls.push(data)
                this.urlList = baseurls
                //存储新的数据
                this.$db.set(this.$config.store.baseurls, this.urlList)
            } else {
                uni.$u.toast(this.$t("已包含该域名，请勿重复添加"))
            }

            this.code = ""
        }

    }
}
</script>

<style lang="scss" scoped>
.fixed_bottom_bar {
    background-color: $ch-theme;
    color: $uni-bg-color;
    text-align: center;
    line-height: 94upx;
    font-weight: 600;
    font-size: 26upx;
}

::v-deep .u-action-sheet__cancel-text {
    color: #999 !important;
}

.popup {
    &-page {
        min-height: 300upx;
    }

    &-title {
        height: 88upx;
        @include after();
        text-align: center;
        font-size: 26upx;
        color: #666;
        font-weight: 600;
        line-height: 88upx;

        .enter,
        .cancle {
            position: absolute;
            right: 24upx;
            top: 0;
            color: $ch-theme;
        }

        .cancle {
            left: 24upx;
            right: auto;
            color: #999;
            font-weight: normal;
        }
    }

    &-input {
        padding-top: 40upx;
        padding-bottom: 40upx;
        margin: 0 60upx;
    }
}
</style>
