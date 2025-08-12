//-----------------------------------------------------------------------------
// Scene_Status
//
// The scene class of the status screen.

function Scene_Status() {
    this.initialize(...arguments);
}

Scene_Status.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Status.prototype.constructor = Scene_Status;

Scene_Status.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Status.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createProfileWindow();
    this.createStatusWindow();
    this.createStatusParamsWindow();
    this.createStatusEquipWindow();
};

Scene_Status.prototype.helpAreaHeight = function() {
    return 0;
};

Scene_Status.prototype.createProfileWindow = function() {
    const rect = this.profileWindowRect();
    this._profileWindow = new Window_Help(rect);
    this.addWindow(this._profileWindow);
};

Scene_Status.prototype.profileWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.profileHeight();
    const wx = 0;
    const wy = this.mainAreaBottom() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Status.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_Status(rect);
    this._statusWindow.setHandler("cancel", this.popScene.bind(this));
    this._statusWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._statusWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._statusWindow);
};

Scene_Status.prototype.statusWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.statusParamsWindowRect().y - wy;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Status.prototype.createStatusParamsWindow = function() {
    const rect = this.statusParamsWindowRect();
    this._statusParamsWindow = new Window_StatusParams(rect);
    this.addWindow(this._statusParamsWindow);
};

Scene_Status.prototype.statusParamsWindowRect = function() {
    const ww = this.statusParamsWidth();
    const wh = this.statusParamsHeight();
    const wx = 0;
    const wy = this.mainAreaBottom() - this.profileHeight() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Status.prototype.createStatusEquipWindow = function() {
    const rect = this.statusEquipWindowRect();
    this._statusEquipWindow = new Window_StatusEquip(rect);
    this.addWindow(this._statusEquipWindow);
};

Scene_Status.prototype.statusEquipWindowRect = function() {
    const ww = Graphics.boxWidth - this.statusParamsWidth();
    const wh = this.statusParamsHeight();
    const wx = this.statusParamsWidth();
    const wy = this.mainAreaBottom() - this.profileHeight() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Status.prototype.statusParamsWidth = function() {
    return 300;
};

Scene_Status.prototype.statusParamsHeight = function() {
    return this.calcWindowHeight(6, false);
};

Scene_Status.prototype.profileHeight = function() {
    return this.calcWindowHeight(2, false);
};

Scene_Status.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this.refreshActor();
};

Scene_Status.prototype.needsPageButtons = function() {
    return true;
};

Scene_Status.prototype.refreshActor = function() {
    const actor = this.actor();
    this._profileWindow.setText(actor.profile());
    this._statusWindow.setActor(actor);
    this._statusParamsWindow.setActor(actor);
    this._statusEquipWindow.setActor(actor);
};

Scene_Status.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this._statusWindow.activate();
};

//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.

function Scene_Options() {
    this.initialize(...arguments);
}

Scene_Options.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Options.prototype.constructor = Scene_Options;

Scene_Options.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Options.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
};

Scene_Options.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};

Scene_Options.prototype.createOptionsWindow = function() {
    const rect = this.optionsWindowRect();
    this._optionsWindow = new Window_Options(rect);
    this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
};

Scene_Options.prototype.optionsWindowRect = function() {
    const n = Math.min(this.maxCommands(), this.maxVisibleCommands());
    const ww = 400;
    const wh = this.calcWindowHeight(n, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Options.prototype.maxCommands = function() {
    // Increase this value when adding option items.
    return 7;
};

Scene_Options.prototype.maxVisibleCommands = function() {
    return 12;
};

//-----------------------------------------------------------------------------
// Scene_File
//
// The superclass of Scene_Save and Scene_Load.

function Scene_File() {
    this.initialize(...arguments);
}

Scene_File.prototype = Object.create(Scene_MenuBase.prototype);
Scene_File.prototype.constructor = Scene_File;

Scene_File.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_File.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    DataManager.loadAllSavefileImages();
    this.createHelpWindow();
    this.createListWindow();
    this._helpWindow.setText(this.helpWindowText());
};

Scene_File.prototype.helpAreaHeight = function() {
    return 0;
};

Scene_File.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._listWindow.refresh();
};

Scene_File.prototype.savefileId = function() {
    return this._listWindow.savefileId();
};

Scene_File.prototype.isSavefileEnabled = function(savefileId) {
    return this._listWindow.isEnabled(savefileId);
};

Scene_File.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

Scene_File.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, false);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_File.prototype.createListWindow = function() {
    const rect = this.listWindowRect();
    this._listWindow = new Window_SavefileList(rect);
    this._listWindow.setHandler("ok", this.onSavefileOk.bind(this));
    this._listWindow.setHandler("cancel", this.popScene.bind(this));
    this._listWindow.setMode(this.mode(), this.needsAutosave());
    this._listWindow.selectSavefile(this.firstSavefileId());
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
};

Scene_File.prototype.listWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop() + this._helpWindow.height;
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaHeight() - this._helpWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_File.prototype.mode = function() {
    return null;
};

Scene_File.prototype.needsAutosave = function() {
    return $gameSystem.isAutosaveEnabled();
};

Scene_File.prototype.activateListWindow = function() {
    this._listWindow.activate();
};

Scene_File.prototype.helpWindowText = function() {
    return "";
};

Scene_File.prototype.firstSavefileId = function() {
    return 0;
};

Scene_File.prototype.onSavefileOk = function() {
    //
};

//-----------------------------------------------------------------------------
// Scene_Save
//
// The scene class of the save screen.

function Scene_Save() {
    this.initialize(...arguments);
}

Scene_Save.prototype = Object.create(Scene_File.prototype);
Scene_Save.prototype.constructor = Scene_Save;

Scene_Save.prototype.initialize = function() {
    Scene_File.prototype.initialize.call(this);
};

Scene_Save.prototype.mode = function() {
    return "save";
};

Scene_Save.prototype.helpWindowText = function() {
    return TextManager.saveMessage;
};

Scene_Save.prototype.firstSavefileId = function() {
    return $gameSystem.savefileId();
};

Scene_Save.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    const savefileId = this.savefileId();
    if (this.isSavefileEnabled(savefileId)) {
        this.executeSave(savefileId);
    } else {
        this.onSaveFailure();
    }
};

Scene_Save.prototype.executeSave = function(savefileId) {
    $gameSystem.setSavefileId(savefileId);
    $gameSystem.onBeforeSave();
    DataManager.saveGame(savefileId)
        .then(() => this.onSaveSuccess())
        .catch(() => this.onSaveFailure());
};

Scene_Save.prototype.onSaveSuccess = function() {
    SoundManager.playSave();
    this.popScene();
};

Scene_Save.prototype.onSaveFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};

//-----------------------------------------------------------------------------
// Scene_Load
//
// The scene class of the load screen.

function Scene_Load() {
    this.initialize(...arguments);
}

Scene_Load.prototype = Object.create(Scene_File.prototype);
Scene_Load.prototype.constructor = Scene_Load;

Scene_Load.prototype.initialize = function() {
    Scene_File.prototype.initialize.call(this);
    this._loadSuccess = false;
};

Scene_Load.prototype.terminate = function() {
    Scene_File.prototype.terminate.call(this);
    if (this._loadSuccess) {
        $gameSystem.onAfterLoad();
    }
};

Scene_Load.prototype.mode = function() {
    return "load";
};

Scene_Load.prototype.helpWindowText = function() {
    return TextManager.loadMessage;
};

Scene_Load.prototype.firstSavefileId = function() {
    return DataManager.latestSavefileId();
};

Scene_Load.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    const savefileId = this.savefileId();
    if (this.isSavefileEnabled(savefileId)) {
        this.executeLoad(savefileId);
    } else {
        this.onLoadFailure();
    }
};

Scene_Load.prototype.executeLoad = function(savefileId) {
    DataManager.loadGame(savefileId)
        .then(() => this.onLoadSuccess())
        .catch(() => this.onLoadFailure());
};

Scene_Load.prototype.onLoadSuccess = function() {
    SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};

Scene_Load.prototype.onLoadFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};

Scene_Load.prototype.reloadMapIfUpdated = function() {
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        const mapId = $gameMap.mapId();
        const x = $gamePlayer.x;
        const y = $gamePlayer.y;
        const d = $gamePlayer.direction();
        $gamePlayer.reserveTransfer(mapId, x, y, d, 0);
        $gamePlayer.requestMapReload();
    }
};

//-----------------------------------------------------------------------------
// Scene_GameEnd
//
// The scene class of the game end screen.

function Scene_GameEnd() {
    this.initialize(...arguments);
}

Scene_GameEnd.prototype = Object.create(Scene_MenuBase.prototype);
Scene_GameEnd.prototype.constructor = Scene_GameEnd;

Scene_GameEnd.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_GameEnd.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
};

Scene_GameEnd.prototype.stop = function() {
    Scene_MenuBase.prototype.stop.call(this);
    this._commandWindow.close();
};

Scene_GameEnd.prototype.createBackground = function() {
    Scene_MenuBase.prototype.createBackground.call(this);
    this.setBackgroundOpacity(128);
};

Scene_GameEnd.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_GameEnd(rect);
    this._commandWindow.setHandler("toTitle", this.commandToTitle.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_GameEnd.prototype.commandWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(2, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_GameEnd.prototype.commandToTitle = function() {
    this.fadeOutAll();
    SceneManager.goto(Scene_Title);
    Window_TitleCommand.initCommandPosition();
};

//-----------------------------------------------------------------------------
// Scene_Shop
//
// The scene class of the shop screen.

function Scene_Shop() {
    this.initialize(...arguments);
}

Scene_Shop.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Shop.prototype.constructor = Scene_Shop;

Scene_Shop.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Shop.prototype.prepare = function(goods, purchaseOnly) {
    this._goods = goods;
    this._purchaseOnly = purchaseOnly;
    this._item = null;
};

Scene_Shop.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createGoldWindow();
    this.createCommandWindow();
    this.createDummyWindow();
    this.createNumberWindow();
    this.createStatusWindow();
    this.createBuyWindow();
    this.createCategoryWindow();
    this.createSellWindow();
};

Scene_Shop.prototype.createGoldWindow = function() {
    const rect = this.goldWindowRect();
    this._goldWindow = new Window_Gold(rect);
    this.addWindow(this._goldWindow);
};

Scene_Shop.prototype.goldWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(1, true);
    const wx = Graphics.boxWidth - ww;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_ShopCommand(rect);
    this._commandWindow.setPurchaseOnly(this._purchaseOnly);
    this._commandWindow.y = this.mainAreaTop();
    this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
    this._commandWindow.setHandler("sell", this.commandSell.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Shop.prototype.commandWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = this._goldWindow.x;
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.createDummyWindow = function() {
    const rect = this.dummyWindowRect();
    this._dummyWindow = new Window_Base(rect);
    this.addWindow(this._dummyWindow);
};

Scene_Shop.prototype.dummyWindowRect = function() {
    const wx = 0;
    const wy = this._commandWindow.y + this._commandWindow.height;
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaHeight() - this._commandWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.createNumberWindow = function() {
    const rect = this.numberWindowRect();
    this._numberWindow = new Window_ShopNumber(rect);
    this._numberWindow.hide();
    this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
    this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
    this.addWindow(this._numberWindow);
};

Scene_Shop.prototype.numberWindowRect = function() {
    const wx = 0;
    const wy = this._dummyWindow.y;
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = this._dummyWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_ShopStatus(rect);
    this._statusWindow.hide();
    this.addWindow(this._statusWindow);
};

Scene_Shop.prototype.statusWindowRect = function() {
    const ww = this.statusWidth();
    const wh = this._dummyWindow.height;
    const wx = Graphics.boxWidth - ww;
    const wy = this._dummyWindow.y;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.createBuyWindow = function() {
    const rect = this.buyWindowRect();
    this._buyWindow = new Window_ShopBuy(rect);
    this._buyWindow.setupGoods(this._goods);
    this._buyWindow.setHelpWindow(this._helpWindow);
    this._buyWindow.setStatusWindow(this._statusWindow);
    this._buyWindow.hide();
    this._buyWindow.setHandler("ok", this.onBuyOk.bind(this));
    this._buyWindow.setHandler("cancel", this.onBuyCancel.bind(this));
    this.addWindow(this._buyWindow);
};

Scene_Shop.prototype.buyWindowRect = function() {
    const wx = 0;
    const wy = this._dummyWindow.y;
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = this._dummyWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.createCategoryWindow = function() {
    const rect = this.categoryWindowRect();
    this._categoryWindow = new Window_ItemCategory(rect);
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.hide();
    this._categoryWindow.deactivate();
    this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
    this.addWindow(this._categoryWindow);
};

Scene_Shop.prototype.categoryWindowRect = function() {
    const wx = 0;
    const wy = this._dummyWindow.y;
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.createSellWindow = function() {
    const rect = this.sellWindowRect();
    this._sellWindow = new Window_ShopSell(rect);
    this._sellWindow.setHelpWindow(this._helpWindow);
    this._sellWindow.hide();
    this._sellWindow.setHandler("ok", this.onSellOk.bind(this));
    this._sellWindow.setHandler("cancel", this.onSellCancel.bind(this));
    this._categoryWindow.setItemWindow(this._sellWindow);
    this.addWindow(this._sellWindow);
    if (!this._categoryWindow.needsSelection()) {
        this._sellWindow.y -= this._categoryWindow.height;
        this._sellWindow.height += this._categoryWindow.height;
    }
};

Scene_Shop.prototype.sellWindowRect = function() {
    const wx = 0;
    const wy = this._categoryWindow.y + this._categoryWindow.height;
    const ww = Graphics.boxWidth;
    const wh =
        this.mainAreaHeight() -
        this._commandWindow.height -
        this._categoryWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.statusWidth = function() {
    return 352;
};

Scene_Shop.prototype.activateBuyWindow = function() {
    this._buyWindow.setMoney(this.money());
    this._buyWindow.show();
    this._buyWindow.activate();
    this._statusWindow.show();
};

Scene_Shop.prototype.activateSellWindow = function() {
    if (this._categoryWindow.needsSelection()) {
        this._categoryWindow.show();
    }
    this._sellWindow.refresh();
    this._sellWindow.show();
    this._sellWindow.activate();
    this._statusWindow.hide();
};

Scene_Shop.prototype.commandBuy = function() {
    this._dummyWindow.hide();
    this.activateBuyWindow();
};

Scene_Shop.prototype.commandSell = function() {
    this._dummyWindow.hide();
    this._sellWindow.show();
    this._sellWindow.deselect();
    this._sellWindow.refresh();
    if (this._categoryWindow.needsSelection()) {
        this._categoryWindow.show();
        this._categoryWindow.activate();
    } else {
        this.onCategoryOk();
    }
};

Scene_Shop.prototype.onBuyOk = function() {
    this._item = this._buyWindow.item();
    this._buyWindow.hide();
    this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
};

Scene_Shop.prototype.onBuyCancel = function() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._buyWindow.hide();
    this._statusWindow.hide();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
};

Scene_Shop.prototype.onCategoryOk = function() {
    this.activateSellWindow();
    this._sellWindow.select(0);
};

Scene_Shop.prototype.onCategoryCancel = function() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._categoryWindow.hide();
    this._sellWindow.hide();
};

Scene_Shop.prototype.onSellOk = function() {
    this._item = this._sellWindow.item();
    this._categoryWindow.hide();
    this._sellWindow.hide();
    this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
    this._numberWindow.setCurrencyUnit(this.currencyUnit());
    this._numberWindow.show();
    this._numberWindow.activate();
    this._statusWindow.setItem(this._item);
    this._statusWindow.show();
};

Scene_Shop.prototype.onSellCancel = function() {
    this._sellWindow.deselect();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
    if (this._categoryWindow.needsSelection()) {
        this._categoryWindow.activate();
    } else {
        this.onCategoryCancel();
    }
};

Scene_Shop.prototype.onNumberOk = function() {
    SoundManager.playShop();
    switch (this._commandWindow.currentSymbol()) {
        case "buy":
            this.doBuy(this._numberWindow.number());
            break;
        case "sell":
            this.doSell(this._numberWindow.number());
            break;
    }
    this.endNumberInput();
    this._goldWindow.refresh();
    this._statusWindow.refresh();
};

Scene_Shop.prototype.onNumberCancel = function() {
    SoundManager.playCancel();
    this.endNumberInput();
};

Scene_Shop.prototype.doBuy = function(number) {
    $gameParty.loseGold(number * this.buyingPrice());
    $gameParty.gainItem(this._item, number);
};

Scene_Shop.prototype.doSell = function(number) {
    $gameParty.gainGold(number * this.sellingPrice());
    $gameParty.loseItem(this._item, number);
};

Scene_Shop.prototype.endNumberInput = function() {
    this._numberWindow.hide();
    switch (this._commandWindow.currentSymbol()) {
        case "buy":
            this.activateBuyWindow();
            break;
        case "sell":
            this.activateSellWindow();
            break;
    }
};

Scene_Shop.prototype.maxBuy = function() {
    const num = $gameParty.numItems(this._item);
    const max = $gameParty.maxItems(this._item) - num;
    const price = this.buyingPrice();
    if (price > 0) {
        return Math.min(max, Math.floor(this.money() / price));
    } else {
        return max;
    }
};

Scene_Shop.prototype.maxSell = function() {
    return $gameParty.numItems(this._item);
};

Scene_Shop.prototype.money = function() {
    return this._goldWindow.value();
};

Scene_Shop.prototype.currencyUnit = function() {
    return this._goldWindow.currencyUnit();
};

Scene_Shop.prototype.buyingPrice = function() {
    return this._buyWindow.price(this._item);
};

Scene_Shop.prototype.sellingPrice = function() {
    return Math.floor(this._item.price / 2);
};

//-----------------------------------------------------------------------------
// Scene_Name
//
// The scene class of the name input screen.

function Scene_Name() {
    this.initialize(...arguments);
}

Scene_Name.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Name.prototype.constructor = Scene_Name;

Scene_Name.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Name.prototype.prepare = function(actorId, maxLength) {
    this._actorId = actorId;
    this._maxLength = maxLength;
};

Scene_Name.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createInputWindow();
};

Scene_Name.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
};

Scene_Name.prototype.createEditWindow = function() {
    const rect = this.editWindowRect();
    this._editWindow = new Window_NameEdit(rect);
    this._editWindow.setup(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
};

Scene_Name.prototype.editWindowRect = function() {
    const inputWindowHeight = this.calcWindowHeight(9, true);
    const padding = $gameSystem.windowPadding();
    const ww = 600;
    const wh = ImageManager.standardFaceHeight + padding * 2;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Name.prototype.createInputWindow = function() {
    const rect = this.inputWindowRect();
    this._inputWindow = new Window_NameInput(rect);
    this._inputWindow.setEditWindow(this._editWindow);
    this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
    this.addWindow(this._inputWindow);
};

Scene_Name.prototype.inputWindowRect = function() {
    const wx = this._editWindow.x;
    const wy = this._editWindow.y + this._editWindow.height + 8;
    const ww = this._editWindow.width;
    const wh = this.calcWindowHeight(9, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Name.prototype.onInputOk = function() {
    this._actor.setName(this._editWindow.name());
    this.popScene();
};

//-----------------------------------------------------------------------------
// Scene_Debug
//
// The scene class of the debug screen.

function Scene_Debug() {
    this.initialize(...arguments);
}

Scene_Debug.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Debug.prototype.constructor = Scene_Debug;

Scene_Debug.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Debug.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createRangeWindow();
    this.createEditWindow();
    this.createDebugHelpWindow();
};

Scene_Debug.prototype.needsCancelButton = function() {
    return false;
};

Scene_Debug.prototype.createRangeWindow = function() {
    const rect = this.rangeWindowRect();
    this._rangeWindow = new Window_DebugRange(rect);
    this._rangeWindow.setHandler("ok", this.onRangeOk.bind(this));
    this._rangeWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._rangeWindow);
};

Scene_Debug.prototype.rangeWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = 246;
    const wh = Graphics.boxHeight;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Debug.prototype.createEditWindow = function() {
    const rect = this.editWindowRect();
    this._editWindow = new Window_DebugEdit(rect);
    this._editWindow.setHandler("cancel", this.onEditCancel.bind(this));
    this._rangeWindow.setEditWindow(this._editWindow);
    this.addWindow(this._editWindow);
};

Scene_Debug.prototype.editWindowRect = function() {
    const wx = this._rangeWindow.width;
    const wy = 0;
    const ww = Graphics.boxWidth - wx;
    const wh = this.calcWindowHeight(10, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Debug.prototype.createDebugHelpWindow = function() {
    const rect = this.debugHelpWindowRect();
    this._debugHelpWindow = new Window_Base(rect);
    this.addWindow(this._debugHelpWindow);
};

Scene_Debug.prototype.debugHelpWindowRect = function() {
    const wx = this._editWindow.x;
    const wy = this._editWindow.height;
    const ww = this._editWindow.width;
    const wh = Graphics.boxHeight - wy;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Debug.prototype.onRangeOk = function() {
    this._editWindow.activate();
    this._editWindow.select(0);
    this.refreshHelpWindow();
};

Scene_Debug.prototype.onEditCancel = function() {
    this._rangeWindow.activate();
    this._editWindow.deselect();
    this.refreshHelpWindow();
};

Scene_Debug.prototype.refreshHelpWindow = function() {
    const helpWindow = this._debugHelpWindow;
    helpWindow.contents.clear();
    if (this._editWindow.active) {
        const rect = helpWindow.baseTextRect();
        helpWindow.drawTextEx(this.helpText(), rect.x, rect.y, rect.width);
    }
};

Scene_Debug.prototype.helpText = function() {
    if (this._rangeWindow.mode() === "switch") {
        return "Enter : ON / OFF";
    } else {
        return (
            "Left     :  -1    Pageup   : -10\n" +
            "Right    :  +1    Pagedown : +10"
        );
    }
};

//-----------------------------------------------------------------------------
// Scene_Battle
//
// The scene class of the battle screen.

function Scene_Battle() {
    this.initialize(...arguments);
}

Scene_Battle.prototype = Object.create(Scene_Message.prototype);
Scene_Battle.prototype.constructor = Scene_Battle;

Scene_Battle.prototype.initialize = function() {
    Scene_Message.prototype.initialize.call(this);
};

Scene_Battle.prototype.create = function() {
    Scene_Message.prototype.create.call(this);
    this.createDisplayObjects();
};

Scene_Battle.prototype.start = function() {
    Scene_Message.prototype.start.call(this);
    BattleManager.playBattleBgm();
    BattleManager.startBattle();
    this._statusWindow.refresh();
    this.startFadeIn(this.fadeSpeed(), false);
};

Scene_Battle.prototype.update = function() {
    const active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateVisibility();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Message.prototype.update.call(this);
};

Scene_Battle.prototype.updateVisibility = function() {
    this.updateLogWindowVisibility();
    this.updateStatusWindowVisibility();
    this.updateInputWindowVisibility();
    this.updateCancelButton();
};

Scene_Battle.prototype.updateBattleProcess = function() {
    BattleManager.update(this.isTimeActive());
};

Scene_Battle.prototype.isTimeActive = function() {
    if (BattleManager.isActiveTpb()) {
        return !this._skillWindow.active && !this._itemWindow.active;
    } else {
        return !this.isAnyInputWindowActive();
    }
};

Scene_Battle.prototype.isAnyInputWindowActive = function() {
    return (
        this._partyCommandWindow.active ||
        this._actorCommandWindow.active ||
        this._skillWindow.active ||
        this._itemWindow.active ||
        this._actorWindow.active ||
        this._enemyWindow.active
    );
};

Scene_Battle.prototype.changeInputWindow = function() {
    this.hideSubInputWindows();
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
            this.startPartyCommandSelection();
        }
    } else {
        this.endCommandSelection();
    }
};

Scene_Battle.prototype.stop = function() {
    Scene_Message.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    this._statusWindow.close();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

Scene_Battle.prototype.terminate = function() {
    Scene_Message.prototype.terminate.call(this);
    $gameParty.onBattleEnd();
    $gameTroop.onBattleEnd();
    AudioManager.stopMe();
    if (this.shouldAutosave()) {
        this.requestAutosave();
    }
};

Scene_Battle.prototype.shouldAutosave = function() {
    return SceneManager.isNextScene(Scene_Map);
};

Scene_Battle.prototype.needsSlowFadeOut = function() {
    return (
        SceneManager.isNextScene(Scene_Title) ||
        SceneManager.isNextScene(Scene_Gameover)
    );
};

Scene_Battle.prototype.updateLogWindowVisibility = function() {
    this._logWindow.visible = !this._helpWindow.visible;
};

Scene_Battle.prototype.updateStatusWindowVisibility = function() {
    if ($gameMessage.isBusy()) {
        this._statusWindow.close();
    } else if (this.shouldOpenStatusWindow()) {
        this._statusWindow.open();
    }
    this.updateStatusWindowPosition();
};

Scene_Battle.prototype.shouldOpenStatusWindow = function() {
    return (
        this.isActive() &&
        !this.isMessageWindowClosing() &&
        !BattleManager.isBattleEnd()
    );
};

Scene_Battle.prototype.updateStatusWindowPosition = function() {
    const statusWindow = this._statusWindow;
    const targetX = this.statusWindowX();
    if (statusWindow.x < targetX) {
        statusWindow.x = Math.min(statusWindow.x + 16, targetX);
    }
    if (statusWindow.x > targetX) {
        statusWindow.x = Math.max(statusWindow.x - 16, targetX);
    }
};

Scene_Battle.prototype.statusWindowX = function() {
    if (this.isAnyInputWindowActive()) {
        return this.statusWindowRect().x;
    } else {
        return this._partyCommandWindow.width / 2;
    }
};

Scene_Battle.prototype.updateInputWindowVisibility = function() {
    if ($gameMessage.isBusy()) {
        this.closeCommandWindows();
        this.hideSubInputWindows();
    } else if (this.needsInputWindowChange()) {
        this.changeInputWindow();
    }
};

Scene_Battle.prototype.needsInputWindowChange = function() {
    const windowActive = this.isAnyInputWindowActive();
    const inputting = BattleManager.isInputting();
    if (windowActive && inputting) {
        return this._actorCommandWindow.actor() !== BattleManager.actor();
    }
    return windowActive !== inputting;
};

Scene_Battle.prototype.updateCancelButton = function() {
    if (this._cancelButton) {
        this._cancelButton.visible =
            this.isAnyInputWindowActive() && !this._partyCommandWindow.active;
    }
};

Scene_Battle.prototype.createDisplayObjects = function() {
    this.createSpriteset();
    this.createWindowLayer();
    this.createAllWindows();
    this.createButtons();
    BattleManager.setLogWindow(this._logWindow);
    BattleManager.setSpriteset(this._spriteset);
    this._logWindow.setSpriteset(this._spriteset);
};

Scene_Battle.prototype.createSpriteset = function() {
    this._spriteset = new Spriteset_Battle();
    this.addChild(this._spriteset);
};

Scene_Battle.prototype.createAllWindows = function() {
    this.createLogWindow();
    this.createStatusWindow();
    this.createPartyCommandWindow();
    this.createActorCommandWindow();
    this.createHelpWindow();
    this.createSkillWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.createEnemyWindow();
    Scene_Message.prototype.createAllWindows.call(this);
};

Scene_Battle.prototype.createLogWindow = function() {
    const rect = this.logWindowRect();
    this._logWindow = new Window_BattleLog(rect);
    this.addWindow(this._logWindow);
};

Scene_Battle.prototype.logWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(10, false);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    const statusWindow = new Window_BattleStatus(rect);
    this.addWindow(statusWindow);
    this._statusWindow = statusWindow;
};

Scene_Battle.prototype.statusWindowRect = function() {
    const extra = 10;
    const ww = Graphics.boxWidth - 192;
    const wh = this.windowAreaHeight() + extra;
    const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
    const wy = Graphics.boxHeight - wh + extra - 4;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createPartyCommandWindow = function() {
    const rect = this.partyCommandWindowRect();
    const commandWindow = new Window_PartyCommand(rect);
    commandWindow.setHandler("fight", this.commandFight.bind(this));
    commandWindow.setHandler("escape", this.commandEscape.bind(this));
    commandWindow.deselect();
    this.addWindow(commandWindow);
    this._partyCommandWindow = commandWindow;
};

Scene_Battle.prototype.partyCommandWindowRect = function() {
    const ww = 192;
    const wh = this.windowAreaHeight();
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createActorCommandWindow = function() {
    const rect = this.actorCommandWindowRect();
    const commandWindow = new Window_ActorCommand(rect);
    commandWindow.y = Graphics.boxHeight - commandWindow.height;
    commandWindow.setHandler("attack", this.commandAttack.bind(this));
    commandWindow.setHandler("skill", this.commandSkill.bind(this));
    commandWindow.setHandler("guard", this.commandGuard.bind(this));
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("cancel", this.commandCancel.bind(this));
    this.addWindow(commandWindow);
    this._actorCommandWindow = commandWindow;
};

Scene_Battle.prototype.actorCommandWindowRect = function() {
    const ww = 192;
    const wh = this.windowAreaHeight();
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

Scene_Battle.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createSkillWindow = function() {
    const rect = this.skillWindowRect();
    this._skillWindow = new Window_BattleSkill(rect);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
    this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};

Scene_Battle.prototype.skillWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.windowAreaHeight();
    const wx = 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_BattleItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

Scene_Battle.prototype.itemWindowRect = function() {
    return this.skillWindowRect();
};

Scene_Battle.prototype.createActorWindow = function() {
    const rect = this.actorWindowRect();
    this._actorWindow = new Window_BattleActor(rect);
    this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
    this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

Scene_Battle.prototype.actorWindowRect = function() {
    return this.statusWindowRect();
};

Scene_Battle.prototype.createEnemyWindow = function() {
    const rect = this.enemyWindowRect();
    this._enemyWindow = new Window_BattleEnemy(rect);
    this._enemyWindow.setHandler("ok", this.onEnemyOk.bind(this));
    this._enemyWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
    this.addWindow(this._enemyWindow);
};

Scene_Battle.prototype.enemyWindowRect = function() {
    const wx = this._statusWindow.x;
    const ww = this._statusWindow.width;
    const wh = this.windowAreaHeight();
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.helpAreaTop = function() {
    return 0;
};

Scene_Battle.prototype.helpAreaBottom = function() {
    return this.helpAreaTop() + this.helpAreaHeight();
};

Scene_Battle.prototype.helpAreaHeight = function() {
    return this.calcWindowHeight(2, false);
};

Scene_Battle.prototype.buttonAreaTop = function() {
    return this.helpAreaBottom();
};

Scene_Battle.prototype.windowAreaHeight = function() {
    return this.calcWindowHeight(4, true);
};

Scene_Battle.prototype.createButtons = function() {
    if (ConfigManager.touchUI) {
        this.createCancelButton();
    }
};

Scene_Battle.prototype.createCancelButton = function() {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
    this._cancelButton.y = this.buttonY();
    this.addWindow(this._cancelButton);
};

Scene_Battle.prototype.closeCommandWindows = function() {
    this._partyCommandWindow.deactivate();
    this._actorCommandWindow.deactivate();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

Scene_Battle.prototype.hideSubInputWindows = function() {
    this._actorWindow.deactivate();
    this._enemyWindow.deactivate();
    this._skillWindow.deactivate();
    this._itemWindow.deactivate();
    this._actorWindow.hide();
    this._enemyWindow.hide();
    this._skillWindow.hide();
    this._itemWindow.hide();
};

Scene_Battle.prototype.startPartyCommandSelection = function() {
    this._statusWindow.deselect();
    this._statusWindow.show();
    this._statusWindow.open();
    this._actorCommandWindow.setup(null);
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
};

Scene_Battle.prototype.commandFight = function() {
    this.selectNextCommand();
};

Scene_Battle.prototype.commandEscape = function() {
    BattleManager.processEscape();
    this.changeInputWindow();
};

Scene_Battle.prototype.startActorCommandSelection = function() {
    this._statusWindow.show();
    this._statusWindow.selectActor(BattleManager.actor());
    this._partyCommandWindow.close();
    this._actorCommandWindow.show();
    this._actorCommandWindow.setup(BattleManager.actor());
};

Scene_Battle.prototype.commandAttack = function() {
    const action = BattleManager.inputtingAction();
    action.setAttack();
    this.onSelectAction();
};

Scene_Battle.prototype.commandSkill = function() {
    this._skillWindow.setActor(BattleManager.actor());
    this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
    this._skillWindow.refresh();
    this._skillWindow.show();
    this._skillWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.hide();
};

Scene_Battle.prototype.commandGuard = function() {
    const action = BattleManager.inputtingAction();
    action.setGuard();
    this.onSelectAction();
};

Scene_Battle.prototype.commandItem = function() {
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.hide();
};

Scene_Battle.prototype.commandCancel = function() {
    this.selectPreviousCommand();
};

Scene_Battle.prototype.selectNextCommand = function() {
    BattleManager.selectNextCommand();
    this.changeInputWindow();
};

Scene_Battle.prototype.selectPreviousCommand = function() {
    BattleManager.selectPreviousCommand();
    this.changeInputWindow();
};

Scene_Battle.prototype.startActorSelection = function() {
    this._actorWindow.refresh();
    this._actorWindow.show();
    this._actorWindow.activate();
};

Scene_Battle.prototype.onActorOk = function() {
    const action = BattleManager.inputtingAction();
    action.setTarget(this._actorWindow.index());
    this.hideSubInputWindows();
    this.selectNextCommand();
};

Scene_Battle.prototype.onActorCancel = function() {
    this._actorWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
        case "skill":
            this._skillWindow.show();
            this._skillWindow.activate();
            break;
        case "item":
            this._itemWindow.show();
            this._itemWindow.activate();
            break;
    }
};

Scene_Battle.prototype.startEnemySelection = function() {
    this._enemyWindow.refresh();
    this._enemyWindow.show();
    this._enemyWindow.select(0);
    this._enemyWindow.activate();
    this._statusWindow.hide();
};

Scene_Battle.prototype.onEnemyOk = function() {
    const action = BattleManager.inputtingAction();
    action.setTarget(this._enemyWindow.enemyIndex());
    this.hideSubInputWindows();
    this.selectNextCommand();
};

Scene_Battle.prototype.onEnemyCancel = function() {
    this._enemyWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
        case "attack":
            this._statusWindow.show();
            this._actorCommandWindow.activate();
            break;
        case "skill":
            this._skillWindow.show();
            this._skillWindow.activate();
            break;
        case "item":
            this._itemWindow.show();
            this._itemWindow.activate();
            break;
    }
};

Scene_Battle.prototype.onSkillOk = function() {
    const skill = this._skillWindow.item();
    const action = BattleManager.inputtingAction();
    action.setSkill(skill.id);
    BattleManager.actor().setLastBattleSkill(skill);
    this.onSelectAction();
};

Scene_Battle.prototype.onSkillCancel = function() {
    this._skillWindow.hide();
    this._statusWindow.show();
    this._actorCommandWindow.show();
    this._actorCommandWindow.activate();
};

Scene_Battle.prototype.onItemOk = function() {
    const item = this._itemWindow.item();
    const action = BattleManager.inputtingAction();
    action.setItem(item.id);
    $gameParty.setLastItem(item);
    this.onSelectAction();
};

Scene_Battle.prototype.onItemCancel = function() {
    this._itemWindow.hide();
    this._statusWindow.show();
    this._actorCommandWindow.show();
    this._actorCommandWindow.activate();
};

Scene_Battle.prototype.onSelectAction = function() {
    const action = BattleManager.inputtingAction();
    if (!action.needsSelection()) {
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        this.startEnemySelection();
    } else {
        this.startActorSelection();
    }
};

Scene_Battle.prototype.endCommandSelection = function() {
    this.closeCommandWindows();
    this.hideSubInputWindows();
    this._statusWindow.deselect();
    this._statusWindow.show();
};

//-----------------------------------------------------------------------------
// Scene_Gameover
//
// The scene class of the game over screen.

function Scene_Gameover() {
    this.initialize(...arguments);
}

Scene_Gameover.prototype = Object.create(Scene_Base.prototype);
Scene_Gameover.prototype.constructor = Scene_Gameover;

Scene_Gameover.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_Gameover.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.playGameoverMusic();
    this.createBackground();
};

Scene_Gameover.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.adjustBackground();
    this.startFadeIn(this.slowFadeSpeed(), false);
};

Scene_Gameover.prototype.update = function() {
    if (this.isActive() && !this.isBusy() && this.isTriggered()) {
        this.gotoTitle();
    }
    Scene_Base.prototype.update.call(this);
};

Scene_Gameover.prototype.stop = function() {
    Scene_Base.prototype.stop.call(this);
    this.fadeOutAll();
};

Scene_Gameover.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    AudioManager.stopAll();
};

Scene_Gameover.prototype.playGameoverMusic = function() {
    AudioManager.stopBgm();
    AudioManager.stopBgs();
    AudioManager.playMe($dataSystem.gameoverMe);
};

Scene_Gameover.prototype.createBackground = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = ImageManager.loadSystem("GameOver");
    this.addChild(this._backSprite);
};

Scene_Gameover.prototype.adjustBackground = function() {
    this.scaleSprite(this._backSprite);
    this.centerSprite(this._backSprite);
};

Scene_Gameover.prototype.isTriggered = function() {
    return Input.isTriggered("ok") || TouchInput.isTriggered();
};

Scene_Gameover.prototype.gotoTitle = function() {
    SceneManager.goto(Scene_Title);
};

//-----------------------------------------------------------------------------
