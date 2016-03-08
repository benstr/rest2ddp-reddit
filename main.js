RedditFeed = new Mongo.Collection('redditFeed');

if (Meteor.isServer) {
  Meteor.startup(function () {
    REST2DDP.configs.push({
      name: 'reddit-feed',
      pollInterval: 10,
      collectionName: 'redditFeed',
      restUrl:'https://www.reddit.com/.json',
      jsonPath: '$.data.children.*'
    });
  });
}

if (Meteor.isClient) {
  Template.body.onCreated( function() {
    var self = this;
    self.autorun(function () {
      self.subscribe('REST2DDP', 'reddit-feed');
    });
  });

  Template.body.helpers({
    things: function() {
      //RedditFeed.find({},{sort: {'data.score':-1}})
      return RedditFeed.find({}).map(function(thing, index) {
        thing.data.rank = index + 1;
        return thing;
      });
    }
  });

  Template.thing.helpers({
    thumbnailLength: function() {
      return this.thumbnail.length;
    },
    thumbnailSelf: function() {
      return this.thumbnail === 'self';
    },
    fromNow: function(time) {
      if(time)
        return moment(time*1000).fromNow()
    },
    expandType: function() {
      switch(this.post_hint) {
        case 'self':
          return 'selftext';
          break;
        case 'rich:video':
          return 'video';
          break;
        default:
          return undefined
      }
    }
  });
}
