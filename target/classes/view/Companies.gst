package view


<table class="table">
  <% for (entry in new model.DataSet("oppFinder").find()) { %>
    <tr>
      <% for (key in entry.keySet()) { %>
      <td> ${key} </td>
      <td> ${entry[key]} </td>
    </tr>
  <% } %>
</table>

