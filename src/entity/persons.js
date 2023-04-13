class persons{
id
lastName
firstName
address
city
	constructor(id,lastName,firstName,address,city) {
		id = this.id
		lastName = this.lastName
		firstName = this.firstName
		address = this.address
		city = this.city
	}
	getid(){
		return this.id
	};
	setid(id){
		id = this.id
	};
	getlastName(){
		return this.lastName
	};
	setlastName(lastName){
		lastName = this.lastName
	};
	getfirstName(){
		return this.firstName
	};
	setfirstName(firstName){
		firstName = this.firstName
	};
	getaddress(){
		return this.address
	};
	setaddress(address){
		address = this.address
	};
	getcity(){
		return this.city
	};
	setcity(city){
		city = this.city
	};
};
module.exports = {persons}