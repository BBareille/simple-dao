const {DatabaseConnection} = require("../DatabaseConnection");
class ModelFactory {

    name= "";
    params

    constructor(name, params) {
        this.name = name;
        this.params = params
    }

    render(){
        let classSample = "class "+ this.name + "{\n"
        //Property
        this.params.map(property => classSample+= property+"\n")

        //Constructor
        classSample += '\tconstructor('+this.params.toString()+') {\n'
        for(let i=0; i<this.params.length; i++){
            classSample +="\t\tthis."+this.params[i]+  " = "+this.params[i]+'\n'
        }
        classSample += "\t}"

        //Getter & Setter
        this.params.map(property => {
            classSample+= "\n\tget"+property+"(){\n\t\treturn this."+property+"\n\t};"
            classSample+= "\n\tset"+property+"("+property+"){\n\t\tthis."+property+" = "+property+" \n\t};"
        })

        classSample+= "\n};"
        classSample+= "\nmodule.exports = {"+this.name+"}"

        return classSample
    }
}

module.exports = {
    ModelFactory
}