var pg = require('pg');


// global namespace
var dba = dba || {};

	// vendor type enumeration
	const dbVendor = {
			Sqlite: 'SQLITE',
			Postgress: 'POSTGRESS',
			MySQL: 'MYSQL',
		}

	// db
	module.exports.db = function (dbVendor) {
		
	  this.dbVendor = dbVendor;
	  console.log(dbVendor+" db passed");
	  console.log('DB vendor initialized');
	
	};
	
	// query values
	module.exports.field = function(key,value,operator){
		this.key = key;
		this.value = value;
		this.operator = operator
	}
	
	// main query object
	module.exports.query = function(table,fields){
		
		this.table = table;
		this.fields = fields;
	}
	
	
	
/*	module.exports.read = function(callback){
		
		console.log("in DB read");
	
		
		if(this.dbVendor == dbVendor.Sqlite){
			
		}else if (this.dbVendor == dbVendor.Postgress){
			
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();	
			
				if(this.fields == null)
				{
					var count= client.query("select * from "+this.table , function(err, result) {
    					console.log('Query_result before return :: ' + JSON.stringify(count));
					client.end();
					callback (result.rowCount);
					});
				}
				else
				{
					var count = client.query("select * from " + this.table + " where " + this.fields.key 
					+ this.fields.operator + this.fields.value,function(err,result){

					console.log('Query_result before return when fields not null :: ' + JSON.stringify(count));
					client.end();
					callback (result.rowCount);
					});
					
				}
		}else if (this.dbVendor == dbVendor.MySQL){
			
		}
		
		//console.log('Query_result before return :: ' + JSON.stringify(query_result));
		//console.log('Rows value :: ' + JSON.stringify(rows));
		
		
	
	}
*/


	module.exports.readDirectData = function(callback){
		console.log("in DB Read Data");
		function onFailure(err) {
  			process.stderr.write("Select Failed: " + err.message + "\n");
  			}
		if(this.dbVendor == dbVendor.Sqlite){
			
		}else if (this.dbVendor == dbVendor.Postgress){
			
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		console.log("Before execution");
		
		var row = client.query(this.fields.query , function(err, result) {
    		//console.log('Query_result after update :: ' + JSON.stringify(row));
    		
    		if (err) onFailure(err);
   		console.log("Results ::" + JSON.stringify(result));
    		client.end();
		callback (result.rows);
		});
   	
		}else if (this.dbVendor == dbVendor.MySQL){
			
		}
	}
	module.exports.readData = function(callback){
		
		console.log("in DB read for vendor read");
	
		function onFailure(err) {
  			process.stderr.write("Select Failed: " + err.message + "\n");
  				
			}
		if(this.dbVendor == dbVendor.Sqlite){
			
		}else if (this.dbVendor == dbVendor.Postgress){
			
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();	
		console.log("Length : " + Object.keys(this.fields).length);	
				if(Object.keys(this.fields).length == 3)
				{
					
					var row= client.query("select * from "+this.table + " where " +
					this.fields.key + this.fields.operator + this.fields.value,function(err, result) {
						if (err) onFailure(err);
    						console.log('Query_result before return :: ' + JSON.stringify(row));
						client.end();
						callback (result.rows);
						});
				}
				else if(Object.keys(this.fields).length == 4)
				{
					console.log("select "+ this.fields.inoperator + " from "+this.table + " where " +
					this.fields.key + this.fields.operator + this.fields.value);
					var row= client.query("select "+ this.fields.inoperator + " from "+this.table + " where " +
					this.fields.key + this.fields.operator + this.fields.value,function(err, result) {
						if (err) onFailure(err);
    						console.log('Query_result before return :: ' + JSON.stringify(row));
						client.end();
						callback (result.rows);
						});
				}
				else if(Object.keys(this.fields).length == 6)
				{
					console.log("select * from " + this.table + " where " + this.fields.key 
					+ this.fields.operator + this.fields.value + " and " + this.fields.key1 
					+ this.fields.operator1 + this.fields.value1);
					var row = client.query("select * from " + this.table + " where " + this.fields.key 
					+ this.fields.operator + this.fields.value + " and " + this.fields.key1 
					+ this.fields.operator1 + this.fields.value1 ,function(err,result){

					if (err) onFailure(err);
					console.log('Query_result before return when fields not null :: ' + JSON.stringify(row));
					client.end();
					callback (result.rows);
					});
					
				}
				else
				{
					console.log("select * from " + this.table + " where " + this.fields.key 
					+ this.fields.operator + this.fields.value + " and " + this.fields.key1 
					+ this.fields.operator1 + this.fields.value1 + " and " + this.fields.key2
					+ this.fields.operator2 + this.fields.value2);
					var row = client.query("select * from " + this.table + " where " + this.fields.key 
					+ this.fields.operator + this.fields.value + " and " + this.fields.key1 
					+ this.fields.operator1 + this.fields.value1 + " and " + this.fields.key2
					+ this.fields.operator2 + this.fields.value2 ,function(err,result){

					if (err) onFailure(err);
					
					console.log('Query_result before return when fields not null :: ' + JSON.stringify(row));
					client.end();
					callback (result.rows);
					});
					
				}
		}else if (this.dbVendor == dbVendor.MySQL){
			
		}
	}
	
	module.exports.update = function(){
		
		console.log("in DB update");
		function onFailure(err) {
  			process.stderr.write("Insert/Update Failed: " + err.message + "\n");
  		//	process.exit(1);	
			}
		if(this.dbVendor == dbVendor.Sqlite){
			
		}else if (this.dbVendor == dbVendor.Postgress){
			
		var conString = process.env.DATABASE_URL ;
		var client = new pg.Client(conString);
		client.connect();
		console.log("Before creation");
		//var row= client.query(this.fields.query , function(err, result) {
		client.query(this.fields.query , function(err, result) {
    		//console.log('Query_result after update :: ' + JSON.stringify(row));
    		if (err) onFailure(err);
    		console.log("Result :: " + JSON.stringify(result));
    		//callback("Successful");
		client.end();
		//callback (result.rows);
		});
			
		}else if (this.dbVendor == dbVendor.MySQL){
			
		}
	}
	
	/*db.prototype.init = function() {
		
		console.log("DB initialized");
		
	};

	
	
	
	
	 db.prototype.write = function(query){
		
		console.log("in DB write");
		
		if(this.dbVendor == dba.dbVendor.Sqlite){
			
		}else if (this.dbVendor == dba.dbVendor.Postgress){
			
		}else if (this.dbVendor == dba.dbVendor.MySQL){
			
		}
	}
	
	
	
	db.prototype.delete = function(query){
		
		console.log("in DB delete");
		
		if(this.dbVendor == dba.dbVendor.Sqlite){
			
		}else if (this.dbVendor == dba.dbVendor.Postgress){
			
		}else if (this.dbVendor == dba.dbVendor.MySQL){
			
		}
	}
	 */
/* // test namespace
var dbaTest = dbaTest || {};

dbaTest.read(){
	
	var myDB = new dba.db(dba.dbVendor.Postgress);
	var myQuery = new dba.query();
	var field1 = new dba.field();
	var field2 = new dba.field();
	
	// add fields
	field1.key = "NAME";
	field1.value = "janakan";
	field1.operator = "=";
	
	field2.key = "COMPANY";
	field2.value = "cognizant";
	field2.operator = "=";
	
	var fields[];
	fields.push(field1);
	fields.push(field2);
	
	// create query object
	myQuery.table = "EMPLOYEE";
	myQuery.fields = fields;
	
	// call db operation
	myDB.read(myQuery);
	
	
} */
	
