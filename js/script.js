// Generated by CoffeeScript 1.6.3
(function() {
  var ImageLayer, Layer, PositionLayer, TranslationLayer, World, easeOutQuart, easing, world, _ref, _ref1, _ref2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Layer = (function() {
    function Layer(element, options) {
      this.update = __bind(this.update, this);
      var defaults;
      defaults = {
        x: 0.0,
        k: 100.0,
        offset: 0.0
      };
      options = $.extend(defaults, options);
      this.$el = $(element);
      this.el = this.$el[0];
      this.width = this.$el.outerWidth();
      this.offset = options.offset;
      this.k = options.k;
      this.x = options.x || this.offset;
      console.log(this.el.className, 'offset:', this.offset, 'k:', this.k, 'x:', this.x);
      this.initialize();
    }

    Layer.prototype.update = function(event, p) {
      var offset;
      offset = this.k * -p;
      if (Math.abs(offset - this.offset) >= 1) {
        this.offset = Math.floor(offset);
        return this.render();
      }
    };

    Layer.prototype.initialize = function() {
      "Initialize layer such as position and related styling etc.";
      throw Error('Not implemented');
    };

    Layer.prototype.render = function() {
      "Render updated layer position";
      throw Error('Not implemented');
    };

    return Layer;

  })();

  ImageLayer = (function(_super) {
    __extends(ImageLayer, _super);

    function ImageLayer() {
      _ref = ImageLayer.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ImageLayer.prototype.initialize = function() {
      this.$el.css({
        'background-size': "" + (this.$el.outerWidth() + this.k * 2.0) + "px auto"
      });
      return this.render();
    };

    ImageLayer.prototype.render = function() {
      return this.el.style.backgroundPosition = "" + (this.x + this.offset) + "px top";
    };

    return ImageLayer;

  })(Layer);

  PositionLayer = (function(_super) {
    __extends(PositionLayer, _super);

    function PositionLayer() {
      _ref1 = PositionLayer.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    PositionLayer.prototype.initialize = function() {
      return this.$el.css({
        left: "" + this.x + "px"
      });
    };

    PositionLayer.prototype.render = function() {
      return this.$el.css({
        left: "" + (this.x + this.offset) + "px"
      });
    };

    return PositionLayer;

  })(Layer);

  TranslationLayer = (function(_super) {
    __extends(TranslationLayer, _super);

    function TranslationLayer() {
      _ref2 = TranslationLayer.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    TranslationLayer.prototype.render = function() {
      return this.$el.css({
        'transform': "translate(" + this.offset + "px, 0)"
      });
    };

    return TranslationLayer;

  })(PositionLayer);

  World = (function() {
    function World(options) {
      this.mousemove = __bind(this.mousemove, this);
      this.page = {
        width: $('body').outerWidth()
      };
      this.parallax = {
        width: this.page.width * 0.6
      };
      this.layers = [];
      this.mouse = {
        x: void 0
      };
      this.$document = $(document);
      this.$document.on('mousemove', this.mousemove);
    }

    World.prototype.addLayer = function(layer) {
      this.layers.push(layer);
      return this.$document.on('world:changed', layer.update);
    };

    World.prototype.mousemove = function(event) {
      var p, pEased, x;
      x = event.pageX;
      if (this.mouse.x === void 0) {
        this.mouse.x = x;
      } else if (Math.abs(x - this.mouse.x) < 1.0) {
        return;
      } else {
        this.mouse.x = x;
      }
      p = Math.min(+1.0, Math.max(-1.0, (this.mouse.x - this.page.width / 2) / this.parallax.width * 2));
      pEased = (p / Math.abs(p)) * easing(Math.abs(p));
      return this.$document.trigger('world:changed', [pEased]);
    };

    return World;

  })();

  easeOutQuart = function(d) {
    return function(t) {
      return -(Math.pow(t / d - 1, 4) - 1);
    };
  };

  easing = easeOutQuart(1.8);

  world = new World;

  world.addLayer(new ImageLayer('.background', {
    x: -20.0,
    k: 20.0
  }));

  world.addLayer(new TranslationLayer('.content', {
    k: 40.0
  }));

  world.addLayer(new TranslationLayer('.contact', {
    x: -200.0,
    k: 200.0
  }));

  world.addLayer(new TranslationLayer('.projects', {
    x: world.page.width,
    k: 200.0
  }));

}).call(this);
