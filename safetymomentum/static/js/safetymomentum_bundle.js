(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.safetymomentum_bundle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React     = require('react');
var MainView = require('./safety/view.jsx');

function render (id) {
  React.render(
    React.createElement(MainView, {
      keywords: ['automobile', 'keyword 2']
    }),
    document.getElementById(id)
  );
}

render('safety');

module.exports = render;



},{"./safety/view.jsx":14,"react":"react"}],2:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var Icon;
var _     = require('underscore');
var React = require('react');

/**
 * Creates an icon, currently using the font awesome icon library
 *
 * @examples
 * <Icon type="check" />
 * <Icon type="user" className="muted" />
 * <Icon type="ban" stack="2x" />
 */
Icon = React.createClass({displayName: "Icon",
  propTypes: {
    stack:      React.PropTypes.string,
    type:       React.PropTypes.string.isRequired,
    className:  React.PropTypes.string
  },
  mixins: [React.addons.PureRenderMixin],
  render: function () {
    var classes = ['fa fa-icon'];
    var props   = _.omit(this.props, ['stack', 'type', 'className']);

    if (this.props.stack) {
      classes.push('fa-stack-' + this.props.stack);
    }

    if (this.props.spin) {
      classes.push('fa-spin');
    }

    if (this.props.type) {
      classes.push('fa-' + this.props.type);
    }

    if (this.props.className) {
      classes.push(this.props.className)
    }

    if (this.props.size) {
      classes.push('fa-' + this.props.size);
    }

    return (
      React.createElement("i", React.__spread({},  props, {className: classes.join(' ')}))
    );
  }
});

module.exports = Icon;



},{"react":"react","underscore":"underscore"}],3:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

module.exports = new Dispatcher();



},{"flux":"flux"}],4:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var React       = require('react');
var Icon        = require('../components/icon.jsx');
var dispatcher  = require('./dispatcher');
var FooterBar;

FooterBar = React.createClass({displayName: "FooterBar",
  render: function () {
    return (
      React.createElement("div", {className: "footer-bar"}, 
        React.createElement("nav", null, 
          React.createElement("ul", null, 
            React.createElement("li", null, React.createElement("a", {onClick: this.listView}, React.createElement(Icon, {type: "list"}))), 
            React.createElement("li", null, React.createElement("a", {onClick: this.shareView}, React.createElement(Icon, {type: "send"}))), 
            React.createElement("li", null, React.createElement("a", {onClick: this.searchView}, React.createElement(Icon, {type: "search"})))
          )
        )
      )
    );
  },
  listView: function () {
    dispatcher.dispatch({
      type: 'view',
      view: 'list'
    });
  },
  shareView: function () {
    dispatcher.dispatch({
      type: 'view',
      view: 'share'
    });
  },
  searchView: function () {
    dispatcher.dispatch({
      type: 'view',
      view: 'search'
    });
  }
});

module.exports = FooterBar;



},{"../components/icon.jsx":2,"./dispatcher":3,"react":"react"}],5:[function(require,module,exports){
var store;
var Store;
var dispatcher  = require('./dispatcher');
var Backbone    = require('backbone');


Store = Backbone.Collection.extend({
  url: '/api/moments/',
  dispatchHandler: function (payload) {
    console.log(payload);
  }
});

console.log(Store.prototype.url);
store = new Store(/*[
  {created: new Date(), title: 'One', keywords: ['automobile'], id: 23},
  {created: new Date(), title: 'Two', keywords: ['automobile'], id: 33}
]*/);

store.fetch();

store.token = dispatcher.register(store.dispatchHandler.bind(store));

module.exports = store;



},{"./dispatcher":3,"backbone":"backbone"}],6:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var React         = require('react');
var _             = require('underscore');
var TitleBar      = require('./title_bar.jsx');
var Icon          = require('../components/icon.jsx');
var dispatcher    = require('./dispatcher');
var store         = require('./store');
var list_store    = require('./list_store');
var main_store    = require('./store');
var PrimaryImage  = require('./primary_image.jsx');
var momentjs      = require('moment');
var ListView;

ListView = React.createClass({displayName: "ListView",
  render: function () {
    var pre_controls  = [];
    var moments       = this.buildMoments();

    pre_controls.push(
      React.createElement("li", {key: "category", className: "top-control"}, 
        React.createElement("a", {className: "button", onClick: this.categoryView}, 
          React.createElement(Icon, {type: "list"})
        )
      )
    );

    if (! this.props.search) {
      pre_controls.push(
        React.createElement("li", {key: "search", className: "top-control"}, 
          React.createElement("a", {className: "button", onClick: this.searchView}, 
            React.createElement(Icon, {type: "search"})
          )
        )
      );
    }

    return (
      React.createElement("div", {className: "list-view"}, 
        React.createElement(TitleBar, null, 
          React.createElement("nav", {className: "top-nav"}, 
            React.createElement("ul", null, 
              pre_controls.map(function (control) {return control;})
            )
          ), 

          "Safety Moments", 
          React.createElement("a", {className: "button close-button", onClick: this.closeView}, 
            React.createElement(Icon, {type: "close"})
          )
        ), 
        React.createElement("div", {className: "list-of-moments"}, 
          moments
        )
      )
    );
  },
  searchView: function () {
    this.categoryView();
  },
  categoryView: function () {
    dispatcher.dispatch({
      type: 'view',
      view: 'category'
    });
  },
  buildMoments: function () {
    var moments;
    var elements;
    var category = store.get('category');

    moments = list_store.filter(function (moment) {
      if (category) {
        return moment.get('keywords').indexOf(category) > -1;
      }

      return true;
    });

    elements = _.map(moments, function (moment, index) {
      var date = momentjs(moment.get('created'));
      var imageProps = {
        image:    moment.get('image'),
        keywords: moment.get('keywords')
      };

      date = date.format('MMM M, YYYY');

      return (
        React.createElement("li", {key: index, className: "moment"}, 
          React.createElement("a", {onClick: this.selectMoment.bind(this, moment.id)}, 
            React.createElement("div", {className: "thumb"}, 
              React.createElement(PrimaryImage, React.__spread({},  imageProps))
            ), 
            React.createElement("div", {className: "title"}, 
              moment.get('title')
            ), 
            React.createElement("div", {className: "muted small"}, 
              date
            )
          )
        )
      );
    }, this);

    if (elements.length < 1) {
      return null;
    }

    return (
      React.createElement("ul", null, elements)
    );
  },
  selectMoment: function (id) {
    dispatcher.dispatch({
      type:   'choose',
      value:  id
    });

    this.closeView();
  },
  closeView: function () {
    dispatcher.dispatch({
      type: 'view',
      view: null
    });
  }
});

module.exports = ListView;



},{"../components/icon.jsx":2,"./dispatcher":3,"./list_store":5,"./primary_image.jsx":8,"./store":10,"./title_bar.jsx":12,"moment":"moment","react":"react","underscore":"underscore"}],7:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var View;
var React         = require('react');
var TopBar        = require('./top_bar.jsx');
var FooterBar     = require('./footer_bar.jsx');
var Summary       = require('./summary.jsx');
var Sponsor       = require('./sponsor.jsx');
var TitleBar      = require('./title_bar.jsx');
var ListView      = require('./list_view.jsx');
var PrimaryImage  = require('./primary_image.jsx');
var moment        = require('moment');
var store         = require('./store');

View = React.createClass({displayName: "View",
  getInitialState: function () {
    return {
      view: 'list',
      moment: null
    };
  },
  getDefaultProps: function () {
    return {
      title:        'Safety Moment Title',
      created:      new Date(),
      summary:      'Summary text',
      detail:       'Detail text',
      header_image: undefined,
      keywords:     []
    };
  },
  componentDidMount: function () {
    store.on('change', function () {
      this.setState(store.toJSON());
    }.bind(this));
  },
  componentWillUnmount: function () {
    store.off('change');
  },
  render: function () {
    var view = this.buildView();

    return (
      React.createElement("div", {className: "content"}, 
        React.createElement(TopBar, null), 

        view
      )
    );
  },
  buildView: function () {
    var fn;
    var map;

    map = {
      search: 'buildSearchView',
      share: 'buildShareView',
      list: 'buildListView'
    };

    fn = map[this.state.view];
    fn = this[fn] || this.buildMainView;

    return fn.call(this);
  },
  buildListView: function () {
    return (
      React.createElement(ListView, {search: true})
    );
  },
  buildMainView: function () {
    var keywords = null;
    var imageProps;
    var date = moment(this.props.created);

    date = date.format('MMM M, YYYY');

    if (this.props.keywords.length > 0) {
      keywords = this.props.keywords.join(', ');
    }

    imageProps = {
      image:    this.props.image,
      keywords: this.props.keywords
    };

    return (
      React.createElement("div", {className: "main-view"}, 
        React.createElement(TitleBar, null, 
          this.props.title
        ), 

        React.createElement(PrimaryImage, React.__spread({},  imageProps)), 

        React.createElement("div", {className: "muted small"}, keywords), 
        React.createElement("div", {className: "muted small"}, "Created ", date), 

        React.createElement(Summary, {value: this.props.summary}), 

        React.createElement(Sponsor, null), 

        React.createElement("h3", null, "Details:"), 
        React.createElement(Summary, {value: this.props.detail}), 

        React.createElement(FooterBar, null)
      )
    );
  }
});

module.exports = View;



},{"./footer_bar.jsx":4,"./list_view.jsx":6,"./primary_image.jsx":8,"./sponsor.jsx":9,"./store":10,"./summary.jsx":11,"./title_bar.jsx":12,"./top_bar.jsx":13,"moment":"moment","react":"react"}],8:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var React   = require('react');
var Icon    = require('../components/icon.jsx');
var PrimaryImage;

PrimaryImage = React.createClass({displayName: "PrimaryImage",
  getDefaultProps: function () {
    return {
      keywords: []
    };
  },
  render: function () {
    var ImageEl;

    if (this.props.image) {
      ImageEl = this.buildFromImage();
    }
    else {
      ImageEl = this.buildFromCategory();
    }

    return (
      React.createElement("div", null, 
        ImageEl
      )
    );
  },
  buildFromCategory: function () {
    var category = this.props.keywords || [];

    category = category[0] || 'ban';

    return (
      React.createElement("div", {className: "primary-image-fake"}, 
        React.createElement(Icon, {type: category})
      )
    );
  },
  buildFromImage: function () {
    var image = this.props.image;

    return (
      React.createElement("img", {src: image, className: "primary-image"})
    );
  }
});

module.exports = PrimaryImage;



},{"../components/icon.jsx":2,"react":"react"}],9:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var React   = require('react');
var Sponsor;

Sponsor = React.createClass({displayName: "Sponsor",
  render: function () {
    return (
      React.createElement("div", {className: "sponsor"}, 
        React.createElement("div", {className: "small muted"}, 
          "Sponsored by:"
        ), 
        React.createElement("div", {className: "sponsor-content"}, 
          React.createElement("span", {className: "sponsor-image"}), 
          React.createElement("span", {className: "sponsor-name"}, 
            "Hilti risk assumption products"
          )
        )
      )
    );
  }
});

module.exports = Sponsor;



},{"react":"react"}],10:[function(require,module,exports){
var store;
var Store;
var dispatcher  = require('./dispatcher');
var Backbone    = require('backbone');

Store = Backbone.Model.extend({
  defaults: {
    view:     null,
    category: null,
    moment:   null
  },
  dispatchHandler: function (payload) {
    switch (payload.type) {
      case 'view':
        this.set('view', payload.view);
        break;
      case 'choose':
        this.set('moment', payload.value);
        break;
      case 'category':
        this.set('category', payload.value);
        break;
    }
  }
});

store = new Store();

store.token = dispatcher.register(store.dispatchHandler.bind(store));

module.exports = store;



},{"./dispatcher":3,"backbone":"backbone"}],11:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var React   = require('react');
var Summary;

Summary = React.createClass({displayName: "Summary",
  render: function () {
    return (
      React.createElement("div", {className: "summary"}, 
        this.props.value
      )
    );
  }
});

module.exports = Summary;



},{"react":"react"}],12:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var React   = require('react');
var TitleBar;

TitleBar = React.createClass({displayName: "TitleBar",
  render: function () {
    return (
      React.createElement("div", {className: "title-bar"}, 
        this.props.children
      )
    );
  }
});

module.exports = TitleBar;



},{"react":"react"}],13:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var React   = require('react');
var TopBar;

TopBar = React.createClass({displayName: "TopBar",
  render: function () {
    return (
      React.createElement("div", {className: "device-bar"}, 
        "SafetyMomentum.com"
      )
    );
  }
});

module.exports = TopBar;



},{"react":"react"}],14:[function(require,module,exports){
/**
 * @jsx React.DOM
 */

var View;
var React         = require('react');
var MainView      = require('./main_view.jsx');
var store         = require('./store');
var list_store    = require('./list_store');

View = React.createClass({displayName: "View",
  getInitialState: function () {
    return {
      async:  false,
      moment: null
    };
  },
  componentDidMount: function () {
    store.on('change:moment', function () {
      this.getMoment();
    }.bind(this));
  },
  componentWillUnmount: function () {
    store.off('change');
  },
  getMoment: function () {
    var choice = store.get('moment');
    var moment = list_store.get(choice);

    if (! moment) {
      moment = list_store.add({id: choice});

      this.setState({async: true});

      return moment.fetch({success: this.chooseMoment.bind(this)});
    }

    this.chooseMoment(moment);
  },
  chooseMoment: function (moment) {
    this.setState({
      async: false,
      moment: moment
    });
  },
  render: function () {
    var props = (this.state.moment && this.state.moment.toJSON()) || {};

    return (
      React.createElement(MainView, React.__spread({},  props))
    );
  }
});

module.exports = View;



},{"./list_store":5,"./main_view.jsx":7,"./store":10,"react":"react"}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHltb21lbnR1bS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvaWNvbi5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHkvZGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9mb290ZXJfYmFyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9saXN0X3N0b3JlLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L2xpc3Rfdmlldy5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHkvbWFpbl92aWV3LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9wcmltYXJ5X2ltYWdlLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zcG9uc29yLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zdG9yZS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zdW1tYXJ5LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS90aXRsZV9iYXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L3RvcF9iYXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L3ZpZXcuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBSSxLQUFLLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU1QyxTQUFTLE1BQU0sRUFBRSxFQUFFLEVBQUU7RUFDbkIsS0FBSyxDQUFDLE1BQU07SUFDVixLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtNQUM1QixRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO0tBQ3RDLENBQUM7SUFDRixRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztHQUM1QixDQUFDO0FBQ0osQ0FBQzs7QUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUV4Qjs7O0FDaEJBOztBQUVBLEdBQUc7O0FBRUgsSUFBSSxJQUFJLENBQUM7QUFDVCxJQUFJLENBQUMsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFD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QUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs7TUFFN0IsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRSxLQUFLOztJQUVELElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDM0I7RUFDRCxZQUFZLEVBQUUsVUFBVSxNQUFNLEVBQUU7SUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQztNQUNaLEtBQUssRUFBRSxLQUFLO01BQ1osTUFBTSxFQUFFLE1BQU07S0FDZixDQUFDLENBQUM7R0FDSjtFQUNELE1BQU0sRUFBRSxZQUFZO0FBQ3RCLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7O0lBRXBFO01BQ0UsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7TUFDekQ7R0FDSDtBQUNILENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUV0QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBNYWluVmlldyA9IHJlcXVpcmUoJy4vc2FmZXR5L3ZpZXcuanN4Jyk7XG5cbmZ1bmN0aW9uIHJlbmRlciAoaWQpIHtcbiAgUmVhY3QucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFpblZpZXcsIHtcbiAgICAgIGtleXdvcmRzOiBbJ2F1dG9tb2JpbGUnLCAna2V5d29yZCAyJ11cbiAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgKTtcbn1cblxucmVuZGVyKCdzYWZldHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVXMXZiV1Z1ZEhWdExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVa3NTMEZCU3l4UFFVRlBMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU5xUXl4SlFVRkpMRkZCUVZFc1IwRkJSeXhQUVVGUExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1EwRkJRenM3UVVGRk5VTXNVMEZCVXl4TlFVRk5MRVZCUVVVc1JVRkJSU3hGUVVGRk8wVkJRMjVDTEV0QlFVc3NRMEZCUXl4TlFVRk5PMGxCUTFZc1MwRkJTeXhEUVVGRExHRkJRV0VzUTBGQlF5eFJRVUZSTEVWQlFVVTdUVUZETlVJc1VVRkJVU3hGUVVGRkxFTkJRVU1zV1VGQldTeEZRVUZGTEZkQlFWY3NRMEZCUXp0TFFVTjBReXhEUVVGRE8wbEJRMFlzVVVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4RlFVRkZMRU5CUVVNN1IwRkROVUlzUTBGQlF6dEJRVU5LTEVOQlFVTTdPMEZCUlVRc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVnFRaXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEUxQlFVMHNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkluWmhjaUJTWldGamRDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRTFoYVc1V2FXVjNJRDBnY21WeGRXbHlaU2duTGk5ellXWmxkSGt2ZG1sbGR5NXFjM2duS1R0Y2JseHVablZ1WTNScGIyNGdjbVZ1WkdWeUlDaHBaQ2tnZTF4dUlDQlNaV0ZqZEM1eVpXNWtaWElvWEc0Z0lDQWdVbVZoWTNRdVkzSmxZWFJsUld4bGJXVnVkQ2hOWVdsdVZtbGxkeXdnZTF4dUlDQWdJQ0FnYTJWNWQyOXlaSE02SUZzbllYVjBiMjF2WW1sc1pTY3NJQ2RyWlhsM2IzSmtJREluWFZ4dUlDQWdJSDBwTEZ4dUlDQWdJR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tHbGtLVnh1SUNBcE8xeHVmVnh1WEc1eVpXNWtaWElvSjNOaFptVjBlU2NwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlISmxibVJsY2p0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBJY29uO1xudmFyIF8gICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGljb24sIGN1cnJlbnRseSB1c2luZyB0aGUgZm9udCBhd2Vzb21lIGljb24gbGlicmFyeVxuICpcbiAqIEBleGFtcGxlc1xuICogPEljb24gdHlwZT1cImNoZWNrXCIgLz5cbiAqIDxJY29uIHR5cGU9XCJ1c2VyXCIgY2xhc3NOYW1lPVwibXV0ZWRcIiAvPlxuICogPEljb24gdHlwZT1cImJhblwiIHN0YWNrPVwiMnhcIiAvPlxuICovXG5JY29uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkljb25cIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RhY2s6ICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICB0eXBlOiAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lOiAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNsYXNzZXMgPSBbJ2ZhIGZhLWljb24nXTtcbiAgICB2YXIgcHJvcHMgICA9IF8ub21pdCh0aGlzLnByb3BzLCBbJ3N0YWNrJywgJ3R5cGUnLCAnY2xhc3NOYW1lJ10pO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuc3RhY2spIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtc3RhY2stJyArIHRoaXMucHJvcHMuc3RhY2spO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnNwaW4pIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtc3BpbicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnR5cGUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtJyArIHRoaXMucHJvcHMudHlwZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc2VzLnB1c2godGhpcy5wcm9wcy5jbGFzc05hbWUpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuc2l6ZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS0nICsgdGhpcy5wcm9wcy5zaXplKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcywge2NsYXNzTmFtZTogY2xhc3Nlcy5qb2luKCcgJyl9KSlcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJY29uO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmFXTnZiaTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEVsQlFVa3NRMEZCUXp0QlFVTlVMRWxCUVVrc1EwRkJReXhQUVVGUExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTnNReXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSVGRDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UjBGRlJ6dEJRVU5JTERCQ1FVRXdRaXh2UWtGQlFUdEZRVU40UWl4VFFVRlRMRVZCUVVVN1NVRkRWQ3hMUVVGTExFOUJRVThzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5PMGxCUTJ4RExFbEJRVWtzVVVGQlVTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhWUVVGVk8wbEJRemRETEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTA3UjBGRGJrTTdSVUZEUkN4TlFVRk5MRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEdWQlFXVXNRMEZCUXp0RlFVTjBReXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETzBGQlEycERMRWxCUVVrc1NVRkJTU3hMUVVGTExFdEJRVXNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMHNSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRE96dEpRVVZxUlN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eEZRVUZGTzAxQlEzQkNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRGJrUXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkRPVUlzUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE5VTXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RlFVRkZPMDFCUTNoQ0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU03UVVGRGVFTXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETlVNc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRWRCUVVVc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4TFFVRkxMRVZCUVVNc1EwRkJReXhEUVVGQkxGTkJRVUVzUlVGQlV5eERRVUZGTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGSExFTkJRVUVzUTBGQlNTeERRVUZCTzAxQlEyaEVPMGRCUTBnN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdTV052Ymp0Y2JuWmhjaUJmSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM1Z1WkdWeWMyTnZjbVVuS1R0Y2JuWmhjaUJTWldGamRDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzVjYmk4cUtseHVJQ29nUTNKbFlYUmxjeUJoYmlCcFkyOXVMQ0JqZFhKeVpXNTBiSGtnZFhOcGJtY2dkR2hsSUdadmJuUWdZWGRsYzI5dFpTQnBZMjl1SUd4cFluSmhjbmxjYmlBcVhHNGdLaUJBWlhoaGJYQnNaWE5jYmlBcUlEeEpZMjl1SUhSNWNHVTlYQ0pqYUdWamExd2lJQzgrWEc0Z0tpQThTV052YmlCMGVYQmxQVndpZFhObGNsd2lJR05zWVhOelRtRnRaVDFjSW0xMWRHVmtYQ0lnTHo1Y2JpQXFJRHhKWTI5dUlIUjVjR1U5WENKaVlXNWNJaUJ6ZEdGamF6MWNJako0WENJZ0x6NWNiaUFxTDF4dVNXTnZiaUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdjM1JoWTJzNklDQWdJQ0FnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbk4wY21sdVp5eGNiaUFnSUNCMGVYQmxPaUFnSUNBZ0lDQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdWMzUnlhVzVuTG1selVtVnhkV2x5WldRc1hHNGdJQ0FnWTJ4aGMzTk9ZVzFsT2lBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG5OMGNtbHVaMXh1SUNCOUxGeHVJQ0J0YVhocGJuTTZJRnRTWldGamRDNWhaR1J2Ym5NdVVIVnlaVkpsYm1SbGNrMXBlR2x1WFN4Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdOc1lYTnpaWE1nUFNCYkoyWmhJR1poTFdsamIyNG5YVHRjYmlBZ0lDQjJZWElnY0hKdmNITWdJQ0E5SUY4dWIyMXBkQ2gwYUdsekxuQnliM0J6TENCYkozTjBZV05ySnl3Z0ozUjVjR1VuTENBblkyeGhjM05PWVcxbEoxMHBPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWMzUmhZMnNwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25abUV0YzNSaFkyc3RKeUFySUhSb2FYTXVjSEp2Y0hNdWMzUmhZMnNwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxuTndhVzRwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25abUV0YzNCcGJpY3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG5SNWNHVXBJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnblptRXRKeUFySUhSb2FYTXVjSEp2Y0hNdWRIbHdaU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdVkyeGhjM05PWVcxbEtTQjdYRzRnSUNBZ0lDQmpiR0Z6YzJWekxuQjFjMmdvZEdocGN5NXdjbTl3Y3k1amJHRnpjMDVoYldVcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVjMmw2WlNrZ2UxeHVJQ0FnSUNBZ1kyeGhjM05sY3k1d2RYTm9LQ2RtWVMwbklDc2dkR2hwY3k1d2NtOXdjeTV6YVhwbEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdrZ2V5NHVMbkJ5YjNCemZTQmpiR0Z6YzA1aGJXVTllMk5zWVhOelpYTXVhbTlwYmlnbklDY3BmVDQ4TDJrK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdTV052Ymp0Y2JpSmRmUT09IiwidmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzlrYVhOd1lYUmphR1Z5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4VlFVRlZMRU5CUVVNN08wRkJSVFZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1NVRkJTU3hWUVVGVkxFVkJRVVVzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCRWFYTndZWFJqYUdWeUlEMGdjbVZ4ZFdseVpTZ25abXgxZUNjcExrUnBjM0JoZEdOb1pYSTdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYm1WM0lFUnBjM0JoZEdOb1pYSW9LVHRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uICAgICAgICA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBkaXNwYXRjaGVyICA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpO1xudmFyIEZvb3RlckJhcjtcblxuRm9vdGVyQmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkZvb3RlckJhclwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZvb3Rlci1iYXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibmF2XCIsIG51bGwsIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5saXN0Vmlld30sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwibGlzdFwifSkpKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge29uQ2xpY2s6IHRoaXMuc2hhcmVWaWV3fSwgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJzZW5kXCJ9KSkpLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5zZWFyY2hWaWV3fSwgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJzZWFyY2hcIn0pKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBsaXN0VmlldzogZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ3ZpZXcnLFxuICAgICAgdmlldzogJ2xpc3QnXG4gICAgfSk7XG4gIH0sXG4gIHNoYXJlVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ3ZpZXcnLFxuICAgICAgdmlldzogJ3NoYXJlJ1xuICAgIH0pO1xuICB9LFxuICBzZWFyY2hWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiAndmlldycsXG4gICAgICB2aWV3OiAnc2VhcmNoJ1xuICAgIH0pO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb290ZXJCYXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOW1iMjkwWlhKZlltRnlMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzUzBGQlN5eFRRVUZUTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOdVF5eEpRVUZKTEVsQlFVa3NWVUZCVlN4UFFVRlBMRU5CUVVNc2QwSkJRWGRDTEVOQlFVTXNRMEZCUXp0QlFVTndSQ3hKUVVGSkxGVkJRVlVzU1VGQlNTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRNVU1zU1VGQlNTeFRRVUZUTEVOQlFVTTdPMEZCUldRc0swSkJRU3RDTEhsQ1FVRkJPMFZCUXpkQ0xFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENPMDFCUTBVc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhaUVVGaExFTkJRVUVzUlVGQlFUdFJRVU14UWl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzU1VGQlF5eEZRVUZCTzFWQlEwZ3NiMEpCUVVFc1NVRkJSeXhGUVVGQkxFbEJRVU1zUlVGQlFUdFpRVU5HTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hKUVVGRExFVkJRVUVzYjBKQlFVRXNSMEZCUlN4RlFVRkJMRU5CUVVFc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeEpRVUZKTEVOQlFVTXNVVUZCVlN4RFFVRkJMRVZCUVVFc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhOUVVGTkxFTkJRVUVzUTBGQlJ5eERRVUZKTEVOQlFVc3NRMEZCUVN4RlFVRkJPMWxCUXpWRUxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4SlFVRkRMRVZCUVVFc2IwSkJRVUVzUjBGQlJTeEZRVUZCTEVOQlFVRXNRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJSU3hKUVVGSkxFTkJRVU1zVTBGQlZ5eERRVUZCTEVWQlFVRXNiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVFc1EwRkJSeXhEUVVGSkxFTkJRVXNzUTBGQlFTeEZRVUZCTzFsQlF6ZEVMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeEpRVUZETEVWQlFVRXNiMEpCUVVFc1IwRkJSU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1ZVRkJXU3hEUVVGQkxFVkJRVUVzYjBKQlFVTXNTVUZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVRXNRMEZCUnl4RFFVRkpMRU5CUVVzc1EwRkJRVHRWUVVNM1JDeERRVUZCTzFGQlEwUXNRMEZCUVR0TlFVTkdMRU5CUVVFN1RVRkRUanRIUVVOSU8wVkJRMFFzVVVGQlVTeEZRVUZGTEZsQlFWazdTVUZEY0VJc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF6dE5RVU5zUWl4SlFVRkpMRVZCUVVVc1RVRkJUVHROUVVOYUxFbEJRVWtzUlVGQlJTeE5RVUZOTzB0QlEySXNRMEZCUXl4RFFVRkRPMGRCUTBvN1JVRkRSQ3hUUVVGVExFVkJRVVVzV1VGQldUdEpRVU55UWl4VlFVRlZMRU5CUVVNc1VVRkJVU3hEUVVGRE8wMUJRMnhDTEVsQlFVa3NSVUZCUlN4TlFVRk5PMDFCUTFvc1NVRkJTU3hGUVVGRkxFOUJRVTg3UzBGRFpDeERRVUZETEVOQlFVTTdSMEZEU2p0RlFVTkVMRlZCUVZVc1JVRkJSU3haUVVGWk8wbEJRM1JDTEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNN1RVRkRiRUlzU1VGQlNTeEZRVUZGTEUxQlFVMDdUVUZEV2l4SlFVRkpMRVZCUVVVc1VVRkJVVHRMUVVObUxFTkJRVU1zUTBGQlF6dEhRVU5LTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4VFFVRlRMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGSmxZV04wSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkpZMjl1SUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUwyTnZiWEJ2Ym1WdWRITXZhV052Ymk1cWMzZ25LVHRjYm5aaGNpQmthWE53WVhSamFHVnlJQ0E5SUhKbGNYVnBjbVVvSnk0dlpHbHpjR0YwWTJobGNpY3BPMXh1ZG1GeUlFWnZiM1JsY2tKaGNqdGNibHh1Um05dmRHVnlRbUZ5SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSm1iMjkwWlhJdFltRnlYQ0krWEc0Z0lDQWdJQ0FnSUR4dVlYWStYRzRnSUNBZ0lDQWdJQ0FnUEhWc1BseHVJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBqeGhJRzl1UTJ4cFkyczllM1JvYVhNdWJHbHpkRlpwWlhkOVBqeEpZMjl1SUhSNWNHVTlYQ0pzYVhOMFhDSWdMejQ4TDJFK1BDOXNhVDVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeHNhVDQ4WVNCdmJrTnNhV05yUFh0MGFHbHpMbk5vWVhKbFZtbGxkMzArUEVsamIyNGdkSGx3WlQxY0luTmxibVJjSWlBdlBqd3ZZVDQ4TDJ4cFBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBqeGhJRzl1UTJ4cFkyczllM1JvYVhNdWMyVmhjbU5vVm1sbGQzMCtQRWxqYjI0Z2RIbHdaVDFjSW5ObFlYSmphRndpSUM4K1BDOWhQand2YkdrK1hHNGdJQ0FnSUNBZ0lDQWdQQzkxYkQ1Y2JpQWdJQ0FnSUNBZ1BDOXVZWFkrWEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQnNhWE4wVm1sbGR6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJR1JwYzNCaGRHTm9aWEl1WkdsemNHRjBZMmdvZTF4dUlDQWdJQ0FnZEhsd1pUb2dKM1pwWlhjbkxGeHVJQ0FnSUNBZ2RtbGxkem9nSjJ4cGMzUW5YRzRnSUNBZ2ZTazdYRzRnSUgwc1hHNGdJSE5vWVhKbFZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUdScGMzQmhkR05vWlhJdVpHbHpjR0YwWTJnb2UxeHVJQ0FnSUNBZ2RIbHdaVG9nSjNacFpYY25MRnh1SUNBZ0lDQWdkbWxsZHpvZ0ozTm9ZWEpsSjF4dUlDQWdJSDBwTzF4dUlDQjlMRnh1SUNCelpXRnlZMmhXYVdWM09pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdaR2x6Y0dGMFkyaGxjaTVrYVhOd1lYUmphQ2g3WEc0Z0lDQWdJQ0IwZVhCbE9pQW5kbWxsZHljc1hHNGdJQ0FnSUNCMmFXVjNPaUFuYzJWaGNtTm9KMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCR2IyOTBaWEpDWVhJN1hHNGlYWDA9IiwidmFyIHN0b3JlO1xudmFyIFN0b3JlO1xudmFyIGRpc3BhdGNoZXIgID0gcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyk7XG52YXIgQmFja2JvbmUgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5cblN0b3JlID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICB1cmw6ICcvYXBpL21vbWVudHMvJyxcbiAgZGlzcGF0Y2hIYW5kbGVyOiBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgIGNvbnNvbGUubG9nKHBheWxvYWQpO1xuICB9XG59KTtcblxuY29uc29sZS5sb2coU3RvcmUucHJvdG90eXBlLnVybCk7XG5zdG9yZSA9IG5ldyBTdG9yZSgvKltcbiAge2NyZWF0ZWQ6IG5ldyBEYXRlKCksIHRpdGxlOiAnT25lJywga2V5d29yZHM6IFsnYXV0b21vYmlsZSddLCBpZDogMjN9LFxuICB7Y3JlYXRlZDogbmV3IERhdGUoKSwgdGl0bGU6ICdUd28nLCBrZXl3b3JkczogWydhdXRvbW9iaWxlJ10sIGlkOiAzM31cbl0qLyk7XG5cbnN0b3JlLmZldGNoKCk7XG5cbnN0b3JlLnRva2VuID0gZGlzcGF0Y2hlci5yZWdpc3RlcihzdG9yZS5kaXNwYXRjaEhhbmRsZXIuYmluZChzdG9yZSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzlzYVhOMFgzTjBiM0psTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVrc1MwRkJTeXhEUVVGRE8wRkJRMVlzU1VGQlNTeExRVUZMTEVOQlFVTTdRVUZEVml4SlFVRkpMRlZCUVZVc1NVRkJTU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZETVVNc1NVRkJTU3hSUVVGUkxFMUJRVTBzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUTNSRE96dEJRVVZCTEV0QlFVc3NSMEZCUnl4UlFVRlJMRU5CUVVNc1ZVRkJWU3hEUVVGRExFMUJRVTBzUTBGQlF6dEZRVU5xUXl4SFFVRkhMRVZCUVVVc1pVRkJaVHRGUVVOd1FpeGxRVUZsTEVWQlFVVXNWVUZCVlN4UFFVRlBMRVZCUVVVN1NVRkRiRU1zVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRIUVVOMFFqdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFOUJRVThzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU5xUXl4TFFVRkxMRWRCUVVjc1NVRkJTU3hMUVVGTE8wRkJRMnBDT3p0QlFVVkJMRWxCUVVrc1EwRkJRenM3UVVGRlRDeExRVUZMTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN08wRkJSV1FzUzBGQlN5eERRVUZETEV0QlFVc3NSMEZCUnl4VlFVRlZMRU5CUVVNc1VVRkJVU3hEUVVGRExFdEJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYSkZMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJSE4wYjNKbE8xeHVkbUZ5SUZOMGIzSmxPMXh1ZG1GeUlHUnBjM0JoZEdOb1pYSWdJRDBnY21WeGRXbHlaU2duTGk5a2FYTndZWFJqYUdWeUp5azdYRzUyWVhJZ1FtRmphMkp2Ym1VZ0lDQWdQU0J5WlhGMWFYSmxLQ2RpWVdOclltOXVaU2NwTzF4dVhHNWNibE4wYjNKbElEMGdRbUZqYTJKdmJtVXVRMjlzYkdWamRHbHZiaTVsZUhSbGJtUW9lMXh1SUNCMWNtdzZJQ2N2WVhCcEwyMXZiV1Z1ZEhNdkp5eGNiaUFnWkdsemNHRjBZMmhJWVc1a2JHVnlPaUJtZFc1amRHbHZiaUFvY0dGNWJHOWhaQ2tnZTF4dUlDQWdJR052Ym5OdmJHVXViRzluS0hCaGVXeHZZV1FwTzF4dUlDQjlYRzU5S1R0Y2JseHVZMjl1YzI5c1pTNXNiMmNvVTNSdmNtVXVjSEp2ZEc5MGVYQmxMblZ5YkNrN1hHNXpkRzl5WlNBOUlHNWxkeUJUZEc5eVpTZ3ZLbHRjYmlBZ2UyTnlaV0YwWldRNklHNWxkeUJFWVhSbEtDa3NJSFJwZEd4bE9pQW5UMjVsSnl3Z2EyVjVkMjl5WkhNNklGc25ZWFYwYjIxdlltbHNaU2RkTENCcFpEb2dNak45TEZ4dUlDQjdZM0psWVhSbFpEb2dibVYzSUVSaGRHVW9LU3dnZEdsMGJHVTZJQ2RVZDI4bkxDQnJaWGwzYjNKa2N6b2dXeWRoZFhSdmJXOWlhV3hsSjEwc0lHbGtPaUF6TTMxY2JsMHFMeWs3WEc1Y2JuTjBiM0psTG1abGRHTm9LQ2s3WEc1Y2JuTjBiM0psTG5SdmEyVnVJRDBnWkdsemNHRjBZMmhsY2k1eVpXZHBjM1JsY2loemRHOXlaUzVrYVhOd1lYUmphRWhoYm1Sc1pYSXVZbWx1WkNoemRHOXlaU2twTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlITjBiM0psTzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIF8gICAgICAgICAgICAgPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgVGl0bGVCYXIgICAgICA9IHJlcXVpcmUoJy4vdGl0bGVfYmFyLmpzeCcpO1xudmFyIEljb24gICAgICAgICAgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL2ljb24uanN4Jyk7XG52YXIgZGlzcGF0Y2hlciAgICA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpO1xudmFyIHN0b3JlICAgICAgICAgPSByZXF1aXJlKCcuL3N0b3JlJyk7XG52YXIgbGlzdF9zdG9yZSAgICA9IHJlcXVpcmUoJy4vbGlzdF9zdG9yZScpO1xudmFyIG1haW5fc3RvcmUgICAgPSByZXF1aXJlKCcuL3N0b3JlJyk7XG52YXIgUHJpbWFyeUltYWdlICA9IHJlcXVpcmUoJy4vcHJpbWFyeV9pbWFnZS5qc3gnKTtcbnZhciBtb21lbnRqcyAgICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XG52YXIgTGlzdFZpZXc7XG5cbkxpc3RWaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkxpc3RWaWV3XCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcmVfY29udHJvbHMgID0gW107XG4gICAgdmFyIG1vbWVudHMgICAgICAgPSB0aGlzLmJ1aWxkTW9tZW50cygpO1xuXG4gICAgcHJlX2NvbnRyb2xzLnB1c2goXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2tleTogXCJjYXRlZ29yeVwiLCBjbGFzc05hbWU6IFwidG9wLWNvbnRyb2xcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcImJ1dHRvblwiLCBvbkNsaWNrOiB0aGlzLmNhdGVnb3J5Vmlld30sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwibGlzdFwifSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cbiAgICBpZiAoISB0aGlzLnByb3BzLnNlYXJjaCkge1xuICAgICAgcHJlX2NvbnRyb2xzLnB1c2goXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiBcInNlYXJjaFwiLCBjbGFzc05hbWU6IFwidG9wLWNvbnRyb2xcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwiYnV0dG9uXCIsIG9uQ2xpY2s6IHRoaXMuc2VhcmNoVmlld30sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJzZWFyY2hcIn0pXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibGlzdC12aWV3XCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaXRsZUJhciwgbnVsbCwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcIm5hdlwiLCB7Y2xhc3NOYW1lOiBcInRvcC1uYXZcIn0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIG51bGwsIFxuICAgICAgICAgICAgICBwcmVfY29udHJvbHMubWFwKGZ1bmN0aW9uIChjb250cm9sKSB7cmV0dXJuIGNvbnRyb2w7fSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFwiU2FmZXR5IE1vbWVudHNcIiwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJidXR0b24gY2xvc2UtYnV0dG9uXCIsIG9uQ2xpY2s6IHRoaXMuY2xvc2VWaWV3fSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcImNsb3NlXCJ9KVxuICAgICAgICAgIClcbiAgICAgICAgKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJsaXN0LW9mLW1vbWVudHNcIn0sIFxuICAgICAgICAgIG1vbWVudHNcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIHNlYXJjaFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNhdGVnb3J5VmlldygpO1xuICB9LFxuICBjYXRlZ29yeVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICd2aWV3JyxcbiAgICAgIHZpZXc6ICdjYXRlZ29yeSdcbiAgICB9KTtcbiAgfSxcbiAgYnVpbGRNb21lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vbWVudHM7XG4gICAgdmFyIGVsZW1lbnRzO1xuICAgIHZhciBjYXRlZ29yeSA9IHN0b3JlLmdldCgnY2F0ZWdvcnknKTtcblxuICAgIG1vbWVudHMgPSBsaXN0X3N0b3JlLmZpbHRlcihmdW5jdGlvbiAobW9tZW50KSB7XG4gICAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5nZXQoJ2tleXdvcmRzJykuaW5kZXhPZihjYXRlZ29yeSkgPiAtMTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICBlbGVtZW50cyA9IF8ubWFwKG1vbWVudHMsIGZ1bmN0aW9uIChtb21lbnQsIGluZGV4KSB7XG4gICAgICB2YXIgZGF0ZSA9IG1vbWVudGpzKG1vbWVudC5nZXQoJ2NyZWF0ZWQnKSk7XG4gICAgICB2YXIgaW1hZ2VQcm9wcyA9IHtcbiAgICAgICAgaW1hZ2U6ICAgIG1vbWVudC5nZXQoJ2ltYWdlJyksXG4gICAgICAgIGtleXdvcmRzOiBtb21lbnQuZ2V0KCdrZXl3b3JkcycpXG4gICAgICB9O1xuXG4gICAgICBkYXRlID0gZGF0ZS5mb3JtYXQoJ01NTSBNLCBZWVlZJyk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiBpbmRleCwgY2xhc3NOYW1lOiBcIm1vbWVudFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge29uQ2xpY2s6IHRoaXMuc2VsZWN0TW9tZW50LmJpbmQodGhpcywgbW9tZW50LmlkKX0sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRodW1iXCJ9LCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQcmltYXJ5SW1hZ2UsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgaW1hZ2VQcm9wcykpXG4gICAgICAgICAgICApLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aXRsZVwifSwgXG4gICAgICAgICAgICAgIG1vbWVudC5nZXQoJ3RpdGxlJylcbiAgICAgICAgICAgICksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm11dGVkIHNtYWxsXCJ9LCBcbiAgICAgICAgICAgICAgZGF0ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIGlmIChlbGVtZW50cy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIG51bGwsIGVsZW1lbnRzKVxuICAgICk7XG4gIH0sXG4gIHNlbGVjdE1vbWVudDogZnVuY3Rpb24gKGlkKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiAgICdjaG9vc2UnLFxuICAgICAgdmFsdWU6ICBpZFxuICAgIH0pO1xuXG4gICAgdGhpcy5jbG9zZVZpZXcoKTtcbiAgfSxcbiAgY2xvc2VWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiAndmlldycsXG4gICAgICB2aWV3OiBudWxsXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RWaWV3O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzlzYVhOMFgzWnBaWGN1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4TFFVRkxMRmRCUVZjc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzSkRMRWxCUVVrc1EwRkJReXhsUVVGbExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTXhReXhKUVVGSkxGRkJRVkVzVVVGQlVTeFBRVUZQTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEJRVU12UXl4SlFVRkpMRWxCUVVrc1dVRkJXU3hQUVVGUExFTkJRVU1zZDBKQlFYZENMRU5CUVVNc1EwRkJRenRCUVVOMFJDeEpRVUZKTEZWQlFWVXNUVUZCVFN4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03UVVGRE5VTXNTVUZCU1N4TFFVRkxMRmRCUVZjc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBGQlEzWkRMRWxCUVVrc1ZVRkJWU3hOUVVGTkxFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhKUVVGSkxGVkJRVlVzVFVGQlRTeFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkRka01zU1VGQlNTeFpRVUZaTEVsQlFVa3NUMEZCVHl4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVOQlFVTTdRVUZEYmtRc1NVRkJTU3hSUVVGUkxGRkJRVkVzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTNSRExFbEJRVWtzVVVGQlVTeERRVUZET3p0QlFVVmlMRGhDUVVFNFFpeDNRa0ZCUVR0RlFVTTFRaXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWl4SlFVRkpMRmxCUVZrc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRE0wSXNTVUZCU1N4SlFVRkpMRTlCUVU4c1UwRkJVeXhKUVVGSkxFTkJRVU1zV1VGQldTeEZRVUZGTEVOQlFVTTdPMGxCUlhoRExGbEJRVmtzUTBGQlF5eEpRVUZKTzAxQlEyWXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFTkJRVUVzUTBGQlF5eEhRVUZCTEVWQlFVY3NRMEZCUXl4VlFVRkJMRVZCUVZVc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGhRVUZqTEVOQlFVRXNSVUZCUVR0UlFVTjZReXh2UWtGQlFTeEhRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGRkJRVUVzUlVGQlVTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWxCUVVrc1EwRkJReXhaUVVGakxFTkJRVUVzUlVGQlFUdFZRVU5vUkN4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRU3hEUVVGSExFTkJRVUU3VVVGRGJFSXNRMEZCUVR0TlFVTkVMRU5CUVVFN1FVRkRXQ3hMUVVGTExFTkJRVU03TzBsQlJVWXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeEZRVUZGTzAxQlEzWkNMRmxCUVZrc1EwRkJReXhKUVVGSk8xRkJRMllzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhIUVVGQkxFVkJRVWNzUTBGQlF5eFJRVUZCTEVWQlFWRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhoUVVGakxFTkJRVUVzUlVGQlFUdFZRVU4yUXl4dlFrRkJRU3hIUVVGRkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEVsQlFVa3NRMEZCUXl4VlFVRlpMRU5CUVVFc1JVRkJRVHRaUVVNNVF5eHZRa0ZCUXl4SlFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEZGQlFWRXNRMEZCUVN4RFFVRkhMRU5CUVVFN1ZVRkRjRUlzUTBGQlFUdFJRVU5FTEVOQlFVRTdUMEZEVGl4RFFVRkRPMEZCUTFJc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNWMEZCV1N4RFFVRkJMRVZCUVVFN1VVRkRla0lzYjBKQlFVTXNVVUZCVVN4RlFVRkJMRWxCUVVNc1JVRkJRVHRWUVVOU0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVTBGQlZTeERRVUZCTEVWQlFVRTdXVUZEZGtJc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUVR0alFVTkVMRmxCUVZrc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeFBRVUZQTEVWQlFVVXNRMEZCUXl4UFFVRlBMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVVU3V1VGRGNrUXNRMEZCUVR0VlFVTkVMRU5CUVVFc1JVRkJRVHRCUVVGQk8wRkJRVUVzVlVGQlFTeG5Ra0ZCUVN4RlFVRkJPMEZCUVVFc1ZVRkhUaXh2UWtGQlFTeEhRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExIRkNRVUZCTEVWQlFYRkNMRU5CUVVNc1QwRkJRU3hGUVVGUExFTkJRVVVzU1VGQlNTeERRVUZETEZOQlFWY3NRMEZCUVN4RlFVRkJPMWxCUXpGRUxHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZCTEVOQlFVY3NRMEZCUVR0VlFVTnVRaXhEUVVGQk8xRkJRMHNzUTBGQlFTeEZRVUZCTzFGQlExZ3NiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4cFFrRkJhMElzUTBGQlFTeEZRVUZCTzFWQlF6bENMRTlCUVZFN1VVRkRUQ3hEUVVGQk8wMUJRMFlzUTBGQlFUdE5RVU5PTzBkQlEwZzdSVUZEUkN4VlFVRlZMRVZCUVVVc1dVRkJXVHRKUVVOMFFpeEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkZMRU5CUVVNN1IwRkRja0k3UlVGRFJDeFpRVUZaTEVWQlFVVXNXVUZCV1R0SlFVTjRRaXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETzAxQlEyeENMRWxCUVVrc1JVRkJSU3hOUVVGTk8wMUJRMW9zU1VGQlNTeEZRVUZGTEZWQlFWVTdTMEZEYWtJc1EwRkJReXhEUVVGRE8wZEJRMG83UlVGRFJDeFpRVUZaTEVWQlFVVXNXVUZCV1R0SlFVTjRRaXhKUVVGSkxFOUJRVThzUTBGQlF6dEpRVU5hTEVsQlFVa3NVVUZCVVN4RFFVRkRPMEZCUTJwQ0xFbEJRVWtzU1VGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdTVUZGY2tNc1QwRkJUeXhIUVVGSExGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTXNWVUZCVlN4TlFVRk5MRVZCUVVVN1RVRkROVU1zU1VGQlNTeFJRVUZSTEVWQlFVVTdVVUZEV2l4UFFVRlBMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlF6ZEVMRTlCUVU4N08wMUJSVVFzVDBGQlR5eEpRVUZKTEVOQlFVTTdRVUZEYkVJc1MwRkJTeXhEUVVGRExFTkJRVU03TzBsQlJVZ3NVVUZCVVN4SFFVRkhMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eEZRVUZGTEZWQlFWVXNUVUZCVFN4RlFVRkZMRXRCUVVzc1JVRkJSVHROUVVOcVJDeEpRVUZKTEVsQlFVa3NSMEZCUnl4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRPMDFCUXpORExFbEJRVWtzVlVGQlZTeEhRVUZITzFGQlEyWXNTMEZCU3l4TFFVRkxMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETzFGQlF6ZENMRkZCUVZFc1JVRkJSU3hOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNRMEZCUXp0QlFVTjRReXhQUVVGUExFTkJRVU03TzBGQlJWSXNUVUZCVFN4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXpzN1RVRkZiRU03VVVGRFJTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1EwRkJRU3hEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZGTEV0QlFVc3NSVUZCUXl4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGRkJRVk1zUTBGQlFTeEZRVUZCTzFWQlEycERMRzlDUVVGQkxFZEJRVVVzUlVGQlFTeERRVUZCTEVOQlFVTXNUMEZCUVN4RlFVRlBMRU5CUVVVc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRTFCUVUwc1EwRkJReXhGUVVGRkxFTkJRVWNzUTBGQlFTeEZRVUZCTzFsQlEyNUVMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1QwRkJVU3hEUVVGQkxFVkJRVUU3WTBGRGNrSXNiMEpCUVVNc1dVRkJXU3hGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRlZCUVZjc1EwRkJRU3hEUVVGSExFTkJRVUU3V1VGRE5VSXNRMEZCUVN4RlFVRkJPMWxCUTA0c2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhQUVVGUkxFTkJRVUVzUlVGQlFUdGpRVU53UWl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlJUdFpRVU5xUWl4RFFVRkJMRVZCUVVFN1dVRkRUaXh2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHRkJRV01zUTBGQlFTeEZRVUZCTzJOQlF6RkNMRWxCUVVzN1dVRkRSaXhEUVVGQk8xVkJRMG9zUTBGQlFUdFJRVU5FTEVOQlFVRTdVVUZEVER0QlFVTlNMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdTVUZGVkN4SlFVRkpMRkZCUVZFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzAxQlEzWkNMRTlCUVU4c1NVRkJTU3hEUVVGRE8wRkJRMnhDTEV0QlFVczdPMGxCUlVRN1RVRkRSU3h2UWtGQlFTeEpRVUZITEVWQlFVRXNTVUZCUXl4RlFVRkRMRkZCUVdNc1EwRkJRVHROUVVOdVFqdEhRVU5JTzBWQlEwUXNXVUZCV1N4RlFVRkZMRlZCUVZVc1JVRkJSU3hGUVVGRk8wbEJRekZDTEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNN1RVRkRiRUlzU1VGQlNTeEpRVUZKTEZGQlFWRTdUVUZEYUVJc1MwRkJTeXhIUVVGSExFVkJRVVU3UVVGRGFFSXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wbEJSVWdzU1VGQlNTeERRVUZETEZOQlFWTXNSVUZCUlN4RFFVRkRPMGRCUTJ4Q08wVkJRMFFzVTBGQlV5eEZRVUZGTEZsQlFWazdTVUZEY2tJc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF6dE5RVU5zUWl4SlFVRkpMRVZCUVVVc1RVRkJUVHROUVVOYUxFbEJRVWtzUlVGQlJTeEpRVUZKTzB0QlExZ3NRMEZCUXl4RFFVRkRPMGRCUTBvN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGRkJRVkVzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdVbVZoWTNRZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNTJZWElnWHlBZ0lDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM1Z1WkdWeWMyTnZjbVVuS1R0Y2JuWmhjaUJVYVhSc1pVSmhjaUFnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTkwYVhSc1pWOWlZWEl1YW5ONEp5azdYRzUyWVhJZ1NXTnZiaUFnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUwyTnZiWEJ2Ym1WdWRITXZhV052Ymk1cWMzZ25LVHRjYm5aaGNpQmthWE53WVhSamFHVnlJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOWthWE53WVhSamFHVnlKeWs3WEc1MllYSWdjM1J2Y21VZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZjM1J2Y21VbktUdGNiblpoY2lCc2FYTjBYM04wYjNKbElDQWdJRDBnY21WeGRXbHlaU2duTGk5c2FYTjBYM04wYjNKbEp5azdYRzUyWVhJZ2JXRnBibDl6ZEc5eVpTQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmMzUnZjbVVuS1R0Y2JuWmhjaUJRY21sdFlYSjVTVzFoWjJVZ0lEMGdjbVZ4ZFdseVpTZ25MaTl3Y21sdFlYSjVYMmx0WVdkbExtcHplQ2NwTzF4dWRtRnlJRzF2YldWdWRHcHpJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHRiMjFsYm5RbktUdGNiblpoY2lCTWFYTjBWbWxsZHp0Y2JseHVUR2x6ZEZacFpYY2dQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJ3Y21WZlkyOXVkSEp2YkhNZ0lEMGdXMTA3WEc0Z0lDQWdkbUZ5SUcxdmJXVnVkSE1nSUNBZ0lDQWdQU0IwYUdsekxtSjFhV3hrVFc5dFpXNTBjeWdwTzF4dVhHNGdJQ0FnY0hKbFgyTnZiblJ5YjJ4ekxuQjFjMmdvWEc0Z0lDQWdJQ0E4YkdrZ2EyVjVQVndpWTJGMFpXZHZjbmxjSWlCamJHRnpjMDVoYldVOVhDSjBiM0F0WTI5dWRISnZiRndpUGx4dUlDQWdJQ0FnSUNBOFlTQmpiR0Z6YzA1aGJXVTlYQ0ppZFhSMGIyNWNJaUJ2YmtOc2FXTnJQWHQwYUdsekxtTmhkR1ZuYjNKNVZtbGxkMzArWEc0Z0lDQWdJQ0FnSUNBZ1BFbGpiMjRnZEhsd1pUMWNJbXhwYzNSY0lpQXZQbHh1SUNBZ0lDQWdJQ0E4TDJFK1hHNGdJQ0FnSUNBOEwyeHBQbHh1SUNBZ0lDazdYRzVjYmlBZ0lDQnBaaUFvSVNCMGFHbHpMbkJ5YjNCekxuTmxZWEpqYUNrZ2UxeHVJQ0FnSUNBZ2NISmxYMk52Ym5SeWIyeHpMbkIxYzJnb1hHNGdJQ0FnSUNBZ0lEeHNhU0JyWlhrOVhDSnpaV0Z5WTJoY0lpQmpiR0Z6YzA1aGJXVTlYQ0owYjNBdFkyOXVkSEp2YkZ3aVBseHVJQ0FnSUNBZ0lDQWdJRHhoSUdOc1lYTnpUbUZ0WlQxY0ltSjFkSFJ2Ymx3aUlHOXVRMnhwWTJzOWUzUm9hWE11YzJWaGNtTm9WbWxsZDMwK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4U1dOdmJpQjBlWEJsUFZ3aWMyVmhjbU5vWENJZ0x6NWNiaUFnSUNBZ0lDQWdJQ0E4TDJFK1hHNGdJQ0FnSUNBZ0lEd3ZiR2srWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0lteHBjM1F0ZG1sbGQxd2lQbHh1SUNBZ0lDQWdJQ0E4VkdsMGJHVkNZWEkrWEc0Z0lDQWdJQ0FnSUNBZ1BHNWhkaUJqYkdGemMwNWhiV1U5WENKMGIzQXRibUYyWENJK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4ZFd3K1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUh0d2NtVmZZMjl1ZEhKdmJITXViV0Z3S0daMWJtTjBhVzl1SUNoamIyNTBjbTlzS1NCN2NtVjBkWEp1SUdOdmJuUnliMnc3ZlNsOVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDNWc1BseHVJQ0FnSUNBZ0lDQWdJRHd2Ym1GMlBseHVYRzRnSUNBZ0lDQWdJQ0FnVTJGbVpYUjVJRTF2YldWdWRITmNiaUFnSUNBZ0lDQWdJQ0E4WVNCamJHRnpjMDVoYldVOVhDSmlkWFIwYjI0Z1kyeHZjMlV0WW5WMGRHOXVYQ0lnYjI1RGJHbGphejE3ZEdocGN5NWpiRzl6WlZacFpYZDlQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BFbGpiMjRnZEhsd1pUMWNJbU5zYjNObFhDSWdMejVjYmlBZ0lDQWdJQ0FnSUNBOEwyRStYRzRnSUNBZ0lDQWdJRHd2VkdsMGJHVkNZWEkrWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYkdsemRDMXZaaTF0YjIxbGJuUnpYQ0krWEc0Z0lDQWdJQ0FnSUNBZ2UyMXZiV1Z1ZEhOOVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlN4Y2JpQWdjMlZoY21Ob1ZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVZMkYwWldkdmNubFdhV1YzS0NrN1hHNGdJSDBzWEc0Z0lHTmhkR1ZuYjNKNVZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUdScGMzQmhkR05vWlhJdVpHbHpjR0YwWTJnb2UxeHVJQ0FnSUNBZ2RIbHdaVG9nSjNacFpYY25MRnh1SUNBZ0lDQWdkbWxsZHpvZ0oyTmhkR1ZuYjNKNUoxeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dUlDQmlkV2xzWkUxdmJXVnVkSE02SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdiVzl0Wlc1MGN6dGNiaUFnSUNCMllYSWdaV3hsYldWdWRITTdYRzRnSUNBZ2RtRnlJR05oZEdWbmIzSjVJRDBnYzNSdmNtVXVaMlYwS0NkallYUmxaMjl5ZVNjcE8xeHVYRzRnSUNBZ2JXOXRaVzUwY3lBOUlHeHBjM1JmYzNSdmNtVXVabWxzZEdWeUtHWjFibU4wYVc5dUlDaHRiMjFsYm5RcElIdGNiaUFnSUNBZ0lHbG1JQ2hqWVhSbFoyOXllU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYlc5dFpXNTBMbWRsZENnbmEyVjVkMjl5WkhNbktTNXBibVJsZUU5bUtHTmhkR1ZuYjNKNUtTQStJQzB4TzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpUdGNiaUFnSUNCOUtUdGNibHh1SUNBZ0lHVnNaVzFsYm5SeklEMGdYeTV0WVhBb2JXOXRaVzUwY3l3Z1puVnVZM1JwYjI0Z0tHMXZiV1Z1ZEN3Z2FXNWtaWGdwSUh0Y2JpQWdJQ0FnSUhaaGNpQmtZWFJsSUQwZ2JXOXRaVzUwYW5Nb2JXOXRaVzUwTG1kbGRDZ25ZM0psWVhSbFpDY3BLVHRjYmlBZ0lDQWdJSFpoY2lCcGJXRm5aVkJ5YjNCeklEMGdlMXh1SUNBZ0lDQWdJQ0JwYldGblpUb2dJQ0FnYlc5dFpXNTBMbWRsZENnbmFXMWhaMlVuS1N4Y2JpQWdJQ0FnSUNBZ2EyVjVkMjl5WkhNNklHMXZiV1Z1ZEM1blpYUW9KMnRsZVhkdmNtUnpKeWxjYmlBZ0lDQWdJSDA3WEc1Y2JpQWdJQ0FnSUdSaGRHVWdQU0JrWVhSbExtWnZjbTFoZENnblRVMU5JRTBzSUZsWldWa25LVHRjYmx4dUlDQWdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJQ0FnUEd4cElHdGxlVDE3YVc1a1pYaDlJR05zWVhOelRtRnRaVDFjSW0xdmJXVnVkRndpUGx4dUlDQWdJQ0FnSUNBZ0lEeGhJRzl1UTJ4cFkyczllM1JvYVhNdWMyVnNaV04wVFc5dFpXNTBMbUpwYm1Rb2RHaHBjeXdnYlc5dFpXNTBMbWxrS1gwK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJblJvZFcxaVhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeFFjbWx0WVhKNVNXMWhaMlVnZXk0dUxtbHRZV2RsVUhKdmNITjlJQzgrWEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lkR2wwYkdWY0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2UyMXZiV1Z1ZEM1blpYUW9KM1JwZEd4bEp5bDlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWJYVjBaV1FnYzIxaGJHeGNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdlMlJoZEdWOVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDQWdJQ0E4TDJFK1hHNGdJQ0FnSUNBZ0lEd3ZiR2srWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDBzSUhSb2FYTXBPMXh1WEc0Z0lDQWdhV1lnS0dWc1pXMWxiblJ6TG14bGJtZDBhQ0E4SURFcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdWRXeHNPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGRXdytlMlZzWlcxbGJuUnpmVHd2ZFd3K1hHNGdJQ0FnS1R0Y2JpQWdmU3hjYmlBZ2MyVnNaV04wVFc5dFpXNTBPaUJtZFc1amRHbHZiaUFvYVdRcElIdGNiaUFnSUNCa2FYTndZWFJqYUdWeUxtUnBjM0JoZEdOb0tIdGNiaUFnSUNBZ0lIUjVjR1U2SUNBZ0oyTm9iMjl6WlNjc1hHNGdJQ0FnSUNCMllXeDFaVG9nSUdsa1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNCMGFHbHpMbU5zYjNObFZtbGxkeWdwTzF4dUlDQjlMRnh1SUNCamJHOXpaVlpwWlhjNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQmthWE53WVhSamFHVnlMbVJwYzNCaGRHTm9LSHRjYmlBZ0lDQWdJSFI1Y0dVNklDZDJhV1YzSnl4Y2JpQWdJQ0FnSUhacFpYYzZJRzUxYkd4Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdUR2x6ZEZacFpYYzdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVmlldztcbnZhciBSZWFjdCAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUb3BCYXIgICAgICAgID0gcmVxdWlyZSgnLi90b3BfYmFyLmpzeCcpO1xudmFyIEZvb3RlckJhciAgICAgPSByZXF1aXJlKCcuL2Zvb3Rlcl9iYXIuanN4Jyk7XG52YXIgU3VtbWFyeSAgICAgICA9IHJlcXVpcmUoJy4vc3VtbWFyeS5qc3gnKTtcbnZhciBTcG9uc29yICAgICAgID0gcmVxdWlyZSgnLi9zcG9uc29yLmpzeCcpO1xudmFyIFRpdGxlQmFyICAgICAgPSByZXF1aXJlKCcuL3RpdGxlX2Jhci5qc3gnKTtcbnZhciBMaXN0VmlldyAgICAgID0gcmVxdWlyZSgnLi9saXN0X3ZpZXcuanN4Jyk7XG52YXIgUHJpbWFyeUltYWdlICA9IHJlcXVpcmUoJy4vcHJpbWFyeV9pbWFnZS5qc3gnKTtcbnZhciBtb21lbnQgICAgICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XG52YXIgc3RvcmUgICAgICAgICA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcblxuVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJWaWV3XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICB2aWV3OiAnbGlzdCcsXG4gICAgICBtb21lbnQ6IG51bGxcbiAgICB9O1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6ICAgICAgICAnU2FmZXR5IE1vbWVudCBUaXRsZScsXG4gICAgICBjcmVhdGVkOiAgICAgIG5ldyBEYXRlKCksXG4gICAgICBzdW1tYXJ5OiAgICAgICdTdW1tYXJ5IHRleHQnLFxuICAgICAgZGV0YWlsOiAgICAgICAnRGV0YWlsIHRleHQnLFxuICAgICAgaGVhZGVyX2ltYWdlOiB1bmRlZmluZWQsXG4gICAgICBrZXl3b3JkczogICAgIFtdXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdG9yZS50b0pTT04oKSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5vZmYoJ2NoYW5nZScpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlldyA9IHRoaXMuYnVpbGRWaWV3KCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRlbnRcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRvcEJhciwgbnVsbCksIFxuXG4gICAgICAgIHZpZXdcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBidWlsZFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZm47XG4gICAgdmFyIG1hcDtcblxuICAgIG1hcCA9IHtcbiAgICAgIHNlYXJjaDogJ2J1aWxkU2VhcmNoVmlldycsXG4gICAgICBzaGFyZTogJ2J1aWxkU2hhcmVWaWV3JyxcbiAgICAgIGxpc3Q6ICdidWlsZExpc3RWaWV3J1xuICAgIH07XG5cbiAgICBmbiA9IG1hcFt0aGlzLnN0YXRlLnZpZXddO1xuICAgIGZuID0gdGhpc1tmbl0gfHwgdGhpcy5idWlsZE1haW5WaWV3O1xuXG4gICAgcmV0dXJuIGZuLmNhbGwodGhpcyk7XG4gIH0sXG4gIGJ1aWxkTGlzdFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXN0Vmlldywge3NlYXJjaDogdHJ1ZX0pXG4gICAgKTtcbiAgfSxcbiAgYnVpbGRNYWluVmlldzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBrZXl3b3JkcyA9IG51bGw7XG4gICAgdmFyIGltYWdlUHJvcHM7XG4gICAgdmFyIGRhdGUgPSBtb21lbnQodGhpcy5wcm9wcy5jcmVhdGVkKTtcblxuICAgIGRhdGUgPSBkYXRlLmZvcm1hdCgnTU1NIE0sIFlZWVknKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmtleXdvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGtleXdvcmRzID0gdGhpcy5wcm9wcy5rZXl3b3Jkcy5qb2luKCcsICcpO1xuICAgIH1cblxuICAgIGltYWdlUHJvcHMgPSB7XG4gICAgICBpbWFnZTogICAgdGhpcy5wcm9wcy5pbWFnZSxcbiAgICAgIGtleXdvcmRzOiB0aGlzLnByb3BzLmtleXdvcmRzXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibWFpbi12aWV3XCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaXRsZUJhciwgbnVsbCwgXG4gICAgICAgICAgdGhpcy5wcm9wcy50aXRsZVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByaW1hcnlJbWFnZSwgUmVhY3QuX19zcHJlYWQoe30sICBpbWFnZVByb3BzKSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtdXRlZCBzbWFsbFwifSwga2V5d29yZHMpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm11dGVkIHNtYWxsXCJ9LCBcIkNyZWF0ZWQgXCIsIGRhdGUpLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFN1bW1hcnksIHt2YWx1ZTogdGhpcy5wcm9wcy5zdW1tYXJ5fSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3BvbnNvciwgbnVsbCksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLCBcIkRldGFpbHM6XCIpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTdW1tYXJ5LCB7dmFsdWU6IHRoaXMucHJvcHMuZGV0YWlsfSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9vdGVyQmFyLCBudWxsKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXRZV2x1WDNacFpYY3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hKUVVGSkxFTkJRVU03UVVGRFZDeEpRVUZKTEV0QlFVc3NWMEZCVnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGNrTXNTVUZCU1N4TlFVRk5MRlZCUVZVc1QwRkJUeXhEUVVGRExHVkJRV1VzUTBGQlF5eERRVUZETzBGQlF6ZERMRWxCUVVrc1UwRkJVeXhQUVVGUExFOUJRVThzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhEUVVGRE8wRkJRMmhFTEVsQlFVa3NUMEZCVHl4VFFVRlRMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVU0zUXl4SlFVRkpMRTlCUVU4c1UwRkJVeXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdRVUZETjBNc1NVRkJTU3hSUVVGUkxGRkJRVkVzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGREwwTXNTVUZCU1N4UlFVRlJMRkZCUVZFc1QwRkJUeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1FVRkRMME1zU1VGQlNTeFpRVUZaTEVsQlFVa3NUMEZCVHl4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVOQlFVTTdRVUZEYmtRc1NVRkJTU3hOUVVGTkxGVkJRVlVzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTNSRExFbEJRVWtzUzBGQlN5eFhRVUZYTEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenM3UVVGRmRrTXNNRUpCUVRCQ0xHOUNRVUZCTzBWQlEzaENMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVODdUVUZEVEN4SlFVRkpMRVZCUVVVc1RVRkJUVHROUVVOYUxFMUJRVTBzUlVGQlJTeEpRVUZKTzB0QlEySXNRMEZCUXp0SFFVTklPMFZCUTBRc1pVRkJaU3hGUVVGRkxGbEJRVms3U1VGRE0wSXNUMEZCVHp0TlFVTk1MRXRCUVVzc1UwRkJVeXh4UWtGQmNVSTdUVUZEYmtNc1QwRkJUeXhQUVVGUExFbEJRVWtzU1VGQlNTeEZRVUZGTzAxQlEzaENMRTlCUVU4c1QwRkJUeXhqUVVGak8wMUJRelZDTEUxQlFVMHNVVUZCVVN4aFFVRmhPMDFCUXpOQ0xGbEJRVmtzUlVGQlJTeFRRVUZUTzAxQlEzWkNMRkZCUVZFc1RVRkJUU3hGUVVGRk8wdEJRMnBDTEVOQlFVTTdSMEZEU0R0RlFVTkVMR2xDUVVGcFFpeEZRVUZGTEZsQlFWazdTVUZETjBJc1MwRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF5eFJRVUZSTEVWQlFVVXNXVUZCV1R0TlFVTTNRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhEUVVGRE8wdEJReTlDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UjBGRFpqdEZRVU5FTEc5Q1FVRnZRaXhGUVVGRkxGbEJRVms3U1VGRGFFTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEhRVU55UWp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wRkJRM1JDTEVsQlFVa3NTVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZET3p0SlFVVTFRanROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVTBGQlZTeERRVUZCTEVWQlFVRTdRVUZETDBJc1VVRkJVU3h2UWtGQlF5eE5RVUZOTEVWQlFVRXNTVUZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHM3VVVGRlZDeEpRVUZMTzAxQlEwWXNRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hUUVVGVExFVkJRVVVzV1VGQldUdEpRVU55UWl4SlFVRkpMRVZCUVVVc1EwRkJRenRCUVVOWUxFbEJRVWtzU1VGQlNTeEhRVUZITEVOQlFVTTdPMGxCUlZJc1IwRkJSeXhIUVVGSE8wMUJRMG9zVFVGQlRTeEZRVUZGTEdsQ1FVRnBRanROUVVONlFpeExRVUZMTEVWQlFVVXNaMEpCUVdkQ08wMUJRM1pDTEVsQlFVa3NSVUZCUlN4bFFVRmxPMEZCUXpOQ0xFdEJRVXNzUTBGQlF6czdTVUZGUml4RlFVRkZMRWRCUVVjc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRPVUlzU1VGQlNTeEZRVUZGTEVkQlFVY3NTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhKUVVGSkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTTdPMGxCUlhCRExFOUJRVThzUlVGQlJTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRIUVVOMFFqdEZRVU5FTEdGQlFXRXNSVUZCUlN4WlFVRlpPMGxCUTNwQ08wMUJRMFVzYjBKQlFVTXNVVUZCVVN4RlFVRkJMRU5CUVVFc1EwRkJReXhOUVVGQkxFVkJRVTBzUTBGQlJTeEpRVUZMTEVOQlFVRXNRMEZCUnl4RFFVRkJPMDFCUXpGQ08wZEJRMGc3UlVGRFJDeGhRVUZoTEVWQlFVVXNXVUZCV1R0SlFVTjZRaXhKUVVGSkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTTdTVUZEY0VJc1NVRkJTU3hWUVVGVkxFTkJRVU03UVVGRGJrSXNTVUZCU1N4SlFVRkpMRWxCUVVrc1IwRkJSeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenM3UVVGRk1VTXNTVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXpzN1NVRkZiRU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzAxQlEyeERMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGFFUXNTMEZCU3pzN1NVRkZSQ3hWUVVGVkxFZEJRVWM3VFVGRFdDeExRVUZMTEV0QlFVc3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTE8wMUJRekZDTEZGQlFWRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkU3UVVGRGJrTXNTMEZCU3l4RFFVRkRPenRKUVVWR08wMUJRMFVzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFhRVUZaTEVOQlFVRXNSVUZCUVR0UlFVTjZRaXh2UWtGQlF5eFJRVUZSTEVWQlFVRXNTVUZCUXl4RlFVRkJPMVZCUTFBc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZOTzBGQlF6VkNMRkZCUVcxQ0xFTkJRVUVzUlVGQlFUczdRVUZGYmtJc1VVRkJVU3h2UWtGQlF5eFpRVUZaTEVWQlFVRXNaMEpCUVVFc1IwRkJRU3hEUVVGRkxFZEJRVWNzVlVGQlZ5eERRVUZCTEVOQlFVY3NRMEZCUVN4RlFVRkJPenRSUVVWb1F5eHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdGQlFXTXNRMEZCUVN4RlFVRkRMRkZCUVdVc1EwRkJRU3hGUVVGQk8wRkJRM0pFTEZGQlFWRXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4aFFVRmpMRU5CUVVFc1JVRkJRU3hWUVVGQkxFVkJRVk1zU1VGQlZ5eERRVUZCTEVWQlFVRTdPMEZCUlhwRUxGRkJRVkVzYjBKQlFVTXNUMEZCVHl4RlFVRkJMRU5CUVVFc1EwRkJReXhMUVVGQkxFVkJRVXNzUTBGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVZFc1EwRkJRU3hEUVVGSExFTkJRVUVzUlVGQlFUczdRVUZGT1VNc1VVRkJVU3h2UWtGQlF5eFBRVUZQTEVWQlFVRXNTVUZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHM3VVVGRldDeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1NVRkJReXhGUVVGQkxGVkJRV0VzUTBGQlFTeEZRVUZCTzBGQlEzcENMRkZCUVZFc2IwSkJRVU1zVDBGQlR5eEZRVUZCTEVOQlFVRXNRMEZCUXl4TFFVRkJMRVZCUVVzc1EwRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVOHNRMEZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHM3VVVGRmNrTXNiMEpCUVVNc1UwRkJVeXhGUVVGQkxFbEJRVUVzUTBGQlJ5eERRVUZCTzAxQlExUXNRMEZCUVR0TlFVTk9PMGRCUTBnN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdWbWxsZHp0Y2JuWmhjaUJTWldGamRDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCVWIzQkNZWElnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5MGIzQmZZbUZ5TG1wemVDY3BPMXh1ZG1GeUlFWnZiM1JsY2tKaGNpQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyWnZiM1JsY2w5aVlYSXVhbk40SnlrN1hHNTJZWElnVTNWdGJXRnllU0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YzNWdGJXRnllUzVxYzNnbktUdGNiblpoY2lCVGNHOXVjMjl5SUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5emNHOXVjMjl5TG1wemVDY3BPMXh1ZG1GeUlGUnBkR3hsUW1GeUlDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwzUnBkR3hsWDJKaGNpNXFjM2duS1R0Y2JuWmhjaUJNYVhOMFZtbGxkeUFnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlzYVhOMFgzWnBaWGN1YW5ONEp5azdYRzUyWVhJZ1VISnBiV0Z5ZVVsdFlXZGxJQ0E5SUhKbGNYVnBjbVVvSnk0dmNISnBiV0Z5ZVY5cGJXRm5aUzVxYzNnbktUdGNiblpoY2lCdGIyMWxiblFnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duYlc5dFpXNTBKeWs3WEc1MllYSWdjM1J2Y21VZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZjM1J2Y21VbktUdGNibHh1Vm1sbGR5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ1oyVjBTVzVwZEdsaGJGTjBZWFJsT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUhacFpYYzZJQ2RzYVhOMEp5eGNiaUFnSUNBZ0lHMXZiV1Z1ZERvZ2JuVnNiRnh1SUNBZ0lIMDdYRzRnSUgwc1hHNGdJR2RsZEVSbFptRjFiSFJRY205d2N6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQjBhWFJzWlRvZ0lDQWdJQ0FnSUNkVFlXWmxkSGtnVFc5dFpXNTBJRlJwZEd4bEp5eGNiaUFnSUNBZ0lHTnlaV0YwWldRNklDQWdJQ0FnYm1WM0lFUmhkR1VvS1N4Y2JpQWdJQ0FnSUhOMWJXMWhjbms2SUNBZ0lDQWdKMU4xYlcxaGNua2dkR1Y0ZENjc1hHNGdJQ0FnSUNCa1pYUmhhV3c2SUNBZ0lDQWdJQ2RFWlhSaGFXd2dkR1Y0ZENjc1hHNGdJQ0FnSUNCb1pXRmtaWEpmYVcxaFoyVTZJSFZ1WkdWbWFXNWxaQ3hjYmlBZ0lDQWdJR3RsZVhkdmNtUnpPaUFnSUNBZ1cxMWNiaUFnSUNCOU8xeHVJQ0I5TEZ4dUlDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSE4wYjNKbExtOXVLQ2RqYUdGdVoyVW5MQ0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSE4wYjNKbExuUnZTbE5QVGlncEtUdGNiaUFnSUNCOUxtSnBibVFvZEdocGN5a3BPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJYYVd4c1ZXNXRiM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lITjBiM0psTG05bVppZ25ZMmhoYm1kbEp5azdYRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCMmFXVjNJRDBnZEdocGN5NWlkV2xzWkZacFpYY29LVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltTnZiblJsYm5SY0lqNWNiaUFnSUNBZ0lDQWdQRlJ2Y0VKaGNpQXZQbHh1WEc0Z0lDQWdJQ0FnSUh0MmFXVjNmVnh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmU3hjYmlBZ1luVnBiR1JXYVdWM09pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdadU8xeHVJQ0FnSUhaaGNpQnRZWEE3WEc1Y2JpQWdJQ0J0WVhBZ1BTQjdYRzRnSUNBZ0lDQnpaV0Z5WTJnNklDZGlkV2xzWkZObFlYSmphRlpwWlhjbkxGeHVJQ0FnSUNBZ2MyaGhjbVU2SUNkaWRXbHNaRk5vWVhKbFZtbGxkeWNzWEc0Z0lDQWdJQ0JzYVhOME9pQW5ZblZwYkdSTWFYTjBWbWxsZHlkY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnWm00Z1BTQnRZWEJiZEdocGN5NXpkR0YwWlM1MmFXVjNYVHRjYmlBZ0lDQm1iaUE5SUhSb2FYTmJabTVkSUh4OElIUm9hWE11WW5WcGJHUk5ZV2x1Vm1sbGR6dGNibHh1SUNBZ0lISmxkSFZ5YmlCbWJpNWpZV3hzS0hSb2FYTXBPMXh1SUNCOUxGeHVJQ0JpZFdsc1pFeHBjM1JXYVdWM09pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeE1hWE4wVm1sbGR5QnpaV0Z5WTJnOWUzUnlkV1Y5SUM4K1hHNGdJQ0FnS1R0Y2JpQWdmU3hjYmlBZ1luVnBiR1JOWVdsdVZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnJaWGwzYjNKa2N5QTlJRzUxYkd3N1hHNGdJQ0FnZG1GeUlHbHRZV2RsVUhKdmNITTdYRzRnSUNBZ2RtRnlJR1JoZEdVZ1BTQnRiMjFsYm5Rb2RHaHBjeTV3Y205d2N5NWpjbVZoZEdWa0tUdGNibHh1SUNBZ0lHUmhkR1VnUFNCa1lYUmxMbVp2Y20xaGRDZ25UVTFOSUUwc0lGbFpXVmtuS1R0Y2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbXRsZVhkdmNtUnpMbXhsYm1kMGFDQStJREFwSUh0Y2JpQWdJQ0FnSUd0bGVYZHZjbVJ6SUQwZ2RHaHBjeTV3Y205d2N5NXJaWGwzYjNKa2N5NXFiMmx1S0Njc0lDY3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbHRZV2RsVUhKdmNITWdQU0I3WEc0Z0lDQWdJQ0JwYldGblpUb2dJQ0FnZEdocGN5NXdjbTl3Y3k1cGJXRm5aU3hjYmlBZ0lDQWdJR3RsZVhkdmNtUnpPaUIwYUdsekxuQnliM0J6TG10bGVYZHZjbVJ6WEc0Z0lDQWdmVHRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltMWhhVzR0ZG1sbGQxd2lQbHh1SUNBZ0lDQWdJQ0E4VkdsMGJHVkNZWEkrWEc0Z0lDQWdJQ0FnSUNBZ2UzUm9hWE11Y0hKdmNITXVkR2wwYkdWOVhHNGdJQ0FnSUNBZ0lEd3ZWR2wwYkdWQ1lYSStYRzVjYmlBZ0lDQWdJQ0FnUEZCeWFXMWhjbmxKYldGblpTQjdMaTR1YVcxaFoyVlFjbTl3YzMwZ0x6NWNibHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbTExZEdWa0lITnRZV3hzWENJK2UydGxlWGR2Y21SemZUd3ZaR2wyUGx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW0xMWRHVmtJSE50WVd4c1hDSStRM0psWVhSbFpDQjdaR0YwWlgwOEwyUnBkajVjYmx4dUlDQWdJQ0FnSUNBOFUzVnRiV0Z5ZVNCMllXeDFaVDE3ZEdocGN5NXdjbTl3Y3k1emRXMXRZWEo1ZlNBdlBseHVYRzRnSUNBZ0lDQWdJRHhUY0c5dWMyOXlJQzgrWEc1Y2JpQWdJQ0FnSUNBZ1BHZ3pQa1JsZEdGcGJITTZQQzlvTXo1Y2JpQWdJQ0FnSUNBZ1BGTjFiVzFoY25rZ2RtRnNkV1U5ZTNSb2FYTXVjSEp2Y0hNdVpHVjBZV2xzZlNBdlBseHVYRzRnSUNBZ0lDQWdJRHhHYjI5MFpYSkNZWElnTHo1Y2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgxY2JuMHBPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUZacFpYYzdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgSWNvbiAgICA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBQcmltYXJ5SW1hZ2U7XG5cblByaW1hcnlJbWFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJQcmltYXJ5SW1hZ2VcIixcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleXdvcmRzOiBbXVxuICAgIH07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBJbWFnZUVsO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuaW1hZ2UpIHtcbiAgICAgIEltYWdlRWwgPSB0aGlzLmJ1aWxkRnJvbUltYWdlKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgSW1hZ2VFbCA9IHRoaXMuYnVpbGRGcm9tQ2F0ZWdvcnkoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgSW1hZ2VFbFxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGJ1aWxkRnJvbUNhdGVnb3J5OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhdGVnb3J5ID0gdGhpcy5wcm9wcy5rZXl3b3JkcyB8fCBbXTtcblxuICAgIGNhdGVnb3J5ID0gY2F0ZWdvcnlbMF0gfHwgJ2Jhbic7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByaW1hcnktaW1hZ2UtZmFrZVwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IGNhdGVnb3J5fSlcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBidWlsZEZyb21JbWFnZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbWFnZSA9IHRoaXMucHJvcHMuaW1hZ2U7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7c3JjOiBpbWFnZSwgY2xhc3NOYW1lOiBcInByaW1hcnktaW1hZ2VcIn0pXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJpbWFyeUltYWdlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzl3Y21sdFlYSjVYMmx0WVdkbExtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU12UWl4SlFVRkpMRWxCUVVrc1RVRkJUU3hQUVVGUExFTkJRVU1zZDBKQlFYZENMRU5CUVVNc1EwRkJRenRCUVVOb1JDeEpRVUZKTEZsQlFWa3NRMEZCUXpzN1FVRkZha0lzYTBOQlFXdERMRFJDUVVGQk8wVkJRMmhETEdWQlFXVXNSVUZCUlN4WlFVRlpPMGxCUXpOQ0xFOUJRVTg3VFVGRFRDeFJRVUZSTEVWQlFVVXNSVUZCUlR0TFFVTmlMRU5CUVVNN1IwRkRTRHRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBGQlEzUkNMRWxCUVVrc1NVRkJTU3hQUVVGUExFTkJRVU03TzBsQlJWb3NTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzUlVGQlJUdE5RVU53UWl4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRExHTkJRV01zUlVGQlJTeERRVUZETzB0QlEycERPMU5CUTBrN1RVRkRTQ3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhGUVVGRkxFTkJRVU03UVVGRGVrTXNTMEZCU3pzN1NVRkZSRHROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4SlFVRkRMRVZCUVVFN1VVRkRSaXhQUVVGUk8wMUJRMHdzUTBGQlFUdE5RVU5PTzBkQlEwZzdSVUZEUkN4cFFrRkJhVUlzUlVGQlJTeFpRVUZaTzBGQlEycERMRWxCUVVrc1NVRkJTU3hSUVVGUkxFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJMRWxCUVVrc1JVRkJSU3hEUVVGRE96dEJRVVUzUXl4SlFVRkpMRkZCUVZFc1IwRkJSeXhSUVVGUkxFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NTMEZCU3l4RFFVRkRPenRKUVVWb1F6dE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNiMEpCUVhGQ0xFTkJRVUVzUlVGQlFUdFJRVU5zUXl4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkZMRkZCUVZNc1EwRkJRU3hEUVVGSExFTkJRVUU3VFVGRGNFSXNRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hqUVVGakxFVkJRVVVzV1VGQldUdEJRVU01UWl4SlFVRkpMRWxCUVVrc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRPenRKUVVVM1FqdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zUjBGQlFTeEZRVUZITEVOQlFVVXNTMEZCU3l4RlFVRkRMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zWlVGQlpTeERRVUZCTEVOQlFVY3NRMEZCUVR0TlFVTTNRenRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFpRVUZaTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRkpsWVdOMElDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFbGpiMjRnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMaTlqYjIxd2IyNWxiblJ6TDJsamIyNHVhbk40SnlrN1hHNTJZWElnVUhKcGJXRnllVWx0WVdkbE8xeHVYRzVRY21sdFlYSjVTVzFoWjJVZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUdkbGRFUmxabUYxYkhSUWNtOXdjem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0JyWlhsM2IzSmtjem9nVzExY2JpQWdJQ0I5TzF4dUlDQjlMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdTVzFoWjJWRmJEdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG1sdFlXZGxLU0I3WEc0Z0lDQWdJQ0JKYldGblpVVnNJRDBnZEdocGN5NWlkV2xzWkVaeWIyMUpiV0ZuWlNncE8xeHVJQ0FnSUgxY2JpQWdJQ0JsYkhObElIdGNiaUFnSUNBZ0lFbHRZV2RsUld3Z1BTQjBhR2x6TG1KMWFXeGtSbkp2YlVOaGRHVm5iM0o1S0NrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZK1hHNGdJQ0FnSUNBZ0lIdEpiV0ZuWlVWc2ZWeHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZTeGNiaUFnWW5WcGJHUkdjbTl0UTJGMFpXZHZjbms2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdZMkYwWldkdmNua2dQU0IwYUdsekxuQnliM0J6TG10bGVYZHZjbVJ6SUh4OElGdGRPMXh1WEc0Z0lDQWdZMkYwWldkdmNua2dQU0JqWVhSbFoyOXllVnN3WFNCOGZDQW5ZbUZ1Snp0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbkJ5YVcxaGNua3RhVzFoWjJVdFptRnJaVndpUGx4dUlDQWdJQ0FnSUNBOFNXTnZiaUIwZVhCbFBYdGpZWFJsWjI5eWVYMGdMejVjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lHSjFhV3hrUm5KdmJVbHRZV2RsT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR2x0WVdkbElEMGdkR2hwY3k1d2NtOXdjeTVwYldGblpUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGFXMW5JSE55WXoxN2FXMWhaMlY5SUdOc1lYTnpUbUZ0WlQxY0luQnlhVzFoY25rdGFXMWhaMlZjSWlBdlBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRkJ5YVcxaGNubEpiV0ZuWlR0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBTcG9uc29yO1xuXG5TcG9uc29yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlNwb25zb3JcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzcG9uc29yXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInNtYWxsIG11dGVkXCJ9LCBcbiAgICAgICAgICBcIlNwb25zb3JlZCBieTpcIlxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInNwb25zb3ItY29udGVudFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzcG9uc29yLWltYWdlXCJ9KSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzcG9uc29yLW5hbWVcIn0sIFxuICAgICAgICAgICAgXCJIaWx0aSByaXNrIGFzc3VtcHRpb24gcHJvZHVjdHNcIlxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwb25zb3I7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXpjRzl1YzI5eUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU12UWl4SlFVRkpMRTlCUVU4c1EwRkJRenM3UVVGRldpdzJRa0ZCTmtJc2RVSkJRVUU3UlVGRE0wSXNUVUZCVFN4RlFVRkZMRmxCUVZrN1NVRkRiRUk3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZOQlFWVXNRMEZCUVN4RlFVRkJPMUZCUTNaQ0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zWVVGQll5eERRVUZCTEVWQlFVRTdRVUZCUVN4VlFVRkJMR1ZCUVVFN1FVRkJRU3hSUVVWMlFpeERRVUZCTEVWQlFVRTdVVUZEVGl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR2xDUVVGclFpeERRVUZCTEVWQlFVRTdWVUZETDBJc2IwSkJRVUVzVFVGQlN5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhsUVVGbExFTkJRVUVzUTBGQlJ5eERRVUZCTEVWQlFVRTdWVUZEYkVNc2IwSkJRVUVzVFVGQlN5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhqUVVGbExFTkJRVUVzUlVGQlFUdEJRVUZCTEZsQlFVRXNaME5CUVVFN1FVRkJRU3hWUVVWNFFpeERRVUZCTzFGQlEwZ3NRMEZCUVR0TlFVTkdMRU5CUVVFN1RVRkRUanRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRkpsWVdOMElDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlGTndiMjV6YjNJN1hHNWNibE53YjI1emIzSWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5Od2IyNXpiM0pjSWo1Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKemJXRnNiQ0J0ZFhSbFpGd2lQbHh1SUNBZ0lDQWdJQ0FnSUZOd2IyNXpiM0psWkNCaWVUcGNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWMzQnZibk52Y2kxamIyNTBaVzUwWENJK1hHNGdJQ0FnSUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2ljM0J2Ym5OdmNpMXBiV0ZuWlZ3aUlDOCtYRzRnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpYzNCdmJuTnZjaTF1WVcxbFhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNCSWFXeDBhU0J5YVhOcklHRnpjM1Z0Y0hScGIyNGdjSEp2WkhWamRITmNiaUFnSUNBZ0lDQWdJQ0E4TDNOd1lXNCtYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1UzQnZibk52Y2p0Y2JpSmRmUT09IiwidmFyIHN0b3JlO1xudmFyIFN0b3JlO1xudmFyIGRpc3BhdGNoZXIgID0gcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyk7XG52YXIgQmFja2JvbmUgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5TdG9yZSA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIGRlZmF1bHRzOiB7XG4gICAgdmlldzogICAgIG51bGwsXG4gICAgY2F0ZWdvcnk6IG51bGwsXG4gICAgbW9tZW50OiAgIG51bGxcbiAgfSxcbiAgZGlzcGF0Y2hIYW5kbGVyOiBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgIHN3aXRjaCAocGF5bG9hZC50eXBlKSB7XG4gICAgICBjYXNlICd2aWV3JzpcbiAgICAgICAgdGhpcy5zZXQoJ3ZpZXcnLCBwYXlsb2FkLnZpZXcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nob29zZSc6XG4gICAgICAgIHRoaXMuc2V0KCdtb21lbnQnLCBwYXlsb2FkLnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjYXRlZ29yeSc6XG4gICAgICAgIHRoaXMuc2V0KCdjYXRlZ29yeScsIHBheWxvYWQudmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn0pO1xuXG5zdG9yZSA9IG5ldyBTdG9yZSgpO1xuXG5zdG9yZS50b2tlbiA9IGRpc3BhdGNoZXIucmVnaXN0ZXIoc3RvcmUuZGlzcGF0Y2hIYW5kbGVyLmJpbmQoc3RvcmUpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5emRHOXlaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZKTEV0QlFVc3NRMEZCUXp0QlFVTldMRWxCUVVrc1MwRkJTeXhEUVVGRE8wRkJRMVlzU1VGQlNTeFZRVUZWTEVsQlFVa3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE8wRkJRekZETEVsQlFVa3NVVUZCVVN4TlFVRk5MRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdRVUZGZEVNc1MwRkJTeXhIUVVGSExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRPMFZCUXpWQ0xGRkJRVkVzUlVGQlJUdEpRVU5TTEVsQlFVa3NUVUZCVFN4SlFVRkpPMGxCUTJRc1VVRkJVU3hGUVVGRkxFbEJRVWs3U1VGRFpDeE5RVUZOTEVsQlFVa3NTVUZCU1R0SFFVTm1PMFZCUTBRc1pVRkJaU3hGUVVGRkxGVkJRVlVzVDBGQlR5eEZRVUZGTzBsQlEyeERMRkZCUVZFc1QwRkJUeXhEUVVGRExFbEJRVWs3VFVGRGJFSXNTMEZCU3l4TlFVRk5PMUZCUTFRc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xRkJReTlDTEUxQlFVMDdUVUZEVWl4TFFVRkxMRkZCUVZFN1VVRkRXQ3hKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03VVVGRGJFTXNUVUZCVFR0TlFVTlNMRXRCUVVzc1ZVRkJWVHRSUVVOaUxFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RlFVRkZMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dFJRVU53UXl4TlFVRk5PMHRCUTFRN1IwRkRSanRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRXRCUVVzc1IwRkJSeXhKUVVGSkxFdEJRVXNzUlVGQlJTeERRVUZET3p0QlFVVndRaXhMUVVGTExFTkJRVU1zUzBGQlN5eEhRVUZITEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1MwRkJTeXhEUVVGRExHVkJRV1VzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRmNrVXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKMllYSWdjM1J2Y21VN1hHNTJZWElnVTNSdmNtVTdYRzUyWVhJZ1pHbHpjR0YwWTJobGNpQWdQU0J5WlhGMWFYSmxLQ2N1TDJScGMzQmhkR05vWlhJbktUdGNiblpoY2lCQ1lXTnJZbTl1WlNBZ0lDQTlJSEpsY1hWcGNtVW9KMkpoWTJ0aWIyNWxKeWs3WEc1Y2JsTjBiM0psSUQwZ1FtRmphMkp2Ym1VdVRXOWtaV3d1WlhoMFpXNWtLSHRjYmlBZ1pHVm1ZWFZzZEhNNklIdGNiaUFnSUNCMmFXVjNPaUFnSUNBZ2JuVnNiQ3hjYmlBZ0lDQmpZWFJsWjI5eWVUb2diblZzYkN4Y2JpQWdJQ0J0YjIxbGJuUTZJQ0FnYm5Wc2JGeHVJQ0I5TEZ4dUlDQmthWE53WVhSamFFaGhibVJzWlhJNklHWjFibU4wYVc5dUlDaHdZWGxzYjJGa0tTQjdYRzRnSUNBZ2MzZHBkR05vSUNod1lYbHNiMkZrTG5SNWNHVXBJSHRjYmlBZ0lDQWdJR05oYzJVZ0ozWnBaWGNuT2x4dUlDQWdJQ0FnSUNCMGFHbHpMbk5sZENnbmRtbGxkeWNzSUhCaGVXeHZZV1F1ZG1sbGR5azdYRzRnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUNBZ1kyRnpaU0FuWTJodmIzTmxKenBjYmlBZ0lDQWdJQ0FnZEdocGN5NXpaWFFvSjIxdmJXVnVkQ2NzSUhCaGVXeHZZV1F1ZG1Gc2RXVXBPMXh1SUNBZ0lDQWdJQ0JpY21WaGF6dGNiaUFnSUNBZ0lHTmhjMlVnSjJOaGRHVm5iM0o1SnpwY2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WlhRb0oyTmhkR1ZuYjNKNUp5d2djR0Y1Ykc5aFpDNTJZV3gxWlNrN1hHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJSDFjYmlBZ2ZWeHVmU2s3WEc1Y2JuTjBiM0psSUQwZ2JtVjNJRk4wYjNKbEtDazdYRzVjYm5OMGIzSmxMblJ2YTJWdUlEMGdaR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWh6ZEc5eVpTNWthWE53WVhSamFFaGhibVJzWlhJdVltbHVaQ2h6ZEc5eVpTa3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhOMGIzSmxPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgU3VtbWFyeTtcblxuU3VtbWFyeSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTdW1tYXJ5XCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3VtbWFyeVwifSwgXG4gICAgICAgIHRoaXMucHJvcHMudmFsdWVcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdW1tYXJ5O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzl6ZFcxdFlYSjVMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzUzBGQlN5eExRVUZMTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNdlFpeEpRVUZKTEU5QlFVOHNRMEZCUXpzN1FVRkZXaXcyUWtGQk5rSXNkVUpCUVVFN1JVRkRNMElzVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJN1RVRkRSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGTkJRVlVzUTBGQlFTeEZRVUZCTzFGQlEzUkNMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlRUdE5RVU5rTEVOQlFVRTdUVUZEVGp0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZKbFlXTjBJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRk4xYlcxaGNuazdYRzVjYmxOMWJXMWhjbmtnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luTjFiVzFoY25sY0lqNWNiaUFnSUNBZ0lDQWdlM1JvYVhNdWNISnZjSE11ZG1Gc2RXVjlYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQlRkVzF0WVhKNU8xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUaXRsZUJhcjtcblxuVGl0bGVCYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGl0bGVCYXJcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aXRsZS1iYXJcIn0sIFxuICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGl0bGVCYXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOTBhWFJzWlY5aVlYSXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hMUVVGTExFdEJRVXNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUXk5Q0xFbEJRVWtzVVVGQlVTeERRVUZET3p0QlFVVmlMRGhDUVVFNFFpeDNRa0ZCUVR0RlFVTTFRaXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWp0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1YwRkJXU3hEUVVGQkxFVkJRVUU3VVVGRGVFSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGVE8wMUJRMnBDTEVOQlFVRTdUVUZEVGp0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhSUVVGUkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZKbFlXTjBJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRlJwZEd4bFFtRnlPMXh1WEc1VWFYUnNaVUpoY2lBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lkR2wwYkdVdFltRnlYQ0krWEc0Z0lDQWdJQ0FnSUh0MGFHbHpMbkJ5YjNCekxtTm9hV3hrY21WdWZWeHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZHbDBiR1ZDWVhJN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUb3BCYXI7XG5cblRvcEJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUb3BCYXJcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJkZXZpY2UtYmFyXCJ9LCBcbiAgICAgICAgXCJTYWZldHlNb21lbnR1bS5jb21cIlxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcEJhcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5MGIzQmZZbUZ5TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhKUVVGSkxFMUJRVTBzUTBGQlF6czdRVUZGV0N3MFFrRkJORUlzYzBKQlFVRTdSVUZETVVJc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSTdUVUZEUlN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRmxCUVdFc1EwRkJRU3hGUVVGQk8wRkJRVUVzVVVGQlFTeHZRa0ZCUVR0QlFVRkJMRTFCUlhSQ0xFTkJRVUU3VFVGRFRqdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4TlFVRk5MRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGSmxZV04wSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUZSdmNFSmhjanRjYmx4dVZHOXdRbUZ5SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmtaWFpwWTJVdFltRnlYQ0krWEc0Z0lDQWdJQ0FnSUZOaFptVjBlVTF2YldWdWRIVnRMbU52YlZ4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkc5d1FtRnlPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVmlldztcbnZhciBSZWFjdCAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBNYWluVmlldyAgICAgID0gcmVxdWlyZSgnLi9tYWluX3ZpZXcuanN4Jyk7XG52YXIgc3RvcmUgICAgICAgICA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcbnZhciBsaXN0X3N0b3JlICAgID0gcmVxdWlyZSgnLi9saXN0X3N0b3JlJyk7XG5cblZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVmlld1wiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYXN5bmM6ICBmYWxzZSxcbiAgICAgIG1vbWVudDogbnVsbFxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUub24oJ2NoYW5nZTptb21lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmdldE1vbWVudCgpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUub2ZmKCdjaGFuZ2UnKTtcbiAgfSxcbiAgZ2V0TW9tZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNob2ljZSA9IHN0b3JlLmdldCgnbW9tZW50Jyk7XG4gICAgdmFyIG1vbWVudCA9IGxpc3Rfc3RvcmUuZ2V0KGNob2ljZSk7XG5cbiAgICBpZiAoISBtb21lbnQpIHtcbiAgICAgIG1vbWVudCA9IGxpc3Rfc3RvcmUuYWRkKHtpZDogY2hvaWNlfSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2FzeW5jOiB0cnVlfSk7XG5cbiAgICAgIHJldHVybiBtb21lbnQuZmV0Y2goe3N1Y2Nlc3M6IHRoaXMuY2hvb3NlTW9tZW50LmJpbmQodGhpcyl9KTtcbiAgICB9XG5cbiAgICB0aGlzLmNob29zZU1vbWVudChtb21lbnQpO1xuICB9LFxuICBjaG9vc2VNb21lbnQ6IGZ1bmN0aW9uIChtb21lbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgIG1vbWVudDogbW9tZW50XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9wcyA9ICh0aGlzLnN0YXRlLm1vbWVudCAmJiB0aGlzLnN0YXRlLm1vbWVudC50b0pTT04oKSkgfHwge307XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNYWluVmlldywgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5MmFXVjNMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzU1VGQlNTeERRVUZETzBGQlExUXNTVUZCU1N4TFFVRkxMRmRCUVZjc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzSkRMRWxCUVVrc1VVRkJVU3hSUVVGUkxFOUJRVThzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8wRkJReTlETEVsQlFVa3NTMEZCU3l4WFFVRlhMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU4yUXl4SlFVRkpMRlZCUVZVc1RVRkJUU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPMEZCUlRWRExEQkNRVUV3UWl4dlFrRkJRVHRGUVVONFFpeGxRVUZsTEVWQlFVVXNXVUZCV1R0SlFVTXpRaXhQUVVGUE8wMUJRMHdzUzBGQlN5eEhRVUZITEV0QlFVczdUVUZEWWl4TlFVRk5MRVZCUVVVc1NVRkJTVHRMUVVOaUxFTkJRVU03UjBGRFNEdEZRVU5FTEdsQ1FVRnBRaXhGUVVGRkxGbEJRVms3U1VGRE4wSXNTMEZCU3l4RFFVRkRMRVZCUVVVc1EwRkJReXhsUVVGbExFVkJRVVVzV1VGQldUdE5RVU53UXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGRkxFTkJRVU03UzBGRGJFSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dEhRVU5tTzBWQlEwUXNiMEpCUVc5Q0xFVkJRVVVzV1VGQldUdEpRVU5vUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBkQlEzSkNPMFZCUTBRc1UwRkJVeXhGUVVGRkxGbEJRVms3U1VGRGNrSXNTVUZCU1N4TlFVRk5MRWRCUVVjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTnlReXhKUVVGSkxFbEJRVWtzVFVGQlRTeEhRVUZITEZWQlFWVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03TzBsQlJYQkRMRWxCUVVrc1JVRkJSU3hOUVVGTkxFVkJRVVU3UVVGRGJFSXNUVUZCVFN4TlFVRk5MRWRCUVVjc1ZVRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVWQlFVVXNSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVUxUXl4TlFVRk5MRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenM3VFVGRk4wSXNUMEZCVHl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnVSU3hMUVVGTE96dEpRVVZFTEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UjBGRE0wSTdSVUZEUkN4WlFVRlpMRVZCUVVVc1ZVRkJWU3hOUVVGTkxFVkJRVVU3U1VGRE9VSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenROUVVOYUxFdEJRVXNzUlVGQlJTeExRVUZMTzAxQlExb3NUVUZCVFN4RlFVRkZMRTFCUVUwN1MwRkRaaXhEUVVGRExFTkJRVU03UjBGRFNqdEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMEZCUTNSQ0xFbEJRVWtzU1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFVkJRVVVzUzBGQlN5eEZRVUZGTEVOQlFVTTdPMGxCUlhCRk8wMUJRMFVzYjBKQlFVTXNVVUZCVVN4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEV0QlFVMHNRMEZCUVN4RFFVRkhMRU5CUVVFN1RVRkRka0k3UjBGRFNEdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJXYVdWM08xeHVkbUZ5SUZKbFlXTjBJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFMWhhVzVXYVdWM0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyMWhhVzVmZG1sbGR5NXFjM2duS1R0Y2JuWmhjaUJ6ZEc5eVpTQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTl6ZEc5eVpTY3BPMXh1ZG1GeUlHeHBjM1JmYzNSdmNtVWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyeHBjM1JmYzNSdmNtVW5LVHRjYmx4dVZtbGxkeUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbE9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lHRnplVzVqT2lBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0J0YjIxbGJuUTZJRzUxYkd4Y2JpQWdJQ0I5TzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lITjBiM0psTG05dUtDZGphR0Z1WjJVNmJXOXRaVzUwSnl3Z1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1blpYUk5iMjFsYm5Rb0tUdGNiaUFnSUNCOUxtSnBibVFvZEdocGN5a3BPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJYYVd4c1ZXNXRiM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lITjBiM0psTG05bVppZ25ZMmhoYm1kbEp5azdYRzRnSUgwc1hHNGdJR2RsZEUxdmJXVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmphRzlwWTJVZ1BTQnpkRzl5WlM1blpYUW9KMjF2YldWdWRDY3BPMXh1SUNBZ0lIWmhjaUJ0YjIxbGJuUWdQU0JzYVhOMFgzTjBiM0psTG1kbGRDaGphRzlwWTJVcE8xeHVYRzRnSUNBZ2FXWWdLQ0VnYlc5dFpXNTBLU0I3WEc0Z0lDQWdJQ0J0YjIxbGJuUWdQU0JzYVhOMFgzTjBiM0psTG1Ga1pDaDdhV1E2SUdOb2IybGpaWDBwTzF4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRoYzNsdVl6b2dkSEoxWlgwcE8xeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2JXOXRaVzUwTG1abGRHTm9LSHR6ZFdOalpYTnpPaUIwYUdsekxtTm9iMjl6WlUxdmJXVnVkQzVpYVc1a0tIUm9hWE1wZlNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NWphRzl2YzJWTmIyMWxiblFvYlc5dFpXNTBLVHRjYmlBZ2ZTeGNiaUFnWTJodmIzTmxUVzl0Wlc1ME9pQm1kVzVqZEdsdmJpQW9iVzl0Wlc1MEtTQjdYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0JoYzNsdVl6b2dabUZzYzJVc1hHNGdJQ0FnSUNCdGIyMWxiblE2SUcxdmJXVnVkRnh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2NISnZjSE1nUFNBb2RHaHBjeTV6ZEdGMFpTNXRiMjFsYm5RZ0ppWWdkR2hwY3k1emRHRjBaUzV0YjIxbGJuUXVkRzlLVTA5T0tDa3BJSHg4SUh0OU8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4TllXbHVWbWxsZHlCN0xpNHVjSEp2Y0hOOUlDOCtYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVm1sbGR6dGNiaUpkZlE9PSJdfQ==
