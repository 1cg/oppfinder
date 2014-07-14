<%@ params(body:String) %>
<%@ extends sparkgs.SparkGSTemplate %>
<% var code = Request.Session.attribute("code") as String %>
<html>
  <head>
    <title>OppFinder: Summer 2014 intern project</title>

    <link href="//netdna.bootstrapcdn.com/bootswatch/3.1.1/spacelab/bootstrap.min.css" rel="stylesheet">
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/css/jasny-bootstrap.min.css">
    <link href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.5.4/bootstrap-select.min.css" rel="stylesheet">
    <link href="/css/application.css" rel="stylesheet">

    <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="https://s3.amazonaws.com/intercoolerjs.org/release/intercooler-0.4.0.min.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.5.4/bootstrap-select.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/js/jasny-bootstrap.min.js"></script>
    <script src="/js/application.js"></script>

  </head>
  <body>
    <div class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a href="/" class="navbar-brand"><span class="op">Opp</span><span class="fi">Finder</span></a>
          <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="navbar-collapse collapse" id="navbar-main">
          <ul class="nav navbar-nav">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/jobs">Jobs</a>
            </li>
            <li>
              <a href="/datasets">Data</a>
            </li>
            <li>
              <a href="/results">Results</a>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li><a href='https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${java.lang.System.Env['SF_CLIENT_ID']}&redirect_uri=https%3A%2F%2Fgosuroku.herokuapp.com%2Fresults&state=mystate&scope=api%20id%20full%20refresh_token'>
              <% if(code == null || code == "") { %>
              Connect to Salesforce <i class="fa fa-cloud"></i>
              <% } else { %>
              Connected to Salesforce <font color="#3399f3"><i class="fa fa-cloud"></i></font>
              <% } %>
            </a></li>
            <li><a href="https://github.com/carsongross/oppfinder">GitHub <i class="fa fa-github"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
    <div id="main-content" class='container'>
      ${body}
    </div>
  </body>
</html>