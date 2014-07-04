<h1 class="page-title">
  <span class="op">Opportunity</span><span class="fi">Finder</span>
  <small><em>Find new business opportunities within PolicyCenter</em></small>
</h1>

<hr/>

<div class="inset-8 root-overview">

  <p>
  Guidewire PolicyCenter® is a flexible underwriting and policy administration system designed to empower personal and commercial lines carriers to deliver insurance the way they've always wanted to. Designed solely for P/C insurers, PolicyCenter is a complete system-of-record and supports the core functions of the policy lifecycle—product definitions, underwriting, quoting, binding, endorsements, and renewals.
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
  <form class="form-inline" role="form" ic-post-to="/jobs?type=recommend">
    <div class="form-group">
    <label>
      <strong>Select DataSet: </strong>
    </label>
    <select class="form-control" name="collections">
      <optgroup label="Most Recent">
      <% for(collection in model.DataSet.allDataSets){ %>
        <option value=${collection['name']}>${collection['name']}</option>
      <% } %>
      </optgroup>
    </select>
    </div>
    <div class="form-group">
      <input class="btn btn-primary" type="submit" value="Begin Opportunity Analysis">
    </div>
    <div class="form-group pull-right">
      <button ic-post-to="/jobs?type=test" class="btn btn-default">
        Test Job
      </button>
    </div>
  </form>
</div>
