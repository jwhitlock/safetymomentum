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
  dispatchHandler: function (payload) {
    console.log(payload);
  }
});

store = new Store([
  {created: new Date(), title: 'One', keywords: ['automobile'], id: 23},
  {created: new Date(), title: 'Two', keywords: ['automobile'], id: 33}
]);

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
      view: null,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHltb21lbnR1bS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvaWNvbi5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHkvZGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9mb290ZXJfYmFyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9saXN0X3N0b3JlLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L2xpc3Rfdmlldy5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHkvbWFpbl92aWV3LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9wcmltYXJ5X2ltYWdlLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zcG9uc29yLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zdG9yZS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zdW1tYXJ5LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS90aXRsZV9iYXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L3RvcF9iYXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L3ZpZXcuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBSSxLQUFLLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU1QyxTQUFTLE1BQU0sRUFBRSxFQUFFLEVBQUU7RUFDbkIsS0FBSyxDQUFDLE1BQU07SUFDVixLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtNQUM1QixRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO0tBQ3RDLENBQUM7SUFDRixRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztHQUM1QixDQUFDO0FBQ0osQ0FBQzs7QUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUV4Qjs7O0FDaEJBOztBQUVBLEdBQUc7O0FBRUgsSUFBSSxJQUFJLENBQUM7QUFDVCxJQUFJLENBQUMsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFD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TUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUU1QyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs7TUFFN0IsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRSxLQUFLOztJQUVELElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDM0I7RUFDRCxZQUFZLEVBQUUsVUFBVSxNQUFNLEVBQUU7SUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQztNQUNaLEtBQUssRUFBRSxLQUFLO01BQ1osTUFBTSxFQUFFLE1BQU07S0FDZixDQUFDLENBQUM7R0FDSjtFQUNELE1BQU0sRUFBRSxZQUFZO0FBQ3RCLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7O0lBRXBFO01BQ0UsS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7TUFDekQ7R0FDSDtBQUNILENBQUMsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUV0QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBNYWluVmlldyA9IHJlcXVpcmUoJy4vc2FmZXR5L3ZpZXcuanN4Jyk7XG5cbmZ1bmN0aW9uIHJlbmRlciAoaWQpIHtcbiAgUmVhY3QucmVuZGVyKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFpblZpZXcsIHtcbiAgICAgIGtleXdvcmRzOiBbJ2F1dG9tb2JpbGUnLCAna2V5d29yZCAyJ11cbiAgICB9KSxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcbiAgKTtcbn1cblxucmVuZGVyKCdzYWZldHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZW5kZXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVXMXZiV1Z1ZEhWdExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVa3NTMEZCU3l4UFFVRlBMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU5xUXl4SlFVRkpMRkZCUVZFc1IwRkJSeXhQUVVGUExFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1EwRkJRenM3UVVGRk5VTXNVMEZCVXl4TlFVRk5MRVZCUVVVc1JVRkJSU3hGUVVGRk8wVkJRMjVDTEV0QlFVc3NRMEZCUXl4TlFVRk5PMGxCUTFZc1MwRkJTeXhEUVVGRExHRkJRV0VzUTBGQlF5eFJRVUZSTEVWQlFVVTdUVUZETlVJc1VVRkJVU3hGUVVGRkxFTkJRVU1zV1VGQldTeEZRVUZGTEZkQlFWY3NRMEZCUXp0TFFVTjBReXhEUVVGRE8wbEJRMFlzVVVGQlVTeERRVUZETEdOQlFXTXNRMEZCUXl4RlFVRkZMRU5CUVVNN1IwRkROVUlzUTBGQlF6dEJRVU5LTEVOQlFVTTdPMEZCUlVRc1RVRkJUU3hEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVnFRaXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEUxQlFVMHNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkluWmhjaUJTWldGamRDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRTFoYVc1V2FXVjNJRDBnY21WeGRXbHlaU2duTGk5ellXWmxkSGt2ZG1sbGR5NXFjM2duS1R0Y2JseHVablZ1WTNScGIyNGdjbVZ1WkdWeUlDaHBaQ2tnZTF4dUlDQlNaV0ZqZEM1eVpXNWtaWElvWEc0Z0lDQWdVbVZoWTNRdVkzSmxZWFJsUld4bGJXVnVkQ2hOWVdsdVZtbGxkeXdnZTF4dUlDQWdJQ0FnYTJWNWQyOXlaSE02SUZzbllYVjBiMjF2WW1sc1pTY3NJQ2RyWlhsM2IzSmtJREluWFZ4dUlDQWdJSDBwTEZ4dUlDQWdJR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tHbGtLVnh1SUNBcE8xeHVmVnh1WEc1eVpXNWtaWElvSjNOaFptVjBlU2NwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlISmxibVJsY2p0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBJY29uO1xudmFyIF8gICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGljb24sIGN1cnJlbnRseSB1c2luZyB0aGUgZm9udCBhd2Vzb21lIGljb24gbGlicmFyeVxuICpcbiAqIEBleGFtcGxlc1xuICogPEljb24gdHlwZT1cImNoZWNrXCIgLz5cbiAqIDxJY29uIHR5cGU9XCJ1c2VyXCIgY2xhc3NOYW1lPVwibXV0ZWRcIiAvPlxuICogPEljb24gdHlwZT1cImJhblwiIHN0YWNrPVwiMnhcIiAvPlxuICovXG5JY29uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkljb25cIixcbiAgcHJvcFR5cGVzOiB7XG4gICAgc3RhY2s6ICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICB0eXBlOiAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgY2xhc3NOYW1lOiAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBtaXhpbnM6IFtSZWFjdC5hZGRvbnMuUHVyZVJlbmRlck1peGluXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNsYXNzZXMgPSBbJ2ZhIGZhLWljb24nXTtcbiAgICB2YXIgcHJvcHMgICA9IF8ub21pdCh0aGlzLnByb3BzLCBbJ3N0YWNrJywgJ3R5cGUnLCAnY2xhc3NOYW1lJ10pO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuc3RhY2spIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtc3RhY2stJyArIHRoaXMucHJvcHMuc3RhY2spO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnNwaW4pIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtc3BpbicpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnR5cGUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtJyArIHRoaXMucHJvcHMudHlwZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xhc3NOYW1lKSB7XG4gICAgICBjbGFzc2VzLnB1c2godGhpcy5wcm9wcy5jbGFzc05hbWUpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuc2l6ZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS0nICsgdGhpcy5wcm9wcy5zaXplKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcywge2NsYXNzTmFtZTogY2xhc3Nlcy5qb2luKCcgJyl9KSlcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJY29uO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDJOdmJYQnZibVZ1ZEhNdmFXTnZiaTVxYzNnaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEVsQlFVa3NRMEZCUXp0QlFVTlVMRWxCUVVrc1EwRkJReXhQUVVGUExFOUJRVThzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTnNReXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNN08wRkJSVGRDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UjBGRlJ6dEJRVU5JTERCQ1FVRXdRaXh2UWtGQlFUdEZRVU40UWl4VFFVRlRMRVZCUVVVN1NVRkRWQ3hMUVVGTExFOUJRVThzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5PMGxCUTJ4RExFbEJRVWtzVVVGQlVTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJReXhWUVVGVk8wbEJRemRETEZOQlFWTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTA3UjBGRGJrTTdSVUZEUkN4TlFVRk5MRVZCUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEdWQlFXVXNRMEZCUXp0RlFVTjBReXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETzBGQlEycERMRWxCUVVrc1NVRkJTU3hMUVVGTExFdEJRVXNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU1zVDBGQlR5eEZRVUZGTEUxQlFVMHNSVUZCUlN4WFFVRlhMRU5CUVVNc1EwRkJReXhEUVVGRE96dEpRVVZxUlN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eEZRVUZGTzAxQlEzQkNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRGJrUXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkRPVUlzUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE5VTXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVMEZCVXl4RlFVRkZPMDFCUTNoQ0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU03UVVGRGVFTXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETlVNc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRWRCUVVVc1JVRkJRU3huUWtGQlFTeEhRVUZCTEVOQlFVVXNSMEZCUnl4TFFVRkxMRVZCUVVNc1EwRkJReXhEUVVGQkxGTkJRVUVzUlVGQlV5eERRVUZGTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGSExFTkJRVUVzUTBGQlNTeERRVUZCTzAxQlEyaEVPMGRCUTBnN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdTV052Ymp0Y2JuWmhjaUJmSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM1Z1WkdWeWMyTnZjbVVuS1R0Y2JuWmhjaUJTWldGamRDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEp5azdYRzVjYmk4cUtseHVJQ29nUTNKbFlYUmxjeUJoYmlCcFkyOXVMQ0JqZFhKeVpXNTBiSGtnZFhOcGJtY2dkR2hsSUdadmJuUWdZWGRsYzI5dFpTQnBZMjl1SUd4cFluSmhjbmxjYmlBcVhHNGdLaUJBWlhoaGJYQnNaWE5jYmlBcUlEeEpZMjl1SUhSNWNHVTlYQ0pqYUdWamExd2lJQzgrWEc0Z0tpQThTV052YmlCMGVYQmxQVndpZFhObGNsd2lJR05zWVhOelRtRnRaVDFjSW0xMWRHVmtYQ0lnTHo1Y2JpQXFJRHhKWTI5dUlIUjVjR1U5WENKaVlXNWNJaUJ6ZEdGamF6MWNJako0WENJZ0x6NWNiaUFxTDF4dVNXTnZiaUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjSEp2Y0ZSNWNHVnpPaUI3WEc0Z0lDQWdjM1JoWTJzNklDQWdJQ0FnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbk4wY21sdVp5eGNiaUFnSUNCMGVYQmxPaUFnSUNBZ0lDQlNaV0ZqZEM1UWNtOXdWSGx3WlhNdWMzUnlhVzVuTG1selVtVnhkV2x5WldRc1hHNGdJQ0FnWTJ4aGMzTk9ZVzFsT2lBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG5OMGNtbHVaMXh1SUNCOUxGeHVJQ0J0YVhocGJuTTZJRnRTWldGamRDNWhaR1J2Ym5NdVVIVnlaVkpsYm1SbGNrMXBlR2x1WFN4Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdOc1lYTnpaWE1nUFNCYkoyWmhJR1poTFdsamIyNG5YVHRjYmlBZ0lDQjJZWElnY0hKdmNITWdJQ0E5SUY4dWIyMXBkQ2gwYUdsekxuQnliM0J6TENCYkozTjBZV05ySnl3Z0ozUjVjR1VuTENBblkyeGhjM05PWVcxbEoxMHBPMXh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWMzUmhZMnNwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25abUV0YzNSaFkyc3RKeUFySUhSb2FYTXVjSEp2Y0hNdWMzUmhZMnNwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxuTndhVzRwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25abUV0YzNCcGJpY3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG5SNWNHVXBJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnblptRXRKeUFySUhSb2FYTXVjSEp2Y0hNdWRIbHdaU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdVkyeGhjM05PWVcxbEtTQjdYRzRnSUNBZ0lDQmpiR0Z6YzJWekxuQjFjMmdvZEdocGN5NXdjbTl3Y3k1amJHRnpjMDVoYldVcFhHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVjMmw2WlNrZ2UxeHVJQ0FnSUNBZ1kyeGhjM05sY3k1d2RYTm9LQ2RtWVMwbklDc2dkR2hwY3k1d2NtOXdjeTV6YVhwbEtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdrZ2V5NHVMbkJ5YjNCemZTQmpiR0Z6YzA1aGJXVTllMk5zWVhOelpYTXVhbTlwYmlnbklDY3BmVDQ4TDJrK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdTV052Ymp0Y2JpSmRmUT09IiwidmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCdmbHV4JykuRGlzcGF0Y2hlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGlzcGF0Y2hlcigpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzlrYVhOd1lYUmphR1Z5TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVrc1ZVRkJWU3hIUVVGSExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4VlFVRlZMRU5CUVVNN08wRkJSVFZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1NVRkJTU3hWUVVGVkxFVkJRVVVzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCRWFYTndZWFJqYUdWeUlEMGdjbVZ4ZFdseVpTZ25abXgxZUNjcExrUnBjM0JoZEdOb1pYSTdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYm1WM0lFUnBjM0JoZEdOb1pYSW9LVHRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uICAgICAgICA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBkaXNwYXRjaGVyICA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpO1xudmFyIEZvb3RlckJhcjtcblxuRm9vdGVyQmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkZvb3RlckJhclwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImZvb3Rlci1iYXJcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibmF2XCIsIG51bGwsIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5saXN0Vmlld30sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwibGlzdFwifSkpKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge29uQ2xpY2s6IHRoaXMuc2hhcmVWaWV3fSwgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJzZW5kXCJ9KSkpLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5zZWFyY2hWaWV3fSwgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJzZWFyY2hcIn0pKSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBsaXN0VmlldzogZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ3ZpZXcnLFxuICAgICAgdmlldzogJ2xpc3QnXG4gICAgfSk7XG4gIH0sXG4gIHNoYXJlVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ3ZpZXcnLFxuICAgICAgdmlldzogJ3NoYXJlJ1xuICAgIH0pO1xuICB9LFxuICBzZWFyY2hWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiAndmlldycsXG4gICAgICB2aWV3OiAnc2VhcmNoJ1xuICAgIH0pO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb290ZXJCYXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOW1iMjkwWlhKZlltRnlMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzUzBGQlN5eFRRVUZUTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOdVF5eEpRVUZKTEVsQlFVa3NWVUZCVlN4UFFVRlBMRU5CUVVNc2QwSkJRWGRDTEVOQlFVTXNRMEZCUXp0QlFVTndSQ3hKUVVGSkxGVkJRVlVzU1VGQlNTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRNVU1zU1VGQlNTeFRRVUZUTEVOQlFVTTdPMEZCUldRc0swSkJRU3RDTEhsQ1FVRkJPMFZCUXpkQ0xFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENPMDFCUTBVc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhaUVVGaExFTkJRVUVzUlVGQlFUdFJRVU14UWl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzU1VGQlF5eEZRVUZCTzFWQlEwZ3NiMEpCUVVFc1NVRkJSeXhGUVVGQkxFbEJRVU1zUlVGQlFUdFpRVU5HTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hKUVVGRExFVkJRVUVzYjBKQlFVRXNSMEZCUlN4RlFVRkJMRU5CUVVFc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeEpRVUZKTEVOQlFVTXNVVUZCVlN4RFFVRkJMRVZCUVVFc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhOUVVGTkxFTkJRVUVzUTBGQlJ5eERRVUZKTEVOQlFVc3NRMEZCUVN4RlFVRkJPMWxCUXpWRUxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4SlFVRkRMRVZCUVVFc2IwSkJRVUVzUjBGQlJTeEZRVUZCTEVOQlFVRXNRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJSU3hKUVVGSkxFTkJRVU1zVTBGQlZ5eERRVUZCTEVWQlFVRXNiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVFc1EwRkJSeXhEUVVGSkxFTkJRVXNzUTBGQlFTeEZRVUZCTzFsQlF6ZEVMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeEpRVUZETEVWQlFVRXNiMEpCUVVFc1IwRkJSU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1ZVRkJXU3hEUVVGQkxFVkJRVUVzYjBKQlFVTXNTVUZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVRXNRMEZCUnl4RFFVRkpMRU5CUVVzc1EwRkJRVHRWUVVNM1JDeERRVUZCTzFGQlEwUXNRMEZCUVR0TlFVTkdMRU5CUVVFN1RVRkRUanRIUVVOSU8wVkJRMFFzVVVGQlVTeEZRVUZGTEZsQlFWazdTVUZEY0VJc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF6dE5RVU5zUWl4SlFVRkpMRVZCUVVVc1RVRkJUVHROUVVOYUxFbEJRVWtzUlVGQlJTeE5RVUZOTzB0QlEySXNRMEZCUXl4RFFVRkRPMGRCUTBvN1JVRkRSQ3hUUVVGVExFVkJRVVVzV1VGQldUdEpRVU55UWl4VlFVRlZMRU5CUVVNc1VVRkJVU3hEUVVGRE8wMUJRMnhDTEVsQlFVa3NSVUZCUlN4TlFVRk5PMDFCUTFvc1NVRkJTU3hGUVVGRkxFOUJRVTg3UzBGRFpDeERRVUZETEVOQlFVTTdSMEZEU2p0RlFVTkVMRlZCUVZVc1JVRkJSU3haUVVGWk8wbEJRM1JDTEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNN1RVRkRiRUlzU1VGQlNTeEZRVUZGTEUxQlFVMDdUVUZEV2l4SlFVRkpMRVZCUVVVc1VVRkJVVHRMUVVObUxFTkJRVU1zUTBGQlF6dEhRVU5LTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4VFFVRlRMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGSmxZV04wSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duY21WaFkzUW5LVHRjYm5aaGNpQkpZMjl1SUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUwyTnZiWEJ2Ym1WdWRITXZhV052Ymk1cWMzZ25LVHRjYm5aaGNpQmthWE53WVhSamFHVnlJQ0E5SUhKbGNYVnBjbVVvSnk0dlpHbHpjR0YwWTJobGNpY3BPMXh1ZG1GeUlFWnZiM1JsY2tKaGNqdGNibHh1Um05dmRHVnlRbUZ5SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSm1iMjkwWlhJdFltRnlYQ0krWEc0Z0lDQWdJQ0FnSUR4dVlYWStYRzRnSUNBZ0lDQWdJQ0FnUEhWc1BseHVJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBqeGhJRzl1UTJ4cFkyczllM1JvYVhNdWJHbHpkRlpwWlhkOVBqeEpZMjl1SUhSNWNHVTlYQ0pzYVhOMFhDSWdMejQ4TDJFK1BDOXNhVDVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeHNhVDQ4WVNCdmJrTnNhV05yUFh0MGFHbHpMbk5vWVhKbFZtbGxkMzArUEVsamIyNGdkSGx3WlQxY0luTmxibVJjSWlBdlBqd3ZZVDQ4TDJ4cFBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEd4cFBqeGhJRzl1UTJ4cFkyczllM1JvYVhNdWMyVmhjbU5vVm1sbGQzMCtQRWxqYjI0Z2RIbHdaVDFjSW5ObFlYSmphRndpSUM4K1BDOWhQand2YkdrK1hHNGdJQ0FnSUNBZ0lDQWdQQzkxYkQ1Y2JpQWdJQ0FnSUNBZ1BDOXVZWFkrWEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5TEZ4dUlDQnNhWE4wVm1sbGR6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJR1JwYzNCaGRHTm9aWEl1WkdsemNHRjBZMmdvZTF4dUlDQWdJQ0FnZEhsd1pUb2dKM1pwWlhjbkxGeHVJQ0FnSUNBZ2RtbGxkem9nSjJ4cGMzUW5YRzRnSUNBZ2ZTazdYRzRnSUgwc1hHNGdJSE5vWVhKbFZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUdScGMzQmhkR05vWlhJdVpHbHpjR0YwWTJnb2UxeHVJQ0FnSUNBZ2RIbHdaVG9nSjNacFpYY25MRnh1SUNBZ0lDQWdkbWxsZHpvZ0ozTm9ZWEpsSjF4dUlDQWdJSDBwTzF4dUlDQjlMRnh1SUNCelpXRnlZMmhXYVdWM09pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdaR2x6Y0dGMFkyaGxjaTVrYVhOd1lYUmphQ2g3WEc0Z0lDQWdJQ0IwZVhCbE9pQW5kbWxsZHljc1hHNGdJQ0FnSUNCMmFXVjNPaUFuYzJWaGNtTm9KMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCR2IyOTBaWEpDWVhJN1hHNGlYWDA9IiwidmFyIHN0b3JlO1xudmFyIFN0b3JlO1xudmFyIGRpc3BhdGNoZXIgID0gcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyk7XG52YXIgQmFja2JvbmUgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5TdG9yZSA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgZGlzcGF0Y2hIYW5kbGVyOiBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgIGNvbnNvbGUubG9nKHBheWxvYWQpO1xuICB9XG59KTtcblxuc3RvcmUgPSBuZXcgU3RvcmUoW1xuICB7Y3JlYXRlZDogbmV3IERhdGUoKSwgdGl0bGU6ICdPbmUnLCBrZXl3b3JkczogWydhdXRvbW9iaWxlJ10sIGlkOiAyM30sXG4gIHtjcmVhdGVkOiBuZXcgRGF0ZSgpLCB0aXRsZTogJ1R3bycsIGtleXdvcmRzOiBbJ2F1dG9tb2JpbGUnXSwgaWQ6IDMzfVxuXSk7XG5cbnN0b3JlLnRva2VuID0gZGlzcGF0Y2hlci5yZWdpc3RlcihzdG9yZS5kaXNwYXRjaEhhbmRsZXIuYmluZChzdG9yZSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzlzYVhOMFgzTjBiM0psTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVrc1MwRkJTeXhEUVVGRE8wRkJRMVlzU1VGQlNTeExRVUZMTEVOQlFVTTdRVUZEVml4SlFVRkpMRlZCUVZVc1NVRkJTU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZETVVNc1NVRkJTU3hSUVVGUkxFMUJRVTBzVDBGQlR5eERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPenRCUVVWMFF5eExRVUZMTEVkQlFVY3NVVUZCVVN4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU03UlVGRGFrTXNaVUZCWlN4RlFVRkZMRlZCUVZVc1QwRkJUeXhGUVVGRk8wbEJRMnhETEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UjBGRGRFSTdRVUZEU0N4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRlNDeExRVUZMTEVkQlFVY3NTVUZCU1N4TFFVRkxMRU5CUVVNN1JVRkRhRUlzUTBGQlF5eFBRVUZQTEVWQlFVVXNTVUZCU1N4SlFVRkpMRVZCUVVVc1JVRkJSU3hMUVVGTExFVkJRVVVzUzBGQlN5eEZRVUZGTEZGQlFWRXNSVUZCUlN4RFFVRkRMRmxCUVZrc1EwRkJReXhGUVVGRkxFVkJRVVVzUlVGQlJTeEZRVUZGTEVOQlFVTTdSVUZEY2tVc1EwRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeEpRVUZKTEVWQlFVVXNSVUZCUlN4TFFVRkxMRVZCUVVVc1MwRkJTeXhGUVVGRkxGRkJRVkVzUlVGQlJTeERRVUZETEZsQlFWa3NRMEZCUXl4RlFVRkZMRVZCUVVVc1JVRkJSU3hGUVVGRkxFTkJRVU03UVVGRGRrVXNRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzUzBGQlN5eERRVUZETEV0QlFVc3NSMEZCUnl4VlFVRlZMRU5CUVVNc1VVRkJVU3hEUVVGRExFdEJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYSkZMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzUzBGQlN5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJSE4wYjNKbE8xeHVkbUZ5SUZOMGIzSmxPMXh1ZG1GeUlHUnBjM0JoZEdOb1pYSWdJRDBnY21WeGRXbHlaU2duTGk5a2FYTndZWFJqYUdWeUp5azdYRzUyWVhJZ1FtRmphMkp2Ym1VZ0lDQWdQU0J5WlhGMWFYSmxLQ2RpWVdOclltOXVaU2NwTzF4dVhHNVRkRzl5WlNBOUlFSmhZMnRpYjI1bExrTnZiR3hsWTNScGIyNHVaWGgwWlc1a0tIdGNiaUFnWkdsemNHRjBZMmhJWVc1a2JHVnlPaUJtZFc1amRHbHZiaUFvY0dGNWJHOWhaQ2tnZTF4dUlDQWdJR052Ym5OdmJHVXViRzluS0hCaGVXeHZZV1FwTzF4dUlDQjlYRzU5S1R0Y2JseHVjM1J2Y21VZ1BTQnVaWGNnVTNSdmNtVW9XMXh1SUNCN1kzSmxZWFJsWkRvZ2JtVjNJRVJoZEdVb0tTd2dkR2wwYkdVNklDZFBibVVuTENCclpYbDNiM0prY3pvZ1d5ZGhkWFJ2Ylc5aWFXeGxKMTBzSUdsa09pQXlNMzBzWEc0Z0lIdGpjbVZoZEdWa09pQnVaWGNnUkdGMFpTZ3BMQ0IwYVhSc1pUb2dKMVIzYnljc0lHdGxlWGR2Y21Sek9pQmJKMkYxZEc5dGIySnBiR1VuWFN3Z2FXUTZJRE16ZlZ4dVhTazdYRzVjYm5OMGIzSmxMblJ2YTJWdUlEMGdaR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWh6ZEc5eVpTNWthWE53WVhSamFFaGhibVJzWlhJdVltbHVaQ2h6ZEc5eVpTa3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhOMGIzSmxPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgXyAgICAgICAgICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBUaXRsZUJhciAgICAgID0gcmVxdWlyZSgnLi90aXRsZV9iYXIuanN4Jyk7XG52YXIgSWNvbiAgICAgICAgICA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBkaXNwYXRjaGVyICAgID0gcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyk7XG52YXIgc3RvcmUgICAgICAgICA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcbnZhciBsaXN0X3N0b3JlICAgID0gcmVxdWlyZSgnLi9saXN0X3N0b3JlJyk7XG52YXIgbWFpbl9zdG9yZSAgICA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcbnZhciBQcmltYXJ5SW1hZ2UgID0gcmVxdWlyZSgnLi9wcmltYXJ5X2ltYWdlLmpzeCcpO1xudmFyIG1vbWVudGpzICAgICAgPSByZXF1aXJlKCdtb21lbnQnKTtcbnZhciBMaXN0VmlldztcblxuTGlzdFZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTGlzdFZpZXdcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByZV9jb250cm9scyAgPSBbXTtcbiAgICB2YXIgbW9tZW50cyAgICAgICA9IHRoaXMuYnVpbGRNb21lbnRzKCk7XG5cbiAgICBwcmVfY29udHJvbHMucHVzaChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiBcImNhdGVnb3J5XCIsIGNsYXNzTmFtZTogXCJ0b3AtY29udHJvbFwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwiYnV0dG9uXCIsIG9uQ2xpY2s6IHRoaXMuY2F0ZWdvcnlWaWV3fSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJsaXN0XCJ9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICAgIGlmICghIHRoaXMucHJvcHMuc2VhcmNoKSB7XG4gICAgICBwcmVfY29udHJvbHMucHVzaChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IFwic2VhcmNoXCIsIGNsYXNzTmFtZTogXCJ0b3AtY29udHJvbFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJidXR0b25cIiwgb25DbGljazogdGhpcy5zZWFyY2hWaWV3fSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcInNlYXJjaFwifSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJsaXN0LXZpZXdcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRpdGxlQmFyLCBudWxsLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibmF2XCIsIHtjbGFzc05hbWU6IFwidG9wLW5hdlwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCwgXG4gICAgICAgICAgICAgIHByZV9jb250cm9scy5tYXAoZnVuY3Rpb24gKGNvbnRyb2wpIHtyZXR1cm4gY29udHJvbDt9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksIFxuXG4gICAgICAgICAgXCJTYWZldHkgTW9tZW50c1wiLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcImJ1dHRvbiBjbG9zZS1idXR0b25cIiwgb25DbGljazogdGhpcy5jbG9zZVZpZXd9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwiY2xvc2VcIn0pXG4gICAgICAgICAgKVxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxpc3Qtb2YtbW9tZW50c1wifSwgXG4gICAgICAgICAgbW9tZW50c1xuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgc2VhcmNoVmlldzogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2F0ZWdvcnlWaWV3KCk7XG4gIH0sXG4gIGNhdGVnb3J5VmlldzogZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ3ZpZXcnLFxuICAgICAgdmlldzogJ2NhdGVnb3J5J1xuICAgIH0pO1xuICB9LFxuICBidWlsZE1vbWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9tZW50cztcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgdmFyIGNhdGVnb3J5ID0gc3RvcmUuZ2V0KCdjYXRlZ29yeScpO1xuXG4gICAgbW9tZW50cyA9IGxpc3Rfc3RvcmUuZmlsdGVyKGZ1bmN0aW9uIChtb21lbnQpIHtcbiAgICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgICByZXR1cm4gbW9tZW50LmdldCgna2V5d29yZHMnKS5pbmRleE9mKGNhdGVnb3J5KSA+IC0xO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGVsZW1lbnRzID0gXy5tYXAobW9tZW50cywgZnVuY3Rpb24gKG1vbWVudCwgaW5kZXgpIHtcbiAgICAgIHZhciBkYXRlID0gbW9tZW50anMobW9tZW50LmdldCgnY3JlYXRlZCcpKTtcbiAgICAgIHZhciBpbWFnZVByb3BzID0ge1xuICAgICAgICBpbWFnZTogICAgbW9tZW50LmdldCgnaW1hZ2UnKSxcbiAgICAgICAga2V5d29yZHM6IG1vbWVudC5nZXQoJ2tleXdvcmRzJylcbiAgICAgIH07XG5cbiAgICAgIGRhdGUgPSBkYXRlLmZvcm1hdCgnTU1NIE0sIFlZWVknKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IGluZGV4LCBjbGFzc05hbWU6IFwibW9tZW50XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5zZWxlY3RNb21lbnQuYmluZCh0aGlzLCBtb21lbnQuaWQpfSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGh1bWJcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByaW1hcnlJbWFnZSwgUmVhY3QuX19zcHJlYWQoe30sICBpbWFnZVByb3BzKSlcbiAgICAgICAgICAgICksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRpdGxlXCJ9LCBcbiAgICAgICAgICAgICAgbW9tZW50LmdldCgndGl0bGUnKVxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibXV0ZWQgc21hbGxcIn0sIFxuICAgICAgICAgICAgICBkYXRlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCwgZWxlbWVudHMpXG4gICAgKTtcbiAgfSxcbiAgc2VsZWN0TW9tZW50OiBmdW5jdGlvbiAoaWQpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICAgJ2Nob29zZScsXG4gICAgICB2YWx1ZTogIGlkXG4gICAgfSk7XG5cbiAgICB0aGlzLmNsb3NlVmlldygpO1xuICB9LFxuICBjbG9zZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICd2aWV3JyxcbiAgICAgIHZpZXc6IG51bGxcbiAgICB9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdFZpZXc7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXNhWE4wWDNacFpYY3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hMUVVGTExGZEJRVmNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNKRExFbEJRVWtzUTBGQlF5eGxRVUZsTEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVNeFF5eEpRVUZKTEZGQlFWRXNVVUZCVVN4UFFVRlBMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTXZReXhKUVVGSkxFbEJRVWtzV1VGQldTeFBRVUZQTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU1zUTBGQlF6dEJRVU4wUkN4SlFVRkpMRlZCUVZVc1RVRkJUU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZETlVNc1NVRkJTU3hMUVVGTExGZEJRVmNzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUTNaRExFbEJRVWtzVlVGQlZTeE5RVUZOTEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRCUVVNMVF5eEpRVUZKTEZWQlFWVXNUVUZCVFN4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGRrTXNTVUZCU1N4WlFVRlpMRWxCUVVrc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN1FVRkRia1FzU1VGQlNTeFJRVUZSTEZGQlFWRXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRM1JETEVsQlFVa3NVVUZCVVN4RFFVRkRPenRCUVVWaUxEaENRVUU0UWl4M1FrRkJRVHRGUVVNMVFpeE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRaXhKUVVGSkxGbEJRVmtzU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZETTBJc1NVRkJTU3hKUVVGSkxFOUJRVThzVTBGQlV5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkZMRU5CUVVNN08wbEJSWGhETEZsQlFWa3NRMEZCUXl4SlFVRkpPMDFCUTJZc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVOQlFVRXNRMEZCUXl4SFFVRkJMRVZCUVVjc1EwRkJReXhWUVVGQkxFVkJRVlVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4aFFVRmpMRU5CUVVFc1JVRkJRVHRSUVVONlF5eHZRa0ZCUVN4SFFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZGQlFVRXNSVUZCVVN4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZqTEVOQlFVRXNSVUZCUVR0VlFVTm9SQ3h2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlFTeERRVUZITEVOQlFVRTdVVUZEYkVJc1EwRkJRVHROUVVORUxFTkJRVUU3UVVGRFdDeExRVUZMTEVOQlFVTTdPMGxCUlVZc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RlFVRkZPMDFCUTNaQ0xGbEJRVmtzUTBGQlF5eEpRVUZKTzFGQlEyWXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFTkJRVUVzUTBGQlF5eEhRVUZCTEVWQlFVY3NRMEZCUXl4UlFVRkJMRVZCUVZFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGhRVUZqTEVOQlFVRXNSVUZCUVR0VlFVTjJReXh2UWtGQlFTeEhRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGRkJRVUVzUlVGQlVTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWxCUVVrc1EwRkJReXhWUVVGWkxFTkJRVUVzUlVGQlFUdFpRVU01UXl4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRU3hEUVVGSExFTkJRVUU3VlVGRGNFSXNRMEZCUVR0UlFVTkVMRU5CUVVFN1QwRkRUaXhEUVVGRE8wRkJRMUlzUzBGQlN6czdTVUZGUkR0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1YwRkJXU3hEUVVGQkxFVkJRVUU3VVVGRGVrSXNiMEpCUVVNc1VVRkJVU3hGUVVGQkxFbEJRVU1zUlVGQlFUdFZRVU5TTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNVMEZCVlN4RFFVRkJMRVZCUVVFN1dVRkRka0lzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRWxCUVVNc1JVRkJRVHRqUVVORUxGbEJRVmtzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4UFFVRlBMRVZCUVVVc1EwRkJReXhQUVVGUExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVVTdXVUZEY2tRc1EwRkJRVHRWUVVORUxFTkJRVUVzUlVGQlFUdEJRVUZCTzBGQlFVRXNWVUZCUVN4blFrRkJRU3hGUVVGQk8wRkJRVUVzVlVGSFRpeHZRa0ZCUVN4SFFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEhGQ1FVRkJMRVZCUVhGQ0xFTkJRVU1zVDBGQlFTeEZRVUZQTEVOQlFVVXNTVUZCU1N4RFFVRkRMRk5CUVZjc1EwRkJRU3hGUVVGQk8xbEJRekZFTEc5Q1FVRkRMRWxCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkJMRU5CUVVjc1EwRkJRVHRWUVVOdVFpeERRVUZCTzFGQlEwc3NRMEZCUVN4RlFVRkJPMUZCUTFnc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhwUWtGQmEwSXNRMEZCUVN4RlFVRkJPMVZCUXpsQ0xFOUJRVkU3VVVGRFRDeERRVUZCTzAxQlEwWXNRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hWUVVGVkxFVkJRVVVzV1VGQldUdEpRVU4wUWl4SlFVRkpMRU5CUVVNc1dVRkJXU3hGUVVGRkxFTkJRVU03UjBGRGNrSTdSVUZEUkN4WlFVRlpMRVZCUVVVc1dVRkJXVHRKUVVONFFpeFZRVUZWTEVOQlFVTXNVVUZCVVN4RFFVRkRPMDFCUTJ4Q0xFbEJRVWtzUlVGQlJTeE5RVUZOTzAxQlExb3NTVUZCU1N4RlFVRkZMRlZCUVZVN1MwRkRha0lzUTBGQlF5eERRVUZETzBkQlEwbzdSVUZEUkN4WlFVRlpMRVZCUVVVc1dVRkJXVHRKUVVONFFpeEpRVUZKTEU5QlFVOHNRMEZCUXp0SlFVTmFMRWxCUVVrc1VVRkJVU3hEUVVGRE8wRkJRMnBDTEVsQlFVa3NTVUZCU1N4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXpzN1NVRkZja01zVDBGQlR5eEhRVUZITEZWQlFWVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJWU3hOUVVGTkxFVkJRVVU3VFVGRE5VTXNTVUZCU1N4UlFVRlJMRVZCUVVVN1VVRkRXaXhQUVVGUExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUXpkRUxFOUJRVTg3TzAxQlJVUXNUMEZCVHl4SlFVRkpMRU5CUVVNN1FVRkRiRUlzUzBGQlN5eERRVUZETEVOQlFVTTdPMGxCUlVnc1VVRkJVU3hIUVVGSExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RlFVRkZMRlZCUVZVc1RVRkJUU3hGUVVGRkxFdEJRVXNzUlVGQlJUdE5RVU5xUkN4SlFVRkpMRWxCUVVrc1IwRkJSeXhSUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRE8wMUJRek5ETEVsQlFVa3NWVUZCVlN4SFFVRkhPMUZCUTJZc1MwRkJTeXhMUVVGTExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRPMUZCUXpkQ0xGRkJRVkVzUlVGQlJTeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZVc1EwRkJRenRCUVVONFF5eFBRVUZQTEVOQlFVTTdPMEZCUlZJc1RVRkJUU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4aFFVRmhMRU5CUVVNc1EwRkJRenM3VFVGRmJFTTdVVUZEUlN4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkZMRXRCUVVzc1JVRkJReXhEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZGQlFWTXNRMEZCUVN4RlFVRkJPMVZCUTJwRExHOUNRVUZCTEVkQlFVVXNSVUZCUVN4RFFVRkJMRU5CUVVNc1QwRkJRU3hGUVVGUExFTkJRVVVzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFMUJRVTBzUTBGQlF5eEZRVUZGTEVOQlFVY3NRMEZCUVN4RlFVRkJPMWxCUTI1RUxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVDBGQlVTeERRVUZCTEVWQlFVRTdZMEZEY2tJc2IwSkJRVU1zV1VGQldTeEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExGVkJRVmNzUTBGQlFTeERRVUZITEVOQlFVRTdXVUZETlVJc1EwRkJRU3hGUVVGQk8xbEJRMDRzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFBRVUZSTEVOQlFVRXNSVUZCUVR0alFVTndRaXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUlR0WlFVTnFRaXhEUVVGQkxFVkJRVUU3V1VGRFRpeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdGQlFXTXNRMEZCUVN4RlFVRkJPMk5CUXpGQ0xFbEJRVXM3V1VGRFJpeERRVUZCTzFWQlEwb3NRMEZCUVR0UlFVTkVMRU5CUVVFN1VVRkRURHRCUVVOU0xFdEJRVXNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXpzN1NVRkZWQ3hKUVVGSkxGRkJRVkVzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RlFVRkZPMDFCUTNaQ0xFOUJRVThzU1VGQlNTeERRVUZETzBGQlEyeENMRXRCUVVzN08wbEJSVVE3VFVGRFJTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1NVRkJReXhGUVVGRExGRkJRV01zUTBGQlFUdE5RVU51UWp0SFFVTklPMFZCUTBRc1dVRkJXU3hGUVVGRkxGVkJRVlVzUlVGQlJTeEZRVUZGTzBsQlF6RkNMRlZCUVZVc1EwRkJReXhSUVVGUkxFTkJRVU03VFVGRGJFSXNTVUZCU1N4SlFVRkpMRkZCUVZFN1RVRkRhRUlzUzBGQlN5eEhRVUZITEVWQlFVVTdRVUZEYUVJc1MwRkJTeXhEUVVGRExFTkJRVU03TzBsQlJVZ3NTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRE8wZEJRMnhDTzBWQlEwUXNVMEZCVXl4RlFVRkZMRmxCUVZrN1NVRkRja0lzVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXp0TlFVTnNRaXhKUVVGSkxFVkJRVVVzVFVGQlRUdE5RVU5hTEVsQlFVa3NSVUZCUlN4SlFVRkpPMHRCUTFnc1EwRkJReXhEUVVGRE8wZEJRMG83UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZGQlFWRXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1VtVmhZM1FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1MllYSWdYeUFnSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0ozVnVaR1Z5YzJOdmNtVW5LVHRjYm5aaGNpQlVhWFJzWlVKaGNpQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOTBhWFJzWlY5aVlYSXVhbk40SnlrN1hHNTJZWElnU1dOdmJpQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1TDJOdmJYQnZibVZ1ZEhNdmFXTnZiaTVxYzNnbktUdGNiblpoY2lCa2FYTndZWFJqYUdWeUlDQWdJRDBnY21WeGRXbHlaU2duTGk5a2FYTndZWFJqYUdWeUp5azdYRzUyWVhJZ2MzUnZjbVVnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmMzUnZjbVVuS1R0Y2JuWmhjaUJzYVhOMFgzTjBiM0psSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlzYVhOMFgzTjBiM0psSnlrN1hHNTJZWElnYldGcGJsOXpkRzl5WlNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YzNSdmNtVW5LVHRjYm5aaGNpQlFjbWx0WVhKNVNXMWhaMlVnSUQwZ2NtVnhkV2x5WlNnbkxpOXdjbWx0WVhKNVgybHRZV2RsTG1wemVDY3BPMXh1ZG1GeUlHMXZiV1Z1ZEdweklDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkdGIyMWxiblFuS1R0Y2JuWmhjaUJNYVhOMFZtbGxkenRjYmx4dVRHbHpkRlpwWlhjZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQndjbVZmWTI5dWRISnZiSE1nSUQwZ1cxMDdYRzRnSUNBZ2RtRnlJRzF2YldWdWRITWdJQ0FnSUNBZ1BTQjBhR2x6TG1KMWFXeGtUVzl0Wlc1MGN5Z3BPMXh1WEc0Z0lDQWdjSEpsWDJOdmJuUnliMnh6TG5CMWMyZ29YRzRnSUNBZ0lDQThiR2tnYTJWNVBWd2lZMkYwWldkdmNubGNJaUJqYkdGemMwNWhiV1U5WENKMGIzQXRZMjl1ZEhKdmJGd2lQbHh1SUNBZ0lDQWdJQ0E4WVNCamJHRnpjMDVoYldVOVhDSmlkWFIwYjI1Y0lpQnZia05zYVdOclBYdDBhR2x6TG1OaGRHVm5iM0o1Vm1sbGQzMCtYRzRnSUNBZ0lDQWdJQ0FnUEVsamIyNGdkSGx3WlQxY0lteHBjM1JjSWlBdlBseHVJQ0FnSUNBZ0lDQThMMkUrWEc0Z0lDQWdJQ0E4TDJ4cFBseHVJQ0FnSUNrN1hHNWNiaUFnSUNCcFppQW9JU0IwYUdsekxuQnliM0J6TG5ObFlYSmphQ2tnZTF4dUlDQWdJQ0FnY0hKbFgyTnZiblJ5YjJ4ekxuQjFjMmdvWEc0Z0lDQWdJQ0FnSUR4c2FTQnJaWGs5WENKelpXRnlZMmhjSWlCamJHRnpjMDVoYldVOVhDSjBiM0F0WTI5dWRISnZiRndpUGx4dUlDQWdJQ0FnSUNBZ0lEeGhJR05zWVhOelRtRnRaVDFjSW1KMWRIUnZibHdpSUc5dVEyeHBZMnM5ZTNSb2FYTXVjMlZoY21Ob1ZtbGxkMzArWEc0Z0lDQWdJQ0FnSUNBZ0lDQThTV052YmlCMGVYQmxQVndpYzJWaGNtTm9YQ0lnTHo1Y2JpQWdJQ0FnSUNBZ0lDQThMMkUrWEc0Z0lDQWdJQ0FnSUR3dmJHaytYRzRnSUNBZ0lDQXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW14cGMzUXRkbWxsZDF3aVBseHVJQ0FnSUNBZ0lDQThWR2wwYkdWQ1lYSStYRzRnSUNBZ0lDQWdJQ0FnUEc1aGRpQmpiR0Z6YzA1aGJXVTlYQ0owYjNBdGJtRjJYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQThkV3crWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSHR3Y21WZlkyOXVkSEp2YkhNdWJXRndLR1oxYm1OMGFXOXVJQ2hqYjI1MGNtOXNLU0I3Y21WMGRYSnVJR052Ym5SeWIydzdmU2w5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMM1ZzUGx4dUlDQWdJQ0FnSUNBZ0lEd3ZibUYyUGx4dVhHNGdJQ0FnSUNBZ0lDQWdVMkZtWlhSNUlFMXZiV1Z1ZEhOY2JpQWdJQ0FnSUNBZ0lDQThZU0JqYkdGemMwNWhiV1U5WENKaWRYUjBiMjRnWTJ4dmMyVXRZblYwZEc5dVhDSWdiMjVEYkdsamF6MTdkR2hwY3k1amJHOXpaVlpwWlhkOVBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEVsamIyNGdkSGx3WlQxY0ltTnNiM05sWENJZ0x6NWNiaUFnSUNBZ0lDQWdJQ0E4TDJFK1hHNGdJQ0FnSUNBZ0lEd3ZWR2wwYkdWQ1lYSStYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2liR2x6ZEMxdlppMXRiMjFsYm5SelhDSStYRzRnSUNBZ0lDQWdJQ0FnZTIxdmJXVnVkSE45WEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmU3hjYmlBZ2MyVmhjbU5vVm1sbGR6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFJvYVhNdVkyRjBaV2R2Y25sV2FXVjNLQ2s3WEc0Z0lIMHNYRzRnSUdOaGRHVm5iM0o1Vm1sbGR6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJR1JwYzNCaGRHTm9aWEl1WkdsemNHRjBZMmdvZTF4dUlDQWdJQ0FnZEhsd1pUb2dKM1pwWlhjbkxGeHVJQ0FnSUNBZ2RtbGxkem9nSjJOaGRHVm5iM0o1SjF4dUlDQWdJSDBwTzF4dUlDQjlMRnh1SUNCaWRXbHNaRTF2YldWdWRITTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2JXOXRaVzUwY3p0Y2JpQWdJQ0IyWVhJZ1pXeGxiV1Z1ZEhNN1hHNGdJQ0FnZG1GeUlHTmhkR1ZuYjNKNUlEMGdjM1J2Y21VdVoyVjBLQ2RqWVhSbFoyOXllU2NwTzF4dVhHNGdJQ0FnYlc5dFpXNTBjeUE5SUd4cGMzUmZjM1J2Y21VdVptbHNkR1Z5S0daMWJtTjBhVzl1SUNodGIyMWxiblFwSUh0Y2JpQWdJQ0FnSUdsbUlDaGpZWFJsWjI5eWVTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdiVzl0Wlc1MExtZGxkQ2duYTJWNWQyOXlaSE1uS1M1cGJtUmxlRTltS0dOaGRHVm5iM0o1S1NBK0lDMHhPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlR0Y2JpQWdJQ0I5S1R0Y2JseHVJQ0FnSUdWc1pXMWxiblJ6SUQwZ1h5NXRZWEFvYlc5dFpXNTBjeXdnWm5WdVkzUnBiMjRnS0cxdmJXVnVkQ3dnYVc1a1pYZ3BJSHRjYmlBZ0lDQWdJSFpoY2lCa1lYUmxJRDBnYlc5dFpXNTBhbk1vYlc5dFpXNTBMbWRsZENnblkzSmxZWFJsWkNjcEtUdGNiaUFnSUNBZ0lIWmhjaUJwYldGblpWQnliM0J6SUQwZ2UxeHVJQ0FnSUNBZ0lDQnBiV0ZuWlRvZ0lDQWdiVzl0Wlc1MExtZGxkQ2duYVcxaFoyVW5LU3hjYmlBZ0lDQWdJQ0FnYTJWNWQyOXlaSE02SUcxdmJXVnVkQzVuWlhRb0oydGxlWGR2Y21Sekp5bGNiaUFnSUNBZ0lIMDdYRzVjYmlBZ0lDQWdJR1JoZEdVZ1BTQmtZWFJsTG1admNtMWhkQ2duVFUxTklFMHNJRmxaV1ZrbktUdGNibHh1SUNBZ0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lDQWdQR3hwSUd0bGVUMTdhVzVrWlhoOUlHTnNZWE56VG1GdFpUMWNJbTF2YldWdWRGd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4aElHOXVRMnhwWTJzOWUzUm9hWE11YzJWc1pXTjBUVzl0Wlc1MExtSnBibVFvZEdocGN5d2diVzl0Wlc1MExtbGtLWDArWEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luUm9kVzFpWENJK1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4UWNtbHRZWEo1U1cxaFoyVWdleTR1TG1sdFlXZGxVSEp2Y0hOOUlDOCtYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWRHbDBiR1ZjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZTIxdmJXVnVkQzVuWlhRb0ozUnBkR3hsSnlsOVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYlhWMFpXUWdjMjFoYkd4Y0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2UyUmhkR1Y5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ0lDQThMMkUrWEc0Z0lDQWdJQ0FnSUR3dmJHaytYRzRnSUNBZ0lDQXBPMXh1SUNBZ0lIMHNJSFJvYVhNcE8xeHVYRzRnSUNBZ2FXWWdLR1ZzWlcxbGJuUnpMbXhsYm1kMGFDQThJREVwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUJ1ZFd4c08xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4ZFd3K2UyVnNaVzFsYm5SemZUd3ZkV3crWEc0Z0lDQWdLVHRjYmlBZ2ZTeGNiaUFnYzJWc1pXTjBUVzl0Wlc1ME9pQm1kVzVqZEdsdmJpQW9hV1FwSUh0Y2JpQWdJQ0JrYVhOd1lYUmphR1Z5TG1ScGMzQmhkR05vS0h0Y2JpQWdJQ0FnSUhSNWNHVTZJQ0FnSjJOb2IyOXpaU2NzWEc0Z0lDQWdJQ0IyWVd4MVpUb2dJR2xrWEc0Z0lDQWdmU2s3WEc1Y2JpQWdJQ0IwYUdsekxtTnNiM05sVm1sbGR5Z3BPMXh1SUNCOUxGeHVJQ0JqYkc5elpWWnBaWGM2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCa2FYTndZWFJqYUdWeUxtUnBjM0JoZEdOb0tIdGNiaUFnSUNBZ0lIUjVjR1U2SUNkMmFXVjNKeXhjYmlBZ0lDQWdJSFpwWlhjNklHNTFiR3hjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1RHbHpkRlpwWlhjN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBWaWV3O1xudmFyIFJlYWN0ICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFRvcEJhciAgICAgICAgPSByZXF1aXJlKCcuL3RvcF9iYXIuanN4Jyk7XG52YXIgRm9vdGVyQmFyICAgICA9IHJlcXVpcmUoJy4vZm9vdGVyX2Jhci5qc3gnKTtcbnZhciBTdW1tYXJ5ICAgICAgID0gcmVxdWlyZSgnLi9zdW1tYXJ5LmpzeCcpO1xudmFyIFNwb25zb3IgICAgICAgPSByZXF1aXJlKCcuL3Nwb25zb3IuanN4Jyk7XG52YXIgVGl0bGVCYXIgICAgICA9IHJlcXVpcmUoJy4vdGl0bGVfYmFyLmpzeCcpO1xudmFyIExpc3RWaWV3ICAgICAgPSByZXF1aXJlKCcuL2xpc3Rfdmlldy5qc3gnKTtcbnZhciBQcmltYXJ5SW1hZ2UgID0gcmVxdWlyZSgnLi9wcmltYXJ5X2ltYWdlLmpzeCcpO1xudmFyIG1vbWVudCAgICAgICAgPSByZXF1aXJlKCdtb21lbnQnKTtcbnZhciBzdG9yZSAgICAgICAgID0gcmVxdWlyZSgnLi9zdG9yZScpO1xuXG5WaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlZpZXdcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZpZXc6IG51bGwsXG4gICAgICBtb21lbnQ6IG51bGxcbiAgICB9O1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6ICAgICAgICAnU2FmZXR5IE1vbWVudCBUaXRsZScsXG4gICAgICBjcmVhdGVkOiAgICAgIG5ldyBEYXRlKCksXG4gICAgICBzdW1tYXJ5OiAgICAgICdTdW1tYXJ5IHRleHQnLFxuICAgICAgZGV0YWlsOiAgICAgICAnRGV0YWlsIHRleHQnLFxuICAgICAgaGVhZGVyX2ltYWdlOiB1bmRlZmluZWQsXG4gICAgICBrZXl3b3JkczogICAgIFtdXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdG9yZS50b0pTT04oKSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5vZmYoJ2NoYW5nZScpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlldyA9IHRoaXMuYnVpbGRWaWV3KCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRlbnRcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRvcEJhciwgbnVsbCksIFxuXG4gICAgICAgIHZpZXdcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBidWlsZFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZm47XG4gICAgdmFyIG1hcDtcblxuICAgIG1hcCA9IHtcbiAgICAgIHNlYXJjaDogJ2J1aWxkU2VhcmNoVmlldycsXG4gICAgICBzaGFyZTogJ2J1aWxkU2hhcmVWaWV3JyxcbiAgICAgIGxpc3Q6ICdidWlsZExpc3RWaWV3J1xuICAgIH07XG5cbiAgICBmbiA9IG1hcFt0aGlzLnN0YXRlLnZpZXddO1xuICAgIGZuID0gdGhpc1tmbl0gfHwgdGhpcy5idWlsZE1haW5WaWV3O1xuXG4gICAgcmV0dXJuIGZuLmNhbGwodGhpcyk7XG4gIH0sXG4gIGJ1aWxkTGlzdFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXN0Vmlldywge3NlYXJjaDogdHJ1ZX0pXG4gICAgKTtcbiAgfSxcbiAgYnVpbGRNYWluVmlldzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBrZXl3b3JkcyA9IG51bGw7XG4gICAgdmFyIGltYWdlUHJvcHM7XG4gICAgdmFyIGRhdGUgPSBtb21lbnQodGhpcy5wcm9wcy5jcmVhdGVkKTtcblxuICAgIGRhdGUgPSBkYXRlLmZvcm1hdCgnTU1NIE0sIFlZWVknKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmtleXdvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGtleXdvcmRzID0gdGhpcy5wcm9wcy5rZXl3b3Jkcy5qb2luKCcsICcpO1xuICAgIH1cblxuICAgIGltYWdlUHJvcHMgPSB7XG4gICAgICBpbWFnZTogICAgdGhpcy5wcm9wcy5pbWFnZSxcbiAgICAgIGtleXdvcmRzOiB0aGlzLnByb3BzLmtleXdvcmRzXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibWFpbi12aWV3XCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaXRsZUJhciwgbnVsbCwgXG4gICAgICAgICAgdGhpcy5wcm9wcy50aXRsZVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByaW1hcnlJbWFnZSwgUmVhY3QuX19zcHJlYWQoe30sICBpbWFnZVByb3BzKSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtdXRlZCBzbWFsbFwifSwga2V5d29yZHMpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm11dGVkIHNtYWxsXCJ9LCBcIkNyZWF0ZWQgXCIsIGRhdGUpLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFN1bW1hcnksIHt2YWx1ZTogdGhpcy5wcm9wcy5zdW1tYXJ5fSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3BvbnNvciwgbnVsbCksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLCBcIkRldGFpbHM6XCIpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTdW1tYXJ5LCB7dmFsdWU6IHRoaXMucHJvcHMuZGV0YWlsfSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9vdGVyQmFyLCBudWxsKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXRZV2x1WDNacFpYY3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hKUVVGSkxFTkJRVU03UVVGRFZDeEpRVUZKTEV0QlFVc3NWMEZCVnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGNrTXNTVUZCU1N4TlFVRk5MRlZCUVZVc1QwRkJUeXhEUVVGRExHVkJRV1VzUTBGQlF5eERRVUZETzBGQlF6ZERMRWxCUVVrc1UwRkJVeXhQUVVGUExFOUJRVThzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhEUVVGRE8wRkJRMmhFTEVsQlFVa3NUMEZCVHl4VFFVRlRMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVU0zUXl4SlFVRkpMRTlCUVU4c1UwRkJVeXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdRVUZETjBNc1NVRkJTU3hSUVVGUkxGRkJRVkVzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGREwwTXNTVUZCU1N4UlFVRlJMRkZCUVZFc1QwRkJUeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1FVRkRMME1zU1VGQlNTeFpRVUZaTEVsQlFVa3NUMEZCVHl4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVOQlFVTTdRVUZEYmtRc1NVRkJTU3hOUVVGTkxGVkJRVlVzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTNSRExFbEJRVWtzUzBGQlN5eFhRVUZYTEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenM3UVVGRmRrTXNNRUpCUVRCQ0xHOUNRVUZCTzBWQlEzaENMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVODdUVUZEVEN4SlFVRkpMRVZCUVVVc1NVRkJTVHROUVVOV0xFMUJRVTBzUlVGQlJTeEpRVUZKTzB0QlEySXNRMEZCUXp0SFFVTklPMFZCUTBRc1pVRkJaU3hGUVVGRkxGbEJRVms3U1VGRE0wSXNUMEZCVHp0TlFVTk1MRXRCUVVzc1UwRkJVeXh4UWtGQmNVSTdUVUZEYmtNc1QwRkJUeXhQUVVGUExFbEJRVWtzU1VGQlNTeEZRVUZGTzAxQlEzaENMRTlCUVU4c1QwRkJUeXhqUVVGak8wMUJRelZDTEUxQlFVMHNVVUZCVVN4aFFVRmhPMDFCUXpOQ0xGbEJRVmtzUlVGQlJTeFRRVUZUTzAxQlEzWkNMRkZCUVZFc1RVRkJUU3hGUVVGRk8wdEJRMnBDTEVOQlFVTTdSMEZEU0R0RlFVTkVMR2xDUVVGcFFpeEZRVUZGTEZsQlFWazdTVUZETjBJc1MwRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF5eFJRVUZSTEVWQlFVVXNXVUZCV1R0TlFVTTNRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhEUVVGRE8wdEJReTlDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UjBGRFpqdEZRVU5FTEc5Q1FVRnZRaXhGUVVGRkxGbEJRVms3U1VGRGFFTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEhRVU55UWp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wRkJRM1JDTEVsQlFVa3NTVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZET3p0SlFVVTFRanROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVTBGQlZTeERRVUZCTEVWQlFVRTdRVUZETDBJc1VVRkJVU3h2UWtGQlF5eE5RVUZOTEVWQlFVRXNTVUZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHM3VVVGRlZDeEpRVUZMTzAxQlEwWXNRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hUUVVGVExFVkJRVVVzV1VGQldUdEpRVU55UWl4SlFVRkpMRVZCUVVVc1EwRkJRenRCUVVOWUxFbEJRVWtzU1VGQlNTeEhRVUZITEVOQlFVTTdPMGxCUlZJc1IwRkJSeXhIUVVGSE8wMUJRMG9zVFVGQlRTeEZRVUZGTEdsQ1FVRnBRanROUVVONlFpeExRVUZMTEVWQlFVVXNaMEpCUVdkQ08wMUJRM1pDTEVsQlFVa3NSVUZCUlN4bFFVRmxPMEZCUXpOQ0xFdEJRVXNzUTBGQlF6czdTVUZGUml4RlFVRkZMRWRCUVVjc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRPVUlzU1VGQlNTeEZRVUZGTEVkQlFVY3NTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhKUVVGSkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTTdPMGxCUlhCRExFOUJRVThzUlVGQlJTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRIUVVOMFFqdEZRVU5FTEdGQlFXRXNSVUZCUlN4WlFVRlpPMGxCUTNwQ08wMUJRMFVzYjBKQlFVTXNVVUZCVVN4RlFVRkJMRU5CUVVFc1EwRkJReXhOUVVGQkxFVkJRVTBzUTBGQlJTeEpRVUZMTEVOQlFVRXNRMEZCUnl4RFFVRkJPMDFCUXpGQ08wZEJRMGc3UlVGRFJDeGhRVUZoTEVWQlFVVXNXVUZCV1R0SlFVTjZRaXhKUVVGSkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTTdTVUZEY0VJc1NVRkJTU3hWUVVGVkxFTkJRVU03UVVGRGJrSXNTVUZCU1N4SlFVRkpMRWxCUVVrc1IwRkJSeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenM3UVVGRk1VTXNTVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXpzN1NVRkZiRU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzAxQlEyeERMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGFFUXNTMEZCU3pzN1NVRkZSQ3hWUVVGVkxFZEJRVWM3VFVGRFdDeExRVUZMTEV0QlFVc3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTE8wMUJRekZDTEZGQlFWRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkU3UVVGRGJrTXNTMEZCU3l4RFFVRkRPenRKUVVWR08wMUJRMFVzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFhRVUZaTEVOQlFVRXNSVUZCUVR0UlFVTjZRaXh2UWtGQlF5eFJRVUZSTEVWQlFVRXNTVUZCUXl4RlFVRkJPMVZCUTFBc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eExRVUZOTzBGQlF6VkNMRkZCUVcxQ0xFTkJRVUVzUlVGQlFUczdRVUZGYmtJc1VVRkJVU3h2UWtGQlF5eFpRVUZaTEVWQlFVRXNaMEpCUVVFc1IwRkJRU3hEUVVGRkxFZEJRVWNzVlVGQlZ5eERRVUZCTEVOQlFVY3NRMEZCUVN4RlFVRkJPenRSUVVWb1F5eHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdGQlFXTXNRMEZCUVN4RlFVRkRMRkZCUVdVc1EwRkJRU3hGUVVGQk8wRkJRM0pFTEZGQlFWRXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4aFFVRmpMRU5CUVVFc1JVRkJRU3hWUVVGQkxFVkJRVk1zU1VGQlZ5eERRVUZCTEVWQlFVRTdPMEZCUlhwRUxGRkJRVkVzYjBKQlFVTXNUMEZCVHl4RlFVRkJMRU5CUVVFc1EwRkJReXhMUVVGQkxFVkJRVXNzUTBGQlJTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTlCUVZFc1EwRkJRU3hEUVVGSExFTkJRVUVzUlVGQlFUczdRVUZGT1VNc1VVRkJVU3h2UWtGQlF5eFBRVUZQTEVWQlFVRXNTVUZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHM3VVVGRldDeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1NVRkJReXhGUVVGQkxGVkJRV0VzUTBGQlFTeEZRVUZCTzBGQlEzcENMRkZCUVZFc2IwSkJRVU1zVDBGQlR5eEZRVUZCTEVOQlFVRXNRMEZCUXl4TFFVRkJMRVZCUVVzc1EwRkJSU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVOHNRMEZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHM3VVVGRmNrTXNiMEpCUVVNc1UwRkJVeXhGUVVGQkxFbEJRVUVzUTBGQlJ5eERRVUZCTzAxQlExUXNRMEZCUVR0TlFVTk9PMGRCUTBnN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdWbWxsZHp0Y2JuWmhjaUJTWldGamRDQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCVWIzQkNZWElnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5MGIzQmZZbUZ5TG1wemVDY3BPMXh1ZG1GeUlFWnZiM1JsY2tKaGNpQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyWnZiM1JsY2w5aVlYSXVhbk40SnlrN1hHNTJZWElnVTNWdGJXRnllU0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YzNWdGJXRnllUzVxYzNnbktUdGNiblpoY2lCVGNHOXVjMjl5SUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5emNHOXVjMjl5TG1wemVDY3BPMXh1ZG1GeUlGUnBkR3hsUW1GeUlDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwzUnBkR3hsWDJKaGNpNXFjM2duS1R0Y2JuWmhjaUJNYVhOMFZtbGxkeUFnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlzYVhOMFgzWnBaWGN1YW5ONEp5azdYRzUyWVhJZ1VISnBiV0Z5ZVVsdFlXZGxJQ0E5SUhKbGNYVnBjbVVvSnk0dmNISnBiV0Z5ZVY5cGJXRm5aUzVxYzNnbktUdGNiblpoY2lCdGIyMWxiblFnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duYlc5dFpXNTBKeWs3WEc1MllYSWdjM1J2Y21VZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZjM1J2Y21VbktUdGNibHh1Vm1sbGR5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ1oyVjBTVzVwZEdsaGJGTjBZWFJsT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUhacFpYYzZJRzUxYkd3c1hHNGdJQ0FnSUNCdGIyMWxiblE2SUc1MWJHeGNiaUFnSUNCOU8xeHVJQ0I5TEZ4dUlDQm5aWFJFWldaaGRXeDBVSEp2Y0hNNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ2RHbDBiR1U2SUNBZ0lDQWdJQ0FuVTJGbVpYUjVJRTF2YldWdWRDQlVhWFJzWlNjc1hHNGdJQ0FnSUNCamNtVmhkR1ZrT2lBZ0lDQWdJRzVsZHlCRVlYUmxLQ2tzWEc0Z0lDQWdJQ0J6ZFcxdFlYSjVPaUFnSUNBZ0lDZFRkVzF0WVhKNUlIUmxlSFFuTEZ4dUlDQWdJQ0FnWkdWMFlXbHNPaUFnSUNBZ0lDQW5SR1YwWVdsc0lIUmxlSFFuTEZ4dUlDQWdJQ0FnYUdWaFpHVnlYMmx0WVdkbE9pQjFibVJsWm1sdVpXUXNYRzRnSUNBZ0lDQnJaWGwzYjNKa2N6b2dJQ0FnSUZ0ZFhHNGdJQ0FnZlR0Y2JpQWdmU3hjYmlBZ1kyOXRjRzl1Wlc1MFJHbGtUVzkxYm5RNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnpkRzl5WlM1dmJpZ25ZMmhoYm1kbEp5d2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaHpkRzl5WlM1MGIwcFRUMDRvS1NrN1hHNGdJQ0FnZlM1aWFXNWtLSFJvYVhNcEtUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBWMmxzYkZWdWJXOTFiblE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCemRHOXlaUzV2Wm1Zb0oyTm9ZVzVuWlNjcE8xeHVJQ0I5TEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnZG1sbGR5QTlJSFJvYVhNdVluVnBiR1JXYVdWM0tDazdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKamIyNTBaVzUwWENJK1hHNGdJQ0FnSUNBZ0lEeFViM0JDWVhJZ0x6NWNibHh1SUNBZ0lDQWdJQ0I3ZG1sbGQzMWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUdKMWFXeGtWbWxsZHpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJtYmp0Y2JpQWdJQ0IyWVhJZ2JXRndPMXh1WEc0Z0lDQWdiV0Z3SUQwZ2UxeHVJQ0FnSUNBZ2MyVmhjbU5vT2lBblluVnBiR1JUWldGeVkyaFdhV1YzSnl4Y2JpQWdJQ0FnSUhOb1lYSmxPaUFuWW5WcGJHUlRhR0Z5WlZacFpYY25MRnh1SUNBZ0lDQWdiR2x6ZERvZ0oySjFhV3hrVEdsemRGWnBaWGNuWEc0Z0lDQWdmVHRjYmx4dUlDQWdJR1p1SUQwZ2JXRndXM1JvYVhNdWMzUmhkR1V1ZG1sbGQxMDdYRzRnSUNBZ1ptNGdQU0IwYUdselcyWnVYU0I4ZkNCMGFHbHpMbUoxYVd4a1RXRnBibFpwWlhjN1hHNWNiaUFnSUNCeVpYUjFjbTRnWm00dVkyRnNiQ2gwYUdsektUdGNiaUFnZlN4Y2JpQWdZblZwYkdSTWFYTjBWbWxsZHpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFRHbHpkRlpwWlhjZ2MyVmhjbU5vUFh0MGNuVmxmU0F2UGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUdKMWFXeGtUV0ZwYmxacFpYYzZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2EyVjVkMjl5WkhNZ1BTQnVkV3hzTzF4dUlDQWdJSFpoY2lCcGJXRm5aVkJ5YjNCek8xeHVJQ0FnSUhaaGNpQmtZWFJsSUQwZ2JXOXRaVzUwS0hSb2FYTXVjSEp2Y0hNdVkzSmxZWFJsWkNrN1hHNWNiaUFnSUNCa1lYUmxJRDBnWkdGMFpTNW1iM0p0WVhRb0owMU5UU0JOTENCWldWbFpKeWs3WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NXJaWGwzYjNKa2N5NXNaVzVuZEdnZ1BpQXdLU0I3WEc0Z0lDQWdJQ0JyWlhsM2IzSmtjeUE5SUhSb2FYTXVjSEp2Y0hNdWEyVjVkMjl5WkhNdWFtOXBiaWduTENBbktUdGNiaUFnSUNCOVhHNWNiaUFnSUNCcGJXRm5aVkJ5YjNCeklEMGdlMXh1SUNBZ0lDQWdhVzFoWjJVNklDQWdJSFJvYVhNdWNISnZjSE11YVcxaFoyVXNYRzRnSUNBZ0lDQnJaWGwzYjNKa2N6b2dkR2hwY3k1d2NtOXdjeTVyWlhsM2IzSmtjMXh1SUNBZ0lIMDdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKdFlXbHVMWFpwWlhkY0lqNWNiaUFnSUNBZ0lDQWdQRlJwZEd4bFFtRnlQbHh1SUNBZ0lDQWdJQ0FnSUh0MGFHbHpMbkJ5YjNCekxuUnBkR3hsZlZ4dUlDQWdJQ0FnSUNBOEwxUnBkR3hsUW1GeVBseHVYRzRnSUNBZ0lDQWdJRHhRY21sdFlYSjVTVzFoWjJVZ2V5NHVMbWx0WVdkbFVISnZjSE45SUM4K1hHNWNiaUFnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSnRkWFJsWkNCemJXRnNiRndpUG50clpYbDNiM0prYzMwOEwyUnBkajVjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p0ZFhSbFpDQnpiV0ZzYkZ3aVBrTnlaV0YwWldRZ2UyUmhkR1Y5UEM5a2FYWStYRzVjYmlBZ0lDQWdJQ0FnUEZOMWJXMWhjbmtnZG1Gc2RXVTllM1JvYVhNdWNISnZjSE11YzNWdGJXRnllWDBnTHo1Y2JseHVJQ0FnSUNBZ0lDQThVM0J2Ym5OdmNpQXZQbHh1WEc0Z0lDQWdJQ0FnSUR4b016NUVaWFJoYVd4ek9qd3ZhRE0rWEc0Z0lDQWdJQ0FnSUR4VGRXMXRZWEo1SUhaaGJIVmxQWHQwYUdsekxuQnliM0J6TG1SbGRHRnBiSDBnTHo1Y2JseHVJQ0FnSUNBZ0lDQThSbTl2ZEdWeVFtRnlJQzgrWEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JXYVdWM08xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uICAgID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9pY29uLmpzeCcpO1xudmFyIFByaW1hcnlJbWFnZTtcblxuUHJpbWFyeUltYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlByaW1hcnlJbWFnZVwiLFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAga2V5d29yZHM6IFtdXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIEltYWdlRWw7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5pbWFnZSkge1xuICAgICAgSW1hZ2VFbCA9IHRoaXMuYnVpbGRGcm9tSW1hZ2UoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBJbWFnZUVsID0gdGhpcy5idWlsZEZyb21DYXRlZ29yeSgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBJbWFnZUVsXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgYnVpbGRGcm9tQ2F0ZWdvcnk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ZWdvcnkgPSB0aGlzLnByb3BzLmtleXdvcmRzIHx8IFtdO1xuXG4gICAgY2F0ZWdvcnkgPSBjYXRlZ29yeVswXSB8fCAnYmFuJztcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJpbWFyeS1pbWFnZS1mYWtlXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogY2F0ZWdvcnl9KVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGJ1aWxkRnJvbUltYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGltYWdlID0gdGhpcy5wcm9wcy5pbWFnZTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtzcmM6IGltYWdlLCBjbGFzc05hbWU6IFwicHJpbWFyeS1pbWFnZVwifSlcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmltYXJ5SW1hZ2U7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXdjbWx0WVhKNVgybHRZV2RsTG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhKUVVGSkxFbEJRVWtzVFVGQlRTeFBRVUZQTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU1zUTBGQlF6dEJRVU5vUkN4SlFVRkpMRmxCUVZrc1EwRkJRenM3UVVGRmFrSXNhME5CUVd0RExEUkNRVUZCTzBWQlEyaERMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVODdUVUZEVEN4UlFVRlJMRVZCUVVVc1JVRkJSVHRMUVVOaUxFTkJRVU03UjBGRFNEdEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMEZCUTNSQ0xFbEJRVWtzU1VGQlNTeFBRVUZQTEVOQlFVTTdPMGxCUlZvc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NSVUZCUlR0TlFVTndRaXhQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEdOQlFXTXNSVUZCUlN4RFFVRkRPMHRCUTJwRE8xTkJRMGs3VFVGRFNDeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTEVOQlFVTTdRVUZEZWtNc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hKUVVGRExFVkJRVUU3VVVGRFJpeFBRVUZSTzAxQlEwd3NRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hwUWtGQmFVSXNSVUZCUlN4WlFVRlpPMEZCUTJwRExFbEJRVWtzU1VGQlNTeFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFbEJRVWtzUlVGQlJTeERRVUZET3p0QlFVVTNReXhKUVVGSkxGRkJRVkVzUjBGQlJ5eFJRVUZSTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1MwRkJTeXhEUVVGRE96dEpRVVZvUXp0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc2IwSkJRWEZDTEVOQlFVRXNSVUZCUVR0UlFVTnNReXh2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRkxGRkJRVk1zUTBGQlFTeERRVUZITEVOQlFVRTdUVUZEY0VJc1EwRkJRVHROUVVOT08wZEJRMGc3UlVGRFJDeGpRVUZqTEVWQlFVVXNXVUZCV1R0QlFVTTVRaXhKUVVGSkxFbEJRVWtzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRE96dEpRVVUzUWp0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVVc1MwRkJTeXhGUVVGRExFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNaVUZCWlN4RFFVRkJMRU5CUVVjc1EwRkJRVHROUVVNM1F6dEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4WlFVRlpMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGSmxZV04wSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUVsamIyNGdJQ0FnUFNCeVpYRjFhWEpsS0NjdUxpOWpiMjF3YjI1bGJuUnpMMmxqYjI0dWFuTjRKeWs3WEc1MllYSWdVSEpwYldGeWVVbHRZV2RsTzF4dVhHNVFjbWx0WVhKNVNXMWhaMlVnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJR2RsZEVSbFptRjFiSFJRY205d2N6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQnJaWGwzYjNKa2N6b2dXMTFjYmlBZ0lDQjlPMXh1SUNCOUxGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1NXMWhaMlZGYkR0Y2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbWx0WVdkbEtTQjdYRzRnSUNBZ0lDQkpiV0ZuWlVWc0lEMGdkR2hwY3k1aWRXbHNaRVp5YjIxSmJXRm5aU2dwTzF4dUlDQWdJSDFjYmlBZ0lDQmxiSE5sSUh0Y2JpQWdJQ0FnSUVsdFlXZGxSV3dnUFNCMGFHbHpMbUoxYVd4a1JuSnZiVU5oZEdWbmIzSjVLQ2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFkrWEc0Z0lDQWdJQ0FnSUh0SmJXRm5aVVZzZlZ4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlN4Y2JpQWdZblZwYkdSR2NtOXRRMkYwWldkdmNuazZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1kyRjBaV2R2Y25rZ1BTQjBhR2x6TG5CeWIzQnpMbXRsZVhkdmNtUnpJSHg4SUZ0ZE8xeHVYRzRnSUNBZ1kyRjBaV2R2Y25rZ1BTQmpZWFJsWjI5eWVWc3dYU0I4ZkNBblltRnVKenRjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luQnlhVzFoY25rdGFXMWhaMlV0Wm1GclpWd2lQbHh1SUNBZ0lDQWdJQ0E4U1dOdmJpQjBlWEJsUFh0allYUmxaMjl5ZVgwZ0x6NWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUdKMWFXeGtSbkp2YlVsdFlXZGxPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHbHRZV2RsSUQwZ2RHaHBjeTV3Y205d2N5NXBiV0ZuWlR0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4YVcxbklITnlZejE3YVcxaFoyVjlJR05zWVhOelRtRnRaVDFjSW5CeWFXMWhjbmt0YVcxaFoyVmNJaUF2UGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGQnlhVzFoY25sSmJXRm5aVHRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFNwb25zb3I7XG5cblNwb25zb3IgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU3BvbnNvclwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInNwb25zb3JcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic21hbGwgbXV0ZWRcIn0sIFxuICAgICAgICAgIFwiU3BvbnNvcmVkIGJ5OlwiXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3BvbnNvci1jb250ZW50XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInNwb25zb3ItaW1hZ2VcIn0pLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInNwb25zb3ItbmFtZVwifSwgXG4gICAgICAgICAgICBcIkhpbHRpIHJpc2sgYXNzdW1wdGlvbiBwcm9kdWN0c1wiXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3BvbnNvcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5emNHOXVjMjl5TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhKUVVGSkxFOUJRVThzUTBGQlF6czdRVUZGV2l3MlFrRkJOa0lzZFVKQlFVRTdSVUZETTBJc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSTdUVUZEUlN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRk5CUVZVc1EwRkJRU3hGUVVGQk8xRkJRM1pDTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNZVUZCWXl4RFFVRkJMRVZCUVVFN1FVRkJRU3hWUVVGQkxHVkJRVUU3UVVGQlFTeFJRVVYyUWl4RFFVRkJMRVZCUVVFN1VVRkRUaXh2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHbENRVUZyUWl4RFFVRkJMRVZCUVVFN1ZVRkRMMElzYjBKQlFVRXNUVUZCU3l4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGxRVUZsTEVOQlFVRXNRMEZCUnl4RFFVRkJMRVZCUVVFN1ZVRkRiRU1zYjBKQlFVRXNUVUZCU3l4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGpRVUZsTEVOQlFVRXNSVUZCUVR0QlFVRkJMRmxCUVVFc1owTkJRVUU3UVVGQlFTeFZRVVY0UWl4RFFVRkJPMUZCUTBnc1EwRkJRVHROUVVOR0xFTkJRVUU3VFVGRFRqdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGSmxZV04wSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUZOd2IyNXpiM0k3WEc1Y2JsTndiMjV6YjNJZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbk53YjI1emIzSmNJajVjYmlBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0p6YldGc2JDQnRkWFJsWkZ3aVBseHVJQ0FnSUNBZ0lDQWdJRk53YjI1emIzSmxaQ0JpZVRwY2JpQWdJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYzNCdmJuTnZjaTFqYjI1MFpXNTBYQ0krWEc0Z0lDQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aWMzQnZibk52Y2kxcGJXRm5aVndpSUM4K1hHNGdJQ0FnSUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2ljM0J2Ym5OdmNpMXVZVzFsWENJK1hHNGdJQ0FnSUNBZ0lDQWdJQ0JJYVd4MGFTQnlhWE5ySUdGemMzVnRjSFJwYjI0Z2NISnZaSFZqZEhOY2JpQWdJQ0FnSUNBZ0lDQThMM053WVc0K1hHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVTNCdmJuTnZjanRjYmlKZGZRPT0iLCJ2YXIgc3RvcmU7XG52YXIgU3RvcmU7XG52YXIgZGlzcGF0Y2hlciAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKTtcbnZhciBCYWNrYm9uZSAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cblN0b3JlID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgZGVmYXVsdHM6IHtcbiAgICB2aWV3OiAgICAgbnVsbCxcbiAgICBjYXRlZ29yeTogbnVsbCxcbiAgICBtb21lbnQ6ICAgbnVsbFxuICB9LFxuICBkaXNwYXRjaEhhbmRsZXI6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgc3dpdGNoIChwYXlsb2FkLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3ZpZXcnOlxuICAgICAgICB0aGlzLnNldCgndmlldycsIHBheWxvYWQudmlldyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2hvb3NlJzpcbiAgICAgICAgdGhpcy5zZXQoJ21vbWVudCcsIHBheWxvYWQudmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NhdGVnb3J5JzpcbiAgICAgICAgdGhpcy5zZXQoJ2NhdGVnb3J5JywgcGF5bG9hZC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufSk7XG5cbnN0b3JlID0gbmV3IFN0b3JlKCk7XG5cbnN0b3JlLnRva2VuID0gZGlzcGF0Y2hlci5yZWdpc3RlcihzdG9yZS5kaXNwYXRjaEhhbmRsZXIuYmluZChzdG9yZSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzl6ZEc5eVpTNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4SlFVRkpMRXRCUVVzc1EwRkJRenRCUVVOV0xFbEJRVWtzUzBGQlN5eERRVUZETzBGQlExWXNTVUZCU1N4VlFVRlZMRWxCUVVrc1QwRkJUeXhEUVVGRExHTkJRV01zUTBGQlF5eERRVUZETzBGQlF6RkRMRWxCUVVrc1VVRkJVU3hOUVVGTkxFOUJRVThzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXpzN1FVRkZkRU1zUzBGQlN5eEhRVUZITEZGQlFWRXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRE8wVkJRelZDTEZGQlFWRXNSVUZCUlR0SlFVTlNMRWxCUVVrc1RVRkJUU3hKUVVGSk8wbEJRMlFzVVVGQlVTeEZRVUZGTEVsQlFVazdTVUZEWkN4TlFVRk5MRWxCUVVrc1NVRkJTVHRIUVVObU8wVkJRMFFzWlVGQlpTeEZRVUZGTEZWQlFWVXNUMEZCVHl4RlFVRkZPMGxCUTJ4RExGRkJRVkVzVDBGQlR5eERRVUZETEVsQlFVazdUVUZEYkVJc1MwRkJTeXhOUVVGTk8xRkJRMVFzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4TlFVRk5MRVZCUVVVc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzFGQlF5OUNMRTFCUVUwN1RVRkRVaXhMUVVGTExGRkJRVkU3VVVGRFdDeEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRkZCUVZFc1JVRkJSU3hQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdVVUZEYkVNc1RVRkJUVHROUVVOU0xFdEJRVXNzVlVGQlZUdFJRVU5pTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFOUJRVThzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0UlFVTndReXhOUVVGTk8wdEJRMVE3UjBGRFJqdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFdEJRVXNzUjBGQlJ5eEpRVUZKTEV0QlFVc3NSVUZCUlN4RFFVRkRPenRCUVVWd1FpeExRVUZMTEVOQlFVTXNTMEZCU3l4SFFVRkhMRlZCUVZVc1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEdWQlFXVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGY2tVc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eExRVUZMTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUoyWVhJZ2MzUnZjbVU3WEc1MllYSWdVM1J2Y21VN1hHNTJZWElnWkdsemNHRjBZMmhsY2lBZ1BTQnlaWEYxYVhKbEtDY3VMMlJwYzNCaGRHTm9aWEluS1R0Y2JuWmhjaUJDWVdOclltOXVaU0FnSUNBOUlISmxjWFZwY21Vb0oySmhZMnRpYjI1bEp5azdYRzVjYmxOMGIzSmxJRDBnUW1GamEySnZibVV1VFc5a1pXd3VaWGgwWlc1a0tIdGNiaUFnWkdWbVlYVnNkSE02SUh0Y2JpQWdJQ0IyYVdWM09pQWdJQ0FnYm5Wc2JDeGNiaUFnSUNCallYUmxaMjl5ZVRvZ2JuVnNiQ3hjYmlBZ0lDQnRiMjFsYm5RNklDQWdiblZzYkZ4dUlDQjlMRnh1SUNCa2FYTndZWFJqYUVoaGJtUnNaWEk2SUdaMWJtTjBhVzl1SUNod1lYbHNiMkZrS1NCN1hHNGdJQ0FnYzNkcGRHTm9JQ2h3WVhsc2IyRmtMblI1Y0dVcElIdGNiaUFnSUNBZ0lHTmhjMlVnSjNacFpYY25PbHh1SUNBZ0lDQWdJQ0IwYUdsekxuTmxkQ2duZG1sbGR5Y3NJSEJoZVd4dllXUXVkbWxsZHlrN1hHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJQ0FnWTJGelpTQW5ZMmh2YjNObEp6cGNiaUFnSUNBZ0lDQWdkR2hwY3k1elpYUW9KMjF2YldWdWRDY3NJSEJoZVd4dllXUXVkbUZzZFdVcE8xeHVJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUdOaGMyVWdKMk5oZEdWbmIzSjVKenBjYmlBZ0lDQWdJQ0FnZEdocGN5NXpaWFFvSjJOaGRHVm5iM0o1Snl3Z2NHRjViRzloWkM1MllXeDFaU2s3WEc0Z0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lIMWNiaUFnZlZ4dWZTazdYRzVjYm5OMGIzSmxJRDBnYm1WM0lGTjBiM0psS0NrN1hHNWNibk4wYjNKbExuUnZhMlZ1SUQwZ1pHbHpjR0YwWTJobGNpNXlaV2RwYzNSbGNpaHpkRzl5WlM1a2FYTndZWFJqYUVoaGJtUnNaWEl1WW1sdVpDaHpkRzl5WlNrcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSE4wYjNKbE8xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBTdW1tYXJ5O1xuXG5TdW1tYXJ5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlN1bW1hcnlcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdW1tYXJ5XCJ9LCBcbiAgICAgICAgdGhpcy5wcm9wcy52YWx1ZVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN1bW1hcnk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXpkVzF0WVhKNUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU12UWl4SlFVRkpMRTlCUVU4c1EwRkJRenM3UVVGRldpdzJRa0ZCTmtJc2RVSkJRVUU3UlVGRE0wSXNUVUZCVFN4RlFVRkZMRmxCUVZrN1NVRkRiRUk3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZOQlFWVXNRMEZCUVN4RlFVRkJPMUZCUTNSQ0xFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCVFR0TlFVTmtMRU5CUVVFN1RVRkRUanRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRkpsWVdOMElDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlGTjFiVzFoY25rN1hHNWNibE4xYlcxaGNua2dQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5OMWJXMWhjbmxjSWo1Y2JpQWdJQ0FnSUNBZ2UzUm9hWE11Y0hKdmNITXVkbUZzZFdWOVhHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCVGRXMXRZWEo1TzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFRpdGxlQmFyO1xuXG5UaXRsZUJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUaXRsZUJhclwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRpdGxlLWJhclwifSwgXG4gICAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaXRsZUJhcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5MGFYUnNaVjlpWVhJdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeExRVUZMTEV0QlFVc3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJReTlDTEVsQlFVa3NVVUZCVVN4RFFVRkRPenRCUVVWaUxEaENRVUU0UWl4M1FrRkJRVHRGUVVNMVFpeE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRanROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVjBGQldTeERRVUZCTEVWQlFVRTdVVUZEZUVJc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZUTzAxQlEycENMRU5CUVVFN1RVRkRUanRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFJRVUZSTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRkpsWVdOMElDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlGUnBkR3hsUW1GeU8xeHVYRzVVYVhSc1pVSmhjaUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdjbVZ1WkdWeU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWRHbDBiR1V0WW1GeVhDSStYRzRnSUNBZ0lDQWdJSHQwYUdsekxuQnliM0J6TG1Ob2FXeGtjbVZ1ZlZ4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkdsMGJHVkNZWEk3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFRvcEJhcjtcblxuVG9wQmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRvcEJhclwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImRldmljZS1iYXJcIn0sIFxuICAgICAgICBcIlNhZmV0eU1vbWVudHVtLmNvbVwiXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVG9wQmFyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzkwYjNCZlltRnlMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzUzBGQlN5eExRVUZMTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNdlFpeEpRVUZKTEUxQlFVMHNRMEZCUXpzN1FVRkZXQ3cwUWtGQk5FSXNjMEpCUVVFN1JVRkRNVUlzVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJN1RVRkRSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGbEJRV0VzUTBGQlFTeEZRVUZCTzBGQlFVRXNVVUZCUVN4dlFrRkJRVHRCUVVGQkxFMUJSWFJDTEVOQlFVRTdUVUZEVGp0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhOUVVGTkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZKbFlXTjBJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRlJ2Y0VKaGNqdGNibHh1Vkc5d1FtRnlJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKa1pYWnBZMlV0WW1GeVhDSStYRzRnSUNBZ0lDQWdJRk5oWm1WMGVVMXZiV1Z1ZEhWdExtTnZiVnh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdWRzl3UW1GeU8xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBWaWV3O1xudmFyIFJlYWN0ICAgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIE1haW5WaWV3ICAgICAgPSByZXF1aXJlKCcuL21haW5fdmlldy5qc3gnKTtcbnZhciBzdG9yZSAgICAgICAgID0gcmVxdWlyZSgnLi9zdG9yZScpO1xudmFyIGxpc3Rfc3RvcmUgICAgPSByZXF1aXJlKCcuL2xpc3Rfc3RvcmUnKTtcblxuVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJWaWV3XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhc3luYzogIGZhbHNlLFxuICAgICAgbW9tZW50OiBudWxsXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5vbignY2hhbmdlOm1vbWVudCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZ2V0TW9tZW50KCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5vZmYoJ2NoYW5nZScpO1xuICB9LFxuICBnZXRNb21lbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2hvaWNlID0gc3RvcmUuZ2V0KCdtb21lbnQnKTtcbiAgICB2YXIgbW9tZW50ID0gbGlzdF9zdG9yZS5nZXQoY2hvaWNlKTtcblxuICAgIGlmICghIG1vbWVudCkge1xuICAgICAgbW9tZW50ID0gbGlzdF9zdG9yZS5hZGQoe2lkOiBjaG9pY2V9KTtcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7YXN5bmM6IHRydWV9KTtcblxuICAgICAgcmV0dXJuIG1vbWVudC5mZXRjaCh7c3VjY2VzczogdGhpcy5jaG9vc2VNb21lbnQuYmluZCh0aGlzKX0pO1xuICAgIH1cblxuICAgIHRoaXMuY2hvb3NlTW9tZW50KG1vbWVudCk7XG4gIH0sXG4gIGNob29zZU1vbWVudDogZnVuY3Rpb24gKG1vbWVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgbW9tZW50OiBtb21lbnRcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb3BzID0gKHRoaXMuc3RhdGUubW9tZW50ICYmIHRoaXMuc3RhdGUubW9tZW50LnRvSlNPTigpKSB8fCB7fTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1haW5WaWV3LCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzKSlcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzkyYVdWM0xtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NTVUZCU1N4RFFVRkRPMEZCUTFRc1NVRkJTU3hMUVVGTExGZEJRVmNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNKRExFbEJRVWtzVVVGQlVTeFJRVUZSTEU5QlFVOHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBGQlF5OURMRWxCUVVrc1MwRkJTeXhYUVVGWExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0QlFVTjJReXhKUVVGSkxGVkJRVlVzVFVGQlRTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN08wRkJSVFZETERCQ1FVRXdRaXh2UWtGQlFUdEZRVU40UWl4bFFVRmxMRVZCUVVVc1dVRkJXVHRKUVVNelFpeFBRVUZQTzAxQlEwd3NTMEZCU3l4SFFVRkhMRXRCUVVzN1RVRkRZaXhOUVVGTkxFVkJRVVVzU1VGQlNUdExRVU5pTEVOQlFVTTdSMEZEU0R0RlFVTkVMR2xDUVVGcFFpeEZRVUZGTEZsQlFWazdTVUZETjBJc1MwRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF5eGxRVUZsTEVWQlFVVXNXVUZCV1R0TlFVTndReXhKUVVGSkxFTkJRVU1zVTBGQlV5eEZRVUZGTEVOQlFVTTdTMEZEYkVJc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0SFFVTm1PMFZCUTBRc2IwSkJRVzlDTEVWQlFVVXNXVUZCV1R0SlFVTm9ReXhMUVVGTExFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMGRCUTNKQ08wVkJRMFFzVTBGQlV5eEZRVUZGTEZsQlFWazdTVUZEY2tJc1NVRkJTU3hOUVVGTkxFZEJRVWNzUzBGQlN5eERRVUZETEVkQlFVY3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVOeVF5eEpRVUZKTEVsQlFVa3NUVUZCVFN4SFFVRkhMRlZCUVZVc1EwRkJReXhIUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdPMGxCUlhCRExFbEJRVWtzUlVGQlJTeE5RVUZOTEVWQlFVVTdRVUZEYkVJc1RVRkJUU3hOUVVGTkxFZEJRVWNzVlVGQlZTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRVZCUVVVc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVTFReXhOUVVGTkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6czdUVUZGTjBJc1QwRkJUeXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNUMEZCVHl4RlFVRkZMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOdVJTeExRVUZMT3p0SlFVVkVMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdSMEZETTBJN1JVRkRSQ3haUVVGWkxFVkJRVVVzVlVGQlZTeE5RVUZOTEVWQlFVVTdTVUZET1VJc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF6dE5RVU5hTEV0QlFVc3NSVUZCUlN4TFFVRkxPMDFCUTFvc1RVRkJUU3hGUVVGRkxFMUJRVTA3UzBGRFppeERRVUZETEVOQlFVTTdSMEZEU2p0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wRkJRM1JDTEVsQlFVa3NTVUZCU1N4TFFVRkxMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzUTBGQlF5eE5RVUZOTEVWQlFVVXNTMEZCU3l4RlFVRkZMRU5CUVVNN08wbEJSWEJGTzAxQlEwVXNiMEpCUVVNc1VVRkJVU3hGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRXRCUVUwc1EwRkJRU3hEUVVGSExFTkJRVUU3VFVGRGRrSTdSMEZEU0R0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1NVRkJTU3hEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQldhV1YzTzF4dWRtRnlJRkpsWVdOMElDQWdJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUUxaGFXNVdhV1YzSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDIxaGFXNWZkbWxsZHk1cWMzZ25LVHRjYm5aaGNpQnpkRzl5WlNBZ0lDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOXpkRzl5WlNjcE8xeHVkbUZ5SUd4cGMzUmZjM1J2Y21VZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDJ4cGMzUmZjM1J2Y21VbktUdGNibHh1Vm1sbGR5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ1oyVjBTVzVwZEdsaGJGTjBZWFJsT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUdGemVXNWpPaUFnWm1Gc2MyVXNYRzRnSUNBZ0lDQnRiMjFsYm5RNklHNTFiR3hjYmlBZ0lDQjlPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJFYVdSTmIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhOMGIzSmxMbTl1S0NkamFHRnVaMlU2Ylc5dFpXNTBKeXdnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVuWlhSTmIyMWxiblFvS1R0Y2JpQWdJQ0I5TG1KcGJtUW9kR2hwY3lrcE8xeHVJQ0I5TEZ4dUlDQmpiMjF3YjI1bGJuUlhhV3hzVlc1dGIzVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhOMGIzSmxMbTltWmlnblkyaGhibWRsSnlrN1hHNGdJSDBzWEc0Z0lHZGxkRTF2YldWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCamFHOXBZMlVnUFNCemRHOXlaUzVuWlhRb0oyMXZiV1Z1ZENjcE8xeHVJQ0FnSUhaaGNpQnRiMjFsYm5RZ1BTQnNhWE4wWDNOMGIzSmxMbWRsZENoamFHOXBZMlVwTzF4dVhHNGdJQ0FnYVdZZ0tDRWdiVzl0Wlc1MEtTQjdYRzRnSUNBZ0lDQnRiMjFsYm5RZ1BTQnNhWE4wWDNOMGIzSmxMbUZrWkNoN2FXUTZJR05vYjJsalpYMHBPMXh1WEc0Z0lDQWdJQ0IwYUdsekxuTmxkRk4wWVhSbEtIdGhjM2x1WXpvZ2RISjFaWDBwTzF4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnYlc5dFpXNTBMbVpsZEdOb0tIdHpkV05qWlhOek9pQjBhR2x6TG1Ob2IyOXpaVTF2YldWdWRDNWlhVzVrS0hSb2FYTXBmU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1amFHOXZjMlZOYjIxbGJuUW9iVzl0Wlc1MEtUdGNiaUFnZlN4Y2JpQWdZMmh2YjNObFRXOXRaVzUwT2lCbWRXNWpkR2x2YmlBb2JXOXRaVzUwS1NCN1hHNGdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdYRzRnSUNBZ0lDQmhjM2x1WXpvZ1ptRnNjMlVzWEc0Z0lDQWdJQ0J0YjIxbGJuUTZJRzF2YldWdWRGeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnY0hKdmNITWdQU0FvZEdocGN5NXpkR0YwWlM1dGIyMWxiblFnSmlZZ2RHaHBjeTV6ZEdGMFpTNXRiMjFsYm5RdWRHOUtVMDlPS0NrcElIeDhJSHQ5TzF4dVhHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhOWVdsdVZtbGxkeUI3TGk0dWNISnZjSE45SUM4K1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdWbWxsZHp0Y2JpSmRmUT09Il19
