//=============================================================================
// rmmz_windows.js v1.9.0
//=============================================================================

//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.

function Window_Base() {
    this.initialize(...arguments);
}

Window_Base.prototype = Object.create(Window.prototype);
Window_Base.prototype.constructor = Window_Base;

Window_Base.prototype.initialize = function(rect) {
    Window.prototype.initialize.call(this);
    this.loadWindowskin();
    this.checkRectObject(rect);
    this.move(rect.x, rect.y, rect.width, rect.height);
    this.updatePadding();
    this.updateBackOpacity();
    this.updateTone();
    this.createContents();
    this._opening = false;
    this._closing = false;
    this._dimmerSprite = null;
};

Window_Base.prototype.destroy = function(options) {
    this.destroyContents();
    if (this._dimmerSprite) {
        this._dimmerSprite.bitmap.destroy();
    }
    Window.prototype.destroy.call(this, options);
};

Window_Base.prototype.checkRectObject = function(rect) {
    if (typeof rect !== "object" || !("x" in rect)) {
        // Probably MV plugin is used
        throw new Error("Argument must be a Rectangle");
    }
};

Window_Base.prototype.lineHeight = function() {
    return 36;
};

Window_Base.prototype.itemWidth = function() {
    return this.innerWidth;
};

Window_Base.prototype.itemHeight = function() {
    return this.lineHeight();
};

Window_Base.prototype.itemPadding = function() {
    return 8;
};

Window_Base.prototype.baseTextRect = function() {
    const rect = new Rectangle(0, 0, this.innerWidth, this.innerHeight);
    rect.pad(-this.itemPadding(), 0);
    return rect;
};

Window_Base.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem("Window");
};

Window_Base.prototype.updatePadding = function() {
    this.padding = $gameSystem.windowPadding();
};

Window_Base.prototype.updateBackOpacity = function() {
    this.backOpacity = $gameSystem.windowOpacity();
};

Window_Base.prototype.fittingHeight = function(numLines) {
    return numLines * this.itemHeight() + $gameSystem.windowPadding() * 2;
};

Window_Base.prototype.updateTone = function() {
    const tone = $gameSystem.windowTone();
    this.setTone(tone[0], tone[1], tone[2]);
};

Window_Base.prototype.createContents = function() {
    const width = this.contentsWidth();
    const height = this.contentsHeight();
    this.destroyContents();
    this.contents = new Bitmap(width, height);
    this.contentsBack = new Bitmap(width, height);
    this.resetFontSettings();
};

Window_Base.prototype.destroyContents = function() {
    if (this.contents) {
        this.contents.destroy();
    }
    if (this.contentsBack) {
        this.contentsBack.destroy();
    }
};

Window_Base.prototype.contentsWidth = function() {
    return this.innerWidth;
};

Window_Base.prototype.contentsHeight = function() {
    return this.innerHeight;
};

Window_Base.prototype.resetFontSettings = function() {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = $gameSystem.mainFontSize();
    this.resetTextColor();
};

Window_Base.prototype.resetTextColor = function() {
    this.changeTextColor(ColorManager.normalColor());
    this.changeOutlineColor(ColorManager.outlineColor());
};

Window_Base.prototype.update = function() {
    Window.prototype.update.call(this);
    this.updateTone();
    this.updateOpen();
    this.updateClose();
    this.updateBackgroundDimmer();
};

Window_Base.prototype.updateOpen = function() {
    if (this._opening) {
        this.openness += 32;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};

Window_Base.prototype.updateClose = function() {
    if (this._closing) {
        this.openness -= 32;
        if (this.isClosed()) {
            this._closing = false;
        }
    }
};

Window_Base.prototype.open = function() {
    if (!this.isOpen()) {
        this._opening = true;
    }
    this._closing = false;
};

Window_Base.prototype.close = function() {
    if (!this.isClosed()) {
        this._closing = true;
    }
    this._opening = false;
};

Window_Base.prototype.isOpening = function() {
    return this._opening;
};

Window_Base.prototype.isClosing = function() {
    return this._closing;
};

Window_Base.prototype.show = function() {
    this.visible = true;
};

Window_Base.prototype.hide = function() {
    this.visible = false;
};

Window_Base.prototype.activate = function() {
    this.active = true;
};

Window_Base.prototype.deactivate = function() {
    this.active = false;
};

Window_Base.prototype.systemColor = function() {
    return ColorManager.systemColor();
};

Window_Base.prototype.translucentOpacity = function() {
    return 160;
};

Window_Base.prototype.changeTextColor = function(color) {
    this.contents.textColor = color;
};

Window_Base.prototype.changeOutlineColor = function(color) {
    this.contents.outlineColor = color;
};

Window_Base.prototype.changePaintOpacity = function(enabled) {
    this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
};

Window_Base.prototype.drawRect = function(x, y, width, height) {
    const outlineColor = this.contents.outlineColor;
    const mainColor = this.contents.textColor;
    this.contents.fillRect(x, y, width, height, outlineColor);
    this.contents.fillRect(x + 1, y + 1, width - 2, height - 2, mainColor);
};

Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};

Window_Base.prototype.textWidth = function(text) {
    return this.contents.measureTextWidth(text);
};

Window_Base.prototype.drawTextEx = function(text, x, y, width) {
    this.resetFontSettings();
    const textState = this.createTextState(text, x, y, width);
    this.processAllText(textState);
    return textState.outputWidth;
};

Window_Base.prototype.textSizeEx = function(text) {
    this.resetFontSettings();
    const textState = this.createTextState(text, 0, 0, 0);
    textState.drawing = false;
    this.processAllText(textState);
    return { width: textState.outputWidth, height: textState.outputHeight };
};

Window_Base.prototype.createTextState = function(text, x, y, width) {
    const rtl = Utils.containsArabic(text);
    const textState = {};
    textState.text = this.convertEscapeCharacters(text);
    textState.index = 0;
    textState.x = rtl ? x + width : x;
    textState.y = y;
    textState.width = width;
    textState.height = this.calcTextHeight(textState);
    textState.startX = textState.x;
    textState.startY = textState.y;
    textState.rtl = rtl;
    textState.buffer = this.createTextBuffer(rtl);
    textState.drawing = true;
    textState.outputWidth = 0;
    textState.outputHeight = 0;
    return textState;
};

Window_Base.prototype.processAllText = function(textState) {
    while (textState.index < textState.text.length) {
        this.processCharacter(textState);
    }
    this.flushTextState(textState);
};

Window_Base.prototype.flushTextState = function(textState) {
    const text = textState.buffer;
    const rtl = textState.rtl;
    const width = this.textWidth(text);
    const height = textState.height;
    const x = rtl ? textState.x - width : textState.x;
    const y = textState.y;
    if (textState.drawing) {
        this.contents.drawText(text, x, y, width, height);
    }
    textState.x += rtl ? -width : width;
    textState.buffer = this.createTextBuffer(rtl);
    const outputWidth = Math.abs(textState.x - textState.startX);
    if (textState.outputWidth < outputWidth) {
        textState.outputWidth = outputWidth;
    }
    textState.outputHeight = y - textState.startY + height;
};

Window_Base.prototype.createTextBuffer = function(rtl) {
    // U+202B: RIGHT-TO-LEFT EMBEDDING
    return rtl ? "\u202B" : "";
};

Window_Base.prototype.convertEscapeCharacters = function(text) {
    /* eslint no-control-regex: 0 */
    text = text.replace(/\\/g, "\x1b");
    text = text.replace(/\x1b\x1b/g, "\\");
    while (text.match(/\x1bV\[(\d+)\]/gi)) {
        text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
            $gameVariables.value(parseInt(p1))
        );
    }
    text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
        this.actorName(parseInt(p1))
    );
    text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
        this.partyMemberName(parseInt(p1))
    );
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};

Window_Base.prototype.actorName = function(n) {
    const actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : "";
};

Window_Base.prototype.partyMemberName = function(n) {
    const actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.name() : "";
};

Window_Base.prototype.processCharacter = function(textState) {
    const c = textState.text[textState.index++];
    if (c.charCodeAt(0) < 0x20) {
        this.flushTextState(textState);
        this.processControlCharacter(textState, c);
    } else {
        textState.buffer += c;
    }
};

Window_Base.prototype.processControlCharacter = function(textState, c) {
    if (c === "\n") {
        this.processNewLine(textState);
    }
    if (c === "\x1b") {
        const code = this.obtainEscapeCode(textState);
        this.processEscapeCharacter(code, textState);
    }
};

Window_Base.prototype.processNewLine = function(textState) {
    textState.x = textState.startX;
    textState.y += textState.height;
    textState.height = this.calcTextHeight(textState);
};

Window_Base.prototype.obtainEscapeCode = function(textState) {
    const regExp = /^[$.|^!><{}\\]|^[A-Z]+/i;
    const arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[0].toUpperCase();
    } else {
        return "";
    }
};

Window_Base.prototype.obtainEscapeParam = function(textState) {
    const regExp = /^\[\d+\]/;
    const arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return parseInt(arr[0].slice(1));
    } else {
        return "";
    }
};

Window_Base.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
        case "C":
            this.processColorChange(this.obtainEscapeParam(textState));
            break;
        case "I":
            this.processDrawIcon(this.obtainEscapeParam(textState), textState);
            break;
        case "PX":
            textState.x = this.obtainEscapeParam(textState);
            break;
        case "PY":
            textState.y = this.obtainEscapeParam(textState);
            break;
        case "FS":
            this.contents.fontSize = this.obtainEscapeParam(textState);
            break;
        case "{":
            this.makeFontBigger();
            break;
        case "}":
            this.makeFontSmaller();
            break;
    }
};

Window_Base.prototype.processColorChange = function(colorIndex) {
    this.changeTextColor(ColorManager.textColor(colorIndex));
};

Window_Base.prototype.processDrawIcon = function(iconIndex, textState) {
    const deltaX = ImageManager.standardIconWidth - ImageManager.iconWidth;
    const deltaY = ImageManager.standardIconHeight - ImageManager.iconHeight;
    if (textState.drawing) {
        const x = textState.x + deltaX / 2 + 2;
        const y = textState.y + deltaY / 2 + 2;
        this.drawIcon(iconIndex, x, y);
    }
    textState.x += ImageManager.standardIconWidth + 4;
};

Window_Base.prototype.makeFontBigger = function() {
    if (this.contents.fontSize <= 96) {
        this.contents.fontSize += 12;
    }
};

Window_Base.prototype.makeFontSmaller = function() {
    if (this.contents.fontSize >= 24) {
        this.contents.fontSize -= 12;
    }
};

Window_Base.prototype.calcTextHeight = function(textState) {
    const lineSpacing = this.lineHeight() - $gameSystem.mainFontSize();
    const lastFontSize = this.contents.fontSize;
    const lines = textState.text.slice(textState.index).split("\n");
    const textHeight = this.maxFontSizeInLine(lines[0]) + lineSpacing;
    this.contents.fontSize = lastFontSize;
    return textHeight;
};

Window_Base.prototype.maxFontSizeInLine = function(line) {
    let maxFontSize = this.contents.fontSize;
    const regExp = /\x1b({|}|FS)(\[(\d+)])?/gi;
    for (;;) {
        const array = regExp.exec(line);
        if (!array) {
            break;
        }
        const code = String(array[1]).toUpperCase();
        if (code === "{") {
            this.makeFontBigger();
        } else if (code === "}") {
            this.makeFontSmaller();
        } else if (code === "FS") {
            this.contents.fontSize = parseInt(array[3]);
        }
        if (this.contents.fontSize > maxFontSize) {
            maxFontSize = this.contents.fontSize;
        }
    }
    return maxFontSize;
};

Window_Base.prototype.drawIcon = function(iconIndex, x, y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};

// prettier-ignore
Window_Base.prototype.drawFace = function(
    faceName, faceIndex, x, y, width, height
) {
    width = width || ImageManager.standardFaceWidth;
    height = height || ImageManager.standardFaceHeight;
    const bitmap = ImageManager.loadFace(faceName);
    const pw = ImageManager.faceWidth;
    const ph = ImageManager.faceHeight;
    const sw = Math.min(width, pw);
    const sh = Math.min(height, ph);
    const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    const sx = Math.floor((faceIndex % 4) * pw + (pw - sw) / 2);
    const sy = Math.floor(Math.floor(faceIndex / 4) * ph + (ph - sh) / 2);
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

// prettier-ignore
Window_Base.prototype.drawCharacter = function(
    characterName, characterIndex, x, y
) {
    const bitmap = ImageManager.loadCharacter(characterName);
    const big = ImageManager.isBigCharacter(characterName);
    const pw = bitmap.width / (big ? 3 : 12);
    const ph = bitmap.height / (big ? 4 : 8);
    const n = big ? 0: characterIndex;
    const sx = ((n % 4) * 3 + 1) * pw;
    const sy = Math.floor(n / 4) * 4 * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
};

Window_Base.prototype.drawItemName = function(item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const delta = ImageManager.standardIconWidth - ImageManager.iconWidth;
        const textMargin = ImageManager.standardIconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + delta / 2, iconY);
        this.drawText(item.name, x + textMargin, y, itemWidth);
    }
};

Window_Base.prototype.drawCurrencyValue = function(value, unit, x, y, width) {
    const unitWidth = Math.min(80, this.textWidth(unit));
    this.resetTextColor();
    this.drawText(value, x, y, width - unitWidth - 6, "right");
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
};

Window_Base.prototype.setBackgroundType = function(type) {
    if (type === 0) {
        this.opacity = 255;
    } else {
        this.opacity = 0;
    }
    if (type === 1) {
        this.showBackgroundDimmer();
    } else {
        this.hideBackgroundDimmer();
    }
};

Window_Base.prototype.showBackgroundDimmer = function() {
    if (!this._dimmerSprite) {
        this.createDimmerSprite();
    }
    const bitmap = this._dimmerSprite.bitmap;
    if (bitmap.width !== this.width || bitmap.height !== this.height) {
        this.refreshDimmerBitmap();
    }
    this._dimmerSprite.visible = true;
    this.updateBackgroundDimmer();
};

Window_Base.prototype.createDimmerSprite = function() {
    this._dimmerSprite = new Sprite();
    this._dimmerSprite.bitmap = new Bitmap(0, 0);
    this._dimmerSprite.x = -4;
    this.addChildToBack(this._dimmerSprite);
};

Window_Base.prototype.hideBackgroundDimmer = function() {
    if (this._dimmerSprite) {
        this._dimmerSprite.visible = false;
    }
};

Window_Base.prototype.updateBackgroundDimmer = function() {
    if (this._dimmerSprite) {
        this._dimmerSprite.opacity = this.openness;
    }
};

Window_Base.prototype.refreshDimmerBitmap = function() {
    if (this._dimmerSprite) {
        const bitmap = this._dimmerSprite.bitmap;
        const w = this.width > 0 ? this.width + 8 : 0;
        const h = this.height;
        const m = this.padding;
        const c1 = ColorManager.dimColor1();
        const c2 = ColorManager.dimColor2();
        bitmap.resize(w, h);
        bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        bitmap.fillRect(0, m, w, h - m * 2, c1);
        bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        this._dimmerSprite.setFrame(0, 0, w, h);
    }
};

Window_Base.prototype.playCursorSound = function() {
    SoundManager.playCursor();
};

Window_Base.prototype.playOkSound = function() {
    SoundManager.playOk();
};

Window_Base.prototype.playBuzzerSound = function() {
    SoundManager.playBuzzer();
};

//-----------------------------------------------------------------------------
// Window_Scrollable
//
// The window class with scroll functions.

function Window_Scrollable() {
    this.initialize(...arguments);
}

Window_Scrollable.prototype = Object.create(Window_Base.prototype);
Window_Scrollable.prototype.constructor = Window_Scrollable;

Window_Scrollable.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._scrollX = 0;
    this._scrollY = 0;
    this._scrollBaseX = 0;
    this._scrollBaseY = 0;
    this.clearScrollStatus();
};

Window_Scrollable.prototype.clearScrollStatus = function() {
    this._scrollTargetX = 0;
    this._scrollTargetY = 0;
    this._scrollDuration = 0;
    this._scrollAccelX = 0;
    this._scrollAccelY = 0;
    this._scrollTouching = false;
    this._scrollLastTouchX = 0;
    this._scrollLastTouchY = 0;
    this._scrollLastCursorVisible = false;
};

Window_Scrollable.prototype.scrollX = function() {
    return this._scrollX;
};

Window_Scrollable.prototype.scrollY = function() {
    return this._scrollY;
};

Window_Scrollable.prototype.scrollBaseX = function() {
    return this._scrollBaseX;
};

Window_Scrollable.prototype.scrollBaseY = function() {
    return this._scrollBaseY;
};

Window_Scrollable.prototype.scrollTo = function(x, y) {
    const scrollX = x.clamp(0, this.maxScrollX());
    const scrollY = y.clamp(0, this.maxScrollY());
    if (this._scrollX !== scrollX || this._scrollY !== scrollY) {
        this._scrollX = scrollX;
        this._scrollY = scrollY;
        this.updateOrigin();
    }
};

Window_Scrollable.prototype.scrollBy = function(x, y) {
    this.scrollTo(this._scrollX + x, this._scrollY + y);
};

Window_Scrollable.prototype.smoothScrollTo = function(x, y) {
    this._scrollTargetX = x.clamp(0, this.maxScrollX());
    this._scrollTargetY = y.clamp(0, this.maxScrollY());
    this._scrollDuration = Input.keyRepeatInterval;
};

Window_Scrollable.prototype.smoothScrollBy = function(x, y) {
    if (this._scrollDuration === 0) {
        this._scrollTargetX = this.scrollX();
        this._scrollTargetY = this.scrollY();
    }
    this.smoothScrollTo(this._scrollTargetX + x, this._scrollTargetY + y);
};

Window_Scrollable.prototype.setScrollAccel = function(x, y) {
    this._scrollAccelX = x;
    this._scrollAccelY = y;
};

Window_Scrollable.prototype.overallWidth = function() {
    return this.innerWidth;
};

Window_Scrollable.prototype.overallHeight = function() {
    return this.innerHeight;
};

Window_Scrollable.prototype.maxScrollX = function() {
    return Math.max(0, this.overallWidth() - this.innerWidth);
};

Window_Scrollable.prototype.maxScrollY = function() {
    return Math.max(0, this.overallHeight() - this.innerHeight);
};

Window_Scrollable.prototype.scrollBlockWidth = function() {
    return this.itemWidth();
};

Window_Scrollable.prototype.scrollBlockHeight = function() {
    return this.itemHeight();
};

Window_Scrollable.prototype.smoothScrollDown = function(n) {
    this.smoothScrollBy(0, this.itemHeight() * n);
};

Window_Scrollable.prototype.smoothScrollUp = function(n) {
    this.smoothScrollBy(0, -this.itemHeight() * n);
};

Window_Scrollable.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.processWheelScroll();
    this.processTouchScroll();
    this.updateSmoothScroll();
    this.updateScrollAccel();
    this.updateArrows();
    this.updateOrigin();
};

Window_Scrollable.prototype.processWheelScroll = function() {
    if (this.isWheelScrollEnabled() && this.isTouchedInsideFrame()) {
        const threshold = 20;
        if (TouchInput.wheelY >= threshold) {
            this.smoothScrollDown(1);
        }
        if (TouchInput.wheelY <= -threshold) {
            this.smoothScrollUp(1);
        }
    }
};

Window_Scrollable.prototype.processTouchScroll = function() {
    if (this.isTouchScrollEnabled()) {
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            this.onTouchScrollStart();
        }
        if (this._scrollTouching) {
            if (TouchInput.isReleased()) {
                this.onTouchScrollEnd();
            } else if (TouchInput.isMoved()) {
                this.onTouchScroll();
            }
        }
    }
};

Window_Scrollable.prototype.isWheelScrollEnabled = function() {
    return this.isScrollEnabled();
};

Window_Scrollable.prototype.isTouchScrollEnabled = function() {
    return this.isScrollEnabled();
};

Window_Scrollable.prototype.isScrollEnabled = function() {
    return true;
};

Window_Scrollable.prototype.isTouchedInsideFrame = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.innerRect.contains(localPos.x, localPos.y);
};

Window_Scrollable.prototype.onTouchScrollStart = function() {
    this._scrollTouching = true;
    this._scrollLastTouchX = TouchInput.x;
    this._scrollLastTouchY = TouchInput.y;
    this._scrollLastCursorVisible = this.cursorVisible;
    this.setScrollAccel(0, 0);
};

Window_Scrollable.prototype.onTouchScroll = function() {
    const accelX = this._scrollLastTouchX - TouchInput.x;
    const accelY = this._scrollLastTouchY - TouchInput.y;
    this.setScrollAccel(accelX, accelY);
    this._scrollLastTouchX = TouchInput.x;
    this._scrollLastTouchY = TouchInput.y;
    this.cursorVisible = false;
};

Window_Scrollable.prototype.onTouchScrollEnd = function() {
    this._scrollTouching = false;
    this.cursorVisible = this._scrollLastCursorVisible;
};

Window_Scrollable.prototype.updateSmoothScroll = function() {
    if (this._scrollDuration > 0) {
        const d = this._scrollDuration;
        const deltaX = (this._scrollTargetX - this._scrollX) / d;
        const deltaY = (this._scrollTargetY - this._scrollY) / d;
        this.scrollBy(deltaX, deltaY);
        this._scrollDuration--;
    }
};

Window_Scrollable.prototype.updateScrollAccel = function() {
    if (this._scrollAccelX !== 0 || this._scrollAccelY !== 0) {
        this.scrollBy(this._scrollAccelX, this._scrollAccelY);
        this._scrollAccelX *= 0.92;
        this._scrollAccelY *= 0.92;
        if (Math.abs(this._scrollAccelX) < 1) {
            this._scrollAccelX = 0;
        }
        if (Math.abs(this._scrollAccelY) < 1) {
            this._scrollAccelY = 0;
        }
    }
};

Window_Scrollable.prototype.updateArrows = function() {
    this.downArrowVisible = this._scrollY < this.maxScrollY();
    this.upArrowVisible = this._scrollY > 0;
};

Window_Scrollable.prototype.updateOrigin = function() {
    const blockWidth = this.scrollBlockWidth() || 1;
    const blockHeight = this.scrollBlockHeight() || 1;
    const baseX = this._scrollX - (this._scrollX % blockWidth);
    const baseY = this._scrollY - (this._scrollY % blockHeight);
    if (baseX !== this._scrollBaseX || baseY !== this._scrollBaseY) {
        this.updateScrollBase(baseX, baseY);
        this.paint();
    }
    this.origin.x = this._scrollX % blockWidth;
    this.origin.y = this._scrollY % blockHeight;
};

Window_Scrollable.prototype.updateScrollBase = function(baseX, baseY) {
    const deltaX = baseX - this._scrollBaseX;
    const deltaY = baseY - this._scrollBaseY;
    this._scrollBaseX = baseX;
    this._scrollBaseY = baseY;
    this.moveCursorBy(-deltaX, -deltaY);
    this.moveInnerChildrenBy(-deltaX, -deltaY);
};

Window_Scrollable.prototype.paint = function() {
    // to be overridden
};

//-----------------------------------------------------------------------------
// Window_Selectable
//
// The window class with cursor movement functions.

function Window_Selectable() {
    this.initialize(...arguments);
}

Window_Selectable.prototype = Object.create(Window_Scrollable.prototype);
Window_Selectable.prototype.constructor = Window_Selectable;

Window_Selectable.prototype.initialize = function(rect) {
    Window_Scrollable.prototype.initialize.call(this, rect);
    this._index = -1;
    this._cursorFixed = false;
    this._cursorAll = false;
    this._helpWindow = null;
    this._handlers = {};
    this._doubleTouch = false;
    this._canRepeat = true;
    this.deactivate();
};

Window_Selectable.prototype.index = function() {
    return this._index;
};

Window_Selectable.prototype.cursorFixed = function() {
    return this._cursorFixed;
};

Window_Selectable.prototype.setCursorFixed = function(cursorFixed) {
    this._cursorFixed = cursorFixed;
};

Window_Selectable.prototype.cursorAll = function() {
    return this._cursorAll;
};

Window_Selectable.prototype.setCursorAll = function(cursorAll) {
    this._cursorAll = cursorAll;
};

Window_Selectable.prototype.maxCols = function() {
    return 1;
};

Window_Selectable.prototype.maxItems = function() {
    return 0;
};

Window_Selectable.prototype.colSpacing = function() {
    return 8;
};

Window_Selectable.prototype.rowSpacing = function() {
    return 4;
};

Window_Selectable.prototype.itemWidth = function() {
    return Math.floor(this.innerWidth / this.maxCols());
};

Window_Selectable.prototype.itemHeight = function() {
    return Window_Scrollable.prototype.itemHeight.call(this) + 8;
};

Window_Selectable.prototype.contentsHeight = function() {
    return this.innerHeight + this.itemHeight();
};

Window_Selectable.prototype.maxRows = function() {
    return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
};

Window_Selectable.prototype.overallHeight = function() {
    return this.maxRows() * this.itemHeight();
};

Window_Selectable.prototype.activate = function() {
    Window_Scrollable.prototype.activate.call(this);
    this.reselect();
};

Window_Selectable.prototype.deactivate = function() {
    Window_Scrollable.prototype.deactivate.call(this);
    this.reselect();
};

Window_Selectable.prototype.select = function(index) {
    this._index = index;
    this.refreshCursor();
    this.callUpdateHelp();
};

Window_Selectable.prototype.forceSelect = function(index) {
    this.select(index);
    this.ensureCursorVisible(false);
};

Window_Selectable.prototype.smoothSelect = function(index) {
    this.select(index);
    this.ensureCursorVisible(true);
};

Window_Selectable.prototype.deselect = function() {
    this.select(-1);
};

Window_Selectable.prototype.reselect = function() {
    this.select(this._index);
    this.ensureCursorVisible(true);
    this.cursorVisible = true;
};

Window_Selectable.prototype.row = function() {
    return Math.floor(this.index() / this.maxCols());
};

Window_Selectable.prototype.topRow = function() {
    return Math.floor(this.scrollY() / this.itemHeight());
};

Window_Selectable.prototype.maxTopRow = function() {
    return Math.max(0, this.maxRows() - this.maxPageRows());
};

Window_Selectable.prototype.setTopRow = function(row) {
    this.scrollTo(this.scrollX(), row * this.itemHeight());
};

Window_Selectable.prototype.maxPageRows = function() {
    return Math.floor(this.innerHeight / this.itemHeight());
};

Window_Selectable.prototype.maxPageItems = function() {
    return this.maxPageRows() * this.maxCols();
};

Window_Selectable.prototype.maxVisibleItems = function() {
    const visibleRows = Math.ceil(this.contentsHeight() / this.itemHeight());
    return visibleRows * this.maxCols();
};

Window_Selectable.prototype.isHorizontal = function() {
    return this.maxPageRows() === 1;
};

Window_Selectable.prototype.topIndex = function() {
    return this.topRow() * this.maxCols();
};

Window_Selectable.prototype.itemRect = function(index) {
    const maxCols = this.maxCols();
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
    const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_Selectable.prototype.itemRectWithPadding = function(index) {
    const rect = this.itemRect(index);
    const padding = this.itemPadding();
    rect.x += padding;
    rect.width -= padding * 2;
    return rect;
};

Window_Selectable.prototype.itemLineRect = function(index) {
    const rect = this.itemRectWithPadding(index);
    const padding = (rect.height - this.lineHeight()) / 2;
    rect.y += padding;
    rect.height -= padding * 2;
    return rect;
};

Window_Selectable.prototype.setHelpWindow = function(helpWindow) {
    this._helpWindow = helpWindow;
    this.callUpdateHelp();
};

Window_Selectable.prototype.showHelpWindow = function() {
    if (this._helpWindow) {
        this._helpWindow.show();
    }
};

Window_Selectable.prototype.hideHelpWindow = function() {
    if (this._helpWindow) {
        this._helpWindow.hide();
    }
};

Window_Selectable.prototype.setHandler = function(symbol, method) {
    this._handlers[symbol] = method;
};

Window_Selectable.prototype.isHandled = function(symbol) {
    return !!this._handlers[symbol];
};

Window_Selectable.prototype.callHandler = function(symbol) {
    if (this.isHandled(symbol)) {
        this._handlers[symbol]();
    }
};

Window_Selectable.prototype.isOpenAndActive = function() {
    return this.isOpen() && this.visible && this.active;
};

Window_Selectable.prototype.isCursorMovable = function() {
    return (
        this.isOpenAndActive() &&
        !this._cursorFixed &&
        !this._cursorAll &&
        this.maxItems() > 0
    );
};

Window_Selectable.prototype.cursorDown = function(wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
        this.smoothSelect((index + maxCols) % maxItems);
    }
};

Window_Selectable.prototype.cursorUp = function(wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    if (index >= maxCols || (wrap && maxCols === 1)) {
        this.smoothSelect((index - maxCols + maxItems) % maxItems);
    }
};

Window_Selectable.prototype.cursorRight = function(wrap) {
    const index = this.index();
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    const horizontal = this.isHorizontal();
    if (maxCols >= 2 && (index < maxItems - 1 || (wrap && horizontal))) {
        this.smoothSelect((index + 1) % maxItems);
    }
};

Window_Selectable.prototype.cursorLeft = function(wrap) {
    const index = Math.max(0, this.index());
    const maxItems = this.maxItems();
    const maxCols = this.maxCols();
    const horizontal = this.isHorizontal();
    if (maxCols >= 2 && (index > 0 || (wrap && horizontal))) {
        this.smoothSelect((index - 1 + maxItems) % maxItems);
    }
};

Window_Selectable.prototype.cursorPagedown = function() {
    const index = this.index();
    const maxItems = this.maxItems();
    if (this.topRow() + this.maxPageRows() < this.maxRows()) {
        this.smoothScrollDown(this.maxPageRows());
        this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
    }
};

Window_Selectable.prototype.cursorPageup = function() {
    const index = this.index();
    if (this.topRow() > 0) {
        this.smoothScrollUp(this.maxPageRows());
        this.select(Math.max(index - this.maxPageItems(), 0));
    }
};

Window_Selectable.prototype.isScrollEnabled = function() {
    return this.active || this.index() < 0;
};

Window_Selectable.prototype.update = function() {
    this.processCursorMove();
    this.processHandling();
    this.processTouch();
    Window_Scrollable.prototype.update.call(this);
};

Window_Selectable.prototype.processCursorMove = function() {
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        if (Input.isRepeated("down")) {
            this.cursorDown(Input.isTriggered("down"));
        }
        if (Input.isRepeated("up")) {
            this.cursorUp(Input.isTriggered("up"));
        }
        if (Input.isRepeated("right")) {
            this.cursorRight(Input.isTriggered("right"));
        }
        if (Input.isRepeated("left")) {
            this.cursorLeft(Input.isTriggered("left"));
        }
        if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
            this.cursorPagedown();
        }
        if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

Window_Selectable.prototype.processHandling = function() {
    if (this.isOpenAndActive()) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            return this.processOk();
        }
        if (this.isCancelEnabled() && this.isCancelTriggered()) {
            return this.processCancel();
        }
        if (this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
            return this.processPagedown();
        }
        if (this.isHandled("pageup") && Input.isTriggered("pageup")) {
            return this.processPageup();
        }
    }
};

Window_Selectable.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
        if (this.isHoverEnabled() && TouchInput.isHovered()) {
            this.onTouchSelect(false);
        } else if (TouchInput.isTriggered()) {
            this.onTouchSelect(true);
        }
        if (TouchInput.isClicked()) {
            this.onTouchOk();
        } else if (TouchInput.isCancelled()) {
            this.onTouchCancel();
        }
    }
};

Window_Selectable.prototype.isHoverEnabled = function() {
    return true;
};

Window_Selectable.prototype.onTouchSelect = function(trigger) {
    this._doubleTouch = false;
    if (this.isCursorMovable()) {
        const lastIndex = this.index();
        const hitIndex = this.hitIndex();
        if (hitIndex >= 0) {
            if (hitIndex === this.index()) {
                this._doubleTouch = true;
            }
            this.select(hitIndex);
        }
        if (trigger && this.index() !== lastIndex) {
            this.playCursorSound();
        }
    }
};

Window_Selectable.prototype.onTouchOk = function() {
    if (this.isTouchOkEnabled()) {
        const hitIndex = this.hitIndex();
        if (this._cursorFixed) {
            if (hitIndex === this.index()) {
                this.processOk();
            }
        } else if (hitIndex >= 0) {
            this.processOk();
        }
    }
};

Window_Selectable.prototype.onTouchCancel = function() {
    if (this.isCancelEnabled()) {
        this.processCancel();
    }
};

Window_Selectable.prototype.hitIndex = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.hitTest(localPos.x, localPos.y);
};

Window_Selectable.prototype.hitTest = function(x, y) {
    if (this.innerRect.contains(x, y)) {
        const cx = this.origin.x + x - this.padding;
        const cy = this.origin.y + y - this.padding;
        const topIndex = this.topIndex();
        for (let i = 0; i < this.maxVisibleItems(); i++) {
            const index = topIndex + i;
            if (index < this.maxItems()) {
                const rect = this.itemRect(index);
                if (rect.contains(cx, cy)) {
                    return index;
                }
            }
        }
    }
    return -1;
};

Window_Selectable.prototype.isTouchOkEnabled = function() {
    return (
        this.isOkEnabled() &&
        (this._cursorFixed || this._cursorAll || this._doubleTouch)
    );
};

Window_Selectable.prototype.isOkEnabled = function() {
    return this.isHandled("ok");
};

Window_Selectable.prototype.isCancelEnabled = function() {
    return this.isHandled("cancel");
};

Window_Selectable.prototype.isOkTriggered = function() {
    return this._canRepeat ? Input.isRepeated("ok") : Input.isTriggered("ok");
};

Window_Selectable.prototype.isCancelTriggered = function() {
    return Input.isRepeated("cancel");
};

Window_Selectable.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};

Window_Selectable.prototype.callOkHandler = function() {
    this.callHandler("ok");
};

Window_Selectable.prototype.processCancel = function() {
    SoundManager.playCancel();
    this.updateInputData();
    this.deactivate();
    this.callCancelHandler();
};

Window_Selectable.prototype.callCancelHandler = function() {
    this.callHandler("cancel");
};

Window_Selectable.prototype.processPageup = function() {
    this.updateInputData();
    this.deactivate();
    this.callHandler("pageup");
};

Window_Selectable.prototype.processPagedown = function() {
    this.updateInputData();
    this.deactivate();
    this.callHandler("pagedown");
};

Window_Selectable.prototype.updateInputData = function() {
    Input.update();
    TouchInput.update();
    this.clearScrollStatus();
};

Window_Selectable.prototype.ensureCursorVisible = function(smooth) {
    if (this._cursorAll) {
        this.scrollTo(0, 0);
    } else if (this.innerHeight > 0 && this.row() >= 0) {
        const scrollY = this.scrollY();
        const itemTop = this.row() * this.itemHeight();
        const itemBottom = itemTop + this.itemHeight();
        const scrollMin = itemBottom - this.innerHeight;
        if (scrollY > itemTop) {
            if (smooth) {
                this.smoothScrollTo(0, itemTop);
            } else {
                this.scrollTo(0, itemTop);
            }
        } else if (scrollY < scrollMin) {
            if (smooth) {
                this.smoothScrollTo(0, scrollMin);
            } else {
                this.scrollTo(0, scrollMin);
            }
        }
    }
};

Window_Selectable.prototype.callUpdateHelp = function() {
    if (this.active && this._helpWindow) {
        this.updateHelp();
    }
};

Window_Selectable.prototype.updateHelp = function() {
    this._helpWindow.clear();
};

Window_Selectable.prototype.setHelpWindowItem = function(item) {
    if (this._helpWindow) {
        this._helpWindow.setItem(item);
    }
};

Window_Selectable.prototype.isCurrentItemEnabled = function() {
    return true;
};

Window_Selectable.prototype.drawAllItems = function() {
    const topIndex = this.topIndex();
    for (let i = 0; i < this.maxVisibleItems(); i++) {
        const index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItemBackground(index);
            this.drawItem(index);
        }
    }
};

Window_Selectable.prototype.drawItem = function(/*index*/) {
    //
};

Window_Selectable.prototype.clearItem = function(index) {
    const rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.contentsBack.clearRect(rect.x, rect.y, rect.width, rect.height);
};

Window_Selectable.prototype.drawItemBackground = function(index) {
    const rect = this.itemRect(index);
    this.drawBackgroundRect(rect);
};

Window_Selectable.prototype.drawBackgroundRect = function(rect) {
    const c1 = ColorManager.itemBackColor1();
    const c2 = ColorManager.itemBackColor2();
    const x = rect.x;
    const y = rect.y;
    const w = rect.width;
    const h = rect.height;
    this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
    this.contentsBack.strokeRect(x, y, w, h, c1);
};

Window_Selectable.prototype.redrawItem = function(index) {
    if (index >= 0) {
        this.clearItem(index);
        this.drawItemBackground(index);
        this.drawItem(index);
    }
};

Window_Selectable.prototype.redrawCurrentItem = function() {
    this.redrawItem(this.index());
};

Window_Selectable.prototype.refresh = function() {
    this.paint();
};

Window_Selectable.prototype.paint = function() {
    if (this.contents) {
        this.contents.clear();
        this.contentsBack.clear();
        this.drawAllItems();
    }
};

Window_Selectable.prototype.refreshCursor = function() {
    if (this._cursorAll) {
        this.refreshCursorForAll();
    } else if (this.index() >= 0) {
        const rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};

Window_Selectable.prototype.refreshCursorForAll = function() {
    const maxItems = this.maxItems();
    if (maxItems > 0) {
        const rect = this.itemRect(0);
        rect.enlarge(this.itemRect(maxItems - 1));
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
};

//-----------------------------------------------------------------------------
// Window_Command
//
// The superclass of windows for selecting a command.

function Window_Command() {
    this.initialize(...arguments);
}

Window_Command.prototype = Object.create(Window_Selectable.prototype);
Window_Command.prototype.constructor = Window_Command;

Window_Command.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
    this.select(0);
    this.activate();
};

Window_Command.prototype.maxItems = function() {
    return this._list.length;
};

Window_Command.prototype.clearCommandList = function() {
    this._list = [];
};

Window_Command.prototype.makeCommandList = function() {
    //
};

// prettier-ignore
Window_Command.prototype.addCommand = function(
    name, symbol, enabled = true, ext = null
) {
    this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
};

Window_Command.prototype.commandName = function(index) {
    return this._list[index].name;
};

Window_Command.prototype.commandSymbol = function(index) {
    return this._list[index].symbol;
};

Window_Command.prototype.isCommandEnabled = function(index) {
    return this._list[index].enabled;
};

Window_Command.prototype.currentData = function() {
    return this.index() >= 0 ? this._list[this.index()] : null;
};

Window_Command.prototype.isCurrentItemEnabled = function() {
    return this.currentData() ? this.currentData().enabled : false;
};

Window_Command.prototype.currentSymbol = function() {
    return this.currentData() ? this.currentData().symbol : null;
};

Window_Command.prototype.currentExt = function() {
    return this.currentData() ? this.currentData().ext : null;
};

Window_Command.prototype.findSymbol = function(symbol) {
    return this._list.findIndex(item => item.symbol === symbol);
};

Window_Command.prototype.selectSymbol = function(symbol) {
    const index = this.findSymbol(symbol);
    if (index >= 0) {
        this.forceSelect(index);
    } else {
        this.forceSelect(0);
    }
};

Window_Command.prototype.findExt = function(ext) {
    return this._list.findIndex(item => item.ext === ext);
};

Window_Command.prototype.selectExt = function(ext) {
    const index = this.findExt(ext);
    if (index >= 0) {
        this.forceSelect(index);
    } else {
        this.forceSelect(0);
    }
};

Window_Command.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_Command.prototype.itemTextAlign = function() {
    return "center";
};

Window_Command.prototype.isOkEnabled = function() {
    return true;
};

Window_Command.prototype.callOkHandler = function() {
    const symbol = this.currentSymbol();
    if (this.isHandled(symbol)) {
        this.callHandler(symbol);
    } else if (this.isHandled("ok")) {
        Window_Selectable.prototype.callOkHandler.call(this);
    } else {
        this.activate();
    }
};

Window_Command.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    Window_Selectable.prototype.refresh.call(this);
};

//-----------------------------------------------------------------------------
// Window_HorzCommand
//
// The command window for the horizontal selection format.

function Window_HorzCommand() {
    this.initialize(...arguments);
}

Window_HorzCommand.prototype = Object.create(Window_Command.prototype);
Window_HorzCommand.prototype.constructor = Window_HorzCommand;

Window_HorzCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
};

Window_HorzCommand.prototype.maxCols = function() {
    return 4;
};

Window_HorzCommand.prototype.itemTextAlign = function() {
    return "center";
};

//-----------------------------------------------------------------------------
// Window_Help
//
// The window for displaying the description of the selected item.

function Window_Help() {
    this.initialize(...arguments);
}

Window_Help.prototype = Object.create(Window_Base.prototype);
Window_Help.prototype.constructor = Window_Help;

Window_Help.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._text = "";
};

Window_Help.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_Help.prototype.clear = function() {
    this.setText("");
};

Window_Help.prototype.setItem = function(item) {
    this.setText(item ? item.description : "");
};

Window_Help.prototype.refresh = function() {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.drawTextEx(this._text, rect.x, rect.y, rect.width);
};

//-----------------------------------------------------------------------------
// Window_Gold
//
// The window for displaying the party's gold.

function Window_Gold() {
    this.initialize(...arguments);
}

Window_Gold.prototype = Object.create(Window_Selectable.prototype);
Window_Gold.prototype.constructor = Window_Gold;

Window_Gold.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
};

Window_Gold.prototype.colSpacing = function() {
    return 0;
};

Window_Gold.prototype.refresh = function() {
    const rect = this.itemLineRect(0);
    const x = rect.x;
    const y = rect.y;
    const width = rect.width;
    this.contents.clear();
    this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
};

Window_Gold.prototype.value = function() {
    return $gameParty.gold();
};

Window_Gold.prototype.currencyUnit = function() {
    return TextManager.currencyUnit;
};

Window_Gold.prototype.open = function() {
    this.refresh();
    Window_Selectable.prototype.open.call(this);
};

//-----------------------------------------------------------------------------
// Window_StatusBase
//
// The superclass of windows for displaying actor status.

function Window_StatusBase() {
    this.initialize(...arguments);
}

Window_StatusBase.prototype = Object.create(Window_Selectable.prototype);
Window_StatusBase.prototype.constructor = Window_StatusBase;

Window_StatusBase.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._additionalSprites = {};
    this.loadFaceImages();
};

Window_StatusBase.prototype.loadFaceImages = function() {
    for (const actor of $gameParty.members()) {
        ImageManager.loadFace(actor.faceName());
    }
};

Window_StatusBase.prototype.refresh = function() {
    this.hideAdditionalSprites();
    Window_Selectable.prototype.refresh.call(this);
};

Window_StatusBase.prototype.hideAdditionalSprites = function() {
    for (const sprite of Object.values(this._additionalSprites)) {
        sprite.hide();
    }
};

Window_StatusBase.prototype.placeActorName = function(actor, x, y) {
    const key = "actor%1-name".format(actor.actorId());
    const sprite = this.createInnerSprite(key, Sprite_Name);
    sprite.setup(actor);
    sprite.move(x, y);
    sprite.show();
};

Window_StatusBase.prototype.placeStateIcon = function(actor, x, y) {
    const key = "actor%1-stateIcon".format(actor.actorId());
    const sprite = this.createInnerSprite(key, Sprite_StateIcon);
    sprite.setup(actor);
    sprite.move(x, y);
    sprite.show();
};

Window_StatusBase.prototype.placeGauge = function(actor, type, x, y) {
    const key = "actor%1-gauge-%2".format(actor.actorId(), type);
    const sprite = this.createInnerSprite(key, Sprite_Gauge);
    sprite.setup(actor, type);
    sprite.move(x, y);
    sprite.show();
};

Window_StatusBase.prototype.createInnerSprite = function(key, spriteClass) {
    const dict = this._additionalSprites;
    if (dict[key]) {
        return dict[key];
    } else {
        const sprite = new spriteClass();
        dict[key] = sprite;
        this.addInnerChild(sprite);
        return sprite;
    }
};

Window_StatusBase.prototype.placeTimeGauge = function(actor, x, y) {
    if (BattleManager.isTpb()) {
        this.placeGauge(actor, "time", x, y);
    }
};

Window_StatusBase.prototype.placeBasicGauges = function(actor, x, y) {
    this.placeGauge(actor, "hp", x, y);
    this.placeGauge(actor, "mp", x, y + this.gaugeLineHeight());
    if ($dataSystem.optDisplayTp) {
        this.placeGauge(actor, "tp", x, y + this.gaugeLineHeight() * 2);
    }
};

Window_StatusBase.prototype.gaugeLineHeight = function() {
    return 24;
};

Window_StatusBase.prototype.drawActorCharacter = function(actor, x, y) {
    this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
};

// prettier-ignore
Window_StatusBase.prototype.drawActorFace = function(
    actor, x, y, width, height
) {
    this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
};

Window_StatusBase.prototype.drawActorName = function(actor, x, y, width) {
    width = width || 168;
    this.changeTextColor(ColorManager.hpColor(actor));
    this.drawText(actor.name(), x, y, width);
};

Window_StatusBase.prototype.drawActorClass = function(actor, x, y, width) {
    width = width || 168;
    this.resetTextColor();
    this.drawText(actor.currentClass().name, x, y, width);
};

Window_StatusBase.prototype.drawActorNickname = function(actor, x, y, width) {
    width = width || 270;
    this.resetTextColor();
    this.drawText(actor.nickname(), x, y, width);
};

Window_StatusBase.prototype.drawActorLevel = function(actor, x, y) {
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(TextManager.levelA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.level, x + 84, y, 36, "right");
};

Window_StatusBase.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    const delta = ImageManager.standardIconWidth - ImageManager.iconWidth;
    const iconWidth = ImageManager.standardIconWidth;
    const icons = actor.allIcons().slice(0, Math.floor(width / iconWidth));
    let iconX = x + delta / 2;
    for (const icon of icons) {
        this.drawIcon(icon, iconX, y + 2);
        iconX += iconWidth;
    }
};

Window_StatusBase.prototype.drawActorSimpleStatus = function(actor, x, y) {
    const lineHeight = this.lineHeight();
    const x2 = x + 180;
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    this.drawActorClass(actor, x2, y);
    this.placeBasicGauges(actor, x2, y + lineHeight);
};

Window_StatusBase.prototype.actorSlotName = function(actor, index) {
    const slots = actor.equipSlots();
    return $dataSystem.equipTypes[slots[index]];
};

//-----------------------------------------------------------------------------
// Window_MenuCommand
//
// The window for selecting a command on the menu screen.

function Window_MenuCommand() {
    this.initialize(...arguments);
}

Window_MenuCommand.prototype = Object.create(Window_Command.prototype);
Window_MenuCommand.prototype.constructor = Window_MenuCommand;

Window_MenuCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.selectLast();
    this._canRepeat = false;
};

Window_MenuCommand._lastCommandSymbol = null;

Window_MenuCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};

Window_MenuCommand.prototype.addMainCommands = function() {
    const enabled = this.areMainCommandsEnabled();
    if (this.needsCommand("item")) {
        this.addCommand(TextManager.item, "item", enabled);
    }
    if (this.needsCommand("skill")) {
        this.addCommand(TextManager.skill, "skill", enabled);
    }
    if (this.needsCommand("equip")) {
        this.addCommand(TextManager.equip, "equip", enabled);
    }
    if (this.needsCommand("status")) {
        this.addCommand(TextManager.status, "status", enabled);
    }
};

Window_MenuCommand.prototype.addFormationCommand = function() {
    if (this.needsCommand("formation")) {
        const enabled = this.isFormationEnabled();
        this.addCommand(TextManager.formation, "formation", enabled);
    }
};

Window_MenuCommand.prototype.addOriginalCommands = function() {
    //
};

Window_MenuCommand.prototype.addOptionsCommand = function() {
    if (this.needsCommand("options")) {
        const enabled = this.isOptionsEnabled();
        this.addCommand(TextManager.options, "options", enabled);
    }
};

Window_MenuCommand.prototype.addSaveCommand = function() {
    if (this.needsCommand("save")) {
        const enabled = this.isSaveEnabled();
        this.addCommand(TextManager.save, "save", enabled);
    }
};

Window_MenuCommand.prototype.addGameEndCommand = function() {
    const enabled = this.isGameEndEnabled();
    this.addCommand(TextManager.gameEnd, "gameEnd", enabled);
};

Window_MenuCommand.prototype.needsCommand = function(name) {
    const table = ["item", "skill", "equip", "status", "formation", "save"];
    const index = table.indexOf(name);
    if (index >= 0) {
        return $dataSystem.menuCommands[index];
    }
    return true;
};

Window_MenuCommand.prototype.areMainCommandsEnabled = function() {
    return $gameParty.exists();
};

Window_MenuCommand.prototype.isFormationEnabled = function() {
    return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
};

Window_MenuCommand.prototype.isOptionsEnabled = function() {
    return true;
};

Window_MenuCommand.prototype.isSaveEnabled = function() {
    return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
};

Window_MenuCommand.prototype.isGameEndEnabled = function() {
    return true;
};

Window_MenuCommand.prototype.processOk = function() {
    Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_MenuCommand.prototype.selectLast = function() {
    this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
};

//-----------------------------------------------------------------------------
// Window_MenuStatus
//
// The window for displaying party member status on the menu screen.

function Window_MenuStatus() {
    this.initialize(...arguments);
}

Window_MenuStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_MenuStatus.prototype.constructor = Window_MenuStatus;

Window_MenuStatus.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._formationMode = false;
    this._pendingIndex = -1;
    this.refresh();
};

Window_MenuStatus.prototype.maxItems = function() {
    return $gameParty.size();
};

Window_MenuStatus.prototype.numVisibleRows = function() {
    return 4;
};

Window_MenuStatus.prototype.itemHeight = function() {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_MenuStatus.prototype.actor = function(index) {
    return $gameParty.members()[index];
};

Window_MenuStatus.prototype.drawItem = function(index) {
    this.drawPendingItemBackground(index);
    this.drawItemImage(index);
    this.drawItemStatus(index);
};

Window_MenuStatus.prototype.drawPendingItemBackground = function(index) {
    if (index === this._pendingIndex) {
        const rect = this.itemRect(index);
        const color = ColorManager.pendingColor();
        this.changePaintOpacity(false);
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.changePaintOpacity(true);
    }
};

Window_MenuStatus.prototype.drawItemImage = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRect(index);
    const width = ImageManager.standardFaceWidth;
    const height = rect.height - 2;
    this.changePaintOpacity(actor.isBattleMember());
    this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
    this.changePaintOpacity(true);
};

Window_MenuStatus.prototype.drawItemStatus = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRect(index);
    const x = rect.x + 180;
    const y = rect.y + Math.floor(rect.height / 2 - this.lineHeight() * 1.5);
    this.drawActorSimpleStatus(actor, x, y);
};

Window_MenuStatus.prototype.processOk = function() {
    Window_StatusBase.prototype.processOk.call(this);
    const actor = this.actor(this.index());
    $gameParty.setMenuActor(actor);
};

Window_MenuStatus.prototype.isCurrentItemEnabled = function() {
    if (this._formationMode) {
        const actor = this.actor(this.index());
        return actor && actor.isFormationChangeOk();
    } else {
        return true;
    }
};

Window_MenuStatus.prototype.selectLast = function() {
    this.smoothSelect($gameParty.menuActor().index() || 0);
};

Window_MenuStatus.prototype.formationMode = function() {
    return this._formationMode;
};

Window_MenuStatus.prototype.setFormationMode = function(formationMode) {
    this._formationMode = formationMode;
};

Window_MenuStatus.prototype.pendingIndex = function() {
    return this._pendingIndex;
};

Window_MenuStatus.prototype.setPendingIndex = function(index) {
    const lastPendingIndex = this._pendingIndex;
    this._pendingIndex = index;
    this.redrawItem(this._pendingIndex);
    this.redrawItem(lastPendingIndex);
};

//-----------------------------------------------------------------------------
// Window_MenuActor
//
// The window for selecting a target actor on the item and skill screens.

function Window_MenuActor() {
    this.initialize(...arguments);
}

Window_MenuActor.prototype = Object.create(Window_MenuStatus.prototype);
Window_MenuActor.prototype.constructor = Window_MenuActor;

Window_MenuActor.prototype.initialize = function(rect) {
    Window_MenuStatus.prototype.initialize.call(this, rect);
    this.hide();
};

Window_MenuActor.prototype.processOk = function() {
    if (!this.cursorAll()) {
        $gameParty.setTargetActor($gameParty.members()[this.index()]);
    }
    this.callOkHandler();
};

Window_MenuActor.prototype.selectLast = function() {
    this.forceSelect($gameParty.targetActor().index() || 0);
};

Window_MenuActor.prototype.selectForItem = function(item) {
    const actor = $gameParty.menuActor();
    const action = new Game_Action(actor);
    action.setItemObject(item);
    this.setCursorFixed(false);
    this.setCursorAll(false);
    if (action.isForUser()) {
        if (DataManager.isSkill(item)) {
            this.setCursorFixed(true);
            this.forceSelect(actor.index());
        } else {
            this.selectLast();
        }
    } else if (action.isForAll()) {
        this.setCursorAll(true);
        this.forceSelect(0);
    } else {
        this.selectLast();
    }
};

//-----------------------------------------------------------------------------
// Window_ItemCategory
//
// The window for selecting a category of items on the item and shop screens.

function Window_ItemCategory() {
    this.initialize(...arguments);
}

Window_ItemCategory.prototype = Object.create(Window_HorzCommand.prototype);
Window_ItemCategory.prototype.constructor = Window_ItemCategory;

Window_ItemCategory.prototype.initialize = function(rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
};

Window_ItemCategory.prototype.maxCols = function() {
    return 4;
};

Window_ItemCategory.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
    }
};

Window_ItemCategory.prototype.makeCommandList = function() {
    if (this.needsCommand("item")) {
        this.addCommand(TextManager.item, "item");
    }
    if (this.needsCommand("weapon")) {
        this.addCommand(TextManager.weapon, "weapon");
    }
    if (this.needsCommand("armor")) {
        this.addCommand(TextManager.armor, "armor");
    }
    if (this.needsCommand("keyItem")) {
        this.addCommand(TextManager.keyItem, "keyItem");
    }
};

Window_ItemCategory.prototype.needsCommand = function(name) {
    const table = ["item", "weapon", "armor", "keyItem"];
    const index = table.indexOf(name);
    if (index >= 0) {
        return $dataSystem.itemCategories[index];
    }
    return true;
};

Window_ItemCategory.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
};

Window_ItemCategory.prototype.needsSelection = function() {
    return this.maxItems() >= 2;
};

//-----------------------------------------------------------------------------
// Window_ItemList
//
// The window for selecting an item on the item screen.

function Window_ItemList() {
    this.initialize(...arguments);
}

Window_ItemList.prototype = Object.create(Window_Selectable.prototype);
Window_ItemList.prototype.constructor = Window_ItemList;

Window_ItemList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._category = "none";
    this._data = [];
};

Window_ItemList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_ItemList.prototype.maxCols = function() {
    return 2;
};

Window_ItemList.prototype.colSpacing = function() {
    return 16;
};

Window_ItemList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_ItemList.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_ItemList.prototype.itemAt = function(index) {
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_ItemList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
};

Window_ItemList.prototype.includes = function(item) {
    switch (this._category) {
        case "item":
            return DataManager.isItem(item) && item.itypeId === 1;
        case "weapon":
            return DataManager.isWeapon(item);
        case "armor":
            return DataManager.isArmor(item);
        case "keyItem":
            return DataManager.isItem(item) && item.itypeId === 2;
        default:
            return false;
    }
};

Window_ItemList.prototype.needsNumber = function() {
    if (this._category === "keyItem") {
        return $dataSystem.optKeyItemsNumber;
    } else {
        return true;
    }
};

Window_ItemList.prototype.isEnabled = function(item) {
    return $gameParty.canUse(item);
};

Window_ItemList.prototype.makeItemList = function() {
    this._data = $gameParty.allItems().filter(item => this.includes(item));
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_ItemList.prototype.selectLast = function() {
    const index = this._data.indexOf($gameParty.lastItem());
    this.forceSelect(index >= 0 ? index : 0);
};

Window_ItemList.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    if (item) {
        const numberWidth = this.numberWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_ItemList.prototype.numberWidth = function() {
    return this.textWidth("000");
};

Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(":", x, y, width - this.textWidth("00"), "right");
        this.drawText($gameParty.numItems(item), x, y, width, "right");
    }
};

Window_ItemList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_ItemList.prototype.refresh = function() {
    this.makeItemList();
    Window_Selectable.prototype.refresh.call(this);
};

//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

function Window_SkillType() {
    this.initialize(...arguments);
}

Window_SkillType.prototype = Object.create(Window_Command.prototype);
Window_SkillType.prototype.constructor = Window_SkillType;

Window_SkillType.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this._actor = null;
};

Window_SkillType.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.selectLast();
    }
};

Window_SkillType.prototype.makeCommandList = function() {
    if (this._actor) {
        const skillTypes = this._actor.skillTypes();
        for (const stypeId of skillTypes) {
            const name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, "skill", true, stypeId);
        }
    }
};

Window_SkillType.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    if (this._skillWindow) {
        this._skillWindow.setStypeId(this.currentExt());
    }
};

Window_SkillType.prototype.setSkillWindow = function(skillWindow) {
    this._skillWindow = skillWindow;
};

Window_SkillType.prototype.selectLast = function() {
    const skill = this._actor.lastMenuSkill();
    if (skill) {
        this.selectExt(skill.stypeId);
    } else {
        this.forceSelect(0);
    }
};

//-----------------------------------------------------------------------------
// Window_SkillStatus
//
// The window for displaying the skill user's status on the skill screen.

function Window_SkillStatus() {
    this.initialize(...arguments);
}

Window_SkillStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_SkillStatus.prototype.constructor = Window_SkillStatus;

Window_SkillStatus.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
};

Window_SkillStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_SkillStatus.prototype.refresh = function() {
    Window_StatusBase.prototype.refresh.call(this);
    if (this._actor) {
        const x = this.colSpacing() / 2;
        const h = this.innerHeight;
        const y = h / 2 - this.lineHeight() * 1.5;
        this.drawActorFace(this._actor, x + 1, 0, 144, h);
        this.drawActorSimpleStatus(this._actor, x + 180, y);
    }
};

//-----------------------------------------------------------------------------
// Window_SkillList
//
// The window for selecting a skill on the skill screen.

function Window_SkillList() {
    this.initialize(...arguments);
}

Window_SkillList.prototype = Object.create(Window_Selectable.prototype);
Window_SkillList.prototype.constructor = Window_SkillList;

Window_SkillList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._actor = null;
    this._stypeId = 0;
    this._data = [];
};

Window_SkillList.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_SkillList.prototype.setStypeId = function(stypeId) {
    if (this._stypeId !== stypeId) {
        this._stypeId = stypeId;
        this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_SkillList.prototype.maxCols = function() {
    return 2;
};

Window_SkillList.prototype.colSpacing = function() {
    return 16;
};

Window_SkillList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_SkillList.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_SkillList.prototype.itemAt = function(index) {
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_SkillList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};

Window_SkillList.prototype.includes = function(item) {
    return item && item.stypeId === this._stypeId;
};

Window_SkillList.prototype.isEnabled = function(item) {
    return this._actor && this._actor.canUse(item);
};

Window_SkillList.prototype.makeItemList = function() {
    if (this._actor) {
        this._data = this._actor.skills().filter(item => this.includes(item));
    } else {
        this._data = [];
    }
};

Window_SkillList.prototype.selectLast = function() {
    const index = this._data.indexOf(this._actor.lastSkill());
    this.forceSelect(index >= 0 ? index : 0);
};

Window_SkillList.prototype.drawItem = function(index) {
    const skill = this.itemAt(index);
    if (skill) {
        const costWidth = this.costWidth();
        const rect = this.itemLineRect(index);
        this.changePaintOpacity(this.isEnabled(skill));
        this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
        this.drawSkillCost(skill, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_SkillList.prototype.costWidth = function() {
    return this.textWidth("000");
};

Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
    if (this._actor.skillTpCost(skill) > 0) {
        this.changeTextColor(ColorManager.tpCostColor());
        this.drawText(this._actor.skillTpCost(skill), x, y, width, "right");
    } else if (this._actor.skillMpCost(skill) > 0) {
        this.changeTextColor(ColorManager.mpCostColor());
        this.drawText(this._actor.skillMpCost(skill), x, y, width, "right");
    }
};

Window_SkillList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_SkillList.prototype.refresh = function() {
    this.makeItemList();
    Window_Selectable.prototype.refresh.call(this);
};

//-----------------------------------------------------------------------------
// Window_EquipStatus
//
// The window for displaying parameter changes on the equipment screen.

function Window_EquipStatus() {
    this.initialize(...arguments);
}

Window_EquipStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_EquipStatus.prototype.constructor = Window_EquipStatus;

Window_EquipStatus.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
    this._tempActor = null;
    this.refresh();
};

Window_EquipStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_EquipStatus.prototype.colSpacing = function() {
    return 0;
};

Window_EquipStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        const nameRect = this.itemLineRect(0);
        this.drawActorName(this._actor, nameRect.x, 0, nameRect.width);
        this.drawActorFace(this._actor, nameRect.x, nameRect.height);
        this.drawAllParams();
    }
};

Window_EquipStatus.prototype.setTempActor = function(tempActor) {
    if (this._tempActor !== tempActor) {
        this._tempActor = tempActor;
        this.refresh();
    }
};

Window_EquipStatus.prototype.drawAllParams = function() {
    for (let i = 0; i < 6; i++) {
        const x = this.itemPadding();
        const y = this.paramY(i);
        this.drawItem(x, y, 2 + i);
    }
};

Window_EquipStatus.prototype.drawItem = function(x, y, paramId) {
    const paramX = this.paramX();
    const paramWidth = this.paramWidth();
    const rightArrowWidth = this.rightArrowWidth();
    this.drawParamName(x, y, paramId);
    if (this._actor) {
        this.drawCurrentParam(paramX, y, paramId);
    }
    this.drawRightArrow(paramX + paramWidth, y);
    if (this._tempActor) {
        this.drawNewParam(paramX + paramWidth + rightArrowWidth, y, paramId);
    }
};

Window_EquipStatus.prototype.drawParamName = function(x, y, paramId) {
    const width = this.paramX() - this.itemPadding() * 2;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(TextManager.param(paramId), x, y, width);
};

Window_EquipStatus.prototype.drawCurrentParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    this.resetTextColor();
    this.drawText(this._actor.param(paramId), x, y, paramWidth, "right");
};

Window_EquipStatus.prototype.drawRightArrow = function(x, y) {
    const rightArrowWidth = this.rightArrowWidth();
    this.changeTextColor(ColorManager.systemColor());
    this.drawText("\u2192", x, y, rightArrowWidth, "center");
};

Window_EquipStatus.prototype.drawNewParam = function(x, y, paramId) {
    const paramWidth = this.paramWidth();
    const newValue = this._tempActor.param(paramId);
    const diffvalue = newValue - this._actor.param(paramId);
    this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
    this.drawText(newValue, x, y, paramWidth, "right");
};

Window_EquipStatus.prototype.rightArrowWidth = function() {
    return 32;
};

Window_EquipStatus.prototype.paramWidth = function() {
    return 48;
};

Window_EquipStatus.prototype.paramX = function() {
    const itemPadding = this.itemPadding();
    const rightArrowWidth = this.rightArrowWidth();
    const paramWidth = this.paramWidth();
    return this.innerWidth - itemPadding - paramWidth * 2 - rightArrowWidth;
};

Window_EquipStatus.prototype.paramY = function(index) {
    const faceHeight = ImageManager.standardFaceHeight;
    return faceHeight + Math.floor(this.lineHeight() * (index + 1.5));
};

//-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.

function Window_EquipCommand() {
    this.initialize(...arguments);
}

Window_EquipCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_EquipCommand.prototype.constructor = Window_EquipCommand;

Window_EquipCommand.prototype.initialize = function(rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
};

Window_EquipCommand.prototype.maxCols = function() {
    return 3;
};

Window_EquipCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.equip2, "equip");
    this.addCommand(TextManager.optimize, "optimize");
    this.addCommand(TextManager.clear, "clear");
};

//-----------------------------------------------------------------------------
// Window_EquipSlot
//
// The window for selecting an equipment slot on the equipment screen.

function Window_EquipSlot() {
    this.initialize(...arguments);
}

Window_EquipSlot.prototype = Object.create(Window_StatusBase.prototype);
Window_EquipSlot.prototype.constructor = Window_EquipSlot;

Window_EquipSlot.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
    this.refresh();
};

Window_EquipSlot.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_EquipSlot.prototype.update = function() {
    Window_StatusBase.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setSlotId(this.index());
    }
};

Window_EquipSlot.prototype.maxItems = function() {
    return this._actor ? this._actor.equipSlots().length : 0;
};

Window_EquipSlot.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_EquipSlot.prototype.itemAt = function(index) {
    return this._actor ? this._actor.equips()[index] : null;
};

Window_EquipSlot.prototype.drawItem = function(index) {
    if (this._actor) {
        const slotName = this.actorSlotName(this._actor, index);
        const item = this.itemAt(index);
        const slotNameWidth = this.slotNameWidth();
        const rect = this.itemLineRect(index);
        const itemWidth = rect.width - slotNameWidth;
        this.changeTextColor(ColorManager.systemColor());
        this.changePaintOpacity(this.isEnabled(index));
        this.drawText(slotName, rect.x, rect.y, slotNameWidth, rect.height);
        this.drawItemName(item, rect.x + slotNameWidth, rect.y, itemWidth);
        this.changePaintOpacity(true);
    }
};

Window_EquipSlot.prototype.slotNameWidth = function() {
    return 138;
};

Window_EquipSlot.prototype.isEnabled = function(index) {
    return this._actor ? this._actor.isEquipChangeOk(index) : false;
};

Window_EquipSlot.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index());
};

Window_EquipSlot.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_EquipSlot.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
};

Window_EquipSlot.prototype.updateHelp = function() {
    Window_StatusBase.prototype.updateHelp.call(this);
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setTempActor(null);
    }
};

//-----------------------------------------------------------------------------
// Window_EquipItem
//
// The window for selecting an equipment item on the equipment screen.

function Window_EquipItem() {
    this.initialize(...arguments);
}

Window_EquipItem.prototype = Object.create(Window_ItemList.prototype);
Window_EquipItem.prototype.constructor = Window_EquipItem;

Window_EquipItem.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._actor = null;
    this._slotId = 0;
};

Window_EquipItem.prototype.maxCols = function() {
    return 1;
};

Window_EquipItem.prototype.colSpacing = function() {
    return 8;
};

Window_EquipItem.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_EquipItem.prototype.setSlotId = function(slotId) {
    if (this._slotId !== slotId) {
        this._slotId = slotId;
        this.refresh();
        this.scrollTo(0, 0);
    }
};

Window_EquipItem.prototype.includes = function(item) {
    if (item === null) {
        return true;
    }
    return (
        this._actor &&
        this._actor.canEquip(item) &&
        item.etypeId === this.etypeId()
    );
};

Window_EquipItem.prototype.etypeId = function() {
    if (this._actor && this._slotId >= 0) {
        return this._actor.equipSlots()[this._slotId];
    } else {
        return 0;
    }
};

Window_EquipItem.prototype.isEnabled = function(/*item*/) {
    return true;
};

Window_EquipItem.prototype.selectLast = function() {
    //
};

Window_EquipItem.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_EquipItem.prototype.updateHelp = function() {
    Window_ItemList.prototype.updateHelp.call(this);
    if (this._actor && this._statusWindow && this._slotId >= 0) {
        const actor = JsonEx.makeDeepCopy(this._actor);
        actor.forceChangeEquip(this._slotId, this.item());
        this._statusWindow.setTempActor(actor);
    }
};

Window_EquipItem.prototype.playOkSound = function() {
    //
};

//-----------------------------------------------------------------------------
// Window_Status
//
// The window for displaying full status on the status screen.

function Window_Status() {
    this.initialize(...arguments);
}

Window_Status.prototype = Object.create(Window_StatusBase.prototype);
Window_Status.prototype.constructor = Window_Status;

Window_Status.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
    this.refresh();
    this.activate();
};

Window_Status.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_Status.prototype.refresh = function() {
    Window_StatusBase.prototype.refresh.call(this);
    if (this._actor) {
        this.drawBlock1();
        this.drawBlock2();
    }
};

Window_Status.prototype.drawBlock1 = function() {
    const y = this.block1Y();
    this.drawActorName(this._actor, 6, y, 168);
    this.drawActorClass(this._actor, 192, y, 168);
    this.drawActorNickname(this._actor, 432, y, 270);
};

Window_Status.prototype.block1Y = function() {
    return 0;
};

Window_Status.prototype.drawBlock2 = function() {
    const y = this.block2Y();
    this.drawActorFace(this._actor, 12, y);
    this.drawBasicInfo(204, y);
    this.drawExpInfo(456, y);
};

Window_Status.prototype.block2Y = function() {
    const lineHeight = this.lineHeight();
    const min = lineHeight;
    const max = this.innerHeight - lineHeight * 4;
    return Math.floor((lineHeight * 1.4).clamp(min, max));
};

Window_Status.prototype.drawBasicInfo = function(x, y) {
    const lineHeight = this.lineHeight();
    this.drawActorLevel(this._actor, x, y + lineHeight * 0);
    this.drawActorIcons(this._actor, x, y + lineHeight * 1);
    this.placeBasicGauges(this._actor, x, y + lineHeight * 2);
};

Window_Status.prototype.drawExpInfo = function(x, y) {
    const lineHeight = this.lineHeight();
    const expTotal = TextManager.expTotal.format(TextManager.exp);
    const expNext = TextManager.expNext.format(TextManager.level);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(expTotal, x, y + lineHeight * 0, 270);
    this.drawText(expNext, x, y + lineHeight * 2, 270);
    this.resetTextColor();
    this.drawText(this.expTotalValue(), x, y + lineHeight * 1, 270, "right");
    this.drawText(this.expNextValue(), x, y + lineHeight * 3, 270, "right");
};

Window_Status.prototype.expTotalValue = function() {
    if (this._actor.isMaxLevel()) {
        return "-------";
    } else {
        return this._actor.currentExp();
    }
};

Window_Status.prototype.expNextValue = function() {
    if (this._actor.isMaxLevel()) {
        return "-------";
    } else {
        return this._actor.nextRequiredExp();
    }
};

//-----------------------------------------------------------------------------
// Window_StatusParams
//
// The window for displaying parameters on the status screen.

function Window_StatusParams() {
    this.initialize(...arguments);
}

Window_StatusParams.prototype = Object.create(Window_StatusBase.prototype);
Window_StatusParams.prototype.constructor = Window_StatusParams;

Window_StatusParams.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
};

Window_StatusParams.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_StatusParams.prototype.maxItems = function() {
    return 6;
};

Window_StatusParams.prototype.itemHeight = function() {
    return this.lineHeight();
};

Window_StatusParams.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const paramId = index + 2;
    const name = TextManager.param(paramId);
    const value = this._actor.param(paramId);
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(name, rect.x, rect.y, 160);
    this.resetTextColor();
    this.drawText(value, rect.x + 160, rect.y, 60, "right");
};

Window_StatusParams.prototype.drawItemBackground = function(/*index*/) {
    //
};

//-----------------------------------------------------------------------------
// Window_StatusEquip
//
// The window for displaying equipment items on the status screen.

function Window_StatusEquip() {
    this.initialize(...arguments);
}

Window_StatusEquip.prototype = Object.create(Window_StatusBase.prototype);
Window_StatusEquip.prototype.constructor = Window_StatusEquip;

Window_StatusEquip.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
};

Window_StatusEquip.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_StatusEquip.prototype.maxItems = function() {
    return this._actor ? this._actor.equipSlots().length : 0;
};

Window_StatusEquip.prototype.itemHeight = function() {
    return this.lineHeight();
};

Window_StatusEquip.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const equips = this._actor.equips();
    const item = equips[index];
    const slotName = this.actorSlotName(this._actor, index);
    const sw = 138;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(slotName, rect.x, rect.y, sw, rect.height);
    this.drawItemName(item, rect.x + sw, rect.y, rect.width - sw);
};

Window_StatusEquip.prototype.drawItemBackground = function(/*index*/) {
    //
};

//-----------------------------------------------------------------------------
// Window_Options
//
// The window for changing various settings on the options screen.

function Window_Options() {
    this.initialize(...arguments);
}

Window_Options.prototype = Object.create(Window_Command.prototype);
Window_Options.prototype.constructor = Window_Options;

Window_Options.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
};

Window_Options.prototype.makeCommandList = function() {
    this.addGeneralOptions();
    this.addVolumeOptions();
};

Window_Options.prototype.addGeneralOptions = function() {
    this.addCommand(TextManager.alwaysDash, "alwaysDash");
    this.addCommand(TextManager.commandRemember, "commandRemember");
    this.addCommand(TextManager.touchUI, "touchUI");
};

Window_Options.prototype.addVolumeOptions = function() {
    this.addCommand(TextManager.bgmVolume, "bgmVolume");
    this.addCommand(TextManager.bgsVolume, "bgsVolume");
    this.addCommand(TextManager.meVolume, "meVolume");
    this.addCommand(TextManager.seVolume, "seVolume");
};

Window_Options.prototype.drawItem = function(index) {
    const title = this.commandName(index);
    const status = this.statusText(index);
    const rect = this.itemLineRect(index);
    const statusWidth = this.statusWidth();
    const titleWidth = rect.width - statusWidth;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(title, rect.x, rect.y, titleWidth, "left");
    this.drawText(status, rect.x + titleWidth, rect.y, statusWidth, "right");
};

Window_Options.prototype.statusWidth = function() {
    return 120;
};

Window_Options.prototype.statusText = function(index) {
    const symbol = this.commandSymbol(index);
    const value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        return this.volumeStatusText(value);
    } else {
        return this.booleanStatusText(value);
    }
};

Window_Options.prototype.isVolumeSymbol = function(symbol) {
    return symbol.includes("Volume");
};

Window_Options.prototype.booleanStatusText = function(value) {
    return value ? "ON" : "OFF";
};

Window_Options.prototype.volumeStatusText = function(value) {
    return value + "%";
};

Window_Options.prototype.processOk = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (this.isVolumeSymbol(symbol)) {
        this.changeVolume(symbol, true, true);
    } else {
        this.changeValue(symbol, !this.getConfigValue(symbol));
    }
};

Window_Options.prototype.cursorRight = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (this.isVolumeSymbol(symbol)) {
        this.changeVolume(symbol, true, false);
    } else {
        this.changeValue(symbol, true);
    }
};

Window_Options.prototype.cursorLeft = function() {
    const index = this.index();
    const symbol = this.commandSymbol(index);
    if (this.isVolumeSymbol(symbol)) {
        this.changeVolume(symbol, false, false);
    } else {
        this.changeValue(symbol, false);
    }
};

Window_Options.prototype.changeVolume = function(symbol, forward, wrap) {
    const lastValue = this.getConfigValue(symbol);
    const offset = this.volumeOffset();
    const value = lastValue + (forward ? offset : -offset);
    if (value > 100 && wrap) {
        this.changeValue(symbol, 0);
    } else {
        this.changeValue(symbol, value.clamp(0, 100));
    }
};

Window_Options.prototype.volumeOffset = function() {
    return 20;
};

Window_Options.prototype.changeValue = function(symbol, value) {
    const lastValue = this.getConfigValue(symbol);
    if (lastValue !== value) {
        this.setConfigValue(symbol, value);
        this.redrawItem(this.findSymbol(symbol));
        this.playCursorSound();
    }
};

Window_Options.prototype.getConfigValue = function(symbol) {
    return ConfigManager[symbol];
};

Window_Options.prototype.setConfigValue = function(symbol, volume) {
    ConfigManager[symbol] = volume;
};

//-----------------------------------------------------------------------------
// Window_SavefileList
//
// The window for selecting a save file on the save and load screens.

function Window_SavefileList() {
    this.initialize(...arguments);
}

Window_SavefileList.prototype = Object.create(Window_Selectable.prototype);
Window_SavefileList.prototype.constructor = Window_SavefileList;

Window_SavefileList.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.activate();
    this._mode = null;
    this._autosave = false;
};

Window_SavefileList.prototype.setMode = function(mode, autosave) {
    this._mode = mode;
    this._autosave = autosave;
    this.refresh();
};

Window_SavefileList.prototype.maxItems = function() {
    return DataManager.maxSavefiles() - (this._autosave ? 0 : 1);
};

Window_SavefileList.prototype.numVisibleRows = function() {
    return 5;
};

Window_SavefileList.prototype.itemHeight = function() {
    return Math.floor(this.innerHeight / this.numVisibleRows());
};

Window_SavefileList.prototype.drawItem = function(index) {
    const savefileId = this.indexToSavefileId(index);
    const info = DataManager.savefileInfo(savefileId);
    const rect = this.itemRectWithPadding(index);
    this.resetTextColor();
    this.changePaintOpacity(this.isEnabled(savefileId));
    this.drawTitle(savefileId, rect.x, rect.y + 4);
    if (info) {
        this.drawContents(info, rect);
    }
};

Window_SavefileList.prototype.indexToSavefileId = function(index) {
    return index + (this._autosave ? 0 : 1);
};

Window_SavefileList.prototype.savefileIdToIndex = function(savefileId) {
    return savefileId - (this._autosave ? 0 : 1);
};

Window_SavefileList.prototype.isEnabled = function(savefileId) {
    if (this._mode === "save") {
        return savefileId > 0;
    } else {
        return !!DataManager.savefileInfo(savefileId);
    }
};

Window_SavefileList.prototype.savefileId = function() {
    return this.indexToSavefileId(this.index());
};

Window_SavefileList.prototype.selectSavefile = function(savefileId) {
    const index = Math.max(0, this.savefileIdToIndex(savefileId));
    this.select(index);
    this.setTopRow(index - 2);
};

Window_SavefileList.prototype.drawTitle = function(savefileId, x, y) {
    if (savefileId === 0) {
        this.drawText(TextManager.autosave, x, y, 180);
    } else {
        this.drawText(TextManager.file + " " + savefileId, x, y, 180);
    }
};

Window_SavefileList.prototype.drawContents = function(info, rect) {
    const bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        this.drawPartyCharacters(info, rect.x + 220, bottom - 8);
    }
    const lineHeight = this.lineHeight();
    const y2 = bottom - lineHeight - 4;
    if (y2 >= lineHeight) {
        this.drawPlaytime(info, rect.x, y2, rect.width);
    }
};

Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
    if (info.characters) {
        let characterX = x;
        for (const data of info.characters) {
            this.drawCharacter(data[0], data[1], characterX, y);
            characterX += 48;
        }
    }
};

Window_SavefileList.prototype.drawPlaytime = function(info, x, y, width) {
    if (info.playtime) {
        this.drawText(info.playtime, x, y, width, "right");
    }
};

Window_SavefileList.prototype.playOkSound = function() {
    //
};

//-----------------------------------------------------------------------------
// Window_ShopCommand
//
// The window for selecting buy/sell on the shop screen.

function Window_ShopCommand() {
    this.initialize(...arguments);
}

Window_ShopCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_ShopCommand.prototype.constructor = Window_ShopCommand;

Window_ShopCommand.prototype.initialize = function(rect) {
    Window_HorzCommand.prototype.initialize.call(this, rect);
};

Window_ShopCommand.prototype.setPurchaseOnly = function(purchaseOnly) {
    this._purchaseOnly = purchaseOnly;
    this.refresh();
};

Window_ShopCommand.prototype.maxCols = function() {
    return 3;
};

Window_ShopCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.buy, "buy");
    this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
    this.addCommand(TextManager.cancel, "cancel");
};

//-----------------------------------------------------------------------------
// Window_ShopBuy
//
// The window for selecting an item to buy on the shop screen.

function Window_ShopBuy() {
    this.initialize(...arguments);
}

Window_ShopBuy.prototype = Object.create(Window_Selectable.prototype);
Window_ShopBuy.prototype.constructor = Window_ShopBuy;

Window_ShopBuy.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._money = 0;
};

Window_ShopBuy.prototype.setupGoods = function(shopGoods) {
    this._shopGoods = shopGoods;
    this.refresh();
    this.select(0);
};

Window_ShopBuy.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_ShopBuy.prototype.item = function() {
    return this.itemAt(this.index());
};

Window_ShopBuy.prototype.itemAt = function(index) {
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_ShopBuy.prototype.setMoney = function(money) {
    this._money = money;
    this.refresh();
};

Window_ShopBuy.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};

Window_ShopBuy.prototype.price = function(item) {
    return this._price[this._data.indexOf(item)] || 0;
};

Window_ShopBuy.prototype.isEnabled = function(item) {
    return (
        item && this.price(item) <= this._money && !$gameParty.hasMaxItems(item)
    );
};

Window_ShopBuy.prototype.refresh = function() {
    this.makeItemList();
    Window_Selectable.prototype.refresh.call(this);
};

Window_ShopBuy.prototype.makeItemList = function() {
    this._data = [];
    this._price = [];
    for (const goods of this._shopGoods) {
        const item = this.goodsToItem(goods);
        if (item) {
            this._data.push(item);
            this._price.push(goods[2] === 0 ? item.price : goods[3]);
        }
    }
};

Window_ShopBuy.prototype.goodsToItem = function(goods) {
    switch (goods[0]) {
        case 0:
            return $dataItems[goods[1]];
        case 1:
            return $dataWeapons[goods[1]];
        case 2:
            return $dataArmors[goods[1]];
        default:
            return null;
    }
};

Window_ShopBuy.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    const price = this.price(item);
    const rect = this.itemLineRect(index);
    const priceWidth = this.priceWidth();
    const priceX = rect.x + rect.width - priceWidth;
    const nameWidth = rect.width - priceWidth;
    this.changePaintOpacity(this.isEnabled(item));
    this.drawItemName(item, rect.x, rect.y, nameWidth);
    this.drawText(price, priceX, rect.y, priceWidth, "right");
    this.changePaintOpacity(true);
};

Window_ShopBuy.prototype.priceWidth = function() {
    return 96;
};

Window_ShopBuy.prototype.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
    this.callUpdateHelp();
};

Window_ShopBuy.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
    if (this._statusWindow) {
        this._statusWindow.setItem(this.item());
    }
};
