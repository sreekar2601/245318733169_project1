const express=require("express");
const app=express();

//server file of awt
let server=require('./server');
let middleware=require('./middleware');

//bodyparser

const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

//for mongodb

const MongoClient =require('mongodb').MongoClient;

//Database Connection

const url='mongodb://127.0.0.1:27017';
const dbname='hospitalManagement';
let db

MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`Connected MongoDb: ${url}`);
    console.log(`Database: ${dbname}`);
})

//HOSPITAL DETAILS

app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("fetching data from the hospital collection");
    var data=db.collection('hospital').find().toArray()
        .then(result=>res.json(result));
});

//VENTILATORS DETAILS
app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log("Ventilators informations");
    var ventilatordetails=db.collection('ventilatordetails').find().toArray().then(result=>res.json(result));
});

//Searching ventilator by status

app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilatordetails').find({"status":status}).toArray().then(result=>res.json(result));
});

//Searching Ventilator By Hospital Name

app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilatordetails').find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
    
});
//Searching hospital by name

app.post('/searchhospitalbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var hospitaldetails=db.collection('hospital')
    .find({'name':new RegExp(name,'i')}).toArray().
    then(result=>res.json(result));
});

//Update ventilator details

app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={ventilatorId: req.body.ventilatorId};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection('ventilatordetails').updateOne(ventid,newvalues,function(err,result){
        res.json("1 document updated");
        if(err) throw err;
        console.log("1 document updated -console message");
    });
});

//ADDING VENTILATOR
app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
    var HId=req.body.HId;
    var ventilatorId=req.body.HId;
    var status=req.body.status;
    var name=req.body.name;

    var item=
    {
        HId:HId,ventilatorId:ventilatorId,status:status,name:name
    };
    db.collection('ventilatordetails').insertOne(item,function(err,result){
        res.json("Item Inserted");
    });
});

//DELETE VENTILATOR

app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.ventilatorId;
    console.log(myquery);

    var myquery1={ventilatorId:myquery};
    db.collection('ventilatordetails').deleteOne(myquery1,function(err,obj)
    {
        if(err) throw err;
        res.json("1 document deleted");
    });
});
app.listen(1500);