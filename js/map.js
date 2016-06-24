//地图js
$(function() {
	var lng = '120.404910172864'; //选择店铺经度
	var lat = '36.110556692442'; //选择店铺纬度
	var lng1 = '120.404910172864'; //选择店铺经度
	var lat1 = '36.110556692442'; //选择店铺纬度
	// 百度地图API功能
	//GPS坐标
	var ggPoint = new BMap.Point(lng, lat);
	var ggPoint1 = new BMap.Point(lng1, lat1);

	//地图初始化
	var map = new BMap.Map("allmap");
	map.centerAndZoom(ggPoint, 15);
	map.addControl(new BMap.NavigationControl());
	map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
	map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用

	//坐标转换完之后的回调函数
	translateCallback = function(data) {
		if (data.status === 0) {
			var marker = new BMap.Marker(data.points[0]);
			map.addOverlay(marker);
			marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			if (lng1 != undefined && lat1 != undefined) {
				var myIcon1 = new BMap.Icon("img/map_location_icon.png", new BMap.Size(40, 40));
				var marker1 = new BMap.Marker(data.points[1], {
					icon: myIcon1
				}); // 创建标注
				map.addOverlay(marker1);
				marker1.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			}
			// var label = new BMap.Label("转换后的百度坐标（正确）",{offset:new BMap.Size(20,-10)});
			//marker.setLabel(label); //添加百度label
			map.setCenter(data.points[0]);
		}
	};

	setTimeout(function() {
		var convertor = new BMap.Convertor();
		var pointArr = [];
		pointArr.push(ggPoint);
		if (lng1 != undefined && lat1 != undefined) {
			pointArr.push(ggPoint1);
		}
		convertor.translate(pointArr, 1, 5, translateCallback);
	}, 1000);
})