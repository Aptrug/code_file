//=============================================================================
// rmmz_core.js v1.9.0
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * This section contains some methods that will be added to the standard
 * Javascript objects.
 *
 * @namespace JsExtensions
 */

/**
 * Makes a shallow copy of the array.
 *
 * @memberof JsExtensions
 * @returns {array} A shallow copy of the array.
 */
Array.prototype.clone = function() {
    return this.slice(0);
};

Object.defineProperty(Array.prototype, "clone", {
    enumerable: false
});

/**
 * Checks whether the array contains a given element.
 *
 * @memberof JsExtensions
 * @param {any} element - The element to search for.
 * @returns {boolean} True if the array contains a given element.
 * @deprecated includes() should be used instead.
 */
Array.prototype.contains = function(element) {
    return this.includes(element);
};

Object.defineProperty(Array.prototype, "contains", {
    enumerable: false
});

/**
 * Checks whether the two arrays are the same.
 *
 * @memberof JsExtensions
 * @param {array} array - The array to compare to.
 * @returns {boolean} True if the two arrays are the same.
 */
Array.prototype.equals = function(array) {
    if (!array || this.length !== array.length) {
        return false;
    }
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
};

Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});

/**
 * Removes a given element from the array (in place).
 *
 * @memberof JsExtensions
 * @param {any} element - The element to remove.
 * @returns {array} The array after remove.
 */
Array.prototype.remove = function(element) {
    for (;;) {
        const index = this.indexOf(element);
        if (index >= 0) {
            this.splice(index, 1);
        } else {
            return this;
        }
    }
};

Object.defineProperty(Array.prototype, "remove", {
    enumerable: false
});

/**
 * Generates a random integer in the range (0, max-1).
 *
 * @memberof JsExtensions
 * @param {number} max - The upper boundary (excluded).
 * @returns {number} A random integer.
 */
Math.randomInt = function(max) {
    return Math.floor(max * Math.random());
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * @memberof JsExtensions
 * @param {number} min - The lower boundary.
 * @param {number} max - The upper boundary.
 * @returns {number} A number in the range (min, max).
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * Returns a modulo value which is always positive.
 *
 * @memberof JsExtensions
 * @param {number} n - The divisor.
 * @returns {number} A modulo value.
 */
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

/**
 * Makes a number string with leading zeros.
 *
 * @memberof JsExtensions
 * @param {number} length - The length of the output string.
 * @returns {string} A string with leading zeros.
 */
Number.prototype.padZero = function(length) {
    return String(this).padZero(length);
};

/**
 * Checks whether the string contains a given string.
 *
 * @memberof JsExtensions
 * @param {string} string - The string to search for.
 * @returns {boolean} True if the string contains a given string.
 * @deprecated includes() should be used instead.
 */
String.prototype.contains = function(string) {
    return this.includes(string);
};

/**
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @memberof JsExtensions
 * @param {any} ...args The objects to format.
 * @returns {string} A formatted string.
 */
String.prototype.format = function() {
    return this.replace(/%([0-9]+)/g, (s, n) => arguments[Number(n) - 1]);
};

/**
 * Makes a number string with leading zeros.
 *
 * @memberof JsExtensions
 * @param {number} length - The length of the output string.
 * @returns {string} A string with leading zeros.
 */
String.prototype.padZero = function(length) {
    return this.padStart(length, "0");
};

//-----------------------------------------------------------------------------
/**
 * The static class that defines utility methods.
 *
 * @namespace
 */
function Utils() {
    throw new Error("This is a static class");
}

/**
 * The name of the RPG Maker. "MZ" in the current version.
 *
 * @type string
 * @constant
 */
Utils.RPGMAKER_NAME = "MZ";

/**
 * The version of the RPG Maker.
 *
 * @type string
 * @constant
 */
Utils.RPGMAKER_VERSION = "1.9.0";

/**
 * Checks whether the current RPG Maker version is greater than or equal to
 * the given version.
 *
 * @param {string} version - The "x.x.x" format string to compare.
 * @returns {boolean} True if the current version is greater than or equal
 *                    to the given version.
 */
Utils.checkRMVersion = function(version) {
    const array1 = this.RPGMAKER_VERSION.split(".");
    const array2 = String(version).split(".");
    for (let i = 0; i < array1.length; i++) {
        const v1 = parseInt(array1[i]);
        const v2 = parseInt(array2[i]);
        if (v1 > v2) {
            return true;
        } else if (v1 < v2) {
            return false;
        }
    }
    return true;
};

/**
 * Checks whether the option is in the query string.
 *
 * @param {string} name - The option name.
 * @returns {boolean} True if the option is in the query string.
 */
Utils.isOptionValid = function(name) {
    const args = location.search.slice(1);
    if (args.split("&").includes(name)) {
        return true;
    }
    if (this.isNwjs() && nw.App.argv.length > 0) {
        return nw.App.argv[0].split("&").includes(name);
    }
    return false;
};

/**
 * Checks whether the platform is NW.js.
 *
 * @returns {boolean} True if the platform is NW.js.
 */
Utils.isNwjs = function() {
    return typeof require === "function" && typeof process === "object";
};

/**
 * Checks whether the platform is a mobile device.
 *
 * @returns {boolean} True if the platform is a mobile device.
 */
Utils.isMobileDevice = function() {
    const r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i;
    return !!navigator.userAgent.match(r);
};

/**
 * Checks whether the browser is Mobile Safari.
 *
 * @returns {boolean} True if the browser is Mobile Safari.
 */
Utils.isMobileSafari = function() {
    const agent = navigator.userAgent;
    return !!(
        agent.match(/iPhone|iPad|iPod/) &&
        agent.match(/AppleWebKit/) &&
        !agent.match("CriOS")
    );
};

/**
 * Checks whether the browser is Android Chrome.
 *
 * @returns {boolean} True if the browser is Android Chrome.
 */
Utils.isAndroidChrome = function() {
    const agent = navigator.userAgent;
    return !!(agent.match(/Android/) && agent.match(/Chrome/));
};

/**
 * Checks whether the browser is accessing local files.
 *
 * @returns {boolean} True if the browser is accessing local files.
 */
Utils.isLocal = function() {
    return window.location.href.startsWith("file:");
};

/**
 * Checks whether the browser supports WebGL.
 *
 * @returns {boolean} True if the browser supports WebGL.
 */
Utils.canUseWebGL = function() {
    try {
        const canvas = document.createElement("canvas");
        return !!canvas.getContext("webgl");
    } catch (e) {
        return false;
    }
};

/**
 * Checks whether the browser supports Web Audio API.
 *
 * @returns {boolean} True if the browser supports Web Audio API.
 */
Utils.canUseWebAudioAPI = function() {
    return !!(window.AudioContext || window.webkitAudioContext);
};

/**
 * Checks whether the browser supports CSS Font Loading.
 *
 * @returns {boolean} True if the browser supports CSS Font Loading.
 */
Utils.canUseCssFontLoading = function() {
    return !!(document.fonts && document.fonts.ready);
};

/**
 * Checks whether the browser supports IndexedDB.
 *
 * @returns {boolean} True if the browser supports IndexedDB.
 */
Utils.canUseIndexedDB = function() {
    return !!(
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB
    );
};

/**
 * Checks whether the browser can play ogg files.
 *
 * @returns {boolean} True if the browser can play ogg files.
 */
Utils.canPlayOgg = function() {
    if (!Utils._audioElement) {
        Utils._audioElement = document.createElement("audio");
    }
    return !!(
        Utils._audioElement &&
        Utils._audioElement.canPlayType('audio/ogg; codecs="vorbis"')
    );
};

/**
 * Checks whether the browser can play webm files.
 *
 * @returns {boolean} True if the browser can play webm files.
 */
Utils.canPlayWebm = function() {
    if (!Utils._videoElement) {
        Utils._videoElement = document.createElement("video");
    }
    return !!(
        Utils._videoElement &&
        Utils._videoElement.canPlayType('video/webm; codecs="vp8, vorbis"')
    );
};

/**
 * Encodes a URI component without escaping slash characters.
 *
 * @param {string} str - The input string.
 * @returns {string} Encoded string.
 */
Utils.encodeURI = function(str) {
    return encodeURIComponent(str).replace(/%2F/g, "/");
};

/**
 * Gets the filename that does not include subfolders.
 *
 * @param {string} filename - The filename with subfolders.
 * @returns {string} The filename without subfolders.
 */
Utils.extractFileName = function(filename) {
    return filename.split("/").pop();
};

/**
 * Escapes special characters for HTML.
 *
 * @param {string} str - The input string.
 * @returns {string} Escaped string.
 */
Utils.escapeHtml = function(str) {
    const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    return String(str).replace(/[&<>"'/]/g, s => entityMap[s]);
};

/**
 * Checks whether the string contains any Arabic characters.
 *
 * @returns {boolean} True if the string contains any Arabic characters.
 */
Utils.containsArabic = function(str) {
    const regExp = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return regExp.test(str);
};

/**
 * Sets information related to encryption.
 *
 * @param {boolean} hasImages - Whether the image files are encrypted.
 * @param {boolean} hasAudio - Whether the audio files are encrypted.
 * @param {string} key - The encryption key.
 */
Utils.setEncryptionInfo = function(hasImages, hasAudio, key) {
    // [Note] This function is implemented for module independence.
    this._hasEncryptedImages = hasImages;
    this._hasEncryptedAudio = hasAudio;
    this._encryptionKey = key;
};

/**
 * Checks whether the image files in the game are encrypted.
 *
 * @returns {boolean} True if the image files are encrypted.
 */
Utils.hasEncryptedImages = function() {
    return this._hasEncryptedImages;
};

/**
 * Checks whether the audio files in the game are encrypted.
 *
 * @returns {boolean} True if the audio files are encrypted.
 */
Utils.hasEncryptedAudio = function() {
    return this._hasEncryptedAudio;
};

/**
 * Decrypts encrypted data.
 *
 * @param {ArrayBuffer} source - The data to be decrypted.
 * @returns {ArrayBuffer} The decrypted data.
 */
Utils.decryptArrayBuffer = function(source) {
    const header = new Uint8Array(source, 0, 16);
    const headerHex = Array.from(header, x => x.toString(16)).join(",");
    if (headerHex !== "52,50,47,4d,56,0,0,0,0,3,1,0,0,0,0,0") {
        throw new Error("Decryption error");
    }
    const body = source.slice(16);
    const view = new DataView(body);
    const key = this._encryptionKey.match(/.{2}/g);
    for (let i = 0; i < 16; i++) {
        view.setUint8(i, view.getUint8(i) ^ parseInt(key[i], 16));
    }
    return body;
};

//-----------------------------------------------------------------------------
/**
 * The static class that carries out graphics processing.
 *
 * @namespace
 */
function Graphics() {
    throw new Error("This is a static class");
}

/**
 * Initializes the graphics system.
 *
 * @returns {boolean} True if the graphics system is available.
 */
Graphics.initialize = function() {
    this._width = 0;
    this._height = 0;
    this._defaultScale = 1;
    this._realScale = 1;
    this._errorPrinter = null;
    this._tickHandler = null;
    this._canvas = null;
    this._fpsCounter = null;
    this._loadingSpinner = null;
    this._stretchEnabled = this._defaultStretchMode();
    this._app = null;
    this._effekseer = null;
    this._wasLoading = false;

    /**
     * The total frame count of the game screen.
     *
     * @type number
     * @name Graphics.frameCount
     */
    this.frameCount = 0;

    /**
     * The width of the window display area.
     *
     * @type number
     * @name Graphics.boxWidth
     */
    this.boxWidth = this._width;

    /**
     * The height of the window display area.
     *
     * @type number
     * @name Graphics.boxHeight
     */
    this.boxHeight = this._height;

    this._updateRealScale();
    this._createAllElements();
    this._disableContextMenu();
    this._setupEventHandlers();
    this._createPixiApp();
    this._createEffekseerContext();

    return !!this._app;
};

/**
 * The PIXI.Application object.
 *
 * @readonly
 * @type PIXI.Application
 * @name Graphics.app
 */
Object.defineProperty(Graphics, "app", {
    get: function() {
        return this._app;
    },
    configurable: true
});

/**
 * The context object of Effekseer.
 *
 * @readonly
 * @type EffekseerContext
 * @name Graphics.effekseer
 */
Object.defineProperty(Graphics, "effekseer", {
    get: function() {
        return this._effekseer;
    },
    configurable: true
});

/**
 * Register a handler for tick events.
 *
 * @param {function} handler - The listener function to be added for updates.
 */
Graphics.setTickHandler = function(handler) {
    this._tickHandler = handler;
};

/**
 * Starts the game loop.
 */
Graphics.startGameLoop = function() {
    if (this._app) {
        this._app.start();
    }
};

/**
 * Stops the game loop.
 */
Graphics.stopGameLoop = function() {
    if (this._app) {
        this._app.stop();
    }
};

/**
 * Sets the stage to be rendered.
 *
 * @param {Stage} stage - The stage object to be rendered.
 */
Graphics.setStage = function(stage) {
    if (this._app) {
        this._app.stage = stage;
    }
};

/**
 * Shows the loading spinner.
 */
Graphics.startLoading = function() {
    if (!document.getElementById("loadingSpinner")) {
        document.body.appendChild(this._loadingSpinner);
    }
};

/**
 * Erases the loading spinner.
 *
 * @returns {boolean} True if the loading spinner was active.
 */
Graphics.endLoading = function() {
    if (document.getElementById("loadingSpinner")) {
        document.body.removeChild(this._loadingSpinner);
        return true;
    } else {
        return false;
    }
};

/**
 * Displays the error text to the screen.
 *
 * @param {string} name - The name of the error.
 * @param {string} message - The message of the error.
 * @param {Error} [error] - The error object.
 */
Graphics.printError = function(name, message, error = null) {
    if (!this._errorPrinter) {
        this._createErrorPrinter();
    }
    this._errorPrinter.innerHTML = this._makeErrorHtml(name, message, error);
    this._wasLoading = this.endLoading();
    this._applyCanvasFilter();
};

/**
 * Displays a button to try to reload resources.
 *
 * @param {function} retry - The callback function to be called when the button
 *                           is pressed.
 */
Graphics.showRetryButton = function(retry) {
    const button = document.createElement("button");
    button.id = "retryButton";
    button.innerHTML = "Retry";
    // [Note] stopPropagation() is required for iOS Safari.
    button.ontouchstart = e => e.stopPropagation();
    button.onclick = () => {
        Graphics.eraseError();
        retry();
    };
    this._errorPrinter.appendChild(button);
    button.focus();
};

/**
 * Erases the loading error text.
 */
Graphics.eraseError = function() {
    if (this._errorPrinter) {
        this._errorPrinter.innerHTML = this._makeErrorHtml();
        if (this._wasLoading) {
            this.startLoading();
        }
    }
    this._clearCanvasFilter();
};

/**
 * Converts an x coordinate on the page to the corresponding
 * x coordinate on the canvas area.
 *
 * @param {number} x - The x coordinate on the page to be converted.
 * @returns {number} The x coordinate on the canvas area.
 */
Graphics.pageToCanvasX = function(x) {
    if (this._canvas) {
        const left = this._canvas.offsetLeft;
        return Math.round((x - left) / this._realScale);
    } else {
        return 0;
    }
};

/**
 * Converts a y coordinate on the page to the corresponding
 * y coordinate on the canvas area.
 *
 * @param {number} y - The y coordinate on the page to be converted.
 * @returns {number} The y coordinate on the canvas area.
 */
Graphics.pageToCanvasY = function(y) {
    if (this._canvas) {
        const top = this._canvas.offsetTop;
        return Math.round((y - top) / this._realScale);
    } else {
        return 0;
    }
};

/**
 * Checks whether the specified point is inside the game canvas area.
 *
 * @param {number} x - The x coordinate on the canvas area.
 * @param {number} y - The y coordinate on the canvas area.
 * @returns {boolean} True if the specified point is inside the game canvas area.
 */
Graphics.isInsideCanvas = function(x, y) {
    return x >= 0 && x < this._width && y >= 0 && y < this._height;
};

/**
 * Shows the game screen.
 */
Graphics.showScreen = function() {
    this._canvas.style.opacity = 1;
};

/**
 * Hides the game screen.
 */
Graphics.hideScreen = function() {
    this._canvas.style.opacity = 0;
};

/**
 * Changes the size of the game screen.
 *
 * @param {number} width - The width of the game screen.
 * @param {number} height - The height of the game screen.
 */
Graphics.resize = function(width, height) {
    this._width = width;
    this._height = height;
    this._app.renderer.resize(width, height);
    this._updateAllElements();
};

/**
 * The width of the game screen.
 *
 * @type number
 * @name Graphics.width
 */
Object.defineProperty(Graphics, "width", {
    get: function() {
        return this._width;
    },
    set: function(value) {
        if (this._width !== value) {
            this._width = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**
 * The height of the game screen.
 *
 * @type number
 * @name Graphics.height
 */
Object.defineProperty(Graphics, "height", {
    get: function() {
        return this._height;
    },
    set: function(value) {
        if (this._height !== value) {
            this._height = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**
 * The default zoom scale of the game screen.
 *
 * @type number
 * @name Graphics.defaultScale
 */
Object.defineProperty(Graphics, "defaultScale", {
    get: function() {
        return this._defaultScale;
    },
    set: function(value) {
        if (this._defaultScale !== value) {
            this._defaultScale = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

Graphics._createAllElements = function() {
    this._createErrorPrinter();
    this._createCanvas();
    this._createLoadingSpinner();
    this._createFPSCounter();
};

Graphics._updateAllElements = function() {
    this._updateRealScale();
    this._updateErrorPrinter();
    this._updateCanvas();
    this._updateVideo();
};

Graphics._onTick = function(deltaTime) {
    this._fpsCounter.startTick();
    if (this._tickHandler) {
        this._tickHandler(deltaTime);
    }
    if (this._canRender()) {
        this._app.render();
    }
    this._fpsCounter.endTick();
};

Graphics._canRender = function() {
    return !!this._app.stage;
};

Graphics._updateRealScale = function() {
    if (this._stretchEnabled && this._width > 0 && this._height > 0) {
        const h = this._stretchWidth() / this._width;
        const v = this._stretchHeight() / this._height;
        this._realScale = Math.min(h, v);
        window.scrollTo(0, 0);
    } else {
        this._realScale = this._defaultScale;
    }
};

Graphics._stretchWidth = function() {
    if (Utils.isMobileDevice()) {
        return document.documentElement.clientWidth;
    } else {
        return window.innerWidth;
    }
};

Graphics._stretchHeight = function() {
    if (Utils.isMobileDevice()) {
        // [Note] Mobile browsers often have special operations at the top and
        //   bottom of the screen.
        const rate = Utils.isLocal() ? 1.0 : 0.9;
        return document.documentElement.clientHeight * rate;
    } else {
        return window.innerHeight;
    }
};

Graphics._makeErrorHtml = function(name, message /*, error*/) {
    const nameDiv = document.createElement("div");
    const messageDiv = document.createElement("div");
    nameDiv.id = "errorName";
    messageDiv.id = "errorMessage";
    nameDiv.innerHTML = Utils.escapeHtml(name || "");
    messageDiv.innerHTML = Utils.escapeHtml(message || "");
    return nameDiv.outerHTML + messageDiv.outerHTML;
};

Graphics._defaultStretchMode = function() {
    return Utils.isNwjs() || Utils.isMobileDevice();
};

Graphics._createErrorPrinter = function() {
    this._errorPrinter = document.createElement("div");
    this._errorPrinter.id = "errorPrinter";
    this._errorPrinter.innerHTML = this._makeErrorHtml();
    document.body.appendChild(this._errorPrinter);
};

Graphics._updateErrorPrinter = function() {
    const width = this._width * 0.8 * this._realScale;
    const height = 100 * this._realScale;
    this._errorPrinter.style.width = width + "px";
    this._errorPrinter.style.height = height + "px";
};

Graphics._createCanvas = function() {
    this._canvas = document.createElement("canvas");
    this._canvas.id = "gameCanvas";
    this._updateCanvas();
    document.body.appendChild(this._canvas);
};

Graphics._updateCanvas = function() {
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._canvas.style.zIndex = 1;
    this._centerElement(this._canvas);
};

Graphics._updateVideo = function() {
    const width = this._width * this._realScale;
    const height = this._height * this._realScale;
    Video.resize(width, height);
};

Graphics._createLoadingSpinner = function() {
    const loadingSpinner = document.createElement("div");
    const loadingSpinnerImage = document.createElement("div");
    loadingSpinner.id = "loadingSpinner";
    loadingSpinnerImage.id = "loadingSpinnerImage";
    loadingSpinner.appendChild(loadingSpinnerImage);
    this._loadingSpinner = loadingSpinner;
};

Graphics._createFPSCounter = function() {
    this._fpsCounter = new Graphics.FPSCounter();
};

Graphics._centerElement = function(element) {
    const width = element.width * this._realScale;
    const height = element.height * this._realScale;
    element.style.position = "absolute";
    element.style.margin = "auto";
    element.style.top = 0;
    element.style.left = 0;
    element.style.right = 0;
    element.style.bottom = 0;
    element.style.width = width + "px";
    element.style.height = height + "px";
};

Graphics._disableContextMenu = function() {
    const elements = document.body.getElementsByTagName("*");
    const oncontextmenu = () => false;
    for (const element of elements) {
        element.oncontextmenu = oncontextmenu;
    }
};

Graphics._applyCanvasFilter = function() {
    if (this._canvas) {
        this._canvas.style.opacity = 0.5;
        this._canvas.style.filter = "blur(8px)";
        this._canvas.style.webkitFilter = "blur(8px)";
    }
};

Graphics._clearCanvasFilter = function() {
    if (this._canvas) {
        this._canvas.style.opacity = 1;
        this._canvas.style.filter = "";
        this._canvas.style.webkitFilter = "";
    }
};

Graphics._setupEventHandlers = function() {
    window.addEventListener("resize", this._onWindowResize.bind(this));
    document.addEventListener("keydown", this._onKeyDown.bind(this));
};

Graphics._onWindowResize = function() {
    this._updateAllElements();
};

Graphics._onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
            case 113: // F2
                event.preventDefault();
                this._switchFPSCounter();
                break;
            case 114: // F3
                event.preventDefault();
                this._switchStretchMode();
                break;
            case 115: // F4
                event.preventDefault();
                this._switchFullScreen();
                break;
        }
    }
};

Graphics._switchFPSCounter = function() {
    this._fpsCounter.switchMode();
};

Graphics._switchStretchMode = function() {
    this._stretchEnabled = !this._stretchEnabled;
    this._updateAllElements();
};

Graphics._switchFullScreen = function() {
    if (this._isFullScreen()) {
        this._cancelFullScreen();
    } else {
        this._requestFullScreen();
    }
};

Graphics._isFullScreen = function() {
    return (
        document.fullScreenElement ||
        document.mozFullScreen ||
        document.webkitFullscreenElement
    );
};

Graphics._requestFullScreen = function() {
    const element = document.body;
    if (element.requestFullScreen) {
        element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
};

Graphics._cancelFullScreen = function() {
    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
};

Graphics._createPixiApp = function() {
    try {
        this._setupPixi();
        this._app = new PIXI.Application({
            view: this._canvas,
            autoStart: false
        });
        this._app.ticker.remove(this._app.render, this._app);
        this._app.ticker.add(this._onTick, this);
    } catch (e) {
        this._app = null;
    }
};

Graphics._setupPixi = function() {
    PIXI.utils.skipHello();
    PIXI.settings.GC_MAX_IDLE = 600;
};

Graphics._createEffekseerContext = function() {
    if (this._app && window.effekseer) {
        try {
            this._effekseer = effekseer.createContext();
            if (this._effekseer) {
                this._effekseer.init(this._app.renderer.gl);
                this._effekseer.setRestorationOfStatesFlag(false);
            }
        } catch (e) {
            this._app = null;
        }
    }
};

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// FPSCounter
//
// This is based on Darsain's FPSMeter which is under the MIT license.
// The original can be found at https://github.com/Darsain/fpsmeter.

Graphics.FPSCounter = function() {
    this.initialize(...arguments);
};

Graphics.FPSCounter.prototype.initialize = function() {
    this._tickCount = 0;
    this._frameTime = 100;
    this._frameStart = 0;
    this._lastLoop = performance.now() - 100;
    this._showFps = true;
    this.fps = 0;
    this.duration = 0;
    this._createElements();
    this._update();
};

Graphics.FPSCounter.prototype.startTick = function() {
    this._frameStart = performance.now();
};

Graphics.FPSCounter.prototype.endTick = function() {
    const time = performance.now();
    const thisFrameTime = time - this._lastLoop;
    this._frameTime += (thisFrameTime - this._frameTime) / 12;
    this.fps = 1000 / this._frameTime;
    this.duration = Math.max(0, time - this._frameStart);
    this._lastLoop = time;
    if (this._tickCount++ % 15 === 0) {
        this._update();
    }
};

Graphics.FPSCounter.prototype.switchMode = function() {
    if (this._boxDiv.style.display === "none") {
        this._boxDiv.style.display = "block";
        this._showFps = true;
    } else if (this._showFps) {
        this._showFps = false;
    } else {
        this._boxDiv.style.display = "none";
    }
    this._update();
};

Graphics.FPSCounter.prototype._createElements = function() {
    this._boxDiv = document.createElement("div");
    this._labelDiv = document.createElement("div");
    this._numberDiv = document.createElement("div");
    this._boxDiv.id = "fpsCounterBox";
    this._labelDiv.id = "fpsCounterLabel";
    this._numberDiv.id = "fpsCounterNumber";
    this._boxDiv.style.display = "none";
    this._boxDiv.appendChild(this._labelDiv);
    this._boxDiv.appendChild(this._numberDiv);
    document.body.appendChild(this._boxDiv);
};

Graphics.FPSCounter.prototype._update = function() {
    const count = this._showFps ? this.fps : this.duration;
    this._labelDiv.textContent = this._showFps ? "FPS" : "ms";
    this._numberDiv.textContent = count.toFixed(0);
};

//-----------------------------------------------------------------------------
/**
 * The point class.
 *
 * @class
 * @extends PIXI.Point
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 */
function Point() {
    this.initialize(...arguments);
}

Point.prototype = Object.create(PIXI.Point.prototype);
Point.prototype.constructor = Point;

Point.prototype.initialize = function(x, y) {
    PIXI.Point.call(this, x, y);
};

//-----------------------------------------------------------------------------
/**
 * The rectangle class.
 *
 * @class
 * @extends PIXI.Rectangle
 * @param {number} x - The x coordinate for the upper-left corner.
 * @param {number} y - The y coordinate for the upper-left corner.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 */
function Rectangle() {
    this.initialize(...arguments);
}

Rectangle.prototype = Object.create(PIXI.Rectangle.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initialize = function(x, y, width, height) {
    PIXI.Rectangle.call(this, x, y, width, height);
};

//-----------------------------------------------------------------------------
/**
 * The basic object that represents an image.
 *
 * @class
 * @param {number} width - The width of the bitmap.
 * @param {number} height - The height of the bitmap.
 */
function Bitmap() {
    this.initialize(...arguments);
}

Bitmap.prototype.initialize = function(width, height) {
    this._canvas = null;
    this._context = null;
    this._baseTexture = null;
    this._image = null;
    this._url = "";
    this._paintOpacity = 255;
    this._smooth = true;
    this._loadListeners = [];

    // "none", "loading", "loaded", or "error"
    this._loadingState = "none";

    if (width > 0 && height > 0) {
        this._createCanvas(width, height);
    }

    /**
     * The face name of the font.
     *
     * @type string
     */
    this.fontFace = "sans-serif";

    /**
     * The size of the font in pixels.
     *
     * @type number
     */
    this.fontSize = 16;

    /**
     * Whether the font is bold.
     *
     * @type boolean
     */
    this.fontBold = false;

    /**
     * Whether the font is italic.
     *
     * @type boolean
     */
    this.fontItalic = false;

    /**
     * The color of the text in CSS format.
     *
     * @type string
     */
    this.textColor = "#ffffff";

    /**
     * The color of the outline of the text in CSS format.
     *
     * @type string
     */
    this.outlineColor = "rgba(0, 0, 0, 0.5)";

    /**
     * The width of the outline of the text.
     *
     * @type number
     */
    this.outlineWidth = 3;
};

/**
 * Loads a image file.
 *
 * @param {string} url - The image url of the texture.
 * @returns {Bitmap} The new bitmap object.
 */
Bitmap.load = function(url) {
    const bitmap = Object.create(Bitmap.prototype);
    bitmap.initialize();
    bitmap._url = url;
    bitmap._startLoading();
    return bitmap;
};

/**
 * Takes a snapshot of the game screen.
 *
 * @param {Stage} stage - The stage object.
 * @returns {Bitmap} The new bitmap object.
 */
Bitmap.snap = function(stage) {
    const width = Graphics.width;
    const height = Graphics.height;
    const bitmap = new Bitmap(width, height);
    const renderTexture = PIXI.RenderTexture.create(width, height);
    if (stage) {
        const renderer = Graphics.app.renderer;
        renderer.render(stage, renderTexture);
        stage.worldTransform.identity();
        const canvas = renderer.extract.canvas(renderTexture);
        bitmap.context.drawImage(canvas, 0, 0);
        canvas.width = 0;
        canvas.height = 0;
    }
    renderTexture.destroy({ destroyBase: true });
    bitmap.baseTexture.update();
    return bitmap;
};

/**
 * Checks whether the bitmap is ready to render.
 *
 * @returns {boolean} True if the bitmap is ready to render.
 */
Bitmap.prototype.isReady = function() {
    return this._loadingState === "loaded" || this._loadingState === "none";
};

/**
 * Checks whether a loading error has occurred.
 *
 * @returns {boolean} True if a loading error has occurred.
 */
Bitmap.prototype.isError = function() {
    return this._loadingState === "error";
};

/**
 * The url of the image file.
 *
 * @readonly
 * @type string
 * @name Bitmap#url
 */
Object.defineProperty(Bitmap.prototype, "url", {
    get: function() {
        return this._url;
    },
    configurable: true
});

/**
 * The base texture that holds the image.
 *
 * @readonly
 * @type PIXI.BaseTexture
 * @name Bitmap#baseTexture
 */
Object.defineProperty(Bitmap.prototype, "baseTexture", {
    get: function() {
        return this._baseTexture;
    },
    configurable: true
});

/**
 * The bitmap image.
 *
 * @readonly
 * @type HTMLImageElement
 * @name Bitmap#image
 */
Object.defineProperty(Bitmap.prototype, "image", {
    get: function() {
        return this._image;
    },
    configurable: true
});

/**
 * The bitmap canvas.
 *
 * @readonly
 * @type HTMLCanvasElement
 * @name Bitmap#canvas
 */
Object.defineProperty(Bitmap.prototype, "canvas", {
    get: function() {
        this._ensureCanvas();
        return this._canvas;
    },
    configurable: true
});

/**
 * The 2d context of the bitmap canvas.
 *
 * @readonly
 * @type CanvasRenderingContext2D
 * @name Bitmap#context
 */
Object.defineProperty(Bitmap.prototype, "context", {
    get: function() {
        this._ensureCanvas();
        return this._context;
    },
    configurable: true
});

/**
 * The width of the bitmap.
 *
 * @readonly
 * @type number
 * @name Bitmap#width
 */
Object.defineProperty(Bitmap.prototype, "width", {
    get: function() {
        const image = this._canvas || this._image;
        return image ? image.width : 0;
    },
    configurable: true
});

/**
 * The height of the bitmap.
 *
 * @readonly
 * @type number
 * @name Bitmap#height
 */
Object.defineProperty(Bitmap.prototype, "height", {
    get: function() {
        const image = this._canvas || this._image;
        return image ? image.height : 0;
    },
    configurable: true
});

/**
 * The rectangle of the bitmap.
 *
 * @readonly
 * @type Rectangle
 * @name Bitmap#rect
 */
Object.defineProperty(Bitmap.prototype, "rect", {
    get: function() {
        return new Rectangle(0, 0, this.width, this.height);
    },
    configurable: true
});

/**
 * Whether the smooth scaling is applied.
 *
 * @type boolean
 * @name Bitmap#smooth
 */
Object.defineProperty(Bitmap.prototype, "smooth", {
    get: function() {
        return this._smooth;
    },
    set: function(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            this._updateScaleMode();
        }
    },
    configurable: true
});

/**
 * The opacity of the drawing object in the range (0, 255).
 *
 * @type number
 * @name Bitmap#paintOpacity
 */
Object.defineProperty(Bitmap.prototype, "paintOpacity", {
    get: function() {
        return this._paintOpacity;
    },
    set: function(value) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this.context.globalAlpha = this._paintOpacity / 255;
        }
    },
    configurable: true
});

/**
 * Destroys the bitmap.
 */
Bitmap.prototype.destroy = function() {
    if (this._baseTexture) {
        this._baseTexture.destroy();
        this._baseTexture = null;
    }
    this._destroyCanvas();
};

/**
 * Resizes the bitmap.
 *
 * @param {number} width - The new width of the bitmap.
 * @param {number} height - The new height of the bitmap.
 */
Bitmap.prototype.resize = function(width, height) {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this.canvas.width = width;
    this.canvas.height = height;
    this.baseTexture.width = width;
    this.baseTexture.height = height;
};

/**
 * Performs a block transfer.
 *
 * @param {Bitmap} source - The bitmap to draw.
 * @param {number} sx - The x coordinate in the source.
 * @param {number} sy - The y coordinate in the source.
 * @param {number} sw - The width of the source image.
 * @param {number} sh - The height of the source image.
 * @param {number} dx - The x coordinate in the destination.
 * @param {number} dy - The y coordinate in the destination.
 * @param {number} [dw=sw] The width to draw the image in the destination.
 * @param {number} [dh=sh] The height to draw the image in the destination.
 */
Bitmap.prototype.blt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    try {
        const image = source._canvas || source._image;
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        this._baseTexture.update();
    } catch (e) {
        //
    }
};

/**
 * Returns pixel color at the specified point.
 *
 * @param {number} x - The x coordinate of the pixel in the bitmap.
 * @param {number} y - The y coordinate of the pixel in the bitmap.
 * @returns {string} The pixel color (hex format).
 */
Bitmap.prototype.getPixel = function(x, y) {
    const data = this.context.getImageData(x, y, 1, 1).data;
    let result = "#";
    for (let i = 0; i < 3; i++) {
        result += data[i].toString(16).padZero(2);
    }
    return result;
};

/**
 * Returns alpha pixel value at the specified point.
 *
 * @param {number} x - The x coordinate of the pixel in the bitmap.
 * @param {number} y - The y coordinate of the pixel in the bitmap.
 * @returns {string} The alpha value.
 */
Bitmap.prototype.getAlphaPixel = function(x, y) {
    const data = this.context.getImageData(x, y, 1, 1).data;
    return data[3];
};

/**
 * Clears the specified rectangle.
 *
 * @param {number} x - The x coordinate for the upper-left corner.
 * @param {number} y - The y coordinate for the upper-left corner.
 * @param {number} width - The width of the rectangle to clear.
 * @param {number} height - The height of the rectangle to clear.
 */
Bitmap.prototype.clearRect = function(x, y, width, height) {
    this.context.clearRect(x, y, width, height);
    this._baseTexture.update();
};

/**
 * Clears the entire bitmap.
 */
Bitmap.prototype.clear = function() {
    this.clearRect(0, 0, this.width, this.height);
};

/**
 * Fills the specified rectangle.
 *
 * @param {number} x - The x coordinate for the upper-left corner.
 * @param {number} y - The y coordinate for the upper-left corner.
 * @param {number} width - The width of the rectangle to fill.
 * @param {number} height - The height of the rectangle to fill.
 * @param {string} color - The color of the rectangle in CSS format.
 */
Bitmap.prototype.fillRect = function(x, y, width, height, color) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
};

/**
 * Fills the entire bitmap.
 *
 * @param {string} color - The color of the rectangle in CSS format.
 */
Bitmap.prototype.fillAll = function(color) {
    this.fillRect(0, 0, this.width, this.height, color);
};

/**
 * Draws the specified rectangular frame.
 *
 * @param {number} x - The x coordinate for the upper-left corner.
 * @param {number} y - The y coordinate for the upper-left corner.
 * @param {number} width - The width of the rectangle to fill.
 * @param {number} height - The height of the rectangle to fill.
 * @param {string} color - The color of the rectangle in CSS format.
 */
Bitmap.prototype.strokeRect = function(x, y, width, height, color) {
    const context = this.context;
    context.save();
    context.strokeStyle = color;
    context.strokeRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
};

// prettier-ignore
/**
 * Draws the rectangle with a gradation.
 *
 * @param {number} x - The x coordinate for the upper-left corner.
 * @param {number} y - The y coordinate for the upper-left corner.
 * @param {number} width - The width of the rectangle to fill.
 * @param {number} height - The height of the rectangle to fill.
 * @param {string} color1 - The gradient starting color.
 * @param {string} color2 - The gradient ending color.
 * @param {boolean} vertical - Whether the gradient should be draw as vertical or not.
 */
Bitmap.prototype.gradientFillRect = function(
    x, y, width, height, color1, color2, vertical
) {
    const context = this.context;
    const x1 = vertical ? x : x + width;
    const y1 = vertical ? y + height : y;
    const grad = context.createLinearGradient(x, y, x1, y1);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    context.save();
    context.fillStyle = grad;
    context.fillRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
};

/**
 * Draws a bitmap in the shape of a circle.
 *
 * @param {number} x - The x coordinate based on the circle center.
 * @param {number} y - The y coordinate based on the circle center.
 * @param {number} radius - The radius of the circle.
 * @param {string} color - The color of the circle in CSS format.
 */
Bitmap.prototype.drawCircle = function(x, y, radius, color) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
    this._baseTexture.update();
};

/**
 * Draws the outline text to the bitmap.
 *
 * @param {string} text - The text that will be drawn.
 * @param {number} x - The x coordinate for the left of the text.
 * @param {number} y - The y coordinate for the top of the text.
 * @param {number} maxWidth - The maximum allowed width of the text.
 * @param {number} lineHeight - The height of the text line.
 * @param {string} align - The alignment of the text.
 */
Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
    // [Note] Different browser makes different rendering with
    //   textBaseline == 'top'. So we use 'alphabetic' here.
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;
    let tx = x;
    let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
    if (align === "center") {
        tx += maxWidth / 2;
    }
    if (align === "right") {
        tx += maxWidth;
    }
    context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align;
    context.textBaseline = "alphabetic";
    context.globalAlpha = 1;
    this._drawTextOutline(text, tx, ty, maxWidth);
    context.globalAlpha = alpha;
    this._drawTextBody(text, tx, ty, maxWidth);
    context.restore();
    this._baseTexture.update();
};

/**
 * Returns the width of the specified text.
 *
 * @param {string} text - The text to be measured.
 * @returns {number} The width of the text in pixels.
 */
Bitmap.prototype.measureTextWidth = function(text) {
    const context = this.context;
    context.save();
    context.font = this._makeFontNameText();
    const width = context.measureText(text).width;
    context.restore();
    return width;
};

/**
 * Adds a callback function that will be called when the bitmap is loaded.
 *
 * @param {function} listner - The callback function.
 */
Bitmap.prototype.addLoadListener = function(listner) {
    if (!this.isReady()) {
        this._loadListeners.push(listner);
    } else {
        listner(this);
    }
};

/**
 * Tries to load the image again.
 */
Bitmap.prototype.retry = function() {
    this._startLoading();
};

Bitmap.prototype._makeFontNameText = function() {
    const italic = this.fontItalic ? "Italic " : "";
    const bold = this.fontBold ? "Bold " : "";
    return italic + bold + this.fontSize + "px " + this.fontFace;
};

Bitmap.prototype._drawTextOutline = function(text, tx, ty, maxWidth) {
    const context = this.context;
    context.strokeStyle = this.outlineColor;
    context.lineWidth = this.outlineWidth;
    context.lineJoin = "round";
    context.strokeText(text, tx, ty, maxWidth);
};

Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth) {
    const context = this.context;
    context.fillStyle = this.textColor;
    context.fillText(text, tx, ty, maxWidth);
};

Bitmap.prototype._createCanvas = function(width, height) {
    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext("2d");
    this._canvas.width = width;
    this._canvas.height = height;
    this._createBaseTexture(this._canvas);
};

Bitmap.prototype._ensureCanvas = function() {
    if (!this._canvas) {
        if (this._image) {
            this._createCanvas(this._image.width, this._image.height);
            this._context.drawImage(this._image, 0, 0);
        } else {
            this._createCanvas(0, 0);
        }
    }
};

Bitmap.prototype._destroyCanvas = function() {
    if (this._canvas) {
        this._canvas.width = 0;
        this._canvas.height = 0;
        this._canvas = null;
    }
};

Bitmap.prototype._createBaseTexture = function(source) {
    this._baseTexture = new PIXI.BaseTexture(source);
    this._baseTexture.mipmap = false;
    this._baseTexture.width = source.width;
    this._baseTexture.height = source.height;
    this._updateScaleMode();
};

Bitmap.prototype._updateScaleMode = function() {
    if (this._baseTexture) {
        if (this._smooth) {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        } else {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
    }
};

Bitmap.prototype._startLoading = function() {
    this._image = new Image();
    this._image.onload = this._onLoad.bind(this);
    this._image.onerror = this._onError.bind(this);
    this._destroyCanvas();
    this._loadingState = "loading";
    if (Utils.hasEncryptedImages()) {
        this._startDecrypting();
    } else {
        this._image.src = this._url;
        if (this._image.width > 0) {
            this._image.onload = null;
            this._onLoad();
        }
    }
};

Bitmap.prototype._startDecrypting = function() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", this._url + "_");
    xhr.responseType = "arraybuffer";
    xhr.onload = () => this._onXhrLoad(xhr);
    xhr.onerror = this._onError.bind(this);
    xhr.send();
};

Bitmap.prototype._onXhrLoad = function(xhr) {
    if (xhr.status < 400) {
        const arrayBuffer = Utils.decryptArrayBuffer(xhr.response);
        const blob = new Blob([arrayBuffer]);
        this._image.src = URL.createObjectURL(blob);
    } else {
        this._onError();
    }
};

Bitmap.prototype._onLoad = function() {
    if (Utils.hasEncryptedImages()) {
        URL.revokeObjectURL(this._image.src);
    }
    this._loadingState = "loaded";
    this._createBaseTexture(this._image);
    this._callLoadListeners();
};

Bitmap.prototype._callLoadListeners = function() {
    while (this._loadListeners.length > 0) {
        const listener = this._loadListeners.shift();
        listener(this);
    }
};

Bitmap.prototype._onError = function() {
    this._loadingState = "error";
};

//-----------------------------------------------------------------------------
/**
 * The basic object that is rendered to the game screen.
 *
 * @class
 * @extends PIXI.Sprite
 * @param {Bitmap} bitmap - The image for the sprite.
 */
function Sprite() {
    this.initialize(...arguments);
}

Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.initialize = function(bitmap) {
    if (!Sprite._emptyBaseTexture) {
        Sprite._emptyBaseTexture = new PIXI.BaseTexture();
        Sprite._emptyBaseTexture.setSize(1, 1);
    }
    const frame = new Rectangle();
    const texture = new PIXI.Texture(Sprite._emptyBaseTexture, frame);
    PIXI.Sprite.call(this, texture);
    this.spriteId = Sprite._counter++;
    this._bitmap = bitmap;
    this._frame = frame;
    this._hue = 0;
    this._blendColor = [0, 0, 0, 0];
    this._colorTone = [0, 0, 0, 0];
    this._colorFilter = null;
    this._blendMode = PIXI.BLEND_MODES.NORMAL;
    this._hidden = false;
    this._onBitmapChange();
};

Sprite._emptyBaseTexture = null;
Sprite._counter = 0;

/**
 * The image for the sprite.
 *
 * @type Bitmap
 * @name Sprite#bitmap
 */
Object.defineProperty(Sprite.prototype, "bitmap", {
    get: function() {
        return this._bitmap;
    },
    set: function(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    },
    configurable: true
});

/**
 * The width of the sprite without the scale.
 *
 * @type number
 * @name Sprite#width
 */
Object.defineProperty(Sprite.prototype, "width", {
    get: function() {
        return this._frame.width;
    },
    set: function(value) {
        this._frame.width = value;
        this._refresh();
    },
    configurable: true
});

/**
 * The height of the sprite without the scale.
 *
 * @type number
 * @name Sprite#height
 */
Object.defineProperty(Sprite.prototype, "height", {
    get: function() {
        return this._frame.height;
    },
    set: function(value) {
        this._frame.height = value;
        this._refresh();
    },
    configurable: true
});

/**
 * The opacity of the sprite (0 to 255).
 *
 * @type number
 * @name Sprite#opacity
 */
Object.defineProperty(Sprite.prototype, "opacity", {
    get: function() {
        return this.alpha * 255;
    },
    set: function(value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * The blend mode to be applied to the sprite.
 *
 * @type number
 * @name Sprite#blendMode
 */
Object.defineProperty(Sprite.prototype, "blendMode", {
    get: function() {
        if (this._colorFilter) {
            return this._colorFilter.blendMode;
        } else {
            return this._blendMode;
        }
    },
    set: function(value) {
        this._blendMode = value;
        if (this._colorFilter) {
            this._colorFilter.blendMode = value;
        }
    },
    configurable: true
});

/**
 * Destroys the sprite.
 */
Sprite.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Sprite.prototype.destroy.call(this, options);
};

/**
 * Updates the sprite for each frame.
 */
Sprite.prototype.update = function() {
    for (const child of this.children) {
        if (child.update) {
            child.update();
        }
    }
};

/**
 * Makes the sprite "hidden".
 */
Sprite.prototype.hide = function() {
    this._hidden = true;
    this.updateVisibility();
};

/**
 * Releases the "hidden" state of the sprite.
 */
Sprite.prototype.show = function() {
    this._hidden = false;
    this.updateVisibility();
};

/**
 * Reflects the "hidden" state of the sprite to the visible state.
 */
Sprite.prototype.updateVisibility = function() {
    this.visible = !this._hidden;
};

/**
 * Sets the x and y at once.
 *
 * @param {number} x - The x coordinate of the sprite.
 * @param {number} y - The y coordinate of the sprite.
 */
Sprite.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Sets the rectagle of the bitmap that the sprite displays.
 *
 * @param {number} x - The x coordinate of the frame.
 * @param {number} y - The y coordinate of the frame.
 * @param {number} width - The width of the frame.
 * @param {number} height - The height of the frame.
 */
Sprite.prototype.setFrame = function(x, y, width, height) {
    this._refreshFrame = false;
    const frame = this._frame;
    if (
        x !== frame.x ||
        y !== frame.y ||
        width !== frame.width ||
        height !== frame.height
    ) {
        frame.x = x;
        frame.y = y;
        frame.width = width;
        frame.height = height;
        this._refresh();
    }
};

/**
 * Sets the hue rotation value.
 *
 * @param {number} hue - The hue value (-360, 360).
 */
Sprite.prototype.setHue = function(hue) {
    if (this._hue !== Number(hue)) {
        this._hue = Number(hue);
        this._updateColorFilter();
    }
};

/**
 * Gets the blend color for the sprite.
 *
 * @returns {array} The blend color [r, g, b, a].
 */
Sprite.prototype.getBlendColor = function() {
    return this._blendColor.clone();
};

/**
 * Sets the blend color for the sprite.
 *
 * @param {array} color - The blend color [r, g, b, a].
 */
Sprite.prototype.setBlendColor = function(color) {
    if (!(color instanceof Array)) {
        throw new Error("Argument must be an array");
    }
    if (!this._blendColor.equals(color)) {
        this._blendColor = color.clone();
        this._updateColorFilter();
    }
};

/**
 * Gets the color tone for the sprite.
 *
 * @returns {array} The color tone [r, g, b, gray].
 */
Sprite.prototype.getColorTone = function() {
    return this._colorTone.clone();
};

/**
 * Sets the color tone for the sprite.
 *
 * @param {array} tone - The color tone [r, g, b, gray].
 */
Sprite.prototype.setColorTone = function(tone) {
    if (!(tone instanceof Array)) {
        throw new Error("Argument must be an array");
    }
    if (!this._colorTone.equals(tone)) {
        this._colorTone = tone.clone();
        this._updateColorFilter();
    }
};

Sprite.prototype._onBitmapChange = function() {
    if (this._bitmap) {
        this._refreshFrame = true;
        this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
    } else {
        this._refreshFrame = false;
        this.texture.frame = new Rectangle();
    }
};

Sprite.prototype._onBitmapLoad = function(bitmapLoaded) {
    if (bitmapLoaded === this._bitmap) {
        if (this._refreshFrame && this._bitmap) {
            this._refreshFrame = false;
            this._frame.width = this._bitmap.width;
            this._frame.height = this._bitmap.height;
        }
    }
    this._refresh();
};

Sprite.prototype._refresh = function() {
    const texture = this.texture;
    const frameX = Math.floor(this._frame.x);
    const frameY = Math.floor(this._frame.y);
    const frameW = Math.floor(this._frame.width);
    const frameH = Math.floor(this._frame.height);
    const baseTexture = this._bitmap ? this._bitmap.baseTexture : null;
    const baseTextureW = baseTexture ? baseTexture.width : 0;
    const baseTextureH = baseTexture ? baseTexture.height : 0;
    const realX = frameX.clamp(0, baseTextureW);
    const realY = frameY.clamp(0, baseTextureH);
    const realW = (frameW - realX + frameX).clamp(0, baseTextureW - realX);
    const realH = (frameH - realY + frameY).clamp(0, baseTextureH - realY);
    const frame = new Rectangle(realX, realY, realW, realH);
    if (texture) {
        this.pivot.x = frameX - realX;
        this.pivot.y = frameY - realY;
        if (baseTexture) {
            texture.baseTexture = baseTexture;
            try {
                texture.frame = frame;
            } catch (e) {
                texture.frame = new Rectangle();
            }
        }
        texture._updateID++;
    }
};

Sprite.prototype._createColorFilter = function() {
    this._colorFilter = new ColorFilter();
    if (!this.filters) {
        this.filters = [];
    }
    this.filters.push(this._colorFilter);
};

Sprite.prototype._updateColorFilter = function() {
    if (!this._colorFilter) {
        this._createColorFilter();
    }
    this._colorFilter.setHue(this._hue);
    this._colorFilter.setBlendColor(this._blendColor);
    this._colorFilter.setColorTone(this._colorTone);
};

//-----------------------------------------------------------------------------
/**
 * The tilemap which displays 2D tile-based game map.
 *
 * @class
 * @extends PIXI.Container
 */
function Tilemap() {
    this.initialize(...arguments);
}

Tilemap.prototype = Object.create(PIXI.Container.prototype);
Tilemap.prototype.constructor = Tilemap;

Tilemap.prototype.initialize = function() {
    PIXI.Container.call(this);

    this._width = Graphics.width;
    this._height = Graphics.height;
    this._margin = 20;
    this._mapWidth = 0;
    this._mapHeight = 0;
    this._mapData = null;
    this._bitmaps = [];

    /**
     * The width of each tile.
     *
     * @type number
     */
    this.tileWidth = 48;

    /**
     * The height of each tile.
     *
     * @type number
     */
    this.tileHeight = 48;

    /**
     * The origin point of the tilemap for scrolling.
     *
     * @type Point
     */
    this.origin = new Point();

    /**
     * The tileset flags.
     *
     * @type array
     */
    this.flags = [];

    /**
     * The animation count for autotiles.
     *
     * @type number
     */
    this.animationCount = 0;

    /**
     * Whether the tilemap loops horizontal.
     *
     * @type boolean
     */
    this.horizontalWrap = false;

    /**
     * Whether the tilemap loops vertical.
     *
     * @type boolean
     */
    this.verticalWrap = false;

    this._createLayers();
    this.refresh();
};

/**
 * The width of the tilemap.
 *
 * @type number
 * @name Tilemap#width
 */
Object.defineProperty(Tilemap.prototype, "width", {
    get: function() {
        return this._width;
    },
    set: function(value) {
        this._width = value;
    },
    configurable: true
});

/**
 * The height of the tilemap.
 *
 * @type number
 * @name Tilemap#height
 */
Object.defineProperty(Tilemap.prototype, "height", {
    get: function() {
        return this._height;
    },
    set: function(value) {
        this._height = value;
    },
    configurable: true
});

/**
 * Destroys the tilemap.
 */
Tilemap.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Container.prototype.destroy.call(this, options);
};

/**
 * Sets the tilemap data.
 *
 * @param {number} width - The width of the map in number of tiles.
 * @param {number} height - The height of the map in number of tiles.
 * @param {array} data - The one dimensional array for the map data.
 */
Tilemap.prototype.setData = function(width, height, data) {
    this._mapWidth = width;
    this._mapHeight = height;
    this._mapData = data;
};

/**
 * Checks whether the tileset is ready to render.
 *
 * @type boolean
 * @returns {boolean} True if the tilemap is ready.
 */
Tilemap.prototype.isReady = function() {
    for (const bitmap of this._bitmaps) {
        if (bitmap && !bitmap.isReady()) {
            return false;
        }
    }
    return true;
};

/**
 * Updates the tilemap for each frame.
 */
Tilemap.prototype.update = function() {
    this.animationCount++;
    this.animationFrame = Math.floor(this.animationCount / 30);
    for (const child of this.children) {
        if (child.update) {
            child.update();
        }
    }
};

/**
 * Sets the bitmaps used as a tileset.
 *
 * @param {array} bitmaps - The array of the tileset bitmaps.
 */
Tilemap.prototype.setBitmaps = function(bitmaps) {
    // [Note] We wait for the images to finish loading. Creating textures
    //   from bitmaps that are not yet loaded here brings some maintenance
    //   difficulties. e.g. PIXI overwrites img.onload internally.
    this._bitmaps = bitmaps;
    const listener = this._updateBitmaps.bind(this);
    for (const bitmap of this._bitmaps) {
        if (!bitmap.isReady()) {
            bitmap.addLoadListener(listener);
        }
    }
    this._needsBitmapsUpdate = true;
    this._updateBitmaps();
};

/**
 * Forces to repaint the entire tilemap.
 */
Tilemap.prototype.refresh = function() {
    this._needsRepaint = true;
};

/**
 * Updates the transform on all children of this container for rendering.
 */
Tilemap.prototype.updateTransform = function() {
    const ox = Math.ceil(this.origin.x);
    const oy = Math.ceil(this.origin.y);
    const startX = Math.floor((ox - this._margin) / this.tileWidth);
    const startY = Math.floor((oy - this._margin) / this.tileHeight);
    this._lowerLayer.x = startX * this.tileWidth - ox;
    this._lowerLayer.y = startY * this.tileHeight - oy;
    this._upperLayer.x = startX * this.tileWidth - ox;
    this._upperLayer.y = startY * this.tileHeight - oy;
    if (
        this._needsRepaint ||
        this._lastAnimationFrame !== this.animationFrame ||
        this._lastStartX !== startX ||
        this._lastStartY !== startY
    ) {
        this._lastAnimationFrame = this.animationFrame;
        this._lastStartX = startX;
        this._lastStartY = startY;
        this._addAllSpots(startX, startY);
        this._needsRepaint = false;
    }
    this._sortChildren();
    PIXI.Container.prototype.updateTransform.call(this);
};

Tilemap.prototype._createLayers = function() {
    /*
     * [Z coordinate]
     *  0 : Lower tiles
     *  1 : Lower characters
     *  3 : Normal characters
     *  4 : Upper tiles
     *  5 : Upper characters
     *  6 : Airship shadow
     *  7 : Balloon
     *  8 : Animation
     *  9 : Destination
     */
    this._lowerLayer = new Tilemap.CombinedLayer();
    this._lowerLayer.z = 0;
    this._upperLayer = new Tilemap.CombinedLayer();
    this._upperLayer.z = 4;
    this.addChild(this._lowerLayer);
    this.addChild(this._upperLayer);
    this._needsRepaint = true;
};

Tilemap.prototype._updateBitmaps = function() {
    if (this._needsBitmapsUpdate && this.isReady()) {
        this._lowerLayer.setBitmaps(this._bitmaps);
        this._needsBitmapsUpdate = false;
        this._needsRepaint = true;
    }
};

Tilemap.prototype._addAllSpots = function(startX, startY) {
    this._lowerLayer.clear();
    this._upperLayer.clear();
    const widthWithMatgin = this.width + this._margin * 2;
    const heightWithMatgin = this.height + this._margin * 2;
    const tileCols = Math.ceil(widthWithMatgin / this.tileWidth) + 1;
    const tileRows = Math.ceil(heightWithMatgin / this.tileHeight) + 1;
    for (let y = 0; y < tileRows; y++) {
        for (let x = 0; x < tileCols; x++) {
            this._addSpot(startX, startY, x, y);
        }
    }
};

Tilemap.prototype._addSpot = function(startX, startY, x, y) {
    const mx = startX + x;
    const my = startY + y;
    const dx = x * this.tileWidth;
    const dy = y * this.tileHeight;
    const tileId0 = this._readMapData(mx, my, 0);
    const tileId1 = this._readMapData(mx, my, 1);
    const tileId2 = this._readMapData(mx, my, 2);
    const tileId3 = this._readMapData(mx, my, 3);
    const shadowBits = this._readMapData(mx, my, 4);
    const upperTileId1 = this._readMapData(mx, my - 1, 1);

    this._addSpotTile(tileId0, dx, dy);
    this._addSpotTile(tileId1, dx, dy);
    this._addShadow(this._lowerLayer, shadowBits, dx, dy);
    if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
        if (!Tilemap.isShadowingTile(tileId0)) {
            this._addTableEdge(this._lowerLayer, upperTileId1, dx, dy);
        }
    }
    if (this._isOverpassPosition(mx, my)) {
        this._addTile(this._upperLayer, tileId2, dx, dy);
        this._addTile(this._upperLayer, tileId3, dx, dy);
    } else {
        this._addSpotTile(tileId2, dx, dy);
        this._addSpotTile(tileId3, dx, dy);
    }
};

Tilemap.prototype._addSpotTile = function(tileId, dx, dy) {
    if (this._isHigherTile(tileId)) {
        this._addTile(this._upperLayer, tileId, dx, dy);
    } else {
        this._addTile(this._lowerLayer, tileId, dx, dy);
    }
};

Tilemap.prototype._addTile = function(layer, tileId, dx, dy) {
    if (Tilemap.isVisibleTile(tileId)) {
        if (Tilemap.isAutotile(tileId)) {
            this._addAutotile(layer, tileId, dx, dy);
        } else {
            this._addNormalTile(layer, tileId, dx, dy);
        }
    }
};

Tilemap.prototype._addNormalTile = function(layer, tileId, dx, dy) {
    let setNumber = 0;

    if (Tilemap.isTileA5(tileId)) {
        setNumber = 4;
    } else {
        setNumber = 5 + Math.floor(tileId / 256);
    }

    const w = this.tileWidth;
    const h = this.tileHeight;
    const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * w;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * h;

    layer.addRect(setNumber, sx, sy, dx, dy, w, h);
};

Tilemap.prototype._addAutotile = function(layer, tileId, dx, dy) {
    const kind = Tilemap.getAutotileKind(tileId);
    const shape = Tilemap.getAutotileShape(tileId);
    const tx = kind % 8;
    const ty = Math.floor(kind / 8);
    let setNumber = 0;
    let bx = 0;
    let by = 0;
    let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    let isTable = false;

    if (Tilemap.isTileA1(tileId)) {
        const waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
        setNumber = 0;
        if (kind === 0) {
            bx = waterSurfaceIndex * 2;
            by = 0;
        } else if (kind === 1) {
            bx = waterSurfaceIndex * 2;
            by = 3;
        } else if (kind === 2) {
            bx = 6;
            by = 0;
        } else if (kind === 3) {
            bx = 6;
            by = 3;
        } else {
            bx = Math.floor(tx / 4) * 8;
            by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;
            if (kind % 2 === 0) {
                bx += waterSurfaceIndex * 2;
            } else {
                bx += 6;
                autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                by += this.animationFrame % 3;
            }
        }
    } else if (Tilemap.isTileA2(tileId)) {
        setNumber = 1;
        bx = tx * 2;
        by = (ty - 2) * 3;
        isTable = this._isTableTile(tileId);
    } else if (Tilemap.isTileA3(tileId)) {
        setNumber = 2;
        bx = tx * 2;
        by = (ty - 6) * 2;
        autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
    } else if (Tilemap.isTileA4(tileId)) {
        setNumber = 3;
        bx = tx * 2;
        by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
        if (ty % 2 === 1) {
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        }
    }

    const table = autotileTable[shape];
    const w1 = this.tileWidth / 2;
    const h1 = this.tileHeight / 2;
    for (let i = 0; i < 4; i++) {
        const qsx = table[i][0];
        const qsy = table[i][1];
        const sx1 = (bx * 2 + qsx) * w1;
        const sy1 = (by * 2 + qsy) * h1;
        const dx1 = dx + (i % 2) * w1;
        const dy1 = dy + Math.floor(i / 2) * h1;
        if (isTable && (qsy === 1 || qsy === 5)) {
            const qsx2 = qsy === 1 ? (4 - qsx) % 4 : qsx;
            const qsy2 = 3;
            const sx2 = (bx * 2 + qsx2) * w1;
            const sy2 = (by * 2 + qsy2) * h1;
            layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1);
            layer.addRect(setNumber, sx1, sy1, dx1, dy1 + h1 / 2, w1, h1 / 2);
        } else {
            layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1);
        }
    }
};

Tilemap.prototype._addTableEdge = function(layer, tileId, dx, dy) {
    if (Tilemap.isTileA2(tileId)) {
        const autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        const kind = Tilemap.getAutotileKind(tileId);
        const shape = Tilemap.getAutotileShape(tileId);
        const tx = kind % 8;
        const ty = Math.floor(kind / 8);
        const setNumber = 1;
        const bx = tx * 2;
        const by = (ty - 2) * 3;
        const table = autotileTable[shape];
        const w1 = this.tileWidth / 2;
        const h1 = this.tileHeight / 2;
        for (let i = 0; i < 2; i++) {
            const qsx = table[2 + i][0];
            const qsy = table[2 + i][1];
            const sx1 = (bx * 2 + qsx) * w1;
            const sy1 = (by * 2 + qsy) * h1 + h1 / 2;
            const dx1 = dx + (i % 2) * w1;
            const dy1 = dy + Math.floor(i / 2) * h1;
            layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1 / 2);
        }
    }
};

Tilemap.prototype._addShadow = function(layer, shadowBits, dx, dy) {
    if (shadowBits & 0x0f) {
        const w1 = this.tileWidth / 2;
        const h1 = this.tileHeight / 2;
        for (let i = 0; i < 4; i++) {
            if (shadowBits & (1 << i)) {
                const dx1 = dx + (i % 2) * w1;
                const dy1 = dy + Math.floor(i / 2) * h1;
                layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
            }
        }
    }
};

Tilemap.prototype._readMapData = function(x, y, z) {
    if (this._mapData) {
        const width = this._mapWidth;
        const height = this._mapHeight;
        if (this.horizontalWrap) {
            x = x.mod(width);
        }
        if (this.verticalWrap) {
            y = y.mod(height);
        }
        if (x >= 0 && x < width && y >= 0 && y < height) {
            return this._mapData[(z * height + y) * width + x] || 0;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
};

Tilemap.prototype._isHigherTile = function(tileId) {
    return this.flags[tileId] & 0x10;
};

Tilemap.prototype._isTableTile = function(tileId) {
    return Tilemap.isTileA2(tileId) && this.flags[tileId] & 0x80;
};

Tilemap.prototype._isOverpassPosition = function(/*mx, my*/) {
    return false;
};

Tilemap.prototype._sortChildren = function() {
    this.children.sort(this._compareChildOrder.bind(this));
};

Tilemap.prototype._compareChildOrder = function(a, b) {
    if (a.z !== b.z) {
        return a.z - b.z;
    } else if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return a.spriteId - b.spriteId;
    }
};

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Tile type checkers

Tilemap.TILE_ID_B = 0;
Tilemap.TILE_ID_C = 256;
Tilemap.TILE_ID_D = 512;
Tilemap.TILE_ID_E = 768;
Tilemap.TILE_ID_A5 = 1536;
Tilemap.TILE_ID_A1 = 2048;
Tilemap.TILE_ID_A2 = 2816;
Tilemap.TILE_ID_A3 = 4352;
Tilemap.TILE_ID_A4 = 5888;
Tilemap.TILE_ID_MAX = 8192;

Tilemap.isVisibleTile = function(tileId) {
    return tileId > 0 && tileId < this.TILE_ID_MAX;
};

Tilemap.isAutotile = function(tileId) {
    return tileId >= this.TILE_ID_A1;
};

Tilemap.getAutotileKind = function(tileId) {
    return Math.floor((tileId - this.TILE_ID_A1) / 48);
};

Tilemap.getAutotileShape = function(tileId) {
    return (tileId - this.TILE_ID_A1) % 48;
};

Tilemap.makeAutotileId = function(kind, shape) {
    return this.TILE_ID_A1 + kind * 48 + shape;
};

Tilemap.isSameKindTile = function(tileID1, tileID2) {
    if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
        return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
    } else {
        return tileID1 === tileID2;
    }
};

Tilemap.isTileA1 = function(tileId) {
    return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
};

Tilemap.isTileA2 = function(tileId) {
    return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
};

Tilemap.isTileA3 = function(tileId) {
    return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
};

Tilemap.isTileA4 = function(tileId) {
    return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
};

Tilemap.isTileA5 = function(tileId) {
    return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
};

Tilemap.isWaterTile = function(tileId) {
    if (this.isTileA1(tileId)) {
        return !(
            tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192
        );
    } else {
        return false;
    }
};

Tilemap.isWaterfallTile = function(tileId) {
    if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
        return this.getAutotileKind(tileId) % 2 === 1;
    } else {
        return false;
    }
};

Tilemap.isGroundTile = function(tileId) {
    return (
        this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId)
    );
};

Tilemap.isShadowingTile = function(tileId) {
    return this.isTileA3(tileId) || this.isTileA4(tileId);
};

Tilemap.isRoofTile = function(tileId) {
    return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
};

Tilemap.isWallTopTile = function(tileId) {
    return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
};

Tilemap.isWallSideTile = function(tileId) {
    return (
        (this.isTileA3(tileId) || this.isTileA4(tileId)) &&
        this.getAutotileKind(tileId) % 16 >= 8
    );
};

Tilemap.isWallTile = function(tileId) {
    return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
};

Tilemap.isFloorTypeAutotile = function(tileId) {
    return (
        (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) ||
        this.isTileA2(tileId) ||
        this.isWallTopTile(tileId)
    );
};

Tilemap.isWallTypeAutotile = function(tileId) {
    return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
};

Tilemap.isWaterfallTypeAutotile = function(tileId) {
    return this.isWaterfallTile(tileId);
};

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Autotile shape number to coordinates of tileset images

// prettier-ignore
Tilemap.FLOOR_AUTOTILE_TABLE = [
    [[2, 4], [1, 4], [2, 3], [1, 3]],
    [[2, 0], [1, 4], [2, 3], [1, 3]],
    [[2, 4], [3, 0], [2, 3], [1, 3]],
    [[2, 0], [3, 0], [2, 3], [1, 3]],
    [[2, 4], [1, 4], [2, 3], [3, 1]],
    [[2, 0], [1, 4], [2, 3], [3, 1]],
    [[2, 4], [3, 0], [2, 3], [3, 1]],
    [[2, 0], [3, 0], [2, 3], [3, 1]],
    [[2, 4], [1, 4], [2, 1], [1, 3]],
    [[2, 0], [1, 4], [2, 1], [1, 3]],
    [[2, 4], [3, 0], [2, 1], [1, 3]],
    [[2, 0], [3, 0], [2, 1], [1, 3]],
    [[2, 4], [1, 4], [2, 1], [3, 1]],
    [[2, 0], [1, 4], [2, 1], [3, 1]],
    [[2, 4], [3, 0], [2, 1], [3, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 4], [1, 4], [0, 3], [1, 3]],
    [[0, 4], [3, 0], [0, 3], [1, 3]],
    [[0, 4], [1, 4], [0, 3], [3, 1]],
    [[0, 4], [3, 0], [0, 3], [3, 1]],
    [[2, 2], [1, 2], [2, 3], [1, 3]],
    [[2, 2], [1, 2], [2, 3], [3, 1]],
    [[2, 2], [1, 2], [2, 1], [1, 3]],
    [[2, 2], [1, 2], [2, 1], [3, 1]],
    [[2, 4], [3, 4], [2, 3], [3, 3]],
    [[2, 4], [3, 4], [2, 1], [3, 3]],
    [[2, 0], [3, 4], [2, 3], [3, 3]],
    [[2, 0], [3, 4], [2, 1], [3, 3]],
    [[2, 4], [1, 4], [2, 5], [1, 5]],
    [[2, 0], [1, 4], [2, 5], [1, 5]],
    [[2, 4], [3, 0], [2, 5], [1, 5]],
    [[2, 0], [3, 0], [2, 5], [1, 5]],
    [[0, 4], [3, 4], [0, 3], [3, 3]],
    [[2, 2], [1, 2], [2, 5], [1, 5]],
    [[0, 2], [1, 2], [0, 3], [1, 3]],
    [[0, 2], [1, 2], [0, 3], [3, 1]],
    [[2, 2], [3, 2], [2, 3], [3, 3]],
    [[2, 2], [3, 2], [2, 1], [3, 3]],
    [[2, 4], [3, 4], [2, 5], [3, 5]],
    [[2, 0], [3, 4], [2, 5], [3, 5]],
    [[0, 4], [1, 4], [0, 5], [1, 5]],
    [[0, 4], [3, 0], [0, 5], [1, 5]],
    [[0, 2], [3, 2], [0, 3], [3, 3]],
    [[0, 2], [1, 2], [0, 5], [1, 5]],
    [[0, 4], [3, 4], [0, 5], [3, 5]],
    [[2, 2], [3, 2], [2, 5], [3, 5]],
    [[0, 2], [3, 2], [0, 5], [3, 5]],
    [[0, 0], [1, 0], [0, 1], [1, 1]]
];

// prettier-ignore
Tilemap.WALL_AUTOTILE_TABLE = [
    [[2, 2], [1, 2], [2, 1], [1, 1]],
    [[0, 2], [1, 2], [0, 1], [1, 1]],
    [[2, 0], [1, 0], [2, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[2, 2], [3, 2], [2, 1], [3, 1]],
    [[0, 2], [3, 2], [0, 1], [3, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 0], [3, 0], [0, 1], [3, 1]],
    [[2, 2], [1, 2], [2, 3], [1, 3]],
    [[0, 2], [1, 2], [0, 3], [1, 3]],
    [[2, 0], [1, 0], [2, 3], [1, 3]],
    [[0, 0], [1, 0], [0, 3], [1, 3]],
    [[2, 2], [3, 2], [2, 3], [3, 3]],
    [[0, 2], [3, 2], [0, 3], [3, 3]],
    [[2, 0], [3, 0], [2, 3], [3, 3]],
    [[0, 0], [3, 0], [0, 3], [3, 3]]
];

// prettier-ignore
Tilemap.WATERFALL_AUTOTILE_TABLE = [
    [[2, 0], [1, 0], [2, 1], [1, 1]],
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    [[2, 0], [3, 0], [2, 1], [3, 1]],
    [[0, 0], [3, 0], [0, 1], [3, 1]]
];

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Internal classes

Tilemap.Layer = function() {
    this.initialize(...arguments);
};

Tilemap.Layer.prototype = Object.create(PIXI.Container.prototype);
Tilemap.Layer.prototype.constructor = Tilemap.Layer;

Tilemap.Layer.prototype.initialize = function() {
    PIXI.Container.call(this);
    this._elements = [];
    this._indexBuffer = null;
    this._indexArray = new Float32Array(0);
    this._vertexBuffer = null;
    this._vertexArray = new Float32Array(0);
    this._vao = null;
    this._needsTexturesUpdate = false;
    this._needsVertexUpdate = false;
    this._images = [];
    this._state = PIXI.State.for2d();
    this._createVao();
};

Tilemap.Layer.MAX_GL_TEXTURES = 3;
Tilemap.Layer.VERTEX_STRIDE = 9 * 4;
Tilemap.Layer.MAX_SIZE = 16000;

Tilemap.Layer.prototype.destroy = function() {
    if (this._vao) {
        this._vao.destroy();
        this._indexBuffer.destroy();
        this._vertexBuffer.destroy();
    }
    this._indexBuffer = null;
    this._vertexBuffer = null;
    this._vao = null;
};

Tilemap.Layer.prototype.setBitmaps = function(bitmaps) {
    this._images = bitmaps.map(bitmap => bitmap.image || bitmap.canvas);
    this._needsTexturesUpdate = true;
};

Tilemap.Layer.prototype.clear = function() {
    this._elements.length = 0;
    this._needsVertexUpdate = true;
};

Tilemap.Layer.prototype.size = function() {
    return this._elements.length;
};

Tilemap.Layer.prototype.addRect = function(setNumber, sx, sy, dx, dy, w, h) {
    this._elements.push([setNumber, sx, sy, dx, dy, w, h]);
};

Tilemap.Layer.prototype.render = function(renderer) {
    const gl = renderer.gl;
    const tilemapRenderer = renderer.plugins.rpgtilemap;
    const shader = tilemapRenderer.getShader();
    const matrix = shader.uniforms.uProjectionMatrix;

    renderer.batch.setObjectRenderer(tilemapRenderer);
    renderer.projection.projectionMatrix.copyTo(matrix);
    matrix.append(this.worldTransform);
    renderer.shader.bind(shader);

    if (this._needsTexturesUpdate) {
        tilemapRenderer.updateTextures(renderer, this._images);
        this._needsTexturesUpdate = false;
    }
    tilemapRenderer.bindTextures(renderer);
    renderer.geometry.bind(this._vao, shader);
    this._updateIndexBuffer();
    if (this._needsVertexUpdate) {
        this._updateVertexBuffer();
        this._needsVertexUpdate = false;
    }
    renderer.geometry.updateBuffers();

    const numElements = this._elements.length;
    if (numElements > 0) {
        renderer.state.set(this._state);
        renderer.geometry.draw(gl.TRIANGLES, numElements * 6, 0);
    }
};

Tilemap.Layer.prototype.isReady = function() {
    if (this._images.length === 0) {
        return false;
    }
    for (const texture of this._images) {
        if (!texture || !texture.valid) {
            return false;
        }
    }
    return true;
};

Tilemap.Layer.prototype._createVao = function() {
    const ib = new PIXI.Buffer(null, true, true);
    const vb = new PIXI.Buffer(null, true, false);
    const stride = Tilemap.Layer.VERTEX_STRIDE;
    const type = PIXI.TYPES.FLOAT;
    const geometry = new PIXI.Geometry();
    this._indexBuffer = ib;
    this._vertexBuffer = vb;
    this._vao = geometry
        .addIndex(this._indexBuffer)
        .addAttribute("aTextureId", vb, 1, false, type, stride, 0)
        .addAttribute("aFrame", vb, 4, false, type, stride, 1 * 4)
        .addAttribute("aSource", vb, 2, false, type, stride, 5 * 4)
        .addAttribute("aDest", vb, 2, false, type, stride, 7 * 4);
};

Tilemap.Layer.prototype._updateIndexBuffer = function() {
    const numElements = this._elements.length;
    if (this._indexArray.length < numElements * 6 * 2) {
        this._indexArray = PIXI.utils.createIndicesForQuads(numElements * 2);
        this._indexBuffer.update(this._indexArray);
    }
};

Tilemap.Layer.prototype._updateVertexBuffer = function() {
    const numElements = this._elements.length;
    const required = numElements * Tilemap.Layer.VERTEX_STRIDE;
    if (this._vertexArray.length < required) {
        this._vertexArray = new Float32Array(required * 2);
    }
    const vertexArray = this._vertexArray;
    let index = 0;
    for (const item of this._elements) {
        const setNumber = item[0];
        const tid = setNumber >> 2;
        const sxOffset = 1024 * (setNumber & 1);
        const syOffset = 1024 * ((setNumber >> 1) & 1);
        const sx = item[1] + sxOffset;
        const sy = item[2] + syOffset;
        const dx = item[3];
        const dy = item[4];
        const w = item[5];
        const h = item[6];
        const frameLeft = sx + 0.5;
        const frameTop = sy + 0.5;
        const frameRight = sx + w - 0.5;
        const frameBottom = sy + h - 0.5;
        vertexArray[index++] = tid;
        vertexArray[index++] = frameLeft;
        vertexArray[index++] = frameTop;
        vertexArray[index++] = frameRight;
        vertexArray[index++] = frameBottom;
        vertexArray[index++] = sx;
        vertexArray[index++] = sy;
        vertexArray[index++] = dx;
        vertexArray[index++] = dy;
        vertexArray[index++] = tid;
        vertexArray[index++] = frameLeft;
        vertexArray[index++] = frameTop;
        vertexArray[index++] = frameRight;
        vertexArray[index++] = frameBottom;
        vertexArray[index++] = sx + w;
        vertexArray[index++] = sy;
        vertexArray[index++] = dx + w;
        vertexArray[index++] = dy;
        vertexArray[index++] = tid;
        vertexArray[index++] = frameLeft;
        vertexArray[index++] = frameTop;
        vertexArray[index++] = frameRight;
        vertexArray[index++] = frameBottom;
        vertexArray[index++] = sx + w;
        vertexArray[index++] = sy + h;
        vertexArray[index++] = dx + w;
        vertexArray[index++] = dy + h;
        vertexArray[index++] = tid;
        vertexArray[index++] = frameLeft;
        vertexArray[index++] = frameTop;
        vertexArray[index++] = frameRight;
        vertexArray[index++] = frameBottom;
        vertexArray[index++] = sx;
        vertexArray[index++] = sy + h;
        vertexArray[index++] = dx;
        vertexArray[index++] = dy + h;
    }
    this._vertexBuffer.update(vertexArray);
};

Tilemap.CombinedLayer = function() {
    this.initialize(...arguments);
};

Tilemap.CombinedLayer.prototype = Object.create(PIXI.Container.prototype);
Tilemap.CombinedLayer.prototype.constructor = Tilemap.CombinedLayer;

Tilemap.CombinedLayer.prototype.initialize = function() {
    PIXI.Container.call(this);
    for (let i = 0; i < 2; i++) {
        this.addChild(new Tilemap.Layer());
    }
};

Tilemap.CombinedLayer.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Container.prototype.destroy.call(this, options);
};

Tilemap.CombinedLayer.prototype.setBitmaps = function(bitmaps) {
    for (const child of this.children) {
        child.setBitmaps(bitmaps);
    }
};

Tilemap.CombinedLayer.prototype.clear = function() {
    for (const child of this.children) {
        child.clear();
    }
};

Tilemap.CombinedLayer.prototype.size = function() {
    return this.children.reduce((r, child) => r + child.size(), 0);
};

// prettier-ignore
Tilemap.CombinedLayer.prototype.addRect = function(
    setNumber, sx, sy, dx, dy, w, h
) {
    for (const child of this.children) {
        if (child.size() < Tilemap.Layer.MAX_SIZE) {
            child.addRect(setNumber, sx, sy, dx, dy, w, h);
            break;
        }
    }
};

Tilemap.CombinedLayer.prototype.isReady = function() {
    return this.children.every(child => child.isReady());
};

Tilemap.Renderer = function() {
    this.initialize(...arguments);
};

Tilemap.Renderer.prototype = Object.create(PIXI.ObjectRenderer.prototype);
Tilemap.Renderer.prototype.constructor = Tilemap.Renderer;

Tilemap.Renderer.prototype.initialize = function(renderer) {
    PIXI.ObjectRenderer.call(this, renderer);
    this._shader = null;
    this._images = [];
    this._internalTextures = [];
    this._clearBuffer = new Uint8Array(1024 * 1024 * 4);
    this.contextChange();
};

Tilemap.Renderer.prototype.destroy = function() {
    PIXI.ObjectRenderer.prototype.destroy.call(this);
    this._destroyInternalTextures();
    this._shader.destroy();
    this._shader = null;
};

Tilemap.Renderer.prototype.getShader = function() {
    return this._shader;
};

Tilemap.Renderer.prototype.contextChange = function() {
    this._shader = this._createShader();
    this._images = [];
    this._createInternalTextures();
};

Tilemap.Renderer.prototype._createShader = function() {
    const vertexSrc =
        "attribute float aTextureId;" +
        "attribute vec4 aFrame;" +
        "attribute vec2 aSource;" +
        "attribute vec2 aDest;" +
        "uniform mat3 uProjectionMatrix;" +
        "varying vec4 vFrame;" +
        "varying vec2 vTextureCoord;" +
        "varying float vTextureId;" +
        "void main(void) {" +
        "  vec3 position = uProjectionMatrix * vec3(aDest, 1.0);" +
        "  gl_Position = vec4(position, 1.0);" +
        "  vFrame = aFrame;" +
        "  vTextureCoord = aSource;" +
        "  vTextureId = aTextureId;" +
        "}";
    const fragmentSrc =
        "varying vec4 vFrame;" +
        "varying vec2 vTextureCoord;" +
        "varying float vTextureId;" +
        "uniform sampler2D uSampler0;" +
        "uniform sampler2D uSampler1;" +
        "uniform sampler2D uSampler2;" +
        "void main(void) {" +
        "  vec2 textureCoord = clamp(vTextureCoord, vFrame.xy, vFrame.zw);" +
        "  int textureId = int(vTextureId);" +
        "  vec4 color;" +
        "  if (textureId < 0) {" +
        "    color = vec4(0.0, 0.0, 0.0, 0.5);" +
        "  } else if (textureId == 0) {" +
        "    color = texture2D(uSampler0, textureCoord / 2048.0);" +
        "  } else if (textureId == 1) {" +
        "    color = texture2D(uSampler1, textureCoord / 2048.0);" +
        "  } else if (textureId == 2) {" +
        "    color = texture2D(uSampler2, textureCoord / 2048.0);" +
        "  }" +
        "  gl_FragColor = color;" +
        "}";

    return new PIXI.Shader(PIXI.Program.from(vertexSrc, fragmentSrc), {
        uSampler0: 0,
        uSampler1: 0,
        uSampler2: 0,
        uProjectionMatrix: new PIXI.Matrix()
    });
};

Tilemap.Renderer.prototype._createInternalTextures = function() {
    this._destroyInternalTextures();
    for (let i = 0; i < Tilemap.Layer.MAX_GL_TEXTURES; i++) {
        const baseTexture = new PIXI.BaseRenderTexture();
        baseTexture.resize(2048, 2048);
        baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        this._internalTextures.push(baseTexture);
    }
};

Tilemap.Renderer.prototype._destroyInternalTextures = function() {
    for (const internalTexture of this._internalTextures) {
        internalTexture.destroy();
    }
    this._internalTextures = [];
};

Tilemap.Renderer.prototype.updateTextures = function(renderer, images) {
    for (let i = 0; i < images.length; i++) {
        const internalTexture = this._internalTextures[i >> 2];
        renderer.texture.bind(internalTexture, 0);
        const gl = renderer.gl;
        const x = 1024 * (i % 2);
        const y = 1024 * ((i >> 1) % 2);
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
        // prettier-ignore
        gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, 1024, 1024, format, type,
                         this._clearBuffer);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, format, type, images[i]);
    }
};

Tilemap.Renderer.prototype.bindTextures = function(renderer) {
    for (let ti = 0; ti < Tilemap.Layer.MAX_GL_TEXTURES; ti++) {
        renderer.texture.bind(this._internalTextures[ti], ti);
    }
};

PIXI.Renderer.registerPlugin("rpgtilemap", Tilemap.Renderer);
