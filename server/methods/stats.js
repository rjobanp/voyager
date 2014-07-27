Meteor.methods({
  stats: function(params) {
    params = params || [];
    var apikey = params[0];
    var data = params[1];

    if ( apikey && data && typeof data === 'object' ) {
      var app = Apps.findOne({
        apiKey: apikey
      });

      if ( app && app._id ) {
        data.appId = app._id;

        try {
          var insertedStat = Stats.insert(data);
        } catch (e) {
          return e;
        }

        this.unblock();

        checkStatForThresholds(insertedStat);

        return insertedStat;
      }
    }
  }
});

checkStatForThresholds = function(insertedStat) {
  var newStat = Stats.findOne(insertedStat);

  // Get doc of last stat inserted before this one
  var lastStat;
  newStat && Stats.find({
    appId: newStat.appId
  }, {
    sort: {
      createdAt: -1
    },
    limit: 2
  }).forEach(function(stat) {
    if ( stat._id !== newStat._id )
      lastStat = stat;
  });

  if ( newStat && lastStat ) {
    // Now lets compare this new stat to the last one to see if any thresholds were peaked
    
    // compare cpu
    if ( lastStat.cpu['5s'] && newStat.cpu['5s'] ) {
      var cpuLen = newStat.cpu['5s'].length;
      Thresholds.find({
        appId: newStat.appId,
        type: 'cpu'
      }).forEach(function(threshold) {
        var i, p0, p1;
        for ( i=0; i < cpuLen; i++ ) {
          // get the first and last val for this cpu core
          p0 = lastStat.cpu['5s'][i] * 100;
          p1 = newStat.cpu['5s'][i] * 100;

          // if a threshold was crossed
          if ( Math.min(p0,p1) < threshold.value && Math.max(p0,p1) > threshold.value ) {
            triggerEventFromThreshold(threshold, p0, p1);
          }
        }
      });
    }

    // compare memory
    if ( lastStat.memory.system && newStat.memory.system ) {
      var m0, m1;
      // get the first and last val for the memory
      m0 = lastStat.memory.system * 100;
      m1 = newStat.memory.system * 100;
      Thresholds.find({
        appId: newStat.appId,
        type: 'memory'
      }).forEach(function(threshold) {
        // if a threshold was crossed
        if ( Math.min(m0,m1) < threshold.value && Math.max(m0,m1) > threshold.value ) {
          triggerEventFromThreshold(threshold, m0, m1);
        }
      });
    }

    // compare load avg
    //
    //

  }

}