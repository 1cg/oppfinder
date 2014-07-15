<% uses input_helper.InputGenerator %>
<div class='jumbotron'>
  <h2>Select a dataset to analyze</h2>
  <form class="form-inline" role="form" ic-post-to="/jobs?type=recommend">
      ${InputGenerator.selectInput(model.DataSet#AllDataSets, "DataSet", {'class' -> 'form-control', 'name' -> 'jobs.RecommendJob[DataSetCollection]'})}
      ${InputGenerator.submitInput('Start Analysis',{'class' -> 'btn btn-primary'})}
   </form>
</div>
