class EditClass {

    constructor(opt = {}){
        this.opt = opt;
        
        this.flag = {
            ControlDirSet:null,
            mousedown:{}
        };

        this.unit_row = {
            img_list:{
                self:{
                    src:"img_self"
                },
                bullet:{
                    src:"img_bullet"
                }
            },
            bullet:{
                hp:"bullet_hp",
                w:"bullet_w",
                h:"bullet_h",
                speed:"bullet_speed",
            },
            w:"w",
            h:"h",
            hp:"hp",
            speed:"speed",
            speed_shoot:"speed_shoot",
            control:{
                up:"up",
                down:"down",
                right:"right",
                left:"left"
            },

        }



        var ControlMenu = document.createElement("div");
        this.ControlMenu = ControlMenu;

        ControlMenu.id = "ControlMenu";
        ControlMenu.innerHTML = this.Temp('default');

        ControlMenu.addEventListener("click",this.ClickEvent);
        window.addEventListener("keydown",this.KeyDown);
        
        


        document.addEventListener("mousedown",this.DragendRegister);



        if(Ex.flag.Storage.local.stage!==undefined)
        {
            this.SaveLoad({
                mode:"load",
                stage:Ex.flag.Storage.local.stage
            });
        }



        if(new URL(location.href).searchParams.get("stage")!==null)
        {
            this.SaveLoad({
                mode:"play",
                stage:new URL(location.href).searchParams.get("stage")
            });

            ControlMenu.innerHTML = this.Temp('play');
        }

        
        
        document.body.appendChild(ControlMenu);
        

    }

    KeyDown = (e)=>{

        if(this.flag.ControlDirSet!==null)
        {
            this.flag.ControlDirSet.nextElementSibling.innerHTML = e.code;
            this.flag.ControlDirSet.dataset.value = e.code;
            this.flag.ControlDirSet = null;
        }
    }


    MouseDown = (e)=>{


        var idx = Object.keys(Ex.canvas.wall).length;
        var id = "wall"+idx;

        Ex.canvas.wall[id] = 
        {
            id:id,
            type:"wall",
            x:e.offsetX - e.offsetX%Ex.canvas.background.grid,
            y:e.offsetY - e.offsetY%Ex.canvas.background.grid,
            w:Ex.canvas.background.grid,
            h:Ex.canvas.background.grid,
            hp:this.config.info.background.wall.hp,
            color:this.config.info.background.wall.color
        };
    }

    CreateUnit = (unit)=>{

        unit.img_list.self.img = new Image();
        Ex.canvas.ImgLoad(unit.img_list.self.img,
            ()=>{
                
                Ex.canvas[unit.type][unit.id] = unit;
                this.ImgLoadLoop(unit);

                if(unit.type==="enemy"){

                    unit.control = {
                        up:"AI_UP",
                        down:"AI_DOWN",
                        right:"AI_RIGHT",
                        left:"AI_LEFT"
                    }

                    unit.AI = new AIClass(unit);
                }
                
            },
            ()=>{
                unit.img_list.self.img_error = true;

                Ex.canvas[unit.type][unit.id] = unit;
                this.ImgLoadLoop(unit);

                if(unit.type==="enemy"){

                    unit.control = {
                        up:"AI_UP",
                        down:"AI_DOWN",
                        right:"AI_RIGHT",
                        left:"AI_LEFT"
                    }

                    unit.AI = new AIClass(unit);
                }

            }
        );

        Ex.canvas[unit.type][unit.id] = unit;
        unit.img_list.self.img.src = unit.img_list.self.src;


        document.querySelector(`[data-event="${unit.type}"]`).value = this.config.msg[`Create${unit.type}`][1];

    }


    ClickEvent = (e)=>{

        var _event = e.target.dataset.event;

        switch (_event){

            case "ClearStage":
                if(confirm(this.config.msg.ClearStage)===false) return;

                Ex.canvas.c.remove();
                Ex.canvas = {};
                Ex.flag.Storage.local = {};
                Ex.func.StorageUpd();

                Ex.config = new ConfigClass();
                this.config = Ex.config;

                this.ControlMenu.innerHTML = this.Temp('default');
                

            break;
                
            case "CreateCanvas":

                if(document.querySelector("canvas")!==null)
                {
                    //alert(this.config.msg.canvas_exist);
                    //return;
                }

                if(document.querySelector(`#CreateForm${_event}`)!==null)
                {
                    var form = document.querySelector(`#CreateForm${_event}`);
                    

                    if(document.querySelector("canvas")!==null)
                    {
                        Ex.canvas.background.grid = parseInt(form.querySelector("#grid").value);
                        
                    }
                    else
                    {

                        Ex.canvas = new CanvasClass({
        
                            background:{
                                url:form.querySelector("#url").value,
                                height:parseInt(form.querySelector("#height").value),
                                width:parseInt(form.querySelector("#width").value),
                                grid:parseInt(form.querySelector("#grid").value)
                            },
                            config:this.config
                        });
    
                        
    
                        Ex.canvas.c.addEventListener("mousedown",this.MouseDown);

                        document.querySelector(`[data-event="${_event}"]`).value = this.config.msg[`${_event}`][1];
                        
    
                        form.remove();
                    }

                    return;
                }


                var div = document.createElement("div");
                div.id = `CreateForm${_event}`;
                this.DragendRegister(div);

                div.innerHTML = this.Temp( _event );

                this.ControlMenu.appendChild(div);


                if(document.querySelector("canvas")!==null)
                {
                    var form = div;

                    form.querySelector("#grid").value = Ex.canvas.background.grid;

                    form.querySelector("#url").value = Ex.canvas.background.url;
                    form.querySelector("#height").value = Ex.canvas.background.height;
                    form.querySelector("#width").value = Ex.canvas.background.width;

                    form.querySelector("#url").setAttribute("disabled","disabled");
                    form.querySelector("#height").setAttribute("disabled","disabled");
                    form.querySelector("#width").setAttribute("disabled","disabled");
                }

            break;


            case "player":
            case "enemy":

                if(Ex.canvas.c===undefined)
                {
                    alert(this.config.msg.canvas_no_exist);
                    return;
                }


                var ary = {
                    x:{
                        player:Math.floor(Ex.canvas.c.width/10),
                        enemy:Ex.canvas.c.width - Math.floor(Ex.canvas.c.width/8)
                    },
                    y:{
                        player:Math.floor(Ex.canvas.c.height/2),
                        enemy:Math.floor(Ex.canvas.c.height/2)
                    }
                }


                if(Ex.canvas[ _event ][ _event ]!==undefined)
                {
                    /*
                    //alert(this.config.msg[`${_event}_exist`]);
                    if(confirm(this.config.msg.delete_unit)===false) return;

                    delete Ex.canvas[ _event ][ _event ];

                    document.querySelector(`[data-event="${_event}"]`).value = this.config.msg[`Create${_event}`][0];

                    return;
                    */
                }

                if(document.querySelector(`#CreateForm${_event}`)!==null)
                {
                    var form = document.querySelector(`#CreateForm${_event}`);
                    var unit = {
                        type:_event,
                        id:_event,
                        img_list:{
                            self:{
                                src:form.querySelector("#img_self").value
                            },
                            bullet:{
                                src:form.querySelector("#img_bullet").value
                            }
                        },
                        bullet:{
                            hp:parseInt(form.querySelector("#bullet_hp").value),
                            w:parseInt(form.querySelector("#bullet_w").value),
                            h:parseInt(form.querySelector("#bullet_h").value),
                            speed:parseInt(form.querySelector("#bullet_speed").value),
                        },
                        x: ary.x[ _event ] ,
                        y: ary.y[ _event ],
                        w:parseInt(form.querySelector("#w").value),
                        h:parseInt(form.querySelector("#h").value),
                        lv:1,
                        hp:parseInt(form.querySelector("#hp").value),
                        speed:parseInt(form.querySelector("#speed").value),
                        speed_shoot:parseInt(form.querySelector("#speed_shoot").value),
                        control:{
                            up:form.querySelector("#up").dataset.value.toString().toUpperCase(),
                            down:form.querySelector("#down").dataset.value.toString().toUpperCase(),
                            right:form.querySelector("#right").dataset.value.toString().toUpperCase(),
                            left:form.querySelector("#left").dataset.value.toString().toUpperCase()
                        }
                    };


                    if(Ex.canvas[ _event ][ _event ]!==undefined)
                    {
                        unit.img_list = Ex.canvas[ _event ][ _event ].img_list;
                        if(unit.type==="enemy") unit.AI = Ex.canvas[ _event ][ _event ].AI;
                        Ex.canvas[ _event ][ _event ] = unit;
                    }
                    else
                    {
                        this.CreateUnit(unit);

                        form.remove();
                    }



                    return;
                }

                

                var div = document.createElement("div");
                div.id = `CreateForm${_event}`;
                this.DragendRegister(div);

                div.innerHTML = this.Temp( _event );

                this.ControlMenu.appendChild(div);


                if(Ex.canvas[ _event ][ _event ]!==undefined)
                {
                    var unit = Ex.canvas[ _event ][ _event ];
                    var form = div;

                    form.querySelector("#img_self").value = unit.img_list.self.src;
                    form.querySelector("#img_bullet").value = unit.img_list.bullet.src;

                    form.querySelector("#img_self").setAttribute("disabled","disabled");
                    form.querySelector("#img_bullet").setAttribute("disabled","disabled");


                    form.querySelector("#bullet_hp").value = unit.bullet.hp;
                    form.querySelector("#bullet_w").value = unit.bullet.w;
                    form.querySelector("#bullet_h").value = unit.bullet.h;
                    form.querySelector("#bullet_speed").value = unit.bullet.speed;
                    form.querySelector("#bullet_hp").value = unit.bullet.hp;

                    form.querySelector("#w").value = unit.w;
                    form.querySelector("#h").value = unit.h;

                    form.querySelector("#hp").value = unit.hp;
                    form.querySelector("#speed").value = unit.speed;
                    form.querySelector("#speed_shoot").value = unit.speed_shoot;

                    form.querySelector("#up").dataset.value = unit.control.up;
                    form.querySelector("#up").nextElementSibling.innerHTML = unit.control.up;

                    form.querySelector("#right").dataset.value = unit.control.right;
                    form.querySelector("#right").nextElementSibling.innerHTML = unit.control.right;

                    form.querySelector("#down").dataset.value = unit.control.down;
                    form.querySelector("#down").nextElementSibling.innerHTML = unit.control.down;

                    form.querySelector("#left").dataset.value = unit.control.left;
                    form.querySelector("#left").nextElementSibling.innerHTML = unit.control.left;

                }
                
            break;

            
            case "SaveOnline":

                if(Ex.canvas.enemy!==undefined) 
                {
                    for(var name in Ex.canvas.enemy)
                        delete Ex.canvas.enemy[name].AI;
                }

                /*
                var out_json = {
                    background:Ex.canvas.background,
                    player:Ex.canvas.player,
                    enemy:Ex.canvas.enemy,
                    wall:Ex.canvas.wall
                };
                */

                var db_json = {
                    background:{
                        self:Ex.canvas.background,
                        wall:Ex.canvas.wall
                    },
                    player:Ex.canvas.player,
                    enemy:Ex.canvas.enemy
                }


                this.SaveLoad({
                    mode:"save",
                    stage:Ex.flag.Storage.local.stage||(new Date().getTime()).toString(36).substr(-6,6),
                    db_json: db_json
                });

            break;


            case "LoadOnline":

                this.SaveLoad({
                    mode:"load",
                    stage:prompt("請輸入關卡編號"),
                    db_json: db_json
                });

            break;



            case "OutConfig":

                
                for(var name in Ex.canvas.enemy)
                    delete Ex.canvas.enemy[name].AI;
            
                
                var out_json = {
                    background:Ex.canvas.background,
                    player:Ex.canvas.player,
                    enemy:Ex.canvas.enemy,
                    wall:Ex.canvas.wall
                }

                var file = document.createElement("a");
                file.style.display = "none";
                file.setAttribute('href',`data:text/plain;charset=utf-8,${encodeURIComponent(btoa(JSON.stringify(out_json)))}`);
                file.setAttribute('download','設定檔');
                document.body.appendChild(file);

                file.click();

                file.remove();

            break;

            case "InConfig":

                var input = document.querySelector(`#ConfigTxt`);
                var reader = new FileReader();

                input.onchange = ()=>{

                    reader.readAsText(input.files[0]);
                }
                
                reader.onload = ()=>{

                    this.DefaultGame( reader.result );
                    
                }

                document.querySelector(`#ConfigTxt`).click();

            break;

            case "WallColor":

                this.WallColor();

            break;


            case "ControlDirSet":

                this.flag.ControlDirSet = e.target;
                e.target.nextElementSibling.innerHTML += ' (按任意鍵設定)'
            break;


            case "GamePause":

                this.GamePause();

            break;

            case "GameStart":

                if(Ex.canvas.c===undefined)
                {
                    alert(this.config.msg.canvas_no_exist);
                    return;
                }

                Ex.flag.game_start = true;
                e.target.setAttribute("disabled","disabled");

            break;

            case "CloseParent":

                e.target.parentElement.remove();

            break;



        }
    }


    WallColor = ( opacity )=>{

        if(Ex.canvas.c===undefined)
        {
            alert(this.config.msg.canvas_no_exist);
            return;
        }

        var color = this.config.info.background.wall.color;
        
        if(opacity===undefined)
        {
            opacity = (color.substr(-1,1)==="F")?"0":"F";
        }
        

        this.config.info.background.wall.color = color.substr(0,color.length-1) + opacity;


        document.querySelector(`[data-event="WallColor"]`).value = this.config.msg.wall_color[(opacity==="F")?0:1];

    }

    SaveLoad = (arg)=>{

        if(arg.mode==="save")
        {
            Ex.DB.ref(`act_game/${arg.stage}`).set(arg.db_json);
            Ex.flag.Storage.local.stage = arg.stage;
            Ex.func.StorageUpd();
            
            prompt("關卡儲存完成,關卡編號如下",`${arg.stage}`);

            return;
        }
        

        if(arg.mode==="load" && arg.stage!==null && arg.stage!=='')
        {

            Ex.DB.ref(`act_game/${arg.stage}`).once("value",r=>{

                if(r.val()===null) return;

                Ex.flag.Storage.local.stage = arg.stage;
                Ex.func.StorageUpd();

                this.EditGameLoad(r.val());
            });
        }

        if(arg.mod==="play" && arg.stage!==null)
        {
            Ex.DB.ref(`act_game/${arg.stage}`).once("value",r=>{


                this.PlayGameLoad(r.val());
            });
        }


    }


    GamePause = (pause)=>{
        

        if(Ex.canvas.c===undefined)
        {
            return;
        }

        var btn = document.querySelector(`[data-event="GamePause"]`);
        btn.value = (btn.value===this.config.msg.game_pause[0])?this.config.msg.game_pause[1]:this.config.msg.game_pause[0];

        if(
            (Ex.anima_timer===undefined || Ex.canvas.anima_timer===undefined) && 
            pause===undefined )
        {
            Ex.Ref();
            Ex.canvas.Ref();

            for(var name in Ex.canvas.enemy)
            {
                Ex.canvas.enemy[name].AI.Ref();
            }

            btn.value = this.config.msg.game_pause[0];
            return;
        }
        else
        {
            btn.value = this.config.msg.game_pause[1];
        }



        cancelAnimationFrame(Ex.anima_timer);
        cancelAnimationFrame(Ex.canvas.anima_timer);

        delete Ex.anima_timer;
        delete Ex.canvas.anima_timer;

        for(var name in Ex.canvas.enemy)
        {
            cancelAnimationFrame(Ex.canvas.enemy[name].AI.anima_timer);
            delete Ex.canvas.enemy[name].AI.anima_timer;
        }
    



        for(var k in Ex.config.font.c2d) Ex.canvas.c2d[k] = Ex.config.font.c2d[k];

        Ex.canvas.c2d.x = Math.floor(Ex.canvas.c.width/2);
        Ex.canvas.c2d.y = Math.floor(Ex.canvas.c.height/2);

        Ex.canvas.c2d.strokeText('pause',Ex.canvas.c2d.x,Ex.canvas.c2d.y);
        Ex.canvas.c2d.fillText('pause',Ex.canvas.c2d.x,Ex.canvas.c2d.y);

        

    }

    PlayGameLoad = (db_json)=>{

        if(document.querySelector("canvas")!==null)
        {
            alert(this.config.msg.canvas_exist);
            return;
        }

        Ex.canvas = new CanvasClass({
            background:db_json.background.self,
            wall:db_json.background.wall,
            config:this.config
        });


        this.WallColor('0');
        

        for(let name in db_json.player)
        {
            this.CreateUnit(db_json.player[name]);
        }
        for(let name in db_json.enemy)
        {
            this.CreateUnit(db_json.enemy[name]);
            
            db_json.enemy[name].AI = new AIClass(db_json.enemy[name]);
            
        }
    }


    EditGameLoad = (db_json)=>{

        if(document.querySelector("canvas")!==null)
        {
            alert(this.config.msg.canvas_exist);
            return;
        }

        Ex.canvas = new CanvasClass({
            background:db_json.background.self,
            wall:db_json.background.wall,
            config:this.config
        });


        document.querySelector(`[data-event="CreateCanvas"]`).value = this.config.msg.CreateCanvas[1];

        
        for(let name in db_json.player)
        {
            this.CreateUnit(db_json.player[name]);
        }


        for(let name in db_json.enemy)
        {
            this.CreateUnit(db_json.enemy[name]);
            
            db_json.enemy[name].AI = new AIClass(db_json.enemy[name]);
            
        }

        Ex.canvas.c.addEventListener("mousedown",this.MouseDown);
    }

    DefaultGame = (txt)=>{

        if(document.querySelector("canvas")!==null)
        {
            alert(this.config.msg.canvas_exist);
            return;
        }
        

        var json = JSON.parse(atob(txt));

        Ex.canvas = new CanvasClass({
        
            background:json.background,
            wall:json.wall,
            config:this.config

        });

        
        
        var _t = setInterval(()=>{

            if(Ex.canvas.anima_timer!==undefined)
            {
                for(let name in json.player)
                {
                    this.CreateUnit(json.player[name]);
                }


                for(let name in json.enemy)
                {
                    this.CreateUnit(json.enemy[name]);
                    
                    json.enemy[name].AI = new AIClass(json.enemy[name]);
                    
                }
        
                Ex.canvas.c.addEventListener("mousedown",this.MouseDown);
                clearInterval(_t);
            }

        },100);


        

    }



    ImgLoadLoop = (unit)=>{

        for(let k in unit.img_list){

            unit.img_list[k].img = new Image();

            this.ImgLoad(unit.img_list[k].img,
                ()=>{
                    
                    Ex.canvas[unit.type][unit.id].img_list[k].img = unit.img_list[k].img;

                },
                ()=>{
                    Ex.canvas[unit.type][unit.id].img_list[k].img_error = true;

                }
            );
            unit.img_list[k].img.src = unit.img_list[k].src;
        }

    }


    ImgLoad = (img,func,errfunc)=>{

        img.addEventListener("error",()=>{
            
            errfunc();

        });

        img.addEventListener("load",()=>{

            func();

        });
    }



    DragendRegister = (ele)=>{

        if(ele.type==="mousedown")
        {
            this.flag.mousedown = ele;
            return;
        }


        ele.setAttribute("draggable","true");
        ele.addEventListener("dragend",(e)=>{
            ele.style.left = e.clientX - this.flag.mousedown.offsetX + "px";
            ele.style.top = e.clientY - this.flag.mousedown.offsetY + "px";
        });
    }

    



    Temp = (name)=>{

        var html = ``;
        switch (name){

            case "play":

                html = `
                
                    <input type="button" data-event="GamePause" value="${Ex.config.msg.game_pause[0]}">
                    <input type="button" data-event="GameStart" value="${Ex.config.msg.game_start}">
                
                `;

            break;

            case "default":
                html = `


                    <input type="button" data-event="GamePause" value="${Ex.config.msg.game_pause[0]}">


                    <input type="button" data-event="GameStart" value="${Ex.config.msg.game_start}">

                    <input type="button" data-event="ClearStage" value="清除所有設定">
                    

                    <input type="button" data-event="CreateCanvas" value="${Ex.config.msg.CreateCanvas[0]}">
                    <input type="button" data-event="WallColor" value="${Ex.config.msg.wall_color[0]}">



                    <input type="button" data-event="player" value="${Ex.config.msg.Createplayer[0]}">
                    <input type="button" data-event="enemy" value="${Ex.config.msg.Createenemy[0]}">

                    <input type="button" data-event="SaveOnline" value="儲存關卡">

                    <input type="button" data-event="LoadOnline" value="讀取關卡">

                    <!--

                    <input type="button" data-event="OutConfig" value="匯出設定檔">
                    
                    <input type="button" data-event="InConfig" value="匯入設定檔">
                    <input type="file" id="ConfigTxt" style="display:none">

                    -->
                `;

            break;


            case "CreateCanvas":

                html = `
                    背景圖片網址：<input type="text" id="url" value="${this.config.info.background.src}"><BR>

                    地圖方格大小：<input type="number" id="grid" value="${this.config.info.background.wall.grid}"><BR>

                    
                    高：<input id="height" type="number" value="${this.config.info.background.h}"><BR>
                    寬：<input id="width" type="number" value="${this.config.info.background.w}"><BR>

                `;

            break;


            case "player":
            case "enemy":
                html =`
                    單位圖片網址：<input type="text" id="img_self" value="${this.config.info[name].src}"><BR>
                    子彈圖片網址：<input type="text" id="img_bullet" value="${this.config.info[name].bullet.src}"><BR>

                    血量：<input type="number" id="hp" value="${this.config.info[name].hp.v}"><BR>
                    移動速度<input type="number" id="speed" value="${this.config.info[name].speed}"><BR>
                    射擊頻率<input type="number" id="speed_shoot" value="${this.config.info[name].speed_shoot}"><BR>

                    高：<input id="h" type="number" value="${this.config.info[name].h}"><BR>
                    寬：<input id="w" type="number" value="${this.config.info[name].w}"><BR>


                    子彈攻擊力<input type="number" id="bullet_hp" value="${this.config.info[name].bullet.hp}"><BR>
                    子彈速度<input type="number" id="bullet_speed" value="${this.config.info[name].bullet.speed}"><BR>

                    子彈高：<input id="bullet_h" type="number" value="${this.config.info[name].bullet.h}"><BR>
                    子彈寬：<input id="bullet_w" type="number" value="${this.config.info[name].bullet.w}"><BR>

                    <div ${(name==="enemy")?`style="display:none"`:""}>
                        <input id="up" data-value="${this.config.info[name].control.up}" value="上" 
                        data-event="ControlDirSet" type="button">：<span>${this.config.info[name].control.up}</span><BR>

                        <input id="right" data-value="${this.config.info[name].control.right}" value="右" 
                        data-event="ControlDirSet" type="button">：<span>${this.config.info[name].control.right}</span><BR>

                        <input id="down" data-value="${this.config.info[name].control.down}" value="下" 
                        data-event="ControlDirSet" type="button">：<span>${this.config.info[name].control.down}</span><BR>

                        <input id="left" data-value="${this.config.info[name].control.left}" value="左" 
                        data-event="ControlDirSet" type="button">：<span>${this.config.info[name].control.left}</span><BR>

                    </div>
                `;
            break;
        }

        if(name!=="default" && name!=="play"){

            html += `
                <HR>
                <input type="button" data-event="${name}" value="送出">
                <input type="button" data-event="CloseParent" value="取消">
            `;
            
        }


        return html;

    }
}