//-----------------------------------------------------------------------------
// Sprite_Gauge
//
// The sprite for displaying a status gauge.

function Sprite_Gauge() {
    this.initialize(...arguments);
}

Sprite_Gauge.prototype = Object.create(Sprite.prototype);
Sprite_Gauge.prototype.constructor = Sprite_Gauge;

Sprite_Gauge.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.createBitmap();
};

Sprite_Gauge.prototype.initMembers = function() {
    this._battler = null;
    this._statusType = "";
    this._value = NaN;
    this._maxValue = NaN;
    this._targetValue = NaN;
    this._targetMaxValue = NaN;
    this._duration = 0;
    this._flashingCount = 0;
};

Sprite_Gauge.prototype.destroy = function(options) {
    this.bitmap.destroy();
    Sprite.prototype.destroy.call(this, options);
};

Sprite_Gauge.prototype.createBitmap = function() {
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.bitmap = new Bitmap(width, height);
};

Sprite_Gauge.prototype.bitmapWidth = function() {
    return 128;
};

Sprite_Gauge.prototype.bitmapHeight = function() {
    return 32;
};

Sprite_Gauge.prototype.textHeight = function() {
    return 24;
};

Sprite_Gauge.prototype.gaugeHeight = function() {
    return 12;
};

Sprite_Gauge.prototype.gaugeX = function() {
    if (this._statusType === "time") {
        return 0;
    } else {
        return this.measureLabelWidth() + 6;
    }
};

Sprite_Gauge.prototype.labelY = function() {
    return 3;
};

Sprite_Gauge.prototype.labelFontFace = function() {
    return $gameSystem.mainFontFace();
};

Sprite_Gauge.prototype.labelFontSize = function() {
    return $gameSystem.mainFontSize() - 2;
};

Sprite_Gauge.prototype.valueFontFace = function() {
    return $gameSystem.numberFontFace();
};

Sprite_Gauge.prototype.valueFontSize = function() {
    return $gameSystem.mainFontSize() - 6;
};

Sprite_Gauge.prototype.setup = function(battler, statusType) {
    this._battler = battler;
    this._statusType = statusType;
    this._value = this.currentValue();
    this._maxValue = this.currentMaxValue();
    this.updateBitmap();
};

Sprite_Gauge.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
};

Sprite_Gauge.prototype.updateBitmap = function() {
    const value = this.currentValue();
    const maxValue = this.currentMaxValue();
    if (value !== this._targetValue || maxValue !== this._targetMaxValue) {
        this.updateTargetValue(value, maxValue);
    }
    this.updateGaugeAnimation();
    this.updateFlashing();
};

Sprite_Gauge.prototype.updateTargetValue = function(value, maxValue) {
    this._targetValue = value;
    this._targetMaxValue = maxValue;
    if (isNaN(this._value)) {
        this._value = value;
        this._maxValue = maxValue;
        this.redraw();
    } else {
        this._duration = this.smoothness();
    }
};

Sprite_Gauge.prototype.smoothness = function() {
    return this._statusType === "time" ? 5 : 20;
};

Sprite_Gauge.prototype.updateGaugeAnimation = function() {
    if (this._duration > 0) {
        const d = this._duration;
        this._value = (this._value * (d - 1) + this._targetValue) / d;
        this._maxValue = (this._maxValue * (d - 1) + this._targetMaxValue) / d;
        this._duration--;
        this.redraw();
    }
};

Sprite_Gauge.prototype.updateFlashing = function() {
    if (this._statusType === "time") {
        this._flashingCount++;
        if (this._battler.isInputting()) {
            if (this._flashingCount % 30 < 15) {
                this.setBlendColor(this.flashingColor1());
            } else {
                this.setBlendColor(this.flashingColor2());
            }
        } else {
            this.setBlendColor([0, 0, 0, 0]);
        }
    }
};

Sprite_Gauge.prototype.flashingColor1 = function() {
    return [255, 255, 255, 64];
};

Sprite_Gauge.prototype.flashingColor2 = function() {
    return [0, 0, 255, 48];
};

Sprite_Gauge.prototype.isValid = function() {
    if (this._battler) {
        if (this._statusType === "tp" && !this._battler.isPreserveTp()) {
            return $gameParty.inBattle();
        } else {
            return true;
        }
    }
    return false;
};

Sprite_Gauge.prototype.currentValue = function() {
    if (this._battler) {
        switch (this._statusType) {
            case "hp":
                return this._battler.hp;
            case "mp":
                return this._battler.mp;
            case "tp":
                return this._battler.tp;
            case "time":
                return this._battler.tpbChargeTime();
        }
    }
    return NaN;
};

Sprite_Gauge.prototype.currentMaxValue = function() {
    if (this._battler) {
        switch (this._statusType) {
            case "hp":
                return this._battler.mhp;
            case "mp":
                return this._battler.mmp;
            case "tp":
                return this._battler.maxTp();
            case "time":
                return 1;
        }
    }
    return NaN;
};

Sprite_Gauge.prototype.label = function() {
    switch (this._statusType) {
        case "hp":
            return TextManager.hpA;
        case "mp":
            return TextManager.mpA;
        case "tp":
            return TextManager.tpA;
        default:
            return "";
    }
};

Sprite_Gauge.prototype.gaugeBackColor = function() {
    return ColorManager.gaugeBackColor();
};

Sprite_Gauge.prototype.gaugeColor1 = function() {
    switch (this._statusType) {
        case "hp":
            return ColorManager.hpGaugeColor1();
        case "mp":
            return ColorManager.mpGaugeColor1();
        case "tp":
            return ColorManager.tpGaugeColor1();
        case "time":
            return ColorManager.ctGaugeColor1();
        default:
            return ColorManager.normalColor();
    }
};

Sprite_Gauge.prototype.gaugeColor2 = function() {
    switch (this._statusType) {
        case "hp":
            return ColorManager.hpGaugeColor2();
        case "mp":
            return ColorManager.mpGaugeColor2();
        case "tp":
            return ColorManager.tpGaugeColor2();
        case "time":
            return ColorManager.ctGaugeColor2();
        default:
            return ColorManager.normalColor();
    }
};

Sprite_Gauge.prototype.labelColor = function() {
    return ColorManager.systemColor();
};

Sprite_Gauge.prototype.labelOutlineColor = function() {
    return ColorManager.outlineColor();
};

Sprite_Gauge.prototype.labelOutlineWidth = function() {
    return 3;
};

Sprite_Gauge.prototype.valueColor = function() {
    switch (this._statusType) {
        case "hp":
            return ColorManager.hpColor(this._battler);
        case "mp":
            return ColorManager.mpColor(this._battler);
        case "tp":
            return ColorManager.tpColor(this._battler);
        default:
            return ColorManager.normalColor();
    }
};

Sprite_Gauge.prototype.valueOutlineColor = function() {
    return "rgba(0, 0, 0, 1)";
};

Sprite_Gauge.prototype.valueOutlineWidth = function() {
    return 2;
};

Sprite_Gauge.prototype.redraw = function() {
    this.bitmap.clear();
    const currentValue = this.currentValue();
    if (!isNaN(currentValue)) {
        this.drawGauge();
        if (this._statusType !== "time") {
            this.drawLabel();
            if (this.isValid()) {
                this.drawValue();
            }
        }
    }
};

Sprite_Gauge.prototype.drawGauge = function() {
    const gaugeX = this.gaugeX();
    const gaugeY = this.textHeight() - this.gaugeHeight();
    const gaugewidth = this.bitmapWidth() - gaugeX;
    const gaugeHeight = this.gaugeHeight();
    this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
};

Sprite_Gauge.prototype.drawGaugeRect = function(x, y, width, height) {
    const rate = this.gaugeRate();
    const fillW = Math.floor((width - 2) * rate);
    const fillH = height - 2;
    const color0 = this.gaugeBackColor();
    const color1 = this.gaugeColor1();
    const color2 = this.gaugeColor2();
    this.bitmap.fillRect(x, y, width, height, color0);
    this.bitmap.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
};

Sprite_Gauge.prototype.gaugeRate = function() {
    if (this.isValid()) {
        const value = this._value;
        const maxValue = this._maxValue;
        return maxValue > 0 ? value / maxValue : 0;
    } else {
        return 0;
    }
};

Sprite_Gauge.prototype.drawLabel = function() {
    const label = this.label();
    const x = this.labelOutlineWidth() / 2;
    const y = this.labelY();
    const width = this.bitmapWidth();
    const height = this.textHeight();
    this.setupLabelFont();
    this.bitmap.paintOpacity = this.labelOpacity();
    this.bitmap.drawText(label, x, y, width, height, "left");
    this.bitmap.paintOpacity = 255;
};

Sprite_Gauge.prototype.setupLabelFont = function() {
    this.bitmap.fontFace = this.labelFontFace();
    this.bitmap.fontSize = this.labelFontSize();
    this.bitmap.textColor = this.labelColor();
    this.bitmap.outlineColor = this.labelOutlineColor();
    this.bitmap.outlineWidth = this.labelOutlineWidth();
};

Sprite_Gauge.prototype.measureLabelWidth = function() {
    this.setupLabelFont();
    const labels = [TextManager.hpA, TextManager.mpA, TextManager.tpA];
    const widths = labels.map(str => this.bitmap.measureTextWidth(str));
    return Math.ceil(Math.max(...widths));
};

Sprite_Gauge.prototype.labelOpacity = function() {
    return this.isValid() ? 255 : 160;
};

Sprite_Gauge.prototype.drawValue = function() {
    const currentValue = this.currentValue();
    const width = this.bitmapWidth();
    const height = this.textHeight();
    this.setupValueFont();
    this.bitmap.drawText(currentValue, 0, 0, width, height, "right");
};

Sprite_Gauge.prototype.setupValueFont = function() {
    this.bitmap.fontFace = this.valueFontFace();
    this.bitmap.fontSize = this.valueFontSize();
    this.bitmap.textColor = this.valueColor();
    this.bitmap.outlineColor = this.valueOutlineColor();
    this.bitmap.outlineWidth = this.valueOutlineWidth();
};

//-----------------------------------------------------------------------------
// Sprite_Name
//
// The sprite for displaying a status gauge.

function Sprite_Name() {
    this.initialize(...arguments);
}

Sprite_Name.prototype = Object.create(Sprite.prototype);
Sprite_Name.prototype.constructor = Sprite_Name;

Sprite_Name.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.createBitmap();
};

Sprite_Name.prototype.initMembers = function() {
    this._battler = null;
    this._name = "";
    this._textColor = "";
};

Sprite_Name.prototype.destroy = function(options) {
    this.bitmap.destroy();
    Sprite.prototype.destroy.call(this, options);
};

Sprite_Name.prototype.createBitmap = function() {
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.bitmap = new Bitmap(width, height);
};

Sprite_Name.prototype.bitmapWidth = function() {
    return 128;
};

Sprite_Name.prototype.bitmapHeight = function() {
    return 24;
};

Sprite_Name.prototype.fontFace = function() {
    return $gameSystem.mainFontFace();
};

Sprite_Name.prototype.fontSize = function() {
    return $gameSystem.mainFontSize();
};

Sprite_Name.prototype.setup = function(battler) {
    this._battler = battler;
    this.updateBitmap();
};

Sprite_Name.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
};

Sprite_Name.prototype.updateBitmap = function() {
    const name = this.name();
    const color = this.textColor();
    if (name !== this._name || color !== this._textColor) {
        this._name = name;
        this._textColor = color;
        this.redraw();
    }
};

Sprite_Name.prototype.name = function() {
    return this._battler ? this._battler.name() : "";
};

Sprite_Name.prototype.textColor = function() {
    return ColorManager.hpColor(this._battler);
};

Sprite_Name.prototype.outlineColor = function() {
    return ColorManager.outlineColor();
};

Sprite_Name.prototype.outlineWidth = function() {
    return 3;
};

Sprite_Name.prototype.redraw = function() {
    const name = this.name();
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.setupFont();
    this.bitmap.clear();
    this.bitmap.drawText(name, 0, 0, width, height, "left");
};

Sprite_Name.prototype.setupFont = function() {
    this.bitmap.fontFace = this.fontFace();
    this.bitmap.fontSize = this.fontSize();
    this.bitmap.textColor = this.textColor();
    this.bitmap.outlineColor = this.outlineColor();
    this.bitmap.outlineWidth = this.outlineWidth();
};

//-----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.

function Sprite_StateIcon() {
    this.initialize(...arguments);
}

Sprite_StateIcon.prototype = Object.create(Sprite.prototype);
Sprite_StateIcon.prototype.constructor = Sprite_StateIcon;

Sprite_StateIcon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};

Sprite_StateIcon.prototype.initMembers = function() {
    this._battler = null;
    this._iconIndex = 0;
    this._animationCount = 0;
    this._animationIndex = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

Sprite_StateIcon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem("IconSet");
    this.setFrame(0, 0, 0, 0);
};

Sprite_StateIcon.prototype.setup = function(battler) {
    if (this._battler !== battler) {
        this._battler = battler;
        this._animationCount = this.animationWait();
    }
};

Sprite_StateIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updateIcon();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_StateIcon.prototype.animationWait = function() {
    return 40;
};

Sprite_StateIcon.prototype.updateIcon = function() {
    const icons = [];
    if (this.shouldDisplay()) {
        icons.push(...this._battler.allIcons());
    }
    if (icons.length > 0) {
        this._animationIndex++;
        if (this._animationIndex >= icons.length) {
            this._animationIndex = 0;
        }
        this._iconIndex = icons[this._animationIndex];
    } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
    }
};

Sprite_StateIcon.prototype.shouldDisplay = function() {
    const battler = this._battler;
    return battler && (battler.isActor() || battler.isAlive());
};

Sprite_StateIcon.prototype.updateFrame = function() {
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (this._iconIndex % 16) * pw;
    const sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

//-----------------------------------------------------------------------------
// Sprite_StateOverlay
//
// The sprite for displaying an overlay image for a state.

function Sprite_StateOverlay() {
    this.initialize(...arguments);
}

Sprite_StateOverlay.prototype = Object.create(Sprite.prototype);
Sprite_StateOverlay.prototype.constructor = Sprite_StateOverlay;

Sprite_StateOverlay.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};

Sprite_StateOverlay.prototype.initMembers = function() {
    this._battler = null;
    this._overlayIndex = 0;
    this._animationCount = 0;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
};

Sprite_StateOverlay.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem("States");
    this.setFrame(0, 0, 0, 0);
};

Sprite_StateOverlay.prototype.setup = function(battler) {
    this._battler = battler;
};

Sprite_StateOverlay.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_StateOverlay.prototype.animationWait = function() {
    return 8;
};

Sprite_StateOverlay.prototype.updatePattern = function() {
    this._pattern++;
    this._pattern %= 8;
    if (this._battler) {
        this._overlayIndex = this._battler.stateOverlayIndex();
    } else {
        this._overlayIndex = 0;
    }
};

Sprite_StateOverlay.prototype.updateFrame = function() {
    if (this._overlayIndex > 0) {
        const w = 96;
        const h = 96;
        const sx = this._pattern * w;
        const sy = (this._overlayIndex - 1) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

//-----------------------------------------------------------------------------
// Sprite_Weapon
//
// The sprite for displaying a weapon image for attacking.

function Sprite_Weapon() {
    this.initialize(...arguments);
}

Sprite_Weapon.prototype = Object.create(Sprite.prototype);
Sprite_Weapon.prototype.constructor = Sprite_Weapon;

Sprite_Weapon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

Sprite_Weapon.prototype.initMembers = function() {
    this._weaponImageId = 0;
    this._animationCount = 0;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.x = -16;
};

Sprite_Weapon.prototype.setup = function(weaponImageId) {
    this._weaponImageId = weaponImageId;
    this._animationCount = 0;
    this._pattern = 0;
    this.loadBitmap();
    this.updateFrame();
};

Sprite_Weapon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
};

Sprite_Weapon.prototype.animationWait = function() {
    return 12;
};

Sprite_Weapon.prototype.updatePattern = function() {
    this._pattern++;
    if (this._pattern >= 3) {
        this._weaponImageId = 0;
    }
};

Sprite_Weapon.prototype.loadBitmap = function() {
    const pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
    if (pageId >= 1) {
        this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
    } else {
        this.bitmap = ImageManager.loadSystem("");
    }
};

Sprite_Weapon.prototype.updateFrame = function() {
    if (this._weaponImageId > 0) {
        const index = (this._weaponImageId - 1) % 12;
        const w = 96;
        const h = 64;
        const sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
        const sy = Math.floor(index % 6) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

Sprite_Weapon.prototype.isPlaying = function() {
    return this._weaponImageId > 0;
};

//-----------------------------------------------------------------------------
// Sprite_Balloon
//
// The sprite for displaying a balloon icon.

function Sprite_Balloon() {
    this.initialize(...arguments);
}

Sprite_Balloon.prototype = Object.create(Sprite.prototype);
Sprite_Balloon.prototype.constructor = Sprite_Balloon;

Sprite_Balloon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};

Sprite_Balloon.prototype.initMembers = function() {
    this._target = null;
    this._balloonId = 0;
    this._duration = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.z = 7;
};

Sprite_Balloon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem("Balloon");
    this.setFrame(0, 0, 0, 0);
};

Sprite_Balloon.prototype.setup = function(targetSprite, balloonId) {
    this._target = targetSprite;
    this._balloonId = balloonId;
    this._duration = 8 * this.speed() + this.waitTime();
};

Sprite_Balloon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        if (this._duration > 0) {
            this.updatePosition();
            this.updateFrame();
        }
    }
};

Sprite_Balloon.prototype.updatePosition = function() {
    this.x = this._target.x;
    this.y = this._target.y - this._target.height;
};

Sprite_Balloon.prototype.updateFrame = function() {
    const w = 48;
    const h = 48;
    const sx = this.frameIndex() * w;
    const sy = (this._balloonId - 1) * h;
    this.setFrame(sx, sy, w, h);
};

Sprite_Balloon.prototype.speed = function() {
    return 8;
};

Sprite_Balloon.prototype.waitTime = function() {
    return 12;
};

Sprite_Balloon.prototype.frameIndex = function() {
    const index = (this._duration - this.waitTime()) / this.speed();
    return 7 - Math.max(Math.floor(index), 0);
};

Sprite_Balloon.prototype.isPlaying = function() {
    return this._duration > 0;
};

//-----------------------------------------------------------------------------
// Sprite_Picture
//
// The sprite for displaying a picture.

function Sprite_Picture() {
    this.initialize(...arguments);
}

Sprite_Picture.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_Picture.prototype.constructor = Sprite_Picture;

Sprite_Picture.prototype.initialize = function(pictureId) {
    Sprite_Clickable.prototype.initialize.call(this);
    this._pictureId = pictureId;
    this._pictureName = "";
    this.update();
};

Sprite_Picture.prototype.picture = function() {
    return $gameScreen.picture(this._pictureId);
};

Sprite_Picture.prototype.update = function() {
    Sprite_Clickable.prototype.update.call(this);
    this.updateBitmap();
    if (this.visible) {
        this.updateOrigin();
        this.updatePosition();
        this.updateScale();
        this.updateTone();
        this.updateOther();
    }
};

Sprite_Picture.prototype.updateBitmap = function() {
    const picture = this.picture();
    if (picture) {
        const pictureName = picture.name();
        if (this._pictureName !== pictureName) {
            this._pictureName = pictureName;
            this.loadBitmap();
        }
        this.visible = true;
    } else {
        this._pictureName = "";
        this.bitmap = null;
        this.visible = false;
    }
};

Sprite_Picture.prototype.updateOrigin = function() {
    const picture = this.picture();
    if (picture.origin() === 0) {
        this.anchor.x = 0;
        this.anchor.y = 0;
    } else {
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }
};

Sprite_Picture.prototype.updatePosition = function() {
    const picture = this.picture();
    this.x = Math.round(picture.x());
    this.y = Math.round(picture.y());
};

Sprite_Picture.prototype.updateScale = function() {
    const picture = this.picture();
    this.scale.x = picture.scaleX() / 100;
    this.scale.y = picture.scaleY() / 100;
};

Sprite_Picture.prototype.updateTone = function() {
    const picture = this.picture();
    if (picture.tone()) {
        this.setColorTone(picture.tone());
    } else {
        this.setColorTone([0, 0, 0, 0]);
    }
};

Sprite_Picture.prototype.updateOther = function() {
    const picture = this.picture();
    this.opacity = picture.opacity();
    this.blendMode = picture.blendMode();
    this.rotation = (picture.angle() * Math.PI) / 180;
};

Sprite_Picture.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadPicture(this._pictureName);
};

//-----------------------------------------------------------------------------
// Sprite_Timer
//
// The sprite for displaying the timer.

function Sprite_Timer() {
    this.initialize(...arguments);
}

Sprite_Timer.prototype = Object.create(Sprite.prototype);
Sprite_Timer.prototype.constructor = Sprite_Timer;

Sprite_Timer.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._seconds = 0;
    this.createBitmap();
    this.update();
};

Sprite_Timer.prototype.destroy = function(options) {
    this.bitmap.destroy();
    Sprite.prototype.destroy.call(this, options);
};

Sprite_Timer.prototype.createBitmap = function() {
    this.bitmap = new Bitmap(96, 48);
    this.bitmap.fontFace = this.fontFace();
    this.bitmap.fontSize = this.fontSize();
    this.bitmap.outlineColor = ColorManager.outlineColor();
};

Sprite_Timer.prototype.fontFace = function() {
    return $gameSystem.numberFontFace();
};

Sprite_Timer.prototype.fontSize = function() {
    return $gameSystem.mainFontSize() + 8;
};

Sprite_Timer.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updatePosition();
    this.updateVisibility();
};

Sprite_Timer.prototype.updateBitmap = function() {
    if (this._seconds !== $gameTimer.seconds()) {
        this._seconds = $gameTimer.seconds();
        this.redraw();
    }
};

Sprite_Timer.prototype.redraw = function() {
    const text = this.timerText();
    const width = this.bitmap.width;
    const height = this.bitmap.height;
    this.bitmap.clear();
    this.bitmap.drawText(text, 0, 0, width, height, "center");
};

Sprite_Timer.prototype.timerText = function() {
    const min = Math.floor(this._seconds / 60) % 60;
    const sec = this._seconds % 60;
    return min.padZero(2) + ":" + sec.padZero(2);
};

Sprite_Timer.prototype.updatePosition = function() {
    this.x = (Graphics.width - this.bitmap.width) / 2;
    this.y = 0;
};

Sprite_Timer.prototype.updateVisibility = function() {
    this.visible = $gameTimer.isWorking();
};

//-----------------------------------------------------------------------------
// Sprite_Destination
//
// The sprite for displaying the destination place of the touch input.

function Sprite_Destination() {
    this.initialize(...arguments);
}

Sprite_Destination.prototype = Object.create(Sprite.prototype);
Sprite_Destination.prototype.constructor = Sprite_Destination;

Sprite_Destination.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.createBitmap();
    this._frameCount = 0;
};

Sprite_Destination.prototype.destroy = function(options) {
    if (this.bitmap) {
        this.bitmap.destroy();
    }
    Sprite.prototype.destroy.call(this, options);
};

Sprite_Destination.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if ($gameTemp.isDestinationValid()) {
        this.updatePosition();
        this.updateAnimation();
        this.visible = true;
    } else {
        this._frameCount = 0;
        this.visible = false;
    }
};

Sprite_Destination.prototype.createBitmap = function() {
    const tileWidth = $gameMap.tileWidth();
    const tileHeight = $gameMap.tileHeight();
    this.bitmap = new Bitmap(tileWidth, tileHeight);
    this.bitmap.fillAll("white");
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.blendMode = 1;
};

Sprite_Destination.prototype.updatePosition = function() {
    const tileWidth = $gameMap.tileWidth();
    const tileHeight = $gameMap.tileHeight();
    const x = $gameTemp.destinationX();
    const y = $gameTemp.destinationY();
    this.x = ($gameMap.adjustX(x) + 0.5) * tileWidth;
    this.y = ($gameMap.adjustY(y) + 0.5) * tileHeight;
};

Sprite_Destination.prototype.updateAnimation = function() {
    this._frameCount++;
    this._frameCount %= 20;
    this.opacity = (20 - this._frameCount) * 6;
    this.scale.x = 1 + this._frameCount / 20;
    this.scale.y = this.scale.x;
};

//-----------------------------------------------------------------------------
// Spriteset_Base
//
// The superclass of Spriteset_Map and Spriteset_Battle.

function Spriteset_Base() {
    this.initialize(...arguments);
}

Spriteset_Base.prototype = Object.create(Sprite.prototype);
Spriteset_Base.prototype.constructor = Spriteset_Base;

Spriteset_Base.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.setFrame(0, 0, Graphics.width, Graphics.height);
    this.loadSystemImages();
    this.createLowerLayer();
    this.createUpperLayer();
    this._animationSprites = [];
};

Spriteset_Base.prototype.destroy = function(options) {
    this.removeAllAnimations();
    Sprite.prototype.destroy.call(this, options);
};

Spriteset_Base.prototype.loadSystemImages = function() {
    //
};

Spriteset_Base.prototype.createLowerLayer = function() {
    this.createBaseSprite();
    this.createBaseFilters();
};

Spriteset_Base.prototype.createUpperLayer = function() {
    this.createPictures();
    this.createTimer();
    this.createOverallFilters();
};

Spriteset_Base.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBaseFilters();
    this.updateOverallFilters();
    this.updatePosition();
    this.updateAnimations();
};

Spriteset_Base.prototype.createBaseSprite = function() {
    this._baseSprite = new Sprite();
    this._blackScreen = new ScreenSprite();
    this._blackScreen.opacity = 255;
    this.addChild(this._baseSprite);
    this._baseSprite.addChild(this._blackScreen);
};

Spriteset_Base.prototype.createBaseFilters = function() {
    this._baseSprite.filters = [];
    this._baseColorFilter = new ColorFilter();
    this._baseSprite.filters.push(this._baseColorFilter);
};

Spriteset_Base.prototype.createPictures = function() {
    const rect = this.pictureContainerRect();
    this._pictureContainer = new Sprite();
    this._pictureContainer.setFrame(rect.x, rect.y, rect.width, rect.height);
    for (let i = 1; i <= $gameScreen.maxPictures(); i++) {
        this._pictureContainer.addChild(new Sprite_Picture(i));
    }
    this.addChild(this._pictureContainer);
};

Spriteset_Base.prototype.pictureContainerRect = function() {
    return new Rectangle(0, 0, Graphics.width, Graphics.height);
};

Spriteset_Base.prototype.createTimer = function() {
    this._timerSprite = new Sprite_Timer();
    this.addChild(this._timerSprite);
};

Spriteset_Base.prototype.createOverallFilters = function() {
    this.filters = [];
    this._overallColorFilter = new ColorFilter();
    this.filters.push(this._overallColorFilter);
};

Spriteset_Base.prototype.updateBaseFilters = function() {
    const filter = this._baseColorFilter;
    filter.setColorTone($gameScreen.tone());
};

Spriteset_Base.prototype.updateOverallFilters = function() {
    const filter = this._overallColorFilter;
    filter.setBlendColor($gameScreen.flashColor());
    filter.setBrightness($gameScreen.brightness());
};

Spriteset_Base.prototype.updatePosition = function() {
    const screen = $gameScreen;
    const scale = screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = Math.round(-screen.zoomX() * (scale - 1));
    this.y = Math.round(-screen.zoomY() * (scale - 1));
    this.x += Math.round(screen.shake());
};

Spriteset_Base.prototype.findTargetSprite = function(/*target*/) {
    return null;
};

Spriteset_Base.prototype.updateAnimations = function() {
    for (const sprite of this._animationSprites) {
        if (!sprite.isPlaying()) {
            this.removeAnimation(sprite);
        }
    }
    this.processAnimationRequests();
};

Spriteset_Base.prototype.processAnimationRequests = function() {
    for (;;) {
        const request = $gameTemp.retrieveAnimation();
        if (request) {
            this.createAnimation(request);
        } else {
            break;
        }
    }
};

Spriteset_Base.prototype.createAnimation = function(request) {
    const animation = $dataAnimations[request.animationId];
    const targets = request.targets;
    const mirror = request.mirror;
    let delay = this.animationBaseDelay();
    const nextDelay = this.animationNextDelay();
    if (this.isAnimationForEach(animation)) {
        for (const target of targets) {
            this.createAnimationSprite([target], animation, mirror, delay);
            delay += nextDelay;
        }
    } else {
        this.createAnimationSprite(targets, animation, mirror, delay);
    }
};

// prettier-ignore
Spriteset_Base.prototype.createAnimationSprite = function(
    targets, animation, mirror, delay
) {
    const mv = this.isMVAnimation(animation);
    const sprite = new (mv ? Sprite_AnimationMV : Sprite_Animation)();
    const targetSprites = this.makeTargetSprites(targets);
    const baseDelay = this.animationBaseDelay();
    const previous = delay > baseDelay ? this.lastAnimationSprite() : null;
    if (this.animationShouldMirror(targets[0])) {
        mirror = !mirror;
    }
    sprite.targetObjects = targets;
    sprite.setup(targetSprites, animation, mirror, delay, previous);
    this._effectsContainer.addChild(sprite);
    this._animationSprites.push(sprite);
};

Spriteset_Base.prototype.isMVAnimation = function(animation) {
    return !!animation.frames;
};

Spriteset_Base.prototype.makeTargetSprites = function(targets) {
    const targetSprites = [];
    for (const target of targets) {
        const targetSprite = this.findTargetSprite(target);
        if (targetSprite) {
            targetSprites.push(targetSprite);
        }
    }
    return targetSprites;
};

Spriteset_Base.prototype.lastAnimationSprite = function() {
    return this._animationSprites[this._animationSprites.length - 1];
};

Spriteset_Base.prototype.isAnimationForEach = function(animation) {
    const mv = this.isMVAnimation(animation);
    return mv ? animation.position !== 3 : animation.displayType === 0;
};

Spriteset_Base.prototype.animationBaseDelay = function() {
    return 8;
};

Spriteset_Base.prototype.animationNextDelay = function() {
    return 12;
};

Spriteset_Base.prototype.animationShouldMirror = function(target) {
    return target && target.isActor && target.isActor();
};

Spriteset_Base.prototype.removeAnimation = function(sprite) {
    this._animationSprites.remove(sprite);
    this._effectsContainer.removeChild(sprite);
    for (const target of sprite.targetObjects) {
        if (target.endAnimation) {
            target.endAnimation();
        }
    }
    sprite.destroy();
};

Spriteset_Base.prototype.removeAllAnimations = function() {
    for (const sprite of this._animationSprites.clone()) {
        this.removeAnimation(sprite);
    }
};

Spriteset_Base.prototype.isAnimationPlaying = function() {
    return this._animationSprites.length > 0;
};

//-----------------------------------------------------------------------------
// Spriteset_Map
//
// The set of sprites on the map screen.

function Spriteset_Map() {
    this.initialize(...arguments);
}

Spriteset_Map.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Map.prototype.constructor = Spriteset_Map;

Spriteset_Map.prototype.initialize = function() {
    Spriteset_Base.prototype.initialize.call(this);
    this._balloonSprites = [];
};

Spriteset_Map.prototype.destroy = function(options) {
    this.removeAllBalloons();
    Spriteset_Base.prototype.destroy.call(this, options);
};

Spriteset_Map.prototype.loadSystemImages = function() {
    Spriteset_Base.prototype.loadSystemImages.call(this);
    ImageManager.loadSystem("Balloon");
    ImageManager.loadSystem("Shadow1");
};

Spriteset_Map.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createParallax();
    this.createTilemap();
    this.createCharacters();
    this.createShadow();
    this.createDestination();
    this.createWeather();
};

Spriteset_Map.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateTileset();
    this.updateParallax();
    this.updateTilemap();
    this.updateShadow();
    this.updateWeather();
    this.updateAnimations();
    this.updateBalloons();
};

Spriteset_Map.prototype.hideCharacters = function() {
    for (const sprite of this._characterSprites) {
        if (!sprite.isTile() && !sprite.isObjectCharacter()) {
            sprite.hide();
        }
    }
};

Spriteset_Map.prototype.createParallax = function() {
    this._parallax = new TilingSprite();
    this._parallax.move(0, 0, Graphics.width, Graphics.height);
    this._baseSprite.addChild(this._parallax);
};

Spriteset_Map.prototype.createTilemap = function() {
    const tilemap = new Tilemap();
    tilemap.tileWidth = $gameMap.tileWidth();
    tilemap.tileHeight = $gameMap.tileHeight();
    tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
    tilemap.verticalWrap = $gameMap.isLoopVertical();
    this._baseSprite.addChild(tilemap);
    this._effectsContainer = tilemap;
    this._tilemap = tilemap;
    this.loadTileset();
};

Spriteset_Map.prototype.loadTileset = function() {
    this._tileset = $gameMap.tileset();
    if (this._tileset) {
        const bitmaps = [];
        const tilesetNames = this._tileset.tilesetNames;
        for (const name of tilesetNames) {
            bitmaps.push(ImageManager.loadTileset(name));
        }
        this._tilemap.setBitmaps(bitmaps);
        this._tilemap.flags = $gameMap.tilesetFlags();
    }
};

Spriteset_Map.prototype.createCharacters = function() {
    this._characterSprites = [];
    for (const event of $gameMap.events()) {
        this._characterSprites.push(new Sprite_Character(event));
    }
    for (const vehicle of $gameMap.vehicles()) {
        this._characterSprites.push(new Sprite_Character(vehicle));
    }
    for (const follower of $gamePlayer.followers().reverseData()) {
        this._characterSprites.push(new Sprite_Character(follower));
    }
    this._characterSprites.push(new Sprite_Character($gamePlayer));
    for (const sprite of this._characterSprites) {
        this._tilemap.addChild(sprite);
    }
};

Spriteset_Map.prototype.createShadow = function() {
    this._shadowSprite = new Sprite();
    this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow1");
    this._shadowSprite.anchor.x = 0.5;
    this._shadowSprite.anchor.y = 1;
    this._shadowSprite.z = 6;
    this._tilemap.addChild(this._shadowSprite);
};

Spriteset_Map.prototype.createDestination = function() {
    this._destinationSprite = new Sprite_Destination();
    this._destinationSprite.z = 9;
    this._tilemap.addChild(this._destinationSprite);
};

Spriteset_Map.prototype.createWeather = function() {
    this._weather = new Weather();
    this.addChild(this._weather);
};

Spriteset_Map.prototype.updateTileset = function() {
    if (this._tileset !== $gameMap.tileset()) {
        this.loadTileset();
    }
};

Spriteset_Map.prototype.updateParallax = function() {
    if (this._parallaxName !== $gameMap.parallaxName()) {
        this._parallaxName = $gameMap.parallaxName();
        this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
    }
    if (this._parallax.bitmap) {
        const bitmap = this._parallax.bitmap;
        this._parallax.origin.x = $gameMap.parallaxOx() % bitmap.width;
        this._parallax.origin.y = $gameMap.parallaxOy() % bitmap.height;
    }
};

Spriteset_Map.prototype.updateTilemap = function() {
    this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
};

Spriteset_Map.prototype.updateShadow = function() {
    const airship = $gameMap.airship();
    this._shadowSprite.x = airship.shadowX();
    this._shadowSprite.y = airship.shadowY();
    this._shadowSprite.opacity = airship.shadowOpacity();
};

Spriteset_Map.prototype.updateWeather = function() {
    this._weather.type = $gameScreen.weatherType();
    this._weather.power = $gameScreen.weatherPower();
    this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
};

Spriteset_Map.prototype.updateBalloons = function() {
    for (const sprite of this._balloonSprites) {
        if (!sprite.isPlaying()) {
            this.removeBalloon(sprite);
        }
    }
    this.processBalloonRequests();
};

Spriteset_Map.prototype.processBalloonRequests = function() {
    for (;;) {
        const request = $gameTemp.retrieveBalloon();
        if (request) {
            this.createBalloon(request);
        } else {
            break;
        }
    }
};

Spriteset_Map.prototype.createBalloon = function(request) {
    const targetSprite = this.findTargetSprite(request.target);
    if (targetSprite) {
        const sprite = new Sprite_Balloon();
        sprite.targetObject = request.target;
        sprite.setup(targetSprite, request.balloonId);
        this._effectsContainer.addChild(sprite);
        this._balloonSprites.push(sprite);
    }
};

Spriteset_Map.prototype.removeBalloon = function(sprite) {
    this._balloonSprites.remove(sprite);
    this._effectsContainer.removeChild(sprite);
    if (sprite.targetObject.endBalloon) {
        sprite.targetObject.endBalloon();
    }
    sprite.destroy();
};

Spriteset_Map.prototype.removeAllBalloons = function() {
    for (const sprite of this._balloonSprites.clone()) {
        this.removeBalloon(sprite);
    }
};

Spriteset_Map.prototype.findTargetSprite = function(target) {
    return this._characterSprites.find(sprite => sprite.checkCharacter(target));
};

Spriteset_Map.prototype.animationBaseDelay = function() {
    return 0;
};

//-----------------------------------------------------------------------------
// Spriteset_Battle
//
// The set of sprites on the battle screen.

function Spriteset_Battle() {
    this.initialize(...arguments);
}

Spriteset_Battle.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Battle.prototype.constructor = Spriteset_Battle;

Spriteset_Battle.prototype.initialize = function() {
    Spriteset_Base.prototype.initialize.call(this);
    this._battlebackLocated = false;
};

Spriteset_Battle.prototype.loadSystemImages = function() {
    Spriteset_Base.prototype.loadSystemImages.call(this);
    ImageManager.loadSystem("Shadow2");
    ImageManager.loadSystem("Weapons1");
    ImageManager.loadSystem("Weapons2");
    ImageManager.loadSystem("Weapons3");
};

Spriteset_Battle.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleback();
    this.createBattleField();
    this.createEnemies();
    this.createActors();
};

Spriteset_Battle.prototype.createBackground = function() {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this._baseSprite.addChild(this._backgroundSprite);
};

Spriteset_Battle.prototype.createBattleback = function() {
    this._back1Sprite = new Sprite_Battleback(0);
    this._back2Sprite = new Sprite_Battleback(1);
    this._baseSprite.addChild(this._back1Sprite);
    this._baseSprite.addChild(this._back2Sprite);
};

Spriteset_Battle.prototype.createBattleField = function() {
    const width = Graphics.boxWidth;
    const height = Graphics.boxHeight;
    const x = (Graphics.width - width) / 2;
    const y = (Graphics.height - height) / 2;
    this._battleField = new Sprite();
    this._battleField.setFrame(0, 0, width, height);
    this._battleField.x = x;
    this._battleField.y = y - this.battleFieldOffsetY();
    this._baseSprite.addChild(this._battleField);
    this._effectsContainer = this._battleField;
};

Spriteset_Battle.prototype.battleFieldOffsetY = function() {
    return 24;
};

Spriteset_Battle.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateActors();
    this.updateBattleback();
    this.updateAnimations();
};

Spriteset_Battle.prototype.updateBattleback = function() {
    if (!this._battlebackLocated) {
        this._back1Sprite.adjustPosition();
        this._back2Sprite.adjustPosition();
        this._battlebackLocated = true;
    }
};

Spriteset_Battle.prototype.createEnemies = function() {
    const enemies = $gameTroop.members();
    const sprites = [];
    for (const enemy of enemies) {
        sprites.push(new Sprite_Enemy(enemy));
    }
    sprites.sort(this.compareEnemySprite.bind(this));
    for (const sprite of sprites) {
        this._battleField.addChild(sprite);
    }
    this._enemySprites = sprites;
};

Spriteset_Battle.prototype.compareEnemySprite = function(a, b) {
    if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return b.spriteId - a.spriteId;
    }
};

Spriteset_Battle.prototype.createActors = function() {
    this._actorSprites = [];
    if ($gameSystem.isSideView()) {
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            const sprite = new Sprite_Actor();
            this._actorSprites.push(sprite);
            this._battleField.addChild(sprite);
        }
    }
};

Spriteset_Battle.prototype.updateActors = function() {
    const members = $gameParty.battleMembers();
    for (let i = 0; i < this._actorSprites.length; i++) {
        this._actorSprites[i].setBattler(members[i]);
    }
};

Spriteset_Battle.prototype.findTargetSprite = function(target) {
    return this.battlerSprites().find(sprite => sprite.checkBattler(target));
};

Spriteset_Battle.prototype.battlerSprites = function() {
    return this._enemySprites.concat(this._actorSprites);
};

Spriteset_Battle.prototype.isEffecting = function() {
    return this.battlerSprites().some(sprite => sprite.isEffecting());
};

Spriteset_Battle.prototype.isAnyoneMoving = function() {
    return this.battlerSprites().some(sprite => sprite.isMoving());
};

Spriteset_Battle.prototype.isBusy = function() {
    return this.isAnimationPlaying() || this.isAnyoneMoving();
};

//-----------------------------------------------------------------------------
