uses model.database.MongoCollection

var collection = new MongoCollection("jobs")
print(collection.find().toList().map(\ o -> o.toMap().toString()+'\n'))