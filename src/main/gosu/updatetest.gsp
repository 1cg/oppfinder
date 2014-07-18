uses model.MongoCollection
uses com.mongodb.BasicDBObject

var collection = new MongoCollection("testing")
collection.drop()
collection.insert(new BasicDBObject({"foo" -> "bar", "cat" -> 1}))
print(collection.find().first())
collection.update(new BasicDBObject({"foo" -> "bar"}), new BasicDBObject({"boo" -> "yah"}))
print(collection.find().first())
collection.update(new BasicDBObject({"foo" -> "bar"}), new BasicDBObject({"foo" -> "bat"}))
print(collection.find().first())
collection.increment(new BasicDBObject({"foo" -> "bat"}), new BasicDBObject({"cat" -> -4}))
print(collection.find().first())