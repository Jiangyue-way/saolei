var startBtn = document.getElementById('btn'),
    box = document.getElementById('box'),
    flagBox = document.getElementById('flagBox'),
    alertBox = document.getElementById('alertBox'),
    alertImg = document.getElementsByClassName('alertImg')[0],
    close = document.getElementsByClassName('close')[0],
    score = document.getElementById('score'),
    restart = document.getElementsByClassName('restart')[0],
    easy = document.getElementsByClassName('easy')[0],
    usual = document.getElementsByClassName('usual')[0],
    hard = document.getElementsByClassName('hard')[0],
    minutes = document.getElementsByClassName('minutes')[0],
    seconds = document.getElementsByClassName('seconds')[0];
var mineNum,
    mineOver,
    littleDiv;
var flagTime = true;
var start = true;
var flagOpt = false;
var mineMap = [];
var s = 0;
var m = 10;
var n,
    opt,
    divNum,
    mineIndex;
//创建style样式表，用于伪元素选择

bindEvent();
function bindEvent(){
    startBtn.onclick = function () {
        if(start){
            start = false;
            box.style.display = 'block';
            flagBox.style.display = 'block';
            flagOpt = true;
            choose('easy');
            init();
            //设置默认时间
            // minutes.innerHTML = 10 + ' ';
            // seconds.innerHTML = 0 + ' ';
        }
    };
    box.oncontextmenu = function() {
        return false;
    };
    box.onmousedown = function (e) {
        if(flagTime){
            flagTime = false;
            time();
        }
        flagOpt = false;
        var event = e.target;
        if(e.which == 1){
            leftClick(event);
        }else if (e.which == 3){
            rightClick(event);
        }
    };
    close.onclick = function () {
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';
        start = true;
        clearTime();
        flagOpt = true;
    };
    restart.onclick = function () {
        if(box.style.display == 'block'){
            start = true;
            flagOpt = true;
            box.innerHTML = '';
            if(start){
                start = false;
                box.style.display = 'block';
                flagBox.style.display = 'block';
                init();
                stopTime();
                clearTime();
            }
        }
        // clearTime();
    };
    easy.onclick = function () {
        // console.log(window.getComputedStyle(easy, "after").display);
        if(flagOpt){  
            opt = 'easy';
            choose(opt);
            box.innerHTML = '';
            init();
        } 
    };
    usual.onclick = function () {
        if(flagOpt){   
            opt = 'usual';
            choose(opt);
            box.innerHTML = '';
            init();
        }  
    };
    hard.onclick = function () {
        if(flagOpt){
            opt = 'hard';
            choose(opt);
            box.innerHTML = '';
            init();
        }
    }
}
//生成棋盘和雷数
function init() {
    console.log(divNum);
    var leiclass;
    mineNum = divNum;
    mineOver = divNum;
    score.innerHTML = mineOver;
    if(divNum === 10){
        leiclass = 'littleDivEasy';       
    }else if (divNum === 15) {
        leiclass = 'littleDivUsual';
    }else if (divNum === 20){
        leiclass = 'littleDivHard';
    }
    for(var i = 0; i < mineNum; i ++){
        for(var j = 0; j < mineNum; j ++){
            var littleDivh = document.createElement('div');           
            littleDivh.classList.add(leiclass);       
            littleDivh.setAttribute('id', i + '-' + j);
            box.appendChild(littleDivh);
            mineMap.push({mine: 0});
        }
    }
    
    littleDiv = document.getElementsByClassName(leiclass);
    while(mineNum){
        mineIndex = Math.floor(Math.random() * divNum * divNum);
        if(mineMap[mineIndex].mine === 0){
            littleDiv[mineIndex].classList.add('isLei');
            mineMap[mineIndex].mine = 1;
            mineNum --;
        }
    }

    //设置起始时间
    minutes.innerHTML = divNum + ' ';
    seconds.innerHTML = 0 + ' ';
    
}
function leftClick(dom) {
    if(dom && dom.classList.contains('flag')){
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    if(dom && dom.classList.contains('isLei')){
        console.log('GAME OVER');

        //停止计时
        stopTime();

        for(var i = 0; i < isLei.length; i ++){
            isLei[i].classList.add('show');
        }
        setTimeout(() => {
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = 'url("src/image/gameover.jpg")';
        }, 2000);
    }else{
        var n = 0;
        var posArr = dom && dom.getAttribute('id').split('-');
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && (dom.classList.add('showNum'));
        for(var i = posX - 1; i <= posX + 1; i ++){
            for(var j = posY - 1; j <= posY + 1; j ++){
                var aroundDiv = document.getElementById(i + '-' + j);
                if(aroundDiv && aroundDiv.classList.contains('isLei')){
                    n ++;
                }
            }
        }
        dom && (dom.innerHTML = n);
        if(n == 0){
            for(var i = posX - 1; i <= posX + 1; i ++){
                for(var j = posY - 1; j <= posY + 1; j ++){
                    var nearDiv = document.getElementById(i + '-' + j);
                    if(nearDiv && nearDiv.length != 0){
                        if(!nearDiv.classList.contains('check')){
                            nearDiv.classList.add('check');
                            leftClick(nearDiv);
                        }
                    }
                    
                }
            }
        }
    }
}
function rightClick(dom){
    if(dom.classList.contains('showNum')){
        return;
    }
    dom.classList.toggle('flag');
    if(dom.classList.contains('isLei') && dom.classList.contains('flag')){
        mineOver -- ;
    }
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')){
        mineOver ++ ;
    }
    score.innerHTML = mineOver;
    if(mineOver == 0){
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url("src/image/success.jpg")';
    }
}
function time() {
    //开始计时
    if(s === 0){
        s = 59;
        m --;
    }
    minutes.innerHTML = m + ' ';
    seconds.innerHTML = s + ' ';
    s --;
    n = setTimeout(() => {
        clearTimeout(n);
        time();            
    }, 1000);
    if(m === 0 && s === 0){
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url("src/image/gameover.jpg")';
    }   
}
function clearTime() {
    //重置计时
    m = divNum;
    s = 0;
    minutes.innerHTML = m + ' ';
    seconds.innerHTML = s + ' ';
    flagTime = true;
}
function stopTime() {
    console.log(n);
    clearTimeout(n);
}
function choose (opt){ 
    var style = document.createElement("style"); 
    document.head.appendChild(style); 
    sheet = style.sheet; 

    if(opt == 'easy'){
        console.log(opt)
        divNum = 10;
        sheet.insertRule('.easy::after { display: block }', 0);
        sheet.insertRule('.usual::after { display: none }', 0);
        sheet.insertRule('.hard::after { display: none }', 0);
    }else if(opt == 'usual'){
        console.log(opt)
        divNum = 15;
        sheet.insertRule('.easy::after { display: none }', 0);
        sheet.insertRule('.usual::after { display: block }', 0);
        sheet.insertRule('.hard::after { display: none }', 0);
    }else if(opt == 'hard'){
        console.log(opt)
        divNum = 20;
        sheet.insertRule('.easy::after { display: none }', 0);
        sheet.insertRule('.usual::after { display: none }', 0);
        sheet.insertRule('.hard::after { display: block }', 0);
    }
}