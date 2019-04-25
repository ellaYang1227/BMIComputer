
// 初始值
var initdata = [
    {
        status: '理想',
        BMI: '21.90',
        weight: 70,
        height: 180,
        date: '03-30-2019',
    },
    {
        status: '過輕',
        BMI: '12.30',
        weight: 40,
        height: 180,
        date: '03-30-2019',
    }
];


// 建立 DOM
var input = document.querySelectorAll('input');
var inputLen = input.length;
var height = document.getElementById('height');
var bodyWeight = document.getElementById('bodyWeight');
var btnSend = document.getElementById('btn-send');
var btnClear = document.getElementById('btn-clear');
var BMIList = document.querySelector('.BMIList');
var BMIData = JSON.parse(localStorage.getItem('BMIDataList')) || initdata;
addData(BMIData);


// 監聽
height.addEventListener('input', verification, false);
bodyWeight.addEventListener('input', verification, false);
height.addEventListener('focus', verification, false);
bodyWeight.addEventListener('focus', verification, false);
btnSend.addEventListener('click', calculation, false);
btnClear.addEventListener('click', clearInput, false);
BMIList.addEventListener('click', delData, false);


// (1)驗證 input
function verification(e) {
    var nowInput = e.target;
    var nowInputValue = e.target.value;
    var nowInputParent = e.target.parentNode;
    var fontEl = document.createElement('font');
    var InputLittleBrother = nowInputParent.lastChild;
    var InputLittleBrotherName = InputLittleBrother.nodeName;
    var errorIcon = '<i class="fas fa-exclamation-triangle"></i>';
    if (nowInputValue == '') {
        nowInput.classList.add('error');
        if (InputLittleBrotherName == 'FONT') {
            nowInputParent.removeChild(InputLittleBrother);
        };
        nowInputParent.appendChild(fontEl);
        var errorMessage = errorIcon + '此欄位不能為「空值」，請輸入數值';
    } else {
        if (InputLittleBrotherName == 'FONT') {
            nowInputParent.removeChild(InputLittleBrother);
        };
        nowInputParent.appendChild(fontEl);
        if (isNaN(nowInputValue)) {
            var errorMessage = errorIcon + '此欄位不能為「文字」，請輸入數值';
        } else {
            // split() - 字串分割
            var nowInputValueSplit = nowInputValue.split('');
            if (nowInputValueSplit[0] == 0) {
                var errorMessage = errorIcon + '請輸入有效的數值';
            } else {
                nowInput.classList.remove('error');
                nowInputParent.removeChild(fontEl);
            };
        };
    };
    fontEl.innerHTML = errorMessage;

    var heightValue = height.value;
    var heightSplit = heightValue.split('');
    var bodyWeightValue = bodyWeight.value;
    var bodyWeightSplit = bodyWeightValue.split('');
    // isNaN() - 檢查是否非數值
    if (heightValue == '' || bodyWeightValue == '') {
        btnSend.disabled = true;
    } else {
        if (heightSplit[0] !== '0' && bodyWeightSplit[0] !== '0') {
            if (isNaN(heightValue) == false && isNaN(bodyWeightValue) == false) {
                btnSend.disabled = false;
            };
        } else {
            btnSend.disabled = true;
        };
    };
};


// (2)清空 input
function clearInput(e) {
    e.preventDefault();
    for (var i = 0; i < inputLen; i++) {
        input[i].value = '';
        input[i].classList.remove('error');
        var font = document.querySelectorAll('.form-group font');
        var fontLen = font.length;
        for (var x = 0; x < fontLen; x++) {
            font[x].outerHTML = '';
        };
    };
};


// (3-1)計算
function calculation(e) {
    var heightValue = height.value;
    var heightValueM = heightValue / 100;
    var bodyWeightValue = bodyWeight.value;

    // Math.round()-四捨五入
    var BMI = Math.round((bodyWeightValue / (heightValueM * heightValueM)) * 100) / 100;
    // toFixed(位數)-保留小數點幾位數(會自動補零) 
    var BMIFixed = BMI.toFixed(2);

    var Today = new Date();
    function nowMonth(month) {
        if (month >= 10) {
            return month;
        } else {
            return '0' + month;
        };
    };
    function nowDay(day) {
        if (day >= 10) {
            return day;
        } else {
            return '0' + day;
        };
    };
    var date = nowMonth(Today.getMonth() + 1) + '-' + nowDay(Today.getDate()) + '-' + Today.getFullYear();

    // 體重過輕 未滿 18.5
    if (BMI < 18.5) {
        var status = '過輕';
        // 理想 18.5 ~ 23
    } else if (18.5 <= BMI && BMI < 24) {
        var status = '理想';
        // 過重 24 ~ 26
    } else if (24 <= BMI && BMI < 27) {
        var status = '過重';
        // 輕度肥胖 27 ~ 29
    } else if (27 <= BMI && BMI < 30) {
        var status = '輕度肥胖';
        // 中度肥胖 30 ~ 34
    } else if (30 <= BMI && BMI < 35) {
        var status = '中度肥胖';
        // 重度肥胖 超過 35
    } else if (35 <= BMI) {
        var status = '重度肥胖';
    };


    var BMIDataItem = {
        status: status,
        BMI: BMIFixed,
        weight: bodyWeightValue,
        height: heightValue,
        date: date,
    };
    var nowBMIData = JSON.parse(localStorage.getItem('BMIDataList')) || [];
    // splice(索引位置, 要刪除元素數量, 元素)-新增或删除陣列中的元素
    nowBMIData.splice(0, 0, BMIDataItem);
    var BMIDataStr = JSON.stringify(nowBMIData);
    localStorage.setItem('BMIDataList', BMIDataStr);
    addData(nowBMIData);

    var statusEn = IFstatusEn(status);
    var resultStatus = document.querySelector('.status');
    resultStatus.classList.remove('calculation');
    var statusStyle = 'status-' + statusEn;
    resultStatus.classList.add(statusStyle);
    var resultStatusEl = '<button class="btn btn-status" disabled>' + BMIFixed + '<small>BMI</small><a href="#" id="btn-recalculate"><img src="images/icons_loop.png" alt="icons_loop"></a></button><div class="recalculateBlock">' + status +'<a href="#" id="text-recalculate">清除重算</a></div>';
    resultStatus.innerHTML = resultStatusEl;

    var btnRecalculate = document.getElementById('btn-recalculate');
	var textRecalculate = document.getElementById('text-recalculate');
    btnRecalculate.addEventListener('click', clearInput, false);
	textRecalculate.addEventListener('click', clearInput, false);
    btnRecalculate.addEventListener('click', recalculate, false);
	textRecalculate.addEventListener('click', recalculate, false);
	
	function recalculate() {
        resultStatus.classList.remove(statusStyle);
        resultStatus.classList.add('calculation');
        var calculationBtn = '<button type="button" class="btn" id="btn-send" disabled>看結果</button><a href="#" id="btn-clear"><img src="images/icons_loop.png" alt="icons_loop"></a>';
        resultStatus.innerHTML = calculationBtn;
        // 刷新當前頁面
        window.location.reload();
    };
};


// (3-2)新增&更新資料
function addData(BMIData) {
    var BMIDataLen = BMIData.length;
    var BMIItem = '';
    for (var i = 0; i < BMIDataLen; i++) {
        var status = BMIData[i].status;
        var BMI = BMIData[i].BMI;
        var weight = BMIData[i].weight;
        var height = BMIData[i].height;
        var date = BMIData[i].date;
        var statusEn = IFstatusEn(status);
        var statusBMIHTML = '<li class="list-inline-item statusTitle"><h2>' + status + '</h2><small>BMI</small>' + BMI + '</li>';
        var weightHTML = '<li class="list-inline-item"><small>weight</small>' + weight + 'kg</li>';
        var heightHTML = '<li class="list-inline-item"><small>height</small>' + height + 'cm</li>';
        var dateHTML = '<li class="list-inline-item measureDate"><small>' + date + '</small></li>';
        var BMILiHTML = '<li class="statusList-' + statusEn + '"><div class="statusLine-' + statusEn + '"></div><ul class="list-unstyled list-inline">' + statusBMIHTML + weightHTML + heightHTML + dateHTML + '</li><li class="list-inline-item delItemBtn"><button type="button" class="btn btn-outline-danger btn-sm btn-del"' + 'data-num="' + i + '"><i class="fas fa-trash-alt"></i>刪除</button></li></ul></li>';
        BMIItem += BMILiHTML;
    };
    BMIList.innerHTML = BMIItem;
};

// (3-3)判斷
function IFstatusEn(status) {
    switch (status) {
        case '理想':
            return statusEn = 'ideal';
        case '過輕':
            return statusEn = 'tooLight';
        case '過重':
            return statusEn = 'tooHeavy';
        case '輕度肥胖':
            return statusEn = 'mildObesity';
        case '中度肥胖':
            return statusEn = 'moderateObesity';
        default:
            return statusEn = 'severeObesity';
    };
};


// (4)刪除資料
function delData(e) {
    var BMIDataArr = JSON.parse(localStorage.getItem('BMIDataList')) || initdata;
    var num = e.target.dataset.num;
    var clickName = e.target.nodeName;
    console.log(clickName);
    if (clickName == 'BUTTON') {
        BMIDataArr.splice(num, 1);
        var BMIDataStr = JSON.stringify(BMIDataArr);
        localStorage.setItem('BMIDataList', BMIDataStr);
        addData(BMIDataArr);
    };
};

