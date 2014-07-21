<div>
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
<style type="text/css">

      .form-signin {
        max-width: 300px;
        padding: 19px 29px 29px;
        margin: 0 auto 20px;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        -webkit-border-radius: 5px;
           -moz-border-radius: 5px;
                border-radius: 5px;
        -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.05);
           -moz-box-shadow: 0 1px 2px rgba(0,0,0,.05);
                box-shadow: 0 1px 2px rgba(0,0,0,.05);
      }
      .form-signin .form-signin-heading,
      .form-signin .checkbox {
        margin-bottom: 10px;
      }
      .form-signin input[type="text"],
      .form-signin input[type="password"] {
        font-size: 16px;
        height: auto;
        margin-bottom: 15px;
        padding: 7px 9px;
      }

    </style>
  </head>
  <body>
    <div class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a href="/" class="navbar-brand"><span class="op">Opp</span><span class="fi">Finder</span></a>
        </div>
        <div class="navbar-collapse collapse" id="navbar-main">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="https://github.com/carsongross/oppfinder">GitHub <i class="fa fa-github"></i></a></li>
          </ul>
        </div>
      </div>
    </div>

    <br><br><br>
    <div id="main-content" class='container'>
    <!-- MAIN CONTENT -->

       <div class="container">
        <form class="form-signin" ic-post-to="/user/login" role="form">
          <h2 class="form-signin-heading">Sign In</h2>
          <input type="text" class="input-block-level" placeholder="Email address" name="username">
          <input type="password" class="input-block-level" placeholder="Password" name="password">
          <label class="checkbox">
            <input type="checkbox" value="remember-me"> Remember me
          </label>
          <button class="btn btn-large btn-primary" type="submit">Sign in</button>
        </form>

        <form class="form-signin" ic-post-to="/user" role="form">
          <h2 class="form-signin-heading">Register</h2>
          <input type="text" class="input-block-level" placeholder="Email address" name="username">
          <input type="password" class="input-block-level" placeholder="Password" name="password">
          <button class="btn btn-large btn-primary" type="submit">Register</button>
        </form>
       </div>



    <!-- END MAIN CONTENT -->
    </div>
  </body>
</html>