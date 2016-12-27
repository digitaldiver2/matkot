'use strict';

class NavbarController {
  //static menu
  staticMenu = [
    {
      'title': 'Info',
      'state': 'main-info'
    }
  ];
  //start-non-standard
  menu = [
    // {
    //   'title': 'Home',
    //   'state': 'main'
    // },
    {
      'title': 'Aanvragen',
      'state': 'orders'
    }
  ];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('matkotApp')
  .controller('NavbarController', NavbarController);
