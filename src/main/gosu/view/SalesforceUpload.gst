<%@ params(code : String ) %>

<h1>Select a recommendation result to upload</h1>

<!-- Be able to pass a UUID (for the recommendation job) and the code parameter -->

<p>This page is ugly, I know. Will clean up as soon as salesforce works</p>

<a class="btn" ic-post-to="/jobs?type=auth&id=0000&code=${code}">Test!</a>

<% for(recommendationUUID in jobs.Job.CompleteRecommendJobs) { %>
  <form action="/jobs?type=auth&id=${recommendationUUID}&code=${code}" >
    <input type="submit" value="${recommendationUUID}">
  </form>
<% } %>