<%@ params(job : jobs.Job) %>
<div class='jumbotron'>
  <h4 class="sub-section-header">Failed Job Stack Trace:</h4><br>
  <p style='color:red;'>${job.get('Exception')}</p>
</div>