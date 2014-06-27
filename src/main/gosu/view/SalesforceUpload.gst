<%@ params(code : String ) %>

<h1>Select a recommendation result to upload</h1>

<!-- Be able to pass a UUID (for the recommendation job) and the code parameter -->

<p>This page is ugly, I know. Will clean up as soon as salesforce works</p>
<% var code1 = code.substring(0,code.length)%>

<a class="btn" href="/jobs/action/start/salesforce_export/0000/${code1}">Test!</a>

<% for(recommendationUUID in jobs.Job.CompleteRecommendJobs) { %>
  <form action="/jobs/action/start/salesforce_export/${recommendationUUID}/${code1}" >
    <input type="submit" value="${recommendationUUID}">
  </form>
<% } %>