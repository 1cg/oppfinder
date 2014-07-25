uses com.google.gson.Gson
uses com.google.gson.reflect.TypeToken
uses model.Policy

var foo : List<String> = {}
foo.add("foo")
foo.add("bar")
var json = new Gson().toJson(foo)
var fooed = new Gson().fromJson(json, new TypeToken<List<String>>(){}.getType())
var bar : List<Policy> = {}
bar.add(new ())
bar.add(new ())
json = new Gson().toJson(bar)
var barred = new Gson().fromJson(json, new TypeToken<List<Policy>>(){}.getType())
print(fooed + '  ' + barred)
