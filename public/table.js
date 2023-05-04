let dataTable;

document.addEventListener('DOMContentLoaded', () => {
  loadData();
});

async function loadData() {
  const year = document.getElementById('year').value;
  const response = await fetch(`/data/${year}`);
  const data = await response.json();
  displayData(data);
}

function displayData(data) {
  if (dataTable) {
    dataTable.destroy();
  }

  dataTable = $('#data-table').DataTable({
    data: data,
    columns: [
      { data: 'Asset Name' },
      { data: 'Lat' },
      { data: 'Long' },
      { data: 'Business Category' },
      { data: 'Risk Rating' },
      {
        data: 'Risk Factors',
        render: function (data, type, row) {
          return JSON.stringify(JSON.parse(data));
        },
      },
    ],
  });

$('#data-table').css('max-width', $(window).width());
}
