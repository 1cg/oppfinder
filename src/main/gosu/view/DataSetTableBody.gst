<table class="table">
  <thead>
    <tr>
      <th>
        DataSets
      </th>
    </tr>
  </thead>
  <tbody>
  <% for (result in model.DataSetEntry.AllDataSets()) {%>
    <tr>
      <td>
        <a href='/datasets/${result}' style="color:#476CB5">${result}</a>
      </td>
    </tr>
  <% } %>
  </tbody>
</table>