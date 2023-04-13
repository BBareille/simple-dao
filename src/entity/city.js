class city{
id
name
	constructor(id,name) {
		this.id = id
		this.name = name
	}
	getid(){
		return this.id
	};
	setid(id){
		this.id = id 
	};
	getname(){
		return this.name
	};
	setname(name){
		this.name = name 
	};
};
module.exports = {city}