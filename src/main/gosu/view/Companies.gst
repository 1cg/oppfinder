<h1><i class="fa fa-search"></i> <span>Opportunity</span><span>Finder!!!  </span></h1>

<p>Welcome to OpportunityFinder, the 2014 Gosu Summer If Intern Project!</p>

<p>The table of generated data to be analyzed is displayed below.</p>

<a class="btn btn-lg btn-primary" href="/">
  <strong>Go Back</strong>
</a>

<table class="table">
  <thead>
  </thead>
  <tbody>
    <% for (entry in model.DataSetEntry.All) { %>
    <tr>
      <% for (key in entry.keySet()) { %>
      <td> ${key} </td>
      <td> ${entry[key]} </td>
      <% } %>
    </tr>
    <% } %>
  </tbody>
</table>
