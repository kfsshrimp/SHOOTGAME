class EditClass {

    constructor(opt = {}){
        this.opt = opt;
        
        this.flag = {
            ControlDirSet:null,
            WallMode:true,
            mousedown:{},
            mode:'',
            BreakoutCloneMode:false
        };
        var url_params = new URL(location.href).searchParams;


        if(
            Ex.flag.Storage.local.stage!==undefined && 
            url_params.get("stage")===null)
        {
            
            this.SaveLoad({
                mode:"LoadOnline"
            });

        }


        if(url_params.get("stage")!==null)
        {
            this.SaveLoad({
                mode:"Play"
            });

        }

        this.ControlMenu = document.createElement("div");

        this.ControlMenu.id = "ControlMenu";
        this.ControlMenu.innerHTML = this.Temp('default');

        this.ControlMenu.addEventListener("click",this.ClickEvent);
        window.addEventListener("keydown",this.KeyDown);
        
        

        document.addEventListener("mousedown",this.DragendRegister);

        
        
        document.body.appendChild(this.ControlMenu);
        

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

        if(this.flag.WallMode)
        {
            var id = `wall_${new Date().getTime()}`;

            Ex.canvas.wall[id] = 
            {
                id:id,
                type:"wall",
                x:e.offsetX - e.offsetX%Ex.canvas.background.img_list.wall.grid,
                y:e.offsetY - e.offsetY%Ex.canvas.background.img_list.wall.grid,
                w:Ex.canvas.background.img_list.wall.grid,
                h:Ex.canvas.background.img_list.wall.grid,
                hp:Ex.canvas.background.img_list.wall.hp,
                color:Ex.canvas.background.img_list.wall.color
            };
        }
        else
        {
            for(var id in Ex.canvas.wall)
            {
                var obj = Ex.canvas.wall[id];

                if(e.offsetX>obj.x && e.offsetX<obj.x+obj.w &&
                    e.offsetY>obj.y && e.offsetY<obj.y+obj.h)
                    {
                        delete Ex.canvas.wall[id];
                    }

            }

        }
        
    }

    CreateUnit = (unit)=>{

        unit.img_list.self.img = new Image();
        this.ImgLoad(unit.img_list.self.img,
            ()=>{
                
                Ex.canvas[unit.type][unit.id] = unit;
                this.ImgLoadLoop(unit.img_list);

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
                this.ImgLoadLoop(unit.img_list);

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

        if(document.querySelector(`[data-event="${unit.type}"]`)!==null)
        document.querySelector(`[data-event="${unit.type}"]`).value = this.config.msg[`Create${unit.type}`][1];

    }


    ClickEvent = (e)=>{

        var _event = e.target.dataset.event;

        switch (_event){

            case "ClearStage":
                if(confirm(this.config.msg.ClearStage)===false) return;

                for(var name in Ex.canvas.enemy)
                {
                    cancelAnimationFrame(Ex.canvas.enemy[name].AI.anima_timer);
                }

                if(Ex.canvas.c) Ex.canvas.c.remove();

                Ex.canvas = {};
                //Ex.flag.Storage.local = {};
                //Ex.func.StorageUpd();

                Ex.config = new ConfigClass();
                this.config = Ex.config;

                this.ControlMenu.innerHTML = this.Temp('default');
                

            break;


            case "BreakoutClone":

                if(document.querySelector(`#CreateForm${_event}`)!==null)
                {
                    var form = document.querySelector(`#CreateForm${_event}`);


                    Ex.canvas = new CanvasClass({
        
                        background:{
                            img_list:{
                                self:{
                                    src:form.querySelector("#url").value,
                                    color:this.config.info.background.img_list.self.color
                                },
                                wall:{
                                    color:this.config.info.background.img_list.wall.color,
                                    broke:this.config.info.background.img_list.wall.broke,
                                    grid:parseInt(form.querySelector("#grid").value),
                                    hp:1

                                }
                            }
                        },
                        config:this.config
                    });

                    Ex.canvas.c.addEventListener("mousedown",this.MouseDown);

                    
                    var _t = setInterval(()=>{
                        if(Ex.canvas.anima_timer!==undefined)
                        {
                            this.BreakoutCloneFunc();
                            clearInterval(_t);
                        }
                    },0);
                    

                    form.remove();
                    return;
                }

                var div = document.createElement("div");
                div.id = `CreateForm${_event}`;
                this.DragendRegister(div);

                div.innerHTML = this.Temp( _event );

                this.ControlMenu.appendChild(div);


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

                        Ex.canvas.background.next_stage = (form.querySelector("#next_stage").value);

                        Ex.canvas.background.img_list.game_pass.src = (form.querySelector("#game_pass").value);
                        Ex.canvas.background.img_list.game_over.src = (form.querySelector("#game_over").value);


                        form.remove();
                        
                    }
                    else
                    {

                        Ex.canvas = new CanvasClass({
        
                            background:{
                                img_list:{
                                    self:{
                                        src:form.querySelector("#url").value,
                                        color:this.config.info.background.img_list.self.color
                                    },
                                    game_pass:{
                                        src:form.querySelector("#game_pass").value,
                                        color:this.config.info.background.img_list.game_pass.color
                                    },
                                    game_over:{
                                        src:form.querySelector("#game_over").value,
                                        color:this.config.info.background.img_list.game_over.color
                                    },
                                    wall:{
                                        src:'',
                                        color:this.config.info.background.img_list.wall.color,
                                        broke:this.config.info.background.img_list.wall.broke,
                                        grid:parseInt(form.querySelector("#grid").value)
                                    }
                                },
                                height:parseInt(form.querySelector("#height").value),
                                width:parseInt(form.querySelector("#width").value),
                                next_stage:form.querySelector("#next_stage").value
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
                    form.querySelector("#next_stage").value = Ex.canvas.background.next_stage;


                    form.querySelector("#game_pass").value = Ex.canvas.background.img_list.game_pass.src;
                    form.querySelector("#game_over").value = Ex.canvas.background.img_list.game_over.src;
                    form.querySelector("#url").value = Ex.canvas.background.img_list.self.src;


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


                if(document.querySelector(`#CreateForm${_event}`)!==null)
                {
                    var form = document.querySelector(`#CreateForm${_event}`);
                    var unit = {
                        type:_event,
                        id:_event,
                        img_list:{
                            self:{
                                src:form.querySelector("#img_self").value,
                                color:this.config.info[_event].img_list.self.color
                            },
                            bullet:{
                                src:form.querySelector("#img_bullet").value,
                                color:this.config.info[_event].img_list.bullet.color
                            },
                            collision:{
                                src:form.querySelector("#img_collision").value,
                                color:this.config.info[_event].img_list.collision.color
                            }
                        },
                        bullet:{
                            mode:form.querySelector("#bullet_mode").value,
                            hp:parseInt(form.querySelector("#bullet_hp").value),
                            w:parseInt(form.querySelector("#bullet_w").value),
                            h:parseInt(form.querySelector("#bullet_h").value),

                            speed:parseFloat(form.querySelector("#bullet_speed").value),
                            rand:parseFloat(form.querySelector("#bullet_rand").value),
                            track_sec:parseFloat(form.querySelector("#track_sec").value),

                            count:parseInt(form.querySelector("#bullet_count").value),
                            reflex_count:parseInt(form.querySelector("#reflex_count").value),
                            


                        },
                        x: ary.x[ _event ] ,
                        y: ary.y[ _event ],
                        w:parseInt(form.querySelector("#w").value),
                        h:parseInt(form.querySelector("#h").value),
                        lv:1,
                        hp:parseInt(form.querySelector("#hp").value),
                        speed:parseFloat(form.querySelector("#speed").value),
                        speed_shoot:parseFloat(form.querySelector("#speed_shoot").value),
                        control:{
                            up:form.querySelector("#up").dataset.value.toString().toUpperCase(),
                            down:form.querySelector("#down").dataset.value.toString().toUpperCase(),
                            right:form.querySelector("#right").dataset.value.toString().toUpperCase(),
                            left:form.querySelector("#left").dataset.value.toString().toUpperCase()
                        }
                    };



                    if(Ex.canvas[ _event ][ _event ]!==undefined)
                    {
                        unit.x = Ex.canvas[ _event ][ _event ].x;
                        unit.y = Ex.canvas[ _event ][ _event ].y;

                        unit.img_list = Ex.canvas[ _event ][ _event ].img_list;

                        if(unit.type==="enemy")
                        {
                            cancelAnimationFrame(Ex.canvas[ _event ][ _event ].AI.anima_timer);
                            unit.AI = new AIClass(unit);
                        }

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
                    div.dataset.unit_type = _event;
                    div.dataset.unit_id = _event;

                    div.innerHTML += this.Temp(`delete_unit`);


                }


                if(Ex.canvas[ _event ][ _event ]!==undefined)
                {
                    var unit = Ex.canvas[ _event ][ _event ];
                    var form = div;

                    form.querySelector("#img_self").value = unit.img_list.self.src;
                    form.querySelector("#img_bullet").value = unit.img_list.bullet.src;
                    form.querySelector("#img_collision").value = unit.img_list.collision.src;

                    form.querySelector("#img_self").setAttribute("disabled","disabled");
                    form.querySelector("#img_bullet").setAttribute("disabled","disabled");
                    form.querySelector("#img_collision").setAttribute("disabled","disabled");
                    
                    


                    
                    form.querySelector("#bullet_mode").value = unit.bullet.mode;
                    form.querySelector("#bullet_hp").value = unit.bullet.hp;
                    form.querySelector("#bullet_w").value = unit.bullet.w;
                    form.querySelector("#bullet_h").value = unit.bullet.h;
                    form.querySelector("#bullet_speed").value = unit.bullet.speed;
                    form.querySelector("#bullet_hp").value = unit.bullet.hp;
                    form.querySelector("#bullet_count").value = unit.bullet.count;
                    form.querySelector("#bullet_rand").value = unit.bullet.rand;
                    form.querySelector("#reflex_count").value = unit.bullet.reflex_count;
                    form.querySelector("#track_sec").value = unit.bullet.track_sec;


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

            case "delete_unit":
                
                if(confirm(this.config.msg.delete_unit)===false) return;

                var parent = e.target.parentElement;

                delete Ex.canvas[parent.dataset.unit_type][parent.dataset.unit_id];


                document.querySelector(`[data-event="${parent.dataset.unit_type}"]`).value = this.config.msg[`Create${parent.dataset.unit_type}`][0];

                
                parent.remove();

            break;

            case "WallEdit":

                if(Ex.canvas.c===undefined)
                {
                    alert(this.config.msg.canvas_no_exist);
                    return;
                }
                

                if(document.querySelector(`#CreateForm${_event}`)!==null)
                {
                    var form = document.querySelector(`#CreateForm${_event}`);

                    Ex.canvas.background.img_list.wall.grid = parseInt(form.querySelector("#grid").value);

                    return;
                }



                var div = document.createElement("div");
                div.id = `CreateForm${_event}`;
                this.DragendRegister(div);

                div.innerHTML = this.Temp( _event );


                this.ControlMenu.appendChild(div);

                div.querySelector("#grid").value = Ex.canvas.background.img_list.wall.grid;


            break;

            case "wall_set":

                this.flag.WallMode = !this.flag.WallMode;

                e.target.value = (this.flag.WallMode)?this.config.msg.wall_set[0]:this.config.msg.wall_set[1];

            break;

            case "wall_color":

                this.WallColor();

                

                var opacity = Ex.canvas.background.img_list.wall.color.substr(-1,1);

                e.target.value = this.config.msg.wall_color[(opacity==="F")?0:1];

            break;


            case "AIEnabled":

                var form = e.target.parentElement;      

                var unit_type = form.querySelector("#unit_type").value;
                var unit_id = form.querySelector("#unit_id").value;

                console.log(unit_type);
                console.log(unit_id);
            
                Ex.canvas[unit_type][unit_id].AI_config.enabled = !Ex.canvas[unit_type][unit_id].AI_config.enabled;
            

                e.target.value = (Ex.canvas[unit_type][unit_id].AI_config.enabled)?Ex.config.msg.OnOff[1]:Ex.config.msg.OnOff[0];

            break;

            case "AIEdit":

                if(Ex.canvas.c===undefined)
                {
                    alert(this.config.msg.canvas_no_exist);
                    return;
                }


                if(document.querySelector(`#CreateForm${_event}`)!==null)
                {
                    var form = document.querySelector(`#CreateForm${_event}`);

                    var arg = {};

                    for(let i=0;i<form.querySelectorAll(`input:not([type="button"])`).length;i++)
                    {
                        let obj = form.querySelectorAll(`input:not([type="button"])`)[i];

                        arg[obj.id] = parseFloat(obj.value);
                    }

                    arg.unit_id = form.querySelector("#unit_id").value;
                    arg.unit_type = form.querySelector("#unit_type").value;

                    Ex.canvas[form.querySelector("#unit_type").value][form.querySelector("#unit_id").value].AI_config = arg;

                    return;
                }

                var div = document.createElement("div");
                div.id = `CreateForm${_event}`;
                this.DragendRegister(div);


                div.innerHTML = this.Temp("AIEdit");

                this.ControlMenu.appendChild(div);

                var unit_type = e.target.dataset.unit_type;
                var unit_id = e.target.dataset.unit_id;

                div.querySelector("span").innerHTML = (unit_type==="player")?"玩家":"敵人";


                div.querySelector("#unit_type").value = unit_type;
                div.querySelector("#unit_id").value = unit_id;

                if(Ex.canvas[unit_type][unit_id].AI_config===undefined)
                {
                    Ex.canvas[unit_type][unit_id].AI = new AIClass(Ex.canvas[unit_type][unit_id]);
                }


                var Ex_AI_config = Ex.canvas[unit_type][unit_id].AI_config||{};
                var config = this.config.info.AI_config;

                div.querySelector("#up").value = (Ex_AI_config.up!==undefined)?Ex_AI_config.up:config.up;

                div.querySelector("#right").value = (Ex_AI_config.right!==undefined)?Ex_AI_config.right:config.right;

                div.querySelector("#down").value = (Ex_AI_config.down!==undefined)?Ex_AI_config.down:config.down;

                div.querySelector("#left").value = (Ex_AI_config.left!==undefined)?Ex_AI_config.left:config.left;

                div.querySelector("#frequency").value = (Ex_AI_config.frequency!==undefined)?Ex_AI_config.frequency:config.frequency;

                div.querySelector("#h_min").value = (Ex_AI_config.h_min!==undefined)?Ex_AI_config.h_min:config.h_min;

                div.querySelector("#h_max").value = (Ex_AI_config.h_max!==undefined)?Ex_AI_config.h_max:config.h_max;

                div.querySelector("#w_min").value = (Ex_AI_config.w_min!==undefined)?Ex_AI_config.w_min:config.w_min;

                div.querySelector("#w_max").value = (Ex_AI_config.w_max!==undefined)?Ex_AI_config.w_max:config.w_max;

                div.querySelector("#AIEnabled").value = (Ex.canvas[unit_type][unit_id].AI_config.enabled)?Ex.config.msg.OnOff[1]:Ex.config.msg.OnOff[0];


            break;



            
            case "SaveOnline":
            case "LoadOnline":

                

                this.SaveLoad({
                    mode:_event
                });

            break;

            case "LoadUnit":
            case "SaveUnit":
                this.SaveLoad({
                    mode:`${_event}_${e.target.dataset.unit}`
                });

            break;

            
            


            case "ControlDirSet":

                this.flag.ControlDirSet = e.target;
                e.target.nextElementSibling.innerHTML += ' (按任意鍵設定)'
            break;

            case "NextStage":

                console.log(Ex.canvas.background.next_stage);


                location.href = `${location.pathname}?stage=${Ex.canvas.background.next_stage}`;

            break;

            case "GameRestart":

                Ex.flag.game_start = false;

                document.querySelector(`[data-event="GameStart"]`).removeAttribute("disabled");

                document.querySelector(`[data-event="GamePause"]`).setAttribute("disabled","disabled");


                for(var name in Ex.canvas.player_bk) Ex.canvas.player[name] = Ex.canvas.player_bk[name];
                for(var name in Ex.canvas.enemy_bk) Ex.canvas.enemy[name] = Ex.canvas.enemy_bk[name];


                for(var key in Ex.canvas.wall) Ex.canvas.wall[key].mode = '';


                for(var name in Ex.canvas.player)
                {
                    var unit = Ex.canvas.player[name];

                    unit.hp = unit._hp;
                    unit.x = Math.floor(Ex.canvas.c.width/10);
                    unit.y = Math.floor(Ex.canvas.c.height/2);
                    unit._x = unit.x;
                    unit._y = unit.y;

                    if(this.BreakoutCloneMode)
                    {
                        unit.x = Math.floor(Ex.canvas.c.width * 0.5)-unit.w;
                        unit.y = Math.floor(Ex.canvas.c.height * 0.8);
                        unit._x = unit.x;
                        unit._y = unit.y;
                    }
                }

                for(var name in Ex.canvas.enemy)
                {

                    var unit = Ex.canvas.enemy[name];

                    unit.hp = unit._hp;
                    unit.x = Ex.canvas.c.width - Math.floor(Ex.canvas.c.width/8);
                    unit.y = Math.floor(Ex.canvas.c.height/2);
                    unit._x = unit.x;
                    unit._y = unit.y;
                }

                Ex.canvas.bullet = {};
                Ex.canvas.other_back = {};



                if(document.querySelector("#CreateFormPlayMenu")!==null)
                    document.querySelector("#CreateFormPlayMenu").remove();

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

                document.querySelector(`[data-event="GamePause"]`).removeAttribute("disabled");

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

        var color = Ex.canvas.background.img_list.wall.color;
        
        if(opacity===undefined)
        {
            opacity = (color.substr(-1,1)==="F")?"0":"F";
        }
        

        Ex.canvas.background.img_list.wall.color = color.substr(0,color.length-1) + opacity;


        if(document.querySelector(`[data-event="WallColor"]`)!==null)
        document.querySelector(`[data-event="WallColor"]`).value = this.config.msg.wall_color[(opacity==="F")?0:1];

    }

    SaveLoad = (arg)=>{

        var mode = arg.mode;

        this.flag.mode = mode;

        switch (mode)
        {
            case "SaveOnline":

                var stage = Ex.flag.Storage.local.stage||this.SerialCreate();

                for(var name in Ex.canvas.player) Ex.canvas.player[name].AI = {};
                for(var name in Ex.canvas.enemy) Ex.canvas.enemy[name].AI = {};
    
    
                var db_json = {
                    background:Ex.canvas.background,
                    wall:Ex.canvas.wall,
                    player:Ex.canvas.player,
                    enemy:Ex.canvas.enemy
                }
    
                Ex.DB.ref(`${Ex.id}/${stage}`).set(db_json);
                Ex.flag.Storage.local.stage = stage;
                Ex.func.StorageUpd();
                
                document.querySelector("#stage_url").value = `${location.href}?stage=${stage}`;
    
                prompt("關卡儲存完成,關卡編號如下",`${stage}`);

    
            break;


            case "LoadOnline":

                var stage = Ex.flag.Storage.local.stage||prompt("請輸入關卡編號");

                Ex.DB.ref(`${Ex.id}/${stage}`).once("value",r=>{
    
                    if(r.val()===null)
                    {
                        alert('編號錯誤');
                        return;
                    }
    
                    Ex.flag.Storage.local.stage = stage;
                    Ex.func.StorageUpd();


                    this.LoadSet({
                        mode:mode,
                        db_json:r.val()
                    })
    
                    
                });
            break;


            case "Play":
                var stage = new URL(location.href).searchParams.get("stage");


                Ex.DB.ref(`${Ex.id}/${stage}`).once("value",r=>{
    
                    if(r.val()!==null)
                    {    
                        this.LoadSet({
                            mode:mode,
                            db_json:r.val()
                        })
                        
                    }
                });

            break;

            case "LoadUnit_player":
            case "LoadUnit_enemy":

                var stage = prompt("請輸入關卡編號");

                Ex.DB.ref(`${Ex.id}/${stage}`).once("value",r=>{
    
                    if(r.val()!==null)
                    {
                        var unit = r.val()[mode.split("_")[1]]

                        for(var name in unit) this.CreateUnit(unit[name]);
                        
                    }
                });


            break;


            case "SaveUnit_player":
            case "SaveUnit_enemy":

                var stage = Ex.flag.Storage.local.stage||this.SerialCreate();

                for(var name in Ex.canvas.player) Ex.canvas.player[name].AI = {};
                for(var name in Ex.canvas.enemy) Ex.canvas.enemy[name].AI = {};
    
    
                var db_json = {
                    player:Ex.canvas.player,
                    enemy:Ex.canvas.enemy
                }


                Ex.DB.ref(`${Ex.id}/${stage}`).once("value",r=>{
    
                    if(r.val()!==null)
                    {
                        var unit = r.val()[mode.split("_")[1]]

                        for(var name in unit) this.CreateUnit(unit[name]);
                        
                    }
                });


            break;

        }







    }


    GameCheck = ()=>{

        if(Ex.flag.game_start===false) return;

        if(this.BreakoutCloneMode) return;

        
        if( Object.keys(Ex.canvas.player).length===0 || 
        Object.keys(Ex.canvas.enemy).length===0)
        {
            console.log("GAME OVER");

            Ex.flag.game_start = false;
            //cancelAnimationFrame(Ex.anima_timer);
            //cancelAnimationFrame(Ex.canvas.anima_timer);

            var div = document.createElement("div");
            div.id = `CreateFormPlayMenu`;
            this.DragendRegister(div);


            var game_status = (Object.keys(Ex.canvas.player).length===0)?"game_over":"game_pass";

            div.innerHTML = this.Temp(game_status);

            this.ControlMenu.appendChild(div);

          
            var img = Ex.canvas.background.img_list[game_status].img;
            var img_error = Ex.canvas.background.img_list[game_status].img_error;
           
            /*
            Ex.canvas.Draw({
                img:img,
                img_error:img_error,
                x:0,
                y:0,
                w:img.width||Ex.canvas.c.width,
                h:img.height||Ex.canvas.c.height,
                c:this.config.info.background[game_status].color
            });*/
            
            Ex.canvas.other_back[game_status] = {
                img:img,
                img_error:img_error,
                x:0,
                y:0,
                w:img.width||Ex.canvas.c.width,
                h:img.height||Ex.canvas.c.height,
                c:Ex.canvas.background.img_list[game_status].color
            }

            return;
        }

    }



    GamePause = ()=>{
        
        if(Ex.canvas.c===undefined)
        {
            return;
        }

        var btn = document.querySelector(`[data-event="GamePause"]`);
        if(Ex.flag.game_start)
        {
            btn.value = this.config.msg.game_pause[1];

            var div = document.createElement("div");
            div.id = `CreateFormPlayMenu`;
            this.DragendRegister(div);

            div.innerHTML = this.Temp( 'play_pause_menu' );

            this.ControlMenu.appendChild(div);
            
        }
        else
        {
            btn.value = this.config.msg.game_pause[0];

            if(document.querySelector("#CreateFormPlayMenu")!==null)
                document.querySelector("#CreateFormPlayMenu").remove();
        }

        Ex.flag.game_start = !Ex.flag.game_start;

    }


    LoadSet = (arg)=>{

        var db_json = arg.db_json;

        if(document.querySelector("canvas")!==null)
        {
            alert(this.config.msg.canvas_exist);
            return;
        }


        Ex.canvas = new CanvasClass({
            background:db_json.background,
            wall:db_json.wall,
            config:this.config
        });

        for(let name in db_json.player)
        {
            this.CreateUnit(db_json.player[name]);
        }
        for(let name in db_json.enemy)
        {
            this.CreateUnit(db_json.enemy[name]);
            
        }


        if(arg.mode==="LoadOnline")
        {
            document.querySelector(`[data-event="CreateCanvas"]`).value = this.config.msg.CreateCanvas[1];
            
            Ex.canvas.c.addEventListener("mousedown",this.MouseDown);


        }
        else if(arg.mode==="Play")
        {
            this.WallColor('0');
        }

    }


    PlayGameLoad = (db_json)=>{

        if(document.querySelector("canvas")!==null)
        {
            alert(this.config.msg.canvas_exist);
            return;
        }

        Ex.canvas = new CanvasClass({
            background:db_json.background,
            wall:db_json.wall,
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
            
        }
    }


    EditGameLoad = (db_json)=>{

        if(document.querySelector("canvas")!==null)
        {
            alert(this.config.msg.canvas_exist);
            return;
        }

        Ex.canvas = new CanvasClass({
            background:db_json.background,
            wall:db_json.wall,
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
        }

        Ex.canvas.c.addEventListener("mousedown",this.MouseDown);
    }



    ImgLoadLoop = (img_list)=>{

        for(let k in img_list){

            img_list[k].img = new Image();

            this.ImgLoad(img_list[k].img,
                ()=>{
                    img_list[k].img_error = false;
                },
                ()=>{
                    img_list[k].img_error = true;

                }
            );
            img_list[k].img.src = img_list[k].src;
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

    SerialCreate = ()=>{

        var d = new Date().getTime().toString(36);

        return d;

    }



    BreakoutCloneFunc = ()=>{

        this.BreakoutCloneMode = true;

        var unit = Ex.config.info.BreakoutClonePlayer;

        for(var key in unit.control) unit.control[key] = unit.control[key].toString().toUpperCase();


        unit.type = "player";
        unit.id = "BreakoutClonePlayer";
        unit.bullet.mode = "reflex";
        unit.bullet.reflex_count = 99;
        unit.x = Math.floor(Ex.canvas.c.width * 0.5)-unit.w;
        unit.y = Math.floor(Ex.canvas.c.height * 0.8);

        this.CreateUnit(unit);


        var obj = unit;

        var id = `${unit.id}_${new Date().getTime()}`;

        Ex.canvas.bullet[ id ] = {
            id:id ,
            unit:{
                id:obj.id,
                type:obj.type
            },
            type:"bullet",
            mode:obj.bullet.mode,
            reflex_count:obj.bullet.reflex_count,
            track_sec:obj.bullet.track_sec,
            x:obj.x + Math.floor(obj.w/2) - Math.floor(obj.bullet.w/2),
            y:obj.y - obj.bullet.h - 5,
            x2:0,
            y2:Ex.func.Rand( Ex.canvas.c.width ),
            w:obj.bullet.w,
            h:obj.bullet.h,
            hp:obj.bullet.hp,
            speed:obj.bullet.speed
        }

    }

    

    



    Temp = (name)=>{

        var html = ``;
        switch (name){

            case "default":

                var stage_url = '';

                if(Ex.flag.Storage.local.stage!==undefined)
                {
                    stage_url = `${location.href}?stage=${Ex.flag.Storage.local.stage}`;
                }

                html = `
                    <div ${(this.flag.mode==="Play")?'style="display:none;"':''}>
                        <span style="color:#fff;">關卡網址：</span><input type="text" style="width:80%" id="stage_url" value="${stage_url}">
                        <HR>

                        <input type="button" data-event="BreakoutClone" value="打磚塊模式">
                    
                        <input type="button" data-event="CreateCanvas" value="${Ex.config.msg.CreateCanvas[0]}">

                        <input type="button" data-event="player" value="${Ex.config.msg.Createplayer[0]}">
                        <input type="button" data-event="enemy" value="${Ex.config.msg.Createenemy[0]}">

                        <input type="button" data-event="WallEdit" value="障礙物設定">


                        <input type="button" data-event="SaveOnline" value="儲存關卡">

                        <input type="button" data-event="LoadOnline" value="讀取關卡">

                        <input type="button" data-event="ClearStage" value="清除所有設定">

                        <input type="button" id="TimerSec" value="">

                        
                        <HR>
                    </div>

                    <input type="button" disabled="disabled" data-event="GamePause" value="${Ex.config.msg.game_pause[0]}">


                    <input type="button" data-event="GameStart" value="${Ex.config.msg.game_start}">

                   
                  

                `;

            break;



            case "game_over":

                html = `
                    <input type="button" data-event="GameRestart" value="重新開始">
                `;

            break;


            case "game_pass":

                html = `
                    <input type="button" data-event="GameRestart" value="重新開始">
                    <input type="button" data-event="NextStage" value="前進下一關">
                `;

            break;


            case "play_pause_menu":

                html = `
                
                <input type="button" data-event="GameRestart" value="重新開始">
                <input type="button" data-event="GamePause" value="${Ex.config.msg.game_pause[1]}">
            
            `;

            break;


            case "CreateCanvas":

                html = `
                    背景圖片網址：<input type="text" id="url" value="${this.config.info.background.img_list.self.src}"><BR>

                    障礙物方格大小：<input type="number" id="grid" value="${this.config.info.background.img_list.wall.grid}"><BR>

                    過關畫面網址：<input type="text" id="game_pass" value=""><BR>

                    失敗畫面網址：<input type="text" id="game_over" value=""><BR>

                    下一關編號：<input type="text" id="next_stage" value=""><BR>

                    
                    高：<input id="height" type="number" value="${this.config.info.background.h}"><BR>
                    寬：<input id="width" type="number" value="${this.config.info.background.w}"><BR>

                    <HR>
                    <input type="button" data-event="${name}" value="送出">
                    ${this.Temp("Close")}
                `;

            break;


            case "player":
            case "enemy":
                html =`

                    <span>${(name==="player")?`玩家`:`敵人`}</span><HR>
                    單位圖片網址：<input type="text" id="img_self" value="${this.config.info[name].img_list.self.src}"><BR>
                    中彈圖片網址：<input type="text" id="img_collision" value="${this.config.info[name].img_list.collision.src}"><BR>
                    

                    血量：<input type="number" id="hp" value="${this.config.info[name].hp.v}"><BR>
                    移動速度<input type="number" id="speed" value="${this.config.info[name].speed}"><BR>
                    射擊頻率(每秒/發)<input type="number" id="speed_shoot" value="${this.config.info[name].speed_shoot}"><BR>

                    高：<input id="h" type="number" value="${this.config.info[name].h}"><BR>
                    寬：<input id="w" type="number" value="${this.config.info[name].w}"><BR>

                    <HR>

                    子彈圖片網址：<input type="text" id="img_bullet" value="${this.config.info[name].img_list.bullet.src}"><BR>

                    子彈類型：<select id="bullet_mode">${this.Temp(`bullet_mode_${name}`)}</select><BR>
                    子彈攻擊力：<input type="number" id="bullet_hp" value="${this.config.info[name].bullet.hp}"><BR>
                    子彈速度：<input type="number" id="bullet_speed" value="${this.config.info[name].bullet.speed}"><BR>

                    子彈高：<input id="bullet_h" type="number" value="${this.config.info[name].bullet.h}"><BR>
                    子彈寬：<input id="bullet_w" type="number" value="${this.config.info[name].bullet.w}"><BR>

                    子彈數量：<input id="bullet_count" type="number" value="${this.config.info[name].bullet.count}"><BR>

                    彈道飄移倍率(子彈本身高寬)：<input id="bullet_rand" type="number" value="${this.config.info[name].bullet.rand}"><BR>

                    反彈子彈反彈次數：<input id="reflex_count" type="number" value="${this.config.info[name].bullet.reflex_count}"><BR>

                    追蹤子彈追蹤秒數：<input id="track_sec" type="number" value="${this.config.info[name].bullet.track_sec}"><BR>

                    <div ${(name==="enemy")?`style="display:none"`:""}>
                    <HR>
                        <input id="up" data-value="${this.config.info[name].control.up}" value="上" 
                        data-event="ControlDirSet" type="button">：<span>${this.config.info[name].control.up}</span><BR>

                        <input id="right" data-value="${this.config.info[name].control.right}" value="右" 
                        data-event="ControlDirSet" type="button">：<span>${this.config.info[name].control.right}</span><BR>

                        <input id="down" data-value="${this.config.info[name].control.down}" value="下" 
                        data-event="ControlDirSet" type="button">：<span>${this.config.info[name].control.down}</span><BR>

                        <input id="left" data-value="${this.config.info[name].control.left}" value="左" 
                        data-event="ControlDirSet" type="button">：<span>${this.config.info[name].control.left}</span><BR>

                    </div>

                    <HR>
                    <input type="button" data-unit="${name}" data-event="LoadUnit" value="讀取線上${(name==="player")?`玩家`:`敵人`}"><BR>
                    <input type="button" data-unit="${name}" data-event="SaveUnit" value="儲存線上${(name==="player")?`玩家`:`敵人`}">

                    ${(name==="enemy")?
                    `<HR>
                    <input type="button" data-unit_type="${name}" data-unit_id="${name}" data-event="AIEdit" value="AI行動設定">`:``}

                    <HR>
                    <input type="button" data-event="${name}" value="送出">
                    ${this.Temp("Close")}
                `;
            break;

            case "delete_unit":

                html = `
                
                    <input type="button" data-event="delete_unit" value="刪除單位">
                `;

            break;


            case "bullet_mode_player":
            case "bullet_mode_enemy":

                for(var key in this.config.info[name.split("_").pop()].bullet.mode)
                {
                    var text = this.config.info[name.split("_").pop()].bullet.mode[key];
                    html += `<option value="${key}">${text}</option>`;
                }

            break;

            case "AIEdit":
                
                html = `
                    <span></span><HR>
                    移動機率設定<BR>
                    <input type="hidden" id="unit_type" value="">
                    <input type="hidden" id="unit_id" value="">
                    上：<input id="up" type="number"> %<BR>
                    右：<input id="right" type="number"> %<BR>
                    下：<input id="down" type="number"> %<BR>
                    左：<input id="left" type="number"> %<BR>
                    頻率(秒)：<input id="frequency" type="number"><BR>

                    <HR>
                    移動範圍 (背景長寬倍率)<BR>
                    左右：${Ex.canvas.c.width}<BR>
                    上下：${Ex.canvas.c.height}<BR>
                    上：<input id="h_min" type="number"><BR>
                    右：<input id="w_max" type="number"><BR>
                    下：<input id="h_max" type="number"><BR>
                    左：<input id="w_min" type="number"><BR>

                    <HR>
                    啟用AI：<input id="AIEnabled" data-event="AIEnabled" type="button" value="${Ex.config.msg.OnOff[0]}">
                    <HR>
                    <input type="button" data-event="${name}" value="送出">
                    ${this.Temp("Close")}
                `;

            break;


            case "WallEdit":

                html = `
                    障礙物方格大小：<input type="number" id="grid"><BR>
                    <input type="button" data-event="wall_set" value="${this.config.msg.wall_set[0]}"> <input type="button" data-event="wall_color" value="${this.config.msg.wall_color[0]}">
                    <HR>
                    <input type="button" data-event="${name}" value="送出">
                    ${this.Temp("Close")}
                
                `;

            break;


            case "BreakoutClone":

                html = `
                    背景圖片網址：<input type="text" id="url" value="https://images.plurk.com/2EV7jlV5OBfjhF9h4g78Gr.jpg"><BR>

                    磚塊大小：<input type="number" id="grid" value="${this.config.info.background.img_list.wall.grid}"><BR>


                    <HR>
                    <input type="button" data-event="${name}" value="送出">
                    ${this.Temp("Close")}
                `;

            break;
            

            case "Close":

                html = `
                    
                    <input type="button" data-event="CloseParent" value="關閉">
                `;

            break;

        }


        return html;

    }
}