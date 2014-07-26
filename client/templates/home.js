Template.home.events({
  'click .open-login': function(e,t) {
    e.preventDefault();
    e.stopPropagation();
    Template._loginButtons.toggleDropdown();
  }
});