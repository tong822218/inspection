/*检验页面js*/
var items = ''; //所有检查项
var itemRules = ''; //所有检查项规则
var itemTypes = ''; //所有检查大项
var list = []; //每个检查大项下的检查项
var currentTypeIndex = 0; //当前检测大项的index
var currentIdex = 0; //当前list 的 index;
var batchId = ''; //检测批次id
//初始化数据库以及数据
var mydb = new DataBase({
	dbName: "escort_inspection",
	version: "5",
	data: datas.data
}, function callback() {
	mydb.fetchStoreByCursor("insp_items");
	mydb.fetchStoreByCursor("insp_item_rules");
	mydb.fetchStoreByCursor("insp_item_type");
	var itv = setInterval(function() {
		items = mydb.inspItems;
		itemRules = mydb.itemRules;
		itemTypes = mydb.itemTypes;
		console.log(items);
		console.log(itemRules);

		if(items != '' && itemRules != '' && itemTypes != '') {
			window.clearInterval(itv);
			initDom();
		}
	}, 200);
});
//根据检查大项的index获取检测子项
function getItemsByType() {
	list = [];
	for(var i = 0; i < items.length; i++) {
		if(itemTypes[currentTypeIndex]['itemTypeId'] == items[i]['itemTypeId']) {
			list.push(items[i]);
		}
	}
	currentTypeIndex++;
}
//初始化dom
function initDom() {
	hideAll();
	currentIdex = 0;
	if(currentTypeIndex == itemTypes.length) {
		return;
	}

	getItemsByType();

	if(list[0]['answerTypeId'] == 1) {
		$(".content .text").css({
			"display": "block"
		});
	} else if(list[0]['answerTypeId'] == 2) {
		$(".content .hasimg").css({
			"display": "block"
		});
	} else if(list[0]['answerTypeId'] == 3) {
		$(".content .radio").css({
			"display": "block"
		});
	} else if(list[0]['answerTypeId'] == 4) {
		$(".content .multiselect").css({
			"display": "flex"
		});
	}
	$(".question .text .big").html(list[0]['itemShowName']);
	$(".question .text .little").html(list[0]['itemStandard']);
}
//加载上一页面
function LoadPreDom(preItem,preItemImg) {
	hideAll();
	var item;
	for(var i = 0; i < list.length; i++) {
		if(list[i]['id'] == preItem['itemId']) {
			item = list[i];
		}
	}
	if(item != null && item != undefined) {
		if(item['answerTypeId'] == 1) {
			$(".content .text").css({
				"display": "block"
			});
			$("#result").val(preItem['value']);
		} else if(item['answerTypeId'] == 2) {
			$(".content .hasimg").css({
				"display": "block"
			});
			$("#result").val(preItem['value']);
			var html1='';
			var html = $(".imgs").html();
			var im='';
			for(var i=0;i<preItemImgre.length;i++){
				html1 += '<div style="background: url("' + preItemImg[i] + '") no-repeat;background-size: contain"><a> <input type="file" onchange="fileChange(this,1)" /> </a></div>';
				im += preItemImg[i];
				im += '$$';
			}
			html1+=html;
			$(".imgs").html(html1);
			$("#imgs").val(im);
		} else if(item['answerTypeId'] == 3) {
			$(".content .radio").css({
				"display": "block"
			});
			$("#result").val(preItem['value']);
		} else if(item['answerTypeId'] == 4) {
			$(".content .multiselect").css({
				"display": "flex"
			});
			$("#result").val(preItem['value']);
		}
		$(".question .text .big").html(item['itemShowName']);
		$(".question .text .little").html(item['itemStandard']);
		currentIdex -= 1;
	}

}
//加载下一页面
function LoadNextDom(result) {
	hideAll();
	var flag = false;
	for(var i = 0; i < itemRules.length; i++) {
		if(itemRules[i]['itemResult'] == result && itemRules[i]['itemId'] == list[currentIdex]['itemId']) {
			for(var j = 0; j < list.length; j++) {
				if(list[j]['itemId'] == itemRules[i]['childItemId']) {
					flag = true;
					var item = list[j];
					if(item['answerTypeId'] == 1) {
						$(".content .text").css({
							"display": "block"
						});
					} else if(item['answerTypeId'] == 2) {
						$(".content .hasimg").css({
							"display": "block"
						});
					} else if(item['answerTypeId'] == 3) {
						$(".content .radio").css({
							"display": "block"
						});
					} else if(item['answerTypeId'] == 4) {
						$(".content .multiselect").css({
							"display": "flex"
						});
					}
					$(".question .text .big").html(item['itemShowName']);
					$(".question .text .little").html(item['itemStandard']);
				}
			}

		}
	}
	if(!flag) {
		isLastpage();
	}
	currentIdex += 1;

}
//显示提交页面
function lastPage() {
	hideAll();
	$(".content .submit").css({
		"display": "block"
	});
	$(".question .text").html('<font style="font-size:33px;color: #fff;line-height:60px;">已全部审核完毕 !</font>');
	$(".button .pre").css({
		"display": "none"
	});
	$(".button .next").css({
		"display": "none"
	});
}
//上一题
function pre() {
	
	var res = localStorage.getItem(batchId);
	if(res != null && res != undefined && res != '') {
		$("#result").val("");
		$("#imgs").val("");
		res = JSON.parse(res);
		var items = res['items'];
		var photos = res['photos'];
		var itemId = list[currentIdex]['id'];
		var preItem;
		var preItemImg=[];
		for(var i = 0; i < items.length; i++) {
			if(items[i]['itemId'] == itemId) {
				preItemId = items[i - 1 < 0 ? 0 : i - 1];
			}
		}
		for(var i=0;i<photos.length;i++){
			if(photos[i]==itemId){
				preItemImg.push(photos[i]['image']);
			}
		}
		if(preItem != null && preItem != undefined) {
			LoadPreDom(preItem,preItemImg);
		}
	}

}
//下一题
function next() {

	var result = $("#result").val();
	var imgs = $("#imgs").val();
	if(result != "") {
		savaItem(result, imgs);
	}

	if(list[currentIdex]['answerTypeId'] == 1) {
		isLastpage();

	} else {
		if(currentIdex > items.length - 1) {
			isLastpage();
		}
		LoadNextDom(result);
	}
	$("#result").val("");
	$("#imgs").val("");

}
//将本条的检测结果缓存到本地
function savaItem(result, imgs) {
	var itemId = list[currentIdex]['id'];
	var item = {
		"itemId": itemId,
		"value": result
	};
	if(batchId == '') {
		batchId = $("#batchId").val();
	}
	var res = localStorage.getItem(batchId);
	if(res == null) {
		res = {
			items: [],
			photos: []
		};
		res.items.push(item);
		var ims = imgs.split("$$");
		for(var i = 0; i < ims.length; i++) {
			if(ims[i] != '') {
				var photo = {
					"itemId": itemId,
					"image": ims[i]
				};
				res.photos.push(photo);
			}
		}
	} else {
		res = JSON.parse(res);
		var items = res['items'];
		var photos = res['photos'];

		var flag = false;
		for(var i = 0; i < items.length; i++) {
			if(items[i]['itemId'] == itemId) {
				flag = true;
				items[i] = item;
			}
		}
		if(!flag) {
			items.push(item);
		}
		
		for(var i = 0; i < photos.length; i++) {
			if(photos[i]['itemId'] == itemId) {
				photos.splice(i, 1);
			}
		}
		var ims = imgs.split("$$");
		for(var i = 0; i < ims.length; i++) {
			if(ims[i] != '') {
				var photo = {
					"itemId": itemId,
					"image": ims[i]
				};
				res.photos.push(photo);
			}
		}

		res['items'] = items;
		res['photos'] = photos;
	}

	var str = JSON.stringify(res);
	localStorage.setItem(batchId, str);
}
//隐藏所有检查项
function hideAll() {
	$(".content .text").css({
		"display": "none"
	});
	$(".content .hasimg").css({
		"display": "none"
	});
	$(".content .radio").css({
		"display": "none"
	});
	$(".content .multiselect").css({
		"display": "none"
	});
}
//判断是不是最后一个检查大项，如果是就跳到提交页面，不是跳到下一个检测大项
function isLastpage() {
	if(currentTypeIndex == itemTypes.length) { //如果是最后一个检测大项了直接跳到提交页面
		lastPage();
	} else {
		initDom();
	}
}
//输入问题改变时
function changeResult(dom, sta) {
	switch(sta) {
		case 1:
			$("#result").val($(dom).val());
			break;
		case 2:
			$("#result").val($(dom).html());
			break;
		default:
			break;
	}

}
//单选
function selOne(sta) {
	if(sta == 1) {
		$("#radio-yes img").attr("src", "img/isp_yes.png");
		$("#radio-no img").attr("src", "img/isp_nosel.png");
		$("#result").val("1");
	} else {
		$("#radio-no img").attr("src", "img/isp_no.png");
		$("#radio-yes img").attr("src", "img/isp_nosel.png");
		$("#result").val("0");
	}
}
//多选
function selMul(obj) {
	var rel = $("#result").val();
	var re = $(obj).find("span").html();
	re += "$";
	if($(obj).find('img').attr("src") == 'img/isp_sel.png') {
		$(obj).find('img').attr("src", "img/isp_nosel.png");
		var s = rel.replace(re, "");
		$("#result").val(s);
	} else {
		$(obj).find('img').attr("src", "img/isp_sel.png");
		$("#result").val(rel += re);
	}
}
//有图片的检测类型文本框获取焦点时清空提示字
function hasimgOnFocus(obj) {
	if($(obj).html() == '请输入描述') {
		$(obj).html('');
	}
}
//有图片的检测类型文本框失去焦点时，将内容存入隐藏的文本框中
function hasimgOnBlur(obj) {
	var im = $(obj).html();
	$("#result").val(im);
}

//-------------------------------------图片处理，压缩，转换base64等---------------------------------------------------------------------------------------

// 文件上传时触发
function fileChange(e, idx) {
	var _this = e;
	var _idx = idx;
	var f = e.files[0]; // 一次只上传1个文件，其实可以上传多个的
	var FR = new FileReader();
	FR.readAsDataURL(f);
	FR.onload = function(f) {
		compressImg(this.result, 800, function(data) {
			$(_this).parent().css({
				"background": "url('" + data + "') no-repeat",
				"background-size": "contain"
			}); // 保存图片压缩后的64位编码
			var html = $(".imgs").html();
			html += '<div><a> <input type="file" onchange="fileChange(this,1)" /> </a></div>';
			$(".imgs").html(html);
			var im = $("#imgs").val();
			im += data;
			im += '$$';
			$("#imgs").val(im);
			//			var ss = $(_this).parent().get(0).id;
			//			$("#a" + (ss.slice(-1) * 1 + 1)).css({
			//				"display" : "block"
			//			});// 在下一个位置显示加号图片
			//			imgArr.push(data);
			//			e.addEventListener('click', a, false);
			//			$(_this).click({
			//				"ind" : ss.slice(-1) * 1 - 1
			//			}, openBig);
			//			$("#img" + idx).val(data);
			//			var id = $("#imgid" + idx).val();
			//			if (id != undefined && id != "") {
			//				var value = $("#originalImages").val();
			//				$("#originalImages").val(value + id + ",");
			//			}
		});
	};
}

// 将图片压缩转成64base
function compressImg(imgData, maxHeight, onCompress) {
	if(!imgData)
		return false;
	onCompress = onCompress || function() {};
	maxHeight = maxHeight || 800; // 默认最大高度800px
	var canvas = document.createElement('canvas');
	var img = new Image();
	img.src = imgData;

	img.onload = function() {
		if(img.height > maxHeight) { // 按最大高度等比缩放
			img.width *= maxHeight / img.height;
			img.height = maxHeight;
		}

		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0, img.width, img.height);
		onCompress(canvas.toDataURL("image/jpeg"));
	};
}