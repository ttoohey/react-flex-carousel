'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Carousel = function (_Component) {
	_inherits(Carousel, _Component);

	function Carousel(props) {
		_classCallCheck(this, Carousel);

		var _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

		_this.state = { slide: 1, dragging: null, sliding: false, offset: 0 }; // slide index start from 1
		_this.setTimer = _this.setTimer.bind(_this);
		_this.clearTimer = _this.clearTimer.bind(_this);
		_this.events = {
			onTouchStart: _this.onDraggingStart.bind(_this),
			onTouchMove: _this.onDraggingMove.bind(_this),
			onTouchEnd: _this.onDraggingEnd.bind(_this),
			onTouchCancel: _this.onDraggingEnd.bind(_this),
			onClick: _this.onClick.bind(_this),
			onTransitionEnd: _this.onTransitionEnd.bind(_this)
		};
		return _this;
	}

	_createClass(Carousel, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setTimer();
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this.clearTimer();
		}
	}, {
		key: 'onTransitionEnd',
		value: function onTransitionEnd() {
			var _this2 = this;

			// this will not be triggered when document.hidden
			var slide = this.state.slide;

			var count = _react.Children.count(this.props.children);
			if (slide == count + 1) slide = 1;
			if (slide == 0) slide = count;
			this.setState({ slide: slide, sliding: false }, function () {
				_this2.setTimer();
				_this2.props.slideDidChange && _this2.props.slideDidChange(slide);
			});
		}
	}, {
		key: 'setTimer',
		value: function setTimer() {
			var interval = this.props.autoPlayInterval;
			if (_react.Children.count(this.props.children) > 1 && interval > 0) {
				this.clearTimer();
				this.timer = window.setInterval(this.changeSlide.bind(this, this.state.slide + 1), interval);
			}
		}
	}, {
		key: 'clearTimer',
		value: function clearTimer() {
			window.clearInterval(this.timer);
		}
	}, {
		key: 'changeSlide',
		value: function changeSlide(slide) {
			if (document.hidden) return; // run only when page is visible
			if (this.props.slideWillChange && !this.props.slideWillChange(slide, this.state.slide)) return;
			if (slide >= 0 && slide <= _react2.default.Children.count(this.props.children) + 1) this.setState({ slide: slide, sliding: true, dragging: null }, this.setTimer);
		}
	}, {
		key: 'onDraggingStart',
		value: function onDraggingStart(event) {
			if (event.touches) this.setState({ dragging: {
					x: event.touches[0].pageX,
					y: event.touches[0].pageY
				}, offset: 0 });
		}
	}, {
		key: 'onDraggingMove',
		value: function onDraggingMove(event) {
			var _state = this.state,
			    sliding = _state.sliding,
			    dragging = _state.dragging;

			if (sliding || !dragging || !event.touches) return;
			var x = event.touches[0].pageX;
			var y = event.touches[0].pageY;
			var offset = x - dragging.x;
			if (Math.abs(y - dragging.y) < Math.abs(offset)) event.preventDefault();
			this.setState({ offset: offset });
		}
	}, {
		key: 'onDraggingEnd',
		value: function onDraggingEnd(event) {
			var _state2 = this.state,
			    slide = _state2.slide,
			    offset = _state2.offset,
			    dragging = _state2.dragging;

			if (!dragging) return;
			var target = Math.abs(offset) > this.slider.clientWidth / 5 ? offset > 0 ? slide - 1 : slide + 1 : slide;
			this.setState({ dragging: null }, this.changeSlide.bind(this, target));
		}
	}, {
		key: 'onClick',
		value: function onClick(event) {
			if (Math.abs(this.state.offset) < 25) return; // trigger click in a small distance
			event.preventDefault();
			event.stopPropagation();
			event.nativeEvent.stopPropagation();
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var _props = this.props,
			    children = _props.children,
			    switcher = _props.switcher,
			    indicator = _props.indicator,
			    transitionDuration = _props.transitionDuration,
			    transitionTimingFunction = _props.transitionTimingFunction,
			    slideWillChange = _props.slideWillChange,
			    slideDidChange = _props.slideDidChange;

			var props = Object.assign({}, this.props); // rest parameters is not available before node 8
			delete props.children;
			delete props.autoPlayInterval;
			delete props.switcher;
			delete props.indicator;
			delete props.transitionDuration;
			delete props.transitionTimingFunction;
			delete props.slideWillChange;
			delete props.slideDidChange;
			var _state3 = this.state,
			    slide = _state3.slide,
			    sliding = _state3.sliding,
			    dragging = _state3.dragging,
			    offset = _state3.offset;

			var slides = _react.Children.map(children, function (child) {
				return _react2.default.cloneElement(child, { key: child.key + '_clone' });
			});
			var count = _react.Children.count(children);
			var enabled = count > 1;
			var goPrevSlide = this.changeSlide.bind(this, slide - 1);
			var goNextSlide = this.changeSlide.bind(this, slide + 1);
			var slideStyle = {
				flexBasis: '100%',
				flexShrink: 0
			};
			return _react2.default.createElement(
				'div',
				_extends({}, props, { style: Object.assign({}, props.style, {
						position: 'relative',
						overflowX: 'hidden',
						touchAction: 'pan-y pinch-zoom',
						willChange: 'transform'
					}) }),
				_react2.default.createElement(
					'ul',
					_extends({ ref: function ref(node) {
							_this3.slider = node;
						}, style: {
							listStyleType: 'none',
							padding: 0,
							margin: 0,
							display: 'flex',
							transitionProperty: sliding ? 'transform' : 'none',
							transform: enabled ? dragging && offset !== 0 ? 'translateX(calc(' + offset * 1 + 'px - ' + slide * 100 + '%))' : 'translateX(-' + slide * 100 + '%)' : null,
							transitionDuration: transitionDuration,
							transitionTimingFunction: transitionTimingFunction
						} }, this.events),
					enabled && _react.Children.map(slides.slice(-1).concat(children, slides.slice(0, 1)), function (item, index) {
						return _react2.default.createElement(
							'li',
							{ 'aria-current': slide === index, style: slideStyle },
							item
						);
					}) || _react2.default.createElement(
						'li',
						null,
						children
					)
				),
				enabled && indicator && _react2.default.createElement(
					'ol',
					null,
					_react.Children.map(children, function (item, index) {
						return _react2.default.createElement(
							'li',
							{ 'aria-current': slide === index + 1, onClick: _this3.changeSlide.bind(_this3, index + 1) },
							index
						);
					})
				),
				enabled && switcher && _react2.default.createElement(
					'div',
					null,
					_react2.default.createElement('button', { type: 'button', className: 'prev', onClick: goPrevSlide }),
					_react2.default.createElement('button', { type: 'button', className: 'next', onClick: goNextSlide })
				)
			);
		}
	}]);

	return Carousel;
}(_react.Component);

Carousel.propTypes = {
	className: _propTypes2.default.string,
	autoPlayInterval: _propTypes2.default.number,
	transitionDuration: _propTypes2.default.string,
	transitionTimingFunction: _propTypes2.default.string,
	switcher: _propTypes2.default.bool,
	indicator: _propTypes2.default.bool,
	slideWillChange: _propTypes2.default.func,
	slideDidChange: _propTypes2.default.func,
	children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node]).isRequired
};

Carousel.defaultProps = {
	className: 'slider',
	transitionDuration: '.8s',
	transitionTimingFunction: 'ease-in-out'
};

exports.default = Carousel;

