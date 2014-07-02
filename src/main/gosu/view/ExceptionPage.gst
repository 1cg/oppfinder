<%@ params( ex: java.lang.Exception ) %>

<div>
<h1>Ooops!</h1>
<h3>An exception occured: ${ex.Message}</h3>
<pre>
  ${ex.StackTraceAsString}
</pre>