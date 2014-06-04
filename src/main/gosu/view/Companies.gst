package view

    ${view.Header.renderToString()}

<h1><i class="fa fa-search"></i> <span>Opportunity</span><span>Finder</span></h1>

<p>Welcome to OpportunitFinder, the 2014 Gosu Summer If Intern Project!</p>

<p>Would you like to begin a new analysis?</p>

<button ic-post-to="/test" ic-target="#feedback" class="btn btn-lg btn-primary">
  <strong>Begin Analysis &rarr;</strong>
</button>
<span id="feedback"></span>

${view.Footer.renderToString()}
