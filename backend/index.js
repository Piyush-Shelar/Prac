let express=require("express")
let cors=require("cors")
let {MongoClient}=require("mongodb")

let app=express()
app.use(cors())
app.use(express.json())


const url="mongodb+srv://piyushshelar10_db_user:OBUtEsHGLQwhTrHH@cluster0.luyhp7w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.post("/details",(req,res)=>{

    let client=new MongoClient(url)
    client.connect()

    let db=client.db("info")
    let collec=db.collection("details")
    let data=req.body;
    collec.insertOne(data)
    .then((result)=>{

          res.send(result)
    })
    .catch((err)=>{

        res.status(500).send(err)
    })
})

app.post("/initstock",(req,res)=>{

    let client=new MongoClient(url)
    client.connect()

    let db=client.db("initstock")
    let collec=db.collection("initial")
    let data=req.body
    collec.insertOne(data)
    .then((result)=>{

        res.send(result)
    })
    .catch((err)=>{

       res.status(500).send(err)
    })
})

app.post("/sales",(req,res)=>{

    let client=new MongoClient(url)
    client.connect()

    let db=client.db("sales")
    let collec=db.collection("salesdata")

    let data=req.body
    collec.insertOne(data)
    .then((result)=>{

       res.send(result)
    })
    .catch((err)=>{

        res.status(500).send(err)
    })
})
app.get("/sales",(req,res)=>{

    let client=new MongoClient(url)
    client.connect()

    let db=client.db("sales")
    let collec=db.collection("salesdata")

    collec.find().toArray()
    .then((result)=>{

        res.send(result)
    })
    .catch((err)=>{

        res.status(500).send(err)
    })

})

app.get("/initstock",(req,res)=>{

    let client=new MongoClient(url)
    client.connect()

    let db=client.db("initstock")
    let collec=db.collection("initial")

    collec.find().toArray()
    .then((result)=>{

        res.send(result)
    })
    .catch((err)=>{

        res.send(err)
    })
})

app.get("/details",(req,res)=>{

    let client=new MongoClient(url)
    client.connect()

    let db=client.db("info")
    let collec=db.collection("details")

    collec.find().toArray()
    .then((result)=>{

        res.send(result)
    })
    .catch((err)=>{

        res.send(err)
    })
})


app.listen(9000,()=>{console.log("Express is ready")})
