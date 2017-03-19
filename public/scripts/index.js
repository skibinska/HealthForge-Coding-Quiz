(function (window) {
  'use strict';

  window.onload = onLoad;

  var table = null;
  var filterTimeout = null;
  var filterFirstName = null;
  var filterLastName = null;
  var filterZipCode = null;
  var grid = null;

  function onLoad () {
    setElements();
    grid = new Grid ('https://api.interview.healthforge.io:443/api/patient');
    grid.setSortFilter('lastName');
    grid.setSortOrder(Grid.ASC);
    grid.setSize(20);
    search();
    filterFirstName.addEventListener('keyup', function () {
      inputChanged('firstName', filterFirstName);
    });
    filterLastName.addEventListener('keyup', function () {
      inputChanged('lastName', filterLastName);
    });
    filterZipCode.addEventListener('keyup', function () {
      inputChanged('zipCode', filterZipCode);
    });
  }

  function search () {
    emptyTable();

    grid.search()
    .then(function(patients){
      patients.forEach(function (patient) {
        showPatients(patient);
      });
    });
  }

  function emptyTable () {
    var results = document.getElementsByClassName('result');
    while( results.length ) {
      results[0].parentNode.removeChild(results[0]);
    }
  }

  function setElements () {
    table = document.querySelector('.table');
    filterFirstName = document.querySelector('.filter-first-name');
    filterLastName = document.querySelector('.filter-last-name');
    filterZipCode = document.querySelector('.filter-zip-code');
  }

  function inputChanged (filterName, input) {
    if (filterTimeout !== null) clearTimeout(filterTimeout);
    filterTimeout = setTimeout(function () {
      grid.setFilter(filterName, input.value);
      search();
    }, 1000);
  }

  function createPatientHTML (patient) {
    var source = document.getElementById('patientsTable').innerHTML;
    var template = Handlebars.compile(source);
    var output = template(patient);
    //
    console.log(output, 'output from createPatientHTML' );
    return output;
  }

  function showPatients (patient) {
    table.innerHTML += createPatientHTML(patient);
  }

  // function checkData (data) {
  //   if (!data) return '-';
  //   return data;
  // }

})(window);
