//=============================================================================
// rmmz_sprites.js v1.9.0
//=============================================================================

//-----------------------------------------------------------------------------
// Sprite_Clickable
//
// The sprite class with click handling functions.

function Sprite_Clickable() {
    this.initialize(...arguments);
}

Sprite_Clickable.prototype = Object.create(Sprite.prototype);
Sprite_Clickable.prototype.constructor = Sprite_Clickable;

Sprite_Clickable.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._pressed = false;
    this._hovered = false;
};

Sprite_Clickable.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.processTouch();
};

Sprite_Clickable.prototype.processTouch = function() {
    if (this.isClickEnabled()) {
        if (this.isBeingTouched()) {
            if (!this._hovered && TouchInput.isHovered()) {
                this._hovered = true;
                this.onMouseEnter();
            }
            if (TouchInput.isTriggered()) {
                this._pressed = true;
                this.onPress();
            }
        } else {
            if (this._hovered) {
                this.onMouseExit();
            }
            this._pressed = false;
            this._hovered = false;
        }
        if (this._pressed && TouchInput.isReleased()) {
            this._pressed = false;
            this.onClick();
        }
    } else {
        this._pressed = false;
        this._hovered = false;
    }
};

Sprite_Clickable.prototype.isPressed = function() {
    return this._pressed;
};

Sprite_Clickable.prototype.isClickEnabled = function() {
    return this.worldVisible;
};

Sprite_Clickable.prototype.isBeingTouched = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.hitTest(localPos.x, localPos.y);
};

Sprite_Clickable.prototype.hitTest = function(x, y) {
    const rect = new Rectangle(
        -this.anchor.x * this.width,
        -this.anchor.y * this.height,
        this.width,
        this.height
    );
    return rect.contains(x, y);
};

Sprite_Clickable.prototype.onMouseEnter = function() {
    //
};

Sprite_Clickable.prototype.onMouseExit = function() {
    //
};

Sprite_Clickable.prototype.onPress = function() {
    //
};

Sprite_Clickable.prototype.onClick = function() {
    //
};

//-----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.

function Sprite_Button() {
    this.initialize(...arguments);
}

Sprite_Button.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_Button.prototype.constructor = Sprite_Button;

Sprite_Button.prototype.initialize = function(buttonType) {
    Sprite_Clickable.prototype.initialize.call(this);
    this._buttonType = buttonType;
    this._clickHandler = null;
    this._coldFrame = null;
    this._hotFrame = null;
    this.setupFrames();
};

Sprite_Button.prototype.setupFrames = function() {
    const data = this.buttonData();
    const x = data.x * this.blockWidth();
    const width = data.w * this.blockWidth();
    const height = this.blockHeight();
    this.loadButtonImage();
    this.setColdFrame(x, 0, width, height);
    this.setHotFrame(x, height, width, height);
    this.updateFrame();
    this.updateOpacity();
};

Sprite_Button.prototype.blockWidth = function() {
    return 48;
};

Sprite_Button.prototype.blockHeight = function() {
    return 48;
};

Sprite_Button.prototype.loadButtonImage = function() {
    this.bitmap = ImageManager.loadSystem("ButtonSet");
};

Sprite_Button.prototype.buttonData = function() {
    const buttonTable = {
        cancel: { x: 0, w: 2 },
        pageup: { x: 2, w: 1 },
        pagedown: { x: 3, w: 1 },
        down: { x: 4, w: 1 },
        up: { x: 5, w: 1 },
        down2: { x: 6, w: 1 },
        up2: { x: 7, w: 1 },
        ok: { x: 8, w: 2 },
        menu: { x: 10, w: 1 }
    };
    return buttonTable[this._buttonType];
};

Sprite_Button.prototype.update = function() {
    Sprite_Clickable.prototype.update.call(this);
    this.checkBitmap();
    this.updateFrame();
    this.updateOpacity();
    this.processTouch();
};

Sprite_Button.prototype.checkBitmap = function() {
    if (this.bitmap.isReady() && this.bitmap.width < this.blockWidth() * 11) {
        // Probably MV image is used
        throw new Error("ButtonSet image is too small");
    }
};

Sprite_Button.prototype.updateFrame = function() {
    const frame = this.isPressed() ? this._hotFrame : this._coldFrame;
    if (frame) {
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};

Sprite_Button.prototype.updateOpacity = function() {
    this.opacity = this._pressed ? 255 : 192;
};

Sprite_Button.prototype.setColdFrame = function(x, y, width, height) {
    this._coldFrame = new Rectangle(x, y, width, height);
};

Sprite_Button.prototype.setHotFrame = function(x, y, width, height) {
    this._hotFrame = new Rectangle(x, y, width, height);
};

Sprite_Button.prototype.setClickHandler = function(method) {
    this._clickHandler = method;
};

Sprite_Button.prototype.onClick = function() {
    if (this._clickHandler) {
        this._clickHandler();
    } else {
        Input.virtualClick(this._buttonType);
    }
};

//-----------------------------------------------------------------------------
// Sprite_Character
//
// The sprite for displaying a character.

function Sprite_Character() {
    this.initialize(...arguments);
}

Sprite_Character.prototype = Object.create(Sprite.prototype);
Sprite_Character.prototype.constructor = Sprite_Character;

Sprite_Character.prototype.initialize = function(character) {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.setCharacter(character);
};

Sprite_Character.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._character = null;
    this._balloonDuration = 0;
    this._tilesetId = 0;
    this._upperBody = null;
    this._lowerBody = null;
};

Sprite_Character.prototype.setCharacter = function(character) {
    this._character = character;
};

Sprite_Character.prototype.checkCharacter = function(character) {
    return this._character === character;
};

Sprite_Character.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateOther();
    this.updateVisibility();
};

Sprite_Character.prototype.updateVisibility = function() {
    Sprite.prototype.updateVisibility.call(this);
    if (this.isEmptyCharacter() || this._character.isTransparent()) {
        this.visible = false;
    }
};

Sprite_Character.prototype.isTile = function() {
    return this._character.isTile();
};

Sprite_Character.prototype.isObjectCharacter = function() {
    return this._character.isObjectCharacter();
};

Sprite_Character.prototype.isEmptyCharacter = function() {
    return this._tileId === 0 && !this._characterName;
};

Sprite_Character.prototype.tilesetBitmap = function(tileId) {
    const tileset = $gameMap.tileset();
    const setNumber = 5 + Math.floor(tileId / 256);
    return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

Sprite_Character.prototype.updateBitmap = function() {
    if (this.isImageChanged()) {
        this._tilesetId = $gameMap.tilesetId();
        this._tileId = this._character.tileId();
        this._characterName = this._character.characterName();
        this._characterIndex = this._character.characterIndex();
        if (this._tileId > 0) {
            this.setTileBitmap();
        } else {
            this.setCharacterBitmap();
        }
    }
};

Sprite_Character.prototype.isImageChanged = function() {
    return (
        this._tilesetId !== $gameMap.tilesetId() ||
        this._tileId !== this._character.tileId() ||
        this._characterName !== this._character.characterName() ||
        this._characterIndex !== this._character.characterIndex()
    );
};

Sprite_Character.prototype.setTileBitmap = function() {
    this.bitmap = this.tilesetBitmap(this._tileId);
};

Sprite_Character.prototype.setCharacterBitmap = function() {
    this.bitmap = ImageManager.loadCharacter(this._characterName);
    this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

Sprite_Character.prototype.updateFrame = function() {
    if (this._tileId > 0) {
        this.updateTileFrame();
    } else {
        this.updateCharacterFrame();
    }
};

Sprite_Character.prototype.updateTileFrame = function() {
    const tileId = this._tileId;
    const pw = this.patternWidth();
    const ph = this.patternHeight();
    const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

Sprite_Character.prototype.updateCharacterFrame = function() {
    const pw = this.patternWidth();
    const ph = this.patternHeight();
    const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
    this.updateHalfBodySprites();
    if (this._bushDepth > 0) {
        const d = this._bushDepth;
        this._upperBody.setFrame(sx, sy, pw, ph - d);
        this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
        this.setFrame(sx, sy, 0, ph);
    } else {
        this.setFrame(sx, sy, pw, ph);
    }
};

Sprite_Character.prototype.characterBlockX = function() {
    if (this._isBigCharacter) {
        return 0;
    } else {
        const index = this._character.characterIndex();
        return (index % 4) * 3;
    }
};

Sprite_Character.prototype.characterBlockY = function() {
    if (this._isBigCharacter) {
        return 0;
    } else {
        const index = this._character.characterIndex();
        return Math.floor(index / 4) * 4;
    }
};

Sprite_Character.prototype.characterPatternX = function() {
    return this._character.pattern();
};

Sprite_Character.prototype.characterPatternY = function() {
    return (this._character.direction() - 2) / 2;
};

Sprite_Character.prototype.patternWidth = function() {
    if (this._tileId > 0) {
        return $gameMap.tileWidth();
    } else if (this._isBigCharacter) {
        return this.bitmap.width / 3;
    } else {
        return this.bitmap.width / 12;
    }
};

Sprite_Character.prototype.patternHeight = function() {
    if (this._tileId > 0) {
        return $gameMap.tileHeight();
    } else if (this._isBigCharacter) {
        return this.bitmap.height / 4;
    } else {
        return this.bitmap.height / 8;
    }
};

Sprite_Character.prototype.updateHalfBodySprites = function() {
    if (this._bushDepth > 0) {
        this.createHalfBodySprites();
        this._upperBody.bitmap = this.bitmap;
        this._upperBody.visible = true;
        this._upperBody.y = -this._bushDepth;
        this._lowerBody.bitmap = this.bitmap;
        this._lowerBody.visible = true;
        this._upperBody.setBlendColor(this.getBlendColor());
        this._lowerBody.setBlendColor(this.getBlendColor());
        this._upperBody.setColorTone(this.getColorTone());
        this._lowerBody.setColorTone(this.getColorTone());
        this._upperBody.blendMode = this.blendMode;
        this._lowerBody.blendMode = this.blendMode;
    } else if (this._upperBody) {
        this._upperBody.visible = false;
        this._lowerBody.visible = false;
    }
};

Sprite_Character.prototype.createHalfBodySprites = function() {
    if (!this._upperBody) {
        this._upperBody = new Sprite();
        this._upperBody.anchor.x = 0.5;
        this._upperBody.anchor.y = 1;
        this.addChild(this._upperBody);
    }
    if (!this._lowerBody) {
        this._lowerBody = new Sprite();
        this._lowerBody.anchor.x = 0.5;
        this._lowerBody.anchor.y = 1;
        this._lowerBody.opacity = 128;
        this.addChild(this._lowerBody);
    }
};

Sprite_Character.prototype.updatePosition = function() {
    this.x = this._character.screenX();
    this.y = this._character.screenY();
    this.z = this._character.screenZ();
};

Sprite_Character.prototype.updateOther = function() {
    this.opacity = this._character.opacity();
    this.blendMode = this._character.blendMode();
    this._bushDepth = this._character.bushDepth();
};

//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.

function Sprite_Battler() {
    this.initialize(...arguments);
}

Sprite_Battler.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_Battler.prototype.constructor = Sprite_Battler;

Sprite_Battler.prototype.initialize = function(battler) {
    Sprite_Clickable.prototype.initialize.call(this);
    this.initMembers();
    this.setBattler(battler);
};

Sprite_Battler.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._battler = null;
    this._damages = [];
    this._homeX = 0;
    this._homeY = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._targetOffsetX = NaN;
    this._targetOffsetY = NaN;
    this._movementDuration = 0;
    this._selectionEffectCount = 0;
};

Sprite_Battler.prototype.setBattler = function(battler) {
    this._battler = battler;
};

Sprite_Battler.prototype.checkBattler = function(battler) {
    return this._battler === battler;
};

Sprite_Battler.prototype.mainSprite = function() {
    return this;
};

Sprite_Battler.prototype.setHome = function(x, y) {
    this._homeX = x;
    this._homeY = y;
    this.updatePosition();
};

Sprite_Battler.prototype.update = function() {
    Sprite_Clickable.prototype.update.call(this);
    if (this._battler) {
        this.updateMain();
        this.updateDamagePopup();
        this.updateSelectionEffect();
        this.updateVisibility();
    } else {
        this.bitmap = null;
    }
};

Sprite_Battler.prototype.updateVisibility = function() {
    Sprite_Clickable.prototype.updateVisibility.call(this);
    if (!this._battler || !this._battler.isSpriteVisible()) {
        this.visible = false;
    }
};

Sprite_Battler.prototype.updateMain = function() {
    if (this._battler.isSpriteVisible()) {
        this.updateBitmap();
        this.updateFrame();
    }
    this.updateMove();
    this.updatePosition();
};

Sprite_Battler.prototype.updateBitmap = function() {
    //
};

Sprite_Battler.prototype.updateFrame = function() {
    //
};

Sprite_Battler.prototype.updateMove = function() {
    if (this._movementDuration > 0) {
        const d = this._movementDuration;
        this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
        this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
        this._movementDuration--;
        if (this._movementDuration === 0) {
            this.onMoveEnd();
        }
    }
};

Sprite_Battler.prototype.updatePosition = function() {
    this.x = this._homeX + this._offsetX;
    this.y = this._homeY + this._offsetY;
};

Sprite_Battler.prototype.updateDamagePopup = function() {
    this.setupDamagePopup();
    if (this._damages.length > 0) {
        for (const damage of this._damages) {
            damage.update();
        }
        if (!this._damages[0].isPlaying()) {
            this.destroyDamageSprite(this._damages[0]);
        }
    }
};

Sprite_Battler.prototype.updateSelectionEffect = function() {
    const target = this.mainSprite();
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 30 < 15) {
            target.setBlendColor([255, 255, 255, 64]);
        } else {
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    }
};

Sprite_Battler.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            this.createDamageSprite();
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
};

Sprite_Battler.prototype.createDamageSprite = function() {
    const last = this._damages[this._damages.length - 1];
    const sprite = new Sprite_Damage();
    if (last) {
        sprite.x = last.x + 8;
        sprite.y = last.y - 16;
    } else {
        sprite.x = this.x + this.damageOffsetX();
        sprite.y = this.y + this.damageOffsetY();
    }
    sprite.setup(this._battler);
    this._damages.push(sprite);
    this.parent.addChild(sprite);
};

Sprite_Battler.prototype.destroyDamageSprite = function(sprite) {
    this.parent.removeChild(sprite);
    this._damages.remove(sprite);
    sprite.destroy();
};

Sprite_Battler.prototype.damageOffsetX = function() {
    return 0;
};

Sprite_Battler.prototype.damageOffsetY = function() {
    return 0;
};

Sprite_Battler.prototype.startMove = function(x, y, duration) {
    if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
        this._targetOffsetX = x;
        this._targetOffsetY = y;
        this._movementDuration = duration;
        if (duration === 0) {
            this._offsetX = x;
            this._offsetY = y;
        }
    }
};

Sprite_Battler.prototype.onMoveEnd = function() {
    //
};

Sprite_Battler.prototype.isEffecting = function() {
    return false;
};

Sprite_Battler.prototype.isMoving = function() {
    return this._movementDuration > 0;
};

Sprite_Battler.prototype.inHomePosition = function() {
    return this._offsetX === 0 && this._offsetY === 0;
};

Sprite_Battler.prototype.onMouseEnter = function() {
    $gameTemp.setTouchState(this._battler, "select");
};

Sprite_Battler.prototype.onPress = function() {
    $gameTemp.setTouchState(this._battler, "select");
};

Sprite_Battler.prototype.onClick = function() {
    $gameTemp.setTouchState(this._battler, "click");
};

//-----------------------------------------------------------------------------
// Sprite_Actor
//
// The sprite for displaying an actor.

function Sprite_Actor() {
    this.initialize(...arguments);
}

Sprite_Actor.prototype = Object.create(Sprite_Battler.prototype);
Sprite_Actor.prototype.constructor = Sprite_Actor;

Sprite_Actor.MOTIONS = {
    walk: { index: 0, loop: true },
    wait: { index: 1, loop: true },
    chant: { index: 2, loop: true },
    guard: { index: 3, loop: true },
    damage: { index: 4, loop: false },
    evade: { index: 5, loop: false },
    thrust: { index: 6, loop: false },
    swing: { index: 7, loop: false },
    missile: { index: 8, loop: false },
    skill: { index: 9, loop: false },
    spell: { index: 10, loop: false },
    item: { index: 11, loop: false },
    escape: { index: 12, loop: true },
    victory: { index: 13, loop: true },
    dying: { index: 14, loop: true },
    abnormal: { index: 15, loop: true },
    sleep: { index: 16, loop: true },
    dead: { index: 17, loop: true }
};

Sprite_Actor.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
    this.moveToStartPosition();
};

Sprite_Actor.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._battlerName = "";
    this._motion = null;
    this._motionCount = 0;
    this._pattern = 0;
    this.createShadowSprite();
    this.createWeaponSprite();
    this.createMainSprite();
    this.createStateSprite();
};

Sprite_Actor.prototype.mainSprite = function() {
    return this._mainSprite;
};

Sprite_Actor.prototype.createMainSprite = function() {
    this._mainSprite = new Sprite();
    this._mainSprite.anchor.x = 0.5;
    this._mainSprite.anchor.y = 1;
    this.addChild(this._mainSprite);
};

Sprite_Actor.prototype.createShadowSprite = function() {
    this._shadowSprite = new Sprite();
    this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow2");
    this._shadowSprite.anchor.x = 0.5;
    this._shadowSprite.anchor.y = 0.5;
    this._shadowSprite.y = -2;
    this.addChild(this._shadowSprite);
};

Sprite_Actor.prototype.createWeaponSprite = function() {
    this._weaponSprite = new Sprite_Weapon();
    this.addChild(this._weaponSprite);
};

Sprite_Actor.prototype.createStateSprite = function() {
    this._stateSprite = new Sprite_StateOverlay();
    this.addChild(this._stateSprite);
};

Sprite_Actor.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    if (battler !== this._actor) {
        this._actor = battler;
        if (battler) {
            this.setActorHome(battler.index());
        } else {
            this._mainSprite.bitmap = null;
            this._battlerName = "";
        }
        this.startEntryMotion();
        this._stateSprite.setup(battler);
    }
};

Sprite_Actor.prototype.moveToStartPosition = function() {
    this.startMove(300, 0, 0);
};

Sprite_Actor.prototype.setActorHome = function(index) {
    this.setHome(600 + index * 32, 280 + index * 48);
};

Sprite_Actor.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
    this.updateShadow();
    if (this._actor) {
        this.updateMotion();
    }
};

Sprite_Actor.prototype.updateShadow = function() {
    this._shadowSprite.visible = !!this._actor;
};

Sprite_Actor.prototype.updateMain = function() {
    Sprite_Battler.prototype.updateMain.call(this);
    if (this._actor.isSpriteVisible() && !this.isMoving()) {
        this.updateTargetPosition();
    }
};

Sprite_Actor.prototype.setupMotion = function() {
    if (this._actor.isMotionRequested()) {
        this.startMotion(this._actor.motionType());
        this._actor.clearMotion();
    }
};

Sprite_Actor.prototype.setupWeaponAnimation = function() {
    if (this._actor.isWeaponAnimationRequested()) {
        this._weaponSprite.setup(this._actor.weaponImageId());
        this._actor.clearWeaponAnimation();
    }
};

Sprite_Actor.prototype.startMotion = function(motionType) {
    const newMotion = Sprite_Actor.MOTIONS[motionType];
    if (this._motion !== newMotion) {
        this._motion = newMotion;
        this._motionCount = 0;
        this._pattern = 0;
    }
};

Sprite_Actor.prototype.updateTargetPosition = function() {
    if (this._actor.canMove() && BattleManager.isEscaped()) {
        this.retreat();
    } else if (this.shouldStepForward()) {
        this.stepForward();
    } else if (!this.inHomePosition()) {
        this.stepBack();
    }
};

Sprite_Actor.prototype.shouldStepForward = function() {
    return this._actor.isInputting() || this._actor.isActing();
};

Sprite_Actor.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    const name = this._actor.battlerName();
    if (this._battlerName !== name) {
        this._battlerName = name;
        this._mainSprite.bitmap = ImageManager.loadSvActor(name);
    }
};

Sprite_Actor.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    const bitmap = this._mainSprite.bitmap;
    if (bitmap) {
        const motionIndex = this._motion ? this._motion.index : 0;
        const pattern = this._pattern < 3 ? this._pattern : 1;
        const cw = bitmap.width / 9;
        const ch = bitmap.height / 6;
        const cx = Math.floor(motionIndex / 6) * 3 + pattern;
        const cy = motionIndex % 6;
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
        this.setFrame(0, 0, cw, ch);
    }
};

Sprite_Actor.prototype.updateMove = function() {
    const bitmap = this._mainSprite.bitmap;
    if (!bitmap || bitmap.isReady()) {
        Sprite_Battler.prototype.updateMove.call(this);
    }
};

Sprite_Actor.prototype.updateMotion = function() {
    this.setupMotion();
    this.setupWeaponAnimation();
    if (this._actor.isMotionRefreshRequested()) {
        this.refreshMotion();
        this._actor.clearMotion();
    }
    this.updateMotionCount();
};

Sprite_Actor.prototype.updateMotionCount = function() {
    if (this._motion && ++this._motionCount >= this.motionSpeed()) {
        if (this._motion.loop) {
            this._pattern = (this._pattern + 1) % 4;
        } else if (this._pattern < 2) {
            this._pattern++;
        } else {
            this.refreshMotion();
        }
        this._motionCount = 0;
    }
};

Sprite_Actor.prototype.motionSpeed = function() {
    return 12;
};

Sprite_Actor.prototype.refreshMotion = function() {
    const actor = this._actor;
    if (actor) {
        const stateMotion = actor.stateMotionIndex();
        if (actor.isInputting() || actor.isActing()) {
            this.startMotion("walk");
        } else if (stateMotion === 3) {
            this.startMotion("dead");
        } else if (stateMotion === 2) {
            this.startMotion("sleep");
        } else if (actor.isChanting()) {
            this.startMotion("chant");
        } else if (actor.isGuard() || actor.isGuardWaiting()) {
            this.startMotion("guard");
        } else if (stateMotion === 1) {
            this.startMotion("abnormal");
        } else if (actor.isDying()) {
            this.startMotion("dying");
        } else if (actor.isUndecided()) {
            this.startMotion("walk");
        } else {
            this.startMotion("wait");
        }
    }
};

Sprite_Actor.prototype.startEntryMotion = function() {
    if (this._actor && this._actor.canMove()) {
        this.startMotion("walk");
        this.startMove(0, 0, 30);
    } else if (!this.isMoving()) {
        this.refreshMotion();
        this.startMove(0, 0, 0);
    }
};

Sprite_Actor.prototype.stepForward = function() {
    this.startMove(-48, 0, 12);
};

Sprite_Actor.prototype.stepBack = function() {
    this.startMove(0, 0, 12);
};

Sprite_Actor.prototype.retreat = function() {
    this.startMove(300, 0, 30);
};

Sprite_Actor.prototype.onMoveEnd = function() {
    Sprite_Battler.prototype.onMoveEnd.call(this);
    if (!BattleManager.isBattleEnd()) {
        this.refreshMotion();
    }
};

Sprite_Actor.prototype.damageOffsetX = function() {
    return Sprite_Battler.prototype.damageOffsetX.call(this) - 32;
};

Sprite_Actor.prototype.damageOffsetY = function() {
    return Sprite_Battler.prototype.damageOffsetY.call(this);
};

//-----------------------------------------------------------------------------
// Sprite_Enemy
//
// The sprite for displaying an enemy.

function Sprite_Enemy() {
    this.initialize(...arguments);
}

Sprite_Enemy.prototype = Object.create(Sprite_Battler.prototype);
Sprite_Enemy.prototype.constructor = Sprite_Enemy;

Sprite_Enemy.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
};

Sprite_Enemy.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._enemy = null;
    this._appeared = false;
    this._battlerName = null;
    this._battlerHue = 0;
    this._effectType = null;
    this._effectDuration = 0;
    this._shake = 0;
    this.createStateIconSprite();
};

Sprite_Enemy.prototype.createStateIconSprite = function() {
    this._stateIconSprite = new Sprite_StateIcon();
    this.addChild(this._stateIconSprite);
};

Sprite_Enemy.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.setHome(battler.screenX(), battler.screenY());
    this._stateIconSprite.setup(battler);
};

Sprite_Enemy.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
    if (this._enemy) {
        this.updateEffect();
        this.updateStateSprite();
    }
};

Sprite_Enemy.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    const name = this._enemy.battlerName();
    const hue = this._enemy.battlerHue();
    if (this._battlerName !== name || this._battlerHue !== hue) {
        this._battlerName = name;
        this._battlerHue = hue;
        this.loadBitmap(name);
        this.setHue(hue);
        this.initVisibility();
    }
};

Sprite_Enemy.prototype.loadBitmap = function(name) {
    if ($gameSystem.isSideView()) {
        this.bitmap = ImageManager.loadSvEnemy(name);
    } else {
        this.bitmap = ImageManager.loadEnemy(name);
    }
};

Sprite_Enemy.prototype.setHue = function(hue) {
    Sprite_Battler.prototype.setHue.call(this, hue);
    for (const child of this.children) {
        if (child.setHue) {
            child.setHue(-hue);
        }
    }
};

Sprite_Enemy.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    if (this._effectType === "bossCollapse") {
        this.setFrame(0, 0, this.bitmap.width, this._effectDuration);
    } else {
        this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
    }
};

Sprite_Enemy.prototype.updatePosition = function() {
    Sprite_Battler.prototype.updatePosition.call(this);
    this.x += this._shake;
};

Sprite_Enemy.prototype.updateStateSprite = function() {
    this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
    if (this._stateIconSprite.y < 20 - this.y) {
        this._stateIconSprite.y = 20 - this.y;
    }
};

Sprite_Enemy.prototype.initVisibility = function() {
    this._appeared = this._enemy.isAlive();
    if (!this._appeared) {
        this.opacity = 0;
    }
};

Sprite_Enemy.prototype.setupEffect = function() {
    if (this._appeared && this._enemy.isEffectRequested()) {
        this.startEffect(this._enemy.effectType());
        this._enemy.clearEffect();
    }
    if (!this._appeared && this._enemy.isAlive()) {
        this.startEffect("appear");
    } else if (this._appeared && this._enemy.isHidden()) {
        this.startEffect("disappear");
    }
};

Sprite_Enemy.prototype.startEffect = function(effectType) {
    this._effectType = effectType;
    switch (this._effectType) {
        case "appear":
            this.startAppear();
            break;
        case "disappear":
            this.startDisappear();
            break;
        case "whiten":
            this.startWhiten();
            break;
        case "blink":
            this.startBlink();
            break;
        case "collapse":
            this.startCollapse();
            break;
        case "bossCollapse":
            this.startBossCollapse();
            break;
        case "instantCollapse":
            this.startInstantCollapse();
            break;
    }
    this.revertToNormal();
};

Sprite_Enemy.prototype.startAppear = function() {
    this._effectDuration = 16;
    this._appeared = true;
};

Sprite_Enemy.prototype.startDisappear = function() {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_Enemy.prototype.startWhiten = function() {
    this._effectDuration = 16;
};

Sprite_Enemy.prototype.startBlink = function() {
    this._effectDuration = 20;
};

Sprite_Enemy.prototype.startCollapse = function() {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_Enemy.prototype.startBossCollapse = function() {
    this._effectDuration = this.bitmap.height;
    this._appeared = false;
};

Sprite_Enemy.prototype.startInstantCollapse = function() {
    this._effectDuration = 16;
    this._appeared = false;
};

Sprite_Enemy.prototype.updateEffect = function() {
    this.setupEffect();
    if (this._effectDuration > 0) {
        this._effectDuration--;
        switch (this._effectType) {
            case "whiten":
                this.updateWhiten();
                break;
            case "blink":
                this.updateBlink();
                break;
            case "appear":
                this.updateAppear();
                break;
            case "disappear":
                this.updateDisappear();
                break;
            case "collapse":
                this.updateCollapse();
                break;
            case "bossCollapse":
                this.updateBossCollapse();
                break;
            case "instantCollapse":
                this.updateInstantCollapse();
                break;
        }
        if (this._effectDuration === 0) {
            this._effectType = null;
        }
    }
};

Sprite_Enemy.prototype.isEffecting = function() {
    return this._effectType !== null;
};

Sprite_Enemy.prototype.revertToNormal = function() {
    this._shake = 0;
    this.blendMode = 0;
    this.opacity = 255;
    this.setBlendColor([0, 0, 0, 0]);
};

Sprite_Enemy.prototype.updateWhiten = function() {
    const alpha = 128 - (16 - this._effectDuration) * 8;
    this.setBlendColor([255, 255, 255, alpha]);
};

Sprite_Enemy.prototype.updateBlink = function() {
    this.opacity = this._effectDuration % 10 < 5 ? 255 : 0;
};

Sprite_Enemy.prototype.updateAppear = function() {
    this.opacity = (16 - this._effectDuration) * 16;
};

Sprite_Enemy.prototype.updateDisappear = function() {
    this.opacity = 256 - (32 - this._effectDuration) * 10;
};

Sprite_Enemy.prototype.updateCollapse = function() {
    this.blendMode = 1;
    this.setBlendColor([255, 128, 128, 128]);
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
};

Sprite_Enemy.prototype.updateBossCollapse = function() {
    this._shake = (this._effectDuration % 2) * 4 - 2;
    this.blendMode = 1;
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
    this.setBlendColor([255, 255, 255, 255 - this.opacity]);
    if (this._effectDuration % 20 === 19) {
        SoundManager.playBossCollapse2();
    }
};

Sprite_Enemy.prototype.updateInstantCollapse = function() {
    this.opacity = 0;
};

Sprite_Enemy.prototype.damageOffsetX = function() {
    return Sprite_Battler.prototype.damageOffsetX.call(this);
};

Sprite_Enemy.prototype.damageOffsetY = function() {
    return Sprite_Battler.prototype.damageOffsetY.call(this) - 8;
};

//-----------------------------------------------------------------------------
// Sprite_Animation
//
// The sprite for displaying an animation.

function Sprite_Animation() {
    this.initialize(...arguments);
}

Sprite_Animation.prototype = Object.create(Sprite.prototype);
Sprite_Animation.prototype.constructor = Sprite_Animation;

Sprite_Animation.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

Sprite_Animation.prototype.initMembers = function() {
    this._targets = [];
    this._animation = null;
    this._mirror = false;
    this._delay = 0;
    this._previous = null;
    this._effect = null;
    this._handle = null;
    this._playing = false;
    this._started = false;
    this._frameIndex = 0;
    this._maxTimingFrames = 0;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._viewportSize = 4096;
    this.z = 8;
};

Sprite_Animation.prototype.destroy = function(options) {
    Sprite.prototype.destroy.call(this, options);
    if (this._handle) {
        this._handle.stop();
    }
    this._effect = null;
    this._handle = null;
    this._playing = false;
    this._started = false;
};

// prettier-ignore
Sprite_Animation.prototype.setup = function(
    targets, animation, mirror, delay, previous
) {
    this._targets = targets;
    this._animation = animation;
    this._mirror = mirror;
    this._delay = delay;
    this._previous = previous;
    this._effect = EffectManager.load(animation.effectName);
    this._playing = true;
    const timings = animation.soundTimings.concat(animation.flashTimings);
    for (const timing of timings) {
        if (timing.frame > this._maxTimingFrames) {
            this._maxTimingFrames = timing.frame;
        }
    }
};

Sprite_Animation.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._delay > 0) {
        this._delay--;
    } else if (this._playing) {
        if (!this._started && this.canStart()) {
            if (this._effect) {
                if (this._effect.isLoaded) {
                    this._handle = Graphics.effekseer.play(this._effect);
                    this._started = true;
                } else {
                    EffectManager.checkErrors();
                }
            } else {
                this._started = true;
            }
        }
        if (this._started) {
            this.updateEffectGeometry();
            this.updateMain();
            this.updateFlash();
        }
    }
};

Sprite_Animation.prototype.canStart = function() {
    if (this._previous && this.shouldWaitForPrevious()) {
        return !this._previous.isPlaying();
    } else {
        return true;
    }
};

Sprite_Animation.prototype.shouldWaitForPrevious = function() {
    // [Note] Older versions of Effekseer were very heavy on some mobile
    //   devices. We don't need this anymore.
    return false;
};

Sprite_Animation.prototype.updateEffectGeometry = function() {
    const scale = this._animation.scale / 100;
    const r = Math.PI / 180;
    const rx = this._animation.rotation.x * r;
    const ry = this._animation.rotation.y * r;
    const rz = this._animation.rotation.z * r;
    if (this._handle) {
        this._handle.setLocation(0, 0, 0);
        this._handle.setRotation(rx, ry, rz);
        this._handle.setScale(scale, scale, scale);
        this._handle.setSpeed(this._animation.speed / 100);
    }
};

Sprite_Animation.prototype.updateMain = function() {
    this.processSoundTimings();
    this.processFlashTimings();
    this._frameIndex++;
    this.checkEnd();
};

Sprite_Animation.prototype.processSoundTimings = function() {
    for (const timing of this._animation.soundTimings) {
        if (timing.frame === this._frameIndex) {
            AudioManager.playSe(timing.se);
        }
    }
};

Sprite_Animation.prototype.processFlashTimings = function() {
    for (const timing of this._animation.flashTimings) {
        if (timing.frame === this._frameIndex) {
            this._flashColor = timing.color.clone();
            this._flashDuration = timing.duration;
        }
    }
};

Sprite_Animation.prototype.checkEnd = function() {
    if (
        this._frameIndex > this._maxTimingFrames &&
        this._flashDuration === 0 &&
        !(this._handle && this._handle.exists)
    ) {
        this._playing = false;
    }
};

Sprite_Animation.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        const d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
        for (const target of this._targets) {
            target.setBlendColor(this._flashColor);
        }
    }
};

Sprite_Animation.prototype.isPlaying = function() {
    return this._playing;
};

Sprite_Animation.prototype.setRotation = function(x, y, z) {
    if (this._handle) {
        this._handle.setRotation(x, y, z);
    }
};

Sprite_Animation.prototype._render = function(renderer) {
    if (this._targets.length > 0 && this._handle && this._handle.exists) {
        this.onBeforeRender(renderer);
        this.setProjectionMatrix(renderer);
        this.setCameraMatrix(renderer);
        this.setViewport(renderer);
        Graphics.effekseer.beginDraw();
        Graphics.effekseer.drawHandle(this._handle);
        Graphics.effekseer.endDraw();
        this.resetViewport(renderer);
        this.onAfterRender(renderer);
    }
};

Sprite_Animation.prototype.setProjectionMatrix = function(renderer) {
    const x = this._mirror ? -1 : 1;
    const y = -1;
    const p = -(this._viewportSize / renderer.view.height);
    // prettier-ignore
    Graphics.effekseer.setProjectionMatrix([
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, 1, p,
        0, 0, 0, 1,
    ]);
};

Sprite_Animation.prototype.setCameraMatrix = function(/*renderer*/) {
    // prettier-ignore
    Graphics.effekseer.setCameraMatrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -10, 1
    ]);
};

Sprite_Animation.prototype.setViewport = function(renderer) {
    const vw = this._viewportSize;
    const vh = this._viewportSize;
    const vx = this._animation.offsetX - vw / 2;
    const vy = this._animation.offsetY - vh / 2;
    const pos = this.targetPosition(renderer);
    renderer.gl.viewport(vx + pos.x, vy + pos.y, vw, vh);
};

Sprite_Animation.prototype.targetPosition = function(renderer) {
    const pos = new Point();
    if (this._animation.displayType === 2) {
        pos.x = renderer.view.width / 2;
        pos.y = renderer.view.height / 2;
    } else {
        for (const target of this._targets) {
            const tpos = this.targetSpritePosition(target);
            pos.x += tpos.x;
            pos.y += tpos.y;
        }
        pos.x /= this._targets.length;
        pos.y /= this._targets.length;
    }
    return pos;
};

Sprite_Animation.prototype.targetSpritePosition = function(sprite) {
    const point = new Point(0, -sprite.height / 2);
    if (this._animation.alignBottom) {
        point.y = 0;
    }
    sprite.updateTransform();
    return sprite.worldTransform.apply(point);
};

Sprite_Animation.prototype.resetViewport = function(renderer) {
    renderer.gl.viewport(0, 0, renderer.view.width, renderer.view.height);
};

Sprite_Animation.prototype.onBeforeRender = function(renderer) {
    renderer.batch.flush();
    renderer.geometry.reset();
};

Sprite_Animation.prototype.onAfterRender = function(renderer) {
    renderer.texture.reset();
    renderer.geometry.reset();
    renderer.state.reset();
    renderer.shader.reset();
    renderer.framebuffer.reset();
};

//-----------------------------------------------------------------------------
// Sprite_AnimationMV
//
// The sprite for displaying an old format animation.

function Sprite_AnimationMV() {
    this.initialize(...arguments);
}

Sprite_AnimationMV.prototype = Object.create(Sprite.prototype);
Sprite_AnimationMV.prototype.constructor = Sprite_AnimationMV;

Sprite_AnimationMV.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

Sprite_AnimationMV.prototype.initMembers = function() {
    this._targets = [];
    this._animation = null;
    this._mirror = false;
    this._delay = 0;
    this._rate = 4;
    this._duration = 0;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._screenFlashDuration = 0;
    this._hidingDuration = 0;
    this._hue1 = 0;
    this._hue2 = 0;
    this._bitmap1 = null;
    this._bitmap2 = null;
    this._cellSprites = [];
    this._screenFlashSprite = null;
    this.z = 8;
};

// prettier-ignore
Sprite_AnimationMV.prototype.setup = function(
    targets, animation, mirror, delay
) {
    this._targets = targets;
    this._animation = animation;
    this._mirror = mirror;
    this._delay = delay;
    if (this._animation) {
        this.setupRate();
        this.setupDuration();
        this.loadBitmaps();
        this.createCellSprites();
        this.createScreenFlashSprite();
    }
};

Sprite_AnimationMV.prototype.setupRate = function() {
    this._rate = 4;
};

Sprite_AnimationMV.prototype.setupDuration = function() {
    this._duration = this._animation.frames.length * this._rate + 1;
};

Sprite_AnimationMV.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateMain();
    this.updateFlash();
    this.updateScreenFlash();
    this.updateHiding();
};

Sprite_AnimationMV.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        const d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
        for (const target of this._targets) {
            target.setBlendColor(this._flashColor);
        }
    }
};

Sprite_AnimationMV.prototype.updateScreenFlash = function() {
    if (this._screenFlashDuration > 0) {
        const d = this._screenFlashDuration--;
        if (this._screenFlashSprite) {
            this._screenFlashSprite.x = -this.absoluteX();
            this._screenFlashSprite.y = -this.absoluteY();
            this._screenFlashSprite.opacity *= (d - 1) / d;
            this._screenFlashSprite.visible = this._screenFlashDuration > 0;
        }
    }
};

Sprite_AnimationMV.prototype.absoluteX = function() {
    let x = 0;
    let object = this;
    while (object) {
        x += object.x;
        object = object.parent;
    }
    return x;
};

Sprite_AnimationMV.prototype.absoluteY = function() {
    let y = 0;
    let object = this;
    while (object) {
        y += object.y;
        object = object.parent;
    }
    return y;
};

Sprite_AnimationMV.prototype.updateHiding = function() {
    if (this._hidingDuration > 0) {
        this._hidingDuration--;
        if (this._hidingDuration === 0) {
            for (const target of this._targets) {
                target.show();
            }
        }
    }
};

Sprite_AnimationMV.prototype.isPlaying = function() {
    return this._duration > 0;
};

Sprite_AnimationMV.prototype.loadBitmaps = function() {
    const name1 = this._animation.animation1Name;
    const name2 = this._animation.animation2Name;
    this._hue1 = this._animation.animation1Hue;
    this._hue2 = this._animation.animation2Hue;
    this._bitmap1 = ImageManager.loadAnimation(name1);
    this._bitmap2 = ImageManager.loadAnimation(name2);
};

Sprite_AnimationMV.prototype.isReady = function() {
    return (
        this._bitmap1 &&
        this._bitmap1.isReady() &&
        this._bitmap2 &&
        this._bitmap2.isReady()
    );
};

Sprite_AnimationMV.prototype.createCellSprites = function() {
    this._cellSprites = [];
    for (let i = 0; i < 16; i++) {
        const sprite = new Sprite();
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        this._cellSprites.push(sprite);
        this.addChild(sprite);
    }
};

Sprite_AnimationMV.prototype.createScreenFlashSprite = function() {
    this._screenFlashSprite = new ScreenSprite();
    this.addChild(this._screenFlashSprite);
};

Sprite_AnimationMV.prototype.updateMain = function() {
    if (this.isPlaying() && this.isReady()) {
        if (this._delay > 0) {
            this._delay--;
        } else {
            this._duration--;
            this.updatePosition();
            if (this._duration % this._rate === 0) {
                this.updateFrame();
            }
            if (this._duration <= 0) {
                this.onEnd();
            }
        }
    }
};

Sprite_AnimationMV.prototype.updatePosition = function() {
    if (this._animation.position === 3) {
        this.x = this.parent.width / 2;
        this.y = this.parent.height / 2;
    } else if (this._targets.length > 0) {
        const target = this._targets[0];
        const parent = target.parent;
        const grandparent = parent ? parent.parent : null;
        this.x = target.x;
        this.y = target.y;
        if (this.parent === grandparent) {
            this.x += parent.x;
            this.y += parent.y;
        }
        if (this._animation.position === 0) {
            this.y -= target.height;
        } else if (this._animation.position === 1) {
            this.y -= target.height / 2;
        }
    }
};

Sprite_AnimationMV.prototype.updateFrame = function() {
    if (this._duration > 0) {
        const frameIndex = this.currentFrameIndex();
        this.updateAllCellSprites(this._animation.frames[frameIndex]);
        for (const timing of this._animation.timings) {
            if (timing.frame === frameIndex) {
                this.processTimingData(timing);
            }
        }
    }
};

Sprite_AnimationMV.prototype.currentFrameIndex = function() {
    return (
        this._animation.frames.length -
        Math.floor((this._duration + this._rate - 1) / this._rate)
    );
};

Sprite_AnimationMV.prototype.updateAllCellSprites = function(frame) {
    if (this._targets.length > 0) {
        for (let i = 0; i < this._cellSprites.length; i++) {
            const sprite = this._cellSprites[i];
            if (i < frame.length) {
                this.updateCellSprite(sprite, frame[i]);
            } else {
                sprite.visible = false;
            }
        }
    }
};

Sprite_AnimationMV.prototype.updateCellSprite = function(sprite, cell) {
    const pattern = cell[0];
    if (pattern >= 0) {
        const sx = (pattern % 5) * 192;
        const sy = Math.floor((pattern % 100) / 5) * 192;
        const mirror = this._mirror;
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        sprite.setHue(pattern < 100 ? this._hue1 : this._hue2);
        sprite.setFrame(sx, sy, 192, 192);
        sprite.x = cell[1];
        sprite.y = cell[2];
        sprite.rotation = (cell[4] * Math.PI) / 180;
        sprite.scale.x = cell[3] / 100;

        if (cell[5]) {
            sprite.scale.x *= -1;
        }
        if (mirror) {
            sprite.x *= -1;
            sprite.rotation *= -1;
            sprite.scale.x *= -1;
        }

        sprite.scale.y = cell[3] / 100;
        sprite.opacity = cell[6];
        sprite.blendMode = cell[7];
        sprite.visible = true;
    } else {
        sprite.visible = false;
    }
};

Sprite_AnimationMV.prototype.processTimingData = function(timing) {
    const duration = timing.flashDuration * this._rate;
    switch (timing.flashScope) {
        case 1:
            this.startFlash(timing.flashColor, duration);
            break;
        case 2:
            this.startScreenFlash(timing.flashColor, duration);
            break;
        case 3:
            this.startHiding(duration);
            break;
    }
    if (timing.se) {
        AudioManager.playSe(timing.se);
    }
};

Sprite_AnimationMV.prototype.startFlash = function(color, duration) {
    this._flashColor = color.clone();
    this._flashDuration = duration;
};

Sprite_AnimationMV.prototype.startScreenFlash = function(color, duration) {
    this._screenFlashDuration = duration;
    if (this._screenFlashSprite) {
        this._screenFlashSprite.setColor(color[0], color[1], color[2]);
        this._screenFlashSprite.opacity = color[3];
    }
};

Sprite_AnimationMV.prototype.startHiding = function(duration) {
    this._hidingDuration = duration;
    for (const target of this._targets) {
        target.hide();
    }
};

Sprite_AnimationMV.prototype.onEnd = function() {
    this._flashDuration = 0;
    this._screenFlashDuration = 0;
    this._hidingDuration = 0;
    for (const target of this._targets) {
        target.setBlendColor([0, 0, 0, 0]);
        target.show();
    }
};

//-----------------------------------------------------------------------------
// Sprite_Battleback
//
// The sprite for displaying a background image in battle.

function Sprite_Battleback() {
    this.initialize(...arguments);
}

Sprite_Battleback.prototype = Object.create(TilingSprite.prototype);
Sprite_Battleback.prototype.constructor = Sprite_Battleback;

Sprite_Battleback.prototype.initialize = function(type) {
    TilingSprite.prototype.initialize.call(this);
    if (type === 0) {
        this.bitmap = this.battleback1Bitmap();
    } else {
        this.bitmap = this.battleback2Bitmap();
    }
};

Sprite_Battleback.prototype.adjustPosition = function() {
    this.width = Math.floor((1000 * Graphics.width) / 816);
    this.height = Math.floor((740 * Graphics.height) / 624);
    this.x = (Graphics.width - this.width) / 2;
    if ($gameSystem.isSideView()) {
        this.y = Graphics.height - this.height;
    } else {
        this.y = 0;
    }
    const ratioX = this.width / this.bitmap.width;
    const ratioY = this.height / this.bitmap.height;
    const scale = Math.max(ratioX, ratioY, 1.0);
    this.scale.x = scale;
    this.scale.y = scale;
};

Sprite_Battleback.prototype.battleback1Bitmap = function() {
    return ImageManager.loadBattleback1(this.battleback1Name());
};

Sprite_Battleback.prototype.battleback2Bitmap = function() {
    return ImageManager.loadBattleback2(this.battleback2Name());
};

Sprite_Battleback.prototype.battleback1Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback1Name;
    } else if ($gameMap.battleback1Name() !== null) {
        return $gameMap.battleback1Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback1Name();
    } else {
        return "";
    }
};

Sprite_Battleback.prototype.battleback2Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback2Name;
    } else if ($gameMap.battleback2Name() !== null) {
        return $gameMap.battleback2Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback2Name();
    } else {
        return "";
    }
};

Sprite_Battleback.prototype.overworldBattleback1Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback1Name();
    } else {
        return this.normalBattleback1Name();
    }
};

Sprite_Battleback.prototype.overworldBattleback2Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback2Name();
    } else {
        return this.normalBattleback2Name();
    }
};

Sprite_Battleback.prototype.normalBattleback1Name = function() {
    return (
        this.terrainBattleback1Name(this.autotileType(1)) ||
        this.terrainBattleback1Name(this.autotileType(0)) ||
        this.defaultBattleback1Name()
    );
};

Sprite_Battleback.prototype.normalBattleback2Name = function() {
    return (
        this.terrainBattleback2Name(this.autotileType(1)) ||
        this.terrainBattleback2Name(this.autotileType(0)) ||
        this.defaultBattleback2Name()
    );
};

Sprite_Battleback.prototype.terrainBattleback1Name = function(type) {
    switch (type) {
        case 24:
        case 25:
            return "Wasteland";
        case 26:
        case 27:
            return "DirtField";
        case 32:
        case 33:
            return "Desert";
        case 34:
            return "Lava1";
        case 35:
            return "Lava2";
        case 40:
        case 41:
            return "Snowfield";
        case 42:
            return "Clouds";
        case 4:
        case 5:
            return "PoisonSwamp";
        default:
            return null;
    }
};

Sprite_Battleback.prototype.terrainBattleback2Name = function(type) {
    switch (type) {
        case 20:
        case 21:
            return "Forest";
        case 22:
        case 30:
        case 38:
            return "Cliff";
        case 24:
        case 25:
        case 26:
        case 27:
            return "Wasteland";
        case 32:
        case 33:
            return "Desert";
        case 34:
        case 35:
            return "Lava";
        case 40:
        case 41:
            return "Snowfield";
        case 42:
            return "Clouds";
        case 4:
        case 5:
            return "PoisonSwamp";
    }
};

Sprite_Battleback.prototype.defaultBattleback1Name = function() {
    return "Grassland";
};

Sprite_Battleback.prototype.defaultBattleback2Name = function() {
    return "Grassland";
};

Sprite_Battleback.prototype.shipBattleback1Name = function() {
    return "Ship";
};

Sprite_Battleback.prototype.shipBattleback2Name = function() {
    return "Ship";
};

Sprite_Battleback.prototype.autotileType = function(z) {
    return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
};

//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

function Sprite_Damage() {
    this.initialize(...arguments);
}

Sprite_Damage.prototype = Object.create(Sprite.prototype);
Sprite_Damage.prototype.constructor = Sprite_Damage;

Sprite_Damage.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._duration = 90;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._colorType = 0;
};

Sprite_Damage.prototype.destroy = function(options) {
    for (const child of this.children) {
        if (child.bitmap) {
            child.bitmap.destroy();
        }
    }
    Sprite.prototype.destroy.call(this, options);
};

Sprite_Damage.prototype.setup = function(target) {
    const result = target.result();
    if (result.missed || result.evaded) {
        this._colorType = 0;
        this.createMiss();
    } else if (result.hpAffected) {
        this._colorType = result.hpDamage >= 0 ? 0 : 1;
        this.createDigits(result.hpDamage);
    } else if (target.isAlive() && result.mpDamage !== 0) {
        this._colorType = result.mpDamage >= 0 ? 2 : 3;
        this.createDigits(result.mpDamage);
    }
    if (result.critical) {
        this.setupCriticalEffect();
    }
};

Sprite_Damage.prototype.setupCriticalEffect = function() {
    this._flashColor = [255, 0, 0, 160];
    this._flashDuration = 60;
};

Sprite_Damage.prototype.fontFace = function() {
    return $gameSystem.numberFontFace();
};

Sprite_Damage.prototype.fontSize = function() {
    return $gameSystem.mainFontSize() + 4;
};

Sprite_Damage.prototype.damageColor = function() {
    return ColorManager.damageColor(this._colorType);
};

Sprite_Damage.prototype.outlineColor = function() {
    return "rgba(0, 0, 0, 0.7)";
};

Sprite_Damage.prototype.outlineWidth = function() {
    return 4;
};

Sprite_Damage.prototype.createMiss = function() {
    const h = this.fontSize();
    const w = Math.floor(h * 3.0);
    const sprite = this.createChildSprite(w, h);
    sprite.bitmap.drawText("Miss", 0, 0, w, h, "center");
    sprite.dy = 0;
};

Sprite_Damage.prototype.createDigits = function(value) {
    const string = Math.abs(value).toString();
    const h = this.fontSize();
    const w = Math.floor(h * 0.75);
    for (let i = 0; i < string.length; i++) {
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.drawText(string[i], 0, 0, w, h, "center");
        sprite.x = (i - (string.length - 1) / 2) * w;
        sprite.dy = -i;
    }
};

Sprite_Damage.prototype.createChildSprite = function(width, height) {
    const sprite = new Sprite();
    sprite.bitmap = this.createBitmap(width, height);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.y = -40;
    sprite.ry = sprite.y;
    this.addChild(sprite);
    return sprite;
};

Sprite_Damage.prototype.createBitmap = function(width, height) {
    const bitmap = new Bitmap(width, height);
    bitmap.fontFace = this.fontFace();
    bitmap.fontSize = this.fontSize();
    bitmap.textColor = this.damageColor();
    bitmap.outlineColor = this.outlineColor();
    bitmap.outlineWidth = this.outlineWidth();
    return bitmap;
};

Sprite_Damage.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        for (const child of this.children) {
            this.updateChild(child);
        }
    }
    this.updateFlash();
    this.updateOpacity();
};

Sprite_Damage.prototype.updateChild = function(sprite) {
    sprite.dy += 0.5;
    sprite.ry += sprite.dy;
    if (sprite.ry >= 0) {
        sprite.ry = 0;
        sprite.dy *= -0.6;
    }
    sprite.y = Math.round(sprite.ry);
    sprite.setBlendColor(this._flashColor);
};

Sprite_Damage.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        const d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
    }
};

Sprite_Damage.prototype.updateOpacity = function() {
    if (this._duration < 10) {
        this.opacity = (255 * this._duration) / 10;
    }
};

Sprite_Damage.prototype.isPlaying = function() {
    return this._duration > 0;
};
