class persons{
id
lastName
firstName
address
city
	constructor(id,lastName,firstName,address,city) {
		this.id = id
		this.lastName = lastName
		this.firstName = firstName
		this.address = address
		this.city = city
	}
	getid(){
		return this.id
	};
	setid(id){
		this.id = id 
	};
	getlastName(){
		return this.lastName
	};
	setlastName(lastName){
		this.lastName = lastName 
	};
	getfirstName(){
		return this.firstName
	};
	setfirstName(firstName){
		this.firstName = firstName 
	};
	getaddress(){
		return this.address
	};
	setaddress(address){
		this.address = address 
	};
	getcity(){
		return this.city
	};
	setcity(city){
		this.city = city 
	};
};
module.exports = {persons}