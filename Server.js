const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var cors = require('cors');
const Secret = "6d2d011e32d9a85f9ae1";
//Middlewares
app.use(cors())
app.use(express.json());

//Importing models
const contact = require('./Models/contact');

//Importing passkey
const passkey = require('./Passkey')


//Database Configuration
var mongoDB = 'mongodb://127.0.0.1/Address_book';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//Authorize using JWT, a middleware to be used at endpoints to check if the client is authorized or not.
async function auth(req,res,next){
if(!req.body.token){
    return res.status(400).json({msg:"TOKEN NOT PROVIDED"});
}
const token = req.body.token;

jwt.verify(token,Secret, async (err,tree)=>{
    if(err) return res.status(500);
    req.go = tree;
})

if(passkey.includes(req.go)){
    next();
}
else{
    return res.status(401).json({msg:"UNATHORIZED"});
}
}


// Checks if the passkey provided is in the list of valid passkeys,then generates a JWT to be used for authorization.
app.post('/get_auth',async (req,res)=>{
    if(passkey.includes(req.body.passkey)){
      var token = jwt.sign(req.body.passkey,Secret);
    }
    else{
        return res.status(400).json({msg:"THE TOKEN PROVIDED IS NOT VALID."});
    }
    res.status(200).json({msg:"SUCCESS",token})
})


//Used for phrase matching,by adding data in the name,address and P_number we decrease the number of search items. 
app.post('/contact/match',auth,async (req,res)=>{
    let {name,address,P_number} = req.body;
var result;
    try{
        var result = await contact.find({name:{$regex:`${name}`,$options:"$i"},address:{$regex:`${address}`,$options:"$i"},P_number:{$regex:`${P_number}`,$options:"$i"}});
    }
    catch(e){console.log(e);return res.status(500)}
    res.status(200).json({msg:"CONTACTS FOUND",result});
})


//Used for adding single contact to the database.
app.post('/contact/add_single',auth,async(req,res)=>{

    const obj = {name:req.body.name,address:req.body.address,P_number:req.body.P_number};

    try{var doc = new contact(obj);
    await doc.save();}
    catch(e){console.log(e);return res.status(500)}
   
    res.status(200).json({msg:"ADDED"});
})


// Used for adding contacts in bulk in the database.
app.post('/contact/add_bulk',auth,async(req,res)=>{
    try{
        contact.insertMany(req.body.contacts)
    }
    catch (e){
        console.log(e);return res.status(500)
    }
    
    res.status(200).json({msg:"ADDED"})
})


//Used to get the details of the single contact.
app.get('/contact/:id',auth,async(req,res)=>{
  try{ var obj =  await contact.findOne({_id:req.params.id});}
  catch(e)
  {
      console.log(e);return res.status(500)
  }

  if(obj.length==0){
      return res.status(404).json({msg:"Contact not found"})
  }
  
  res.status(200).json({contact:obj,msg:"FOUND"})

})


//Used to update a contact, the correct contact_id is provided by the frontend hence no check for id.
app.put('/contact/update/:id',auth,async (req,res)=>{
    try{
        await contact.updateOne({_id:req.params.id},req.body.contact);
    }
    catch(e){ console.log(e); return res.status(500)}

    res.status(200).json({msg:"UPDATED"})
})


//Used to delete a contact , the correct contact_id is provided by the frontend hence no check for id.
app.delete('/contact/delete/:id',auth,async(req,res)=>{
    try{
        await contact.deleteOne({_id:req.params.id});
    }
    catch(e){ console.log(e); return res.status(500)}

    res.status(200).json({msg:"DELETED"})

})



//Used to fetch a desired number of contacts , the list is initially sorted in ascending order according to the name field.
app.get('/contact/fetch/:num',auth,async(req,res)=>{
    try{
        var obj = await contact.find({}).sort({name:1}).limit(Number(req.params.num))
    }
    catch{
        console.log(e); return res.status(500)
    }

    res.status(200).json({contact:obj,msg:"SUCCESS"})
})


app.listen(5000,()=>console.log("Server running on port 5000"));
