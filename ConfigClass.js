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
            wall_set:["設置障礙物","移除障礙物"],
            game_pause:["暫停遊戲","繼續遊戲"],
            game_start:"開始遊戲",
            Createplayer:["建立玩家單位","玩家單位詳細"],
            Createenemy:["建立敵人單位","敵人單位詳細"],
            delete_unit:"確定要刪除單位嗎?",
            ClearStage:"確定要清除所有設定嗎?",
            OnOff:["關閉","開啟"]
        }

        this.DB = {
            url:"https://shootgame-aaea4-default-rtdb.firebaseio.com/"
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
                w:800,
                h:600,
                img_list:{
                    self:{
                        src:"Xhttps://truth.bahamut.com.tw/s01/201401/86d7f4e508d07fc7a38a99688213e327.JPG",
                        color:"#fff"
                    },
                    wall:{
                        src:'',
                        grid:10,
                        hp:9999,
                        color:"#000F",
                        broke:"#000F"
                    },
                    game_pass:{
                        src:'',
                        color:"#000"
                    },
                    game_over:{
                        src:'',
                        color:"#000"
                    }
                }
            },
            AI_config:{
                up:25,
                right:25,
                down:25,
                left:25,
                frequency:1,
                h_min:0.1,
                h_max:0.9,
                w_min:0.1,
                w_max:0.9,
                enabled:true

            },
            BreakoutClonePlayer:{
                w:100,
                h:10,
                img_list:{
                    self:{
                        src:'',
                        color:"#000"
                    },
                    bullet:{
                        src:'',
                        color:"#000"
                    }
                },
                bullet:{
                    w:20,
                    h:20,
                    color:"#f00",
                    hp:1,
                    speed:8,
                    count:1,
                    rand:2,
                    reflex_count:0,
                    track_sec:1,
                    mode:{
                        normal:"普通",
                        reflex:"反彈",
                        track:"追蹤",
                        through:"貫穿"
                    }
                },
                speed:5,
                speed_shoot:1,
                control:{
                    right:"ArrowRight",
                    left:"ArrowLeft",
                }
            },
            player:{
                w:20,
                h:20,
                img_list:{
                    self:{
                        src:'https://avatars.plurk.com/14556765-big9788529.jpg',
                        color:"#f00"
                    },
                    bullet:{
                        src:'https://avatars.plurk.com/14556765-big9788529.jpg',
                        color:"#f00"
                    },
                    collision:{
                        src:'',
                        color:"#f00"
                    }

                },
                bullet:{
                    w:20,
                    h:20,
                    color:"#f00",
                    hp:5,
                    speed:5,
                    count:1,
                    rand:2,
                    reflex_count:0,
                    track_sec:1,
                    mode:{
                        normal:"普通",
                        reflex:"反彈",
                        track:"追蹤",
                        through:"貫穿"
                    }
                },
                hp:{
                    color:["#000f","#0f0f"],
                    h:5,
                    w:20,
                    v:100
                },
                speed:3,
                speed_shoot:1,
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
                img_list:{
                    self:{
                        src:'https://avatars.plurk.com/14556765-big9788529.jpg',
                        color:"#00f"
                    },
                    bullet:{
                        src:'https://avatars.plurk.com/14556765-big9788529.jpg',
                        color:"#f00"
                    },
                    collision:{
                        src:'',
                        color:"#f00"
                    }

                },
                color:"#f0f",
                bullet:{
                    w:20,
                    h:20,
                    color:"#0ff",
                    hp:5,
                    speed:5,
                    count:1,
                    rand:2,
                    reflex_count:0,
                    track_sec:1,
                    mode:{
                        normal:"普通",
                        reflex:"反彈",
                        track:"追蹤",
                        through:"貫穿"
                    }
                },
                hp:{
                    color:["#000f","#0f0f"],
                    h:5,
                    w:20,
                    v:100
                },
                speed:3,
                speed_shoot:1,
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