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