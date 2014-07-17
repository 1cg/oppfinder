uses model.MongoCollection
uses com.mongodb.DBObject
uses com.mongodb.BasicDBObject

var collection = new MongoCollection("testing")
collection.drop()
collection.insert(new BasicDBObject({"foo" -> "bar", "cat" -> "moo"}))
print(collection.find().first())
collection.update(new BasicDBObject({"foo" -> "bar"}), new BasicDBObject({"boo" -> "yah"}))
print(collection.find().first())
