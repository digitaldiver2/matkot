'use strict';
(function () {

  class UserComponent {
    constructor($scope, $http, $stateParams, $location, $q, userService) {
      this.isAdmin = false;

      this.$http = $http;
      this.$scope = $scope;
      this.$location = $location;
      this.$scope.user = {};
      this.$scope.userid = $stateParams.id;

      this.$q = $q;
      this.userService = userService;

      this.columns = [
        {
          title: 'Naam',
          field: 'name'
        }, {
          title: 'Categorie',
          field: 'pricecategory.name'
        }, {
          title: 'Info',
          field: 'info'
        }
      ]
    }

    $onInit() {

      // var userQ = this.$http.get('/api/users/admin/' + this.$scope.userid);
      var userQ = this.userService.getUser(this.$scope.userid);
      var usergroupQ = this.userService.getUserGroups();

      this.$q.all([userQ, usergroupQ]).then(answer => {
        this.$scope.user = answer[0];
        this.isAdmin = this.$scope.user.role == 'admin';

        this.groups = answer[1];

        this.$scope.user.groups.forEach(req => {
          var group = _.find(this.groups, { _id: req._id });
          if (group) {
            group.checked = true;
          }
        });
        this.$scope.user.requested_groups.forEach(req => {
          var group = _.find(this.groups, { _id: req._id });
          if (group) {
            group.requested = true;
          }
        });
      });

    }

    onAdd(group) {
      this.userService.approveGroup(undefined, this.$scope.user, group);
    }
    onRemove(group) {
      this.userService.declineGroup(undefined, this.$scope.user, group);
    }

    changerole() {
      if (this.isAdmin) {
        this.$scope.user.role = 'admin';
      } else {
        this.$scope.user.role = 'user';
      }
    }

    adminResetPassword() {
      this.userService.adminChangePassword(this.$scope.user._id, this.$scope.password).then(result => {
        console.log('password reset ok!');
        alert('password reset succesful');
      });
    }


    getGroups() {
      this.$scope.user.groups = [];
      this.groups.forEach(function (usergroup) {
        if (usergroup.checked) {
          this.$scope.user.groups.push(usergroup._id);
        }
      }, this);
    }

    submit() {
      // this.getGroups();
      this.userService.updateUser(this.$scope.user).then(user => {
        this.$location.path('/admin/users');
      });
    }

    approve(group) {
      var index = this.getIndexById(group._id, this.groups);
      if (index != undefined) {
        this.groups[index].checked = true;
      }

      this.$scope.user.groups.push(group);
      var index = this.$scope.user.requested_groups.indexOf(group);
      this.$scope.user.requested_groups.splice(index, 1);
    }

    getIndexById(id, array) {
      for (var i = 0; i < array.length; i++) {
        var object = array[i];
        if (array[i]._id && array[i]._id == id) {
          return i;
        }
      }
      return undefined;
    }
  }

  angular.module('matkotApp.admin')
    .component('user', {
      templateUrl: 'app/admin/user/user.html',
      controller: UserComponent
    });

})();
