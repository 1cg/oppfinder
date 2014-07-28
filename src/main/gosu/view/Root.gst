<%@ extends input_helper.InputGenerator%>
<%@ params(owner : String) %>
<h1 class="page-title">
  <div><span class="op">Opportunity</span><span class="fi">Finder</span></div>
  <small><em>Find new business opportunities hidden in PolicyCenter</em></small>
</h1>

<div class="inset-8 root-overview">

<h3>Introduction</h3>
<hr/>

  <p>
  Guidewire PolicyCenter<sup>®</sup> is a flexible underwriting and policy administration system designed to empower personal and commercial lines carriers to deliver insurance the way they've always wanted to. Designed solely for P/C insurers, PolicyCenter is a complete system-of-record and supports the core functions of the policy lifecycle—product definitions, underwriting, quoting, binding, endorsements, and renewals.
  </p>

  <p>
    <span class="op">Opportunity</span><span class="fi">Finder</span> takes your PolicyCenter data and discovers untapped
    business opportunities within it.  Using a proprietary matching algorithm, it uncovers new client and upsell
    opportunties and then pushes them to your Salesforce installation for followup by your sales department.
  </p>

</div>

<h3>Begin A New Analysis</h3>
<hr/>

<div class="inset-8">
  <form class="form-inline" role="form" method='get' action="/results/new">
    <div class="form-group">
      ${selectInputCollection(model.DataSetInfo.getAll(owner).map(\ o -> o.Name), "DataSet", {'class' -> 'form-control', 'name' -> 'collection'})}
    </div>
    <div class="form-group">
      ${submitInput('Begin Opportinity Analysis', {'class' -> 'btn btn-primary'})}
    </div>
    <div class="form-group pull-right">
      <button ic-post-to="/jobs?type=test" class="btn btn-default">
        Test Job
      </button>
    </div>
  </form>
</div>
