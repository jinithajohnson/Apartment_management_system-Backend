const mongoose = require("mongoose")
const schema = mongoose.Schema(

{
    "NameOfVisitor":{type:String,require:true},
    "FlatId":{type:String,require:true},
    "DateOfArrival":{type:String,require:true},
    "TimeOfArrival":{type:String,require:true},
    "ReasonForVisit":{type:String,require:true},
    "VisitorContact":{type:String,require:true}
}
)
let visitormodel=mongoose.model("visitors",schema);
module.exports={visitormodel}