<%@ params(info : model.DataSetInfo) %>
<% uses input_helper.TagHelper %>
<%@ extends input_helper.InputGenerator %>
<div class='col-md-6'  style='width:100%'>
  <h4 style='white-space:nowrap'>Choose Fields to Analyze for ${info.Name}</h4>
  <div class='well well-sm'>
    <form class="form-inline" role="form" ic-post-to="/jobs?type=recommend"}>
      ${TagHelper.tag('input', {'type' -> 'hidden', 'name' -> 'jobs.RecommendJob[DataSetCollection]', 'value' -> info.Name})}
      <div class='formcontent>
        ${checkboxInputCollection(info.AnalyzableFields, 'Fields', {'style' -> 'padding:5px;'})}
      </div>
      <div class='formcontent'>
        ${submitInput('Analyze Data Set', {'class' -> 'btn btn-primary'})}
      </div>
    </form>
  </div>
</div>