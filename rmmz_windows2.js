//-----------------------------------------------------------------------------
// Window_ShopSell
//
// The window for selecting an item to sell on the shop screen.

function Window_ShopSell() {
    this.initialize(...arguments);
}

Window_ShopSell.prototype = Object.create(Window_ItemList.prototype);
Window_ShopSell.prototype.constructor = Window_ShopSell;

Window_ShopSell.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
};

Window_ShopSell.prototype.isEnabled = function(item) {
    return item && item.price > 0;
};

//-----------------------------------------------------------------------------
// Window_ShopNumber
//
// The window for inputting quantity of items to buy or sell on the shop
// screen.

function Window_ShopNumber() {
    this.initialize(...arguments);
}

Window_ShopNumber.prototype = Object.create(Window_Selectable.prototype);
Window_ShopNumber.prototype.constructor = Window_ShopNumber;

Window_ShopNumber.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._item = null;
    this._max = 1;
    this._price = 0;
    this._number = 1;
    this._currencyUnit = TextManager.currencyUnit;
    this.createButtons();
    this.select(0);
    this._canRepeat = false;
};

Window_ShopNumber.prototype.isScrollEnabled = function() {
    return false;
};

Window_ShopNumber.prototype.number = function() {
    return this._number;
};

Window_ShopNumber.prototype.setup = function(item, max, price) {
    this._item = item;
    this._max = Math.floor(max);
    this._price = price;
    this._number = 1;
    this.placeButtons();
    this.refresh();
};

Window_ShopNumber.prototype.setCurrencyUnit = function(currencyUnit) {
    this._currencyUnit = currencyUnit;
    this.refresh();
};

Window_ShopNumber.prototype.createButtons = function() {
    this._buttons = [];
    if (ConfigManager.touchUI) {
        for (const type of ["down2", "down", "up", "up2", "ok"]) {
            const button = new Sprite_Button(type);
            this._buttons.push(button);
            this.addInnerChild(button);
        }
        this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));
        this._buttons[1].setClickHandler(this.onButtonDown.bind(this));
        this._buttons[2].setClickHandler(this.onButtonUp.bind(this));
        this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));
        this._buttons[4].setClickHandler(this.onButtonOk.bind(this));
    }
};

Window_ShopNumber.prototype.placeButtons = function() {
    const sp = this.buttonSpacing();
    const totalWidth = this.totalButtonWidth();
    let x = (this.innerWidth - totalWidth) / 2;
    for (const button of this._buttons) {
        button.x = x;
        button.y = this.buttonY();
        x += button.width + sp;
    }
};

Window_ShopNumber.prototype.totalButtonWidth = function() {
    const sp = this.buttonSpacing();
    return this._buttons.reduce((r, button) => r + button.width + sp, -sp);
};

Window_ShopNumber.prototype.buttonSpacing = function() {
    return 8;
};

Window_ShopNumber.prototype.refresh = function() {
    Window_Selectable.prototype.refresh.call(this);
    this.drawItemBackground(0);
    this.drawCurrentItemName();
    this.drawMultiplicationSign();
    this.drawNumber();
    this.drawHorzLine();
    this.drawTotalPrice();
};

Window_ShopNumber.prototype.drawCurrentItemName = function() {
    const padding = this.itemPadding();
    const x = padding * 2;
    const y = this.itemNameY();
    const width = this.multiplicationSignX() - padding * 3;
    this.drawItemName(this._item, x, y, width);
};

Window_ShopNumber.prototype.drawMultiplicationSign = function() {
    const sign = this.multiplicationSign();
    const width = this.textWidth(sign);
    const x = this.multiplicationSignX();
    const y = this.itemNameY();
    this.resetTextColor();
    this.drawText(sign, x, y, width);
};

Window_ShopNumber.prototype.multiplicationSign = function() {
    return "\u00d7";
};

Window_ShopNumber.prototype.multiplicationSignX = function() {
    const sign = this.multiplicationSign();
    const width = this.textWidth(sign);
    return this.cursorX() - width * 2;
};

Window_ShopNumber.prototype.drawNumber = function() {
    const x = this.cursorX();
    const y = this.itemNameY();
    const width = this.cursorWidth() - this.itemPadding();
    this.resetTextColor();
    this.drawText(this._number, x, y, width, "right");
};

Window_ShopNumber.prototype.drawHorzLine = function() {
    const padding = this.itemPadding();
    const lineHeight = this.lineHeight();
    const itemY = this.itemNameY();
    const totalY = this.totalPriceY();
    const x = padding;
    const y = Math.floor((itemY + totalY + lineHeight) / 2);
    const width = this.innerWidth - padding * 2;
    this.drawRect(x, y, width, 5);
};

Window_ShopNumber.prototype.drawTotalPrice = function() {
    const padding = this.itemPadding();
    const total = this._price * this._number;
    const width = this.innerWidth - padding * 2;
    const y = this.totalPriceY();
    this.drawCurrencyValue(total, this._currencyUnit, 0, y, width);
};

Window_ShopNumber.prototype.itemNameY = function() {
    return Math.floor(this.innerHeight / 2 - this.lineHeight() * 1.5);
};

Window_ShopNumber.prototype.totalPriceY = function() {
    return Math.floor(this.itemNameY() + this.lineHeight() * 2);
};

Window_ShopNumber.prototype.buttonY = function() {
    return Math.floor(this.totalPriceY() + this.lineHeight() * 2);
};

Window_ShopNumber.prototype.cursorWidth = function() {
    const padding = this.itemPadding();
    const digitWidth = this.textWidth("0");
    return this.maxDigits() * digitWidth + padding * 2;
};

Window_ShopNumber.prototype.cursorX = function() {
    const padding = this.itemPadding();
    return this.innerWidth - this.cursorWidth() - padding * 2;
};

Window_ShopNumber.prototype.maxDigits = function() {
    return 2;
};

Window_ShopNumber.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.processNumberChange();
};

Window_ShopNumber.prototype.playOkSound = function() {
    //
};

Window_ShopNumber.prototype.processNumberChange = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated("right")) {
            this.changeNumber(1);
        }
        if (Input.isRepeated("left")) {
            this.changeNumber(-1);
        }
        if (Input.isRepeated("up")) {
            this.changeNumber(10);
        }
        if (Input.isRepeated("down")) {
            this.changeNumber(-10);
        }
    }
};

Window_ShopNumber.prototype.changeNumber = function(amount) {
    const lastNumber = this._number;
    this._number = (this._number + amount).clamp(1, this._max);
    if (this._number !== lastNumber) {
        this.playCursorSound();
        this.refresh();
    }
};

Window_ShopNumber.prototype.itemRect = function() {
    const rect = new Rectangle();
    rect.x = this.cursorX();
    rect.y = this.itemNameY();
    rect.width = this.cursorWidth();
    rect.height = this.lineHeight();
    return rect;
};

Window_ShopNumber.prototype.isTouchOkEnabled = function() {
    return false;
};

Window_ShopNumber.prototype.onButtonUp = function() {
    this.changeNumber(1);
};

Window_ShopNumber.prototype.onButtonUp2 = function() {
    this.changeNumber(10);
};

Window_ShopNumber.prototype.onButtonDown = function() {
    this.changeNumber(-1);
};

Window_ShopNumber.prototype.onButtonDown2 = function() {
    this.changeNumber(-10);
};

Window_ShopNumber.prototype.onButtonOk = function() {
    this.processOk();
};

//-----------------------------------------------------------------------------
// Window_ShopStatus
//
// The window for displaying number of items in possession and the actor's
// equipment on the shop screen.

function Window_ShopStatus() {
    this.initialize(...arguments);
}

Window_ShopStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_ShopStatus.prototype.constructor = Window_ShopStatus;

Window_ShopStatus.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._item = null;
    this._pageIndex = 0;
    this.refresh();
};

Window_ShopStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._item) {
        const x = this.itemPadding();
        this.drawPossession(x, 0);
        if (this.isEquipItem()) {
            const y = Math.floor(this.lineHeight() * 1.5);
            this.drawEquipInfo(x, y);
        }
    }
};

Window_ShopStatus.prototype.setItem = function(item) {
    this._item = item;
    this.refresh();
};

Window_ShopStatus.prototype.isEquipItem = function() {
    return DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);
};

Window_ShopStatus.prototype.drawPossession = function(x, y) {
    const width = this.innerWidth - this.itemPadding() - x;
    const possessionWidth = this.textWidth("0000");
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(TextManager.possession, x, y, width - possessionWidth);
    this.resetTextColor();
    this.drawText($gameParty.numItems(this._item), x, y, width, "right");
};

Window_ShopStatus.prototype.drawEquipInfo = function(x, y) {
    const members = this.statusMembers();
    for (let i = 0; i < members.length; i++) {
        const actorY = y + Math.floor(this.lineHeight() * i * 2.2);
        this.drawActorEquipInfo(x, actorY, members[i]);
    }
};

Window_ShopStatus.prototype.statusMembers = function() {
    const start = this._pageIndex * this.pageSize();
    const end = start + this.pageSize();
    return $gameParty.members().slice(start, end);
};

Window_ShopStatus.prototype.pageSize = function() {
    return 4;
};

Window_ShopStatus.prototype.maxPages = function() {
    return Math.floor(
        ($gameParty.size() + this.pageSize() - 1) / this.pageSize()
    );
};

Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor) {
    const item1 = this.currentEquippedItem(actor, this._item.etypeId);
    const width = this.innerWidth - x - this.itemPadding();
    const enabled = actor.canEquip(this._item);
    this.changePaintOpacity(enabled);
    this.resetTextColor();
    this.drawText(actor.name(), x, y, width);
    if (enabled) {
        this.drawActorParamChange(x, y, actor, item1);
    }
    this.drawItemName(item1, x, y + this.lineHeight(), width);
    this.changePaintOpacity(true);
};

// prettier-ignore
Window_ShopStatus.prototype.drawActorParamChange = function(
    x, y, actor, item1
) {
    const width = this.innerWidth - this.itemPadding() - x;
    const paramId = this.paramId();
    const change =
        this._item.params[paramId] - (item1 ? item1.params[paramId] : 0);
    this.changeTextColor(ColorManager.paramchangeTextColor(change));
    this.drawText((change > 0 ? "+" : "") + change, x, y, width, "right");
};

Window_ShopStatus.prototype.paramId = function() {
    return DataManager.isWeapon(this._item) ? 2 : 3;
};

Window_ShopStatus.prototype.currentEquippedItem = function(actor, etypeId) {
    const list = [];
    const equips = actor.equips();
    const slots = actor.equipSlots();
    for (let i = 0; i < slots.length; i++) {
        if (slots[i] === etypeId) {
            list.push(equips[i]);
        }
    }
    const paramId = this.paramId();
    let worstParam = Number.MAX_VALUE;
    let worstItem = null;
    for (const item of list) {
        if (item && item.params[paramId] < worstParam) {
            worstParam = item.params[paramId];
            worstItem = item;
        }
    }
    return worstItem;
};

Window_ShopStatus.prototype.update = function() {
    Window_StatusBase.prototype.update.call(this);
    this.updatePage();
};

Window_ShopStatus.prototype.updatePage = function() {
    if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
        this.changePage();
    }
};

Window_ShopStatus.prototype.isPageChangeEnabled = function() {
    return this.visible && this.maxPages() >= 2;
};

Window_ShopStatus.prototype.isPageChangeRequested = function() {
    if (Input.isTriggered("shift")) {
        return true;
    }
    if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
        return true;
    }
    return false;
};

Window_ShopStatus.prototype.changePage = function() {
    this._pageIndex = (this._pageIndex + 1) % this.maxPages();
    this.refresh();
    this.playCursorSound();
};

//-----------------------------------------------------------------------------
// Window_NameEdit
//
// The window for editing an actor's name on the name input screen.

function Window_NameEdit() {
    this.initialize(...arguments);
}

Window_NameEdit.prototype = Object.create(Window_StatusBase.prototype);
Window_NameEdit.prototype.constructor = Window_NameEdit;

Window_NameEdit.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._actor = null;
    this._maxLength = 0;
    this._name = "";
    this._index = 0;
    this._defaultName = 0;
    this.deactivate();
};

Window_NameEdit.prototype.setup = function(actor, maxLength) {
    this._actor = actor;
    this._maxLength = maxLength;
    this._name = actor.name().slice(0, this._maxLength);
    this._index = this._name.length;
    this._defaultName = this._name;
    ImageManager.loadFace(actor.faceName());
};

Window_NameEdit.prototype.name = function() {
    return this._name;
};

Window_NameEdit.prototype.restoreDefault = function() {
    this._name = this._defaultName;
    this._index = this._name.length;
    this.refresh();
    return this._name.length > 0;
};

Window_NameEdit.prototype.add = function(ch) {
    if (this._index < this._maxLength) {
        this._name += ch;
        this._index++;
        this.refresh();
        return true;
    } else {
        return false;
    }
};

Window_NameEdit.prototype.back = function() {
    if (this._index > 0) {
        this._index--;
        this._name = this._name.slice(0, this._index);
        this.refresh();
        return true;
    } else {
        return false;
    }
};

Window_NameEdit.prototype.faceWidth = function() {
    return 144;
};

Window_NameEdit.prototype.charWidth = function() {
    const text = $gameSystem.isJapanese() ? "\uff21" : "A";
    return this.textWidth(text);
};

Window_NameEdit.prototype.left = function() {
    const nameCenter = (this.innerWidth + this.faceWidth()) / 2;
    const nameWidth = (this._maxLength + 1) * this.charWidth();
    return Math.min(nameCenter - nameWidth / 2, this.innerWidth - nameWidth);
};

Window_NameEdit.prototype.itemRect = function(index) {
    const x = this.left() + index * this.charWidth();
    const y = 54;
    const width = this.charWidth();
    const height = this.lineHeight();
    return new Rectangle(x, y, width, height);
};

Window_NameEdit.prototype.underlineRect = function(index) {
    const rect = this.itemRect(index);
    rect.x++;
    rect.y += rect.height - 4;
    rect.width -= 2;
    rect.height = 2;
    return rect;
};

Window_NameEdit.prototype.underlineColor = function() {
    return ColorManager.normalColor();
};

Window_NameEdit.prototype.drawUnderline = function(index) {
    const rect = this.underlineRect(index);
    const color = this.underlineColor();
    this.contents.paintOpacity = 48;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
};

Window_NameEdit.prototype.drawChar = function(index) {
    const rect = this.itemRect(index);
    this.resetTextColor();
    this.drawText(this._name[index] || "", rect.x, rect.y);
};

Window_NameEdit.prototype.refresh = function() {
    this.contents.clear();
    this.drawActorFace(this._actor, 0, 0);
    for (let i = 0; i < this._maxLength; i++) {
        this.drawUnderline(i);
    }
    for (let j = 0; j < this._name.length; j++) {
        this.drawChar(j);
    }
    const rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

//-----------------------------------------------------------------------------
// Window_NameInput
//
// The window for selecting text characters on the name input screen.

function Window_NameInput() {
    this.initialize(...arguments);
}

Window_NameInput.prototype = Object.create(Window_Selectable.prototype);
Window_NameInput.prototype.constructor = Window_NameInput;

// prettier-ignore
Window_NameInput.LATIN1 =
        [ "A","B","C","D","E",  "a","b","c","d","e",
          "F","G","H","I","J",  "f","g","h","i","j",
          "K","L","M","N","O",  "k","l","m","n","o",
          "P","Q","R","S","T",  "p","q","r","s","t",
          "U","V","W","X","Y",  "u","v","w","x","y",
          "Z","[","]","^","_",  "z","{","}","|","~",
          "0","1","2","3","4",  "!","#","$","%","&",
          "5","6","7","8","9",  "(",")","*","+","-",
          "/","=","@","<",">",  ":",";"," ","Page","OK" ];
// prettier-ignore
Window_NameInput.LATIN2 =
        [ "Á","É","Í","Ó","Ú",  "á","é","í","ó","ú",
          "À","È","Ì","Ò","Ù",  "à","è","ì","ò","ù",
          "Â","Ê","Î","Ô","Û",  "â","ê","î","ô","û",
          "Ä","Ë","Ï","Ö","Ü",  "ä","ë","ï","ö","ü",
          "Ā","Ē","Ī","Ō","Ū",  "ā","ē","ī","ō","ū",
          "Ã","Å","Æ","Ç","Ð",  "ã","å","æ","ç","ð",
          "Ñ","Õ","Ø","Š","Ŵ",  "ñ","õ","ø","š","ŵ",
          "Ý","Ŷ","Ÿ","Ž","Þ",  "ý","ÿ","ŷ","ž","þ",
          "Ĳ","Œ","ĳ","œ","ß",  "«","»"," ","Page","OK" ];
// prettier-ignore
Window_NameInput.RUSSIA =
        [ "А","Б","В","Г","Д",  "а","б","в","г","д",
          "Е","Ё","Ж","З","И",  "е","ё","ж","з","и",
          "Й","К","Л","М","Н",  "й","к","л","м","н",
          "О","П","Р","С","Т",  "о","п","р","с","т",
          "У","Ф","Х","Ц","Ч",  "у","ф","х","ц","ч",
          "Ш","Щ","Ъ","Ы","Ь",  "ш","щ","ъ","ы","ь",
          "Э","Ю","Я","^","_",  "э","ю","я","%","&",
          "0","1","2","3","4",  "(",")","*","+","-",
          "5","6","7","8","9",  ":",";"," ","","OK" ];
// prettier-ignore
Window_NameInput.JAPAN1 =
        [ "あ","い","う","え","お",  "が","ぎ","ぐ","げ","ご",
          "か","き","く","け","こ",  "ざ","じ","ず","ぜ","ぞ",
          "さ","し","す","せ","そ",  "だ","ぢ","づ","で","ど",
          "た","ち","つ","て","と",  "ば","び","ぶ","べ","ぼ",
          "な","に","ぬ","ね","の",  "ぱ","ぴ","ぷ","ぺ","ぽ",
          "は","ひ","ふ","へ","ほ",  "ぁ","ぃ","ぅ","ぇ","ぉ",
          "ま","み","む","め","も",  "っ","ゃ","ゅ","ょ","ゎ",
          "や","ゆ","よ","わ","ん",  "ー","～","・","＝","☆",
          "ら","り","る","れ","ろ",  "ゔ","を","　","カナ","決定" ];
// prettier-ignore
Window_NameInput.JAPAN2 =
        [ "ア","イ","ウ","エ","オ",  "ガ","ギ","グ","ゲ","ゴ",
          "カ","キ","ク","ケ","コ",  "ザ","ジ","ズ","ゼ","ゾ",
          "サ","シ","ス","セ","ソ",  "ダ","ヂ","ヅ","デ","ド",
          "タ","チ","ツ","テ","ト",  "バ","ビ","ブ","ベ","ボ",
          "ナ","ニ","ヌ","ネ","ノ",  "パ","ピ","プ","ペ","ポ",
          "ハ","ヒ","フ","ヘ","ホ",  "ァ","ィ","ゥ","ェ","ォ",
          "マ","ミ","ム","メ","モ",  "ッ","ャ","ュ","ョ","ヮ",
          "ヤ","ユ","ヨ","ワ","ン",  "ー","～","・","＝","☆",
          "ラ","リ","ル","レ","ロ",  "ヴ","ヲ","　","英数","決定" ];
// prettier-ignore
Window_NameInput.JAPAN3 =
        [ "Ａ","Ｂ","Ｃ","Ｄ","Ｅ",  "ａ","ｂ","ｃ","ｄ","ｅ",
          "Ｆ","Ｇ","Ｈ","Ｉ","Ｊ",  "ｆ","ｇ","ｈ","ｉ","ｊ",
          "Ｋ","Ｌ","Ｍ","Ｎ","Ｏ",  "ｋ","ｌ","ｍ","ｎ","ｏ",
          "Ｐ","Ｑ","Ｒ","Ｓ","Ｔ",  "ｐ","ｑ","ｒ","ｓ","ｔ",
          "Ｕ","Ｖ","Ｗ","Ｘ","Ｙ",  "ｕ","ｖ","ｗ","ｘ","ｙ",
          "Ｚ","［","］","＾","＿",  "ｚ","｛","｝","｜","～",
          "０","１","２","３","４",  "！","＃","＄","％","＆",
          "５","６","７","８","９",  "（","）","＊","＋","－",
          "／","＝","＠","＜","＞",  "：","；","　","かな","決定" ];

Window_NameInput.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._editWindow = null;
    this._page = 0;
    this._index = 0;
};

Window_NameInput.prototype.setEditWindow = function(editWindow) {
    this._editWindow = editWindow;
    this.refresh();
    this.updateCursor();
    this.activate();
};

Window_NameInput.prototype.table = function() {
    if ($gameSystem.isJapanese()) {
        return [
            Window_NameInput.JAPAN1,
            Window_NameInput.JAPAN2,
            Window_NameInput.JAPAN3
        ];
    } else if ($gameSystem.isRussian()) {
        return [Window_NameInput.RUSSIA];
    } else {
        return [Window_NameInput.LATIN1, Window_NameInput.LATIN2];
    }
};

Window_NameInput.prototype.maxCols = function() {
    return 10;
};

Window_NameInput.prototype.maxItems = function() {
    return 90;
};

Window_NameInput.prototype.itemWidth = function() {
    return Math.floor((this.innerWidth - this.groupSpacing()) / 10);
};

Window_NameInput.prototype.groupSpacing = function() {
    return 24;
};

Window_NameInput.prototype.character = function() {
    return this._index < 88 ? this.table()[this._page][this._index] : "";
};

Window_NameInput.prototype.isPageChange = function() {
    return this._index === 88;
};

Window_NameInput.prototype.isOk = function() {
    return this._index === 89;
};

Window_NameInput.prototype.itemRect = function(index) {
    const itemWidth = this.itemWidth();
    const itemHeight = this.itemHeight();
    const colSpacing = this.colSpacing();
    const rowSpacing = this.rowSpacing();
    const groupSpacing = this.groupSpacing();
    const col = index % 10;
    const group = Math.floor(col / 5);
    const x = col * itemWidth + group * groupSpacing + colSpacing / 2;
    const y = Math.floor(index / 10) * itemHeight + rowSpacing / 2;
    const width = itemWidth - colSpacing;
    const height = itemHeight - rowSpacing;
    return new Rectangle(x, y, width, height);
};

Window_NameInput.prototype.drawItem = function(index) {
    const table = this.table();
    const character = table[this._page][index];
    const rect = this.itemLineRect(index);
    this.drawText(character, rect.x, rect.y, rect.width, "center");
};

Window_NameInput.prototype.updateCursor = function() {
    const rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
};

Window_NameInput.prototype.isCursorMovable = function() {
    return this.active;
};

Window_NameInput.prototype.cursorDown = function(wrap) {
    if (this._index < 80 || wrap) {
        this._index = (this._index + 10) % 90;
    }
};

Window_NameInput.prototype.cursorUp = function(wrap) {
    if (this._index >= 10 || wrap) {
        this._index = (this._index + 80) % 90;
    }
};

Window_NameInput.prototype.cursorRight = function(wrap) {
    if (this._index % 10 < 9) {
        this._index++;
    } else if (wrap) {
        this._index -= 9;
    }
};

Window_NameInput.prototype.cursorLeft = function(wrap) {
    if (this._index % 10 > 0) {
        this._index--;
    } else if (wrap) {
        this._index += 9;
    }
};

Window_NameInput.prototype.cursorPagedown = function() {
    this._page = (this._page + 1) % this.table().length;
    this.refresh();
};

Window_NameInput.prototype.cursorPageup = function() {
    this._page = (this._page + this.table().length - 1) % this.table().length;
    this.refresh();
};

Window_NameInput.prototype.processCursorMove = function() {
    const lastPage = this._page;
    Window_Selectable.prototype.processCursorMove.call(this);
    this.updateCursor();
    if (this._page !== lastPage) {
        this.playCursorSound();
    }
};

Window_NameInput.prototype.processHandling = function() {
    if (this.isOpen() && this.active) {
        if (Input.isTriggered("shift")) {
            this.processJump();
        }
        if (Input.isRepeated("cancel")) {
            this.processBack();
        }
        if (Input.isRepeated("ok")) {
            this.processOk();
        }
    }
};

Window_NameInput.prototype.isCancelEnabled = function() {
    return true;
};

Window_NameInput.prototype.processCancel = function() {
    this.processBack();
};

Window_NameInput.prototype.processJump = function() {
    if (this._index !== 89) {
        this._index = 89;
        this.playCursorSound();
    }
};

Window_NameInput.prototype.processBack = function() {
    if (this._editWindow.back()) {
        SoundManager.playCancel();
    }
};

Window_NameInput.prototype.processOk = function() {
    if (this.character()) {
        this.onNameAdd();
    } else if (this.isPageChange()) {
        this.playOkSound();
        this.cursorPagedown();
    } else if (this.isOk()) {
        this.onNameOk();
    }
};

Window_NameInput.prototype.onNameAdd = function() {
    if (this._editWindow.add(this.character())) {
        this.playOkSound();
    } else {
        this.playBuzzerSound();
    }
};

Window_NameInput.prototype.onNameOk = function() {
    if (this._editWindow.name() === "") {
        if (this._editWindow.restoreDefault()) {
            this.playOkSound();
        } else {
            this.playBuzzerSound();
        }
    } else {
        this.playOkSound();
        this.callOkHandler();
    }
};

//-----------------------------------------------------------------------------
// Window_NameBox
//
// The window for displaying a speaker name above the message window.

function Window_NameBox() {
    this.initialize(...arguments);
}

Window_NameBox.prototype = Object.create(Window_Base.prototype);
Window_NameBox.prototype.constructor = Window_NameBox;

Window_NameBox.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, new Rectangle());
    this.openness = 0;
    this._name = "";
};

Window_NameBox.prototype.setMessageWindow = function(messageWindow) {
    this._messageWindow = messageWindow;
};

Window_NameBox.prototype.setName = function(name) {
    if (this._name !== name) {
        this._name = name;
        this.refresh();
    }
};

Window_NameBox.prototype.clear = function() {
    this.setName("");
};

Window_NameBox.prototype.start = function() {
    this.updatePlacement();
    this.updateBackground();
    this.createContents();
    this.refresh();
};

Window_NameBox.prototype.updatePlacement = function() {
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    const messageWindow = this._messageWindow;
    if ($gameMessage.isRTL()) {
        this.x = messageWindow.x + messageWindow.width - this.width;
    } else {
        this.x = messageWindow.x;
    }
    if (messageWindow.y > 0) {
        this.y = messageWindow.y - this.height;
    } else {
        this.y = messageWindow.y + messageWindow.height;
    }
};

Window_NameBox.prototype.updateBackground = function() {
    this.setBackgroundType($gameMessage.background());
};

Window_NameBox.prototype.windowWidth = function() {
    if (this._name) {
        const textWidth = this.textSizeEx(this._name).width;
        const padding = this.padding + this.itemPadding();
        const width = Math.ceil(textWidth) + padding * 2;
        return Math.min(width, Graphics.boxWidth);
    } else {
        return 0;
    }
};

Window_NameBox.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_NameBox.prototype.refresh = function() {
    const rect = this.baseTextRect();
    this.contents.clear();
    this.drawTextEx(this._name, rect.x, rect.y, rect.width);
};

//-----------------------------------------------------------------------------
// Window_ChoiceList
//
// The window used for the event command [Show Choices].

function Window_ChoiceList() {
    this.initialize(...arguments);
}

Window_ChoiceList.prototype = Object.create(Window_Command.prototype);
Window_ChoiceList.prototype.constructor = Window_ChoiceList;

Window_ChoiceList.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, new Rectangle());
    this.createCancelButton();
    this.openness = 0;
    this.deactivate();
    this._background = 0;
    this._canRepeat = false;
};

Window_ChoiceList.prototype.setMessageWindow = function(messageWindow) {
    this._messageWindow = messageWindow;
};

Window_ChoiceList.prototype.createCancelButton = function() {
    if (ConfigManager.touchUI) {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.visible = false;
        this.addChild(this._cancelButton);
    }
};

Window_ChoiceList.prototype.start = function() {
    this.updatePlacement();
    this.updateBackground();
    this.placeCancelButton();
    this.createContents();
    this.refresh();
    this.scrollTo(0, 0);
    this.selectDefault();
    this.open();
    this.activate();
};

Window_ChoiceList.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.updateCancelButton();
};

Window_ChoiceList.prototype.updateCancelButton = function() {
    if (this._cancelButton) {
        this._cancelButton.visible = this.needsCancelButton() && this.isOpen();
    }
};

Window_ChoiceList.prototype.selectDefault = function() {
    this.select($gameMessage.choiceDefaultType());
};

Window_ChoiceList.prototype.updatePlacement = function() {
    this.x = this.windowX();
    this.y = this.windowY();
    this.width = this.windowWidth();
    this.height = this.windowHeight();
};

Window_ChoiceList.prototype.updateBackground = function() {
    this._background = $gameMessage.choiceBackground();
    this.setBackgroundType(this._background);
};

Window_ChoiceList.prototype.placeCancelButton = function() {
    if (this._cancelButton) {
        const spacing = 8;
        const button = this._cancelButton;
        const right = this.x + this.width;
        if (right < Graphics.boxWidth - button.width + spacing) {
            button.x = this.width + spacing;
        } else {
            button.x = -button.width - spacing;
        }
        button.y = this.height / 2 - button.height / 2;
    }
};

Window_ChoiceList.prototype.windowX = function() {
    const positionType = $gameMessage.choicePositionType();
    if (positionType === 1) {
        return (Graphics.boxWidth - this.windowWidth()) / 2;
    } else if (positionType === 2) {
        return Graphics.boxWidth - this.windowWidth();
    } else {
        return 0;
    }
};

Window_ChoiceList.prototype.windowY = function() {
    const messageY = this._messageWindow.y;
    if (messageY >= Graphics.boxHeight / 2) {
        return messageY - this.windowHeight();
    } else {
        return messageY + this._messageWindow.height;
    }
};

Window_ChoiceList.prototype.windowWidth = function() {
    const width = this.maxChoiceWidth() + this.colSpacing() + this.padding * 2;
    return Math.min(width, Graphics.boxWidth);
};

Window_ChoiceList.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

Window_ChoiceList.prototype.numVisibleRows = function() {
    const choices = $gameMessage.choices();
    return Math.min(choices.length, this.maxLines());
};

Window_ChoiceList.prototype.maxLines = function() {
    const messageWindow = this._messageWindow;
    const messageY = messageWindow ? messageWindow.y : 0;
    const messageHeight = messageWindow ? messageWindow.height : 0;
    const centerY = Graphics.boxHeight / 2;
    if (messageY < centerY && messageY + messageHeight > centerY) {
        return 4;
    } else {
        return 8;
    }
};

Window_ChoiceList.prototype.maxChoiceWidth = function() {
    let maxWidth = 96;
    const choices = $gameMessage.choices();
    for (const choice of choices) {
        const textWidth = this.textSizeEx(choice).width;
        const choiceWidth = Math.ceil(textWidth) + this.itemPadding() * 2;
        if (maxWidth < choiceWidth) {
            maxWidth = choiceWidth;
        }
    }
    return maxWidth;
};

Window_ChoiceList.prototype.makeCommandList = function() {
    const choices = $gameMessage.choices();
    for (const choice of choices) {
        this.addCommand(choice, "choice");
    }
};

Window_ChoiceList.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    this.drawTextEx(this.commandName(index), rect.x, rect.y, rect.width);
};

Window_ChoiceList.prototype.isCancelEnabled = function() {
    return $gameMessage.choiceCancelType() !== -1;
};

Window_ChoiceList.prototype.needsCancelButton = function() {
    return $gameMessage.choiceCancelType() === -2;
};

Window_ChoiceList.prototype.callOkHandler = function() {
    $gameMessage.onChoice(this.index());
    this._messageWindow.terminateMessage();
    this.close();
};

Window_ChoiceList.prototype.callCancelHandler = function() {
    $gameMessage.onChoice($gameMessage.choiceCancelType());
    this._messageWindow.terminateMessage();
    this.close();
};

//-----------------------------------------------------------------------------
// Window_NumberInput
//
// The window used for the event command [Input Number].

function Window_NumberInput() {
    this.initialize(...arguments);
}

Window_NumberInput.prototype = Object.create(Window_Selectable.prototype);
Window_NumberInput.prototype.constructor = Window_NumberInput;

Window_NumberInput.prototype.initialize = function() {
    Window_Selectable.prototype.initialize.call(this, new Rectangle());
    this._number = 0;
    this._maxDigits = 1;
    this.openness = 0;
    this.createButtons();
    this.deactivate();
    this._canRepeat = false;
};

Window_NumberInput.prototype.setMessageWindow = function(messageWindow) {
    this._messageWindow = messageWindow;
};

Window_NumberInput.prototype.start = function() {
    this._maxDigits = $gameMessage.numInputMaxDigits();
    this._number = $gameVariables.value($gameMessage.numInputVariableId());
    this._number = this._number.clamp(0, Math.pow(10, this._maxDigits) - 1);
    this.updatePlacement();
    this.placeButtons();
    this.createContents();
    this.refresh();
    this.open();
    this.activate();
    this.select(0);
};

Window_NumberInput.prototype.updatePlacement = function() {
    const messageY = this._messageWindow.y;
    const spacing = 8;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    this.x = (Graphics.boxWidth - this.width) / 2;
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height - spacing;
    } else {
        this.y = messageY + this._messageWindow.height + spacing;
    }
};

Window_NumberInput.prototype.windowWidth = function() {
    const totalItemWidth = this.maxCols() * this.itemWidth();
    const totalButtonWidth = this.totalButtonWidth();
    return Math.max(totalItemWidth, totalButtonWidth) + this.padding * 2;
};

Window_NumberInput.prototype.windowHeight = function() {
    if (ConfigManager.touchUI) {
        return this.fittingHeight(1) + this.buttonSpacing() + 48;
    } else {
        return this.fittingHeight(1);
    }
};

Window_NumberInput.prototype.maxCols = function() {
    return this._maxDigits;
};

Window_NumberInput.prototype.maxItems = function() {
    return this._maxDigits;
};

Window_NumberInput.prototype.itemWidth = function() {
    return 48;
};

Window_NumberInput.prototype.itemRect = function(index) {
    const rect = Window_Selectable.prototype.itemRect.call(this, index);
    const innerMargin = this.innerWidth - this.maxCols() * this.itemWidth();
    rect.x += innerMargin / 2;
    return rect;
};

Window_NumberInput.prototype.isScrollEnabled = function() {
    return false;
};

Window_NumberInput.prototype.isHoverEnabled = function() {
    return false;
};

Window_NumberInput.prototype.createButtons = function() {
    this._buttons = [];
    if (ConfigManager.touchUI) {
        for (const type of ["down", "up", "ok"]) {
            const button = new Sprite_Button(type);
            this._buttons.push(button);
            this.addInnerChild(button);
        }
        this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
        this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
        this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
    }
};

Window_NumberInput.prototype.placeButtons = function() {
    const sp = this.buttonSpacing();
    const totalWidth = this.totalButtonWidth();
    let x = (this.innerWidth - totalWidth) / 2;
    for (const button of this._buttons) {
        button.x = x;
        button.y = this.buttonY();
        x += button.width + sp;
    }
};

Window_NumberInput.prototype.totalButtonWidth = function() {
    const sp = this.buttonSpacing();
    return this._buttons.reduce((r, button) => r + button.width + sp, -sp);
};

Window_NumberInput.prototype.buttonSpacing = function() {
    return 8;
};

Window_NumberInput.prototype.buttonY = function() {
    return this.itemHeight() + this.buttonSpacing();
};

Window_NumberInput.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.processDigitChange();
};

Window_NumberInput.prototype.processDigitChange = function() {
    if (this.isOpenAndActive()) {
        if (Input.isRepeated("up")) {
            this.changeDigit(true);
        } else if (Input.isRepeated("down")) {
            this.changeDigit(false);
        }
    }
};

Window_NumberInput.prototype.changeDigit = function(up) {
    const index = this.index();
    const place = Math.pow(10, this._maxDigits - 1 - index);
    let n = Math.floor(this._number / place) % 10;
    this._number -= n * place;
    if (up) {
        n = (n + 1) % 10;
    } else {
        n = (n + 9) % 10;
    }
    this._number += n * place;
    this.refresh();
    this.playCursorSound();
};

Window_NumberInput.prototype.isTouchOkEnabled = function() {
    return false;
};

Window_NumberInput.prototype.isOkEnabled = function() {
    return true;
};

Window_NumberInput.prototype.isCancelEnabled = function() {
    return false;
};

Window_NumberInput.prototype.processOk = function() {
    this.playOkSound();
    $gameVariables.setValue($gameMessage.numInputVariableId(), this._number);
    this._messageWindow.terminateMessage();
    this.updateInputData();
    this.deactivate();
    this.close();
};

Window_NumberInput.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const align = "center";
    const s = this._number.padZero(this._maxDigits);
    const c = s.slice(index, index + 1);
    this.resetTextColor();
    this.drawText(c, rect.x, rect.y, rect.width, align);
};

Window_NumberInput.prototype.onButtonUp = function() {
    this.changeDigit(true);
};

Window_NumberInput.prototype.onButtonDown = function() {
    this.changeDigit(false);
};

Window_NumberInput.prototype.onButtonOk = function() {
    this.processOk();
};

//-----------------------------------------------------------------------------
// Window_EventItem
//
// The window used for the event command [Select Item].

function Window_EventItem() {
    this.initialize(...arguments);
}

Window_EventItem.prototype = Object.create(Window_ItemList.prototype);
Window_EventItem.prototype.constructor = Window_EventItem;

Window_EventItem.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this.createCancelButton();
    this.openness = 0;
    this.deactivate();
    this.setHandler("ok", this.onOk.bind(this));
    this.setHandler("cancel", this.onCancel.bind(this));
    this._canRepeat = false;
};

Window_EventItem.prototype.setMessageWindow = function(messageWindow) {
    this._messageWindow = messageWindow;
};

Window_EventItem.prototype.createCancelButton = function() {
    if (ConfigManager.touchUI) {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.visible = false;
        this.addChild(this._cancelButton);
    }
};

Window_EventItem.prototype.start = function() {
    this.refresh();
    this.updatePlacement();
    this.placeCancelButton();
    this.forceSelect(0);
    this.open();
    this.activate();
};

Window_EventItem.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.updateCancelButton();
};

Window_EventItem.prototype.updateCancelButton = function() {
    if (this._cancelButton) {
        this._cancelButton.visible = this.isOpen();
    }
};

Window_EventItem.prototype.updatePlacement = function() {
    if (this._messageWindow.y >= Graphics.boxHeight / 2) {
        this.y = 0;
    } else {
        this.y = Graphics.boxHeight - this.height;
    }
};

Window_EventItem.prototype.placeCancelButton = function() {
    if (this._cancelButton) {
        const spacing = 8;
        const button = this._cancelButton;
        if (this.y === 0) {
            button.y = this.height + spacing;
        } else if (this._messageWindow.y >= Graphics.boxHeight / 4) {
            const distance = this.y - this._messageWindow.y;
            button.y = -button.height - spacing - distance;
        } else {
            button.y = -button.height - spacing;
        }
        button.x = this.width - button.width - spacing;
    }
};

Window_EventItem.prototype.includes = function(item) {
    const itypeId = $gameMessage.itemChoiceItypeId();
    return DataManager.isItem(item) && item.itypeId === itypeId;
};

Window_EventItem.prototype.needsNumber = function() {
    const itypeId = $gameMessage.itemChoiceItypeId();
    if (itypeId === 2) {
        // Key Item
        return $dataSystem.optKeyItemsNumber;
    } else if (itypeId >= 3) {
        // Hidden Item
        return false;
    } else {
        // Normal Item
        return true;
    }
};

Window_EventItem.prototype.isEnabled = function(/*item*/) {
    return true;
};

Window_EventItem.prototype.onOk = function() {
    const item = this.item();
    const itemId = item ? item.id : 0;
    $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
    this._messageWindow.terminateMessage();
    this.close();
};

Window_EventItem.prototype.onCancel = function() {
    $gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);
    this._messageWindow.terminateMessage();
    this.close();
};

//-----------------------------------------------------------------------------
// Window_Message
//
// The window for displaying text messages.

function Window_Message() {
    this.initialize(...arguments);
}

Window_Message.prototype = Object.create(Window_Base.prototype);
Window_Message.prototype.constructor = Window_Message;

Window_Message.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.initMembers();
};

Window_Message.prototype.initMembers = function() {
    this._background = 0;
    this._positionType = 2;
    this._waitCount = 0;
    this._faceBitmap = null;
    this._textState = null;
    this._goldWindow = null;
    this._nameBoxWindow = null;
    this._choiceListWindow = null;
    this._numberInputWindow = null;
    this._eventItemWindow = null;
    this.clearFlags();
};

Window_Message.prototype.setGoldWindow = function(goldWindow) {
    this._goldWindow = goldWindow;
};

Window_Message.prototype.setNameBoxWindow = function(nameBoxWindow) {
    this._nameBoxWindow = nameBoxWindow;
};

Window_Message.prototype.setChoiceListWindow = function(choiceListWindow) {
    this._choiceListWindow = choiceListWindow;
};

Window_Message.prototype.setNumberInputWindow = function(numberInputWindow) {
    this._numberInputWindow = numberInputWindow;
};

Window_Message.prototype.setEventItemWindow = function(eventItemWindow) {
    this._eventItemWindow = eventItemWindow;
};

Window_Message.prototype.clearFlags = function() {
    this._showFast = false;
    this._lineShowFast = false;
    this._pauseSkip = false;
};

Window_Message.prototype.update = function() {
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);
    this.synchronizeNameBox();
    while (!this.isOpening() && !this.isClosing()) {
        if (this.updateWait()) {
            return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
            return;
        } else if (this.updateMessage()) {
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
            this.startInput();
            return;
        }
    }
};

Window_Message.prototype.checkToNotClose = function() {
    if (this.isOpen() && this.isClosing() && this.doesContinue()) {
        this.open();
    }
};

Window_Message.prototype.synchronizeNameBox = function() {
    this._nameBoxWindow.openness = this.openness;
};

Window_Message.prototype.canStart = function() {
    return $gameMessage.hasText() && !$gameMessage.scrollMode();
};

Window_Message.prototype.startMessage = function() {
    const text = $gameMessage.allText();
    const textState = this.createTextState(text, 0, 0, 0);
    textState.x = this.newLineX(textState);
    textState.startX = textState.x;
    this._textState = textState;
    this.newPage(this._textState);
    this.updatePlacement();
    this.updateBackground();
    this.open();
    this._nameBoxWindow.start();
};

Window_Message.prototype.newLineX = function(textState) {
    const faceExists = $gameMessage.faceName() !== "";
    const faceWidth = ImageManager.standardFaceWidth;
    const spacing = 20;
    const margin = faceExists ? faceWidth + spacing : 4;
    return textState.rtl ? this.innerWidth - margin : margin;
};

Window_Message.prototype.updatePlacement = function() {
    const goldWindow = this._goldWindow;
    this._positionType = $gameMessage.positionType();
    this.y = (this._positionType * (Graphics.boxHeight - this.height)) / 2;
    if (goldWindow) {
        goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
    }
};

Window_Message.prototype.updateBackground = function() {
    this._background = $gameMessage.background();
    this.setBackgroundType(this._background);
};

Window_Message.prototype.terminateMessage = function() {
    this.close();
    this._goldWindow.close();
    $gameMessage.clear();
};

Window_Message.prototype.updateWait = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    } else {
        return false;
    }
};

Window_Message.prototype.cancelWait = function() {
    if ($gameSystem.isMessageSkipEnabled()) {
        this._waitCount = 0;
    }
};

Window_Message.prototype.updateLoading = function() {
    if (this._faceBitmap) {
        if (this._faceBitmap.isReady()) {
            this.drawMessageFace();
            this._faceBitmap = null;
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};

Window_Message.prototype.updateInput = function() {
    if (this.isAnySubWindowActive()) {
        return true;
    }
    if (this.pause) {
        if (this.isTriggered()) {
            Input.update();
            this.pause = false;
            if (!this._textState) {
                this.terminateMessage();
            }
        }
        return true;
    }
    return false;
};

Window_Message.prototype.isAnySubWindowActive = function() {
    return (
        this._choiceListWindow.active ||
        this._numberInputWindow.active ||
        this._eventItemWindow.active
    );
};

Window_Message.prototype.updateMessage = function() {
    const textState = this._textState;
    if (textState) {
        while (!this.isEndOfText(textState)) {
            if (this.needsNewPage(textState)) {
                this.newPage(textState);
            }
            this.updateShowFast();
            this.processCharacter(textState);
            if (this.shouldBreakHere(textState)) {
                break;
            }
        }
        this.flushTextState(textState);
        if (this.isEndOfText(textState) && !this.isWaiting()) {
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};

Window_Message.prototype.shouldBreakHere = function(textState) {
    if (this.canBreakHere(textState)) {
        if (!this._showFast && !this._lineShowFast) {
            return true;
        }
        if (this.isWaiting()) {
            return true;
        }
    }
    return false;
};

Window_Message.prototype.canBreakHere = function(textState) {
    if (!this.isEndOfText(textState)) {
        const c = textState.text[textState.index];
        if (c.charCodeAt(0) >= 0xdc00 && c.charCodeAt(0) <= 0xdfff) {
            // surrogate pair
            return false;
        }
        if (textState.rtl && c.charCodeAt(0) > 0x20) {
            return false;
        }
    }
    return true;
};

Window_Message.prototype.onEndOfText = function() {
    if (!this.startInput()) {
        if (!this._pauseSkip) {
            this.startPause();
        } else {
            this.terminateMessage();
        }
    }
    this._textState = null;
};

Window_Message.prototype.startInput = function() {
    if ($gameMessage.isChoice()) {
        this._choiceListWindow.start();
        return true;
    } else if ($gameMessage.isNumberInput()) {
        this._numberInputWindow.start();
        return true;
    } else if ($gameMessage.isItemChoice()) {
        this._eventItemWindow.start();
        return true;
    } else {
        return false;
    }
};

Window_Message.prototype.isTriggered = function() {
    return (
        Input.isRepeated("ok") ||
        Input.isRepeated("cancel") ||
        TouchInput.isRepeated()
    );
};

Window_Message.prototype.doesContinue = function() {
    return (
        $gameMessage.hasText() &&
        !$gameMessage.scrollMode() &&
        !this.areSettingsChanged()
    );
};

Window_Message.prototype.areSettingsChanged = function() {
    return (
        this._background !== $gameMessage.background() ||
        this._positionType !== $gameMessage.positionType()
    );
};

Window_Message.prototype.updateShowFast = function() {
    if (this.isTriggered()) {
        this._showFast = true;
    }
};

Window_Message.prototype.newPage = function(textState) {
    this.contents.clear();
    this.resetFontSettings();
    this.clearFlags();
    this.updateSpeakerName();
    this.loadMessageFace();
    textState.x = textState.startX;
    textState.y = 0;
    textState.height = this.calcTextHeight(textState);
};

Window_Message.prototype.updateSpeakerName = function() {
    this._nameBoxWindow.setName($gameMessage.speakerName());
};

Window_Message.prototype.loadMessageFace = function() {
    this._faceBitmap = ImageManager.loadFace($gameMessage.faceName());
};

Window_Message.prototype.drawMessageFace = function() {
    const faceName = $gameMessage.faceName();
    const faceIndex = $gameMessage.faceIndex();
    const rtl = $gameMessage.isRTL();
    const width = ImageManager.standardFaceWidth;
    const height = this.innerHeight;
    const x = rtl ? this.innerWidth - width - 4 : 4;
    this.drawFace(faceName, faceIndex, x, 0, width, height);
};

Window_Message.prototype.processControlCharacter = function(textState, c) {
    Window_Base.prototype.processControlCharacter.call(this, textState, c);
    if (c === "\f") {
        this.processNewPage(textState);
    }
};

Window_Message.prototype.processNewLine = function(textState) {
    this._lineShowFast = false;
    Window_Base.prototype.processNewLine.call(this, textState);
    if (this.needsNewPage(textState)) {
        this.startPause();
    }
};

Window_Message.prototype.processNewPage = function(textState) {
    if (textState.text[textState.index] === "\n") {
        textState.index++;
    }
    textState.y = this.contents.height;
    this.startPause();
};

Window_Message.prototype.isEndOfText = function(textState) {
    return textState.index >= textState.text.length;
};

Window_Message.prototype.needsNewPage = function(textState) {
    return (
        !this.isEndOfText(textState) &&
        textState.y + textState.height > this.contents.height
    );
};

Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
        case "$":
            this._goldWindow.open();
            break;
        case ".":
            this.startWait(15);
            break;
        case "|":
            this.startWait(60);
            break;
        case "!":
            this.startPause();
            break;
        case ">":
            this._lineShowFast = true;
            break;
        case "<":
            this._lineShowFast = false;
            break;
        case "^":
            this._pauseSkip = true;
            break;
        default:
            Window_Base.prototype.processEscapeCharacter.call(
                this,
                code,
                textState
            );
            break;
    }
};

Window_Message.prototype.startWait = function(count) {
    this._waitCount = count;
};

Window_Message.prototype.startPause = function() {
    this.startWait(10);
    this.pause = true;
};

Window_Message.prototype.isWaiting = function() {
    return this.pause || this._waitCount > 0;
};

//-----------------------------------------------------------------------------
// Window_ScrollText
//
// The window for displaying scrolling text. No frame is displayed, but it
// is handled as a window for convenience.

function Window_ScrollText() {
    this.initialize(...arguments);
}

Window_ScrollText.prototype = Object.create(Window_Base.prototype);
Window_ScrollText.prototype.constructor = Window_ScrollText;

Window_ScrollText.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, new Rectangle());
    this.opacity = 0;
    this.hide();
    this._reservedRect = rect;
    this._text = "";
    this._maxBitmapHeight = 2048;
    this._allTextHeight = 0;
    this._blockHeight = 0;
    this._blockIndex = 0;
    this._scrollY = 0;
};

Window_ScrollText.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if ($gameMessage.scrollMode()) {
        if (this._text) {
            this.updateMessage();
        }
        if (!this._text && $gameMessage.hasText()) {
            this.startMessage();
        }
    }
};

Window_ScrollText.prototype.startMessage = function() {
    this._text = $gameMessage.allText();
    if (this._text) {
        this.updatePlacement();
        this._allTextHeight = this.textSizeEx(this._text).height;
        this._blockHeight = this._maxBitmapHeight - this.height;
        this._blockIndex = 0;
        this.origin.y = this._scrollY = -this.height;
        this.createContents();
        this.refresh();
        this.show();
    } else {
        $gameMessage.clear();
    }
};

Window_ScrollText.prototype.refresh = function() {
    const rect = this.baseTextRect();
    const y = rect.y - this._scrollY + (this._scrollY % this._blockHeight);
    this.contents.clear();
    this.drawTextEx(this._text, rect.x, y, rect.width);
};

Window_ScrollText.prototype.updatePlacement = function() {
    const rect = this._reservedRect;
    this.move(rect.x, rect.y, rect.width, rect.height);
};

Window_ScrollText.prototype.contentsHeight = function() {
    if (this._allTextHeight > 0) {
        return Math.min(this._allTextHeight, this._maxBitmapHeight);
    } else {
        return 0;
    }
};

Window_ScrollText.prototype.updateMessage = function() {
    this._scrollY += this.scrollSpeed();
    if (this._scrollY >= this._allTextHeight) {
        this.terminateMessage();
    } else {
        const blockIndex = Math.floor(this._scrollY / this._blockHeight);
        if (blockIndex > this._blockIndex) {
            this._blockIndex = blockIndex;
            this.refresh();
        }
        this.origin.y = this._scrollY % this._blockHeight;
    }
};

Window_ScrollText.prototype.scrollSpeed = function() {
    let speed = $gameMessage.scrollSpeed() / 2;
    if (this.isFastForward()) {
        speed *= this.fastForwardRate();
    }
    return speed;
};

Window_ScrollText.prototype.isFastForward = function() {
    if ($gameMessage.scrollNoFast()) {
        return false;
    } else {
        return (
            Input.isPressed("ok") ||
            Input.isPressed("shift") ||
            TouchInput.isPressed()
        );
    }
};

Window_ScrollText.prototype.fastForwardRate = function() {
    return 3;
};

Window_ScrollText.prototype.terminateMessage = function() {
    this._text = null;
    $gameMessage.clear();
    this.hide();
};

//-----------------------------------------------------------------------------
// Window_MapName
//
// The window for displaying the map name on the map screen.

function Window_MapName() {
    this.initialize(...arguments);
}

Window_MapName.prototype = Object.create(Window_Base.prototype);
Window_MapName.prototype.constructor = Window_MapName;

Window_MapName.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this.contentsOpacity = 0;
    this._showCount = 0;
    this.refresh();
};

Window_MapName.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
        this.updateFadeIn();
        this._showCount--;
    } else {
        this.updateFadeOut();
    }
};

Window_MapName.prototype.updateFadeIn = function() {
    this.contentsOpacity += 16;
};

Window_MapName.prototype.updateFadeOut = function() {
    this.contentsOpacity -= 16;
};

Window_MapName.prototype.open = function() {
    this.refresh();
    this._showCount = 150;
};

Window_MapName.prototype.close = function() {
    this._showCount = 0;
};

Window_MapName.prototype.refresh = function() {
    this.contents.clear();
    if ($gameMap.displayName()) {
        const width = this.innerWidth;
        this.drawBackground(0, 0, width, this.lineHeight());
        this.drawText($gameMap.displayName(), 0, 0, width, "center");
    }
};

Window_MapName.prototype.drawBackground = function(x, y, width, height) {
    const color1 = ColorManager.dimColor1();
    const color2 = ColorManager.dimColor2();
    const half = width / 2;
    this.contents.gradientFillRect(x, y, half, height, color2, color1);
    this.contents.gradientFillRect(x + half, y, half, height, color1, color2);
};

//-----------------------------------------------------------------------------
// Window_BattleLog
//
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.

function Window_BattleLog() {
    this.initialize(...arguments);
}

Window_BattleLog.prototype = Object.create(Window_Base.prototype);
Window_BattleLog.prototype.constructor = Window_BattleLog;

Window_BattleLog.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.opacity = 0;
    this._lines = [];
    this._methods = [];
    this._waitCount = 0;
    this._waitMode = "";
    this._baseLineStack = [];
    this._spriteset = null;
    this.refresh();
};

Window_BattleLog.prototype.setSpriteset = function(spriteset) {
    this._spriteset = spriteset;
};

Window_BattleLog.prototype.maxLines = function() {
    return 10;
};

Window_BattleLog.prototype.numLines = function() {
    return this._lines.length;
};

Window_BattleLog.prototype.messageSpeed = function() {
    return 16;
};

Window_BattleLog.prototype.isBusy = function() {
    return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
};

Window_BattleLog.prototype.update = function() {
    if (!this.updateWait()) {
        this.callNextMethod();
    }
};

Window_BattleLog.prototype.updateWait = function() {
    return this.updateWaitCount() || this.updateWaitMode();
};

Window_BattleLog.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount -= this.isFastForward() ? 3 : 1;
        if (this._waitCount < 0) {
            this._waitCount = 0;
        }
        return true;
    }
    return false;
};

Window_BattleLog.prototype.updateWaitMode = function() {
    let waiting = false;
    switch (this._waitMode) {
        case "effect":
            waiting = this._spriteset.isEffecting();
            break;
        case "movement":
            waiting = this._spriteset.isAnyoneMoving();
            break;
    }
    if (!waiting) {
        this._waitMode = "";
    }
    return waiting;
};

Window_BattleLog.prototype.setWaitMode = function(waitMode) {
    this._waitMode = waitMode;
};

Window_BattleLog.prototype.callNextMethod = function() {
    if (this._methods.length > 0) {
        const method = this._methods.shift();
        if (method.name && this[method.name]) {
            this[method.name].apply(this, method.params);
        } else {
            throw new Error("Method not found: " + method.name);
        }
    }
};

Window_BattleLog.prototype.isFastForward = function() {
    return (
        Input.isLongPressed("ok") ||
        Input.isPressed("shift") ||
        TouchInput.isLongPressed()
    );
};

Window_BattleLog.prototype.push = function(methodName) {
    const methodArgs = Array.prototype.slice.call(arguments, 1);
    this._methods.push({ name: methodName, params: methodArgs });
};

Window_BattleLog.prototype.clear = function() {
    this._lines = [];
    this._baseLineStack = [];
    this.refresh();
};

Window_BattleLog.prototype.wait = function() {
    this._waitCount = this.messageSpeed();
};

Window_BattleLog.prototype.waitForEffect = function() {
    this.setWaitMode("effect");
};

Window_BattleLog.prototype.waitForMovement = function() {
    this.setWaitMode("movement");
};

Window_BattleLog.prototype.addText = function(text) {
    this._lines.push(text);
    this.refresh();
    this.wait();
};

Window_BattleLog.prototype.pushBaseLine = function() {
    this._baseLineStack.push(this._lines.length);
};

Window_BattleLog.prototype.popBaseLine = function() {
    const baseLine = this._baseLineStack.pop();
    while (this._lines.length > baseLine) {
        this._lines.pop();
    }
};

Window_BattleLog.prototype.waitForNewLine = function() {
    let baseLine = 0;
    if (this._baseLineStack.length > 0) {
        baseLine = this._baseLineStack[this._baseLineStack.length - 1];
    }
    if (this._lines.length > baseLine) {
        this.wait();
    }
};

Window_BattleLog.prototype.popupDamage = function(target) {
    if (target.shouldPopupDamage()) {
        target.startDamagePopup();
    }
};

Window_BattleLog.prototype.performActionStart = function(subject, action) {
    subject.performActionStart(action);
};

Window_BattleLog.prototype.performAction = function(subject, action) {
    subject.performAction(action);
};

Window_BattleLog.prototype.performActionEnd = function(subject) {
    subject.performActionEnd();
};

Window_BattleLog.prototype.performDamage = function(target) {
    target.performDamage();
};

Window_BattleLog.prototype.performMiss = function(target) {
    target.performMiss();
};

Window_BattleLog.prototype.performRecovery = function(target) {
    target.performRecovery();
};

Window_BattleLog.prototype.performEvasion = function(target) {
    target.performEvasion();
};

Window_BattleLog.prototype.performMagicEvasion = function(target) {
    target.performMagicEvasion();
};

Window_BattleLog.prototype.performCounter = function(target) {
    target.performCounter();
};

Window_BattleLog.prototype.performReflection = function(target) {
    target.performReflection();
};

Window_BattleLog.prototype.performSubstitute = function(substitute, target) {
    substitute.performSubstitute(target);
};

Window_BattleLog.prototype.performCollapse = function(target) {
    target.performCollapse();
};

// prettier-ignore
Window_BattleLog.prototype.showAnimation = function(
    subject, targets, animationId
) {
    if (animationId < 0) {
        this.showAttackAnimation(subject, targets);
    } else {
        this.showNormalAnimation(targets, animationId);
    }
};

Window_BattleLog.prototype.showAttackAnimation = function(subject, targets) {
    if (subject.isActor()) {
        this.showActorAttackAnimation(subject, targets);
    } else {
        this.showEnemyAttackAnimation(subject, targets);
    }
};

// prettier-ignore
Window_BattleLog.prototype.showActorAttackAnimation = function(
    subject, targets
) {
    this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
    this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
};

// prettier-ignore
Window_BattleLog.prototype.showEnemyAttackAnimation = function(
    /* subject, targets */
) {
    SoundManager.playEnemyAttack();
};

// prettier-ignore
Window_BattleLog.prototype.showNormalAnimation = function(
    targets, animationId, mirror
) {
    const animation = $dataAnimations[animationId];
    if (animation) {
        $gameTemp.requestAnimation(targets, animationId, mirror);
    }
};

Window_BattleLog.prototype.refresh = function() {
    this.drawBackground();
    this.contents.clear();
    for (let i = 0; i < this._lines.length; i++) {
        this.drawLineText(i);
    }
};

Window_BattleLog.prototype.drawBackground = function() {
    const rect = this.backRect();
    const color = this.backColor();
    this.contentsBack.clear();
    this.contentsBack.paintOpacity = this.backPaintOpacity();
    this.contentsBack.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contentsBack.paintOpacity = 255;
};

Window_BattleLog.prototype.backRect = function() {
    const height = this.numLines() * this.itemHeight();
    return new Rectangle(0, 0, this.innerWidth, height);
};

Window_BattleLog.prototype.lineRect = function(index) {
    const itemHeight = this.itemHeight();
    const padding = this.itemPadding();
    const x = padding;
    const y = index * itemHeight;
    const width = this.innerWidth - padding * 2;
    const height = itemHeight;
    return new Rectangle(x, y, width, height);
};

Window_BattleLog.prototype.backColor = function() {
    return "#000000";
};

Window_BattleLog.prototype.backPaintOpacity = function() {
    return 64;
};

Window_BattleLog.prototype.drawLineText = function(index) {
    const rect = this.lineRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
};

Window_BattleLog.prototype.startTurn = function() {
    this.push("wait");
};

Window_BattleLog.prototype.startAction = function(subject, action, targets) {
    const item = action.item();
    this.push("performActionStart", subject, action);
    this.push("waitForMovement");
    this.push("performAction", subject, action);
    this.push("showAnimation", subject, targets.clone(), item.animationId);
    this.displayAction(subject, item);
};

Window_BattleLog.prototype.endAction = function(subject) {
    this.push("waitForNewLine");
    this.push("clear");
    this.push("performActionEnd", subject);
};

Window_BattleLog.prototype.displayCurrentState = function(subject) {
    const stateText = subject.mostImportantStateText();
    if (stateText) {
        this.push("addText", stateText.format(subject.name()));
        this.push("wait");
        this.push("clear");
    }
};

Window_BattleLog.prototype.displayRegeneration = function(subject) {
    this.push("popupDamage", subject);
};

Window_BattleLog.prototype.displayAction = function(subject, item) {
    const numMethods = this._methods.length;
    if (DataManager.isSkill(item)) {
        this.displayItemMessage(item.message1, subject, item);
        this.displayItemMessage(item.message2, subject, item);
    } else {
        this.displayItemMessage(TextManager.useItem, subject, item);
    }
    if (this._methods.length === numMethods) {
        this.push("wait");
    }
};

Window_BattleLog.prototype.displayItemMessage = function(fmt, subject, item) {
    if (fmt) {
        this.push("addText", fmt.format(subject.name(), item.name));
    }
};

Window_BattleLog.prototype.displayCounter = function(target) {
    this.push("performCounter", target);
    this.push("addText", TextManager.counterAttack.format(target.name()));
};

Window_BattleLog.prototype.displayReflection = function(target) {
    this.push("performReflection", target);
    this.push("addText", TextManager.magicReflection.format(target.name()));
};

Window_BattleLog.prototype.displaySubstitute = function(substitute, target) {
    const substName = substitute.name();
    const text = TextManager.substitute.format(substName, target.name());
    this.push("performSubstitute", substitute, target);
    this.push("addText", text);
};

Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    if (target.result().used) {
        this.push("pushBaseLine");
        this.displayCritical(target);
        this.push("popupDamage", target);
        this.push("popupDamage", subject);
        this.displayDamage(target);
        this.displayAffectedStatus(target);
        this.displayFailure(target);
        this.push("waitForNewLine");
        this.push("popBaseLine");
    }
};

Window_BattleLog.prototype.displayFailure = function(target) {
    if (target.result().isHit() && !target.result().success) {
        this.push("addText", TextManager.actionFailure.format(target.name()));
    }
};

Window_BattleLog.prototype.displayCritical = function(target) {
    if (target.result().critical) {
        if (target.isActor()) {
            this.push("addText", TextManager.criticalToActor);
        } else {
            this.push("addText", TextManager.criticalToEnemy);
        }
    }
};

Window_BattleLog.prototype.displayDamage = function(target) {
    if (target.result().missed) {
        this.displayMiss(target);
    } else if (target.result().evaded) {
        this.displayEvasion(target);
    } else {
        this.displayHpDamage(target);
        this.displayMpDamage(target);
        this.displayTpDamage(target);
    }
};

Window_BattleLog.prototype.displayMiss = function(target) {
    let fmt;
    if (target.result().physical) {
        const isActor = target.isActor();
        fmt = isActor ? TextManager.actorNoHit : TextManager.enemyNoHit;
        this.push("performMiss", target);
    } else {
        fmt = TextManager.actionFailure;
    }
    this.push("addText", fmt.format(target.name()));
};

Window_BattleLog.prototype.displayEvasion = function(target) {
    let fmt;
    if (target.result().physical) {
        fmt = TextManager.evasion;
        this.push("performEvasion", target);
    } else {
        fmt = TextManager.magicEvasion;
        this.push("performMagicEvasion", target);
    }
    this.push("addText", fmt.format(target.name()));
};

Window_BattleLog.prototype.displayHpDamage = function(target) {
    if (target.result().hpAffected) {
        if (target.result().hpDamage > 0 && !target.result().drain) {
            this.push("performDamage", target);
        }
        if (target.result().hpDamage < 0) {
            this.push("performRecovery", target);
        }
        this.push("addText", this.makeHpDamageText(target));
    }
};

Window_BattleLog.prototype.displayMpDamage = function(target) {
    if (target.isAlive() && target.result().mpDamage !== 0) {
        if (target.result().mpDamage < 0) {
            this.push("performRecovery", target);
        }
        this.push("addText", this.makeMpDamageText(target));
    }
};

Window_BattleLog.prototype.displayTpDamage = function(target) {
    if (target.isAlive() && target.result().tpDamage !== 0) {
        if (target.result().tpDamage < 0) {
            this.push("performRecovery", target);
        }
        this.push("addText", this.makeTpDamageText(target));
    }
};

Window_BattleLog.prototype.displayAffectedStatus = function(target) {
    if (target.result().isStatusAffected()) {
        this.push("pushBaseLine");
        this.displayChangedStates(target);
        this.displayChangedBuffs(target);
        this.push("waitForNewLine");
        this.push("popBaseLine");
    }
};

Window_BattleLog.prototype.displayAutoAffectedStatus = function(target) {
    if (target.result().isStatusAffected()) {
        this.displayAffectedStatus(target, null);
        this.push("clear");
    }
};

Window_BattleLog.prototype.displayChangedStates = function(target) {
    this.displayAddedStates(target);
    this.displayRemovedStates(target);
};

Window_BattleLog.prototype.displayAddedStates = function(target) {
    const result = target.result();
    const states = result.addedStateObjects();
    for (const state of states) {
        const stateText = target.isActor() ? state.message1 : state.message2;
        if (state.id === target.deathStateId()) {
            this.push("performCollapse", target);
        }
        if (stateText) {
            this.push("popBaseLine");
            this.push("pushBaseLine");
            this.push("addText", stateText.format(target.name()));
            this.push("waitForEffect");
        }
    }
};

Window_BattleLog.prototype.displayRemovedStates = function(target) {
    const result = target.result();
    const states = result.removedStateObjects();
    for (const state of states) {
        if (state.message4) {
            this.push("popBaseLine");
            this.push("pushBaseLine");
            this.push("addText", state.message4.format(target.name()));
        }
    }
};

Window_BattleLog.prototype.displayChangedBuffs = function(target) {
    const result = target.result();
    this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
    this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
    this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
};

Window_BattleLog.prototype.displayBuffs = function(target, buffs, fmt) {
    for (const paramId of buffs) {
        const text = fmt.format(target.name(), TextManager.param(paramId));
        this.push("popBaseLine");
        this.push("pushBaseLine");
        this.push("addText", text);
    }
};

Window_BattleLog.prototype.makeHpDamageText = function(target) {
    const result = target.result();
    const damage = result.hpDamage;
    const isActor = target.isActor();
    let fmt;
    if (damage > 0 && result.drain) {
        fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
        return fmt.format(target.name(), TextManager.hp, damage);
    } else if (damage > 0) {
        fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
        return fmt.format(target.name(), damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
        return fmt.format(target.name(), TextManager.hp, -damage);
    } else {
        fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
        return fmt.format(target.name());
    }
};

Window_BattleLog.prototype.makeMpDamageText = function(target) {
    const result = target.result();
    const damage = result.mpDamage;
    const isActor = target.isActor();
    let fmt;
    if (damage > 0 && result.drain) {
        fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
        return fmt.format(target.name(), TextManager.mp, damage);
    } else if (damage > 0) {
        fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
        return fmt.format(target.name(), TextManager.mp, damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
        return fmt.format(target.name(), TextManager.mp, -damage);
    } else {
        return "";
    }
};

Window_BattleLog.prototype.makeTpDamageText = function(target) {
    const result = target.result();
    const damage = result.tpDamage;
    const isActor = target.isActor();
    let fmt;
    if (damage > 0) {
        fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
        return fmt.format(target.name(), TextManager.tp, damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
        return fmt.format(target.name(), TextManager.tp, -damage);
    } else {
        return "";
    }
};

//-----------------------------------------------------------------------------
// Window_PartyCommand
//
// The window for selecting whether to fight or escape on the battle screen.

function Window_PartyCommand() {
    this.initialize(...arguments);
}

Window_PartyCommand.prototype = Object.create(Window_Command.prototype);
Window_PartyCommand.prototype.constructor = Window_PartyCommand;

Window_PartyCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.deactivate();
};

Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight, "fight");
    this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
};

Window_PartyCommand.prototype.setup = function() {
    this.refresh();
    this.forceSelect(0);
    this.activate();
    this.open();
};

//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.

function Window_ActorCommand() {
    this.initialize(...arguments);
}

Window_ActorCommand.prototype = Object.create(Window_Command.prototype);
Window_ActorCommand.prototype.constructor = Window_ActorCommand;

Window_ActorCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.deactivate();
    this._actor = null;
};

Window_ActorCommand.prototype.makeCommandList = function() {
    if (this._actor) {
        this.addAttackCommand();
        this.addSkillCommands();
        this.addGuardCommand();
        this.addItemCommand();
    }
};

Window_ActorCommand.prototype.addAttackCommand = function() {
    this.addCommand(TextManager.attack, "attack", this._actor.canAttack());
};

Window_ActorCommand.prototype.addSkillCommands = function() {
    const skillTypes = this._actor.skillTypes();
    for (const stypeId of skillTypes) {
        const name = $dataSystem.skillTypes[stypeId];
        this.addCommand(name, "skill", true, stypeId);
    }
};

Window_ActorCommand.prototype.addGuardCommand = function() {
    this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
};

Window_ActorCommand.prototype.addItemCommand = function() {
    this.addCommand(TextManager.item, "item");
};

Window_ActorCommand.prototype.setup = function(actor) {
    this._actor = actor;
    this.refresh();
    this.selectLast();
    this.activate();
    this.open();
};

Window_ActorCommand.prototype.actor = function() {
    return this._actor;
};

Window_ActorCommand.prototype.processOk = function() {
    if (this._actor) {
        if (ConfigManager.commandRemember) {
            this._actor.setLastCommandSymbol(this.currentSymbol());
        } else {
            this._actor.setLastCommandSymbol("");
        }
    }
    Window_Command.prototype.processOk.call(this);
};

Window_ActorCommand.prototype.selectLast = function() {
    this.forceSelect(0);
    if (this._actor && ConfigManager.commandRemember) {
        const symbol = this._actor.lastCommandSymbol();
        this.selectSymbol(symbol);
        if (symbol === "skill") {
            const skill = this._actor.lastBattleSkill();
            if (skill) {
                this.selectExt(skill.stypeId);
            }
        }
    }
};

//-----------------------------------------------------------------------------
// Window_BattleStatus
//
// The window for displaying the status of party members on the battle screen.

function Window_BattleStatus() {
    this.initialize(...arguments);
}

Window_BattleStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_BattleStatus.prototype.constructor = Window_BattleStatus;

Window_BattleStatus.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
    this.frameVisible = false;
    this.openness = 0;
    this._bitmapsReady = 0;
    this.preparePartyRefresh();
};

Window_BattleStatus.prototype.extraHeight = function() {
    return 10;
};

Window_BattleStatus.prototype.maxCols = function() {
    return 4;
};

Window_BattleStatus.prototype.itemHeight = function() {
    return this.innerHeight;
};

Window_BattleStatus.prototype.maxItems = function() {
    return $gameParty.battleMembers().length;
};

Window_BattleStatus.prototype.rowSpacing = function() {
    return 0;
};

Window_BattleStatus.prototype.updatePadding = function() {
    this.padding = 8;
};

Window_BattleStatus.prototype.actor = function(index) {
    return $gameParty.battleMembers()[index];
};

Window_BattleStatus.prototype.selectActor = function(actor) {
    const members = $gameParty.battleMembers();
    this.select(members.indexOf(actor));
};

Window_BattleStatus.prototype.update = function() {
    Window_StatusBase.prototype.update.call(this);
    if ($gameTemp.isBattleRefreshRequested()) {
        this.preparePartyRefresh();
    }
};

Window_BattleStatus.prototype.preparePartyRefresh = function() {
    $gameTemp.clearBattleRefreshRequest();
    this._bitmapsReady = 0;
    for (const actor of $gameParty.members()) {
        const bitmap = ImageManager.loadFace(actor.faceName());
        bitmap.addLoadListener(this.performPartyRefresh.bind(this));
    }
};

Window_BattleStatus.prototype.performPartyRefresh = function() {
    this._bitmapsReady++;
    if (this._bitmapsReady >= $gameParty.members().length) {
        this.refresh();
    }
};

Window_BattleStatus.prototype.drawItem = function(index) {
    this.drawItemImage(index);
    this.drawItemStatus(index);
};

Window_BattleStatus.prototype.drawItemImage = function(index) {
    const actor = this.actor(index);
    const rect = this.faceRect(index);
    this.drawActorFace(actor, rect.x, rect.y, rect.width, rect.height);
};

Window_BattleStatus.prototype.drawItemStatus = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRectWithPadding(index);
    const nameX = this.nameX(rect);
    const nameY = this.nameY(rect);
    const stateIconX = this.stateIconX(rect);
    const stateIconY = this.stateIconY(rect);
    const basicGaugesX = this.basicGaugesX(rect);
    const basicGaugesY = this.basicGaugesY(rect);
    this.placeTimeGauge(actor, nameX, nameY);
    this.placeActorName(actor, nameX, nameY);
    this.placeStateIcon(actor, stateIconX, stateIconY);
    this.placeBasicGauges(actor, basicGaugesX, basicGaugesY);
};

Window_BattleStatus.prototype.faceRect = function(index) {
    const rect = this.itemRect(index);
    rect.pad(-1);
    rect.height = this.nameY(rect) + this.gaugeLineHeight() / 2 - rect.y;
    return rect;
};

Window_BattleStatus.prototype.nameX = function(rect) {
    return rect.x;
};

Window_BattleStatus.prototype.nameY = function(rect) {
    return this.basicGaugesY(rect) - this.gaugeLineHeight();
};

Window_BattleStatus.prototype.stateIconX = function(rect) {
    return rect.x + rect.width - ImageManager.standardIconWidth / 2 + 4;
};

Window_BattleStatus.prototype.stateIconY = function(rect) {
    return rect.y + ImageManager.standardIconHeight / 2 + 4;
};

Window_BattleStatus.prototype.basicGaugesX = function(rect) {
    return rect.x;
};

Window_BattleStatus.prototype.basicGaugesY = function(rect) {
    const bottom = rect.y + rect.height - this.extraHeight();
    const numGauges = $dataSystem.optDisplayTp ? 3 : 2;
    return bottom - this.gaugeLineHeight() * numGauges;
};

//-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.

function Window_BattleActor() {
    this.initialize(...arguments);
}

Window_BattleActor.prototype = Object.create(Window_BattleStatus.prototype);
Window_BattleActor.prototype.constructor = Window_BattleActor;

Window_BattleActor.prototype.initialize = function(rect) {
    Window_BattleStatus.prototype.initialize.call(this, rect);
    this.openness = 255;
    this.hide();
};

Window_BattleActor.prototype.show = function() {
    this.forceSelect(0);
    $gameTemp.clearTouchState();
    Window_BattleStatus.prototype.show.call(this);
};

Window_BattleActor.prototype.hide = function() {
    Window_BattleStatus.prototype.hide.call(this);
    $gameParty.select(null);
};

Window_BattleActor.prototype.select = function(index) {
    Window_BattleStatus.prototype.select.call(this, index);
    $gameParty.select(this.actor(index));
};

Window_BattleActor.prototype.processTouch = function() {
    Window_BattleStatus.prototype.processTouch.call(this);
    if (this.isOpenAndActive()) {
        const target = $gameTemp.touchTarget();
        if (target) {
            const members = $gameParty.battleMembers();
            if (members.includes(target)) {
                this.select(members.indexOf(target));
                if ($gameTemp.touchState() === "click") {
                    this.processOk();
                }
            }
            $gameTemp.clearTouchState();
        }
    }
};

//-----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.

function Window_BattleEnemy() {
    this.initialize(...arguments);
}

Window_BattleEnemy.prototype = Object.create(Window_Selectable.prototype);
Window_BattleEnemy.prototype.constructor = Window_BattleEnemy;

Window_BattleEnemy.prototype.initialize = function(rect) {
    this._enemies = [];
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
    this.hide();
};

Window_BattleEnemy.prototype.maxCols = function() {
    return 2;
};

Window_BattleEnemy.prototype.maxItems = function() {
    return this._enemies.length;
};

Window_BattleEnemy.prototype.enemy = function() {
    return this._enemies[this.index()];
};

Window_BattleEnemy.prototype.enemyIndex = function() {
    const enemy = this.enemy();
    return enemy ? enemy.index() : -1;
};

Window_BattleEnemy.prototype.drawItem = function(index) {
    this.resetTextColor();
    const name = this._enemies[index].name();
    const rect = this.itemLineRect(index);
    this.drawText(name, rect.x, rect.y, rect.width);
};

Window_BattleEnemy.prototype.show = function() {
    this.refresh();
    this.forceSelect(0);
    $gameTemp.clearTouchState();
    Window_Selectable.prototype.show.call(this);
};

Window_BattleEnemy.prototype.hide = function() {
    Window_Selectable.prototype.hide.call(this);
    $gameTroop.select(null);
};

Window_BattleEnemy.prototype.refresh = function() {
    this._enemies = $gameTroop.aliveMembers();
    Window_Selectable.prototype.refresh.call(this);
};

Window_BattleEnemy.prototype.select = function(index) {
    Window_Selectable.prototype.select.call(this, index);
    $gameTroop.select(this.enemy());
};

Window_BattleEnemy.prototype.processTouch = function() {
    Window_Selectable.prototype.processTouch.call(this);
    if (this.isOpenAndActive()) {
        const target = $gameTemp.touchTarget();
        if (target) {
            if (this._enemies.includes(target)) {
                this.select(this._enemies.indexOf(target));
                if ($gameTemp.touchState() === "click") {
                    this.processOk();
                }
            }
            $gameTemp.clearTouchState();
        }
    }
};

//-----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.

function Window_BattleSkill() {
    this.initialize(...arguments);
}

Window_BattleSkill.prototype = Object.create(Window_SkillList.prototype);
Window_BattleSkill.prototype.constructor = Window_BattleSkill;

Window_BattleSkill.prototype.initialize = function(rect) {
    Window_SkillList.prototype.initialize.call(this, rect);
    this.hide();
};

Window_BattleSkill.prototype.show = function() {
    this.selectLast();
    this.showHelpWindow();
    Window_SkillList.prototype.show.call(this);
};

Window_BattleSkill.prototype.hide = function() {
    this.hideHelpWindow();
    Window_SkillList.prototype.hide.call(this);
};

//-----------------------------------------------------------------------------
// Window_BattleItem
//
// The window for selecting an item to use on the battle screen.

function Window_BattleItem() {
    this.initialize(...arguments);
}

Window_BattleItem.prototype = Object.create(Window_ItemList.prototype);
Window_BattleItem.prototype.constructor = Window_BattleItem;

Window_BattleItem.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this.hide();
};

Window_BattleItem.prototype.includes = function(item) {
    return $gameParty.canUse(item);
};

Window_BattleItem.prototype.show = function() {
    this.selectLast();
    this.showHelpWindow();
    Window_ItemList.prototype.show.call(this);
};

Window_BattleItem.prototype.hide = function() {
    this.hideHelpWindow();
    Window_ItemList.prototype.hide.call(this);
};

//-----------------------------------------------------------------------------
// Window_TitleCommand
//
// The window for selecting New Game/Continue on the title screen.

function Window_TitleCommand() {
    this.initialize(...arguments);
}

Window_TitleCommand.prototype = Object.create(Window_Command.prototype);
Window_TitleCommand.prototype.constructor = Window_TitleCommand;

Window_TitleCommand.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.selectLast();
};

Window_TitleCommand._lastCommandSymbol = null;

Window_TitleCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_TitleCommand.prototype.makeCommandList = function() {
    const continueEnabled = this.isContinueEnabled();
    this.addCommand(TextManager.newGame, "newGame");
    this.addCommand(TextManager.continue_, "continue", continueEnabled);
    this.addCommand(TextManager.options, "options");
};

Window_TitleCommand.prototype.isContinueEnabled = function() {
    return DataManager.isAnySavefileExists();
};

Window_TitleCommand.prototype.processOk = function() {
    Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_TitleCommand.prototype.selectLast = function() {
    if (Window_TitleCommand._lastCommandSymbol) {
        this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
    } else if (this.isContinueEnabled()) {
        this.selectSymbol("continue");
    }
};

//-----------------------------------------------------------------------------
// Window_GameEnd
//
// The window for selecting "Go to Title" on the game end screen.

function Window_GameEnd() {
    this.initialize(...arguments);
}

Window_GameEnd.prototype = Object.create(Window_Command.prototype);
Window_GameEnd.prototype.constructor = Window_GameEnd;

Window_GameEnd.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.openness = 0;
    this.open();
};

Window_GameEnd.prototype.makeCommandList = function() {
    this.addCommand(TextManager.toTitle, "toTitle");
    this.addCommand(TextManager.cancel, "cancel");
};

//-----------------------------------------------------------------------------
// Window_DebugRange
//
// The window for selecting a block of switches/variables on the debug screen.

function Window_DebugRange() {
    this.initialize(...arguments);
}

Window_DebugRange.prototype = Object.create(Window_Selectable.prototype);
Window_DebugRange.prototype.constructor = Window_DebugRange;

Window_DebugRange.lastTopRow = 0;
Window_DebugRange.lastIndex = 0;

Window_DebugRange.prototype.initialize = function(rect) {
    this._maxSwitches = Math.ceil(($dataSystem.switches.length - 1) / 10);
    this._maxVariables = Math.ceil(($dataSystem.variables.length - 1) / 10);
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
    this.setTopRow(Window_DebugRange.lastTopRow);
    this.select(Window_DebugRange.lastIndex);
    this.activate();
};

Window_DebugRange.prototype.maxItems = function() {
    return this._maxSwitches + this._maxVariables;
};

Window_DebugRange.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this._editWindow) {
        const index = this.index();
        this._editWindow.setMode(this.mode(index));
        this._editWindow.setTopId(this.topId(index));
    }
};

Window_DebugRange.prototype.mode = function(index) {
    return this.isSwitchMode(index) ? "switch" : "variable";
};

Window_DebugRange.prototype.topId = function(index) {
    if (this.isSwitchMode(index)) {
        return index * 10 + 1;
    } else {
        return (index - this._maxSwitches) * 10 + 1;
    }
};

Window_DebugRange.prototype.isSwitchMode = function(index) {
    return index < this._maxSwitches;
};

Window_DebugRange.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const c = this.isSwitchMode(index) ? "S" : "V";
    const start = this.topId(index);
    const end = start + 9;
    const text = c + " [" + start.padZero(4) + "-" + end.padZero(4) + "]";
    this.drawText(text, rect.x, rect.y, rect.width);
};

Window_DebugRange.prototype.isCancelTriggered = function() {
    return (
        Window_Selectable.prototype.isCancelTriggered() ||
        Input.isTriggered("debug")
    );
};

Window_DebugRange.prototype.processCancel = function() {
    Window_Selectable.prototype.processCancel.call(this);
    Window_DebugRange.lastTopRow = this.topRow();
    Window_DebugRange.lastIndex = this.index();
};

Window_DebugRange.prototype.setEditWindow = function(editWindow) {
    this._editWindow = editWindow;
};

//-----------------------------------------------------------------------------
// Window_DebugEdit
//
// The window for displaying switches and variables on the debug screen.

function Window_DebugEdit() {
    this.initialize(...arguments);
}

Window_DebugEdit.prototype = Object.create(Window_Selectable.prototype);
Window_DebugEdit.prototype.constructor = Window_DebugEdit;

Window_DebugEdit.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this._mode = "switch";
    this._topId = 1;
    this.refresh();
};

Window_DebugEdit.prototype.maxItems = function() {
    return 10;
};

Window_DebugEdit.prototype.drawItem = function(index) {
    const dataId = this._topId + index;
    const idText = dataId.padZero(4) + ":";
    const idWidth = this.textWidth(idText);
    const statusWidth = this.textWidth("-00000000");
    const name = this.itemName(dataId);
    const status = this.itemStatus(dataId);
    const rect = this.itemLineRect(index);
    this.resetTextColor();
    this.drawText(idText, rect.x, rect.y, rect.width);
    rect.x += idWidth;
    rect.width -= idWidth + statusWidth;
    this.drawText(name, rect.x, rect.y, rect.width);
    this.drawText(status, rect.x + rect.width, rect.y, statusWidth, "right");
};

Window_DebugEdit.prototype.itemName = function(dataId) {
    if (this._mode === "switch") {
        return $dataSystem.switches[dataId];
    } else {
        return $dataSystem.variables[dataId];
    }
};

Window_DebugEdit.prototype.itemStatus = function(dataId) {
    if (this._mode === "switch") {
        return $gameSwitches.value(dataId) ? "[ON]" : "[OFF]";
    } else {
        return String($gameVariables.value(dataId));
    }
};

Window_DebugEdit.prototype.setMode = function(mode) {
    if (this._mode !== mode) {
        this._mode = mode;
        this.refresh();
    }
};

Window_DebugEdit.prototype.setTopId = function(id) {
    if (this._topId !== id) {
        this._topId = id;
        this.refresh();
    }
};

Window_DebugEdit.prototype.currentId = function() {
    return this._topId + this.index();
};

Window_DebugEdit.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this.active) {
        if (this._mode === "switch") {
            this.updateSwitch();
        } else {
            this.updateVariable();
        }
    }
};

Window_DebugEdit.prototype.updateSwitch = function() {
    if (Input.isRepeated("ok")) {
        const switchId = this.currentId();
        this.playCursorSound();
        $gameSwitches.setValue(switchId, !$gameSwitches.value(switchId));
        this.redrawCurrentItem();
    }
};

Window_DebugEdit.prototype.updateVariable = function() {
    const variableId = this.currentId();
    const value = $gameVariables.value(variableId);
    if (typeof value === "number") {
        const newValue = value + this.deltaForVariable();
        if (value !== newValue) {
            $gameVariables.setValue(variableId, newValue);
            this.playCursorSound();
            this.redrawCurrentItem();
        }
    }
};

Window_DebugEdit.prototype.deltaForVariable = function() {
    if (Input.isRepeated("right")) {
        return 1;
    } else if (Input.isRepeated("left")) {
        return -1;
    } else if (Input.isRepeated("pagedown")) {
        return 10;
    } else if (Input.isRepeated("pageup")) {
        return -10;
    }
    return 0;
};

//-----------------------------------------------------------------------------
