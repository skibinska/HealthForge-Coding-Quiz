Handlebars.registerHelper('capitalizeFirstLetter', function (string) {
  if (!string) return 'NHS';
  return string.charAt(0).toUpperCase() + string.slice(1);
});
