/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   popperGenerator: () => (/* binding */ popperGenerator)
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element, strategy) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");








function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getViewportRect(element, strategy) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isLayoutViewport)
/* harmony export */ });
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: () => (/* binding */ afterMain),
/* harmony export */   afterRead: () => (/* binding */ afterRead),
/* harmony export */   afterWrite: () => (/* binding */ afterWrite),
/* harmony export */   auto: () => (/* binding */ auto),
/* harmony export */   basePlacements: () => (/* binding */ basePlacements),
/* harmony export */   beforeMain: () => (/* binding */ beforeMain),
/* harmony export */   beforeRead: () => (/* binding */ beforeRead),
/* harmony export */   beforeWrite: () => (/* binding */ beforeWrite),
/* harmony export */   bottom: () => (/* binding */ bottom),
/* harmony export */   clippingParents: () => (/* binding */ clippingParents),
/* harmony export */   end: () => (/* binding */ end),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   main: () => (/* binding */ main),
/* harmony export */   modifierPhases: () => (/* binding */ modifierPhases),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   popper: () => (/* binding */ popper),
/* harmony export */   read: () => (/* binding */ read),
/* harmony export */   reference: () => (/* binding */ reference),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   top: () => (/* binding */ top),
/* harmony export */   variationPlacements: () => (/* binding */ variationPlacements),
/* harmony export */   viewport: () => (/* binding */ viewport),
/* harmony export */   write: () => (/* binding */ write)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");








 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__["default"])(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   mapToStyles: () => (/* binding */ mapToStyles)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   arrow: () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   computeStyles: () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   flip: () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   hide: () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   offset: () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   distanceAndSkiddingToXY: () => (/* binding */ distanceAndSkiddingToXY)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   round: () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUAString)
/* harmony export */ });
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   within: () => (/* binding */ within),
/* harmony export */   withinMaxClamp: () => (/* binding */ withinMaxClamp)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/chosen-js/chosen.jquery.js":
/*!*************************************************!*\
  !*** ./node_modules/chosen-js/chosen.jquery.js ***!
  \*************************************************/
/***/ (function() {

(function() {
  var $, AbstractChosen, Chosen, SelectParser,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, i, len, option, ref, results1;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        title: group.title ? group.title : void 0,
        children: 0,
        disabled: group.disabled,
        classes: group.className
      });
      ref = group.childNodes;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        results1.push(this.add_option(option, group_position, group.disabled));
      }
      return results1;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            title: option.title ? option.title : void 0,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            group_label: group_position != null ? this.parsed[group_position].label : null,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, i, len, parser, ref;
    parser = new SelectParser();
    ref = select.childNodes;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options1) {
      this.form_field = form_field;
      this.options = options1 != null ? options1 : {};
      this.label_click_handler = bind(this.label_click_handler, this);
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.on_ready();
    }

    AbstractChosen.prototype.set_default_values = function() {
      this.click_test_action = (function(_this) {
        return function(evt) {
          return _this.test_active_click(evt);
        };
      })(this);
      this.activate_action = (function(_this) {
        return function(evt) {
          return _this.activate_field(evt);
        };
      })(this);
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.is_rtl = this.options.rtl || /\bchosen-rtl\b/.test(this.form_field.className);
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
      this.include_group_label_in_selected = this.options.include_group_label_in_selected || false;
      this.max_shown_results = this.options.max_shown_results || Number.POSITIVE_INFINITY;
      this.case_sensitive_search = this.options.case_sensitive_search || false;
      return this.hide_results_on_select = this.options.hide_results_on_select != null ? this.options.hide_results_on_select : true;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      this.default_text = this.escape_html(this.default_text);
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.choice_label = function(item) {
      if (this.include_group_label_in_selected && (item.group_label != null)) {
        return "<b class='group-name'>" + (this.escape_html(item.group_label)) + "</b>" + item.html;
      } else {
        return item.html;
      }
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout(((function(_this) {
            return function() {
              return _this.container_mousedown();
            };
          })(this)), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout(((function(_this) {
          return function() {
            return _this.blur_test();
          };
        })(this)), 100);
      }
    };

    AbstractChosen.prototype.label_click_handler = function(evt) {
      if (this.is_multiple) {
        return this.container_mousedown(evt);
      } else {
        return this.activate_field();
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, data_content, i, len, ref, shown_results;
      content = '';
      shown_results = 0;
      ref = this.results_data;
      for (i = 0, len = ref.length; i < len; i++) {
        data = ref[i];
        data_content = '';
        if (data.group) {
          data_content = this.result_add_group(data);
        } else {
          data_content = this.result_add_option(data);
        }
        if (data_content !== '') {
          shown_results++;
          content += data_content;
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(this.choice_label(data));
          }
        }
        if (shown_results >= this.max_shown_results) {
          break;
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      if (option.style) {
        option_el.style.cssText = option.style;
      }
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.highlighted_html || option.html;
      if (option.title) {
        option_el.title = option.title;
      }
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      var classes, group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      classes = [];
      classes.push("group-result");
      if (group.classes) {
        classes.push(group.classes);
      }
      group_el = document.createElement("li");
      group_el.className = classes.join(" ");
      group_el.innerHTML = group.highlighted_html || this.escape_html(group.label);
      if (group.title) {
        group_el.title = group.title;
      }
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function() {
      var i, len, ref, result, results1;
      ref = this.results_data;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        result = ref[i];
        if (result.selected) {
          results1.push(result.selected = false);
        } else {
          results1.push(void 0);
        }
      }
      return results1;
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function(options) {
      var escapedQuery, fix, i, len, option, prefix, query, ref, regex, results, results_group, search_match, startpos, suffix, text;
      this.no_results_clear();
      results = 0;
      query = this.get_search_text();
      escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      regex = this.get_search_regex(escapedQuery);
      ref = this.results_data;
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        option.search_match = false;
        results_group = null;
        search_match = null;
        option.highlighted_html = '';
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          text = option.group ? option.label : option.text;
          if (!(option.group && !this.group_search)) {
            search_match = this.search_string_match(text, regex);
            option.search_match = search_match != null;
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (query.length) {
                startpos = search_match.index;
                prefix = text.slice(0, startpos);
                fix = text.slice(startpos, startpos + query.length);
                suffix = text.slice(startpos + query.length);
                option.highlighted_html = (this.escape_html(prefix)) + "<em>" + (this.escape_html(fix)) + "</em>" + (this.escape_html(suffix));
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && query.length) {
        this.update_results_content("");
        return this.no_results(query);
      } else {
        this.update_results_content(this.results_option_build());
        if (!(options != null ? options.skip_highlight : void 0)) {
          return this.winnow_results_set_highlight();
        }
      }
    };

    AbstractChosen.prototype.get_search_regex = function(escaped_search_string) {
      var regex_flag, regex_string;
      regex_string = this.search_contains ? escaped_search_string : "(^|\\s|\\b)" + escaped_search_string + "[^\\s]*";
      if (!(this.enable_split_word_search || this.search_contains)) {
        regex_string = "^" + regex_string;
      }
      regex_flag = this.case_sensitive_search ? "" : "i";
      return new RegExp(regex_string, regex_flag);
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var match;
      match = regex.exec(search_string);
      if (!this.search_contains && (match != null ? match[1] : void 0)) {
        match.index += 1;
      }
      return match;
    };

    AbstractChosen.prototype.choices_count = function() {
      var i, len, option, ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      ref = this.form_field.options;
      for (i = 0, len = ref.length; i < len; i++) {
        option = ref[i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      this.activate_field();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keydown_checker = function(evt) {
      var ref, stroke;
      stroke = (ref = evt.which) != null ? ref : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.get_search_field_value().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 27:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 32:
          if (this.disable_search) {
            evt.preventDefault();
          }
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var ref, stroke;
      stroke = (ref = evt.which) != null ? ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          break;
        case 9:
        case 16:
        case 17:
        case 18:
        case 38:
        case 40:
        case 91:
          break;
        default:
          this.results_search();
          break;
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function(evt) {
      if (this.is_disabled) {
        return;
      }
      return setTimeout(((function(_this) {
        return function() {
          return _this.results_search();
        };
      })(this)), 50);
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function(evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function(evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function(evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function(element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.prototype.get_single_html = function() {
      return "<a class=\"chosen-single chosen-default\">\n  <span>" + this.default_text + "</span>\n  <div><b></b></div>\n</a>\n<div class=\"chosen-drop\">\n  <div class=\"chosen-search\">\n    <input class=\"chosen-search-input\" type=\"text\" autocomplete=\"off\" />\n  </div>\n  <ul class=\"chosen-results\"></ul>\n</div>";
    };

    AbstractChosen.prototype.get_multi_html = function() {
      return "<ul class=\"chosen-choices\">\n  <li class=\"search-field\">\n    <input class=\"chosen-search-input\" type=\"text\" autocomplete=\"off\" value=\"" + this.default_text + "\" />\n  </li>\n</ul>\n<div class=\"chosen-drop\">\n  <ul class=\"chosen-results\"></ul>\n</div>";
    };

    AbstractChosen.prototype.get_no_results_html = function(terms) {
      return "<li class=\"no-results\">\n  " + this.results_none_found + " <span>" + (this.escape_html(terms)) + "</span>\n</li>";
    };

    AbstractChosen.browser_is_supported = function() {
      if ("Microsoft Internet Explorer" === window.navigator.appName) {
        return document.documentMode >= 8;
      }
      if (/iP(od|hone)/i.test(window.navigator.userAgent) || /IEMobile/i.test(window.navigator.userAgent) || /Windows Phone/i.test(window.navigator.userAgent) || /BlackBerry/i.test(window.navigator.userAgent) || /BB10/i.test(window.navigator.userAgent) || /Android.*Mobile/i.test(window.navigator.userAgent)) {
        return false;
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy') {
          if (chosen instanceof Chosen) {
            chosen.destroy();
          }
          return;
        }
        if (!(chosen instanceof Chosen)) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(superClass) {
    extend(Chosen, superClass);

    function Chosen() {
      return Chosen.__super__.constructor.apply(this, arguments);
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      return this.current_selectedIndex = this.form_field.selectedIndex;
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      this.container.width(this.container_width());
      if (this.is_multiple) {
        this.container.html(this.get_multi_html());
      } else {
        this.container.html(this.get_single_html());
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      return this.set_label_behavior();
    };

    Chosen.prototype.on_ready = function() {
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      this.container.on('touchstart.chosen', (function(_this) {
        return function(evt) {
          _this.container_mousedown(evt);
        };
      })(this));
      this.container.on('touchend.chosen', (function(_this) {
        return function(evt) {
          _this.container_mouseup(evt);
        };
      })(this));
      this.container.on('mousedown.chosen', (function(_this) {
        return function(evt) {
          _this.container_mousedown(evt);
        };
      })(this));
      this.container.on('mouseup.chosen', (function(_this) {
        return function(evt) {
          _this.container_mouseup(evt);
        };
      })(this));
      this.container.on('mouseenter.chosen', (function(_this) {
        return function(evt) {
          _this.mouse_enter(evt);
        };
      })(this));
      this.container.on('mouseleave.chosen', (function(_this) {
        return function(evt) {
          _this.mouse_leave(evt);
        };
      })(this));
      this.search_results.on('mouseup.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_mouseup(evt);
        };
      })(this));
      this.search_results.on('mouseover.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_mouseover(evt);
        };
      })(this));
      this.search_results.on('mouseout.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_mouseout(evt);
        };
      })(this));
      this.search_results.on('mousewheel.chosen DOMMouseScroll.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_mousewheel(evt);
        };
      })(this));
      this.search_results.on('touchstart.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_touchstart(evt);
        };
      })(this));
      this.search_results.on('touchmove.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_touchmove(evt);
        };
      })(this));
      this.search_results.on('touchend.chosen', (function(_this) {
        return function(evt) {
          _this.search_results_touchend(evt);
        };
      })(this));
      this.form_field_jq.on("chosen:updated.chosen", (function(_this) {
        return function(evt) {
          _this.results_update_field(evt);
        };
      })(this));
      this.form_field_jq.on("chosen:activate.chosen", (function(_this) {
        return function(evt) {
          _this.activate_field(evt);
        };
      })(this));
      this.form_field_jq.on("chosen:open.chosen", (function(_this) {
        return function(evt) {
          _this.container_mousedown(evt);
        };
      })(this));
      this.form_field_jq.on("chosen:close.chosen", (function(_this) {
        return function(evt) {
          _this.close_field(evt);
        };
      })(this));
      this.search_field.on('blur.chosen', (function(_this) {
        return function(evt) {
          _this.input_blur(evt);
        };
      })(this));
      this.search_field.on('keyup.chosen', (function(_this) {
        return function(evt) {
          _this.keyup_checker(evt);
        };
      })(this));
      this.search_field.on('keydown.chosen', (function(_this) {
        return function(evt) {
          _this.keydown_checker(evt);
        };
      })(this));
      this.search_field.on('focus.chosen', (function(_this) {
        return function(evt) {
          _this.input_focus(evt);
        };
      })(this));
      this.search_field.on('cut.chosen', (function(_this) {
        return function(evt) {
          _this.clipboard_event_checker(evt);
        };
      })(this));
      this.search_field.on('paste.chosen', (function(_this) {
        return function(evt) {
          _this.clipboard_event_checker(evt);
        };
      })(this));
      if (this.is_multiple) {
        return this.search_choices.on('click.chosen', (function(_this) {
          return function(evt) {
            _this.choices_click(evt);
          };
        })(this));
      } else {
        return this.container.on('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(this.container[0].ownerDocument).off('click.chosen', this.click_test_action);
      if (this.form_field_label.length > 0) {
        this.form_field_label.off('click.chosen');
      }
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field.disabled || this.form_field_jq.parents('fieldset').is(':disabled');
      this.container.toggleClass('chosen-disabled', this.is_disabled);
      this.search_field[0].disabled = this.is_disabled;
      if (!this.is_multiple) {
        this.selected_item.off('focus.chosen', this.activate_field);
      }
      if (this.is_disabled) {
        return this.close_field();
      } else if (!this.is_multiple) {
        return this.selected_item.on('focus.chosen', this.activate_field);
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      var ref;
      if (this.is_disabled) {
        return;
      }
      if (evt && ((ref = evt.type) === 'mousedown' || ref === 'touchstart') && !this.results_showing) {
        evt.preventDefault();
      }
      if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
        if (!this.active_field) {
          if (this.is_multiple) {
            this.search_field.val("");
          }
          $(this.container[0].ownerDocument).on('click.chosen', this.click_test_action);
          this.results_show();
        } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
          evt.preventDefault();
          this.results_toggle();
        }
        return this.activate_field();
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta;
      if (evt.originalEvent) {
        delta = evt.originalEvent.deltaY || -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(this.container[0].ownerDocument).off("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      this.search_field_scale();
      return this.search_field.blur();
    };

    Chosen.prototype.activate_field = function() {
      if (this.is_disabled) {
        return;
      }
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      var active_container;
      active_container = $(evt.target).closest('.chosen-container');
      if (active_container.length && this.container[0] === active_container[0]) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chosen-with-drop");
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.get_search_field_value());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.on('click.chosen', this.label_click_handler);
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result") || $(evt.target).parents('.active-result').first()) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + (this.choice_label(item)) + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.on('click.chosen', (function(_this) {
          return function(evt) {
            return _this.choice_destroy_link_click(evt);
          };
        })(this));
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        if (this.active_field) {
          this.search_field.focus();
        } else {
          this.show_search_field_default();
        }
        if (this.is_multiple && this.choices_count() > 0 && this.get_search_field_value().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.trigger_form_field_change();
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(this.choice_label(item));
        }
        if (this.is_multiple && (!this.hide_results_on_select || (evt.metaKey || evt.ctrlKey))) {
          if (evt.metaKey || evt.ctrlKey) {
            this.winnow_results({
              skip_highlight: true
            });
          } else {
            this.search_field.val("");
            this.winnow_results();
          }
        } else {
          this.results_hide();
          this.show_search_field_default();
        }
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.trigger_form_field_change({
            selected: this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        evt.preventDefault();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").html(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.trigger_form_field_change({
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_field_value = function() {
      return this.search_field.val();
    };

    Chosen.prototype.get_search_text = function() {
      return $.trim(this.get_search_field_value());
    };

    Chosen.prototype.escape_html = function(text) {
      return $('<div/>').text(text).html();
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = this.get_no_results_html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this
      });
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.search_field_scale = function() {
      var div, i, len, style, style_block, styles, width;
      if (!this.is_multiple) {
        return;
      }
      style_block = {
        position: 'absolute',
        left: '-1000px',
        top: '-1000px',
        display: 'none',
        whiteSpace: 'pre'
      };
      styles = ['fontSize', 'fontStyle', 'fontWeight', 'fontFamily', 'lineHeight', 'textTransform', 'letterSpacing'];
      for (i = 0, len = styles.length; i < len; i++) {
        style = styles[i];
        style_block[style] = this.search_field.css(style);
      }
      div = $('<div />').css(style_block);
      div.text(this.get_search_field_value());
      $('body').append(div);
      width = div.width() + 25;
      div.remove();
      if (this.container.is(':visible')) {
        width = Math.min(this.container.outerWidth() - 10, width);
      }
      return this.search_field.width(width);
    };

    Chosen.prototype.trigger_form_field_change = function(extra) {
      this.form_field_jq.trigger("input", extra);
      return this.form_field_jq.trigger("change", extra);
    };

    return Chosen;

  })(AbstractChosen);

}).call(this);


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/index.js":
/*!**************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _types_options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types/options */ "./node_modules/flatpickr/dist/esm/types/options.js");
/* harmony import */ var _l10n_default__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./l10n/default */ "./node_modules/flatpickr/dist/esm/l10n/default.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./node_modules/flatpickr/dist/esm/utils/index.js");
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/dom */ "./node_modules/flatpickr/dist/esm/utils/dom.js");
/* harmony import */ var _utils_dates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/dates */ "./node_modules/flatpickr/dist/esm/utils/dates.js");
/* harmony import */ var _utils_formatting__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/formatting */ "./node_modules/flatpickr/dist/esm/utils/formatting.js");
/* harmony import */ var _utils_polyfills__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/polyfills */ "./node_modules/flatpickr/dist/esm/utils/polyfills.js");
/* harmony import */ var _utils_polyfills__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_utils_polyfills__WEBPACK_IMPORTED_MODULE_6__);
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};







var DEBOUNCED_CHANGE_MS = 300;
function FlatpickrInstance(element, instanceConfig) {
    var self = {
        config: __assign(__assign({}, _types_options__WEBPACK_IMPORTED_MODULE_0__.defaults), flatpickr.defaultConfig),
        l10n: _l10n_default__WEBPACK_IMPORTED_MODULE_1__["default"],
    };
    self.parseDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateParser)({ config: self.config, l10n: self.l10n });
    self._handlers = [];
    self.pluginElements = [];
    self.loadedPlugins = [];
    self._bind = bind;
    self._setHoursFromDate = setHoursFromDate;
    self._positionCalendar = positionCalendar;
    self.changeMonth = changeMonth;
    self.changeYear = changeYear;
    self.clear = clear;
    self.close = close;
    self.onMouseOver = onMouseOver;
    self._createElement = _utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement;
    self.createDay = createDay;
    self.destroy = destroy;
    self.isEnabled = isEnabled;
    self.jumpToDate = jumpToDate;
    self.updateValue = updateValue;
    self.open = open;
    self.redraw = redraw;
    self.set = set;
    self.setDate = setDate;
    self.toggle = toggle;
    function setupHelperFunctions() {
        self.utils = {
            getDaysInMonth: function (month, yr) {
                if (month === void 0) { month = self.currentMonth; }
                if (yr === void 0) { yr = self.currentYear; }
                if (month === 1 && ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0))
                    return 29;
                return self.l10n.daysInMonth[month];
            },
        };
    }
    function init() {
        self.element = self.input = element;
        self.isOpen = false;
        parseConfig();
        setupLocale();
        setupInputs();
        setupDates();
        setupHelperFunctions();
        if (!self.isMobile)
            build();
        bindEvents();
        if (self.selectedDates.length || self.config.noCalendar) {
            if (self.config.enableTime) {
                setHoursFromDate(self.config.noCalendar ? self.latestSelectedDateObj : undefined);
            }
            updateValue(false);
        }
        setCalendarWidth();
        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (!self.isMobile && isSafari) {
            positionCalendar();
        }
        triggerEvent("onReady");
    }
    function getClosestActiveElement() {
        var _a;
        return (((_a = self.calendarContainer) === null || _a === void 0 ? void 0 : _a.getRootNode())
            .activeElement || document.activeElement);
    }
    function bindToInstance(fn) {
        return fn.bind(self);
    }
    function setCalendarWidth() {
        var config = self.config;
        if (config.weekNumbers === false && config.showMonths === 1) {
            return;
        }
        else if (config.noCalendar !== true) {
            window.requestAnimationFrame(function () {
                if (self.calendarContainer !== undefined) {
                    self.calendarContainer.style.visibility = "hidden";
                    self.calendarContainer.style.display = "block";
                }
                if (self.daysContainer !== undefined) {
                    var daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
                    self.daysContainer.style.width = daysWidth + "px";
                    self.calendarContainer.style.width =
                        daysWidth +
                            (self.weekWrapper !== undefined
                                ? self.weekWrapper.offsetWidth
                                : 0) +
                            "px";
                    self.calendarContainer.style.removeProperty("visibility");
                    self.calendarContainer.style.removeProperty("display");
                }
            });
        }
    }
    function updateTime(e) {
        if (self.selectedDates.length === 0) {
            var defaultDate = self.config.minDate === undefined ||
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(new Date(), self.config.minDate) >= 0
                ? new Date()
                : new Date(self.config.minDate.getTime());
            var defaults = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.getDefaultHours)(self.config);
            defaultDate.setHours(defaults.hours, defaults.minutes, defaults.seconds, defaultDate.getMilliseconds());
            self.selectedDates = [defaultDate];
            self.latestSelectedDateObj = defaultDate;
        }
        if (e !== undefined && e.type !== "blur") {
            timeWrapper(e);
        }
        var prevValue = self._input.value;
        setHoursFromInputs();
        updateValue();
        if (self._input.value !== prevValue) {
            self._debouncedChange();
        }
    }
    function ampm2military(hour, amPM) {
        return (hour % 12) + 12 * (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(amPM === self.l10n.amPM[1]);
    }
    function military2ampm(hour) {
        switch (hour % 24) {
            case 0:
            case 12:
                return 12;
            default:
                return hour % 12;
        }
    }
    function setHoursFromInputs() {
        if (self.hourElement === undefined || self.minuteElement === undefined)
            return;
        var hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60, seconds = self.secondElement !== undefined
            ? (parseInt(self.secondElement.value, 10) || 0) % 60
            : 0;
        if (self.amPM !== undefined) {
            hours = ampm2military(hours, self.amPM.textContent);
        }
        var limitMinHours = self.config.minTime !== undefined ||
            (self.config.minDate &&
                self.minDateHasTime &&
                self.latestSelectedDateObj &&
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(self.latestSelectedDateObj, self.config.minDate, true) ===
                    0);
        var limitMaxHours = self.config.maxTime !== undefined ||
            (self.config.maxDate &&
                self.maxDateHasTime &&
                self.latestSelectedDateObj &&
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(self.latestSelectedDateObj, self.config.maxDate, true) ===
                    0);
        if (self.config.maxTime !== undefined &&
            self.config.minTime !== undefined &&
            self.config.minTime > self.config.maxTime) {
            var minBound = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.calculateSecondsSinceMidnight)(self.config.minTime.getHours(), self.config.minTime.getMinutes(), self.config.minTime.getSeconds());
            var maxBound = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.calculateSecondsSinceMidnight)(self.config.maxTime.getHours(), self.config.maxTime.getMinutes(), self.config.maxTime.getSeconds());
            var currentTime = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.calculateSecondsSinceMidnight)(hours, minutes, seconds);
            if (currentTime > maxBound && currentTime < minBound) {
                var result = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.parseSeconds)(minBound);
                hours = result[0];
                minutes = result[1];
                seconds = result[2];
            }
        }
        else {
            if (limitMaxHours) {
                var maxTime = self.config.maxTime !== undefined
                    ? self.config.maxTime
                    : self.config.maxDate;
                hours = Math.min(hours, maxTime.getHours());
                if (hours === maxTime.getHours())
                    minutes = Math.min(minutes, maxTime.getMinutes());
                if (minutes === maxTime.getMinutes())
                    seconds = Math.min(seconds, maxTime.getSeconds());
            }
            if (limitMinHours) {
                var minTime = self.config.minTime !== undefined
                    ? self.config.minTime
                    : self.config.minDate;
                hours = Math.max(hours, minTime.getHours());
                if (hours === minTime.getHours() && minutes < minTime.getMinutes())
                    minutes = minTime.getMinutes();
                if (minutes === minTime.getMinutes())
                    seconds = Math.max(seconds, minTime.getSeconds());
            }
        }
        setHours(hours, minutes, seconds);
    }
    function setHoursFromDate(dateObj) {
        var date = dateObj || self.latestSelectedDateObj;
        if (date && date instanceof Date) {
            setHours(date.getHours(), date.getMinutes(), date.getSeconds());
        }
    }
    function setHours(hours, minutes, seconds) {
        if (self.latestSelectedDateObj !== undefined) {
            self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
        }
        if (!self.hourElement || !self.minuteElement || self.isMobile)
            return;
        self.hourElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(!self.config.time_24hr
            ? ((12 + hours) % 12) + 12 * (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(hours % 12 === 0)
            : hours);
        self.minuteElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(minutes);
        if (self.amPM !== undefined)
            self.amPM.textContent = self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(hours >= 12)];
        if (self.secondElement !== undefined)
            self.secondElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(seconds);
    }
    function onYearInput(event) {
        var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(event);
        var year = parseInt(eventTarget.value) + (event.delta || 0);
        if (year / 1000 > 1 ||
            (event.key === "Enter" && !/[^\d]/.test(year.toString()))) {
            changeYear(year);
        }
    }
    function bind(element, event, handler, options) {
        if (event instanceof Array)
            return event.forEach(function (ev) { return bind(element, ev, handler, options); });
        if (element instanceof Array)
            return element.forEach(function (el) { return bind(el, event, handler, options); });
        element.addEventListener(event, handler, options);
        self._handlers.push({
            remove: function () { return element.removeEventListener(event, handler, options); },
        });
    }
    function triggerChange() {
        triggerEvent("onChange");
    }
    function bindEvents() {
        if (self.config.wrap) {
            ["open", "close", "toggle", "clear"].forEach(function (evt) {
                Array.prototype.forEach.call(self.element.querySelectorAll("[data-" + evt + "]"), function (el) {
                    return bind(el, "click", self[evt]);
                });
            });
        }
        if (self.isMobile) {
            setupMobile();
            return;
        }
        var debouncedResize = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.debounce)(onResize, 50);
        self._debouncedChange = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.debounce)(triggerChange, DEBOUNCED_CHANGE_MS);
        if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
            bind(self.daysContainer, "mouseover", function (e) {
                if (self.config.mode === "range")
                    onMouseOver((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e));
            });
        bind(self._input, "keydown", onKeyDown);
        if (self.calendarContainer !== undefined) {
            bind(self.calendarContainer, "keydown", onKeyDown);
        }
        if (!self.config.inline && !self.config.static)
            bind(window, "resize", debouncedResize);
        if (window.ontouchstart !== undefined)
            bind(window.document, "touchstart", documentClick);
        else
            bind(window.document, "mousedown", documentClick);
        bind(window.document, "focus", documentClick, { capture: true });
        if (self.config.clickOpens === true) {
            bind(self._input, "focus", self.open);
            bind(self._input, "click", self.open);
        }
        if (self.daysContainer !== undefined) {
            bind(self.monthNav, "click", onMonthNavClick);
            bind(self.monthNav, ["keyup", "increment"], onYearInput);
            bind(self.daysContainer, "click", selectDate);
        }
        if (self.timeContainer !== undefined &&
            self.minuteElement !== undefined &&
            self.hourElement !== undefined) {
            var selText = function (e) {
                return (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e).select();
            };
            bind(self.timeContainer, ["increment"], updateTime);
            bind(self.timeContainer, "blur", updateTime, { capture: true });
            bind(self.timeContainer, "click", timeIncrement);
            bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
            if (self.secondElement !== undefined)
                bind(self.secondElement, "focus", function () { return self.secondElement && self.secondElement.select(); });
            if (self.amPM !== undefined) {
                bind(self.amPM, "click", function (e) {
                    updateTime(e);
                });
            }
        }
        if (self.config.allowInput) {
            bind(self._input, "blur", onBlur);
        }
    }
    function jumpToDate(jumpDate, triggerChange) {
        var jumpTo = jumpDate !== undefined
            ? self.parseDate(jumpDate)
            : self.latestSelectedDateObj ||
                (self.config.minDate && self.config.minDate > self.now
                    ? self.config.minDate
                    : self.config.maxDate && self.config.maxDate < self.now
                        ? self.config.maxDate
                        : self.now);
        var oldYear = self.currentYear;
        var oldMonth = self.currentMonth;
        try {
            if (jumpTo !== undefined) {
                self.currentYear = jumpTo.getFullYear();
                self.currentMonth = jumpTo.getMonth();
            }
        }
        catch (e) {
            e.message = "Invalid date supplied: " + jumpTo;
            self.config.errorHandler(e);
        }
        if (triggerChange && self.currentYear !== oldYear) {
            triggerEvent("onYearChange");
            buildMonthSwitch();
        }
        if (triggerChange &&
            (self.currentYear !== oldYear || self.currentMonth !== oldMonth)) {
            triggerEvent("onMonthChange");
        }
        self.redraw();
    }
    function timeIncrement(e) {
        var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        if (~eventTarget.className.indexOf("arrow"))
            incrementNumInput(e, eventTarget.classList.contains("arrowUp") ? 1 : -1);
    }
    function incrementNumInput(e, delta, inputElem) {
        var target = e && (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        var input = inputElem ||
            (target && target.parentNode && target.parentNode.firstChild);
        var event = createEvent("increment");
        event.delta = delta;
        input && input.dispatchEvent(event);
    }
    function build() {
        var fragment = window.document.createDocumentFragment();
        self.calendarContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-calendar");
        self.calendarContainer.tabIndex = -1;
        if (!self.config.noCalendar) {
            fragment.appendChild(buildMonthNav());
            self.innerContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-innerContainer");
            if (self.config.weekNumbers) {
                var _a = buildWeeks(), weekWrapper = _a.weekWrapper, weekNumbers = _a.weekNumbers;
                self.innerContainer.appendChild(weekWrapper);
                self.weekNumbers = weekNumbers;
                self.weekWrapper = weekWrapper;
            }
            self.rContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-rContainer");
            self.rContainer.appendChild(buildWeekdays());
            if (!self.daysContainer) {
                self.daysContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-days");
                self.daysContainer.tabIndex = -1;
            }
            buildDays();
            self.rContainer.appendChild(self.daysContainer);
            self.innerContainer.appendChild(self.rContainer);
            fragment.appendChild(self.innerContainer);
        }
        if (self.config.enableTime) {
            fragment.appendChild(buildTime());
        }
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "rangeMode", self.config.mode === "range");
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "animate", self.config.animate === true);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
        self.calendarContainer.appendChild(fragment);
        var customAppend = self.config.appendTo !== undefined &&
            self.config.appendTo.nodeType !== undefined;
        if (self.config.inline || self.config.static) {
            self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
            if (self.config.inline) {
                if (!customAppend && self.element.parentNode)
                    self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
                else if (self.config.appendTo !== undefined)
                    self.config.appendTo.appendChild(self.calendarContainer);
            }
            if (self.config.static) {
                var wrapper = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-wrapper");
                if (self.element.parentNode)
                    self.element.parentNode.insertBefore(wrapper, self.element);
                wrapper.appendChild(self.element);
                if (self.altInput)
                    wrapper.appendChild(self.altInput);
                wrapper.appendChild(self.calendarContainer);
            }
        }
        if (!self.config.static && !self.config.inline)
            (self.config.appendTo !== undefined
                ? self.config.appendTo
                : window.document.body).appendChild(self.calendarContainer);
    }
    function createDay(className, date, _dayNumber, i) {
        var dateIsEnabled = isEnabled(date, true), dayElement = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", className, date.getDate().toString());
        dayElement.dateObj = date;
        dayElement.$i = i;
        dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));
        if (className.indexOf("hidden") === -1 &&
            (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.now) === 0) {
            self.todayDateElem = dayElement;
            dayElement.classList.add("today");
            dayElement.setAttribute("aria-current", "date");
        }
        if (dateIsEnabled) {
            dayElement.tabIndex = -1;
            if (isDateSelected(date)) {
                dayElement.classList.add("selected");
                self.selectedDateElem = dayElement;
                if (self.config.mode === "range") {
                    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(dayElement, "startRange", self.selectedDates[0] &&
                        (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[0], true) === 0);
                    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(dayElement, "endRange", self.selectedDates[1] &&
                        (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[1], true) === 0);
                    if (className === "nextMonthDay")
                        dayElement.classList.add("inRange");
                }
            }
        }
        else {
            dayElement.classList.add("flatpickr-disabled");
        }
        if (self.config.mode === "range") {
            if (isDateInRange(date) && !isDateSelected(date))
                dayElement.classList.add("inRange");
        }
        if (self.weekNumbers &&
            self.config.showMonths === 1 &&
            className !== "prevMonthDay" &&
            i % 7 === 6) {
            self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
        }
        triggerEvent("onDayCreate", dayElement);
        return dayElement;
    }
    function focusOnDayElem(targetNode) {
        targetNode.focus();
        if (self.config.mode === "range")
            onMouseOver(targetNode);
    }
    function getFirstAvailableDay(delta) {
        var startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
        var endMonth = delta > 0 ? self.config.showMonths : -1;
        for (var m = startMonth; m != endMonth; m += delta) {
            var month = self.daysContainer.children[m];
            var startIndex = delta > 0 ? 0 : month.children.length - 1;
            var endIndex = delta > 0 ? month.children.length : -1;
            for (var i = startIndex; i != endIndex; i += delta) {
                var c = month.children[i];
                if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
                    return c;
            }
        }
        return undefined;
    }
    function getNextAvailableDay(current, delta) {
        var givenMonth = current.className.indexOf("Month") === -1
            ? current.dateObj.getMonth()
            : self.currentMonth;
        var endMonth = delta > 0 ? self.config.showMonths : -1;
        var loopDelta = delta > 0 ? 1 : -1;
        for (var m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
            var month = self.daysContainer.children[m];
            var startIndex = givenMonth - self.currentMonth === m
                ? current.$i + delta
                : delta < 0
                    ? month.children.length - 1
                    : 0;
            var numMonthDays = month.children.length;
            for (var i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
                var c = month.children[i];
                if (c.className.indexOf("hidden") === -1 &&
                    isEnabled(c.dateObj) &&
                    Math.abs(current.$i - i) >= Math.abs(delta))
                    return focusOnDayElem(c);
            }
        }
        self.changeMonth(loopDelta);
        focusOnDay(getFirstAvailableDay(loopDelta), 0);
        return undefined;
    }
    function focusOnDay(current, offset) {
        var activeElement = getClosestActiveElement();
        var dayFocused = isInView(activeElement || document.body);
        var startElem = current !== undefined
            ? current
            : dayFocused
                ? activeElement
                : self.selectedDateElem !== undefined && isInView(self.selectedDateElem)
                    ? self.selectedDateElem
                    : self.todayDateElem !== undefined && isInView(self.todayDateElem)
                        ? self.todayDateElem
                        : getFirstAvailableDay(offset > 0 ? 1 : -1);
        if (startElem === undefined) {
            self._input.focus();
        }
        else if (!dayFocused) {
            focusOnDayElem(startElem);
        }
        else {
            getNextAvailableDay(startElem, offset);
        }
    }
    function buildMonthDays(year, month) {
        var firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
        var prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12, year);
        var daysInMonth = self.utils.getDaysInMonth(month, year), days = window.document.createDocumentFragment(), isMultiMonth = self.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
        var dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
        for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
            days.appendChild(createDay("flatpickr-day " + prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
        }
        for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
            days.appendChild(createDay("flatpickr-day", new Date(year, month, dayNumber), dayNumber, dayIndex));
        }
        for (var dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth &&
            (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
            days.appendChild(createDay("flatpickr-day " + nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
        }
        var dayContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "dayContainer");
        dayContainer.appendChild(days);
        return dayContainer;
    }
    function buildDays() {
        if (self.daysContainer === undefined) {
            return;
        }
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.daysContainer);
        if (self.weekNumbers)
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.weekNumbers);
        var frag = document.createDocumentFragment();
        for (var i = 0; i < self.config.showMonths; i++) {
            var d = new Date(self.currentYear, self.currentMonth, 1);
            d.setMonth(self.currentMonth + i);
            frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
        }
        self.daysContainer.appendChild(frag);
        self.days = self.daysContainer.firstChild;
        if (self.config.mode === "range" && self.selectedDates.length === 1) {
            onMouseOver();
        }
    }
    function buildMonthSwitch() {
        if (self.config.showMonths > 1 ||
            self.config.monthSelectorType !== "dropdown")
            return;
        var shouldBuildMonth = function (month) {
            if (self.config.minDate !== undefined &&
                self.currentYear === self.config.minDate.getFullYear() &&
                month < self.config.minDate.getMonth()) {
                return false;
            }
            return !(self.config.maxDate !== undefined &&
                self.currentYear === self.config.maxDate.getFullYear() &&
                month > self.config.maxDate.getMonth());
        };
        self.monthsDropdownContainer.tabIndex = -1;
        self.monthsDropdownContainer.innerHTML = "";
        for (var i = 0; i < 12; i++) {
            if (!shouldBuildMonth(i))
                continue;
            var month = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("option", "flatpickr-monthDropdown-month");
            month.value = new Date(self.currentYear, i).getMonth().toString();
            month.textContent = (0,_utils_formatting__WEBPACK_IMPORTED_MODULE_5__.monthToStr)(i, self.config.shorthandCurrentMonth, self.l10n);
            month.tabIndex = -1;
            if (self.currentMonth === i) {
                month.selected = true;
            }
            self.monthsDropdownContainer.appendChild(month);
        }
    }
    function buildMonth() {
        var container = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-month");
        var monthNavFragment = window.document.createDocumentFragment();
        var monthElement;
        if (self.config.showMonths > 1 ||
            self.config.monthSelectorType === "static") {
            monthElement = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "cur-month");
        }
        else {
            self.monthsDropdownContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("select", "flatpickr-monthDropdown-months");
            self.monthsDropdownContainer.setAttribute("aria-label", self.l10n.monthAriaLabel);
            bind(self.monthsDropdownContainer, "change", function (e) {
                var target = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
                var selectedMonth = parseInt(target.value, 10);
                self.changeMonth(selectedMonth - self.currentMonth);
                triggerEvent("onMonthChange");
            });
            buildMonthSwitch();
            monthElement = self.monthsDropdownContainer;
        }
        var yearInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("cur-year", { tabindex: "-1" });
        var yearElement = yearInput.getElementsByTagName("input")[0];
        yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
        if (self.config.minDate) {
            yearElement.setAttribute("min", self.config.minDate.getFullYear().toString());
        }
        if (self.config.maxDate) {
            yearElement.setAttribute("max", self.config.maxDate.getFullYear().toString());
            yearElement.disabled =
                !!self.config.minDate &&
                    self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
        }
        var currentMonth = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-current-month");
        currentMonth.appendChild(monthElement);
        currentMonth.appendChild(yearInput);
        monthNavFragment.appendChild(currentMonth);
        container.appendChild(monthNavFragment);
        return {
            container: container,
            yearElement: yearElement,
            monthElement: monthElement,
        };
    }
    function buildMonths() {
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.monthNav);
        self.monthNav.appendChild(self.prevMonthNav);
        if (self.config.showMonths) {
            self.yearElements = [];
            self.monthElements = [];
        }
        for (var m = self.config.showMonths; m--;) {
            var month = buildMonth();
            self.yearElements.push(month.yearElement);
            self.monthElements.push(month.monthElement);
            self.monthNav.appendChild(month.container);
        }
        self.monthNav.appendChild(self.nextMonthNav);
    }
    function buildMonthNav() {
        self.monthNav = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-months");
        self.yearElements = [];
        self.monthElements = [];
        self.prevMonthNav = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-prev-month");
        self.prevMonthNav.innerHTML = self.config.prevArrow;
        self.nextMonthNav = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-next-month");
        self.nextMonthNav.innerHTML = self.config.nextArrow;
        buildMonths();
        Object.defineProperty(self, "_hidePrevMonthArrow", {
            get: function () { return self.__hidePrevMonthArrow; },
            set: function (bool) {
                if (self.__hidePrevMonthArrow !== bool) {
                    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.prevMonthNav, "flatpickr-disabled", bool);
                    self.__hidePrevMonthArrow = bool;
                }
            },
        });
        Object.defineProperty(self, "_hideNextMonthArrow", {
            get: function () { return self.__hideNextMonthArrow; },
            set: function (bool) {
                if (self.__hideNextMonthArrow !== bool) {
                    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.nextMonthNav, "flatpickr-disabled", bool);
                    self.__hideNextMonthArrow = bool;
                }
            },
        });
        self.currentYearElement = self.yearElements[0];
        updateNavigationCurrentMonth();
        return self.monthNav;
    }
    function buildTime() {
        self.calendarContainer.classList.add("hasTime");
        if (self.config.noCalendar)
            self.calendarContainer.classList.add("noCalendar");
        var defaults = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.getDefaultHours)(self.config);
        self.timeContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-time");
        self.timeContainer.tabIndex = -1;
        var separator = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-time-separator", ":");
        var hourInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("flatpickr-hour", {
            "aria-label": self.l10n.hourAriaLabel,
        });
        self.hourElement = hourInput.getElementsByTagName("input")[0];
        var minuteInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("flatpickr-minute", {
            "aria-label": self.l10n.minuteAriaLabel,
        });
        self.minuteElement = minuteInput.getElementsByTagName("input")[0];
        self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
        self.hourElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(self.latestSelectedDateObj
            ? self.latestSelectedDateObj.getHours()
            : self.config.time_24hr
                ? defaults.hours
                : military2ampm(defaults.hours));
        self.minuteElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(self.latestSelectedDateObj
            ? self.latestSelectedDateObj.getMinutes()
            : defaults.minutes);
        self.hourElement.setAttribute("step", self.config.hourIncrement.toString());
        self.minuteElement.setAttribute("step", self.config.minuteIncrement.toString());
        self.hourElement.setAttribute("min", self.config.time_24hr ? "0" : "1");
        self.hourElement.setAttribute("max", self.config.time_24hr ? "23" : "12");
        self.hourElement.setAttribute("maxlength", "2");
        self.minuteElement.setAttribute("min", "0");
        self.minuteElement.setAttribute("max", "59");
        self.minuteElement.setAttribute("maxlength", "2");
        self.timeContainer.appendChild(hourInput);
        self.timeContainer.appendChild(separator);
        self.timeContainer.appendChild(minuteInput);
        if (self.config.time_24hr)
            self.timeContainer.classList.add("time24hr");
        if (self.config.enableSeconds) {
            self.timeContainer.classList.add("hasSeconds");
            var secondInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createNumberInput)("flatpickr-second");
            self.secondElement = secondInput.getElementsByTagName("input")[0];
            self.secondElement.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(self.latestSelectedDateObj
                ? self.latestSelectedDateObj.getSeconds()
                : defaults.seconds);
            self.secondElement.setAttribute("step", self.minuteElement.getAttribute("step"));
            self.secondElement.setAttribute("min", "0");
            self.secondElement.setAttribute("max", "59");
            self.secondElement.setAttribute("maxlength", "2");
            self.timeContainer.appendChild((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-time-separator", ":"));
            self.timeContainer.appendChild(secondInput);
        }
        if (!self.config.time_24hr) {
            self.amPM = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-am-pm", self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)((self.latestSelectedDateObj
                ? self.hourElement.value
                : self.config.defaultHour) > 11)]);
            self.amPM.title = self.l10n.toggleTitle;
            self.amPM.tabIndex = -1;
            self.timeContainer.appendChild(self.amPM);
        }
        return self.timeContainer;
    }
    function buildWeekdays() {
        if (!self.weekdayContainer)
            self.weekdayContainer = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weekdays");
        else
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.clearNode)(self.weekdayContainer);
        for (var i = self.config.showMonths; i--;) {
            var container = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weekdaycontainer");
            self.weekdayContainer.appendChild(container);
        }
        updateWeekdays();
        return self.weekdayContainer;
    }
    function updateWeekdays() {
        if (!self.weekdayContainer) {
            return;
        }
        var firstDayOfWeek = self.l10n.firstDayOfWeek;
        var weekdays = __spreadArrays(self.l10n.weekdays.shorthand);
        if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
            weekdays = __spreadArrays(weekdays.splice(firstDayOfWeek, weekdays.length), weekdays.splice(0, firstDayOfWeek));
        }
        for (var i = self.config.showMonths; i--;) {
            self.weekdayContainer.children[i].innerHTML = "\n      <span class='flatpickr-weekday'>\n        " + weekdays.join("</span><span class='flatpickr-weekday'>") + "\n      </span>\n      ";
        }
    }
    function buildWeeks() {
        self.calendarContainer.classList.add("hasWeeks");
        var weekWrapper = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weekwrapper");
        weekWrapper.appendChild((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
        var weekNumbers = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("div", "flatpickr-weeks");
        weekWrapper.appendChild(weekNumbers);
        return {
            weekWrapper: weekWrapper,
            weekNumbers: weekNumbers,
        };
    }
    function changeMonth(value, isOffset) {
        if (isOffset === void 0) { isOffset = true; }
        var delta = isOffset ? value : value - self.currentMonth;
        if ((delta < 0 && self._hidePrevMonthArrow === true) ||
            (delta > 0 && self._hideNextMonthArrow === true))
            return;
        self.currentMonth += delta;
        if (self.currentMonth < 0 || self.currentMonth > 11) {
            self.currentYear += self.currentMonth > 11 ? 1 : -1;
            self.currentMonth = (self.currentMonth + 12) % 12;
            triggerEvent("onYearChange");
            buildMonthSwitch();
        }
        buildDays();
        triggerEvent("onMonthChange");
        updateNavigationCurrentMonth();
    }
    function clear(triggerChangeEvent, toInitial) {
        if (triggerChangeEvent === void 0) { triggerChangeEvent = true; }
        if (toInitial === void 0) { toInitial = true; }
        self.input.value = "";
        if (self.altInput !== undefined)
            self.altInput.value = "";
        if (self.mobileInput !== undefined)
            self.mobileInput.value = "";
        self.selectedDates = [];
        self.latestSelectedDateObj = undefined;
        if (toInitial === true) {
            self.currentYear = self._initialDate.getFullYear();
            self.currentMonth = self._initialDate.getMonth();
        }
        if (self.config.enableTime === true) {
            var _a = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.getDefaultHours)(self.config), hours = _a.hours, minutes = _a.minutes, seconds = _a.seconds;
            setHours(hours, minutes, seconds);
        }
        self.redraw();
        if (triggerChangeEvent)
            triggerEvent("onChange");
    }
    function close() {
        self.isOpen = false;
        if (!self.isMobile) {
            if (self.calendarContainer !== undefined) {
                self.calendarContainer.classList.remove("open");
            }
            if (self._input !== undefined) {
                self._input.classList.remove("active");
            }
        }
        triggerEvent("onClose");
    }
    function destroy() {
        if (self.config !== undefined)
            triggerEvent("onDestroy");
        for (var i = self._handlers.length; i--;) {
            self._handlers[i].remove();
        }
        self._handlers = [];
        if (self.mobileInput) {
            if (self.mobileInput.parentNode)
                self.mobileInput.parentNode.removeChild(self.mobileInput);
            self.mobileInput = undefined;
        }
        else if (self.calendarContainer && self.calendarContainer.parentNode) {
            if (self.config.static && self.calendarContainer.parentNode) {
                var wrapper = self.calendarContainer.parentNode;
                wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
                if (wrapper.parentNode) {
                    while (wrapper.firstChild)
                        wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                    wrapper.parentNode.removeChild(wrapper);
                }
            }
            else
                self.calendarContainer.parentNode.removeChild(self.calendarContainer);
        }
        if (self.altInput) {
            self.input.type = "text";
            if (self.altInput.parentNode)
                self.altInput.parentNode.removeChild(self.altInput);
            delete self.altInput;
        }
        if (self.input) {
            self.input.type = self.input._type;
            self.input.classList.remove("flatpickr-input");
            self.input.removeAttribute("readonly");
        }
        [
            "_showTimeInput",
            "latestSelectedDateObj",
            "_hideNextMonthArrow",
            "_hidePrevMonthArrow",
            "__hideNextMonthArrow",
            "__hidePrevMonthArrow",
            "isMobile",
            "isOpen",
            "selectedDateElem",
            "minDateHasTime",
            "maxDateHasTime",
            "days",
            "daysContainer",
            "_input",
            "_positionElement",
            "innerContainer",
            "rContainer",
            "monthNav",
            "todayDateElem",
            "calendarContainer",
            "weekdayContainer",
            "prevMonthNav",
            "nextMonthNav",
            "monthsDropdownContainer",
            "currentMonthElement",
            "currentYearElement",
            "navigationCurrentMonth",
            "selectedDateElem",
            "config",
        ].forEach(function (k) {
            try {
                delete self[k];
            }
            catch (_) { }
        });
    }
    function isCalendarElem(elem) {
        return self.calendarContainer.contains(elem);
    }
    function documentClick(e) {
        if (self.isOpen && !self.config.inline) {
            var eventTarget_1 = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
            var isCalendarElement = isCalendarElem(eventTarget_1);
            var isInput = eventTarget_1 === self.input ||
                eventTarget_1 === self.altInput ||
                self.element.contains(eventTarget_1) ||
                (e.path &&
                    e.path.indexOf &&
                    (~e.path.indexOf(self.input) ||
                        ~e.path.indexOf(self.altInput)));
            var lostFocus = !isInput &&
                !isCalendarElement &&
                !isCalendarElem(e.relatedTarget);
            var isIgnored = !self.config.ignoredFocusElements.some(function (elem) {
                return elem.contains(eventTarget_1);
            });
            if (lostFocus && isIgnored) {
                if (self.config.allowInput) {
                    self.setDate(self._input.value, false, self.config.altInput
                        ? self.config.altFormat
                        : self.config.dateFormat);
                }
                if (self.timeContainer !== undefined &&
                    self.minuteElement !== undefined &&
                    self.hourElement !== undefined &&
                    self.input.value !== "" &&
                    self.input.value !== undefined) {
                    updateTime();
                }
                self.close();
                if (self.config &&
                    self.config.mode === "range" &&
                    self.selectedDates.length === 1)
                    self.clear(false);
            }
        }
    }
    function changeYear(newYear) {
        if (!newYear ||
            (self.config.minDate && newYear < self.config.minDate.getFullYear()) ||
            (self.config.maxDate && newYear > self.config.maxDate.getFullYear()))
            return;
        var newYearNum = newYear, isNewYear = self.currentYear !== newYearNum;
        self.currentYear = newYearNum || self.currentYear;
        if (self.config.maxDate &&
            self.currentYear === self.config.maxDate.getFullYear()) {
            self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
        }
        else if (self.config.minDate &&
            self.currentYear === self.config.minDate.getFullYear()) {
            self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
        }
        if (isNewYear) {
            self.redraw();
            triggerEvent("onYearChange");
            buildMonthSwitch();
        }
    }
    function isEnabled(date, timeless) {
        var _a;
        if (timeless === void 0) { timeless = true; }
        var dateToCheck = self.parseDate(date, undefined, timeless);
        if ((self.config.minDate &&
            dateToCheck &&
            (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(dateToCheck, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0) ||
            (self.config.maxDate &&
                dateToCheck &&
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(dateToCheck, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0))
            return false;
        if (!self.config.enable && self.config.disable.length === 0)
            return true;
        if (dateToCheck === undefined)
            return false;
        var bool = !!self.config.enable, array = (_a = self.config.enable) !== null && _a !== void 0 ? _a : self.config.disable;
        for (var i = 0, d = void 0; i < array.length; i++) {
            d = array[i];
            if (typeof d === "function" &&
                d(dateToCheck))
                return bool;
            else if (d instanceof Date &&
                dateToCheck !== undefined &&
                d.getTime() === dateToCheck.getTime())
                return bool;
            else if (typeof d === "string") {
                var parsed = self.parseDate(d, undefined, true);
                return parsed && parsed.getTime() === dateToCheck.getTime()
                    ? bool
                    : !bool;
            }
            else if (typeof d === "object" &&
                dateToCheck !== undefined &&
                d.from &&
                d.to &&
                dateToCheck.getTime() >= d.from.getTime() &&
                dateToCheck.getTime() <= d.to.getTime())
                return bool;
        }
        return !bool;
    }
    function isInView(elem) {
        if (self.daysContainer !== undefined)
            return (elem.className.indexOf("hidden") === -1 &&
                elem.className.indexOf("flatpickr-disabled") === -1 &&
                self.daysContainer.contains(elem));
        return false;
    }
    function onBlur(e) {
        var isInput = e.target === self._input;
        var valueChanged = self._input.value.trimEnd() !== getDateStr();
        if (isInput &&
            valueChanged &&
            !(e.relatedTarget && isCalendarElem(e.relatedTarget))) {
            self.setDate(self._input.value, true, e.target === self.altInput
                ? self.config.altFormat
                : self.config.dateFormat);
        }
    }
    function onKeyDown(e) {
        var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        var isInput = self.config.wrap
            ? element.contains(eventTarget)
            : eventTarget === self._input;
        var allowInput = self.config.allowInput;
        var allowKeydown = self.isOpen && (!allowInput || !isInput);
        var allowInlineKeydown = self.config.inline && isInput && !allowInput;
        if (e.keyCode === 13 && isInput) {
            if (allowInput) {
                self.setDate(self._input.value, true, eventTarget === self.altInput
                    ? self.config.altFormat
                    : self.config.dateFormat);
                self.close();
                return eventTarget.blur();
            }
            else {
                self.open();
            }
        }
        else if (isCalendarElem(eventTarget) ||
            allowKeydown ||
            allowInlineKeydown) {
            var isTimeObj = !!self.timeContainer &&
                self.timeContainer.contains(eventTarget);
            switch (e.keyCode) {
                case 13:
                    if (isTimeObj) {
                        e.preventDefault();
                        updateTime();
                        focusAndClose();
                    }
                    else
                        selectDate(e);
                    break;
                case 27:
                    e.preventDefault();
                    focusAndClose();
                    break;
                case 8:
                case 46:
                    if (isInput && !self.config.allowInput) {
                        e.preventDefault();
                        self.clear();
                    }
                    break;
                case 37:
                case 39:
                    if (!isTimeObj && !isInput) {
                        e.preventDefault();
                        var activeElement = getClosestActiveElement();
                        if (self.daysContainer !== undefined &&
                            (allowInput === false ||
                                (activeElement && isInView(activeElement)))) {
                            var delta_1 = e.keyCode === 39 ? 1 : -1;
                            if (!e.ctrlKey)
                                focusOnDay(undefined, delta_1);
                            else {
                                e.stopPropagation();
                                changeMonth(delta_1);
                                focusOnDay(getFirstAvailableDay(1), 0);
                            }
                        }
                    }
                    else if (self.hourElement)
                        self.hourElement.focus();
                    break;
                case 38:
                case 40:
                    e.preventDefault();
                    var delta = e.keyCode === 40 ? 1 : -1;
                    if ((self.daysContainer &&
                        eventTarget.$i !== undefined) ||
                        eventTarget === self.input ||
                        eventTarget === self.altInput) {
                        if (e.ctrlKey) {
                            e.stopPropagation();
                            changeYear(self.currentYear - delta);
                            focusOnDay(getFirstAvailableDay(1), 0);
                        }
                        else if (!isTimeObj)
                            focusOnDay(undefined, delta * 7);
                    }
                    else if (eventTarget === self.currentYearElement) {
                        changeYear(self.currentYear - delta);
                    }
                    else if (self.config.enableTime) {
                        if (!isTimeObj && self.hourElement)
                            self.hourElement.focus();
                        updateTime(e);
                        self._debouncedChange();
                    }
                    break;
                case 9:
                    if (isTimeObj) {
                        var elems = [
                            self.hourElement,
                            self.minuteElement,
                            self.secondElement,
                            self.amPM,
                        ]
                            .concat(self.pluginElements)
                            .filter(function (x) { return x; });
                        var i = elems.indexOf(eventTarget);
                        if (i !== -1) {
                            var target = elems[i + (e.shiftKey ? -1 : 1)];
                            e.preventDefault();
                            (target || self._input).focus();
                        }
                    }
                    else if (!self.config.noCalendar &&
                        self.daysContainer &&
                        self.daysContainer.contains(eventTarget) &&
                        e.shiftKey) {
                        e.preventDefault();
                        self._input.focus();
                    }
                    break;
                default:
                    break;
            }
        }
        if (self.amPM !== undefined && eventTarget === self.amPM) {
            switch (e.key) {
                case self.l10n.amPM[0].charAt(0):
                case self.l10n.amPM[0].charAt(0).toLowerCase():
                    self.amPM.textContent = self.l10n.amPM[0];
                    setHoursFromInputs();
                    updateValue();
                    break;
                case self.l10n.amPM[1].charAt(0):
                case self.l10n.amPM[1].charAt(0).toLowerCase():
                    self.amPM.textContent = self.l10n.amPM[1];
                    setHoursFromInputs();
                    updateValue();
                    break;
            }
        }
        if (isInput || isCalendarElem(eventTarget)) {
            triggerEvent("onKeyDown", e);
        }
    }
    function onMouseOver(elem, cellClass) {
        if (cellClass === void 0) { cellClass = "flatpickr-day"; }
        if (self.selectedDates.length !== 1 ||
            (elem &&
                (!elem.classList.contains(cellClass) ||
                    elem.classList.contains("flatpickr-disabled"))))
            return;
        var hoverDate = elem
            ? elem.dateObj.getTime()
            : self.days.firstElementChild.dateObj.getTime(), initialDate = self.parseDate(self.selectedDates[0], undefined, true).getTime(), rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime());
        var containsDisabled = false;
        var minRange = 0, maxRange = 0;
        for (var t = rangeStartDate; t < rangeEndDate; t += _utils_dates__WEBPACK_IMPORTED_MODULE_4__.duration.DAY) {
            if (!isEnabled(new Date(t), true)) {
                containsDisabled =
                    containsDisabled || (t > rangeStartDate && t < rangeEndDate);
                if (t < initialDate && (!minRange || t > minRange))
                    minRange = t;
                else if (t > initialDate && (!maxRange || t < maxRange))
                    maxRange = t;
            }
        }
        var hoverableCells = Array.from(self.rContainer.querySelectorAll("*:nth-child(-n+" + self.config.showMonths + ") > ." + cellClass));
        hoverableCells.forEach(function (dayElem) {
            var date = dayElem.dateObj;
            var timestamp = date.getTime();
            var outOfRange = (minRange > 0 && timestamp < minRange) ||
                (maxRange > 0 && timestamp > maxRange);
            if (outOfRange) {
                dayElem.classList.add("notAllowed");
                ["inRange", "startRange", "endRange"].forEach(function (c) {
                    dayElem.classList.remove(c);
                });
                return;
            }
            else if (containsDisabled && !outOfRange)
                return;
            ["startRange", "inRange", "endRange", "notAllowed"].forEach(function (c) {
                dayElem.classList.remove(c);
            });
            if (elem !== undefined) {
                elem.classList.add(hoverDate <= self.selectedDates[0].getTime()
                    ? "startRange"
                    : "endRange");
                if (initialDate < hoverDate && timestamp === initialDate)
                    dayElem.classList.add("startRange");
                else if (initialDate > hoverDate && timestamp === initialDate)
                    dayElem.classList.add("endRange");
                if (timestamp >= minRange &&
                    (maxRange === 0 || timestamp <= maxRange) &&
                    (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.isBetween)(timestamp, initialDate, hoverDate))
                    dayElem.classList.add("inRange");
            }
        });
    }
    function onResize() {
        if (self.isOpen && !self.config.static && !self.config.inline)
            positionCalendar();
    }
    function open(e, positionElement) {
        if (positionElement === void 0) { positionElement = self._positionElement; }
        if (self.isMobile === true) {
            if (e) {
                e.preventDefault();
                var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
                if (eventTarget) {
                    eventTarget.blur();
                }
            }
            if (self.mobileInput !== undefined) {
                self.mobileInput.focus();
                self.mobileInput.click();
            }
            triggerEvent("onOpen");
            return;
        }
        else if (self._input.disabled || self.config.inline) {
            return;
        }
        var wasOpen = self.isOpen;
        self.isOpen = true;
        if (!wasOpen) {
            self.calendarContainer.classList.add("open");
            self._input.classList.add("active");
            triggerEvent("onOpen");
            positionCalendar(positionElement);
        }
        if (self.config.enableTime === true && self.config.noCalendar === true) {
            if (self.config.allowInput === false &&
                (e === undefined ||
                    !self.timeContainer.contains(e.relatedTarget))) {
                setTimeout(function () { return self.hourElement.select(); }, 50);
            }
        }
    }
    function minMaxDateSetter(type) {
        return function (date) {
            var dateObj = (self.config["_" + type + "Date"] = self.parseDate(date, self.config.dateFormat));
            var inverseDateObj = self.config["_" + (type === "min" ? "max" : "min") + "Date"];
            if (dateObj !== undefined) {
                self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] =
                    dateObj.getHours() > 0 ||
                        dateObj.getMinutes() > 0 ||
                        dateObj.getSeconds() > 0;
            }
            if (self.selectedDates) {
                self.selectedDates = self.selectedDates.filter(function (d) { return isEnabled(d); });
                if (!self.selectedDates.length && type === "min")
                    setHoursFromDate(dateObj);
                updateValue();
            }
            if (self.daysContainer) {
                redraw();
                if (dateObj !== undefined)
                    self.currentYearElement[type] = dateObj.getFullYear().toString();
                else
                    self.currentYearElement.removeAttribute(type);
                self.currentYearElement.disabled =
                    !!inverseDateObj &&
                        dateObj !== undefined &&
                        inverseDateObj.getFullYear() === dateObj.getFullYear();
            }
        };
    }
    function parseConfig() {
        var boolOpts = [
            "wrap",
            "weekNumbers",
            "allowInput",
            "allowInvalidPreload",
            "clickOpens",
            "time_24hr",
            "enableTime",
            "noCalendar",
            "altInput",
            "shorthandCurrentMonth",
            "inline",
            "static",
            "enableSeconds",
            "disableMobile",
        ];
        var userConfig = __assign(__assign({}, JSON.parse(JSON.stringify(element.dataset || {}))), instanceConfig);
        var formats = {};
        self.config.parseDate = userConfig.parseDate;
        self.config.formatDate = userConfig.formatDate;
        Object.defineProperty(self.config, "enable", {
            get: function () { return self.config._enable; },
            set: function (dates) {
                self.config._enable = parseDateRules(dates);
            },
        });
        Object.defineProperty(self.config, "disable", {
            get: function () { return self.config._disable; },
            set: function (dates) {
                self.config._disable = parseDateRules(dates);
            },
        });
        var timeMode = userConfig.mode === "time";
        if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
            var defaultDateFormat = flatpickr.defaultConfig.dateFormat || _types_options__WEBPACK_IMPORTED_MODULE_0__.defaults.dateFormat;
            formats.dateFormat =
                userConfig.noCalendar || timeMode
                    ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
                    : defaultDateFormat + " H:i" + (userConfig.enableSeconds ? ":S" : "");
        }
        if (userConfig.altInput &&
            (userConfig.enableTime || timeMode) &&
            !userConfig.altFormat) {
            var defaultAltFormat = flatpickr.defaultConfig.altFormat || _types_options__WEBPACK_IMPORTED_MODULE_0__.defaults.altFormat;
            formats.altFormat =
                userConfig.noCalendar || timeMode
                    ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K")
                    : defaultAltFormat + (" h:i" + (userConfig.enableSeconds ? ":S" : "") + " K");
        }
        Object.defineProperty(self.config, "minDate", {
            get: function () { return self.config._minDate; },
            set: minMaxDateSetter("min"),
        });
        Object.defineProperty(self.config, "maxDate", {
            get: function () { return self.config._maxDate; },
            set: minMaxDateSetter("max"),
        });
        var minMaxTimeSetter = function (type) { return function (val) {
            self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i:S");
        }; };
        Object.defineProperty(self.config, "minTime", {
            get: function () { return self.config._minTime; },
            set: minMaxTimeSetter("min"),
        });
        Object.defineProperty(self.config, "maxTime", {
            get: function () { return self.config._maxTime; },
            set: minMaxTimeSetter("max"),
        });
        if (userConfig.mode === "time") {
            self.config.noCalendar = true;
            self.config.enableTime = true;
        }
        Object.assign(self.config, formats, userConfig);
        for (var i = 0; i < boolOpts.length; i++)
            self.config[boolOpts[i]] =
                self.config[boolOpts[i]] === true ||
                    self.config[boolOpts[i]] === "true";
        _types_options__WEBPACK_IMPORTED_MODULE_0__.HOOKS.filter(function (hook) { return self.config[hook] !== undefined; }).forEach(function (hook) {
            self.config[hook] = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.arrayify)(self.config[hook] || []).map(bindToInstance);
        });
        self.isMobile =
            !self.config.disableMobile &&
                !self.config.inline &&
                self.config.mode === "single" &&
                !self.config.disable.length &&
                !self.config.enable &&
                !self.config.weekNumbers &&
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        for (var i = 0; i < self.config.plugins.length; i++) {
            var pluginConf = self.config.plugins[i](self) || {};
            for (var key in pluginConf) {
                if (_types_options__WEBPACK_IMPORTED_MODULE_0__.HOOKS.indexOf(key) > -1) {
                    self.config[key] = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.arrayify)(pluginConf[key])
                        .map(bindToInstance)
                        .concat(self.config[key]);
                }
                else if (typeof userConfig[key] === "undefined")
                    self.config[key] = pluginConf[key];
            }
        }
        if (!userConfig.altInputClass) {
            self.config.altInputClass =
                getInputElem().className + " " + self.config.altInputClass;
        }
        triggerEvent("onParseConfig");
    }
    function getInputElem() {
        return self.config.wrap
            ? element.querySelector("[data-input]")
            : element;
    }
    function setupLocale() {
        if (typeof self.config.locale !== "object" &&
            typeof flatpickr.l10ns[self.config.locale] === "undefined")
            self.config.errorHandler(new Error("flatpickr: invalid locale " + self.config.locale));
        self.l10n = __assign(__assign({}, flatpickr.l10ns.default), (typeof self.config.locale === "object"
            ? self.config.locale
            : self.config.locale !== "default"
                ? flatpickr.l10ns[self.config.locale]
                : undefined));
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.D = "(" + self.l10n.weekdays.shorthand.join("|") + ")";
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.l = "(" + self.l10n.weekdays.longhand.join("|") + ")";
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.M = "(" + self.l10n.months.shorthand.join("|") + ")";
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.F = "(" + self.l10n.months.longhand.join("|") + ")";
        _utils_formatting__WEBPACK_IMPORTED_MODULE_5__.tokenRegex.K = "(" + self.l10n.amPM[0] + "|" + self.l10n.amPM[1] + "|" + self.l10n.amPM[0].toLowerCase() + "|" + self.l10n.amPM[1].toLowerCase() + ")";
        var userConfig = __assign(__assign({}, instanceConfig), JSON.parse(JSON.stringify(element.dataset || {})));
        if (userConfig.time_24hr === undefined &&
            flatpickr.defaultConfig.time_24hr === undefined) {
            self.config.time_24hr = self.l10n.time_24hr;
        }
        self.formatDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateFormatter)(self);
        self.parseDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateParser)({ config: self.config, l10n: self.l10n });
    }
    function positionCalendar(customPositionElement) {
        if (typeof self.config.position === "function") {
            return void self.config.position(self, customPositionElement);
        }
        if (self.calendarContainer === undefined)
            return;
        triggerEvent("onPreCalendarPosition");
        var positionElement = customPositionElement || self._positionElement;
        var calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, (function (acc, child) { return acc + child.offsetHeight; }), 0), calendarWidth = self.calendarContainer.offsetWidth, configPos = self.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" ||
            (configPosVertical !== "below" &&
                distanceFromBottom < calendarHeight &&
                inputBounds.top > calendarHeight);
        var top = window.pageYOffset +
            inputBounds.top +
            (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowTop", !showOnTop);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowBottom", showOnTop);
        if (self.config.inline)
            return;
        var left = window.pageXOffset + inputBounds.left;
        var isCenter = false;
        var isRight = false;
        if (configPosHorizontal === "center") {
            left -= (calendarWidth - inputBounds.width) / 2;
            isCenter = true;
        }
        else if (configPosHorizontal === "right") {
            left -= calendarWidth - inputBounds.width;
            isRight = true;
        }
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowLeft", !isCenter && !isRight);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowCenter", isCenter);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "arrowRight", isRight);
        var right = window.document.body.offsetWidth -
            (window.pageXOffset + inputBounds.right);
        var rightMost = left + calendarWidth > window.document.body.offsetWidth;
        var centerMost = right + calendarWidth > window.document.body.offsetWidth;
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "rightMost", rightMost);
        if (self.config.static)
            return;
        self.calendarContainer.style.top = top + "px";
        if (!rightMost) {
            self.calendarContainer.style.left = left + "px";
            self.calendarContainer.style.right = "auto";
        }
        else if (!centerMost) {
            self.calendarContainer.style.left = "auto";
            self.calendarContainer.style.right = right + "px";
        }
        else {
            var doc = getDocumentStyleSheet();
            if (doc === undefined)
                return;
            var bodyWidth = window.document.body.offsetWidth;
            var centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
            var centerBefore = ".flatpickr-calendar.centerMost:before";
            var centerAfter = ".flatpickr-calendar.centerMost:after";
            var centerIndex = doc.cssRules.length;
            var centerStyle = "{left:" + inputBounds.left + "px;right:auto;}";
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "rightMost", false);
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.toggleClass)(self.calendarContainer, "centerMost", true);
            doc.insertRule(centerBefore + "," + centerAfter + centerStyle, centerIndex);
            self.calendarContainer.style.left = centerLeft + "px";
            self.calendarContainer.style.right = "auto";
        }
    }
    function getDocumentStyleSheet() {
        var editableSheet = null;
        for (var i = 0; i < document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i];
            if (!sheet.cssRules)
                continue;
            try {
                sheet.cssRules;
            }
            catch (err) {
                continue;
            }
            editableSheet = sheet;
            break;
        }
        return editableSheet != null ? editableSheet : createStyleSheet();
    }
    function createStyleSheet() {
        var style = document.createElement("style");
        document.head.appendChild(style);
        return style.sheet;
    }
    function redraw() {
        if (self.config.noCalendar || self.isMobile)
            return;
        buildMonthSwitch();
        updateNavigationCurrentMonth();
        buildDays();
    }
    function focusAndClose() {
        self._input.focus();
        if (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
            navigator.msMaxTouchPoints !== undefined) {
            setTimeout(self.close, 0);
        }
        else {
            self.close();
        }
    }
    function selectDate(e) {
        e.preventDefault();
        e.stopPropagation();
        var isSelectable = function (day) {
            return day.classList &&
                day.classList.contains("flatpickr-day") &&
                !day.classList.contains("flatpickr-disabled") &&
                !day.classList.contains("notAllowed");
        };
        var t = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.findParent)((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e), isSelectable);
        if (t === undefined)
            return;
        var target = t;
        var selectedDate = (self.latestSelectedDateObj = new Date(target.dateObj.getTime()));
        var shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth ||
            selectedDate.getMonth() >
                self.currentMonth + self.config.showMonths - 1) &&
            self.config.mode !== "range";
        self.selectedDateElem = target;
        if (self.config.mode === "single")
            self.selectedDates = [selectedDate];
        else if (self.config.mode === "multiple") {
            var selectedIndex = isDateSelected(selectedDate);
            if (selectedIndex)
                self.selectedDates.splice(parseInt(selectedIndex), 1);
            else
                self.selectedDates.push(selectedDate);
        }
        else if (self.config.mode === "range") {
            if (self.selectedDates.length === 2) {
                self.clear(false, false);
            }
            self.latestSelectedDateObj = selectedDate;
            self.selectedDates.push(selectedDate);
            if ((0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(selectedDate, self.selectedDates[0], true) !== 0)
                self.selectedDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
        }
        setHoursFromInputs();
        if (shouldChangeMonth) {
            var isNewYear = self.currentYear !== selectedDate.getFullYear();
            self.currentYear = selectedDate.getFullYear();
            self.currentMonth = selectedDate.getMonth();
            if (isNewYear) {
                triggerEvent("onYearChange");
                buildMonthSwitch();
            }
            triggerEvent("onMonthChange");
        }
        updateNavigationCurrentMonth();
        buildDays();
        updateValue();
        if (!shouldChangeMonth &&
            self.config.mode !== "range" &&
            self.config.showMonths === 1)
            focusOnDayElem(target);
        else if (self.selectedDateElem !== undefined &&
            self.hourElement === undefined) {
            self.selectedDateElem && self.selectedDateElem.focus();
        }
        if (self.hourElement !== undefined)
            self.hourElement !== undefined && self.hourElement.focus();
        if (self.config.closeOnSelect) {
            var single = self.config.mode === "single" && !self.config.enableTime;
            var range = self.config.mode === "range" &&
                self.selectedDates.length === 2 &&
                !self.config.enableTime;
            if (single || range) {
                focusAndClose();
            }
        }
        triggerChange();
    }
    var CALLBACKS = {
        locale: [setupLocale, updateWeekdays],
        showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
        minDate: [jumpToDate],
        maxDate: [jumpToDate],
        positionElement: [updatePositionElement],
        clickOpens: [
            function () {
                if (self.config.clickOpens === true) {
                    bind(self._input, "focus", self.open);
                    bind(self._input, "click", self.open);
                }
                else {
                    self._input.removeEventListener("focus", self.open);
                    self._input.removeEventListener("click", self.open);
                }
            },
        ],
    };
    function set(option, value) {
        if (option !== null && typeof option === "object") {
            Object.assign(self.config, option);
            for (var key in option) {
                if (CALLBACKS[key] !== undefined)
                    CALLBACKS[key].forEach(function (x) { return x(); });
            }
        }
        else {
            self.config[option] = value;
            if (CALLBACKS[option] !== undefined)
                CALLBACKS[option].forEach(function (x) { return x(); });
            else if (_types_options__WEBPACK_IMPORTED_MODULE_0__.HOOKS.indexOf(option) > -1)
                self.config[option] = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.arrayify)(value);
        }
        self.redraw();
        updateValue(true);
    }
    function setSelectedDate(inputDate, format) {
        var dates = [];
        if (inputDate instanceof Array)
            dates = inputDate.map(function (d) { return self.parseDate(d, format); });
        else if (inputDate instanceof Date || typeof inputDate === "number")
            dates = [self.parseDate(inputDate, format)];
        else if (typeof inputDate === "string") {
            switch (self.config.mode) {
                case "single":
                case "time":
                    dates = [self.parseDate(inputDate, format)];
                    break;
                case "multiple":
                    dates = inputDate
                        .split(self.config.conjunction)
                        .map(function (date) { return self.parseDate(date, format); });
                    break;
                case "range":
                    dates = inputDate
                        .split(self.l10n.rangeSeparator)
                        .map(function (date) { return self.parseDate(date, format); });
                    break;
                default:
                    break;
            }
        }
        else
            self.config.errorHandler(new Error("Invalid date supplied: " + JSON.stringify(inputDate)));
        self.selectedDates = (self.config.allowInvalidPreload
            ? dates
            : dates.filter(function (d) { return d instanceof Date && isEnabled(d, false); }));
        if (self.config.mode === "range")
            self.selectedDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
    }
    function setDate(date, triggerChange, format) {
        if (triggerChange === void 0) { triggerChange = false; }
        if (format === void 0) { format = self.config.dateFormat; }
        if ((date !== 0 && !date) || (date instanceof Array && date.length === 0))
            return self.clear(triggerChange);
        setSelectedDate(date, format);
        self.latestSelectedDateObj =
            self.selectedDates[self.selectedDates.length - 1];
        self.redraw();
        jumpToDate(undefined, triggerChange);
        setHoursFromDate();
        if (self.selectedDates.length === 0) {
            self.clear(false);
        }
        updateValue(triggerChange);
        if (triggerChange)
            triggerEvent("onChange");
    }
    function parseDateRules(arr) {
        return arr
            .slice()
            .map(function (rule) {
            if (typeof rule === "string" ||
                typeof rule === "number" ||
                rule instanceof Date) {
                return self.parseDate(rule, undefined, true);
            }
            else if (rule &&
                typeof rule === "object" &&
                rule.from &&
                rule.to)
                return {
                    from: self.parseDate(rule.from, undefined),
                    to: self.parseDate(rule.to, undefined),
                };
            return rule;
        })
            .filter(function (x) { return x; });
    }
    function setupDates() {
        self.selectedDates = [];
        self.now = self.parseDate(self.config.now) || new Date();
        var preloadedDate = self.config.defaultDate ||
            ((self.input.nodeName === "INPUT" ||
                self.input.nodeName === "TEXTAREA") &&
                self.input.placeholder &&
                self.input.value === self.input.placeholder
                ? null
                : self.input.value);
        if (preloadedDate)
            setSelectedDate(preloadedDate, self.config.dateFormat);
        self._initialDate =
            self.selectedDates.length > 0
                ? self.selectedDates[0]
                : self.config.minDate &&
                    self.config.minDate.getTime() > self.now.getTime()
                    ? self.config.minDate
                    : self.config.maxDate &&
                        self.config.maxDate.getTime() < self.now.getTime()
                        ? self.config.maxDate
                        : self.now;
        self.currentYear = self._initialDate.getFullYear();
        self.currentMonth = self._initialDate.getMonth();
        if (self.selectedDates.length > 0)
            self.latestSelectedDateObj = self.selectedDates[0];
        if (self.config.minTime !== undefined)
            self.config.minTime = self.parseDate(self.config.minTime, "H:i");
        if (self.config.maxTime !== undefined)
            self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
        self.minDateHasTime =
            !!self.config.minDate &&
                (self.config.minDate.getHours() > 0 ||
                    self.config.minDate.getMinutes() > 0 ||
                    self.config.minDate.getSeconds() > 0);
        self.maxDateHasTime =
            !!self.config.maxDate &&
                (self.config.maxDate.getHours() > 0 ||
                    self.config.maxDate.getMinutes() > 0 ||
                    self.config.maxDate.getSeconds() > 0);
    }
    function setupInputs() {
        self.input = getInputElem();
        if (!self.input) {
            self.config.errorHandler(new Error("Invalid input element specified"));
            return;
        }
        self.input._type = self.input.type;
        self.input.type = "text";
        self.input.classList.add("flatpickr-input");
        self._input = self.input;
        if (self.config.altInput) {
            self.altInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)(self.input.nodeName, self.config.altInputClass);
            self._input = self.altInput;
            self.altInput.placeholder = self.input.placeholder;
            self.altInput.disabled = self.input.disabled;
            self.altInput.required = self.input.required;
            self.altInput.tabIndex = self.input.tabIndex;
            self.altInput.type = "text";
            self.input.setAttribute("type", "hidden");
            if (!self.config.static && self.input.parentNode)
                self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
        }
        if (!self.config.allowInput)
            self._input.setAttribute("readonly", "readonly");
        updatePositionElement();
    }
    function updatePositionElement() {
        self._positionElement = self.config.positionElement || self._input;
    }
    function setupMobile() {
        var inputType = self.config.enableTime
            ? self.config.noCalendar
                ? "time"
                : "datetime-local"
            : "date";
        self.mobileInput = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.createElement)("input", self.input.className + " flatpickr-mobile");
        self.mobileInput.tabIndex = 1;
        self.mobileInput.type = inputType;
        self.mobileInput.disabled = self.input.disabled;
        self.mobileInput.required = self.input.required;
        self.mobileInput.placeholder = self.input.placeholder;
        self.mobileFormatStr =
            inputType === "datetime-local"
                ? "Y-m-d\\TH:i:S"
                : inputType === "date"
                    ? "Y-m-d"
                    : "H:i:S";
        if (self.selectedDates.length > 0) {
            self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
        }
        if (self.config.minDate)
            self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
        if (self.config.maxDate)
            self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
        if (self.input.getAttribute("step"))
            self.mobileInput.step = String(self.input.getAttribute("step"));
        self.input.type = "hidden";
        if (self.altInput !== undefined)
            self.altInput.type = "hidden";
        try {
            if (self.input.parentNode)
                self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
        }
        catch (_a) { }
        bind(self.mobileInput, "change", function (e) {
            self.setDate((0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e).value, false, self.mobileFormatStr);
            triggerEvent("onChange");
            triggerEvent("onClose");
        });
    }
    function toggle(e) {
        if (self.isOpen === true)
            return self.close();
        self.open(e);
    }
    function triggerEvent(event, data) {
        if (self.config === undefined)
            return;
        var hooks = self.config[event];
        if (hooks !== undefined && hooks.length > 0) {
            for (var i = 0; hooks[i] && i < hooks.length; i++)
                hooks[i](self.selectedDates, self.input.value, self, data);
        }
        if (event === "onChange") {
            self.input.dispatchEvent(createEvent("change"));
            self.input.dispatchEvent(createEvent("input"));
        }
    }
    function createEvent(name) {
        var e = document.createEvent("Event");
        e.initEvent(name, true, true);
        return e;
    }
    function isDateSelected(date) {
        for (var i = 0; i < self.selectedDates.length; i++) {
            var selectedDate = self.selectedDates[i];
            if (selectedDate instanceof Date &&
                (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(selectedDate, date) === 0)
                return "" + i;
        }
        return false;
    }
    function isDateInRange(date) {
        if (self.config.mode !== "range" || self.selectedDates.length < 2)
            return false;
        return ((0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[0]) >= 0 &&
            (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates)(date, self.selectedDates[1]) <= 0);
    }
    function updateNavigationCurrentMonth() {
        if (self.config.noCalendar || self.isMobile || !self.monthNav)
            return;
        self.yearElements.forEach(function (yearElement, i) {
            var d = new Date(self.currentYear, self.currentMonth, 1);
            d.setMonth(self.currentMonth + i);
            if (self.config.showMonths > 1 ||
                self.config.monthSelectorType === "static") {
                self.monthElements[i].textContent =
                    (0,_utils_formatting__WEBPACK_IMPORTED_MODULE_5__.monthToStr)(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) + " ";
            }
            else {
                self.monthsDropdownContainer.value = d.getMonth().toString();
            }
            yearElement.value = d.getFullYear().toString();
        });
        self._hidePrevMonthArrow =
            self.config.minDate !== undefined &&
                (self.currentYear === self.config.minDate.getFullYear()
                    ? self.currentMonth <= self.config.minDate.getMonth()
                    : self.currentYear < self.config.minDate.getFullYear());
        self._hideNextMonthArrow =
            self.config.maxDate !== undefined &&
                (self.currentYear === self.config.maxDate.getFullYear()
                    ? self.currentMonth + 1 > self.config.maxDate.getMonth()
                    : self.currentYear > self.config.maxDate.getFullYear());
    }
    function getDateStr(specificFormat) {
        var format = specificFormat ||
            (self.config.altInput ? self.config.altFormat : self.config.dateFormat);
        return self.selectedDates
            .map(function (dObj) { return self.formatDate(dObj, format); })
            .filter(function (d, i, arr) {
            return self.config.mode !== "range" ||
                self.config.enableTime ||
                arr.indexOf(d) === i;
        })
            .join(self.config.mode !== "range"
            ? self.config.conjunction
            : self.l10n.rangeSeparator);
    }
    function updateValue(triggerChange) {
        if (triggerChange === void 0) { triggerChange = true; }
        if (self.mobileInput !== undefined && self.mobileFormatStr) {
            self.mobileInput.value =
                self.latestSelectedDateObj !== undefined
                    ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr)
                    : "";
        }
        self.input.value = getDateStr(self.config.dateFormat);
        if (self.altInput !== undefined) {
            self.altInput.value = getDateStr(self.config.altFormat);
        }
        if (triggerChange !== false)
            triggerEvent("onValueUpdate");
    }
    function onMonthNavClick(e) {
        var eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e);
        var isPrevMonth = self.prevMonthNav.contains(eventTarget);
        var isNextMonth = self.nextMonthNav.contains(eventTarget);
        if (isPrevMonth || isNextMonth) {
            changeMonth(isPrevMonth ? -1 : 1);
        }
        else if (self.yearElements.indexOf(eventTarget) >= 0) {
            eventTarget.select();
        }
        else if (eventTarget.classList.contains("arrowUp")) {
            self.changeYear(self.currentYear + 1);
        }
        else if (eventTarget.classList.contains("arrowDown")) {
            self.changeYear(self.currentYear - 1);
        }
    }
    function timeWrapper(e) {
        e.preventDefault();
        var isKeyDown = e.type === "keydown", eventTarget = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_3__.getEventTarget)(e), input = eventTarget;
        if (self.amPM !== undefined && eventTarget === self.amPM) {
            self.amPM.textContent =
                self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(self.amPM.textContent === self.l10n.amPM[0])];
        }
        var min = parseFloat(input.getAttribute("min")), max = parseFloat(input.getAttribute("max")), step = parseFloat(input.getAttribute("step")), curValue = parseInt(input.value, 10), delta = e.delta ||
            (isKeyDown ? (e.which === 38 ? 1 : -1) : 0);
        var newValue = curValue + step * delta;
        if (typeof input.value !== "undefined" && input.value.length === 2) {
            var isHourElem = input === self.hourElement, isMinuteElem = input === self.minuteElement;
            if (newValue < min) {
                newValue =
                    max +
                        newValue +
                        (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(!isHourElem) +
                        ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(isHourElem) && (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(!self.amPM));
                if (isMinuteElem)
                    incrementNumInput(undefined, -1, self.hourElement);
            }
            else if (newValue > max) {
                newValue =
                    input === self.hourElement ? newValue - max - (0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(!self.amPM) : min;
                if (isMinuteElem)
                    incrementNumInput(undefined, 1, self.hourElement);
            }
            if (self.amPM &&
                isHourElem &&
                (step === 1
                    ? newValue + curValue === 23
                    : Math.abs(newValue - curValue) > step)) {
                self.amPM.textContent =
                    self.l10n.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_2__.int)(self.amPM.textContent === self.l10n.amPM[0])];
            }
            input.value = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.pad)(newValue);
        }
    }
    init();
    return self;
}
function _flatpickr(nodeList, config) {
    var nodes = Array.prototype.slice
        .call(nodeList)
        .filter(function (x) { return x instanceof HTMLElement; });
    var instances = [];
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        try {
            if (node.getAttribute("data-fp-omit") !== null)
                continue;
            if (node._flatpickr !== undefined) {
                node._flatpickr.destroy();
                node._flatpickr = undefined;
            }
            node._flatpickr = FlatpickrInstance(node, config || {});
            instances.push(node._flatpickr);
        }
        catch (e) {
            console.error(e);
        }
    }
    return instances.length === 1 ? instances[0] : instances;
}
if (typeof HTMLElement !== "undefined" &&
    typeof HTMLCollection !== "undefined" &&
    typeof NodeList !== "undefined") {
    HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
        return _flatpickr(this, config);
    };
    HTMLElement.prototype.flatpickr = function (config) {
        return _flatpickr([this], config);
    };
}
var flatpickr = function (selector, config) {
    if (typeof selector === "string") {
        return _flatpickr(window.document.querySelectorAll(selector), config);
    }
    else if (selector instanceof Node) {
        return _flatpickr([selector], config);
    }
    else {
        return _flatpickr(selector, config);
    }
};
flatpickr.defaultConfig = {};
flatpickr.l10ns = {
    en: __assign({}, _l10n_default__WEBPACK_IMPORTED_MODULE_1__["default"]),
    default: __assign({}, _l10n_default__WEBPACK_IMPORTED_MODULE_1__["default"]),
};
flatpickr.localize = function (l10n) {
    flatpickr.l10ns.default = __assign(__assign({}, flatpickr.l10ns.default), l10n);
};
flatpickr.setDefaults = function (config) {
    flatpickr.defaultConfig = __assign(__assign({}, flatpickr.defaultConfig), config);
};
flatpickr.parseDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateParser)({});
flatpickr.formatDate = (0,_utils_dates__WEBPACK_IMPORTED_MODULE_4__.createDateFormatter)({});
flatpickr.compareDates = _utils_dates__WEBPACK_IMPORTED_MODULE_4__.compareDates;
if (typeof jQuery !== "undefined" && typeof jQuery.fn !== "undefined") {
    jQuery.fn.flatpickr = function (config) {
        return _flatpickr(this, config);
    };
}
Date.prototype.fp_incr = function (days) {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
};
if (typeof window !== "undefined") {
    window.flatpickr = flatpickr;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (flatpickr);


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/l10n/default.js":
/*!*********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/l10n/default.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   english: () => (/* binding */ english)
/* harmony export */ });
var english = {
    weekdays: {
        shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        longhand: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
    },
    months: {
        shorthand: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        longhand: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
    },
    daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    firstDayOfWeek: 0,
    ordinal: function (nth) {
        var s = nth % 100;
        if (s > 3 && s < 21)
            return "th";
        switch (s % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    },
    rangeSeparator: " to ",
    weekAbbreviation: "Wk",
    scrollTitle: "Scroll to increment",
    toggleTitle: "Click to toggle",
    amPM: ["AM", "PM"],
    yearAriaLabel: "Year",
    monthAriaLabel: "Month",
    hourAriaLabel: "Hour",
    minuteAriaLabel: "Minute",
    time_24hr: false,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (english);


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/types/options.js":
/*!**********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/types/options.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HOOKS: () => (/* binding */ HOOKS),
/* harmony export */   defaults: () => (/* binding */ defaults)
/* harmony export */ });
var HOOKS = [
    "onChange",
    "onClose",
    "onDayCreate",
    "onDestroy",
    "onKeyDown",
    "onMonthChange",
    "onOpen",
    "onParseConfig",
    "onReady",
    "onValueUpdate",
    "onYearChange",
    "onPreCalendarPosition",
];
var defaults = {
    _disable: [],
    allowInput: false,
    allowInvalidPreload: false,
    altFormat: "F j, Y",
    altInput: false,
    altInputClass: "form-control input",
    animate: typeof window === "object" &&
        window.navigator.userAgent.indexOf("MSIE") === -1,
    ariaDateFormat: "F j, Y",
    autoFillDefaultTime: true,
    clickOpens: true,
    closeOnSelect: true,
    conjunction: ", ",
    dateFormat: "Y-m-d",
    defaultHour: 12,
    defaultMinute: 0,
    defaultSeconds: 0,
    disable: [],
    disableMobile: false,
    enableSeconds: false,
    enableTime: false,
    errorHandler: function (err) {
        return typeof console !== "undefined" && console.warn(err);
    },
    getWeek: function (givenDate) {
        var date = new Date(givenDate.getTime());
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        var week1 = new Date(date.getFullYear(), 0, 4);
        return (1 +
            Math.round(((date.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
                7));
    },
    hourIncrement: 1,
    ignoredFocusElements: [],
    inline: false,
    locale: "default",
    minuteIncrement: 5,
    mode: "single",
    monthSelectorType: "dropdown",
    nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
    noCalendar: false,
    now: new Date(),
    onChange: [],
    onClose: [],
    onDayCreate: [],
    onDestroy: [],
    onKeyDown: [],
    onMonthChange: [],
    onOpen: [],
    onParseConfig: [],
    onReady: [],
    onValueUpdate: [],
    onYearChange: [],
    onPreCalendarPosition: [],
    plugins: [],
    position: "auto",
    positionElement: undefined,
    prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
    shorthandCurrentMonth: false,
    showMonths: 1,
    static: false,
    time_24hr: false,
    weekNumbers: false,
    wrap: false,
};


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/dates.js":
/*!********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/dates.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateSecondsSinceMidnight: () => (/* binding */ calculateSecondsSinceMidnight),
/* harmony export */   compareDates: () => (/* binding */ compareDates),
/* harmony export */   compareTimes: () => (/* binding */ compareTimes),
/* harmony export */   createDateFormatter: () => (/* binding */ createDateFormatter),
/* harmony export */   createDateParser: () => (/* binding */ createDateParser),
/* harmony export */   duration: () => (/* binding */ duration),
/* harmony export */   getDefaultHours: () => (/* binding */ getDefaultHours),
/* harmony export */   isBetween: () => (/* binding */ isBetween),
/* harmony export */   parseSeconds: () => (/* binding */ parseSeconds)
/* harmony export */ });
/* harmony import */ var _formatting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./formatting */ "./node_modules/flatpickr/dist/esm/utils/formatting.js");
/* harmony import */ var _types_options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types/options */ "./node_modules/flatpickr/dist/esm/types/options.js");
/* harmony import */ var _l10n_default__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../l10n/default */ "./node_modules/flatpickr/dist/esm/l10n/default.js");



var createDateFormatter = function (_a) {
    var _b = _a.config, config = _b === void 0 ? _types_options__WEBPACK_IMPORTED_MODULE_1__.defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? _l10n_default__WEBPACK_IMPORTED_MODULE_2__.english : _c, _d = _a.isMobile, isMobile = _d === void 0 ? false : _d;
    return function (dateObj, frmt, overrideLocale) {
        var locale = overrideLocale || l10n;
        if (config.formatDate !== undefined && !isMobile) {
            return config.formatDate(dateObj, frmt, locale);
        }
        return frmt
            .split("")
            .map(function (c, i, arr) {
            return _formatting__WEBPACK_IMPORTED_MODULE_0__.formats[c] && arr[i - 1] !== "\\"
                ? _formatting__WEBPACK_IMPORTED_MODULE_0__.formats[c](dateObj, locale, config)
                : c !== "\\"
                    ? c
                    : "";
        })
            .join("");
    };
};
var createDateParser = function (_a) {
    var _b = _a.config, config = _b === void 0 ? _types_options__WEBPACK_IMPORTED_MODULE_1__.defaults : _b, _c = _a.l10n, l10n = _c === void 0 ? _l10n_default__WEBPACK_IMPORTED_MODULE_2__.english : _c;
    return function (date, givenFormat, timeless, customLocale) {
        if (date !== 0 && !date)
            return undefined;
        var locale = customLocale || l10n;
        var parsedDate;
        var dateOrig = date;
        if (date instanceof Date)
            parsedDate = new Date(date.getTime());
        else if (typeof date !== "string" &&
            date.toFixed !== undefined)
            parsedDate = new Date(date);
        else if (typeof date === "string") {
            var format = givenFormat || (config || _types_options__WEBPACK_IMPORTED_MODULE_1__.defaults).dateFormat;
            var datestr = String(date).trim();
            if (datestr === "today") {
                parsedDate = new Date();
                timeless = true;
            }
            else if (config && config.parseDate) {
                parsedDate = config.parseDate(date, format);
            }
            else if (/Z$/.test(datestr) ||
                /GMT$/.test(datestr)) {
                parsedDate = new Date(date);
            }
            else {
                var matched = void 0, ops = [];
                for (var i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
                    var token = format[i];
                    var isBackSlash = token === "\\";
                    var escaped = format[i - 1] === "\\" || isBackSlash;
                    if (_formatting__WEBPACK_IMPORTED_MODULE_0__.tokenRegex[token] && !escaped) {
                        regexStr += _formatting__WEBPACK_IMPORTED_MODULE_0__.tokenRegex[token];
                        var match = new RegExp(regexStr).exec(date);
                        if (match && (matched = true)) {
                            ops[token !== "Y" ? "push" : "unshift"]({
                                fn: _formatting__WEBPACK_IMPORTED_MODULE_0__.revFormat[token],
                                val: match[++matchIndex],
                            });
                        }
                    }
                    else if (!isBackSlash)
                        regexStr += ".";
                }
                parsedDate =
                    !config || !config.noCalendar
                        ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
                        : new Date(new Date().setHours(0, 0, 0, 0));
                ops.forEach(function (_a) {
                    var fn = _a.fn, val = _a.val;
                    return (parsedDate = fn(parsedDate, val, locale) || parsedDate);
                });
                parsedDate = matched ? parsedDate : undefined;
            }
        }
        if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
            config.errorHandler(new Error("Invalid date provided: " + dateOrig));
            return undefined;
        }
        if (timeless === true)
            parsedDate.setHours(0, 0, 0, 0);
        return parsedDate;
    };
};
function compareDates(date1, date2, timeless) {
    if (timeless === void 0) { timeless = true; }
    if (timeless !== false) {
        return (new Date(date1.getTime()).setHours(0, 0, 0, 0) -
            new Date(date2.getTime()).setHours(0, 0, 0, 0));
    }
    return date1.getTime() - date2.getTime();
}
function compareTimes(date1, date2) {
    return (3600 * (date1.getHours() - date2.getHours()) +
        60 * (date1.getMinutes() - date2.getMinutes()) +
        date1.getSeconds() -
        date2.getSeconds());
}
var isBetween = function (ts, ts1, ts2) {
    return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
};
var calculateSecondsSinceMidnight = function (hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
};
var parseSeconds = function (secondsSinceMidnight) {
    var hours = Math.floor(secondsSinceMidnight / 3600), minutes = (secondsSinceMidnight - hours * 3600) / 60;
    return [hours, minutes, secondsSinceMidnight - hours * 3600 - minutes * 60];
};
var duration = {
    DAY: 86400000,
};
function getDefaultHours(config) {
    var hours = config.defaultHour;
    var minutes = config.defaultMinute;
    var seconds = config.defaultSeconds;
    if (config.minDate !== undefined) {
        var minHour = config.minDate.getHours();
        var minMinutes = config.minDate.getMinutes();
        var minSeconds = config.minDate.getSeconds();
        if (hours < minHour) {
            hours = minHour;
        }
        if (hours === minHour && minutes < minMinutes) {
            minutes = minMinutes;
        }
        if (hours === minHour && minutes === minMinutes && seconds < minSeconds)
            seconds = config.minDate.getSeconds();
    }
    if (config.maxDate !== undefined) {
        var maxHr = config.maxDate.getHours();
        var maxMinutes = config.maxDate.getMinutes();
        hours = Math.min(hours, maxHr);
        if (hours === maxHr)
            minutes = Math.min(maxMinutes, minutes);
        if (hours === maxHr && minutes === maxMinutes)
            seconds = config.maxDate.getSeconds();
    }
    return { hours: hours, minutes: minutes, seconds: seconds };
}


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/dom.js":
/*!******************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/dom.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearNode: () => (/* binding */ clearNode),
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   createNumberInput: () => (/* binding */ createNumberInput),
/* harmony export */   findParent: () => (/* binding */ findParent),
/* harmony export */   getEventTarget: () => (/* binding */ getEventTarget),
/* harmony export */   toggleClass: () => (/* binding */ toggleClass)
/* harmony export */ });
function toggleClass(elem, className, bool) {
    if (bool === true)
        return elem.classList.add(className);
    elem.classList.remove(className);
}
function createElement(tag, className, content) {
    var e = window.document.createElement(tag);
    className = className || "";
    content = content || "";
    e.className = className;
    if (content !== undefined)
        e.textContent = content;
    return e;
}
function clearNode(node) {
    while (node.firstChild)
        node.removeChild(node.firstChild);
}
function findParent(node, condition) {
    if (condition(node))
        return node;
    else if (node.parentNode)
        return findParent(node.parentNode, condition);
    return undefined;
}
function createNumberInput(inputClassName, opts) {
    var wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
    if (navigator.userAgent.indexOf("MSIE 9.0") === -1) {
        numInput.type = "number";
    }
    else {
        numInput.type = "text";
        numInput.pattern = "\\d*";
    }
    if (opts !== undefined)
        for (var key in opts)
            numInput.setAttribute(key, opts[key]);
    wrapper.appendChild(numInput);
    wrapper.appendChild(arrowUp);
    wrapper.appendChild(arrowDown);
    return wrapper;
}
function getEventTarget(event) {
    try {
        if (typeof event.composedPath === "function") {
            var path = event.composedPath();
            return path[0];
        }
        return event.target;
    }
    catch (error) {
        return event.target;
    }
}


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/formatting.js":
/*!*************************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/formatting.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formats: () => (/* binding */ formats),
/* harmony export */   monthToStr: () => (/* binding */ monthToStr),
/* harmony export */   revFormat: () => (/* binding */ revFormat),
/* harmony export */   tokenRegex: () => (/* binding */ tokenRegex)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./node_modules/flatpickr/dist/esm/utils/index.js");

var doNothing = function () { return undefined; };
var monthToStr = function (monthNumber, shorthand, locale) { return locale.months[shorthand ? "shorthand" : "longhand"][monthNumber]; };
var revFormat = {
    D: doNothing,
    F: function (dateObj, monthName, locale) {
        dateObj.setMonth(locale.months.longhand.indexOf(monthName));
    },
    G: function (dateObj, hour) {
        dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    H: function (dateObj, hour) {
        dateObj.setHours(parseFloat(hour));
    },
    J: function (dateObj, day) {
        dateObj.setDate(parseFloat(day));
    },
    K: function (dateObj, amPM, locale) {
        dateObj.setHours((dateObj.getHours() % 12) +
            12 * (0,_utils__WEBPACK_IMPORTED_MODULE_0__.int)(new RegExp(locale.amPM[1], "i").test(amPM)));
    },
    M: function (dateObj, shortMonth, locale) {
        dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
    },
    S: function (dateObj, seconds) {
        dateObj.setSeconds(parseFloat(seconds));
    },
    U: function (_, unixSeconds) { return new Date(parseFloat(unixSeconds) * 1000); },
    W: function (dateObj, weekNum, locale) {
        var weekNumber = parseInt(weekNum);
        var date = new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
        date.setDate(date.getDate() - date.getDay() + locale.firstDayOfWeek);
        return date;
    },
    Y: function (dateObj, year) {
        dateObj.setFullYear(parseFloat(year));
    },
    Z: function (_, ISODate) { return new Date(ISODate); },
    d: function (dateObj, day) {
        dateObj.setDate(parseFloat(day));
    },
    h: function (dateObj, hour) {
        dateObj.setHours((dateObj.getHours() >= 12 ? 12 : 0) + parseFloat(hour));
    },
    i: function (dateObj, minutes) {
        dateObj.setMinutes(parseFloat(minutes));
    },
    j: function (dateObj, day) {
        dateObj.setDate(parseFloat(day));
    },
    l: doNothing,
    m: function (dateObj, month) {
        dateObj.setMonth(parseFloat(month) - 1);
    },
    n: function (dateObj, month) {
        dateObj.setMonth(parseFloat(month) - 1);
    },
    s: function (dateObj, seconds) {
        dateObj.setSeconds(parseFloat(seconds));
    },
    u: function (_, unixMillSeconds) {
        return new Date(parseFloat(unixMillSeconds));
    },
    w: doNothing,
    y: function (dateObj, year) {
        dateObj.setFullYear(2000 + parseFloat(year));
    },
};
var tokenRegex = {
    D: "",
    F: "",
    G: "(\\d\\d|\\d)",
    H: "(\\d\\d|\\d)",
    J: "(\\d\\d|\\d)\\w+",
    K: "",
    M: "",
    S: "(\\d\\d|\\d)",
    U: "(.+)",
    W: "(\\d\\d|\\d)",
    Y: "(\\d{4})",
    Z: "(.+)",
    d: "(\\d\\d|\\d)",
    h: "(\\d\\d|\\d)",
    i: "(\\d\\d|\\d)",
    j: "(\\d\\d|\\d)",
    l: "",
    m: "(\\d\\d|\\d)",
    n: "(\\d\\d|\\d)",
    s: "(\\d\\d|\\d)",
    u: "(.+)",
    w: "(\\d\\d|\\d)",
    y: "(\\d{2})",
};
var formats = {
    Z: function (date) { return date.toISOString(); },
    D: function (date, locale, options) {
        return locale.weekdays.shorthand[formats.w(date, locale, options)];
    },
    F: function (date, locale, options) {
        return monthToStr(formats.n(date, locale, options) - 1, false, locale);
    },
    G: function (date, locale, options) {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(formats.h(date, locale, options));
    },
    H: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getHours()); },
    J: function (date, locale) {
        return locale.ordinal !== undefined
            ? date.getDate() + locale.ordinal(date.getDate())
            : date.getDate();
    },
    K: function (date, locale) { return locale.amPM[(0,_utils__WEBPACK_IMPORTED_MODULE_0__.int)(date.getHours() > 11)]; },
    M: function (date, locale) {
        return monthToStr(date.getMonth(), true, locale);
    },
    S: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getSeconds()); },
    U: function (date) { return date.getTime() / 1000; },
    W: function (date, _, options) {
        return options.getWeek(date);
    },
    Y: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getFullYear(), 4); },
    d: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getDate()); },
    h: function (date) { return (date.getHours() % 12 ? date.getHours() % 12 : 12); },
    i: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getMinutes()); },
    j: function (date) { return date.getDate(); },
    l: function (date, locale) {
        return locale.weekdays.longhand[date.getDay()];
    },
    m: function (date) { return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.pad)(date.getMonth() + 1); },
    n: function (date) { return date.getMonth() + 1; },
    s: function (date) { return date.getSeconds(); },
    u: function (date) { return date.getTime(); },
    w: function (date) { return date.getDay(); },
    y: function (date) { return String(date.getFullYear()).substring(2); },
};


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/index.js":
/*!********************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayify: () => (/* binding */ arrayify),
/* harmony export */   debounce: () => (/* binding */ debounce),
/* harmony export */   int: () => (/* binding */ int),
/* harmony export */   pad: () => (/* binding */ pad)
/* harmony export */ });
var pad = function (number, length) {
    if (length === void 0) { length = 2; }
    return ("000" + number).slice(length * -1);
};
var int = function (bool) { return (bool === true ? 1 : 0); };
function debounce(fn, wait) {
    var t;
    return function () {
        var _this = this;
        var args = arguments;
        clearTimeout(t);
        t = setTimeout(function () { return fn.apply(_this, args); }, wait);
    };
}
var arrayify = function (obj) {
    return obj instanceof Array ? obj : [obj];
};


/***/ }),

/***/ "./node_modules/flatpickr/dist/esm/utils/polyfills.js":
/*!************************************************************!*\
  !*** ./node_modules/flatpickr/dist/esm/utils/polyfills.js ***!
  \************************************************************/
/***/ (() => {

"use strict";

if (typeof Object.assign !== "function") {
    Object.assign = function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!target) {
            throw TypeError("Cannot convert undefined or null to object");
        }
        var _loop_1 = function (source) {
            if (source) {
                Object.keys(source).forEach(function (key) { return (target[key] = source[key]); });
            }
        };
        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
            var source = args_1[_a];
            _loop_1(source);
        }
        return target;
    };
}


/***/ }),

/***/ "./node_modules/flatpickr/dist/l10n/pl.js":
/*!************************************************!*\
  !*** ./node_modules/flatpickr/dist/l10n/pl.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
   true ? factory(exports) :
  0;
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Polish = {
      weekdays: {
          shorthand: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
          longhand: [
              "Niedziela",
              "Poniedziałek",
              "Wtorek",
              "Środa",
              "Czwartek",
              "Piątek",
              "Sobota",
          ],
      },
      months: {
          shorthand: [
              "Sty",
              "Lut",
              "Mar",
              "Kwi",
              "Maj",
              "Cze",
              "Lip",
              "Sie",
              "Wrz",
              "Paź",
              "Lis",
              "Gru",
          ],
          longhand: [
              "Styczeń",
              "Luty",
              "Marzec",
              "Kwiecień",
              "Maj",
              "Czerwiec",
              "Lipiec",
              "Sierpień",
              "Wrzesień",
              "Październik",
              "Listopad",
              "Grudzień",
          ],
      },
      rangeSeparator: " do ",
      weekAbbreviation: "tydz.",
      scrollTitle: "Przewiń, aby zwiększyć",
      toggleTitle: "Kliknij, aby przełączyć",
      firstDayOfWeek: 1,
      time_24hr: true,
      ordinal: function () {
          return ".";
      },
  };
  fp.l10ns.pl = Polish;
  var pl = fp.l10ns;

  exports.Polish = Polish;
  exports.default = pl;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),

/***/ "./node_modules/tippy.js/dist/tippy.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/tippy.js/dist/tippy.esm.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   animateFill: () => (/* binding */ animateFill),
/* harmony export */   createSingleton: () => (/* binding */ createSingleton),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   delegate: () => (/* binding */ delegate),
/* harmony export */   followCursor: () => (/* binding */ followCursor),
/* harmony export */   hideAll: () => (/* binding */ hideAll),
/* harmony export */   inlinePositioning: () => (/* binding */ inlinePositioning),
/* harmony export */   roundArrow: () => (/* binding */ ROUND_ARROW),
/* harmony export */   sticky: () => (/* binding */ sticky)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/**!
* tippy.js v6.3.7
* (c) 2017-2021 atomiks
* MIT License
*/


var ROUND_ARROW = '<svg width="16" height="6" xmlns="http://www.w3.org/2000/svg"><path d="M0 6s1.796-.013 4.67-3.615C5.851.9 6.93.006 8 0c1.07-.006 2.148.887 3.343 2.385C14.233 6.005 16 6 16 6H0z"></svg>';
var BOX_CLASS = "tippy-box";
var CONTENT_CLASS = "tippy-content";
var BACKDROP_CLASS = "tippy-backdrop";
var ARROW_CLASS = "tippy-arrow";
var SVG_ARROW_CLASS = "tippy-svg-arrow";
var TOUCH_OPTIONS = {
  passive: true,
  capture: true
};
var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO() {
  return document.body;
};

function hasOwnProperty(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}
function getValueAtIndexOrReturn(value, index, defaultValue) {
  if (Array.isArray(value)) {
    var v = value[index];
    return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
  }

  return value;
}
function isType(value, type) {
  var str = {}.toString.call(value);
  return str.indexOf('[object') === 0 && str.indexOf(type + "]") > -1;
}
function invokeWithArgsOrReturn(value, args) {
  return typeof value === 'function' ? value.apply(void 0, args) : value;
}
function debounce(fn, ms) {
  // Avoid wrapping in `setTimeout` if ms is 0 anyway
  if (ms === 0) {
    return fn;
  }

  var timeout;
  return function (arg) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn(arg);
    }, ms);
  };
}
function removeProperties(obj, keys) {
  var clone = Object.assign({}, obj);
  keys.forEach(function (key) {
    delete clone[key];
  });
  return clone;
}
function splitBySpaces(value) {
  return value.split(/\s+/).filter(Boolean);
}
function normalizeToArray(value) {
  return [].concat(value);
}
function pushIfUnique(arr, value) {
  if (arr.indexOf(value) === -1) {
    arr.push(value);
  }
}
function unique(arr) {
  return arr.filter(function (item, index) {
    return arr.indexOf(item) === index;
  });
}
function getBasePlacement(placement) {
  return placement.split('-')[0];
}
function arrayFrom(value) {
  return [].slice.call(value);
}
function removeUndefinedProps(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

function div() {
  return document.createElement('div');
}
function isElement(value) {
  return ['Element', 'Fragment'].some(function (type) {
    return isType(value, type);
  });
}
function isNodeList(value) {
  return isType(value, 'NodeList');
}
function isMouseEvent(value) {
  return isType(value, 'MouseEvent');
}
function isReferenceElement(value) {
  return !!(value && value._tippy && value._tippy.reference === value);
}
function getArrayOfElements(value) {
  if (isElement(value)) {
    return [value];
  }

  if (isNodeList(value)) {
    return arrayFrom(value);
  }

  if (Array.isArray(value)) {
    return value;
  }

  return arrayFrom(document.querySelectorAll(value));
}
function setTransitionDuration(els, value) {
  els.forEach(function (el) {
    if (el) {
      el.style.transitionDuration = value + "ms";
    }
  });
}
function setVisibilityState(els, state) {
  els.forEach(function (el) {
    if (el) {
      el.setAttribute('data-state', state);
    }
  });
}
function getOwnerDocument(elementOrElements) {
  var _element$ownerDocumen;

  var _normalizeToArray = normalizeToArray(elementOrElements),
      element = _normalizeToArray[0]; // Elements created via a <template> have an ownerDocument with no reference to the body


  return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
}
function isCursorOutsideInteractiveBorder(popperTreeData, event) {
  var clientX = event.clientX,
      clientY = event.clientY;
  return popperTreeData.every(function (_ref) {
    var popperRect = _ref.popperRect,
        popperState = _ref.popperState,
        props = _ref.props;
    var interactiveBorder = props.interactiveBorder;
    var basePlacement = getBasePlacement(popperState.placement);
    var offsetData = popperState.modifiersData.offset;

    if (!offsetData) {
      return true;
    }

    var topDistance = basePlacement === 'bottom' ? offsetData.top.y : 0;
    var bottomDistance = basePlacement === 'top' ? offsetData.bottom.y : 0;
    var leftDistance = basePlacement === 'right' ? offsetData.left.x : 0;
    var rightDistance = basePlacement === 'left' ? offsetData.right.x : 0;
    var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
    var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
    var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
    var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
  });
}
function updateTransitionEndListener(box, action, listener) {
  var method = action + "EventListener"; // some browsers apparently support `transition` (unprefixed) but only fire
  // `webkitTransitionEnd`...

  ['transitionend', 'webkitTransitionEnd'].forEach(function (event) {
    box[method](event, listener);
  });
}
/**
 * Compared to xxx.contains, this function works for dom structures with shadow
 * dom
 */

function actualContains(parent, child) {
  var target = child;

  while (target) {
    var _target$getRootNode;

    if (parent.contains(target)) {
      return true;
    }

    target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
  }

  return false;
}

var currentInput = {
  isTouch: false
};
var lastMouseMoveTime = 0;
/**
 * When a `touchstart` event is fired, it's assumed the user is using touch
 * input. We'll bind a `mousemove` event listener to listen for mouse input in
 * the future. This way, the `isTouch` property is fully dynamic and will handle
 * hybrid devices that use a mix of touch + mouse input.
 */

function onDocumentTouchStart() {
  if (currentInput.isTouch) {
    return;
  }

  currentInput.isTouch = true;

  if (window.performance) {
    document.addEventListener('mousemove', onDocumentMouseMove);
  }
}
/**
 * When two `mousemove` event are fired consecutively within 20ms, it's assumed
 * the user is using mouse input again. `mousemove` can fire on touch devices as
 * well, but very rarely that quickly.
 */

function onDocumentMouseMove() {
  var now = performance.now();

  if (now - lastMouseMoveTime < 20) {
    currentInput.isTouch = false;
    document.removeEventListener('mousemove', onDocumentMouseMove);
  }

  lastMouseMoveTime = now;
}
/**
 * When an element is in focus and has a tippy, leaving the tab/window and
 * returning causes it to show again. For mouse users this is unexpected, but
 * for keyboard use it makes sense.
 * TODO: find a better technique to solve this problem
 */

function onWindowBlur() {
  var activeElement = document.activeElement;

  if (isReferenceElement(activeElement)) {
    var instance = activeElement._tippy;

    if (activeElement.blur && !instance.state.isVisible) {
      activeElement.blur();
    }
  }
}
function bindGlobalEventListeners() {
  document.addEventListener('touchstart', onDocumentTouchStart, TOUCH_OPTIONS);
  window.addEventListener('blur', onWindowBlur);
}

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
var isIE11 = isBrowser ? // @ts-ignore
!!window.msCrypto : false;

function createMemoryLeakWarning(method) {
  var txt = method === 'destroy' ? 'n already-' : ' ';
  return [method + "() was called on a" + txt + "destroyed instance. This is a no-op but", 'indicates a potential memory leak.'].join(' ');
}
function clean(value) {
  var spacesAndTabs = /[ \t]{2,}/g;
  var lineStartWithSpaces = /^[ \t]*/gm;
  return value.replace(spacesAndTabs, ' ').replace(lineStartWithSpaces, '').trim();
}

function getDevMessage(message) {
  return clean("\n  %ctippy.js\n\n  %c" + clean(message) + "\n\n  %c\uD83D\uDC77\u200D This is a development-only message. It will be removed in production.\n  ");
}

function getFormattedMessage(message) {
  return [getDevMessage(message), // title
  'color: #00C584; font-size: 1.3em; font-weight: bold;', // message
  'line-height: 1.5', // footer
  'color: #a6a095;'];
} // Assume warnings and errors never have the same message

var visitedMessages;

if (true) {
  resetVisitedMessages();
}

function resetVisitedMessages() {
  visitedMessages = new Set();
}
function warnWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console;

    visitedMessages.add(message);

    (_console = console).warn.apply(_console, getFormattedMessage(message));
  }
}
function errorWhen(condition, message) {
  if (condition && !visitedMessages.has(message)) {
    var _console2;

    visitedMessages.add(message);

    (_console2 = console).error.apply(_console2, getFormattedMessage(message));
  }
}
function validateTargets(targets) {
  var didPassFalsyValue = !targets;
  var didPassPlainObject = Object.prototype.toString.call(targets) === '[object Object]' && !targets.addEventListener;
  errorWhen(didPassFalsyValue, ['tippy() was passed', '`' + String(targets) + '`', 'as its targets (first) argument. Valid types are: String, Element,', 'Element[], or NodeList.'].join(' '));
  errorWhen(didPassPlainObject, ['tippy() was passed a plain object which is not supported as an argument', 'for virtual positioning. Use props.getReferenceClientRect instead.'].join(' '));
}

var pluginProps = {
  animateFill: false,
  followCursor: false,
  inlinePositioning: false,
  sticky: false
};
var renderProps = {
  allowHTML: false,
  animation: 'fade',
  arrow: true,
  content: '',
  inertia: false,
  maxWidth: 350,
  role: 'tooltip',
  theme: '',
  zIndex: 9999
};
var defaultProps = Object.assign({
  appendTo: TIPPY_DEFAULT_APPEND_TO,
  aria: {
    content: 'auto',
    expanded: 'auto'
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: true,
  ignoreAttributes: false,
  interactive: false,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: '',
  offset: [0, 10],
  onAfterUpdate: function onAfterUpdate() {},
  onBeforeUpdate: function onBeforeUpdate() {},
  onCreate: function onCreate() {},
  onDestroy: function onDestroy() {},
  onHidden: function onHidden() {},
  onHide: function onHide() {},
  onMount: function onMount() {},
  onShow: function onShow() {},
  onShown: function onShown() {},
  onTrigger: function onTrigger() {},
  onUntrigger: function onUntrigger() {},
  onClickOutside: function onClickOutside() {},
  placement: 'top',
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: false,
  touch: true,
  trigger: 'mouseenter focus',
  triggerTarget: null
}, pluginProps, renderProps);
var defaultKeys = Object.keys(defaultProps);
var setDefaultProps = function setDefaultProps(partialProps) {
  /* istanbul ignore else */
  if (true) {
    validateProps(partialProps, []);
  }

  var keys = Object.keys(partialProps);
  keys.forEach(function (key) {
    defaultProps[key] = partialProps[key];
  });
};
function getExtendedPassedProps(passedProps) {
  var plugins = passedProps.plugins || [];
  var pluginProps = plugins.reduce(function (acc, plugin) {
    var name = plugin.name,
        defaultValue = plugin.defaultValue;

    if (name) {
      var _name;

      acc[name] = passedProps[name] !== undefined ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
    }

    return acc;
  }, {});
  return Object.assign({}, passedProps, pluginProps);
}
function getDataAttributeProps(reference, plugins) {
  var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
    plugins: plugins
  }))) : defaultKeys;
  var props = propKeys.reduce(function (acc, key) {
    var valueAsString = (reference.getAttribute("data-tippy-" + key) || '').trim();

    if (!valueAsString) {
      return acc;
    }

    if (key === 'content') {
      acc[key] = valueAsString;
    } else {
      try {
        acc[key] = JSON.parse(valueAsString);
      } catch (e) {
        acc[key] = valueAsString;
      }
    }

    return acc;
  }, {});
  return props;
}
function evaluateProps(reference, props) {
  var out = Object.assign({}, props, {
    content: invokeWithArgsOrReturn(props.content, [reference])
  }, props.ignoreAttributes ? {} : getDataAttributeProps(reference, props.plugins));
  out.aria = Object.assign({}, defaultProps.aria, out.aria);
  out.aria = {
    expanded: out.aria.expanded === 'auto' ? props.interactive : out.aria.expanded,
    content: out.aria.content === 'auto' ? props.interactive ? null : 'describedby' : out.aria.content
  };
  return out;
}
function validateProps(partialProps, plugins) {
  if (partialProps === void 0) {
    partialProps = {};
  }

  if (plugins === void 0) {
    plugins = [];
  }

  var keys = Object.keys(partialProps);
  keys.forEach(function (prop) {
    var nonPluginProps = removeProperties(defaultProps, Object.keys(pluginProps));
    var didPassUnknownProp = !hasOwnProperty(nonPluginProps, prop); // Check if the prop exists in `plugins`

    if (didPassUnknownProp) {
      didPassUnknownProp = plugins.filter(function (plugin) {
        return plugin.name === prop;
      }).length === 0;
    }

    warnWhen(didPassUnknownProp, ["`" + prop + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", 'a plugin, forgot to pass it in an array as props.plugins.', '\n\n', 'All props: https://atomiks.github.io/tippyjs/v6/all-props/\n', 'Plugins: https://atomiks.github.io/tippyjs/v6/plugins/'].join(' '));
  });
}

var innerHTML = function innerHTML() {
  return 'innerHTML';
};

function dangerouslySetInnerHTML(element, html) {
  element[innerHTML()] = html;
}

function createArrowElement(value) {
  var arrow = div();

  if (value === true) {
    arrow.className = ARROW_CLASS;
  } else {
    arrow.className = SVG_ARROW_CLASS;

    if (isElement(value)) {
      arrow.appendChild(value);
    } else {
      dangerouslySetInnerHTML(arrow, value);
    }
  }

  return arrow;
}

function setContent(content, props) {
  if (isElement(props.content)) {
    dangerouslySetInnerHTML(content, '');
    content.appendChild(props.content);
  } else if (typeof props.content !== 'function') {
    if (props.allowHTML) {
      dangerouslySetInnerHTML(content, props.content);
    } else {
      content.textContent = props.content;
    }
  }
}
function getChildren(popper) {
  var box = popper.firstElementChild;
  var boxChildren = arrayFrom(box.children);
  return {
    box: box,
    content: boxChildren.find(function (node) {
      return node.classList.contains(CONTENT_CLASS);
    }),
    arrow: boxChildren.find(function (node) {
      return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
    }),
    backdrop: boxChildren.find(function (node) {
      return node.classList.contains(BACKDROP_CLASS);
    })
  };
}
function render(instance) {
  var popper = div();
  var box = div();
  box.className = BOX_CLASS;
  box.setAttribute('data-state', 'hidden');
  box.setAttribute('tabindex', '-1');
  var content = div();
  content.className = CONTENT_CLASS;
  content.setAttribute('data-state', 'hidden');
  setContent(content, instance.props);
  popper.appendChild(box);
  box.appendChild(content);
  onUpdate(instance.props, instance.props);

  function onUpdate(prevProps, nextProps) {
    var _getChildren = getChildren(popper),
        box = _getChildren.box,
        content = _getChildren.content,
        arrow = _getChildren.arrow;

    if (nextProps.theme) {
      box.setAttribute('data-theme', nextProps.theme);
    } else {
      box.removeAttribute('data-theme');
    }

    if (typeof nextProps.animation === 'string') {
      box.setAttribute('data-animation', nextProps.animation);
    } else {
      box.removeAttribute('data-animation');
    }

    if (nextProps.inertia) {
      box.setAttribute('data-inertia', '');
    } else {
      box.removeAttribute('data-inertia');
    }

    box.style.maxWidth = typeof nextProps.maxWidth === 'number' ? nextProps.maxWidth + "px" : nextProps.maxWidth;

    if (nextProps.role) {
      box.setAttribute('role', nextProps.role);
    } else {
      box.removeAttribute('role');
    }

    if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
      setContent(content, instance.props);
    }

    if (nextProps.arrow) {
      if (!arrow) {
        box.appendChild(createArrowElement(nextProps.arrow));
      } else if (prevProps.arrow !== nextProps.arrow) {
        box.removeChild(arrow);
        box.appendChild(createArrowElement(nextProps.arrow));
      }
    } else if (arrow) {
      box.removeChild(arrow);
    }
  }

  return {
    popper: popper,
    onUpdate: onUpdate
  };
} // Runtime check to identify if the render function is the default one; this
// way we can apply default CSS transitions logic and it can be tree-shaken away

render.$$tippy = true;

var idCounter = 1;
var mouseMoveListeners = []; // Used by `hideAll()`

var mountedInstances = [];
function createTippy(reference, passedProps) {
  var props = evaluateProps(reference, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps)))); // ===========================================================================
  // 🔒 Private members
  // ===========================================================================

  var showTimeout;
  var hideTimeout;
  var scheduleHideAnimationFrame;
  var isVisibleFromClick = false;
  var didHideDueToDocumentMouseDown = false;
  var didTouchMove = false;
  var ignoreOnFirstUpdate = false;
  var lastTriggerEvent;
  var currentTransitionEndListener;
  var onFirstUpdate;
  var listeners = [];
  var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
  var currentTarget; // ===========================================================================
  // 🔑 Public members
  // ===========================================================================

  var id = idCounter++;
  var popperInstance = null;
  var plugins = unique(props.plugins);
  var state = {
    // Is the instance currently enabled?
    isEnabled: true,
    // Is the tippy currently showing and not transitioning out?
    isVisible: false,
    // Has the instance been destroyed?
    isDestroyed: false,
    // Is the tippy currently mounted to the DOM?
    isMounted: false,
    // Has the tippy finished transitioning in?
    isShown: false
  };
  var instance = {
    // properties
    id: id,
    reference: reference,
    popper: div(),
    popperInstance: popperInstance,
    props: props,
    state: state,
    plugins: plugins,
    // methods
    clearDelayTimeouts: clearDelayTimeouts,
    setProps: setProps,
    setContent: setContent,
    show: show,
    hide: hide,
    hideWithInteractivity: hideWithInteractivity,
    enable: enable,
    disable: disable,
    unmount: unmount,
    destroy: destroy
  }; // TODO: Investigate why this early return causes a TDZ error in the tests —
  // it doesn't seem to happen in the browser

  /* istanbul ignore if */

  if (!props.render) {
    if (true) {
      errorWhen(true, 'render() function has not been supplied.');
    }

    return instance;
  } // ===========================================================================
  // Initial mutations
  // ===========================================================================


  var _props$render = props.render(instance),
      popper = _props$render.popper,
      onUpdate = _props$render.onUpdate;

  popper.setAttribute('data-tippy-root', '');
  popper.id = "tippy-" + instance.id;
  instance.popper = popper;
  reference._tippy = instance;
  popper._tippy = instance;
  var pluginsHooks = plugins.map(function (plugin) {
    return plugin.fn(instance);
  });
  var hasAriaExpanded = reference.hasAttribute('aria-expanded');
  addListeners();
  handleAriaExpandedAttribute();
  handleStyles();
  invokeHook('onCreate', [instance]);

  if (props.showOnCreate) {
    scheduleShow();
  } // Prevent a tippy with a delay from hiding if the cursor left then returned
  // before it started hiding


  popper.addEventListener('mouseenter', function () {
    if (instance.props.interactive && instance.state.isVisible) {
      instance.clearDelayTimeouts();
    }
  });
  popper.addEventListener('mouseleave', function () {
    if (instance.props.interactive && instance.props.trigger.indexOf('mouseenter') >= 0) {
      getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    }
  });
  return instance; // ===========================================================================
  // 🔒 Private methods
  // ===========================================================================

  function getNormalizedTouchSettings() {
    var touch = instance.props.touch;
    return Array.isArray(touch) ? touch : [touch, 0];
  }

  function getIsCustomTouchBehavior() {
    return getNormalizedTouchSettings()[0] === 'hold';
  }

  function getIsDefaultRenderFn() {
    var _instance$props$rende;

    // @ts-ignore
    return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
  }

  function getCurrentTarget() {
    return currentTarget || reference;
  }

  function getDocument() {
    var parent = getCurrentTarget().parentNode;
    return parent ? getOwnerDocument(parent) : document;
  }

  function getDefaultTemplateChildren() {
    return getChildren(popper);
  }

  function getDelay(isShow) {
    // For touch or keyboard input, force `0` delay for UX reasons
    // Also if the instance is mounted but not visible (transitioning out),
    // ignore delay
    if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === 'focus') {
      return 0;
    }

    return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
  }

  function handleStyles(fromHide) {
    if (fromHide === void 0) {
      fromHide = false;
    }

    popper.style.pointerEvents = instance.props.interactive && !fromHide ? '' : 'none';
    popper.style.zIndex = "" + instance.props.zIndex;
  }

  function invokeHook(hook, args, shouldInvokePropsHook) {
    if (shouldInvokePropsHook === void 0) {
      shouldInvokePropsHook = true;
    }

    pluginsHooks.forEach(function (pluginHooks) {
      if (pluginHooks[hook]) {
        pluginHooks[hook].apply(pluginHooks, args);
      }
    });

    if (shouldInvokePropsHook) {
      var _instance$props;

      (_instance$props = instance.props)[hook].apply(_instance$props, args);
    }
  }

  function handleAriaContentAttribute() {
    var aria = instance.props.aria;

    if (!aria.content) {
      return;
    }

    var attr = "aria-" + aria.content;
    var id = popper.id;
    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      var currentValue = node.getAttribute(attr);

      if (instance.state.isVisible) {
        node.setAttribute(attr, currentValue ? currentValue + " " + id : id);
      } else {
        var nextValue = currentValue && currentValue.replace(id, '').trim();

        if (nextValue) {
          node.setAttribute(attr, nextValue);
        } else {
          node.removeAttribute(attr);
        }
      }
    });
  }

  function handleAriaExpandedAttribute() {
    if (hasAriaExpanded || !instance.props.aria.expanded) {
      return;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      if (instance.props.interactive) {
        node.setAttribute('aria-expanded', instance.state.isVisible && node === getCurrentTarget() ? 'true' : 'false');
      } else {
        node.removeAttribute('aria-expanded');
      }
    });
  }

  function cleanupInteractiveMouseListeners() {
    getDocument().removeEventListener('mousemove', debouncedOnMouseMove);
    mouseMoveListeners = mouseMoveListeners.filter(function (listener) {
      return listener !== debouncedOnMouseMove;
    });
  }

  function onDocumentPress(event) {
    // Moved finger to scroll instead of an intentional tap outside
    if (currentInput.isTouch) {
      if (didTouchMove || event.type === 'mousedown') {
        return;
      }
    }

    var actualTarget = event.composedPath && event.composedPath()[0] || event.target; // Clicked on interactive popper

    if (instance.props.interactive && actualContains(popper, actualTarget)) {
      return;
    } // Clicked on the event listeners target


    if (normalizeToArray(instance.props.triggerTarget || reference).some(function (el) {
      return actualContains(el, actualTarget);
    })) {
      if (currentInput.isTouch) {
        return;
      }

      if (instance.state.isVisible && instance.props.trigger.indexOf('click') >= 0) {
        return;
      }
    } else {
      invokeHook('onClickOutside', [instance, event]);
    }

    if (instance.props.hideOnClick === true) {
      instance.clearDelayTimeouts();
      instance.hide(); // `mousedown` event is fired right before `focus` if pressing the
      // currentTarget. This lets a tippy with `focus` trigger know that it
      // should not show

      didHideDueToDocumentMouseDown = true;
      setTimeout(function () {
        didHideDueToDocumentMouseDown = false;
      }); // The listener gets added in `scheduleShow()`, but this may be hiding it
      // before it shows, and hide()'s early bail-out behavior can prevent it
      // from being cleaned up

      if (!instance.state.isMounted) {
        removeDocumentPress();
      }
    }
  }

  function onTouchMove() {
    didTouchMove = true;
  }

  function onTouchStart() {
    didTouchMove = false;
  }

  function addDocumentPress() {
    var doc = getDocument();
    doc.addEventListener('mousedown', onDocumentPress, true);
    doc.addEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.addEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.addEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function removeDocumentPress() {
    var doc = getDocument();
    doc.removeEventListener('mousedown', onDocumentPress, true);
    doc.removeEventListener('touchend', onDocumentPress, TOUCH_OPTIONS);
    doc.removeEventListener('touchstart', onTouchStart, TOUCH_OPTIONS);
    doc.removeEventListener('touchmove', onTouchMove, TOUCH_OPTIONS);
  }

  function onTransitionedOut(duration, callback) {
    onTransitionEnd(duration, function () {
      if (!instance.state.isVisible && popper.parentNode && popper.parentNode.contains(popper)) {
        callback();
      }
    });
  }

  function onTransitionedIn(duration, callback) {
    onTransitionEnd(duration, callback);
  }

  function onTransitionEnd(duration, callback) {
    var box = getDefaultTemplateChildren().box;

    function listener(event) {
      if (event.target === box) {
        updateTransitionEndListener(box, 'remove', listener);
        callback();
      }
    } // Make callback synchronous if duration is 0
    // `transitionend` won't fire otherwise


    if (duration === 0) {
      return callback();
    }

    updateTransitionEndListener(box, 'remove', currentTransitionEndListener);
    updateTransitionEndListener(box, 'add', listener);
    currentTransitionEndListener = listener;
  }

  function on(eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    var nodes = normalizeToArray(instance.props.triggerTarget || reference);
    nodes.forEach(function (node) {
      node.addEventListener(eventType, handler, options);
      listeners.push({
        node: node,
        eventType: eventType,
        handler: handler,
        options: options
      });
    });
  }

  function addListeners() {
    if (getIsCustomTouchBehavior()) {
      on('touchstart', onTrigger, {
        passive: true
      });
      on('touchend', onMouseLeave, {
        passive: true
      });
    }

    splitBySpaces(instance.props.trigger).forEach(function (eventType) {
      if (eventType === 'manual') {
        return;
      }

      on(eventType, onTrigger);

      switch (eventType) {
        case 'mouseenter':
          on('mouseleave', onMouseLeave);
          break;

        case 'focus':
          on(isIE11 ? 'focusout' : 'blur', onBlurOrFocusOut);
          break;

        case 'focusin':
          on('focusout', onBlurOrFocusOut);
          break;
      }
    });
  }

  function removeListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function onTrigger(event) {
    var _lastTriggerEvent;

    var shouldScheduleClickHide = false;

    if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
      return;
    }

    var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === 'focus';
    lastTriggerEvent = event;
    currentTarget = event.currentTarget;
    handleAriaExpandedAttribute();

    if (!instance.state.isVisible && isMouseEvent(event)) {
      // If scrolling, `mouseenter` events can be fired if the cursor lands
      // over a new target, but `mousemove` events don't get fired. This
      // causes interactive tooltips to get stuck open until the cursor is
      // moved
      mouseMoveListeners.forEach(function (listener) {
        return listener(event);
      });
    } // Toggle show/hide when clicking click-triggered tooltips


    if (event.type === 'click' && (instance.props.trigger.indexOf('mouseenter') < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
      shouldScheduleClickHide = true;
    } else {
      scheduleShow(event);
    }

    if (event.type === 'click') {
      isVisibleFromClick = !shouldScheduleClickHide;
    }

    if (shouldScheduleClickHide && !wasFocused) {
      scheduleHide(event);
    }
  }

  function onMouseMove(event) {
    var target = event.target;
    var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper.contains(target);

    if (event.type === 'mousemove' && isCursorOverReferenceOrPopper) {
      return;
    }

    var popperTreeData = getNestedPopperTree().concat(popper).map(function (popper) {
      var _instance$popperInsta;

      var instance = popper._tippy;
      var state = (_instance$popperInsta = instance.popperInstance) == null ? void 0 : _instance$popperInsta.state;

      if (state) {
        return {
          popperRect: popper.getBoundingClientRect(),
          popperState: state,
          props: props
        };
      }

      return null;
    }).filter(Boolean);

    if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
      cleanupInteractiveMouseListeners();
      scheduleHide(event);
    }
  }

  function onMouseLeave(event) {
    var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf('click') >= 0 && isVisibleFromClick;

    if (shouldBail) {
      return;
    }

    if (instance.props.interactive) {
      instance.hideWithInteractivity(event);
      return;
    }

    scheduleHide(event);
  }

  function onBlurOrFocusOut(event) {
    if (instance.props.trigger.indexOf('focusin') < 0 && event.target !== getCurrentTarget()) {
      return;
    } // If focus was moved to within the popper


    if (instance.props.interactive && event.relatedTarget && popper.contains(event.relatedTarget)) {
      return;
    }

    scheduleHide(event);
  }

  function isEventListenerStopped(event) {
    return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf('touch') >= 0 : false;
  }

  function createPopperInstance() {
    destroyPopperInstance();
    var _instance$props2 = instance.props,
        popperOptions = _instance$props2.popperOptions,
        placement = _instance$props2.placement,
        offset = _instance$props2.offset,
        getReferenceClientRect = _instance$props2.getReferenceClientRect,
        moveTransition = _instance$props2.moveTransition;
    var arrow = getIsDefaultRenderFn() ? getChildren(popper).arrow : null;
    var computedReference = getReferenceClientRect ? {
      getBoundingClientRect: getReferenceClientRect,
      contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
    } : reference;
    var tippyModifier = {
      name: '$$tippy',
      enabled: true,
      phase: 'beforeWrite',
      requires: ['computeStyles'],
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (getIsDefaultRenderFn()) {
          var _getDefaultTemplateCh = getDefaultTemplateChildren(),
              box = _getDefaultTemplateCh.box;

          ['placement', 'reference-hidden', 'escaped'].forEach(function (attr) {
            if (attr === 'placement') {
              box.setAttribute('data-placement', state.placement);
            } else {
              if (state.attributes.popper["data-popper-" + attr]) {
                box.setAttribute("data-" + attr, '');
              } else {
                box.removeAttribute("data-" + attr);
              }
            }
          });
          state.attributes.popper = {};
        }
      }
    };
    var modifiers = [{
      name: 'offset',
      options: {
        offset: offset
      }
    }, {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: 'flip',
      options: {
        padding: 5
      }
    }, {
      name: 'computeStyles',
      options: {
        adaptive: !moveTransition
      }
    }, tippyModifier];

    if (getIsDefaultRenderFn() && arrow) {
      modifiers.push({
        name: 'arrow',
        options: {
          element: arrow,
          padding: 3
        }
      });
    }

    modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
    instance.popperInstance = (0,_popperjs_core__WEBPACK_IMPORTED_MODULE_0__.createPopper)(computedReference, popper, Object.assign({}, popperOptions, {
      placement: placement,
      onFirstUpdate: onFirstUpdate,
      modifiers: modifiers
    }));
  }

  function destroyPopperInstance() {
    if (instance.popperInstance) {
      instance.popperInstance.destroy();
      instance.popperInstance = null;
    }
  }

  function mount() {
    var appendTo = instance.props.appendTo;
    var parentNode; // By default, we'll append the popper to the triggerTargets's parentNode so
    // it's directly after the reference element so the elements inside the
    // tippy can be tabbed to
    // If there are clipping issues, the user can specify a different appendTo
    // and ensure focus management is handled correctly manually

    var node = getCurrentTarget();

    if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === 'parent') {
      parentNode = node.parentNode;
    } else {
      parentNode = invokeWithArgsOrReturn(appendTo, [node]);
    } // The popper element needs to exist on the DOM before its position can be
    // updated as Popper needs to read its dimensions


    if (!parentNode.contains(popper)) {
      parentNode.appendChild(popper);
    }

    instance.state.isMounted = true;
    createPopperInstance();
    /* istanbul ignore else */

    if (true) {
      // Accessibility check
      warnWhen(instance.props.interactive && appendTo === defaultProps.appendTo && node.nextElementSibling !== popper, ['Interactive tippy element may not be accessible via keyboard', 'navigation because it is not directly after the reference element', 'in the DOM source order.', '\n\n', 'Using a wrapper <div> or <span> tag around the reference element', 'solves this by creating a new parentNode context.', '\n\n', 'Specifying `appendTo: document.body` silences this warning, but it', 'assumes you are using a focus management solution to handle', 'keyboard navigation.', '\n\n', 'See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity'].join(' '));
    }
  }

  function getNestedPopperTree() {
    return arrayFrom(popper.querySelectorAll('[data-tippy-root]'));
  }

  function scheduleShow(event) {
    instance.clearDelayTimeouts();

    if (event) {
      invokeHook('onTrigger', [instance, event]);
    }

    addDocumentPress();
    var delay = getDelay(true);

    var _getNormalizedTouchSe = getNormalizedTouchSettings(),
        touchValue = _getNormalizedTouchSe[0],
        touchDelay = _getNormalizedTouchSe[1];

    if (currentInput.isTouch && touchValue === 'hold' && touchDelay) {
      delay = touchDelay;
    }

    if (delay) {
      showTimeout = setTimeout(function () {
        instance.show();
      }, delay);
    } else {
      instance.show();
    }
  }

  function scheduleHide(event) {
    instance.clearDelayTimeouts();
    invokeHook('onUntrigger', [instance, event]);

    if (!instance.state.isVisible) {
      removeDocumentPress();
      return;
    } // For interactive tippies, scheduleHide is added to a document.body handler
    // from onMouseLeave so must intercept scheduled hides from mousemove/leave
    // events when trigger contains mouseenter and click, and the tip is
    // currently shown as a result of a click.


    if (instance.props.trigger.indexOf('mouseenter') >= 0 && instance.props.trigger.indexOf('click') >= 0 && ['mouseleave', 'mousemove'].indexOf(event.type) >= 0 && isVisibleFromClick) {
      return;
    }

    var delay = getDelay(false);

    if (delay) {
      hideTimeout = setTimeout(function () {
        if (instance.state.isVisible) {
          instance.hide();
        }
      }, delay);
    } else {
      // Fixes a `transitionend` problem when it fires 1 frame too
      // late sometimes, we don't want hide() to be called.
      scheduleHideAnimationFrame = requestAnimationFrame(function () {
        instance.hide();
      });
    }
  } // ===========================================================================
  // 🔑 Public methods
  // ===========================================================================


  function enable() {
    instance.state.isEnabled = true;
  }

  function disable() {
    // Disabling the instance should also hide it
    // https://github.com/atomiks/tippy.js-react/issues/106
    instance.hide();
    instance.state.isEnabled = false;
  }

  function clearDelayTimeouts() {
    clearTimeout(showTimeout);
    clearTimeout(hideTimeout);
    cancelAnimationFrame(scheduleHideAnimationFrame);
  }

  function setProps(partialProps) {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('setProps'));
    }

    if (instance.state.isDestroyed) {
      return;
    }

    invokeHook('onBeforeUpdate', [instance, partialProps]);
    removeListeners();
    var prevProps = instance.props;
    var nextProps = evaluateProps(reference, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
      ignoreAttributes: true
    }));
    instance.props = nextProps;
    addListeners();

    if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
      cleanupInteractiveMouseListeners();
      debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
    } // Ensure stale aria-expanded attributes are removed


    if (prevProps.triggerTarget && !nextProps.triggerTarget) {
      normalizeToArray(prevProps.triggerTarget).forEach(function (node) {
        node.removeAttribute('aria-expanded');
      });
    } else if (nextProps.triggerTarget) {
      reference.removeAttribute('aria-expanded');
    }

    handleAriaExpandedAttribute();
    handleStyles();

    if (onUpdate) {
      onUpdate(prevProps, nextProps);
    }

    if (instance.popperInstance) {
      createPopperInstance(); // Fixes an issue with nested tippies if they are all getting re-rendered,
      // and the nested ones get re-rendered first.
      // https://github.com/atomiks/tippyjs-react/issues/177
      // TODO: find a cleaner / more efficient solution(!)

      getNestedPopperTree().forEach(function (nestedPopper) {
        // React (and other UI libs likely) requires a rAF wrapper as it flushes
        // its work in one
        requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
      });
    }

    invokeHook('onAfterUpdate', [instance, partialProps]);
  }

  function setContent(content) {
    instance.setProps({
      content: content
    });
  }

  function show() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('show'));
    } // Early bail-out


    var isAlreadyVisible = instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);

    if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
      return;
    } // Normalize `disabled` behavior across browsers.
    // Firefox allows events on disabled elements, but Chrome doesn't.
    // Using a wrapper element (i.e. <span>) is recommended.


    if (getCurrentTarget().hasAttribute('disabled')) {
      return;
    }

    invokeHook('onShow', [instance], false);

    if (instance.props.onShow(instance) === false) {
      return;
    }

    instance.state.isVisible = true;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'visible';
    }

    handleStyles();
    addDocumentPress();

    if (!instance.state.isMounted) {
      popper.style.transition = 'none';
    } // If flipping to the opposite side after hiding at least once, the
    // animation will use the wrong placement without resetting the duration


    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh2 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh2.box,
          content = _getDefaultTemplateCh2.content;

      setTransitionDuration([box, content], 0);
    }

    onFirstUpdate = function onFirstUpdate() {
      var _instance$popperInsta2;

      if (!instance.state.isVisible || ignoreOnFirstUpdate) {
        return;
      }

      ignoreOnFirstUpdate = true; // reflow

      void popper.offsetHeight;
      popper.style.transition = instance.props.moveTransition;

      if (getIsDefaultRenderFn() && instance.props.animation) {
        var _getDefaultTemplateCh3 = getDefaultTemplateChildren(),
            _box = _getDefaultTemplateCh3.box,
            _content = _getDefaultTemplateCh3.content;

        setTransitionDuration([_box, _content], duration);
        setVisibilityState([_box, _content], 'visible');
      }

      handleAriaContentAttribute();
      handleAriaExpandedAttribute();
      pushIfUnique(mountedInstances, instance); // certain modifiers (e.g. `maxSize`) require a second update after the
      // popper has been positioned for the first time

      (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
      invokeHook('onMount', [instance]);

      if (instance.props.animation && getIsDefaultRenderFn()) {
        onTransitionedIn(duration, function () {
          instance.state.isShown = true;
          invokeHook('onShown', [instance]);
        });
      }
    };

    mount();
  }

  function hide() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hide'));
    } // Early bail-out


    var isAlreadyHidden = !instance.state.isVisible;
    var isDestroyed = instance.state.isDestroyed;
    var isDisabled = !instance.state.isEnabled;
    var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);

    if (isAlreadyHidden || isDestroyed || isDisabled) {
      return;
    }

    invokeHook('onHide', [instance], false);

    if (instance.props.onHide(instance) === false) {
      return;
    }

    instance.state.isVisible = false;
    instance.state.isShown = false;
    ignoreOnFirstUpdate = false;
    isVisibleFromClick = false;

    if (getIsDefaultRenderFn()) {
      popper.style.visibility = 'hidden';
    }

    cleanupInteractiveMouseListeners();
    removeDocumentPress();
    handleStyles(true);

    if (getIsDefaultRenderFn()) {
      var _getDefaultTemplateCh4 = getDefaultTemplateChildren(),
          box = _getDefaultTemplateCh4.box,
          content = _getDefaultTemplateCh4.content;

      if (instance.props.animation) {
        setTransitionDuration([box, content], duration);
        setVisibilityState([box, content], 'hidden');
      }
    }

    handleAriaContentAttribute();
    handleAriaExpandedAttribute();

    if (instance.props.animation) {
      if (getIsDefaultRenderFn()) {
        onTransitionedOut(duration, instance.unmount);
      }
    } else {
      instance.unmount();
    }
  }

  function hideWithInteractivity(event) {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('hideWithInteractivity'));
    }

    getDocument().addEventListener('mousemove', debouncedOnMouseMove);
    pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
    debouncedOnMouseMove(event);
  }

  function unmount() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('unmount'));
    }

    if (instance.state.isVisible) {
      instance.hide();
    }

    if (!instance.state.isMounted) {
      return;
    }

    destroyPopperInstance(); // If a popper is not interactive, it will be appended outside the popper
    // tree by default. This seems mainly for interactive tippies, but we should
    // find a workaround if possible

    getNestedPopperTree().forEach(function (nestedPopper) {
      nestedPopper._tippy.unmount();
    });

    if (popper.parentNode) {
      popper.parentNode.removeChild(popper);
    }

    mountedInstances = mountedInstances.filter(function (i) {
      return i !== instance;
    });
    instance.state.isMounted = false;
    invokeHook('onHidden', [instance]);
  }

  function destroy() {
    /* istanbul ignore else */
    if (true) {
      warnWhen(instance.state.isDestroyed, createMemoryLeakWarning('destroy'));
    }

    if (instance.state.isDestroyed) {
      return;
    }

    instance.clearDelayTimeouts();
    instance.unmount();
    removeListeners();
    delete reference._tippy;
    instance.state.isDestroyed = true;
    invokeHook('onDestroy', [instance]);
  }
}

function tippy(targets, optionalProps) {
  if (optionalProps === void 0) {
    optionalProps = {};
  }

  var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
  /* istanbul ignore else */

  if (true) {
    validateTargets(targets);
    validateProps(optionalProps, plugins);
  }

  bindGlobalEventListeners();
  var passedProps = Object.assign({}, optionalProps, {
    plugins: plugins
  });
  var elements = getArrayOfElements(targets);
  /* istanbul ignore else */

  if (true) {
    var isSingleContentElement = isElement(passedProps.content);
    var isMoreThanOneReferenceElement = elements.length > 1;
    warnWhen(isSingleContentElement && isMoreThanOneReferenceElement, ['tippy() was passed an Element as the `content` prop, but more than', 'one tippy instance was created by this invocation. This means the', 'content element will only be appended to the last tippy instance.', '\n\n', 'Instead, pass the .innerHTML of the element, or use a function that', 'returns a cloned version of the element instead.', '\n\n', '1) content: element.innerHTML\n', '2) content: () => element.cloneNode(true)'].join(' '));
  }

  var instances = elements.reduce(function (acc, reference) {
    var instance = reference && createTippy(reference, passedProps);

    if (instance) {
      acc.push(instance);
    }

    return acc;
  }, []);
  return isElement(targets) ? instances[0] : instances;
}

tippy.defaultProps = defaultProps;
tippy.setDefaultProps = setDefaultProps;
tippy.currentInput = currentInput;
var hideAll = function hideAll(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      excludedReferenceOrInstance = _ref.exclude,
      duration = _ref.duration;

  mountedInstances.forEach(function (instance) {
    var isExcluded = false;

    if (excludedReferenceOrInstance) {
      isExcluded = isReferenceElement(excludedReferenceOrInstance) ? instance.reference === excludedReferenceOrInstance : instance.popper === excludedReferenceOrInstance.popper;
    }

    if (!isExcluded) {
      var originalDuration = instance.props.duration;
      instance.setProps({
        duration: duration
      });
      instance.hide();

      if (!instance.state.isDestroyed) {
        instance.setProps({
          duration: originalDuration
        });
      }
    }
  });
};

// every time the popper is destroyed (i.e. a new target), removing the styles
// and causing transitions to break for singletons when the console is open, but
// most notably for non-transform styles being used, `gpuAcceleration: false`.

var applyStylesModifier = Object.assign({}, _popperjs_core__WEBPACK_IMPORTED_MODULE_1__["default"], {
  effect: function effect(_ref) {
    var state = _ref.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: '0',
        top: '0',
        margin: '0'
      },
      arrow: {
        position: 'absolute'
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    } // intentionally return no cleanup function
    // return () => { ... }

  }
});

var createSingleton = function createSingleton(tippyInstances, optionalProps) {
  var _optionalProps$popper;

  if (optionalProps === void 0) {
    optionalProps = {};
  }

  /* istanbul ignore else */
  if (true) {
    errorWhen(!Array.isArray(tippyInstances), ['The first argument passed to createSingleton() must be an array of', 'tippy instances. The passed value was', String(tippyInstances)].join(' '));
  }

  var individualInstances = tippyInstances;
  var references = [];
  var triggerTargets = [];
  var currentTarget;
  var overrides = optionalProps.overrides;
  var interceptSetPropsCleanups = [];
  var shownOnCreate = false;

  function setTriggerTargets() {
    triggerTargets = individualInstances.map(function (instance) {
      return normalizeToArray(instance.props.triggerTarget || instance.reference);
    }).reduce(function (acc, item) {
      return acc.concat(item);
    }, []);
  }

  function setReferences() {
    references = individualInstances.map(function (instance) {
      return instance.reference;
    });
  }

  function enableInstances(isEnabled) {
    individualInstances.forEach(function (instance) {
      if (isEnabled) {
        instance.enable();
      } else {
        instance.disable();
      }
    });
  }

  function interceptSetProps(singleton) {
    return individualInstances.map(function (instance) {
      var originalSetProps = instance.setProps;

      instance.setProps = function (props) {
        originalSetProps(props);

        if (instance.reference === currentTarget) {
          singleton.setProps(props);
        }
      };

      return function () {
        instance.setProps = originalSetProps;
      };
    });
  } // have to pass singleton, as it maybe undefined on first call


  function prepareInstance(singleton, target) {
    var index = triggerTargets.indexOf(target); // bail-out

    if (target === currentTarget) {
      return;
    }

    currentTarget = target;
    var overrideProps = (overrides || []).concat('content').reduce(function (acc, prop) {
      acc[prop] = individualInstances[index].props[prop];
      return acc;
    }, {});
    singleton.setProps(Object.assign({}, overrideProps, {
      getReferenceClientRect: typeof overrideProps.getReferenceClientRect === 'function' ? overrideProps.getReferenceClientRect : function () {
        var _references$index;

        return (_references$index = references[index]) == null ? void 0 : _references$index.getBoundingClientRect();
      }
    }));
  }

  enableInstances(false);
  setReferences();
  setTriggerTargets();
  var plugin = {
    fn: function fn() {
      return {
        onDestroy: function onDestroy() {
          enableInstances(true);
        },
        onHidden: function onHidden() {
          currentTarget = null;
        },
        onClickOutside: function onClickOutside(instance) {
          if (instance.props.showOnCreate && !shownOnCreate) {
            shownOnCreate = true;
            currentTarget = null;
          }
        },
        onShow: function onShow(instance) {
          if (instance.props.showOnCreate && !shownOnCreate) {
            shownOnCreate = true;
            prepareInstance(instance, references[0]);
          }
        },
        onTrigger: function onTrigger(instance, event) {
          prepareInstance(instance, event.currentTarget);
        }
      };
    }
  };
  var singleton = tippy(div(), Object.assign({}, removeProperties(optionalProps, ['overrides']), {
    plugins: [plugin].concat(optionalProps.plugins || []),
    triggerTarget: triggerTargets,
    popperOptions: Object.assign({}, optionalProps.popperOptions, {
      modifiers: [].concat(((_optionalProps$popper = optionalProps.popperOptions) == null ? void 0 : _optionalProps$popper.modifiers) || [], [applyStylesModifier])
    })
  }));
  var originalShow = singleton.show;

  singleton.show = function (target) {
    originalShow(); // first time, showOnCreate or programmatic call with no params
    // default to showing first instance

    if (!currentTarget && target == null) {
      return prepareInstance(singleton, references[0]);
    } // triggered from event (do nothing as prepareInstance already called by onTrigger)
    // programmatic call with no params when already visible (do nothing again)


    if (currentTarget && target == null) {
      return;
    } // target is index of instance


    if (typeof target === 'number') {
      return references[target] && prepareInstance(singleton, references[target]);
    } // target is a child tippy instance


    if (individualInstances.indexOf(target) >= 0) {
      var ref = target.reference;
      return prepareInstance(singleton, ref);
    } // target is a ReferenceElement


    if (references.indexOf(target) >= 0) {
      return prepareInstance(singleton, target);
    }
  };

  singleton.showNext = function () {
    var first = references[0];

    if (!currentTarget) {
      return singleton.show(0);
    }

    var index = references.indexOf(currentTarget);
    singleton.show(references[index + 1] || first);
  };

  singleton.showPrevious = function () {
    var last = references[references.length - 1];

    if (!currentTarget) {
      return singleton.show(last);
    }

    var index = references.indexOf(currentTarget);
    var target = references[index - 1] || last;
    singleton.show(target);
  };

  var originalSetProps = singleton.setProps;

  singleton.setProps = function (props) {
    overrides = props.overrides || overrides;
    originalSetProps(props);
  };

  singleton.setInstances = function (nextInstances) {
    enableInstances(true);
    interceptSetPropsCleanups.forEach(function (fn) {
      return fn();
    });
    individualInstances = nextInstances;
    enableInstances(false);
    setReferences();
    setTriggerTargets();
    interceptSetPropsCleanups = interceptSetProps(singleton);
    singleton.setProps({
      triggerTarget: triggerTargets
    });
  };

  interceptSetPropsCleanups = interceptSetProps(singleton);
  return singleton;
};

var BUBBLING_EVENTS_MAP = {
  mouseover: 'mouseenter',
  focusin: 'focus',
  click: 'click'
};
/**
 * Creates a delegate instance that controls the creation of tippy instances
 * for child elements (`target` CSS selector).
 */

function delegate(targets, props) {
  /* istanbul ignore else */
  if (true) {
    errorWhen(!(props && props.target), ['You must specity a `target` prop indicating a CSS selector string matching', 'the target elements that should receive a tippy.'].join(' '));
  }

  var listeners = [];
  var childTippyInstances = [];
  var disabled = false;
  var target = props.target;
  var nativeProps = removeProperties(props, ['target']);
  var parentProps = Object.assign({}, nativeProps, {
    trigger: 'manual',
    touch: false
  });
  var childProps = Object.assign({
    touch: defaultProps.touch
  }, nativeProps, {
    showOnCreate: true
  });
  var returnValue = tippy(targets, parentProps);
  var normalizedReturnValue = normalizeToArray(returnValue);

  function onTrigger(event) {
    if (!event.target || disabled) {
      return;
    }

    var targetNode = event.target.closest(target);

    if (!targetNode) {
      return;
    } // Get relevant trigger with fallbacks:
    // 1. Check `data-tippy-trigger` attribute on target node
    // 2. Fallback to `trigger` passed to `delegate()`
    // 3. Fallback to `defaultProps.trigger`


    var trigger = targetNode.getAttribute('data-tippy-trigger') || props.trigger || defaultProps.trigger; // @ts-ignore

    if (targetNode._tippy) {
      return;
    }

    if (event.type === 'touchstart' && typeof childProps.touch === 'boolean') {
      return;
    }

    if (event.type !== 'touchstart' && trigger.indexOf(BUBBLING_EVENTS_MAP[event.type]) < 0) {
      return;
    }

    var instance = tippy(targetNode, childProps);

    if (instance) {
      childTippyInstances = childTippyInstances.concat(instance);
    }
  }

  function on(node, eventType, handler, options) {
    if (options === void 0) {
      options = false;
    }

    node.addEventListener(eventType, handler, options);
    listeners.push({
      node: node,
      eventType: eventType,
      handler: handler,
      options: options
    });
  }

  function addEventListeners(instance) {
    var reference = instance.reference;
    on(reference, 'touchstart', onTrigger, TOUCH_OPTIONS);
    on(reference, 'mouseover', onTrigger);
    on(reference, 'focusin', onTrigger);
    on(reference, 'click', onTrigger);
  }

  function removeEventListeners() {
    listeners.forEach(function (_ref) {
      var node = _ref.node,
          eventType = _ref.eventType,
          handler = _ref.handler,
          options = _ref.options;
      node.removeEventListener(eventType, handler, options);
    });
    listeners = [];
  }

  function applyMutations(instance) {
    var originalDestroy = instance.destroy;
    var originalEnable = instance.enable;
    var originalDisable = instance.disable;

    instance.destroy = function (shouldDestroyChildInstances) {
      if (shouldDestroyChildInstances === void 0) {
        shouldDestroyChildInstances = true;
      }

      if (shouldDestroyChildInstances) {
        childTippyInstances.forEach(function (instance) {
          instance.destroy();
        });
      }

      childTippyInstances = [];
      removeEventListeners();
      originalDestroy();
    };

    instance.enable = function () {
      originalEnable();
      childTippyInstances.forEach(function (instance) {
        return instance.enable();
      });
      disabled = false;
    };

    instance.disable = function () {
      originalDisable();
      childTippyInstances.forEach(function (instance) {
        return instance.disable();
      });
      disabled = true;
    };

    addEventListeners(instance);
  }

  normalizedReturnValue.forEach(applyMutations);
  return returnValue;
}

var animateFill = {
  name: 'animateFill',
  defaultValue: false,
  fn: function fn(instance) {
    var _instance$props$rende;

    // @ts-ignore
    if (!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy)) {
      if (true) {
        errorWhen(instance.props.animateFill, 'The `animateFill` plugin requires the default render function.');
      }

      return {};
    }

    var _getChildren = getChildren(instance.popper),
        box = _getChildren.box,
        content = _getChildren.content;

    var backdrop = instance.props.animateFill ? createBackdropElement() : null;
    return {
      onCreate: function onCreate() {
        if (backdrop) {
          box.insertBefore(backdrop, box.firstElementChild);
          box.setAttribute('data-animatefill', '');
          box.style.overflow = 'hidden';
          instance.setProps({
            arrow: false,
            animation: 'shift-away'
          });
        }
      },
      onMount: function onMount() {
        if (backdrop) {
          var transitionDuration = box.style.transitionDuration;
          var duration = Number(transitionDuration.replace('ms', '')); // The content should fade in after the backdrop has mostly filled the
          // tooltip element. `clip-path` is the other alternative but is not
          // well-supported and is buggy on some devices.

          content.style.transitionDelay = Math.round(duration / 10) + "ms";
          backdrop.style.transitionDuration = transitionDuration;
          setVisibilityState([backdrop], 'visible');
        }
      },
      onShow: function onShow() {
        if (backdrop) {
          backdrop.style.transitionDuration = '0ms';
        }
      },
      onHide: function onHide() {
        if (backdrop) {
          setVisibilityState([backdrop], 'hidden');
        }
      }
    };
  }
};

function createBackdropElement() {
  var backdrop = div();
  backdrop.className = BACKDROP_CLASS;
  setVisibilityState([backdrop], 'hidden');
  return backdrop;
}

var mouseCoords = {
  clientX: 0,
  clientY: 0
};
var activeInstances = [];

function storeMouseCoords(_ref) {
  var clientX = _ref.clientX,
      clientY = _ref.clientY;
  mouseCoords = {
    clientX: clientX,
    clientY: clientY
  };
}

function addMouseCoordsListener(doc) {
  doc.addEventListener('mousemove', storeMouseCoords);
}

function removeMouseCoordsListener(doc) {
  doc.removeEventListener('mousemove', storeMouseCoords);
}

var followCursor = {
  name: 'followCursor',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference;
    var doc = getOwnerDocument(instance.props.triggerTarget || reference);
    var isInternalUpdate = false;
    var wasFocusEvent = false;
    var isUnmounted = true;
    var prevProps = instance.props;

    function getIsInitialBehavior() {
      return instance.props.followCursor === 'initial' && instance.state.isVisible;
    }

    function addListener() {
      doc.addEventListener('mousemove', onMouseMove);
    }

    function removeListener() {
      doc.removeEventListener('mousemove', onMouseMove);
    }

    function unsetGetReferenceClientRect() {
      isInternalUpdate = true;
      instance.setProps({
        getReferenceClientRect: null
      });
      isInternalUpdate = false;
    }

    function onMouseMove(event) {
      // If the instance is interactive, avoid updating the position unless it's
      // over the reference element
      var isCursorOverReference = event.target ? reference.contains(event.target) : true;
      var followCursor = instance.props.followCursor;
      var clientX = event.clientX,
          clientY = event.clientY;
      var rect = reference.getBoundingClientRect();
      var relativeX = clientX - rect.left;
      var relativeY = clientY - rect.top;

      if (isCursorOverReference || !instance.props.interactive) {
        instance.setProps({
          // @ts-ignore - unneeded DOMRect properties
          getReferenceClientRect: function getReferenceClientRect() {
            var rect = reference.getBoundingClientRect();
            var x = clientX;
            var y = clientY;

            if (followCursor === 'initial') {
              x = rect.left + relativeX;
              y = rect.top + relativeY;
            }

            var top = followCursor === 'horizontal' ? rect.top : y;
            var right = followCursor === 'vertical' ? rect.right : x;
            var bottom = followCursor === 'horizontal' ? rect.bottom : y;
            var left = followCursor === 'vertical' ? rect.left : x;
            return {
              width: right - left,
              height: bottom - top,
              top: top,
              right: right,
              bottom: bottom,
              left: left
            };
          }
        });
      }
    }

    function create() {
      if (instance.props.followCursor) {
        activeInstances.push({
          instance: instance,
          doc: doc
        });
        addMouseCoordsListener(doc);
      }
    }

    function destroy() {
      activeInstances = activeInstances.filter(function (data) {
        return data.instance !== instance;
      });

      if (activeInstances.filter(function (data) {
        return data.doc === doc;
      }).length === 0) {
        removeMouseCoordsListener(doc);
      }
    }

    return {
      onCreate: create,
      onDestroy: destroy,
      onBeforeUpdate: function onBeforeUpdate() {
        prevProps = instance.props;
      },
      onAfterUpdate: function onAfterUpdate(_, _ref2) {
        var followCursor = _ref2.followCursor;

        if (isInternalUpdate) {
          return;
        }

        if (followCursor !== undefined && prevProps.followCursor !== followCursor) {
          destroy();

          if (followCursor) {
            create();

            if (instance.state.isMounted && !wasFocusEvent && !getIsInitialBehavior()) {
              addListener();
            }
          } else {
            removeListener();
            unsetGetReferenceClientRect();
          }
        }
      },
      onMount: function onMount() {
        if (instance.props.followCursor && !wasFocusEvent) {
          if (isUnmounted) {
            onMouseMove(mouseCoords);
            isUnmounted = false;
          }

          if (!getIsInitialBehavior()) {
            addListener();
          }
        }
      },
      onTrigger: function onTrigger(_, event) {
        if (isMouseEvent(event)) {
          mouseCoords = {
            clientX: event.clientX,
            clientY: event.clientY
          };
        }

        wasFocusEvent = event.type === 'focus';
      },
      onHidden: function onHidden() {
        if (instance.props.followCursor) {
          unsetGetReferenceClientRect();
          removeListener();
          isUnmounted = true;
        }
      }
    };
  }
};

function getProps(props, modifier) {
  var _props$popperOptions;

  return {
    popperOptions: Object.assign({}, props.popperOptions, {
      modifiers: [].concat((((_props$popperOptions = props.popperOptions) == null ? void 0 : _props$popperOptions.modifiers) || []).filter(function (_ref) {
        var name = _ref.name;
        return name !== modifier.name;
      }), [modifier])
    })
  };
}

var inlinePositioning = {
  name: 'inlinePositioning',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference;

    function isEnabled() {
      return !!instance.props.inlinePositioning;
    }

    var placement;
    var cursorRectIndex = -1;
    var isInternalUpdate = false;
    var triedPlacements = [];
    var modifier = {
      name: 'tippyInlinePositioning',
      enabled: true,
      phase: 'afterWrite',
      fn: function fn(_ref2) {
        var state = _ref2.state;

        if (isEnabled()) {
          if (triedPlacements.indexOf(state.placement) !== -1) {
            triedPlacements = [];
          }

          if (placement !== state.placement && triedPlacements.indexOf(state.placement) === -1) {
            triedPlacements.push(state.placement);
            instance.setProps({
              // @ts-ignore - unneeded DOMRect properties
              getReferenceClientRect: function getReferenceClientRect() {
                return _getReferenceClientRect(state.placement);
              }
            });
          }

          placement = state.placement;
        }
      }
    };

    function _getReferenceClientRect(placement) {
      return getInlineBoundingClientRect(getBasePlacement(placement), reference.getBoundingClientRect(), arrayFrom(reference.getClientRects()), cursorRectIndex);
    }

    function setInternalProps(partialProps) {
      isInternalUpdate = true;
      instance.setProps(partialProps);
      isInternalUpdate = false;
    }

    function addModifier() {
      if (!isInternalUpdate) {
        setInternalProps(getProps(instance.props, modifier));
      }
    }

    return {
      onCreate: addModifier,
      onAfterUpdate: addModifier,
      onTrigger: function onTrigger(_, event) {
        if (isMouseEvent(event)) {
          var rects = arrayFrom(instance.reference.getClientRects());
          var cursorRect = rects.find(function (rect) {
            return rect.left - 2 <= event.clientX && rect.right + 2 >= event.clientX && rect.top - 2 <= event.clientY && rect.bottom + 2 >= event.clientY;
          });
          var index = rects.indexOf(cursorRect);
          cursorRectIndex = index > -1 ? index : cursorRectIndex;
        }
      },
      onHidden: function onHidden() {
        cursorRectIndex = -1;
      }
    };
  }
};
function getInlineBoundingClientRect(currentBasePlacement, boundingRect, clientRects, cursorRectIndex) {
  // Not an inline element, or placement is not yet known
  if (clientRects.length < 2 || currentBasePlacement === null) {
    return boundingRect;
  } // There are two rects and they are disjoined


  if (clientRects.length === 2 && cursorRectIndex >= 0 && clientRects[0].left > clientRects[1].right) {
    return clientRects[cursorRectIndex] || boundingRect;
  }

  switch (currentBasePlacement) {
    case 'top':
    case 'bottom':
      {
        var firstRect = clientRects[0];
        var lastRect = clientRects[clientRects.length - 1];
        var isTop = currentBasePlacement === 'top';
        var top = firstRect.top;
        var bottom = lastRect.bottom;
        var left = isTop ? firstRect.left : lastRect.left;
        var right = isTop ? firstRect.right : lastRect.right;
        var width = right - left;
        var height = bottom - top;
        return {
          top: top,
          bottom: bottom,
          left: left,
          right: right,
          width: width,
          height: height
        };
      }

    case 'left':
    case 'right':
      {
        var minLeft = Math.min.apply(Math, clientRects.map(function (rects) {
          return rects.left;
        }));
        var maxRight = Math.max.apply(Math, clientRects.map(function (rects) {
          return rects.right;
        }));
        var measureRects = clientRects.filter(function (rect) {
          return currentBasePlacement === 'left' ? rect.left === minLeft : rect.right === maxRight;
        });
        var _top = measureRects[0].top;
        var _bottom = measureRects[measureRects.length - 1].bottom;
        var _left = minLeft;
        var _right = maxRight;

        var _width = _right - _left;

        var _height = _bottom - _top;

        return {
          top: _top,
          bottom: _bottom,
          left: _left,
          right: _right,
          width: _width,
          height: _height
        };
      }

    default:
      {
        return boundingRect;
      }
  }
}

var sticky = {
  name: 'sticky',
  defaultValue: false,
  fn: function fn(instance) {
    var reference = instance.reference,
        popper = instance.popper;

    function getReference() {
      return instance.popperInstance ? instance.popperInstance.state.elements.reference : reference;
    }

    function shouldCheck(value) {
      return instance.props.sticky === true || instance.props.sticky === value;
    }

    var prevRefRect = null;
    var prevPopRect = null;

    function updatePosition() {
      var currentRefRect = shouldCheck('reference') ? getReference().getBoundingClientRect() : null;
      var currentPopRect = shouldCheck('popper') ? popper.getBoundingClientRect() : null;

      if (currentRefRect && areRectsDifferent(prevRefRect, currentRefRect) || currentPopRect && areRectsDifferent(prevPopRect, currentPopRect)) {
        if (instance.popperInstance) {
          instance.popperInstance.update();
        }
      }

      prevRefRect = currentRefRect;
      prevPopRect = currentPopRect;

      if (instance.state.isMounted) {
        requestAnimationFrame(updatePosition);
      }
    }

    return {
      onMount: function onMount() {
        if (instance.props.sticky) {
          updatePosition();
        }
      }
    };
  }
};

function areRectsDifferent(rectA, rectB) {
  if (rectA && rectB) {
    return rectA.top !== rectB.top || rectA.right !== rectB.right || rectA.bottom !== rectB.bottom || rectA.left !== rectB.left;
  }

  return true;
}

tippy.setDefaultProps({
  render: render
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (tippy);

//# sourceMappingURL=tippy.esm.js.map


/***/ }),

/***/ "./node_modules/trix/dist/trix.esm.min.js":
/*!************************************************!*\
  !*** ./node_modules/trix/dist/trix.esm.min.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ oo)
/* harmony export */ });
/*
Trix 2.1.15
Copyright © 2025 37signals, LLC
 */
var t="2.1.15";const e="[data-trix-attachment]",i={preview:{presentation:"gallery",caption:{name:!0,size:!0}},file:{caption:{size:!0}}},n={default:{tagName:"div",parse:!1},quote:{tagName:"blockquote",nestable:!0},heading1:{tagName:"h1",terminal:!0,breakOnReturn:!0,group:!1},code:{tagName:"pre",terminal:!0,htmlAttributes:["language"],text:{plaintext:!0}},bulletList:{tagName:"ul",parse:!1},bullet:{tagName:"li",listAttribute:"bulletList",group:!1,nestable:!0,test(t){return r(t.parentNode)===n[this.listAttribute].tagName}},numberList:{tagName:"ol",parse:!1},number:{tagName:"li",listAttribute:"numberList",group:!1,nestable:!0,test(t){return r(t.parentNode)===n[this.listAttribute].tagName}},attachmentGallery:{tagName:"div",exclusive:!0,terminal:!0,parse:!1,group:!1}},r=t=>{var e;return null==t||null===(e=t.tagName)||void 0===e?void 0:e.toLowerCase()},o=navigator.userAgent.match(/android\s([0-9]+.*Chrome)/i),s=o&&parseInt(o[1]);var a={composesExistingText:/Android.*Chrome/.test(navigator.userAgent),recentAndroid:s&&s>12,samsungAndroid:s&&navigator.userAgent.match(/Android.*SM-/),forcesObjectResizing:/Trident.*rv:11/.test(navigator.userAgent),supportsInputEvents:"undefined"!=typeof InputEvent&&["data","getTargetRanges","inputType"].every((t=>t in InputEvent.prototype))},l={ADD_ATTR:["language"],SAFE_FOR_XML:!1,RETURN_DOM:!0},c={attachFiles:"Attach Files",bold:"Bold",bullets:"Bullets",byte:"Byte",bytes:"Bytes",captionPlaceholder:"Add a caption…",code:"Code",heading1:"Heading",indent:"Increase Level",italic:"Italic",link:"Link",numbers:"Numbers",outdent:"Decrease Level",quote:"Quote",redo:"Redo",remove:"Remove",strike:"Strikethrough",undo:"Undo",unlink:"Unlink",url:"URL",urlPlaceholder:"Enter a URL…",GB:"GB",KB:"KB",MB:"MB",PB:"PB",TB:"TB"};const u=[c.bytes,c.KB,c.MB,c.GB,c.TB,c.PB];var h={prefix:"IEC",precision:2,formatter(t){switch(t){case 0:return"0 ".concat(c.bytes);case 1:return"1 ".concat(c.byte);default:let e;"SI"===this.prefix?e=1e3:"IEC"===this.prefix&&(e=1024);const i=Math.floor(Math.log(t)/Math.log(e)),n=(t/Math.pow(e,i)).toFixed(this.precision).replace(/0*$/,"").replace(/\.$/,"");return"".concat(n," ").concat(u[i])}}};const d="\ufeff",g=" ",m=function(t){for(const e in t){const i=t[e];this[e]=i}return this},p=document.documentElement,f=p.matches,b=function(t){let{onElement:e,matchingSelector:i,withCallback:n,inPhase:r,preventDefault:o,times:s}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const a=e||p,l=i,c="capturing"===r,u=function(t){null!=s&&0==--s&&u.destroy();const e=y(t.target,{matchingSelector:l});null!=e&&(null==n||n.call(e,t,e),o&&t.preventDefault())};return u.destroy=()=>a.removeEventListener(t,u,c),a.addEventListener(t,u,c),u},v=function(t){let{onElement:e,bubbles:i,cancelable:n,attributes:r}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const o=null!=e?e:p;i=!1!==i,n=!1!==n;const s=document.createEvent("Events");return s.initEvent(t,i,n),null!=r&&m.call(s,r),o.dispatchEvent(s)},A=function(t,e){if(1===(null==t?void 0:t.nodeType))return f.call(t,e)},y=function(t){let{matchingSelector:e,untilNode:i}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};for(;t&&t.nodeType!==Node.ELEMENT_NODE;)t=t.parentNode;if(null!=t){if(null==e)return t;if(t.closest&&null==i)return t.closest(e);for(;t&&t!==i;){if(A(t,e))return t;t=t.parentNode}}},x=t=>document.activeElement!==t&&C(t,document.activeElement),C=function(t,e){if(t&&e)for(;e;){if(e===t)return!0;e=e.parentNode}},E=function(t){var e;if(null===(e=t)||void 0===e||!e.parentNode)return;let i=0;for(t=t.previousSibling;t;)i++,t=t.previousSibling;return i},S=t=>{var e;return null==t||null===(e=t.parentNode)||void 0===e?void 0:e.removeChild(t)},R=function(t){let{onlyNodesOfType:e,usingFilter:i,expandEntityReferences:n}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const r=(()=>{switch(e){case"element":return NodeFilter.SHOW_ELEMENT;case"text":return NodeFilter.SHOW_TEXT;case"comment":return NodeFilter.SHOW_COMMENT;default:return NodeFilter.SHOW_ALL}})();return document.createTreeWalker(t,r,null!=i?i:null,!0===n)},k=t=>{var e;return null==t||null===(e=t.tagName)||void 0===e?void 0:e.toLowerCase()},T=function(t){let e,i,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};"object"==typeof t?(n=t,t=n.tagName):n={attributes:n};const r=document.createElement(t);if(null!=n.editable&&(null==n.attributes&&(n.attributes={}),n.attributes.contenteditable=n.editable),n.attributes)for(e in n.attributes)i=n.attributes[e],r.setAttribute(e,i);if(n.style)for(e in n.style)i=n.style[e],r.style[e]=i;if(n.data)for(e in n.data)i=n.data[e],r.dataset[e]=i;return n.className&&n.className.split(" ").forEach((t=>{r.classList.add(t)})),n.textContent&&(r.textContent=n.textContent),n.childNodes&&[].concat(n.childNodes).forEach((t=>{r.appendChild(t)})),r};let w;const L=function(){if(null!=w)return w;w=[];for(const t in n){const e=n[t];e.tagName&&w.push(e.tagName)}return w},D=t=>I(null==t?void 0:t.firstChild),N=function(t){let{strict:e}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{strict:!0};return e?I(t):I(t)||!I(t.firstChild)&&function(t){return L().includes(k(t))&&!L().includes(k(t.firstChild))}(t)},I=t=>O(t)&&"block"===(null==t?void 0:t.data),O=t=>(null==t?void 0:t.nodeType)===Node.COMMENT_NODE,F=function(t){let{name:e}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(t)return B(t)?t.data===d?!e||t.parentNode.dataset.trixCursorTarget===e:void 0:F(t.firstChild)},P=t=>A(t,e),M=t=>B(t)&&""===(null==t?void 0:t.data),B=t=>(null==t?void 0:t.nodeType)===Node.TEXT_NODE,_={level2Enabled:!0,getLevel(){return this.level2Enabled&&a.supportsInputEvents?2:0},pickFiles(t){const e=T("input",{type:"file",multiple:!0,hidden:!0,id:this.fileInputId});e.addEventListener("change",(()=>{t(e.files),S(e)})),S(document.getElementById(this.fileInputId)),document.body.appendChild(e),e.click()}};var j={removeBlankTableCells:!1,tableCellSeparator:" | ",tableRowSeparator:"\n"},W={bold:{tagName:"strong",inheritable:!0,parser(t){const e=window.getComputedStyle(t);return"bold"===e.fontWeight||e.fontWeight>=600}},italic:{tagName:"em",inheritable:!0,parser:t=>"italic"===window.getComputedStyle(t).fontStyle},href:{groupTagName:"a",parser(t){const i="a:not(".concat(e,")"),n=t.closest(i);if(n)return n.getAttribute("href")}},strike:{tagName:"del",inheritable:!0},frozen:{style:{backgroundColor:"highlight"}}},U={getDefaultHTML:()=>'<div class="trix-button-row">\n      <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="'.concat(c.bold,'" tabindex="-1">').concat(c.bold,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="').concat(c.italic,'" tabindex="-1">').concat(c.italic,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="').concat(c.strike,'" tabindex="-1">').concat(c.strike,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="').concat(c.link,'" tabindex="-1">').concat(c.link,'</button>\n      </span>\n\n      <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="').concat(c.heading1,'" tabindex="-1">').concat(c.heading1,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="').concat(c.quote,'" tabindex="-1">').concat(c.quote,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="').concat(c.code,'" tabindex="-1">').concat(c.code,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="').concat(c.bullets,'" tabindex="-1">').concat(c.bullets,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="').concat(c.numbers,'" tabindex="-1">').concat(c.numbers,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="').concat(c.outdent,'" tabindex="-1">').concat(c.outdent,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="').concat(c.indent,'" tabindex="-1">').concat(c.indent,'</button>\n      </span>\n\n      <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="').concat(c.attachFiles,'" tabindex="-1">').concat(c.attachFiles,'</button>\n      </span>\n\n      <span class="trix-button-group-spacer"></span>\n\n      <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="').concat(c.undo,'" tabindex="-1">').concat(c.undo,'</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="').concat(c.redo,'" tabindex="-1">').concat(c.redo,'</button>\n      </span>\n    </div>\n\n    <div class="trix-dialogs" data-trix-dialogs>\n      <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">\n        <div class="trix-dialog__link-fields">\n          <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="').concat(c.urlPlaceholder,'" aria-label="').concat(c.url,'" data-trix-validate-href required data-trix-input>\n          <div class="trix-button-group">\n            <input type="button" class="trix-button trix-button--dialog" value="').concat(c.link,'" data-trix-method="setAttribute">\n            <input type="button" class="trix-button trix-button--dialog" value="').concat(c.unlink,'" data-trix-method="removeAttribute">\n          </div>\n        </div>\n      </div>\n    </div>')};const V={interval:5e3};var z=Object.freeze({__proto__:null,attachments:i,blockAttributes:n,browser:a,css:{attachment:"attachment",attachmentCaption:"attachment__caption",attachmentCaptionEditor:"attachment__caption-editor",attachmentMetadata:"attachment__metadata",attachmentMetadataContainer:"attachment__metadata-container",attachmentName:"attachment__name",attachmentProgress:"attachment__progress",attachmentSize:"attachment__size",attachmentToolbar:"attachment__toolbar",attachmentGallery:"attachment-gallery"},dompurify:l,fileSize:h,input:_,keyNames:{8:"backspace",9:"tab",13:"return",27:"escape",37:"left",39:"right",46:"delete",68:"d",72:"h",79:"o"},lang:c,parser:j,textAttributes:W,toolbar:U,undo:V});class q{static proxyMethod(t){const{name:e,toMethod:i,toProperty:n,optional:r}=H(t);this.prototype[e]=function(){let t,o;var s,a;i?o=r?null===(s=this[i])||void 0===s?void 0:s.call(this):this[i]():n&&(o=this[n]);return r?(t=null===(a=o)||void 0===a?void 0:a[e],t?J.call(t,o,arguments):void 0):(t=o[e],J.call(t,o,arguments))}}}const H=function(t){const e=t.match(K);if(!e)throw new Error("can't parse @proxyMethod expression: ".concat(t));const i={name:e[4]};return null!=e[2]?i.toMethod=e[1]:i.toProperty=e[1],null!=e[3]&&(i.optional=!0),i},{apply:J}=Function.prototype,K=new RegExp("^(.+?)(\\(\\))?(\\?)?\\.(.+?)$");var G,Y,X;class $ extends q{static box(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return t instanceof this?t:this.fromUCS2String(null==t?void 0:t.toString())}static fromUCS2String(t){return new this(t,et(t))}static fromCodepoints(t){return new this(it(t),t)}constructor(t,e){super(...arguments),this.ucs2String=t,this.codepoints=e,this.length=this.codepoints.length,this.ucs2Length=this.ucs2String.length}offsetToUCS2Offset(t){return it(this.codepoints.slice(0,Math.max(0,t))).length}offsetFromUCS2Offset(t){return et(this.ucs2String.slice(0,Math.max(0,t))).length}slice(){return this.constructor.fromCodepoints(this.codepoints.slice(...arguments))}charAt(t){return this.slice(t,t+1)}isEqualTo(t){return this.constructor.box(t).ucs2String===this.ucs2String}toJSON(){return this.ucs2String}getCacheKey(){return this.ucs2String}toString(){return this.ucs2String}}const Z=1===(null===(G=Array.from)||void 0===G?void 0:G.call(Array,"👼").length),Q=null!=(null===(Y=" ".codePointAt)||void 0===Y?void 0:Y.call(" ",0)),tt=" 👼"===(null===(X=String.fromCodePoint)||void 0===X?void 0:X.call(String,32,128124));let et,it;et=Z&&Q?t=>Array.from(t).map((t=>t.codePointAt(0))):function(t){const e=[];let i=0;const{length:n}=t;for(;i<n;){let r=t.charCodeAt(i++);if(55296<=r&&r<=56319&&i<n){const e=t.charCodeAt(i++);56320==(64512&e)?r=((1023&r)<<10)+(1023&e)+65536:i--}e.push(r)}return e},it=tt?t=>String.fromCodePoint(...Array.from(t||[])):function(t){return(()=>{const e=[];return Array.from(t).forEach((t=>{let i="";t>65535&&(t-=65536,i+=String.fromCharCode(t>>>10&1023|55296),t=56320|1023&t),e.push(i+String.fromCharCode(t))})),e})().join("")};let nt=0;class rt extends q{static fromJSONString(t){return this.fromJSON(JSON.parse(t))}constructor(){super(...arguments),this.id=++nt}hasSameConstructorAs(t){return this.constructor===(null==t?void 0:t.constructor)}isEqualTo(t){return this===t}inspect(){const t=[],e=this.contentsForInspection()||{};for(const i in e){const n=e[i];t.push("".concat(i,"=").concat(n))}return"#<".concat(this.constructor.name,":").concat(this.id).concat(t.length?" ".concat(t.join(", ")):"",">")}contentsForInspection(){}toJSONString(){return JSON.stringify(this)}toUTF16String(){return $.box(this)}getCacheKey(){return this.id.toString()}}const ot=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];if(t.length!==e.length)return!1;for(let i=0;i<t.length;i++){if(t[i]!==e[i])return!1}return!0},st=function(t){const e=t.slice(0);for(var i=arguments.length,n=new Array(i>1?i-1:0),r=1;r<i;r++)n[r-1]=arguments[r];return e.splice(...n),e},at=/[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/,lt=function(){const t=T("input",{dir:"auto",name:"x",dirName:"x.dir"}),e=T("textarea",{dir:"auto",name:"y",dirName:"y.dir"}),i=T("form");i.appendChild(t),i.appendChild(e);const n=function(){try{return new FormData(i).has(e.dirName)}catch(t){return!1}}(),r=function(){try{return t.matches(":dir(ltr),:dir(rtl)")}catch(t){return!1}}();return n?function(t){return e.value=t,new FormData(i).get(e.dirName)}:r?function(e){return t.value=e,t.matches(":dir(rtl)")?"rtl":"ltr"}:function(t){const e=t.trim().charAt(0);return at.test(e)?"rtl":"ltr"}}();let ct=null,ut=null,ht=null,dt=null;const gt=()=>(ct||(ct=bt().concat(pt())),ct),mt=t=>n[t],pt=()=>(ut||(ut=Object.keys(n)),ut),ft=t=>W[t],bt=()=>(ht||(ht=Object.keys(W)),ht),vt=function(t,e){At(t).textContent=e.replace(/%t/g,t)},At=function(t){const e=document.createElement("style");e.setAttribute("type","text/css"),e.setAttribute("data-tag-name",t.toLowerCase());const i=yt();return i&&e.setAttribute("nonce",i),document.head.insertBefore(e,document.head.firstChild),e},yt=function(){const t=xt("trix-csp-nonce")||xt("csp-nonce");if(t){const{nonce:e,content:i}=t;return""==e?i:e}},xt=t=>document.head.querySelector("meta[name=".concat(t,"]")),Ct={"application/x-trix-feature-detection":"test"},Et=function(t){const e=t.getData("text/plain"),i=t.getData("text/html");if(!e||!i)return null==e?void 0:e.length;{const{body:t}=(new DOMParser).parseFromString(i,"text/html");if(t.textContent===e)return!t.querySelector("*")}},St=/Mac|^iP/.test(navigator.platform)?t=>t.metaKey:t=>t.ctrlKey;const Rt=t=>setTimeout(t,1),kt=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const e={};for(const i in t){const n=t[i];e[i]=n}return e},Tt=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(Object.keys(t).length!==Object.keys(e).length)return!1;for(const i in t){if(t[i]!==e[i])return!1}return!0},wt=function(t){if(null!=t)return Array.isArray(t)||(t=[t,t]),[Nt(t[0]),Nt(null!=t[1]?t[1]:t[0])]},Lt=function(t){if(null==t)return;const[e,i]=wt(t);return It(e,i)},Dt=function(t,e){if(null==t||null==e)return;const[i,n]=wt(t),[r,o]=wt(e);return It(i,r)&&It(n,o)},Nt=function(t){return"number"==typeof t?t:kt(t)},It=function(t,e){return"number"==typeof t?t===e:Tt(t,e)};class Ot extends q{constructor(){super(...arguments),this.update=this.update.bind(this),this.selectionManagers=[]}start(){this.started||(this.started=!0,document.addEventListener("selectionchange",this.update,!0))}stop(){if(this.started)return this.started=!1,document.removeEventListener("selectionchange",this.update,!0)}registerSelectionManager(t){if(!this.selectionManagers.includes(t))return this.selectionManagers.push(t),this.start()}unregisterSelectionManager(t){if(this.selectionManagers=this.selectionManagers.filter((e=>e!==t)),0===this.selectionManagers.length)return this.stop()}notifySelectionManagersOfSelectionChange(){return this.selectionManagers.map((t=>t.selectionDidChange()))}update(){this.notifySelectionManagersOfSelectionChange()}reset(){this.update()}}const Ft=new Ot,Pt=function(){const t=window.getSelection();if(t.rangeCount>0)return t},Mt=function(){var t;const e=null===(t=Pt())||void 0===t?void 0:t.getRangeAt(0);if(e&&!_t(e))return e},Bt=function(t){const e=window.getSelection();return e.removeAllRanges(),e.addRange(t),Ft.update()},_t=t=>jt(t.startContainer)||jt(t.endContainer),jt=t=>!Object.getPrototypeOf(t),Wt=t=>t.replace(new RegExp("".concat(d),"g"),"").replace(new RegExp("".concat(g),"g")," "),Ut=new RegExp("[^\\S".concat(g,"]")),Vt=t=>t.replace(new RegExp("".concat(Ut.source),"g")," ").replace(/\ {2,}/g," "),zt=function(t,e){if(t.isEqualTo(e))return["",""];const i=qt(t,e),{length:n}=i.utf16String;let r;if(n){const{offset:o}=i,s=t.codepoints.slice(0,o).concat(t.codepoints.slice(o+n));r=qt(e,$.fromCodepoints(s))}else r=qt(e,t);return[i.utf16String.toString(),r.utf16String.toString()]},qt=function(t,e){let i=0,n=t.length,r=e.length;for(;i<n&&t.charAt(i).isEqualTo(e.charAt(i));)i++;for(;n>i+1&&t.charAt(n-1).isEqualTo(e.charAt(r-1));)n--,r--;return{utf16String:t.slice(i,n),offset:i}};class Ht extends rt{static fromCommonAttributesOfObjects(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];if(!t.length)return new this;let e=Yt(t[0]),i=e.getKeys();return t.slice(1).forEach((t=>{i=e.getKeysCommonToHash(Yt(t)),e=e.slice(i)})),e}static box(t){return Yt(t)}constructor(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};super(...arguments),this.values=Gt(t)}add(t,e){return this.merge(Jt(t,e))}remove(t){return new Ht(Gt(this.values,t))}get(t){return this.values[t]}has(t){return t in this.values}merge(t){return new Ht(Kt(this.values,Xt(t)))}slice(t){const e={};return Array.from(t).forEach((t=>{this.has(t)&&(e[t]=this.values[t])})),new Ht(e)}getKeys(){return Object.keys(this.values)}getKeysCommonToHash(t){return t=Yt(t),this.getKeys().filter((e=>this.values[e]===t.values[e]))}isEqualTo(t){return ot(this.toArray(),Yt(t).toArray())}isEmpty(){return 0===this.getKeys().length}toArray(){if(!this.array){const t=[];for(const e in this.values){const i=this.values[e];t.push(t.push(e,i))}this.array=t.slice(0)}return this.array}toObject(){return Gt(this.values)}toJSON(){return this.toObject()}contentsForInspection(){return{values:JSON.stringify(this.values)}}}const Jt=function(t,e){const i={};return i[t]=e,i},Kt=function(t,e){const i=Gt(t);for(const t in e){const n=e[t];i[t]=n}return i},Gt=function(t,e){const i={};return Object.keys(t).sort().forEach((n=>{n!==e&&(i[n]=t[n])})),i},Yt=function(t){return t instanceof Ht?t:new Ht(t)},Xt=function(t){return t instanceof Ht?t.values:t};class $t{static groupObjects(){let t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],{depth:i,asTree:n}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};n&&null==i&&(i=0);const r=[];return Array.from(e).forEach((e=>{var o;if(t){var s,a,l;if(null!==(s=e.canBeGrouped)&&void 0!==s&&s.call(e,i)&&null!==(a=(l=t[t.length-1]).canBeGroupedWith)&&void 0!==a&&a.call(l,e,i))return void t.push(e);r.push(new this(t,{depth:i,asTree:n})),t=null}null!==(o=e.canBeGrouped)&&void 0!==o&&o.call(e,i)?t=[e]:r.push(e)})),t&&r.push(new this(t,{depth:i,asTree:n})),r}constructor(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],{depth:e,asTree:i}=arguments.length>1?arguments[1]:void 0;this.objects=t,i&&(this.depth=e,this.objects=this.constructor.groupObjects(this.objects,{asTree:i,depth:this.depth+1}))}getObjects(){return this.objects}getDepth(){return this.depth}getCacheKey(){const t=["objectGroup"];return Array.from(this.getObjects()).forEach((e=>{t.push(e.getCacheKey())})),t.join("/")}}class Zt extends q{constructor(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];super(...arguments),this.objects={},Array.from(t).forEach((t=>{const e=JSON.stringify(t);null==this.objects[e]&&(this.objects[e]=t)}))}find(t){const e=JSON.stringify(t);return this.objects[e]}}class Qt{constructor(t){this.reset(t)}add(t){const e=te(t);this.elements[e]=t}remove(t){const e=te(t),i=this.elements[e];if(i)return delete this.elements[e],i}reset(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return this.elements={},Array.from(t).forEach((t=>{this.add(t)})),t}}const te=t=>t.dataset.trixStoreKey;class ee extends q{isPerforming(){return!0===this.performing}hasPerformed(){return!0===this.performed}hasSucceeded(){return this.performed&&this.succeeded}hasFailed(){return this.performed&&!this.succeeded}getPromise(){return this.promise||(this.promise=new Promise(((t,e)=>(this.performing=!0,this.perform(((i,n)=>{this.succeeded=i,this.performing=!1,this.performed=!0,this.succeeded?t(n):e(n)})))))),this.promise}perform(t){return t(!1)}release(){var t,e;null===(t=this.promise)||void 0===t||null===(e=t.cancel)||void 0===e||e.call(t),this.promise=null,this.performing=null,this.performed=null,this.succeeded=null}}ee.proxyMethod("getPromise().then"),ee.proxyMethod("getPromise().catch");class ie extends q{constructor(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};super(...arguments),this.object=t,this.options=e,this.childViews=[],this.rootView=this}getNodes(){return this.nodes||(this.nodes=this.createNodes()),this.nodes.map((t=>t.cloneNode(!0)))}invalidate(){var t;return this.nodes=null,this.childViews=[],null===(t=this.parentView)||void 0===t?void 0:t.invalidate()}invalidateViewForObject(t){var e;return null===(e=this.findViewForObject(t))||void 0===e?void 0:e.invalidate()}findOrCreateCachedChildView(t,e,i){let n=this.getCachedViewForObject(e);return n?this.recordChildView(n):(n=this.createChildView(...arguments),this.cacheViewForObject(n,e)),n}createChildView(t,e){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e instanceof $t&&(i.viewClass=t,t=ne);const n=new t(e,i);return this.recordChildView(n)}recordChildView(t){return t.parentView=this,t.rootView=this.rootView,this.childViews.push(t),t}getAllChildViews(){let t=[];return this.childViews.forEach((e=>{t.push(e),t=t.concat(e.getAllChildViews())})),t}findElement(){return this.findElementForObject(this.object)}findElementForObject(t){const e=null==t?void 0:t.id;if(e)return this.rootView.element.querySelector("[data-trix-id='".concat(e,"']"))}findViewForObject(t){for(const e of this.getAllChildViews())if(e.object===t)return e}getViewCache(){return this.rootView!==this?this.rootView.getViewCache():this.isViewCachingEnabled()?(this.viewCache||(this.viewCache={}),this.viewCache):void 0}isViewCachingEnabled(){return!1!==this.shouldCacheViews}enableViewCaching(){this.shouldCacheViews=!0}disableViewCaching(){this.shouldCacheViews=!1}getCachedViewForObject(t){var e;return null===(e=this.getViewCache())||void 0===e?void 0:e[t.getCacheKey()]}cacheViewForObject(t,e){const i=this.getViewCache();i&&(i[e.getCacheKey()]=t)}garbageCollectCachedViews(){const t=this.getViewCache();if(t){const e=this.getAllChildViews().concat(this).map((t=>t.object.getCacheKey()));for(const i in t)e.includes(i)||delete t[i]}}}class ne extends ie{constructor(){super(...arguments),this.objectGroup=this.object,this.viewClass=this.options.viewClass,delete this.options.viewClass}getChildViews(){return this.childViews.length||Array.from(this.objectGroup.getObjects()).forEach((t=>{this.findOrCreateCachedChildView(this.viewClass,t,this.options)})),this.childViews}createNodes(){const t=this.createContainerElement();return this.getChildViews().forEach((e=>{Array.from(e.getNodes()).forEach((e=>{t.appendChild(e)}))})),[t]}createContainerElement(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.objectGroup.getDepth();return this.getChildViews()[0].createContainerElement(t)}}
/*! @license DOMPurify 3.2.5 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.5/LICENSE */const{entries:re,setPrototypeOf:oe,isFrozen:se,getPrototypeOf:ae,getOwnPropertyDescriptor:le}=Object;let{freeze:ce,seal:ue,create:he}=Object,{apply:de,construct:ge}="undefined"!=typeof Reflect&&Reflect;ce||(ce=function(t){return t}),ue||(ue=function(t){return t}),de||(de=function(t,e,i){return t.apply(e,i)}),ge||(ge=function(t,e){return new t(...e)});const me=Le(Array.prototype.forEach),pe=Le(Array.prototype.lastIndexOf),fe=Le(Array.prototype.pop),be=Le(Array.prototype.push),ve=Le(Array.prototype.splice),Ae=Le(String.prototype.toLowerCase),ye=Le(String.prototype.toString),xe=Le(String.prototype.match),Ce=Le(String.prototype.replace),Ee=Le(String.prototype.indexOf),Se=Le(String.prototype.trim),Re=Le(Object.prototype.hasOwnProperty),ke=Le(RegExp.prototype.test),Te=(we=TypeError,function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return ge(we,e)});var we;function Le(t){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var i=arguments.length,n=new Array(i>1?i-1:0),r=1;r<i;r++)n[r-1]=arguments[r];return de(t,e,n)}}function De(t,e){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:Ae;oe&&oe(t,null);let n=e.length;for(;n--;){let r=e[n];if("string"==typeof r){const t=i(r);t!==r&&(se(e)||(e[n]=t),r=t)}t[r]=!0}return t}function Ne(t){for(let e=0;e<t.length;e++){Re(t,e)||(t[e]=null)}return t}function Ie(t){const e=he(null);for(const[i,n]of re(t)){Re(t,i)&&(Array.isArray(n)?e[i]=Ne(n):n&&"object"==typeof n&&n.constructor===Object?e[i]=Ie(n):e[i]=n)}return e}function Oe(t,e){for(;null!==t;){const i=le(t,e);if(i){if(i.get)return Le(i.get);if("function"==typeof i.value)return Le(i.value)}t=ae(t)}return function(){return null}}const Fe=ce(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Pe=ce(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Me=ce(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),Be=ce(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),_e=ce(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),je=ce(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),We=ce(["#text"]),Ue=ce(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Ve=ce(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),ze=ce(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),qe=ce(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),He=ue(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Je=ue(/<%[\w\W]*|[\w\W]*%>/gm),Ke=ue(/\$\{[\w\W]*/gm),Ge=ue(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ye=ue(/^aria-[\-\w]+$/),Xe=ue(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),$e=ue(/^(?:\w+script|data):/i),Ze=ue(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Qe=ue(/^html$/i),ti=ue(/^[a-z][.\w]*(-[.\w]+)+$/i);var ei=Object.freeze({__proto__:null,ARIA_ATTR:Ye,ATTR_WHITESPACE:Ze,CUSTOM_ELEMENT:ti,DATA_ATTR:Ge,DOCTYPE_NAME:Qe,ERB_EXPR:Je,IS_ALLOWED_URI:Xe,IS_SCRIPT_OR_DATA:$e,MUSTACHE_EXPR:He,TMPLIT_EXPR:Ke});const ii=1,ni=3,ri=7,oi=8,si=9,ai=function(){return"undefined"==typeof window?null:window};var li=function t(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ai();const i=e=>t(e);if(i.version="3.2.5",i.removed=[],!e||!e.document||e.document.nodeType!==si||!e.Element)return i.isSupported=!1,i;let{document:n}=e;const r=n,o=r.currentScript,{DocumentFragment:s,HTMLTemplateElement:a,Node:l,Element:c,NodeFilter:u,NamedNodeMap:h=e.NamedNodeMap||e.MozNamedAttrMap,HTMLFormElement:d,DOMParser:g,trustedTypes:m}=e,p=c.prototype,f=Oe(p,"cloneNode"),b=Oe(p,"remove"),v=Oe(p,"nextSibling"),A=Oe(p,"childNodes"),y=Oe(p,"parentNode");if("function"==typeof a){const t=n.createElement("template");t.content&&t.content.ownerDocument&&(n=t.content.ownerDocument)}let x,C="";const{implementation:E,createNodeIterator:S,createDocumentFragment:R,getElementsByTagName:k}=n,{importNode:T}=r;let w={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]};i.isSupported="function"==typeof re&&"function"==typeof y&&E&&void 0!==E.createHTMLDocument;const{MUSTACHE_EXPR:L,ERB_EXPR:D,TMPLIT_EXPR:N,DATA_ATTR:I,ARIA_ATTR:O,IS_SCRIPT_OR_DATA:F,ATTR_WHITESPACE:P,CUSTOM_ELEMENT:M}=ei;let{IS_ALLOWED_URI:B}=ei,_=null;const j=De({},[...Fe,...Pe,...Me,..._e,...We]);let W=null;const U=De({},[...Ue,...Ve,...ze,...qe]);let V=Object.seal(he(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),z=null,q=null,H=!0,J=!0,K=!1,G=!0,Y=!1,X=!0,$=!1,Z=!1,Q=!1,tt=!1,et=!1,it=!1,nt=!0,rt=!1,ot=!0,st=!1,at={},lt=null;const ct=De({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let ut=null;const ht=De({},["audio","video","img","source","image","track"]);let dt=null;const gt=De({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),mt="http://www.w3.org/1998/Math/MathML",pt="http://www.w3.org/2000/svg",ft="http://www.w3.org/1999/xhtml";let bt=ft,vt=!1,At=null;const yt=De({},[mt,pt,ft],ye);let xt=De({},["mi","mo","mn","ms","mtext"]),Ct=De({},["annotation-xml"]);const Et=De({},["title","style","font","a","script"]);let St=null;const Rt=["application/xhtml+xml","text/html"];let kt=null,Tt=null;const wt=n.createElement("form"),Lt=function(t){return t instanceof RegExp||t instanceof Function},Dt=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!Tt||Tt!==t){if(t&&"object"==typeof t||(t={}),t=Ie(t),St=-1===Rt.indexOf(t.PARSER_MEDIA_TYPE)?"text/html":t.PARSER_MEDIA_TYPE,kt="application/xhtml+xml"===St?ye:Ae,_=Re(t,"ALLOWED_TAGS")?De({},t.ALLOWED_TAGS,kt):j,W=Re(t,"ALLOWED_ATTR")?De({},t.ALLOWED_ATTR,kt):U,At=Re(t,"ALLOWED_NAMESPACES")?De({},t.ALLOWED_NAMESPACES,ye):yt,dt=Re(t,"ADD_URI_SAFE_ATTR")?De(Ie(gt),t.ADD_URI_SAFE_ATTR,kt):gt,ut=Re(t,"ADD_DATA_URI_TAGS")?De(Ie(ht),t.ADD_DATA_URI_TAGS,kt):ht,lt=Re(t,"FORBID_CONTENTS")?De({},t.FORBID_CONTENTS,kt):ct,z=Re(t,"FORBID_TAGS")?De({},t.FORBID_TAGS,kt):{},q=Re(t,"FORBID_ATTR")?De({},t.FORBID_ATTR,kt):{},at=!!Re(t,"USE_PROFILES")&&t.USE_PROFILES,H=!1!==t.ALLOW_ARIA_ATTR,J=!1!==t.ALLOW_DATA_ATTR,K=t.ALLOW_UNKNOWN_PROTOCOLS||!1,G=!1!==t.ALLOW_SELF_CLOSE_IN_ATTR,Y=t.SAFE_FOR_TEMPLATES||!1,X=!1!==t.SAFE_FOR_XML,$=t.WHOLE_DOCUMENT||!1,tt=t.RETURN_DOM||!1,et=t.RETURN_DOM_FRAGMENT||!1,it=t.RETURN_TRUSTED_TYPE||!1,Q=t.FORCE_BODY||!1,nt=!1!==t.SANITIZE_DOM,rt=t.SANITIZE_NAMED_PROPS||!1,ot=!1!==t.KEEP_CONTENT,st=t.IN_PLACE||!1,B=t.ALLOWED_URI_REGEXP||Xe,bt=t.NAMESPACE||ft,xt=t.MATHML_TEXT_INTEGRATION_POINTS||xt,Ct=t.HTML_INTEGRATION_POINTS||Ct,V=t.CUSTOM_ELEMENT_HANDLING||{},t.CUSTOM_ELEMENT_HANDLING&&Lt(t.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(V.tagNameCheck=t.CUSTOM_ELEMENT_HANDLING.tagNameCheck),t.CUSTOM_ELEMENT_HANDLING&&Lt(t.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(V.attributeNameCheck=t.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),t.CUSTOM_ELEMENT_HANDLING&&"boolean"==typeof t.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements&&(V.allowCustomizedBuiltInElements=t.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Y&&(J=!1),et&&(tt=!0),at&&(_=De({},We),W=[],!0===at.html&&(De(_,Fe),De(W,Ue)),!0===at.svg&&(De(_,Pe),De(W,Ve),De(W,qe)),!0===at.svgFilters&&(De(_,Me),De(W,Ve),De(W,qe)),!0===at.mathMl&&(De(_,_e),De(W,ze),De(W,qe))),t.ADD_TAGS&&(_===j&&(_=Ie(_)),De(_,t.ADD_TAGS,kt)),t.ADD_ATTR&&(W===U&&(W=Ie(W)),De(W,t.ADD_ATTR,kt)),t.ADD_URI_SAFE_ATTR&&De(dt,t.ADD_URI_SAFE_ATTR,kt),t.FORBID_CONTENTS&&(lt===ct&&(lt=Ie(lt)),De(lt,t.FORBID_CONTENTS,kt)),ot&&(_["#text"]=!0),$&&De(_,["html","head","body"]),_.table&&(De(_,["tbody"]),delete z.tbody),t.TRUSTED_TYPES_POLICY){if("function"!=typeof t.TRUSTED_TYPES_POLICY.createHTML)throw Te('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if("function"!=typeof t.TRUSTED_TYPES_POLICY.createScriptURL)throw Te('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');x=t.TRUSTED_TYPES_POLICY,C=x.createHTML("")}else void 0===x&&(x=function(t,e){if("object"!=typeof t||"function"!=typeof t.createPolicy)return null;let i=null;const n="data-tt-policy-suffix";e&&e.hasAttribute(n)&&(i=e.getAttribute(n));const r="dompurify"+(i?"#"+i:"");try{return t.createPolicy(r,{createHTML:t=>t,createScriptURL:t=>t})}catch(t){return console.warn("TrustedTypes policy "+r+" could not be created."),null}}(m,o)),null!==x&&"string"==typeof C&&(C=x.createHTML(""));ce&&ce(t),Tt=t}},Nt=De({},[...Pe,...Me,...Be]),It=De({},[..._e,...je]),Ot=function(t){be(i.removed,{element:t});try{y(t).removeChild(t)}catch(e){b(t)}},Ft=function(t,e){try{be(i.removed,{attribute:e.getAttributeNode(t),from:e})}catch(t){be(i.removed,{attribute:null,from:e})}if(e.removeAttribute(t),"is"===t)if(tt||et)try{Ot(e)}catch(t){}else try{e.setAttribute(t,"")}catch(t){}},Pt=function(t){let e=null,i=null;if(Q)t="<remove></remove>"+t;else{const e=xe(t,/^[\r\n\t ]+/);i=e&&e[0]}"application/xhtml+xml"===St&&bt===ft&&(t='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+t+"</body></html>");const r=x?x.createHTML(t):t;if(bt===ft)try{e=(new g).parseFromString(r,St)}catch(t){}if(!e||!e.documentElement){e=E.createDocument(bt,"template",null);try{e.documentElement.innerHTML=vt?C:r}catch(t){}}const o=e.body||e.documentElement;return t&&i&&o.insertBefore(n.createTextNode(i),o.childNodes[0]||null),bt===ft?k.call(e,$?"html":"body")[0]:$?e.documentElement:o},Mt=function(t){return S.call(t.ownerDocument||t,t,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},Bt=function(t){return t instanceof d&&("string"!=typeof t.nodeName||"string"!=typeof t.textContent||"function"!=typeof t.removeChild||!(t.attributes instanceof h)||"function"!=typeof t.removeAttribute||"function"!=typeof t.setAttribute||"string"!=typeof t.namespaceURI||"function"!=typeof t.insertBefore||"function"!=typeof t.hasChildNodes)},_t=function(t){return"function"==typeof l&&t instanceof l};function jt(t,e,n){me(t,(t=>{t.call(i,e,n,Tt)}))}const Wt=function(t){let e=null;if(jt(w.beforeSanitizeElements,t,null),Bt(t))return Ot(t),!0;const n=kt(t.nodeName);if(jt(w.uponSanitizeElement,t,{tagName:n,allowedTags:_}),t.hasChildNodes()&&!_t(t.firstElementChild)&&ke(/<[/\w!]/g,t.innerHTML)&&ke(/<[/\w!]/g,t.textContent))return Ot(t),!0;if(t.nodeType===ri)return Ot(t),!0;if(X&&t.nodeType===oi&&ke(/<[/\w]/g,t.data))return Ot(t),!0;if(!_[n]||z[n]){if(!z[n]&&Vt(n)){if(V.tagNameCheck instanceof RegExp&&ke(V.tagNameCheck,n))return!1;if(V.tagNameCheck instanceof Function&&V.tagNameCheck(n))return!1}if(ot&&!lt[n]){const e=y(t)||t.parentNode,i=A(t)||t.childNodes;if(i&&e){for(let n=i.length-1;n>=0;--n){const r=f(i[n],!0);r.__removalCount=(t.__removalCount||0)+1,e.insertBefore(r,v(t))}}}return Ot(t),!0}return t instanceof c&&!function(t){let e=y(t);e&&e.tagName||(e={namespaceURI:bt,tagName:"template"});const i=Ae(t.tagName),n=Ae(e.tagName);return!!At[t.namespaceURI]&&(t.namespaceURI===pt?e.namespaceURI===ft?"svg"===i:e.namespaceURI===mt?"svg"===i&&("annotation-xml"===n||xt[n]):Boolean(Nt[i]):t.namespaceURI===mt?e.namespaceURI===ft?"math"===i:e.namespaceURI===pt?"math"===i&&Ct[n]:Boolean(It[i]):t.namespaceURI===ft?!(e.namespaceURI===pt&&!Ct[n])&&!(e.namespaceURI===mt&&!xt[n])&&!It[i]&&(Et[i]||!Nt[i]):!("application/xhtml+xml"!==St||!At[t.namespaceURI]))}(t)?(Ot(t),!0):"noscript"!==n&&"noembed"!==n&&"noframes"!==n||!ke(/<\/no(script|embed|frames)/i,t.innerHTML)?(Y&&t.nodeType===ni&&(e=t.textContent,me([L,D,N],(t=>{e=Ce(e,t," ")})),t.textContent!==e&&(be(i.removed,{element:t.cloneNode()}),t.textContent=e)),jt(w.afterSanitizeElements,t,null),!1):(Ot(t),!0)},Ut=function(t,e,i){if(nt&&("id"===e||"name"===e)&&(i in n||i in wt))return!1;if(J&&!q[e]&&ke(I,e));else if(H&&ke(O,e));else if(!W[e]||q[e]){if(!(Vt(t)&&(V.tagNameCheck instanceof RegExp&&ke(V.tagNameCheck,t)||V.tagNameCheck instanceof Function&&V.tagNameCheck(t))&&(V.attributeNameCheck instanceof RegExp&&ke(V.attributeNameCheck,e)||V.attributeNameCheck instanceof Function&&V.attributeNameCheck(e))||"is"===e&&V.allowCustomizedBuiltInElements&&(V.tagNameCheck instanceof RegExp&&ke(V.tagNameCheck,i)||V.tagNameCheck instanceof Function&&V.tagNameCheck(i))))return!1}else if(dt[e]);else if(ke(B,Ce(i,P,"")));else if("src"!==e&&"xlink:href"!==e&&"href"!==e||"script"===t||0!==Ee(i,"data:")||!ut[t]){if(K&&!ke(F,Ce(i,P,"")));else if(i)return!1}else;return!0},Vt=function(t){return"annotation-xml"!==t&&xe(t,M)},zt=function(t){jt(w.beforeSanitizeAttributes,t,null);const{attributes:e}=t;if(!e||Bt(t))return;const n={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:W,forceKeepAttr:void 0};let r=e.length;for(;r--;){const o=e[r],{name:s,namespaceURI:a,value:l}=o,c=kt(s);let u="value"===s?l:Se(l);if(n.attrName=c,n.attrValue=u,n.keepAttr=!0,n.forceKeepAttr=void 0,jt(w.uponSanitizeAttribute,t,n),u=n.attrValue,!rt||"id"!==c&&"name"!==c||(Ft(s,t),u="user-content-"+u),X&&ke(/((--!?|])>)|<\/(style|title)/i,u)){Ft(s,t);continue}if(n.forceKeepAttr)continue;if(Ft(s,t),!n.keepAttr)continue;if(!G&&ke(/\/>/i,u)){Ft(s,t);continue}Y&&me([L,D,N],(t=>{u=Ce(u,t," ")}));const h=kt(t.nodeName);if(Ut(h,c,u)){if(x&&"object"==typeof m&&"function"==typeof m.getAttributeType)if(a);else switch(m.getAttributeType(h,c)){case"TrustedHTML":u=x.createHTML(u);break;case"TrustedScriptURL":u=x.createScriptURL(u)}try{a?t.setAttributeNS(a,s,u):t.setAttribute(s,u),Bt(t)?Ot(t):fe(i.removed)}catch(t){}}}jt(w.afterSanitizeAttributes,t,null)},qt=function t(e){let i=null;const n=Mt(e);for(jt(w.beforeSanitizeShadowDOM,e,null);i=n.nextNode();)jt(w.uponSanitizeShadowNode,i,null),Wt(i),zt(i),i.content instanceof s&&t(i.content);jt(w.afterSanitizeShadowDOM,e,null)};return i.sanitize=function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=null,o=null,a=null,c=null;if(vt=!t,vt&&(t="\x3c!--\x3e"),"string"!=typeof t&&!_t(t)){if("function"!=typeof t.toString)throw Te("toString is not a function");if("string"!=typeof(t=t.toString()))throw Te("dirty is not a string, aborting")}if(!i.isSupported)return t;if(Z||Dt(e),i.removed=[],"string"==typeof t&&(st=!1),st){if(t.nodeName){const e=kt(t.nodeName);if(!_[e]||z[e])throw Te("root node is forbidden and cannot be sanitized in-place")}}else if(t instanceof l)n=Pt("\x3c!----\x3e"),o=n.ownerDocument.importNode(t,!0),o.nodeType===ii&&"BODY"===o.nodeName||"HTML"===o.nodeName?n=o:n.appendChild(o);else{if(!tt&&!Y&&!$&&-1===t.indexOf("<"))return x&&it?x.createHTML(t):t;if(n=Pt(t),!n)return tt?null:it?C:""}n&&Q&&Ot(n.firstChild);const u=Mt(st?t:n);for(;a=u.nextNode();)Wt(a),zt(a),a.content instanceof s&&qt(a.content);if(st)return t;if(tt){if(et)for(c=R.call(n.ownerDocument);n.firstChild;)c.appendChild(n.firstChild);else c=n;return(W.shadowroot||W.shadowrootmode)&&(c=T.call(r,c,!0)),c}let h=$?n.outerHTML:n.innerHTML;return $&&_["!doctype"]&&n.ownerDocument&&n.ownerDocument.doctype&&n.ownerDocument.doctype.name&&ke(Qe,n.ownerDocument.doctype.name)&&(h="<!DOCTYPE "+n.ownerDocument.doctype.name+">\n"+h),Y&&me([L,D,N],(t=>{h=Ce(h,t," ")})),x&&it?x.createHTML(h):h},i.setConfig=function(){Dt(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}),Z=!0},i.clearConfig=function(){Tt=null,Z=!1},i.isValidAttribute=function(t,e,i){Tt||Dt({});const n=kt(t),r=kt(e);return Ut(n,r,i)},i.addHook=function(t,e){"function"==typeof e&&be(w[t],e)},i.removeHook=function(t,e){if(void 0!==e){const i=pe(w[t],e);return-1===i?void 0:ve(w[t],i,1)[0]}return fe(w[t])},i.removeHooks=function(t){w[t]=[]},i.removeAllHooks=function(){w={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},i}();li.addHook("uponSanitizeAttribute",(function(t,e){/^data-trix-/.test(e.attrName)&&(e.forceKeepAttr=!0)}));const ci="style href src width height language class".split(" "),ui="javascript:".split(" "),hi="script iframe form noscript".split(" ");class di extends q{static setHTML(t,e,i){const n=new this(e,i).sanitize(),r=n.getHTML?n.getHTML():n.outerHTML;t.innerHTML=r}static sanitize(t,e){const i=new this(t,e);return i.sanitize(),i}constructor(t){let{allowedAttributes:e,forbiddenProtocols:i,forbiddenElements:n,purifyOptions:r}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};super(...arguments),this.allowedAttributes=e||ci,this.forbiddenProtocols=i||ui,this.forbiddenElements=n||hi,this.purifyOptions=r||{},this.body=gi(t)}sanitize(){this.sanitizeElements(),this.normalizeListElementNesting();const t=Object.assign({},l,this.purifyOptions);return li.setConfig(t),this.body=li.sanitize(this.body),this.body}getHTML(){return this.body.innerHTML}getBody(){return this.body}sanitizeElements(){const t=R(this.body),e=[];for(;t.nextNode();){const i=t.currentNode;switch(i.nodeType){case Node.ELEMENT_NODE:this.elementIsRemovable(i)?e.push(i):this.sanitizeElement(i);break;case Node.COMMENT_NODE:e.push(i)}}return e.forEach((t=>S(t))),this.body}sanitizeElement(t){return t.hasAttribute("href")&&this.forbiddenProtocols.includes(t.protocol)&&t.removeAttribute("href"),Array.from(t.attributes).forEach((e=>{let{name:i}=e;this.allowedAttributes.includes(i)||0===i.indexOf("data-trix")||t.removeAttribute(i)})),t}normalizeListElementNesting(){return Array.from(this.body.querySelectorAll("ul,ol")).forEach((t=>{const e=t.previousElementSibling;e&&"li"===k(e)&&e.appendChild(t)})),this.body}elementIsRemovable(t){if((null==t?void 0:t.nodeType)===Node.ELEMENT_NODE)return this.elementIsForbidden(t)||this.elementIsntSerializable(t)}elementIsForbidden(t){return this.forbiddenElements.includes(k(t))}elementIsntSerializable(t){return"false"===t.getAttribute("data-trix-serialize")&&!P(t)}}const gi=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";t=t.replace(/<\/html[^>]*>[^]*$/i,"</html>");const e=document.implementation.createHTMLDocument("");return e.documentElement.innerHTML=t,Array.from(e.head.querySelectorAll("style")).forEach((t=>{e.body.appendChild(t)})),e.body},{css:mi}=z;class pi extends ie{constructor(){super(...arguments),this.attachment=this.object,this.attachment.uploadProgressDelegate=this,this.attachmentPiece=this.options.piece}createContentNodes(){return[]}createNodes(){let t;const e=t=T({tagName:"figure",className:this.getClassName(),data:this.getData(),editable:!1}),i=this.getHref();return i&&(t=T({tagName:"a",editable:!1,attributes:{href:i,tabindex:-1}}),e.appendChild(t)),this.attachment.hasContent()?di.setHTML(t,this.attachment.getContent()):this.createContentNodes().forEach((e=>{t.appendChild(e)})),t.appendChild(this.createCaptionElement()),this.attachment.isPending()&&(this.progressElement=T({tagName:"progress",attributes:{class:mi.attachmentProgress,value:this.attachment.getUploadProgress(),max:100},data:{trixMutable:!0,trixStoreKey:["progressElement",this.attachment.id].join("/")}}),e.appendChild(this.progressElement)),[fi("left"),e,fi("right")]}createCaptionElement(){const t=T({tagName:"figcaption",className:mi.attachmentCaption}),e=this.attachmentPiece.getCaption();if(e)t.classList.add("".concat(mi.attachmentCaption,"--edited")),t.textContent=e;else{let e,i;const n=this.getCaptionConfig();if(n.name&&(e=this.attachment.getFilename()),n.size&&(i=this.attachment.getFormattedFilesize()),e){const i=T({tagName:"span",className:mi.attachmentName,textContent:e});t.appendChild(i)}if(i){e&&t.appendChild(document.createTextNode(" "));const n=T({tagName:"span",className:mi.attachmentSize,textContent:i});t.appendChild(n)}}return t}getClassName(){const t=[mi.attachment,"".concat(mi.attachment,"--").concat(this.attachment.getType())],e=this.attachment.getExtension();return e&&t.push("".concat(mi.attachment,"--").concat(e)),t.join(" ")}getData(){const t={trixAttachment:JSON.stringify(this.attachment),trixContentType:this.attachment.getContentType(),trixId:this.attachment.id},{attributes:e}=this.attachmentPiece;return e.isEmpty()||(t.trixAttributes=JSON.stringify(e)),this.attachment.isPending()&&(t.trixSerialize=!1),t}getHref(){if(!bi(this.attachment.getContent(),"a"))return this.attachment.getHref()}getCaptionConfig(){var t;const e=this.attachment.getType(),n=kt(null===(t=i[e])||void 0===t?void 0:t.caption);return"file"===e&&(n.name=!0),n}findProgressElement(){var t;return null===(t=this.findElement())||void 0===t?void 0:t.querySelector("progress")}attachmentDidChangeUploadProgress(){const t=this.attachment.getUploadProgress(),e=this.findProgressElement();e&&(e.value=t)}}const fi=t=>T({tagName:"span",textContent:d,data:{trixCursorTarget:t,trixSerialize:!1}}),bi=function(t,e){const i=T("div");return di.setHTML(i,t||""),i.querySelector(e)};class vi extends pi{constructor(){super(...arguments),this.attachment.previewDelegate=this}createContentNodes(){return this.image=T({tagName:"img",attributes:{src:""},data:{trixMutable:!0}}),this.refresh(this.image),[this.image]}createCaptionElement(){const t=super.createCaptionElement(...arguments);return t.textContent||t.setAttribute("data-trix-placeholder",c.captionPlaceholder),t}refresh(t){var e;t||(t=null===(e=this.findElement())||void 0===e?void 0:e.querySelector("img"));if(t)return this.updateAttributesForImage(t)}updateAttributesForImage(t){const e=this.attachment.getURL(),i=this.attachment.getPreviewURL();if(t.src=i||e,i===e)t.removeAttribute("data-trix-serialized-attributes");else{const i=JSON.stringify({src:e});t.setAttribute("data-trix-serialized-attributes",i)}const n=this.attachment.getWidth(),r=this.attachment.getHeight();null!=n&&(t.width=n),null!=r&&(t.height=r);const o=["imageElement",this.attachment.id,t.src,t.width,t.height].join("/");t.dataset.trixStoreKey=o}attachmentDidChangeAttributes(){return this.refresh(this.image),this.refresh()}}class Ai extends ie{constructor(){super(...arguments),this.piece=this.object,this.attributes=this.piece.getAttributes(),this.textConfig=this.options.textConfig,this.context=this.options.context,this.piece.attachment?this.attachment=this.piece.attachment:this.string=this.piece.toString()}createNodes(){let t=this.attachment?this.createAttachmentNodes():this.createStringNodes();const e=this.createElement();if(e){const i=function(t){for(;null!==(e=t)&&void 0!==e&&e.firstElementChild;){var e;t=t.firstElementChild}return t}(e);Array.from(t).forEach((t=>{i.appendChild(t)})),t=[e]}return t}createAttachmentNodes(){const t=this.attachment.isPreviewable()?vi:pi;return this.createChildView(t,this.piece.attachment,{piece:this.piece}).getNodes()}createStringNodes(){var t;if(null!==(t=this.textConfig)&&void 0!==t&&t.plaintext)return[document.createTextNode(this.string)];{const t=[],e=this.string.split("\n");for(let i=0;i<e.length;i++){const n=e[i];if(i>0){const e=T("br");t.push(e)}if(n.length){const e=document.createTextNode(this.preserveSpaces(n));t.push(e)}}return t}}createElement(){let t,e,i;const n={};for(e in this.attributes){i=this.attributes[e];const o=ft(e);if(o){if(o.tagName){var r;const e=T(o.tagName);r?(r.appendChild(e),r=e):t=r=e}if(o.styleProperty&&(n[o.styleProperty]=i),o.style)for(e in o.style)i=o.style[e],n[e]=i}}if(Object.keys(n).length)for(e in t||(t=T("span")),n)i=n[e],t.style[e]=i;return t}createContainerElement(){for(const t in this.attributes){const e=this.attributes[t],i=ft(t);if(i&&i.groupTagName){const n={};return n[t]=e,T(i.groupTagName,n)}}}preserveSpaces(t){return this.context.isLast&&(t=t.replace(/\ $/,g)),t=t.replace(/(\S)\ {3}(\S)/g,"$1 ".concat(g," $2")).replace(/\ {2}/g,"".concat(g," ")).replace(/\ {2}/g," ".concat(g)),(this.context.isFirst||this.context.followsWhitespace)&&(t=t.replace(/^\ /,g)),t}}class yi extends ie{constructor(){super(...arguments),this.text=this.object,this.textConfig=this.options.textConfig}createNodes(){const t=[],e=$t.groupObjects(this.getPieces()),i=e.length-1;for(let r=0;r<e.length;r++){const o=e[r],s={};0===r&&(s.isFirst=!0),r===i&&(s.isLast=!0),xi(n)&&(s.followsWhitespace=!0);const a=this.findOrCreateCachedChildView(Ai,o,{textConfig:this.textConfig,context:s});t.push(...Array.from(a.getNodes()||[]));var n=o}return t}getPieces(){return Array.from(this.text.getPieces()).filter((t=>!t.hasAttribute("blockBreak")))}}const xi=t=>/\s$/.test(null==t?void 0:t.toString()),{css:Ci}=z;class Ei extends ie{constructor(){super(...arguments),this.block=this.object,this.attributes=this.block.getAttributes()}createNodes(){const t=[document.createComment("block")];if(this.block.isEmpty())t.push(T("br"));else{var e;const i=null===(e=mt(this.block.getLastAttribute()))||void 0===e?void 0:e.text,n=this.findOrCreateCachedChildView(yi,this.block.text,{textConfig:i});t.push(...Array.from(n.getNodes()||[])),this.shouldAddExtraNewlineElement()&&t.push(T("br"))}if(this.attributes.length)return t;{let e;const{tagName:i}=n.default;this.block.isRTL()&&(e={dir:"rtl"});const r=T({tagName:i,attributes:e});return t.forEach((t=>r.appendChild(t))),[r]}}createContainerElement(t){const e={};let i;const n=this.attributes[t],{tagName:r,htmlAttributes:o=[]}=mt(n);if(0===t&&this.block.isRTL()&&Object.assign(e,{dir:"rtl"}),"attachmentGallery"===n){const t=this.block.getBlockBreakPosition();i="".concat(Ci.attachmentGallery," ").concat(Ci.attachmentGallery,"--").concat(t)}return Object.entries(this.block.htmlAttributes).forEach((t=>{let[i,n]=t;o.includes(i)&&(e[i]=n)})),T({tagName:r,className:i,attributes:e})}shouldAddExtraNewlineElement(){return/\n\n$/.test(this.block.toString())}}class Si extends ie{static render(t){const e=T("div"),i=new this(t,{element:e});return i.render(),i.sync(),e}constructor(){super(...arguments),this.element=this.options.element,this.elementStore=new Qt,this.setDocument(this.object)}setDocument(t){t.isEqualTo(this.document)||(this.document=this.object=t)}render(){if(this.childViews=[],this.shadowElement=T("div"),!this.document.isEmpty()){const t=$t.groupObjects(this.document.getBlocks(),{asTree:!0});Array.from(t).forEach((t=>{const e=this.findOrCreateCachedChildView(Ei,t);Array.from(e.getNodes()).map((t=>this.shadowElement.appendChild(t)))}))}}isSynced(){return ki(this.shadowElement,this.element)}sync(){const t=this.createDocumentFragmentForSync();for(;this.element.lastChild;)this.element.removeChild(this.element.lastChild);return this.element.appendChild(t),this.didSync()}didSync(){return this.elementStore.reset(Ri(this.element)),Rt((()=>this.garbageCollectCachedViews()))}createDocumentFragmentForSync(){const t=document.createDocumentFragment();return Array.from(this.shadowElement.childNodes).forEach((e=>{t.appendChild(e.cloneNode(!0))})),Array.from(Ri(t)).forEach((t=>{const e=this.elementStore.remove(t);e&&t.parentNode.replaceChild(e,t)})),t}}const Ri=t=>t.querySelectorAll("[data-trix-store-key]"),ki=(t,e)=>Ti(t.innerHTML)===Ti(e.innerHTML),Ti=t=>t.replace(/&nbsp;/g," ");function wi(t){var e,i;function n(e,i){try{var o=t[e](i),s=o.value,a=s instanceof Li;Promise.resolve(a?s.v:s).then((function(i){if(a){var l="return"===e?"return":"next";if(!s.k||i.done)return n(l,i);i=t[l](i).value}r(o.done?"return":"normal",i)}),(function(t){n("throw",t)}))}catch(t){r("throw",t)}}function r(t,r){switch(t){case"return":e.resolve({value:r,done:!0});break;case"throw":e.reject(r);break;default:e.resolve({value:r,done:!1})}(e=e.next)?n(e.key,e.arg):i=null}this._invoke=function(t,r){return new Promise((function(o,s){var a={key:t,arg:r,resolve:o,reject:s,next:null};i?i=i.next=a:(e=i=a,n(t,r))}))},"function"!=typeof t.return&&(this.return=void 0)}function Li(t,e){this.v=t,this.k=e}function Di(t,e,i){return(e=Ni(e))in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function Ni(t){var e=function(t,e){if("object"!=typeof t||null===t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var n=i.call(t,e||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==typeof e?e:String(e)}wi.prototype["function"==typeof Symbol&&Symbol.asyncIterator||"@@asyncIterator"]=function(){return this},wi.prototype.next=function(t){return this._invoke("next",t)},wi.prototype.throw=function(t){return this._invoke("throw",t)},wi.prototype.return=function(t){return this._invoke("return",t)};function Ii(t,e){return Pi(t,Fi(t,e,"get"))}function Oi(t,e,i){return Mi(t,Fi(t,e,"set"),i),i}function Fi(t,e,i){if(!e.has(t))throw new TypeError("attempted to "+i+" private field on non-instance");return e.get(t)}function Pi(t,e){return e.get?e.get.call(t):e.value}function Mi(t,e,i){if(e.set)e.set.call(t,i);else{if(!e.writable)throw new TypeError("attempted to set read only private field");e.value=i}}function Bi(t,e,i){if(!e.has(t))throw new TypeError("attempted to get private field on non-instance");return i}function _i(t,e){if(e.has(t))throw new TypeError("Cannot initialize the same private elements twice on an object")}function ji(t,e,i){_i(t,e),e.set(t,i)}class Wi extends rt{static registerType(t,e){e.type=t,this.types[t]=e}static fromJSON(t){const e=this.types[t.type];if(e)return e.fromJSON(t)}constructor(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};super(...arguments),this.attributes=Ht.box(e)}copyWithAttributes(t){return new this.constructor(this.getValue(),t)}copyWithAdditionalAttributes(t){return this.copyWithAttributes(this.attributes.merge(t))}copyWithoutAttribute(t){return this.copyWithAttributes(this.attributes.remove(t))}copy(){return this.copyWithAttributes(this.attributes)}getAttribute(t){return this.attributes.get(t)}getAttributesHash(){return this.attributes}getAttributes(){return this.attributes.toObject()}hasAttribute(t){return this.attributes.has(t)}hasSameStringValueAsPiece(t){return t&&this.toString()===t.toString()}hasSameAttributesAsPiece(t){return t&&(this.attributes===t.attributes||this.attributes.isEqualTo(t.attributes))}isBlockBreak(){return!1}isEqualTo(t){return super.isEqualTo(...arguments)||this.hasSameConstructorAs(t)&&this.hasSameStringValueAsPiece(t)&&this.hasSameAttributesAsPiece(t)}isEmpty(){return 0===this.length}isSerializable(){return!0}toJSON(){return{type:this.constructor.type,attributes:this.getAttributes()}}contentsForInspection(){return{type:this.constructor.type,attributes:this.attributes.inspect()}}canBeGrouped(){return this.hasAttribute("href")}canBeGroupedWith(t){return this.getAttribute("href")===t.getAttribute("href")}getLength(){return this.length}canBeConsolidatedWith(t){return!1}}Di(Wi,"types",{});class Ui extends ee{constructor(t){super(...arguments),this.url=t}perform(t){const e=new Image;e.onload=()=>(e.width=this.width=e.naturalWidth,e.height=this.height=e.naturalHeight,t(!0,e)),e.onerror=()=>t(!1),e.src=this.url}}class Vi extends rt{static attachmentForFile(t){const e=new this(this.attributesForFile(t));return e.setFile(t),e}static attributesForFile(t){return new Ht({filename:t.name,filesize:t.size,contentType:t.type})}static fromJSON(t){return new this(t)}constructor(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};super(t),this.releaseFile=this.releaseFile.bind(this),this.attributes=Ht.box(t),this.didChangeAttributes()}getAttribute(t){return this.attributes.get(t)}hasAttribute(t){return this.attributes.has(t)}getAttributes(){return this.attributes.toObject()}setAttributes(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const e=this.attributes.merge(t);var i,n,r,o;if(!this.attributes.isEqualTo(e))return this.attributes=e,this.didChangeAttributes(),null===(i=this.previewDelegate)||void 0===i||null===(n=i.attachmentDidChangeAttributes)||void 0===n||n.call(i,this),null===(r=this.delegate)||void 0===r||null===(o=r.attachmentDidChangeAttributes)||void 0===o?void 0:o.call(r,this)}didChangeAttributes(){if(this.isPreviewable())return this.preloadURL()}isPending(){return null!=this.file&&!(this.getURL()||this.getHref())}isPreviewable(){return this.attributes.has("previewable")?this.attributes.get("previewable"):Vi.previewablePattern.test(this.getContentType())}getType(){return this.hasContent()?"content":this.isPreviewable()?"preview":"file"}getURL(){return this.attributes.get("url")}getHref(){return this.attributes.get("href")}getFilename(){return this.attributes.get("filename")||""}getFilesize(){return this.attributes.get("filesize")}getFormattedFilesize(){const t=this.attributes.get("filesize");return"number"==typeof t?h.formatter(t):""}getExtension(){var t;return null===(t=this.getFilename().match(/\.(\w+)$/))||void 0===t?void 0:t[1].toLowerCase()}getContentType(){return this.attributes.get("contentType")}hasContent(){return this.attributes.has("content")}getContent(){return this.attributes.get("content")}getWidth(){return this.attributes.get("width")}getHeight(){return this.attributes.get("height")}getFile(){return this.file}setFile(t){if(this.file=t,this.isPreviewable())return this.preloadFile()}releaseFile(){this.releasePreloadedFile(),this.file=null}getUploadProgress(){return null!=this.uploadProgress?this.uploadProgress:0}setUploadProgress(t){var e,i;if(this.uploadProgress!==t)return this.uploadProgress=t,null===(e=this.uploadProgressDelegate)||void 0===e||null===(i=e.attachmentDidChangeUploadProgress)||void 0===i?void 0:i.call(e,this)}toJSON(){return this.getAttributes()}getCacheKey(){return[super.getCacheKey(...arguments),this.attributes.getCacheKey(),this.getPreviewURL()].join("/")}getPreviewURL(){return this.previewURL||this.preloadingURL}setPreviewURL(t){var e,i,n,r;if(t!==this.getPreviewURL())return this.previewURL=t,null===(e=this.previewDelegate)||void 0===e||null===(i=e.attachmentDidChangeAttributes)||void 0===i||i.call(e,this),null===(n=this.delegate)||void 0===n||null===(r=n.attachmentDidChangePreviewURL)||void 0===r?void 0:r.call(n,this)}preloadURL(){return this.preload(this.getURL(),this.releaseFile)}preloadFile(){if(this.file)return this.fileObjectURL=URL.createObjectURL(this.file),this.preload(this.fileObjectURL)}releasePreloadedFile(){this.fileObjectURL&&(URL.revokeObjectURL(this.fileObjectURL),this.fileObjectURL=null)}preload(t,e){if(t&&t!==this.getPreviewURL()){this.preloadingURL=t;return new Ui(t).then((i=>{let{width:n,height:r}=i;return this.getWidth()&&this.getHeight()||this.setAttributes({width:n,height:r}),this.preloadingURL=null,this.setPreviewURL(t),null==e?void 0:e()})).catch((()=>(this.preloadingURL=null,null==e?void 0:e())))}}}Di(Vi,"previewablePattern",/^image(\/(gif|png|webp|jpe?g)|$)/);class zi extends Wi{static fromJSON(t){return new this(Vi.fromJSON(t.attachment),t.attributes)}constructor(t){super(...arguments),this.attachment=t,this.length=1,this.ensureAttachmentExclusivelyHasAttribute("href"),this.attachment.hasContent()||this.removeProhibitedAttributes()}ensureAttachmentExclusivelyHasAttribute(t){this.hasAttribute(t)&&(this.attachment.hasAttribute(t)||this.attachment.setAttributes(this.attributes.slice([t])),this.attributes=this.attributes.remove(t))}removeProhibitedAttributes(){const t=this.attributes.slice(zi.permittedAttributes);t.isEqualTo(this.attributes)||(this.attributes=t)}getValue(){return this.attachment}isSerializable(){return!this.attachment.isPending()}getCaption(){return this.attributes.get("caption")||""}isEqualTo(t){var e;return super.isEqualTo(t)&&this.attachment.id===(null==t||null===(e=t.attachment)||void 0===e?void 0:e.id)}toString(){return"￼"}toJSON(){const t=super.toJSON(...arguments);return t.attachment=this.attachment,t}getCacheKey(){return[super.getCacheKey(...arguments),this.attachment.getCacheKey()].join("/")}toConsole(){return JSON.stringify(this.toString())}}Di(zi,"permittedAttributes",["caption","presentation"]),Wi.registerType("attachment",zi);class qi extends Wi{static fromJSON(t){return new this(t.string,t.attributes)}constructor(t){super(...arguments),this.string=(t=>t.replace(/\r\n?/g,"\n"))(t),this.length=this.string.length}getValue(){return this.string}toString(){return this.string.toString()}isBlockBreak(){return"\n"===this.toString()&&!0===this.getAttribute("blockBreak")}toJSON(){const t=super.toJSON(...arguments);return t.string=this.string,t}canBeConsolidatedWith(t){return t&&this.hasSameConstructorAs(t)&&this.hasSameAttributesAsPiece(t)}consolidateWith(t){return new this.constructor(this.toString()+t.toString(),this.attributes)}splitAtOffset(t){let e,i;return 0===t?(e=null,i=this):t===this.length?(e=this,i=null):(e=new this.constructor(this.string.slice(0,t),this.attributes),i=new this.constructor(this.string.slice(t),this.attributes)),[e,i]}toConsole(){let{string:t}=this;return t.length>15&&(t=t.slice(0,14)+"…"),JSON.stringify(t.toString())}}Wi.registerType("string",qi);class Hi extends rt{static box(t){return t instanceof this?t:new this(t)}constructor(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];super(...arguments),this.objects=t.slice(0),this.length=this.objects.length}indexOf(t){return this.objects.indexOf(t)}splice(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return new this.constructor(st(this.objects,...e))}eachObject(t){return this.objects.map(((e,i)=>t(e,i)))}insertObjectAtIndex(t,e){return this.splice(e,0,t)}insertSplittableListAtIndex(t,e){return this.splice(e,0,...t.objects)}insertSplittableListAtPosition(t,e){const[i,n]=this.splitObjectAtPosition(e);return new this.constructor(i).insertSplittableListAtIndex(t,n)}editObjectAtIndex(t,e){return this.replaceObjectAtIndex(e(this.objects[t]),t)}replaceObjectAtIndex(t,e){return this.splice(e,1,t)}removeObjectAtIndex(t){return this.splice(t,1)}getObjectAtIndex(t){return this.objects[t]}getSplittableListInRange(t){const[e,i,n]=this.splitObjectsAtRange(t);return new this.constructor(e.slice(i,n+1))}selectSplittableList(t){const e=this.objects.filter((e=>t(e)));return new this.constructor(e)}removeObjectsInRange(t){const[e,i,n]=this.splitObjectsAtRange(t);return new this.constructor(e).splice(i,n-i+1)}transformObjectsInRange(t,e){const[i,n,r]=this.splitObjectsAtRange(t),o=i.map(((t,i)=>n<=i&&i<=r?e(t):t));return new this.constructor(o)}splitObjectsAtRange(t){let e,[i,n,r]=this.splitObjectAtPosition(Ki(t));return[i,e]=new this.constructor(i).splitObjectAtPosition(Gi(t)+r),[i,n,e-1]}getObjectAtPosition(t){const{index:e}=this.findIndexAndOffsetAtPosition(t);return this.objects[e]}splitObjectAtPosition(t){let e,i;const{index:n,offset:r}=this.findIndexAndOffsetAtPosition(t),o=this.objects.slice(0);if(null!=n)if(0===r)e=n,i=0;else{const t=this.getObjectAtIndex(n),[s,a]=t.splitAtOffset(r);o.splice(n,1,s,a),e=n+1,i=s.getLength()-r}else e=o.length,i=0;return[o,e,i]}consolidate(){const t=[];let e=this.objects[0];return this.objects.slice(1).forEach((i=>{var n,r;null!==(n=(r=e).canBeConsolidatedWith)&&void 0!==n&&n.call(r,i)?e=e.consolidateWith(i):(t.push(e),e=i)})),e&&t.push(e),new this.constructor(t)}consolidateFromIndexToIndex(t,e){const i=this.objects.slice(0).slice(t,e+1),n=new this.constructor(i).consolidate().toArray();return this.splice(t,i.length,...n)}findIndexAndOffsetAtPosition(t){let e,i=0;for(e=0;e<this.objects.length;e++){const n=i+this.objects[e].getLength();if(i<=t&&t<n)return{index:e,offset:t-i};i=n}return{index:null,offset:null}}findPositionAtIndexAndOffset(t,e){let i=0;for(let n=0;n<this.objects.length;n++){const r=this.objects[n];if(n<t)i+=r.getLength();else if(n===t){i+=e;break}}return i}getEndPosition(){return null==this.endPosition&&(this.endPosition=0,this.objects.forEach((t=>this.endPosition+=t.getLength()))),this.endPosition}toString(){return this.objects.join("")}toArray(){return this.objects.slice(0)}toJSON(){return this.toArray()}isEqualTo(t){return super.isEqualTo(...arguments)||Ji(this.objects,null==t?void 0:t.objects)}contentsForInspection(){return{objects:"[".concat(this.objects.map((t=>t.inspect())).join(", "),"]")}}}const Ji=function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];if(t.length!==e.length)return!1;let i=!0;for(let n=0;n<t.length;n++){const r=t[n];i&&!r.isEqualTo(e[n])&&(i=!1)}return i},Ki=t=>t[0],Gi=t=>t[1];class Yi extends rt{static textForAttachmentWithAttributes(t,e){return new this([new zi(t,e)])}static textForStringWithAttributes(t,e){return new this([new qi(t,e)])}static fromJSON(t){return new this(Array.from(t).map((t=>Wi.fromJSON(t))))}constructor(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];super(...arguments);const e=t.filter((t=>!t.isEmpty()));this.pieceList=new Hi(e)}copy(){return this.copyWithPieceList(this.pieceList)}copyWithPieceList(t){return new this.constructor(t.consolidate().toArray())}copyUsingObjectMap(t){const e=this.getPieces().map((e=>t.find(e)||e));return new this.constructor(e)}appendText(t){return this.insertTextAtPosition(t,this.getLength())}insertTextAtPosition(t,e){return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(t.pieceList,e))}removeTextAtRange(t){return this.copyWithPieceList(this.pieceList.removeObjectsInRange(t))}replaceTextAtRange(t,e){return this.removeTextAtRange(e).insertTextAtPosition(t,e[0])}moveTextFromRangeToPosition(t,e){if(t[0]<=e&&e<=t[1])return;const i=this.getTextAtRange(t),n=i.getLength();return t[0]<e&&(e-=n),this.removeTextAtRange(t).insertTextAtPosition(i,e)}addAttributeAtRange(t,e,i){const n={};return n[t]=e,this.addAttributesAtRange(n,i)}addAttributesAtRange(t,e){return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e,(e=>e.copyWithAdditionalAttributes(t))))}removeAttributeAtRange(t,e){return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e,(e=>e.copyWithoutAttribute(t))))}setAttributesAtRange(t,e){return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e,(e=>e.copyWithAttributes(t))))}getAttributesAtPosition(t){var e;return(null===(e=this.pieceList.getObjectAtPosition(t))||void 0===e?void 0:e.getAttributes())||{}}getCommonAttributes(){const t=Array.from(this.pieceList.toArray()).map((t=>t.getAttributes()));return Ht.fromCommonAttributesOfObjects(t).toObject()}getCommonAttributesAtRange(t){return this.getTextAtRange(t).getCommonAttributes()||{}}getExpandedRangeForAttributeAtOffset(t,e){let i,n=i=e;const r=this.getLength();for(;n>0&&this.getCommonAttributesAtRange([n-1,i])[t];)n--;for(;i<r&&this.getCommonAttributesAtRange([e,i+1])[t];)i++;return[n,i]}getTextAtRange(t){return this.copyWithPieceList(this.pieceList.getSplittableListInRange(t))}getStringAtRange(t){return this.pieceList.getSplittableListInRange(t).toString()}getStringAtPosition(t){return this.getStringAtRange([t,t+1])}startsWithString(t){return this.getStringAtRange([0,t.length])===t}endsWithString(t){const e=this.getLength();return this.getStringAtRange([e-t.length,e])===t}getAttachmentPieces(){return this.pieceList.toArray().filter((t=>!!t.attachment))}getAttachments(){return this.getAttachmentPieces().map((t=>t.attachment))}getAttachmentAndPositionById(t){let e=0;for(const n of this.pieceList.toArray()){var i;if((null===(i=n.attachment)||void 0===i?void 0:i.id)===t)return{attachment:n.attachment,position:e};e+=n.length}return{attachment:null,position:null}}getAttachmentById(t){const{attachment:e}=this.getAttachmentAndPositionById(t);return e}getRangeOfAttachment(t){const e=this.getAttachmentAndPositionById(t.id),i=e.position;if(t=e.attachment)return[i,i+1]}updateAttributesForAttachment(t,e){const i=this.getRangeOfAttachment(e);return i?this.addAttributesAtRange(t,i):this}getLength(){return this.pieceList.getEndPosition()}isEmpty(){return 0===this.getLength()}isEqualTo(t){var e;return super.isEqualTo(t)||(null==t||null===(e=t.pieceList)||void 0===e?void 0:e.isEqualTo(this.pieceList))}isBlockBreak(){return 1===this.getLength()&&this.pieceList.getObjectAtIndex(0).isBlockBreak()}eachPiece(t){return this.pieceList.eachObject(t)}getPieces(){return this.pieceList.toArray()}getPieceAtPosition(t){return this.pieceList.getObjectAtPosition(t)}contentsForInspection(){return{pieceList:this.pieceList.inspect()}}toSerializableText(){const t=this.pieceList.selectSplittableList((t=>t.isSerializable()));return this.copyWithPieceList(t)}toString(){return this.pieceList.toString()}toJSON(){return this.pieceList.toJSON()}toConsole(){return JSON.stringify(this.pieceList.toArray().map((t=>JSON.parse(t.toConsole()))))}getDirection(){return lt(this.toString())}isRTL(){return"rtl"===this.getDirection()}}class Xi extends rt{static fromJSON(t){return new this(Yi.fromJSON(t.text),t.attributes,t.htmlAttributes)}constructor(t,e,i){super(...arguments),this.text=$i(t||new Yi),this.attributes=e||[],this.htmlAttributes=i||{}}isEmpty(){return this.text.isBlockBreak()}isEqualTo(t){return!!super.isEqualTo(t)||this.text.isEqualTo(null==t?void 0:t.text)&&ot(this.attributes,null==t?void 0:t.attributes)&&Tt(this.htmlAttributes,null==t?void 0:t.htmlAttributes)}copyWithText(t){return new Xi(t,this.attributes,this.htmlAttributes)}copyWithoutText(){return this.copyWithText(null)}copyWithAttributes(t){return new Xi(this.text,t,this.htmlAttributes)}copyWithoutAttributes(){return this.copyWithAttributes(null)}copyUsingObjectMap(t){const e=t.find(this.text);return e?this.copyWithText(e):this.copyWithText(this.text.copyUsingObjectMap(t))}addAttribute(t){const e=this.attributes.concat(rn(t));return this.copyWithAttributes(e)}addHTMLAttribute(t,e){const i=Object.assign({},this.htmlAttributes,{[t]:e});return new Xi(this.text,this.attributes,i)}removeAttribute(t){const{listAttribute:e}=mt(t),i=sn(sn(this.attributes,t),e);return this.copyWithAttributes(i)}removeLastAttribute(){return this.removeAttribute(this.getLastAttribute())}getLastAttribute(){return on(this.attributes)}getAttributes(){return this.attributes.slice(0)}getAttributeLevel(){return this.attributes.length}getAttributeAtLevel(t){return this.attributes[t-1]}hasAttribute(t){return this.attributes.includes(t)}hasAttributes(){return this.getAttributeLevel()>0}getLastNestableAttribute(){return on(this.getNestableAttributes())}getNestableAttributes(){return this.attributes.filter((t=>mt(t).nestable))}getNestingLevel(){return this.getNestableAttributes().length}decreaseNestingLevel(){const t=this.getLastNestableAttribute();return t?this.removeAttribute(t):this}increaseNestingLevel(){const t=this.getLastNestableAttribute();if(t){const e=this.attributes.lastIndexOf(t),i=st(this.attributes,e+1,0,...rn(t));return this.copyWithAttributes(i)}return this}getListItemAttributes(){return this.attributes.filter((t=>mt(t).listAttribute))}isListItem(){var t;return null===(t=mt(this.getLastAttribute()))||void 0===t?void 0:t.listAttribute}isTerminalBlock(){var t;return null===(t=mt(this.getLastAttribute()))||void 0===t?void 0:t.terminal}breaksOnReturn(){var t;return null===(t=mt(this.getLastAttribute()))||void 0===t?void 0:t.breakOnReturn}findLineBreakInDirectionFromPosition(t,e){const i=this.toString();let n;switch(t){case"forward":n=i.indexOf("\n",e);break;case"backward":n=i.slice(0,e).lastIndexOf("\n")}if(-1!==n)return n}contentsForInspection(){return{text:this.text.inspect(),attributes:this.attributes}}toString(){return this.text.toString()}toJSON(){return{text:this.text,attributes:this.attributes,htmlAttributes:this.htmlAttributes}}getDirection(){return this.text.getDirection()}isRTL(){return this.text.isRTL()}getLength(){return this.text.getLength()}canBeConsolidatedWith(t){return!this.hasAttributes()&&!t.hasAttributes()&&this.getDirection()===t.getDirection()}consolidateWith(t){const e=Yi.textForStringWithAttributes("\n"),i=this.getTextWithoutBlockBreak().appendText(e);return this.copyWithText(i.appendText(t.text))}splitAtOffset(t){let e,i;return 0===t?(e=null,i=this):t===this.getLength()?(e=this,i=null):(e=this.copyWithText(this.text.getTextAtRange([0,t])),i=this.copyWithText(this.text.getTextAtRange([t,this.getLength()]))),[e,i]}getBlockBreakPosition(){return this.text.getLength()-1}getTextWithoutBlockBreak(){return en(this.text)?this.text.getTextAtRange([0,this.getBlockBreakPosition()]):this.text.copy()}canBeGrouped(t){return this.attributes[t]}canBeGroupedWith(t,e){const i=t.getAttributes(),r=i[e],o=this.attributes[e];return o===r&&!(!1===mt(o).group&&!(()=>{if(!dt){dt=[];for(const t in n){const{listAttribute:e}=n[t];null!=e&&dt.push(e)}}return dt})().includes(i[e+1]))&&(this.getDirection()===t.getDirection()||t.isEmpty())}}const $i=function(t){return t=Zi(t),t=tn(t)},Zi=function(t){let e=!1;const i=t.getPieces();let n=i.slice(0,i.length-1);const r=i[i.length-1];return r?(n=n.map((t=>t.isBlockBreak()?(e=!0,nn(t)):t)),e?new Yi([...n,r]):t):t},Qi=Yi.textForStringWithAttributes("\n",{blockBreak:!0}),tn=function(t){return en(t)?t:t.appendText(Qi)},en=function(t){const e=t.getLength();if(0===e)return!1;return t.getTextAtRange([e-1,e]).isBlockBreak()},nn=t=>t.copyWithoutAttribute("blockBreak"),rn=function(t){const{listAttribute:e}=mt(t);return e?[e,t]:[t]},on=t=>t.slice(-1)[0],sn=function(t,e){const i=t.lastIndexOf(e);return-1===i?t:st(t,i,1)};class an extends rt{static fromJSON(t){return new this(Array.from(t).map((t=>Xi.fromJSON(t))))}static fromString(t,e){const i=Yi.textForStringWithAttributes(t,e);return new this([new Xi(i)])}constructor(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];super(...arguments),0===t.length&&(t=[new Xi]),this.blockList=Hi.box(t)}isEmpty(){const t=this.getBlockAtIndex(0);return 1===this.blockList.length&&t.isEmpty()&&!t.hasAttributes()}copy(){const t=(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}).consolidateBlocks?this.blockList.consolidate().toArray():this.blockList.toArray();return new this.constructor(t)}copyUsingObjectsFromDocument(t){const e=new Zt(t.getObjects());return this.copyUsingObjectMap(e)}copyUsingObjectMap(t){const e=this.getBlocks().map((e=>t.find(e)||e.copyUsingObjectMap(t)));return new this.constructor(e)}copyWithBaseBlockAttributes(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];const e=this.getBlocks().map((e=>{const i=t.concat(e.getAttributes());return e.copyWithAttributes(i)}));return new this.constructor(e)}replaceBlock(t,e){const i=this.blockList.indexOf(t);return-1===i?this:new this.constructor(this.blockList.replaceObjectAtIndex(e,i))}insertDocumentAtRange(t,e){const{blockList:i}=t;e=wt(e);let[n]=e;const{index:r,offset:o}=this.locationFromPosition(n);let s=this;const a=this.getBlockAtPosition(n);return Lt(e)&&a.isEmpty()&&!a.hasAttributes()?s=new this.constructor(s.blockList.removeObjectAtIndex(r)):a.getBlockBreakPosition()===o&&n++,s=s.removeTextAtRange(e),new this.constructor(s.blockList.insertSplittableListAtPosition(i,n))}mergeDocumentAtRange(t,e){let i,n;e=wt(e);const[r]=e,o=this.locationFromPosition(r),s=this.getBlockAtIndex(o.index).getAttributes(),a=t.getBaseBlockAttributes(),l=s.slice(-a.length);if(ot(a,l)){const e=s.slice(0,-a.length);i=t.copyWithBaseBlockAttributes(e)}else i=t.copy({consolidateBlocks:!0}).copyWithBaseBlockAttributes(s);const c=i.getBlockCount(),u=i.getBlockAtIndex(0);if(ot(s,u.getAttributes())){const t=u.getTextWithoutBlockBreak();if(n=this.insertTextAtRange(t,e),c>1){i=new this.constructor(i.getBlocks().slice(1));const e=r+t.getLength();n=n.insertDocumentAtRange(i,e)}}else n=this.insertDocumentAtRange(i,e);return n}insertTextAtRange(t,e){e=wt(e);const[i]=e,{index:n,offset:r}=this.locationFromPosition(i),o=this.removeTextAtRange(e);return new this.constructor(o.blockList.editObjectAtIndex(n,(e=>e.copyWithText(e.text.insertTextAtPosition(t,r)))))}removeTextAtRange(t){let e;t=wt(t);const[i,n]=t;if(Lt(t))return this;const[r,o]=Array.from(this.locationRangeFromRange(t)),s=r.index,a=r.offset,l=this.getBlockAtIndex(s),c=o.index,u=o.offset,h=this.getBlockAtIndex(c);if(n-i==1&&l.getBlockBreakPosition()===a&&h.getBlockBreakPosition()!==u&&"\n"===h.text.getStringAtPosition(u))e=this.blockList.editObjectAtIndex(c,(t=>t.copyWithText(t.text.removeTextAtRange([u,u+1]))));else{let t;const i=l.text.getTextAtRange([0,a]),n=h.text.getTextAtRange([u,h.getLength()]),r=i.appendText(n);t=s!==c&&0===a&&l.getAttributeLevel()>=h.getAttributeLevel()?h.copyWithText(r):l.copyWithText(r);const o=c+1-s;e=this.blockList.splice(s,o,t)}return new this.constructor(e)}moveTextFromRangeToPosition(t,e){let i;t=wt(t);const[n,r]=t;if(n<=e&&e<=r)return this;let o=this.getDocumentAtRange(t),s=this.removeTextAtRange(t);const a=n<e;a&&(e-=o.getLength());const[l,...c]=o.getBlocks();return 0===c.length?(i=l.getTextWithoutBlockBreak(),a&&(e+=1)):i=l.text,s=s.insertTextAtRange(i,e),0===c.length?s:(o=new this.constructor(c),e+=i.getLength(),s.insertDocumentAtRange(o,e))}addAttributeAtRange(t,e,i){let{blockList:n}=this;return this.eachBlockAtRange(i,((i,r,o)=>n=n.editObjectAtIndex(o,(function(){return mt(t)?i.addAttribute(t,e):r[0]===r[1]?i:i.copyWithText(i.text.addAttributeAtRange(t,e,r))})))),new this.constructor(n)}addAttribute(t,e){let{blockList:i}=this;return this.eachBlock(((n,r)=>i=i.editObjectAtIndex(r,(()=>n.addAttribute(t,e))))),new this.constructor(i)}removeAttributeAtRange(t,e){let{blockList:i}=this;return this.eachBlockAtRange(e,(function(e,n,r){mt(t)?i=i.editObjectAtIndex(r,(()=>e.removeAttribute(t))):n[0]!==n[1]&&(i=i.editObjectAtIndex(r,(()=>e.copyWithText(e.text.removeAttributeAtRange(t,n)))))})),new this.constructor(i)}updateAttributesForAttachment(t,e){const i=this.getRangeOfAttachment(e),[n]=Array.from(i),{index:r}=this.locationFromPosition(n),o=this.getTextAtIndex(r);return new this.constructor(this.blockList.editObjectAtIndex(r,(i=>i.copyWithText(o.updateAttributesForAttachment(t,e)))))}removeAttributeForAttachment(t,e){const i=this.getRangeOfAttachment(e);return this.removeAttributeAtRange(t,i)}setHTMLAttributeAtPosition(t,e,i){const n=this.getBlockAtPosition(t),r=n.addHTMLAttribute(e,i);return this.replaceBlock(n,r)}insertBlockBreakAtRange(t){let e;t=wt(t);const[i]=t,{offset:n}=this.locationFromPosition(i),r=this.removeTextAtRange(t);return 0===n&&(e=[new Xi]),new this.constructor(r.blockList.insertSplittableListAtPosition(new Hi(e),i))}applyBlockAttributeAtRange(t,e,i){const n=this.expandRangeToLineBreaksAndSplitBlocks(i);let r=n.document;i=n.range;const o=mt(t);if(o.listAttribute){r=r.removeLastListAttributeAtRange(i,{exceptAttributeName:t});const e=r.convertLineBreaksToBlockBreaksInRange(i);r=e.document,i=e.range}else r=o.exclusive?r.removeBlockAttributesAtRange(i):o.terminal?r.removeLastTerminalAttributeAtRange(i):r.consolidateBlocksAtRange(i);return r.addAttributeAtRange(t,e,i)}removeLastListAttributeAtRange(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{blockList:i}=this;return this.eachBlockAtRange(t,(function(t,n,r){const o=t.getLastAttribute();o&&mt(o).listAttribute&&o!==e.exceptAttributeName&&(i=i.editObjectAtIndex(r,(()=>t.removeAttribute(o))))})),new this.constructor(i)}removeLastTerminalAttributeAtRange(t){let{blockList:e}=this;return this.eachBlockAtRange(t,(function(t,i,n){const r=t.getLastAttribute();r&&mt(r).terminal&&(e=e.editObjectAtIndex(n,(()=>t.removeAttribute(r))))})),new this.constructor(e)}removeBlockAttributesAtRange(t){let{blockList:e}=this;return this.eachBlockAtRange(t,(function(t,i,n){t.hasAttributes()&&(e=e.editObjectAtIndex(n,(()=>t.copyWithoutAttributes())))})),new this.constructor(e)}expandRangeToLineBreaksAndSplitBlocks(t){let e;t=wt(t);let[i,n]=t;const r=this.locationFromPosition(i),o=this.locationFromPosition(n);let s=this;const a=s.getBlockAtIndex(r.index);if(r.offset=a.findLineBreakInDirectionFromPosition("backward",r.offset),null!=r.offset&&(e=s.positionFromLocation(r),s=s.insertBlockBreakAtRange([e,e+1]),o.index+=1,o.offset-=s.getBlockAtIndex(r.index).getLength(),r.index+=1),r.offset=0,0===o.offset&&o.index>r.index)o.index-=1,o.offset=s.getBlockAtIndex(o.index).getBlockBreakPosition();else{const t=s.getBlockAtIndex(o.index);"\n"===t.text.getStringAtRange([o.offset-1,o.offset])?o.offset-=1:o.offset=t.findLineBreakInDirectionFromPosition("forward",o.offset),o.offset!==t.getBlockBreakPosition()&&(e=s.positionFromLocation(o),s=s.insertBlockBreakAtRange([e,e+1]))}return i=s.positionFromLocation(r),n=s.positionFromLocation(o),{document:s,range:t=wt([i,n])}}convertLineBreaksToBlockBreaksInRange(t){t=wt(t);let[e]=t;const i=this.getStringAtRange(t).slice(0,-1);let n=this;return i.replace(/.*?\n/g,(function(t){e+=t.length,n=n.insertBlockBreakAtRange([e-1,e])})),{document:n,range:t}}consolidateBlocksAtRange(t){t=wt(t);const[e,i]=t,n=this.locationFromPosition(e).index,r=this.locationFromPosition(i).index;return new this.constructor(this.blockList.consolidateFromIndexToIndex(n,r))}getDocumentAtRange(t){t=wt(t);const e=this.blockList.getSplittableListInRange(t).toArray();return new this.constructor(e)}getStringAtRange(t){let e;const i=t=wt(t);return i[i.length-1]!==this.getLength()&&(e=-1),this.getDocumentAtRange(t).toString().slice(0,e)}getBlockAtIndex(t){return this.blockList.getObjectAtIndex(t)}getBlockAtPosition(t){const{index:e}=this.locationFromPosition(t);return this.getBlockAtIndex(e)}getTextAtIndex(t){var e;return null===(e=this.getBlockAtIndex(t))||void 0===e?void 0:e.text}getTextAtPosition(t){const{index:e}=this.locationFromPosition(t);return this.getTextAtIndex(e)}getPieceAtPosition(t){const{index:e,offset:i}=this.locationFromPosition(t);return this.getTextAtIndex(e).getPieceAtPosition(i)}getCharacterAtPosition(t){const{index:e,offset:i}=this.locationFromPosition(t);return this.getTextAtIndex(e).getStringAtRange([i,i+1])}getLength(){return this.blockList.getEndPosition()}getBlocks(){return this.blockList.toArray()}getBlockCount(){return this.blockList.length}getEditCount(){return this.editCount}eachBlock(t){return this.blockList.eachObject(t)}eachBlockAtRange(t,e){let i,n;t=wt(t);const[r,o]=t,s=this.locationFromPosition(r),a=this.locationFromPosition(o);if(s.index===a.index)return i=this.getBlockAtIndex(s.index),n=[s.offset,a.offset],e(i,n,s.index);for(let t=s.index;t<=a.index;t++)if(i=this.getBlockAtIndex(t),i){switch(t){case s.index:n=[s.offset,i.text.getLength()];break;case a.index:n=[0,a.offset];break;default:n=[0,i.text.getLength()]}e(i,n,t)}}getCommonAttributesAtRange(t){t=wt(t);const[e]=t;if(Lt(t))return this.getCommonAttributesAtPosition(e);{const e=[],i=[];return this.eachBlockAtRange(t,(function(t,n){if(n[0]!==n[1])return e.push(t.text.getCommonAttributesAtRange(n)),i.push(ln(t))})),Ht.fromCommonAttributesOfObjects(e).merge(Ht.fromCommonAttributesOfObjects(i)).toObject()}}getCommonAttributesAtPosition(t){let e,i;const{index:n,offset:r}=this.locationFromPosition(t),o=this.getBlockAtIndex(n);if(!o)return{};const s=ln(o),a=o.text.getAttributesAtPosition(r),l=o.text.getAttributesAtPosition(r-1),c=Object.keys(W).filter((t=>W[t].inheritable));for(e in l)i=l[e],(i===a[e]||c.includes(e))&&(s[e]=i);return s}getRangeOfCommonAttributeAtPosition(t,e){const{index:i,offset:n}=this.locationFromPosition(e),r=this.getTextAtIndex(i),[o,s]=Array.from(r.getExpandedRangeForAttributeAtOffset(t,n)),a=this.positionFromLocation({index:i,offset:o}),l=this.positionFromLocation({index:i,offset:s});return wt([a,l])}getBaseBlockAttributes(){let t=this.getBlockAtIndex(0).getAttributes();for(let e=1;e<this.getBlockCount();e++){const i=this.getBlockAtIndex(e).getAttributes(),n=Math.min(t.length,i.length);t=(()=>{const e=[];for(let r=0;r<n&&i[r]===t[r];r++)e.push(i[r]);return e})()}return t}getAttachmentById(t){for(const e of this.getAttachments())if(e.id===t)return e}getAttachmentPieces(){let t=[];return this.blockList.eachObject((e=>{let{text:i}=e;return t=t.concat(i.getAttachmentPieces())})),t}getAttachments(){return this.getAttachmentPieces().map((t=>t.attachment))}getRangeOfAttachment(t){let e=0;const i=this.blockList.toArray();for(let n=0;n<i.length;n++){const{text:r}=i[n],o=r.getRangeOfAttachment(t);if(o)return wt([e+o[0],e+o[1]]);e+=r.getLength()}}getLocationRangeOfAttachment(t){const e=this.getRangeOfAttachment(t);return this.locationRangeFromRange(e)}getAttachmentPieceForAttachment(t){for(const e of this.getAttachmentPieces())if(e.attachment===t)return e}findRangesForBlockAttribute(t){let e=0;const i=[];return this.getBlocks().forEach((n=>{const r=n.getLength();n.hasAttribute(t)&&i.push([e,e+r]),e+=r})),i}findRangesForTextAttribute(t){let{withValue:e}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=0,n=[];const r=[];return this.getPieces().forEach((o=>{const s=o.getLength();(function(i){return e?i.getAttribute(t)===e:i.hasAttribute(t)})(o)&&(n[1]===i?n[1]=i+s:r.push(n=[i,i+s])),i+=s})),r}locationFromPosition(t){const e=this.blockList.findIndexAndOffsetAtPosition(Math.max(0,t));if(null!=e.index)return e;{const t=this.getBlocks();return{index:t.length-1,offset:t[t.length-1].getLength()}}}positionFromLocation(t){return this.blockList.findPositionAtIndexAndOffset(t.index,t.offset)}locationRangeFromPosition(t){return wt(this.locationFromPosition(t))}locationRangeFromRange(t){if(!(t=wt(t)))return;const[e,i]=Array.from(t),n=this.locationFromPosition(e),r=this.locationFromPosition(i);return wt([n,r])}rangeFromLocationRange(t){let e;t=wt(t);const i=this.positionFromLocation(t[0]);return Lt(t)||(e=this.positionFromLocation(t[1])),wt([i,e])}isEqualTo(t){return this.blockList.isEqualTo(null==t?void 0:t.blockList)}getTexts(){return this.getBlocks().map((t=>t.text))}getPieces(){const t=[];return Array.from(this.getTexts()).forEach((e=>{t.push(...Array.from(e.getPieces()||[]))})),t}getObjects(){return this.getBlocks().concat(this.getTexts()).concat(this.getPieces())}toSerializableDocument(){const t=[];return this.blockList.eachObject((e=>t.push(e.copyWithText(e.text.toSerializableText())))),new this.constructor(t)}toString(){return this.blockList.toString()}toJSON(){return this.blockList.toJSON()}toConsole(){return JSON.stringify(this.blockList.toArray().map((t=>JSON.parse(t.text.toConsole()))))}}const ln=function(t){const e={},i=t.getLastAttribute();return i&&(e[i]=!0),e},cn=function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return{string:t=Wt(t),attributes:e,type:"string"}},un=(t,e)=>{try{return JSON.parse(t.getAttribute("data-trix-".concat(e)))}catch(t){return{}}};class hn extends q{static parse(t,e){const i=new this(t,e);return i.parse(),i}constructor(t){let{referenceElement:e,purifyOptions:i}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};super(...arguments),this.html=t,this.referenceElement=e,this.purifyOptions=i,this.blocks=[],this.blockElements=[],this.processedElements=[]}getDocument(){return an.fromJSON(this.blocks)}parse(){try{this.createHiddenContainer(),di.setHTML(this.containerElement,this.html,{purifyOptions:this.purifyOptions});const t=R(this.containerElement,{usingFilter:pn});for(;t.nextNode();)this.processNode(t.currentNode);return this.translateBlockElementMarginsToNewlines()}finally{this.removeHiddenContainer()}}createHiddenContainer(){return this.referenceElement?(this.containerElement=this.referenceElement.cloneNode(!1),this.containerElement.removeAttribute("id"),this.containerElement.setAttribute("data-trix-internal",""),this.containerElement.style.display="none",this.referenceElement.parentNode.insertBefore(this.containerElement,this.referenceElement.nextSibling)):(this.containerElement=T({tagName:"div",style:{display:"none"}}),document.body.appendChild(this.containerElement))}removeHiddenContainer(){return S(this.containerElement)}processNode(t){switch(t.nodeType){case Node.TEXT_NODE:if(!this.isInsignificantTextNode(t))return this.appendBlockForTextNode(t),this.processTextNode(t);break;case Node.ELEMENT_NODE:return this.appendBlockForElement(t),this.processElement(t)}}appendBlockForTextNode(t){const e=t.parentNode;if(e===this.currentBlockElement&&this.isBlockElement(t.previousSibling))return this.appendStringWithAttributes("\n");if(e===this.containerElement||this.isBlockElement(e)){var i;const t=this.getBlockAttributes(e),n=this.getBlockHTMLAttributes(e);ot(t,null===(i=this.currentBlock)||void 0===i?void 0:i.attributes)||(this.currentBlock=this.appendBlockForAttributesWithElement(t,e,n),this.currentBlockElement=e)}}appendBlockForElement(t){const e=this.isBlockElement(t),i=C(this.currentBlockElement,t);if(e&&!this.isBlockElement(t.firstChild)){if(!this.isInsignificantTextNode(t.firstChild)||!this.isBlockElement(t.firstElementChild)){const e=this.getBlockAttributes(t),n=this.getBlockHTMLAttributes(t);if(t.firstChild){if(i&&ot(e,this.currentBlock.attributes))return this.appendStringWithAttributes("\n");this.currentBlock=this.appendBlockForAttributesWithElement(e,t,n),this.currentBlockElement=t}}}else if(this.currentBlockElement&&!i&&!e){const e=this.findParentBlockElement(t);if(e)return this.appendBlockForElement(e);this.currentBlock=this.appendEmptyBlock(),this.currentBlockElement=null}}findParentBlockElement(t){let{parentElement:e}=t;for(;e&&e!==this.containerElement;){if(this.isBlockElement(e)&&this.blockElements.includes(e))return e;e=e.parentElement}return null}processTextNode(t){let e=t.data;var i;dn(t.parentNode)||(e=Vt(e),vn(null===(i=t.previousSibling)||void 0===i?void 0:i.textContent)&&(e=fn(e)));return this.appendStringWithAttributes(e,this.getTextAttributes(t.parentNode))}processElement(t){let e;if(P(t)){if(e=un(t,"attachment"),Object.keys(e).length){const i=this.getTextAttributes(t);this.appendAttachmentWithAttributes(e,i),t.innerHTML=""}return this.processedElements.push(t)}switch(k(t)){case"br":return this.isExtraBR(t)||this.isBlockElement(t.nextSibling)||this.appendStringWithAttributes("\n",this.getTextAttributes(t)),this.processedElements.push(t);case"img":e={url:t.getAttribute("src"),contentType:"image"};const i=(t=>{const e=t.getAttribute("width"),i=t.getAttribute("height"),n={};return e&&(n.width=parseInt(e,10)),i&&(n.height=parseInt(i,10)),n})(t);for(const t in i){const n=i[t];e[t]=n}return this.appendAttachmentWithAttributes(e,this.getTextAttributes(t)),this.processedElements.push(t);case"tr":if(this.needsTableSeparator(t))return this.appendStringWithAttributes(j.tableRowSeparator);break;case"td":if(this.needsTableSeparator(t))return this.appendStringWithAttributes(j.tableCellSeparator)}}appendBlockForAttributesWithElement(t,e){let i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};this.blockElements.push(e);const n=function(){return{text:[],attributes:arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},htmlAttributes:arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}}}(t,i);return this.blocks.push(n),n}appendEmptyBlock(){return this.appendBlockForAttributesWithElement([],null)}appendStringWithAttributes(t,e){return this.appendPiece(cn(t,e))}appendAttachmentWithAttributes(t,e){return this.appendPiece(function(t){return{attachment:t,attributes:arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},type:"attachment"}}(t,e))}appendPiece(t){return 0===this.blocks.length&&this.appendEmptyBlock(),this.blocks[this.blocks.length-1].text.push(t)}appendStringToTextAtIndex(t,e){const{text:i}=this.blocks[e],n=i[i.length-1];if("string"!==(null==n?void 0:n.type))return i.push(cn(t));n.string+=t}prependStringToTextAtIndex(t,e){const{text:i}=this.blocks[e],n=i[0];if("string"!==(null==n?void 0:n.type))return i.unshift(cn(t));n.string=t+n.string}getTextAttributes(t){let e;const i={};for(const n in W){const r=W[n];if(r.tagName&&y(t,{matchingSelector:r.tagName,untilNode:this.containerElement}))i[n]=!0;else if(r.parser){if(e=r.parser(t),e){let o=!1;for(const i of this.findBlockElementAncestors(t))if(r.parser(i)===e){o=!0;break}o||(i[n]=e)}}else r.styleProperty&&(e=t.style[r.styleProperty],e&&(i[n]=e))}if(P(t)){const n=un(t,"attributes");for(const t in n)e=n[t],i[t]=e}return i}getBlockAttributes(t){const e=[];for(;t&&t!==this.containerElement;){for(const r in n){const o=n[r];var i;if(!1!==o.parse)if(k(t)===o.tagName)(null!==(i=o.test)&&void 0!==i&&i.call(o,t)||!o.test)&&(e.push(r),o.listAttribute&&e.push(o.listAttribute))}t=t.parentNode}return e.reverse()}getBlockHTMLAttributes(t){const e={},i=Object.values(n).find((e=>e.tagName===k(t)));return((null==i?void 0:i.htmlAttributes)||[]).forEach((i=>{t.hasAttribute(i)&&(e[i]=t.getAttribute(i))})),e}findBlockElementAncestors(t){const e=[];for(;t&&t!==this.containerElement;){const i=k(t);L().includes(i)&&e.push(t),t=t.parentNode}return e}isBlockElement(t){if((null==t?void 0:t.nodeType)===Node.ELEMENT_NODE&&!P(t)&&!y(t,{matchingSelector:"td",untilNode:this.containerElement}))return L().includes(k(t))||"block"===window.getComputedStyle(t).display}isInsignificantTextNode(t){if((null==t?void 0:t.nodeType)!==Node.TEXT_NODE)return;if(!bn(t.data))return;const{parentNode:e,previousSibling:i,nextSibling:n}=t;return gn(e.previousSibling)&&!this.isBlockElement(e.previousSibling)||dn(e)?void 0:!i||this.isBlockElement(i)||!n||this.isBlockElement(n)}isExtraBR(t){return"br"===k(t)&&this.isBlockElement(t.parentNode)&&t.parentNode.lastChild===t}needsTableSeparator(t){if(j.removeBlankTableCells){var e;const i=null===(e=t.previousSibling)||void 0===e?void 0:e.textContent;return i&&/\S/.test(i)}return t.previousSibling}translateBlockElementMarginsToNewlines(){const t=this.getMarginOfDefaultBlockElement();for(let e=0;e<this.blocks.length;e++){const i=this.getMarginOfBlockElementAtIndex(e);i&&(i.top>2*t.top&&this.prependStringToTextAtIndex("\n",e),i.bottom>2*t.bottom&&this.appendStringToTextAtIndex("\n",e))}}getMarginOfBlockElementAtIndex(t){const e=this.blockElements[t];if(e&&e.textContent&&!L().includes(k(e))&&!this.processedElements.includes(e))return mn(e)}getMarginOfDefaultBlockElement(){const t=T(n.default.tagName);return this.containerElement.appendChild(t),mn(t)}}const dn=function(t){const{whiteSpace:e}=window.getComputedStyle(t);return["pre","pre-wrap","pre-line"].includes(e)},gn=t=>t&&!vn(t.textContent),mn=function(t){const e=window.getComputedStyle(t);if("block"===e.display)return{top:parseInt(e.marginTop),bottom:parseInt(e.marginBottom)}},pn=function(t){return"style"===k(t)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},fn=t=>t.replace(new RegExp("^".concat(Ut.source,"+")),""),bn=t=>new RegExp("^".concat(Ut.source,"*$")).test(t),vn=t=>/\s$/.test(t),An=["contenteditable","data-trix-id","data-trix-store-key","data-trix-mutable","data-trix-placeholder","tabindex"],yn="data-trix-serialized-attributes",xn="[".concat(yn,"]"),Cn=new RegExp("\x3c!--block--\x3e","g"),En={"application/json":function(t){let e;if(t instanceof an)e=t;else{if(!(t instanceof HTMLElement))throw new Error("unserializable object");e=hn.parse(t.innerHTML).getDocument()}return e.toSerializableDocument().toJSONString()},"text/html":function(t){let e;if(t instanceof an)e=Si.render(t);else{if(!(t instanceof HTMLElement))throw new Error("unserializable object");e=t.cloneNode(!0)}return Array.from(e.querySelectorAll("[data-trix-serialize=false]")).forEach((t=>{S(t)})),An.forEach((t=>{Array.from(e.querySelectorAll("[".concat(t,"]"))).forEach((e=>{e.removeAttribute(t)}))})),Array.from(e.querySelectorAll(xn)).forEach((t=>{try{const e=JSON.parse(t.getAttribute(yn));t.removeAttribute(yn);for(const i in e){const n=e[i];t.setAttribute(i,n)}}catch(t){}})),e.innerHTML.replace(Cn,"")}};var Sn=Object.freeze({__proto__:null});class Rn extends q{constructor(t,e){super(...arguments),this.attachmentManager=t,this.attachment=e,this.id=this.attachment.id,this.file=this.attachment.file}remove(){return this.attachmentManager.requestRemovalOfAttachment(this.attachment)}}Rn.proxyMethod("attachment.getAttribute"),Rn.proxyMethod("attachment.hasAttribute"),Rn.proxyMethod("attachment.setAttribute"),Rn.proxyMethod("attachment.getAttributes"),Rn.proxyMethod("attachment.setAttributes"),Rn.proxyMethod("attachment.isPending"),Rn.proxyMethod("attachment.isPreviewable"),Rn.proxyMethod("attachment.getURL"),Rn.proxyMethod("attachment.getHref"),Rn.proxyMethod("attachment.getFilename"),Rn.proxyMethod("attachment.getFilesize"),Rn.proxyMethod("attachment.getFormattedFilesize"),Rn.proxyMethod("attachment.getExtension"),Rn.proxyMethod("attachment.getContentType"),Rn.proxyMethod("attachment.getFile"),Rn.proxyMethod("attachment.setFile"),Rn.proxyMethod("attachment.releaseFile"),Rn.proxyMethod("attachment.getUploadProgress"),Rn.proxyMethod("attachment.setUploadProgress");class kn extends q{constructor(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];super(...arguments),this.managedAttachments={},Array.from(t).forEach((t=>{this.manageAttachment(t)}))}getAttachments(){const t=[];for(const e in this.managedAttachments){const i=this.managedAttachments[e];t.push(i)}return t}manageAttachment(t){return this.managedAttachments[t.id]||(this.managedAttachments[t.id]=new Rn(this,t)),this.managedAttachments[t.id]}attachmentIsManaged(t){return t.id in this.managedAttachments}requestRemovalOfAttachment(t){var e,i;if(this.attachmentIsManaged(t))return null===(e=this.delegate)||void 0===e||null===(i=e.attachmentManagerDidRequestRemovalOfAttachment)||void 0===i?void 0:i.call(e,t)}unmanageAttachment(t){const e=this.managedAttachments[t.id];return delete this.managedAttachments[t.id],e}}class Tn{constructor(t){this.composition=t,this.document=this.composition.document;const e=this.composition.getSelectedRange();this.startPosition=e[0],this.endPosition=e[1],this.startLocation=this.document.locationFromPosition(this.startPosition),this.endLocation=this.document.locationFromPosition(this.endPosition),this.block=this.document.getBlockAtIndex(this.endLocation.index),this.breaksOnReturn=this.block.breaksOnReturn(),this.previousCharacter=this.block.text.getStringAtPosition(this.endLocation.offset-1),this.nextCharacter=this.block.text.getStringAtPosition(this.endLocation.offset)}shouldInsertBlockBreak(){return this.block.hasAttributes()&&this.block.isListItem()&&!this.block.isEmpty()?0!==this.startLocation.offset:this.breaksOnReturn&&"\n"!==this.nextCharacter}shouldBreakFormattedBlock(){return this.block.hasAttributes()&&!this.block.isListItem()&&(this.breaksOnReturn&&"\n"===this.nextCharacter||"\n"===this.previousCharacter)}shouldDecreaseListLevel(){return this.block.hasAttributes()&&this.block.isListItem()&&this.block.isEmpty()}shouldPrependListItem(){return this.block.isListItem()&&0===this.startLocation.offset&&!this.block.isEmpty()}shouldRemoveLastBlockAttribute(){return this.block.hasAttributes()&&!this.block.isListItem()&&this.block.isEmpty()}}class wn extends q{constructor(){super(...arguments),this.document=new an,this.attachments=[],this.currentAttributes={},this.revision=0}setDocument(t){var e,i;if(!t.isEqualTo(this.document))return this.document=t,this.refreshAttachments(),this.revision++,null===(e=this.delegate)||void 0===e||null===(i=e.compositionDidChangeDocument)||void 0===i?void 0:i.call(e,t)}getSnapshot(){return{document:this.document,selectedRange:this.getSelectedRange()}}loadSnapshot(t){var e,i,n,r;let{document:o,selectedRange:s}=t;return null===(e=this.delegate)||void 0===e||null===(i=e.compositionWillLoadSnapshot)||void 0===i||i.call(e),this.setDocument(null!=o?o:new an),this.setSelection(null!=s?s:[0,0]),null===(n=this.delegate)||void 0===n||null===(r=n.compositionDidLoadSnapshot)||void 0===r?void 0:r.call(n)}insertText(t){let{updatePosition:e}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{updatePosition:!0};const i=this.getSelectedRange();this.setDocument(this.document.insertTextAtRange(t,i));const n=i[0],r=n+t.getLength();return e&&this.setSelection(r),this.notifyDelegateOfInsertionAtRange([n,r])}insertBlock(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Xi;const e=new an([t]);return this.insertDocument(e)}insertDocument(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new an;const e=this.getSelectedRange();this.setDocument(this.document.insertDocumentAtRange(t,e));const i=e[0],n=i+t.getLength();return this.setSelection(n),this.notifyDelegateOfInsertionAtRange([i,n])}insertString(t,e){const i=this.getCurrentTextAttributes(),n=Yi.textForStringWithAttributes(t,i);return this.insertText(n,e)}insertBlockBreak(){const t=this.getSelectedRange();this.setDocument(this.document.insertBlockBreakAtRange(t));const e=t[0],i=e+1;return this.setSelection(i),this.notifyDelegateOfInsertionAtRange([e,i])}insertLineBreak(){const t=new Tn(this);if(t.shouldDecreaseListLevel())return this.decreaseListLevel(),this.setSelection(t.startPosition);if(t.shouldPrependListItem()){const e=new an([t.block.copyWithoutText()]);return this.insertDocument(e)}return t.shouldInsertBlockBreak()?this.insertBlockBreak():t.shouldRemoveLastBlockAttribute()?this.removeLastBlockAttribute():t.shouldBreakFormattedBlock()?this.breakFormattedBlock(t):this.insertString("\n")}insertHTML(t){const e=hn.parse(t,{purifyOptions:{SAFE_FOR_XML:!0}}).getDocument(),i=this.getSelectedRange();this.setDocument(this.document.mergeDocumentAtRange(e,i));const n=i[0],r=n+e.getLength()-1;return this.setSelection(r),this.notifyDelegateOfInsertionAtRange([n,r])}replaceHTML(t){const e=hn.parse(t).getDocument().copyUsingObjectsFromDocument(this.document),i=this.getLocationRange({strict:!1}),n=this.document.rangeFromLocationRange(i);return this.setDocument(e),this.setSelection(n)}insertFile(t){return this.insertFiles([t])}insertFiles(t){const e=[];return Array.from(t).forEach((t=>{var i;if(null!==(i=this.delegate)&&void 0!==i&&i.compositionShouldAcceptFile(t)){const i=Vi.attachmentForFile(t);e.push(i)}})),this.insertAttachments(e)}insertAttachment(t){return this.insertAttachments([t])}insertAttachments(t){let e=new Yi;return Array.from(t).forEach((t=>{var n;const r=t.getType(),o=null===(n=i[r])||void 0===n?void 0:n.presentation,s=this.getCurrentTextAttributes();o&&(s.presentation=o);const a=Yi.textForAttachmentWithAttributes(t,s);e=e.appendText(a)})),this.insertText(e)}shouldManageDeletingInDirection(t){const e=this.getLocationRange();if(Lt(e)){if("backward"===t&&0===e[0].offset)return!0;if(this.shouldManageMovingCursorInDirection(t))return!0}else if(e[0].index!==e[1].index)return!0;return!1}deleteInDirection(t){let e,i,n,{length:r}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const o=this.getLocationRange();let s=this.getSelectedRange();const a=Lt(s);if(a?i="backward"===t&&0===o[0].offset:n=o[0].index!==o[1].index,i&&this.canDecreaseBlockAttributeLevel()){const t=this.getBlock();if(t.isListItem()?this.decreaseListLevel():this.decreaseBlockAttributeLevel(),this.setSelection(s[0]),t.isEmpty())return!1}return a&&(s=this.getExpandedRangeInDirection(t,{length:r}),"backward"===t&&(e=this.getAttachmentAtRange(s))),e?(this.editAttachment(e),!1):(this.setDocument(this.document.removeTextAtRange(s)),this.setSelection(s[0]),!i&&!n&&void 0)}moveTextFromRange(t){const[e]=Array.from(this.getSelectedRange());return this.setDocument(this.document.moveTextFromRangeToPosition(t,e)),this.setSelection(e)}removeAttachment(t){const e=this.document.getRangeOfAttachment(t);if(e)return this.stopEditingAttachment(),this.setDocument(this.document.removeTextAtRange(e)),this.setSelection(e[0])}removeLastBlockAttribute(){const[t,e]=Array.from(this.getSelectedRange()),i=this.document.getBlockAtPosition(e);return this.removeCurrentAttribute(i.getLastAttribute()),this.setSelection(t)}insertPlaceholder(){return this.placeholderPosition=this.getPosition(),this.insertString(" ")}selectPlaceholder(){if(null!=this.placeholderPosition)return this.setSelectedRange([this.placeholderPosition,this.placeholderPosition+1]),this.getSelectedRange()}forgetPlaceholder(){this.placeholderPosition=null}hasCurrentAttribute(t){const e=this.currentAttributes[t];return null!=e&&!1!==e}toggleCurrentAttribute(t){const e=!this.currentAttributes[t];return e?this.setCurrentAttribute(t,e):this.removeCurrentAttribute(t)}canSetCurrentAttribute(t){return mt(t)?this.canSetCurrentBlockAttribute(t):this.canSetCurrentTextAttribute(t)}canSetCurrentTextAttribute(t){const e=this.getSelectedDocument();if(e){for(const t of Array.from(e.getAttachments()))if(!t.hasContent())return!1;return!0}}canSetCurrentBlockAttribute(t){const e=this.getBlock();if(e)return!e.isTerminalBlock()}setCurrentAttribute(t,e){return mt(t)?this.setBlockAttribute(t,e):(this.setTextAttribute(t,e),this.currentAttributes[t]=e,this.notifyDelegateOfCurrentAttributesChange())}setHTMLAtributeAtPosition(t,e,i){var n;const r=this.document.getBlockAtPosition(t),o=null===(n=mt(r.getLastAttribute()))||void 0===n?void 0:n.htmlAttributes;if(r&&null!=o&&o.includes(e)){const n=this.document.setHTMLAttributeAtPosition(t,e,i);this.setDocument(n)}}setTextAttribute(t,e){const i=this.getSelectedRange();if(!i)return;const[n,r]=Array.from(i);if(n!==r)return this.setDocument(this.document.addAttributeAtRange(t,e,i));if("href"===t){const t=Yi.textForStringWithAttributes(e,{href:e});return this.insertText(t)}}setBlockAttribute(t,e){const i=this.getSelectedRange();if(this.canSetCurrentAttribute(t))return this.setDocument(this.document.applyBlockAttributeAtRange(t,e,i)),this.setSelection(i)}removeCurrentAttribute(t){return mt(t)?(this.removeBlockAttribute(t),this.updateCurrentAttributes()):(this.removeTextAttribute(t),delete this.currentAttributes[t],this.notifyDelegateOfCurrentAttributesChange())}removeTextAttribute(t){const e=this.getSelectedRange();if(e)return this.setDocument(this.document.removeAttributeAtRange(t,e))}removeBlockAttribute(t){const e=this.getSelectedRange();if(e)return this.setDocument(this.document.removeAttributeAtRange(t,e))}canDecreaseNestingLevel(){var t;return(null===(t=this.getBlock())||void 0===t?void 0:t.getNestingLevel())>0}canIncreaseNestingLevel(){var t;const e=this.getBlock();if(e){if(null===(t=mt(e.getLastNestableAttribute()))||void 0===t||!t.listAttribute)return e.getNestingLevel()>0;{const t=this.getPreviousBlock();if(t)return function(){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return ot((arguments.length>0&&void 0!==arguments[0]?arguments[0]:[]).slice(0,t.length),t)}(t.getListItemAttributes(),e.getListItemAttributes())}}}decreaseNestingLevel(){const t=this.getBlock();if(t)return this.setDocument(this.document.replaceBlock(t,t.decreaseNestingLevel()))}increaseNestingLevel(){const t=this.getBlock();if(t)return this.setDocument(this.document.replaceBlock(t,t.increaseNestingLevel()))}canDecreaseBlockAttributeLevel(){var t;return(null===(t=this.getBlock())||void 0===t?void 0:t.getAttributeLevel())>0}decreaseBlockAttributeLevel(){var t;const e=null===(t=this.getBlock())||void 0===t?void 0:t.getLastAttribute();if(e)return this.removeCurrentAttribute(e)}decreaseListLevel(){let[t]=Array.from(this.getSelectedRange());const{index:e}=this.document.locationFromPosition(t);let i=e;const n=this.getBlock().getAttributeLevel();let r=this.document.getBlockAtIndex(i+1);for(;r&&r.isListItem()&&!(r.getAttributeLevel()<=n);)i++,r=this.document.getBlockAtIndex(i+1);t=this.document.positionFromLocation({index:e,offset:0});const o=this.document.positionFromLocation({index:i,offset:0});return this.setDocument(this.document.removeLastListAttributeAtRange([t,o]))}updateCurrentAttributes(){const t=this.getSelectedRange({ignoreLock:!0});if(t){const e=this.document.getCommonAttributesAtRange(t);if(Array.from(gt()).forEach((t=>{e[t]||this.canSetCurrentAttribute(t)||(e[t]=!1)})),!Tt(e,this.currentAttributes))return this.currentAttributes=e,this.notifyDelegateOfCurrentAttributesChange()}}getCurrentAttributes(){return m.call({},this.currentAttributes)}getCurrentTextAttributes(){const t={};for(const e in this.currentAttributes){const i=this.currentAttributes[e];!1!==i&&ft(e)&&(t[e]=i)}return t}freezeSelection(){return this.setCurrentAttribute("frozen",!0)}thawSelection(){return this.removeCurrentAttribute("frozen")}hasFrozenSelection(){return this.hasCurrentAttribute("frozen")}setSelection(t){var e;const i=this.document.locationRangeFromRange(t);return null===(e=this.delegate)||void 0===e?void 0:e.compositionDidRequestChangingSelectionToLocationRange(i)}getSelectedRange(){const t=this.getLocationRange();if(t)return this.document.rangeFromLocationRange(t)}setSelectedRange(t){const e=this.document.locationRangeFromRange(t);return this.getSelectionManager().setLocationRange(e)}getPosition(){const t=this.getLocationRange();if(t)return this.document.positionFromLocation(t[0])}getLocationRange(t){return this.targetLocationRange?this.targetLocationRange:this.getSelectionManager().getLocationRange(t)||wt({index:0,offset:0})}withTargetLocationRange(t,e){let i;this.targetLocationRange=t;try{i=e()}finally{this.targetLocationRange=null}return i}withTargetRange(t,e){const i=this.document.locationRangeFromRange(t);return this.withTargetLocationRange(i,e)}withTargetDOMRange(t,e){const i=this.createLocationRangeFromDOMRange(t,{strict:!1});return this.withTargetLocationRange(i,e)}getExpandedRangeInDirection(t){let{length:e}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},[i,n]=Array.from(this.getSelectedRange());return"backward"===t?e?i-=e:i=this.translateUTF16PositionFromOffset(i,-1):e?n+=e:n=this.translateUTF16PositionFromOffset(n,1),wt([i,n])}shouldManageMovingCursorInDirection(t){if(this.editingAttachment)return!0;const e=this.getExpandedRangeInDirection(t);return null!=this.getAttachmentAtRange(e)}moveCursorInDirection(t){let e,i;if(this.editingAttachment)i=this.document.getRangeOfAttachment(this.editingAttachment);else{const n=this.getSelectedRange();i=this.getExpandedRangeInDirection(t),e=!Dt(n,i)}if("backward"===t?this.setSelectedRange(i[0]):this.setSelectedRange(i[1]),e){const t=this.getAttachmentAtRange(i);if(t)return this.editAttachment(t)}}expandSelectionInDirection(t){let{length:e}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const i=this.getExpandedRangeInDirection(t,{length:e});return this.setSelectedRange(i)}expandSelectionForEditing(){if(this.hasCurrentAttribute("href"))return this.expandSelectionAroundCommonAttribute("href")}expandSelectionAroundCommonAttribute(t){const e=this.getPosition(),i=this.document.getRangeOfCommonAttributeAtPosition(t,e);return this.setSelectedRange(i)}selectionContainsAttachments(){var t;return(null===(t=this.getSelectedAttachments())||void 0===t?void 0:t.length)>0}selectionIsInCursorTarget(){return this.editingAttachment||this.positionIsCursorTarget(this.getPosition())}positionIsCursorTarget(t){const e=this.document.locationFromPosition(t);if(e)return this.locationIsCursorTarget(e)}positionIsBlockBreak(t){var e;return null===(e=this.document.getPieceAtPosition(t))||void 0===e?void 0:e.isBlockBreak()}getSelectedDocument(){const t=this.getSelectedRange();if(t)return this.document.getDocumentAtRange(t)}getSelectedAttachments(){var t;return null===(t=this.getSelectedDocument())||void 0===t?void 0:t.getAttachments()}getAttachments(){return this.attachments.slice(0)}refreshAttachments(){const t=this.document.getAttachments(),{added:e,removed:i}=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];const i=[],n=[],r=new Set;t.forEach((t=>{r.add(t)}));const o=new Set;return e.forEach((t=>{o.add(t),r.has(t)||i.push(t)})),t.forEach((t=>{o.has(t)||n.push(t)})),{added:i,removed:n}}(this.attachments,t);return this.attachments=t,Array.from(i).forEach((t=>{var e,i;t.delegate=null,null===(e=this.delegate)||void 0===e||null===(i=e.compositionDidRemoveAttachment)||void 0===i||i.call(e,t)})),(()=>{const t=[];return Array.from(e).forEach((e=>{var i,n;e.delegate=this,t.push(null===(i=this.delegate)||void 0===i||null===(n=i.compositionDidAddAttachment)||void 0===n?void 0:n.call(i,e))})),t})()}attachmentDidChangeAttributes(t){var e,i;return this.revision++,null===(e=this.delegate)||void 0===e||null===(i=e.compositionDidEditAttachment)||void 0===i?void 0:i.call(e,t)}attachmentDidChangePreviewURL(t){var e,i;return this.revision++,null===(e=this.delegate)||void 0===e||null===(i=e.compositionDidChangeAttachmentPreviewURL)||void 0===i?void 0:i.call(e,t)}editAttachment(t,e){var i,n;if(t!==this.editingAttachment)return this.stopEditingAttachment(),this.editingAttachment=t,null===(i=this.delegate)||void 0===i||null===(n=i.compositionDidStartEditingAttachment)||void 0===n?void 0:n.call(i,this.editingAttachment,e)}stopEditingAttachment(){var t,e;this.editingAttachment&&(null===(t=this.delegate)||void 0===t||null===(e=t.compositionDidStopEditingAttachment)||void 0===e||e.call(t,this.editingAttachment),this.editingAttachment=null)}updateAttributesForAttachment(t,e){return this.setDocument(this.document.updateAttributesForAttachment(t,e))}removeAttributeForAttachment(t,e){return this.setDocument(this.document.removeAttributeForAttachment(t,e))}breakFormattedBlock(t){let{document:e}=t;const{block:i}=t;let n=t.startPosition,r=[n-1,n];i.getBlockBreakPosition()===t.startLocation.offset?(i.breaksOnReturn()&&"\n"===t.nextCharacter?n+=1:e=e.removeTextAtRange(r),r=[n,n]):"\n"===t.nextCharacter?"\n"===t.previousCharacter?r=[n-1,n+1]:(r=[n,n+1],n+=1):t.startLocation.offset-1!=0&&(n+=1);const o=new an([i.removeLastAttribute().copyWithoutText()]);return this.setDocument(e.insertDocumentAtRange(o,r)),this.setSelection(n)}getPreviousBlock(){const t=this.getLocationRange();if(t){const{index:e}=t[0];if(e>0)return this.document.getBlockAtIndex(e-1)}}getBlock(){const t=this.getLocationRange();if(t)return this.document.getBlockAtIndex(t[0].index)}getAttachmentAtRange(t){const e=this.document.getDocumentAtRange(t);if(e.toString()==="".concat("￼","\n"))return e.getAttachments()[0]}notifyDelegateOfCurrentAttributesChange(){var t,e;return null===(t=this.delegate)||void 0===t||null===(e=t.compositionDidChangeCurrentAttributes)||void 0===e?void 0:e.call(t,this.currentAttributes)}notifyDelegateOfInsertionAtRange(t){var e,i;return null===(e=this.delegate)||void 0===e||null===(i=e.compositionDidPerformInsertionAtRange)||void 0===i?void 0:i.call(e,t)}translateUTF16PositionFromOffset(t,e){const i=this.document.toUTF16String(),n=i.offsetFromUCS2Offset(t);return i.offsetToUCS2Offset(n+e)}}wn.proxyMethod("getSelectionManager().getPointRange"),wn.proxyMethod("getSelectionManager().setLocationRangeFromPointRange"),wn.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange"),wn.proxyMethod("getSelectionManager().locationIsCursorTarget"),wn.proxyMethod("getSelectionManager().selectionIsExpanded"),wn.proxyMethod("delegate?.getSelectionManager");class Ln extends q{constructor(t){super(...arguments),this.composition=t,this.undoEntries=[],this.redoEntries=[]}recordUndoEntry(t){let{context:e,consolidatable:i}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const n=this.undoEntries.slice(-1)[0];if(!i||!Dn(n,t,e)){const i=this.createEntry({description:t,context:e});this.undoEntries.push(i),this.redoEntries=[]}}undo(){const t=this.undoEntries.pop();if(t){const e=this.createEntry(t);return this.redoEntries.push(e),this.composition.loadSnapshot(t.snapshot)}}redo(){const t=this.redoEntries.pop();if(t){const e=this.createEntry(t);return this.undoEntries.push(e),this.composition.loadSnapshot(t.snapshot)}}canUndo(){return this.undoEntries.length>0}canRedo(){return this.redoEntries.length>0}createEntry(){let{description:t,context:e}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return{description:null==t?void 0:t.toString(),context:JSON.stringify(e),snapshot:this.composition.getSnapshot()}}}const Dn=(t,e,i)=>(null==t?void 0:t.description)===(null==e?void 0:e.toString())&&(null==t?void 0:t.context)===JSON.stringify(i),Nn="attachmentGallery";class In{constructor(t){this.document=t.document,this.selectedRange=t.selectedRange}perform(){return this.removeBlockAttribute(),this.applyBlockAttribute()}getSnapshot(){return{document:this.document,selectedRange:this.selectedRange}}removeBlockAttribute(){return this.findRangesOfBlocks().map((t=>this.document=this.document.removeAttributeAtRange(Nn,t)))}applyBlockAttribute(){let t=0;this.findRangesOfPieces().forEach((e=>{e[1]-e[0]>1&&(e[0]+=t,e[1]+=t,"\n"!==this.document.getCharacterAtPosition(e[1])&&(this.document=this.document.insertBlockBreakAtRange(e[1]),e[1]<this.selectedRange[1]&&this.moveSelectedRangeForward(),e[1]++,t++),0!==e[0]&&"\n"!==this.document.getCharacterAtPosition(e[0]-1)&&(this.document=this.document.insertBlockBreakAtRange(e[0]),e[0]<this.selectedRange[0]&&this.moveSelectedRangeForward(),e[0]++,t++),this.document=this.document.applyBlockAttributeAtRange(Nn,!0,e))}))}findRangesOfBlocks(){return this.document.findRangesForBlockAttribute(Nn)}findRangesOfPieces(){return this.document.findRangesForTextAttribute("presentation",{withValue:"gallery"})}moveSelectedRangeForward(){this.selectedRange[0]+=1,this.selectedRange[1]+=1}}const On=function(t){const e=new In(t);return e.perform(),e.getSnapshot()},Fn=[On];class Pn{constructor(t,e,i){this.insertFiles=this.insertFiles.bind(this),this.composition=t,this.selectionManager=e,this.element=i,this.undoManager=new Ln(this.composition),this.filters=Fn.slice(0)}loadDocument(t){return this.loadSnapshot({document:t,selectedRange:[0,0]})}loadHTML(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";const e=hn.parse(t,{referenceElement:this.element}).getDocument();return this.loadDocument(e)}loadJSON(t){let{document:e,selectedRange:i}=t;return e=an.fromJSON(e),this.loadSnapshot({document:e,selectedRange:i})}loadSnapshot(t){return this.undoManager=new Ln(this.composition),this.composition.loadSnapshot(t)}getDocument(){return this.composition.document}getSelectedDocument(){return this.composition.getSelectedDocument()}getSnapshot(){return this.composition.getSnapshot()}toJSON(){return this.getSnapshot()}deleteInDirection(t){return this.composition.deleteInDirection(t)}insertAttachment(t){return this.composition.insertAttachment(t)}insertAttachments(t){return this.composition.insertAttachments(t)}insertDocument(t){return this.composition.insertDocument(t)}insertFile(t){return this.composition.insertFile(t)}insertFiles(t){return this.composition.insertFiles(t)}insertHTML(t){return this.composition.insertHTML(t)}insertString(t){return this.composition.insertString(t)}insertText(t){return this.composition.insertText(t)}insertLineBreak(){return this.composition.insertLineBreak()}getSelectedRange(){return this.composition.getSelectedRange()}getPosition(){return this.composition.getPosition()}getClientRectAtPosition(t){const e=this.getDocument().locationRangeFromRange([t,t+1]);return this.selectionManager.getClientRectAtLocationRange(e)}expandSelectionInDirection(t){return this.composition.expandSelectionInDirection(t)}moveCursorInDirection(t){return this.composition.moveCursorInDirection(t)}setSelectedRange(t){return this.composition.setSelectedRange(t)}activateAttribute(t){let e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.composition.setCurrentAttribute(t,e)}attributeIsActive(t){return this.composition.hasCurrentAttribute(t)}canActivateAttribute(t){return this.composition.canSetCurrentAttribute(t)}deactivateAttribute(t){return this.composition.removeCurrentAttribute(t)}setHTMLAtributeAtPosition(t,e,i){this.composition.setHTMLAtributeAtPosition(t,e,i)}canDecreaseNestingLevel(){return this.composition.canDecreaseNestingLevel()}canIncreaseNestingLevel(){return this.composition.canIncreaseNestingLevel()}decreaseNestingLevel(){if(this.canDecreaseNestingLevel())return this.composition.decreaseNestingLevel()}increaseNestingLevel(){if(this.canIncreaseNestingLevel())return this.composition.increaseNestingLevel()}canRedo(){return this.undoManager.canRedo()}canUndo(){return this.undoManager.canUndo()}recordUndoEntry(t){let{context:e,consolidatable:i}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.undoManager.recordUndoEntry(t,{context:e,consolidatable:i})}redo(){if(this.canRedo())return this.undoManager.redo()}undo(){if(this.canUndo())return this.undoManager.undo()}}class Mn{constructor(t){this.element=t}findLocationFromContainerAndOffset(t,e){let{strict:i}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{strict:!0},n=0,r=!1;const o={index:0,offset:0},s=this.findAttachmentElementParentForNode(t);s&&(t=s.parentNode,e=E(s));const a=R(this.element,{usingFilter:Wn});for(;a.nextNode();){const s=a.currentNode;if(s===t&&B(t)){F(s)||(o.offset+=e);break}if(s.parentNode===t){if(n++===e)break}else if(!C(t,s)&&n>0)break;N(s,{strict:i})?(r&&o.index++,o.offset=0,r=!0):o.offset+=Bn(s)}return o}findContainerAndOffsetFromLocation(t){let e,i;if(0===t.index&&0===t.offset){for(e=this.element,i=0;e.firstChild;)if(e=e.firstChild,D(e)){i=1;break}return[e,i]}let[n,r]=this.findNodeAndOffsetFromLocation(t);if(n){if(B(n))0===Bn(n)?(e=n.parentNode.parentNode,i=E(n.parentNode),F(n,{name:"right"})&&i++):(e=n,i=t.offset-r);else{if(e=n.parentNode,!N(n.previousSibling)&&!D(e))for(;n===e.lastChild&&(n=e,e=e.parentNode,!D(e)););i=E(n),0!==t.offset&&i++}return[e,i]}}findNodeAndOffsetFromLocation(t){let e,i,n=0;for(const r of this.getSignificantNodesForIndex(t.index)){const o=Bn(r);if(t.offset<=n+o)if(B(r)){if(e=r,i=n,t.offset===i&&F(e))break}else e||(e=r,i=n);if(n+=o,n>t.offset)break}return[e,i]}findAttachmentElementParentForNode(t){for(;t&&t!==this.element;){if(P(t))return t;t=t.parentNode}}getSignificantNodesForIndex(t){const e=[],i=R(this.element,{usingFilter:_n});let n=!1;for(;i.nextNode();){const o=i.currentNode;var r;if(I(o)){if(null!=r?r++:r=0,r===t)n=!0;else if(n)break}else n&&e.push(o)}return e}}const Bn=function(t){if(t.nodeType===Node.TEXT_NODE){if(F(t))return 0;return t.textContent.length}return"br"===k(t)||P(t)?1:0},_n=function(t){return jn(t)===NodeFilter.FILTER_ACCEPT?Wn(t):NodeFilter.FILTER_REJECT},jn=function(t){return M(t)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},Wn=function(t){return P(t.parentNode)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT};class Un{createDOMRangeFromPoint(t){let e,{x:i,y:n}=t;if(document.caretPositionFromPoint){const{offsetNode:t,offset:r}=document.caretPositionFromPoint(i,n);return e=document.createRange(),e.setStart(t,r),e}if(document.caretRangeFromPoint)return document.caretRangeFromPoint(i,n);if(document.body.createTextRange){const t=Mt();try{const t=document.body.createTextRange();t.moveToPoint(i,n),t.select()}catch(t){}return e=Mt(),Bt(t),e}}getClientRectsForDOMRange(t){const e=Array.from(t.getClientRects());return[e[0],e[e.length-1]]}}class Vn extends q{constructor(t){super(...arguments),this.didMouseDown=this.didMouseDown.bind(this),this.selectionDidChange=this.selectionDidChange.bind(this),this.element=t,this.locationMapper=new Mn(this.element),this.pointMapper=new Un,this.lockCount=0,b("mousedown",{onElement:this.element,withCallback:this.didMouseDown})}getLocationRange(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return!1===t.strict?this.createLocationRangeFromDOMRange(Mt()):t.ignoreLock?this.currentLocationRange:this.lockedLocationRange?this.lockedLocationRange:this.currentLocationRange}setLocationRange(t){if(this.lockedLocationRange)return;t=wt(t);const e=this.createDOMRangeFromLocationRange(t);e&&(Bt(e),this.updateCurrentLocationRange(t))}setLocationRangeFromPointRange(t){t=wt(t);const e=this.getLocationAtPoint(t[0]),i=this.getLocationAtPoint(t[1]);this.setLocationRange([e,i])}getClientRectAtLocationRange(t){const e=this.createDOMRangeFromLocationRange(t);if(e)return this.getClientRectsForDOMRange(e)[1]}locationIsCursorTarget(t){const e=Array.from(this.findNodeAndOffsetFromLocation(t))[0];return F(e)}lock(){0==this.lockCount++&&(this.updateCurrentLocationRange(),this.lockedLocationRange=this.getLocationRange())}unlock(){if(0==--this.lockCount){const{lockedLocationRange:t}=this;if(this.lockedLocationRange=null,null!=t)return this.setLocationRange(t)}}clearSelection(){var t;return null===(t=Pt())||void 0===t?void 0:t.removeAllRanges()}selectionIsCollapsed(){var t;return!0===(null===(t=Mt())||void 0===t?void 0:t.collapsed)}selectionIsExpanded(){return!this.selectionIsCollapsed()}createLocationRangeFromDOMRange(t,e){if(null==t||!this.domRangeWithinElement(t))return;const i=this.findLocationFromContainerAndOffset(t.startContainer,t.startOffset,e);if(!i)return;const n=t.collapsed?void 0:this.findLocationFromContainerAndOffset(t.endContainer,t.endOffset,e);return wt([i,n])}didMouseDown(){return this.pauseTemporarily()}pauseTemporarily(){let t;this.paused=!0;const e=()=>{if(this.paused=!1,clearTimeout(i),Array.from(t).forEach((t=>{t.destroy()})),C(document,this.element))return this.selectionDidChange()},i=setTimeout(e,200);t=["mousemove","keydown"].map((t=>b(t,{onElement:document,withCallback:e})))}selectionDidChange(){if(!this.paused&&!x(this.element))return this.updateCurrentLocationRange()}updateCurrentLocationRange(t){var e,i;if((null!=t?t:t=this.createLocationRangeFromDOMRange(Mt()))&&!Dt(t,this.currentLocationRange))return this.currentLocationRange=t,null===(e=this.delegate)||void 0===e||null===(i=e.locationRangeDidChange)||void 0===i?void 0:i.call(e,this.currentLocationRange.slice(0))}createDOMRangeFromLocationRange(t){const e=this.findContainerAndOffsetFromLocation(t[0]),i=Lt(t)?e:this.findContainerAndOffsetFromLocation(t[1])||e;if(null!=e&&null!=i){const t=document.createRange();return t.setStart(...Array.from(e||[])),t.setEnd(...Array.from(i||[])),t}}getLocationAtPoint(t){const e=this.createDOMRangeFromPoint(t);var i;if(e)return null===(i=this.createLocationRangeFromDOMRange(e))||void 0===i?void 0:i[0]}domRangeWithinElement(t){return t.collapsed?C(this.element,t.startContainer):C(this.element,t.startContainer)&&C(this.element,t.endContainer)}}Vn.proxyMethod("locationMapper.findLocationFromContainerAndOffset"),Vn.proxyMethod("locationMapper.findContainerAndOffsetFromLocation"),Vn.proxyMethod("locationMapper.findNodeAndOffsetFromLocation"),Vn.proxyMethod("pointMapper.createDOMRangeFromPoint"),Vn.proxyMethod("pointMapper.getClientRectsForDOMRange");var zn=Object.freeze({__proto__:null,Attachment:Vi,AttachmentManager:kn,AttachmentPiece:zi,Block:Xi,Composition:wn,Document:an,Editor:Pn,HTMLParser:hn,HTMLSanitizer:di,LineBreakInsertion:Tn,LocationMapper:Mn,ManagedAttachment:Rn,Piece:Wi,PointMapper:Un,SelectionManager:Vn,SplittableList:Hi,StringPiece:qi,Text:Yi,UndoManager:Ln}),qn=Object.freeze({__proto__:null,ObjectView:ie,AttachmentView:pi,BlockView:Ei,DocumentView:Si,PieceView:Ai,PreviewableAttachmentView:vi,TextView:yi});const{lang:Hn,css:Jn,keyNames:Kn}=z,Gn=function(t){return function(){const e=t.apply(this,arguments);e.do(),this.undos||(this.undos=[]),this.undos.push(e.undo)}};class Yn extends q{constructor(t,e,i){let n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{};super(...arguments),Di(this,"makeElementMutable",Gn((()=>({do:()=>{this.element.dataset.trixMutable=!0},undo:()=>delete this.element.dataset.trixMutable})))),Di(this,"addToolbar",Gn((()=>{const t=T({tagName:"div",className:Jn.attachmentToolbar,data:{trixMutable:!0},childNodes:T({tagName:"div",className:"trix-button-row",childNodes:T({tagName:"span",className:"trix-button-group trix-button-group--actions",childNodes:T({tagName:"button",className:"trix-button trix-button--remove",textContent:Hn.remove,attributes:{title:Hn.remove},data:{trixAction:"remove"}})})})});return this.attachment.isPreviewable()&&t.appendChild(T({tagName:"div",className:Jn.attachmentMetadataContainer,childNodes:T({tagName:"span",className:Jn.attachmentMetadata,childNodes:[T({tagName:"span",className:Jn.attachmentName,textContent:this.attachment.getFilename(),attributes:{title:this.attachment.getFilename()}}),T({tagName:"span",className:Jn.attachmentSize,textContent:this.attachment.getFormattedFilesize()})]})})),b("click",{onElement:t,withCallback:this.didClickToolbar}),b("click",{onElement:t,matchingSelector:"[data-trix-action]",withCallback:this.didClickActionButton}),v("trix-attachment-before-toolbar",{onElement:this.element,attributes:{toolbar:t,attachment:this.attachment}}),{do:()=>this.element.appendChild(t),undo:()=>S(t)}}))),Di(this,"installCaptionEditor",Gn((()=>{const t=T({tagName:"textarea",className:Jn.attachmentCaptionEditor,attributes:{placeholder:Hn.captionPlaceholder},data:{trixMutable:!0}});t.value=this.attachmentPiece.getCaption();const e=t.cloneNode();e.classList.add("trix-autoresize-clone"),e.tabIndex=-1;const i=function(){e.value=t.value,t.style.height=e.scrollHeight+"px"};b("input",{onElement:t,withCallback:i}),b("input",{onElement:t,withCallback:this.didInputCaption}),b("keydown",{onElement:t,withCallback:this.didKeyDownCaption}),b("change",{onElement:t,withCallback:this.didChangeCaption}),b("blur",{onElement:t,withCallback:this.didBlurCaption});const n=this.element.querySelector("figcaption"),r=n.cloneNode();return{do:()=>{if(n.style.display="none",r.appendChild(t),r.appendChild(e),r.classList.add("".concat(Jn.attachmentCaption,"--editing")),n.parentElement.insertBefore(r,n),i(),this.options.editCaption)return Rt((()=>t.focus()))},undo(){S(r),n.style.display=null}}}))),this.didClickToolbar=this.didClickToolbar.bind(this),this.didClickActionButton=this.didClickActionButton.bind(this),this.didKeyDownCaption=this.didKeyDownCaption.bind(this),this.didInputCaption=this.didInputCaption.bind(this),this.didChangeCaption=this.didChangeCaption.bind(this),this.didBlurCaption=this.didBlurCaption.bind(this),this.attachmentPiece=t,this.element=e,this.container=i,this.options=n,this.attachment=this.attachmentPiece.attachment,"a"===k(this.element)&&(this.element=this.element.firstChild),this.install()}install(){this.makeElementMutable(),this.addToolbar(),this.attachment.isPreviewable()&&this.installCaptionEditor()}uninstall(){var t;let e=this.undos.pop();for(this.savePendingCaption();e;)e(),e=this.undos.pop();null===(t=this.delegate)||void 0===t||t.didUninstallAttachmentEditor(this)}savePendingCaption(){if(null!=this.pendingCaption){const r=this.pendingCaption;var t,e,i,n;if(this.pendingCaption=null,r)null===(t=this.delegate)||void 0===t||null===(e=t.attachmentEditorDidRequestUpdatingAttributesForAttachment)||void 0===e||e.call(t,{caption:r},this.attachment);else null===(i=this.delegate)||void 0===i||null===(n=i.attachmentEditorDidRequestRemovingAttributeForAttachment)||void 0===n||n.call(i,"caption",this.attachment)}}didClickToolbar(t){return t.preventDefault(),t.stopPropagation()}didClickActionButton(t){var e;if("remove"===t.target.getAttribute("data-trix-action"))return null===(e=this.delegate)||void 0===e?void 0:e.attachmentEditorDidRequestRemovalOfAttachment(this.attachment)}didKeyDownCaption(t){var e,i;if("return"===Kn[t.keyCode])return t.preventDefault(),this.savePendingCaption(),null===(e=this.delegate)||void 0===e||null===(i=e.attachmentEditorDidRequestDeselectingAttachment)||void 0===i?void 0:i.call(e,this.attachment)}didInputCaption(t){this.pendingCaption=t.target.value.replace(/\s/g," ").trim()}didChangeCaption(t){return this.savePendingCaption()}didBlurCaption(t){return this.savePendingCaption()}}class Xn extends q{constructor(t,i){super(...arguments),this.didFocus=this.didFocus.bind(this),this.didBlur=this.didBlur.bind(this),this.didClickAttachment=this.didClickAttachment.bind(this),this.element=t,this.composition=i,this.documentView=new Si(this.composition.document,{element:this.element}),b("focus",{onElement:this.element,withCallback:this.didFocus}),b("blur",{onElement:this.element,withCallback:this.didBlur}),b("click",{onElement:this.element,matchingSelector:"a[contenteditable=false]",preventDefault:!0}),b("mousedown",{onElement:this.element,matchingSelector:e,withCallback:this.didClickAttachment}),b("click",{onElement:this.element,matchingSelector:"a".concat(e),preventDefault:!0})}didFocus(t){var e;const i=()=>{var t,e;if(!this.focused)return this.focused=!0,null===(t=this.delegate)||void 0===t||null===(e=t.compositionControllerDidFocus)||void 0===e?void 0:e.call(t)};return(null===(e=this.blurPromise)||void 0===e?void 0:e.then(i))||i()}didBlur(t){this.blurPromise=new Promise((t=>Rt((()=>{var e,i;x(this.element)||(this.focused=null,null===(e=this.delegate)||void 0===e||null===(i=e.compositionControllerDidBlur)||void 0===i||i.call(e));return this.blurPromise=null,t()}))))}didClickAttachment(t,e){var i,n;const r=this.findAttachmentForElement(e),o=!!y(t.target,{matchingSelector:"figcaption"});return null===(i=this.delegate)||void 0===i||null===(n=i.compositionControllerDidSelectAttachment)||void 0===n?void 0:n.call(i,r,{editCaption:o})}getSerializableElement(){return this.isEditingAttachment()?this.documentView.shadowElement:this.element}render(){var t,e,i,n,r,o;(this.revision!==this.composition.revision&&(this.documentView.setDocument(this.composition.document),this.documentView.render(),this.revision=this.composition.revision),this.canSyncDocumentView()&&!this.documentView.isSynced())&&(null===(i=this.delegate)||void 0===i||null===(n=i.compositionControllerWillSyncDocumentView)||void 0===n||n.call(i),this.documentView.sync(),null===(r=this.delegate)||void 0===r||null===(o=r.compositionControllerDidSyncDocumentView)||void 0===o||o.call(r));return null===(t=this.delegate)||void 0===t||null===(e=t.compositionControllerDidRender)||void 0===e?void 0:e.call(t)}rerenderViewForObject(t){return this.invalidateViewForObject(t),this.render()}invalidateViewForObject(t){return this.documentView.invalidateViewForObject(t)}isViewCachingEnabled(){return this.documentView.isViewCachingEnabled()}enableViewCaching(){return this.documentView.enableViewCaching()}disableViewCaching(){return this.documentView.disableViewCaching()}refreshViewCache(){return this.documentView.garbageCollectCachedViews()}isEditingAttachment(){return!!this.attachmentEditor}installAttachmentEditorForAttachment(t,e){var i;if((null===(i=this.attachmentEditor)||void 0===i?void 0:i.attachment)===t)return;const n=this.documentView.findElementForObject(t);if(!n)return;this.uninstallAttachmentEditor();const r=this.composition.document.getAttachmentPieceForAttachment(t);this.attachmentEditor=new Yn(r,n,this.element,e),this.attachmentEditor.delegate=this}uninstallAttachmentEditor(){var t;return null===(t=this.attachmentEditor)||void 0===t?void 0:t.uninstall()}didUninstallAttachmentEditor(){return this.attachmentEditor=null,this.render()}attachmentEditorDidRequestUpdatingAttributesForAttachment(t,e){var i,n;return null===(i=this.delegate)||void 0===i||null===(n=i.compositionControllerWillUpdateAttachment)||void 0===n||n.call(i,e),this.composition.updateAttributesForAttachment(t,e)}attachmentEditorDidRequestRemovingAttributeForAttachment(t,e){var i,n;return null===(i=this.delegate)||void 0===i||null===(n=i.compositionControllerWillUpdateAttachment)||void 0===n||n.call(i,e),this.composition.removeAttributeForAttachment(t,e)}attachmentEditorDidRequestRemovalOfAttachment(t){var e,i;return null===(e=this.delegate)||void 0===e||null===(i=e.compositionControllerDidRequestRemovalOfAttachment)||void 0===i?void 0:i.call(e,t)}attachmentEditorDidRequestDeselectingAttachment(t){var e,i;return null===(e=this.delegate)||void 0===e||null===(i=e.compositionControllerDidRequestDeselectingAttachment)||void 0===i?void 0:i.call(e,t)}canSyncDocumentView(){return!this.isEditingAttachment()}findAttachmentForElement(t){return this.composition.document.getAttachmentById(parseInt(t.dataset.trixId,10))}}class $n extends q{}const Zn="data-trix-mutable",Qn="[".concat(Zn,"]"),tr={attributes:!0,childList:!0,characterData:!0,characterDataOldValue:!0,subtree:!0};class er extends q{constructor(t){super(t),this.didMutate=this.didMutate.bind(this),this.element=t,this.observer=new window.MutationObserver(this.didMutate),this.start()}start(){return this.reset(),this.observer.observe(this.element,tr)}stop(){return this.observer.disconnect()}didMutate(t){var e,i;if(this.mutations.push(...Array.from(this.findSignificantMutations(t)||[])),this.mutations.length)return null===(e=this.delegate)||void 0===e||null===(i=e.elementDidMutate)||void 0===i||i.call(e,this.getMutationSummary()),this.reset()}reset(){this.mutations=[]}findSignificantMutations(t){return t.filter((t=>this.mutationIsSignificant(t)))}mutationIsSignificant(t){if(this.nodeIsMutable(t.target))return!1;for(const e of Array.from(this.nodesModifiedByMutation(t)))if(this.nodeIsSignificant(e))return!0;return!1}nodeIsSignificant(t){return t!==this.element&&!this.nodeIsMutable(t)&&!M(t)}nodeIsMutable(t){return y(t,{matchingSelector:Qn})}nodesModifiedByMutation(t){const e=[];switch(t.type){case"attributes":t.attributeName!==Zn&&e.push(t.target);break;case"characterData":e.push(t.target.parentNode),e.push(t.target);break;case"childList":e.push(...Array.from(t.addedNodes||[])),e.push(...Array.from(t.removedNodes||[]))}return e}getMutationSummary(){return this.getTextMutationSummary()}getTextMutationSummary(){const{additions:t,deletions:e}=this.getTextChangesFromCharacterData(),i=this.getTextChangesFromChildList();Array.from(i.additions).forEach((e=>{Array.from(t).includes(e)||t.push(e)})),e.push(...Array.from(i.deletions||[]));const n={},r=t.join("");r&&(n.textAdded=r);const o=e.join("");return o&&(n.textDeleted=o),n}getMutationsByType(t){return Array.from(this.mutations).filter((e=>e.type===t))}getTextChangesFromChildList(){let t,e;const i=[],n=[];Array.from(this.getMutationsByType("childList")).forEach((t=>{i.push(...Array.from(t.addedNodes||[])),n.push(...Array.from(t.removedNodes||[]))}));0===i.length&&1===n.length&&I(n[0])?(t=[],e=["\n"]):(t=ir(i),e=ir(n));const r=t.filter(((t,i)=>t!==e[i])).map(Wt),o=e.filter(((e,i)=>e!==t[i])).map(Wt);return{additions:r,deletions:o}}getTextChangesFromCharacterData(){let t,e;const i=this.getMutationsByType("characterData");if(i.length){const n=i[0],r=i[i.length-1],o=function(t,e){let i,n;return t=$.box(t),(e=$.box(e)).length<t.length?[n,i]=zt(t,e):[i,n]=zt(e,t),{added:i,removed:n}}(Wt(n.oldValue),Wt(r.target.data));t=o.added,e=o.removed}return{additions:t?[t]:[],deletions:e?[e]:[]}}}const ir=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];const e=[];for(const i of Array.from(t))switch(i.nodeType){case Node.TEXT_NODE:e.push(i.data);break;case Node.ELEMENT_NODE:"br"===k(i)?e.push("\n"):e.push(...Array.from(ir(i.childNodes)||[]))}return e};class nr extends ee{constructor(t){super(...arguments),this.file=t}perform(t){const e=new FileReader;return e.onerror=()=>t(!1),e.onload=()=>{e.onerror=null;try{e.abort()}catch(t){}return t(!0,this.file)},e.readAsArrayBuffer(this.file)}}class rr{constructor(t){this.element=t}shouldIgnore(t){return!!a.samsungAndroid&&(this.previousEvent=this.event,this.event=t,this.checkSamsungKeyboardBuggyModeStart(),this.checkSamsungKeyboardBuggyModeEnd(),this.buggyMode)}checkSamsungKeyboardBuggyModeStart(){this.insertingLongTextAfterUnidentifiedChar()&&or(this.element.innerText,this.event.data)&&(this.buggyMode=!0,this.event.preventDefault())}checkSamsungKeyboardBuggyModeEnd(){this.buggyMode&&"insertText"!==this.event.inputType&&(this.buggyMode=!1)}insertingLongTextAfterUnidentifiedChar(){var t;return this.isBeforeInputInsertText()&&this.previousEventWasUnidentifiedKeydown()&&(null===(t=this.event.data)||void 0===t?void 0:t.length)>50}isBeforeInputInsertText(){return"beforeinput"===this.event.type&&"insertText"===this.event.inputType}previousEventWasUnidentifiedKeydown(){var t,e;return"keydown"===(null===(t=this.previousEvent)||void 0===t?void 0:t.type)&&"Unidentified"===(null===(e=this.previousEvent)||void 0===e?void 0:e.key)}}const or=(t,e)=>ar(t)===ar(e),sr=new RegExp("(".concat("￼","|").concat(d,"|").concat(g,"|\\s)+"),"g"),ar=t=>t.replace(sr," ").trim();class lr extends q{constructor(t){super(...arguments),this.element=t,this.mutationObserver=new er(this.element),this.mutationObserver.delegate=this,this.flakyKeyboardDetector=new rr(this.element);for(const t in this.constructor.events)b(t,{onElement:this.element,withCallback:this.handlerFor(t)})}elementDidMutate(t){}editorWillSyncDocumentView(){return this.mutationObserver.stop()}editorDidSyncDocumentView(){return this.mutationObserver.start()}requestRender(){var t,e;return null===(t=this.delegate)||void 0===t||null===(e=t.inputControllerDidRequestRender)||void 0===e?void 0:e.call(t)}requestReparse(){var t,e;return null===(t=this.delegate)||void 0===t||null===(e=t.inputControllerDidRequestReparse)||void 0===e||e.call(t),this.requestRender()}attachFiles(t){const e=Array.from(t).map((t=>new nr(t)));return Promise.all(e).then((t=>{this.handleInput((function(){var e,i;return null===(e=this.delegate)||void 0===e||e.inputControllerWillAttachFiles(),null===(i=this.responder)||void 0===i||i.insertFiles(t),this.requestRender()}))}))}handlerFor(t){return e=>{e.defaultPrevented||this.handleInput((()=>{if(!x(this.element)){if(this.flakyKeyboardDetector.shouldIgnore(e))return;this.eventName=t,this.constructor.events[t].call(this,e)}}))}}handleInput(t){try{var e;null===(e=this.delegate)||void 0===e||e.inputControllerWillHandleInput(),t.call(this)}finally{var i;null===(i=this.delegate)||void 0===i||i.inputControllerDidHandleInput()}}createLinkHTML(t,e){const i=document.createElement("a");return i.href=t,i.textContent=e||t,i.outerHTML}}var cr;Di(lr,"events",{});const{browser:ur,keyNames:hr}=z;let dr=0;class gr extends lr{constructor(){super(...arguments),this.resetInputSummary()}setInputSummary(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.inputSummary.eventName=this.eventName;for(const e in t){const i=t[e];this.inputSummary[e]=i}return this.inputSummary}resetInputSummary(){this.inputSummary={}}reset(){return this.resetInputSummary(),Ft.reset()}elementDidMutate(t){var e,i;return this.isComposing()?null===(e=this.delegate)||void 0===e||null===(i=e.inputControllerDidAllowUnhandledInput)||void 0===i?void 0:i.call(e):this.handleInput((function(){return this.mutationIsSignificant(t)&&(this.mutationIsExpected(t)?this.requestRender():this.requestReparse()),this.reset()}))}mutationIsExpected(t){let{textAdded:e,textDeleted:i}=t;if(this.inputSummary.preferDocument)return!0;const n=null!=e?e===this.inputSummary.textAdded:!this.inputSummary.textAdded,r=null!=i?this.inputSummary.didDelete:!this.inputSummary.didDelete,o=["\n"," \n"].includes(e)&&!n,s="\n"===i&&!r;if(o&&!s||s&&!o){const t=this.getSelectedRange();if(t){var a;const i=o?e.replace(/\n$/,"").length||-1:(null==e?void 0:e.length)||1;if(null!==(a=this.responder)&&void 0!==a&&a.positionIsBlockBreak(t[1]+i))return!0}}return n&&r}mutationIsSignificant(t){var e;const i=Object.keys(t).length>0,n=""===(null===(e=this.compositionInput)||void 0===e?void 0:e.getEndData());return i||!n}getCompositionInput(){if(this.isComposing())return this.compositionInput;this.compositionInput=new vr(this)}isComposing(){return this.compositionInput&&!this.compositionInput.isEnded()}deleteInDirection(t,e){var i;return!1!==(null===(i=this.responder)||void 0===i?void 0:i.deleteInDirection(t))?this.setInputSummary({didDelete:!0}):e?(e.preventDefault(),this.requestRender()):void 0}serializeSelectionToDataTransfer(t){var e;if(!function(t){if(null==t||!t.setData)return!1;for(const e in Ct){const i=Ct[e];try{if(t.setData(e,i),!t.getData(e)===i)return!1}catch(t){return!1}}return!0}(t))return;const i=null===(e=this.responder)||void 0===e?void 0:e.getSelectedDocument().toSerializableDocument();return t.setData("application/x-trix-document",JSON.stringify(i)),t.setData("text/html",Si.render(i).innerHTML),t.setData("text/plain",i.toString().replace(/\n$/,"")),!0}canAcceptDataTransfer(t){const e={};return Array.from((null==t?void 0:t.types)||[]).forEach((t=>{e[t]=!0})),e.Files||e["application/x-trix-document"]||e["text/html"]||e["text/plain"]}getPastedHTMLUsingHiddenElement(t){const e=this.getSelectedRange(),i={position:"absolute",left:"".concat(window.pageXOffset,"px"),top:"".concat(window.pageYOffset,"px"),opacity:0},n=T({style:i,tagName:"div",editable:!0});return document.body.appendChild(n),n.focus(),requestAnimationFrame((()=>{const i=n.innerHTML;return S(n),this.setSelectedRange(e),t(i)}))}}Di(gr,"events",{keydown(t){this.isComposing()||this.resetInputSummary(),this.inputSummary.didInput=!0;const e=hr[t.keyCode];if(e){var i;let n=this.keys;["ctrl","alt","shift","meta"].forEach((e=>{var i;t["".concat(e,"Key")]&&("ctrl"===e&&(e="control"),n=null===(i=n)||void 0===i?void 0:i[e])})),null!=(null===(i=n)||void 0===i?void 0:i[e])&&(this.setInputSummary({keyName:e}),Ft.reset(),n[e].call(this,t))}if(St(t)){const e=String.fromCharCode(t.keyCode).toLowerCase();if(e){var n;const i=["alt","shift"].map((e=>{if(t["".concat(e,"Key")])return e})).filter((t=>t));i.push(e),null!==(n=this.delegate)&&void 0!==n&&n.inputControllerDidReceiveKeyboardCommand(i)&&t.preventDefault()}}},keypress(t){if(null!=this.inputSummary.eventName)return;if(t.metaKey)return;if(t.ctrlKey&&!t.altKey)return;const e=fr(t);var i,n;return e?(null===(i=this.delegate)||void 0===i||i.inputControllerWillPerformTyping(),null===(n=this.responder)||void 0===n||n.insertString(e),this.setInputSummary({textAdded:e,didDelete:this.selectionIsExpanded()})):void 0},textInput(t){const{data:e}=t,{textAdded:i}=this.inputSummary;if(i&&i!==e&&i.toUpperCase()===e){var n;const t=this.getSelectedRange();return this.setSelectedRange([t[0],t[1]+i.length]),null===(n=this.responder)||void 0===n||n.insertString(e),this.setInputSummary({textAdded:e}),this.setSelectedRange(t)}},dragenter(t){t.preventDefault()},dragstart(t){var e,i;return this.serializeSelectionToDataTransfer(t.dataTransfer),this.draggedRange=this.getSelectedRange(),null===(e=this.delegate)||void 0===e||null===(i=e.inputControllerDidStartDrag)||void 0===i?void 0:i.call(e)},dragover(t){if(this.draggedRange||this.canAcceptDataTransfer(t.dataTransfer)){t.preventDefault();const n={x:t.clientX,y:t.clientY};var e,i;if(!Tt(n,this.draggingPoint))return this.draggingPoint=n,null===(e=this.delegate)||void 0===e||null===(i=e.inputControllerDidReceiveDragOverPoint)||void 0===i?void 0:i.call(e,this.draggingPoint)}},dragend(t){var e,i;null===(e=this.delegate)||void 0===e||null===(i=e.inputControllerDidCancelDrag)||void 0===i||i.call(e),this.draggedRange=null,this.draggingPoint=null},drop(t){var e,i;t.preventDefault();const n=null===(e=t.dataTransfer)||void 0===e?void 0:e.files,r=t.dataTransfer.getData("application/x-trix-document"),o={x:t.clientX,y:t.clientY};if(null===(i=this.responder)||void 0===i||i.setLocationRangeFromPointRange(o),null!=n&&n.length)this.attachFiles(n);else if(this.draggedRange){var s,a;null===(s=this.delegate)||void 0===s||s.inputControllerWillMoveText(),null===(a=this.responder)||void 0===a||a.moveTextFromRange(this.draggedRange),this.draggedRange=null,this.requestRender()}else if(r){var l;const t=an.fromJSONString(r);null===(l=this.responder)||void 0===l||l.insertDocument(t),this.requestRender()}this.draggedRange=null,this.draggingPoint=null},cut(t){var e,i;if(null!==(e=this.responder)&&void 0!==e&&e.selectionIsExpanded()&&(this.serializeSelectionToDataTransfer(t.clipboardData)&&t.preventDefault(),null===(i=this.delegate)||void 0===i||i.inputControllerWillCutText(),this.deleteInDirection("backward"),t.defaultPrevented))return this.requestRender()},copy(t){var e;null!==(e=this.responder)&&void 0!==e&&e.selectionIsExpanded()&&this.serializeSelectionToDataTransfer(t.clipboardData)&&t.preventDefault()},paste(t){const e=t.clipboardData||t.testClipboardData,i={clipboard:e};if(!e||br(t))return void this.getPastedHTMLUsingHiddenElement((t=>{var e,n,r;return i.type="text/html",i.html=t,null===(e=this.delegate)||void 0===e||e.inputControllerWillPaste(i),null===(n=this.responder)||void 0===n||n.insertHTML(i.html),this.requestRender(),null===(r=this.delegate)||void 0===r?void 0:r.inputControllerDidPaste(i)}));const n=e.getData("URL"),r=e.getData("text/html"),o=e.getData("public.url-name");if(n){var s,a,l;let t;i.type="text/html",t=o?Vt(o).trim():n,i.html=this.createLinkHTML(n,t),null===(s=this.delegate)||void 0===s||s.inputControllerWillPaste(i),this.setInputSummary({textAdded:t,didDelete:this.selectionIsExpanded()}),null===(a=this.responder)||void 0===a||a.insertHTML(i.html),this.requestRender(),null===(l=this.delegate)||void 0===l||l.inputControllerDidPaste(i)}else if(Et(e)){var c,u,h;i.type="text/plain",i.string=e.getData("text/plain"),null===(c=this.delegate)||void 0===c||c.inputControllerWillPaste(i),this.setInputSummary({textAdded:i.string,didDelete:this.selectionIsExpanded()}),null===(u=this.responder)||void 0===u||u.insertString(i.string),this.requestRender(),null===(h=this.delegate)||void 0===h||h.inputControllerDidPaste(i)}else if(r){var d,g,m;i.type="text/html",i.html=r,null===(d=this.delegate)||void 0===d||d.inputControllerWillPaste(i),null===(g=this.responder)||void 0===g||g.insertHTML(i.html),this.requestRender(),null===(m=this.delegate)||void 0===m||m.inputControllerDidPaste(i)}else if(Array.from(e.types).includes("Files")){var p,f;const t=null===(p=e.items)||void 0===p||null===(p=p[0])||void 0===p||null===(f=p.getAsFile)||void 0===f?void 0:f.call(p);if(t){var b,v,A;const e=mr(t);!t.name&&e&&(t.name="pasted-file-".concat(++dr,".").concat(e)),i.type="File",i.file=t,null===(b=this.delegate)||void 0===b||b.inputControllerWillAttachFiles(),null===(v=this.responder)||void 0===v||v.insertFile(i.file),this.requestRender(),null===(A=this.delegate)||void 0===A||A.inputControllerDidPaste(i)}}t.preventDefault()},compositionstart(t){return this.getCompositionInput().start(t.data)},compositionupdate(t){return this.getCompositionInput().update(t.data)},compositionend(t){return this.getCompositionInput().end(t.data)},beforeinput(t){this.inputSummary.didInput=!0},input(t){return this.inputSummary.didInput=!0,t.stopPropagation()}}),Di(gr,"keys",{backspace(t){var e;return null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformTyping(),this.deleteInDirection("backward",t)},delete(t){var e;return null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformTyping(),this.deleteInDirection("forward",t)},return(t){var e,i;return this.setInputSummary({preferDocument:!0}),null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformTyping(),null===(i=this.responder)||void 0===i?void 0:i.insertLineBreak()},tab(t){var e,i;null!==(e=this.responder)&&void 0!==e&&e.canIncreaseNestingLevel()&&(null===(i=this.responder)||void 0===i||i.increaseNestingLevel(),this.requestRender(),t.preventDefault())},left(t){var e;if(this.selectionIsInCursorTarget())return t.preventDefault(),null===(e=this.responder)||void 0===e?void 0:e.moveCursorInDirection("backward")},right(t){var e;if(this.selectionIsInCursorTarget())return t.preventDefault(),null===(e=this.responder)||void 0===e?void 0:e.moveCursorInDirection("forward")},control:{d(t){var e;return null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformTyping(),this.deleteInDirection("forward",t)},h(t){var e;return null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformTyping(),this.deleteInDirection("backward",t)},o(t){var e,i;return t.preventDefault(),null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformTyping(),null===(i=this.responder)||void 0===i||i.insertString("\n",{updatePosition:!1}),this.requestRender()}},shift:{return(t){var e,i;null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformTyping(),null===(i=this.responder)||void 0===i||i.insertString("\n"),this.requestRender(),t.preventDefault()},tab(t){var e,i;null!==(e=this.responder)&&void 0!==e&&e.canDecreaseNestingLevel()&&(null===(i=this.responder)||void 0===i||i.decreaseNestingLevel(),this.requestRender(),t.preventDefault())},left(t){if(this.selectionIsInCursorTarget())return t.preventDefault(),this.expandSelectionInDirection("backward")},right(t){if(this.selectionIsInCursorTarget())return t.preventDefault(),this.expandSelectionInDirection("forward")}},alt:{backspace(t){var e;return this.setInputSummary({preferDocument:!1}),null===(e=this.delegate)||void 0===e?void 0:e.inputControllerWillPerformTyping()}},meta:{backspace(t){var e;return this.setInputSummary({preferDocument:!1}),null===(e=this.delegate)||void 0===e?void 0:e.inputControllerWillPerformTyping()}}}),gr.proxyMethod("responder?.getSelectedRange"),gr.proxyMethod("responder?.setSelectedRange"),gr.proxyMethod("responder?.expandSelectionInDirection"),gr.proxyMethod("responder?.selectionIsInCursorTarget"),gr.proxyMethod("responder?.selectionIsExpanded");const mr=t=>{var e;return null===(e=t.type)||void 0===e||null===(e=e.match(/\/(\w+)$/))||void 0===e?void 0:e[1]},pr=!(null===(cr=" ".codePointAt)||void 0===cr||!cr.call(" ",0)),fr=function(t){if(t.key&&pr&&t.key.codePointAt(0)===t.keyCode)return t.key;{let e;if(null===t.which?e=t.keyCode:0!==t.which&&0!==t.charCode&&(e=t.charCode),null!=e&&"escape"!==hr[e])return $.fromCodepoints([e]).toString()}},br=function(t){const e=t.clipboardData;if(e){if(e.types.includes("text/html")){for(const t of e.types){const i=/^CorePasteboardFlavorType/.test(t),n=/^dyn\./.test(t)&&e.getData(t);if(i||n)return!0}return!1}{const t=e.types.includes("com.apple.webarchive"),i=e.types.includes("com.apple.flat-rtfd");return t||i}}};class vr extends q{constructor(t){super(...arguments),this.inputController=t,this.responder=this.inputController.responder,this.delegate=this.inputController.delegate,this.inputSummary=this.inputController.inputSummary,this.data={}}start(t){if(this.data.start=t,this.isSignificant()){var e,i;if("keypress"===this.inputSummary.eventName&&this.inputSummary.textAdded)null===(i=this.responder)||void 0===i||i.deleteInDirection("left");this.selectionIsExpanded()||(this.insertPlaceholder(),this.requestRender()),this.range=null===(e=this.responder)||void 0===e?void 0:e.getSelectedRange()}}update(t){if(this.data.update=t,this.isSignificant()){const t=this.selectPlaceholder();t&&(this.forgetPlaceholder(),this.range=t)}}end(t){return this.data.end=t,this.isSignificant()?(this.forgetPlaceholder(),this.canApplyToDocument()?(this.setInputSummary({preferDocument:!0,didInput:!1}),null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformTyping(),null===(i=this.responder)||void 0===i||i.setSelectedRange(this.range),null===(n=this.responder)||void 0===n||n.insertString(this.data.end),null===(r=this.responder)||void 0===r?void 0:r.setSelectedRange(this.range[0]+this.data.end.length)):null!=this.data.start||null!=this.data.update?(this.requestReparse(),this.inputController.reset()):void 0):this.inputController.reset();// removed by dead control flow
{ var e, i, n, r; }}getEndData(){return this.data.end}isEnded(){return null!=this.getEndData()}isSignificant(){return!ur.composesExistingText||this.inputSummary.didInput}canApplyToDocument(){var t,e;return 0===(null===(t=this.data.start)||void 0===t?void 0:t.length)&&(null===(e=this.data.end)||void 0===e?void 0:e.length)>0&&this.range}}vr.proxyMethod("inputController.setInputSummary"),vr.proxyMethod("inputController.requestRender"),vr.proxyMethod("inputController.requestReparse"),vr.proxyMethod("responder?.selectionIsExpanded"),vr.proxyMethod("responder?.insertPlaceholder"),vr.proxyMethod("responder?.selectPlaceholder"),vr.proxyMethod("responder?.forgetPlaceholder");class Ar extends lr{constructor(){super(...arguments),this.render=this.render.bind(this)}elementDidMutate(){return this.scheduledRender?this.composing?null===(t=this.delegate)||void 0===t||null===(e=t.inputControllerDidAllowUnhandledInput)||void 0===e?void 0:e.call(t):void 0:this.reparse();// removed by dead control flow
{ var t, e; }}scheduleRender(){return this.scheduledRender?this.scheduledRender:this.scheduledRender=requestAnimationFrame(this.render)}render(){var t,e;(cancelAnimationFrame(this.scheduledRender),this.scheduledRender=null,this.composing)||(null===(e=this.delegate)||void 0===e||e.render());null===(t=this.afterRender)||void 0===t||t.call(this),this.afterRender=null}reparse(){var t;return null===(t=this.delegate)||void 0===t?void 0:t.reparse()}insertString(){var t;let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",i=arguments.length>1?arguments[1]:void 0;return null===(t=this.delegate)||void 0===t||t.inputControllerWillPerformTyping(),this.withTargetDOMRange((function(){var t;return null===(t=this.responder)||void 0===t?void 0:t.insertString(e,i)}))}toggleAttributeIfSupported(t){var e;if(gt().includes(t))return null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformFormatting(t),this.withTargetDOMRange((function(){var e;return null===(e=this.responder)||void 0===e?void 0:e.toggleCurrentAttribute(t)}))}activateAttributeIfSupported(t,e){var i;if(gt().includes(t))return null===(i=this.delegate)||void 0===i||i.inputControllerWillPerformFormatting(t),this.withTargetDOMRange((function(){var i;return null===(i=this.responder)||void 0===i?void 0:i.setCurrentAttribute(t,e)}))}deleteInDirection(t){let{recordUndoEntry:e}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{recordUndoEntry:!0};var i;e&&(null===(i=this.delegate)||void 0===i||i.inputControllerWillPerformTyping());const n=()=>{var e;return null===(e=this.responder)||void 0===e?void 0:e.deleteInDirection(t)},r=this.getTargetDOMRange({minLength:this.composing?1:2});return r?this.withTargetDOMRange(r,n):n()}withTargetDOMRange(t,e){var i;return"function"==typeof t&&(e=t,t=this.getTargetDOMRange()),t?null===(i=this.responder)||void 0===i?void 0:i.withTargetDOMRange(t,e.bind(this)):(Ft.reset(),e.call(this))}getTargetDOMRange(){var t,e;let{minLength:i}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{minLength:0};const n=null===(t=(e=this.event).getTargetRanges)||void 0===t?void 0:t.call(e);if(n&&n.length){const t=yr(n[0]);if(0===i||t.toString().length>=i)return t}}withEvent(t,e){let i;this.event=t;try{i=e.call(this)}finally{this.event=null}return i}}Di(Ar,"events",{keydown(t){if(St(t)){var e;const i=Rr(t);null!==(e=this.delegate)&&void 0!==e&&e.inputControllerDidReceiveKeyboardCommand(i)&&t.preventDefault()}else{let e=t.key;t.altKey&&(e+="+Alt"),t.shiftKey&&(e+="+Shift");const i=this.constructor.keys[e];if(i)return this.withEvent(t,i)}},paste(t){var e;let i;const n=null===(e=t.clipboardData)||void 0===e?void 0:e.getData("URL");return Er(t)?(t.preventDefault(),this.attachFiles(t.clipboardData.files)):Sr(t)?(t.preventDefault(),i={type:"text/plain",string:t.clipboardData.getData("text/plain")},null===(r=this.delegate)||void 0===r||r.inputControllerWillPaste(i),null===(o=this.responder)||void 0===o||o.insertString(i.string),this.render(),null===(s=this.delegate)||void 0===s?void 0:s.inputControllerDidPaste(i)):n?(t.preventDefault(),i={type:"text/html",html:this.createLinkHTML(n)},null===(a=this.delegate)||void 0===a||a.inputControllerWillPaste(i),null===(l=this.responder)||void 0===l||l.insertHTML(i.html),this.render(),null===(c=this.delegate)||void 0===c?void 0:c.inputControllerDidPaste(i)):void 0;// removed by dead control flow
{ var r, o, s, a, l, c; }},beforeinput(t){const e=this.constructor.inputTypes[t.inputType],i=(n=t,!(!/iPhone|iPad/.test(navigator.userAgent)||n.inputType&&"insertParagraph"!==n.inputType));var n;e&&(this.withEvent(t,e),i||this.scheduleRender()),i&&this.render()},input(t){Ft.reset()},dragstart(t){var e,i;null!==(e=this.responder)&&void 0!==e&&e.selectionContainsAttachments()&&(t.dataTransfer.setData("application/x-trix-dragging",!0),this.dragging={range:null===(i=this.responder)||void 0===i?void 0:i.getSelectedRange(),point:kr(t)})},dragenter(t){xr(t)&&t.preventDefault()},dragover(t){if(this.dragging){t.preventDefault();const i=kr(t);var e;if(!Tt(i,this.dragging.point))return this.dragging.point=i,null===(e=this.responder)||void 0===e?void 0:e.setLocationRangeFromPointRange(i)}else xr(t)&&t.preventDefault()},drop(t){var e,i;if(this.dragging)return t.preventDefault(),null===(e=this.delegate)||void 0===e||e.inputControllerWillMoveText(),null===(i=this.responder)||void 0===i||i.moveTextFromRange(this.dragging.range),this.dragging=null,this.scheduleRender();if(xr(t)){var n;t.preventDefault();const e=kr(t);return null===(n=this.responder)||void 0===n||n.setLocationRangeFromPointRange(e),this.attachFiles(t.dataTransfer.files)}},dragend(){var t;this.dragging&&(null===(t=this.responder)||void 0===t||t.setSelectedRange(this.dragging.range),this.dragging=null)},compositionend(t){this.composing&&(this.composing=!1,a.recentAndroid||this.scheduleRender())}}),Di(Ar,"keys",{ArrowLeft(){var t,e;if(null!==(t=this.responder)&&void 0!==t&&t.shouldManageMovingCursorInDirection("backward"))return this.event.preventDefault(),null===(e=this.responder)||void 0===e?void 0:e.moveCursorInDirection("backward")},ArrowRight(){var t,e;if(null!==(t=this.responder)&&void 0!==t&&t.shouldManageMovingCursorInDirection("forward"))return this.event.preventDefault(),null===(e=this.responder)||void 0===e?void 0:e.moveCursorInDirection("forward")},Backspace(){var t,e,i;if(null!==(t=this.responder)&&void 0!==t&&t.shouldManageDeletingInDirection("backward"))return this.event.preventDefault(),null===(e=this.delegate)||void 0===e||e.inputControllerWillPerformTyping(),null===(i=this.responder)||void 0===i||i.deleteInDirection("backward"),this.render()},Tab(){var t,e;if(null!==(t=this.responder)&&void 0!==t&&t.canIncreaseNestingLevel())return this.event.preventDefault(),null===(e=this.responder)||void 0===e||e.increaseNestingLevel(),this.render()},"Tab+Shift"(){var t,e;if(null!==(t=this.responder)&&void 0!==t&&t.canDecreaseNestingLevel())return this.event.preventDefault(),null===(e=this.responder)||void 0===e||e.decreaseNestingLevel(),this.render()}}),Di(Ar,"inputTypes",{deleteByComposition(){return this.deleteInDirection("backward",{recordUndoEntry:!1})},deleteByCut(){return this.deleteInDirection("backward")},deleteByDrag(){return this.event.preventDefault(),this.withTargetDOMRange((function(){var t;this.deleteByDragRange=null===(t=this.responder)||void 0===t?void 0:t.getSelectedRange()}))},deleteCompositionText(){return this.deleteInDirection("backward",{recordUndoEntry:!1})},deleteContent(){return this.deleteInDirection("backward")},deleteContentBackward(){return this.deleteInDirection("backward")},deleteContentForward(){return this.deleteInDirection("forward")},deleteEntireSoftLine(){return this.deleteInDirection("forward")},deleteHardLineBackward(){return this.deleteInDirection("backward")},deleteHardLineForward(){return this.deleteInDirection("forward")},deleteSoftLineBackward(){return this.deleteInDirection("backward")},deleteSoftLineForward(){return this.deleteInDirection("forward")},deleteWordBackward(){return this.deleteInDirection("backward")},deleteWordForward(){return this.deleteInDirection("forward")},formatBackColor(){return this.activateAttributeIfSupported("backgroundColor",this.event.data)},formatBold(){return this.toggleAttributeIfSupported("bold")},formatFontColor(){return this.activateAttributeIfSupported("color",this.event.data)},formatFontName(){return this.activateAttributeIfSupported("font",this.event.data)},formatIndent(){var t;if(null!==(t=this.responder)&&void 0!==t&&t.canIncreaseNestingLevel())return this.withTargetDOMRange((function(){var t;return null===(t=this.responder)||void 0===t?void 0:t.increaseNestingLevel()}))},formatItalic(){return this.toggleAttributeIfSupported("italic")},formatJustifyCenter(){return this.toggleAttributeIfSupported("justifyCenter")},formatJustifyFull(){return this.toggleAttributeIfSupported("justifyFull")},formatJustifyLeft(){return this.toggleAttributeIfSupported("justifyLeft")},formatJustifyRight(){return this.toggleAttributeIfSupported("justifyRight")},formatOutdent(){var t;if(null!==(t=this.responder)&&void 0!==t&&t.canDecreaseNestingLevel())return this.withTargetDOMRange((function(){var t;return null===(t=this.responder)||void 0===t?void 0:t.decreaseNestingLevel()}))},formatRemove(){this.withTargetDOMRange((function(){for(const i in null===(t=this.responder)||void 0===t?void 0:t.getCurrentAttributes()){var t,e;null===(e=this.responder)||void 0===e||e.removeCurrentAttribute(i)}}))},formatSetBlockTextDirection(){return this.activateAttributeIfSupported("blockDir",this.event.data)},formatSetInlineTextDirection(){return this.activateAttributeIfSupported("textDir",this.event.data)},formatStrikeThrough(){return this.toggleAttributeIfSupported("strike")},formatSubscript(){return this.toggleAttributeIfSupported("sub")},formatSuperscript(){return this.toggleAttributeIfSupported("sup")},formatUnderline(){return this.toggleAttributeIfSupported("underline")},historyRedo(){var t;return null===(t=this.delegate)||void 0===t?void 0:t.inputControllerWillPerformRedo()},historyUndo(){var t;return null===(t=this.delegate)||void 0===t?void 0:t.inputControllerWillPerformUndo()},insertCompositionText(){return this.composing=!0,this.insertString(this.event.data)},insertFromComposition(){return this.composing=!1,this.insertString(this.event.data)},insertFromDrop(){const t=this.deleteByDragRange;var e;if(t)return this.deleteByDragRange=null,null===(e=this.delegate)||void 0===e||e.inputControllerWillMoveText(),this.withTargetDOMRange((function(){var e;return null===(e=this.responder)||void 0===e?void 0:e.moveTextFromRange(t)}))},insertFromPaste(){const{dataTransfer:t}=this.event,e={dataTransfer:t},i=t.getData("URL"),n=t.getData("text/html");if(i){var r;let n;this.event.preventDefault(),e.type="text/html";const o=t.getData("public.url-name");n=o?Vt(o).trim():i,e.html=this.createLinkHTML(i,n),null===(r=this.delegate)||void 0===r||r.inputControllerWillPaste(e),this.withTargetDOMRange((function(){var t;return null===(t=this.responder)||void 0===t?void 0:t.insertHTML(e.html)})),this.afterRender=()=>{var t;return null===(t=this.delegate)||void 0===t?void 0:t.inputControllerDidPaste(e)}}else if(Et(t)){var o;e.type="text/plain",e.string=t.getData("text/plain"),null===(o=this.delegate)||void 0===o||o.inputControllerWillPaste(e),this.withTargetDOMRange((function(){var t;return null===(t=this.responder)||void 0===t?void 0:t.insertString(e.string)})),this.afterRender=()=>{var t;return null===(t=this.delegate)||void 0===t?void 0:t.inputControllerDidPaste(e)}}else if(Cr(this.event)){var s;e.type="File",e.file=t.files[0],null===(s=this.delegate)||void 0===s||s.inputControllerWillPaste(e),this.withTargetDOMRange((function(){var t;return null===(t=this.responder)||void 0===t?void 0:t.insertFile(e.file)})),this.afterRender=()=>{var t;return null===(t=this.delegate)||void 0===t?void 0:t.inputControllerDidPaste(e)}}else if(n){var a;this.event.preventDefault(),e.type="text/html",e.html=n,null===(a=this.delegate)||void 0===a||a.inputControllerWillPaste(e),this.withTargetDOMRange((function(){var t;return null===(t=this.responder)||void 0===t?void 0:t.insertHTML(e.html)})),this.afterRender=()=>{var t;return null===(t=this.delegate)||void 0===t?void 0:t.inputControllerDidPaste(e)}}},insertFromYank(){return this.insertString(this.event.data)},insertLineBreak(){return this.insertString("\n")},insertLink(){return this.activateAttributeIfSupported("href",this.event.data)},insertOrderedList(){return this.toggleAttributeIfSupported("number")},insertParagraph(){var t;return null===(t=this.delegate)||void 0===t||t.inputControllerWillPerformTyping(),this.withTargetDOMRange((function(){var t;return null===(t=this.responder)||void 0===t?void 0:t.insertLineBreak()}))},insertReplacementText(){const t=this.event.dataTransfer.getData("text/plain"),e=this.event.getTargetRanges()[0];this.withTargetDOMRange(e,(()=>{this.insertString(t,{updatePosition:!1})}))},insertText(){var t;return this.insertString(this.event.data||(null===(t=this.event.dataTransfer)||void 0===t?void 0:t.getData("text/plain")))},insertTranspose(){return this.insertString(this.event.data)},insertUnorderedList(){return this.toggleAttributeIfSupported("bullet")}});const yr=function(t){const e=document.createRange();return e.setStart(t.startContainer,t.startOffset),e.setEnd(t.endContainer,t.endOffset),e},xr=t=>{var e;return Array.from((null===(e=t.dataTransfer)||void 0===e?void 0:e.types)||[]).includes("Files")},Cr=t=>{var e;return(null===(e=t.dataTransfer.files)||void 0===e?void 0:e[0])&&!Er(t)&&!(t=>{let{dataTransfer:e}=t;return e.types.includes("Files")&&e.types.includes("text/html")&&e.getData("text/html").includes("urn:schemas-microsoft-com:office:office")})(t)},Er=function(t){const e=t.clipboardData;if(e){return Array.from(e.types).filter((t=>t.match(/file/i))).length===e.types.length&&e.files.length>=1}},Sr=function(t){const e=t.clipboardData;if(e)return e.types.includes("text/plain")&&1===e.types.length},Rr=function(t){const e=[];return t.altKey&&e.push("alt"),t.shiftKey&&e.push("shift"),e.push(t.key),e},kr=t=>({x:t.clientX,y:t.clientY}),Tr="[data-trix-attribute]",wr="[data-trix-action]",Lr="".concat(Tr,", ").concat(wr),Dr="[data-trix-dialog]",Nr="".concat(Dr,"[data-trix-active]"),Ir="".concat(Dr," [data-trix-method]"),Or="".concat(Dr," [data-trix-input]"),Fr=(t,e)=>(e||(e=Mr(t)),t.querySelector("[data-trix-input][name='".concat(e,"']"))),Pr=t=>t.getAttribute("data-trix-action"),Mr=t=>t.getAttribute("data-trix-attribute")||t.getAttribute("data-trix-dialog-attribute");class Br extends q{constructor(t){super(t),this.didClickActionButton=this.didClickActionButton.bind(this),this.didClickAttributeButton=this.didClickAttributeButton.bind(this),this.didClickDialogButton=this.didClickDialogButton.bind(this),this.didKeyDownDialogInput=this.didKeyDownDialogInput.bind(this),this.element=t,this.attributes={},this.actions={},this.resetDialogInputs(),b("mousedown",{onElement:this.element,matchingSelector:wr,withCallback:this.didClickActionButton}),b("mousedown",{onElement:this.element,matchingSelector:Tr,withCallback:this.didClickAttributeButton}),b("click",{onElement:this.element,matchingSelector:Lr,preventDefault:!0}),b("click",{onElement:this.element,matchingSelector:Ir,withCallback:this.didClickDialogButton}),b("keydown",{onElement:this.element,matchingSelector:Or,withCallback:this.didKeyDownDialogInput})}didClickActionButton(t,e){var i;null===(i=this.delegate)||void 0===i||i.toolbarDidClickButton(),t.preventDefault();const n=Pr(e);return this.getDialog(n)?this.toggleDialog(n):null===(r=this.delegate)||void 0===r?void 0:r.toolbarDidInvokeAction(n,e);// removed by dead control flow
{ var r; }}didClickAttributeButton(t,e){var i;null===(i=this.delegate)||void 0===i||i.toolbarDidClickButton(),t.preventDefault();const n=Mr(e);var r;this.getDialog(n)?this.toggleDialog(n):null===(r=this.delegate)||void 0===r||r.toolbarDidToggleAttribute(n);return this.refreshAttributeButtons()}didClickDialogButton(t,e){const i=y(e,{matchingSelector:Dr});return this[e.getAttribute("data-trix-method")].call(this,i)}didKeyDownDialogInput(t,e){if(13===t.keyCode){t.preventDefault();const i=e.getAttribute("name"),n=this.getDialog(i);this.setAttribute(n)}if(27===t.keyCode)return t.preventDefault(),this.hideDialog()}updateActions(t){return this.actions=t,this.refreshActionButtons()}refreshActionButtons(){return this.eachActionButton(((t,e)=>{t.disabled=!1===this.actions[e]}))}eachActionButton(t){return Array.from(this.element.querySelectorAll(wr)).map((e=>t(e,Pr(e))))}updateAttributes(t){return this.attributes=t,this.refreshAttributeButtons()}refreshAttributeButtons(){return this.eachAttributeButton(((t,e)=>(t.disabled=!1===this.attributes[e],this.attributes[e]||this.dialogIsVisible(e)?(t.setAttribute("data-trix-active",""),t.classList.add("trix-active")):(t.removeAttribute("data-trix-active"),t.classList.remove("trix-active")))))}eachAttributeButton(t){return Array.from(this.element.querySelectorAll(Tr)).map((e=>t(e,Mr(e))))}applyKeyboardCommand(t){const e=JSON.stringify(t.sort());for(const t of Array.from(this.element.querySelectorAll("[data-trix-key]"))){const i=t.getAttribute("data-trix-key").split("+");if(JSON.stringify(i.sort())===e)return v("mousedown",{onElement:t}),!0}return!1}dialogIsVisible(t){const e=this.getDialog(t);if(e)return e.hasAttribute("data-trix-active")}toggleDialog(t){return this.dialogIsVisible(t)?this.hideDialog():this.showDialog(t)}showDialog(t){var e,i;this.hideDialog(),null===(e=this.delegate)||void 0===e||e.toolbarWillShowDialog();const n=this.getDialog(t);n.setAttribute("data-trix-active",""),n.classList.add("trix-active"),Array.from(n.querySelectorAll("input[disabled]")).forEach((t=>{t.removeAttribute("disabled")}));const r=Mr(n);if(r){const e=Fr(n,t);e&&(e.value=this.attributes[r]||"",e.select())}return null===(i=this.delegate)||void 0===i?void 0:i.toolbarDidShowDialog(t)}setAttribute(t){var e;const i=Mr(t),n=Fr(t,i);return!n.willValidate||(n.setCustomValidity(""),n.checkValidity()&&this.isSafeAttribute(n))?(null===(e=this.delegate)||void 0===e||e.toolbarDidUpdateAttribute(i,n.value),this.hideDialog()):(n.setCustomValidity("Invalid value"),n.setAttribute("data-trix-validate",""),n.classList.add("trix-validate"),n.focus())}isSafeAttribute(t){return!t.hasAttribute("data-trix-validate-href")||li.isValidAttribute("a","href",t.value)}removeAttribute(t){var e;const i=Mr(t);return null===(e=this.delegate)||void 0===e||e.toolbarDidRemoveAttribute(i),this.hideDialog()}hideDialog(){const t=this.element.querySelector(Nr);var e;if(t)return t.removeAttribute("data-trix-active"),t.classList.remove("trix-active"),this.resetDialogInputs(),null===(e=this.delegate)||void 0===e?void 0:e.toolbarDidHideDialog((t=>t.getAttribute("data-trix-dialog"))(t))}resetDialogInputs(){Array.from(this.element.querySelectorAll(Or)).forEach((t=>{t.setAttribute("disabled","disabled"),t.removeAttribute("data-trix-validate"),t.classList.remove("trix-validate")}))}getDialog(t){return this.element.querySelector("[data-trix-dialog=".concat(t,"]"))}}class _r extends $n{constructor(t){let{editorElement:e,document:i,html:n}=t;super(...arguments),this.editorElement=e,this.selectionManager=new Vn(this.editorElement),this.selectionManager.delegate=this,this.composition=new wn,this.composition.delegate=this,this.attachmentManager=new kn(this.composition.getAttachments()),this.attachmentManager.delegate=this,this.inputController=2===_.getLevel()?new Ar(this.editorElement):new gr(this.editorElement),this.inputController.delegate=this,this.inputController.responder=this.composition,this.compositionController=new Xn(this.editorElement,this.composition),this.compositionController.delegate=this,this.toolbarController=new Br(this.editorElement.toolbarElement),this.toolbarController.delegate=this,this.editor=new Pn(this.composition,this.selectionManager,this.editorElement),i?this.editor.loadDocument(i):this.editor.loadHTML(n)}registerSelectionManager(){return Ft.registerSelectionManager(this.selectionManager)}unregisterSelectionManager(){return Ft.unregisterSelectionManager(this.selectionManager)}render(){return this.compositionController.render()}reparse(){return this.composition.replaceHTML(this.editorElement.innerHTML)}compositionDidChangeDocument(t){if(this.notifyEditorElement("document-change"),!this.handlingInput)return this.render()}compositionDidChangeCurrentAttributes(t){return this.currentAttributes=t,this.toolbarController.updateAttributes(this.currentAttributes),this.updateCurrentActions(),this.notifyEditorElement("attributes-change",{attributes:this.currentAttributes})}compositionDidPerformInsertionAtRange(t){this.pasting&&(this.pastedRange=t)}compositionShouldAcceptFile(t){return this.notifyEditorElement("file-accept",{file:t})}compositionDidAddAttachment(t){const e=this.attachmentManager.manageAttachment(t);return this.notifyEditorElement("attachment-add",{attachment:e})}compositionDidEditAttachment(t){this.compositionController.rerenderViewForObject(t);const e=this.attachmentManager.manageAttachment(t);return this.notifyEditorElement("attachment-edit",{attachment:e}),this.notifyEditorElement("change")}compositionDidChangeAttachmentPreviewURL(t){return this.compositionController.invalidateViewForObject(t),this.notifyEditorElement("change")}compositionDidRemoveAttachment(t){const e=this.attachmentManager.unmanageAttachment(t);return this.notifyEditorElement("attachment-remove",{attachment:e})}compositionDidStartEditingAttachment(t,e){return this.attachmentLocationRange=this.composition.document.getLocationRangeOfAttachment(t),this.compositionController.installAttachmentEditorForAttachment(t,e),this.selectionManager.setLocationRange(this.attachmentLocationRange)}compositionDidStopEditingAttachment(t){this.compositionController.uninstallAttachmentEditor(),this.attachmentLocationRange=null}compositionDidRequestChangingSelectionToLocationRange(t){if(!this.loadingSnapshot||this.isFocused())return this.requestedLocationRange=t,this.compositionRevisionWhenLocationRangeRequested=this.composition.revision,this.handlingInput?void 0:this.render()}compositionWillLoadSnapshot(){this.loadingSnapshot=!0}compositionDidLoadSnapshot(){this.compositionController.refreshViewCache(),this.render(),this.loadingSnapshot=!1}getSelectionManager(){return this.selectionManager}attachmentManagerDidRequestRemovalOfAttachment(t){return this.removeAttachment(t)}compositionControllerWillSyncDocumentView(){return this.inputController.editorWillSyncDocumentView(),this.selectionManager.lock(),this.selectionManager.clearSelection()}compositionControllerDidSyncDocumentView(){return this.inputController.editorDidSyncDocumentView(),this.selectionManager.unlock(),this.updateCurrentActions(),this.notifyEditorElement("sync")}compositionControllerDidRender(){this.requestedLocationRange&&(this.compositionRevisionWhenLocationRangeRequested===this.composition.revision&&this.selectionManager.setLocationRange(this.requestedLocationRange),this.requestedLocationRange=null,this.compositionRevisionWhenLocationRangeRequested=null),this.renderedCompositionRevision!==this.composition.revision&&(this.runEditorFilters(),this.composition.updateCurrentAttributes(),this.notifyEditorElement("render")),this.renderedCompositionRevision=this.composition.revision}compositionControllerDidFocus(){return this.isFocusedInvisibly()&&this.setLocationRange({index:0,offset:0}),this.toolbarController.hideDialog(),this.notifyEditorElement("focus")}compositionControllerDidBlur(){return this.notifyEditorElement("blur")}compositionControllerDidSelectAttachment(t,e){return this.toolbarController.hideDialog(),this.composition.editAttachment(t,e)}compositionControllerDidRequestDeselectingAttachment(t){const e=this.attachmentLocationRange||this.composition.document.getLocationRangeOfAttachment(t);return this.selectionManager.setLocationRange(e[1])}compositionControllerWillUpdateAttachment(t){return this.editor.recordUndoEntry("Edit Attachment",{context:t.id,consolidatable:!0})}compositionControllerDidRequestRemovalOfAttachment(t){return this.removeAttachment(t)}inputControllerWillHandleInput(){this.handlingInput=!0,this.requestedRender=!1}inputControllerDidRequestRender(){this.requestedRender=!0}inputControllerDidHandleInput(){if(this.handlingInput=!1,this.requestedRender)return this.requestedRender=!1,this.render()}inputControllerDidAllowUnhandledInput(){return this.notifyEditorElement("change")}inputControllerDidRequestReparse(){return this.reparse()}inputControllerWillPerformTyping(){return this.recordTypingUndoEntry()}inputControllerWillPerformFormatting(t){return this.recordFormattingUndoEntry(t)}inputControllerWillCutText(){return this.editor.recordUndoEntry("Cut")}inputControllerWillPaste(t){return this.editor.recordUndoEntry("Paste"),this.pasting=!0,this.notifyEditorElement("before-paste",{paste:t})}inputControllerDidPaste(t){return t.range=this.pastedRange,this.pastedRange=null,this.pasting=null,this.notifyEditorElement("paste",{paste:t})}inputControllerWillMoveText(){return this.editor.recordUndoEntry("Move")}inputControllerWillAttachFiles(){return this.editor.recordUndoEntry("Drop Files")}inputControllerWillPerformUndo(){return this.editor.undo()}inputControllerWillPerformRedo(){return this.editor.redo()}inputControllerDidReceiveKeyboardCommand(t){return this.toolbarController.applyKeyboardCommand(t)}inputControllerDidStartDrag(){this.locationRangeBeforeDrag=this.selectionManager.getLocationRange()}inputControllerDidReceiveDragOverPoint(t){return this.selectionManager.setLocationRangeFromPointRange(t)}inputControllerDidCancelDrag(){this.selectionManager.setLocationRange(this.locationRangeBeforeDrag),this.locationRangeBeforeDrag=null}locationRangeDidChange(t){return this.composition.updateCurrentAttributes(),this.updateCurrentActions(),this.attachmentLocationRange&&!Dt(this.attachmentLocationRange,t)&&this.composition.stopEditingAttachment(),this.notifyEditorElement("selection-change")}toolbarDidClickButton(){if(!this.getLocationRange())return this.setLocationRange({index:0,offset:0})}toolbarDidInvokeAction(t,e){return this.invokeAction(t,e)}toolbarDidToggleAttribute(t){if(this.recordFormattingUndoEntry(t),this.composition.toggleCurrentAttribute(t),this.render(),!this.selectionFrozen)return this.editorElement.focus()}toolbarDidUpdateAttribute(t,e){if(this.recordFormattingUndoEntry(t),this.composition.setCurrentAttribute(t,e),this.render(),!this.selectionFrozen)return this.editorElement.focus()}toolbarDidRemoveAttribute(t){if(this.recordFormattingUndoEntry(t),this.composition.removeCurrentAttribute(t),this.render(),!this.selectionFrozen)return this.editorElement.focus()}toolbarWillShowDialog(t){return this.composition.expandSelectionForEditing(),this.freezeSelection()}toolbarDidShowDialog(t){return this.notifyEditorElement("toolbar-dialog-show",{dialogName:t})}toolbarDidHideDialog(t){return this.thawSelection(),this.editorElement.focus(),this.notifyEditorElement("toolbar-dialog-hide",{dialogName:t})}freezeSelection(){if(!this.selectionFrozen)return this.selectionManager.lock(),this.composition.freezeSelection(),this.selectionFrozen=!0,this.render()}thawSelection(){if(this.selectionFrozen)return this.composition.thawSelection(),this.selectionManager.unlock(),this.selectionFrozen=!1,this.render()}canInvokeAction(t){return!!this.actionIsExternal(t)||!(null===(e=this.actions[t])||void 0===e||null===(e=e.test)||void 0===e||!e.call(this));// removed by dead control flow
{ var e; }}invokeAction(t,e){return this.actionIsExternal(t)?this.notifyEditorElement("action-invoke",{actionName:t,invokingElement:e}):null===(i=this.actions[t])||void 0===i||null===(i=i.perform)||void 0===i?void 0:i.call(this);// removed by dead control flow
{ var i; }}actionIsExternal(t){return/^x-./.test(t)}getCurrentActions(){const t={};for(const e in this.actions)t[e]=this.canInvokeAction(e);return t}updateCurrentActions(){const t=this.getCurrentActions();if(!Tt(t,this.currentActions))return this.currentActions=t,this.toolbarController.updateActions(this.currentActions),this.notifyEditorElement("actions-change",{actions:this.currentActions})}runEditorFilters(){let t=this.composition.getSnapshot();if(Array.from(this.editor.filters).forEach((e=>{const{document:i,selectedRange:n}=t;t=e.call(this.editor,t)||{},t.document||(t.document=i),t.selectedRange||(t.selectedRange=n)})),e=t,i=this.composition.getSnapshot(),!Dt(e.selectedRange,i.selectedRange)||!e.document.isEqualTo(i.document))return this.composition.loadSnapshot(t);var e,i}updateInputElement(){const t=function(t,e){const i=En[e];if(i)return i(t);throw new Error("unknown content type: ".concat(e))}(this.compositionController.getSerializableElement(),"text/html");return this.editorElement.setFormValue(t)}notifyEditorElement(t,e){switch(t){case"document-change":this.documentChangedSinceLastRender=!0;break;case"render":this.documentChangedSinceLastRender&&(this.documentChangedSinceLastRender=!1,this.notifyEditorElement("change"));break;case"change":case"attachment-add":case"attachment-edit":case"attachment-remove":this.updateInputElement()}return this.editorElement.notify(t,e)}removeAttachment(t){return this.editor.recordUndoEntry("Delete Attachment"),this.composition.removeAttachment(t),this.render()}recordFormattingUndoEntry(t){const e=mt(t),i=this.selectionManager.getLocationRange();if(e||!Lt(i))return this.editor.recordUndoEntry("Formatting",{context:this.getUndoContext(),consolidatable:!0})}recordTypingUndoEntry(){return this.editor.recordUndoEntry("Typing",{context:this.getUndoContext(this.currentAttributes),consolidatable:!0})}getUndoContext(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return[this.getLocationContext(),this.getTimeContext(),...Array.from(e)]}getLocationContext(){const t=this.selectionManager.getLocationRange();return Lt(t)?t[0].index:t}getTimeContext(){return V.interval>0?Math.floor((new Date).getTime()/V.interval):0}isFocused(){var t;return this.editorElement===(null===(t=this.editorElement.ownerDocument)||void 0===t?void 0:t.activeElement)}isFocusedInvisibly(){return this.isFocused()&&!this.getLocationRange()}get actions(){return this.constructor.actions}}Di(_r,"actions",{undo:{test(){return this.editor.canUndo()},perform(){return this.editor.undo()}},redo:{test(){return this.editor.canRedo()},perform(){return this.editor.redo()}},link:{test(){return this.editor.canActivateAttribute("href")}},increaseNestingLevel:{test(){return this.editor.canIncreaseNestingLevel()},perform(){return this.editor.increaseNestingLevel()&&this.render()}},decreaseNestingLevel:{test(){return this.editor.canDecreaseNestingLevel()},perform(){return this.editor.decreaseNestingLevel()&&this.render()}},attachFiles:{test:()=>!0,perform(){return _.pickFiles(this.editor.insertFiles)}}}),_r.proxyMethod("getSelectionManager().setLocationRange"),_r.proxyMethod("getSelectionManager().getLocationRange");var jr=Object.freeze({__proto__:null,AttachmentEditorController:Yn,CompositionController:Xn,Controller:$n,EditorController:_r,InputController:lr,Level0InputController:gr,Level2InputController:Ar,ToolbarController:Br}),Wr=Object.freeze({__proto__:null,MutationObserver:er,SelectionChangeObserver:Ot}),Ur=Object.freeze({__proto__:null,FileVerificationOperation:nr,ImagePreloadOperation:Ui});vt("trix-toolbar","%t {\n  display: block;\n}\n\n%t {\n  white-space: nowrap;\n}\n\n%t [data-trix-dialog] {\n  display: none;\n}\n\n%t [data-trix-dialog][data-trix-active] {\n  display: block;\n}\n\n%t [data-trix-dialog] [data-trix-validate]:invalid {\n  background-color: #ffdddd;\n}");class Vr extends HTMLElement{connectedCallback(){""===this.innerHTML&&(this.innerHTML=U.getDefaultHTML())}}let zr=0;const qr=function(t){if(!t.hasAttribute("contenteditable"))return t.setAttribute("contenteditable",""),function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.times=1,b(t,e)}("focus",{onElement:t,withCallback:()=>Hr(t)})},Hr=function(t){return Jr(t),Kr(t)},Jr=function(t){var e,i;if(null!==(e=(i=document).queryCommandSupported)&&void 0!==e&&e.call(i,"enableObjectResizing"))return document.execCommand("enableObjectResizing",!1,!1),b("mscontrolselect",{onElement:t,preventDefault:!0})},Kr=function(t){var e,i;if(null!==(e=(i=document).queryCommandSupported)&&void 0!==e&&e.call(i,"DefaultParagraphSeparator")){const{tagName:t}=n.default;if(["div","p"].includes(t))return document.execCommand("DefaultParagraphSeparator",!1,t)}},Gr=a.forcesObjectResizing?{display:"inline",width:"auto"}:{display:"inline-block",width:"1px"};vt("trix-editor","%t {\n    display: block;\n}\n\n%t:empty::before {\n    content: attr(placeholder);\n    color: graytext;\n    cursor: text;\n    pointer-events: none;\n    white-space: pre-line;\n}\n\n%t a[contenteditable=false] {\n    cursor: text;\n}\n\n%t img {\n    max-width: 100%;\n    height: auto;\n}\n\n%t ".concat(e," figcaption textarea {\n    resize: none;\n}\n\n%t ").concat(e," figcaption textarea.trix-autoresize-clone {\n    position: absolute;\n    left: -9999px;\n    max-height: 0px;\n}\n\n%t ").concat(e," figcaption[data-trix-placeholder]:empty::before {\n    content: attr(data-trix-placeholder);\n    color: graytext;\n}\n\n%t [data-trix-cursor-target] {\n    display: ").concat(Gr.display," !important;\n    width: ").concat(Gr.width," !important;\n    padding: 0 !important;\n    margin: 0 !important;\n    border: none !important;\n}\n\n%t [data-trix-cursor-target=left] {\n    vertical-align: top !important;\n    margin-left: -1px !important;\n}\n\n%t [data-trix-cursor-target=right] {\n    vertical-align: bottom !important;\n    margin-right: -1px !important;\n}"));var Yr=new WeakMap,Xr=new WeakSet;class $r{constructor(t){var e,i;_i(e=this,i=Xr),i.add(e),ji(this,Yr,{writable:!0,value:void 0}),this.element=t,Oi(this,Yr,t.attachInternals())}connectedCallback(){Bi(this,Xr,Zr).call(this)}disconnectedCallback(){}get labels(){return Ii(this,Yr).labels}get disabled(){var t;return null===(t=this.element.inputElement)||void 0===t?void 0:t.disabled}set disabled(t){this.element.toggleAttribute("disabled",t)}get required(){return this.element.hasAttribute("required")}set required(t){this.element.toggleAttribute("required",t),Bi(this,Xr,Zr).call(this)}get validity(){return Ii(this,Yr).validity}get validationMessage(){return Ii(this,Yr).validationMessage}get willValidate(){return Ii(this,Yr).willValidate}setFormValue(t){Bi(this,Xr,Zr).call(this)}checkValidity(){return Ii(this,Yr).checkValidity()}reportValidity(){return Ii(this,Yr).reportValidity()}setCustomValidity(t){Bi(this,Xr,Zr).call(this,t)}}function Zr(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";const{required:e,value:i}=this.element,n=e&&!i,r=!!t,o=T("input",{required:e}),s=t||o.validationMessage;Ii(this,Yr).setValidity({valueMissing:n,customError:r},s)}var Qr=new WeakMap,to=new WeakMap,eo=new WeakMap;class io{constructor(t){ji(this,Qr,{writable:!0,value:void 0}),ji(this,to,{writable:!0,value:t=>{t.defaultPrevented||t.target===this.element.form&&this.element.reset()}}),ji(this,eo,{writable:!0,value:t=>{if(t.defaultPrevented)return;if(this.element.contains(t.target))return;const e=y(t.target,{matchingSelector:"label"});e&&Array.from(this.labels).includes(e)&&this.element.focus()}}),this.element=t}connectedCallback(){Oi(this,Qr,function(t){if(t.hasAttribute("aria-label")||t.hasAttribute("aria-labelledby"))return;const e=function(){const e=Array.from(t.labels).map((e=>{if(!e.contains(t))return e.textContent})).filter((t=>t)),i=e.join(" ");return i?t.setAttribute("aria-label",i):t.removeAttribute("aria-label")};return e(),b("focus",{onElement:t,withCallback:e})}(this.element)),window.addEventListener("reset",Ii(this,to),!1),window.addEventListener("click",Ii(this,eo),!1)}disconnectedCallback(){var t;null===(t=Ii(this,Qr))||void 0===t||t.destroy(),window.removeEventListener("reset",Ii(this,to),!1),window.removeEventListener("click",Ii(this,eo),!1)}get labels(){const t=[];this.element.id&&this.element.ownerDocument&&t.push(...Array.from(this.element.ownerDocument.querySelectorAll("label[for='".concat(this.element.id,"']"))||[]));const e=y(this.element,{matchingSelector:"label"});return e&&[this.element,null].includes(e.control)&&t.push(e),t}get disabled(){return console.warn("This browser does not support the [disabled] attribute for trix-editor elements."),!1}set disabled(t){console.warn("This browser does not support the [disabled] attribute for trix-editor elements.")}get required(){return console.warn("This browser does not support the [required] attribute for trix-editor elements."),!1}set required(t){console.warn("This browser does not support the [required] attribute for trix-editor elements.")}get validity(){return console.warn("This browser does not support the validity property for trix-editor elements."),null}get validationMessage(){return console.warn("This browser does not support the validationMessage property for trix-editor elements."),""}get willValidate(){return console.warn("This browser does not support the willValidate property for trix-editor elements."),!1}setFormValue(t){}checkValidity(){return console.warn("This browser does not support checkValidity() for trix-editor elements."),!0}reportValidity(){return console.warn("This browser does not support reportValidity() for trix-editor elements."),!0}setCustomValidity(t){console.warn("This browser does not support setCustomValidity(validationMessage) for trix-editor elements.")}}var no=new WeakMap;class ro extends HTMLElement{constructor(){super(),ji(this,no,{writable:!0,value:void 0}),Oi(this,no,this.constructor.formAssociated?new $r(this):new io(this))}get trixId(){return this.hasAttribute("trix-id")?this.getAttribute("trix-id"):(this.setAttribute("trix-id",++zr),this.trixId)}get labels(){return Ii(this,no).labels}get disabled(){return Ii(this,no).disabled}set disabled(t){Ii(this,no).disabled=t}get required(){return Ii(this,no).required}set required(t){Ii(this,no).required=t}get validity(){return Ii(this,no).validity}get validationMessage(){return Ii(this,no).validationMessage}get willValidate(){return Ii(this,no).willValidate}get type(){return this.localName}get toolbarElement(){var t;if(this.hasAttribute("toolbar"))return null===(t=this.ownerDocument)||void 0===t?void 0:t.getElementById(this.getAttribute("toolbar"));if(this.parentNode){const t="trix-toolbar-".concat(this.trixId);return this.setAttribute("toolbar",t),this.internalToolbar=T("trix-toolbar",{id:t}),this.parentNode.insertBefore(this.internalToolbar,this),this.internalToolbar}}get form(){var t;return null===(t=this.inputElement)||void 0===t?void 0:t.form}get inputElement(){var t;if(this.hasAttribute("input"))return null===(t=this.ownerDocument)||void 0===t?void 0:t.getElementById(this.getAttribute("input"));if(this.parentNode){const t="trix-input-".concat(this.trixId);this.setAttribute("input",t);const e=T("input",{type:"hidden",id:t});return this.parentNode.insertBefore(e,this.nextElementSibling),e}}get editor(){var t;return null===(t=this.editorController)||void 0===t?void 0:t.editor}get name(){var t;return null===(t=this.inputElement)||void 0===t?void 0:t.name}get value(){var t;return null===(t=this.inputElement)||void 0===t?void 0:t.value}set value(t){var e;this.defaultValue=t,null===(e=this.editor)||void 0===e||e.loadHTML(this.defaultValue)}attributeChangedCallback(t,e,i){"connected"===t&&this.isConnected&&null!=e&&e!==i&&requestAnimationFrame((()=>this.reconnect()))}notify(t,e){if(this.editorController)return v("trix-".concat(t),{onElement:this,attributes:e})}setFormValue(t){this.inputElement&&(this.inputElement.value=t,Ii(this,no).setFormValue(t))}connectedCallback(){this.hasAttribute("data-trix-internal")||(qr(this),function(t){if(!t.hasAttribute("role"))t.setAttribute("role","textbox")}(this),this.editorController||(v("trix-before-initialize",{onElement:this}),this.editorController=new _r({editorElement:this,html:this.defaultValue=this.value}),requestAnimationFrame((()=>v("trix-initialize",{onElement:this})))),this.editorController.registerSelectionManager(),Ii(this,no).connectedCallback(),this.toggleAttribute("connected",!0),function(t){if(!document.querySelector(":focus")&&t.hasAttribute("autofocus")&&document.querySelector("[autofocus]")===t)t.focus()}(this))}disconnectedCallback(){var t;null===(t=this.editorController)||void 0===t||t.unregisterSelectionManager(),Ii(this,no).disconnectedCallback(),this.toggleAttribute("connected",!1)}reconnect(){this.removeInternalToolbar(),this.disconnectedCallback(),this.connectedCallback()}removeInternalToolbar(){var t;null===(t=this.internalToolbar)||void 0===t||t.remove(),this.internalToolbar=null}checkValidity(){return Ii(this,no).checkValidity()}reportValidity(){return Ii(this,no).reportValidity()}setCustomValidity(t){Ii(this,no).setCustomValidity(t)}formDisabledCallback(t){this.inputElement&&(this.inputElement.disabled=t),this.toggleAttribute("contenteditable",!t)}formResetCallback(){this.reset()}reset(){this.value=this.defaultValue}}Di(ro,"formAssociated","ElementInternals"in window),Di(ro,"observedAttributes",["connected"]);const oo={VERSION:t,config:z,core:Sn,models:zn,views:qn,controllers:jr,observers:Wr,operations:Ur,elements:Object.freeze({__proto__:null,TrixEditorElement:ro,TrixToolbarElement:Vr}),filters:Object.freeze({__proto__:null,Filter:In,attachmentGalleryFilter:On})};Object.assign(oo,zn),window.Trix=oo,setTimeout((function(){customElements.get("trix-toolbar")||customElements.define("trix-toolbar",Vr),customElements.get("trix-editor")||customElements.define("trix-editor",ro)}),0);
//# sourceMappingURL=trix.esm.min.js.map


/***/ }),

/***/ "./resources/themes/js/components/forms.js":
/*!*************************************************!*\
  !*** ./resources/themes/js/components/forms.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var trix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! trix */ "./node_modules/trix/dist/trix.esm.min.js");
/* harmony import */ var flatpickr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flatpickr */ "./node_modules/flatpickr/dist/esm/index.js");
/* harmony import */ var flatpickr_dist_l10n_pl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flatpickr/dist/l10n/pl.js */ "./node_modules/flatpickr/dist/l10n/pl.js");
/* harmony import */ var flatpickr_dist_l10n_pl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flatpickr_dist_l10n_pl_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var tippy_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tippy.js */ "./node_modules/tippy.js/dist/tippy.esm.js");
__webpack_require__(/*! chosen-js */ "./node_modules/chosen-js/chosen.jquery.js");




window.Trix = trix__WEBPACK_IMPORTED_MODULE_0__["default"];
$.buildFlatpickr = function () {
  flatpickr__WEBPACK_IMPORTED_MODULE_1__["default"].localize(flatpickr_dist_l10n_pl_js__WEBPACK_IMPORTED_MODULE_2__.Polish);
  var dateTimePickerOptions = {
    allowInput: true,
    altFormat: datetime_format,
    dateFormat: "Y-m-d H:i:s",
    enableTime: true,
    time_24hr: true,
    altInput: true
  };
  var timePickerOptions = {
    altInput: true,
    allowInput: true,
    enableTime: true,
    noCalendar: true,
    altFormat: time_format,
    dateFormat: "H:i:s",
    time_24hr: true
  };
  var datePickerOptions = {
    allowInput: true,
    altInput: true,
    altFormat: date_format,
    dateFormat: "Y-m-d"
  };
  var birthdatePickerOptions = {
    allowInput: true,
    altInput: true,
    altFormat: date_format,
    dateFormat: "Y-m-d",
    defaultDate: new Date().setFullYear(new Date().getFullYear() - 18),
    monthSelectorType: "dropdown"
  };
  $(document).find(".datetimepicker").each(function () {
    var minDate = $(this).attr("data-min-date");
    var maxDate = $(this).attr("data-max-date");
    if (minDate) {
      dateTimePickerOptions.minDate = minDate;
    }
    if (maxDate) {
      dateTimePickerOptions.maxDate = maxDate;
    }
    (0,flatpickr__WEBPACK_IMPORTED_MODULE_1__["default"])(this, dateTimePickerOptions);
  });
  $(document).find(".timepicker").each(function () {
    var minDate = $(this).attr("data-min-date");
    var maxDate = $(this).attr("data-max-date");
    if (minDate) {
      timePickerOptions.minDate = minDate;
    }
    if (maxDate) {
      timePickerOptions.maxDate = maxDate;
    }
    (0,flatpickr__WEBPACK_IMPORTED_MODULE_1__["default"])(this, timePickerOptions);
  });
  $(document).find(".datepicker").each(function () {
    var minDate = $(this).attr("data-min-date");
    var maxDate = $(this).attr("data-max-date");
    if (minDate) {
      datePickerOptions.minDate = minDate;
    }
    if (maxDate) {
      datePickerOptions.maxDate = maxDate;
    }
    (0,flatpickr__WEBPACK_IMPORTED_MODULE_1__["default"])(this, datePickerOptions);
  });
  $(document).find(".birthdatepicker").each(function () {
    var minDate = $(this).attr("data-min-date");
    var maxDate = $(this).attr("data-max-date");
    if (minDate) {
      birthdatePickerOptions.minDate = minDate;
    }
    if (maxDate) {
      birthdatePickerOptions.maxDate = maxDate;
    }
    (0,flatpickr__WEBPACK_IMPORTED_MODULE_1__["default"])(this, birthdatePickerOptions);
  });
};
$.buildChosen = function () {
  $("select").chosen({
    disable_search_threshold: 5,
    placeholder_text: choose,
    no_results_text: no_results,
    width: "100%"
  });
};
$("input[type=password]").on("focus", function () {
  $(this).val("");
});
$('input[data-numeric="decimal"]').on("focusout", function () {
  var val = $(this).val();
  if (val != "" && !val.includes(".") && !val.includes(",")) {
    $(this).val(val + ".00");
  }
});
$('input[data-numeric="decimal"]').on("focusout", function () {
  var val = $(this).val();
  if (!val.includes(".") && !val.includes(",")) {
    $(this).val(val + ".00");
  }
});
$('input[data-validation="numeric"]').on("keypress", function (evt) {
  $(this).val($(this).val().replace(/[^0-9\.|\,]/g, ""));
  if (evt.which == 44) {
    return true;
  }
  if ((evt.which != 46 || $(this).val().indexOf(".") != -1) && (evt.which < 48 || evt.which > 57)) {
    evt.preventDefault();
  }
});
jQuery(function () {
  buildVendors();
});
$.rebuildVendors = function () {
  buildVendors();
};
function buildVendors() {
  $.buildChosen();
  $.buildFlatpickr();
  (0,tippy_js__WEBPACK_IMPORTED_MODULE_3__["default"])("[data-tippy-content]", {
    allowHTML: true
  });
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************************************!*\
  !*** ./resources/themes/js/formforge.js ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/forms */ "./resources/themes/js/components/forms.js");

})();

/******/ })()
;