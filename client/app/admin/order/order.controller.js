'use strict';
(function () {

  class OrderComponent {
    constructor($scope, $http, $location, $stateParams, orderService, productService, userService, socket, $q) {
      this.$scope = $scope;
      this.$http = $http;
      this.$location = $location;
      this.id = $stateParams.id;

      this.orderService = orderService;
      this.userService = userService;
      this.productService = productService;
      this.socket = socket;
      this.$q = $q;

      this.options = {
        initDate: new Date(),
        showWeeks: false
      };

      // only used to give an array to the socket sync, and prevent an error of array being undefined
      this.dummyOrders = [];
      this.comment_body = "";
      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('order');
      });

      this.loading = true;

      this.TAB_INFO = 'INFO';
      this.TAB_SHOP = 'SHOP'
      this.TAB_MESSAGES = 'MESSAGES';
      this.TAB_SHORTAGE = 'SHORTAGE';
      this.TAB_CART = 'CART';

      this.currenttab = this.TAB_INFO;

      this.isSyncing = false;

      this.showAvailability = false;
      this.showPrices = false;
      this.hideDoneItems = true;

      // begin calendar management
      this.getDayClass = function (date, mode) {
        const classes = [];
        if (mode === 'day') {
          if (moment(date).isBetween(this.order.eventstart, this.order.eventstop, 'day', '[]')) {
            classes.push('event');
          }
          if (moment(date).isSame(this.order.pickupdate, 'day')) {
            classes.push('pickup');
          }
          if (moment(date).isSame(this.order.returndate, 'day')) {
            classes.push('return');
          }
        }
        return classes.join(' ');
      }

      this.$scope.popups = {
        'eventstart': false,
        'eventstop': false,
        'pickupdate': false,
        'returndate': false,
      }
      this.retouroptions = {
        customClass: this.getDayClass,
        minDate: null,
        maxDate: null,
        initDate: null,
        showWeeks: false
      };

      this.pickupoptions = {
        minDate: null,
        maxDate: null,
        initDate: null,
        showWeeks: false
      };

      this.eventstartoptions = {
        minDate: null,
        initDate: new Date(),
        showWeeks: false,
        maxDate: null
      };

      this.eventstopoptions = {
        minDate: null,
        initDate: new Date(),
        showWeeks: false,
        maxDate: null
      };

      this.isEventDefined = function () {
        const result = this.order && this.order.eventstart !== null && this.order.eventstart !== undefined 
        && this.order.eventstart !== null && this.order.eventstart !== undefined;
        return result;
      }
      // end calendar management

    }

    $onInit() {
      //TODO: don't show page until everything is loaded
      var orderQ = this.orderService.getOrder(this.id);
      var productQ = this.productService.getProducts();
      var categoryQ = this.productService.getPriceCategories();
      var userGroupQ = this.userService.getUserGroups();
      var productFamilyQ = this.productService.getProductFamilies();
      var userQ = this.userService.getUsers();

      this.$q.all([orderQ, productQ, categoryQ, userGroupQ, productFamilyQ, userQ]).then(answer => {
        this.order = answer[0];
        this.products = answer[1];
        this.$scope.pricecategories = answer[2];
        this.$scope.groups = answer[3];
        this.productcategories = answer[4];
        this.users = answer[5];
        //set all as default option
        var showAllId = this.productcategories.push({ name: "", _id: 0 }) - 1;
        this.categoryFilter = this.productcategories[showAllId];

        this.productService.selectCorrectPrice(this.products, this.order.pricecategory);

        this.prepareOrder();
        this.loading = false;
      }, err => {
        this.errMsg = err;
      });

      this.$scope.returnCollapsed = true;
      this.$scope.pickupCollapsed = true;
      this.$scope.eventstartCollapsed = true;
      this.$scope.eventstopCollapsed = true;
      this.$scope.addProductCollapsed = true;

      this.infoEditMode = false;

      this.$scope.retouroptions = {
        dateDisabled: this.closedDates
      };
      this.$scope.pickupoptions = {
        dateDisabled: this.closedDates
      }
      this.$scope.closedDates = function (calendarDate, mode) {
        return mode === 'day' && calendarDate.getDay() != 3;
      };

      this.socket.syncUpdates('order', this.dummyOrders, (event, item, list) => {
        //actually only a full update is needed if products or shortages have changed
        var fullReload = true;
        if (item._id == this.order._id) {
          this.ReloadOrder(this.order);
        } else {
          // _.merge(this.order, item);
        }
      });
    }

    ReloadOrder(order) {
      this.orderService.getOrder(order._id).then(order => {
        this.order = order;
        this.prepareOrder();
      });
    }

    OrderDuration() {
      // return order duration in days
      if (this.order && this.order.pickupdate != undefined && this.order.returndate != undefined) {
        const a = moment(this.order.returndate).hours(0).minutes(0);
        const b = moment(this.order.pickupdate).hours(0).minutes(0);
        return `${a.diff(b, 'd')} dagen`;
      }
    }

    prepareOrder() {
      this.productService.syncProductsWithOrder(this.products, this.order);
      this.CalculateTotals();
      for (var i = 0; i < this.order.products.length; i++) {
        this.orderService.calcProductAvailability(this.order, this.order.products[i].product);
      }
    }

    evaluate() {
      this.orderService.evaluateOrder(this.order);
      this.save();
    }

    openEventStart() {
      if (this.order.eventstop !== null && this.order.eventstop !== undefined) {
        this.eventstartoptions.maxDate = this.order.eventstop;
      } else {
        this.eventstartoptions.maxDate = undefined
      }
      this.open('eventstart');
    }

    openEventStop() {
      if (this.order.eventstart !== null && this.order.eventstart !== undefined) {
        this.eventstopoptions.minDate = this.order.eventstart;
      } else {
        this.eventstopoptions.minDate = undefined
      }
      this.open('eventstop');
    }

    openPickup() {
      if (this.order.eventstart !== null && this.order.eventstart !== undefined) {
        this.pickupoptions.maxDate = this.order.eventstart;
        this.pickupoptions.initDate = this.order.eventstart;
      } else {
        this.pickupoptions.maxDate = undefined
      }
      this.open('pickupdate');
    }

    openReturn() {
      if (this.order.eventstop !== null && this.order.eventstop !== undefined) {
        this.retouroptions.minDate = this.order.eventstop;
        this.pickupoptions.initDate = this.order.eventstop;
      } else {
        this.eventstopoptions.minDate = undefined
      }
      this.open('returndate');
    }

    open(popupname) {
      this.$scope.popups[popupname] = true;
    }

    CalculateTotals() {
      var estimatedTotal = 0.0;
      var chargedTotal = 0.0;

      for (var i = 0; i < this.order.products.length; i++) {
        var product = this.order.products[i];
        estimatedTotal += product.ordered * product.unitprice;
        chargedTotal += product.received * product.unitprice;
      }
    }

    remove() {
      var r = confirm("Ben je zeker dat je dit order wilt verwijderen?");
      if (r == true) {
        this.$http.delete('/api/orders/' + this.id);
        this.$location.path('/admin/orders');
      }
    }

    calculateOrderNumber(prefix, width, number) {
      var strnumber = number.toString();
      var numberlength = strnumber.length;

      var result = prefix;
      for (var i = 0; i < width - numberlength; i++) {
        result = result + '0';
      }
      result = result + strnumber;
      return result;
    }

    sameNumbers() {
      if (this.order.state === 'ORDERED') {
        for (var i = 0; i < this.order.products.length; i++) {
          var product = this.order.products[i];
          product.approved = product.ordered;
        }
      } else if (this.order.state === 'APPROVED') {
        for (var i = 0; i < this.order.products.length; i++) {
          var product = this.order.products[i];
          product.received = product.approved;
        }
      } else if (this.order.state === 'DELIVERED') {
        for (var i = 0; i < this.order.products.length; i++) {
          var product = this.order.products[i];
          product.returned = product.received;
        }
      }
    }

    resetNumbers() {
      if (this.order.state === 'ORDERED') {
        for (var i = 0; i < this.order.products.length; i++) {
          var product = this.order.products[i];
          product.approved = 0;
        }
      } else if (this.order.state === 'APPROVED') {
        for (var i = 0; i < this.order.products.length; i++) {
          var product = this.order.products[i];
          product.received = 0;
        }
      } else if (this.order.state === 'DELIVERED') {
        for (var i = 0; i < this.order.products.length; i++) {
          var product = this.order.products[i];
          product.returned = 0;
        }
      }
    }


    setOrderNumberIfNeeded() {
      if (this.order.state != 'DRAFT' && this.order.ordernumber == undefined) {
        this.settings.ordercounter += 1;
        this.order.ordernumber = this.calculateOrderNumber(this.settings.orderprefix, this.settings.ordernumberwidth, this.settings.ordercounter);
      }
    }

    /*
    Save the order.
    - assign an ordernumber if needed, and save the settings
    */
    save() {
      if (this.order.state != 'DRAFT' && this.order.ordernumber == undefined) {
        this.$http.get('/api/settings').then(response => {
          this.settings = response.data;
          //increase ordernumber
          this.settings.ordercounter += 1;
          this.order.ordernumber = this.calculateOrderNumber(this.settings.orderprefix, this.settings.ordernumberwidth, this.settings.ordercounter);

          //save order
          this._save(this.order, () => {
            this.$http.put('/api/settings/' + this.settings._id, this.settings);
          });
        });
      } else {
        //no ordernumber needed, just save order
        this._save(this.order);
      }
    }

    /* actual save order
    If state is approved, ask if an email must be sent
    */
    _save(order, postSave) {
      if (this.order.state == 'APPROVED' && confirm('Goedkeurings mail sturen?')) {
        this.orderService.approveOrder(this.order).then(resp => {
          if (postSave != null) {
            postSave(order);
          }
          this.ReloadOrder(this.order);
          alert('saved');
        }, err => {
          console.log(err);
          alert(err);
        });
      } else {
        this.orderService.saveOrder(this.order).then(resp => {
          if (postSave != null) {
            postSave(order);
          }
          this.ReloadOrder(this.order);
          alert('saved');
        }, err => {
          console.log(err);
          alert(err);
        });
      }
    }

    addComment() {
      this.errMsg = '';
      this.orderService.addCommentToOrder(this.order, this.comment_body)
        .then(res => {
          //reload
          this.comment_body = "";
        })
        .catch(err => {
          this.errMsg = err;
        })
    }

    updateProductInOrder(product) {
      this.orderService.updateOrderProduct(this.order, product);
      this.instantSave();
    }

    instantSave() {
      if (this.isSyncing) {
        this.orderService.saveOrder(this.order).then(response => {
          this.ReloadOrder(this.order);
        });
      }
    }

    saveBtn() {
      this.save();
    }

    selectTab(TAB) {
      // console.log('selectTab:' + TAB);
      this.currenttab = TAB;
    }

    isTabVisible(Tab) {
      // console.log('isTabVisible: ' + Tab + ', current: ' + this.currenttab);
      return this.currenttab === Tab;
    }

    isItemNotDone = (orderItem) => {
      let retval = false;
      if (this.hideDoneItems) {
        if (this.order.state === 'APPROVED') {
          retval = orderItem.received == orderItem.approved;
        } else if (this.order.state === 'ORDERED') {
          retval = orderItem.approved == orderItem.ordered;
        } else if (this.order.state === 'DELIVERED') {
          retval = orderItem.returned == orderItem.received;
        }
      }
      return !retval;
    }
  }

  angular.module('matkotApp.admin')
    .component('order', {
      templateUrl: 'app/admin/order/order.html',
      controller: OrderComponent
    });

})();
