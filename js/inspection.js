/*检验页面js*/
var items = ''; //所有检查项
var itemRules = ''; //所有检查项规则
var itemTypes = ''; //所有检查大项
var list = []; //每个检查大项下的检查项
var currentTypeIndex = 0; //当前检测大项的index
var currentIdex = 0; //当前list 的 index;

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

function getItemsByType() {
	list=[];
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
	currentIdex=0;
	if(currentTypeIndex==(itemTypes.length-1)){
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
	$(".question .text .big").html(list[0]['itemName']);
	$(".question .text .little").html(list[0]['itemStandard']);
}
//重新加载页面
function reLoadDom(result) {
	hideAll();
	for(var i = 0; i < itemRules.length; i++) {
		if(itemRules[i]['itemResult'] == result && itemRules[i]['itemId'] == list[currentIdex]['itemId']) {
			for(var j = 0; j < list.length; j++) {
				if(list[j]['itemId'] == itemRules[i]['childItemId']) {
					var item = items[j];
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
					$(".question .text .big").html(item['itemName']);
					$(".question .text .little").html(item['itemStandard']);
				}
			}

		}
	}
	currentIdex += 1;

}
//上一题
function pre() {
	$("#result").val("");
	$("#imgs").val("");
	currentIdex -= 1
	if(currentIdex < 0) {
		currentIdex = 0;
	}
	reLoadDom();
}
//下一题
function next() {
	var result = $("#result").val();
	if(list[currentIdex]['answerTypeId']==1) {
		initDom();
	} else {
		if(currentIdex > items.length - 1) {
			initDom();
		}
		reLoadDom(result);
	}
	$("#result").val("");
	$("#imgs").val("");

}


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
function selOne(sta){
	if(sta==1){
		$("#radio-yes img").attr("src","img/isp_yes.png");	
		$("#radio-no img").attr("src","img/isp_nosel.png");	
		$("#result").val("1");
	}else{
		$("#radio-no img").attr("src","img/isp_no.png");	
		$("#radio-yes img").attr("src","img/isp_nosel.png");	
		$("#result").val("0");
	}
}
//多选
function selMul(obj){
	var rel=$("#result").val();
	var re=$(obj).find("span").html();
	re+="$";
	if($(obj).find('img').attr("src")=='img/isp_sel.png'){
		$(obj).find('img').attr("src","img/isp_nosel.png");
		var s=rel.replace(re,"");
		$("#result").val(s);
	}else{
		$(obj).find('img').attr("src","img/isp_sel.png");
		$("#result").val(rel+=re);
	}
}



//-------------------------------------图片处理---------------------------------------------------------------------------------------

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
				"background" : "url('" + data + "') no-repeat",
				"background-size" : "contain"
			}); // 保存图片压缩后的64位编码
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
	if (!imgData)
		return false;
	onCompress = onCompress || function() {
	};
	maxHeight = maxHeight || 800; // 默认最大高度800px
	var canvas = document.createElement('canvas');
	var img = new Image();
	img.src = imgData;

	img.onload = function() {
		if (img.height > maxHeight) { // 按最大高度等比缩放
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