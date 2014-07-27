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
    Thresholds.find({
      appId: newStat.appId,
      type: 'cpu'
    }).forEach(function(threshold) {
      var i, p0, p1;
      var cpuLen = newStat.cpu['5s'].length;
      for ( i=0; i < cpuLen; i++ ) {
        // get the first and last val for this cpu core
        p0 = lastStat.cpu['5s'][i] * 100;
        p1 = newStat.cpu['5s'][i] * 100;

        // if a threshold was crossed
        if ( _.min(p0,p1) < threshold.value && _.max(p0,p1) > threshold.value ) {
          triggerEventFromThreshold(threshold, p0, p1);
        }
      }
    });

    // compare memory
    Thresholds.find({
      appId: newStat.appId,
      type: 'memory'
    }).forEach(function(threshold) {
      var p0, p1;
      // get the first and last val for the memory
      p0 = lastStat.memory.system * 100;
      p1 = newStat.memory.system * 100;

      // if a threshold was crossed
      if ( _.min(p0,p1) < threshold.value && _.max(p0,p1) > threshold.value ) {
        triggerEventFromThreshold(threshold, p0, p1);
      }
    });

    // compare load avg
    // Thresholds.find({
    //   appId: newStat.appId,
    //   type: 'loadAvg'
    // }).forEach(function(threshold) {
    //   var p0, p1;
    //   // get the first and last val for the memory
    //   p0 = lastStat.loadAvg;
    //   p1 = newStat.loadAvg;

    //   // if a threshold was crossed
    //   if ( _.min(p0,p1) < threshold.value && _.max(p0,p1) > threshold.value ) {
    //     triggerEventFromThreshold(threshold, p0, p1);
    //   }
    // });

  }

}