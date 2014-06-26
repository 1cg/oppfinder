uses controller.JobController
uses java.lang.Thread
uses jobs.GenerateJob
uses datagen.GenerateRandom
uses jobs.RecommendJob

new GenerateRandom().generateRandom('src/main/resources/data.json')
new GenerateJob('src/main/resources/data.json', 'GeneratedData')

Thread.sleep(3000)
new RecommendJob('GeneratedData')