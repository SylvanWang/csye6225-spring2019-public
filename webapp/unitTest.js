const DB = require('./routes/db');
this.UnitTest = {
	'CreateUser' : function (test) {
		var promise = DB.createUser('1','2');
		promise.then(function(value){
			test.ok(value, 'need true');
			test.done();
		});
	},

    'SearchUser' : function (test) {
        var promise = DB.searchUser('1');
        promise.then(function(value){
            test.ok(value, 'need true');
            test.done();
        });
    },

    'CheckUser' : function (test) {
        var promise = DB.checkUser('1','2');
        promise.then(function(value){
            test.ok(value, 'need true');
            test.done();
        });
    }
};