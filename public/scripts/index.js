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
    addEditNoteEventListener();
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

  function addEditNoteEventListener () {
    var detailButtons = document.getElementsByClassName("btn--detail");

    for (var detailButtonKey in detailButtons) {
      var detailButton = detailButtons[detailButtonKey];
      console.log(detailButton);

      if (typeof detailButton === 'object') {
        detailButton.addEventListener("click", function (event) {
          var button = this;
          button.modal('open');
        });
      }
    }
  }

  function createPatientHTML (patient) {
    var patientHTML =
    '<div class="table__row result"> \
    <div class="table__cell">' + patient.firstName + '</div> \
    <div class="table__cell">' + patient.lastName + '</div> \
    <div class="table__cell">' + patient.gender + '</div> \
    <div class="table__cell">' + formatDate(patient.dateOfBirth) + '</div> \
    <div class="table__cell">' + formatDate(patient.dateOfDeath) + '</div> \
    <div class="table__cell">' + patient.addresses[0].zipCode + '</div> \
    <div class="table__cell"><button class="btn btn-default btn--detail" data-toggle="modal" data-target="#modal">Details</button></div> \
    </div> \
    <div class="modal fade" id="modal" role="dialog"> \
    <div class="modal-dialog"> \
    <div class="modal-content"> \
    <div class="modal-header"> \
    <button type="button" class="close" data-dismiss="modal">&times;</button> \
    <h2 class="modal-title">Patient: ' + patient.prefix + ' ' + patient.firstName + ' ' + patient.lastName +'</h2> \
    </div> \
    <div class="modal-body"> \
    <ul class="list-group"><b>Identifiers: </b>  \
    <li class="list-group-item">Usage: ' + checkData(patient.identifiers[0].usage) + '</li> \
    <li class="list-group-item">Value: ' + checkData(patient.identifiers[0].value) + '</li> \
    <li class="list-group-item">Code System: ' + checkData(patient.identifiers[0].codeSystem) + '</li> \
    </ul> \
    <ul class="list-group"><b>Adress: </b>  \
    <li class="list-group-item">Country: ' + checkData(patient.addresses[0].country) + '</li> \
    <li class="list-group-item">Zip code: ' + checkData(patient.addresses[0].zipCode) + '</li> \
    <li class="list-group-item">Street: ' + checkData(patient.addresses[0].line1) + ', ' + checkData(patient.addresses[0].line2) + '</li> \
    </ul> \
    <ul class="list-group"><b>Phone number: </b> \
    <li class="list-group-item">Home: ' + checkData(patient.telecoms[0].value) + '</li> \
    </ul> \
    </div> \
    <div class="modal-footer"> \
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> \
    </div> \
    </div> \
    </div> \
    </div>';

    return patientHTML;
  }

  function showPatients (patient) {
    table.innerHTML += createPatientHTML(patient);
  }

  function formatDate (date) {
    if (!date) return 'active';
    return date.substr(0, 10);
  }

  function checkData (data) {
    if (!data) return '-';
    return data;
  }

})(window);
