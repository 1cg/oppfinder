<%@ extends input_helper.InputGenerator %>
<%@ params(info : model.DataSetInfo, owner : String) %>
<h2>Analyze Data Set</h2>
<hr>
<div class='row'>
  <div class='col-md-6'>
    <h4>Choose a Data Set</h4>
    <div class='well well-sm'>
      <form class="form-inline" role="form" ic-target='#form' ic-post-to="/results">
        <div class='formcontent'>
          ${selectInputCollection(model.DataSetInfo.getAll(owner).map(\ o -> o.Name), "DataSet", {'class' -> 'form-control', 'name' -> 'collection'})}
          ${submitInput('Choose Data Set',{'class' -> 'btn btn-primary'})}
        </div>
      </form>
    </div>
  </div>
  <% if (info == null) { %>
    <div class='col-md-6' id='form'>
    </div>
  <% } else { %>
    ${view.results.AnalysisSetup.renderToString(info)}
  <% } %>
</div>
