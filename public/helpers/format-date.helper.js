Handlebars.registerHelper('formatDate', function (date) {
  if (!date) return 'active';
  return date.substr(0, 10);
});
