//=============================================================================
// rmmz_objects.js v1.9.0
//=============================================================================

//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

function Game_Temp() {
    this.initialize(...arguments);
}

Game_Temp.prototype.initialize = function() {
    this._isPlaytest = Utils.isOptionValid("test");
    this._destinationX = null;
    this._destinationY = null;
    this._touchTarget = null;
    this._touchState = "";
    this._needsBattleRefresh = false;
    this._commonEventQueue = [];
    this._animationQueue = [];
    this._balloonQueue = [];
    this._lastActionData = [0, 0, 0, 0, 0, 0];
};

Game_Temp.prototype.isPlaytest = function() {
    return this._isPlaytest;
};

Game_Temp.prototype.setDestination = function(x, y) {
    this._destinationX = x;
    this._destinationY = y;
};

Game_Temp.prototype.clearDestination = function() {
    this._destinationX = null;
    this._destinationY = null;
};

Game_Temp.prototype.isDestinationValid = function() {
    return this._destinationX !== null;
};

Game_Temp.prototype.destinationX = function() {
    return this._destinationX;
};

Game_Temp.prototype.destinationY = function() {
    return this._destinationY;
};

Game_Temp.prototype.setTouchState = function(target, state) {
    this._touchTarget = target;
    this._touchState = state;
};

Game_Temp.prototype.clearTouchState = function() {
    this._touchTarget = null;
    this._touchState = "";
};

Game_Temp.prototype.touchTarget = function() {
    return this._touchTarget;
};

Game_Temp.prototype.touchState = function() {
    return this._touchState;
};

Game_Temp.prototype.requestBattleRefresh = function() {
    if ($gameParty.inBattle()) {
        this._needsBattleRefresh = true;
    }
};

Game_Temp.prototype.clearBattleRefreshRequest = function() {
    this._needsBattleRefresh = false;
};

Game_Temp.prototype.isBattleRefreshRequested = function() {
    return this._needsBattleRefresh;
};

Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
    this._commonEventQueue.push(commonEventId);
};

Game_Temp.prototype.retrieveCommonEvent = function() {
    return $dataCommonEvents[this._commonEventQueue.shift()];
};

Game_Temp.prototype.clearCommonEventReservation = function() {
    this._commonEventQueue.length = 0;
};

Game_Temp.prototype.isCommonEventReserved = function() {
    return this._commonEventQueue.length > 0;
};

// prettier-ignore
Game_Temp.prototype.requestAnimation = function(
    targets, animationId, mirror = false
) {
    if ($dataAnimations[animationId]) {
        const request = {
            targets: targets,
            animationId: animationId,
            mirror: mirror
        };
        this._animationQueue.push(request);
        for (const target of targets) {
            if (target.startAnimation) {
                target.startAnimation();
            }
        }
    }
};

Game_Temp.prototype.retrieveAnimation = function() {
    return this._animationQueue.shift();
};

Game_Temp.prototype.requestBalloon = function(target, balloonId) {
    const request = { target: target, balloonId: balloonId };
    this._balloonQueue.push(request);
    if (target.startBalloon) {
        target.startBalloon();
    }
};

Game_Temp.prototype.retrieveBalloon = function() {
    return this._balloonQueue.shift();
};

Game_Temp.prototype.lastActionData = function(type) {
    return this._lastActionData[type] || 0;
};

Game_Temp.prototype.setLastActionData = function(type, value) {
    this._lastActionData[type] = value;
};

Game_Temp.prototype.setLastUsedSkillId = function(skillID) {
    this.setLastActionData(0, skillID);
};

Game_Temp.prototype.setLastUsedItemId = function(itemID) {
    this.setLastActionData(1, itemID);
};

Game_Temp.prototype.setLastSubjectActorId = function(actorID) {
    this.setLastActionData(2, actorID);
};

Game_Temp.prototype.setLastSubjectEnemyIndex = function(enemyIndex) {
    this.setLastActionData(3, enemyIndex);
};

Game_Temp.prototype.setLastTargetActorId = function(actorID) {
    this.setLastActionData(4, actorID);
};

Game_Temp.prototype.setLastTargetEnemyIndex = function(enemyIndex) {
    this.setLastActionData(5, enemyIndex);
};

//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

function Game_System() {
    this.initialize(...arguments);
}

Game_System.prototype.initialize = function() {
    this._saveEnabled = true;
    this._menuEnabled = true;
    this._encounterEnabled = true;
    this._formationEnabled = true;
    this._battleCount = 0;
    this._winCount = 0;
    this._escapeCount = 0;
    this._saveCount = 0;
    this._versionId = 0;
    this._savefileId = 0;
    this._framesOnSave = 0;
    this._bgmOnSave = null;
    this._bgsOnSave = null;
    this._windowTone = null;
    this._battleBgm = null;
    this._victoryMe = null;
    this._defeatMe = null;
    this._savedBgm = null;
    this._walkingBgm = null;
};

Game_System.prototype.isJapanese = function() {
    return $dataSystem.locale.match(/^ja/);
};

Game_System.prototype.isChinese = function() {
    return $dataSystem.locale.match(/^zh/);
};

Game_System.prototype.isKorean = function() {
    return $dataSystem.locale.match(/^ko/);
};

Game_System.prototype.isCJK = function() {
    return $dataSystem.locale.match(/^(ja|zh|ko)/);
};

Game_System.prototype.isRussian = function() {
    return $dataSystem.locale.match(/^ru/);
};

Game_System.prototype.isSideView = function() {
    return $dataSystem.optSideView;
};

Game_System.prototype.isAutosaveEnabled = function() {
    return $dataSystem.optAutosave;
};

Game_System.prototype.isMessageSkipEnabled = function() {
    return $dataSystem.optMessageSkip;
};

Game_System.prototype.isSaveEnabled = function() {
    return this._saveEnabled;
};

Game_System.prototype.disableSave = function() {
    this._saveEnabled = false;
};

Game_System.prototype.enableSave = function() {
    this._saveEnabled = true;
};

Game_System.prototype.isMenuEnabled = function() {
    return this._menuEnabled;
};

Game_System.prototype.disableMenu = function() {
    this._menuEnabled = false;
};

Game_System.prototype.enableMenu = function() {
    this._menuEnabled = true;
};

Game_System.prototype.isEncounterEnabled = function() {
    return this._encounterEnabled;
};

Game_System.prototype.disableEncounter = function() {
    this._encounterEnabled = false;
};

Game_System.prototype.enableEncounter = function() {
    this._encounterEnabled = true;
};

Game_System.prototype.isFormationEnabled = function() {
    return this._formationEnabled;
};

Game_System.prototype.disableFormation = function() {
    this._formationEnabled = false;
};

Game_System.prototype.enableFormation = function() {
    this._formationEnabled = true;
};

Game_System.prototype.battleCount = function() {
    return this._battleCount;
};

Game_System.prototype.winCount = function() {
    return this._winCount;
};

Game_System.prototype.escapeCount = function() {
    return this._escapeCount;
};

Game_System.prototype.saveCount = function() {
    return this._saveCount;
};

Game_System.prototype.versionId = function() {
    return this._versionId;
};

Game_System.prototype.savefileId = function() {
    return this._savefileId || 0;
};

Game_System.prototype.setSavefileId = function(savefileId) {
    this._savefileId = savefileId;
};

Game_System.prototype.windowTone = function() {
    return this._windowTone || $dataSystem.windowTone;
};

Game_System.prototype.setWindowTone = function(value) {
    this._windowTone = value;
};

Game_System.prototype.battleBgm = function() {
    return this._battleBgm || $dataSystem.battleBgm;
};

Game_System.prototype.setBattleBgm = function(value) {
    this._battleBgm = value;
};

Game_System.prototype.victoryMe = function() {
    return this._victoryMe || $dataSystem.victoryMe;
};

Game_System.prototype.setVictoryMe = function(value) {
    this._victoryMe = value;
};

Game_System.prototype.defeatMe = function() {
    return this._defeatMe || $dataSystem.defeatMe;
};

Game_System.prototype.setDefeatMe = function(value) {
    this._defeatMe = value;
};

Game_System.prototype.onBattleStart = function() {
    this._battleCount++;
};

Game_System.prototype.onBattleWin = function() {
    this._winCount++;
};

Game_System.prototype.onBattleEscape = function() {
    this._escapeCount++;
};

Game_System.prototype.onBeforeSave = function() {
    this._saveCount++;
    this._versionId = $dataSystem.versionId;
    this._framesOnSave = Graphics.frameCount;
    this._bgmOnSave = AudioManager.saveBgm();
    this._bgsOnSave = AudioManager.saveBgs();
};

Game_System.prototype.onAfterLoad = function() {
    Graphics.frameCount = this._framesOnSave;
    AudioManager.playBgm(this._bgmOnSave);
    AudioManager.playBgs(this._bgsOnSave);
};

Game_System.prototype.playtime = function() {
    return Math.floor(Graphics.frameCount / 60);
};

Game_System.prototype.playtimeText = function() {
    const hour = Math.floor(this.playtime() / 60 / 60);
    const min = Math.floor(this.playtime() / 60) % 60;
    const sec = this.playtime() % 60;
    return hour.padZero(2) + ":" + min.padZero(2) + ":" + sec.padZero(2);
};

Game_System.prototype.saveBgm = function() {
    this._savedBgm = AudioManager.saveBgm();
};

Game_System.prototype.replayBgm = function() {
    if (this._savedBgm) {
        AudioManager.replayBgm(this._savedBgm);
    }
};

Game_System.prototype.saveWalkingBgm = function() {
    this._walkingBgm = AudioManager.saveBgm();
};

Game_System.prototype.replayWalkingBgm = function() {
    if (this._walkingBgm) {
        AudioManager.playBgm(this._walkingBgm);
    }
};

Game_System.prototype.saveWalkingBgm2 = function() {
    this._walkingBgm = $dataMap.bgm;
};

Game_System.prototype.mainFontFace = function() {
    return "rmmz-mainfont, " + $dataSystem.advanced.fallbackFonts;
};

Game_System.prototype.numberFontFace = function() {
    return "rmmz-numberfont, " + this.mainFontFace();
};

Game_System.prototype.mainFontSize = function() {
    return $dataSystem.advanced.fontSize;
};

Game_System.prototype.windowPadding = function() {
    return 12;
};

Game_System.prototype.windowOpacity = function() {
    return $dataSystem.advanced.windowOpacity;
};

//-----------------------------------------------------------------------------
// Game_Timer
//
// The game object class for the timer.

function Game_Timer() {
    this.initialize(...arguments);
}

Game_Timer.prototype.initialize = function() {
    this._frames = 0;
    this._working = false;
};

Game_Timer.prototype.update = function(sceneActive) {
    if (sceneActive && this._working && this._frames > 0) {
        this._frames--;
        if (this._frames === 0) {
            this.onExpire();
        }
    }
};

Game_Timer.prototype.start = function(count) {
    this._frames = count;
    this._working = true;
};

Game_Timer.prototype.stop = function() {
    this._working = false;
};

Game_Timer.prototype.isWorking = function() {
    return this._working;
};

Game_Timer.prototype.seconds = function() {
    return Math.floor(this._frames / 60);
};

Game_Timer.prototype.frames = function() {
    return this._frames;
};

Game_Timer.prototype.onExpire = function() {
    BattleManager.abort();
};

//-----------------------------------------------------------------------------
// Game_Message
//
// The game object class for the state of the message window that displays text
// or selections, etc.

function Game_Message() {
    this.initialize(...arguments);
}

Game_Message.prototype.initialize = function() {
    this.clear();
};

Game_Message.prototype.clear = function() {
    this._texts = [];
    this._choices = [];
    this._speakerName = "";
    this._faceName = "";
    this._faceIndex = 0;
    this._background = 0;
    this._positionType = 2;
    this._choiceDefaultType = 0;
    this._choiceCancelType = 0;
    this._choiceBackground = 0;
    this._choicePositionType = 2;
    this._numInputVariableId = 0;
    this._numInputMaxDigits = 0;
    this._itemChoiceVariableId = 0;
    this._itemChoiceItypeId = 0;
    this._scrollMode = false;
    this._scrollSpeed = 2;
    this._scrollNoFast = false;
    this._choiceCallback = null;
};

Game_Message.prototype.choices = function() {
    return this._choices;
};

Game_Message.prototype.speakerName = function() {
    return this._speakerName;
};

Game_Message.prototype.faceName = function() {
    return this._faceName;
};

Game_Message.prototype.faceIndex = function() {
    return this._faceIndex;
};

Game_Message.prototype.background = function() {
    return this._background;
};

Game_Message.prototype.positionType = function() {
    return this._positionType;
};

Game_Message.prototype.choiceDefaultType = function() {
    return this._choiceDefaultType;
};

Game_Message.prototype.choiceCancelType = function() {
    return this._choiceCancelType;
};

Game_Message.prototype.choiceBackground = function() {
    return this._choiceBackground;
};

Game_Message.prototype.choicePositionType = function() {
    return this._choicePositionType;
};

Game_Message.prototype.numInputVariableId = function() {
    return this._numInputVariableId;
};

Game_Message.prototype.numInputMaxDigits = function() {
    return this._numInputMaxDigits;
};

Game_Message.prototype.itemChoiceVariableId = function() {
    return this._itemChoiceVariableId;
};

Game_Message.prototype.itemChoiceItypeId = function() {
    return this._itemChoiceItypeId;
};

Game_Message.prototype.scrollMode = function() {
    return this._scrollMode;
};

Game_Message.prototype.scrollSpeed = function() {
    return this._scrollSpeed;
};

Game_Message.prototype.scrollNoFast = function() {
    return this._scrollNoFast;
};

Game_Message.prototype.add = function(text) {
    this._texts.push(text);
};

Game_Message.prototype.setSpeakerName = function(speakerName) {
    this._speakerName = speakerName ? speakerName : "";
};

Game_Message.prototype.setFaceImage = function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
};

Game_Message.prototype.setBackground = function(background) {
    this._background = background;
};

Game_Message.prototype.setPositionType = function(positionType) {
    this._positionType = positionType;
};

Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
    this._choices = choices;
    this._choiceDefaultType = defaultType;
    this._choiceCancelType = cancelType;
};

Game_Message.prototype.setChoiceBackground = function(background) {
    this._choiceBackground = background;
};

Game_Message.prototype.setChoicePositionType = function(positionType) {
    this._choicePositionType = positionType;
};

Game_Message.prototype.setNumberInput = function(variableId, maxDigits) {
    this._numInputVariableId = variableId;
    this._numInputMaxDigits = maxDigits;
};

Game_Message.prototype.setItemChoice = function(variableId, itemType) {
    this._itemChoiceVariableId = variableId;
    this._itemChoiceItypeId = itemType;
};

Game_Message.prototype.setScroll = function(speed, noFast) {
    this._scrollMode = true;
    this._scrollSpeed = speed;
    this._scrollNoFast = noFast;
};

Game_Message.prototype.setChoiceCallback = function(callback) {
    this._choiceCallback = callback;
};

Game_Message.prototype.onChoice = function(n) {
    if (this._choiceCallback) {
        this._choiceCallback(n);
        this._choiceCallback = null;
    }
};

Game_Message.prototype.hasText = function() {
    return this._texts.length > 0;
};

Game_Message.prototype.isChoice = function() {
    return this._choices.length > 0;
};

Game_Message.prototype.isNumberInput = function() {
    return this._numInputVariableId > 0;
};

Game_Message.prototype.isItemChoice = function() {
    return this._itemChoiceVariableId > 0;
};

Game_Message.prototype.isBusy = function() {
    return (
        this.hasText() ||
        this.isChoice() ||
        this.isNumberInput() ||
        this.isItemChoice()
    );
};

Game_Message.prototype.newPage = function() {
    if (this._texts.length > 0) {
        this._texts[this._texts.length - 1] += "\f";
    }
};

Game_Message.prototype.allText = function() {
    return this._texts.join("\n");
};

Game_Message.prototype.isRTL = function() {
    return Utils.containsArabic(this.allText());
};

//-----------------------------------------------------------------------------
// Game_Switches
//
// The game object class for switches.

function Game_Switches() {
    this.initialize(...arguments);
}

Game_Switches.prototype.initialize = function() {
    this.clear();
};

Game_Switches.prototype.clear = function() {
    this._data = [];
};

Game_Switches.prototype.value = function(switchId) {
    return !!this._data[switchId];
};

Game_Switches.prototype.setValue = function(switchId, value) {
    if (switchId > 0 && switchId < $dataSystem.switches.length) {
        this._data[switchId] = value;
        this.onChange();
    }
};

Game_Switches.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_Variables
//
// The game object class for variables.

function Game_Variables() {
    this.initialize(...arguments);
}

Game_Variables.prototype.initialize = function() {
    this.clear();
};

Game_Variables.prototype.clear = function() {
    this._data = [];
};

Game_Variables.prototype.value = function(variableId) {
    return this._data[variableId] || 0;
};

Game_Variables.prototype.setValue = function(variableId, value) {
    if (variableId > 0 && variableId < $dataSystem.variables.length) {
        if (typeof value === "number") {
            value = Math.floor(value);
        }
        this._data[variableId] = value;
        this.onChange();
    }
};

Game_Variables.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_SelfSwitches
//
// The game object class for self switches.

function Game_SelfSwitches() {
    this.initialize(...arguments);
}

Game_SelfSwitches.prototype.initialize = function() {
    this.clear();
};

Game_SelfSwitches.prototype.clear = function() {
    this._data = {};
};

Game_SelfSwitches.prototype.value = function(key) {
    return !!this._data[key];
};

Game_SelfSwitches.prototype.setValue = function(key, value) {
    if (value) {
        this._data[key] = true;
    } else {
        delete this._data[key];
    }
    this.onChange();
};

Game_SelfSwitches.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.

function Game_Screen() {
    this.initialize(...arguments);
}

Game_Screen.prototype.initialize = function() {
    this.clear();
};

Game_Screen.prototype.clear = function() {
    this.clearFade();
    this.clearTone();
    this.clearFlash();
    this.clearShake();
    this.clearZoom();
    this.clearWeather();
    this.clearPictures();
};

Game_Screen.prototype.onBattleStart = function() {
    this.clearFade();
    this.clearFlash();
    this.clearShake();
    this.clearZoom();
    this.eraseBattlePictures();
};

Game_Screen.prototype.brightness = function() {
    return this._brightness;
};

Game_Screen.prototype.tone = function() {
    return this._tone;
};

Game_Screen.prototype.flashColor = function() {
    return this._flashColor;
};

Game_Screen.prototype.shake = function() {
    return this._shake;
};

Game_Screen.prototype.zoomX = function() {
    return this._zoomX;
};

Game_Screen.prototype.zoomY = function() {
    return this._zoomY;
};

Game_Screen.prototype.zoomScale = function() {
    return this._zoomScale;
};

Game_Screen.prototype.weatherType = function() {
    return this._weatherType;
};

Game_Screen.prototype.weatherPower = function() {
    return this._weatherPower;
};

Game_Screen.prototype.picture = function(pictureId) {
    const realPictureId = this.realPictureId(pictureId);
    return this._pictures[realPictureId];
};

Game_Screen.prototype.realPictureId = function(pictureId) {
    if ($gameParty.inBattle()) {
        return pictureId + this.maxPictures();
    } else {
        return pictureId;
    }
};

Game_Screen.prototype.clearFade = function() {
    this._brightness = 255;
    this._fadeOutDuration = 0;
    this._fadeInDuration = 0;
};

Game_Screen.prototype.clearTone = function() {
    this._tone = [0, 0, 0, 0];
    this._toneTarget = [0, 0, 0, 0];
    this._toneDuration = 0;
};

Game_Screen.prototype.clearFlash = function() {
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
};

Game_Screen.prototype.clearShake = function() {
    this._shakePower = 0;
    this._shakeSpeed = 0;
    this._shakeDuration = 0;
    this._shakeDirection = 1;
    this._shake = 0;
};

Game_Screen.prototype.clearZoom = function() {
    this._zoomX = 0;
    this._zoomY = 0;
    this._zoomScale = 1;
    this._zoomScaleTarget = 1;
    this._zoomDuration = 0;
};

Game_Screen.prototype.clearWeather = function() {
    this._weatherType = "none";
    this._weatherPower = 0;
    this._weatherPowerTarget = 0;
    this._weatherDuration = 0;
};

Game_Screen.prototype.clearPictures = function() {
    this._pictures = [];
};

Game_Screen.prototype.eraseBattlePictures = function() {
    this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
};

Game_Screen.prototype.maxPictures = function() {
    if ("picturesUpperLimit" in $dataSystem.advanced) {
        return $dataSystem.advanced.picturesUpperLimit;
    } else {
        return 100;
    }
};

Game_Screen.prototype.startFadeOut = function(duration) {
    this._fadeOutDuration = duration;
    this._fadeInDuration = 0;
};

Game_Screen.prototype.startFadeIn = function(duration) {
    this._fadeInDuration = duration;
    this._fadeOutDuration = 0;
};

Game_Screen.prototype.startTint = function(tone, duration) {
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
    }
};

Game_Screen.prototype.startFlash = function(color, duration) {
    this._flashColor = color.clone();
    this._flashDuration = duration;
};

Game_Screen.prototype.startShake = function(power, speed, duration) {
    this._shakePower = power;
    this._shakeSpeed = speed;
    this._shakeDuration = duration;
};

Game_Screen.prototype.startZoom = function(x, y, scale, duration) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScaleTarget = scale;
    this._zoomDuration = duration;
};

Game_Screen.prototype.setZoom = function(x, y, scale) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScale = scale;
};

Game_Screen.prototype.changeWeather = function(type, power, duration) {
    if (type !== "none" || duration === 0) {
        this._weatherType = type;
    }
    this._weatherPowerTarget = type === "none" ? 0 : power;
    this._weatherDuration = duration;
    if (duration === 0) {
        this._weatherPower = this._weatherPowerTarget;
    }
};

Game_Screen.prototype.update = function() {
    this.updateFadeOut();
    this.updateFadeIn();
    this.updateTone();
    this.updateFlash();
    this.updateShake();
    this.updateZoom();
    this.updateWeather();
    this.updatePictures();
};

Game_Screen.prototype.updateFadeOut = function() {
    if (this._fadeOutDuration > 0) {
        const d = this._fadeOutDuration;
        this._brightness = (this._brightness * (d - 1)) / d;
        this._fadeOutDuration--;
    }
};

Game_Screen.prototype.updateFadeIn = function() {
    if (this._fadeInDuration > 0) {
        const d = this._fadeInDuration;
        this._brightness = (this._brightness * (d - 1) + 255) / d;
        this._fadeInDuration--;
    }
};

Game_Screen.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        const d = this._toneDuration;
        for (let i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
};

Game_Screen.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        const d = this._flashDuration;
        this._flashColor[3] *= (d - 1) / d;
        this._flashDuration--;
    }
};

Game_Screen.prototype.updateShake = function() {
    if (this._shakeDuration > 0 || this._shake !== 0) {
        const delta =
            (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
        if (
            this._shakeDuration <= 1 &&
            this._shake * (this._shake + delta) < 0
        ) {
            this._shake = 0;
        } else {
            this._shake += delta;
        }
        if (this._shake > this._shakePower * 2) {
            this._shakeDirection = -1;
        }
        if (this._shake < -this._shakePower * 2) {
            this._shakeDirection = 1;
        }
        this._shakeDuration--;
    }
};

Game_Screen.prototype.updateZoom = function() {
    if (this._zoomDuration > 0) {
        const d = this._zoomDuration;
        const t = this._zoomScaleTarget;
        this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
        this._zoomDuration--;
    }
};

Game_Screen.prototype.updateWeather = function() {
    if (this._weatherDuration > 0) {
        const d = this._weatherDuration;
        const t = this._weatherPowerTarget;
        this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
        this._weatherDuration--;
        if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
            this._weatherType = "none";
        }
    }
};

Game_Screen.prototype.updatePictures = function() {
    for (const picture of this._pictures) {
        if (picture) {
            picture.update();
        }
    }
};

Game_Screen.prototype.startFlashForDamage = function() {
    this.startFlash([255, 0, 0, 128], 8);
};

// prettier-ignore
Game_Screen.prototype.showPicture = function(
    pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode
) {
    const realPictureId = this.realPictureId(pictureId);
    const picture = new Game_Picture();
    picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    this._pictures[realPictureId] = picture;
};

// prettier-ignore
Game_Screen.prototype.movePicture = function(
    pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration,
    easingType
) {
    const picture = this.picture(pictureId);
    if (picture) {
        // prettier-ignore
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode,
                     duration, easingType);
    }
};

Game_Screen.prototype.rotatePicture = function(pictureId, speed) {
    const picture = this.picture(pictureId);
    if (picture) {
        picture.rotate(speed);
    }
};

Game_Screen.prototype.tintPicture = function(pictureId, tone, duration) {
    const picture = this.picture(pictureId);
    if (picture) {
        picture.tint(tone, duration);
    }
};

Game_Screen.prototype.erasePicture = function(pictureId) {
    const realPictureId = this.realPictureId(pictureId);
    this._pictures[realPictureId] = null;
};

//-----------------------------------------------------------------------------
// Game_Picture
//
// The game object class for a picture.

function Game_Picture() {
    this.initialize(...arguments);
}

Game_Picture.prototype.initialize = function() {
    this.initBasic();
    this.initTarget();
    this.initTone();
    this.initRotation();
};

Game_Picture.prototype.name = function() {
    return this._name;
};

Game_Picture.prototype.origin = function() {
    return this._origin;
};

Game_Picture.prototype.x = function() {
    return this._x;
};

Game_Picture.prototype.y = function() {
    return this._y;
};

Game_Picture.prototype.scaleX = function() {
    return this._scaleX;
};

Game_Picture.prototype.scaleY = function() {
    return this._scaleY;
};

Game_Picture.prototype.opacity = function() {
    return this._opacity;
};

Game_Picture.prototype.blendMode = function() {
    return this._blendMode;
};

Game_Picture.prototype.tone = function() {
    return this._tone;
};

Game_Picture.prototype.angle = function() {
    return this._angle;
};

Game_Picture.prototype.initBasic = function() {
    this._name = "";
    this._origin = 0;
    this._x = 0;
    this._y = 0;
    this._scaleX = 100;
    this._scaleY = 100;
    this._opacity = 255;
    this._blendMode = 0;
};

Game_Picture.prototype.initTarget = function() {
    this._targetX = this._x;
    this._targetY = this._y;
    this._targetScaleX = this._scaleX;
    this._targetScaleY = this._scaleY;
    this._targetOpacity = this._opacity;
    this._duration = 0;
    this._wholeDuration = 0;
    this._easingType = 0;
    this._easingExponent = 0;
};

Game_Picture.prototype.initTone = function() {
    this._tone = null;
    this._toneTarget = null;
    this._toneDuration = 0;
};

Game_Picture.prototype.initRotation = function() {
    this._angle = 0;
    this._rotationSpeed = 0;
};

// prettier-ignore
Game_Picture.prototype.show = function(
    name, origin, x, y, scaleX, scaleY, opacity, blendMode
) {
    this._name = name;
    this._origin = origin;
    this._x = x;
    this._y = y;
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this._opacity = opacity;
    this._blendMode = blendMode;
    this.initTarget();
    this.initTone();
    this.initRotation();
};

// prettier-ignore
Game_Picture.prototype.move = function(
    origin, x, y, scaleX, scaleY, opacity, blendMode, duration, easingType
) {
    this._origin = origin;
    this._targetX = x;
    this._targetY = y;
    this._targetScaleX = scaleX;
    this._targetScaleY = scaleY;
    this._targetOpacity = opacity;
    this._blendMode = blendMode;
    this._duration = duration;
    this._wholeDuration = duration;
    this._easingType = easingType;
    this._easingExponent = 2;
};

Game_Picture.prototype.rotate = function(speed) {
    this._rotationSpeed = speed;
};

Game_Picture.prototype.tint = function(tone, duration) {
    if (!this._tone) {
        this._tone = [0, 0, 0, 0];
    }
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
    }
};

Game_Picture.prototype.update = function() {
    this.updateMove();
    this.updateTone();
    this.updateRotation();
};

Game_Picture.prototype.updateMove = function() {
    if (this._duration > 0) {
        this._x = this.applyEasing(this._x, this._targetX);
        this._y = this.applyEasing(this._y, this._targetY);
        this._scaleX = this.applyEasing(this._scaleX, this._targetScaleX);
        this._scaleY = this.applyEasing(this._scaleY, this._targetScaleY);
        this._opacity = this.applyEasing(this._opacity, this._targetOpacity);
        this._duration--;
    }
};

Game_Picture.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        const d = this._toneDuration;
        for (let i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
};

Game_Picture.prototype.updateRotation = function() {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
    }
};

Game_Picture.prototype.applyEasing = function(current, target) {
    const d = this._duration;
    const wd = this._wholeDuration;
    const lt = this.calcEasing((wd - d) / wd);
    const t = this.calcEasing((wd - d + 1) / wd);
    const start = (current - target * lt) / (1 - lt);
    return start + (target - start) * t;
};

Game_Picture.prototype.calcEasing = function(t) {
    const exponent = this._easingExponent;
    switch (this._easingType) {
        case 1: // Slow start
            return this.easeIn(t, exponent);
        case 2: // Slow end
            return this.easeOut(t, exponent);
        case 3: // Slow start and end
            return this.easeInOut(t, exponent);
        default:
            return t;
    }
};

Game_Picture.prototype.easeIn = function(t, exponent) {
    return Math.pow(t, exponent);
};

Game_Picture.prototype.easeOut = function(t, exponent) {
    return 1 - Math.pow(1 - t, exponent);
};

Game_Picture.prototype.easeInOut = function(t, exponent) {
    if (t < 0.5) {
        return this.easeIn(t * 2, exponent) / 2;
    } else {
        return this.easeOut(t * 2 - 1, exponent) / 2 + 0.5;
    }
};

//-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.

function Game_Item() {
    this.initialize(...arguments);
}

Game_Item.prototype.initialize = function(item) {
    this._dataClass = "";
    this._itemId = 0;
    if (item) {
        this.setObject(item);
    }
};

Game_Item.prototype.isSkill = function() {
    return this._dataClass === "skill";
};

Game_Item.prototype.isItem = function() {
    return this._dataClass === "item";
};

Game_Item.prototype.isUsableItem = function() {
    return this.isSkill() || this.isItem();
};

Game_Item.prototype.isWeapon = function() {
    return this._dataClass === "weapon";
};

Game_Item.prototype.isArmor = function() {
    return this._dataClass === "armor";
};

Game_Item.prototype.isEquipItem = function() {
    return this.isWeapon() || this.isArmor();
};

Game_Item.prototype.isNull = function() {
    return this._dataClass === "";
};

Game_Item.prototype.itemId = function() {
    return this._itemId;
};

Game_Item.prototype.object = function() {
    if (this.isSkill()) {
        return $dataSkills[this._itemId];
    } else if (this.isItem()) {
        return $dataItems[this._itemId];
    } else if (this.isWeapon()) {
        return $dataWeapons[this._itemId];
    } else if (this.isArmor()) {
        return $dataArmors[this._itemId];
    } else {
        return null;
    }
};

Game_Item.prototype.setObject = function(item) {
    if (DataManager.isSkill(item)) {
        this._dataClass = "skill";
    } else if (DataManager.isItem(item)) {
        this._dataClass = "item";
    } else if (DataManager.isWeapon(item)) {
        this._dataClass = "weapon";
    } else if (DataManager.isArmor(item)) {
        this._dataClass = "armor";
    } else {
        this._dataClass = "";
    }
    this._itemId = item ? item.id : 0;
};

Game_Item.prototype.setEquip = function(isWeapon, itemId) {
    this._dataClass = isWeapon ? "weapon" : "armor";
    this._itemId = itemId;
};

//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

function Game_Action() {
    this.initialize(...arguments);
}

Game_Action.EFFECT_RECOVER_HP = 11;
Game_Action.EFFECT_RECOVER_MP = 12;
Game_Action.EFFECT_GAIN_TP = 13;
Game_Action.EFFECT_ADD_STATE = 21;
Game_Action.EFFECT_REMOVE_STATE = 22;
Game_Action.EFFECT_ADD_BUFF = 31;
Game_Action.EFFECT_ADD_DEBUFF = 32;
Game_Action.EFFECT_REMOVE_BUFF = 33;
Game_Action.EFFECT_REMOVE_DEBUFF = 34;
Game_Action.EFFECT_SPECIAL = 41;
Game_Action.EFFECT_GROW = 42;
Game_Action.EFFECT_LEARN_SKILL = 43;
Game_Action.EFFECT_COMMON_EVENT = 44;
Game_Action.SPECIAL_EFFECT_ESCAPE = 0;
Game_Action.HITTYPE_CERTAIN = 0;
Game_Action.HITTYPE_PHYSICAL = 1;
Game_Action.HITTYPE_MAGICAL = 2;

Game_Action.prototype.initialize = function(subject, forcing) {
    this._subjectActorId = 0;
    this._subjectEnemyIndex = -1;
    this._forcing = forcing || false;
    this.setSubject(subject);
    this.clear();
};

Game_Action.prototype.clear = function() {
    this._item = new Game_Item();
    this._targetIndex = -1;
};

Game_Action.prototype.setSubject = function(subject) {
    if (subject.isActor()) {
        this._subjectActorId = subject.actorId();
        this._subjectEnemyIndex = -1;
    } else {
        this._subjectEnemyIndex = subject.index();
        this._subjectActorId = 0;
    }
};

Game_Action.prototype.subject = function() {
    if (this._subjectActorId > 0) {
        return $gameActors.actor(this._subjectActorId);
    } else {
        return $gameTroop.members()[this._subjectEnemyIndex];
    }
};

Game_Action.prototype.friendsUnit = function() {
    return this.subject().friendsUnit();
};

Game_Action.prototype.opponentsUnit = function() {
    return this.subject().opponentsUnit();
};

Game_Action.prototype.setEnemyAction = function(action) {
    if (action) {
        this.setSkill(action.skillId);
    } else {
        this.clear();
    }
};

Game_Action.prototype.setAttack = function() {
    this.setSkill(this.subject().attackSkillId());
};

Game_Action.prototype.setGuard = function() {
    this.setSkill(this.subject().guardSkillId());
};

Game_Action.prototype.setSkill = function(skillId) {
    this._item.setObject($dataSkills[skillId]);
};

Game_Action.prototype.setItem = function(itemId) {
    this._item.setObject($dataItems[itemId]);
};

Game_Action.prototype.setItemObject = function(object) {
    this._item.setObject(object);
};

Game_Action.prototype.setTarget = function(targetIndex) {
    this._targetIndex = targetIndex;
};

Game_Action.prototype.item = function() {
    return this._item.object();
};

Game_Action.prototype.isSkill = function() {
    return this._item.isSkill();
};

Game_Action.prototype.isItem = function() {
    return this._item.isItem();
};

Game_Action.prototype.numRepeats = function() {
    let repeats = this.item().repeats;
    if (this.isAttack()) {
        repeats += this.subject().attackTimesAdd();
    }
    return Math.floor(repeats);
};

Game_Action.prototype.checkItemScope = function(list) {
    return list.includes(this.item().scope);
};

Game_Action.prototype.isForOpponent = function() {
    return this.checkItemScope([1, 2, 3, 4, 5, 6, 14]);
};

Game_Action.prototype.isForFriend = function() {
    return this.checkItemScope([7, 8, 9, 10, 11, 12, 13, 14]);
};

Game_Action.prototype.isForEveryone = function() {
    return this.checkItemScope([14]);
};

Game_Action.prototype.isForAliveFriend = function() {
    return this.checkItemScope([7, 8, 11, 14]);
};

Game_Action.prototype.isForDeadFriend = function() {
    return this.checkItemScope([9, 10]);
};

Game_Action.prototype.isForUser = function() {
    return this.checkItemScope([11]);
};

Game_Action.prototype.isForOne = function() {
    return this.checkItemScope([1, 3, 7, 9, 11, 12]);
};

Game_Action.prototype.isForRandom = function() {
    return this.checkItemScope([3, 4, 5, 6]);
};

Game_Action.prototype.isForAll = function() {
    return this.checkItemScope([2, 8, 10, 13, 14]);
};

Game_Action.prototype.needsSelection = function() {
    return this.checkItemScope([1, 7, 9, 12]);
};

Game_Action.prototype.numTargets = function() {
    return this.isForRandom() ? this.item().scope - 2 : 0;
};

Game_Action.prototype.checkDamageType = function(list) {
    return list.includes(this.item().damage.type);
};

Game_Action.prototype.isHpEffect = function() {
    return this.checkDamageType([1, 3, 5]);
};

Game_Action.prototype.isMpEffect = function() {
    return this.checkDamageType([2, 4, 6]);
};

Game_Action.prototype.isDamage = function() {
    return this.checkDamageType([1, 2]);
};

Game_Action.prototype.isRecover = function() {
    return this.checkDamageType([3, 4]);
};

Game_Action.prototype.isDrain = function() {
    return this.checkDamageType([5, 6]);
};

Game_Action.prototype.isHpRecover = function() {
    return this.checkDamageType([3]);
};

Game_Action.prototype.isMpRecover = function() {
    return this.checkDamageType([4]);
};

Game_Action.prototype.isCertainHit = function() {
    return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
};

Game_Action.prototype.isPhysical = function() {
    return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
};

Game_Action.prototype.isMagical = function() {
    return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
};

Game_Action.prototype.isAttack = function() {
    return this.item() === $dataSkills[this.subject().attackSkillId()];
};

Game_Action.prototype.isGuard = function() {
    return this.item() === $dataSkills[this.subject().guardSkillId()];
};

Game_Action.prototype.isMagicSkill = function() {
    if (this.isSkill()) {
        return $dataSystem.magicSkills.includes(this.item().stypeId);
    } else {
        return false;
    }
};

Game_Action.prototype.decideRandomTarget = function() {
    let target;
    if (this.isForDeadFriend()) {
        target = this.friendsUnit().randomDeadTarget();
    } else if (this.isForFriend()) {
        target = this.friendsUnit().randomTarget();
    } else {
        target = this.opponentsUnit().randomTarget();
    }
    if (target) {
        this._targetIndex = target.index();
    } else {
        this.clear();
    }
};

Game_Action.prototype.setConfusion = function() {
    this.setAttack();
};

Game_Action.prototype.prepare = function() {
    if (this.subject().isConfused() && !this._forcing) {
        this.setConfusion();
    }
};

Game_Action.prototype.isValid = function() {
    return (this._forcing && this.item()) || this.subject().canUse(this.item());
};

Game_Action.prototype.speed = function() {
    const agi = this.subject().agi;
    let speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    if (this.item()) {
        speed += this.item().speed;
    }
    if (this.isAttack()) {
        speed += this.subject().attackSpeed();
    }
    return speed;
};

Game_Action.prototype.makeTargets = function() {
    const targets = [];
    if (!this._forcing && this.subject().isConfused()) {
        targets.push(this.confusionTarget());
    } else if (this.isForEveryone()) {
        targets.push(...this.targetsForEveryone());
    } else if (this.isForOpponent()) {
        targets.push(...this.targetsForOpponents());
    } else if (this.isForFriend()) {
        targets.push(...this.targetsForFriends());
    }
    return this.repeatTargets(targets);
};

Game_Action.prototype.repeatTargets = function(targets) {
    const repeatedTargets = [];
    const repeats = this.numRepeats();
    for (const target of targets) {
        if (target) {
            for (let i = 0; i < repeats; i++) {
                repeatedTargets.push(target);
            }
        }
    }
    return repeatedTargets;
};

Game_Action.prototype.confusionTarget = function() {
    switch (this.subject().confusionLevel()) {
        case 1:
            return this.opponentsUnit().randomTarget();
        case 2:
            if (Math.randomInt(2) === 0) {
                return this.opponentsUnit().randomTarget();
            }
            return this.friendsUnit().randomTarget();
        default:
            return this.friendsUnit().randomTarget();
    }
};

Game_Action.prototype.targetsForEveryone = function() {
    const opponentMembers = this.opponentsUnit().aliveMembers();
    const friendMembers = this.friendsUnit().aliveMembers();
    return opponentMembers.concat(friendMembers);
};

Game_Action.prototype.targetsForOpponents = function() {
    const unit = this.opponentsUnit();
    if (this.isForRandom()) {
        return this.randomTargets(unit);
    } else {
        return this.targetsForAlive(unit);
    }
};

Game_Action.prototype.targetsForFriends = function() {
    const unit = this.friendsUnit();
    if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        return this.targetsForDead(unit);
    } else if (this.isForAliveFriend()) {
        return this.targetsForAlive(unit);
    } else {
        return this.targetsForDeadAndAlive(unit);
    }
};

Game_Action.prototype.randomTargets = function(unit) {
    const targets = [];
    for (let i = 0; i < this.numTargets(); i++) {
        targets.push(unit.randomTarget());
    }
    return targets;
};

Game_Action.prototype.targetsForDead = function(unit) {
    if (this.isForOne()) {
        return [unit.smoothDeadTarget(this._targetIndex)];
    } else {
        return unit.deadMembers();
    }
};

Game_Action.prototype.targetsForAlive = function(unit) {
    if (this.isForOne()) {
        if (this._targetIndex < 0) {
            return [unit.randomTarget()];
        } else {
            return [unit.smoothTarget(this._targetIndex)];
        }
    } else {
        return unit.aliveMembers();
    }
};

Game_Action.prototype.targetsForDeadAndAlive = function(unit) {
    if (this.isForOne()) {
        return [unit.members()[this._targetIndex]];
    } else {
        return unit.members();
    }
};

Game_Action.prototype.evaluate = function() {
    let value = 0;
    for (const target of this.itemTargetCandidates()) {
        const targetValue = this.evaluateWithTarget(target);
        if (this.isForAll()) {
            value += targetValue;
        } else if (targetValue > value) {
            value = targetValue;
            this._targetIndex = target.index();
        }
    }
    value *= this.numRepeats();
    if (value > 0) {
        value += Math.random();
    }
    return value;
};

Game_Action.prototype.itemTargetCandidates = function() {
    if (!this.isValid()) {
        return [];
    } else if (this.isForOpponent()) {
        return this.opponentsUnit().aliveMembers();
    } else if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        return this.friendsUnit().deadMembers();
    } else {
        return this.friendsUnit().aliveMembers();
    }
};

Game_Action.prototype.evaluateWithTarget = function(target) {
    if (this.isHpEffect()) {
        const value = this.makeDamageValue(target, false);
        if (this.isForOpponent()) {
            return value / Math.max(target.hp, 1);
        } else {
            const recovery = Math.min(-value, target.mhp - target.hp);
            return recovery / target.mhp;
        }
    }
};

Game_Action.prototype.testApply = function(target) {
    return (
        this.testLifeAndDeath(target) &&
        ($gameParty.inBattle() ||
            (this.isHpRecover() && target.hp < target.mhp) ||
            (this.isMpRecover() && target.mp < target.mmp) ||
            this.hasItemAnyValidEffects(target))
    );
};

Game_Action.prototype.testLifeAndDeath = function(target) {
    if (this.isForOpponent() || this.isForAliveFriend()) {
        return target.isAlive();
    } else if (this.isForDeadFriend()) {
        return target.isDead();
    } else {
        return true;
    }
};

Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    return this.item().effects.some(effect =>
        this.testItemEffect(target, effect)
    );
};

Game_Action.prototype.testItemEffect = function(target, effect) {
    switch (effect.code) {
        case Game_Action.EFFECT_RECOVER_HP:
            return (
                target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0
            );
        case Game_Action.EFFECT_RECOVER_MP:
            return (
                target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0
            );
        case Game_Action.EFFECT_ADD_STATE:
            return !target.isStateAffected(effect.dataId);
        case Game_Action.EFFECT_REMOVE_STATE:
            return target.isStateAffected(effect.dataId);
        case Game_Action.EFFECT_ADD_BUFF:
            return !target.isMaxBuffAffected(effect.dataId);
        case Game_Action.EFFECT_ADD_DEBUFF:
            return !target.isMaxDebuffAffected(effect.dataId);
        case Game_Action.EFFECT_REMOVE_BUFF:
            return target.isBuffAffected(effect.dataId);
        case Game_Action.EFFECT_REMOVE_DEBUFF:
            return target.isDebuffAffected(effect.dataId);
        case Game_Action.EFFECT_LEARN_SKILL:
            return target.isActor() && !target.isLearnedSkill(effect.dataId);
        default:
            return true;
    }
};

Game_Action.prototype.itemCnt = function(target) {
    if (this.isPhysical() && target.canMove()) {
        return target.cnt;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemMrf = function(target) {
    if (this.isMagical()) {
        return target.mrf;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemHit = function(/*target*/) {
    const successRate = this.item().successRate;
    if (this.isPhysical()) {
        return successRate * 0.01 * this.subject().hit;
    } else {
        return successRate * 0.01;
    }
};

Game_Action.prototype.itemEva = function(target) {
    if (this.isPhysical()) {
        return target.eva;
    } else if (this.isMagical()) {
        return target.mev;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemCri = function(target) {
    return this.item().damage.critical
        ? this.subject().cri * (1 - target.cev)
        : 0;
};

Game_Action.prototype.apply = function(target) {
    const result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = result.used && Math.random() >= this.itemHit(target);
    result.evaded = !result.missed && Math.random() < this.itemEva(target);
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = Math.random() < this.itemCri(target);
            const value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        for (const effect of this.item().effects) {
            this.applyItemEffect(target, effect);
        }
        this.applyItemUserEffect(target);
    }
    this.updateLastTarget(target);
};

Game_Action.prototype.makeDamageValue = function(target, critical) {
    const item = this.item();
    const baseValue = this.evalDamageFormula(target);
    let value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) {
        value *= target.pdr;
    }
    if (this.isMagical()) {
        value *= target.mdr;
    }
    if (baseValue < 0) {
        value *= target.rec;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
};

Game_Action.prototype.evalDamageFormula = function(target) {
    try {
        const item = this.item();
        const a = this.subject(); // eslint-disable-line no-unused-vars
        const b = target; // eslint-disable-line no-unused-vars
        const v = $gameVariables._data; // eslint-disable-line no-unused-vars
        const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
        const value = Math.max(eval(item.damage.formula), 0) * sign;
        return isNaN(value) ? 0 : value;
    } catch (e) {
        return 0;
    }
};

Game_Action.prototype.calcElementRate = function(target) {
    if (this.item().damage.elementId < 0) {
        return this.elementsMaxRate(target, this.subject().attackElements());
    } else {
        return target.elementRate(this.item().damage.elementId);
    }
};

Game_Action.prototype.elementsMaxRate = function(target, elements) {
    if (elements.length > 0) {
        const rates = elements.map(elementId => target.elementRate(elementId));
        return Math.max(...rates);
    } else {
        return 1;
    }
};

Game_Action.prototype.applyCritical = function(damage) {
    return damage * 3;
};

Game_Action.prototype.applyVariance = function(damage, variance) {
    const amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));
    const v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    return damage >= 0 ? damage + v : damage - v;
};

Game_Action.prototype.applyGuard = function(damage, target) {
    return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
};

Game_Action.prototype.executeDamage = function(target, value) {
    const result = target.result();
    if (value === 0) {
        result.critical = false;
    }
    if (this.isHpEffect()) {
        this.executeHpDamage(target, value);
    }
    if (this.isMpEffect()) {
        this.executeMpDamage(target, value);
    }
};

Game_Action.prototype.executeHpDamage = function(target, value) {
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    this.makeSuccess(target);
    target.gainHp(-value);
    if (value > 0) {
        target.onDamage(value);
    }
    this.gainDrainedHp(value);
};

Game_Action.prototype.executeMpDamage = function(target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    if (value !== 0) {
        this.makeSuccess(target);
    }
    target.gainMp(-value);
    this.gainDrainedMp(value);
};

Game_Action.prototype.gainDrainedHp = function(value) {
    if (this.isDrain()) {
        let gainTarget = this.subject();
        if (this._reflectionTarget) {
            gainTarget = this._reflectionTarget;
        }
        gainTarget.gainHp(value);
    }
};

Game_Action.prototype.gainDrainedMp = function(value) {
    if (this.isDrain()) {
        let gainTarget = this.subject();
        if (this._reflectionTarget) {
            gainTarget = this._reflectionTarget;
        }
        gainTarget.gainMp(value);
    }
};

Game_Action.prototype.applyItemEffect = function(target, effect) {
    switch (effect.code) {
        case Game_Action.EFFECT_RECOVER_HP:
            this.itemEffectRecoverHp(target, effect);
            break;
        case Game_Action.EFFECT_RECOVER_MP:
            this.itemEffectRecoverMp(target, effect);
            break;
        case Game_Action.EFFECT_GAIN_TP:
            this.itemEffectGainTp(target, effect);
            break;
        case Game_Action.EFFECT_ADD_STATE:
            this.itemEffectAddState(target, effect);
            break;
        case Game_Action.EFFECT_REMOVE_STATE:
            this.itemEffectRemoveState(target, effect);
            break;
        case Game_Action.EFFECT_ADD_BUFF:
            this.itemEffectAddBuff(target, effect);
            break;
        case Game_Action.EFFECT_ADD_DEBUFF:
            this.itemEffectAddDebuff(target, effect);
            break;
        case Game_Action.EFFECT_REMOVE_BUFF:
            this.itemEffectRemoveBuff(target, effect);
            break;
        case Game_Action.EFFECT_REMOVE_DEBUFF:
            this.itemEffectRemoveDebuff(target, effect);
            break;
        case Game_Action.EFFECT_SPECIAL:
            this.itemEffectSpecial(target, effect);
            break;
        case Game_Action.EFFECT_GROW:
            this.itemEffectGrow(target, effect);
            break;
        case Game_Action.EFFECT_LEARN_SKILL:
            this.itemEffectLearnSkill(target, effect);
            break;
        case Game_Action.EFFECT_COMMON_EVENT:
            this.itemEffectCommonEvent(target, effect);
            break;
    }
};

Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
    let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainHp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
    let value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainMp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectGainTp = function(target, effect) {
    let value = Math.floor(effect.value1);
    if (value !== 0) {
        target.gainTp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectAddState = function(target, effect) {
    if (effect.dataId === 0) {
        this.itemEffectAddAttackState(target, effect);
    } else {
        this.itemEffectAddNormalState(target, effect);
    }
};

Game_Action.prototype.itemEffectAddAttackState = function(target, effect) {
    for (const stateId of this.subject().attackStates()) {
        let chance = effect.value1;
        chance *= target.stateRate(stateId);
        chance *= this.subject().attackStatesRate(stateId);
        chance *= this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addState(stateId);
            this.makeSuccess(target);
        }
    }
};

Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
    let chance = effect.value1;
    if (!this.isCertainHit()) {
        chance *= target.stateRate(effect.dataId);
        chance *= this.lukEffectRate(target);
    }
    if (Math.random() < chance) {
        target.addState(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
    let chance = effect.value1;
    if (Math.random() < chance) {
        target.removeState(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
    target.addBuff(effect.dataId, effect.value1);
    this.makeSuccess(target);
};

Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
    let chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
        target.addDebuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveBuff = function(target, effect) {
    if (target.isBuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveDebuff = function(target, effect) {
    if (target.isDebuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectSpecial = function(target, effect) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        target.escape();
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectGrow = function(target, effect) {
    target.addParam(effect.dataId, Math.floor(effect.value1));
    this.makeSuccess(target);
};

Game_Action.prototype.itemEffectLearnSkill = function(target, effect) {
    if (target.isActor()) {
        target.learnSkill(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectCommonEvent = function(/*target, effect*/) {
    //
};

Game_Action.prototype.makeSuccess = function(target) {
    target.result().success = true;
};

Game_Action.prototype.applyItemUserEffect = function(/*target*/) {
    const value = Math.floor(this.item().tpGain * this.subject().tcr);
    this.subject().gainSilentTp(value);
};

Game_Action.prototype.lukEffectRate = function(target) {
    return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
};

Game_Action.prototype.applyGlobal = function() {
    for (const effect of this.item().effects) {
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    }
    this.updateLastUsed();
    this.updateLastSubject();
};

Game_Action.prototype.updateLastUsed = function() {
    const item = this.item();
    if (DataManager.isSkill(item)) {
        $gameTemp.setLastUsedSkillId(item.id);
    } else if (DataManager.isItem(item)) {
        $gameTemp.setLastUsedItemId(item.id);
    }
};

Game_Action.prototype.updateLastSubject = function() {
    const subject = this.subject();
    if (subject.isActor()) {
        $gameTemp.setLastSubjectActorId(subject.actorId());
    } else {
        $gameTemp.setLastSubjectEnemyIndex(subject.index() + 1);
    }
};

Game_Action.prototype.updateLastTarget = function(target) {
    if (target.isActor()) {
        $gameTemp.setLastTargetActorId(target.actorId());
    } else {
        $gameTemp.setLastTargetEnemyIndex(target.index() + 1);
    }
};

//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

function Game_ActionResult() {
    this.initialize(...arguments);
}

Game_ActionResult.prototype.initialize = function() {
    this.clear();
};

Game_ActionResult.prototype.clear = function() {
    this.used = false;
    this.missed = false;
    this.evaded = false;
    this.physical = false;
    this.drain = false;
    this.critical = false;
    this.success = false;
    this.hpAffected = false;
    this.hpDamage = 0;
    this.mpDamage = 0;
    this.tpDamage = 0;
    this.addedStates = [];
    this.removedStates = [];
    this.addedBuffs = [];
    this.addedDebuffs = [];
    this.removedBuffs = [];
};

Game_ActionResult.prototype.addedStateObjects = function() {
    return this.addedStates.map(id => $dataStates[id]);
};

Game_ActionResult.prototype.removedStateObjects = function() {
    return this.removedStates.map(id => $dataStates[id]);
};

Game_ActionResult.prototype.isStatusAffected = function() {
    return (
        this.addedStates.length > 0 ||
        this.removedStates.length > 0 ||
        this.addedBuffs.length > 0 ||
        this.addedDebuffs.length > 0 ||
        this.removedBuffs.length > 0
    );
};

Game_ActionResult.prototype.isHit = function() {
    return this.used && !this.missed && !this.evaded;
};

Game_ActionResult.prototype.isStateAdded = function(stateId) {
    return this.addedStates.includes(stateId);
};

Game_ActionResult.prototype.pushAddedState = function(stateId) {
    if (!this.isStateAdded(stateId)) {
        this.addedStates.push(stateId);
    }
};

Game_ActionResult.prototype.isStateRemoved = function(stateId) {
    return this.removedStates.includes(stateId);
};

Game_ActionResult.prototype.pushRemovedState = function(stateId) {
    if (!this.isStateRemoved(stateId)) {
        this.removedStates.push(stateId);
    }
};

Game_ActionResult.prototype.isBuffAdded = function(paramId) {
    return this.addedBuffs.includes(paramId);
};

Game_ActionResult.prototype.pushAddedBuff = function(paramId) {
    if (!this.isBuffAdded(paramId)) {
        this.addedBuffs.push(paramId);
    }
};

Game_ActionResult.prototype.isDebuffAdded = function(paramId) {
    return this.addedDebuffs.includes(paramId);
};

Game_ActionResult.prototype.pushAddedDebuff = function(paramId) {
    if (!this.isDebuffAdded(paramId)) {
        this.addedDebuffs.push(paramId);
    }
};

Game_ActionResult.prototype.isBuffRemoved = function(paramId) {
    return this.removedBuffs.includes(paramId);
};

Game_ActionResult.prototype.pushRemovedBuff = function(paramId) {
    if (!this.isBuffRemoved(paramId)) {
        this.removedBuffs.push(paramId);
    }
};

//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.

function Game_BattlerBase() {
    this.initialize(...arguments);
}

Game_BattlerBase.TRAIT_ELEMENT_RATE = 11;
Game_BattlerBase.TRAIT_DEBUFF_RATE = 12;
Game_BattlerBase.TRAIT_STATE_RATE = 13;
Game_BattlerBase.TRAIT_STATE_RESIST = 14;
Game_BattlerBase.TRAIT_PARAM = 21;
Game_BattlerBase.TRAIT_XPARAM = 22;
Game_BattlerBase.TRAIT_SPARAM = 23;
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
Game_BattlerBase.TRAIT_ATTACK_STATE = 32;
Game_BattlerBase.TRAIT_ATTACK_SPEED = 33;
Game_BattlerBase.TRAIT_ATTACK_TIMES = 34;
Game_BattlerBase.TRAIT_ATTACK_SKILL = 35;
Game_BattlerBase.TRAIT_STYPE_ADD = 41;
Game_BattlerBase.TRAIT_STYPE_SEAL = 42;
Game_BattlerBase.TRAIT_SKILL_ADD = 43;
Game_BattlerBase.TRAIT_SKILL_SEAL = 44;
Game_BattlerBase.TRAIT_EQUIP_WTYPE = 51;
Game_BattlerBase.TRAIT_EQUIP_ATYPE = 52;
Game_BattlerBase.TRAIT_EQUIP_LOCK = 53;
Game_BattlerBase.TRAIT_EQUIP_SEAL = 54;
Game_BattlerBase.TRAIT_SLOT_TYPE = 55;
Game_BattlerBase.TRAIT_ACTION_PLUS = 61;
Game_BattlerBase.TRAIT_SPECIAL_FLAG = 62;
Game_BattlerBase.TRAIT_COLLAPSE_TYPE = 63;
Game_BattlerBase.TRAIT_PARTY_ABILITY = 64;
Game_BattlerBase.FLAG_ID_AUTO_BATTLE = 0;
Game_BattlerBase.FLAG_ID_GUARD = 1;
Game_BattlerBase.FLAG_ID_SUBSTITUTE = 2;
Game_BattlerBase.FLAG_ID_PRESERVE_TP = 3;
Game_BattlerBase.ICON_BUFF_START = 32;
Game_BattlerBase.ICON_DEBUFF_START = 48;

Object.defineProperties(Game_BattlerBase.prototype, {
    // Hit Points
    hp: {
        get: function() {
            return this._hp;
        },
        configurable: true
    },
    // Magic Points
    mp: {
        get: function() {
            return this._mp;
        },
        configurable: true
    },
    // Tactical Points
    tp: {
        get: function() {
            return this._tp;
        },
        configurable: true
    },
    // Maximum Hit Points
    mhp: {
        get: function() {
            return this.param(0);
        },
        configurable: true
    },
    // Maximum Magic Points
    mmp: {
        get: function() {
            return this.param(1);
        },
        configurable: true
    },
    // ATtacK power
    atk: {
        get: function() {
            return this.param(2);
        },
        configurable: true
    },
    // DEFense power
    def: {
        get: function() {
            return this.param(3);
        },
        configurable: true
    },
    // Magic ATtack power
    mat: {
        get: function() {
            return this.param(4);
        },
        configurable: true
    },
    // Magic DeFense power
    mdf: {
        get: function() {
            return this.param(5);
        },
        configurable: true
    },
    // AGIlity
    agi: {
        get: function() {
            return this.param(6);
        },
        configurable: true
    },
    // LUcK
    luk: {
        get: function() {
            return this.param(7);
        },
        configurable: true
    },
    // HIT rate
    hit: {
        get: function() {
            return this.xparam(0);
        },
        configurable: true
    },
    // EVAsion rate
    eva: {
        get: function() {
            return this.xparam(1);
        },
        configurable: true
    },
    // CRItical rate
    cri: {
        get: function() {
            return this.xparam(2);
        },
        configurable: true
    },
    // Critical EVasion rate
    cev: {
        get: function() {
            return this.xparam(3);
        },
        configurable: true
    },
    // Magic EVasion rate
    mev: {
        get: function() {
            return this.xparam(4);
        },
        configurable: true
    },
    // Magic ReFlection rate
    mrf: {
        get: function() {
            return this.xparam(5);
        },
        configurable: true
    },
    // CouNTer attack rate
    cnt: {
        get: function() {
            return this.xparam(6);
        },
        configurable: true
    },
    // Hp ReGeneration rate
    hrg: {
        get: function() {
            return this.xparam(7);
        },
        configurable: true
    },
    // Mp ReGeneration rate
    mrg: {
        get: function() {
            return this.xparam(8);
        },
        configurable: true
    },
    // Tp ReGeneration rate
    trg: {
        get: function() {
            return this.xparam(9);
        },
        configurable: true
    },
    // TarGet Rate
    tgr: {
        get: function() {
            return this.sparam(0);
        },
        configurable: true
    },
    // GuaRD effect rate
    grd: {
        get: function() {
            return this.sparam(1);
        },
        configurable: true
    },
    // RECovery effect rate
    rec: {
        get: function() {
            return this.sparam(2);
        },
        configurable: true
    },
    // PHArmacology
    pha: {
        get: function() {
            return this.sparam(3);
        },
        configurable: true
    },
    // Mp Cost Rate
    mcr: {
        get: function() {
            return this.sparam(4);
        },
        configurable: true
    },
    // Tp Charge Rate
    tcr: {
        get: function() {
            return this.sparam(5);
        },
        configurable: true
    },
    // Physical Damage Rate
    pdr: {
        get: function() {
            return this.sparam(6);
        },
        configurable: true
    },
    // Magic Damage Rate
    mdr: {
        get: function() {
            return this.sparam(7);
        },
        configurable: true
    },
    // Floor Damage Rate
    fdr: {
        get: function() {
            return this.sparam(8);
        },
        configurable: true
    },
    // EXperience Rate
    exr: {
        get: function() {
            return this.sparam(9);
        },
        configurable: true
    }
});

Game_BattlerBase.prototype.initialize = function() {
    this.initMembers();
};

Game_BattlerBase.prototype.initMembers = function() {
    this._hp = 1;
    this._mp = 0;
    this._tp = 0;
    this._hidden = false;
    this.clearParamPlus();
    this.clearStates();
    this.clearBuffs();
};

Game_BattlerBase.prototype.clearParamPlus = function() {
    this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
};

Game_BattlerBase.prototype.clearStates = function() {
    this._states = [];
    this._stateTurns = {};
};

Game_BattlerBase.prototype.eraseState = function(stateId) {
    this._states.remove(stateId);
    delete this._stateTurns[stateId];
};

Game_BattlerBase.prototype.isStateAffected = function(stateId) {
    return this._states.includes(stateId);
};

Game_BattlerBase.prototype.isDeathStateAffected = function() {
    return this.isStateAffected(this.deathStateId());
};

Game_BattlerBase.prototype.deathStateId = function() {
    return 1;
};

Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    const state = $dataStates[stateId];
    const variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
    this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
};

Game_BattlerBase.prototype.isStateExpired = function(stateId) {
    return this._stateTurns[stateId] === 0;
};

Game_BattlerBase.prototype.updateStateTurns = function() {
    for (const stateId of this._states) {
        if (this._stateTurns[stateId] > 0) {
            this._stateTurns[stateId]--;
        }
    }
};

Game_BattlerBase.prototype.clearBuffs = function() {
    this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
    this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
};

Game_BattlerBase.prototype.eraseBuff = function(paramId) {
    this._buffs[paramId] = 0;
    this._buffTurns[paramId] = 0;
};

Game_BattlerBase.prototype.buffLength = function() {
    return this._buffs.length;
};

Game_BattlerBase.prototype.buff = function(paramId) {
    return this._buffs[paramId];
};

Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
    return this._buffs[paramId] > 0;
};

Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
    return this._buffs[paramId] < 0;
};

Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
    return this._buffs[paramId] !== 0;
};

Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
    return this._buffs[paramId] === 2;
};

Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
    return this._buffs[paramId] === -2;
};

Game_BattlerBase.prototype.increaseBuff = function(paramId) {
    if (!this.isMaxBuffAffected(paramId)) {
        this._buffs[paramId]++;
    }
};

Game_BattlerBase.prototype.decreaseBuff = function(paramId) {
    if (!this.isMaxDebuffAffected(paramId)) {
        this._buffs[paramId]--;
    }
};

Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId, turns) {
    if (this._buffTurns[paramId] < turns) {
        this._buffTurns[paramId] = turns;
    }
};

Game_BattlerBase.prototype.isBuffExpired = function(paramId) {
    return this._buffTurns[paramId] === 0;
};

Game_BattlerBase.prototype.updateBuffTurns = function() {
    for (let i = 0; i < this._buffTurns.length; i++) {
        if (this._buffTurns[i] > 0) {
            this._buffTurns[i]--;
        }
    }
};

Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
    this.clearStates();
    this.clearBuffs();
};

Game_BattlerBase.prototype.revive = function() {
    if (this._hp === 0) {
        this._hp = 1;
    }
};

Game_BattlerBase.prototype.states = function() {
    return this._states.map(id => $dataStates[id]);
};

Game_BattlerBase.prototype.stateIcons = function() {
    return this.states()
        .map(state => state.iconIndex)
        .filter(iconIndex => iconIndex > 0);
};

Game_BattlerBase.prototype.buffIcons = function() {
    const icons = [];
    for (let i = 0; i < this._buffs.length; i++) {
        if (this._buffs[i] !== 0) {
            icons.push(this.buffIconIndex(this._buffs[i], i));
        }
    }
    return icons;
};

Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
    if (buffLevel > 0) {
        return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
    } else if (buffLevel < 0) {
        return (
            Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId
        );
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.allIcons = function() {
    return this.stateIcons().concat(this.buffIcons());
};

Game_BattlerBase.prototype.traitObjects = function() {
    // Returns an array of the all objects having traits. States only here.
    return this.states();
};

Game_BattlerBase.prototype.allTraits = function() {
    return this.traitObjects().reduce((r, obj) => r.concat(obj.traits), []);
};

Game_BattlerBase.prototype.traits = function(code) {
    return this.allTraits().filter(trait => trait.code === code);
};

Game_BattlerBase.prototype.traitsWithId = function(code, id) {
    return this.allTraits().filter(
        trait => trait.code === code && trait.dataId === id
    );
};

Game_BattlerBase.prototype.traitsPi = function(code, id) {
    return this.traitsWithId(code, id).reduce((r, trait) => r * trait.value, 1);
};

Game_BattlerBase.prototype.traitsSum = function(code, id) {
    return this.traitsWithId(code, id).reduce((r, trait) => r + trait.value, 0);
};

Game_BattlerBase.prototype.traitsSumAll = function(code) {
    return this.traits(code).reduce((r, trait) => r + trait.value, 0);
};

Game_BattlerBase.prototype.traitsSet = function(code) {
    return this.traits(code).reduce((r, trait) => r.concat(trait.dataId), []);
};

Game_BattlerBase.prototype.paramBase = function(/*paramId*/) {
    return 0;
};

Game_BattlerBase.prototype.paramPlus = function(paramId) {
    return this._paramPlus[paramId];
};

Game_BattlerBase.prototype.paramBasePlus = function(paramId) {
    return Math.max(0, this.paramBase(paramId) + this.paramPlus(paramId));
};

Game_BattlerBase.prototype.paramMin = function(paramId) {
    if (paramId === 0) {
        return 1; // MHP
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.paramMax = function(/*paramId*/) {
    return Infinity;
};

Game_BattlerBase.prototype.paramRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
};

Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    return this._buffs[paramId] * 0.25 + 1.0;
};

Game_BattlerBase.prototype.param = function(paramId) {
    const value =
        this.paramBasePlus(paramId) *
        this.paramRate(paramId) *
        this.paramBuffRate(paramId);
    const maxValue = this.paramMax(paramId);
    const minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_BattlerBase.prototype.xparam = function(xparamId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
};

Game_BattlerBase.prototype.sparam = function(sparamId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
};

Game_BattlerBase.prototype.elementRate = function(elementId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
};

Game_BattlerBase.prototype.debuffRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
};

Game_BattlerBase.prototype.stateRate = function(stateId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
};

Game_BattlerBase.prototype.stateResistSet = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
};

Game_BattlerBase.prototype.isStateResist = function(stateId) {
    return this.stateResistSet().includes(stateId);
};

Game_BattlerBase.prototype.attackElements = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
};

Game_BattlerBase.prototype.attackStates = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
};

Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
};

Game_BattlerBase.prototype.attackSpeed = function() {
    return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
};

Game_BattlerBase.prototype.attackTimesAdd = function() {
    return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
};

Game_BattlerBase.prototype.attackSkillId = function() {
    const set = this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_SKILL);
    return set.length > 0 ? Math.max(...set) : 1;
};

Game_BattlerBase.prototype.addedSkillTypes = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
};

Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).includes(stypeId);
};

Game_BattlerBase.prototype.addedSkills = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
};

Game_BattlerBase.prototype.isSkillSealed = function(skillId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).includes(skillId);
};

Game_BattlerBase.prototype.isEquipWtypeOk = function(wtypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).includes(wtypeId);
};

Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).includes(atypeId);
};

Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).includes(etypeId);
};

Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).includes(etypeId);
};

Game_BattlerBase.prototype.slotType = function() {
    const set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
    return set.length > 0 ? Math.max(...set) : 0;
};

Game_BattlerBase.prototype.isDualWield = function() {
    return this.slotType() === 1;
};

Game_BattlerBase.prototype.actionPlusSet = function() {
    return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(
        trait => trait.value
    );
};

Game_BattlerBase.prototype.specialFlag = function(flagId) {
    return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(
        trait => trait.dataId === flagId
    );
};

Game_BattlerBase.prototype.collapseType = function() {
    const set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
    return set.length > 0 ? Math.max(...set) : 0;
};

Game_BattlerBase.prototype.partyAbility = function(abilityId) {
    return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(
        trait => trait.dataId === abilityId
    );
};

Game_BattlerBase.prototype.isAutoBattle = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
};

Game_BattlerBase.prototype.isGuard = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
};

Game_BattlerBase.prototype.isSubstitute = function() {
    return (
        this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove()
    );
};

Game_BattlerBase.prototype.isPreserveTp = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
};

Game_BattlerBase.prototype.addParam = function(paramId, value) {
    this._paramPlus[paramId] += value;
    this.refresh();
};

Game_BattlerBase.prototype.setHp = function(hp) {
    this._hp = hp;
    this.refresh();
};

Game_BattlerBase.prototype.setMp = function(mp) {
    this._mp = mp;
    this.refresh();
};

Game_BattlerBase.prototype.setTp = function(tp) {
    this._tp = tp;
    this.refresh();
};

Game_BattlerBase.prototype.maxTp = function() {
    return 100;
};

Game_BattlerBase.prototype.refresh = function() {
    for (const stateId of this.stateResistSet()) {
        this.eraseState(stateId);
    }
    this._hp = this._hp.clamp(0, this.mhp);
    this._mp = this._mp.clamp(0, this.mmp);
    this._tp = this._tp.clamp(0, this.maxTp());
};

Game_BattlerBase.prototype.recoverAll = function() {
    this.clearStates();
    this._hp = this.mhp;
    this._mp = this.mmp;
};

Game_BattlerBase.prototype.hpRate = function() {
    return this.hp / this.mhp;
};

Game_BattlerBase.prototype.mpRate = function() {
    return this.mmp > 0 ? this.mp / this.mmp : 0;
};

Game_BattlerBase.prototype.tpRate = function() {
    return this.tp / this.maxTp();
};

Game_BattlerBase.prototype.hide = function() {
    this._hidden = true;
};

Game_BattlerBase.prototype.appear = function() {
    this._hidden = false;
};

Game_BattlerBase.prototype.isHidden = function() {
    return this._hidden;
};

Game_BattlerBase.prototype.isAppeared = function() {
    return !this.isHidden();
};

Game_BattlerBase.prototype.isDead = function() {
    return this.isAppeared() && this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isAlive = function() {
    return this.isAppeared() && !this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isDying = function() {
    return this.isAlive() && this._hp < this.mhp / 4;
};

Game_BattlerBase.prototype.isRestricted = function() {
    return this.isAppeared() && this.restriction() > 0;
};

Game_BattlerBase.prototype.canInput = function() {
    // prettier-ignore
    return this.isAppeared() && this.isActor() &&
            !this.isRestricted() && !this.isAutoBattle();
};

Game_BattlerBase.prototype.canMove = function() {
    return this.isAppeared() && this.restriction() < 4;
};

Game_BattlerBase.prototype.isConfused = function() {
    return (
        this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3
    );
};

Game_BattlerBase.prototype.confusionLevel = function() {
    return this.isConfused() ? this.restriction() : 0;
};

Game_BattlerBase.prototype.isActor = function() {
    return false;
};

Game_BattlerBase.prototype.isEnemy = function() {
    return false;
};

Game_BattlerBase.prototype.sortStates = function() {
    this._states.sort((a, b) => {
        const p1 = $dataStates[a].priority;
        const p2 = $dataStates[b].priority;
        if (p1 !== p2) {
            return p2 - p1;
        }
        return a - b;
    });
};

Game_BattlerBase.prototype.restriction = function() {
    const restrictions = this.states().map(state => state.restriction);
    return Math.max(0, ...restrictions);
};

Game_BattlerBase.prototype.addNewState = function(stateId) {
    if (stateId === this.deathStateId()) {
        this.die();
    }
    const restricted = this.isRestricted();
    this._states.push(stateId);
    this.sortStates();
    if (!restricted && this.isRestricted()) {
        this.onRestrict();
    }
};

Game_BattlerBase.prototype.onRestrict = function() {
    //
};

Game_BattlerBase.prototype.mostImportantStateText = function() {
    for (const state of this.states()) {
        if (state.message3) {
            return state.message3;
        }
    }
    return "";
};

Game_BattlerBase.prototype.stateMotionIndex = function() {
    const states = this.states();
    if (states.length > 0) {
        return states[0].motion;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.stateOverlayIndex = function() {
    const states = this.states();
    if (states.length > 0) {
        return states[0].overlay;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.isSkillWtypeOk = function(/*skill*/) {
    return true;
};

Game_BattlerBase.prototype.skillMpCost = function(skill) {
    return Math.floor(skill.mpCost * this.mcr);
};

Game_BattlerBase.prototype.skillTpCost = function(skill) {
    return skill.tpCost;
};

Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    return (
        this._tp >= this.skillTpCost(skill) &&
        this._mp >= this.skillMpCost(skill)
    );
};

Game_BattlerBase.prototype.paySkillCost = function(skill) {
    this._mp -= this.skillMpCost(skill);
    this._tp -= this.skillTpCost(skill);
};

Game_BattlerBase.prototype.isOccasionOk = function(item) {
    if ($gameParty.inBattle()) {
        return item.occasion === 0 || item.occasion === 1;
    } else {
        return item.occasion === 0 || item.occasion === 2;
    }
};

Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
    return this.canMove() && this.isOccasionOk(item);
};

Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    return (
        this.meetsUsableItemConditions(skill) &&
        this.isSkillWtypeOk(skill) &&
        this.canPaySkillCost(skill) &&
        !this.isSkillSealed(skill.id) &&
        !this.isSkillTypeSealed(skill.stypeId)
    );
};

Game_BattlerBase.prototype.meetsItemConditions = function(item) {
    return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
};

Game_BattlerBase.prototype.canUse = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isSkill(item)) {
        return this.meetsSkillConditions(item);
    } else if (DataManager.isItem(item)) {
        return this.meetsItemConditions(item);
    } else {
        return false;
    }
};

Game_BattlerBase.prototype.canEquip = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isWeapon(item)) {
        return this.canEquipWeapon(item);
    } else if (DataManager.isArmor(item)) {
        return this.canEquipArmor(item);
    } else {
        return false;
    }
};

Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    return (
        this.isEquipWtypeOk(item.wtypeId) &&
        !this.isEquipTypeSealed(item.etypeId)
    );
};

Game_BattlerBase.prototype.canEquipArmor = function(item) {
    return (
        this.isEquipAtypeOk(item.atypeId) &&
        !this.isEquipTypeSealed(item.etypeId)
    );
};

Game_BattlerBase.prototype.guardSkillId = function() {
    return 2;
};

Game_BattlerBase.prototype.canAttack = function() {
    return this.canUse($dataSkills[this.attackSkillId()]);
};

Game_BattlerBase.prototype.canGuard = function() {
    return this.canUse($dataSkills[this.guardSkillId()]);
};
