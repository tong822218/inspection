/*检验页面js*/
var items = ''; //所有检查项
var itemRules = ''; //所有检查项规则
var itemTypes = ''; //所有检查大项
var itemOptions = ''; //所有的多选题单选题的检查项
var list = []; //每个检查大项下的检查项
var currentTypeIndex = 0; //当前检测大项的index
var currentIdex = 0; //当前list 的 index;
var batchId = ''; //检测批次id
var currentId; //list中当前的item 的id
//初始化数据库以及数据
var mydb = new DataBase({
	dbName: "escort_inspection",
	version: "5",
	data: datas.data
}, function callback() {
	mydb.fetchStoreByCursor("insp_items");
	mydb.fetchStoreByCursor("insp_item_rules");
	mydb.fetchStoreByCursor("insp_item_type");
	mydb.fetchStoreByCursor("insp_options");

	var itv = setInterval(function() {
		items = mydb.inspItems;
		itemRules = mydb.itemRules;
		itemTypes = mydb.itemTypes;
		itemOptions = mydb.itemOptions;
		console.log(items);
		console.log(itemRules);

		if(items != '' && itemRules != '' && itemTypes != '' && itemOptions != '') {
			window.clearInterval(itv);

			list.indexof = function(itemId) {
				for(var i = 0; i < list.length; i++) {
					if(list[i]['itemId'] == itemId)
						return i;
				}
			}
			currentId = items[0]['itemId'];
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
function initDom(preOrNex) {
	if(batchId == '') {
		batchId = $("#batchId").val();
	}
	hideAll();
	currentIdex = 0;
	if(currentTypeIndex == itemTypes.length) {
		return;
	}
	getItemsByType();
	var preItem, preItemImg;
	var res = ischecked(preOrNex);
	if(res != null && res != undefined) {
		preItem = res['preItem'];
		preItemImg = res['preItemImg'];
	}
	if(preItem != null && preItem != undefined) {
		var item;
		for(var i = 0; i < items.length; i++) {
			if(items[i]['itemId'] == preItem['itemId']) {
				item = items[i];
				break;
			}
		}
		if(item != undefined) {
			if(item['answerTypeId'] == 4) {
				$(".content .hasimg").css({
					"display": "block"
				});
				$("#result").val(preItem['value']);
				var html1 = '';
				var html = $(".imgs").html();
				var im = '';
				$(".hasimg .insert-text").html(preItem['value']);
				for(var i = 0; i < preItemImgre.length; i++) {
					html1 += '<div style="background: url("' + preItemImg[i] + '") no-repeat;background-size: contain"><a> <input type="file" onchange="fileChange(this,1)" /> </a></div>';
					im += preItemImg[i];
					im += '$$';
				}
				html1 += html;
				$(".imgs").html(html1);
				$("#imgs").val(im);
			} else if(item['answerTypeId'] == 1) {
				$(".content .radio").css({
					"display": "block"
				});
				$("#result").val(preItem['value']);
				if(preItem['value'] == '1') {
					$("#radio-yes img").attr("src", "img/isp_yes.png");
				} else {
					$("#radio-no img").attr("src", "img/isp_no.png");
				}
			} else if((item['answerTypeId'] == 2) || (item['answerTypeId'] == 3)) {
				$(".content .multiselect").css({
					"display": "flex"
				});
				$("#result").val(preItem['value']);
				var html = '';
				for(var i = 0; i < itemOptions.length; i++) {
					if(itemOptions[i]['itemId'] == item['itemId']) {
						html += '<div class="item" onclick="selMul(this)"><span>' + itemOptions[i]['optionName'] + '</span>'
						var arr = preItem['value'].split("$");
						var flag = false;
						for(var j = 0; j < arr.length; j++) {
							if(arr[j] == itemOptions[i]['optionName']) {
								flag = true;
								break;
							}
						}
						if(flag) {
							html += '<img src="img/isp_sel.png"></div>'
						} else {
							html += '<img src="img/isp_nosel.png"></div>'
						}
					}
				}
				html += '<div style="clear:both"></div>';
				$(".multiselect").html(html);

			}
			currentId = item['itemId'];
			$(".question .text .big").html(item['itemShowName']);
			$(".question .text .little").html(item['itemStandard']);
		}

	} else { //如果没有检查结果执行此处

		if(list[0]['answerTypeId'] == 4) {
			$(".content .hasimg").css({
				"display": "block"
			});
		} else if(list[0]['answerTypeId'] == 1) {
			$(".content .radio").css({
				"display": "block"
			});
		} else if((list[0]['answerTypeId'] == 2) || (list[0]['answerTypeId'] == 3)) {
			$(".content .multiselect").css({
				"display": "flex"
			});
			var html = '';
			for(var i = 0; i < itemOptions.length; i++) {
				if(itemOptions[i]['itemId'] == list[0]['itemId']) {
					html += '<div class="item" onclick="selMul(this)"><span>' + itemOptions[i]['optionName'] + '</span><img src="img/isp_nosel.png"></div>'
				}
			}
			html += '<div style="clear:both"></div>';
			$(".multiselect").html(html);
		}
		currentId = list[0]['itemId'];
		$(".question .text .big").html(list[0]['itemShowName']);
		$(".question .text .little").html(list[0]['itemStandard']);
	}

}
//加载上一页面或者下一页
function LoadPreDom(preItem, preItemImg, preOrNext) {
	hideAll();
	var item;
	for(var i = 0; i < items.length; i++) {
		if(items[i]['itemId'] == preItem['itemId']) {
			item = items[i];
			break;
		}
	}
	if(item != null && item != undefined) {
		if(item['answerTypeId'] == 4) {
			$(".content .hasimg").css({
				"display": "block"
			});
			$("#result").val(preItem['value']);
			var html1 = '';
			var html = $(".imgs").html();
			var im = '';
			$(".hasimg .insert-text").html(preItem['value']);
			for(var i = 0; i < preItemImgre.length; i++) {
				html1 += '<div style="background: url("' + preItemImg[i] + '") no-repeat;background-size: contain"><a> <input type="file" onchange="fileChange(this,1)" /> </a></div>';
				im += preItemImg[i];
				im += '$$';
			}
			html1 += html;
			$(".imgs").html(html1);
			$("#imgs").val(im);
		} else if(item['answerTypeId'] == 1) {
			$(".content .radio").css({
				"display": "block"
			});
			$("#result").val(preItem['value']);
			if(preItem['value'] == '1') {
				$("#radio-yes img").attr("src", "img/isp_yes.png");
			} else {
				$("#radio-no img").attr("src", "img/isp_no.png");
			}
		} else if((item['answerTypeId'] == 2) || (item['answerTypeId'] == 3)) {
			$(".content .multiselect").css({
				"display": "flex"
			});
			$("#result").val(preItem['value']);
			var html = '';
			for(var i = 0; i < itemOptions.length; i++) {
				if(itemOptions[i]['itemId'] == item['itemId']) {
					html += '<div class="item" onclick="selMul(this)"><span>' + itemOptions[i]['optionName'] + '</span>'
					var arr = preItem['value'].split("$");
					var flag = false;
					for(var j = 0; j < arr.length; j++) {
						if(arr[j] == itemOptions[i]['optionName']) {
							flag = true;
							break;
						}
					}
					if(flag) {
						html += '<img src="img/isp_sel.png"></div>'
					} else {
						html += '<img src="img/isp_nosel.png"></div>'
					}
				}
			}
			html += '<div style="clear:both"></div>';
			$(".multiselect").html(html);

		}
		$(".question .text .big").html(item['itemShowName']);
		$(".question .text .little").html(item['itemStandard']);
		currentId = item['itemId'];
		var f = false;
		for(var i = 0; i < itemRules.length; i++) { //判断是否还有下一个子检查项，没有就在大项加1
			if(itemRules[i]['itemId'] == item['itemId'] && itemOptions[i]['itemResult'] == preItem['value']) {
				f = true;
				if(itemOptions[i]['childItemId'] == null || itemOptions[i]['childItemId'] == undefined || itemOptions[i]['childItemId'] == '') {
					if(preOrNext == 'pre') {
						currentTypeIndex--;
						currentTypeIndex = (currentTypeIndex < 0 ? 0 : currentTypeIndex);
					} else {
						currentTypeIndex++;
						currentTypeIndex = (currentTypeIndex > itemTypes.length ? itemTypes.length : currentTypeIndex);
					}
				}
			}
		}
		if(!f) {
			if(preOrNext == 'pre') {
				currentTypeIndex--;
				currentTypeIndex = (currentTypeIndex < 0 ? 0 : currentTypeIndex);
			} else {
				currentTypeIndex++;
				currentTypeIndex = (currentTypeIndex > itemTypes.length ? itemTypes.length : currentTypeIndex);
			}
		}
	} else {
		isLastpage(preOrNext);
	}

}
//加载下一页面
function LoadNextDom(result) {
	hideAll();
	var flag = false;
	for(var i = 0; i < itemRules.length; i++) {
		if(flag) {
			break;
		}
		if(itemRules[i]['itemResult'] == result && itemRules[i]['itemId'] == currentId) {
			for(var j = 0; j < items.length; j++) {
				if(items[j]['itemId'] == itemRules[i]['childItemId']) {
					flag = true;
					var item = items[j];
					if(item['answerTypeId'] == 4) {
						$(".content .hasimg").css({
							"display": "block"
						});
					} else if(item['answerTypeId'] == 1) {
						$(".content .radio").css({
							"display": "block"
						});
					} else if((item['answerTypeId'] == 2) || (item['answerTypeId'] == 3)) {
						$(".content .multiselect").css({
							"display": "flex"
						});
						var html = '';
						for(var i = 0; i < itemOptions.length; i++) {
							if(itemOptions[i]['itemId'] == item['itemId']) {
								html += '<div class="item" onclick="selMul(this)"><span>' + itemOptions[i]['optionName'] + '</span><img src="img/isp_nosel.png"></div>'
							}
						}
						html += '<div style="clear:both"></div>';
						$(".multiselect").html(html);
					}
					$(".question .text .big").html(item['itemShowName']);
					$(".question .text .little").html(item['itemStandard']);
					//currentIdex = list.indexof(item['itemId']);
					currentId = item['itemId'];
					break;
				}
			}
		}
	}
	if(!flag) {
		isLastpage('next');
	}

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
	clearVal();
	var res = ischecked('pre');
	var preItem = res['preItem'];
	var preItemImg = res['preItemImg'];

	if(preItem != null && preItem != undefined) {
		LoadPreDom(preItem, preItemImg, 'pre');
	}
}
//下一题
function next() {

	var result = $("#result").val();
	var imgs = $("#imgs").val();
	clearVal();
	if(result != "") {
		savaItem(result, imgs);
	}else{
		alert('检验结果不能为空！');
		return;
	}
	var res = ischecked('next');
	var preItem = res['preItem'];
	var preItemImg = res['preItemImg'];

	if(preItem != null && preItem != undefined) {
		LoadPreDom(preItem, preItemImg, 'next');
	} else {
		if(list[currentIdex] && list[currentIdex]['answerTypeId'] == 4) {
			isLastpage('next');
		} else {
			if(list[currentIdex]) {
				LoadNextDom(result);
			} else {
				isLastpage('next');
			}
		}
		$("#result").val("");
		$("#imgs").val("");

	}
}

//判断是不是已经检查过了（再本地缓存中是否存在）
function ischecked(nextOrPre) {
	var res = localStorage.getItem(batchId);
	if(res != null && res != undefined && res != '') {
		$("#result").val("");
		$("#imgs").val("");
		res = JSON.parse(res);
		var items = res['inspections'];
		var photos = res['inspectionPhotos'];
		//var itemId = items[currentIdex]['itemId'];
		var preItem;
		var preItemImg = [];
		var f = false;
		for(var i = 0; i < items.length; i++) {
			if(items[i]['itemId'] == currentId) {
				f = true;
				if(nextOrPre == 'pre') {
					preItem = items[i - 1 < 0 ? 0 : i - 1];
				} else if(nextOrPre == 'next') {
					preItem = items[i + 1];
				} else {
					preItem = items[i];
				}
			}
		}
		if(!f) {
			if(nextOrPre == 'pre') {
				preItem = items[items.length - 1];
			}
		}
		for(var i = 0; i < photos.length; i++) {
			if(photos[i]['itemId'] == preItem['itemId']) {
				preItemImg.push(photos[i]['image']);
			}
		}

		return {
			"preItem": preItem,
			"preItemImg": preItemImg
		};
	}
}
//将本条的检测结果缓存到本地
function savaItem(result, imgs) {
	var itemId = currentId;
	var item = {
		"itemId": itemId,
		"value": result
	};
	var res = localStorage.getItem(batchId);
	if(res == null) {
		res = {
			inspections: [],
			inspectionPhotos: []
		};
		res.inspections.push(item);
		var ims = imgs.split("$$");
		for(var i = 0; i < ims.length; i++) {
			if(ims[i] != '') {
				var photo = {
					"itemId": itemId,
					"image": ims[i]
				};
				res.inspectionPhotos.push(photo);
			}
		}
	} else {
		res = JSON.parse(res);
		var items = res['inspections'];
		var photos = res['inspectionPhotos'];

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
				photos.push(photo);
			}
		}

		res['inspections'] = items;
		res['inspectionPhotos'] = photos;
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
function isLastpage(preOrNext) {
	if(currentTypeIndex == itemTypes.length) { //如果是最后一个检测大项了直接跳到提交页面
		lastPage();
	} else {
		initDom(preOrNext);
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

function clearVal() {
	$("#result").val("");
	$("#imgs").val("");
	$(".hasimg .insert-text").val("");
	var html = '';
	html += '<div><a> <input type="file" onchange="fileChange(this,1)" /> </a></div>';
	$(".hasimg .imgs").html(html);
	$(".radio img").attr("src", "img/isp_nosel.png");

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