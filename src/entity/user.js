class user{
id
username
password
	constructor(id,username,password) {
		this.id = id
		this.username = username
		this.password = password
	}
	getid(){
		return this.id
	};
	setid(id){
		this.id = id 
	};
	getusername(){
		return this.username
	};
	setusername(username){
		this.username = username 
	};
	getpassword(){
		return this.password
	};
	setpassword(password){
		this.password = password 
	};
};
module.exports = {user}