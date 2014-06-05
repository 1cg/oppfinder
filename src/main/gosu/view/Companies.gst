<h1><i class="fa fa-search"></i> <span>Opportunity</span><span>Finder!!!  </span></h1>

<p>Welcome to OpportunityFinder, the 2014 Gosu Summer If Intern Project!</p>

<p>The table of generated data to be analyzed is displayed below.</p>

<a class="btn btn-lg btn-primary" href="/">
  <strong>Go Back</strong>
</a>

<table class="table">
  <thead>
    <tr>
      yo...dude
      <% for (entry in model.DataSetEntry.All) { %>
  test?
    <tr>
      <% for (key in entry.keySet()) { %>
      <td> ${key} </td>
      <td> ${entry[key]} </td>
      <% } %>
    </tr>
  <% } %>
</table>

<table class="table">
  <thead>
    <tr>
      <th>
        Job Id
      </th>
      <th>
        Progress
      </th>
    </tr>
  </thead>
  <tbody>
    <% for(job in jobs.Job.Active) { %>
    <tr>
      <td>
        ${job.UUId}
      </td>
      <td>
      <div class="progress progress-striped active">
        <div class="progress-bar"  role="progressbar" aria-valuenow="${job.Progress}" aria-valuemin="0" aria-valuemax="100" style="width: ${job.Progress}%">
          <span class="sr-only">${job.Progress}% Complete</span>
        </div>
      </div>
      </td>
    <% } %>
  </tbody>
</table>