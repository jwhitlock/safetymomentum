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
  componentDidMount: function () {
    list_store.on('add', function () {
      this.setState({});
    }.bind(this));
  },
  componentWillUnmount: function () {
    list_store.off('add');
  },
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
      keywords = this.props.keywords || [];
      keywords = keywords.map(function (keyword) {
        return keyword.name;
      });
      keywords = keywords.join(', ');
    }

    imageProps = {
      image:    this.props.header_image,
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

    if (this.props.image && this.props.image.image) {
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

    category = category[0] || {};
    category = category.name || 'ban';
    category = 'shield';

    return (
      React.createElement("div", {className: "primary-image-fake"}, 
        React.createElement(Icon, {type: category})
      )
    );
  },
  buildFromImage: function () {
    var image = this.props.image;

    return (
      React.createElement("img", {src: image.image, className: "primary-image"})
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
var marked  = require('marked');
var Summary;

Summary = React.createClass({displayName: "Summary",
  render: function () {
    var raw = marked(this.props.value, {sanitize: true});

    return (
      React.createElement("div", {className: "summary"}, 
        React.createElement("span", {dangerouslySetInnerHTML: {__html: raw}})
      )
    );
  }
});

module.exports = Summary;



},{"marked":"marked","react":"react"}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHltb21lbnR1bS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvaWNvbi5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHkvZGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9mb290ZXJfYmFyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9saXN0X3N0b3JlLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L2xpc3Rfdmlldy5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHkvbWFpbl92aWV3LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9wcmltYXJ5X2ltYWdlLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zcG9uc29yLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zdG9yZS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zdW1tYXJ5LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS90aXRsZV9iYXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L3RvcF9iYXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L3ZpZXcuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBSSxLQUFLLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU1QyxTQUFTLE1BQU0sRUFBRSxFQUFFLEVBQUU7RUFDbkIsS0FBSyxDQUFDLE1BQU07SUFDVixLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtNQUM1QixRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO0tBQ3RDLENBQUM7SUFDRixRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztHQUM1QixDQUFDO0FBQ0osQ0FBQzs7QUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUV4Qjs7O0FDaEJBOztBQUVBLEdBQUc7O0FBRUgsSUFBSSxJQUFJLENBQUM7QUFDVCxJQUFJLENBQUMsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFD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QzlCLElBQUksQ0FBQyxRQUFRLENBQUM7TUFDWixLQUFLLEVBQUUsS0FBSztNQUNaLE1BQU0sRUFBRSxNQUFNO0tBQ2YsQ0FBQyxDQUFDO0dBQ0o7RUFDRCxNQUFNLEVBQUUsWUFBWTtBQUN0QixJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDOztJQUVwRTtNQUNFLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO01BQ3pEO0dBQ0g7QUFDSCxDQUFDLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFdEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgTWFpblZpZXcgPSByZXF1aXJlKCcuL3NhZmV0eS92aWV3LmpzeCcpO1xuXG5mdW5jdGlvbiByZW5kZXIgKGlkKSB7XG4gIFJlYWN0LnJlbmRlcihcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1haW5WaWV3LCB7XG4gICAgICBrZXl3b3JkczogWydhdXRvbW9iaWxlJywgJ2tleXdvcmQgMiddXG4gICAgfSksXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gICk7XG59XG5cbnJlbmRlcignc2FmZXR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlVzF2YldWdWRIVnRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVWtzUzBGQlN5eFBRVUZQTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOcVF5eEpRVUZKTEZGQlFWRXNSMEZCUnl4UFFVRlBMRU5CUVVNc2JVSkJRVzFDTEVOQlFVTXNRMEZCUXpzN1FVRkZOVU1zVTBGQlV5eE5RVUZOTEVWQlFVVXNSVUZCUlN4RlFVRkZPMFZCUTI1Q0xFdEJRVXNzUTBGQlF5eE5RVUZOTzBsQlExWXNTMEZCU3l4RFFVRkRMR0ZCUVdFc1EwRkJReXhSUVVGUkxFVkJRVVU3VFVGRE5VSXNVVUZCVVN4RlFVRkZMRU5CUVVNc1dVRkJXU3hGUVVGRkxGZEJRVmNzUTBGQlF6dExRVU4wUXl4RFFVRkRPMGxCUTBZc1VVRkJVU3hEUVVGRExHTkJRV01zUTBGQlF5eEZRVUZGTEVOQlFVTTdSMEZETlVJc1EwRkJRenRCUVVOS0xFTkJRVU03TzBGQlJVUXNUVUZCVFN4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE96dEJRVVZxUWl4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFMUJRVTBzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCU1pXRmpkQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUUxaGFXNVdhV1YzSUQwZ2NtVnhkV2x5WlNnbkxpOXpZV1psZEhrdmRtbGxkeTVxYzNnbktUdGNibHh1Wm5WdVkzUnBiMjRnY21WdVpHVnlJQ2hwWkNrZ2UxeHVJQ0JTWldGamRDNXlaVzVrWlhJb1hHNGdJQ0FnVW1WaFkzUXVZM0psWVhSbFJXeGxiV1Z1ZENoTllXbHVWbWxsZHl3Z2UxeHVJQ0FnSUNBZ2EyVjVkMjl5WkhNNklGc25ZWFYwYjIxdlltbHNaU2NzSUNkclpYbDNiM0prSURJblhWeHVJQ0FnSUgwcExGeHVJQ0FnSUdSdlkzVnRaVzUwTG1kbGRFVnNaVzFsYm5SQ2VVbGtLR2xrS1Z4dUlDQXBPMXh1ZlZ4dVhHNXlaVzVrWlhJb0ozTmhabVYwZVNjcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSEpsYm1SbGNqdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgSWNvbjtcbnZhciBfICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBpY29uLCBjdXJyZW50bHkgdXNpbmcgdGhlIGZvbnQgYXdlc29tZSBpY29uIGxpYnJhcnlcbiAqXG4gKiBAZXhhbXBsZXNcbiAqIDxJY29uIHR5cGU9XCJjaGVja1wiIC8+XG4gKiA8SWNvbiB0eXBlPVwidXNlclwiIGNsYXNzTmFtZT1cIm11dGVkXCIgLz5cbiAqIDxJY29uIHR5cGU9XCJiYW5cIiBzdGFjaz1cIjJ4XCIgLz5cbiAqL1xuSWNvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJJY29uXCIsXG4gIHByb3BUeXBlczoge1xuICAgIHN0YWNrOiAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdHlwZTogICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNsYXNzTmFtZTogIFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcbiAgbWl4aW5zOiBbUmVhY3QuYWRkb25zLlB1cmVSZW5kZXJNaXhpbl0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjbGFzc2VzID0gWydmYSBmYS1pY29uJ107XG4gICAgdmFyIHByb3BzICAgPSBfLm9taXQodGhpcy5wcm9wcywgWydzdGFjaycsICd0eXBlJywgJ2NsYXNzTmFtZSddKTtcblxuICAgIGlmICh0aGlzLnByb3BzLnN0YWNrKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLXN0YWNrLScgKyB0aGlzLnByb3BzLnN0YWNrKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zcGluKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLXNwaW4nKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy50eXBlKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLScgKyB0aGlzLnByb3BzLnR5cGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmNsYXNzTmFtZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMucHJvcHMuY2xhc3NOYW1lKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLnNpemUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCgnZmEtJyArIHRoaXMucHJvcHMuc2l6ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcHJvcHMsIHtjbGFzc05hbWU6IGNsYXNzZXMuam9pbignICcpfSkpXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSWNvbjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwyTnZiWEJ2Ym1WdWRITXZhV052Ymk1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3TzBGQlJVRXNSMEZCUnpzN1FVRkZTQ3hKUVVGSkxFbEJRVWtzUTBGQlF6dEJRVU5VTEVsQlFVa3NRMEZCUXl4UFFVRlBMRTlCUVU4c1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dEJRVU5zUXl4SlFVRkpMRXRCUVVzc1IwRkJSeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdPMEZCUlRkQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1IwRkZSenRCUVVOSUxEQkNRVUV3UWl4dlFrRkJRVHRGUVVONFFpeFRRVUZUTEVWQlFVVTdTVUZEVkN4TFFVRkxMRTlCUVU4c1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTzBsQlEyeERMRWxCUVVrc1VVRkJVU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMHNRMEZCUXl4VlFVRlZPMGxCUXpkRExGTkJRVk1zUjBGQlJ5eExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwN1IwRkRia003UlVGRFJDeE5RVUZOTEVWQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF6dEZRVU4wUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FpeEpRVUZKTEU5QlFVOHNSMEZCUnl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRMnBETEVsQlFVa3NTVUZCU1N4TFFVRkxMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNc1QwRkJUeXhGUVVGRkxFMUJRVTBzUlVGQlJTeFhRVUZYTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRKUVVWcVJTeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhGUVVGRk8wMUJRM0JDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1YwRkJWeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRia1FzUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZET1VJc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRk8wMUJRMjVDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkROVU1zUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVTBGQlV5eEZRVUZGTzAxQlEzaENMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNN1FVRkRlRU1zUzBGQlN6czdTVUZGUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeEZRVUZGTzAxQlEyNUNMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE5VTXNTMEZCU3pzN1NVRkZSRHROUVVORkxHOUNRVUZCTEVkQlFVVXNSVUZCUVN4blFrRkJRU3hIUVVGQkxFTkJRVVVzUjBGQlJ5eExRVUZMTEVWQlFVTXNRMEZCUXl4RFFVRkJMRk5CUVVFc1JVRkJVeXhEUVVGRkxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkhMRU5CUVVFc1EwRkJTU3hEUVVGQk8wMUJRMmhFTzBkQlEwZzdRVUZEU0N4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRlNDeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWk4cUtseHVJQ29nUUdwemVDQlNaV0ZqZEM1RVQwMWNiaUFxTDF4dVhHNTJZWElnU1dOdmJqdGNiblpoY2lCZklDQWdJQ0E5SUhKbGNYVnBjbVVvSjNWdVpHVnljMk52Y21VbktUdGNiblpoY2lCU1pXRmpkQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1Y2JpOHFLbHh1SUNvZ1EzSmxZWFJsY3lCaGJpQnBZMjl1TENCamRYSnlaVzUwYkhrZ2RYTnBibWNnZEdobElHWnZiblFnWVhkbGMyOXRaU0JwWTI5dUlHeHBZbkpoY25sY2JpQXFYRzRnS2lCQVpYaGhiWEJzWlhOY2JpQXFJRHhKWTI5dUlIUjVjR1U5WENKamFHVmphMXdpSUM4K1hHNGdLaUE4U1dOdmJpQjBlWEJsUFZ3aWRYTmxjbHdpSUdOc1lYTnpUbUZ0WlQxY0ltMTFkR1ZrWENJZ0x6NWNiaUFxSUR4SlkyOXVJSFI1Y0dVOVhDSmlZVzVjSWlCemRHRmphejFjSWpKNFhDSWdMejVjYmlBcUwxeHVTV052YmlBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY0hKdmNGUjVjR1Z6T2lCN1hHNGdJQ0FnYzNSaFkyczZJQ0FnSUNBZ1VtVmhZM1F1VUhKdmNGUjVjR1Z6TG5OMGNtbHVaeXhjYmlBZ0lDQjBlWEJsT2lBZ0lDQWdJQ0JTWldGamRDNVFjbTl3Vkhsd1pYTXVjM1J5YVc1bkxtbHpVbVZ4ZFdseVpXUXNYRzRnSUNBZ1kyeGhjM05PWVcxbE9pQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxuTjBjbWx1WjF4dUlDQjlMRnh1SUNCdGFYaHBibk02SUZ0U1pXRmpkQzVoWkdSdmJuTXVVSFZ5WlZKbGJtUmxjazFwZUdsdVhTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHTnNZWE56WlhNZ1BTQmJKMlpoSUdaaExXbGpiMjRuWFR0Y2JpQWdJQ0IyWVhJZ2NISnZjSE1nSUNBOUlGOHViMjFwZENoMGFHbHpMbkJ5YjNCekxDQmJKM04wWVdOckp5d2dKM1I1Y0dVbkxDQW5ZMnhoYzNOT1lXMWxKMTBwTzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVjM1JoWTJzcElIdGNiaUFnSUNBZ0lHTnNZWE56WlhNdWNIVnphQ2duWm1FdGMzUmhZMnN0SnlBcklIUm9hWE11Y0hKdmNITXVjM1JoWTJzcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMbk53YVc0cElIdGNiaUFnSUNBZ0lHTnNZWE56WlhNdWNIVnphQ2duWm1FdGMzQnBiaWNwTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoMGFHbHpMbkJ5YjNCekxuUjVjR1VwSUh0Y2JpQWdJQ0FnSUdOc1lYTnpaWE11Y0hWemFDZ25abUV0SnlBcklIUm9hWE11Y0hKdmNITXVkSGx3WlNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVZMnhoYzNOT1lXMWxLU0I3WEc0Z0lDQWdJQ0JqYkdGemMyVnpMbkIxYzJnb2RHaHBjeTV3Y205d2N5NWpiR0Z6YzA1aGJXVXBYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YzJsNlpTa2dlMXh1SUNBZ0lDQWdZMnhoYzNObGN5NXdkWE5vS0NkbVlTMG5JQ3NnZEdocGN5NXdjbTl3Y3k1emFYcGxLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHa2dleTR1TG5CeWIzQnpmU0JqYkdGemMwNWhiV1U5ZTJOc1lYTnpaWE11YW05cGJpZ25JQ2NwZlQ0OEwyaytYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnU1dOdmJqdGNiaUpkZlE9PSIsInZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnZmx1eCcpLkRpc3BhdGNoZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5a2FYTndZWFJqYUdWeUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVa3NWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eFZRVUZWTEVOQlFVTTdPMEZCUlRWRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4VlFVRlZMRVZCUVVVc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5aaGNpQkVhWE53WVhSamFHVnlJRDBnY21WeGRXbHlaU2duWm14MWVDY3BMa1JwYzNCaGRHTm9aWEk3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2JtVjNJRVJwYzNCaGRHTm9aWElvS1R0Y2JpSmRmUT09IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgSWNvbiAgICAgICAgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL2ljb24uanN4Jyk7XG52YXIgZGlzcGF0Y2hlciAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKTtcbnZhciBGb290ZXJCYXI7XG5cbkZvb3RlckJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJGb290ZXJCYXJcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJmb290ZXItYmFyXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcIm5hdlwiLCBudWxsLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge29uQ2xpY2s6IHRoaXMubGlzdFZpZXd9LCBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcImxpc3RcIn0pKSksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLnNoYXJlVmlld30sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwic2VuZFwifSkpKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge29uQ2xpY2s6IHRoaXMuc2VhcmNoVmlld30sIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwic2VhcmNoXCJ9KSkpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgbGlzdFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICd2aWV3JyxcbiAgICAgIHZpZXc6ICdsaXN0J1xuICAgIH0pO1xuICB9LFxuICBzaGFyZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICd2aWV3JyxcbiAgICAgIHZpZXc6ICdzaGFyZSdcbiAgICB9KTtcbiAgfSxcbiAgc2VhcmNoVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ3ZpZXcnLFxuICAgICAgdmlldzogJ3NlYXJjaCdcbiAgICB9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRm9vdGVyQmFyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzltYjI5MFpYSmZZbUZ5TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1MwRkJTeXhUUVVGVExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTnVReXhKUVVGSkxFbEJRVWtzVlVGQlZTeFBRVUZQTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU1zUTBGQlF6dEJRVU53UkN4SlFVRkpMRlZCUVZVc1NVRkJTU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZETVVNc1NVRkJTU3hUUVVGVExFTkJRVU03TzBGQlJXUXNLMEpCUVN0Q0xIbENRVUZCTzBWQlF6ZENMRTFCUVUwc1JVRkJSU3haUVVGWk8wbEJRMnhDTzAxQlEwVXNiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4WlFVRmhMRU5CUVVFc1JVRkJRVHRSUVVNeFFpeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1NVRkJReXhGUVVGQk8xVkJRMGdzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRWxCUVVNc1JVRkJRVHRaUVVOR0xHOUNRVUZCTEVsQlFVY3NSVUZCUVN4SlFVRkRMRVZCUVVFc2IwSkJRVUVzUjBGQlJTeEZRVUZCTEVOQlFVRXNRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJSU3hKUVVGSkxFTkJRVU1zVVVGQlZTeERRVUZCTEVWQlFVRXNiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVFc1EwRkJSeXhEUVVGSkxFTkJRVXNzUTBGQlFTeEZRVUZCTzFsQlF6VkVMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeEpRVUZETEVWQlFVRXNiMEpCUVVFc1IwRkJSU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1UwRkJWeXhEUVVGQkxFVkJRVUVzYjBKQlFVTXNTVUZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVRXNRMEZCUnl4RFFVRkpMRU5CUVVzc1EwRkJRU3hGUVVGQk8xbEJRemRFTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hKUVVGRExFVkJRVUVzYjBKQlFVRXNSMEZCUlN4RlFVRkJMRU5CUVVFc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeEpRVUZKTEVOQlFVTXNWVUZCV1N4RFFVRkJMRVZCUVVFc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhSUVVGUkxFTkJRVUVzUTBGQlJ5eERRVUZKTEVOQlFVc3NRMEZCUVR0VlFVTTNSQ3hEUVVGQk8xRkJRMFFzUTBGQlFUdE5RVU5HTEVOQlFVRTdUVUZEVGp0SFFVTklPMFZCUTBRc1VVRkJVU3hGUVVGRkxGbEJRVms3U1VGRGNFSXNWVUZCVlN4RFFVRkRMRkZCUVZFc1EwRkJRenROUVVOc1FpeEpRVUZKTEVWQlFVVXNUVUZCVFR0TlFVTmFMRWxCUVVrc1JVRkJSU3hOUVVGTk8wdEJRMklzUTBGQlF5eERRVUZETzBkQlEwbzdSVUZEUkN4VFFVRlRMRVZCUVVVc1dVRkJXVHRKUVVOeVFpeFZRVUZWTEVOQlFVTXNVVUZCVVN4RFFVRkRPMDFCUTJ4Q0xFbEJRVWtzUlVGQlJTeE5RVUZOTzAxQlExb3NTVUZCU1N4RlFVRkZMRTlCUVU4N1MwRkRaQ3hEUVVGRExFTkJRVU03UjBGRFNqdEZRVU5FTEZWQlFWVXNSVUZCUlN4WlFVRlpPMGxCUTNSQ0xGVkJRVlVzUTBGQlF5eFJRVUZSTEVOQlFVTTdUVUZEYkVJc1NVRkJTU3hGUVVGRkxFMUJRVTA3VFVGRFdpeEpRVUZKTEVWQlFVVXNVVUZCVVR0TFFVTm1MRU5CUVVNc1EwRkJRenRIUVVOS08wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFRRVUZUTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRkpsWVdOMElDQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1FuS1R0Y2JuWmhjaUJKWTI5dUlDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHVMMk52YlhCdmJtVnVkSE12YVdOdmJpNXFjM2duS1R0Y2JuWmhjaUJrYVhOd1lYUmphR1Z5SUNBOUlISmxjWFZwY21Vb0p5NHZaR2x6Y0dGMFkyaGxjaWNwTzF4dWRtRnlJRVp2YjNSbGNrSmhjanRjYmx4dVJtOXZkR1Z5UW1GeUlEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0ptYjI5MFpYSXRZbUZ5WENJK1hHNGdJQ0FnSUNBZ0lEeHVZWFkrWEc0Z0lDQWdJQ0FnSUNBZ1BIVnNQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQanhoSUc5dVEyeHBZMnM5ZTNSb2FYTXViR2x6ZEZacFpYZDlQanhKWTI5dUlIUjVjR1U5WENKc2FYTjBYQ0lnTHo0OEwyRStQQzlzYVQ1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHhzYVQ0OFlTQnZia05zYVdOclBYdDBhR2x6TG5Ob1lYSmxWbWxsZDMwK1BFbGpiMjRnZEhsd1pUMWNJbk5sYm1SY0lpQXZQand2WVQ0OEwyeHBQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHeHBQanhoSUc5dVEyeHBZMnM5ZTNSb2FYTXVjMlZoY21Ob1ZtbGxkMzArUEVsamIyNGdkSGx3WlQxY0luTmxZWEpqYUZ3aUlDOCtQQzloUGp3dmJHaytYRzRnSUNBZ0lDQWdJQ0FnUEM5MWJENWNiaUFnSUNBZ0lDQWdQQzl1WVhZK1hHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JzYVhOMFZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUdScGMzQmhkR05vWlhJdVpHbHpjR0YwWTJnb2UxeHVJQ0FnSUNBZ2RIbHdaVG9nSjNacFpYY25MRnh1SUNBZ0lDQWdkbWxsZHpvZ0oyeHBjM1FuWEc0Z0lDQWdmU2s3WEc0Z0lIMHNYRzRnSUhOb1lYSmxWbWxsZHpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lHUnBjM0JoZEdOb1pYSXVaR2x6Y0dGMFkyZ29lMXh1SUNBZ0lDQWdkSGx3WlRvZ0ozWnBaWGNuTEZ4dUlDQWdJQ0FnZG1sbGR6b2dKM05vWVhKbEoxeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dUlDQnpaV0Z5WTJoV2FXVjNPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnWkdsemNHRjBZMmhsY2k1a2FYTndZWFJqYUNoN1hHNGdJQ0FnSUNCMGVYQmxPaUFuZG1sbGR5Y3NYRzRnSUNBZ0lDQjJhV1YzT2lBbmMyVmhjbU5vSjF4dUlDQWdJSDBwTzF4dUlDQjlYRzU5S1R0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkdiMjkwWlhKQ1lYSTdYRzRpWFgwPSIsInZhciBzdG9yZTtcbnZhciBTdG9yZTtcbnZhciBkaXNwYXRjaGVyICA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpO1xudmFyIEJhY2tib25lICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxuXG5TdG9yZSA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgdXJsOiAnL2FwaS9tb21lbnRzLycsXG4gIGRpc3BhdGNoSGFuZGxlcjogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICBjb25zb2xlLmxvZyhwYXlsb2FkKTtcbiAgfVxufSk7XG5cbmNvbnNvbGUubG9nKFN0b3JlLnByb3RvdHlwZS51cmwpO1xuc3RvcmUgPSBuZXcgU3RvcmUoLypbXG4gIHtjcmVhdGVkOiBuZXcgRGF0ZSgpLCB0aXRsZTogJ09uZScsIGtleXdvcmRzOiBbJ2F1dG9tb2JpbGUnXSwgaWQ6IDIzfSxcbiAge2NyZWF0ZWQ6IG5ldyBEYXRlKCksIHRpdGxlOiAnVHdvJywga2V5d29yZHM6IFsnYXV0b21vYmlsZSddLCBpZDogMzN9XG5dKi8pO1xuXG5zdG9yZS5mZXRjaCgpO1xuXG5zdG9yZS50b2tlbiA9IGRpc3BhdGNoZXIucmVnaXN0ZXIoc3RvcmUuZGlzcGF0Y2hIYW5kbGVyLmJpbmQoc3RvcmUpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5c2FYTjBYM04wYjNKbExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEVsQlFVa3NTMEZCU3l4RFFVRkRPMEZCUTFZc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRFZpeEpRVUZKTEZWQlFWVXNTVUZCU1N4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03UVVGRE1VTXNTVUZCU1N4UlFVRlJMRTFCUVUwc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEzUkRPenRCUVVWQkxFdEJRVXNzUjBGQlJ5eFJRVUZSTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTFCUVUwc1EwRkJRenRGUVVOcVF5eEhRVUZITEVWQlFVVXNaVUZCWlR0RlFVTndRaXhsUVVGbExFVkJRVVVzVlVGQlZTeFBRVUZQTEVWQlFVVTdTVUZEYkVNc1QwRkJUeXhEUVVGRExFZEJRVWNzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0SFFVTjBRanRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOcVF5eExRVUZMTEVkQlFVY3NTVUZCU1N4TFFVRkxPMEZCUTJwQ096dEJRVVZCTEVsQlFVa3NRMEZCUXpzN1FVRkZUQ3hMUVVGTExFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTTdPMEZCUldRc1MwRkJTeXhEUVVGRExFdEJRVXNzUjBGQlJ5eFZRVUZWTEVOQlFVTXNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhsUVVGbExFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSWEpGTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1MwRkJTeXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lkbUZ5SUhOMGIzSmxPMXh1ZG1GeUlGTjBiM0psTzF4dWRtRnlJR1JwYzNCaGRHTm9aWElnSUQwZ2NtVnhkV2x5WlNnbkxpOWthWE53WVhSamFHVnlKeWs3WEc1MllYSWdRbUZqYTJKdmJtVWdJQ0FnUFNCeVpYRjFhWEpsS0NkaVlXTnJZbTl1WlNjcE8xeHVYRzVjYmxOMGIzSmxJRDBnUW1GamEySnZibVV1UTI5c2JHVmpkR2x2Ymk1bGVIUmxibVFvZTF4dUlDQjFjbXc2SUNjdllYQnBMMjF2YldWdWRITXZKeXhjYmlBZ1pHbHpjR0YwWTJoSVlXNWtiR1Z5T2lCbWRXNWpkR2x2YmlBb2NHRjViRzloWkNrZ2UxeHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktIQmhlV3h2WVdRcE8xeHVJQ0I5WEc1OUtUdGNibHh1WTI5dWMyOXNaUzVzYjJjb1UzUnZjbVV1Y0hKdmRHOTBlWEJsTG5WeWJDazdYRzV6ZEc5eVpTQTlJRzVsZHlCVGRHOXlaU2d2S2x0Y2JpQWdlMk55WldGMFpXUTZJRzVsZHlCRVlYUmxLQ2tzSUhScGRHeGxPaUFuVDI1bEp5d2dhMlY1ZDI5eVpITTZJRnNuWVhWMGIyMXZZbWxzWlNkZExDQnBaRG9nTWpOOUxGeHVJQ0I3WTNKbFlYUmxaRG9nYm1WM0lFUmhkR1VvS1N3Z2RHbDBiR1U2SUNkVWQyOG5MQ0JyWlhsM2IzSmtjem9nV3lkaGRYUnZiVzlpYVd4bEoxMHNJR2xrT2lBek0zMWNibDBxTHlrN1hHNWNibk4wYjNKbExtWmxkR05vS0NrN1hHNWNibk4wYjNKbExuUnZhMlZ1SUQwZ1pHbHpjR0YwWTJobGNpNXlaV2RwYzNSbGNpaHpkRzl5WlM1a2FYTndZWFJqYUVoaGJtUnNaWEl1WW1sdVpDaHpkRzl5WlNrcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSE4wYjNKbE8xeHVJbDE5IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBfICAgICAgICAgICAgID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xudmFyIFRpdGxlQmFyICAgICAgPSByZXF1aXJlKCcuL3RpdGxlX2Jhci5qc3gnKTtcbnZhciBJY29uICAgICAgICAgID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9pY29uLmpzeCcpO1xudmFyIGRpc3BhdGNoZXIgICAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKTtcbnZhciBzdG9yZSAgICAgICAgID0gcmVxdWlyZSgnLi9zdG9yZScpO1xudmFyIGxpc3Rfc3RvcmUgICAgPSByZXF1aXJlKCcuL2xpc3Rfc3RvcmUnKTtcbnZhciBtYWluX3N0b3JlICAgID0gcmVxdWlyZSgnLi9zdG9yZScpO1xudmFyIFByaW1hcnlJbWFnZSAgPSByZXF1aXJlKCcuL3ByaW1hcnlfaW1hZ2UuanN4Jyk7XG52YXIgbW9tZW50anMgICAgICA9IHJlcXVpcmUoJ21vbWVudCcpO1xudmFyIExpc3RWaWV3O1xuXG5MaXN0VmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJMaXN0Vmlld1wiLFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIGxpc3Rfc3RvcmUub24oJ2FkZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe30pO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgbGlzdF9zdG9yZS5vZmYoJ2FkZCcpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJlX2NvbnRyb2xzICA9IFtdO1xuICAgIHZhciBtb21lbnRzICAgICAgID0gdGhpcy5idWlsZE1vbWVudHMoKTtcblxuICAgIHByZV9jb250cm9scy5wdXNoKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IFwiY2F0ZWdvcnlcIiwgY2xhc3NOYW1lOiBcInRvcC1jb250cm9sXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJidXR0b25cIiwgb25DbGljazogdGhpcy5jYXRlZ29yeVZpZXd9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcImxpc3RcIn0pXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuXG4gICAgaWYgKCEgdGhpcy5wcm9wcy5zZWFyY2gpIHtcbiAgICAgIHByZV9jb250cm9scy5wdXNoKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2tleTogXCJzZWFyY2hcIiwgY2xhc3NOYW1lOiBcInRvcC1jb250cm9sXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcImJ1dHRvblwiLCBvbkNsaWNrOiB0aGlzLnNlYXJjaFZpZXd9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwic2VhcmNoXCJ9KVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxpc3Qtdmlld1wifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGl0bGVCYXIsIG51bGwsIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIiwge2NsYXNzTmFtZTogXCJ0b3AtbmF2XCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCBcbiAgICAgICAgICAgICAgcHJlX2NvbnRyb2xzLm1hcChmdW5jdGlvbiAoY29udHJvbCkge3JldHVybiBjb250cm9sO30pXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSwgXG5cbiAgICAgICAgICBcIlNhZmV0eSBNb21lbnRzXCIsIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwiYnV0dG9uIGNsb3NlLWJ1dHRvblwiLCBvbkNsaWNrOiB0aGlzLmNsb3NlVmlld30sIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJjbG9zZVwifSlcbiAgICAgICAgICApXG4gICAgICAgICksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibGlzdC1vZi1tb21lbnRzXCJ9LCBcbiAgICAgICAgICBtb21lbnRzXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBzZWFyY2hWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jYXRlZ29yeVZpZXcoKTtcbiAgfSxcbiAgY2F0ZWdvcnlWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiAndmlldycsXG4gICAgICB2aWV3OiAnY2F0ZWdvcnknXG4gICAgfSk7XG4gIH0sXG4gIGJ1aWxkTW9tZW50czogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb21lbnRzO1xuICAgIHZhciBlbGVtZW50cztcbiAgICB2YXIgY2F0ZWdvcnkgPSBzdG9yZS5nZXQoJ2NhdGVnb3J5Jyk7XG5cbiAgICBtb21lbnRzID0gbGlzdF9zdG9yZS5maWx0ZXIoZnVuY3Rpb24gKG1vbWVudCkge1xuICAgICAgaWYgKGNhdGVnb3J5KSB7XG4gICAgICAgIHJldHVybiBtb21lbnQuZ2V0KCdrZXl3b3JkcycpLmluZGV4T2YoY2F0ZWdvcnkpID4gLTE7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgZWxlbWVudHMgPSBfLm1hcChtb21lbnRzLCBmdW5jdGlvbiAobW9tZW50LCBpbmRleCkge1xuICAgICAgdmFyIGRhdGUgPSBtb21lbnRqcyhtb21lbnQuZ2V0KCdjcmVhdGVkJykpO1xuICAgICAgdmFyIGltYWdlUHJvcHMgPSB7XG4gICAgICAgIGltYWdlOiAgICBtb21lbnQuZ2V0KCdpbWFnZScpLFxuICAgICAgICBrZXl3b3JkczogbW9tZW50LmdldCgna2V5d29yZHMnKVxuICAgICAgfTtcblxuICAgICAgZGF0ZSA9IGRhdGUuZm9ybWF0KCdNTU0gTSwgWVlZWScpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwge2tleTogaW5kZXgsIGNsYXNzTmFtZTogXCJtb21lbnRcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLnNlbGVjdE1vbWVudC5iaW5kKHRoaXMsIG1vbWVudC5pZCl9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aHVtYlwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJpbWFyeUltYWdlLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGltYWdlUHJvcHMpKVxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGl0bGVcIn0sIFxuICAgICAgICAgICAgICBtb21lbnQuZ2V0KCd0aXRsZScpXG4gICAgICAgICAgICApLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtdXRlZCBzbWFsbFwifSwgXG4gICAgICAgICAgICAgIGRhdGVcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSwgdGhpcyk7XG5cbiAgICBpZiAoZWxlbWVudHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCBudWxsLCBlbGVtZW50cylcbiAgICApO1xuICB9LFxuICBzZWxlY3RNb21lbnQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogICAnY2hvb3NlJyxcbiAgICAgIHZhbHVlOiAgaWRcbiAgICB9KTtcblxuICAgIHRoaXMuY2xvc2VWaWV3KCk7XG4gIH0sXG4gIGNsb3NlVmlldzogZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ3ZpZXcnLFxuICAgICAgdmlldzogbnVsbFxuICAgIH0pO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0VmlldztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5c2FYTjBYM1pwWlhjdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeExRVUZMTEZkQlFWY3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRM0pETEVsQlFVa3NRMEZCUXl4bFFVRmxMRTlCUVU4c1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dEJRVU14UXl4SlFVRkpMRkZCUVZFc1VVRkJVU3hQUVVGUExFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1EwRkJRenRCUVVNdlF5eEpRVUZKTEVsQlFVa3NXVUZCV1N4UFFVRlBMRU5CUVVNc2QwSkJRWGRDTEVOQlFVTXNRMEZCUXp0QlFVTjBSQ3hKUVVGSkxGVkJRVlVzVFVGQlRTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkROVU1zU1VGQlNTeExRVUZMTEZkQlFWY3NUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRM1pETEVsQlFVa3NWVUZCVlN4TlFVRk5MRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dEJRVU0xUXl4SlFVRkpMRlZCUVZVc1RVRkJUU3hQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEZGtNc1NVRkJTU3haUVVGWkxFbEJRVWtzVDBGQlR5eERRVUZETEhGQ1FVRnhRaXhEUVVGRExFTkJRVU03UVVGRGJrUXNTVUZCU1N4UlFVRlJMRkZCUVZFc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzUkRMRWxCUVVrc1VVRkJVU3hEUVVGRE96dEJRVVZpTERoQ1FVRTRRaXgzUWtGQlFUdEZRVU0xUWl4cFFrRkJhVUlzUlVGQlJTeFpRVUZaTzBsQlF6ZENMRlZCUVZVc1EwRkJReXhGUVVGRkxFTkJRVU1zUzBGQlN5eEZRVUZGTEZsQlFWazdUVUZETDBJc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0TFFVTnVRaXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGRCUTJZN1JVRkRSQ3h2UWtGQmIwSXNSVUZCUlN4WlFVRlpPMGxCUTJoRExGVkJRVlVzUTBGQlF5eEhRVUZITEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1IwRkRka0k3UlVGRFJDeE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRaXhKUVVGSkxGbEJRVmtzU1VGQlNTeEZRVUZGTEVOQlFVTTdRVUZETTBJc1NVRkJTU3hKUVVGSkxFOUJRVThzVTBGQlV5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkZMRU5CUVVNN08wbEJSWGhETEZsQlFWa3NRMEZCUXl4SlFVRkpPMDFCUTJZc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVOQlFVRXNRMEZCUXl4SFFVRkJMRVZCUVVjc1EwRkJReXhWUVVGQkxFVkJRVlVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4aFFVRmpMRU5CUVVFc1JVRkJRVHRSUVVONlF5eHZRa0ZCUVN4SFFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZGQlFVRXNSVUZCVVN4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZqTEVOQlFVRXNSVUZCUVR0VlFVTm9SQ3h2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlFTeERRVUZITEVOQlFVRTdVVUZEYkVJc1EwRkJRVHROUVVORUxFTkJRVUU3UVVGRFdDeExRVUZMTEVOQlFVTTdPMGxCUlVZc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RlFVRkZPMDFCUTNaQ0xGbEJRVmtzUTBGQlF5eEpRVUZKTzFGQlEyWXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFTkJRVUVzUTBGQlF5eEhRVUZCTEVWQlFVY3NRMEZCUXl4UlFVRkJMRVZCUVZFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGhRVUZqTEVOQlFVRXNSVUZCUVR0VlFVTjJReXh2UWtGQlFTeEhRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGRkJRVUVzUlVGQlVTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWxCUVVrc1EwRkJReXhWUVVGWkxFTkJRVUVzUlVGQlFUdFpRVU01UXl4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRU3hEUVVGSExFTkJRVUU3VlVGRGNFSXNRMEZCUVR0UlFVTkVMRU5CUVVFN1QwRkRUaXhEUVVGRE8wRkJRMUlzUzBGQlN6czdTVUZGUkR0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1YwRkJXU3hEUVVGQkxFVkJRVUU3VVVGRGVrSXNiMEpCUVVNc1VVRkJVU3hGUVVGQkxFbEJRVU1zUlVGQlFUdFZRVU5TTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNVMEZCVlN4RFFVRkJMRVZCUVVFN1dVRkRka0lzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRWxCUVVNc1JVRkJRVHRqUVVORUxGbEJRVmtzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4UFFVRlBMRVZCUVVVc1EwRkJReXhQUVVGUExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVVTdXVUZEY2tRc1EwRkJRVHRWUVVORUxFTkJRVUVzUlVGQlFUdEJRVUZCTzBGQlFVRXNWVUZCUVN4blFrRkJRU3hGUVVGQk8wRkJRVUVzVlVGSFRpeHZRa0ZCUVN4SFFVRkZMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEhGQ1FVRkJMRVZCUVhGQ0xFTkJRVU1zVDBGQlFTeEZRVUZQTEVOQlFVVXNTVUZCU1N4RFFVRkRMRk5CUVZjc1EwRkJRU3hGUVVGQk8xbEJRekZFTEc5Q1FVRkRMRWxCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zU1VGQlFTeEZRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkJMRU5CUVVjc1EwRkJRVHRWUVVOdVFpeERRVUZCTzFGQlEwc3NRMEZCUVN4RlFVRkJPMUZCUTFnc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhwUWtGQmEwSXNRMEZCUVN4RlFVRkJPMVZCUXpsQ0xFOUJRVkU3VVVGRFRDeERRVUZCTzAxQlEwWXNRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hWUVVGVkxFVkJRVVVzV1VGQldUdEpRVU4wUWl4SlFVRkpMRU5CUVVNc1dVRkJXU3hGUVVGRkxFTkJRVU03UjBGRGNrSTdSVUZEUkN4WlFVRlpMRVZCUVVVc1dVRkJXVHRKUVVONFFpeFZRVUZWTEVOQlFVTXNVVUZCVVN4RFFVRkRPMDFCUTJ4Q0xFbEJRVWtzUlVGQlJTeE5RVUZOTzAxQlExb3NTVUZCU1N4RlFVRkZMRlZCUVZVN1MwRkRha0lzUTBGQlF5eERRVUZETzBkQlEwbzdSVUZEUkN4WlFVRlpMRVZCUVVVc1dVRkJXVHRKUVVONFFpeEpRVUZKTEU5QlFVOHNRMEZCUXp0SlFVTmFMRWxCUVVrc1VVRkJVU3hEUVVGRE8wRkJRMnBDTEVsQlFVa3NTVUZCU1N4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXpzN1NVRkZja01zVDBGQlR5eEhRVUZITEZWQlFWVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1ZVRkJWU3hOUVVGTkxFVkJRVVU3VFVGRE5VTXNTVUZCU1N4UlFVRlJMRVZCUVVVN1VVRkRXaXhQUVVGUExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUXpkRUxFOUJRVTg3TzAxQlJVUXNUMEZCVHl4SlFVRkpMRU5CUVVNN1FVRkRiRUlzUzBGQlN5eERRVUZETEVOQlFVTTdPMGxCUlVnc1VVRkJVU3hIUVVGSExFTkJRVU1zUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RlFVRkZMRlZCUVZVc1RVRkJUU3hGUVVGRkxFdEJRVXNzUlVGQlJUdE5RVU5xUkN4SlFVRkpMRWxCUVVrc1IwRkJSeXhSUVVGUkxFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFVY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRE8wMUJRek5ETEVsQlFVa3NWVUZCVlN4SFFVRkhPMUZCUTJZc1MwRkJTeXhMUVVGTExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNUMEZCVHl4RFFVRkRPMUZCUXpkQ0xGRkJRVkVzUlVGQlJTeE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRlZCUVZVc1EwRkJRenRCUVVONFF5eFBRVUZQTEVOQlFVTTdPMEZCUlZJc1RVRkJUU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4aFFVRmhMRU5CUVVNc1EwRkJRenM3VFVGRmJFTTdVVUZEUlN4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkZMRXRCUVVzc1JVRkJReXhEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZGQlFWTXNRMEZCUVN4RlFVRkJPMVZCUTJwRExHOUNRVUZCTEVkQlFVVXNSVUZCUVN4RFFVRkJMRU5CUVVNc1QwRkJRU3hGUVVGUExFTkJRVVVzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFMUJRVTBzUTBGQlF5eEZRVUZGTEVOQlFVY3NRMEZCUVN4RlFVRkJPMWxCUTI1RUxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVDBGQlVTeERRVUZCTEVWQlFVRTdZMEZEY2tJc2IwSkJRVU1zV1VGQldTeEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExGVkJRVmNzUTBGQlFTeERRVUZITEVOQlFVRTdXVUZETlVJc1EwRkJRU3hGUVVGQk8xbEJRMDRzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFBRVUZSTEVOQlFVRXNSVUZCUVR0alFVTndRaXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEU5QlFVOHNRMEZCUlR0WlFVTnFRaXhEUVVGQkxFVkJRVUU3V1VGRFRpeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdGQlFXTXNRMEZCUVN4RlFVRkJPMk5CUXpGQ0xFbEJRVXM3V1VGRFJpeERRVUZCTzFWQlEwb3NRMEZCUVR0UlFVTkVMRU5CUVVFN1VVRkRURHRCUVVOU0xFdEJRVXNzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXpzN1NVRkZWQ3hKUVVGSkxGRkJRVkVzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RlFVRkZPMDFCUTNaQ0xFOUJRVThzU1VGQlNTeERRVUZETzBGQlEyeENMRXRCUVVzN08wbEJSVVE3VFVGRFJTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1NVRkJReXhGUVVGRExGRkJRV01zUTBGQlFUdE5RVU51UWp0SFFVTklPMFZCUTBRc1dVRkJXU3hGUVVGRkxGVkJRVlVzUlVGQlJTeEZRVUZGTzBsQlF6RkNMRlZCUVZVc1EwRkJReXhSUVVGUkxFTkJRVU03VFVGRGJFSXNTVUZCU1N4SlFVRkpMRkZCUVZFN1RVRkRhRUlzUzBGQlN5eEhRVUZITEVWQlFVVTdRVUZEYUVJc1MwRkJTeXhEUVVGRExFTkJRVU03TzBsQlJVZ3NTVUZCU1N4RFFVRkRMRk5CUVZNc1JVRkJSU3hEUVVGRE8wZEJRMnhDTzBWQlEwUXNVMEZCVXl4RlFVRkZMRmxCUVZrN1NVRkRja0lzVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXp0TlFVTnNRaXhKUVVGSkxFVkJRVVVzVFVGQlRUdE5RVU5hTEVsQlFVa3NSVUZCUlN4SlFVRkpPMHRCUTFnc1EwRkJReXhEUVVGRE8wZEJRMG83UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZGQlFWRXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1VtVmhZM1FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1MllYSWdYeUFnSUNBZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0ozVnVaR1Z5YzJOdmNtVW5LVHRjYm5aaGNpQlVhWFJzWlVKaGNpQWdJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOTBhWFJzWlY5aVlYSXVhbk40SnlrN1hHNTJZWElnU1dOdmJpQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1TDJOdmJYQnZibVZ1ZEhNdmFXTnZiaTVxYzNnbktUdGNiblpoY2lCa2FYTndZWFJqYUdWeUlDQWdJRDBnY21WeGRXbHlaU2duTGk5a2FYTndZWFJqYUdWeUp5azdYRzUyWVhJZ2MzUnZjbVVnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmMzUnZjbVVuS1R0Y2JuWmhjaUJzYVhOMFgzTjBiM0psSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTlzYVhOMFgzTjBiM0psSnlrN1hHNTJZWElnYldGcGJsOXpkRzl5WlNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YzNSdmNtVW5LVHRjYm5aaGNpQlFjbWx0WVhKNVNXMWhaMlVnSUQwZ2NtVnhkV2x5WlNnbkxpOXdjbWx0WVhKNVgybHRZV2RsTG1wemVDY3BPMXh1ZG1GeUlHMXZiV1Z1ZEdweklDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkdGIyMWxiblFuS1R0Y2JuWmhjaUJNYVhOMFZtbGxkenRjYmx4dVRHbHpkRlpwWlhjZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUdOdmJYQnZibVZ1ZEVScFpFMXZkVzUwT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2JHbHpkRjl6ZEc5eVpTNXZiaWduWVdSa0p5d2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaDdmU2s3WEc0Z0lDQWdmUzVpYVc1a0tIUm9hWE1wS1R0Y2JpQWdmU3hjYmlBZ1kyOXRjRzl1Wlc1MFYybHNiRlZ1Ylc5MWJuUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JzYVhOMFgzTjBiM0psTG05bVppZ25ZV1JrSnlrN1hHNGdJSDBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJ3Y21WZlkyOXVkSEp2YkhNZ0lEMGdXMTA3WEc0Z0lDQWdkbUZ5SUcxdmJXVnVkSE1nSUNBZ0lDQWdQU0IwYUdsekxtSjFhV3hrVFc5dFpXNTBjeWdwTzF4dVhHNGdJQ0FnY0hKbFgyTnZiblJ5YjJ4ekxuQjFjMmdvWEc0Z0lDQWdJQ0E4YkdrZ2EyVjVQVndpWTJGMFpXZHZjbmxjSWlCamJHRnpjMDVoYldVOVhDSjBiM0F0WTI5dWRISnZiRndpUGx4dUlDQWdJQ0FnSUNBOFlTQmpiR0Z6YzA1aGJXVTlYQ0ppZFhSMGIyNWNJaUJ2YmtOc2FXTnJQWHQwYUdsekxtTmhkR1ZuYjNKNVZtbGxkMzArWEc0Z0lDQWdJQ0FnSUNBZ1BFbGpiMjRnZEhsd1pUMWNJbXhwYzNSY0lpQXZQbHh1SUNBZ0lDQWdJQ0E4TDJFK1hHNGdJQ0FnSUNBOEwyeHBQbHh1SUNBZ0lDazdYRzVjYmlBZ0lDQnBaaUFvSVNCMGFHbHpMbkJ5YjNCekxuTmxZWEpqYUNrZ2UxeHVJQ0FnSUNBZ2NISmxYMk52Ym5SeWIyeHpMbkIxYzJnb1hHNGdJQ0FnSUNBZ0lEeHNhU0JyWlhrOVhDSnpaV0Z5WTJoY0lpQmpiR0Z6YzA1aGJXVTlYQ0owYjNBdFkyOXVkSEp2YkZ3aVBseHVJQ0FnSUNBZ0lDQWdJRHhoSUdOc1lYTnpUbUZ0WlQxY0ltSjFkSFJ2Ymx3aUlHOXVRMnhwWTJzOWUzUm9hWE11YzJWaGNtTm9WbWxsZDMwK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4U1dOdmJpQjBlWEJsUFZ3aWMyVmhjbU5vWENJZ0x6NWNiaUFnSUNBZ0lDQWdJQ0E4TDJFK1hHNGdJQ0FnSUNBZ0lEd3ZiR2srWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0lteHBjM1F0ZG1sbGQxd2lQbHh1SUNBZ0lDQWdJQ0E4VkdsMGJHVkNZWEkrWEc0Z0lDQWdJQ0FnSUNBZ1BHNWhkaUJqYkdGemMwNWhiV1U5WENKMGIzQXRibUYyWENJK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4ZFd3K1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUh0d2NtVmZZMjl1ZEhKdmJITXViV0Z3S0daMWJtTjBhVzl1SUNoamIyNTBjbTlzS1NCN2NtVjBkWEp1SUdOdmJuUnliMnc3ZlNsOVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDNWc1BseHVJQ0FnSUNBZ0lDQWdJRHd2Ym1GMlBseHVYRzRnSUNBZ0lDQWdJQ0FnVTJGbVpYUjVJRTF2YldWdWRITmNiaUFnSUNBZ0lDQWdJQ0E4WVNCamJHRnpjMDVoYldVOVhDSmlkWFIwYjI0Z1kyeHZjMlV0WW5WMGRHOXVYQ0lnYjI1RGJHbGphejE3ZEdocGN5NWpiRzl6WlZacFpYZDlQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BFbGpiMjRnZEhsd1pUMWNJbU5zYjNObFhDSWdMejVjYmlBZ0lDQWdJQ0FnSUNBOEwyRStYRzRnSUNBZ0lDQWdJRHd2VkdsMGJHVkNZWEkrWEc0Z0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYkdsemRDMXZaaTF0YjIxbGJuUnpYQ0krWEc0Z0lDQWdJQ0FnSUNBZ2UyMXZiV1Z1ZEhOOVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlN4Y2JpQWdjMlZoY21Ob1ZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhSb2FYTXVZMkYwWldkdmNubFdhV1YzS0NrN1hHNGdJSDBzWEc0Z0lHTmhkR1ZuYjNKNVZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUdScGMzQmhkR05vWlhJdVpHbHpjR0YwWTJnb2UxeHVJQ0FnSUNBZ2RIbHdaVG9nSjNacFpYY25MRnh1SUNBZ0lDQWdkbWxsZHpvZ0oyTmhkR1ZuYjNKNUoxeHVJQ0FnSUgwcE8xeHVJQ0I5TEZ4dUlDQmlkV2xzWkUxdmJXVnVkSE02SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdiVzl0Wlc1MGN6dGNiaUFnSUNCMllYSWdaV3hsYldWdWRITTdYRzRnSUNBZ2RtRnlJR05oZEdWbmIzSjVJRDBnYzNSdmNtVXVaMlYwS0NkallYUmxaMjl5ZVNjcE8xeHVYRzRnSUNBZ2JXOXRaVzUwY3lBOUlHeHBjM1JmYzNSdmNtVXVabWxzZEdWeUtHWjFibU4wYVc5dUlDaHRiMjFsYm5RcElIdGNiaUFnSUNBZ0lHbG1JQ2hqWVhSbFoyOXllU2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYlc5dFpXNTBMbWRsZENnbmEyVjVkMjl5WkhNbktTNXBibVJsZUU5bUtHTmhkR1ZuYjNKNUtTQStJQzB4TzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpUdGNiaUFnSUNCOUtUdGNibHh1SUNBZ0lHVnNaVzFsYm5SeklEMGdYeTV0WVhBb2JXOXRaVzUwY3l3Z1puVnVZM1JwYjI0Z0tHMXZiV1Z1ZEN3Z2FXNWtaWGdwSUh0Y2JpQWdJQ0FnSUhaaGNpQmtZWFJsSUQwZ2JXOXRaVzUwYW5Nb2JXOXRaVzUwTG1kbGRDZ25ZM0psWVhSbFpDY3BLVHRjYmlBZ0lDQWdJSFpoY2lCcGJXRm5aVkJ5YjNCeklEMGdlMXh1SUNBZ0lDQWdJQ0JwYldGblpUb2dJQ0FnYlc5dFpXNTBMbWRsZENnbmFXMWhaMlVuS1N4Y2JpQWdJQ0FnSUNBZ2EyVjVkMjl5WkhNNklHMXZiV1Z1ZEM1blpYUW9KMnRsZVhkdmNtUnpKeWxjYmlBZ0lDQWdJSDA3WEc1Y2JpQWdJQ0FnSUdSaGRHVWdQU0JrWVhSbExtWnZjbTFoZENnblRVMU5JRTBzSUZsWldWa25LVHRjYmx4dUlDQWdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJQ0FnUEd4cElHdGxlVDE3YVc1a1pYaDlJR05zWVhOelRtRnRaVDFjSW0xdmJXVnVkRndpUGx4dUlDQWdJQ0FnSUNBZ0lEeGhJRzl1UTJ4cFkyczllM1JvYVhNdWMyVnNaV04wVFc5dFpXNTBMbUpwYm1Rb2RHaHBjeXdnYlc5dFpXNTBMbWxrS1gwK1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJblJvZFcxaVhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeFFjbWx0WVhKNVNXMWhaMlVnZXk0dUxtbHRZV2RsVUhKdmNITjlJQzgrWEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lkR2wwYkdWY0lqNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2UyMXZiV1Z1ZEM1blpYUW9KM1JwZEd4bEp5bDlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWJYVjBaV1FnYzIxaGJHeGNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdlMlJoZEdWOVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDQWdJQ0E4TDJFK1hHNGdJQ0FnSUNBZ0lEd3ZiR2srWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDBzSUhSb2FYTXBPMXh1WEc0Z0lDQWdhV1lnS0dWc1pXMWxiblJ6TG14bGJtZDBhQ0E4SURFcElIdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdWRXeHNPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGRXdytlMlZzWlcxbGJuUnpmVHd2ZFd3K1hHNGdJQ0FnS1R0Y2JpQWdmU3hjYmlBZ2MyVnNaV04wVFc5dFpXNTBPaUJtZFc1amRHbHZiaUFvYVdRcElIdGNiaUFnSUNCa2FYTndZWFJqYUdWeUxtUnBjM0JoZEdOb0tIdGNiaUFnSUNBZ0lIUjVjR1U2SUNBZ0oyTm9iMjl6WlNjc1hHNGdJQ0FnSUNCMllXeDFaVG9nSUdsa1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNCMGFHbHpMbU5zYjNObFZtbGxkeWdwTzF4dUlDQjlMRnh1SUNCamJHOXpaVlpwWlhjNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQmthWE53WVhSamFHVnlMbVJwYzNCaGRHTm9LSHRjYmlBZ0lDQWdJSFI1Y0dVNklDZDJhV1YzSnl4Y2JpQWdJQ0FnSUhacFpYYzZJRzUxYkd4Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdUR2x6ZEZacFpYYzdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVmlldztcbnZhciBSZWFjdCAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUb3BCYXIgICAgICAgID0gcmVxdWlyZSgnLi90b3BfYmFyLmpzeCcpO1xudmFyIEZvb3RlckJhciAgICAgPSByZXF1aXJlKCcuL2Zvb3Rlcl9iYXIuanN4Jyk7XG52YXIgU3VtbWFyeSAgICAgICA9IHJlcXVpcmUoJy4vc3VtbWFyeS5qc3gnKTtcbnZhciBTcG9uc29yICAgICAgID0gcmVxdWlyZSgnLi9zcG9uc29yLmpzeCcpO1xudmFyIFRpdGxlQmFyICAgICAgPSByZXF1aXJlKCcuL3RpdGxlX2Jhci5qc3gnKTtcbnZhciBMaXN0VmlldyAgICAgID0gcmVxdWlyZSgnLi9saXN0X3ZpZXcuanN4Jyk7XG52YXIgUHJpbWFyeUltYWdlICA9IHJlcXVpcmUoJy4vcHJpbWFyeV9pbWFnZS5qc3gnKTtcbnZhciBtb21lbnQgICAgICAgID0gcmVxdWlyZSgnbW9tZW50Jyk7XG52YXIgc3RvcmUgICAgICAgICA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcblxuVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJWaWV3XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICB2aWV3OiAnbGlzdCcsXG4gICAgICBtb21lbnQ6IG51bGxcbiAgICB9O1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6ICAgICAgICAnU2FmZXR5IE1vbWVudCBUaXRsZScsXG4gICAgICBjcmVhdGVkOiAgICAgIG5ldyBEYXRlKCksXG4gICAgICBzdW1tYXJ5OiAgICAgICdTdW1tYXJ5IHRleHQnLFxuICAgICAgZGV0YWlsOiAgICAgICAnRGV0YWlsIHRleHQnLFxuICAgICAgaGVhZGVyX2ltYWdlOiB1bmRlZmluZWQsXG4gICAgICBrZXl3b3JkczogICAgIFtdXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZShzdG9yZS50b0pTT04oKSk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBzdG9yZS5vZmYoJ2NoYW5nZScpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlldyA9IHRoaXMuYnVpbGRWaWV3KCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbnRlbnRcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRvcEJhciwgbnVsbCksIFxuXG4gICAgICAgIHZpZXdcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBidWlsZFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZm47XG4gICAgdmFyIG1hcDtcblxuICAgIG1hcCA9IHtcbiAgICAgIHNlYXJjaDogJ2J1aWxkU2VhcmNoVmlldycsXG4gICAgICBzaGFyZTogJ2J1aWxkU2hhcmVWaWV3JyxcbiAgICAgIGxpc3Q6ICdidWlsZExpc3RWaWV3J1xuICAgIH07XG5cbiAgICBmbiA9IG1hcFt0aGlzLnN0YXRlLnZpZXddO1xuICAgIGZuID0gdGhpc1tmbl0gfHwgdGhpcy5idWlsZE1haW5WaWV3O1xuXG4gICAgcmV0dXJuIGZuLmNhbGwodGhpcyk7XG4gIH0sXG4gIGJ1aWxkTGlzdFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaXN0Vmlldywge3NlYXJjaDogdHJ1ZX0pXG4gICAgKTtcbiAgfSxcbiAgYnVpbGRNYWluVmlldzogZnVuY3Rpb24gKCkge1xuICAgIHZhciBrZXl3b3JkcyA9IG51bGw7XG4gICAgdmFyIGltYWdlUHJvcHM7XG4gICAgdmFyIGRhdGUgPSBtb21lbnQodGhpcy5wcm9wcy5jcmVhdGVkKTtcblxuICAgIGRhdGUgPSBkYXRlLmZvcm1hdCgnTU1NIE0sIFlZWVknKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmtleXdvcmRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGtleXdvcmRzID0gdGhpcy5wcm9wcy5rZXl3b3JkcyB8fCBbXTtcbiAgICAgIGtleXdvcmRzID0ga2V5d29yZHMubWFwKGZ1bmN0aW9uIChrZXl3b3JkKSB7XG4gICAgICAgIHJldHVybiBrZXl3b3JkLm5hbWU7XG4gICAgICB9KTtcbiAgICAgIGtleXdvcmRzID0ga2V5d29yZHMuam9pbignLCAnKTtcbiAgICB9XG5cbiAgICBpbWFnZVByb3BzID0ge1xuICAgICAgaW1hZ2U6ICAgIHRoaXMucHJvcHMuaGVhZGVyX2ltYWdlLFxuICAgICAga2V5d29yZHM6IHRoaXMucHJvcHMua2V5d29yZHNcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtYWluLXZpZXdcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRpdGxlQmFyLCBudWxsLCBcbiAgICAgICAgICB0aGlzLnByb3BzLnRpdGxlXG4gICAgICAgICksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJpbWFyeUltYWdlLCBSZWFjdC5fX3NwcmVhZCh7fSwgIGltYWdlUHJvcHMpKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm11dGVkIHNtYWxsXCJ9LCBrZXl3b3JkcyksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibXV0ZWQgc21hbGxcIn0sIFwiQ3JlYXRlZCBcIiwgZGF0ZSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3VtbWFyeSwge3ZhbHVlOiB0aGlzLnByb3BzLnN1bW1hcnl9KSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTcG9uc29yLCBudWxsKSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImgzXCIsIG51bGwsIFwiRGV0YWlsczpcIiksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFN1bW1hcnksIHt2YWx1ZTogdGhpcy5wcm9wcy5kZXRhaWx9KSwgXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb290ZXJCYXIsIG51bGwpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5dFlXbHVYM1pwWlhjdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzU1VGQlNTeEpRVUZKTEVOQlFVTTdRVUZEVkN4SlFVRkpMRXRCUVVzc1YwRkJWeXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEY2tNc1NVRkJTU3hOUVVGTkxGVkJRVlVzVDBGQlR5eERRVUZETEdWQlFXVXNRMEZCUXl4RFFVRkRPMEZCUXpkRExFbEJRVWtzVTBGQlV5eFBRVUZQTEU5QlFVOHNRMEZCUXl4clFrRkJhMElzUTBGQlF5eERRVUZETzBGQlEyaEVMRWxCUVVrc1QwRkJUeXhUUVVGVExFOUJRVThzUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXp0QlFVTTNReXhKUVVGSkxFOUJRVThzVTBGQlV5eFBRVUZQTEVOQlFVTXNaVUZCWlN4RFFVRkRMRU5CUVVNN1FVRkROME1zU1VGQlNTeFJRVUZSTEZGQlFWRXNUMEZCVHl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdRVUZETDBNc1NVRkJTU3hSUVVGUkxGRkJRVkVzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGREwwTXNTVUZCU1N4WlFVRlpMRWxCUVVrc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN1FVRkRia1FzU1VGQlNTeE5RVUZOTEZWQlFWVXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRM1JETEVsQlFVa3NTMEZCU3l4WFFVRlhMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6czdRVUZGZGtNc01FSkJRVEJDTEc5Q1FVRkJPMFZCUTNoQ0xHVkJRV1VzUlVGQlJTeFpRVUZaTzBsQlF6TkNMRTlCUVU4N1RVRkRUQ3hKUVVGSkxFVkJRVVVzVFVGQlRUdE5RVU5hTEUxQlFVMHNSVUZCUlN4SlFVRkpPMHRCUTJJc1EwRkJRenRIUVVOSU8wVkJRMFFzWlVGQlpTeEZRVUZGTEZsQlFWazdTVUZETTBJc1QwRkJUenROUVVOTUxFdEJRVXNzVTBGQlV5eHhRa0ZCY1VJN1RVRkRia01zVDBGQlR5eFBRVUZQTEVsQlFVa3NTVUZCU1N4RlFVRkZPMDFCUTNoQ0xFOUJRVThzVDBGQlR5eGpRVUZqTzAxQlF6VkNMRTFCUVUwc1VVRkJVU3hoUVVGaE8wMUJRek5DTEZsQlFWa3NSVUZCUlN4VFFVRlRPMDFCUTNaQ0xGRkJRVkVzVFVGQlRTeEZRVUZGTzB0QlEycENMRU5CUVVNN1IwRkRTRHRGUVVORUxHbENRVUZwUWl4RlFVRkZMRmxCUVZrN1NVRkROMElzUzBGQlN5eERRVUZETEVWQlFVVXNRMEZCUXl4UlFVRlJMRVZCUVVVc1dVRkJXVHROUVVNM1FpeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eERRVUZETzB0QlF5OUNMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTTdSMEZEWmp0RlFVTkVMRzlDUVVGdlFpeEZRVUZGTEZsQlFWazdTVUZEYUVNc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0SFFVTnlRanRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBGQlEzUkNMRWxCUVVrc1NVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEZOQlFWTXNSVUZCUlN4RFFVRkRPenRKUVVVMVFqdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNVMEZCVlN4RFFVRkJMRVZCUVVFN1FVRkRMMElzVVVGQlVTeHZRa0ZCUXl4TlFVRk5MRVZCUVVFc1NVRkJRU3hEUVVGSExFTkJRVUVzUlVGQlFUczdVVUZGVkN4SlFVRkxPMDFCUTBZc1EwRkJRVHROUVVOT08wZEJRMGc3UlVGRFJDeFRRVUZUTEVWQlFVVXNXVUZCV1R0SlFVTnlRaXhKUVVGSkxFVkJRVVVzUTBGQlF6dEJRVU5ZTEVsQlFVa3NTVUZCU1N4SFFVRkhMRU5CUVVNN08wbEJSVklzUjBGQlJ5eEhRVUZITzAxQlEwb3NUVUZCVFN4RlFVRkZMR2xDUVVGcFFqdE5RVU42UWl4TFFVRkxMRVZCUVVVc1owSkJRV2RDTzAxQlEzWkNMRWxCUVVrc1JVRkJSU3hsUVVGbE8wRkJRek5DTEV0QlFVc3NRMEZCUXpzN1NVRkZSaXhGUVVGRkxFZEJRVWNzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE9VSXNTVUZCU1N4RlFVRkZMRWRCUVVjc1NVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eEpRVUZKTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNN08wbEJSWEJETEU5QlFVOHNSVUZCUlN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU4wUWp0RlFVTkVMR0ZCUVdFc1JVRkJSU3haUVVGWk8wbEJRM3BDTzAxQlEwVXNiMEpCUVVNc1VVRkJVU3hGUVVGQkxFTkJRVUVzUTBGQlF5eE5RVUZCTEVWQlFVMHNRMEZCUlN4SlFVRkxMRU5CUVVFc1EwRkJSeXhEUVVGQk8wMUJRekZDTzBkQlEwZzdSVUZEUkN4aFFVRmhMRVZCUVVVc1dVRkJXVHRKUVVONlFpeEpRVUZKTEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNN1NVRkRjRUlzU1VGQlNTeFZRVUZWTEVOQlFVTTdRVUZEYmtJc1NVRkJTU3hKUVVGSkxFbEJRVWtzUjBGQlJ5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6czdRVUZGTVVNc1NVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4aFFVRmhMRU5CUVVNc1EwRkJRenM3U1VGRmJFTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RlFVRkZPMDFCUTJ4RExGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1NVRkJTU3hGUVVGRkxFTkJRVU03VFVGRGNrTXNVVUZCVVN4SFFVRkhMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeFBRVUZQTEVWQlFVVTdVVUZEZWtNc1QwRkJUeXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETzA5QlEzSkNMRU5CUVVNc1EwRkJRenROUVVOSUxGRkJRVkVzUjBGQlJ5eFJRVUZSTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRM0pETEV0QlFVczdPMGxCUlVRc1ZVRkJWU3hIUVVGSE8wMUJRMWdzUzBGQlN5eExRVUZMTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1dVRkJXVHROUVVOcVF5eFJRVUZSTEVWQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUk8wRkJRMjVETEV0QlFVc3NRMEZCUXpzN1NVRkZSanROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVjBGQldTeERRVUZCTEVWQlFVRTdVVUZEZWtJc2IwSkJRVU1zVVVGQlVTeEZRVUZCTEVsQlFVTXNSVUZCUVR0VlFVTlFMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlRUdEJRVU0xUWl4UlFVRnRRaXhEUVVGQkxFVkJRVUU3TzBGQlJXNUNMRkZCUVZFc2IwSkJRVU1zV1VGQldTeEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExGVkJRVmNzUTBGQlFTeERRVUZITEVOQlFVRXNSVUZCUVRzN1VVRkZhRU1zYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGhRVUZqTEVOQlFVRXNSVUZCUXl4UlFVRmxMRU5CUVVFc1JVRkJRVHRCUVVOeVJDeFJRVUZSTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNZVUZCWXl4RFFVRkJMRVZCUVVFc1ZVRkJRU3hGUVVGVExFbEJRVmNzUTBGQlFTeEZRVUZCT3p0QlFVVjZSQ3hSUVVGUkxHOUNRVUZETEU5QlFVOHNSVUZCUVN4RFFVRkJMRU5CUVVNc1MwRkJRU3hGUVVGTExFTkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlJMRU5CUVVFc1EwRkJSeXhEUVVGQkxFVkJRVUU3TzBGQlJUbERMRkZCUVZFc2IwSkJRVU1zVDBGQlR5eEZRVUZCTEVsQlFVRXNRMEZCUnl4RFFVRkJMRVZCUVVFN08xRkJSVmdzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRWxCUVVNc1JVRkJRU3hWUVVGaExFTkJRVUVzUlVGQlFUdEJRVU42UWl4UlFVRlJMRzlDUVVGRExFOUJRVThzUlVGQlFTeERRVUZCTEVOQlFVTXNTMEZCUVN4RlFVRkxMRU5CUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUZQTEVOQlFVRXNRMEZCUnl4RFFVRkJMRVZCUVVFN08xRkJSWEpETEc5Q1FVRkRMRk5CUVZNc1JVRkJRU3hKUVVGQkxFTkJRVWNzUTBGQlFUdE5RVU5VTEVOQlFVRTdUVUZEVGp0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhKUVVGSkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZacFpYYzdYRzUyWVhJZ1VtVmhZM1FnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBKeWs3WEc1MllYSWdWRzl3UW1GeUlDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZkRzl3WDJKaGNpNXFjM2duS1R0Y2JuWmhjaUJHYjI5MFpYSkNZWElnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTltYjI5MFpYSmZZbUZ5TG1wemVDY3BPMXh1ZG1GeUlGTjFiVzFoY25rZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwzTjFiVzFoY25rdWFuTjRKeWs3WEc1MllYSWdVM0J2Ym5OdmNpQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZjM0J2Ym5OdmNpNXFjM2duS1R0Y2JuWmhjaUJVYVhSc1pVSmhjaUFnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTkwYVhSc1pWOWlZWEl1YW5ONEp5azdYRzUyWVhJZ1RHbHpkRlpwWlhjZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmJHbHpkRjkyYVdWM0xtcHplQ2NwTzF4dWRtRnlJRkJ5YVcxaGNubEpiV0ZuWlNBZ1BTQnlaWEYxYVhKbEtDY3VMM0J5YVcxaGNubGZhVzFoWjJVdWFuTjRKeWs3WEc1MllYSWdiVzl0Wlc1MElDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0oyMXZiV1Z1ZENjcE8xeHVkbUZ5SUhOMGIzSmxJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2N1TDNOMGIzSmxKeWs3WEc1Y2JsWnBaWGNnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJR2RsZEVsdWFYUnBZV3hUZEdGMFpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQjJhV1YzT2lBbmJHbHpkQ2NzWEc0Z0lDQWdJQ0J0YjIxbGJuUTZJRzUxYkd4Y2JpQWdJQ0I5TzF4dUlDQjlMRnh1SUNCblpYUkVaV1poZFd4MFVISnZjSE02SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnZEdsMGJHVTZJQ0FnSUNBZ0lDQW5VMkZtWlhSNUlFMXZiV1Z1ZENCVWFYUnNaU2NzWEc0Z0lDQWdJQ0JqY21WaGRHVmtPaUFnSUNBZ0lHNWxkeUJFWVhSbEtDa3NYRzRnSUNBZ0lDQnpkVzF0WVhKNU9pQWdJQ0FnSUNkVGRXMXRZWEo1SUhSbGVIUW5MRnh1SUNBZ0lDQWdaR1YwWVdsc09pQWdJQ0FnSUNBblJHVjBZV2xzSUhSbGVIUW5MRnh1SUNBZ0lDQWdhR1ZoWkdWeVgybHRZV2RsT2lCMWJtUmxabWx1WldRc1hHNGdJQ0FnSUNCclpYbDNiM0prY3pvZ0lDQWdJRnRkWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNiaUFnWTI5dGNHOXVaVzUwUkdsa1RXOTFiblE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCemRHOXlaUzV2YmlnblkyaGhibWRsSnl3Z1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoemRHOXlaUzUwYjBwVFQwNG9LU2s3WEc0Z0lDQWdmUzVpYVc1a0tIUm9hWE1wS1R0Y2JpQWdmU3hjYmlBZ1kyOXRjRzl1Wlc1MFYybHNiRlZ1Ylc5MWJuUTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J6ZEc5eVpTNXZabVlvSjJOb1lXNW5aU2NwTzF4dUlDQjlMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdkbWxsZHlBOUlIUm9hWE11WW5WcGJHUldhV1YzS0NrN1hHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0pqYjI1MFpXNTBYQ0krWEc0Z0lDQWdJQ0FnSUR4VWIzQkNZWElnTHo1Y2JseHVJQ0FnSUNBZ0lDQjdkbWxsZDMxY2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJR0oxYVd4a1ZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQm1ianRjYmlBZ0lDQjJZWElnYldGd08xeHVYRzRnSUNBZ2JXRndJRDBnZTF4dUlDQWdJQ0FnYzJWaGNtTm9PaUFuWW5WcGJHUlRaV0Z5WTJoV2FXVjNKeXhjYmlBZ0lDQWdJSE5vWVhKbE9pQW5ZblZwYkdSVGFHRnlaVlpwWlhjbkxGeHVJQ0FnSUNBZ2JHbHpkRG9nSjJKMWFXeGtUR2x6ZEZacFpYY25YRzRnSUNBZ2ZUdGNibHh1SUNBZ0lHWnVJRDBnYldGd1czUm9hWE11YzNSaGRHVXVkbWxsZDEwN1hHNGdJQ0FnWm00Z1BTQjBhR2x6VzJadVhTQjhmQ0IwYUdsekxtSjFhV3hrVFdGcGJsWnBaWGM3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdabTR1WTJGc2JDaDBhR2x6S1R0Y2JpQWdmU3hjYmlBZ1luVnBiR1JNYVhOMFZtbGxkem9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4VEdsemRGWnBaWGNnYzJWaGNtTm9QWHQwY25WbGZTQXZQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJR0oxYVd4a1RXRnBibFpwWlhjNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnYTJWNWQyOXlaSE1nUFNCdWRXeHNPMXh1SUNBZ0lIWmhjaUJwYldGblpWQnliM0J6TzF4dUlDQWdJSFpoY2lCa1lYUmxJRDBnYlc5dFpXNTBLSFJvYVhNdWNISnZjSE11WTNKbFlYUmxaQ2s3WEc1Y2JpQWdJQ0JrWVhSbElEMGdaR0YwWlM1bWIzSnRZWFFvSjAxTlRTQk5MQ0JaV1ZsWkp5azdYRzVjYmlBZ0lDQnBaaUFvZEdocGN5NXdjbTl3Y3k1clpYbDNiM0prY3k1c1pXNW5kR2dnUGlBd0tTQjdYRzRnSUNBZ0lDQnJaWGwzYjNKa2N5QTlJSFJvYVhNdWNISnZjSE11YTJWNWQyOXlaSE1nZkh3Z1cxMDdYRzRnSUNBZ0lDQnJaWGwzYjNKa2N5QTlJR3RsZVhkdmNtUnpMbTFoY0NobWRXNWpkR2x2YmlBb2EyVjVkMjl5WkNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2EyVjVkMjl5WkM1dVlXMWxPMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdJQ0JyWlhsM2IzSmtjeUE5SUd0bGVYZHZjbVJ6TG1wdmFXNG9KeXdnSnlrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVcxaFoyVlFjbTl3Y3lBOUlIdGNiaUFnSUNBZ0lHbHRZV2RsT2lBZ0lDQjBhR2x6TG5CeWIzQnpMbWhsWVdSbGNsOXBiV0ZuWlN4Y2JpQWdJQ0FnSUd0bGVYZHZjbVJ6T2lCMGFHbHpMbkJ5YjNCekxtdGxlWGR2Y21SelhHNGdJQ0FnZlR0Y2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbTFoYVc0dGRtbGxkMXdpUGx4dUlDQWdJQ0FnSUNBOFZHbDBiR1ZDWVhJK1hHNGdJQ0FnSUNBZ0lDQWdlM1JvYVhNdWNISnZjSE11ZEdsMGJHVjlYRzRnSUNBZ0lDQWdJRHd2VkdsMGJHVkNZWEkrWEc1Y2JpQWdJQ0FnSUNBZ1BGQnlhVzFoY25sSmJXRm5aU0I3TGk0dWFXMWhaMlZRY205d2MzMGdMejVjYmx4dUlDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW0xMWRHVmtJSE50WVd4c1hDSStlMnRsZVhkdmNtUnpmVHd2WkdsMlBseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltMTFkR1ZrSUhOdFlXeHNYQ0krUTNKbFlYUmxaQ0I3WkdGMFpYMDhMMlJwZGo1Y2JseHVJQ0FnSUNBZ0lDQThVM1Z0YldGeWVTQjJZV3gxWlQxN2RHaHBjeTV3Y205d2N5NXpkVzF0WVhKNWZTQXZQbHh1WEc0Z0lDQWdJQ0FnSUR4VGNHOXVjMjl5SUM4K1hHNWNiaUFnSUNBZ0lDQWdQR2d6UGtSbGRHRnBiSE02UEM5b016NWNiaUFnSUNBZ0lDQWdQRk4xYlcxaGNua2dkbUZzZFdVOWUzUm9hWE11Y0hKdmNITXVaR1YwWVdsc2ZTQXZQbHh1WEc0Z0lDQWdJQ0FnSUR4R2IyOTBaWEpDWVhJZ0x6NWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGWnBaWGM3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEljb24gICAgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL2ljb24uanN4Jyk7XG52YXIgUHJpbWFyeUltYWdlO1xuXG5QcmltYXJ5SW1hZ2UgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiUHJpbWFyeUltYWdlXCIsXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBrZXl3b3JkczogW11cbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgSW1hZ2VFbDtcblxuICAgIGlmICh0aGlzLnByb3BzLmltYWdlICYmIHRoaXMucHJvcHMuaW1hZ2UuaW1hZ2UpIHtcbiAgICAgIEltYWdlRWwgPSB0aGlzLmJ1aWxkRnJvbUltYWdlKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgSW1hZ2VFbCA9IHRoaXMuYnVpbGRGcm9tQ2F0ZWdvcnkoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgICAgSW1hZ2VFbFxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGJ1aWxkRnJvbUNhdGVnb3J5OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhdGVnb3J5ID0gdGhpcy5wcm9wcy5rZXl3b3JkcyB8fCBbXTtcblxuICAgIGNhdGVnb3J5ID0gY2F0ZWdvcnlbMF0gfHwge307XG4gICAgY2F0ZWdvcnkgPSBjYXRlZ29yeS5uYW1lIHx8ICdiYW4nO1xuICAgIGNhdGVnb3J5ID0gJ3NoaWVsZCc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByaW1hcnktaW1hZ2UtZmFrZVwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IGNhdGVnb3J5fSlcbiAgICAgIClcbiAgICApO1xuICB9LFxuICBidWlsZEZyb21JbWFnZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbWFnZSA9IHRoaXMucHJvcHMuaW1hZ2U7XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7c3JjOiBpbWFnZS5pbWFnZSwgY2xhc3NOYW1lOiBcInByaW1hcnktaW1hZ2VcIn0pXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJpbWFyeUltYWdlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzl3Y21sdFlYSjVYMmx0WVdkbExtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU12UWl4SlFVRkpMRWxCUVVrc1RVRkJUU3hQUVVGUExFTkJRVU1zZDBKQlFYZENMRU5CUVVNc1EwRkJRenRCUVVOb1JDeEpRVUZKTEZsQlFWa3NRMEZCUXpzN1FVRkZha0lzYTBOQlFXdERMRFJDUVVGQk8wVkJRMmhETEdWQlFXVXNSVUZCUlN4WlFVRlpPMGxCUXpOQ0xFOUJRVTg3VFVGRFRDeFJRVUZSTEVWQlFVVXNSVUZCUlR0TFFVTmlMRU5CUVVNN1IwRkRTRHRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBGQlEzUkNMRWxCUVVrc1NVRkJTU3hQUVVGUExFTkJRVU03TzBsQlJWb3NTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFdEJRVXNzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFVkJRVVU3VFVGRE9VTXNUMEZCVHl4SFFVRkhMRWxCUVVrc1EwRkJReXhqUVVGakxFVkJRVVVzUTBGQlF6dExRVU5xUXp0VFFVTkpPMDFCUTBnc1QwRkJUeXhIUVVGSExFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1JVRkJSU3hEUVVGRE8wRkJRM3BETEV0QlFVczdPMGxCUlVRN1RVRkRSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNTVUZCUXl4RlFVRkJPMUZCUTBZc1QwRkJVVHROUVVOTUxFTkJRVUU3VFVGRFRqdEhRVU5JTzBWQlEwUXNhVUpCUVdsQ0xFVkJRVVVzV1VGQldUdEJRVU5xUXl4SlFVRkpMRWxCUVVrc1VVRkJVU3hIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNVVUZCVVN4SlFVRkpMRVZCUVVVc1EwRkJRenM3U1VGRmVrTXNVVUZCVVN4SFFVRkhMRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTTdTVUZETjBJc1VVRkJVU3hIUVVGSExGRkJRVkVzUTBGQlF5eEpRVUZKTEVsQlFVa3NTMEZCU3l4RFFVRkRPMEZCUTNSRExFbEJRVWtzVVVGQlVTeEhRVUZITEZGQlFWRXNRMEZCUXpzN1NVRkZjRUk3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEc5Q1FVRnhRaXhEUVVGQkxFVkJRVUU3VVVGRGJFTXNiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUlN4UlFVRlRMRU5CUVVFc1EwRkJSeXhEUVVGQk8wMUJRM0JDTEVOQlFVRTdUVUZEVGp0SFFVTklPMFZCUTBRc1kwRkJZeXhGUVVGRkxGbEJRVms3UVVGRE9VSXNTVUZCU1N4SlFVRkpMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXpzN1NVRkZOMEk3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZGTEV0QlFVc3NRMEZCUXl4TFFVRkxMRVZCUVVNc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGxRVUZsTEVOQlFVRXNRMEZCUnl4RFFVRkJPMDFCUTI1RU8wZEJRMGc3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZsQlFWa3NRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1VtVmhZM1FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNTJZWElnU1dOdmJpQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUwyTnZiWEJ2Ym1WdWRITXZhV052Ymk1cWMzZ25LVHRjYm5aaGNpQlFjbWx0WVhKNVNXMWhaMlU3WEc1Y2JsQnlhVzFoY25sSmJXRm5aU0E5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdaMlYwUkdWbVlYVnNkRkJ5YjNCek9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lHdGxlWGR2Y21Sek9pQmJYVnh1SUNBZ0lIMDdYRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCSmJXRm5aVVZzTzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11Y0hKdmNITXVhVzFoWjJVZ0ppWWdkR2hwY3k1d2NtOXdjeTVwYldGblpTNXBiV0ZuWlNrZ2UxeHVJQ0FnSUNBZ1NXMWhaMlZGYkNBOUlIUm9hWE11WW5WcGJHUkdjbTl0U1cxaFoyVW9LVHRjYmlBZ0lDQjlYRzRnSUNBZ1pXeHpaU0I3WEc0Z0lDQWdJQ0JKYldGblpVVnNJRDBnZEdocGN5NWlkV2xzWkVaeWIyMURZWFJsWjI5eWVTZ3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJQbHh1SUNBZ0lDQWdJQ0I3U1cxaFoyVkZiSDFjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDBzWEc0Z0lHSjFhV3hrUm5KdmJVTmhkR1ZuYjNKNU9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUdOaGRHVm5iM0o1SUQwZ2RHaHBjeTV3Y205d2N5NXJaWGwzYjNKa2N5QjhmQ0JiWFR0Y2JseHVJQ0FnSUdOaGRHVm5iM0o1SUQwZ1kyRjBaV2R2Y25sYk1GMGdmSHdnZTMwN1hHNGdJQ0FnWTJGMFpXZHZjbmtnUFNCallYUmxaMjl5ZVM1dVlXMWxJSHg4SUNkaVlXNG5PMXh1SUNBZ0lHTmhkR1ZuYjNKNUlEMGdKM05vYVdWc1pDYzdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKd2NtbHRZWEo1TFdsdFlXZGxMV1poYTJWY0lqNWNiaUFnSUNBZ0lDQWdQRWxqYjI0Z2RIbHdaVDE3WTJGMFpXZHZjbmw5SUM4K1hHNGdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQXBPMXh1SUNCOUxGeHVJQ0JpZFdsc1pFWnliMjFKYldGblpUb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCcGJXRm5aU0E5SUhSb2FYTXVjSEp2Y0hNdWFXMWhaMlU3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR2x0WnlCemNtTTllMmx0WVdkbExtbHRZV2RsZlNCamJHRnpjMDVoYldVOVhDSndjbWx0WVhKNUxXbHRZV2RsWENJZ0x6NWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JRY21sdFlYSjVTVzFoWjJVN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBTcG9uc29yO1xuXG5TcG9uc29yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlNwb25zb3JcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzcG9uc29yXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInNtYWxsIG11dGVkXCJ9LCBcbiAgICAgICAgICBcIlNwb25zb3JlZCBieTpcIlxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInNwb25zb3ItY29udGVudFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzcG9uc29yLWltYWdlXCJ9KSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJzcG9uc29yLW5hbWVcIn0sIFxuICAgICAgICAgICAgXCJIaWx0aSByaXNrIGFzc3VtcHRpb24gcHJvZHVjdHNcIlxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNwb25zb3I7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXpjRzl1YzI5eUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU12UWl4SlFVRkpMRTlCUVU4c1EwRkJRenM3UVVGRldpdzJRa0ZCTmtJc2RVSkJRVUU3UlVGRE0wSXNUVUZCVFN4RlFVRkZMRmxCUVZrN1NVRkRiRUk3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZOQlFWVXNRMEZCUVN4RlFVRkJPMUZCUTNaQ0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zWVVGQll5eERRVUZCTEVWQlFVRTdRVUZCUVN4VlFVRkJMR1ZCUVVFN1FVRkJRU3hSUVVWMlFpeERRVUZCTEVWQlFVRTdVVUZEVGl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR2xDUVVGclFpeERRVUZCTEVWQlFVRTdWVUZETDBJc2IwSkJRVUVzVFVGQlN5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhsUVVGbExFTkJRVUVzUTBGQlJ5eERRVUZCTEVWQlFVRTdWVUZEYkVNc2IwSkJRVUVzVFVGQlN5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhqUVVGbExFTkJRVUVzUlVGQlFUdEJRVUZCTEZsQlFVRXNaME5CUVVFN1FVRkJRU3hWUVVWNFFpeERRVUZCTzFGQlEwZ3NRMEZCUVR0TlFVTkdMRU5CUVVFN1RVRkRUanRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRkpsWVdOMElDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlGTndiMjV6YjNJN1hHNWNibE53YjI1emIzSWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5Od2IyNXpiM0pjSWo1Y2JpQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKemJXRnNiQ0J0ZFhSbFpGd2lQbHh1SUNBZ0lDQWdJQ0FnSUZOd2IyNXpiM0psWkNCaWVUcGNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWMzQnZibk52Y2kxamIyNTBaVzUwWENJK1hHNGdJQ0FnSUNBZ0lDQWdQSE53WVc0Z1kyeGhjM05PWVcxbFBWd2ljM0J2Ym5OdmNpMXBiV0ZuWlZ3aUlDOCtYRzRnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpYzNCdmJuTnZjaTF1WVcxbFhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNCSWFXeDBhU0J5YVhOcklHRnpjM1Z0Y0hScGIyNGdjSEp2WkhWamRITmNiaUFnSUNBZ0lDQWdJQ0E4TDNOd1lXNCtYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1UzQnZibk52Y2p0Y2JpSmRmUT09IiwidmFyIHN0b3JlO1xudmFyIFN0b3JlO1xudmFyIGRpc3BhdGNoZXIgID0gcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyk7XG52YXIgQmFja2JvbmUgICAgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xuXG5TdG9yZSA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIGRlZmF1bHRzOiB7XG4gICAgdmlldzogICAgIG51bGwsXG4gICAgY2F0ZWdvcnk6IG51bGwsXG4gICAgbW9tZW50OiAgIG51bGxcbiAgfSxcbiAgZGlzcGF0Y2hIYW5kbGVyOiBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgIHN3aXRjaCAocGF5bG9hZC50eXBlKSB7XG4gICAgICBjYXNlICd2aWV3JzpcbiAgICAgICAgdGhpcy5zZXQoJ3ZpZXcnLCBwYXlsb2FkLnZpZXcpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2Nob29zZSc6XG4gICAgICAgIHRoaXMuc2V0KCdtb21lbnQnLCBwYXlsb2FkLnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjYXRlZ29yeSc6XG4gICAgICAgIHRoaXMuc2V0KCdjYXRlZ29yeScsIHBheWxvYWQudmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbn0pO1xuXG5zdG9yZSA9IG5ldyBTdG9yZSgpO1xuXG5zdG9yZS50b2tlbiA9IGRpc3BhdGNoZXIucmVnaXN0ZXIoc3RvcmUuZGlzcGF0Y2hIYW5kbGVyLmJpbmQoc3RvcmUpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5emRHOXlaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeEpRVUZKTEV0QlFVc3NRMEZCUXp0QlFVTldMRWxCUVVrc1MwRkJTeXhEUVVGRE8wRkJRMVlzU1VGQlNTeFZRVUZWTEVsQlFVa3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE8wRkJRekZETEVsQlFVa3NVVUZCVVN4TlFVRk5MRTlCUVU4c1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdRVUZGZEVNc1MwRkJTeXhIUVVGSExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRPMFZCUXpWQ0xGRkJRVkVzUlVGQlJUdEpRVU5TTEVsQlFVa3NUVUZCVFN4SlFVRkpPMGxCUTJRc1VVRkJVU3hGUVVGRkxFbEJRVWs3U1VGRFpDeE5RVUZOTEVsQlFVa3NTVUZCU1R0SFFVTm1PMFZCUTBRc1pVRkJaU3hGUVVGRkxGVkJRVlVzVDBGQlR5eEZRVUZGTzBsQlEyeERMRkZCUVZFc1QwRkJUeXhEUVVGRExFbEJRVWs3VFVGRGJFSXNTMEZCU3l4TlFVRk5PMUZCUTFRc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eE5RVUZOTEVWQlFVVXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8xRkJReTlDTEUxQlFVMDdUVUZEVWl4TFFVRkxMRkZCUVZFN1VVRkRXQ3hKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEZGQlFWRXNSVUZCUlN4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03VVVGRGJFTXNUVUZCVFR0TlFVTlNMRXRCUVVzc1ZVRkJWVHRSUVVOaUxFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNWVUZCVlN4RlFVRkZMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dFJRVU53UXl4TlFVRk5PMHRCUTFRN1IwRkRSanRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRXRCUVVzc1IwRkJSeXhKUVVGSkxFdEJRVXNzUlVGQlJTeERRVUZET3p0QlFVVndRaXhMUVVGTExFTkJRVU1zUzBGQlN5eEhRVUZITEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNc1MwRkJTeXhEUVVGRExHVkJRV1VzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRmNrVXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKMllYSWdjM1J2Y21VN1hHNTJZWElnVTNSdmNtVTdYRzUyWVhJZ1pHbHpjR0YwWTJobGNpQWdQU0J5WlhGMWFYSmxLQ2N1TDJScGMzQmhkR05vWlhJbktUdGNiblpoY2lCQ1lXTnJZbTl1WlNBZ0lDQTlJSEpsY1hWcGNtVW9KMkpoWTJ0aWIyNWxKeWs3WEc1Y2JsTjBiM0psSUQwZ1FtRmphMkp2Ym1VdVRXOWtaV3d1WlhoMFpXNWtLSHRjYmlBZ1pHVm1ZWFZzZEhNNklIdGNiaUFnSUNCMmFXVjNPaUFnSUNBZ2JuVnNiQ3hjYmlBZ0lDQmpZWFJsWjI5eWVUb2diblZzYkN4Y2JpQWdJQ0J0YjIxbGJuUTZJQ0FnYm5Wc2JGeHVJQ0I5TEZ4dUlDQmthWE53WVhSamFFaGhibVJzWlhJNklHWjFibU4wYVc5dUlDaHdZWGxzYjJGa0tTQjdYRzRnSUNBZ2MzZHBkR05vSUNod1lYbHNiMkZrTG5SNWNHVXBJSHRjYmlBZ0lDQWdJR05oYzJVZ0ozWnBaWGNuT2x4dUlDQWdJQ0FnSUNCMGFHbHpMbk5sZENnbmRtbGxkeWNzSUhCaGVXeHZZV1F1ZG1sbGR5azdYRzRnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUNBZ1kyRnpaU0FuWTJodmIzTmxKenBjYmlBZ0lDQWdJQ0FnZEdocGN5NXpaWFFvSjIxdmJXVnVkQ2NzSUhCaGVXeHZZV1F1ZG1Gc2RXVXBPMXh1SUNBZ0lDQWdJQ0JpY21WaGF6dGNiaUFnSUNBZ0lHTmhjMlVnSjJOaGRHVm5iM0o1SnpwY2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WlhRb0oyTmhkR1ZuYjNKNUp5d2djR0Y1Ykc5aFpDNTJZV3gxWlNrN1hHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJSDFjYmlBZ2ZWeHVmU2s3WEc1Y2JuTjBiM0psSUQwZ2JtVjNJRk4wYjNKbEtDazdYRzVjYm5OMGIzSmxMblJ2YTJWdUlEMGdaR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWh6ZEc5eVpTNWthWE53WVhSamFFaGhibVJzWlhJdVltbHVaQ2h6ZEc5eVpTa3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhOMGIzSmxPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgbWFya2VkICA9IHJlcXVpcmUoJ21hcmtlZCcpO1xudmFyIFN1bW1hcnk7XG5cblN1bW1hcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU3VtbWFyeVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmF3ID0gbWFya2VkKHRoaXMucHJvcHMudmFsdWUsIHtzYW5pdGl6ZTogdHJ1ZX0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzdW1tYXJ5XCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7X19odG1sOiByYXd9fSlcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdW1tYXJ5O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzl6ZFcxdFlYSjVMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzUzBGQlN5eExRVUZMTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNdlFpeEpRVUZKTEUxQlFVMHNTVUZCU1N4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRGFFTXNTVUZCU1N4UFFVRlBMRU5CUVVNN08wRkJSVm9zTmtKQlFUWkNMSFZDUVVGQk8wVkJRek5DTEUxQlFVMHNSVUZCUlN4WlFVRlpPMEZCUTNSQ0xFbEJRVWtzU1VGQlNTeEhRVUZITEVkQlFVY3NUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTXNVVUZCVVN4RlFVRkZMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03TzBsQlJYSkVPMDFCUTBVc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhUUVVGVkxFTkJRVUVzUlVGQlFUdFJRVU4yUWl4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEhWQ1FVRkJMRVZCUVhWQ0xFTkJRVVVzUTBGQlF5eE5RVUZOTEVWQlFVVXNSMEZCUnl4RFFVRkZMRU5CUVVFc1EwRkJSeXhEUVVGQk8wMUJRelZETEVOQlFVRTdUVUZEVGp0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZKbFlXTjBJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRzFoY210bFpDQWdQU0J5WlhGMWFYSmxLQ2R0WVhKclpXUW5LVHRjYm5aaGNpQlRkVzF0WVhKNU8xeHVYRzVUZFcxdFlYSjVJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnY21GM0lEMGdiV0Z5YTJWa0tIUm9hWE11Y0hKdmNITXVkbUZzZFdVc0lIdHpZVzVwZEdsNlpUb2dkSEoxWlgwcE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYzNWdGJXRnllVndpUGx4dUlDQWdJQ0FnSUNBOGMzQmhiaUJrWVc1blpYSnZkWE5zZVZObGRFbHVibVZ5U0ZSTlREMTdlMTlmYUhSdGJEb2djbUYzZlgwZ0x6NWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMWNibjBwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGTjFiVzFoY25rN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUaXRsZUJhcjtcblxuVGl0bGVCYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVGl0bGVCYXJcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJ0aXRsZS1iYXJcIn0sIFxuICAgICAgICB0aGlzLnByb3BzLmNoaWxkcmVuXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVGl0bGVCYXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOTBhWFJzWlY5aVlYSXVhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hMUVVGTExFdEJRVXNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUXk5Q0xFbEJRVWtzVVVGQlVTeERRVUZET3p0QlFVVmlMRGhDUVVFNFFpeDNRa0ZCUVR0RlFVTTFRaXhOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWp0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1YwRkJXU3hEUVVGQkxFVkJRVUU3VVVGRGVFSXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGVE8wMUJRMnBDTEVOQlFVRTdUVUZEVGp0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhSUVVGUkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZKbFlXTjBJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRlJwZEd4bFFtRnlPMXh1WEc1VWFYUnNaVUpoY2lBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJQ2hjYmlBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2lkR2wwYkdVdFltRnlYQ0krWEc0Z0lDQWdJQ0FnSUh0MGFHbHpMbkJ5YjNCekxtTm9hV3hrY21WdWZWeHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZHbDBiR1ZDWVhJN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBUb3BCYXI7XG5cblRvcEJhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJUb3BCYXJcIixcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJkZXZpY2UtYmFyXCJ9LCBcbiAgICAgICAgXCJTYWZldHlNb21lbnR1bS5jb21cIlxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcEJhcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5MGIzQmZZbUZ5TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhKUVVGSkxFMUJRVTBzUTBGQlF6czdRVUZGV0N3MFFrRkJORUlzYzBKQlFVRTdSVUZETVVJc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSTdUVUZEUlN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRmxCUVdFc1EwRkJRU3hGUVVGQk8wRkJRVUVzVVVGQlFTeHZRa0ZCUVR0QlFVRkJMRTFCUlhSQ0xFTkJRVUU3VFVGRFRqdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4TlFVRk5MRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGSmxZV04wSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUZSdmNFSmhjanRjYmx4dVZHOXdRbUZ5SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSmtaWFpwWTJVdFltRnlYQ0krWEc0Z0lDQWdJQ0FnSUZOaFptVjBlVTF2YldWdWRIVnRMbU52YlZ4dUlDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkc5d1FtRnlPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgVmlldztcbnZhciBSZWFjdCAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBNYWluVmlldyAgICAgID0gcmVxdWlyZSgnLi9tYWluX3ZpZXcuanN4Jyk7XG52YXIgc3RvcmUgICAgICAgICA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcbnZhciBsaXN0X3N0b3JlICAgID0gcmVxdWlyZSgnLi9saXN0X3N0b3JlJyk7XG5cblZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVmlld1wiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYXN5bmM6ICBmYWxzZSxcbiAgICAgIG1vbWVudDogbnVsbFxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUub24oJ2NoYW5nZTptb21lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmdldE1vbWVudCgpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUub2ZmKCdjaGFuZ2UnKTtcbiAgfSxcbiAgZ2V0TW9tZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNob2ljZSA9IHN0b3JlLmdldCgnbW9tZW50Jyk7XG4gICAgdmFyIG1vbWVudCA9IGxpc3Rfc3RvcmUuZ2V0KGNob2ljZSk7XG5cbiAgICBpZiAoISBtb21lbnQpIHtcbiAgICAgIG1vbWVudCA9IGxpc3Rfc3RvcmUuYWRkKHtpZDogY2hvaWNlfSk7XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2FzeW5jOiB0cnVlfSk7XG5cbiAgICAgIHJldHVybiBtb21lbnQuZmV0Y2goe3N1Y2Nlc3M6IHRoaXMuY2hvb3NlTW9tZW50LmJpbmQodGhpcyl9KTtcbiAgICB9XG5cbiAgICB0aGlzLmNob29zZU1vbWVudChtb21lbnQpO1xuICB9LFxuICBjaG9vc2VNb21lbnQ6IGZ1bmN0aW9uIChtb21lbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgIG1vbWVudDogbW9tZW50XG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9wcyA9ICh0aGlzLnN0YXRlLm1vbWVudCAmJiB0aGlzLnN0YXRlLm1vbWVudC50b0pTT04oKSkgfHwge307XG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNYWluVmlldywgUmVhY3QuX19zcHJlYWQoe30sICBwcm9wcykpXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5MmFXVjNMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzU1VGQlNTeERRVUZETzBGQlExUXNTVUZCU1N4TFFVRkxMRmRCUVZjc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEzSkRMRWxCUVVrc1VVRkJVU3hSUVVGUkxFOUJRVThzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8wRkJReTlETEVsQlFVa3NTMEZCU3l4WFFVRlhMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU4yUXl4SlFVRkpMRlZCUVZVc1RVRkJUU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdPMEZCUlRWRExEQkNRVUV3UWl4dlFrRkJRVHRGUVVONFFpeGxRVUZsTEVWQlFVVXNXVUZCV1R0SlFVTXpRaXhQUVVGUE8wMUJRMHdzUzBGQlN5eEhRVUZITEV0QlFVczdUVUZEWWl4TlFVRk5MRVZCUVVVc1NVRkJTVHRMUVVOaUxFTkJRVU03UjBGRFNEdEZRVU5FTEdsQ1FVRnBRaXhGUVVGRkxGbEJRVms3U1VGRE4wSXNTMEZCU3l4RFFVRkRMRVZCUVVVc1EwRkJReXhsUVVGbExFVkJRVVVzV1VGQldUdE5RVU53UXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGRkxFTkJRVU03UzBGRGJFSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dEhRVU5tTzBWQlEwUXNiMEpCUVc5Q0xFVkJRVVVzV1VGQldUdEpRVU5vUXl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBkQlEzSkNPMFZCUTBRc1UwRkJVeXhGUVVGRkxGbEJRVms3U1VGRGNrSXNTVUZCU1N4TlFVRk5MRWRCUVVjc1MwRkJTeXhEUVVGRExFZEJRVWNzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTnlReXhKUVVGSkxFbEJRVWtzVFVGQlRTeEhRVUZITEZWQlFWVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03TzBsQlJYQkRMRWxCUVVrc1JVRkJSU3hOUVVGTkxFVkJRVVU3UVVGRGJFSXNUVUZCVFN4TlFVRk5MRWRCUVVjc1ZVRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVWQlFVVXNSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVUxUXl4TlFVRk5MRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF5eExRVUZMTEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenM3VFVGRk4wSXNUMEZCVHl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zVDBGQlR5eEZRVUZGTEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnVSU3hMUVVGTE96dEpRVVZFTEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UjBGRE0wSTdSVUZEUkN4WlFVRlpMRVZCUVVVc1ZVRkJWU3hOUVVGTkxFVkJRVVU3U1VGRE9VSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJRenROUVVOYUxFdEJRVXNzUlVGQlJTeExRVUZMTzAxQlExb3NUVUZCVFN4RlFVRkZMRTFCUVUwN1MwRkRaaXhEUVVGRExFTkJRVU03UjBGRFNqdEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMEZCUTNSQ0xFbEJRVWtzU1VGQlNTeExRVUZMTEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFMUJRVTBzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJReXhOUVVGTkxFVkJRVVVzUzBGQlN5eEZRVUZGTEVOQlFVTTdPMGxCUlhCRk8wMUJRMFVzYjBKQlFVTXNVVUZCVVN4RlFVRkJMR2RDUVVGQkxFZEJRVUVzUTBGQlJTeEhRVUZITEV0QlFVMHNRMEZCUVN4RFFVRkhMRU5CUVVFN1RVRkRka0k3UjBGRFNEdEJRVU5JTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBYW5ONElGSmxZV04wTGtSUFRWeHVJQ292WEc1Y2JuWmhjaUJXYVdWM08xeHVkbUZ5SUZKbFlXTjBJQ0FnSUNBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFMWhhVzVXYVdWM0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyMWhhVzVmZG1sbGR5NXFjM2duS1R0Y2JuWmhjaUJ6ZEc5eVpTQWdJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTl6ZEc5eVpTY3BPMXh1ZG1GeUlHeHBjM1JmYzNSdmNtVWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwyeHBjM1JmYzNSdmNtVW5LVHRjYmx4dVZtbGxkeUE5SUZKbFlXTjBMbU55WldGMFpVTnNZWE56S0h0Y2JpQWdaMlYwU1c1cGRHbGhiRk4wWVhSbE9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lHRnplVzVqT2lBZ1ptRnNjMlVzWEc0Z0lDQWdJQ0J0YjIxbGJuUTZJRzUxYkd4Y2JpQWdJQ0I5TzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SRWFXUk5iM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lITjBiM0psTG05dUtDZGphR0Z1WjJVNmJXOXRaVzUwSnl3Z1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdkR2hwY3k1blpYUk5iMjFsYm5Rb0tUdGNiaUFnSUNCOUxtSnBibVFvZEdocGN5a3BPMXh1SUNCOUxGeHVJQ0JqYjIxd2IyNWxiblJYYVd4c1ZXNXRiM1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lITjBiM0psTG05bVppZ25ZMmhoYm1kbEp5azdYRzRnSUgwc1hHNGdJR2RsZEUxdmJXVnVkRG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQmphRzlwWTJVZ1BTQnpkRzl5WlM1blpYUW9KMjF2YldWdWRDY3BPMXh1SUNBZ0lIWmhjaUJ0YjIxbGJuUWdQU0JzYVhOMFgzTjBiM0psTG1kbGRDaGphRzlwWTJVcE8xeHVYRzRnSUNBZ2FXWWdLQ0VnYlc5dFpXNTBLU0I3WEc0Z0lDQWdJQ0J0YjIxbGJuUWdQU0JzYVhOMFgzTjBiM0psTG1Ga1pDaDdhV1E2SUdOb2IybGpaWDBwTzF4dVhHNGdJQ0FnSUNCMGFHbHpMbk5sZEZOMFlYUmxLSHRoYzNsdVl6b2dkSEoxWlgwcE8xeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2JXOXRaVzUwTG1abGRHTm9LSHR6ZFdOalpYTnpPaUIwYUdsekxtTm9iMjl6WlUxdmJXVnVkQzVpYVc1a0tIUm9hWE1wZlNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NWphRzl2YzJWTmIyMWxiblFvYlc5dFpXNTBLVHRjYmlBZ2ZTeGNiaUFnWTJodmIzTmxUVzl0Wlc1ME9pQm1kVzVqZEdsdmJpQW9iVzl0Wlc1MEtTQjdYRzRnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3WEc0Z0lDQWdJQ0JoYzNsdVl6b2dabUZzYzJVc1hHNGdJQ0FnSUNCdGIyMWxiblE2SUcxdmJXVnVkRnh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2NISnZjSE1nUFNBb2RHaHBjeTV6ZEdGMFpTNXRiMjFsYm5RZ0ppWWdkR2hwY3k1emRHRjBaUzV0YjIxbGJuUXVkRzlLVTA5T0tDa3BJSHg4SUh0OU8xeHVYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4TllXbHVWbWxsZHlCN0xpNHVjSEp2Y0hOOUlDOCtYRzRnSUNBZ0tUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVm1sbGR6dGNiaUpkZlE9PSJdfQ==
