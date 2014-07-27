Template.appConfig.events({
  'click .app-button': function() {
    Router.go('app', {appId: this._id});
  },
  'click .thresholder': function(e,t) {
    if ( !$(e.target).hasClass('thresholder') )
      return false;

    var target = $(e.currentTarget);

    var newPercent = Math.round(Number(e.offsetX)*100/Number(target.width()));
    
    Meteor.call('insertThreshold', {
      appId: Session.get('appId'),
      type: target.data('type'),
      value: newPercent,
      eventName: target.data('type') + '_event'
    }, function(e,r) {
      if ( !e && r ) {
        Alerts.add('Threshold added at ' + String(newPercent) + '%!', 'success', {
          autoHide: 3000
        });
      } else {
        Alerts.add('Error adding threshold', 'error',  {
          autoHide: 3000
        });
      }
    });
  }
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
  }
});

Template.thresholdVal.events({
  'click .threshold': function(e,t) {
    e.stopPropagation();
  }
});

Template.thresholdVal.rendered = function() {
  $(this.firstNode).popover({
    placement: 'top'
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
  'blur .event-name': function(e,t) {
    var eventName = $(e.currentTarget).val();
    if ( eventName && eventName !== this.eventName ) {
      Meteor.call('updateThreshold', this._id, {
        $set: {
          eventName: eventName
        }
      }, function(e,r) {
        if ( !e && r ) {
          Alerts.add('Threshold event name updated!', 'success',  {
            autoHide: 3000
          });
        } else {
          Alerts.add('Error updating threshold event name', 'error', {
            autoHide: 3000
          });
        }
      });
    }
  }
});