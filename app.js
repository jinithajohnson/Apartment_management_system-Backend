const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwtoken = require("jsonwebtoken")
const router = express.Router();
const Announcement = require('./models/announcement');
const announcementRoutes = require('./models/announcement');
const { usermodel } = require("./models/user")
const { visitormodel } = require("./models/visitor")
const { complaintmodel } = require("./models/complaint")
const { postmodel } = require("./models/announcement")
const announcementModel = require("./models/announcement")

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/announcements', announcementRoutes);
mongoose.connect("mongodb+srv://jinithajohnson:jingov02@cluster0.wo3ieyl.mongodb.net/ApartmentManageDb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword

    
    usermodel.find({ email: req.body.email }).then(
        (items) => {

            if (items.length > 0) {
                res.json({ "status": "email Id already exist" })

            } else {

                let result = new usermodel(input)
                result.save()
                res.json({ "status": "success" })

            }
        }
    ).catch(
        (error) => { }

    )
})


app.post("/signin",async(req,res)=>{
    let input = req.body
    let result = usermodel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
                const passwordValidator = bcrypt.compareSync(req.body.password,items[0].password)
                if (passwordValidator) {
                    jwtoken.sign({email:req.body.email,},"apartment-manage",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) {
                                res.json({"status":"error","errorMessage":error})
                            } else {
                                res.json({"status":"success","token":token,"userId":items[0]._id})
                            }
                        }
                    )
                } else {
                    res.json({"status":"Incorrect Password"})
                }
            } else {
                res.json({"status":"Incorrect Email-id"})
            }
        }
    ).catch(
        (error)=>{
            console.log(error.message)
            alert(error.message)
        }
    )
})


app.post("/visitor",(req,res)=>{
    let input=req.body
    let visitor=new visitormodel(input)
    visitor.save()
    console.log(visitor)
    res.json({status:"success"})

})

app.get("/viewVisitors",(req,res)=>{
    visitormodel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    )
})

app.post("/rejectVisitor",(req,res)=>{
    let input=req.body
    visitormodel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        })
    })


    app.get("/residents",(req,res)=>{
        usermodel.find().then(
            (data)=>{
                res.json(data)
            }
        ).catch(
            (error)=>{
                res.json(error)
            }
        )
    })

    app.post("/deleteNonResident",(req,res)=>{
        let input=req.body
        usermodel.findByIdAndDelete(input._id).then(
            (response)=>{
                res.json({"status":"success"})
            }
        ).catch(
            (error)=>{
                res.json({"status":"error"})
            })
            
        })


        app.post("/complaints",(req,res)=>{
            let input=req.body
            let complaints=new complaintmodel(input)
            complaints.save()
            console.log(complaints)
            res.json({status:"success"})
        })

app.get("/complaintList",(req,res)=>{
    complaintmodel.find().then(
        (data)=>{
            res.json(data)
        }
    ).catch(
        (error)=>{
            res.json(error)
        }
    )
})

app.post("/deleteComplaint",(req,res)=>{
    let input=req.body
    complaintmodel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        })
        
    })

const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    message: { type: String, required: true },
    postdate: { type: Date, default: Date.now }
});



// Create post API
app.post("/create", async (req, res) => {
    const input = req.body;
    const token = req.headers.token;

    if (!token) {
        return res.json({ status: "Invalid authentication", error: "Token not provided" });
    }

    jwtoken.verify(token, "apart-app", async (error, decoded) => {
        if (error) {
            return res.json({ status: "Invalid authentication", error: "Invalid token" });
        }

        if (decoded && decoded.email) {
            try {
                const result = new announcementModel(input);
                await result.save();
                return res.json({ status: "success" });
            } catch (err) {
                return res.json({ status: "error", message: err.message });
            }
        } else {
            return res.json({ status: "Invalid authentication", error: "Invalid user" });
        }
    });
});


//api viewAll

app.post("/viewAnnouncement",(req,res)=>{
    let token=req.headers.token
    jwtoken.verify(token,"apartment-manage",(error,decoded)=>{
        if (decoded && decoded.email) {
            announcementModel.find().then(
                (items)=>{
                    res.json(items)
            }).catch(
                (error)=>{
                res.json({"status":"error"})
            })
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
})
app.listen(8088, () => {
    console.log("server started")
})