const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        "Name":{type:String,require:true},
        "FlatId":{type:String,require:true},
        "ContactNo":{type:String,require:true},
        "FamilyMembers":{type:String,require:true},
        "Role":{type:String,require:true},
        "Occupation":{type:String,require:true},
        "Indate":{type:String,require:true},
        "email":{type:String,require:true},
        "password":{type:String,require:true}
      
        
    }
)
let usermodel=mongoose.model("users",schema);
module.exports={usermodel}
