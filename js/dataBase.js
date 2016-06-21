function DataBase(ops) {
	this.dbName = ops.dbName;
	this.version = ops.version;
	this.memo = ops.memo;
	this.dbSize = ops.dbSize;
	this.init(ops.data);
}

//初始化数据库
DataBase.prototype.init = function(data) {
	var db = openDatabase(this.dbName, this.version, this.memo, this.dbSize);
	db.transaction(function(tx) {
		for (var i in data) {
			if (data[i].table.create) {
				tx.executeSql(data[i].table.create);
				if (data[i].table.insert) {
					console.log(data[i].table.insert);
					tx.executeSql(data[i].table.insert);
				}
			}
		}
	});
}

//var create_shops_sql = "CREATE TABLE IF NOT EXISTS  `shops` ( `shop_id` int(11) NOT NULL,`title` varchar(200) DEFAULT NULL,`main_image` varchar(200) DEFAULT NULL, `address` varchar(200) DEFAULT NULL,`shop_class` int(11) DEFAULT NULL,`dining_type_id` int(11) DEFAULT NULL,`if_licenced` bit(1) DEFAULT NULL,`if_valid` bit(1) DEFAULT NULL,`has_rule` bit(1) DEFAULT NULL, `if_healthy` bit(1) DEFAULT NULL,`clear_level` int(11) DEFAULT NULL,PRIMARY KEY (`shop_id`))";
//var create_insp_items_sql = "CREATE TABLE IF NOT EXISTS `insp_items` (`item_id` int(11) NOT NULL ,`s_id` int(11) DEFAULT NULL, `p_id` int(11) DEFAULT NULL,`category` int(11) DEFAULT NULL,`item_name` varchar(200) DEFAULT NULL,`item_show_name` varchar(200) DEFAULT NULL, `item_standard` varchar(500) DEFAULT NULL,`item_note` varchar(500) DEFAULT NULL,`item_type_id` int(11) DEFAULT NULL,`if_show` bit(1) DEFAULT NULL, PRIMARY KEY (`item_id`))"
//var create_insp_item_type_sql = "CREATE TABLE IF NOT EXISTS `insp_item_type` (`item_type_id` int(11) NOT NULL,`item_type_name` varchar(100) DEFAULT NULL,PRIMARY KEY (`item_type_id`))"
//var create_insp_options_sql = "CREATE TABLE IF NOT EXISTS `insp_options` (`option_id` int(11) NOT NULL,`option_name` varchar(200) DEFAULT NULL,`item_id` int(11) DEFAULT NULL,`s_id` int(11) DEFAULT NULL,PRIMARY KEY (`option_id`))";
//var create_cities_sql = "CREATE TABLE `cities` (\n  `city_id` int(11) NOT NULL,\n  `city_name` varchar(50) DEFAULT NULL,\n  PRIMARY KEY (`city_id`)\n) ";
//var msg;
//db.transaction(function(tx) {
//	tx.executeSql(create_shops_sql);
//	tx.executeSql(create_insp_items_sql);
//	tx.executeSql(create_insp_item_type_sql);
//	tx.executeSql(create_insp_options_sql);
//	tx.executeSql(create_cities_sql);
//	tx.executeSql('INSERT INTO shops (shop_id, title) VALUES (1, "foobar"),(2,"ok")');
//	tx.executeSql('INSERT INTO insp_items  VALUES (1, "fdsf")');
//	tx.executeSql('INSERT INTO insp_item_type  VALUES (1, "fdsf")');
//	tx.executeSql('INSERT INTO insp_options  VALUES (1, "fdsf")');
//	tx.executeSql("INSERT INTO cities  VALUES (1,'青岛1'),(2,'北京'),(3,'上海'),(5,'深圳'),(6,'杭州')");
//	//tx.executeSql('INSERT INTO LOGS (id, log) VALUES (2, "logmsg")');
//	//msg = '<p>Log message created and row inserted.</p>';
//	//document.querySelector('#status').innerHTML = msg;
//});
//			db.transaction(function(tx) {
//				tx.executeSql('SELECT * FROM LOGS', [], function(tx, results) {
//					var len = results.rows.length,
//						i;
//					msg = "<p>Found rows: " + len + "</p>";
//					document.querySelector('#status').innerHTML += msg;
//					for (i = 0; i < len; i++) {
//						msg = "<p><b>" + results.rows.item(i).log + "</b></p>";
//						document.querySelector('#status').innerHTML += msg;
//					}
//				}, null);
//			});