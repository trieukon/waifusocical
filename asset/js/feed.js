function feedDefaultCmt(x, avt) {
    var s = `<div class="other-cmt">
    <div class="avt-cmt">
        <img src="${avt}" alt="">
    </div>
    <div class="cmt-shape">
        <p class="name-cmt">
        ${x["name"]}
        </p>
        <p class="cmt">
        ${x["text"]}
        </p>
        <!--
        <img src="./asset/img/tus1/c335d665c92aaeecc7a6346fb03fc77a.jpg" alt="">
       
        <div class="icon-cmt">
            <i class="fa-solid fa-heart heart-cmt"></i>
            <p>2.3k</p>
        </div> -->
        <p class="time-cmt">
        ${x["time"]}
        </p>
    </div>
    </div>`
    return s
}
var likedCmtColor
var likedColor
var numHeart
var inputCmt
var gadgda = []
const initLikeCmt = () => {
    likedCmtColor = document.getElementsByClassName("heart-cmt")
    likedColor = document.getElementsByClassName("heart-int")
    numHeart = document.getElementsByClassName("numHeart")
    inputCmt = document.getElementsByClassName("inputCmt")
    boxCmtG = document.getElementsByClassName("cmt-box-g")
    numCmt = document.getElementsByClassName("num-Cmt")

    for (let l = 0; l < likedColor.length; l++) {
        likedColor[l].onclick = function() {
            likeTus(l, clientUname)
        }
    }
    for (let l = 0; l < inputCmt.length; l++) {
        inputCmt[l].addEventListener('keydown', event => {
            if (event.key == 'Enter') {
                cmtTus(l, clientUname, inputCmt[l].value)
                inputCmt[l].value = ""
            }
        })

    }
    // for (let i = 0; i < likedCmtColor.length; i++) {
    //     likedCmtColor[i].onclick = function() {
    //         this.classList.toggle('liked')
    //     }
    // }
}


//  <div class="img-feed">
//     <img src="./asset/img/tus1/hVS0Ay5.jpg" alt="">
// </div> 

var feedDefault = (avtsTus, tus, numInt, liked, cmt, numCmtInt) => {
    return `<div class="box feeds">
<div class="hfeed">
    <div class="hfeed-in4">
        <div class="hfeed-avt">
            <img src="${avtsTus}" alt="">
        </div>
        <div class="hfeed-name">
            ${tus["name"]}
        </div>
    </div>
    <div class="hfeed-menu">
        <i class="fa-solid fa-ellipsis"></i>
    </div>
</div>
<div class="tus">
    <p>
        ${tus["content"]}
    </p>
</div>

<div class="interact-box">
    <div class="itrc">
        <i class="fa-regular fa-heart"></i>
        <i class="fa-solid fa-heart heart-int${liked}"></i>
        <p class="numHeart">
            ${numInt}
        </p>
    </div>
    <div class="detail">
    <p>•</p>
        <p class="detail-text num-Cmt">
            ${numCmtInt} bình luận
        </p>
        <p>•</p>
        <p class="detail-text">
            0 chia sẽ
        </p>
        <p>•</p>
        <p class="detail-time">
            ${tus["timetus"]}
        </p>
    </div>
</div>
<div class="cmt-box">
    <div class="my-cmt">
        <div class="avt-cmt">
            <img src="${clientAvt}" alt="">
        </div>
        <input class="inputCmt" type="text" placeholder="Bình luận của bạn...">
    </div>
   <div class="cmt-box-g">${cmt}</div>
</div>
</div>`
}

//Hàm cập nhật avt
syncAvt()
start()



//Hàm tự đồng bộ cập nhật trạng thái

setInterval(() => {
    start()
}, 15000)

async function start() {
    await callApiInfo()
    await initFeed()
    await syncTimenowActive(clientId)
    await syncListMemberOnline()

}

//Thông báo thay đổi ở feed
const popNoice = new Audio(nameRes + "/asset/audio/pop.mp3")
popNoice.volume = 0.2


const feedOuput = document.getElementById("feedOuput")
var feedJsonData = ""
var feedJsonData3 = ""
async function initFeed() {
    feedJsonData3 = await callAPIFeed(1)
    var a = JSON.stringify(feedJsonData).length
    var b = JSON.stringify(feedJsonData3).length

    if (a != b) {
        feedJsonData = feedJsonData3
        popNoice.play()
        console.log("refresh feed")
        feedOuput.innerHTML = ""
        if (feedJsonData3.length > 0) {
            for (let i = feedJsonData3.length - 1; i >= 0; i--) {
                avtsTus = getAvtById(feedJsonData3[i]["uid"])
                var numCmtInt = feedJsonData3[i]["cmt"].length

                var numInt = feedJsonData3[i]["interact"].length
                var jsonCmtEx = ""
                for (let g = feedJsonData3[i]["cmt"].length - 1; g >= 0; g--) {
                    jsonCmtEx += feedDefaultCmt(feedJsonData3[i]["cmt"][g], getAvtByUName(feedJsonData3[i]["cmt"][g]["username"]))
                }
                if (feedJsonData3[i]["interact"].indexOf(clientUname) >= 0) {
                    feedOuput.innerHTML += feedDefault(avtsTus, feedJsonData3[i], numInt, ' liked', jsonCmtEx, numCmtInt)
                } else {
                    feedOuput.innerHTML += feedDefault(avtsTus, feedJsonData3[i], numInt, "", jsonCmtEx, numCmtInt)
                }

            }
        }
        initLikeCmt()
    }



}