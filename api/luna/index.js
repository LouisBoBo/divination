//跨域代理前缀
const API_PROXY_PREFIX = '/prod_api'
const BASE_URL = process.env.NODE_ENV === 'production' ? "https://www.yssjds.com" : API_PROXY_PREFIX

export default {
    //登录
    login: `${BASE_URL}/cloud-wxcx/user/userLogin`,
    //登出
    loginout: `${BASE_URL}/cloud-api/user/loginout`,
    //微信小程序登录获取openid
    submitCode: `${BASE_URL}/cloud-wxcx/user/submitcode`,
    //账户等级列表
    gptlvList: `${BASE_URL}/cloud-api/gptlv/list`,
    //用户等级订单-新增
    gptLvAdd: `${BASE_URL}/cloud-api/gptlv/addGptLvOrder`,
    //聚合支付下单
    gptOrder: `${BASE_URL}/cloud-pay/epay/unifiedOrderList`,
    //app下单
    order: `${BASE_URL}/cloud-pay/wxpay/appUinifiedOrderList`,
    //用户等级信息
    userLvInfo: `${BASE_URL}/cloud-api/gptlv/userLvInfo`,
    //SSE连接
    sse: `${BASE_URL}/cloud-api/gptlv/stream-sse`,
    //发送消息
    sendMessage: `${BASE_URL}/cloud-api/gptlv/addJob`,
    // 历史消息
    historyList: `${BASE_URL}/cloud-api/gptlv/queryJobList`
}