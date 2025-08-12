//-----------------------------------------------------------------------------
/**
 * The sprite object for a tiling image.
 *
 * @class
 * @extends PIXI.TilingSprite
 * @param {Bitmap} bitmap - The image for the tiling sprite.
 */
function TilingSprite() {
    this.initialize(...arguments);
}

TilingSprite.prototype = Object.create(PIXI.TilingSprite.prototype);
TilingSprite.prototype.constructor = TilingSprite;

TilingSprite.prototype.initialize = function(bitmap) {
    if (!TilingSprite._emptyBaseTexture) {
        TilingSprite._emptyBaseTexture = new PIXI.BaseTexture();
        TilingSprite._emptyBaseTexture.setSize(1, 1);
    }
    const frame = new Rectangle();
    const texture = new PIXI.Texture(TilingSprite._emptyBaseTexture, frame);
    PIXI.TilingSprite.call(this, texture);
    this._bitmap = bitmap;
    this._width = 0;
    this._height = 0;
    this._frame = frame;

    /**
     * The origin point of the tiling sprite for scrolling.
     *
     * @type Point
     */
    this.origin = new Point();

    this._onBitmapChange();
};

TilingSprite._emptyBaseTexture = null;

/**
 * The image for the tiling sprite.
 *
 * @type Bitmap
 * @name TilingSprite#bitmap
 */
Object.defineProperty(TilingSprite.prototype, "bitmap", {
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
 * The opacity of the tiling sprite (0 to 255).
 *
 * @type number
 * @name TilingSprite#opacity
 */
Object.defineProperty(TilingSprite.prototype, "opacity", {
    get: function() {
        return this.alpha * 255;
    },
    set: function(value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * Destroys the tiling sprite.
 */
TilingSprite.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.TilingSprite.prototype.destroy.call(this, options);
};

/**
 * Updates the tiling sprite for each frame.
 */
TilingSprite.prototype.update = function() {
    for (const child of this.children) {
        if (child.update) {
            child.update();
        }
    }
};

/**
 * Sets the x, y, width, and height all at once.
 *
 * @param {number} x - The x coordinate of the tiling sprite.
 * @param {number} y - The y coordinate of the tiling sprite.
 * @param {number} width - The width of the tiling sprite.
 * @param {number} height - The height of the tiling sprite.
 */
TilingSprite.prototype.move = function(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this._width = width || 0;
    this._height = height || 0;
};

/**
 * Specifies the region of the image that the tiling sprite will use.
 *
 * @param {number} x - The x coordinate of the frame.
 * @param {number} y - The y coordinate of the frame.
 * @param {number} width - The width of the frame.
 * @param {number} height - The height of the frame.
 */
TilingSprite.prototype.setFrame = function(x, y, width, height) {
    this._frame.x = x;
    this._frame.y = y;
    this._frame.width = width;
    this._frame.height = height;
    this._refresh();
};

/**
 * Updates the transform on all children of this container for rendering.
 */
TilingSprite.prototype.updateTransform = function() {
    this.tilePosition.x = Math.round(-this.origin.x);
    this.tilePosition.y = Math.round(-this.origin.y);
    PIXI.TilingSprite.prototype.updateTransform.call(this);
};

TilingSprite.prototype._onBitmapChange = function() {
    if (this._bitmap) {
        this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
    } else {
        this.texture.frame = new Rectangle();
    }
};

TilingSprite.prototype._onBitmapLoad = function() {
    this.texture.baseTexture = this._bitmap.baseTexture;
    this._refresh();
};

TilingSprite.prototype._refresh = function() {
    const texture = this.texture;
    const frame = this._frame.clone();
    if (frame.width === 0 && frame.height === 0 && this._bitmap) {
        frame.width = this._bitmap.width;
        frame.height = this._bitmap.height;
    }
    if (texture) {
        if (texture.baseTexture) {
            try {
                texture.frame = frame;
            } catch (e) {
                texture.frame = new Rectangle();
            }
        }
        texture._updateID++;
    }
};

//-----------------------------------------------------------------------------
/**
 * The sprite which covers the entire game screen.
 *
 * @class
 * @extends PIXI.Container
 */
function ScreenSprite() {
    this.initialize(...arguments);
}

ScreenSprite.prototype = Object.create(PIXI.Container.prototype);
ScreenSprite.prototype.constructor = ScreenSprite;

ScreenSprite.prototype.initialize = function() {
    PIXI.Container.call(this);
    this._graphics = new PIXI.Graphics();
    this.addChild(this._graphics);
    this.opacity = 0;
    this._red = -1;
    this._green = -1;
    this._blue = -1;
    this.setBlack();
};

/**
 * The opacity of the sprite (0 to 255).
 *
 * @type number
 * @name ScreenSprite#opacity
 */
Object.defineProperty(ScreenSprite.prototype, "opacity", {
    get: function() {
        return this.alpha * 255;
    },
    set: function(value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * Destroys the screen sprite.
 */
ScreenSprite.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Container.prototype.destroy.call(this, options);
};

/**
 * Sets black to the color of the screen sprite.
 */
ScreenSprite.prototype.setBlack = function() {
    this.setColor(0, 0, 0);
};

/**
 * Sets white to the color of the screen sprite.
 */
ScreenSprite.prototype.setWhite = function() {
    this.setColor(255, 255, 255);
};

/**
 * Sets the color of the screen sprite by values.
 *
 * @param {number} r - The red value in the range (0, 255).
 * @param {number} g - The green value in the range (0, 255).
 * @param {number} b - The blue value in the range (0, 255).
 */
ScreenSprite.prototype.setColor = function(r, g, b) {
    if (this._red !== r || this._green !== g || this._blue !== b) {
        r = Math.round(r || 0).clamp(0, 255);
        g = Math.round(g || 0).clamp(0, 255);
        b = Math.round(b || 0).clamp(0, 255);
        this._red = r;
        this._green = g;
        this._blue = b;
        const graphics = this._graphics;
        graphics.clear();
        graphics.beginFill((r << 16) | (g << 8) | b, 1);
        graphics.drawRect(-50000, -50000, 100000, 100000);
    }
};

//-----------------------------------------------------------------------------
/**
 * The window in the game.
 *
 * @class
 * @extends PIXI.Container
 */
function Window() {
    this.initialize(...arguments);
}

Window.prototype = Object.create(PIXI.Container.prototype);
Window.prototype.constructor = Window;

Window.prototype.initialize = function() {
    PIXI.Container.call(this);

    this._isWindow = true;
    this._windowskin = null;
    this._width = 0;
    this._height = 0;
    this._cursorRect = new Rectangle();
    this._openness = 255;
    this._animationCount = 0;

    this._padding = 12;
    this._margin = 4;
    this._colorTone = [0, 0, 0, 0];
    this._innerChildren = [];

    this._container = null;
    this._backSprite = null;
    this._frameSprite = null;
    this._contentsBackSprite = null;
    this._cursorSprite = null;
    this._contentsSprite = null;
    this._downArrowSprite = null;
    this._upArrowSprite = null;
    this._pauseSignSprite = null;

    this._createAllParts();

    /**
     * The origin point of the window for scrolling.
     *
     * @type Point
     */
    this.origin = new Point();

    /**
     * The active state for the window.
     *
     * @type boolean
     */
    this.active = true;

    /**
     * The visibility of the frame.
     *
     * @type boolean
     */
    this.frameVisible = true;

    /**
     * The visibility of the cursor.
     *
     * @type boolean
     */
    this.cursorVisible = true;

    /**
     * The visibility of the down scroll arrow.
     *
     * @type boolean
     */
    this.downArrowVisible = false;

    /**
     * The visibility of the up scroll arrow.
     *
     * @type boolean
     */
    this.upArrowVisible = false;

    /**
     * The visibility of the pause sign.
     *
     * @type boolean
     */
    this.pause = false;
};

/**
 * The image used as a window skin.
 *
 * @type Bitmap
 * @name Window#windowskin
 */
Object.defineProperty(Window.prototype, "windowskin", {
    get: function() {
        return this._windowskin;
    },
    set: function(value) {
        if (this._windowskin !== value) {
            this._windowskin = value;
            this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
        }
    },
    configurable: true
});

/**
 * The bitmap used for the window contents.
 *
 * @type Bitmap
 * @name Window#contents
 */
Object.defineProperty(Window.prototype, "contents", {
    get: function() {
        return this._contentsSprite.bitmap;
    },
    set: function(value) {
        this._contentsSprite.bitmap = value;
    },
    configurable: true
});

/**
 * The bitmap used for the window contents background.
 *
 * @type Bitmap
 * @name Window#contentsBack
 */
Object.defineProperty(Window.prototype, "contentsBack", {
    get: function() {
        return this._contentsBackSprite.bitmap;
    },
    set: function(value) {
        this._contentsBackSprite.bitmap = value;
    },
    configurable: true
});

/**
 * The width of the window in pixels.
 *
 * @type number
 * @name Window#width
 */
Object.defineProperty(Window.prototype, "width", {
    get: function() {
        return this._width;
    },
    set: function(value) {
        this._width = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**
 * The height of the window in pixels.
 *
 * @type number
 * @name Window#height
 */
Object.defineProperty(Window.prototype, "height", {
    get: function() {
        return this._height;
    },
    set: function(value) {
        this._height = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**
 * The size of the padding between the frame and contents.
 *
 * @type number
 * @name Window#padding
 */
Object.defineProperty(Window.prototype, "padding", {
    get: function() {
        return this._padding;
    },
    set: function(value) {
        this._padding = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**
 * The size of the margin for the window background.
 *
 * @type number
 * @name Window#margin
 */
Object.defineProperty(Window.prototype, "margin", {
    get: function() {
        return this._margin;
    },
    set: function(value) {
        this._margin = value;
        this._refreshAllParts();
    },
    configurable: true
});

/**
 * The opacity of the window without contents (0 to 255).
 *
 * @type number
 * @name Window#opacity
 */
Object.defineProperty(Window.prototype, "opacity", {
    get: function() {
        return this._container.alpha * 255;
    },
    set: function(value) {
        this._container.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * The opacity of the window background (0 to 255).
 *
 * @type number
 * @name Window#backOpacity
 */
Object.defineProperty(Window.prototype, "backOpacity", {
    get: function() {
        return this._backSprite.alpha * 255;
    },
    set: function(value) {
        this._backSprite.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * The opacity of the window contents (0 to 255).
 *
 * @type number
 * @name Window#contentsOpacity
 */
Object.defineProperty(Window.prototype, "contentsOpacity", {
    get: function() {
        return this._contentsSprite.alpha * 255;
    },
    set: function(value) {
        this._contentsSprite.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * The openness of the window (0 to 255).
 *
 * @type number
 * @name Window#openness
 */
Object.defineProperty(Window.prototype, "openness", {
    get: function() {
        return this._openness;
    },
    set: function(value) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
            this._container.scale.y = this._openness / 255;
            this._container.y = (this.height / 2) * (1 - this._openness / 255);
        }
    },
    configurable: true
});

/**
 * The width of the content area in pixels.
 *
 * @readonly
 * @type number
 * @name Window#innerWidth
 */
Object.defineProperty(Window.prototype, "innerWidth", {
    get: function() {
        return Math.max(0, this._width - this._padding * 2);
    },
    configurable: true
});

/**
 * The height of the content area in pixels.
 *
 * @readonly
 * @type number
 * @name Window#innerHeight
 */
Object.defineProperty(Window.prototype, "innerHeight", {
    get: function() {
        return Math.max(0, this._height - this._padding * 2);
    },
    configurable: true
});

/**
 * The rectangle of the content area.
 *
 * @readonly
 * @type Rectangle
 * @name Window#innerRect
 */
Object.defineProperty(Window.prototype, "innerRect", {
    get: function() {
        return new Rectangle(
            this._padding,
            this._padding,
            this.innerWidth,
            this.innerHeight
        );
    },
    configurable: true
});

/**
 * Destroys the window.
 */
Window.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Container.prototype.destroy.call(this, options);
};

/**
 * Updates the window for each frame.
 */
Window.prototype.update = function() {
    if (this.active) {
        this._animationCount++;
    }
    for (const child of this.children) {
        if (child.update) {
            child.update();
        }
    }
};

/**
 * Sets the x, y, width, and height all at once.
 *
 * @param {number} x - The x coordinate of the window.
 * @param {number} y - The y coordinate of the window.
 * @param {number} width - The width of the window.
 * @param {number} height - The height of the window.
 */
Window.prototype.move = function(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    if (this._width !== width || this._height !== height) {
        this._width = width || 0;
        this._height = height || 0;
        this._refreshAllParts();
    }
};

/**
 * Checks whether the window is completely open (openness == 255).
 *
 * @returns {boolean} True if the window is open.
 */
Window.prototype.isOpen = function() {
    return this._openness >= 255;
};

/**
 * Checks whether the window is completely closed (openness == 0).
 *
 * @returns {boolean} True if the window is closed.
 */
Window.prototype.isClosed = function() {
    return this._openness <= 0;
};

/**
 * Sets the position of the command cursor.
 *
 * @param {number} x - The x coordinate of the cursor.
 * @param {number} y - The y coordinate of the cursor.
 * @param {number} width - The width of the cursor.
 * @param {number} height - The height of the cursor.
 */
Window.prototype.setCursorRect = function(x, y, width, height) {
    const cw = Math.floor(width || 0);
    const ch = Math.floor(height || 0);
    this._cursorRect.x = Math.floor(x || 0);
    this._cursorRect.y = Math.floor(y || 0);
    if (this._cursorRect.width !== cw || this._cursorRect.height !== ch) {
        this._cursorRect.width = cw;
        this._cursorRect.height = ch;
        this._refreshCursor();
    }
};

/**
 * Moves the cursor position by the given amount.
 *
 * @param {number} x - The amount of horizontal movement.
 * @param {number} y - The amount of vertical movement.
 */
Window.prototype.moveCursorBy = function(x, y) {
    this._cursorRect.x += x;
    this._cursorRect.y += y;
};

/**
 * Moves the inner children by the given amount.
 *
 * @param {number} x - The amount of horizontal movement.
 * @param {number} y - The amount of vertical movement.
 */
Window.prototype.moveInnerChildrenBy = function(x, y) {
    for (const child of this._innerChildren) {
        child.x += x;
        child.y += y;
    }
};

/**
 * Changes the color of the background.
 *
 * @param {number} r - The red value in the range (-255, 255).
 * @param {number} g - The green value in the range (-255, 255).
 * @param {number} b - The blue value in the range (-255, 255).
 */
Window.prototype.setTone = function(r, g, b) {
    const tone = this._colorTone;
    if (r !== tone[0] || g !== tone[1] || b !== tone[2]) {
        this._colorTone = [r, g, b, 0];
        this._refreshBack();
    }
};

/**
 * Adds a child between the background and contents.
 *
 * @param {object} child - The child to add.
 * @returns {object} The child that was added.
 */
Window.prototype.addChildToBack = function(child) {
    const containerIndex = this.children.indexOf(this._container);
    return this.addChildAt(child, containerIndex + 1);
};

/**
 * Adds a child to the client area.
 *
 * @param {object} child - The child to add.
 * @returns {object} The child that was added.
 */
Window.prototype.addInnerChild = function(child) {
    this._innerChildren.push(child);
    return this._clientArea.addChild(child);
};

/**
 * Updates the transform on all children of this container for rendering.
 */
Window.prototype.updateTransform = function() {
    this._updateClientArea();
    this._updateFrame();
    this._updateContentsBack();
    this._updateCursor();
    this._updateContents();
    this._updateArrows();
    this._updatePauseSign();
    PIXI.Container.prototype.updateTransform.call(this);
    this._updateFilterArea();
};

/**
 * Draws the window shape into PIXI.Graphics object. Used by WindowLayer.
 */
Window.prototype.drawShape = function(graphics) {
    if (graphics) {
        const width = this.width;
        const height = (this.height * this._openness) / 255;
        const x = this.x;
        const y = this.y + (this.height - height) / 2;
        graphics.beginFill(0xffffff);
        graphics.drawRoundedRect(x, y, width, height, 0);
        graphics.endFill();
    }
};

Window.prototype._createAllParts = function() {
    this._createContainer();
    this._createBackSprite();
    this._createFrameSprite();
    this._createClientArea();
    this._createContentsBackSprite();
    this._createCursorSprite();
    this._createContentsSprite();
    this._createArrowSprites();
    this._createPauseSignSprites();
};

Window.prototype._createContainer = function() {
    this._container = new PIXI.Container();
    this.addChild(this._container);
};

Window.prototype._createBackSprite = function() {
    this._backSprite = new Sprite();
    this._backSprite.addChild(new TilingSprite());
    this._container.addChild(this._backSprite);
};

Window.prototype._createFrameSprite = function() {
    this._frameSprite = new Sprite();
    for (let i = 0; i < 8; i++) {
        this._frameSprite.addChild(new Sprite());
    }
    this._container.addChild(this._frameSprite);
};

Window.prototype._createClientArea = function() {
    this._clientArea = new Sprite();
    this._clientArea.filters = [new PIXI.filters.AlphaFilter()];
    this._clientArea.filterArea = new Rectangle();
    this._clientArea.move(this._padding, this._padding);
    this.addChild(this._clientArea);
};

Window.prototype._createContentsBackSprite = function() {
    this._contentsBackSprite = new Sprite();
    this._clientArea.addChild(this._contentsBackSprite);
};

Window.prototype._createCursorSprite = function() {
    this._cursorSprite = new Sprite();
    for (let i = 0; i < 9; i++) {
        this._cursorSprite.addChild(new Sprite());
    }
    this._clientArea.addChild(this._cursorSprite);
};

Window.prototype._createContentsSprite = function() {
    this._contentsSprite = new Sprite();
    this._clientArea.addChild(this._contentsSprite);
};

Window.prototype._createArrowSprites = function() {
    this._downArrowSprite = new Sprite();
    this.addChild(this._downArrowSprite);
    this._upArrowSprite = new Sprite();
    this.addChild(this._upArrowSprite);
};

Window.prototype._createPauseSignSprites = function() {
    this._pauseSignSprite = new Sprite();
    this.addChild(this._pauseSignSprite);
};

Window.prototype._onWindowskinLoad = function() {
    this._refreshAllParts();
};

Window.prototype._refreshAllParts = function() {
    this._refreshBack();
    this._refreshFrame();
    this._refreshCursor();
    this._refreshArrows();
    this._refreshPauseSign();
};

Window.prototype._refreshBack = function() {
    const m = this._margin;
    const w = Math.max(0, this._width - m * 2);
    const h = Math.max(0, this._height - m * 2);
    const sprite = this._backSprite;
    const tilingSprite = sprite.children[0];
    // [Note] We use 95 instead of 96 here to avoid blurring edges.
    sprite.bitmap = this._windowskin;
    sprite.setFrame(0, 0, 95, 95);
    sprite.move(m, m);
    sprite.scale.x = w / 95;
    sprite.scale.y = h / 95;
    tilingSprite.bitmap = this._windowskin;
    tilingSprite.setFrame(0, 96, 96, 96);
    tilingSprite.move(0, 0, w, h);
    tilingSprite.scale.x = 1 / sprite.scale.x;
    tilingSprite.scale.y = 1 / sprite.scale.y;
    sprite.setColorTone(this._colorTone);
};

Window.prototype._refreshFrame = function() {
    const drect = { x: 0, y: 0, width: this._width, height: this._height };
    const srect = { x: 96, y: 0, width: 96, height: 96 };
    const m = 24;
    for (const child of this._frameSprite.children) {
        child.bitmap = this._windowskin;
    }
    this._setRectPartsGeometry(this._frameSprite, srect, drect, m);
};

Window.prototype._refreshCursor = function() {
    const drect = this._cursorRect.clone();
    const srect = { x: 96, y: 96, width: 48, height: 48 };
    const m = 4;
    for (const child of this._cursorSprite.children) {
        child.bitmap = this._windowskin;
    }
    this._setRectPartsGeometry(this._cursorSprite, srect, drect, m);
};

Window.prototype._setRectPartsGeometry = function(sprite, srect, drect, m) {
    const sx = srect.x;
    const sy = srect.y;
    const sw = srect.width;
    const sh = srect.height;
    const dx = drect.x;
    const dy = drect.y;
    const dw = drect.width;
    const dh = drect.height;
    const smw = sw - m * 2;
    const smh = sh - m * 2;
    const dmw = dw - m * 2;
    const dmh = dh - m * 2;
    const children = sprite.children;
    sprite.setFrame(0, 0, dw, dh);
    sprite.move(dx, dy);
    // corner
    children[0].setFrame(sx, sy, m, m);
    children[1].setFrame(sx + sw - m, sy, m, m);
    children[2].setFrame(sx, sy + sw - m, m, m);
    children[3].setFrame(sx + sw - m, sy + sw - m, m, m);
    children[0].move(0, 0);
    children[1].move(dw - m, 0);
    children[2].move(0, dh - m);
    children[3].move(dw - m, dh - m);
    // edge
    children[4].move(m, 0);
    children[5].move(m, dh - m);
    children[6].move(0, m);
    children[7].move(dw - m, m);
    children[4].setFrame(sx + m, sy, smw, m);
    children[5].setFrame(sx + m, sy + sw - m, smw, m);
    children[6].setFrame(sx, sy + m, m, smh);
    children[7].setFrame(sx + sw - m, sy + m, m, smh);
    children[4].scale.x = dmw / smw;
    children[5].scale.x = dmw / smw;
    children[6].scale.y = dmh / smh;
    children[7].scale.y = dmh / smh;
    // center
    if (children[8]) {
        children[8].setFrame(sx + m, sy + m, smw, smh);
        children[8].move(m, m);
        children[8].scale.x = dmw / smw;
        children[8].scale.y = dmh / smh;
    }
    for (const child of children) {
        child.visible = dw > 0 && dh > 0;
    }
};

Window.prototype._refreshArrows = function() {
    const w = this._width;
    const h = this._height;
    const p = 24;
    const q = p / 2;
    const sx = 96 + p;
    const sy = 0 + p;
    this._downArrowSprite.bitmap = this._windowskin;
    this._downArrowSprite.anchor.x = 0.5;
    this._downArrowSprite.anchor.y = 0.5;
    this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
    this._downArrowSprite.move(w / 2, h - q);
    this._upArrowSprite.bitmap = this._windowskin;
    this._upArrowSprite.anchor.x = 0.5;
    this._upArrowSprite.anchor.y = 0.5;
    this._upArrowSprite.setFrame(sx + q, sy, p, q);
    this._upArrowSprite.move(w / 2, q);
};

Window.prototype._refreshPauseSign = function() {
    const sx = 144;
    const sy = 96;
    const p = 24;
    this._pauseSignSprite.bitmap = this._windowskin;
    this._pauseSignSprite.anchor.x = 0.5;
    this._pauseSignSprite.anchor.y = 1;
    this._pauseSignSprite.move(this._width / 2, this._height);
    this._pauseSignSprite.setFrame(sx, sy, p, p);
    this._pauseSignSprite.alpha = 0;
};

Window.prototype._updateClientArea = function() {
    const pad = this._padding;
    this._clientArea.move(pad, pad);
    this._clientArea.x = pad - this.origin.x;
    this._clientArea.y = pad - this.origin.y;
    if (this.innerWidth > 0 && this.innerHeight > 0) {
        this._clientArea.visible = this.isOpen();
    } else {
        this._clientArea.visible = false;
    }
};

Window.prototype._updateFrame = function() {
    this._frameSprite.visible = this.frameVisible;
};

Window.prototype._updateContentsBack = function() {
    const bitmap = this._contentsBackSprite.bitmap;
    if (bitmap) {
        this._contentsBackSprite.setFrame(0, 0, bitmap.width, bitmap.height);
    }
};

Window.prototype._updateCursor = function() {
    this._cursorSprite.alpha = this._makeCursorAlpha();
    this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
    this._cursorSprite.x = this._cursorRect.x;
    this._cursorSprite.y = this._cursorRect.y;
};

Window.prototype._makeCursorAlpha = function() {
    const blinkCount = this._animationCount % 40;
    const baseAlpha = this.contentsOpacity / 255;
    if (this.active) {
        if (blinkCount < 20) {
            return baseAlpha - blinkCount / 32;
        } else {
            return baseAlpha - (40 - blinkCount) / 32;
        }
    }
    return baseAlpha;
};

Window.prototype._updateContents = function() {
    const bitmap = this._contentsSprite.bitmap;
    if (bitmap) {
        this._contentsSprite.setFrame(0, 0, bitmap.width, bitmap.height);
    }
};

Window.prototype._updateArrows = function() {
    this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;
    this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;
};

Window.prototype._updatePauseSign = function() {
    const sprite = this._pauseSignSprite;
    const x = Math.floor(this._animationCount / 16) % 2;
    const y = Math.floor(this._animationCount / 16 / 2) % 2;
    const sx = 144;
    const sy = 96;
    const p = 24;
    if (!this.pause) {
        sprite.alpha = 0;
    } else if (sprite.alpha < 1) {
        sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
    }
    sprite.setFrame(sx + x * p, sy + y * p, p, p);
    sprite.visible = this.isOpen();
};

Window.prototype._updateFilterArea = function() {
    const pos = this._clientArea.worldTransform.apply(new Point(0, 0));
    const filterArea = this._clientArea.filterArea;
    filterArea.x = pos.x + this.origin.x;
    filterArea.y = pos.y + this.origin.y;
    filterArea.width = this.innerWidth;
    filterArea.height = this.innerHeight;
};

//-----------------------------------------------------------------------------
/**
 * The layer which contains game windows.
 *
 * @class
 * @extends PIXI.Container
 */
function WindowLayer() {
    this.initialize(...arguments);
}

WindowLayer.prototype = Object.create(PIXI.Container.prototype);
WindowLayer.prototype.constructor = WindowLayer;

WindowLayer.prototype.initialize = function() {
    PIXI.Container.call(this);
};

/**
 * Updates the window layer for each frame.
 */
WindowLayer.prototype.update = function() {
    for (const child of this.children) {
        if (child.update) {
            child.update();
        }
    }
};

/**
 * Renders the object using the WebGL renderer.
 *
 * @param {PIXI.Renderer} renderer - The renderer.
 */
WindowLayer.prototype.render = function render(renderer) {
    if (!this.visible) {
        return;
    }

    const graphics = new PIXI.Graphics();
    const gl = renderer.gl;
    const children = this.children.clone();

    renderer.framebuffer.forceStencil();
    graphics.transform = this.transform;
    renderer.batch.flush();
    gl.enable(gl.STENCIL_TEST);

    while (children.length > 0) {
        const win = children.pop();
        if (win._isWindow && win.visible && win.openness > 0) {
            gl.stencilFunc(gl.EQUAL, 0, ~0);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            win.render(renderer);
            renderer.batch.flush();
            graphics.clear();
            win.drawShape(graphics);
            gl.stencilFunc(gl.ALWAYS, 1, ~0);
            gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);
            gl.blendFunc(gl.ZERO, gl.ONE);
            graphics.render(renderer);
            renderer.batch.flush();
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        }
    }

    gl.disable(gl.STENCIL_TEST);
    gl.clear(gl.STENCIL_BUFFER_BIT);
    gl.clearStencil(0);
    renderer.batch.flush();

    for (const child of this.children) {
        if (!child._isWindow && child.visible) {
            child.render(renderer);
        }
    }

    renderer.batch.flush();
};

//-----------------------------------------------------------------------------
/**
 * The weather effect which displays rain, storm, or snow.
 *
 * @class
 * @extends PIXI.Container
 */
function Weather() {
    this.initialize(...arguments);
}

Weather.prototype = Object.create(PIXI.Container.prototype);
Weather.prototype.constructor = Weather;

Weather.prototype.initialize = function() {
    PIXI.Container.call(this);

    this._width = Graphics.width;
    this._height = Graphics.height;
    this._sprites = [];

    this._createBitmaps();
    this._createDimmer();

    /**
     * The type of the weather in ["none", "rain", "storm", "snow"].
     *
     * @type string
     */
    this.type = "none";

    /**
     * The power of the weather in the range (0, 9).
     *
     * @type number
     */
    this.power = 0;

    /**
     * The origin point of the weather for scrolling.
     *
     * @type Point
     */
    this.origin = new Point();
};

/**
 * Destroys the weather.
 */
Weather.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Container.prototype.destroy.call(this, options);
    this._rainBitmap.destroy();
    this._stormBitmap.destroy();
    this._snowBitmap.destroy();
};

/**
 * Updates the weather for each frame.
 */
Weather.prototype.update = function() {
    this._updateDimmer();
    this._updateAllSprites();
};

Weather.prototype._createBitmaps = function() {
    this._rainBitmap = new Bitmap(1, 60);
    this._rainBitmap.fillAll("white");
    this._stormBitmap = new Bitmap(2, 100);
    this._stormBitmap.fillAll("white");
    this._snowBitmap = new Bitmap(9, 9);
    this._snowBitmap.drawCircle(4, 4, 4, "white");
};

Weather.prototype._createDimmer = function() {
    this._dimmerSprite = new ScreenSprite();
    this._dimmerSprite.setColor(80, 80, 80);
    this.addChild(this._dimmerSprite);
};

Weather.prototype._updateDimmer = function() {
    this._dimmerSprite.opacity = Math.floor(this.power * 6);
};

Weather.prototype._updateAllSprites = function() {
    const maxSprites = Math.floor(this.power * 10);
    while (this._sprites.length < maxSprites) {
        this._addSprite();
    }
    while (this._sprites.length > maxSprites) {
        this._removeSprite();
    }
    for (const sprite of this._sprites) {
        this._updateSprite(sprite);
        sprite.x = sprite.ax - this.origin.x;
        sprite.y = sprite.ay - this.origin.y;
    }
};

Weather.prototype._addSprite = function() {
    const sprite = new Sprite(this.viewport);
    sprite.opacity = 0;
    this._sprites.push(sprite);
    this.addChild(sprite);
};

Weather.prototype._removeSprite = function() {
    this.removeChild(this._sprites.pop());
};

Weather.prototype._updateSprite = function(sprite) {
    switch (this.type) {
        case "rain":
            this._updateRainSprite(sprite);
            break;
        case "storm":
            this._updateStormSprite(sprite);
            break;
        case "snow":
            this._updateSnowSprite(sprite);
            break;
    }
    if (sprite.opacity < 40) {
        this._rebornSprite(sprite);
    }
};

Weather.prototype._updateRainSprite = function(sprite) {
    sprite.bitmap = this._rainBitmap;
    sprite.rotation = Math.PI / 16;
    sprite.ax -= 6 * Math.sin(sprite.rotation);
    sprite.ay += 6 * Math.cos(sprite.rotation);
    sprite.opacity -= 6;
};

Weather.prototype._updateStormSprite = function(sprite) {
    sprite.bitmap = this._stormBitmap;
    sprite.rotation = Math.PI / 8;
    sprite.ax -= 8 * Math.sin(sprite.rotation);
    sprite.ay += 8 * Math.cos(sprite.rotation);
    sprite.opacity -= 8;
};

Weather.prototype._updateSnowSprite = function(sprite) {
    sprite.bitmap = this._snowBitmap;
    sprite.rotation = Math.PI / 16;
    sprite.ax -= 3 * Math.sin(sprite.rotation);
    sprite.ay += 3 * Math.cos(sprite.rotation);
    sprite.opacity -= 3;
};

Weather.prototype._rebornSprite = function(sprite) {
    sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;
    sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;
    sprite.opacity = 160 + Math.randomInt(60);
};

//-----------------------------------------------------------------------------
/**
 * The color filter for WebGL.
 *
 * @class
 * @extends PIXI.Filter
 */
function ColorFilter() {
    this.initialize(...arguments);
}

ColorFilter.prototype = Object.create(PIXI.Filter.prototype);
ColorFilter.prototype.constructor = ColorFilter;

ColorFilter.prototype.initialize = function() {
    PIXI.Filter.call(this, null, this._fragmentSrc());
    this.uniforms.hue = 0;
    this.uniforms.colorTone = [0, 0, 0, 0];
    this.uniforms.blendColor = [0, 0, 0, 0];
    this.uniforms.brightness = 255;
};

/**
 * Sets the hue rotation value.
 *
 * @param {number} hue - The hue value (-360, 360).
 */
ColorFilter.prototype.setHue = function(hue) {
    this.uniforms.hue = Number(hue);
};

/**
 * Sets the color tone.
 *
 * @param {array} tone - The color tone [r, g, b, gray].
 */
ColorFilter.prototype.setColorTone = function(tone) {
    if (!(tone instanceof Array)) {
        throw new Error("Argument must be an array");
    }
    this.uniforms.colorTone = tone.clone();
};

/**
 * Sets the blend color.
 *
 * @param {array} color - The blend color [r, g, b, a].
 */
ColorFilter.prototype.setBlendColor = function(color) {
    if (!(color instanceof Array)) {
        throw new Error("Argument must be an array");
    }
    this.uniforms.blendColor = color.clone();
};

/**
 * Sets the brightness.
 *
 * @param {number} brightness - The brightness (0 to 255).
 */
ColorFilter.prototype.setBrightness = function(brightness) {
    this.uniforms.brightness = Number(brightness);
};

ColorFilter.prototype._fragmentSrc = function() {
    const src =
        "varying vec2 vTextureCoord;" +
        "uniform sampler2D uSampler;" +
        "uniform float hue;" +
        "uniform vec4 colorTone;" +
        "uniform vec4 blendColor;" +
        "uniform float brightness;" +
        "vec3 rgbToHsl(vec3 rgb) {" +
        "  float r = rgb.r;" +
        "  float g = rgb.g;" +
        "  float b = rgb.b;" +
        "  float cmin = min(r, min(g, b));" +
        "  float cmax = max(r, max(g, b));" +
        "  float h = 0.0;" +
        "  float s = 0.0;" +
        "  float l = (cmin + cmax) / 2.0;" +
        "  float delta = cmax - cmin;" +
        "  if (delta > 0.0) {" +
        "    if (r == cmax) {" +
        "      h = mod((g - b) / delta + 6.0, 6.0) / 6.0;" +
        "    } else if (g == cmax) {" +
        "      h = ((b - r) / delta + 2.0) / 6.0;" +
        "    } else {" +
        "      h = ((r - g) / delta + 4.0) / 6.0;" +
        "    }" +
        "    if (l < 1.0) {" +
        "      s = delta / (1.0 - abs(2.0 * l - 1.0));" +
        "    }" +
        "  }" +
        "  return vec3(h, s, l);" +
        "}" +
        "vec3 hslToRgb(vec3 hsl) {" +
        "  float h = hsl.x;" +
        "  float s = hsl.y;" +
        "  float l = hsl.z;" +
        "  float c = (1.0 - abs(2.0 * l - 1.0)) * s;" +
        "  float x = c * (1.0 - abs((mod(h * 6.0, 2.0)) - 1.0));" +
        "  float m = l - c / 2.0;" +
        "  float cm = c + m;" +
        "  float xm = x + m;" +
        "  if (h < 1.0 / 6.0) {" +
        "    return vec3(cm, xm, m);" +
        "  } else if (h < 2.0 / 6.0) {" +
        "    return vec3(xm, cm, m);" +
        "  } else if (h < 3.0 / 6.0) {" +
        "    return vec3(m, cm, xm);" +
        "  } else if (h < 4.0 / 6.0) {" +
        "    return vec3(m, xm, cm);" +
        "  } else if (h < 5.0 / 6.0) {" +
        "    return vec3(xm, m, cm);" +
        "  } else {" +
        "    return vec3(cm, m, xm);" +
        "  }" +
        "}" +
        "void main() {" +
        "  vec4 sample = texture2D(uSampler, vTextureCoord);" +
        "  float a = sample.a;" +
        "  vec3 hsl = rgbToHsl(sample.rgb);" +
        "  hsl.x = mod(hsl.x + hue / 360.0, 1.0);" +
        "  hsl.y = hsl.y * (1.0 - colorTone.a / 255.0);" +
        "  vec3 rgb = hslToRgb(hsl);" +
        "  float r = rgb.r;" +
        "  float g = rgb.g;" +
        "  float b = rgb.b;" +
        "  float r2 = colorTone.r / 255.0;" +
        "  float g2 = colorTone.g / 255.0;" +
        "  float b2 = colorTone.b / 255.0;" +
        "  float r3 = blendColor.r / 255.0;" +
        "  float g3 = blendColor.g / 255.0;" +
        "  float b3 = blendColor.b / 255.0;" +
        "  float i3 = blendColor.a / 255.0;" +
        "  float i1 = 1.0 - i3;" +
        "  r = clamp((r / a + r2) * a, 0.0, 1.0);" +
        "  g = clamp((g / a + g2) * a, 0.0, 1.0);" +
        "  b = clamp((b / a + b2) * a, 0.0, 1.0);" +
        "  r = clamp(r * i1 + r3 * i3 * a, 0.0, 1.0);" +
        "  g = clamp(g * i1 + g3 * i3 * a, 0.0, 1.0);" +
        "  b = clamp(b * i1 + b3 * i3 * a, 0.0, 1.0);" +
        "  r = r * brightness / 255.0;" +
        "  g = g * brightness / 255.0;" +
        "  b = b * brightness / 255.0;" +
        "  gl_FragColor = vec4(r, g, b, a);" +
        "}";
    return src;
};

//-----------------------------------------------------------------------------
/**
 * The root object of the display tree.
 *
 * @class
 * @extends PIXI.Container
 */
function Stage() {
    this.initialize(...arguments);
}

Stage.prototype = Object.create(PIXI.Container.prototype);
Stage.prototype.constructor = Stage;

Stage.prototype.initialize = function() {
    PIXI.Container.call(this);
};

/**
 * Destroys the stage.
 */
Stage.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Container.prototype.destroy.call(this, options);
};

//-----------------------------------------------------------------------------
/**
 * The audio object of Web Audio API.
 *
 * @class
 * @param {string} url - The url of the audio file.
 */
function WebAudio() {
    this.initialize(...arguments);
}

WebAudio.prototype.initialize = function(url) {
    this.clear();
    this._url = url;
    this._startLoading();
};

/**
 * Initializes the audio system.
 *
 * @returns {boolean} True if the audio system is available.
 */
WebAudio.initialize = function() {
    this._context = null;
    this._masterGainNode = null;
    this._masterVolume = 1;
    this._createContext();
    this._createMasterGainNode();
    this._setupEventHandlers();
    return !!this._context;
};

/**
 * Sets the master volume for all audio.
 *
 * @param {number} value - The master volume (0 to 1).
 */
WebAudio.setMasterVolume = function(value) {
    this._masterVolume = value;
    this._resetVolume();
};

WebAudio._createContext = function() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this._context = new AudioContext();
    } catch (e) {
        this._context = null;
    }
};

WebAudio._currentTime = function() {
    return this._context ? this._context.currentTime : 0;
};

WebAudio._createMasterGainNode = function() {
    const context = this._context;
    if (context) {
        this._masterGainNode = context.createGain();
        this._resetVolume();
        this._masterGainNode.connect(context.destination);
    }
};

WebAudio._setupEventHandlers = function() {
    const onUserGesture = this._onUserGesture.bind(this);
    const onVisibilityChange = this._onVisibilityChange.bind(this);
    document.addEventListener("keydown", onUserGesture);
    document.addEventListener("mousedown", onUserGesture);
    document.addEventListener("touchend", onUserGesture);
    document.addEventListener("visibilitychange", onVisibilityChange);
};

WebAudio._onUserGesture = function() {
    const context = this._context;
    if (context && context.state === "suspended") {
        context.resume();
    }
};

WebAudio._onVisibilityChange = function() {
    if (document.visibilityState === "hidden") {
        this._onHide();
    } else {
        this._onShow();
    }
};

WebAudio._onHide = function() {
    if (this._shouldMuteOnHide()) {
        this._fadeOut(1);
    }
};

WebAudio._onShow = function() {
    if (this._shouldMuteOnHide()) {
        this._fadeIn(1);
    }
};

WebAudio._shouldMuteOnHide = function() {
    return Utils.isMobileDevice() && !window.navigator.standalone;
};

WebAudio._resetVolume = function() {
    if (this._masterGainNode) {
        const gain = this._masterGainNode.gain;
        const volume = this._masterVolume;
        const currentTime = this._currentTime();
        gain.setValueAtTime(volume, currentTime);
    }
};

WebAudio._fadeIn = function(duration) {
    if (this._masterGainNode) {
        const gain = this._masterGainNode.gain;
        const volume = this._masterVolume;
        const currentTime = this._currentTime();
        gain.setValueAtTime(0, currentTime);
        gain.linearRampToValueAtTime(volume, currentTime + duration);
    }
};

WebAudio._fadeOut = function(duration) {
    if (this._masterGainNode) {
        const gain = this._masterGainNode.gain;
        const volume = this._masterVolume;
        const currentTime = this._currentTime();
        gain.setValueAtTime(volume, currentTime);
        gain.linearRampToValueAtTime(0, currentTime + duration);
    }
};

/**
 * Clears the audio data.
 */
WebAudio.prototype.clear = function() {
    this.stop();
    this._data = null;
    this._fetchedSize = 0;
    this._fetchedData = [];
    this._buffers = [];
    this._sourceNodes = [];
    this._gainNode = null;
    this._pannerNode = null;
    this._totalTime = 0;
    this._sampleRate = 0;
    this._loop = 0;
    this._loopStart = 0;
    this._loopLength = 0;
    this._loopStartTime = 0;
    this._loopLengthTime = 0;
    this._startTime = 0;
    this._volume = 1;
    this._pitch = 1;
    this._pan = 0;
    this._endTimer = null;
    this._loadListeners = [];
    this._stopListeners = [];
    this._lastUpdateTime = 0;
    this._isLoaded = false;
    this._isError = false;
    this._isPlaying = false;
    this._decoder = null;
};

/**
 * The url of the audio file.
 *
 * @readonly
 * @type string
 * @name WebAudio#url
 */
Object.defineProperty(WebAudio.prototype, "url", {
    get: function() {
        return this._url;
    },
    configurable: true
});

/**
 * The volume of the audio.
 *
 * @type number
 * @name WebAudio#volume
 */
Object.defineProperty(WebAudio.prototype, "volume", {
    get: function() {
        return this._volume;
    },
    set: function(value) {
        this._volume = value;
        if (this._gainNode) {
            this._gainNode.gain.setValueAtTime(
                this._volume,
                WebAudio._currentTime()
            );
        }
    },
    configurable: true
});

/**
 * The pitch of the audio.
 *
 * @type number
 * @name WebAudio#pitch
 */
Object.defineProperty(WebAudio.prototype, "pitch", {
    get: function() {
        return this._pitch;
    },
    set: function(value) {
        if (this._pitch !== value) {
            this._pitch = value;
            if (this.isPlaying()) {
                this.play(this._loop, 0);
            }
        }
    },
    configurable: true
});

/**
 * The pan of the audio.
 *
 * @type number
 * @name WebAudio#pan
 */
Object.defineProperty(WebAudio.prototype, "pan", {
    get: function() {
        return this._pan;
    },
    set: function(value) {
        this._pan = value;
        this._updatePanner();
    },
    configurable: true
});

/**
 * Checks whether the audio data is ready to play.
 *
 * @returns {boolean} True if the audio data is ready to play.
 */
WebAudio.prototype.isReady = function() {
    return this._buffers && this._buffers.length > 0;
};

/**
 * Checks whether a loading error has occurred.
 *
 * @returns {boolean} True if a loading error has occurred.
 */
WebAudio.prototype.isError = function() {
    return this._isError;
};

/**
 * Checks whether the audio is playing.
 *
 * @returns {boolean} True if the audio is playing.
 */
WebAudio.prototype.isPlaying = function() {
    return this._isPlaying;
};

/**
 * Plays the audio.
 *
 * @param {boolean} loop - Whether the audio data play in a loop.
 * @param {number} offset - The start position to play in seconds.
 */
WebAudio.prototype.play = function(loop, offset) {
    this._loop = loop;
    if (this.isReady()) {
        offset = offset || 0;
        this._startPlaying(offset);
    } else if (WebAudio._context) {
        this.addLoadListener(() => this.play(loop, offset));
    }
    this._isPlaying = true;
};

/**
 * Stops the audio.
 */
WebAudio.prototype.stop = function() {
    this._isPlaying = false;
    this._removeEndTimer();
    this._removeNodes();
    this._loadListeners = [];
    if (this._stopListeners) {
        while (this._stopListeners.length > 0) {
            const listner = this._stopListeners.shift();
            listner();
        }
    }
};

/**
 * Destroys the audio.
 */
WebAudio.prototype.destroy = function() {
    this._destroyDecoder();
    this.clear();
};

/**
 * Performs the audio fade-in.
 *
 * @param {number} duration - Fade-in time in seconds.
 */
WebAudio.prototype.fadeIn = function(duration) {
    if (this.isReady()) {
        if (this._gainNode) {
            const gain = this._gainNode.gain;
            const currentTime = WebAudio._currentTime();
            gain.setValueAtTime(0, currentTime);
            gain.linearRampToValueAtTime(this._volume, currentTime + duration);
        }
    } else {
        this.addLoadListener(() => this.fadeIn(duration));
    }
};

/**
 * Performs the audio fade-out.
 *
 * @param {number} duration - Fade-out time in seconds.
 */
WebAudio.prototype.fadeOut = function(duration) {
    if (this._gainNode) {
        const gain = this._gainNode.gain;
        const currentTime = WebAudio._currentTime();
        gain.setValueAtTime(this._volume, currentTime);
        gain.linearRampToValueAtTime(0, currentTime + duration);
    }
    this._isPlaying = false;
    this._loadListeners = [];
};

/**
 * Gets the seek position of the audio.
 */
WebAudio.prototype.seek = function() {
    if (WebAudio._context) {
        let pos = (WebAudio._currentTime() - this._startTime) * this._pitch;
        if (this._loopLengthTime > 0) {
            while (pos >= this._loopStartTime + this._loopLengthTime) {
                pos -= this._loopLengthTime;
            }
        }
        return pos;
    } else {
        return 0;
    }
};

/**
 * Adds a callback function that will be called when the audio data is loaded.
 *
 * @param {function} listner - The callback function.
 */
WebAudio.prototype.addLoadListener = function(listner) {
    this._loadListeners.push(listner);
};

/**
 * Adds a callback function that will be called when the playback is stopped.
 *
 * @param {function} listner - The callback function.
 */
WebAudio.prototype.addStopListener = function(listner) {
    this._stopListeners.push(listner);
};

/**
 * Tries to load the audio again.
 */
WebAudio.prototype.retry = function() {
    this._startLoading();
    if (this._isPlaying) {
        this.play(this._loop, 0);
    }
};

WebAudio.prototype._startLoading = function() {
    if (WebAudio._context) {
        const url = this._realUrl();
        if (Utils.isLocal()) {
            this._startXhrLoading(url);
        } else {
            this._startFetching(url);
        }
        const currentTime = WebAudio._currentTime();
        this._lastUpdateTime = currentTime - 0.5;
        this._isError = false;
        this._isLoaded = false;
        this._destroyDecoder();
        if (this._shouldUseDecoder()) {
            this._createDecoder();
        }
    }
};

WebAudio.prototype._shouldUseDecoder = function() {
    return !Utils.canPlayOgg() && typeof VorbisDecoder === "function";
};

WebAudio.prototype._createDecoder = function() {
    this._decoder = new VorbisDecoder(
        WebAudio._context,
        this._onDecode.bind(this),
        this._onError.bind(this)
    );
};

WebAudio.prototype._destroyDecoder = function() {
    if (this._decoder) {
        this._decoder.destroy();
        this._decoder = null;
    }
};

WebAudio.prototype._realUrl = function() {
    return this._url + (Utils.hasEncryptedAudio() ? "_" : "");
};

WebAudio.prototype._startXhrLoading = function(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => this._onXhrLoad(xhr);
    xhr.onerror = this._onError.bind(this);
    xhr.send();
};

WebAudio.prototype._startFetching = function(url) {
    const options = { credentials: "same-origin" };
    fetch(url, options)
        .then(response => this._onFetch(response))
        .catch(() => this._onError());
};

WebAudio.prototype._onXhrLoad = function(xhr) {
    if (xhr.status < 400) {
        this._data = new Uint8Array(xhr.response);
        this._isLoaded = true;
        this._updateBuffer();
    } else {
        this._onError();
    }
};

WebAudio.prototype._onFetch = function(response) {
    if (response.ok) {
        const reader = response.body.getReader();
        const readChunk = ({ done, value }) => {
            if (done) {
                this._isLoaded = true;
                if (this._fetchedSize > 0) {
                    this._concatenateFetchedData();
                    this._updateBuffer();
                    this._data = null;
                }
                return 0;
            } else {
                this._onFetchProcess(value);
                return reader.read().then(readChunk);
            }
        };
        reader
            .read()
            .then(readChunk)
            .catch(() => this._onError());
    } else {
        this._onError();
    }
};

WebAudio.prototype._onError = function() {
    if (this._sourceNodes.length > 0) {
        this._stopSourceNode();
    }
    this._data = null;
    this._isError = true;
};

WebAudio.prototype._onFetchProcess = function(value) {
    this._fetchedSize += value.length;
    this._fetchedData.push(value);
    this._updateBufferOnFetch();
};

WebAudio.prototype._updateBufferOnFetch = function() {
    const currentTime = WebAudio._currentTime();
    const deltaTime = currentTime - this._lastUpdateTime;
    const currentData = this._data;
    const currentSize = currentData ? currentData.length : 0;
    if (deltaTime >= 1 && currentSize + this._fetchedSize >= 200000) {
        this._concatenateFetchedData();
        this._updateBuffer();
        this._lastUpdateTime = currentTime;
    }
};

WebAudio.prototype._concatenateFetchedData = function() {
    const currentData = this._data;
    const currentSize = currentData ? currentData.length : 0;
    const newData = new Uint8Array(currentSize + this._fetchedSize);
    let pos = 0;
    if (currentData) {
        newData.set(currentData);
        pos += currentSize;
    }
    for (const value of this._fetchedData) {
        newData.set(value, pos);
        pos += value.length;
    }
    this._data = newData;
    this._fetchedData = [];
    this._fetchedSize = 0;
};

WebAudio.prototype._updateBuffer = function() {
    const arrayBuffer = this._readableBuffer();
    this._readLoopComments(arrayBuffer);
    this._decodeAudioData(arrayBuffer);
};

WebAudio.prototype._readableBuffer = function() {
    if (Utils.hasEncryptedAudio()) {
        return Utils.decryptArrayBuffer(this._data.buffer);
    } else {
        return this._data.buffer;
    }
};

WebAudio.prototype._decodeAudioData = function(arrayBuffer) {
    if (this._shouldUseDecoder()) {
        if (this._decoder) {
            this._decoder.send(arrayBuffer, this._isLoaded);
        }
    } else {
        // [Note] Make a temporary copy of arrayBuffer because
        //   decodeAudioData() detaches it.
        WebAudio._context
            .decodeAudioData(arrayBuffer.slice())
            .then(buffer => this._onDecode(buffer))
            .catch(() => this._onError());
    }
};

WebAudio.prototype._onDecode = function(buffer) {
    if (!this._shouldUseDecoder()) {
        this._buffers = [];
        this._totalTime = 0;
    }
    this._buffers.push(buffer);
    this._totalTime += buffer.duration;
    if (this._loopLength > 0 && this._sampleRate > 0) {
        this._loopStartTime = this._loopStart / this._sampleRate;
        this._loopLengthTime = this._loopLength / this._sampleRate;
    } else {
        this._loopStartTime = 0;
        this._loopLengthTime = this._totalTime;
    }
    if (this._sourceNodes.length > 0) {
        this._refreshSourceNode();
    }
    this._onLoad();
};

WebAudio.prototype._refreshSourceNode = function() {
    if (this._shouldUseDecoder()) {
        const index = this._buffers.length - 1;
        this._createSourceNode(index);
        if (this._isPlaying) {
            this._startSourceNode(index);
        }
    } else {
        this._stopSourceNode();
        this._createAllSourceNodes();
        if (this._isPlaying) {
            this._startAllSourceNodes();
        }
    }
    if (this._isPlaying) {
        this._removeEndTimer();
        this._createEndTimer();
    }
};

WebAudio.prototype._startPlaying = function(offset) {
    if (this._loopLengthTime > 0) {
        while (offset >= this._loopStartTime + this._loopLengthTime) {
            offset -= this._loopLengthTime;
        }
    }
    this._startTime = WebAudio._currentTime() - offset / this._pitch;
    this._removeEndTimer();
    this._removeNodes();
    this._createPannerNode();
    this._createGainNode();
    this._createAllSourceNodes();
    this._startAllSourceNodes();
    this._createEndTimer();
};

WebAudio.prototype._startAllSourceNodes = function() {
    for (let i = 0; i < this._sourceNodes.length; i++) {
        this._startSourceNode(i);
    }
};

WebAudio.prototype._startSourceNode = function(index) {
    const sourceNode = this._sourceNodes[index];
    const seekPos = this.seek();
    const currentTime = WebAudio._currentTime();
    const loop = this._loop;
    const loopStart = this._loopStartTime;
    const loopLength = this._loopLengthTime;
    const loopEnd = loopStart + loopLength;
    const pitch = this._pitch;
    let chunkStart = 0;
    for (let i = 0; i < index; i++) {
        chunkStart += this._buffers[i].duration;
    }
    const chunkEnd = chunkStart + sourceNode.buffer.duration;
    let when = 0;
    let offset = 0;
    let duration = sourceNode.buffer.duration;
    if (seekPos >= chunkStart && seekPos < chunkEnd - 0.01) {
        when = currentTime;
        offset = seekPos - chunkStart;
    } else {
        when = currentTime + (chunkStart - seekPos) / pitch;
        offset = 0;
        if (loop) {
            if (when < currentTime - 0.01) {
                when += loopLength / pitch;
            }
            if (seekPos >= loopStart && chunkStart < loopStart) {
                when += (loopStart - chunkStart) / pitch;
                offset = loopStart - chunkStart;
            }
        }
    }
    if (loop && loopEnd < chunkEnd) {
        duration = loopEnd - chunkStart - offset;
    }
    if (this._shouldUseDecoder()) {
        if (when >= currentTime && offset < duration) {
            sourceNode.loop = false;
            sourceNode.start(when, offset, duration);
            if (loop && chunkEnd > loopStart) {
                sourceNode.onended = () => {
                    this._createSourceNode(index);
                    this._startSourceNode(index);
                };
            }
        }
    } else {
        if (when >= currentTime && offset < sourceNode.buffer.duration) {
            sourceNode.start(when, offset);
        }
    }
    chunkStart += sourceNode.buffer.duration;
};

WebAudio.prototype._stopSourceNode = function() {
    for (const sourceNode of this._sourceNodes) {
        try {
            sourceNode.onended = null;
            sourceNode.stop();
        } catch (e) {
            // Ignore InvalidStateError
        }
    }
};

WebAudio.prototype._createPannerNode = function() {
    this._pannerNode = WebAudio._context.createPanner();
    this._pannerNode.panningModel = "equalpower";
    this._pannerNode.connect(WebAudio._masterGainNode);
    this._updatePanner();
};

WebAudio.prototype._createGainNode = function() {
    const currentTime = WebAudio._currentTime();
    this._gainNode = WebAudio._context.createGain();
    this._gainNode.gain.setValueAtTime(this._volume, currentTime);
    this._gainNode.connect(this._pannerNode);
};

WebAudio.prototype._createAllSourceNodes = function() {
    for (let i = 0; i < this._buffers.length; i++) {
        this._createSourceNode(i);
    }
};

WebAudio.prototype._createSourceNode = function(index) {
    const sourceNode = WebAudio._context.createBufferSource();
    const currentTime = WebAudio._currentTime();
    sourceNode.buffer = this._buffers[index];
    sourceNode.loop = this._loop && this._isLoaded;
    sourceNode.loopStart = this._loopStartTime;
    sourceNode.loopEnd = this._loopStartTime + this._loopLengthTime;
    sourceNode.playbackRate.setValueAtTime(this._pitch, currentTime);
    sourceNode.connect(this._gainNode);
    this._sourceNodes[index] = sourceNode;
};

WebAudio.prototype._removeNodes = function() {
    if (this._sourceNodes && this._sourceNodes.length > 0) {
        this._stopSourceNode();
        this._sourceNodes = [];
        this._gainNode = null;
        this._pannerNode = null;
    }
};

WebAudio.prototype._createEndTimer = function() {
    if (this._sourceNodes.length > 0 && !this._loop) {
        const endTime = this._startTime + this._totalTime / this._pitch;
        const delay = endTime - WebAudio._currentTime();
        this._endTimer = setTimeout(this.stop.bind(this), delay * 1000);
    }
};

WebAudio.prototype._removeEndTimer = function() {
    if (this._endTimer) {
        clearTimeout(this._endTimer);
        this._endTimer = null;
    }
};

WebAudio.prototype._updatePanner = function() {
    if (this._pannerNode) {
        const x = this._pan;
        const z = 1 - Math.abs(x);
        this._pannerNode.setPosition(x, 0, z);
    }
};

WebAudio.prototype._onLoad = function() {
    while (this._loadListeners.length > 0) {
        const listner = this._loadListeners.shift();
        listner();
    }
};

WebAudio.prototype._readLoopComments = function(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    let index = 0;
    while (index < view.byteLength - 30) {
        if (this._readFourCharacters(view, index) !== "OggS") {
            break;
        }
        index += 26;
        const numSegments = view.getUint8(index++);
        const segments = [];
        for (let i = 0; i < numSegments; i++) {
            segments.push(view.getUint8(index++));
        }
        const packets = [];
        while (segments.length > 0) {
            let packetSize = 0;
            while (segments[0] === 255) {
                packetSize += segments.shift();
            }
            if (segments.length > 0) {
                packetSize += segments.shift();
            }
            packets.push(packetSize);
        }
        let vorbisHeaderFound = false;
        for (const size of packets) {
            if (this._readFourCharacters(view, index + 1) === "vorb") {
                const headerType = view.getUint8(index);
                if (headerType === 1) {
                    this._sampleRate = view.getUint32(index + 12, true);
                } else if (headerType === 3) {
                    this._readMetaData(view, index, size);
                }
                vorbisHeaderFound = true;
            }
            index += size;
        }
        if (!vorbisHeaderFound) {
            break;
        }
    }
};

WebAudio.prototype._readMetaData = function(view, index, size) {
    for (let i = index; i < index + size - 10; i++) {
        if (this._readFourCharacters(view, i) === "LOOP") {
            let text = "";
            while (view.getUint8(i) > 0) {
                text += String.fromCharCode(view.getUint8(i++));
            }
            if (text.match(/LOOPSTART=([0-9]+)/)) {
                this._loopStart = parseInt(RegExp.$1);
            }
            if (text.match(/LOOPLENGTH=([0-9]+)/)) {
                this._loopLength = parseInt(RegExp.$1);
            }
            if (text === "LOOPSTART" || text === "LOOPLENGTH") {
                let text2 = "";
                i += 16;
                while (view.getUint8(i) > 0) {
                    text2 += String.fromCharCode(view.getUint8(i++));
                }
                if (text === "LOOPSTART") {
                    this._loopStart = parseInt(text2);
                } else {
                    this._loopLength = parseInt(text2);
                }
            }
        }
    }
};

WebAudio.prototype._readFourCharacters = function(view, index) {
    let string = "";
    if (index <= view.byteLength - 4) {
        for (let i = 0; i < 4; i++) {
            string += String.fromCharCode(view.getUint8(index + i));
        }
    }
    return string;
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles video playback.
 *
 * @namespace
 */
function Video() {
    throw new Error("This is a static class");
}

/**
 * Initializes the video system.
 *
 * @param {number} width - The width of the video.
 * @param {number} height - The height of the video.
 */
Video.initialize = function(width, height) {
    this._element = null;
    this._loading = false;
    this._volume = 1;
    this._createElement();
    this._setupEventHandlers();
    this.resize(width, height);
};

/**
 * Changes the display size of the video.
 *
 * @param {number} width - The width of the video.
 * @param {number} height - The height of the video.
 */
Video.resize = function(width, height) {
    if (this._element) {
        this._element.style.width = width + "px";
        this._element.style.height = height + "px";
    }
};

/**
 * Starts playback of a video.
 *
 * @param {string} src - The url of the video.
 */
Video.play = function(src) {
    this._element.src = src;
    this._element.onloadeddata = this._onLoad.bind(this);
    this._element.onerror = this._onError.bind(this);
    this._element.onended = this._onEnd.bind(this);
    this._element.load();
    this._loading = true;
};

/**
 * Checks whether the video is playing.
 *
 * @returns {boolean} True if the video is playing.
 */
Video.isPlaying = function() {
    return this._loading || this._isVisible();
};

/**
 * Sets the volume for videos.
 *
 * @param {number} volume - The volume for videos (0 to 1).
 */
Video.setVolume = function(volume) {
    this._volume = volume;
    if (this._element) {
        this._element.volume = this._volume;
    }
};

Video._createElement = function() {
    this._element = document.createElement("video");
    this._element.id = "gameVideo";
    this._element.style.position = "absolute";
    this._element.style.margin = "auto";
    this._element.style.top = 0;
    this._element.style.left = 0;
    this._element.style.right = 0;
    this._element.style.bottom = 0;
    this._element.style.opacity = 0;
    this._element.style.zIndex = 2;
    this._element.setAttribute("playsinline", "");
    this._element.oncontextmenu = () => false;
    document.body.appendChild(this._element);
};

Video._onLoad = function() {
    this._element.volume = this._volume;
    this._element.play();
    this._updateVisibility(true);
    this._loading = false;
};

Video._onError = function() {
    this._updateVisibility(false);
    const retry = () => {
        this._element.load();
    };
    throw ["LoadError", this._element.src, retry];
};

Video._onEnd = function() {
    this._updateVisibility(false);
};

Video._updateVisibility = function(videoVisible) {
    if (videoVisible) {
        Graphics.hideScreen();
    } else {
        Graphics.showScreen();
    }
    this._element.style.opacity = videoVisible ? 1 : 0;
};

Video._isVisible = function() {
    return this._element.style.opacity > 0;
};

Video._setupEventHandlers = function() {
    const onUserGesture = this._onUserGesture.bind(this);
    document.addEventListener("keydown", onUserGesture);
    document.addEventListener("mousedown", onUserGesture);
    document.addEventListener("touchend", onUserGesture);
};

Video._onUserGesture = function() {
    if (!this._element.src && this._element.paused) {
        this._element.play().catch(() => 0);
    }
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @namespace
 */
function Input() {
    throw new Error("This is a static class");
}

/**
 * Initializes the input system.
 */
Input.initialize = function() {
    this.clear();
    this._setupEventHandlers();
};

/**
 * The wait time of the key repeat in frames.
 *
 * @type number
 */
Input.keyRepeatWait = 24;

/**
 * The interval of the key repeat in frames.
 *
 * @type number
 */
Input.keyRepeatInterval = 6;

/**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @type Object
 */
Input.keyMapper = {
    9: "tab", // tab
    13: "ok", // enter
    16: "shift", // shift
    17: "control", // control
    18: "control", // alt
    27: "escape", // escape
    32: "ok", // space
    33: "pageup", // pageup
    34: "pagedown", // pagedown
    37: "left", // left arrow
    38: "up", // up arrow
    39: "right", // right arrow
    40: "down", // down arrow
    45: "escape", // insert
    81: "pageup", // Q
    87: "pagedown", // W
    88: "escape", // X
    90: "ok", // Z
    96: "escape", // numpad 0
    98: "down", // numpad 2
    100: "left", // numpad 4
    102: "right", // numpad 6
    104: "up", // numpad 8
    120: "debug" // F9
};

/**
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @type Object
 */
Input.gamepadMapper = {
    0: "ok", // A
    1: "cancel", // B
    2: "shift", // X
    3: "menu", // Y
    4: "pageup", // LB
    5: "pagedown", // RB
    12: "up", // D-pad up
    13: "down", // D-pad down
    14: "left", // D-pad left
    15: "right" // D-pad right
};

/**
 * Clears all the input data.
 */
Input.clear = function() {
    this._currentState = {};
    this._previousState = {};
    this._gamepadStates = [];
    this._latestButton = null;
    this._pressedTime = 0;
    this._dir4 = 0;
    this._dir8 = 0;
    this._preferredAxis = "";
    this._date = 0;
    this._virtualButton = null;
};

/**
 * Updates the input data.
 */
Input.update = function() {
    this._pollGamepads();
    if (this._currentState[this._latestButton]) {
        this._pressedTime++;
    } else {
        this._latestButton = null;
    }
    for (const name in this._currentState) {
        if (this._currentState[name] && !this._previousState[name]) {
            this._latestButton = name;
            this._pressedTime = 0;
            this._date = Date.now();
        }
        this._previousState[name] = this._currentState[name];
    }
    if (this._virtualButton) {
        this._latestButton = this._virtualButton;
        this._pressedTime = 0;
        this._virtualButton = null;
    }
    this._updateDirection();
};

/**
 * Checks whether a key is currently pressed down.
 *
 * @param {string} keyName - The mapped name of the key.
 * @returns {boolean} True if the key is pressed.
 */
Input.isPressed = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isPressed("escape")) {
        return true;
    } else {
        return !!this._currentState[keyName];
    }
};

/**
 * Checks whether a key is just pressed.
 *
 * @param {string} keyName - The mapped name of the key.
 * @returns {boolean} True if the key is triggered.
 */
Input.isTriggered = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isTriggered("escape")) {
        return true;
    } else {
        return this._latestButton === keyName && this._pressedTime === 0;
    }
};

/**
 * Checks whether a key is just pressed or a key repeat occurred.
 *
 * @param {string} keyName - The mapped name of the key.
 * @returns {boolean} True if the key is repeated.
 */
Input.isRepeated = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isRepeated("escape")) {
        return true;
    } else {
        return (
            this._latestButton === keyName &&
            (this._pressedTime === 0 ||
                (this._pressedTime >= this.keyRepeatWait &&
                    this._pressedTime % this.keyRepeatInterval === 0))
        );
    }
};

/**
 * Checks whether a key is kept depressed.
 *
 * @param {string} keyName - The mapped name of the key.
 * @returns {boolean} True if the key is long-pressed.
 */
Input.isLongPressed = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isLongPressed("escape")) {
        return true;
    } else {
        return (
            this._latestButton === keyName &&
            this._pressedTime >= this.keyRepeatWait
        );
    }
};

/**
 * The four direction value as a number of the numpad, or 0 for neutral.
 *
 * @readonly
 * @type number
 * @name Input.dir4
 */
Object.defineProperty(Input, "dir4", {
    get: function() {
        return this._dir4;
    },
    configurable: true
});

/**
 * The eight direction value as a number of the numpad, or 0 for neutral.
 *
 * @readonly
 * @type number
 * @name Input.dir8
 */
Object.defineProperty(Input, "dir8", {
    get: function() {
        return this._dir8;
    },
    configurable: true
});

/**
 * The time of the last input in milliseconds.
 *
 * @readonly
 * @type number
 * @name Input.date
 */
Object.defineProperty(Input, "date", {
    get: function() {
        return this._date;
    },
    configurable: true
});

Input.virtualClick = function(buttonName) {
    this._virtualButton = buttonName;
};

Input._setupEventHandlers = function() {
    document.addEventListener("keydown", this._onKeyDown.bind(this));
    document.addEventListener("keyup", this._onKeyUp.bind(this));
    window.addEventListener("blur", this._onLostFocus.bind(this));
};

Input._onKeyDown = function(event) {
    if (this._shouldPreventDefault(event.keyCode)) {
        event.preventDefault();
    }
    if (event.keyCode === 144) {
        // Numlock
        this.clear();
    }
    const buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = true;
    }
};

Input._shouldPreventDefault = function(keyCode) {
    switch (keyCode) {
        case 8: // backspace
        case 9: // tab
        case 33: // pageup
        case 34: // pagedown
        case 37: // left arrow
        case 38: // up arrow
        case 39: // right arrow
        case 40: // down arrow
            return true;
    }
    return false;
};

Input._onKeyUp = function(event) {
    const buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = false;
    }
};

Input._onLostFocus = function() {
    this.clear();
};

Input._pollGamepads = function() {
    if (navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        if (gamepads) {
            for (const gamepad of gamepads) {
                if (gamepad && gamepad.connected) {
                    this._updateGamepadState(gamepad);
                }
            }
        }
    }
};

Input._updateGamepadState = function(gamepad) {
    const lastState = this._gamepadStates[gamepad.index] || [];
    const newState = [];
    const buttons = gamepad.buttons;
    const axes = gamepad.axes;
    const threshold = 0.5;
    newState[12] = false;
    newState[13] = false;
    newState[14] = false;
    newState[15] = false;
    for (let i = 0; i < buttons.length; i++) {
        newState[i] = buttons[i].pressed;
    }
    if (axes[1] < -threshold) {
        newState[12] = true; // up
    } else if (axes[1] > threshold) {
        newState[13] = true; // down
    }
    if (axes[0] < -threshold) {
        newState[14] = true; // left
    } else if (axes[0] > threshold) {
        newState[15] = true; // right
    }
    for (let j = 0; j < newState.length; j++) {
        if (newState[j] !== lastState[j]) {
            const buttonName = this.gamepadMapper[j];
            if (buttonName) {
                this._currentState[buttonName] = newState[j];
            }
        }
    }
    this._gamepadStates[gamepad.index] = newState;
};

Input._updateDirection = function() {
    let x = this._signX();
    let y = this._signY();
    this._dir8 = this._makeNumpadDirection(x, y);
    if (x !== 0 && y !== 0) {
        if (this._preferredAxis === "x") {
            y = 0;
        } else {
            x = 0;
        }
    } else if (x !== 0) {
        this._preferredAxis = "y";
    } else if (y !== 0) {
        this._preferredAxis = "x";
    }
    this._dir4 = this._makeNumpadDirection(x, y);
};

Input._signX = function() {
    const left = this.isPressed("left") ? 1 : 0;
    const right = this.isPressed("right") ? 1 : 0;
    return right - left;
};

Input._signY = function() {
    const up = this.isPressed("up") ? 1 : 0;
    const down = this.isPressed("down") ? 1 : 0;
    return down - up;
};

Input._makeNumpadDirection = function(x, y) {
    if (x === 0 && y === 0) {
        return 0;
    } else {
        return 5 - y * 3 + x;
    }
};

Input._isEscapeCompatible = function(keyName) {
    return keyName === "cancel" || keyName === "menu";
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the mouse and touchscreen.
 *
 * @namespace
 */
function TouchInput() {
    throw new Error("This is a static class");
}

/**
 * Initializes the touch system.
 */
TouchInput.initialize = function() {
    this.clear();
    this._setupEventHandlers();
};

/**
 * The wait time of the pseudo key repeat in frames.
 *
 * @type number
 */
TouchInput.keyRepeatWait = 24;

/**
 * The interval of the pseudo key repeat in frames.
 *
 * @type number
 */
TouchInput.keyRepeatInterval = 6;

/**
 * The threshold number of pixels to treat as moved.
 *
 * @type number
 */
TouchInput.moveThreshold = 10;

/**
 * Clears all the touch data.
 */
TouchInput.clear = function() {
    this._mousePressed = false;
    this._screenPressed = false;
    this._pressedTime = 0;
    this._clicked = false;
    this._newState = this._createNewState();
    this._currentState = this._createNewState();
    this._x = 0;
    this._y = 0;
    this._triggerX = 0;
    this._triggerY = 0;
    this._moved = false;
    this._date = 0;
};

/**
 * Updates the touch data.
 */
TouchInput.update = function() {
    this._currentState = this._newState;
    this._newState = this._createNewState();
    this._clicked = this._currentState.released && !this._moved;
    if (this.isPressed()) {
        this._pressedTime++;
    }
};

/**
 * Checks whether the mouse button or touchscreen has been pressed and
 * released at the same position.
 *
 * @returns {boolean} True if the mouse button or touchscreen is clicked.
 */
TouchInput.isClicked = function() {
    return this._clicked;
};

/**
 * Checks whether the mouse button or touchscreen is currently pressed down.
 *
 * @returns {boolean} True if the mouse button or touchscreen is pressed.
 */
TouchInput.isPressed = function() {
    return this._mousePressed || this._screenPressed;
};

/**
 * Checks whether the left mouse button or touchscreen is just pressed.
 *
 * @returns {boolean} True if the mouse button or touchscreen is triggered.
 */
TouchInput.isTriggered = function() {
    return this._currentState.triggered;
};

/**
 * Checks whether the left mouse button or touchscreen is just pressed
 * or a pseudo key repeat occurred.
 *
 * @returns {boolean} True if the mouse button or touchscreen is repeated.
 */
TouchInput.isRepeated = function() {
    return (
        this.isPressed() &&
        (this._currentState.triggered ||
            (this._pressedTime >= this.keyRepeatWait &&
                this._pressedTime % this.keyRepeatInterval === 0))
    );
};

/**
 * Checks whether the left mouse button or touchscreen is kept depressed.
 *
 * @returns {boolean} True if the left mouse button or touchscreen is long-pressed.
 */
TouchInput.isLongPressed = function() {
    return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
};

/**
 * Checks whether the right mouse button is just pressed.
 *
 * @returns {boolean} True if the right mouse button is just pressed.
 */
TouchInput.isCancelled = function() {
    return this._currentState.cancelled;
};

/**
 * Checks whether the mouse or a finger on the touchscreen is moved.
 *
 * @returns {boolean} True if the mouse or a finger on the touchscreen is moved.
 */
TouchInput.isMoved = function() {
    return this._currentState.moved;
};

/**
 * Checks whether the mouse is moved without pressing a button.
 *
 * @returns {boolean} True if the mouse is hovered.
 */
TouchInput.isHovered = function() {
    return this._currentState.hovered;
};

/**
 * Checks whether the left mouse button or touchscreen is released.
 *
 * @returns {boolean} True if the mouse button or touchscreen is released.
 */
TouchInput.isReleased = function() {
    return this._currentState.released;
};

/**
 * The horizontal scroll amount.
 *
 * @readonly
 * @type number
 * @name TouchInput.wheelX
 */
Object.defineProperty(TouchInput, "wheelX", {
    get: function() {
        return this._currentState.wheelX;
    },
    configurable: true
});

/**
 * The vertical scroll amount.
 *
 * @readonly
 * @type number
 * @name TouchInput.wheelY
 */
Object.defineProperty(TouchInput, "wheelY", {
    get: function() {
        return this._currentState.wheelY;
    },
    configurable: true
});

/**
 * The x coordinate on the canvas area of the latest touch event.
 *
 * @readonly
 * @type number
 * @name TouchInput.x
 */
Object.defineProperty(TouchInput, "x", {
    get: function() {
        return this._x;
    },
    configurable: true
});

/**
 * The y coordinate on the canvas area of the latest touch event.
 *
 * @readonly
 * @type number
 * @name TouchInput.y
 */
Object.defineProperty(TouchInput, "y", {
    get: function() {
        return this._y;
    },
    configurable: true
});

/**
 * The time of the last input in milliseconds.
 *
 * @readonly
 * @type number
 * @name TouchInput.date
 */
Object.defineProperty(TouchInput, "date", {
    get: function() {
        return this._date;
    },
    configurable: true
});

TouchInput._createNewState = function() {
    return {
        triggered: false,
        cancelled: false,
        moved: false,
        hovered: false,
        released: false,
        wheelX: 0,
        wheelY: 0
    };
};

TouchInput._setupEventHandlers = function() {
    const pf = { passive: false };
    document.addEventListener("mousedown", this._onMouseDown.bind(this));
    document.addEventListener("mousemove", this._onMouseMove.bind(this));
    document.addEventListener("mouseup", this._onMouseUp.bind(this));
    document.addEventListener("wheel", this._onWheel.bind(this), pf);
    document.addEventListener("touchstart", this._onTouchStart.bind(this), pf);
    document.addEventListener("touchmove", this._onTouchMove.bind(this), pf);
    document.addEventListener("touchend", this._onTouchEnd.bind(this));
    document.addEventListener("touchcancel", this._onTouchCancel.bind(this));
    window.addEventListener("blur", this._onLostFocus.bind(this));
};

TouchInput._onMouseDown = function(event) {
    if (event.button === 0) {
        this._onLeftButtonDown(event);
    } else if (event.button === 1) {
        this._onMiddleButtonDown(event);
    } else if (event.button === 2) {
        this._onRightButtonDown(event);
    }
};

TouchInput._onLeftButtonDown = function(event) {
    const x = Graphics.pageToCanvasX(event.pageX);
    const y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._mousePressed = true;
        this._pressedTime = 0;
        this._onTrigger(x, y);
    }
};

TouchInput._onMiddleButtonDown = function(/*event*/) {
    //
};

TouchInput._onRightButtonDown = function(event) {
    const x = Graphics.pageToCanvasX(event.pageX);
    const y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._onCancel(x, y);
    }
};

TouchInput._onMouseMove = function(event) {
    const x = Graphics.pageToCanvasX(event.pageX);
    const y = Graphics.pageToCanvasY(event.pageY);
    if (this._mousePressed) {
        this._onMove(x, y);
    } else if (Graphics.isInsideCanvas(x, y)) {
        this._onHover(x, y);
    }
};

TouchInput._onMouseUp = function(event) {
    if (event.button === 0) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        this._mousePressed = false;
        this._onRelease(x, y);
    }
};

TouchInput._onWheel = function(event) {
    this._newState.wheelX += event.deltaX;
    this._newState.wheelY += event.deltaY;
    event.preventDefault();
};

TouchInput._onTouchStart = function(event) {
    for (const touch of event.changedTouches) {
        const x = Graphics.pageToCanvasX(touch.pageX);
        const y = Graphics.pageToCanvasY(touch.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._screenPressed = true;
            this._pressedTime = 0;
            if (event.touches.length >= 2) {
                this._onCancel(x, y);
            } else {
                this._onTrigger(x, y);
            }
            event.preventDefault();
        }
    }
    if (window.cordova || window.navigator.standalone) {
        event.preventDefault();
    }
};

TouchInput._onTouchMove = function(event) {
    for (const touch of event.changedTouches) {
        const x = Graphics.pageToCanvasX(touch.pageX);
        const y = Graphics.pageToCanvasY(touch.pageY);
        this._onMove(x, y);
    }
};

TouchInput._onTouchEnd = function(event) {
    for (const touch of event.changedTouches) {
        const x = Graphics.pageToCanvasX(touch.pageX);
        const y = Graphics.pageToCanvasY(touch.pageY);
        this._screenPressed = false;
        this._onRelease(x, y);
    }
};

TouchInput._onTouchCancel = function(/*event*/) {
    this._screenPressed = false;
};

TouchInput._onLostFocus = function() {
    this.clear();
};

TouchInput._onTrigger = function(x, y) {
    this._newState.triggered = true;
    this._x = x;
    this._y = y;
    this._triggerX = x;
    this._triggerY = y;
    this._moved = false;
    this._date = Date.now();
};

TouchInput._onCancel = function(x, y) {
    this._newState.cancelled = true;
    this._x = x;
    this._y = y;
};

TouchInput._onMove = function(x, y) {
    const dx = Math.abs(x - this._triggerX);
    const dy = Math.abs(y - this._triggerY);
    if (dx > this.moveThreshold || dy > this.moveThreshold) {
        this._moved = true;
    }
    if (this._moved) {
        this._newState.moved = true;
        this._x = x;
        this._y = y;
    }
};

TouchInput._onHover = function(x, y) {
    this._newState.hovered = true;
    this._x = x;
    this._y = y;
};

TouchInput._onRelease = function(x, y) {
    this._newState.released = true;
    this._x = x;
    this._y = y;
};

//-----------------------------------------------------------------------------
/**
 * The static class that handles JSON with object information.
 *
 * @namespace
 */
function JsonEx() {
    throw new Error("This is a static class");
}

/**
 * The maximum depth of objects.
 *
 * @type number
 * @default 100
 */
JsonEx.maxDepth = 100;

/**
 * Converts an object to a JSON string with object information.
 *
 * @param {object} object - The object to be converted.
 * @returns {string} The JSON string.
 */
JsonEx.stringify = function(object) {
    return JSON.stringify(this._encode(object, 0));
};

/**
 * Parses a JSON string and reconstructs the corresponding object.
 *
 * @param {string} json - The JSON string.
 * @returns {object} The reconstructed object.
 */
JsonEx.parse = function(json) {
    return this._decode(JSON.parse(json));
};

/**
 * Makes a deep copy of the specified object.
 *
 * @param {object} object - The object to be copied.
 * @returns {object} The copied object.
 */
JsonEx.makeDeepCopy = function(object) {
    return this.parse(this.stringify(object));
};

JsonEx._encode = function(value, depth) {
    // [Note] The handling code for circular references in certain versions of
    //   MV has been removed because it was too complicated and expensive.
    if (depth >= this.maxDepth) {
        throw new Error("Object too deep");
    }
    const type = Object.prototype.toString.call(value);
    if (type === "[object Object]" || type === "[object Array]") {
        const constructorName = value.constructor.name;
        if (constructorName !== "Object" && constructorName !== "Array") {
            value["@"] = constructorName;
        }
        for (const key of Object.keys(value)) {
            value[key] = this._encode(value[key], depth + 1);
        }
    }
    return value;
};

JsonEx._decode = function(value) {
    const type = Object.prototype.toString.call(value);
    if (type === "[object Object]" || type === "[object Array]") {
        if (value["@"]) {
            const constructor = window[value["@"]];
            if (constructor) {
                Object.setPrototypeOf(value, constructor.prototype);
            }
        }
        for (const key of Object.keys(value)) {
            value[key] = this._decode(value[key]);
        }
    }
    return value;
};

//-----------------------------------------------------------------------------
