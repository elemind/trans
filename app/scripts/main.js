(function() {

  // ------------------------------------
  // Fake link
  // ------------------------------------
  $("[href=#fake],[type=submit]").click(function(e) { e.preventDefault(); });

})();
