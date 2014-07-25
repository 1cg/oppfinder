<%@ params(info : model.DataSetInfo) %>
<%@ extends input_helper.InputGenerator %>
<form class="form-inline" role="form" ic-post-to="/jobs?type=recommend"}>
  <div class='formcontent'>
    ${selectInput(model.DataSetInfo#AllNames, "DataSet", {'class' -> 'form-control', 'name' -> 'jobs.RecommendJob[DataSetCollection]'})}
    ${submitInput('Choose Data Set',{'class' -> 'btn btn-primary'})}
  </div>
  <div class='formcontent'>
    ${checkboxInputCollection(info.AnalyzableFields, 'Fields', {'class' -> 'btn btn-primary', 'style' -> 'padding:5px;'})}
  </div>
  <div class='formcontent'>
    ${submitInput('Analyze Data Set', {'class' -> 'btn btn-primary'})}
  </div>
</form>