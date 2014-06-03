extends sparkgs.SparkFile

StaticFiles = "public/"

get('/', \-> view.Root.renderToString() )

