Template.app.events({
  'click .config-button': function() {
    Router.go('appConfig', {appId: this._id});
  }
});

Template.app.rendered = function() {
  if(typeof Rickshaw === 'undefined') return;
  var cpuGraph = new Rickshaw.Graph( {
    element: document.getElementById("cpu-graph"),
    width: 900,
    height: 100,
    renderer: 'line',
    series: new Rickshaw.Series.FixedDuration([{name: "cpu - 1s - 0"}], undefined, {
      timeInterval: 5000,
      maxDataPoints: 100,
      timeBase: new Date().getTime() / 1000
    }) 
  });

  var memoryGraph = new Rickshaw.Graph( {
    element: document.getElementById("memory-graph"),
    width: 900,
    height: 100,
    renderer: 'line',
    series: new Rickshaw.Series.FixedDuration([{name: "memory - system"}], undefined, {
      timeInterval: 5000,
      maxDataPoints: 100,
      timeBase: new Date().getTime() / 1000
    }) 
  } );

  var loadGraph = new Rickshaw.Graph( {
    element: document.getElementById("load-graph"),
    width: 900,
    height: 100,
    renderer: 'line',
    series: new Rickshaw.Series.FixedDuration([{name: "load - 1m"}], undefined, {
      timeInterval: 5000,
      maxDataPoints: 100,
      timeBase: new Date().getTime() / 1000
    }) 
  } );

  // cpuGraph.render();
  // memoryGraph.render();
  // loadGraph.render();


  var curStats = Stats.find({
    appId: Session.get('appId')
  }, { 
    sort: {
      createdAt: -1
    }
  });


  var addCpuData = function(stats) {
    addData = {};
    var topics = _.pick(stats, 'cpu');
    for (var item in topics) {
      var dataPoint = '5s';
      for (var index in topics[item][dataPoint]) {
        var key = item + ' - ' + dataPoint + ' - ' + index;
        addData[key] = topics[item][dataPoint][index];
      }
    }
    cpuGraph.series.addData(addData);
    cpuGraph.render();
  };

  var addMemoryData = function(stats) {
    addData = {};
    var topics = _.pick(stats, 'memory');
      for (var item in topics) {
        for (var dataPoint in topics[item]) {          
          var key = item + ' - ' + dataPoint;
          addData[key] = topics[item][dataPoint];
        }
      }
    memoryGraph.series.addData(addData);
    memoryGraph.render();
  };

  var addLoadData = function(stats) {
    addData = {};
    var topics = _.pick(stats, 'loadAvg');
      for (var item in topics) {
        for (var dataPoint in topics[item]) {          
          var key = item + ' - ' + dataPoint;
          addData[key] = topics[item][dataPoint];
        }
      }
    loadGraph.series.addData(addData);
    loadGraph.render();
  };

  observeHandle = curStats.observe({
    added: function(stat) {
      addCpuData(stat);
      addMemoryData(stat);
      addLoadData(stat);
    }
  });
};

Template.app.destroyed = function() {
  observeHandle.stop();
};


Template.app.helpers({
  app: function() {
    return Apps.findOne(Session.get('appId'))
  },
  createdFormatted: function() {
    return moment(this.createdAt).format('h:mm a MM/DD/YYYY')
  },
  stats: function() {
    return Stats.find({
      appId: this._id
    }, {
      sort: {
        createdAt: -1
      },
      limit: 10
    });
  },
  logs: function() {
    return Logs.find({
      appId: this._id
    }, {
      sort: {
        createdAt: -1
      },
      limit: 10
    });
  },
  eventList: function() {
    return VoyagerEvents.find({
      appId: this._id
    }, {
      sort: {
        createdAt: -1
      },
      limit: 10
    });
  }
});