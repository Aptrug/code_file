//=============================================================================
// rmmz_scenes.js v1.9.0
//=============================================================================

//-----------------------------------------------------------------------------
// Scene_Base
//
// The superclass of all scenes within the game.

function Scene_Base() {
    this.initialize(...arguments);
}

Scene_Base.prototype = Object.create(Stage.prototype);
Scene_Base.prototype.constructor = Scene_Base;

Scene_Base.prototype.initialize = function() {
    Stage.prototype.initialize.call(this);
    this._started = false;
    this._active = false;
    this._fadeSign = 0;
    this._fadeDuration = 0;
    this._fadeWhite = 0;
    this._fadeOpacity = 0;
    this.createColorFilter();
};

Scene_Base.prototype.create = function() {
    //
};

Scene_Base.prototype.isActive = function() {
    return this._active;
};

Scene_Base.prototype.isReady = function() {
    return (
        ImageManager.isReady() &&
        EffectManager.isReady() &&
        FontManager.isReady()
    );
};

Scene_Base.prototype.start = function() {
    this._started = true;
    this._active = true;
};

Scene_Base.prototype.update = function() {
    this.updateFade();
    this.updateColorFilter();
    this.updateChildren();
    AudioManager.checkErrors();
};

Scene_Base.prototype.stop = function() {
    this._active = false;
};

Scene_Base.prototype.isStarted = function() {
    return this._started;
};

Scene_Base.prototype.isBusy = function() {
    return this.isFading();
};

Scene_Base.prototype.isFading = function() {
    return this._fadeDuration > 0;
};

Scene_Base.prototype.terminate = function() {
    //
};

Scene_Base.prototype.createWindowLayer = function() {
    this._windowLayer = new WindowLayer();
    this._windowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._windowLayer);
};

Scene_Base.prototype.addWindow = function(window) {
    this._windowLayer.addChild(window);
};

Scene_Base.prototype.startFadeIn = function(duration, white) {
    this._fadeSign = 1;
    this._fadeDuration = duration || 30;
    this._fadeWhite = white;
    this._fadeOpacity = 255;
    this.updateColorFilter();
};

Scene_Base.prototype.startFadeOut = function(duration, white) {
    this._fadeSign = -1;
    this._fadeDuration = duration || 30;
    this._fadeWhite = white;
    this._fadeOpacity = 0;
    this.updateColorFilter();
};

Scene_Base.prototype.createColorFilter = function() {
    this._colorFilter = new ColorFilter();
    this.filters = [this._colorFilter];
};

Scene_Base.prototype.updateColorFilter = function() {
    const c = this._fadeWhite ? 255 : 0;
    const blendColor = [c, c, c, this._fadeOpacity];
    this._colorFilter.setBlendColor(blendColor);
};

Scene_Base.prototype.updateFade = function() {
    if (this._fadeDuration > 0) {
        const d = this._fadeDuration;
        if (this._fadeSign > 0) {
            this._fadeOpacity -= this._fadeOpacity / d;
        } else {
            this._fadeOpacity += (255 - this._fadeOpacity) / d;
        }
        this._fadeDuration--;
    }
};

Scene_Base.prototype.updateChildren = function() {
    for (const child of this.children) {
        if (child.update) {
            child.update();
        }
    }
};

Scene_Base.prototype.popScene = function() {
    SceneManager.pop();
};

Scene_Base.prototype.checkGameover = function() {
    if ($gameParty.isAllDead()) {
        SceneManager.goto(Scene_Gameover);
    }
};

Scene_Base.prototype.fadeOutAll = function() {
    const time = this.slowFadeSpeed() / 60;
    AudioManager.fadeOutBgm(time);
    AudioManager.fadeOutBgs(time);
    AudioManager.fadeOutMe(time);
    this.startFadeOut(this.slowFadeSpeed());
};

Scene_Base.prototype.fadeSpeed = function() {
    return 24;
};

Scene_Base.prototype.slowFadeSpeed = function() {
    return this.fadeSpeed() * 2;
};

Scene_Base.prototype.scaleSprite = function(sprite) {
    const ratioX = Graphics.width / sprite.bitmap.width;
    const ratioY = Graphics.height / sprite.bitmap.height;
    const scale = Math.max(ratioX, ratioY, 1.0);
    sprite.scale.x = scale;
    sprite.scale.y = scale;
};

Scene_Base.prototype.centerSprite = function(sprite) {
    sprite.x = Graphics.width / 2;
    sprite.y = Graphics.height / 2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
};

Scene_Base.prototype.isBottomHelpMode = function() {
    return true;
};

Scene_Base.prototype.isBottomButtonMode = function() {
    return false;
};

Scene_Base.prototype.isRightInputMode = function() {
    return true;
};

Scene_Base.prototype.mainCommandWidth = function() {
    return 240;
};

Scene_Base.prototype.buttonAreaTop = function() {
    if (this.isBottomButtonMode()) {
        return Graphics.boxHeight - this.buttonAreaHeight();
    } else {
        return 0;
    }
};

Scene_Base.prototype.buttonAreaBottom = function() {
    return this.buttonAreaTop() + this.buttonAreaHeight();
};

Scene_Base.prototype.buttonAreaHeight = function() {
    return 52;
};

Scene_Base.prototype.buttonY = function() {
    const offsetY = Math.floor((this.buttonAreaHeight() - 48) / 2);
    return this.buttonAreaTop() + offsetY;
};

Scene_Base.prototype.calcWindowHeight = function(numLines, selectable) {
    if (selectable) {
        return Window_Selectable.prototype.fittingHeight(numLines);
    } else {
        return Window_Base.prototype.fittingHeight(numLines);
    }
};

Scene_Base.prototype.requestAutosave = function() {
    if (this.isAutosaveEnabled()) {
        this.executeAutosave();
    }
};

Scene_Base.prototype.isAutosaveEnabled = function() {
    return (
        !DataManager.isBattleTest() &&
        !DataManager.isEventTest() &&
        $gameSystem.isAutosaveEnabled() &&
        $gameSystem.isSaveEnabled()
    );
};

Scene_Base.prototype.executeAutosave = function() {
    $gameSystem.onBeforeSave();
    DataManager.saveGame(0)
        .then(() => this.onAutosaveSuccess())
        .catch(() => this.onAutosaveFailure());
};

Scene_Base.prototype.onAutosaveSuccess = function() {
    //
};

Scene_Base.prototype.onAutosaveFailure = function() {
    //
};

//-----------------------------------------------------------------------------
// Scene_Boot
//
// The scene class for initializing the entire game.

function Scene_Boot() {
    this.initialize(...arguments);
}

Scene_Boot.prototype = Object.create(Scene_Base.prototype);
Scene_Boot.prototype.constructor = Scene_Boot;

Scene_Boot.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this._databaseLoaded = false;
};

Scene_Boot.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    DataManager.loadDatabase();
    StorageManager.updateForageKeys();
};

Scene_Boot.prototype.isReady = function() {
    if (!this._databaseLoaded) {
        if (
            DataManager.isDatabaseLoaded() &&
            StorageManager.forageKeysUpdated()
        ) {
            this._databaseLoaded = true;
            this.onDatabaseLoaded();
        }
        return false;
    }
    return Scene_Base.prototype.isReady.call(this) && this.isPlayerDataLoaded();
};

Scene_Boot.prototype.onDatabaseLoaded = function() {
    this.setEncryptionInfo();
    this.loadSystemImages();
    this.loadPlayerData();
    this.loadGameFonts();
};

Scene_Boot.prototype.setEncryptionInfo = function() {
    const hasImages = $dataSystem.hasEncryptedImages;
    const hasAudio = $dataSystem.hasEncryptedAudio;
    const key = $dataSystem.encryptionKey;
    Utils.setEncryptionInfo(hasImages, hasAudio, key);
};

Scene_Boot.prototype.loadSystemImages = function() {
    ColorManager.loadWindowskin();
    ImageManager.loadSystem("IconSet");
};

Scene_Boot.prototype.loadPlayerData = function() {
    DataManager.loadGlobalInfo();
    ConfigManager.load();
};

Scene_Boot.prototype.loadGameFonts = function() {
    const advanced = $dataSystem.advanced;
    FontManager.load("rmmz-mainfont", advanced.mainFontFilename);
    FontManager.load("rmmz-numberfont", advanced.numberFontFilename);
};

Scene_Boot.prototype.isPlayerDataLoaded = function() {
    return DataManager.isGlobalInfoLoaded() && ConfigManager.isLoaded();
};

Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else if (DataManager.isTitleSkip()) {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    } else {
        this.startNormalGame();
    }
    this.resizeScreen();
    this.updateDocumentTitle();
};

Scene_Boot.prototype.startNormalGame = function() {
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    Window_TitleCommand.initCommandPosition();
    SceneManager.goto(Scene_Splash);
};

Scene_Boot.prototype.resizeScreen = function() {
    const screenWidth = $dataSystem.advanced.screenWidth;
    const screenHeight = $dataSystem.advanced.screenHeight;
    Graphics.resize(screenWidth, screenHeight);
    Graphics.defaultScale = this.screenScale();
    this.adjustBoxSize();
    this.adjustWindow();
};

Scene_Boot.prototype.adjustBoxSize = function() {
    const uiAreaWidth = $dataSystem.advanced.uiAreaWidth;
    const uiAreaHeight = $dataSystem.advanced.uiAreaHeight;
    const boxMargin = 4;
    Graphics.boxWidth = uiAreaWidth - boxMargin * 2;
    Graphics.boxHeight = uiAreaHeight - boxMargin * 2;
};

Scene_Boot.prototype.adjustWindow = function() {
    if (Utils.isNwjs()) {
        const scale = this.screenScale();
        const xDelta = Graphics.width * scale - window.innerWidth;
        const yDelta = Graphics.height * scale - window.innerHeight;
        window.moveBy(-xDelta / 2, -yDelta / 2);
        window.resizeBy(xDelta, yDelta);
    }
};

Scene_Boot.prototype.screenScale = function() {
    if ("screenScale" in $dataSystem.advanced) {
        return $dataSystem.advanced.screenScale;
    } else {
        return 1;
    }
};

Scene_Boot.prototype.updateDocumentTitle = function() {
    document.title = $dataSystem.gameTitle;
};

Scene_Boot.prototype.checkPlayerLocation = function() {
    if ($dataSystem.startMapId === 0) {
        throw new Error("Player's starting position is not set");
    }
};

//-----------------------------------------------------------------------------
// Scene_Splash
//
// The scene class of the splash screen.

function Scene_Splash() {
    this.initialize(...arguments);
}

Scene_Splash.prototype = Object.create(Scene_Base.prototype);
Scene_Splash.prototype.constructor = Scene_Splash;

Scene_Splash.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    this.initWaitCount();
};

Scene_Splash.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    if (this.isEnabled()) {
        this.createBackground();
    }
};

Scene_Splash.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    if (this.isEnabled()) {
        this.adjustBackground();
        this.startFadeIn(this.fadeSpeed(), false);
    }
};

Scene_Splash.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if (this.isActive()) {
        if (!this.updateWaitCount()) {
            this.gotoTitle();
        }
        this.checkSkip();
    }
};

Scene_Splash.prototype.stop = function() {
    Scene_Base.prototype.stop.call(this);
    if (this.isEnabled()) {
        this.startFadeOut(this.fadeSpeed());
    }
};

Scene_Splash.prototype.createBackground = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = ImageManager.loadSystem("Splash");
    this.addChild(this._backSprite);
};

Scene_Splash.prototype.adjustBackground = function() {
    this.scaleSprite(this._backSprite);
    this.centerSprite(this._backSprite);
};

Scene_Splash.prototype.isEnabled = function() {
    return $dataSystem.optSplashScreen;
};

Scene_Splash.prototype.initWaitCount = function() {
    if (this.isEnabled()) {
        this._waitCount = 120;
    } else {
        this._waitCount = 0;
    }
};

Scene_Splash.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};

Scene_Splash.prototype.checkSkip = function() {
    if (Input.isTriggered("ok") || TouchInput.isTriggered()) {
        this._waitCount = 0;
    }
};

Scene_Splash.prototype.gotoTitle = function() {
    SceneManager.goto(Scene_Title);
};

//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.

function Scene_Title() {
    this.initialize(...arguments);
}

Scene_Title.prototype = Object.create(Scene_Base.prototype);
Scene_Title.prototype.constructor = Scene_Title;

Scene_Title.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Title.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createForeground();
    this.createWindowLayer();
    this.createCommandWindow();
};

Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    this.adjustBackground();
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
};

Scene_Title.prototype.update = function() {
    if (!this.isBusy()) {
        this._commandWindow.open();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Title.prototype.isBusy = function() {
    return (
        this._commandWindow.isClosing() ||
        Scene_Base.prototype.isBusy.call(this)
    );
};

Scene_Title.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    SceneManager.snapForBackground();
    if (this._gameTitleSprite) {
        this._gameTitleSprite.bitmap.destroy();
    }
};

Scene_Title.prototype.createBackground = function() {
    this._backSprite1 = new Sprite(
        ImageManager.loadTitle1($dataSystem.title1Name)
    );
    this._backSprite2 = new Sprite(
        ImageManager.loadTitle2($dataSystem.title2Name)
    );
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
};

Scene_Title.prototype.createForeground = function() {
    this._gameTitleSprite = new Sprite(
        new Bitmap(Graphics.width, Graphics.height)
    );
    this.addChild(this._gameTitleSprite);
    if ($dataSystem.optDrawTitle) {
        this.drawGameTitle();
    }
};

Scene_Title.prototype.drawGameTitle = function() {
    const x = 20;
    const y = Graphics.height / 4;
    const maxWidth = Graphics.width - x * 2;
    const text = $dataSystem.gameTitle;
    const bitmap = this._gameTitleSprite.bitmap;
    bitmap.fontFace = $gameSystem.mainFontFace();
    bitmap.outlineColor = "black";
    bitmap.outlineWidth = 8;
    bitmap.fontSize = 72;
    bitmap.drawText(text, x, y, maxWidth, 48, "center");
};

Scene_Title.prototype.adjustBackground = function() {
    this.scaleSprite(this._backSprite1);
    this.scaleSprite(this._backSprite2);
    this.centerSprite(this._backSprite1);
    this.centerSprite(this._backSprite2);
};

Scene_Title.prototype.createCommandWindow = function() {
    const background = $dataSystem.titleCommandWindow.background;
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_TitleCommand(rect);
    this._commandWindow.setBackgroundType(background);
    this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
    this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
    this._commandWindow.setHandler("options", this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Title.prototype.commandWindowRect = function() {
    const offsetX = $dataSystem.titleCommandWindow.offsetX;
    const offsetY = $dataSystem.titleCommandWindow.offsetY;
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(3, true);
    const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
    const wy = Graphics.boxHeight - wh - 96 + offsetY;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Title.prototype.commandNewGame = function() {
    DataManager.setupNewGame();
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};

Scene_Title.prototype.commandContinue = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Load);
};

Scene_Title.prototype.commandOptions = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Options);
};

Scene_Title.prototype.playTitleMusic = function() {
    AudioManager.playBgm($dataSystem.titleBgm);
    AudioManager.stopBgs();
    AudioManager.stopMe();
};

//-----------------------------------------------------------------------------
// Scene_Message
//
// The superclass of Scene_Map and Scene_Battle.

function Scene_Message() {
    this.initialize(...arguments);
}

Scene_Message.prototype = Object.create(Scene_Base.prototype);
Scene_Message.prototype.constructor = Scene_Message;

Scene_Message.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Message.prototype.isMessageWindowClosing = function() {
    return this._messageWindow.isClosing();
};

Scene_Message.prototype.createAllWindows = function() {
    this.createMessageWindow();
    this.createScrollTextWindow();
    this.createGoldWindow();
    this.createNameBoxWindow();
    this.createChoiceListWindow();
    this.createNumberInputWindow();
    this.createEventItemWindow();
    this.associateWindows();
};

Scene_Message.prototype.createMessageWindow = function() {
    const rect = this.messageWindowRect();
    this._messageWindow = new Window_Message(rect);
    this.addWindow(this._messageWindow);
};

Scene_Message.prototype.messageWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(4, false) + 8;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Message.prototype.createScrollTextWindow = function() {
    const rect = this.scrollTextWindowRect();
    this._scrollTextWindow = new Window_ScrollText(rect);
    this.addWindow(this._scrollTextWindow);
};

Scene_Message.prototype.scrollTextWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Message.prototype.createGoldWindow = function() {
    const rect = this.goldWindowRect();
    this._goldWindow = new Window_Gold(rect);
    this._goldWindow.openness = 0;
    this.addWindow(this._goldWindow);
};

Scene_Message.prototype.goldWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(1, true);
    const wx = Graphics.boxWidth - ww;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Message.prototype.createNameBoxWindow = function() {
    this._nameBoxWindow = new Window_NameBox();
    this.addWindow(this._nameBoxWindow);
};

Scene_Message.prototype.createChoiceListWindow = function() {
    this._choiceListWindow = new Window_ChoiceList();
    this.addWindow(this._choiceListWindow);
};

Scene_Message.prototype.createNumberInputWindow = function() {
    this._numberInputWindow = new Window_NumberInput();
    this.addWindow(this._numberInputWindow);
};

Scene_Message.prototype.createEventItemWindow = function() {
    const rect = this.eventItemWindowRect();
    this._eventItemWindow = new Window_EventItem(rect);
    this.addWindow(this._eventItemWindow);
};

Scene_Message.prototype.eventItemWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(4, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Message.prototype.associateWindows = function() {
    const messageWindow = this._messageWindow;
    messageWindow.setGoldWindow(this._goldWindow);
    messageWindow.setNameBoxWindow(this._nameBoxWindow);
    messageWindow.setChoiceListWindow(this._choiceListWindow);
    messageWindow.setNumberInputWindow(this._numberInputWindow);
    messageWindow.setEventItemWindow(this._eventItemWindow);
    this._nameBoxWindow.setMessageWindow(messageWindow);
    this._choiceListWindow.setMessageWindow(messageWindow);
    this._numberInputWindow.setMessageWindow(messageWindow);
    this._eventItemWindow.setMessageWindow(messageWindow);
};

Scene_Message.prototype.cancelMessageWait = function() {
    this._messageWindow.cancelWait();
};

//-----------------------------------------------------------------------------
// Scene_Map
//
// The scene class of the map screen.

function Scene_Map() {
    this.initialize(...arguments);
}

Scene_Map.prototype = Object.create(Scene_Message.prototype);
Scene_Map.prototype.constructor = Scene_Map;

Scene_Map.prototype.initialize = function() {
    Scene_Message.prototype.initialize.call(this);
    this._waitCount = 0;
    this._encounterEffectDuration = 0;
    this._mapLoaded = false;
    this._touchCount = 0;
    this._menuEnabled = false;
};

Scene_Map.prototype.create = function() {
    Scene_Message.prototype.create.call(this);
    this._transfer = $gamePlayer.isTransferring();
    this._lastMapWasNull = !$dataMap;
    if (this._transfer) {
        DataManager.loadMapData($gamePlayer.newMapId());
        this.onTransfer();
    } else {
        DataManager.loadMapData($gameMap.mapId());
    }
};

Scene_Map.prototype.isReady = function() {
    if (!this._mapLoaded && DataManager.isMapLoaded()) {
        this.onMapLoaded();
        this._mapLoaded = true;
    }
    return this._mapLoaded && Scene_Message.prototype.isReady.call(this);
};

Scene_Map.prototype.onMapLoaded = function() {
    if (this._transfer) {
        $gamePlayer.performTransfer();
    }
    this.createDisplayObjects();
};

Scene_Map.prototype.onTransfer = function() {
    ImageManager.clear();
    EffectManager.clear();
};

Scene_Map.prototype.start = function() {
    Scene_Message.prototype.start.call(this);
    SceneManager.clearStack();
    if (this._transfer) {
        this.fadeInForTransfer();
        this.onTransferEnd();
    } else if (this.needsFadeIn()) {
        this.startFadeIn(this.fadeSpeed(), false);
    }
    this.menuCalling = false;
};

Scene_Map.prototype.onTransferEnd = function() {
    this._mapNameWindow.open();
    $gameMap.autoplay();
    if (this.shouldAutosave()) {
        this.requestAutosave();
    }
};

Scene_Map.prototype.shouldAutosave = function() {
    return !this._lastMapWasNull;
};

Scene_Map.prototype.update = function() {
    Scene_Message.prototype.update.call(this);
    this.updateDestination();
    this.updateMenuButton();
    this.updateMapNameWindow();
    this.updateMainMultiply();
    if (this.isSceneChangeOk()) {
        this.updateScene();
    } else if (SceneManager.isNextScene(Scene_Battle)) {
        this.updateEncounterEffect();
    }
    this.updateWaitCount();
};

Scene_Map.prototype.updateMainMultiply = function() {
    if (this.isFastForward()) {
        this.cancelMessageWait();
        this.updateMain();
    }
    this.updateMain();
};

Scene_Map.prototype.updateMain = function() {
    $gameMap.update(this.isActive());
    $gamePlayer.update(this.isPlayerActive());
    $gameTimer.update(this.isActive());
    $gameScreen.update();
};

Scene_Map.prototype.isPlayerActive = function() {
    return this.isActive() && !this.isFading();
};

Scene_Map.prototype.isFastForward = function() {
    return (
        $gameMap.isEventRunning() &&
        !SceneManager.isSceneChanging() &&
        (Input.isLongPressed("ok") || TouchInput.isLongPressed())
    );
};

Scene_Map.prototype.stop = function() {
    Scene_Message.prototype.stop.call(this);
    $gamePlayer.straighten();
    this._mapNameWindow.close();
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else if (SceneManager.isNextScene(Scene_Map)) {
        this.fadeOutForTransfer();
    } else if (SceneManager.isNextScene(Scene_Battle)) {
        this.launchBattle();
    }
};

Scene_Map.prototype.isBusy = function() {
    return (
        this.isMessageWindowClosing() ||
        this._waitCount > 0 ||
        this._encounterEffectDuration > 0 ||
        Scene_Message.prototype.isBusy.call(this)
    );
};

Scene_Map.prototype.terminate = function() {
    Scene_Message.prototype.terminate.call(this);
    if (!SceneManager.isNextScene(Scene_Battle)) {
        this._spriteset.update();
        this._mapNameWindow.hide();
        this.hideMenuButton();
        SceneManager.snapForBackground();
    }
    $gameScreen.clearZoom();
};

Scene_Map.prototype.needsFadeIn = function() {
    return (
        SceneManager.isPreviousScene(Scene_Battle) ||
        SceneManager.isPreviousScene(Scene_Load)
    );
};

Scene_Map.prototype.needsSlowFadeOut = function() {
    return (
        SceneManager.isNextScene(Scene_Title) ||
        SceneManager.isNextScene(Scene_Gameover)
    );
};

Scene_Map.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};

Scene_Map.prototype.updateDestination = function() {
    if (this.isMapTouchOk()) {
        this.processMapTouch();
    } else {
        $gameTemp.clearDestination();
        this._touchCount = 0;
    }
};

Scene_Map.prototype.updateMenuButton = function() {
    if (this._menuButton) {
        const menuEnabled = this.isMenuEnabled();
        if (menuEnabled === this._menuEnabled) {
            this._menuButton.visible = this._menuEnabled;
        } else {
            this._menuEnabled = menuEnabled;
        }
    }
};

Scene_Map.prototype.hideMenuButton = function() {
    if (this._menuButton) {
        this._menuButton.visible = false;
        this._menuEnabled = false;
    }
};

Scene_Map.prototype.updateMapNameWindow = function() {
    if ($gameMessage.isBusy()) {
        this._mapNameWindow.close();
    }
};

Scene_Map.prototype.isMenuEnabled = function() {
    return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
};

Scene_Map.prototype.isMapTouchOk = function() {
    return this.isActive() && $gamePlayer.canMove();
};

Scene_Map.prototype.processMapTouch = function() {
    if (TouchInput.isTriggered() || this._touchCount > 0) {
        if (TouchInput.isPressed() && !this.isAnyButtonPressed()) {
            if (this._touchCount === 0 || this._touchCount >= 15) {
                this.onMapTouch();
            }
            this._touchCount++;
        } else {
            this._touchCount = 0;
        }
    }
};

Scene_Map.prototype.isAnyButtonPressed = function() {
    return this._menuButton && this._menuButton.isPressed();
};

Scene_Map.prototype.onMapTouch = function() {
    const x = $gameMap.canvasToMapX(TouchInput.x);
    const y = $gameMap.canvasToMapY(TouchInput.y);
    $gameTemp.setDestination(x, y);
};

Scene_Map.prototype.isSceneChangeOk = function() {
    return this.isActive() && !$gameMessage.isBusy();
};

Scene_Map.prototype.updateScene = function() {
    this.checkGameover();
    if (!SceneManager.isSceneChanging()) {
        this.updateTransferPlayer();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateEncounter();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateCallMenu();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateCallDebug();
    }
};

Scene_Map.prototype.createDisplayObjects = function() {
    this.createSpriteset();
    this.createWindowLayer();
    this.createAllWindows();
    this.createButtons();
};

Scene_Map.prototype.createSpriteset = function() {
    this._spriteset = new Spriteset_Map();
    this.addChild(this._spriteset);
    this._spriteset.update();
};

Scene_Map.prototype.createAllWindows = function() {
    this.createMapNameWindow();
    Scene_Message.prototype.createAllWindows.call(this);
};

Scene_Map.prototype.createMapNameWindow = function() {
    const rect = this.mapNameWindowRect();
    this._mapNameWindow = new Window_MapName(rect);
    this.addWindow(this._mapNameWindow);
};

Scene_Map.prototype.mapNameWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = 360;
    const wh = this.calcWindowHeight(1, false);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Map.prototype.createButtons = function() {
    if (ConfigManager.touchUI) {
        this.createMenuButton();
    }
};

Scene_Map.prototype.createMenuButton = function() {
    this._menuButton = new Sprite_Button("menu");
    this._menuButton.x = Graphics.boxWidth - this._menuButton.width - 4;
    this._menuButton.y = this.buttonY();
    this._menuButton.visible = false;
    this.addWindow(this._menuButton);
};

Scene_Map.prototype.updateTransferPlayer = function() {
    if ($gamePlayer.isTransferring()) {
        SceneManager.goto(Scene_Map);
    }
};

Scene_Map.prototype.updateEncounter = function() {
    if ($gamePlayer.executeEncounter()) {
        SceneManager.push(Scene_Battle);
    }
};

Scene_Map.prototype.updateCallMenu = function() {
    if (this.isMenuEnabled()) {
        if (this.isMenuCalled()) {
            this.menuCalling = true;
        }
        if (this.menuCalling && !$gamePlayer.isMoving()) {
            this.callMenu();
        }
    } else {
        this.menuCalling = false;
    }
};

Scene_Map.prototype.isMenuCalled = function() {
    return Input.isTriggered("menu") || TouchInput.isCancelled();
};

Scene_Map.prototype.callMenu = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_Menu);
    Window_MenuCommand.initCommandPosition();
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};

Scene_Map.prototype.updateCallDebug = function() {
    if (this.isDebugCalled()) {
        SceneManager.push(Scene_Debug);
    }
};

Scene_Map.prototype.isDebugCalled = function() {
    return Input.isTriggered("debug") && $gameTemp.isPlaytest();
};

Scene_Map.prototype.fadeInForTransfer = function() {
    const fadeType = $gamePlayer.fadeType();
    switch (fadeType) {
        case 0:
        case 1:
            this.startFadeIn(this.fadeSpeed(), fadeType === 1);
            break;
    }
};

Scene_Map.prototype.fadeOutForTransfer = function() {
    const fadeType = $gamePlayer.fadeType();
    switch (fadeType) {
        case 0:
        case 1:
            this.startFadeOut(this.fadeSpeed(), fadeType === 1);
            break;
    }
};

Scene_Map.prototype.launchBattle = function() {
    BattleManager.saveBgmAndBgs();
    this.stopAudioOnBattleStart();
    SoundManager.playBattleStart();
    this.startEncounterEffect();
    this._mapNameWindow.hide();
};

Scene_Map.prototype.stopAudioOnBattleStart = function() {
    if (!AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
        AudioManager.stopBgm();
    }
    AudioManager.stopBgs();
    AudioManager.stopMe();
    AudioManager.stopSe();
};

Scene_Map.prototype.startEncounterEffect = function() {
    this._spriteset.hideCharacters();
    this._encounterEffectDuration = this.encounterEffectSpeed();
};

Scene_Map.prototype.updateEncounterEffect = function() {
    if (this._encounterEffectDuration > 0) {
        this._encounterEffectDuration--;
        const speed = this.encounterEffectSpeed();
        const n = speed - this._encounterEffectDuration;
        const p = n / speed;
        const q = ((p - 1) * 20 * p + 5) * p + 1;
        const zoomX = $gamePlayer.screenX();
        const zoomY = $gamePlayer.screenY() - 24;
        if (n === 2) {
            $gameScreen.setZoom(zoomX, zoomY, 1);
            this.snapForBattleBackground();
            this.startFlashForEncounter(speed / 2);
        }
        $gameScreen.setZoom(zoomX, zoomY, q);
        if (n === Math.floor(speed / 6)) {
            this.startFlashForEncounter(speed / 2);
        }
        if (n === Math.floor(speed / 2)) {
            BattleManager.playBattleBgm();
            this.startFadeOut(this.fadeSpeed());
        }
    }
};

Scene_Map.prototype.snapForBattleBackground = function() {
    this._windowLayer.visible = false;
    SceneManager.snapForBackground();
    this._windowLayer.visible = true;
};

Scene_Map.prototype.startFlashForEncounter = function(duration) {
    const color = [255, 255, 255, 255];
    $gameScreen.startFlash(color, duration);
};

Scene_Map.prototype.encounterEffectSpeed = function() {
    return 60;
};

//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// The superclass of all the menu-type scenes.

function Scene_MenuBase() {
    this.initialize(...arguments);
}

Scene_MenuBase.prototype = Object.create(Scene_Base.prototype);
Scene_MenuBase.prototype.constructor = Scene_MenuBase;

Scene_MenuBase.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_MenuBase.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.updateActor();
    this.createWindowLayer();
    this.createButtons();
};

Scene_MenuBase.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    this.updatePageButtons();
};

Scene_MenuBase.prototype.helpAreaTop = function() {
    if (this.isBottomHelpMode()) {
        return this.mainAreaBottom();
    } else if (this.isBottomButtonMode()) {
        return 0;
    } else {
        return this.buttonAreaBottom();
    }
};

Scene_MenuBase.prototype.helpAreaBottom = function() {
    return this.helpAreaTop() + this.helpAreaHeight();
};

Scene_MenuBase.prototype.helpAreaHeight = function() {
    return this.calcWindowHeight(2, false);
};

Scene_MenuBase.prototype.mainAreaTop = function() {
    if (!this.isBottomHelpMode()) {
        return this.helpAreaBottom();
    } else if (this.isBottomButtonMode()) {
        return 0;
    } else {
        return this.buttonAreaBottom();
    }
};

Scene_MenuBase.prototype.mainAreaBottom = function() {
    return this.mainAreaTop() + this.mainAreaHeight();
};

Scene_MenuBase.prototype.mainAreaHeight = function() {
    return Graphics.boxHeight - this.buttonAreaHeight() - this.helpAreaHeight();
};

Scene_MenuBase.prototype.actor = function() {
    return this._actor;
};

Scene_MenuBase.prototype.updateActor = function() {
    this._actor = $gameParty.menuActor();
};

Scene_MenuBase.prototype.createBackground = function() {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    this.setBackgroundOpacity(192);
};

Scene_MenuBase.prototype.setBackgroundOpacity = function(opacity) {
    this._backgroundSprite.opacity = opacity;
};

Scene_MenuBase.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

Scene_MenuBase.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_MenuBase.prototype.createButtons = function() {
    if (ConfigManager.touchUI) {
        if (this.needsCancelButton()) {
            this.createCancelButton();
        }
        if (this.needsPageButtons()) {
            this.createPageButtons();
        }
    }
};

Scene_MenuBase.prototype.needsCancelButton = function() {
    return true;
};

Scene_MenuBase.prototype.createCancelButton = function() {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
    this._cancelButton.y = this.buttonY();
    this.addWindow(this._cancelButton);
};

Scene_MenuBase.prototype.needsPageButtons = function() {
    return false;
};

Scene_MenuBase.prototype.createPageButtons = function() {
    this._pageupButton = new Sprite_Button("pageup");
    this._pageupButton.x = 4;
    this._pageupButton.y = this.buttonY();
    const pageupRight = this._pageupButton.x + this._pageupButton.width;
    this._pagedownButton = new Sprite_Button("pagedown");
    this._pagedownButton.x = pageupRight + 4;
    this._pagedownButton.y = this.buttonY();
    this.addWindow(this._pageupButton);
    this.addWindow(this._pagedownButton);
    this._pageupButton.setClickHandler(this.previousActor.bind(this));
    this._pagedownButton.setClickHandler(this.nextActor.bind(this));
};

Scene_MenuBase.prototype.updatePageButtons = function() {
    if (this._pageupButton && this._pagedownButton) {
        const enabled = this.arePageButtonsEnabled();
        this._pageupButton.visible = enabled;
        this._pagedownButton.visible = enabled;
    }
};

Scene_MenuBase.prototype.arePageButtonsEnabled = function() {
    return true;
};

Scene_MenuBase.prototype.nextActor = function() {
    $gameParty.makeMenuActorNext();
    this.updateActor();
    this.onActorChange();
};

Scene_MenuBase.prototype.previousActor = function() {
    $gameParty.makeMenuActorPrevious();
    this.updateActor();
    this.onActorChange();
};

Scene_MenuBase.prototype.onActorChange = function() {
    SoundManager.playCursor();
};

//-----------------------------------------------------------------------------
// Scene_Menu
//
// The scene class of the menu screen.

function Scene_Menu() {
    this.initialize(...arguments);
}

Scene_Menu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Menu.prototype.constructor = Scene_Menu;

Scene_Menu.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Menu.prototype.helpAreaHeight = function() {
    return 0;
};

Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createGoldWindow();
    this.createStatusWindow();
};

Scene_Menu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
};

Scene_Menu.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(commandWindow);
    this._commandWindow = commandWindow;
};

Scene_Menu.prototype.commandWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.mainAreaHeight() - this.goldWindowRect().height;
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.createGoldWindow = function() {
    const rect = this.goldWindowRect();
    this._goldWindow = new Window_Gold(rect);
    this.addWindow(this._goldWindow);
};

Scene_Menu.prototype.goldWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(1, true);
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaBottom() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_MenuStatus(rect);
    this.addWindow(this._statusWindow);
};

Scene_Menu.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth - this.mainCommandWidth();
    const wh = this.mainAreaHeight();
    const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.commandItem = function() {
    SceneManager.push(Scene_Item);
};

Scene_Menu.prototype.commandPersonal = function() {
    this._statusWindow.setFormationMode(false);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
    this._statusWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
};

Scene_Menu.prototype.commandFormation = function() {
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
    this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
};

Scene_Menu.prototype.commandOptions = function() {
    SceneManager.push(Scene_Options);
};

Scene_Menu.prototype.commandSave = function() {
    SceneManager.push(Scene_Save);
};

Scene_Menu.prototype.commandGameEnd = function() {
    SceneManager.push(Scene_GameEnd);
};

Scene_Menu.prototype.onPersonalOk = function() {
    switch (this._commandWindow.currentSymbol()) {
        case "skill":
            SceneManager.push(Scene_Skill);
            break;
        case "equip":
            SceneManager.push(Scene_Equip);
            break;
        case "status":
            SceneManager.push(Scene_Status);
            break;
    }
};

Scene_Menu.prototype.onPersonalCancel = function() {
    this._statusWindow.deselect();
    this._commandWindow.activate();
};

Scene_Menu.prototype.onFormationOk = function() {
    const index = this._statusWindow.index();
    const pendingIndex = this._statusWindow.pendingIndex();
    if (pendingIndex >= 0) {
        $gameParty.swapOrder(index, pendingIndex);
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.redrawItem(index);
    } else {
        this._statusWindow.setPendingIndex(index);
    }
    this._statusWindow.activate();
};

Scene_Menu.prototype.onFormationCancel = function() {
    if (this._statusWindow.pendingIndex() >= 0) {
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.activate();
    } else {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }
};

//-----------------------------------------------------------------------------
// Scene_ItemBase
//
// The superclass of Scene_Item and Scene_Skill.

function Scene_ItemBase() {
    this.initialize(...arguments);
}

Scene_ItemBase.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ItemBase.prototype.constructor = Scene_ItemBase;

Scene_ItemBase.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_ItemBase.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
};

Scene_ItemBase.prototype.createActorWindow = function() {
    const rect = this.actorWindowRect();
    this._actorWindow = new Window_MenuActor(rect);
    this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
    this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

Scene_ItemBase.prototype.actorWindowRect = function() {
    const wx = 0;
    const wy = Math.min(this.mainAreaTop(), this.helpAreaTop());
    const ww = Graphics.boxWidth - this.mainCommandWidth();
    const wh = this.mainAreaHeight() + this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_ItemBase.prototype.item = function() {
    return this._itemWindow.item();
};

Scene_ItemBase.prototype.user = function() {
    return null;
};

Scene_ItemBase.prototype.isCursorLeft = function() {
    return this._itemWindow.index() % 2 === 0;
};

Scene_ItemBase.prototype.showActorWindow = function() {
    if (this.isCursorLeft()) {
        this._actorWindow.x = Graphics.boxWidth - this._actorWindow.width;
    } else {
        this._actorWindow.x = 0;
    }
    this._actorWindow.show();
    this._actorWindow.activate();
};

Scene_ItemBase.prototype.hideActorWindow = function() {
    this._actorWindow.hide();
    this._actorWindow.deactivate();
};

Scene_ItemBase.prototype.isActorWindowActive = function() {
    return this._actorWindow && this._actorWindow.active;
};

Scene_ItemBase.prototype.onActorOk = function() {
    if (this.canUse()) {
        this.useItem();
    } else {
        SoundManager.playBuzzer();
    }
};

Scene_ItemBase.prototype.onActorCancel = function() {
    this.hideActorWindow();
    this.activateItemWindow();
};

Scene_ItemBase.prototype.determineItem = function() {
    const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
    if (action.isForFriend()) {
        this.showActorWindow();
        this._actorWindow.selectForItem(this.item());
    } else {
        this.useItem();
        this.activateItemWindow();
    }
};

Scene_ItemBase.prototype.useItem = function() {
    this.playSeForItem();
    this.user().useItem(this.item());
    this.applyItem();
    this.checkCommonEvent();
    this.checkGameover();
    this._actorWindow.refresh();
};

Scene_ItemBase.prototype.activateItemWindow = function() {
    this._itemWindow.refresh();
    this._itemWindow.activate();
};

Scene_ItemBase.prototype.itemTargetActors = function() {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members();
    } else {
        return [$gameParty.members()[this._actorWindow.index()]];
    }
};

Scene_ItemBase.prototype.canUse = function() {
    const user = this.user();
    return user && user.canUse(this.item()) && this.isItemEffectsValid();
};

Scene_ItemBase.prototype.isItemEffectsValid = function() {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    return this.itemTargetActors().some(target => action.testApply(target));
};

Scene_ItemBase.prototype.applyItem = function() {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    for (const target of this.itemTargetActors()) {
        for (let i = 0; i < action.numRepeats(); i++) {
            action.apply(target);
        }
    }
    action.applyGlobal();
};

Scene_ItemBase.prototype.checkCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        SceneManager.goto(Scene_Map);
    }
};

//-----------------------------------------------------------------------------
// Scene_Item
//
// The scene class of the item screen.

function Scene_Item() {
    this.initialize(...arguments);
}

Scene_Item.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Item.prototype.constructor = Scene_Item;

Scene_Item.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Item.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCategoryWindow();
    this.createItemWindow();
    this.createActorWindow();
};

Scene_Item.prototype.createCategoryWindow = function() {
    const rect = this.categoryWindowRect();
    this._categoryWindow = new Window_ItemCategory(rect);
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
};

Scene_Item.prototype.categoryWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_ItemList(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
    if (!this._categoryWindow.needsSelection()) {
        this._itemWindow.y -= this._categoryWindow.height;
        this._itemWindow.height += this._categoryWindow.height;
        this._itemWindow.createContents();
        this._categoryWindow.update();
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this.onCategoryOk();
    }
};

Scene_Item.prototype.itemWindowRect = function() {
    const wx = 0;
    const wy = this._categoryWindow.y + this._categoryWindow.height;
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaBottom() - wy;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Item.prototype.user = function() {
    const members = $gameParty.movableMembers();
    const bestPha = Math.max(...members.map(member => member.pha));
    return members.find(member => member.pha === bestPha);
};

Scene_Item.prototype.onCategoryOk = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Item.prototype.onItemOk = function() {
    $gameParty.setLastItem(this.item());
    this.determineItem();
};

Scene_Item.prototype.onItemCancel = function() {
    if (this._categoryWindow.needsSelection()) {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
    } else {
        this.popScene();
    }
};

Scene_Item.prototype.playSeForItem = function() {
    SoundManager.playUseItem();
};

Scene_Item.prototype.useItem = function() {
    Scene_ItemBase.prototype.useItem.call(this);
    this._itemWindow.redrawCurrentItem();
};

//-----------------------------------------------------------------------------
// Scene_Skill
//
// The scene class of the skill screen.

function Scene_Skill() {
    this.initialize(...arguments);
}

Scene_Skill.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Skill.prototype.constructor = Scene_Skill;

Scene_Skill.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Skill.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createSkillTypeWindow();
    this.createStatusWindow();
    this.createItemWindow();
    this.createActorWindow();
};

Scene_Skill.prototype.start = function() {
    Scene_ItemBase.prototype.start.call(this);
    this.refreshActor();
};

Scene_Skill.prototype.createSkillTypeWindow = function() {
    const rect = this.skillTypeWindowRect();
    this._skillTypeWindow = new Window_SkillType(rect);
    this._skillTypeWindow.setHelpWindow(this._helpWindow);
    this._skillTypeWindow.setHandler("skill", this.commandSkill.bind(this));
    this._skillTypeWindow.setHandler("cancel", this.popScene.bind(this));
    this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._skillTypeWindow);
};

Scene_Skill.prototype.skillTypeWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(3, true);
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_SkillStatus(rect);
    this.addWindow(this._statusWindow);
};

Scene_Skill.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth - this.mainCommandWidth();
    const wh = this._skillTypeWindow.height;
    const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_SkillList(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._skillTypeWindow.setSkillWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

Scene_Skill.prototype.itemWindowRect = function() {
    const wx = 0;
    const wy = this._statusWindow.y + this._statusWindow.height;
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaHeight() - this._statusWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Skill.prototype.needsPageButtons = function() {
    return true;
};

Scene_Skill.prototype.arePageButtonsEnabled = function() {
    return !this.isActorWindowActive();
};

Scene_Skill.prototype.refreshActor = function() {
    const actor = this.actor();
    this._skillTypeWindow.setActor(actor);
    this._statusWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Scene_Skill.prototype.user = function() {
    return this.actor();
};

Scene_Skill.prototype.commandSkill = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Skill.prototype.onItemOk = function() {
    this.actor().setLastMenuSkill(this.item());
    this.determineItem();
};

Scene_Skill.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    this._skillTypeWindow.activate();
};

Scene_Skill.prototype.playSeForItem = function() {
    SoundManager.playUseSkill();
};

Scene_Skill.prototype.useItem = function() {
    Scene_ItemBase.prototype.useItem.call(this);
    this._statusWindow.refresh();
    this._itemWindow.refresh();
};

Scene_Skill.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this._itemWindow.deselect();
    this._skillTypeWindow.activate();
};

//-----------------------------------------------------------------------------
// Scene_Equip
//
// The scene class of the equipment screen.

function Scene_Equip() {
    this.initialize(...arguments);
}

Scene_Equip.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Equip.prototype.constructor = Scene_Equip;

Scene_Equip.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Equip.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createStatusWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();
};

Scene_Equip.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_EquipStatus(rect);
    this.addWindow(this._statusWindow);
};

Scene_Equip.prototype.statusWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = this.statusWidth();
    const wh = this.mainAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_EquipCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("equip", this.commandEquip.bind(this));
    this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
    this._commandWindow.setHandler("clear", this.commandClear.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Equip.prototype.commandWindowRect = function() {
    const wx = this.statusWidth();
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.createSlotWindow = function() {
    const rect = this.slotWindowRect();
    this._slotWindow = new Window_EquipSlot(rect);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setStatusWindow(this._statusWindow);
    this._slotWindow.setHandler("ok", this.onSlotOk.bind(this));
    this._slotWindow.setHandler("cancel", this.onSlotCancel.bind(this));
    this.addWindow(this._slotWindow);
};

Scene_Equip.prototype.slotWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const wx = this.statusWidth();
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = this.mainAreaHeight() - commandWindowRect.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Equip.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_EquipItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._itemWindow.hide();
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

Scene_Equip.prototype.itemWindowRect = function() {
    return this.slotWindowRect();
};

Scene_Equip.prototype.statusWidth = function() {
    return 312;
};

Scene_Equip.prototype.needsPageButtons = function() {
    return true;
};

Scene_Equip.prototype.arePageButtonsEnabled = function() {
    return !(this._itemWindow && this._itemWindow.active);
};

Scene_Equip.prototype.refreshActor = function() {
    const actor = this.actor();
    this._statusWindow.setActor(actor);
    this._slotWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

Scene_Equip.prototype.commandEquip = function() {
    this._slotWindow.activate();
    this._slotWindow.select(0);
};

Scene_Equip.prototype.commandOptimize = function() {
    SoundManager.playEquip();
    this.actor().optimizeEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Scene_Equip.prototype.commandClear = function() {
    SoundManager.playEquip();
    this.actor().clearEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onSlotOk = function() {
    this._slotWindow.hide();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._itemWindow.forceSelect(0);
};

Scene_Equip.prototype.onSlotCancel = function() {
    this._slotWindow.deselect();
    this._commandWindow.activate();
};

Scene_Equip.prototype.onItemOk = function() {
    SoundManager.playEquip();
    this.executeEquipChange();
    this.hideItemWindow();
    this._slotWindow.refresh();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
};

Scene_Equip.prototype.executeEquipChange = function() {
    const actor = this.actor();
    const slotId = this._slotWindow.index();
    const item = this._itemWindow.item();
    actor.changeEquip(slotId, item);
};

Scene_Equip.prototype.onItemCancel = function() {
    this.hideItemWindow();
};

Scene_Equip.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this.hideItemWindow();
    this._slotWindow.deselect();
    this._slotWindow.deactivate();
    this._commandWindow.activate();
};

Scene_Equip.prototype.hideItemWindow = function() {
    this._slotWindow.show();
    this._slotWindow.activate();
    this._itemWindow.hide();
    this._itemWindow.deselect();
};
