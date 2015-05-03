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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHltb21lbnR1bS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL2NvbXBvbmVudHMvaWNvbi5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHkvZGlzcGF0Y2hlci5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9mb290ZXJfYmFyLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9saXN0X3N0b3JlLmpzIiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L2xpc3Rfdmlldy5qc3giLCIvVXNlcnMvYnJpYW5ibG9ja2VyL0RldmVsb3BtZW50L0dJVC9pd3MtcXVpY2stc3R5bGUtZ3VpZGUvc2NyaXB0cy9zYWZldHkvbWFpbl92aWV3LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9wcmltYXJ5X2ltYWdlLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zcG9uc29yLmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zdG9yZS5qcyIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS9zdW1tYXJ5LmpzeCIsIi9Vc2Vycy9icmlhbmJsb2NrZXIvRGV2ZWxvcG1lbnQvR0lUL2l3cy1xdWljay1zdHlsZS1ndWlkZS9zY3JpcHRzL3NhZmV0eS90aXRsZV9iYXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L3RvcF9iYXIuanN4IiwiL1VzZXJzL2JyaWFuYmxvY2tlci9EZXZlbG9wbWVudC9HSVQvaXdzLXF1aWNrLXN0eWxlLWd1aWRlL3NjcmlwdHMvc2FmZXR5L3ZpZXcuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBSSxLQUFLLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU1QyxTQUFTLE1BQU0sRUFBRSxFQUFFLEVBQUU7RUFDbkIsS0FBSyxDQUFDLE1BQU07SUFDVixLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtNQUM1QixRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO0tBQ3RDLENBQUM7SUFDRixRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztHQUM1QixDQUFDO0FBQ0osQ0FBQzs7QUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUV4Qjs7O0FDaEJBOztBQUVBLEdBQUc7O0FBRUgsSUFBSSxJQUFJLENBQUM7QUFDVCxJQUFJLENBQUMsT0FBTyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFD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YSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQztNQUN6RDtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7O0FBRXRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIE1haW5WaWV3ID0gcmVxdWlyZSgnLi9zYWZldHkvdmlldy5qc3gnKTtcblxuZnVuY3Rpb24gcmVuZGVyIChpZCkge1xuICBSZWFjdC5yZW5kZXIoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChNYWluVmlldywge1xuICAgICAga2V5d29yZHM6IFsnYXV0b21vYmlsZScsICdrZXl3b3JkIDInXVxuICAgIH0pLFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICApO1xufVxuXG5yZW5kZXIoJ3NhZmV0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVcxdmJXVnVkSFZ0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRWxCUVVrc1MwRkJTeXhQUVVGUExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTnFReXhKUVVGSkxGRkJRVkVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU1zUTBGQlF6czdRVUZGTlVNc1UwRkJVeXhOUVVGTkxFVkJRVVVzUlVGQlJTeEZRVUZGTzBWQlEyNUNMRXRCUVVzc1EwRkJReXhOUVVGTk8wbEJRMVlzUzBGQlN5eERRVUZETEdGQlFXRXNRMEZCUXl4UlFVRlJMRVZCUVVVN1RVRkROVUlzVVVGQlVTeEZRVUZGTEVOQlFVTXNXVUZCV1N4RlFVRkZMRmRCUVZjc1EwRkJRenRMUVVOMFF5eERRVUZETzBsQlEwWXNVVUZCVVN4RFFVRkRMR05CUVdNc1EwRkJReXhGUVVGRkxFTkJRVU03UjBGRE5VSXNRMEZCUXp0QlFVTktMRU5CUVVNN08wRkJSVVFzVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPenRCUVVWcVFpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTFCUVUwc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5aaGNpQlNaV0ZqZENBZ0lDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlFMWhhVzVXYVdWM0lEMGdjbVZ4ZFdseVpTZ25MaTl6WVdabGRIa3ZkbWxsZHk1cWMzZ25LVHRjYmx4dVpuVnVZM1JwYjI0Z2NtVnVaR1Z5SUNocFpDa2dlMXh1SUNCU1pXRmpkQzV5Wlc1a1pYSW9YRzRnSUNBZ1VtVmhZM1F1WTNKbFlYUmxSV3hsYldWdWRDaE5ZV2x1Vm1sbGR5d2dlMXh1SUNBZ0lDQWdhMlY1ZDI5eVpITTZJRnNuWVhWMGIyMXZZbWxzWlNjc0lDZHJaWGwzYjNKa0lESW5YVnh1SUNBZ0lIMHBMRnh1SUNBZ0lHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0dsa0tWeHVJQ0FwTzF4dWZWeHVYRzV5Wlc1a1pYSW9KM05oWm1WMGVTY3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhKbGJtUmxjanRjYmlKZGZRPT0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIEljb247XG52YXIgXyAgICAgPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gaWNvbiwgY3VycmVudGx5IHVzaW5nIHRoZSBmb250IGF3ZXNvbWUgaWNvbiBsaWJyYXJ5XG4gKlxuICogQGV4YW1wbGVzXG4gKiA8SWNvbiB0eXBlPVwiY2hlY2tcIiAvPlxuICogPEljb24gdHlwZT1cInVzZXJcIiBjbGFzc05hbWU9XCJtdXRlZFwiIC8+XG4gKiA8SWNvbiB0eXBlPVwiYmFuXCIgc3RhY2s9XCIyeFwiIC8+XG4gKi9cbkljb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiSWNvblwiLFxuICBwcm9wVHlwZXM6IHtcbiAgICBzdGFjazogICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHR5cGU6ICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBjbGFzc05hbWU6ICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG4gIG1peGluczogW1JlYWN0LmFkZG9ucy5QdXJlUmVuZGVyTWl4aW5dLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2xhc3NlcyA9IFsnZmEgZmEtaWNvbiddO1xuICAgIHZhciBwcm9wcyAgID0gXy5vbWl0KHRoaXMucHJvcHMsIFsnc3RhY2snLCAndHlwZScsICdjbGFzc05hbWUnXSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zdGFjaykge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1zdGFjay0nICsgdGhpcy5wcm9wcy5zdGFjayk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuc3Bpbikge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS1zcGluJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMudHlwZSkge1xuICAgICAgY2xhc3Nlcy5wdXNoKCdmYS0nICsgdGhpcy5wcm9wcy50eXBlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbGFzc05hbWUpIHtcbiAgICAgIGNsYXNzZXMucHVzaCh0aGlzLnByb3BzLmNsYXNzTmFtZSlcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5zaXplKSB7XG4gICAgICBjbGFzc2VzLnB1c2goJ2ZhLScgKyB0aGlzLnByb3BzLnNpemUpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaVwiLCBSZWFjdC5fX3NwcmVhZCh7fSwgIHByb3BzLCB7Y2xhc3NOYW1lOiBjbGFzc2VzLmpvaW4oJyAnKX0pKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEljb247XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMMk52YlhCdmJtVnVkSE12YVdOdmJpNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN08wRkJSVUVzUjBGQlJ6czdRVUZGU0N4SlFVRkpMRWxCUVVrc1EwRkJRenRCUVVOVUxFbEJRVWtzUTBGQlF5eFBRVUZQTEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVOc1F5eEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03TzBGQlJUZENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdSMEZGUnp0QlFVTklMREJDUVVFd1FpeHZRa0ZCUVR0RlFVTjRRaXhUUVVGVExFVkJRVVU3U1VGRFZDeExRVUZMTEU5QlFVOHNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTk8wbEJRMnhETEVsQlFVa3NVVUZCVVN4TFFVRkxMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eFZRVUZWTzBsQlF6ZERMRk5CUVZNc1IwRkJSeXhMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEUxQlFVMDdSMEZEYmtNN1JVRkRSQ3hOUVVGTkxFVkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVdVc1EwRkJRenRGUVVOMFF5eE5RVUZOTEVWQlFVVXNXVUZCV1R0SlFVTnNRaXhKUVVGSkxFOUJRVThzUjBGQlJ5eERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUTJwRExFbEJRVWtzU1VGQlNTeExRVUZMTEV0QlFVc3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEZRVUZGTEVOQlFVTXNUMEZCVHl4RlFVRkZMRTFCUVUwc1JVRkJSU3hYUVVGWExFTkJRVU1zUTBGQlF5eERRVUZET3p0SlFVVnFSU3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RlFVRkZPMDFCUTNCQ0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEYmtRc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRk8wMUJRMjVDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE9VSXNTMEZCU3pzN1NVRkZSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETlVNc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1UwRkJVeXhGUVVGRk8wMUJRM2hDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTTdRVUZEZUVNc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRk8wMUJRMjVDTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkROVU1zUzBGQlN6czdTVUZGUkR0TlFVTkZMRzlDUVVGQkxFZEJRVVVzUlVGQlFTeG5Ra0ZCUVN4SFFVRkJMRU5CUVVVc1IwRkJSeXhMUVVGTExFVkJRVU1zUTBGQlF5eERRVUZCTEZOQlFVRXNSVUZCVXl4RFFVRkZMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZITEVOQlFVRXNRMEZCU1N4RFFVRkJPMDFCUTJoRU8wZEJRMGc3UVVGRFNDeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLbHh1SUNvZ1FHcHplQ0JTWldGamRDNUVUMDFjYmlBcUwxeHVYRzUyWVhJZ1NXTnZianRjYm5aaGNpQmZJQ0FnSUNBOUlISmxjWFZwY21Vb0ozVnVaR1Z5YzJOdmNtVW5LVHRjYm5aaGNpQlNaV0ZqZENBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNWNiaThxS2x4dUlDb2dRM0psWVhSbGN5QmhiaUJwWTI5dUxDQmpkWEp5Wlc1MGJIa2dkWE5wYm1jZ2RHaGxJR1p2Ym5RZ1lYZGxjMjl0WlNCcFkyOXVJR3hwWW5KaGNubGNiaUFxWEc0Z0tpQkFaWGhoYlhCc1pYTmNiaUFxSUR4SlkyOXVJSFI1Y0dVOVhDSmphR1ZqYTF3aUlDOCtYRzRnS2lBOFNXTnZiaUIwZVhCbFBWd2lkWE5sY2x3aUlHTnNZWE56VG1GdFpUMWNJbTExZEdWa1hDSWdMejVjYmlBcUlEeEpZMjl1SUhSNWNHVTlYQ0ppWVc1Y0lpQnpkR0ZqYXoxY0lqSjRYQ0lnTHo1Y2JpQXFMMXh1U1dOdmJpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NISnZjRlI1Y0dWek9pQjdYRzRnSUNBZ2MzUmhZMnM2SUNBZ0lDQWdVbVZoWTNRdVVISnZjRlI1Y0dWekxuTjBjbWx1Wnl4Y2JpQWdJQ0IwZVhCbE9pQWdJQ0FnSUNCU1pXRmpkQzVRY205d1ZIbHdaWE11YzNSeWFXNW5MbWx6VW1WeGRXbHlaV1FzWEc0Z0lDQWdZMnhoYzNOT1lXMWxPaUFnVW1WaFkzUXVVSEp2Y0ZSNWNHVnpMbk4wY21sdVoxeHVJQ0I5TEZ4dUlDQnRhWGhwYm5NNklGdFNaV0ZqZEM1aFpHUnZibk11VUhWeVpWSmxibVJsY2sxcGVHbHVYU3hjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2RtRnlJR05zWVhOelpYTWdQU0JiSjJaaElHWmhMV2xqYjI0blhUdGNiaUFnSUNCMllYSWdjSEp2Y0hNZ0lDQTlJRjh1YjIxcGRDaDBhR2x6TG5CeWIzQnpMQ0JiSjNOMFlXTnJKeXdnSjNSNWNHVW5MQ0FuWTJ4aGMzTk9ZVzFsSjEwcE8xeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11YzNSaFkyc3BJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnblptRXRjM1JoWTJzdEp5QXJJSFJvYVhNdWNISnZjSE11YzNSaFkyc3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2gwYUdsekxuQnliM0J6TG5Od2FXNHBJSHRjYmlBZ0lDQWdJR05zWVhOelpYTXVjSFZ6YUNnblptRXRjM0JwYmljcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDaDBhR2x6TG5CeWIzQnpMblI1Y0dVcElIdGNiaUFnSUNBZ0lHTnNZWE56WlhNdWNIVnphQ2duWm1FdEp5QXJJSFJvYVhNdWNISnZjSE11ZEhsd1pTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdWNISnZjSE11WTJ4aGMzTk9ZVzFsS1NCN1hHNGdJQ0FnSUNCamJHRnpjMlZ6TG5CMWMyZ29kR2hwY3k1d2NtOXdjeTVqYkdGemMwNWhiV1VwWEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0hSb2FYTXVjSEp2Y0hNdWMybDZaU2tnZTF4dUlDQWdJQ0FnWTJ4aGMzTmxjeTV3ZFhOb0tDZG1ZUzBuSUNzZ2RHaHBjeTV3Y205d2N5NXphWHBsS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR2tnZXk0dUxuQnliM0J6ZlNCamJHRnpjMDVoYldVOWUyTnNZWE56WlhNdWFtOXBiaWduSUNjcGZUNDhMMmsrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1NXTnZianRjYmlKZGZRPT0iLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEaXNwYXRjaGVyKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOWthWE53WVhSamFHVnlMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVWtzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhWUVVGVkxFTkJRVU03TzBGQlJUVkRMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzU1VGQlNTeFZRVUZWTEVWQlFVVXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkluWmhjaUJFYVhOd1lYUmphR1Z5SUQwZ2NtVnhkV2x5WlNnblpteDFlQ2NwTGtScGMzQmhkR05vWlhJN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdibVYzSUVScGMzQmhkR05vWlhJb0tUdGNiaUpkZlE9PSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgICAgICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIEljb24gICAgICAgID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9pY29uLmpzeCcpO1xudmFyIGRpc3BhdGNoZXIgID0gcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyk7XG52YXIgRm9vdGVyQmFyO1xuXG5Gb290ZXJCYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRm9vdGVyQmFyXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZm9vdGVyLWJhclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIiwgbnVsbCwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLmxpc3RWaWV3fSwgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJsaXN0XCJ9KSkpLCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5zaGFyZVZpZXd9LCBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcInNlbmRcIn0pKSksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtvbkNsaWNrOiB0aGlzLnNlYXJjaFZpZXd9LCBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcInNlYXJjaFwifSkpKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGxpc3RWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiAndmlldycsXG4gICAgICB2aWV3OiAnbGlzdCdcbiAgICB9KTtcbiAgfSxcbiAgc2hhcmVWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgZGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gICAgICB0eXBlOiAndmlldycsXG4gICAgICB2aWV3OiAnc2hhcmUnXG4gICAgfSk7XG4gIH0sXG4gIHNlYXJjaFZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICd2aWV3JyxcbiAgICAgIHZpZXc6ICdzZWFyY2gnXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvb3RlckJhcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5bWIyOTBaWEpmWW1GeUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NTMEZCU3l4VFFVRlRMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU51UXl4SlFVRkpMRWxCUVVrc1ZVRkJWU3hQUVVGUExFTkJRVU1zZDBKQlFYZENMRU5CUVVNc1EwRkJRenRCUVVOd1JDeEpRVUZKTEZWQlFWVXNTVUZCU1N4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03UVVGRE1VTXNTVUZCU1N4VFFVRlRMRU5CUVVNN08wRkJSV1FzSzBKQlFTdENMSGxDUVVGQk8wVkJRemRDTEUxQlFVMHNSVUZCUlN4WlFVRlpPMGxCUTJ4Q08wMUJRMFVzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eFpRVUZoTEVOQlFVRXNSVUZCUVR0UlFVTXhRaXh2UWtGQlFTeExRVUZKTEVWQlFVRXNTVUZCUXl4RlFVRkJPMVZCUTBnc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUVR0WlFVTkdMRzlDUVVGQkxFbEJRVWNzUlVGQlFTeEpRVUZETEVWQlFVRXNiMEpCUVVFc1IwRkJSU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFBRVUZCTEVWQlFVOHNRMEZCUlN4SlFVRkpMRU5CUVVNc1VVRkJWU3hEUVVGQkxFVkJRVUVzYjBKQlFVTXNTVUZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhKUVVGQkxFVkJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVRXNRMEZCUnl4RFFVRkpMRU5CUVVzc1EwRkJRU3hGUVVGQk8xbEJRelZFTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hKUVVGRExFVkJRVUVzYjBKQlFVRXNSMEZCUlN4RlFVRkJMRU5CUVVFc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeEpRVUZKTEVOQlFVTXNVMEZCVnl4RFFVRkJMRVZCUVVFc2IwSkJRVU1zU1VGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhOUVVGTkxFTkJRVUVzUTBGQlJ5eERRVUZKTEVOQlFVc3NRMEZCUVN4RlFVRkJPMWxCUXpkRUxHOUNRVUZCTEVsQlFVY3NSVUZCUVN4SlFVRkRMRVZCUVVFc2IwSkJRVUVzUjBGQlJTeEZRVUZCTEVOQlFVRXNRMEZCUXl4UFFVRkJMRVZCUVU4c1EwRkJSU3hKUVVGSkxFTkJRVU1zVlVGQldTeERRVUZCTEVWQlFVRXNiMEpCUVVNc1NVRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVFc1EwRkJSeXhEUVVGSkxFTkJRVXNzUTBGQlFUdFZRVU0zUkN4RFFVRkJPMUZCUTBRc1EwRkJRVHROUVVOR0xFTkJRVUU3VFVGRFRqdEhRVU5JTzBWQlEwUXNVVUZCVVN4RlFVRkZMRmxCUVZrN1NVRkRjRUlzVlVGQlZTeERRVUZETEZGQlFWRXNRMEZCUXp0TlFVTnNRaXhKUVVGSkxFVkJRVVVzVFVGQlRUdE5RVU5hTEVsQlFVa3NSVUZCUlN4TlFVRk5PMHRCUTJJc1EwRkJReXhEUVVGRE8wZEJRMG83UlVGRFJDeFRRVUZUTEVWQlFVVXNXVUZCV1R0SlFVTnlRaXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETzAxQlEyeENMRWxCUVVrc1JVRkJSU3hOUVVGTk8wMUJRMW9zU1VGQlNTeEZRVUZGTEU5QlFVODdTMEZEWkN4RFFVRkRMRU5CUVVNN1IwRkRTanRGUVVORUxGVkJRVlVzUlVGQlJTeFpRVUZaTzBsQlEzUkNMRlZCUVZVc1EwRkJReXhSUVVGUkxFTkJRVU03VFVGRGJFSXNTVUZCU1N4RlFVRkZMRTFCUVUwN1RVRkRXaXhKUVVGSkxFVkJRVVVzVVVGQlVUdExRVU5tTEVOQlFVTXNRMEZCUXp0SFFVTktPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhUUVVGVExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZKbFlXTjBJQ0FnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCSlkyOXVJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR1TDJOdmJYQnZibVZ1ZEhNdmFXTnZiaTVxYzNnbktUdGNiblpoY2lCa2FYTndZWFJqYUdWeUlDQTlJSEpsY1hWcGNtVW9KeTR2WkdsemNHRjBZMmhsY2ljcE8xeHVkbUZ5SUVadmIzUmxja0poY2p0Y2JseHVSbTl2ZEdWeVFtRnlJRDBnVW1WaFkzUXVZM0psWVhSbFEyeGhjM01vZTF4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKbWIyOTBaWEl0WW1GeVhDSStYRzRnSUNBZ0lDQWdJRHh1WVhZK1hHNGdJQ0FnSUNBZ0lDQWdQSFZzUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR3hwUGp4aElHOXVRMnhwWTJzOWUzUm9hWE11YkdsemRGWnBaWGQ5UGp4SlkyOXVJSFI1Y0dVOVhDSnNhWE4wWENJZ0x6NDhMMkUrUEM5c2FUNWNiaUFnSUNBZ0lDQWdJQ0FnSUR4c2FUNDhZU0J2YmtOc2FXTnJQWHQwYUdsekxuTm9ZWEpsVm1sbGQzMCtQRWxqYjI0Z2RIbHdaVDFjSW5ObGJtUmNJaUF2UGp3dllUNDhMMnhwUGx4dUlDQWdJQ0FnSUNBZ0lDQWdQR3hwUGp4aElHOXVRMnhwWTJzOWUzUm9hWE11YzJWaGNtTm9WbWxsZDMwK1BFbGpiMjRnZEhsd1pUMWNJbk5sWVhKamFGd2lJQzgrUEM5aFBqd3ZiR2srWEc0Z0lDQWdJQ0FnSUNBZ1BDOTFiRDVjYmlBZ0lDQWdJQ0FnUEM5dVlYWStYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCc2FYTjBWbWxsZHpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lHUnBjM0JoZEdOb1pYSXVaR2x6Y0dGMFkyZ29lMXh1SUNBZ0lDQWdkSGx3WlRvZ0ozWnBaWGNuTEZ4dUlDQWdJQ0FnZG1sbGR6b2dKMnhwYzNRblhHNGdJQ0FnZlNrN1hHNGdJSDBzWEc0Z0lITm9ZWEpsVm1sbGR6b2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJR1JwYzNCaGRHTm9aWEl1WkdsemNHRjBZMmdvZTF4dUlDQWdJQ0FnZEhsd1pUb2dKM1pwWlhjbkxGeHVJQ0FnSUNBZ2RtbGxkem9nSjNOb1lYSmxKMXh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVJQ0J6WldGeVkyaFdhV1YzT2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ1pHbHpjR0YwWTJobGNpNWthWE53WVhSamFDaDdYRzRnSUNBZ0lDQjBlWEJsT2lBbmRtbGxkeWNzWEc0Z0lDQWdJQ0IyYVdWM09pQW5jMlZoY21Ob0oxeHVJQ0FnSUgwcE8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JHYjI5MFpYSkNZWEk3WEc0aVhYMD0iLCJ2YXIgc3RvcmU7XG52YXIgU3RvcmU7XG52YXIgZGlzcGF0Y2hlciAgPSByZXF1aXJlKCcuL2Rpc3BhdGNoZXInKTtcbnZhciBCYWNrYm9uZSAgICA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cblxuU3RvcmUgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gIHVybDogJy9hcGkvbW9tZW50cy8nLFxuICBkaXNwYXRjaEhhbmRsZXI6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgY29uc29sZS5sb2cocGF5bG9hZCk7XG4gIH1cbn0pO1xuXG5jb25zb2xlLmxvZyhTdG9yZS5wcm90b3R5cGUudXJsKTtcbnN0b3JlID0gbmV3IFN0b3JlKC8qW1xuICB7Y3JlYXRlZDogbmV3IERhdGUoKSwgdGl0bGU6ICdPbmUnLCBrZXl3b3JkczogWydhdXRvbW9iaWxlJ10sIGlkOiAyM30sXG4gIHtjcmVhdGVkOiBuZXcgRGF0ZSgpLCB0aXRsZTogJ1R3bycsIGtleXdvcmRzOiBbJ2F1dG9tb2JpbGUnXSwgaWQ6IDMzfVxuXSovKTtcblxuc3RvcmUuZmV0Y2goKTtcblxuc3RvcmUudG9rZW4gPSBkaXNwYXRjaGVyLnJlZ2lzdGVyKHN0b3JlLmRpc3BhdGNoSGFuZGxlci5iaW5kKHN0b3JlKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXNhWE4wWDNOMGIzSmxMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFbEJRVWtzUzBGQlN5eERRVUZETzBGQlExWXNTVUZCU1N4TFFVRkxMRU5CUVVNN1FVRkRWaXhKUVVGSkxGVkJRVlVzU1VGQlNTeFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRNVU1zU1VGQlNTeFJRVUZSTEUxQlFVMHNUMEZCVHl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRM1JET3p0QlFVVkJMRXRCUVVzc1IwRkJSeXhSUVVGUkxFTkJRVU1zVlVGQlZTeERRVUZETEUxQlFVMHNRMEZCUXp0RlFVTnFReXhIUVVGSExFVkJRVVVzWlVGQlpUdEZRVU53UWl4bFFVRmxMRVZCUVVVc1ZVRkJWU3hQUVVGUExFVkJRVVU3U1VGRGJFTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEhRVU4wUWp0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTnFReXhMUVVGTExFZEJRVWNzU1VGQlNTeExRVUZMTzBGQlEycENPenRCUVVWQkxFbEJRVWtzUTBGQlF6czdRVUZGVEN4TFFVRkxMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU03TzBGQlJXUXNTMEZCU3l4RFFVRkRMRXRCUVVzc1IwRkJSeXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4bFFVRmxMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlhKRkxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NTMEZCU3l4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlITjBiM0psTzF4dWRtRnlJRk4wYjNKbE8xeHVkbUZ5SUdScGMzQmhkR05vWlhJZ0lEMGdjbVZ4ZFdseVpTZ25MaTlrYVhOd1lYUmphR1Z5SnlrN1hHNTJZWElnUW1GamEySnZibVVnSUNBZ1BTQnlaWEYxYVhKbEtDZGlZV05yWW05dVpTY3BPMXh1WEc1Y2JsTjBiM0psSUQwZ1FtRmphMkp2Ym1VdVEyOXNiR1ZqZEdsdmJpNWxlSFJsYm1Rb2UxeHVJQ0IxY213NklDY3ZZWEJwTDIxdmJXVnVkSE12Snl4Y2JpQWdaR2x6Y0dGMFkyaElZVzVrYkdWeU9pQm1kVzVqZEdsdmJpQW9jR0Y1Ykc5aFpDa2dlMXh1SUNBZ0lHTnZibk52YkdVdWJHOW5LSEJoZVd4dllXUXBPMXh1SUNCOVhHNTlLVHRjYmx4dVkyOXVjMjlzWlM1c2IyY29VM1J2Y21VdWNISnZkRzkwZVhCbExuVnliQ2s3WEc1emRHOXlaU0E5SUc1bGR5QlRkRzl5WlNndktsdGNiaUFnZTJOeVpXRjBaV1E2SUc1bGR5QkVZWFJsS0Nrc0lIUnBkR3hsT2lBblQyNWxKeXdnYTJWNWQyOXlaSE02SUZzbllYVjBiMjF2WW1sc1pTZGRMQ0JwWkRvZ01qTjlMRnh1SUNCN1kzSmxZWFJsWkRvZ2JtVjNJRVJoZEdVb0tTd2dkR2wwYkdVNklDZFVkMjhuTENCclpYbDNiM0prY3pvZ1d5ZGhkWFJ2Ylc5aWFXeGxKMTBzSUdsa09pQXpNMzFjYmwwcUx5azdYRzVjYm5OMGIzSmxMbVpsZEdOb0tDazdYRzVjYm5OMGIzSmxMblJ2YTJWdUlEMGdaR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWh6ZEc5eVpTNWthWE53WVhSamFFaGhibVJzWlhJdVltbHVaQ2h6ZEc5eVpTa3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhOMGIzSmxPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgXyAgICAgICAgICAgICA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbnZhciBUaXRsZUJhciAgICAgID0gcmVxdWlyZSgnLi90aXRsZV9iYXIuanN4Jyk7XG52YXIgSWNvbiAgICAgICAgICA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvaWNvbi5qc3gnKTtcbnZhciBkaXNwYXRjaGVyICAgID0gcmVxdWlyZSgnLi9kaXNwYXRjaGVyJyk7XG52YXIgc3RvcmUgICAgICAgICA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcbnZhciBsaXN0X3N0b3JlICAgID0gcmVxdWlyZSgnLi9saXN0X3N0b3JlJyk7XG52YXIgbWFpbl9zdG9yZSAgICA9IHJlcXVpcmUoJy4vc3RvcmUnKTtcbnZhciBQcmltYXJ5SW1hZ2UgID0gcmVxdWlyZSgnLi9wcmltYXJ5X2ltYWdlLmpzeCcpO1xudmFyIG1vbWVudGpzICAgICAgPSByZXF1aXJlKCdtb21lbnQnKTtcbnZhciBMaXN0VmlldztcblxuTGlzdFZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiTGlzdFZpZXdcIixcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHtcbiAgICBsaXN0X3N0b3JlLm9uKCdhZGQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHt9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgIGxpc3Rfc3RvcmUub2ZmKCdhZGQnKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByZV9jb250cm9scyAgPSBbXTtcbiAgICB2YXIgbW9tZW50cyAgICAgICA9IHRoaXMuYnVpbGRNb21lbnRzKCk7XG5cbiAgICBwcmVfY29udHJvbHMucHVzaChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7a2V5OiBcImNhdGVnb3J5XCIsIGNsYXNzTmFtZTogXCJ0b3AtY29udHJvbFwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtjbGFzc05hbWU6IFwiYnV0dG9uXCIsIG9uQ2xpY2s6IHRoaXMuY2F0ZWdvcnlWaWV3fSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogXCJsaXN0XCJ9KVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICAgIGlmICghIHRoaXMucHJvcHMuc2VhcmNoKSB7XG4gICAgICBwcmVfY29udHJvbHMucHVzaChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IFwic2VhcmNoXCIsIGNsYXNzTmFtZTogXCJ0b3AtY29udHJvbFwifSwgXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImFcIiwge2NsYXNzTmFtZTogXCJidXR0b25cIiwgb25DbGljazogdGhpcy5zZWFyY2hWaWV3fSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHt0eXBlOiBcInNlYXJjaFwifSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJsaXN0LXZpZXdcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRpdGxlQmFyLCBudWxsLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibmF2XCIsIHtjbGFzc05hbWU6IFwidG9wLW5hdlwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCwgXG4gICAgICAgICAgICAgIHByZV9jb250cm9scy5tYXAoZnVuY3Rpb24gKGNvbnRyb2wpIHtyZXR1cm4gY29udHJvbDt9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICksIFxuXG4gICAgICAgICAgXCJTYWZldHkgTW9tZW50c1wiLCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7Y2xhc3NOYW1lOiBcImJ1dHRvbiBjbG9zZS1idXR0b25cIiwgb25DbGljazogdGhpcy5jbG9zZVZpZXd9LCBcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwge3R5cGU6IFwiY2xvc2VcIn0pXG4gICAgICAgICAgKVxuICAgICAgICApLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImxpc3Qtb2YtbW9tZW50c1wifSwgXG4gICAgICAgICAgbW9tZW50c1xuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgc2VhcmNoVmlldzogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2F0ZWdvcnlWaWV3KCk7XG4gIH0sXG4gIGNhdGVnb3J5VmlldzogZnVuY3Rpb24gKCkge1xuICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICAgICAgdHlwZTogJ3ZpZXcnLFxuICAgICAgdmlldzogJ2NhdGVnb3J5J1xuICAgIH0pO1xuICB9LFxuICBidWlsZE1vbWVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbW9tZW50cztcbiAgICB2YXIgZWxlbWVudHM7XG4gICAgdmFyIGNhdGVnb3J5ID0gc3RvcmUuZ2V0KCdjYXRlZ29yeScpO1xuXG4gICAgbW9tZW50cyA9IGxpc3Rfc3RvcmUuZmlsdGVyKGZ1bmN0aW9uIChtb21lbnQpIHtcbiAgICAgIGlmIChjYXRlZ29yeSkge1xuICAgICAgICByZXR1cm4gbW9tZW50LmdldCgna2V5d29yZHMnKS5pbmRleE9mKGNhdGVnb3J5KSA+IC0xO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGVsZW1lbnRzID0gXy5tYXAobW9tZW50cywgZnVuY3Rpb24gKG1vbWVudCwgaW5kZXgpIHtcbiAgICAgIHZhciBkYXRlID0gbW9tZW50anMobW9tZW50LmdldCgnY3JlYXRlZCcpKTtcbiAgICAgIHZhciBpbWFnZVByb3BzID0ge1xuICAgICAgICBpbWFnZTogICAgbW9tZW50LmdldCgnaW1hZ2UnKSxcbiAgICAgICAga2V5d29yZHM6IG1vbWVudC5nZXQoJ2tleXdvcmRzJylcbiAgICAgIH07XG5cbiAgICAgIGRhdGUgPSBkYXRlLmZvcm1hdCgnTU1NIE0sIFlZWVknKTtcblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtrZXk6IGluZGV4LCBjbGFzc05hbWU6IFwibW9tZW50XCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYVwiLCB7b25DbGljazogdGhpcy5zZWxlY3RNb21lbnQuYmluZCh0aGlzLCBtb21lbnQuaWQpfSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGh1bWJcIn0sIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByaW1hcnlJbWFnZSwgUmVhY3QuX19zcHJlYWQoe30sICBpbWFnZVByb3BzKSlcbiAgICAgICAgICAgICksIFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInRpdGxlXCJ9LCBcbiAgICAgICAgICAgICAgbW9tZW50LmdldCgndGl0bGUnKVxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibXV0ZWQgc21hbGxcIn0sIFxuICAgICAgICAgICAgICBkYXRlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApO1xuICAgIH0sIHRoaXMpO1xuXG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgbnVsbCwgZWxlbWVudHMpXG4gICAgKTtcbiAgfSxcbiAgc2VsZWN0TW9tZW50OiBmdW5jdGlvbiAoaWQpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICAgJ2Nob29zZScsXG4gICAgICB2YWx1ZTogIGlkXG4gICAgfSk7XG5cbiAgICB0aGlzLmNsb3NlVmlldygpO1xuICB9LFxuICBjbG9zZVZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICBkaXNwYXRjaGVyLmRpc3BhdGNoKHtcbiAgICAgIHR5cGU6ICd2aWV3JyxcbiAgICAgIHZpZXc6IG51bGxcbiAgICB9KTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdFZpZXc7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXNhWE4wWDNacFpYY3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hMUVVGTExGZEJRVmNzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMEZCUTNKRExFbEJRVWtzUTBGQlF5eGxRVUZsTEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVNeFF5eEpRVUZKTEZGQlFWRXNVVUZCVVN4UFFVRlBMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTXZReXhKUVVGSkxFbEJRVWtzV1VGQldTeFBRVUZQTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU1zUTBGQlF6dEJRVU4wUkN4SlFVRkpMRlZCUVZVc1RVRkJUU3hQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZETlVNc1NVRkJTU3hMUVVGTExGZEJRVmNzVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUTNaRExFbEJRVWtzVlVGQlZTeE5RVUZOTEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenRCUVVNMVF5eEpRVUZKTEZWQlFWVXNUVUZCVFN4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGRrTXNTVUZCU1N4WlFVRlpMRWxCUVVrc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN1FVRkRia1FzU1VGQlNTeFJRVUZSTEZGQlFWRXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRM1JETEVsQlFVa3NVVUZCVVN4RFFVRkRPenRCUVVWaUxEaENRVUU0UWl4M1FrRkJRVHRGUVVNMVFpeHBRa0ZCYVVJc1JVRkJSU3haUVVGWk8wbEJRemRDTEZWQlFWVXNRMEZCUXl4RlFVRkZMRU5CUVVNc1MwRkJTeXhGUVVGRkxGbEJRVms3VFVGREwwSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dExRVU51UWl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzBkQlEyWTdSVUZEUkN4dlFrRkJiMElzUlVGQlJTeFpRVUZaTzBsQlEyaERMRlZCUVZVc1EwRkJReXhIUVVGSExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdSMEZEZGtJN1JVRkRSQ3hOUVVGTkxFVkJRVVVzV1VGQldUdEpRVU5zUWl4SlFVRkpMRmxCUVZrc1NVRkJTU3hGUVVGRkxFTkJRVU03UVVGRE0wSXNTVUZCU1N4SlFVRkpMRTlCUVU4c1UwRkJVeXhKUVVGSkxFTkJRVU1zV1VGQldTeEZRVUZGTEVOQlFVTTdPMGxCUlhoRExGbEJRVmtzUTBGQlF5eEpRVUZKTzAxQlEyWXNiMEpCUVVFc1NVRkJSeXhGUVVGQkxFTkJRVUVzUTBGQlF5eEhRVUZCTEVWQlFVY3NRMEZCUXl4VlFVRkJMRVZCUVZVc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eGhRVUZqTEVOQlFVRXNSVUZCUVR0UlFVTjZReXh2UWtGQlFTeEhRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGRkJRVUVzUlVGQlVTeERRVUZETEU5QlFVRXNSVUZCVHl4RFFVRkZMRWxCUVVrc1EwRkJReXhaUVVGakxFTkJRVUVzUlVGQlFUdFZRVU5vUkN4dlFrRkJReXhKUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJRU3hEUVVGSExFTkJRVUU3VVVGRGJFSXNRMEZCUVR0TlFVTkVMRU5CUVVFN1FVRkRXQ3hMUVVGTExFTkJRVU03TzBsQlJVWXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeEZRVUZGTzAxQlEzWkNMRmxCUVZrc1EwRkJReXhKUVVGSk8xRkJRMllzYjBKQlFVRXNTVUZCUnl4RlFVRkJMRU5CUVVFc1EwRkJReXhIUVVGQkxFVkJRVWNzUTBGQlF5eFJRVUZCTEVWQlFWRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhoUVVGakxFTkJRVUVzUlVGQlFUdFZRVU4yUXl4dlFrRkJRU3hIUVVGRkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRExFOUJRVUVzUlVGQlR5eERRVUZGTEVsQlFVa3NRMEZCUXl4VlFVRlpMRU5CUVVFc1JVRkJRVHRaUVVNNVF5eHZRa0ZCUXl4SlFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEZGQlFWRXNRMEZCUVN4RFFVRkhMRU5CUVVFN1ZVRkRjRUlzUTBGQlFUdFJRVU5FTEVOQlFVRTdUMEZEVGl4RFFVRkRPMEZCUTFJc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNWMEZCV1N4RFFVRkJMRVZCUVVFN1VVRkRla0lzYjBKQlFVTXNVVUZCVVN4RlFVRkJMRWxCUVVNc1JVRkJRVHRWUVVOU0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVTBGQlZTeERRVUZCTEVWQlFVRTdXVUZEZGtJc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUVR0alFVTkVMRmxCUVZrc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeFBRVUZQTEVWQlFVVXNRMEZCUXl4UFFVRlBMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVVU3V1VGRGNrUXNRMEZCUVR0VlFVTkVMRU5CUVVFc1JVRkJRVHRCUVVGQk8wRkJRVUVzVlVGQlFTeG5Ra0ZCUVN4RlFVRkJPMEZCUVVFc1ZVRkhUaXh2UWtGQlFTeEhRVUZGTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExIRkNRVUZCTEVWQlFYRkNMRU5CUVVNc1QwRkJRU3hGUVVGUExFTkJRVVVzU1VGQlNTeERRVUZETEZOQlFWY3NRMEZCUVN4RlFVRkJPMWxCUXpGRUxHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1NVRkJRU3hGUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZCTEVOQlFVY3NRMEZCUVR0VlFVTnVRaXhEUVVGQk8xRkJRMHNzUTBGQlFTeEZRVUZCTzFGQlExZ3NiMEpCUVVFc1MwRkJTU3hGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4cFFrRkJhMElzUTBGQlFTeEZRVUZCTzFWQlF6bENMRTlCUVZFN1VVRkRUQ3hEUVVGQk8wMUJRMFlzUTBGQlFUdE5RVU5PTzBkQlEwZzdSVUZEUkN4VlFVRlZMRVZCUVVVc1dVRkJXVHRKUVVOMFFpeEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkZMRU5CUVVNN1IwRkRja0k3UlVGRFJDeFpRVUZaTEVWQlFVVXNXVUZCV1R0SlFVTjRRaXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETzAxQlEyeENMRWxCUVVrc1JVRkJSU3hOUVVGTk8wMUJRMW9zU1VGQlNTeEZRVUZGTEZWQlFWVTdTMEZEYWtJc1EwRkJReXhEUVVGRE8wZEJRMG83UlVGRFJDeFpRVUZaTEVWQlFVVXNXVUZCV1R0SlFVTjRRaXhKUVVGSkxFOUJRVThzUTBGQlF6dEpRVU5hTEVsQlFVa3NVVUZCVVN4RFFVRkRPMEZCUTJwQ0xFbEJRVWtzU1VGQlNTeFJRVUZSTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6czdTVUZGY2tNc1QwRkJUeXhIUVVGSExGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTXNWVUZCVlN4TlFVRk5MRVZCUVVVN1RVRkROVU1zU1VGQlNTeFJRVUZSTEVWQlFVVTdVVUZEV2l4UFFVRlBMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlF6ZEVMRTlCUVU4N08wMUJSVVFzVDBGQlR5eEpRVUZKTEVOQlFVTTdRVUZEYkVJc1MwRkJTeXhEUVVGRExFTkJRVU03TzBsQlJVZ3NVVUZCVVN4SFFVRkhMRU5CUVVNc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eEZRVUZGTEZWQlFWVXNUVUZCVFN4RlFVRkZMRXRCUVVzc1JVRkJSVHROUVVOcVJDeEpRVUZKTEVsQlFVa3NSMEZCUnl4UlFVRlJMRU5CUVVNc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRPMDFCUXpORExFbEJRVWtzVlVGQlZTeEhRVUZITzFGQlEyWXNTMEZCU3l4TFFVRkxMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zVDBGQlR5eERRVUZETzFGQlF6ZENMRkZCUVZFc1JVRkJSU3hOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEZWQlFWVXNRMEZCUXp0QlFVTjRReXhQUVVGUExFTkJRVU03TzBGQlJWSXNUVUZCVFN4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXpzN1RVRkZiRU03VVVGRFJTeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1EwRkJRU3hEUVVGRExFZEJRVUVzUlVGQlJ5eERRVUZGTEV0QlFVc3NSVUZCUXl4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGRkJRVk1zUTBGQlFTeEZRVUZCTzFWQlEycERMRzlDUVVGQkxFZEJRVVVzUlVGQlFTeERRVUZCTEVOQlFVTXNUMEZCUVN4RlFVRlBMRU5CUVVVc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRTFCUVUwc1EwRkJReXhGUVVGRkxFTkJRVWNzUTBGQlFTeEZRVUZCTzFsQlEyNUVMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1QwRkJVU3hEUVVGQkxFVkJRVUU3WTBGRGNrSXNiMEpCUVVNc1dVRkJXU3hGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRlZCUVZjc1EwRkJRU3hEUVVGSExFTkJRVUU3V1VGRE5VSXNRMEZCUVN4RlFVRkJPMWxCUTA0c2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhQUVVGUkxFTkJRVUVzUlVGQlFUdGpRVU53UWl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFOUJRVThzUTBGQlJUdFpRVU5xUWl4RFFVRkJMRVZCUVVFN1dVRkRUaXh2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExHRkJRV01zUTBGQlFTeEZRVUZCTzJOQlF6RkNMRWxCUVVzN1dVRkRSaXhEUVVGQk8xVkJRMG9zUTBGQlFUdFJRVU5FTEVOQlFVRTdVVUZEVER0QlFVTlNMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6czdTVUZGVkN4SlFVRkpMRkZCUVZFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzAxQlEzWkNMRTlCUVU4c1NVRkJTU3hEUVVGRE8wRkJRMnhDTEV0QlFVczdPMGxCUlVRN1RVRkRSU3h2UWtGQlFTeEpRVUZITEVWQlFVRXNTVUZCUXl4RlFVRkRMRkZCUVdNc1EwRkJRVHROUVVOdVFqdEhRVU5JTzBWQlEwUXNXVUZCV1N4RlFVRkZMRlZCUVZVc1JVRkJSU3hGUVVGRk8wbEJRekZDTEZWQlFWVXNRMEZCUXl4UlFVRlJMRU5CUVVNN1RVRkRiRUlzU1VGQlNTeEpRVUZKTEZGQlFWRTdUVUZEYUVJc1MwRkJTeXhIUVVGSExFVkJRVVU3UVVGRGFFSXNTMEZCU3l4RFFVRkRMRU5CUVVNN08wbEJSVWdzU1VGQlNTeERRVUZETEZOQlFWTXNSVUZCUlN4RFFVRkRPMGRCUTJ4Q08wVkJRMFFzVTBGQlV5eEZRVUZGTEZsQlFWazdTVUZEY2tJc1ZVRkJWU3hEUVVGRExGRkJRVkVzUTBGQlF6dE5RVU5zUWl4SlFVRkpMRVZCUVVVc1RVRkJUVHROUVVOYUxFbEJRVWtzUlVGQlJTeEpRVUZKTzB0QlExZ3NRMEZCUXl4RFFVRkRPMGRCUTBvN1FVRkRTQ3hEUVVGRExFTkJRVU1zUTBGQlF6czdRVUZGU0N4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGRkJRVkVzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRR3B6ZUNCU1pXRmpkQzVFVDAxY2JpQXFMMXh1WEc1MllYSWdVbVZoWTNRZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNTJZWElnWHlBZ0lDQWdJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KM1Z1WkdWeWMyTnZjbVVuS1R0Y2JuWmhjaUJVYVhSc1pVSmhjaUFnSUNBZ0lEMGdjbVZ4ZFdseVpTZ25MaTkwYVhSc1pWOWlZWEl1YW5ONEp5azdYRzUyWVhJZ1NXTnZiaUFnSUNBZ0lDQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dUwyTnZiWEJ2Ym1WdWRITXZhV052Ymk1cWMzZ25LVHRjYm5aaGNpQmthWE53WVhSamFHVnlJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpOWthWE53WVhSamFHVnlKeWs3WEc1MllYSWdjM1J2Y21VZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZjM1J2Y21VbktUdGNiblpoY2lCc2FYTjBYM04wYjNKbElDQWdJRDBnY21WeGRXbHlaU2duTGk5c2FYTjBYM04wYjNKbEp5azdYRzUyWVhJZ2JXRnBibDl6ZEc5eVpTQWdJQ0E5SUhKbGNYVnBjbVVvSnk0dmMzUnZjbVVuS1R0Y2JuWmhjaUJRY21sdFlYSjVTVzFoWjJVZ0lEMGdjbVZ4ZFdseVpTZ25MaTl3Y21sdFlYSjVYMmx0WVdkbExtcHplQ2NwTzF4dWRtRnlJRzF2YldWdWRHcHpJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDZHRiMjFsYm5RbktUdGNiblpoY2lCTWFYTjBWbWxsZHp0Y2JseHVUR2x6ZEZacFpYY2dQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lHTnZiWEJ2Ym1WdWRFUnBaRTF2ZFc1ME9pQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdiR2x6ZEY5emRHOXlaUzV2YmlnbllXUmtKeXdnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV6WlhSVGRHRjBaU2g3ZlNrN1hHNGdJQ0FnZlM1aWFXNWtLSFJvYVhNcEtUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBWMmxzYkZWdWJXOTFiblE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCc2FYTjBYM04wYjNKbExtOW1aaWduWVdSa0p5azdYRzRnSUgwc1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSFpoY2lCd2NtVmZZMjl1ZEhKdmJITWdJRDBnVzEwN1hHNGdJQ0FnZG1GeUlHMXZiV1Z1ZEhNZ0lDQWdJQ0FnUFNCMGFHbHpMbUoxYVd4a1RXOXRaVzUwY3lncE8xeHVYRzRnSUNBZ2NISmxYMk52Ym5SeWIyeHpMbkIxYzJnb1hHNGdJQ0FnSUNBOGJHa2dhMlY1UFZ3aVkyRjBaV2R2Y25sY0lpQmpiR0Z6YzA1aGJXVTlYQ0owYjNBdFkyOXVkSEp2YkZ3aVBseHVJQ0FnSUNBZ0lDQThZU0JqYkdGemMwNWhiV1U5WENKaWRYUjBiMjVjSWlCdmJrTnNhV05yUFh0MGFHbHpMbU5oZEdWbmIzSjVWbWxsZDMwK1hHNGdJQ0FnSUNBZ0lDQWdQRWxqYjI0Z2RIbHdaVDFjSW14cGMzUmNJaUF2UGx4dUlDQWdJQ0FnSUNBOEwyRStYRzRnSUNBZ0lDQThMMnhwUGx4dUlDQWdJQ2s3WEc1Y2JpQWdJQ0JwWmlBb0lTQjBhR2x6TG5CeWIzQnpMbk5sWVhKamFDa2dlMXh1SUNBZ0lDQWdjSEpsWDJOdmJuUnliMnh6TG5CMWMyZ29YRzRnSUNBZ0lDQWdJRHhzYVNCclpYazlYQ0p6WldGeVkyaGNJaUJqYkdGemMwNWhiV1U5WENKMGIzQXRZMjl1ZEhKdmJGd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4aElHTnNZWE56VG1GdFpUMWNJbUoxZEhSdmJsd2lJRzl1UTJ4cFkyczllM1JvYVhNdWMyVmhjbU5vVm1sbGQzMCtYRzRnSUNBZ0lDQWdJQ0FnSUNBOFNXTnZiaUIwZVhCbFBWd2ljMlZoY21Ob1hDSWdMejVjYmlBZ0lDQWdJQ0FnSUNBOEwyRStYRzRnSUNBZ0lDQWdJRHd2YkdrK1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbXhwYzNRdGRtbGxkMXdpUGx4dUlDQWdJQ0FnSUNBOFZHbDBiR1ZDWVhJK1hHNGdJQ0FnSUNBZ0lDQWdQRzVoZGlCamJHRnpjMDVoYldVOVhDSjBiM0F0Ym1GMlhDSStYRzRnSUNBZ0lDQWdJQ0FnSUNBOGRXdytYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lIdHdjbVZmWTI5dWRISnZiSE11YldGd0tHWjFibU4wYVc5dUlDaGpiMjUwY205c0tTQjdjbVYwZFhKdUlHTnZiblJ5YjJ3N2ZTbDlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwzVnNQbHh1SUNBZ0lDQWdJQ0FnSUR3dmJtRjJQbHh1WEc0Z0lDQWdJQ0FnSUNBZ1UyRm1aWFI1SUUxdmJXVnVkSE5jYmlBZ0lDQWdJQ0FnSUNBOFlTQmpiR0Z6YzA1aGJXVTlYQ0ppZFhSMGIyNGdZMnh2YzJVdFluVjBkRzl1WENJZ2IyNURiR2xqYXoxN2RHaHBjeTVqYkc5elpWWnBaWGQ5UGx4dUlDQWdJQ0FnSUNBZ0lDQWdQRWxqYjI0Z2RIbHdaVDFjSW1Oc2IzTmxYQ0lnTHo1Y2JpQWdJQ0FnSUNBZ0lDQThMMkUrWEc0Z0lDQWdJQ0FnSUR3dlZHbDBiR1ZDWVhJK1hHNGdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTk9ZVzFsUFZ3aWJHbHpkQzF2WmkxdGIyMWxiblJ6WENJK1hHNGdJQ0FnSUNBZ0lDQWdlMjF2YldWdWRITjlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZTeGNiaUFnYzJWaGNtTm9WbWxsZHpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIUm9hWE11WTJGMFpXZHZjbmxXYVdWM0tDazdYRzRnSUgwc1hHNGdJR05oZEdWbmIzSjVWbWxsZHpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lHUnBjM0JoZEdOb1pYSXVaR2x6Y0dGMFkyZ29lMXh1SUNBZ0lDQWdkSGx3WlRvZ0ozWnBaWGNuTEZ4dUlDQWdJQ0FnZG1sbGR6b2dKMk5oZEdWbmIzSjVKMXh1SUNBZ0lIMHBPMXh1SUNCOUxGeHVJQ0JpZFdsc1pFMXZiV1Z1ZEhNNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnYlc5dFpXNTBjenRjYmlBZ0lDQjJZWElnWld4bGJXVnVkSE03WEc0Z0lDQWdkbUZ5SUdOaGRHVm5iM0o1SUQwZ2MzUnZjbVV1WjJWMEtDZGpZWFJsWjI5eWVTY3BPMXh1WEc0Z0lDQWdiVzl0Wlc1MGN5QTlJR3hwYzNSZmMzUnZjbVV1Wm1sc2RHVnlLR1oxYm1OMGFXOXVJQ2h0YjIxbGJuUXBJSHRjYmlBZ0lDQWdJR2xtSUNoallYUmxaMjl5ZVNrZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2JXOXRaVzUwTG1kbGRDZ25hMlY1ZDI5eVpITW5LUzVwYm1SbGVFOW1LR05oZEdWbmIzSjVLU0ErSUMweE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnlaWFIxY200Z2RISjFaVHRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJR1ZzWlcxbGJuUnpJRDBnWHk1dFlYQW9iVzl0Wlc1MGN5d2dablZ1WTNScGIyNGdLRzF2YldWdWRDd2dhVzVrWlhncElIdGNiaUFnSUNBZ0lIWmhjaUJrWVhSbElEMGdiVzl0Wlc1MGFuTW9iVzl0Wlc1MExtZGxkQ2duWTNKbFlYUmxaQ2NwS1R0Y2JpQWdJQ0FnSUhaaGNpQnBiV0ZuWlZCeWIzQnpJRDBnZTF4dUlDQWdJQ0FnSUNCcGJXRm5aVG9nSUNBZ2JXOXRaVzUwTG1kbGRDZ25hVzFoWjJVbktTeGNiaUFnSUNBZ0lDQWdhMlY1ZDI5eVpITTZJRzF2YldWdWRDNW5aWFFvSjJ0bGVYZHZjbVJ6SnlsY2JpQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lHUmhkR1VnUFNCa1lYUmxMbVp2Y20xaGRDZ25UVTFOSUUwc0lGbFpXVmtuS1R0Y2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUNBZ1BHeHBJR3RsZVQxN2FXNWtaWGg5SUdOc1lYTnpUbUZ0WlQxY0ltMXZiV1Z1ZEZ3aVBseHVJQ0FnSUNBZ0lDQWdJRHhoSUc5dVEyeHBZMnM5ZTNSb2FYTXVjMlZzWldOMFRXOXRaVzUwTG1KcGJtUW9kR2hwY3l3Z2JXOXRaVzUwTG1sa0tYMCtYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW5Sb2RXMWlYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRHhRY21sdFlYSjVTVzFoWjJVZ2V5NHVMbWx0WVdkbFVISnZjSE45SUM4K1hHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpZEdsMGJHVmNJajVjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdlMjF2YldWdWRDNW5aWFFvSjNScGRHeGxKeWw5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2liWFYwWldRZ2MyMWhiR3hjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZTJSaGRHVjlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjYmlBZ0lDQWdJQ0FnSUNBOEwyRStYRzRnSUNBZ0lDQWdJRHd2YkdrK1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUgwc0lIUm9hWE1wTzF4dVhHNGdJQ0FnYVdZZ0tHVnNaVzFsYm5SekxteGxibWQwYUNBOElERXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnVkV3hzTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThkV3crZTJWc1pXMWxiblJ6ZlR3dmRXdytYRzRnSUNBZ0tUdGNiaUFnZlN4Y2JpQWdjMlZzWldOMFRXOXRaVzUwT2lCbWRXNWpkR2x2YmlBb2FXUXBJSHRjYmlBZ0lDQmthWE53WVhSamFHVnlMbVJwYzNCaGRHTm9LSHRjYmlBZ0lDQWdJSFI1Y0dVNklDQWdKMk5vYjI5elpTY3NYRzRnSUNBZ0lDQjJZV3gxWlRvZ0lHbGtYRzRnSUNBZ2ZTazdYRzVjYmlBZ0lDQjBhR2x6TG1Oc2IzTmxWbWxsZHlncE8xeHVJQ0I5TEZ4dUlDQmpiRzl6WlZacFpYYzZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0JrYVhOd1lYUmphR1Z5TG1ScGMzQmhkR05vS0h0Y2JpQWdJQ0FnSUhSNWNHVTZJQ2QyYVdWM0p5eGNiaUFnSUNBZ0lIWnBaWGM2SUc1MWJHeGNiaUFnSUNCOUtUdGNiaUFnZlZ4dWZTazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVEdsemRGWnBaWGM3WEc0aVhYMD0iLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFZpZXc7XG52YXIgUmVhY3QgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVG9wQmFyICAgICAgICA9IHJlcXVpcmUoJy4vdG9wX2Jhci5qc3gnKTtcbnZhciBGb290ZXJCYXIgICAgID0gcmVxdWlyZSgnLi9mb290ZXJfYmFyLmpzeCcpO1xudmFyIFN1bW1hcnkgICAgICAgPSByZXF1aXJlKCcuL3N1bW1hcnkuanN4Jyk7XG52YXIgU3BvbnNvciAgICAgICA9IHJlcXVpcmUoJy4vc3BvbnNvci5qc3gnKTtcbnZhciBUaXRsZUJhciAgICAgID0gcmVxdWlyZSgnLi90aXRsZV9iYXIuanN4Jyk7XG52YXIgTGlzdFZpZXcgICAgICA9IHJlcXVpcmUoJy4vbGlzdF92aWV3LmpzeCcpO1xudmFyIFByaW1hcnlJbWFnZSAgPSByZXF1aXJlKCcuL3ByaW1hcnlfaW1hZ2UuanN4Jyk7XG52YXIgbW9tZW50ICAgICAgICA9IHJlcXVpcmUoJ21vbWVudCcpO1xudmFyIHN0b3JlICAgICAgICAgPSByZXF1aXJlKCcuL3N0b3JlJyk7XG5cblZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVmlld1wiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmlldzogJ2xpc3QnLFxuICAgICAgbW9tZW50OiBudWxsXG4gICAgfTtcbiAgfSxcbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiAgICAgICAgJ1NhZmV0eSBNb21lbnQgVGl0bGUnLFxuICAgICAgY3JlYXRlZDogICAgICBuZXcgRGF0ZSgpLFxuICAgICAgc3VtbWFyeTogICAgICAnU3VtbWFyeSB0ZXh0JyxcbiAgICAgIGRldGFpbDogICAgICAgJ0RldGFpbCB0ZXh0JyxcbiAgICAgIGhlYWRlcl9pbWFnZTogdW5kZWZpbmVkLFxuICAgICAga2V5d29yZHM6ICAgICBbXVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoc3RvcmUudG9KU09OKCkpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgc3RvcmUub2ZmKCdjaGFuZ2UnKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZpZXcgPSB0aGlzLmJ1aWxkVmlldygpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb250ZW50XCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUb3BCYXIsIG51bGwpLCBcblxuICAgICAgICB2aWV3XG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgYnVpbGRWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZuO1xuICAgIHZhciBtYXA7XG5cbiAgICBtYXAgPSB7XG4gICAgICBzZWFyY2g6ICdidWlsZFNlYXJjaFZpZXcnLFxuICAgICAgc2hhcmU6ICdidWlsZFNoYXJlVmlldycsXG4gICAgICBsaXN0OiAnYnVpbGRMaXN0VmlldydcbiAgICB9O1xuXG4gICAgZm4gPSBtYXBbdGhpcy5zdGF0ZS52aWV3XTtcbiAgICBmbiA9IHRoaXNbZm5dIHx8IHRoaXMuYnVpbGRNYWluVmlldztcblxuICAgIHJldHVybiBmbi5jYWxsKHRoaXMpO1xuICB9LFxuICBidWlsZExpc3RWaWV3OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGlzdFZpZXcsIHtzZWFyY2g6IHRydWV9KVxuICAgICk7XG4gIH0sXG4gIGJ1aWxkTWFpblZpZXc6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIga2V5d29yZHMgPSBudWxsO1xuICAgIHZhciBpbWFnZVByb3BzO1xuICAgIHZhciBkYXRlID0gbW9tZW50KHRoaXMucHJvcHMuY3JlYXRlZCk7XG5cbiAgICBkYXRlID0gZGF0ZS5mb3JtYXQoJ01NTSBNLCBZWVlZJyk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5rZXl3b3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICBrZXl3b3JkcyA9IHRoaXMucHJvcHMua2V5d29yZHMgfHwgW107XG4gICAgICBrZXl3b3JkcyA9IGtleXdvcmRzLm1hcChmdW5jdGlvbiAoa2V5d29yZCkge1xuICAgICAgICByZXR1cm4ga2V5d29yZC5uYW1lO1xuICAgICAgfSk7XG4gICAgICBrZXl3b3JkcyA9IGtleXdvcmRzLmpvaW4oJywgJyk7XG4gICAgfVxuXG4gICAgaW1hZ2VQcm9wcyA9IHtcbiAgICAgIGltYWdlOiAgICB0aGlzLnByb3BzLmhlYWRlcl9pbWFnZSxcbiAgICAgIGtleXdvcmRzOiB0aGlzLnByb3BzLmtleXdvcmRzXG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibWFpbi12aWV3XCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUaXRsZUJhciwgbnVsbCwgXG4gICAgICAgICAgdGhpcy5wcm9wcy50aXRsZVxuICAgICAgICApLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByaW1hcnlJbWFnZSwgUmVhY3QuX19zcHJlYWQoe30sICBpbWFnZVByb3BzKSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtdXRlZCBzbWFsbFwifSwga2V5d29yZHMpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm11dGVkIHNtYWxsXCJ9LCBcIkNyZWF0ZWQgXCIsIGRhdGUpLCBcblxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFN1bW1hcnksIHt2YWx1ZTogdGhpcy5wcm9wcy5zdW1tYXJ5fSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3BvbnNvciwgbnVsbCksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoM1wiLCBudWxsLCBcIkRldGFpbHM6XCIpLCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTdW1tYXJ5LCB7dmFsdWU6IHRoaXMucHJvcHMuZGV0YWlsfSksIFxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9vdGVyQmFyLCBudWxsKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXRZV2x1WDNacFpYY3Vhbk40SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk96dEJRVVZCTEVkQlFVYzdPMEZCUlVnc1NVRkJTU3hKUVVGSkxFTkJRVU03UVVGRFZDeEpRVUZKTEV0QlFVc3NWMEZCVnl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGNrTXNTVUZCU1N4TlFVRk5MRlZCUVZVc1QwRkJUeXhEUVVGRExHVkJRV1VzUTBGQlF5eERRVUZETzBGQlF6ZERMRWxCUVVrc1UwRkJVeXhQUVVGUExFOUJRVThzUTBGQlF5eHJRa0ZCYTBJc1EwRkJReXhEUVVGRE8wRkJRMmhFTEVsQlFVa3NUMEZCVHl4VFFVRlRMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dEJRVU0zUXl4SlFVRkpMRTlCUVU4c1UwRkJVeXhQUVVGUExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdRVUZETjBNc1NVRkJTU3hSUVVGUkxGRkJRVkVzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGREwwTXNTVUZCU1N4UlFVRlJMRkZCUVZFc1QwRkJUeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1FVRkRMME1zU1VGQlNTeFpRVUZaTEVsQlFVa3NUMEZCVHl4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVOQlFVTTdRVUZEYmtRc1NVRkJTU3hOUVVGTkxGVkJRVlVzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTNSRExFbEJRVWtzUzBGQlN5eFhRVUZYTEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenM3UVVGRmRrTXNNRUpCUVRCQ0xHOUNRVUZCTzBWQlEzaENMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVODdUVUZEVEN4SlFVRkpMRVZCUVVVc1RVRkJUVHROUVVOYUxFMUJRVTBzUlVGQlJTeEpRVUZKTzB0QlEySXNRMEZCUXp0SFFVTklPMFZCUTBRc1pVRkJaU3hGUVVGRkxGbEJRVms3U1VGRE0wSXNUMEZCVHp0TlFVTk1MRXRCUVVzc1UwRkJVeXh4UWtGQmNVSTdUVUZEYmtNc1QwRkJUeXhQUVVGUExFbEJRVWtzU1VGQlNTeEZRVUZGTzAxQlEzaENMRTlCUVU4c1QwRkJUeXhqUVVGak8wMUJRelZDTEUxQlFVMHNVVUZCVVN4aFFVRmhPMDFCUXpOQ0xGbEJRVmtzUlVGQlJTeFRRVUZUTzAxQlEzWkNMRkZCUVZFc1RVRkJUU3hGUVVGRk8wdEJRMnBDTEVOQlFVTTdSMEZEU0R0RlFVTkVMR2xDUVVGcFFpeEZRVUZGTEZsQlFWazdTVUZETjBJc1MwRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF5eFJRVUZSTEVWQlFVVXNXVUZCV1R0TlFVTTNRaXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRVZCUVVVc1EwRkJReXhEUVVGRE8wdEJReTlDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU03UjBGRFpqdEZRVU5FTEc5Q1FVRnZRaXhGUVVGRkxGbEJRVms3U1VGRGFFTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEhRVU55UWp0RlFVTkVMRTFCUVUwc1JVRkJSU3haUVVGWk8wRkJRM1JDTEVsQlFVa3NTVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUlVGQlJTeERRVUZET3p0SlFVVTFRanROUVVORkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zVTBGQlZTeERRVUZCTEVWQlFVRTdRVUZETDBJc1VVRkJVU3h2UWtGQlF5eE5RVUZOTEVWQlFVRXNTVUZCUVN4RFFVRkhMRU5CUVVFc1JVRkJRVHM3VVVGRlZDeEpRVUZMTzAxQlEwWXNRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hUUVVGVExFVkJRVVVzV1VGQldUdEpRVU55UWl4SlFVRkpMRVZCUVVVc1EwRkJRenRCUVVOWUxFbEJRVWtzU1VGQlNTeEhRVUZITEVOQlFVTTdPMGxCUlZJc1IwRkJSeXhIUVVGSE8wMUJRMG9zVFVGQlRTeEZRVUZGTEdsQ1FVRnBRanROUVVONlFpeExRVUZMTEVWQlFVVXNaMEpCUVdkQ08wMUJRM1pDTEVsQlFVa3NSVUZCUlN4bFFVRmxPMEZCUXpOQ0xFdEJRVXNzUTBGQlF6czdTVUZGUml4RlFVRkZMRWRCUVVjc1IwRkJSeXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRPVUlzU1VGQlNTeEZRVUZGTEVkQlFVY3NTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhKUVVGSkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTTdPMGxCUlhCRExFOUJRVThzUlVGQlJTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRIUVVOMFFqdEZRVU5FTEdGQlFXRXNSVUZCUlN4WlFVRlpPMGxCUTNwQ08wMUJRMFVzYjBKQlFVTXNVVUZCVVN4RlFVRkJMRU5CUVVFc1EwRkJReXhOUVVGQkxFVkJRVTBzUTBGQlJTeEpRVUZMTEVOQlFVRXNRMEZCUnl4RFFVRkJPMDFCUXpGQ08wZEJRMGc3UlVGRFJDeGhRVUZoTEVWQlFVVXNXVUZCV1R0SlFVTjZRaXhKUVVGSkxGRkJRVkVzUjBGQlJ5eEpRVUZKTEVOQlFVTTdTVUZEY0VJc1NVRkJTU3hWUVVGVkxFTkJRVU03UVVGRGJrSXNTVUZCU1N4SlFVRkpMRWxCUVVrc1IwRkJSeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenM3UVVGRk1VTXNTVUZCU1N4SlFVRkpMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXpzN1NVRkZiRU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eEZRVUZGTzAxQlEyeERMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWRXNTVUZCU1N4RlFVRkZMRU5CUVVNN1RVRkRja01zVVVGQlVTeEhRVUZITEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hQUVVGUExFVkJRVVU3VVVGRGVrTXNUMEZCVHl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRE8wOUJRM0pDTEVOQlFVTXNRMEZCUXp0TlFVTklMRkZCUVZFc1IwRkJSeXhSUVVGUkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTNKRExFdEJRVXM3TzBsQlJVUXNWVUZCVlN4SFFVRkhPMDFCUTFnc1MwRkJTeXhMUVVGTExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNXVUZCV1R0TlFVTnFReXhSUVVGUkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlJPMEZCUTI1RExFdEJRVXNzUTBGQlF6czdTVUZGUmp0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1YwRkJXU3hEUVVGQkxFVkJRVUU3VVVGRGVrSXNiMEpCUVVNc1VVRkJVU3hGUVVGQkxFbEJRVU1zUlVGQlFUdFZRVU5RTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJUVHRCUVVNMVFpeFJRVUZ0UWl4RFFVRkJMRVZCUVVFN08wRkJSVzVDTEZGQlFWRXNiMEpCUVVNc1dVRkJXU3hGUVVGQkxHZENRVUZCTEVkQlFVRXNRMEZCUlN4SFFVRkhMRlZCUVZjc1EwRkJRU3hEUVVGSExFTkJRVUVzUlVGQlFUczdVVUZGYUVNc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhoUVVGakxFTkJRVUVzUlVGQlF5eFJRVUZsTEVOQlFVRXNSVUZCUVR0QlFVTnlSQ3hSUVVGUkxHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zWVVGQll5eERRVUZCTEVWQlFVRXNWVUZCUVN4RlFVRlRMRWxCUVZjc1EwRkJRU3hGUVVGQk96dEJRVVY2UkN4UlFVRlJMRzlDUVVGRExFOUJRVThzUlVGQlFTeERRVUZCTEVOQlFVTXNTMEZCUVN4RlFVRkxMRU5CUVVVc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZSTEVOQlFVRXNRMEZCUnl4RFFVRkJMRVZCUVVFN08wRkJSVGxETEZGQlFWRXNiMEpCUVVNc1QwRkJUeXhGUVVGQkxFbEJRVUVzUTBGQlJ5eERRVUZCTEVWQlFVRTdPMUZCUlZnc2IwSkJRVUVzU1VGQlJ5eEZRVUZCTEVsQlFVTXNSVUZCUVN4VlFVRmhMRU5CUVVFc1JVRkJRVHRCUVVONlFpeFJRVUZSTEc5Q1FVRkRMRTlCUVU4c1JVRkJRU3hEUVVGQkxFTkJRVU1zUzBGQlFTeEZRVUZMTEVOQlFVVXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGUExFTkJRVUVzUTBGQlJ5eERRVUZCTEVWQlFVRTdPMUZCUlhKRExHOUNRVUZETEZOQlFWTXNSVUZCUVN4SlFVRkJMRU5CUVVjc1EwRkJRVHROUVVOVUxFTkJRVUU3VFVGRFRqdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGWnBaWGM3WEc1MllYSWdVbVZoWTNRZ0lDQWdJQ0FnSUNBOUlISmxjWFZwY21Vb0ozSmxZV04wSnlrN1hHNTJZWElnVkc5d1FtRnlJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2ZEc5d1gySmhjaTVxYzNnbktUdGNiblpoY2lCR2IyOTBaWEpDWVhJZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5bWIyOTBaWEpmWW1GeUxtcHplQ2NwTzF4dWRtRnlJRk4xYlcxaGNua2dJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMM04xYlcxaGNua3Vhbk40SnlrN1hHNTJZWElnVTNCdmJuTnZjaUFnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KeTR2YzNCdmJuTnZjaTVxYzNnbktUdGNiblpoY2lCVWFYUnNaVUpoY2lBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5MGFYUnNaVjlpWVhJdWFuTjRKeWs3WEc1MllYSWdUR2x6ZEZacFpYY2dJQ0FnSUNBOUlISmxjWFZwY21Vb0p5NHZiR2x6ZEY5MmFXVjNMbXB6ZUNjcE8xeHVkbUZ5SUZCeWFXMWhjbmxKYldGblpTQWdQU0J5WlhGMWFYSmxLQ2N1TDNCeWFXMWhjbmxmYVcxaFoyVXVhbk40SnlrN1hHNTJZWElnYlc5dFpXNTBJQ0FnSUNBZ0lDQTlJSEpsY1hWcGNtVW9KMjF2YldWdWRDY3BPMXh1ZG1GeUlITjBiM0psSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NjdUwzTjBiM0psSnlrN1hHNWNibFpwWlhjZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUdkbGRFbHVhWFJwWVd4VGRHRjBaVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0IyYVdWM09pQW5iR2x6ZENjc1hHNGdJQ0FnSUNCdGIyMWxiblE2SUc1MWJHeGNiaUFnSUNCOU8xeHVJQ0I5TEZ4dUlDQm5aWFJFWldaaGRXeDBVSEp2Y0hNNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ2RHbDBiR1U2SUNBZ0lDQWdJQ0FuVTJGbVpYUjVJRTF2YldWdWRDQlVhWFJzWlNjc1hHNGdJQ0FnSUNCamNtVmhkR1ZrT2lBZ0lDQWdJRzVsZHlCRVlYUmxLQ2tzWEc0Z0lDQWdJQ0J6ZFcxdFlYSjVPaUFnSUNBZ0lDZFRkVzF0WVhKNUlIUmxlSFFuTEZ4dUlDQWdJQ0FnWkdWMFlXbHNPaUFnSUNBZ0lDQW5SR1YwWVdsc0lIUmxlSFFuTEZ4dUlDQWdJQ0FnYUdWaFpHVnlYMmx0WVdkbE9pQjFibVJsWm1sdVpXUXNYRzRnSUNBZ0lDQnJaWGwzYjNKa2N6b2dJQ0FnSUZ0ZFhHNGdJQ0FnZlR0Y2JpQWdmU3hjYmlBZ1kyOXRjRzl1Wlc1MFJHbGtUVzkxYm5RNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQnpkRzl5WlM1dmJpZ25ZMmhoYm1kbEp5d2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NXpaWFJUZEdGMFpTaHpkRzl5WlM1MGIwcFRUMDRvS1NrN1hHNGdJQ0FnZlM1aWFXNWtLSFJvYVhNcEtUdGNiaUFnZlN4Y2JpQWdZMjl0Y0c5dVpXNTBWMmxzYkZWdWJXOTFiblE2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCemRHOXlaUzV2Wm1Zb0oyTm9ZVzVuWlNjcE8xeHVJQ0I5TEZ4dUlDQnlaVzVrWlhJNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjJZWElnZG1sbGR5QTlJSFJvYVhNdVluVnBiR1JXYVdWM0tDazdYRzVjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ1BHUnBkaUJqYkdGemMwNWhiV1U5WENKamIyNTBaVzUwWENJK1hHNGdJQ0FnSUNBZ0lEeFViM0JDWVhJZ0x6NWNibHh1SUNBZ0lDQWdJQ0I3ZG1sbGQzMWNiaUFnSUNBZ0lEd3ZaR2wyUGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUdKMWFXeGtWbWxsZHpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJtYmp0Y2JpQWdJQ0IyWVhJZ2JXRndPMXh1WEc0Z0lDQWdiV0Z3SUQwZ2UxeHVJQ0FnSUNBZ2MyVmhjbU5vT2lBblluVnBiR1JUWldGeVkyaFdhV1YzSnl4Y2JpQWdJQ0FnSUhOb1lYSmxPaUFuWW5WcGJHUlRhR0Z5WlZacFpYY25MRnh1SUNBZ0lDQWdiR2x6ZERvZ0oySjFhV3hrVEdsemRGWnBaWGNuWEc0Z0lDQWdmVHRjYmx4dUlDQWdJR1p1SUQwZ2JXRndXM1JvYVhNdWMzUmhkR1V1ZG1sbGQxMDdYRzRnSUNBZ1ptNGdQU0IwYUdselcyWnVYU0I4ZkNCMGFHbHpMbUoxYVd4a1RXRnBibFpwWlhjN1hHNWNiaUFnSUNCeVpYUjFjbTRnWm00dVkyRnNiQ2gwYUdsektUdGNiaUFnZlN4Y2JpQWdZblZwYkdSTWFYTjBWbWxsZHpvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFRHbHpkRlpwWlhjZ2MyVmhjbU5vUFh0MGNuVmxmU0F2UGx4dUlDQWdJQ2s3WEc0Z0lIMHNYRzRnSUdKMWFXeGtUV0ZwYmxacFpYYzZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2EyVjVkMjl5WkhNZ1BTQnVkV3hzTzF4dUlDQWdJSFpoY2lCcGJXRm5aVkJ5YjNCek8xeHVJQ0FnSUhaaGNpQmtZWFJsSUQwZ2JXOXRaVzUwS0hSb2FYTXVjSEp2Y0hNdVkzSmxZWFJsWkNrN1hHNWNiaUFnSUNCa1lYUmxJRDBnWkdGMFpTNW1iM0p0WVhRb0owMU5UU0JOTENCWldWbFpKeWs3WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTV3Y205d2N5NXJaWGwzYjNKa2N5NXNaVzVuZEdnZ1BpQXdLU0I3WEc0Z0lDQWdJQ0JyWlhsM2IzSmtjeUE5SUhSb2FYTXVjSEp2Y0hNdWEyVjVkMjl5WkhNZ2ZId2dXMTA3WEc0Z0lDQWdJQ0JyWlhsM2IzSmtjeUE5SUd0bGVYZHZjbVJ6TG0xaGNDaG1kVzVqZEdsdmJpQW9hMlY1ZDI5eVpDa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdhMlY1ZDI5eVpDNXVZVzFsTzF4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNCclpYbDNiM0prY3lBOUlHdGxlWGR2Y21SekxtcHZhVzRvSnl3Z0p5azdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXMWhaMlZRY205d2N5QTlJSHRjYmlBZ0lDQWdJR2x0WVdkbE9pQWdJQ0IwYUdsekxuQnliM0J6TG1obFlXUmxjbDlwYldGblpTeGNiaUFnSUNBZ0lHdGxlWGR2Y21Sek9pQjBhR2x6TG5CeWIzQnpMbXRsZVhkdmNtUnpYRzRnSUNBZ2ZUdGNibHh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOFpHbDJJR05zWVhOelRtRnRaVDFjSW0xaGFXNHRkbWxsZDF3aVBseHVJQ0FnSUNBZ0lDQThWR2wwYkdWQ1lYSStYRzRnSUNBZ0lDQWdJQ0FnZTNSb2FYTXVjSEp2Y0hNdWRHbDBiR1Y5WEc0Z0lDQWdJQ0FnSUR3dlZHbDBiR1ZDWVhJK1hHNWNiaUFnSUNBZ0lDQWdQRkJ5YVcxaGNubEpiV0ZuWlNCN0xpNHVhVzFoWjJWUWNtOXdjMzBnTHo1Y2JseHVJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0ltMTFkR1ZrSUhOdFlXeHNYQ0krZTJ0bGVYZHZjbVJ6ZlR3dlpHbDJQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbTExZEdWa0lITnRZV3hzWENJK1EzSmxZWFJsWkNCN1pHRjBaWDA4TDJScGRqNWNibHh1SUNBZ0lDQWdJQ0E4VTNWdGJXRnllU0IyWVd4MVpUMTdkR2hwY3k1d2NtOXdjeTV6ZFcxdFlYSjVmU0F2UGx4dVhHNGdJQ0FnSUNBZ0lEeFRjRzl1YzI5eUlDOCtYRzVjYmlBZ0lDQWdJQ0FnUEdnelBrUmxkR0ZwYkhNNlBDOW9NejVjYmlBZ0lDQWdJQ0FnUEZOMWJXMWhjbmtnZG1Gc2RXVTllM1JvYVhNdWNISnZjSE11WkdWMFlXbHNmU0F2UGx4dVhHNGdJQ0FnSUNBZ0lEeEdiMjkwWlhKQ1lYSWdMejVjYmlBZ0lDQWdJRHd2WkdsMlBseHVJQ0FnSUNrN1hHNGdJSDFjYm4wcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRlpwWlhjN1hHNGlYWDA9IiwiLyoqXG4gKiBAanN4IFJlYWN0LkRPTVxuICovXG5cbnZhciBSZWFjdCAgID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBJY29uICAgID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9pY29uLmpzeCcpO1xudmFyIFByaW1hcnlJbWFnZTtcblxuUHJpbWFyeUltYWdlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlByaW1hcnlJbWFnZVwiLFxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAga2V5d29yZHM6IFtdXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIEltYWdlRWw7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5pbWFnZSkge1xuICAgICAgSW1hZ2VFbCA9IHRoaXMuYnVpbGRGcm9tSW1hZ2UoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBJbWFnZUVsID0gdGhpcy5idWlsZEZyb21DYXRlZ29yeSgpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBJbWFnZUVsXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgYnVpbGRGcm9tQ2F0ZWdvcnk6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ZWdvcnkgPSB0aGlzLnByb3BzLmtleXdvcmRzIHx8IFtdO1xuXG4gICAgY2F0ZWdvcnkgPSBjYXRlZ29yeVswXSB8fCB7fTtcbiAgICBjYXRlZ29yeSA9IGNhdGVnb3J5Lm5hbWUgfHwgJ2Jhbic7XG4gICAgY2F0ZWdvcnkgPSAnc2hpZWxkJztcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJpbWFyeS1pbWFnZS1mYWtlXCJ9LCBcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7dHlwZTogY2F0ZWdvcnl9KVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIGJ1aWxkRnJvbUltYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGltYWdlID0gdGhpcy5wcm9wcy5pbWFnZTtcblxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtzcmM6IGltYWdlLmltYWdlLCBjbGFzc05hbWU6IFwicHJpbWFyeS1pbWFnZVwifSlcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmltYXJ5SW1hZ2U7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXdjbWx0WVhKNVgybHRZV2RsTG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhKUVVGSkxFbEJRVWtzVFVGQlRTeFBRVUZQTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVU1zUTBGQlF6dEJRVU5vUkN4SlFVRkpMRmxCUVZrc1EwRkJRenM3UVVGRmFrSXNhME5CUVd0RExEUkNRVUZCTzBWQlEyaERMR1ZCUVdVc1JVRkJSU3haUVVGWk8wbEJRek5DTEU5QlFVODdUVUZEVEN4UlFVRlJMRVZCUVVVc1JVRkJSVHRMUVVOaUxFTkJRVU03UjBGRFNEdEZRVU5FTEUxQlFVMHNSVUZCUlN4WlFVRlpPMEZCUTNSQ0xFbEJRVWtzU1VGQlNTeFBRVUZQTEVOQlFVTTdPMGxCUlZvc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEV0QlFVc3NSVUZCUlR0TlFVTndRaXhQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEdOQlFXTXNSVUZCUlN4RFFVRkRPMHRCUTJwRE8xTkJRMGs3VFVGRFNDeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTEVOQlFVTTdRVUZEZWtNc1MwRkJTenM3U1VGRlJEdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hKUVVGRExFVkJRVUU3VVVGRFJpeFBRVUZSTzAxQlEwd3NRMEZCUVR0TlFVTk9PMGRCUTBnN1JVRkRSQ3hwUWtGQmFVSXNSVUZCUlN4WlFVRlpPMEZCUTJwRExFbEJRVWtzU1VGQlNTeFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFbEJRVWtzUlVGQlJTeERRVUZET3p0SlFVVjZReXhSUVVGUkxFZEJRVWNzVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJRenRKUVVNM1FpeFJRVUZSTEVkQlFVY3NVVUZCVVN4RFFVRkRMRWxCUVVrc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRGRFTXNTVUZCU1N4UlFVRlJMRWRCUVVjc1VVRkJVU3hEUVVGRE96dEpRVVZ3UWp0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc2IwSkJRWEZDTEVOQlFVRXNSVUZCUVR0UlFVTnNReXh2UWtGQlF5eEpRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRWxCUVVFc1JVRkJTU3hEUVVGRkxGRkJRVk1zUTBGQlFTeERRVUZITEVOQlFVRTdUVUZEY0VJc1EwRkJRVHROUVVOT08wZEJRMGc3UlVGRFJDeGpRVUZqTEVWQlFVVXNXVUZCV1R0QlFVTTVRaXhKUVVGSkxFbEJRVWtzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJTeXhEUVVGRE96dEpRVVUzUWp0TlFVTkZMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNSMEZCUVN4RlFVRkhMRU5CUVVVc1MwRkJTeXhEUVVGRExFdEJRVXNzUlVGQlF5eERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR1ZCUVdVc1EwRkJRU3hEUVVGSExFTkJRVUU3VFVGRGJrUTdSMEZEU0R0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1dVRkJXU3hEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFhbk40SUZKbFlXTjBMa1JQVFZ4dUlDb3ZYRzVjYm5aaGNpQlNaV0ZqZENBZ0lEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRbktUdGNiblpoY2lCSlkyOXVJQ0FnSUQwZ2NtVnhkV2x5WlNnbkxpNHZZMjl0Y0c5dVpXNTBjeTlwWTI5dUxtcHplQ2NwTzF4dWRtRnlJRkJ5YVcxaGNubEpiV0ZuWlR0Y2JseHVVSEpwYldGeWVVbHRZV2RsSUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0JuWlhSRVpXWmhkV3gwVUhKdmNITTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlMXh1SUNBZ0lDQWdhMlY1ZDI5eVpITTZJRnRkWEc0Z0lDQWdmVHRjYmlBZ2ZTeGNiaUFnY21WdVpHVnlPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlFbHRZV2RsUld3N1hHNWNiaUFnSUNCcFppQW9kR2hwY3k1d2NtOXdjeTVwYldGblpTa2dlMXh1SUNBZ0lDQWdTVzFoWjJWRmJDQTlJSFJvYVhNdVluVnBiR1JHY205dFNXMWhaMlVvS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdaV3h6WlNCN1hHNGdJQ0FnSUNCSmJXRm5aVVZzSUQwZ2RHaHBjeTVpZFdsc1pFWnliMjFEWVhSbFoyOXllU2dwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wyUGx4dUlDQWdJQ0FnSUNCN1NXMWhaMlZGYkgxY2JpQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDazdYRzRnSUgwc1hHNGdJR0oxYVd4a1JuSnZiVU5oZEdWbmIzSjVPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlHTmhkR1ZuYjNKNUlEMGdkR2hwY3k1d2NtOXdjeTVyWlhsM2IzSmtjeUI4ZkNCYlhUdGNibHh1SUNBZ0lHTmhkR1ZuYjNKNUlEMGdZMkYwWldkdmNubGJNRjBnZkh3Z2UzMDdYRzRnSUNBZ1kyRjBaV2R2Y25rZ1BTQmpZWFJsWjI5eWVTNXVZVzFsSUh4OElDZGlZVzRuTzF4dUlDQWdJR05oZEdWbmIzSjVJRDBnSjNOb2FXVnNaQ2M3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSndjbWx0WVhKNUxXbHRZV2RsTFdaaGEyVmNJajVjYmlBZ0lDQWdJQ0FnUEVsamIyNGdkSGx3WlQxN1kyRjBaV2R2Y25sOUlDOCtYRzRnSUNBZ0lDQThMMlJwZGo1Y2JpQWdJQ0FwTzF4dUlDQjlMRnh1SUNCaWRXbHNaRVp5YjIxSmJXRm5aVG9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQnBiV0ZuWlNBOUlIUm9hWE11Y0hKdmNITXVhVzFoWjJVN1hHNWNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdsdFp5QnpjbU05ZTJsdFlXZGxMbWx0WVdkbGZTQmpiR0Z6YzA1aGJXVTlYQ0p3Y21sdFlYSjVMV2x0WVdkbFhDSWdMejVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCUWNtbHRZWEo1U1cxaFoyVTdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgU3BvbnNvcjtcblxuU3BvbnNvciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTcG9uc29yXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwic3BvbnNvclwifSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzbWFsbCBtdXRlZFwifSwgXG4gICAgICAgICAgXCJTcG9uc29yZWQgYnk6XCJcbiAgICAgICAgKSwgXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJzcG9uc29yLWNvbnRlbnRcIn0sIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3BvbnNvci1pbWFnZVwifSksIFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3BvbnNvci1uYW1lXCJ9LCBcbiAgICAgICAgICAgIFwiSGlsdGkgcmlzayBhc3N1bXB0aW9uIHByb2R1Y3RzXCJcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcG9uc29yO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzl6Y0c5dWMyOXlMbXB6ZUNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFUczdRVUZGUVN4SFFVRkhPenRCUVVWSUxFbEJRVWtzUzBGQlN5eExRVUZMTEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNdlFpeEpRVUZKTEU5QlFVOHNRMEZCUXpzN1FVRkZXaXcyUWtGQk5rSXNkVUpCUVVFN1JVRkRNMElzVFVGQlRTeEZRVUZGTEZsQlFWazdTVUZEYkVJN1RVRkRSU3h2UWtGQlFTeExRVUZKTEVWQlFVRXNRMEZCUVN4RFFVRkRMRk5CUVVFc1JVRkJVeXhEUVVGRExGTkJRVlVzUTBGQlFTeEZRVUZCTzFGQlEzWkNMRzlDUVVGQkxFdEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1lVRkJZeXhEUVVGQkxFVkJRVUU3UVVGQlFTeFZRVUZCTEdWQlFVRTdRVUZCUVN4UlFVVjJRaXhEUVVGQkxFVkJRVUU3VVVGRFRpeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEdsQ1FVRnJRaXhEUVVGQkxFVkJRVUU3VlVGREwwSXNiMEpCUVVFc1RVRkJTeXhGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4bFFVRmxMRU5CUVVFc1EwRkJSeXhEUVVGQkxFVkJRVUU3VlVGRGJFTXNiMEpCUVVFc1RVRkJTeXhGUVVGQkxFTkJRVUVzUTBGQlF5eFRRVUZCTEVWQlFWTXNRMEZCUXl4alFVRmxMRU5CUVVFc1JVRkJRVHRCUVVGQkxGbEJRVUVzWjBOQlFVRTdRVUZCUVN4VlFVVjRRaXhEUVVGQk8xRkJRMGdzUTBGQlFUdE5RVU5HTEVOQlFVRTdUVUZEVGp0SFFVTklPMEZCUTBnc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpcGNiaUFxSUVCcWMzZ2dVbVZoWTNRdVJFOU5YRzRnS2k5Y2JseHVkbUZ5SUZKbFlXTjBJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRk53YjI1emIzSTdYRzVjYmxOd2IyNXpiM0lnUFNCU1pXRmpkQzVqY21WaGRHVkRiR0Z6Y3loN1hHNGdJSEpsYm1SbGNqb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQW9YRzRnSUNBZ0lDQThaR2wySUdOc1lYTnpUbUZ0WlQxY0luTndiMjV6YjNKY0lqNWNiaUFnSUNBZ0lDQWdQR1JwZGlCamJHRnpjMDVoYldVOVhDSnpiV0ZzYkNCdGRYUmxaRndpUGx4dUlDQWdJQ0FnSUNBZ0lGTndiMjV6YjNKbFpDQmllVHBjYmlBZ0lDQWdJQ0FnUEM5a2FYWStYRzRnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM05PWVcxbFBWd2ljM0J2Ym5OdmNpMWpiMjUwWlc1MFhDSStYRzRnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpYzNCdmJuTnZjaTFwYldGblpWd2lJQzgrWEc0Z0lDQWdJQ0FnSUNBZ1BITndZVzRnWTJ4aGMzTk9ZVzFsUFZ3aWMzQnZibk52Y2kxdVlXMWxYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQklhV3gwYVNCeWFYTnJJR0Z6YzNWdGNIUnBiMjRnY0hKdlpIVmpkSE5jYmlBZ0lDQWdJQ0FnSUNBOEwzTndZVzQrWEc0Z0lDQWdJQ0FnSUR3dlpHbDJQbHh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVM0J2Ym5OdmNqdGNiaUpkZlE9PSIsInZhciBzdG9yZTtcbnZhciBTdG9yZTtcbnZhciBkaXNwYXRjaGVyICA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hlcicpO1xudmFyIEJhY2tib25lICAgID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxuU3RvcmUgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICBkZWZhdWx0czoge1xuICAgIHZpZXc6ICAgICBudWxsLFxuICAgIGNhdGVnb3J5OiBudWxsLFxuICAgIG1vbWVudDogICBudWxsXG4gIH0sXG4gIGRpc3BhdGNoSGFuZGxlcjogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICBzd2l0Y2ggKHBheWxvYWQudHlwZSkge1xuICAgICAgY2FzZSAndmlldyc6XG4gICAgICAgIHRoaXMuc2V0KCd2aWV3JywgcGF5bG9hZC52aWV3KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjaG9vc2UnOlxuICAgICAgICB0aGlzLnNldCgnbW9tZW50JywgcGF5bG9hZC52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2F0ZWdvcnknOlxuICAgICAgICB0aGlzLnNldCgnY2F0ZWdvcnknLCBwYXlsb2FkLnZhbHVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59KTtcblxuc3RvcmUgPSBuZXcgU3RvcmUoKTtcblxuc3RvcmUudG9rZW4gPSBkaXNwYXRjaGVyLnJlZ2lzdGVyKHN0b3JlLmRpc3BhdGNoSGFuZGxlci5iaW5kKHN0b3JlKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOXpkRzl5WlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRU3hKUVVGSkxFdEJRVXNzUTBGQlF6dEJRVU5XTEVsQlFVa3NTMEZCU3l4RFFVRkRPMEZCUTFZc1NVRkJTU3hWUVVGVkxFbEJRVWtzVDBGQlR5eERRVUZETEdOQlFXTXNRMEZCUXl4RFFVRkRPMEZCUXpGRExFbEJRVWtzVVVGQlVTeE5RVUZOTEU5QlFVOHNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenM3UVVGRmRFTXNTMEZCU3l4SFFVRkhMRkZCUVZFc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETzBWQlF6VkNMRkZCUVZFc1JVRkJSVHRKUVVOU0xFbEJRVWtzVFVGQlRTeEpRVUZKTzBsQlEyUXNVVUZCVVN4RlFVRkZMRWxCUVVrN1NVRkRaQ3hOUVVGTkxFbEJRVWtzU1VGQlNUdEhRVU5tTzBWQlEwUXNaVUZCWlN4RlFVRkZMRlZCUVZVc1QwRkJUeXhGUVVGRk8wbEJRMnhETEZGQlFWRXNUMEZCVHl4RFFVRkRMRWxCUVVrN1RVRkRiRUlzUzBGQlN5eE5RVUZOTzFGQlExUXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhOUVVGTkxFVkJRVVVzVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMUZCUXk5Q0xFMUJRVTA3VFVGRFVpeExRVUZMTEZGQlFWRTdVVUZEV0N4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExGRkJRVkVzUlVGQlJTeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1VVRkRiRU1zVFVGQlRUdE5RVU5TTEV0QlFVc3NWVUZCVlR0UlFVTmlMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zVlVGQlZTeEZRVUZGTEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRSUVVOd1F5eE5RVUZOTzB0QlExUTdSMEZEUmp0QlFVTklMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVZJTEV0QlFVc3NSMEZCUnl4SlFVRkpMRXRCUVVzc1JVRkJSU3hEUVVGRE96dEJRVVZ3UWl4TFFVRkxMRU5CUVVNc1MwRkJTeXhIUVVGSExGVkJRVlVzUTBGQlF5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMR1ZCUVdVc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZja1VzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnYzNSdmNtVTdYRzUyWVhJZ1UzUnZjbVU3WEc1MllYSWdaR2x6Y0dGMFkyaGxjaUFnUFNCeVpYRjFhWEpsS0NjdUwyUnBjM0JoZEdOb1pYSW5LVHRjYm5aaGNpQkNZV05yWW05dVpTQWdJQ0E5SUhKbGNYVnBjbVVvSjJKaFkydGliMjVsSnlrN1hHNWNibE4wYjNKbElEMGdRbUZqYTJKdmJtVXVUVzlrWld3dVpYaDBaVzVrS0h0Y2JpQWdaR1ZtWVhWc2RITTZJSHRjYmlBZ0lDQjJhV1YzT2lBZ0lDQWdiblZzYkN4Y2JpQWdJQ0JqWVhSbFoyOXllVG9nYm5Wc2JDeGNiaUFnSUNCdGIyMWxiblE2SUNBZ2JuVnNiRnh1SUNCOUxGeHVJQ0JrYVhOd1lYUmphRWhoYm1Sc1pYSTZJR1oxYm1OMGFXOXVJQ2h3WVhsc2IyRmtLU0I3WEc0Z0lDQWdjM2RwZEdOb0lDaHdZWGxzYjJGa0xuUjVjR1VwSUh0Y2JpQWdJQ0FnSUdOaGMyVWdKM1pwWlhjbk9seHVJQ0FnSUNBZ0lDQjBhR2x6TG5ObGRDZ25kbWxsZHljc0lIQmhlV3h2WVdRdWRtbGxkeWs3WEc0Z0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lDQWdZMkZ6WlNBblkyaHZiM05sSnpwY2JpQWdJQ0FnSUNBZ2RHaHBjeTV6WlhRb0oyMXZiV1Z1ZENjc0lIQmhlV3h2WVdRdWRtRnNkV1VwTzF4dUlDQWdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQWdJR05oYzJVZ0oyTmhkR1ZuYjNKNUp6cGNiaUFnSUNBZ0lDQWdkR2hwY3k1elpYUW9KMk5oZEdWbmIzSjVKeXdnY0dGNWJHOWhaQzUyWVd4MVpTazdYRzRnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUgxY2JpQWdmVnh1ZlNrN1hHNWNibk4wYjNKbElEMGdibVYzSUZOMGIzSmxLQ2s3WEc1Y2JuTjBiM0psTG5SdmEyVnVJRDBnWkdsemNHRjBZMmhsY2k1eVpXZHBjM1JsY2loemRHOXlaUzVrYVhOd1lYUmphRWhoYm1Sc1pYSXVZbWx1WkNoemRHOXlaU2twTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlITjBiM0psTzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFN1bW1hcnk7XG5cblN1bW1hcnkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU3VtbWFyeVwiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInN1bW1hcnlcIn0sIFxuICAgICAgICB0aGlzLnByb3BzLnZhbHVlXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gU3VtbWFyeTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlpY21saGJtSnNiMk5yWlhJdlJHVjJaV3h2Y0cxbGJuUXZSMGxVTDJsM2N5MXhkV2xqYXkxemRIbHNaUzFuZFdsa1pTOXpZM0pwY0hSekwzTmhabVYwZVM5emRXMXRZWEo1TG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1MwRkJTeXhMUVVGTExFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhKUVVGSkxFOUJRVThzUTBGQlF6czdRVUZGV2l3MlFrRkJOa0lzZFVKQlFVRTdSVUZETTBJc1RVRkJUU3hGUVVGRkxGbEJRVms3U1VGRGJFSTdUVUZEUlN4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRk5CUVZVc1EwRkJRU3hGUVVGQk8xRkJRM1JDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1MwRkJUVHROUVVOa0xFTkJRVUU3VFVGRFRqdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4UFFVRlBMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGSmxZV04wSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUZOMWJXMWhjbms3WEc1Y2JsTjFiVzFoY25rZ1BTQlNaV0ZqZEM1amNtVmhkR1ZEYkdGemN5aDdYRzRnSUhKbGJtUmxjam9nWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUFvWEc0Z0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbk4xYlcxaGNubGNJajVjYmlBZ0lDQWdJQ0FnZTNSb2FYTXVjSEp2Y0hNdWRtRnNkV1Y5WEc0Z0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBcE8xeHVJQ0I5WEc1OUtUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JUZFcxdFlYSjVPMXh1SWwxOSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVGl0bGVCYXI7XG5cblRpdGxlQmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlRpdGxlQmFyXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwidGl0bGUtYmFyXCJ9LCBcbiAgICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpdGxlQmFyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OWljbWxoYm1Kc2IyTnJaWEl2UkdWMlpXeHZjRzFsYm5RdlIwbFVMMmwzY3kxeGRXbGpheTF6ZEhsc1pTMW5kV2xrWlM5elkzSnBjSFJ6TDNOaFptVjBlUzkwYVhSc1pWOWlZWEl1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NTVUZCU1N4TFFVRkxMRXRCUVVzc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlF5OUNMRWxCUVVrc1VVRkJVU3hEUVVGRE96dEJRVVZpTERoQ1FVRTRRaXgzUWtGQlFUdEZRVU0xUWl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FqdE5RVU5GTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNWMEZCV1N4RFFVRkJMRVZCUVVFN1VVRkRlRUlzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UlFVRlRPMDFCUTJwQ0xFTkJRVUU3VFVGRFRqdEhRVU5JTzBGQlEwZ3NRMEZCUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4UlFVRlJMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaXBjYmlBcUlFQnFjM2dnVW1WaFkzUXVSRTlOWEc0Z0tpOWNibHh1ZG1GeUlGSmxZV04wSUNBZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZENjcE8xeHVkbUZ5SUZScGRHeGxRbUZ5TzF4dVhHNVVhWFJzWlVKaGNpQTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpZEdsMGJHVXRZbUZ5WENJK1hHNGdJQ0FnSUNBZ0lIdDBhR2x6TG5CeWIzQnpMbU5vYVd4a2NtVnVmVnh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdWR2wwYkdWQ1lYSTdYRzRpWFgwPSIsIi8qKlxuICogQGpzeCBSZWFjdC5ET01cbiAqL1xuXG52YXIgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgVG9wQmFyO1xuXG5Ub3BCYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiVG9wQmFyXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiZGV2aWNlLWJhclwifSwgXG4gICAgICAgIFwiU2FmZXR5TW9tZW50dW0uY29tXCJcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUb3BCYXI7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOTBiM0JmWW1GeUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NTMEZCU3l4TFFVRkxMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU12UWl4SlFVRkpMRTFCUVUwc1EwRkJRenM3UVVGRldDdzBRa0ZCTkVJc2MwSkJRVUU3UlVGRE1VSXNUVUZCVFN4RlFVRkZMRmxCUVZrN1NVRkRiRUk3VFVGRFJTeHZRa0ZCUVN4TFFVRkpMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZsQlFXRXNRMEZCUVN4RlFVRkJPMEZCUVVFc1VVRkJRU3h2UWtGQlFUdEJRVUZCTEUxQlJYUkNMRU5CUVVFN1RVRkRUanRIUVVOSU8wRkJRMGdzUTBGQlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eE5RVUZOTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2S2lwY2JpQXFJRUJxYzNnZ1VtVmhZM1F1UkU5TlhHNGdLaTljYmx4dWRtRnlJRkpsWVdOMElDQWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDY3BPMXh1ZG1GeUlGUnZjRUpoY2p0Y2JseHVWRzl3UW1GeUlEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnUEdScGRpQmpiR0Z6YzA1aGJXVTlYQ0prWlhacFkyVXRZbUZ5WENJK1hHNGdJQ0FnSUNBZ0lGTmhabVYwZVUxdmJXVnVkSFZ0TG1OdmJWeHVJQ0FnSUNBZ1BDOWthWFkrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZHOXdRbUZ5TzF4dUlsMTkiLCIvKipcbiAqIEBqc3ggUmVhY3QuRE9NXG4gKi9cblxudmFyIFZpZXc7XG52YXIgUmVhY3QgICAgICAgICA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgTWFpblZpZXcgICAgICA9IHJlcXVpcmUoJy4vbWFpbl92aWV3LmpzeCcpO1xudmFyIHN0b3JlICAgICAgICAgPSByZXF1aXJlKCcuL3N0b3JlJyk7XG52YXIgbGlzdF9zdG9yZSAgICA9IHJlcXVpcmUoJy4vbGlzdF9zdG9yZScpO1xuXG5WaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlZpZXdcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFzeW5jOiAgZmFsc2UsXG4gICAgICBtb21lbnQ6IG51bGxcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHN0b3JlLm9uKCdjaGFuZ2U6bW9tZW50JywgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5nZXRNb21lbnQoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHN0b3JlLm9mZignY2hhbmdlJyk7XG4gIH0sXG4gIGdldE1vbWVudDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBjaG9pY2UgPSBzdG9yZS5nZXQoJ21vbWVudCcpO1xuICAgIHZhciBtb21lbnQgPSBsaXN0X3N0b3JlLmdldChjaG9pY2UpO1xuXG4gICAgaWYgKCEgbW9tZW50KSB7XG4gICAgICBtb21lbnQgPSBsaXN0X3N0b3JlLmFkZCh7aWQ6IGNob2ljZX0pO1xuXG4gICAgICB0aGlzLnNldFN0YXRlKHthc3luYzogdHJ1ZX0pO1xuXG4gICAgICByZXR1cm4gbW9tZW50LmZldGNoKHtzdWNjZXNzOiB0aGlzLmNob29zZU1vbWVudC5iaW5kKHRoaXMpfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jaG9vc2VNb21lbnQobW9tZW50KTtcbiAgfSxcbiAgY2hvb3NlTW9tZW50OiBmdW5jdGlvbiAobW9tZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhc3luYzogZmFsc2UsXG4gICAgICBtb21lbnQ6IG1vbWVudFxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvcHMgPSAodGhpcy5zdGF0ZS5tb21lbnQgJiYgdGhpcy5zdGF0ZS5tb21lbnQudG9KU09OKCkpIHx8IHt9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFpblZpZXcsIFJlYWN0Ll9fc3ByZWFkKHt9LCAgcHJvcHMpKVxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5aWNtbGhibUpzYjJOclpYSXZSR1YyWld4dmNHMWxiblF2UjBsVUwybDNjeTF4ZFdsamF5MXpkSGxzWlMxbmRXbGtaUzl6WTNKcGNIUnpMM05oWm1WMGVTOTJhV1YzTG1wemVDSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHM3UVVGRlFTeEhRVUZIT3p0QlFVVklMRWxCUVVrc1NVRkJTU3hEUVVGRE8wRkJRMVFzU1VGQlNTeExRVUZMTEZkQlFWY3NUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRM0pETEVsQlFVa3NVVUZCVVN4UlFVRlJMRTlCUVU4c1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMEZCUXk5RExFbEJRVWtzUzBGQlN5eFhRVUZYTEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVOMlF5eEpRVUZKTEZWQlFWVXNUVUZCVFN4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03TzBGQlJUVkRMREJDUVVFd1FpeHZRa0ZCUVR0RlFVTjRRaXhsUVVGbExFVkJRVVVzV1VGQldUdEpRVU16UWl4UFFVRlBPMDFCUTB3c1MwRkJTeXhIUVVGSExFdEJRVXM3VFVGRFlpeE5RVUZOTEVWQlFVVXNTVUZCU1R0TFFVTmlMRU5CUVVNN1IwRkRTRHRGUVVORUxHbENRVUZwUWl4RlFVRkZMRmxCUVZrN1NVRkROMElzUzBGQlN5eERRVUZETEVWQlFVVXNRMEZCUXl4bFFVRmxMRVZCUVVVc1dVRkJXVHROUVVOd1F5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RlFVRkZMRU5CUVVNN1MwRkRiRUlzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVObU8wVkJRMFFzYjBKQlFXOUNMRVZCUVVVc1dVRkJXVHRKUVVOb1F5eExRVUZMTEVOQlFVTXNSMEZCUnl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wZEJRM0pDTzBWQlEwUXNVMEZCVXl4RlFVRkZMRmxCUVZrN1NVRkRja0lzU1VGQlNTeE5RVUZOTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU55UXl4SlFVRkpMRWxCUVVrc1RVRkJUU3hIUVVGSExGVkJRVlVzUTBGQlF5eEhRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN08wbEJSWEJETEVsQlFVa3NSVUZCUlN4TlFVRk5MRVZCUVVVN1FVRkRiRUlzVFVGQlRTeE5RVUZOTEVkQlFVY3NWVUZCVlN4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFVkJRVVVzUlVGQlJTeE5RVUZOTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVVMVF5eE5RVUZOTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhMUVVGTExFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXpzN1RVRkZOMElzVDBGQlR5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1QwRkJUeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU51UlN4TFFVRkxPenRKUVVWRUxFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1IwRkRNMEk3UlVGRFJDeFpRVUZaTEVWQlFVVXNWVUZCVlN4TlFVRk5MRVZCUVVVN1NVRkRPVUlzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXp0TlFVTmFMRXRCUVVzc1JVRkJSU3hMUVVGTE8wMUJRMW9zVFVGQlRTeEZRVUZGTEUxQlFVMDdTMEZEWml4RFFVRkRMRU5CUVVNN1IwRkRTanRGUVVORUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBGQlEzUkNMRWxCUVVrc1NVRkJTU3hMUVVGTExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1NVRkJTU3hKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNRMEZCUXl4TlFVRk5MRVZCUVVVc1MwRkJTeXhGUVVGRkxFTkJRVU03TzBsQlJYQkZPMDFCUTBVc2IwSkJRVU1zVVVGQlVTeEZRVUZCTEdkQ1FVRkJMRWRCUVVFc1EwRkJSU3hIUVVGSExFdEJRVTBzUTBGQlFTeERRVUZITEVOQlFVRTdUVUZEZGtJN1IwRkRTRHRCUVVOSUxFTkJRVU1zUTBGQlF5eERRVUZET3p0QlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b3FYRzRnS2lCQWFuTjRJRkpsWVdOMExrUlBUVnh1SUNvdlhHNWNiblpoY2lCV2FXVjNPMXh1ZG1GeUlGSmxZV04wSUNBZ0lDQWdJQ0FnUFNCeVpYRjFhWEpsS0NkeVpXRmpkQ2NwTzF4dWRtRnlJRTFoYVc1V2FXVjNJQ0FnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMMjFoYVc1ZmRtbGxkeTVxYzNnbktUdGNiblpoY2lCemRHOXlaU0FnSUNBZ0lDQWdJRDBnY21WeGRXbHlaU2duTGk5emRHOXlaU2NwTzF4dWRtRnlJR3hwYzNSZmMzUnZjbVVnSUNBZ1BTQnlaWEYxYVhKbEtDY3VMMnhwYzNSZmMzUnZjbVVuS1R0Y2JseHVWbWxsZHlBOUlGSmxZV04wTG1OeVpXRjBaVU5zWVhOektIdGNiaUFnWjJWMFNXNXBkR2xoYkZOMFlYUmxPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSHRjYmlBZ0lDQWdJR0Z6ZVc1ak9pQWdabUZzYzJVc1hHNGdJQ0FnSUNCdGIyMWxiblE2SUc1MWJHeGNiaUFnSUNCOU8xeHVJQ0I5TEZ4dUlDQmpiMjF3YjI1bGJuUkVhV1JOYjNWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSE4wYjNKbExtOXVLQ2RqYUdGdVoyVTZiVzl0Wlc1MEp5d2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NW5aWFJOYjIxbGJuUW9LVHRjYmlBZ0lDQjlMbUpwYm1Rb2RHaHBjeWtwTzF4dUlDQjlMRnh1SUNCamIyMXdiMjVsYm5SWGFXeHNWVzV0YjNWdWREb2dablZ1WTNScGIyNGdLQ2tnZTF4dUlDQWdJSE4wYjNKbExtOW1aaWduWTJoaGJtZGxKeWs3WEc0Z0lIMHNYRzRnSUdkbGRFMXZiV1Z1ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lIWmhjaUJqYUc5cFkyVWdQU0J6ZEc5eVpTNW5aWFFvSjIxdmJXVnVkQ2NwTzF4dUlDQWdJSFpoY2lCdGIyMWxiblFnUFNCc2FYTjBYM04wYjNKbExtZGxkQ2hqYUc5cFkyVXBPMXh1WEc0Z0lDQWdhV1lnS0NFZ2JXOXRaVzUwS1NCN1hHNGdJQ0FnSUNCdGIyMWxiblFnUFNCc2FYTjBYM04wYjNKbExtRmtaQ2g3YVdRNklHTm9iMmxqWlgwcE8xeHVYRzRnSUNBZ0lDQjBhR2x6TG5ObGRGTjBZWFJsS0h0aGMzbHVZem9nZEhKMVpYMHBPMXh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdiVzl0Wlc1MExtWmxkR05vS0h0emRXTmpaWE56T2lCMGFHbHpMbU5vYjI5elpVMXZiV1Z1ZEM1aWFXNWtLSFJvYVhNcGZTazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVqYUc5dmMyVk5iMjFsYm5Rb2JXOXRaVzUwS1R0Y2JpQWdmU3hjYmlBZ1kyaHZiM05sVFc5dFpXNTBPaUJtZFc1amRHbHZiaUFvYlc5dFpXNTBLU0I3WEc0Z0lDQWdkR2hwY3k1elpYUlRkR0YwWlNoN1hHNGdJQ0FnSUNCaGMzbHVZem9nWm1Gc2MyVXNYRzRnSUNBZ0lDQnRiMjFsYm5RNklHMXZiV1Z1ZEZ4dUlDQWdJSDBwTzF4dUlDQjlMRnh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCMllYSWdjSEp2Y0hNZ1BTQW9kR2hwY3k1emRHRjBaUzV0YjIxbGJuUWdKaVlnZEdocGN5NXpkR0YwWlM1dGIyMWxiblF1ZEc5S1UwOU9LQ2twSUh4OElIdDlPMXh1WEc0Z0lDQWdjbVYwZFhKdUlDaGNiaUFnSUNBZ0lEeE5ZV2x1Vm1sbGR5QjdMaTR1Y0hKdmNITjlJQzgrWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVmU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZtbGxkenRjYmlKZGZRPT0iXX0=
