class user{
id
username
password
	constructor(id,username,password) {
		id = this.id
		username = this.username
		password = this.password
	}
	getid(){
		return this.id
	};
	setid(id){
		id = this.id
	};
	getusername(){
		return this.username
	};
	setusername(username){
		username = this.username
	};
	getpassword(){
		return this.password
	};
	setpassword(password){
		password = this.password
	};
};
module.exports = {user}