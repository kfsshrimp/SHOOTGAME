class ConfigClass{

    constructor(){

        this.msg = {
            CreateCanvas:["建立背景","背景詳細"],
            height_width_error:"高寬設定錯",
            canvas_exist:"背景已建立",
            canvas_no_exist:"請先建立背景",
            player_exist:"玩家單位已存在",
            enemy_exist:"敵人單位已存在",
            wall_color:["隱藏障礙物","顯示障礙物"],
            game_pause:["暫停遊戲","繼續遊戲"],
            game_start:"開始遊戲",
            Createplayer:["建立玩家單位","玩家單位詳細"],
            Createenemy:["建立敵人單位","敵人單位詳細"],
            delete_unit:"確定要刪除單位嗎?",
            ClearStage:"確定要清除所有設定嗎?",
        }

        this.DB = {
            url:"https://kfs-plurk-default-rtdb.firebaseio.com/"
        }

        this.font = {
            c2d:{
                font:"bold 20px sans-serif",
                textAlign:"start",
                textBaseline:"top",
                lineWidth:5,
                fillStyle:"#fff",
                strokeStyle:"#000"
            }
        }

        this.info = {
            background:{
                src:"Xhttps://truth.bahamut.com.tw/s01/201401/86d7f4e508d07fc7a38a99688213e327.JPG",
                w:800,
                h:600,
                color:"#fff",
                wall:{
                    grid:10,
                    hp:9999,
                    color:"#000F"
                }
            },
            player:{
                w:20,
                h:20,
                src:"https://avatars.plurk.com/14556765-big9788529.jpg",
                color:"#00f",
                bullet:{
                    src:"https://avatars.plurk.com/14556765-big9788529.jpg",
                    w:20,
                    h:20,
                    color:"#f00",
                    hp:5,
                    speed:10,
                    bullet_count:1,
                    bullet_rand:2
                },
                hp:{
                    color:["#000f","#0f0f"],
                    h:5,
                    w:20,
                    v:100
                },
                speed:3,
                speed_shoot:5,
                control:{
                    up:"ArrowUp",
                    right:"ArrowRight",
                    down:"ArrowDown",
                    left:"ArrowLeft",
                }
            },
            enemy:{
                w:20,
                h:20,
                src:"https://avatars.plurk.com/14556765-big9788529.jpg",
                color:"#000",
                bullet:{
                    src:"https://avatars.plurk.com/14556765-big9788529.jpg",
                    w:20,
                    h:20,
                    color:"#f00",
                    hp:5,
                    speed:10,
                    bullet_count:1,
                    bullet_rand:2
                },
                hp:{
                    color:["#000f","#0f0f"],
                    h:5,
                    w:20,
                    v:100
                },
                speed:3,
                speed_shoot:5,
                control:{
                    up:"ArrowUp",
                    right:"ArrowRight",
                    down:"ArrowDown",
                    left:"ArrowLeft",
                }
            },



        }


        
    }


}