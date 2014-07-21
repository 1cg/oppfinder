uses util.inflector.Inflector
uses util.LatLngCollectionGenerator
uses model.Coordinate
uses model.database.Document

print(Inflector.pluralize('result'))
LatLngCollectionGenerator.writeLatLng()
print(Document.all(Coordinate.Collection).first().AllFields)