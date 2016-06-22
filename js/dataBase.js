function DataBase(ops) {
	this.dbName = ops.dbName;
	this.version = ops.version;
	this.init(ops.dbName, ops.version, ops.data);
}

//初始化数据库
DataBase.prototype.init = function(name, version, data) {
	var self = this;
	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
	var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

	if (!window.indexedDB) {
		if (window.mozIndexedDB) {
			window.indexedDB = window.mozIndexedDB;
		} else if (window.webkitIndexedDB) {
			window.indexedDB = webkitIndexedDB;
			IDBCursor = webkitIDBCursor;
			IDBDatabaseException = webkitIDBDatabaseException;
			IDBRequest = webkitIDBRequest;
			IDBKeyRange = webkitIDBKeyRange;
			IDBTransaction = webkitIDBTransaction;
		} else {
			document.getElementById('bodyElement').innerHTML = "<h3>IndexedDB is not supported - upgrade your browser to the latest version.</h3>";
			return false;
		}
	} // if

	var request = indexedDB.open(name, version)
	request.onupgradeneeded = function(e) {
		var db = self.db = request.result;
		self.creatDB(db, data);
		console.log('DB version changed to ' + version);
	};
	request.onsuccess = function(e) {
		self.db = e.target.result;
		alert('success！');
	};
	request.onerror = function(e) {
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
DataBase.prototype.fetchStoreByCursor = function(storeName) {
		var transaction = this.db.transaction(storeName);
		var store = transaction.objectStore(storeName);
		var request = store.openCursor();
		request.onsuccess = function(e) {
			var cursor = e.target.result;
			if (cursor) {
				console.log(cursor.key);
				var currentStudent = cursor.value;
				console.log(currentStudent.name);
				cursor.continue();
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
	//遍历表
DataBase.prototype.getMultipleData = function(storeName) {
		var transaction = this.db.transaction(storeName);
		var store = transaction.objectStore(storeName);
		var index = store.index("nameIndex");
		var request = index.openCursor(null, IDBCursor.prev);
		request.onsuccess = function(e) {
			var cursor = e.target.result;
			if (cursor) {
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
	for (var i in data) {
		var item = data[i];
		if (item.tableName == 'cities') {
			if (!db.objectStoreNames.contains('cities')) {
				var store = db.createObjectStore('cities', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('cityId_idx', 'city_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'shops') {
			if (!db.objectStoreNames.contains('shops')) {
				var store = db.createObjectStore('shops', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('shopId_idx', 'shop_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'insp_batch') {
			if (!db.objectStoreNames.contains('insp_batch')) {
				var store = db.createObjectStore('insp_batch', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('batchId_idx', 'batch_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'insp_item_rules') {
			if (!db.objectStoreNames.contains('insp_item_rules')) {
				var store = db.createObjectStore('insp_item_rules', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('ruleId_idx', 'rule_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'insp_items') {
			if (!db.objectStoreNames.contains('insp_items')) {
				var store = db.createObjectStore('insp_items', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('itemId_idx', 'item_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'insp_item_type') {
			if (!db.objectStoreNames.contains('insp_item_type')) {
				var store = db.createObjectStore('insp_item_type', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('itemTypeId_idx', 'item_type_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'insp_options') {
			if (!db.objectStoreNames.contains('insp_options')) {
				var store = db.createObjectStore('insp_options', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('optionId_idx', 'option_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'insp_template') {
			if (!db.objectStoreNames.contains('insp_template')) {
				var store = db.createObjectStore('insp_template', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('templateId_idx', 'template_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'insp_template_info') {
			if (!db.objectStoreNames.contains('insp_template_info')) {
				var store = db.createObjectStore('insp_template_info', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('templateInfoId_idx', 'template_info_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'inspections') {
			if (!db.objectStoreNames.contains('inspections')) {
				var store = db.createObjectStore('inspections', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('inspectionId_idx', 'inspection_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		} else if (item.tableName == 'inspectors') {
			if (!db.objectStoreNames.contains('inspectors')) {
				var store = db.createObjectStore('inspectors', {
					keyPath: 'id',
					autoIncrement: true
				});
				store.createIndex('inspectorId_idx', 'inspector_id', {
					unique: true
				});
				for (var x in item.content) {
					var it = item.content[x];
					self.addData(store, it);
				}
			}
		}
	}

}