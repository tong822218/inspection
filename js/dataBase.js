function DataBase(ops, callback) {
	this.dbName = ops.dbName;
	this.version = ops.version;
	this.shops = [];
	this.inspItems = [];
	this.itemRules = [];
	this.itemTypes= [];
	this.itemOptions=[];
	this.init(ops.dbName, ops.version, ops.data, callback);
}

//初始化数据库
DataBase.prototype.init = function(name, version, data, callback) {


	var self = this;
	this.compatibility(); //浏览器兼容
	var request = window.indexedDB.open(name, version)
	request.onupgradeneeded = function(e) {
		alert("updae");
		var db = self.db = request.result;
		self.creatDB(db, data);
		console.log('DB version changed to ' + version);
	};
	request.onsuccess = function(e) {
		self.db = e.target.result;
		//self.fetchStoreByCursor('shops');
		callback();
		alert('success！');
	};
	request.onerror = function(e) {
		alert(e.currentTarget.error.message);
		console.log(e.currentTarget.error.message);
	};
}

//添加数据
DataBase.prototype.addData = function(store, data) {

		store.add(data);

	}
	//通过key获取数据
DataBase.prototype.getDataByKey = function(storeName, value) {
		var transaction = this.db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		var request = store.get(value);
		request.onsuccess = function(e) {
			var student = e.target.result;
			console.log(student.name);
		};
	}
	//通过key更新数据
DataBase.prototype.updateDataByKey = function(storeName, value) {

		var transaction = this.db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);

		var request = store.get(value);
		request.onsuccess = function(e) {
			var student = e.target.result;
			student.age = 35;
			store.put(student);
		};
	}
	//通过key删除数据
DataBase.prototype.deleteDataByKey = function(storeName, value) {
		var transaction = this.db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		store.delete(value);
	}
	//清空表
DataBase.prototype.clearObjectStore = function(storeName) {
		var transaction = this.db.transaction(storeName, 'readwrite');
		var store = transaction.objectStore(storeName);
		store.clear();
	}
	//删除表
DataBase.prototype.deleteObjectStore = function(storeName) {
		var transaction = this.db.transaction(storeName, 'versionchange');
		db.deleteObjectStore(storeName);
	}
	//通过游标遍历表
//DataBase.prototype.fetchStoreByCursor = function(storeName) {
//	var self = this;
//	var transaction = self.db.transaction(storeName);
//	var store = transaction.objectStore(storeName);
//	var request = store.openCursor();
//	var haha = [];
//	request.onsuccess = function(e) {
//		var cursor = e.target.result;
//		if(cursor) {
//			self.shops.push(cursor.value);
//			cursor.continue();
//		} else {
//			self.setDistanceByShop(120.27218754154188, 36.27380727286948);
//			self.orderShopByDistance();
//		}
//	};
//}

//通过游标遍历表
DataBase.prototype.fetchStoreByCursor = function(storeName) {
	var self = this;
	var transaction = self.db.transaction(storeName);
	var store = transaction.objectStore(storeName);
	var request = store.openCursor();
	request.onsuccess = function(e) {
		var cursor = e.target.result;
		if(storeName == 'shops') { //店铺表
			if(cursor) {
				self.shops.push(cursor.value);
				cursor.continue();
			} else {
				self.setDistanceByShop(120.27218754154188, 36.27380727286948);
				self.orderShopByDistance();
			}
		} else if(storeName == 'insp_items') { //检查项表
			if(cursor) {
				self.inspItems.push(cursor.value);
				cursor.continue();
			} else {}
		} else if(storeName == 'insp_item_rules') { //检查项规则表
			if(cursor) {
				self.itemRules.push(cursor.value);
				cursor.continue();
			} else {}
		}else if(storeName == 'insp_item_type') { //检查项规则表
			if(cursor) {
				self.itemTypes.push(cursor.value);
				cursor.continue();
			} else {
				
			}
		}else if(storeName == 'insp_options') { //检查项规则表
			if(cursor) {
				self.itemOptions.push(cursor.value);
				cursor.continue();
			} else {
				
			}
		}
	};
}

//通过索引查询数据
DataBase.prototype.getDataByIndex = function(storeName) {
		var transaction = this.db.transaction(storeName);
		var store = transaction.objectStore(storeName);
		var index = store.index("ageIndex");
		index.get(26).onsuccess = function(e) {
			var student = e.target.result;
			console.log(student.id);
		}
	}
	//通过index索引遍历表
DataBase.prototype.getMultipleData = function(storeName) {
		var transaction = this.db.transaction(storeName);
		var store = transaction.objectStore(storeName);
		var index = store.index("nameIndex");
		var request = index.openCursor(null, IDBCursor.prev);
		request.onsuccess = function(e) {
			var cursor = e.target.result;
			if(cursor) {
				var student = cursor.value;
				console.log(student.name);
				cursor.continue();
			}
		}
	}
	//关闭数据库
DataBase.prototype.closeDB = function() {
		this.db.close();
	}
	//删除数据库
DataBase.prototype.deleteDB = function(name) {
		indexedDB.deleteDatabase(name);
	}
	//创建表和插入内容
DataBase.prototype.creatDB = function(db, data) {
		var self = this;
		// create table
		for(var i in data) {
			var item = data[i];
			if(item.tableName == 'cities') {
				if(!db.objectStoreNames.contains('cities')) {
					var store = db.createObjectStore('cities', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('cityId_idx', 'city_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'shops') {
				if(!db.objectStoreNames.contains('shops')) {
					var store = db.createObjectStore('shops', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('shopId_idx', 'shop_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'insp_batch') {
				if(!db.objectStoreNames.contains('insp_batch')) {
					var store = db.createObjectStore('insp_batch', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('batchId_idx', 'batch_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'insp_item_rules') {
				if(!db.objectStoreNames.contains('insp_item_rules')) {
					var store = db.createObjectStore('insp_item_rules', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('ruleId_idx', 'rule_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'insp_items') {
				if(!db.objectStoreNames.contains('insp_items')) {
					var store = db.createObjectStore('insp_items', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('itemId_idx', 'item_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'insp_item_type') {
				if(!db.objectStoreNames.contains('insp_item_type')) {
					var store = db.createObjectStore('insp_item_type', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('itemTypeId_idx', 'item_type_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'insp_options') {
				if(!db.objectStoreNames.contains('insp_options')) {
					var store = db.createObjectStore('insp_options', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('optionId_idx', 'option_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'insp_template') {
				if(!db.objectStoreNames.contains('insp_template')) {
					var store = db.createObjectStore('insp_template', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('templateId_idx', 'template_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'insp_template_info') {
				if(!db.objectStoreNames.contains('insp_template_info')) {
					var store = db.createObjectStore('insp_template_info', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('templateInfoId_idx', 'template_info_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'inspections') {
				if(!db.objectStoreNames.contains('inspections')) {
					var store = db.createObjectStore('inspections', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('inspectionId_idx', 'inspection_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			} else if(item.tableName == 'inspectors') {
				if(!db.objectStoreNames.contains('inspectors')) {
					var store = db.createObjectStore('inspectors', {
						keyPath: 'id',
						autoIncrement: true
					});
					store.createIndex('inspectorId_idx', 'inspector_id', {
						unique: true
					});
					for(var x in item.content) {
						var it = item.content[x];
						self.addData(store, it);
					}
				}
			}
		}

	}
	//浏览器兼容
DataBase.prototype.compatibility = function() {
	//	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	//	var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
	//	var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

	//	if(!window.indexedDB) {
	//		if(window.mozIndexedDB) {
	//			window.indexedDB = window.mozIndexedDB;
	//		} else if(window.webkitIndexedDB) {
	//			window.indexedDB = webkitIndexedDB;
	//			IDBCursor = webkitIDBCursor;
	//			IDBDatabaseException = webkitIDBDatabaseException;
	//			IDBRequest = webkitIDBRequest;
	//			IDBKeyRange = webkitIDBKeyRange;
	//			IDBTransaction = webkitIDBTransaction;
	//		} else {
	//			document.getElementById('bodyElement').innerHTML = "<h3>IndexedDB is not supported - upgrade your browser to the latest version.</h3>";
	//			return false;
	//		}
	//	}

	window.indexedDB = window.indexedDB ||
		window.mozIndexedDB ||
		window.webkitIndexedDB ||
		window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction ||
		window.webkitIDBTransaction ||
		window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange ||
		window.webkitIDBKeyRange ||
		window.msIDBKeyRange;
}

//根据经纬度计算两个点的距离
DataBase.prototype.getDistance = function(lng1, lat1, lng2, lat2) {
	var PI = 3.14159265358979323; // 圆周率
	var R = 6371229; // 地球的半径

	var x, y, distance;
	x = (lng2 - lng1) * PI * R * Math.cos(((lat1 + lat2) / 2) * PI / 180) / 180;
	y = (lat2 - lat1) * PI * R / 180;
	distance = Math.hypot(x, y);
	return distance;

}

//根据距离排序店铺，返回排序结果
DataBase.prototype.setDistanceByShop = function(lng, lat) {
	for(var i in this.shops) {
		var item = this.shops[i];
		var dis = this.getDistance(lng, lat, item.lng, item.lat);
		this.shops[i].distance = dis;
	}
}
DataBase.prototype.orderShopByDistance = function() {

	this.shops.sort(function(a, b) {
		return a.distance - b.distance;
	});
	for(var i = 0; i < this.shops.length; i++) {
		document.writeln('<br />店名:' + this.shops[i].title + ' name:' + this.shops[i].distance);
	}
}