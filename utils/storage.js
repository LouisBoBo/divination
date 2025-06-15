function setShangYiData(storeKey, data) {
	uni.setStorageSync(storeKey, data);
}

function getShangYiData(storeKey) {
	return uni.getStorageSync(storeKey);
}

module.exports = {
	setShangYiData,
	getShangYiData,
}