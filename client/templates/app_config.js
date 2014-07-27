Template.appConfig.events({
  'click .app-button': function() {
    Router.go('app', {appId: this._id});
  },
  'click .thresholder': function(e,t) {
    if ( !$(e.target).hasClass('thresholder') )
      return false;

    var target = $(e.currentTarget);

    if ( target.data('type') === 'loadAvg' ) {
      var newValue = Math.round(Number(e.offsetX)*60/Number(target.width()))/10;
    } else {
      var newValue = Math.round(Number(e.offsetX)*100/Number(target.width()));
    }
    
    Meteor.call('insertThreshold', {
      appId: Session.get('appId'),
      type: target.data('type'),
      value: newValue,
      eventName: target.data('type') + '_event'
    }, function(e,r) {
      if ( !e && r ) {
        if ( target.data('type') === 'loadAvg' ) {
          Alerts.add('Threshold added at ' + String(newValue) + '!', 'success', {
            autoHide: 3000
          });
        } else {
          Alerts.add('Threshold added at ' + String(newValue) + '%!', 'success', {
            autoHide: 3000
          });
        }
      } else {
        Alerts.add('Error adding threshold', 'error',  {
          autoHide: 3000
        });
      }
    });
  },
  'click .remove-yo-user': function(e,t) {
    Meteor.call('removeAppYoUser', Session.get('appId'), e.currentTarget.parentNode.textContent,
      function(error, result) {
        if (error) {
          console.log(error);
          return;
        }
      }
    );
  },
  'click .add-yo-user': function(e,t) {
    var username = $('#add-yo-user-input').val();
    $('#add-yo-user-input').val("");
    if (!!username) {
      Meteor.call('updateAppYos',
        {
          appId: Session.get('appId'),
          yoUserName: username
        }, function(error, result) {
          if (error) {
            console.log(error);
            return;
          }
        });
    }
  },
});

Template.appConfig.helpers({
  app: function() {
    return Apps.findOne(Session.get('appId'));
  },
  thresholds: function(type) {
    return Thresholds.find({
      appId: Session.get('appId'),
      type: type
    });
  },
  connectionStatus: function() {
    if ( 
      (this.lastConnected && this.lastConnected > Number(this.lastDisconnected)) || 
      (this.lastConnected && !this.lastDisconnected)
     ) {
      return 'green-status'
    }
    return 'red-status'
  }
});

Template.thresholdVal.events({
  'click .threshold': function(e,t) {
    e.stopPropagation();
  }
});

Template.thresholdVal.helpers({
  leftValue: function() {
    if ( this.type === 'loadAvg' ) {
      return this.value*100/6;
    } else {
      return this.value;
    }
  }
});

Template.thresholdVal.rendered = function() {
  $(this.firstNode).popover({
    placement: 'right',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><div class="popover-content"></div></div>'
  });
}

Template.thresholdVal.events({
  'shown.bs.popover .threshold': function(e,t) {
    var popoverId = t.$('.threshold').attr('aria-describedby');
    UI.insert(UI.renderWithData(Template.thresholdPopover, t.data), $('#' + popoverId).find('.popover-content').get(0));
  }
});

Template.thresholdPopover.events({
  'click .delete-threshold': function(e,t) {
    Meteor.call('deleteThreshold', this._id, function(e,r) {
        if ( !e && r ) {
          Alerts.add('Threshold deleted', 'success',  {
            autoHide: 3000
          });
        } else {
          Alerts.add('Error deleting threshold', 'error', {
            autoHide: 3000
          });
        }
      });
    $(t.firstNode).parents('.popover').remove();
  },
  'click .update-threshold': function(e,t) {
    var self = this;
    var newVal = t.$('.thresh-value').val();
    var eventName = t.$('.event-name').val();

    params = {};
    if ( newVal && Number(newVal) !== this.value )
      params.value = Number(newVal);
    if ( eventName && eventName !== this.eventName )
      params.eventName = eventName;

    if ( params && _.keys(params).length > 0 ) {
      Meteor.call('updateThreshold', this._id, {
        $set: params
      }, function(e,r) {
        if ( !e && r ) {
          Alerts.add('Threshold updated!', 'success',  {
            autoHide: 3000
          });
        } else {
          Alerts.add('Error updating threshold', 'error', {
            autoHide: 3000
          });
        }
        $('#threshold-' + self._id).popover('hide');
      });
    }
  },
  'click .trigger-threshold': function(e,t) {
    Meteor.call('addEvent', {
      appId: this.appId,
      eventName: this.eventName,
      direction: 'over',
      value: this.value
    });
  }
});