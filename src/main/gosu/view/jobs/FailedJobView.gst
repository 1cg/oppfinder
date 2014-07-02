package view.jobs

    <%@ params(job : jobs.Job) %>
<div class='jumbotron'>
  <h2>Failed Job Stack Trace:</h2><br>
  <p style='color:red;'>${job.search('Exception')}</p>
</div>