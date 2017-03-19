(function (window) {
  'use strict';
  var Grid = function (apiUrl) {
    this.apiUrl = apiUrl;
    this.filters = {};
    this.sortFilter = null;
    this.sortOrder = null;
    this.page = 0;
    this.size = 10;
    this.collection = [];
  };

  Grid.prototype.setPage = function (page) {
    this.page = page;
  };

  Grid.prototype.setSize = function (size) {
    this.size = size;
  };

  Grid.prototype.setSortFilter = function (filter) {
    this.sortFilter = filter;
  };

  Grid.prototype.setSortOrder = function (order) {
    this.sortOrder = order;
  };

  Grid.prototype.getQueryString = function () {
    var qs = '?';

    for (var filterName in this.filters) {
      if (!this.filters.hasOwnProperty(filterName)) return;

      var ampersand = '&';
      if (qs === '?') ampersand = '';

      qs += ampersand + filterName + '=' + encodeURIComponent(this.filters[filterName].toLowerCase());
    }

    var ampersand = '&';
    if (qs === '?') ampersand = '';

    qs += ampersand + 'page=' + this.page;
    qs += '&size=' + this.size;

    if (this.sortFilter !== null && this.sortOrder !== null) {
      qs += '&order=' + encodeURIComponent(this.sortFilter + ' ' + this.sortOrder);
    }

    console.log(qs);
    return qs;
  };

  Grid.prototype.search = function () {
    var xhr = new XMLHttpRequest();
    var _this = this;
    var collectionPromise = new Promise (function (resolve, reject) {
      xhr.onreadystatechange = function () {
        if ( xhr.readyState !== 4 || xhr.status !== 200 ) return;

        var response = JSON.parse(xhr.responseText);
        _this.collection = response.content;
        resolve(_this.collection);
        console.log(_this.collection);
      }
    });

    xhr.open('GET', _this.apiUrl + _this.getQueryString());
    xhr.send();

    return collectionPromise;
  };

  Grid.prototype.setFilter = function (filterName, filterValue) {
    if (filterValue.trim() === '') {
      delete this.filters[filterName];
      return;
    }
    this.filters[filterName] = filterValue;
  };

  Grid.ASC = 'ASC';
  Grid.DESC = 'DESC';

  window.Grid = Grid;
})(window);
