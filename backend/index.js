let express=require("express")
let cors=require("cors")
let fs=require("fs")
let {Parser}=require("json2csv")
const path = require("path");
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

app.post("/sales", async (req, res) => {
  const { user, sale } = req.body;


  if (!user || !sale) {
    return res.status(400).json({ error: "User and sale data are required" });
  }

  let client;

  try {
    client = new MongoClient(url);
    await client.connect();

    const db = client.db("sales");
    const collection = db.collection("salesdata");

    // 1️⃣ Insert new sale (attach username)
    await collection.insertOne(sale)

    // 2️⃣ Aggregate daily product-wise data
    const data = await collection.aggregate([
      { $match: { user: user } },

      {
        $addFields: {
          time: { $toDate: "$time" },
          costPerUnit: { $toDouble: "$costPerUnit" }
        }
      },

      {
        $group: {
          _id: {
            product: "$product",
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$time",
                timezone: "Asia/Kolkata"
              }
            }
          },
          totalQuantity: { $sum: "$quantity" },
          totalSales: {  $sum: {
                  $multiply: ["$quantity", "$costPerUnit"]
             } },
          avgCostPerUnit: { $avg: "$costPerUnit" }
        }
      },

      {
        $project: {
          _id: 0,
          product: "$_id.product",
          date: "$_id.date",
          quantity: "$totalQuantity",
          totalCost: "$totalSales",
          costPerUnit: { $round: ["$avgCostPerUnit", 2] }
        }
      },

      { $sort: { date: 1, product: 1 } }
    ]).toArray();

    if (data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // 3️⃣ Convert to CSV
    const fields = [
      "product",
      "date",
      "costPerUnit",
      "quantity",
      "totalCost"
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    // 4️⃣ Save CSV
    const filePath = `./${user}_daily_sales.csv`;
    fs.writeFileSync(filePath, csv);

    res.status(200).json({
      message: "Sale inserted and CSV created successfully",
      file: filePath
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } 
});

app.get("/sales",(req,res)=>{

    const user=req.query.user

    let client=new MongoClient(url)
    client.connect()

    let db=client.db("sales")
    let collec=db.collection("salesdata")

    collec.find({user}).toArray()
    .then((result)=>{

        res.send(result)
    })
    .catch((err)=>{

        res.status(500).send(err)
    })

})

app.get("/initstock",(req,res)=>{

    const user=req.query.user
    let client=new MongoClient(url)
    client.connect()

    let db=client.db("initstock")
    let collec=db.collection("initial")

    collec.find({user}).toArray()
    .then((result)=>{

        res.send(result)
    })
    .catch((err)=>{

        res.send(err)
    })
})

app.get("/details",(req,res)=>{

    const user=req.query.user
    let client=new MongoClient(url)
    client.connect()

    let db=client.db("info")
    let collec=db.collection("details")

    collec.find({user}).toArray()
    .then((result)=>{

        res.send(result)
    })
    .catch((err)=>{

        res.send(err)
    })
})

app.post("/predict", async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Flask service error" });
  }
});

app.get("/predict", async (req, res) => {
  const user = req.query.user;

  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  let client;

  try {
    client = new MongoClient(url);
    await client.connect();

    const db = client.db("sales");
    const collection = db.collection("salesdata");

    // 🔥 Aggregated sales per product per day
    const data = await collection.aggregate([
      { $match: { user: user } },

      {
        $addFields: {
      time: { $toDate: "$time" },
      costPerUnit: { $toDouble: "$costPerUnit" }
       }
      },
      {
    $group: {
      _id: {
        product: "$product",
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$time",
            timezone: "Asia/Kolkata"
          }
        }
      },

    
          
          totalQuantity: { $sum: "$quantity" },
          totalSales: { $sum: "$totalCost" },
          avgCostPerUnit: { $avg: "$costPerUnit" }
        }
      },

      {
        $project: {
          _id: 0,
          product: "$_id.product",
          date: "$_id.date",
          quantity: "$totalQuantity",
          totalCost: "$totalSales",
           costPerUnit: { $round: ["$avgCostPerUnit", 2] }
        }
      },

      { $sort: { date: 1, product: 1 } }
    ]).toArray();

    if (data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // CSV fields order
    const fields = [
      "product",
      "date",
      "costPerUnit",
      "quantity",
      "totalCost"
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filePath = `./${user}_daily_sales.csv`;
    fs.writeFileSync(filePath, csv);

    res.json({
      message: "Daily aggregated CSV created successfully",
      file: filePath
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) await client.close();
  }
});



app.listen(9000,()=>{console.log("Express is ready")})


