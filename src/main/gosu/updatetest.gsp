uses util.inflector.Inflector
uses model.Result
uses model.database.Document

print(Inflector.pluralize('result'))
print(Document.all('results').Count)
var foo = new Result()
foo.save()
print(Document.all('results').Count)
foo.put('foo', 'foo')
foo.save()
print(Document.all('results').Count)
foo.delete()
print(Document.all('results').Count)
