const container = document.getElementById("container");
//填充container的HTML
container.innerHTML =
    `
<div style="position: relative; width: 0; height: 0">
            <div id="ruleBoard">
            <div id="ruleHead">
            <h1>Rules</h1>
                </div>
                    <div id="ruleContent">
                        <div class="center">
                            <p>
                                <h3 class="center">~基本規則~</h3>
                            </p>
                            <p><b>設定好時限後，點擊<img class="ruleIcons" src="resources/start.png" width="20px" height="20px">即可開始遊戲</b></p>
                            <p>點擊<b>異色</b>的方塊即可<b>得分並通往下一關</b>
                            </p>
                            <p>點擊<b>同色</b>的方塊將<b>失去1點生命</b>(每局5點)
                            </p>
                            <p><b>當剩餘時間或剩餘生命歸0，遊戲結束</b></p>
                            <p>
                                <p>
                                    <h3 class="center">~按鈕解說~</h3>
                                </p>
                        </div>
                    <div style="padding-left: 20px;">
                        <p><img class="ruleIcons" src="resources/start.png" width="20px" height="20px"> : 開始遊戲</p>
                        <p><img class="ruleIcons" src="resources/reset.png" width="20px" height="20px"> : 重置遊戲</p>
                        <p><img class="ruleIcons" src="resources/pause.png" width="20px" height="20px"><img class="ruleIcons" src="resources/play.png" width="20px" height="20px"> : 暫停/開始遊戲(分數將不會計入記分板)</p>
                        <p><img class="ruleIcons" src="resources/soundEffect_on.png" width="20px" height="20px"><img class="ruleIcons" src="resources/soundEffect_off.png" width="20px" height="20px"> : 開啟/關閉按鍵音效</p>
                        <p><img class="ruleIcons" src="resources/BGM_on.png" width="20px" height="20px"><img class="ruleIcons" src="resources/soundEffect_off.png" width="20px" height="20px"> : 開啟/關閉背景音樂</p>
                        <p><img class="ruleIcons" src="resources/hint.png" width="20px" height="20px"> : 將範圍縮至包含異色方塊的九宮格</p>
                        <p>(需支付1點生命，生命剩餘1以及前2關無法使用)</p>
                    </div>
                </div>
            <div id="ruleTail">
        </div>
            </div>
            <div id="scoreBoard">
                <div id="scoreHead">
                    <h1>Scores</h1>
                </div>
                <div id="scoreContent">
                </div>
                <div id="scoreTail">
                </div>
            </div>
        </div>
        <div id="settingBoard">
            <b>時限:</b>
            <input type="number" min="0" max="59" id="min" class="settingItem" value="1"><b>分</b>
            <input type="number" min="0" max="59" id="sec" class="settingItem" value="0"><b>秒</b>
            <div style="position: relative; width: 0; height: 0">
                <button id="startBtn"><img id="startIcon" src="resources/start.png"></button>
                <button id="pauseBtn"><img id="pauseIcon" src="resources/pause.png"></button>
                <button id="soundEffectBtn"><img id="soundEffectIcon" src="resources/soundEffect_on.png"></button>
                <button id="BGMBtn"><img id="BGMIcon" src="resources/BGM_on.png"></button>
                <button id="hintBtn"><img id="hintIcon" src="resources/hint.png"></button>
            </div>
        </div>
        <div id="statusBoard">
            <div id="remainBoard">
                <b id="remainLife">剩餘生命:
                <img id="heart1" class="heartIcon" src="resources/hollowHeart.png">
                <img id="heart2" class="heartIcon" src="resources/hollowHeart.png">
                <img id="heart3" class="heartIcon" src="resources/hollowHeart.png">
                <img id="heart4" class="heartIcon" src="resources/hollowHeart.png">
                <img id="heart5" class="heartIcon" src="resources/hollowHeart.png">
                <b id="remainHP" class="num">00</b></b>
                <b id="remainTime">剩餘時間:<b id="remainMin" class="num">00</b><b>分</b><b id="remainSec" class="num">00</b><b>秒</b></b>
            </div>
            <div id="gradeBoard">
                <b id="floor">關卡:<b id="floorNum" class="num">00</b></b>
                <b id="score">分數:<b id="scoreNum" class="num">00</b></b>
            </div>
        </div>
        <div id="board">
        </div>
`
const mins = document.getElementById("min");
const secs = document.getElementById("sec");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const soundEffectBtn = document.getElementById("soundEffectBtn");
const BGMBtn = document.getElementById("BGMBtn");
const hintBtn = document.getElementById("hintBtn");
const remainHP = document.getElementById("remainHP");
const remainMin = document.getElementById("remainMin");
const remainSec = document.getElementById("remainSec");
const floorNum = document.getElementById("floorNum");
const scoreNum = document.getElementById("scoreNum");
const startIcon = document.getElementById("startIcon");
const pauseIcon = document.getElementById("pauseIcon");
const soundEffectIcon = document.getElementById("soundEffectIcon");
const BGMIcon = document.getElementById("BGMIcon");
const hintIcon = document.getElementById("hintIcon");
const heartIcon = document.getElementsByClassName("heartIcon");
const scoreContent = document.getElementById("scoreContent");
const board = document.getElementById("board");
const soundEffect_ans = document.getElementById("soundEffect_ans");
const soundEffect_break = document.getElementById("soundEffect_break");
const soundEffect_hint = document.getElementById("soundEffect_hint");
const BGM = document.getElementById("BGM");
//調音效、BGM之音量
soundEffect_break.volume = 0.4;
soundEffect_hint.volume = 0.8;
BGM.volume = 0.2;
//異色方塊之方位
let ansRow;
let ansCol;
//計時相關變數
let countdown;
let timeout;
//基本狀態變數
let hp = 5;
let floor = 1;
let count = 2;
//紀錄用變數
let recordMin;
let recordSec;
//狀態變數
let record = true;
let gameStart = false;
let hintUsed = false;
let pause = false;
let soundeffect = true;
let bgm = true;



//點擊異色色塊
function clickansBtn() {
    //檢查音效是否啟用
    if (soundeffect == true) {
        soundEffect_ans.currentTime = 0;
        soundEffect_ans.play();
    }
    //變更狀態列
    Floor = parseInt(floorNum.innerText);
    Score = parseInt(scoreNum.innerText);
    Floor += 1;
    Score += count;
    if (Floor < 10)
        floorNum.innerText = "0" + Floor;
    else
        floorNum.innerText = Floor;
    if (Score < 10)
        scoreNum.innerText = "0" + Score;
    else
        scoreNum.innerText = Score;
    if (count < 20)
        count++;
    board.innerHTML = "";
    //生成新版面
    createBlocks(count);
}

//點擊同色色塊
function clickotherBtn() {
    //檢查音效是否啟用
    if (soundeffect == true) {
        soundEffect_break.currentTime = 0;
        soundEffect_break.play();
    }
    //扣血
    hp--;
    //調整生命值版面
    heartControll(hp);
    remainHP.innerText = "0" + hp;
    //當生命值剩下1時停用提示功能
    if (hp == 1) {
        hintIcon.src = "resources/hint_lock.png";
        //當生命值剩下0時結束遊戲並結算
    } else if (hp == 0) {
        startIcon.src = "resources/start.png";
        clearInterval(countdown);
        clearTimeout(timeout);
        remainMin.innerText = "00";
        remainSec.innerText = "00";
        floorNum.innerText = "00";
        scoreNum.innerText = "00";
        alert(`您已用盡所有生命值！您已通過: ${Floor-1} 關，總共得到: ${Score} 分！`);
        board.innerHTML = "";
        gameStart = false;
        //全程無使用暫停功能則紀錄分數
        if (record == true)
            recordAdd();
    }
}

//時間用盡之結算
function timeOut() {
    startIcon.src = "resources/start.png";
    floorNum.innerText = "00";
    scoreNum.innerText = "00";
    alert(`時間到！您已通過: ${Floor-1} 關，總共得到: ${Score} 分！`);
    board.innerHTML = "";
    gameStart = false;
    //全程無使用暫停功能則紀錄分數
    if (record == true)
        recordAdd();
}

//倒數計時
function countDown() {
    if (Sec > 0) {
        Sec--;
        if (Sec < 10)
            remainSec.innerText = "0" + Sec;
        else
            remainSec.innerText = Sec;
        //分秒換算
    } else if (Min > 0 && Sec == 0) {
        Min--;
        Sec = 59;
        if (Min < 10)
            remainMin.innerText = "0" + Min;
        else
            remainMin.innerText = Min;
        remainSec.innerText = "59";
    }

}

//控制版面hp貼圖
function heartControll(hp) {
    for (let i = 0; i < 5; i++) {
        if (i < hp)
            heartIcon[i].src = "resources/fullHeart.png"
        else
            heartIcon[i].src = "resources/hollowHeart.png"
    }
}

//根據通過關卡數控制色差(難易度)
function randomControll() {
    //10關以內，色差控制在20~35
    if (Floor < 10) {
        return Math.floor(Math.random() * 15) + 20;
        //10~19關，色差控制在15~30
    } else if (Floor < 20) {
        return Math.floor(Math.random() * 15) + 15;
        //20~29關，色差控制在10~25
    } else if (Floor < 30) {
        return Math.floor(Math.random() * 15) + 10;
        //30~39關，色差控制在5~20
    } else if (Floor < 40) {
        return Math.floor(Math.random() * 15) + 5;
        //40關以後，色差控制在5~15
    } else {
        return Math.floor(Math.random() * 10) + 5;
    }
}

//生成num*num版面
function createBlocks(num) {
    //版面淨空
    board.innerHTML = "";
    //隨機決定異色方塊之行列
    ansRow = Math.floor(Math.random() * num) + 1;
    ansCol = Math.floor(Math.random() * num) + 1;
    //生成方塊
    for (let i = 1; i < num + 1; i++) {
        for (let j = 1; j < num + 1; j++) {
            if (i == ansRow && j == ansCol)
                board.innerHTML += '<button class="pressBtn" id="ansBtn"></button>';
            else
                board.innerHTML += `<button class="pressBtn otherBtn" id="${i}x${j}"></button>`;
        }
    }
    //方塊行列數大於3且生命值大於1可使用提示功能
    if (num > 3) {
        if (hp > 1)
            hintIcon.src = "resources/hint.png";
    } else
        hintIcon.src = "resources/hint_lock.png";
    hintUsed = false;
    ansBtn = document.getElementById("ansBtn");
    pressBtn = document.getElementsByClassName("pressBtn");
    otherBtn = document.getElementsByClassName("otherBtn");
    //自動調整方塊邊長
    blockLength = 650 / count;
    //決定同色方塊之RGB，各介於50~210
    R = Math.floor(Math.random() * 160) + 50;
    G = Math.floor(Math.random() * 160) + 50;
    B = Math.floor(Math.random() * 160) + 50;
    //隨機決定異色模式
    mode = Math.floor(Math.random() * 15);
    //將設定套用於所有方塊
    Array.from(pressBtn).forEach(function(pressBtn) {
        pressBtn.style.width = `${blockLength}px`;
        pressBtn.style.height = `${blockLength}px`;
        pressBtn.style.backgroundColor = `rgb(${R}, ${G}, ${B})`;
    });
    //得到色差值
    randomNum = randomControll();
    //將異色方塊上色
    switch (mode) {
        case 0:
            ansBtn.style.backgroundColor = `rgb(${R-randomNum}, ${G-randomNum}, ${B-randomNum})`;
            break;
        case 1:
            ansBtn.style.backgroundColor = `rgb(${R-randomNum}, ${G}, ${B})`;
            break;
        case 2:
            ansBtn.style.backgroundColor = `rgb(${R}, ${G-randomNum}, ${B})`;
            break;
        case 3:
            ansBtn.style.backgroundColor = `rgb(${R}, ${G}, ${B-randomNum})`;
            break;
        case 4:
            ansBtn.style.backgroundColor = `rgb(${R+randomNum}, ${G}, ${B})`;
            break;
        case 5:
            ansBtn.style.backgroundColor = `rgb(${R}, ${G+randomNum}, ${B})`;
            break;
        case 6:
            ansBtn.style.backgroundColor = `rgb(${R}, ${G}, ${B+randomNum})`;
            break;
        case 7:
            ansBtn.style.backgroundColor = `rgb(${R+randomNum}, ${G+randomNum}, ${B+randomNum})`;
            break;
        case 8:
            ansBtn.style.backgroundColor = `rgb(${R}, ${G+randomNum}, ${B+randomNum})`;
            break;
        case 9:
            ansBtn.style.backgroundColor = `rgb(${R+randomNum}, ${G}, ${B+randomNum})`;
            break;
        case 10:
            ansBtn.style.backgroundColor = `rgb(${R+randomNum}, ${G+randomNum}, ${B})`;
            break;
        case 11:
            ansBtn.style.backgroundColor = `rgb(${R}, ${G+randomNum}, ${B+randomNum})`;
            break;
        case 12:
            ansBtn.style.backgroundColor = `rgb(${R}, ${G-randomNum}, ${B-randomNum})`;
            break;
        case 13:
            ansBtn.style.backgroundColor = `rgb(${R-randomNum}, ${G}, ${B-randomNum})`;
            break;
        case 14:
            ansBtn.style.backgroundColor = `rgb(${R-randomNum}, ${G-randomNum}, ${B})`;
            break;
    }
    //將異色方塊綁定點擊函式
    ansBtn.addEventListener("click", clickansBtn)
        //將同色方塊綁定點擊函式
    for (let i = 0; i < otherBtn.length; i++) {
        otherBtn[i].addEventListener("click", clickotherBtn);
    }
}

//將紀錄印在計分板上
function recordAdd() {
    scoreContent.innerHTML += `<p> > ${recordMin}m ${recordSec}s 內，通過 ${Floor-1} 關 得到 ${Score} 分</p>`
}

//點擊開始按鈕
startBtn.addEventListener("click", function() {
    //檢查BGM是否啟用
    if (bgm == true)
        BGM.play();
    //重置狀態
    record = true;
    gameStart = true;
    pause = false;
    //更換按鈕貼圖、設置狀態列
    startIcon.src = "resources/reset.png";
    pauseIcon.src = "resources/pause.png";
    remainHP.innerText = "05";
    floorNum.innerText = "01";
    scoreNum.innerText = "00";
    Min = parseInt(mins.value);
    Sec = parseInt(secs.value);
    recordMin = Min;
    recordSec = Sec;
    if (Min == 0 && Sec == 0)
        Min = 1;
    if (Min < 10)
        remainMin.innerText = "0" + Min;
    else
        remainMin.innerText = Min;
    if (Sec < 10)
        remainSec.innerText = "0" + Sec;
    else
        remainSec.innerText = Sec;
    hp = 5;
    Floor = 1;
    Score = 0;
    heartControll(hp);
    clearTimeout(timeout);
    clearInterval(countdown);
    //設定倒數
    timeout = setTimeout(timeOut, (Min * 60 + Sec) * 1000 + 50);
    countdown = setInterval(countDown, 1000);
    count = 2;
    board.innerHTML = "";
    //製作新版面
    createBlocks(count);
})

//點擊暫停按鈕
pauseBtn.addEventListener("click", function() {
    //遊戲開始才可使用
    if (gameStart == true) {
        Min = parseInt(remainMin.innerText);
        Sec = parseInt(remainSec.innerText);
        if (pause == false) {
            //暫停倒數
            clearTimeout(timeout);
            clearInterval(countdown);
            //移除方塊點擊函式以鎖定版面
            ansBtn.removeEventListener("click", clickansBtn);
            for (let i = 0; i < otherBtn.length; i++) {
                otherBtn[i].removeEventListener("click", clickotherBtn);
            }
            //按鈕貼圖更換
            pauseIcon.src = "resources/play.png";
            pause = true;
            //將該局設為不可紀錄
            record = false;
        } else {
            //解除暫停
            timeout = setTimeout(timeOut, (Min * 60 + Sec) * 1000 + 50);
            countdown = setInterval(countDown, 1000);
            //重綁方塊點擊函式以回復版面
            ansBtn.addEventListener("click", clickansBtn)
            for (let i = 0; i < otherBtn.length; i++) {
                otherBtn[i].addEventListener("click", clickotherBtn);
            }
            //按鈕貼圖更換
            pauseIcon.src = "resources/pause.png";
            pause = false;
        }
    }
})

//點擊音效按鈕
soundEffectBtn.addEventListener("click", function() {
    //關音效
    if (soundeffect == true) {
        //按鈕貼圖更換
        soundEffectIcon.src = "resources/soundEffect_off.png";
        soundeffect = false;
        //開音效
    } else {
        //按鈕貼圖更換
        soundEffectIcon.src = "resources/soundEffect_on.png";
        soundeffect = true;
    }
})

//點擊BGM按鈕
BGMBtn.addEventListener("click", function() {
    //關BGM
    if (bgm == true) {
        BGM.pause();
        //按鈕貼圖更換
        BGMIcon.src = "resources/BGM_off.png";
        bgm = false;
        //開BGM
    } else {
        BGM.play();
        //按鈕貼圖更換
        BGMIcon.src = "resources/BGM_on.png";
        bgm = true;
    }
})

//點擊提示按鈕
hintBtn.addEventListener("click", function() {
    //判斷可否使用提示
    if (gameStart == true && hintUsed == false && count > 3) {
        if (hp > 1) {
            if (soundeffect == true) {
                soundEffect_hint.currentTime = 0;
                soundEffect_hint.play();
            }
            hintUsed = true;
            hintIcon.src = "resources/hint_lock.png";
            //扣血
            hp--;
            heartControll(hp);
            //圈定Row範圍
            if (ansRow == 1) {
                rowStart = 1;
                rowEnd = 3;
            } else if (ansRow == count) {
                rowStart = count - 2;
                rowEnd = count;
            } else {
                rowStart = ansRow - 1;
                rowEnd = ansRow + 1;
            }
            //圈定Col範圍
            if (ansCol == 1) {
                colStart = 1;
                colEnd = 3;
            } else if (ansCol == count) {
                colStart = count - 2;
                colEnd = count;
            } else {
                colStart = ansCol - 1;
                colEnd = ansCol + 1;
            }
            //畫出九宮格
            for (let i = 1; i <= count; i++) {
                for (let j = 1; j <= count; j++) {
                    if ((i < rowStart || i > rowEnd) || (j < colStart || j > colEnd)) {
                        document.getElementById(`${i}x${j}`).style.backgroundColor = "rgb(40, 40, 40)";
                        document.getElementById(`${i}x${j}`).style.border = "1px solid rgb(40, 40, 40)";
                    }
                }
            }
            if (hp == 1) {
                hintIcon.src = "resources/hint_lock.png";
            }
        }
    }
})