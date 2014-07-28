<%@ params(info : model.DataSetInfo) %>
<%@ extends input_helper.InputGenerator %>
<div class='col-md-6'>
  <h4>Choose Fields to Analyze</h4>
  <div class='well well-sm'>
    <form class="form-inline" role="form" ic-post-to="/jobs?type=recommend"}>
      <input type='hidden' name='jobs.RecommendJob[DataSetCollection]' value = ${info.Name}>
      <div class='formcontent>
        ${checkboxInputCollection(info.AnalyzableFields, 'Fields', {'style' -> 'padding:5px;'})}
      </div>
      <div class='formcontent'>
        ${submitInput('Analyze Data Set', {'class' -> 'btn btn-primary'})}
      </div>
    </form>
  </div>
</div>