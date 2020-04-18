export default (req, res) => {
    debugger;
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://jarrod:AwPz9DLa0izkzHnA@matchcluster-tdshe.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });

    let mongoCollection;

    client.connect(err => {
        //if (err) throw err;
        const collection = client.db("matchDatabase").collection("matchCollection");
        // perform actions on the collection object
        console.log(collection);
        mongoCollection = collection.find({}).toArray(function (err, result) {
            //if (err) throw err;
            console.log(result);
            res.status(200).json(result);
            //db.close();
        });
    });
};