var Datas;
(function Datas() {

	this.data = [{
		"batchId": "123456",
		"batchName": "和合谷20160822检测",
		"shop": ｛ "shopId": "1",
		"shopName": "和合谷","address":"青岛路店","phone":"156222222"｝

	}, {
		"batchId": "798989",
		"batchName": "多宝鱼20160822检测",
		"shop": ｛ "shopId": "2",
		"shopName": "多宝鱼","address":"青岛路店收费","phone":"156222222"｝

	}];
	this.getData = function() {
		return this.data;
	};
	this.setDate = function(data) {
		this.data = data;
	};
	datas = this;
})()