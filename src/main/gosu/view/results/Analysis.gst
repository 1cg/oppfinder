<%@ extends input_helper.InputGenerator %>
<%@ params(dataSet : String = null) %>
<div class='jumbotron'>
  <h2>Select a dataset to analyze</h2>
  <div id='form'>
    <form class="form-inline" role="form" ic-target='#form' ic-post-to="/results"}>
      ${selectInput(model.DataSetInfo#AllNames, "DataSet", {'class' -> 'form-control', 'name' -> 'jobs.RecommendJob[DataSetCollection]'})}
      ${submitInput('Choose Data Set',{'class' -> 'btn btn-primary'})}
    </form>
</div>
