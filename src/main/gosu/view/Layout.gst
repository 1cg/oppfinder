<%@ params(body:String) %>
<html>
  <head>
    <link href="//netdna.bootstrapcdn.com/bootswatch/3.1.1/spacelab/bootstrap.min.css" rel="stylesheet">
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
    <script src="https://s3.amazonaws.com/intercoolerjs.org/release/intercooler-0.3.2.min.js"></script>
    <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
    <!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/css/jasny-bootstrap.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="//cdnjs.cloudflare.com/ajax/libs/jasny-bootstrap/3.1.3/js/jasny-bootstrap.min.js"></script>
    <style>
      body {
        margin-top:50px;
      }
    </style>
  </head>
  <body>
    <div class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a href="/" class="navbar-brand"><i class="fa fa-search"></i> OppFinder</a>
          <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
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
              <a href="/companies">Input Data</a>
            </li>
            <li>
              <a href="/jobs/running/1">Currently Running</a>
            </li>
            <li>
              <a href="/jobs/complete/1">Completed</a>
            </li>
            <li>
              <a href="/jobs/cancelled/1">Cancelled</a>
            </li>
          </ul>

          <ul class="nav navbar-nav navbar-right">
            <li><a href="https://github.com/carsongross/oppfinder"><i class="fa fa-github"></i></a></li>
          </ul>

        </div>
      </div>
    </div>
    <div id="main-content" class='container'>
      ${body}
    </div>
  </body>
</html>