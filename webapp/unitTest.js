const DB = require('./routes/db');
this.UnitTest = {
	'CreateUser' : function (test) {
		var promise = DB.createUser('jiangyic@qq.com','Huenb1!@');
		promise.then(function(value){
			test.ok(value, 'need true');
			test.done();
		});
	},

    'SearchUser' : function (test) {
        var promise = DB.searchUser('jiangyic@qq.com');
        promise.then(function(value){
            test.ok(value, 'need true');
            test.done();
        });
    },

    'CheckUser' : function (test) {
        var promise = DB.checkUser('jiangyic@qq.com','Huenb1!@');
        promise.then(function(value){
            test.ok(value, 'need true');
            test.done();
        });
    }
};