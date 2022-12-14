class EditClass {

    constructor(Ex,opt = {}){
        this.opt = opt;
        this.Ex = Ex;
        
        this.flag = {
            ControlDirSet:null,
            WallMode:true,
            mousedown:{},
            mode:''
        };
        var url_params = new URL(location.href).searchParams;

        

        Ex.flag.Storage.local.stage = Ex.flag.Storage.local.stage||{};

        if(
            Ex.flag.Storage.local.stage.edit!==undefined && 
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
        this.ControlMenu.innerHTML = this.Temp("default");

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



    WallCheck = (x,y)=>{
        var Ex = this.Ex;

        var _return = false;
        for(var id in Ex.canvas.wall)
        {
            var obj = Ex.canvas.wall[id];

            if(x>=obj.x && x<=obj.x+obj.w &&
                y>=obj.y && y<=obj.y+obj.h)
                {
                    _return = id;
                }
        }


        return _return;
    }

    MouseMove = (e)=>{

        this.SetWall(e);
    }

    MouseDown = (e)=>{
        
        this.SetWall(e);
    }


    SetWall = (e)=>{
        var Ex = this.Ex;

        if(!e.shiftKey) return;
        if(this.flag.SaveLoad==="Play") return;
        

        if(this.flag.WallMode)
        {
            if(this.WallCheck(e.offsetX,e.offsetY)) return;

            let id = `wall_${new Date().getTime()}`;

            Ex.canvas.wall[id] = 
            {
                id:id,
                type:"wall",
                x:e.offsetX - e.offsetX%Ex.canvas.background.img_list.wall.grid,
                y:e.offsetY - e.offsetY%Ex.canvas.background.img_list.wall.grid,
                w:Ex.canvas.background.img_list.wall.grid,
                h:Ex.canvas.background.img_list.wall.grid,
                hp:Ex.canvas.background.img_list.wall.hp
            };
        }
        else
        {
            var id = this.WallCheck(e.offsetX,e.offsetY);

            if(id) delete Ex.canvas.wall[id];
        }
    }

    CreateUnit = (unit)=>{
        var Ex = this.Ex;

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

                    unit.AI = new AIClass(Ex,unit);
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

                    unit.AI = new AIClass(Ex,unit);
                }

            }
        );

        Ex.canvas[unit.type][unit.id] = unit;
        unit.img_list.self.img.src = unit.img_list.self.src;

        if(document.querySelector(`[data-event="${unit.type}"]`)!==null)
        document.querySelector(`[data-event="${unit.type}"]`).value = this.config.msg[`Create${unit.type}`][1];

    }


    ClickEvent = (e)=>{
        var Ex = this.Ex;

        var _event = e.target.dataset.event;

        this.flag.ClickEvent = e.target.dataset.event;

        switch (_event){

            case "ClearStage":
                if(confirm(this.config.msg.ClearStage)===false) return;

                for(var name in Ex.canvas.enemy)
                {
                    cancelAnimationFrame(Ex.canvas.enemy[name].AI.anima_timer);
                }

                if(Ex.canvas.c) Ex.canvas.c.remove();
                delete Ex.BreakoutCloneClass;

                Ex.canvas = {};
                //Ex.flag.Storage.local = {};
                //Ex.func.StorageUpd();

                Ex.config = new ConfigClass();
                this.config = Ex.config;
                this.ControlMenu.innerHTML = this.Temp('default');

                Ex.flag.Storage.local.stage = {};
                Ex.func.StorageUpd();

                location.reload();
                

            break;

            case "wall_clear":

                Ex.canvas.wall = {};

            break;


            case "BreakoutClone":

                if(document.querySelector(`#CreateForm${_event}`)!==null)
                {
                    var form = document.querySelector(`#CreateForm${_event}`);

                    if(Ex.BreakoutCloneClass)
                    {
                        Ex.BreakoutCloneClass.Update(form);

                        return;
                    }
                    


                    var _canvas = {
                        background:{
                            memo:(form.querySelector("#memo").value),
                            BreakoutClone:{
                                life:parseInt(form.querySelector("#life").value)
                            },
                            img_list:{
                                self:{
                                    src:form.querySelector("#url").value,
                                    color:this.config.info.background.img_list.self.color
                                },
                                wall:{
                                    color:form.querySelector("#wall_color").value+"FF",
                                    broke:this.config.info.background.img_list.wall.broke,
                                    grid:parseInt(form.querySelector("#grid").value),
                                    src:(form.querySelector("#wall_src").value),
                                    hp:1
                                }
                            }
                        },
                        config:this.config,
                        func:{
                            mousedown:this.MouseDown,
                            mousemove:this.MouseMove
                        }
                    }

                    var _player = JSON.parse(JSON.stringify(Ex.config.info.BreakoutClonePlayer));


                    _player.w = parseInt(form.querySelector("#player_w").value);
                    _player.h = parseInt(form.querySelector("#player_h").value);
                    _player.speed = parseInt(form.querySelector("#speed").value);
                    _player.bullet.h = parseInt(form.querySelector("#bullet_h").value);
                    _player.bullet.w = parseInt(form.querySelector("#bullet_h").value);
                    _player.bullet.speed = parseInt(form.querySelector("#bullet_speed").value);

                    _player.img_list.self.src = (form.querySelector("#player_src").value);
                    _player.img_list.bullet.src = (form.querySelector("#bullet_src").value);


                    _player.img_list.self.color = (form.querySelector("#player_color").value) + 'FF';
                    _player.img_list.bullet.color = (form.querySelector("#bullet_color").value) + 'FF';


                    Ex.BreakoutCloneClass = new BreakoutCloneClass(Ex,this.config,_canvas,_player);

                    form.remove();
                    return;
                }

                var div = document.createElement("div");
                div.id = `CreateForm${_event}`;
                this.DragendRegister(div);

                div.innerHTML = this.Temp( _event );

                this.ControlMenu.appendChild(div);


                if(Ex.BreakoutCloneClass)
                {
                    div.querySelector("#url").setAttribute("disabled","disabled");

                    /*
                    div.querySelector("#bullet_h").setAttribute("disabled","disabled");

                    div.querySelector("#bullet_src").setAttribute("disabled","disabled");
                    */
                    
                    div.querySelector("#memo").value = Ex.canvas.background.memo;

                    div.querySelector("#grid").value = Ex.canvas.background.img_list.wall.grid;

                    div.querySelector("#player_color").value = Ex.canvas.player.BreakoutClonePlayer.img_list.self.color.substr(0,Ex.canvas.player.BreakoutClonePlayer.img_list.self.color.length-2);

                    div.querySelector("#bullet_color").value = Ex.canvas.player.BreakoutClonePlayer.img_list.bullet.color.substr(0,Ex.canvas.player.BreakoutClonePlayer.img_list.bullet.color.length-2);


                    div.querySelector("#wall_color").value = Ex.canvas.background.img_list.wall.color.substr(0,Ex.canvas.background.img_list.wall.color.length-2);



                    div.querySelector("#wall_src").value = Ex.canvas.background.img_list.wall.src;


                    div.querySelector("#speed").value = Ex.canvas.player.BreakoutClonePlayer.speed;

                    div.querySelector("#bullet_speed").value = Ex.canvas.player.BreakoutClonePlayer.bullet.speed;

                    div.querySelector("#bullet_h").value = Ex.canvas.player.BreakoutClonePlayer.bullet.h;

                    div.querySelector("#bullet_src").value = Ex.canvas.player.BreakoutClonePlayer.img_list.bullet.src;


                    div.querySelector("#player_src").value = Ex.canvas.player.BreakoutClonePlayer.img_list.self.src;

                    div.querySelector("#player_w").value = Ex.canvas.player.BreakoutClonePlayer.w;

                    div.querySelector("#player_h").value = Ex.canvas.player.BreakoutClonePlayer.h;
                    


                    div.querySelector("#life").value = Ex.BreakoutCloneClass.flag.life;

                    
                }


            break;

            case "BreakoutCloneContinue":

                Ex.BreakoutCloneClass.GameRestart(true);

            break;


            case "ShowImg":

                Ex.BreakoutCloneClass.ShowImg();

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

                    delete Ex.BreakoutCloneClass;
                    
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

                        Ex.canvas = new CanvasClass(Ex,{
        
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
                            config:this.config,
                            func:{
                                mousedown:this.MouseDown,
                                mousemove:this.MouseMove
                            }
                        });
    
                        

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
                            unit.AI = new AIClass(Ex,unit);
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


            case "BreakoutCloneWallEdit":
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

                    Ex.canvas.background.img_list.wall.color = (form.querySelector("#wall_color").value) + 'FF';

                    return;
                }



                var div = document.createElement("div");
                div.id = `CreateForm${_event}`;
                this.DragendRegister(div);

                div.innerHTML = this.Temp( _event );


                this.ControlMenu.appendChild(div);

                div.querySelector("#grid").value = Ex.canvas.background.img_list.wall.grid;

                div.querySelector("#wall_color").value = Ex.canvas.background.img_list.wall.color.substr(0,Ex.canvas.background.img_list.wall.color.length-2);


            break;

            case "wall_set":

                this.flag.WallMode = !this.flag.WallMode;

                e.target.value = (this.flag.WallMode)?this.config.msg.wall_set[0]:this.config.msg.wall_set[1];

            break;

            case "wall_color":

                this.WallColor();

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

                div.querySelector("span").innerHTML = (unit_type==="player")?"??????":"??????";


                div.querySelector("#unit_type").value = unit_type;
                div.querySelector("#unit_id").value = unit_id;

                if(Ex.canvas[unit_type][unit_id].AI_config===undefined)
                {
                    Ex.canvas[unit_type][unit_id].AI = new AIClass(Ex,Ex.canvas[unit_type][unit_id]);
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
                e.target.nextElementSibling.innerHTML += ' (??????????????????)'
            break;

            case "NextStage":

                location.href = `${location.pathname}?stage=${Ex.canvas.background.next_stage}`;

            break;

            case "GameRestart":

                if(Ex.BreakoutCloneClass)
                {
                    Ex.BreakoutCloneClass.GameRestart();
                    return;
                }
                

                Ex.flag.game_start = false;

                document.querySelector(`[data-event="GameStart"]`).removeAttribute("disabled");

                document.querySelector(`[data-event="GamePause"]`).setAttribute("disabled","disabled");


                for(var name in Ex.canvas.player_bk) Ex.canvas.player[name] = Ex.canvas.player_bk[name];
                for(var name in Ex.canvas.enemy_bk) Ex.canvas.enemy[name] = Ex.canvas.enemy_bk[name];


                for(var key in Ex.canvas.wall) Ex.canvas.wall[key].mode = '';

                Ex.canvas.bullet = {};
                Ex.canvas.other_back = {};


                for(var name in Ex.canvas.player)
                {
                    let unit = Ex.canvas.player[name];

                    unit.hp = unit._hp;
                    unit.x = Math.floor(Ex.canvas.c.width/10);
                    unit.y = Math.floor(Ex.canvas.c.height/2);
                    unit._x = unit.x;
                    unit._y = unit.y;


                    

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

        var Ex = this.Ex;

        if(Ex.canvas.c===undefined)
        {
            alert(this.config.msg.canvas_no_exist);
            return;
        }

        for(var id in Ex.canvas.wall)
        {
            var wall = Ex.canvas.wall[id];

            var color = wall.color;
        
            if(opacity===undefined)
            {
                opacity = (color.substr(-2,2).toUpperCase()==="FF")?"00":"FF";
            }

            wall.color = color.substr(0,color.length-2) + opacity;
        }

        


        if(document.querySelector(`[data-event="wall_color"]`)!==null)
        {
            document.querySelector(`[data-event="wall_color"]`).value = this.config.msg.wall_color[(opacity==="FF")?0:1];
        }
        

    }

    SaveLoad = (arg)=>{
        var Ex = this.Ex;

        var mode = arg.mode;
        this.flag.SaveLoad = mode;

        switch (mode)
        {
            case "SaveOnline":

                if(Ex.canvas.c===undefined)
                {
                    alert(this.config.msg.canvas_no_exist);
                    return;
                }

                var stage;
                if(Ex.flag.Storage.local.stage.edit)
                {
                    stage = Ex.flag.Storage.local.stage;
                }
                else
                {
                    stage = this.SerialCreate();
                }

                

                for(var name in Ex.canvas.player) Ex.canvas.player[name].AI = {};
                for(var name in Ex.canvas.enemy) Ex.canvas.enemy[name].AI = {};
    
    

                
                var db_json = {
                    type:(Ex.BreakoutCloneClass)?"BreakoutClone":"ShootGame",
                    background:Ex.canvas.background,
                    wall:Ex.canvas.wall,
                    player:Ex.canvas.player,
                    enemy:Ex.canvas.enemy,
                    time:stage.time
                }
    
                Ex.DB.ref(`${Ex.id}/${stage.edit}`).set(db_json);
                Ex.flag.Storage.local.stage = stage;
                Ex.func.StorageUpd();
                
                document.querySelector("#stage_url").value = `${location.href}?stage=${stage.play}`;

                document.querySelector("#stage_url").nextElementSibling.innerHTML = `<a style="color:#fff;" target="_blank" href="${location.href}?stage=${stage.play}">????????????</a>`;
    
                prompt("??????????????????,?????????????????????",`${stage.edit}`);

    
            break;


            case "LoadOnline":

                var stage = Ex.flag.Storage.local.stage.edit||prompt("?????????????????????");

                Ex.DB.ref(`${Ex.id}/${stage}`).once("value",r=>{
    
                    r = r.val();
                    if(r===null)
                    {
                        alert('????????????');
                        return;
                    }
    
                    Ex.flag.Storage.local.stage.edit = stage;
                    Ex.flag.Storage.local.stage.play = this.SerialCreate(stage,"edit");
                    Ex.flag.Storage.local.stage.time = r.time;
                    Ex.func.StorageUpd();


                    this.LoadSet({
                        mode:mode,
                        db_json:r
                    })
    
                    document.querySelector("#stage_url").value = `${location.href}?stage=${Ex.flag.Storage.local.stage.play}`;

                });
            break;


            case "Play":
                var stage = new URL(location.href).searchParams.get("stage");

                stage = this.SerialCreate(stage,"play");


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

                var stage = prompt("?????????????????????");

                stage = this.SerialCreate(stage);


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

                var stage = Ex.flag.Storage.local.stage.edit||this.SerialCreate();

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
        var Ex = this.Ex;

        if(Ex.flag.game_start===false) return;

        if(Ex.BreakoutCloneClass)
        {
            Ex.BreakoutCloneClass.GameCheck();
            return;
        }

        
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
        var Ex = this.Ex;
        
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
        var Ex = this.Ex;

        var db_json = arg.db_json;

        if(document.querySelector("canvas")!==null)
        {
            alert(this.config.msg.canvas_exist);
            return;
        }


        var _canvas = {
            background:db_json.background,
            wall:db_json.wall,
            config:this.config,
            func:{
                mousedown:this.MouseDown,
                mousemove:this.MouseMove
            }
        }


        if(db_json.type==="BreakoutClone")
        {
            var _player = db_json.player.BreakoutClonePlayer;


            Ex.BreakoutCloneClass = new BreakoutCloneClass(Ex,this.config,_canvas,_player);
        }

        if(db_json.type==="ShootGame")
        {
            Ex.canvas = new CanvasClass(Ex,_canvas);

            for(let name in db_json.player)
            {
                this.CreateUnit(db_json.player[name]);
            }
            for(let name in db_json.enemy)
            {
                this.CreateUnit(db_json.enemy[name]);
                
            }
        } 


        if(arg.mode==="LoadOnline")
        {
            if(document.querySelector(`[data-event="CreateCanvas"]`))
            document.querySelector(`[data-event="CreateCanvas"]`).value = this.config.msg.CreateCanvas[1];
            
        }
        else if(arg.mode==="Play")
        {
            if(!Ex.BreakoutCloneClass) this.WallColor('0');
        }

    }


    PlayGameLoad = (db_json)=>{
        var Ex = this.Ex;

        if(document.querySelector("canvas")!==null)
        {
            alert(this.config.msg.canvas_exist);
            return;
        }

        Ex.canvas = new CanvasClass(Ex,{
            background:db_json.background,
            wall:db_json.wall,
            config:this.config,
            func:{
                mousedown:this.MouseDown,
                mousemove:this.MouseMove
            }
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
        var Ex = this.Ex;

        if(document.querySelector("canvas")!==null)
        {
            alert(this.config.msg.canvas_exist);
            return;
        }

        Ex.canvas = new CanvasClass(Ex,{
            background:db_json.background,
            wall:db_json.wall,
            config:this.config,
            func:{
                mousedown:this.MouseDown,
                mousemove:this.MouseMove
            }
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

    SerialCreate = (s,type)=>{

        if( s!==undefined )
        {
            return (type==="play")?btoa( parseInt("edit",36) +(atob(s) - parseInt("play",36) ) ):btoa( parseInt("play",36) +(atob(s) - parseInt("edit",36) ) )
        }
        else
        {
            var d = new Date().getTime();
            var _d = parseInt(d.toString().substr(4));
    
            return {
                edit:btoa( (parseInt('edit',36) + _d) ),
                play:btoa( (parseInt('play',36) + _d) ),
                time:_d
            };

            

        }
    }


    

    Rand = (array)=>{

        if( !Array.isArray(array) )
        {
            var _array = [];
            for(var i=0;i<=array;i++ ) _array.push(i);
            array = _array;
        }

        for (let i = array.length - 1; i > 0; i--){

            let j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];
        }

        return array.pop();
    }



    Temp = (name)=>{
        var Ex = this.Ex;

        var html = ``;

        this.flag.Temp = name;

        switch (name){

            case "default":


                html = `
                    <div ${(this.flag.SaveLoad==="Play")?'style="display:none;"':''}>
                        <span style="color:#fff;">???????????????</span><input type="text" style="width:30%" id="stage_url" value="${(Ex.flag.Storage.local.stage.play!==undefined)?`${location.href}?stage=${Ex.flag.Storage.local.stage.play}`:``}"> <span>${(Ex.flag.Storage.local.stage.play!==undefined)?`<a style="color:#fff;" target="_blank" href="${location.href}?stage=${Ex.flag.Storage.local.stage.play}">????????????</a>`:``}</span>
                        <HR>

                        <input type="button" data-event="BreakoutClone" value="???????????????">

                        <input type="button" data-event="BreakoutCloneWallEdit" value="????????????">
                    
                        



<!--


                        <input type="button" data-event="WallEdit" value="???????????????">
                        <input type="button" data-event="CreateCanvas" value="${Ex.config.msg.CreateCanvas[0]}">

                        <input type="button" data-event="player" value="${Ex.config.msg.Createplayer[0]}">
                        <input type="button" data-event="enemy" value="${Ex.config.msg.Createenemy[0]}">

                        <input type="button" data-event="WallEdit" value="???????????????">
-->


                        <input type="button" data-event="SaveOnline" value="????????????">

                        <input type="button" data-event="LoadOnline" value="????????????">

                        <input type="button" data-event="ClearStage" value="??????????????????">

                        <input type="button" id="TimerSec" value="">

                        
                        <HR>
                    </div>


                    <input type="button" disabled="disabled" data-event="GamePause" value="${Ex.config.msg.game_pause[0]}">


                    <input type="button" data-event="GameStart" value="${Ex.config.msg.game_start}">

                   


                `;

            break;


            


            case "game_over":

                html = `
                    <input type="button" data-event="GameRestart" value="????????????">
                `;

            break;


            case "game_pass":

                html = `
                    <input type="button" data-event="GameRestart" value="????????????">
                    <input type="button" data-event="NextStage" value="???????????????">
                `;

            break;


            case "play_pause_menu":

                html = `
                    ${(Ex.BreakoutCloneClass)?`???????????????${Ex.BreakoutCloneClass.flag.life}
                    <HR>`:``}
                    <input type="button" data-event="GameRestart" value="????????????">
                    <input type="button" data-event="GamePause" value="${Ex.config.msg.game_pause[1]}">
                `;

            break;


            case "CreateCanvas":

                html = `
                    ?????????????????????<input type="text" id="url" value="${this.config.info.background.img_list.self.src}"><BR>

                    ????????????????????????<input type="number" id="grid" value="${this.config.info.background.img_list.wall.grid}"><BR>

                    ?????????????????????<input type="text" id="game_pass" value=""><BR>

                    ?????????????????????<input type="text" id="game_over" value=""><BR>

                    ??????????????????<input type="text" id="next_stage" value=""><BR>

                    
                    ??????<input id="height" type="number" value="${this.config.info.background.h}"><BR>
                    ??????<input id="width" type="number" value="${this.config.info.background.w}"><BR>

                    <HR>
                    <input type="button" data-event="${name}" value="??????">
                    ${this.Temp("Close")}
                `;

            break;


            case "player":
            case "enemy":
                html =`

                    <span>${(name==="player")?`??????`:`??????`}</span><HR>
                    ?????????????????????<input type="text" id="img_self" value="${this.config.info[name].img_list.self.src}"><BR>
                    ?????????????????????<input type="text" id="img_collision" value="${this.config.info[name].img_list.collision.src}"><BR>
                    

                    ?????????<input type="number" id="hp" value="${this.config.info[name].hp.v}"><BR>
                    ????????????<input type="number" id="speed" value="${this.config.info[name].speed}"><BR>
                    ????????????(??????/???)<input type="number" id="speed_shoot" value="${this.config.info[name].speed_shoot}"><BR>

                    ??????<input id="h" type="number" value="${this.config.info[name].h}"><BR>
                    ??????<input id="w" type="number" value="${this.config.info[name].w}"><BR>

                    <HR>

                    ?????????????????????<input type="text" id="img_bullet" value="${this.config.info[name].img_list.bullet.src}"><BR>

                    ???????????????<select id="bullet_mode">${this.Temp(`bullet_mode_${name}`)}</select><BR>
                    ??????????????????<input type="number" id="bullet_hp" value="${this.config.info[name].bullet.hp}"><BR>
                    ???????????????<input type="number" id="bullet_speed" value="${this.config.info[name].bullet.speed}"><BR>

                    ????????????<input id="bullet_h" type="number" value="${this.config.info[name].bullet.h}"><BR>
                    ????????????<input id="bullet_w" type="number" value="${this.config.info[name].bullet.w}"><BR>

                    ???????????????<input id="bullet_count" type="number" value="${this.config.info[name].bullet.count}"><BR>

                    ??????????????????(??????????????????)???<input id="bullet_rand" type="number" value="${this.config.info[name].bullet.rand}"><BR>

                    ???????????????????????????<input id="reflex_count" type="number" value="${this.config.info[name].bullet.reflex_count}"><BR>

                    ???????????????????????????<input id="track_sec" type="number" value="${this.config.info[name].bullet.track_sec}"><BR>

                    <div ${(name==="enemy")?`style="display:none"`:""}>
                    <HR>
                        <input id="up" data-value="${this.config.info[name].control.up}" value="???" 
                        data-event="ControlDirSet" type="button">???<span>${this.config.info[name].control.up}</span><BR>

                        <input id="right" data-value="${this.config.info[name].control.right}" value="???" 
                        data-event="ControlDirSet" type="button">???<span>${this.config.info[name].control.right}</span><BR>

                        <input id="down" data-value="${this.config.info[name].control.down}" value="???" 
                        data-event="ControlDirSet" type="button">???<span>${this.config.info[name].control.down}</span><BR>

                        <input id="left" data-value="${this.config.info[name].control.left}" value="???" 
                        data-event="ControlDirSet" type="button">???<span>${this.config.info[name].control.left}</span><BR>

                    </div>

                    <HR>
                    <input type="button" data-unit="${name}" data-event="LoadUnit" value="????????????${(name==="player")?`??????`:`??????`}"><BR>
                    <input type="button" data-unit="${name}" data-event="SaveUnit" value="????????????${(name==="player")?`??????`:`??????`}">

                    ${(name==="enemy")?
                    `<HR>
                    <input type="button" data-unit_type="${name}" data-unit_id="${name}" data-event="AIEdit" value="AI????????????">`:``}

                    <HR>
                    <input type="button" data-event="${name}" value="??????">
                    ${this.Temp("Close")}
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
                    ??????????????????<BR>
                    <input type="hidden" id="unit_type" value="">
                    <input type="hidden" id="unit_id" value="">
                    ??????<input id="up" type="number"> %<BR>
                    ??????<input id="right" type="number"> %<BR>
                    ??????<input id="down" type="number"> %<BR>
                    ??????<input id="left" type="number"> %<BR>
                    ??????(???)???<input id="frequency" type="number"><BR>

                    <HR>
                    ???????????? (??????????????????)<BR>
                    ?????????${Ex.canvas.c.width}<BR>
                    ?????????${Ex.canvas.c.height}<BR>
                    ??????<input id="h_min" type="number"><BR>
                    ??????<input id="w_max" type="number"><BR>
                    ??????<input id="h_max" type="number"><BR>
                    ??????<input id="w_min" type="number"><BR>

                    <HR>
                    ??????AI???<input id="AIEnabled" data-event="AIEnabled" type="button" value="${Ex.config.msg.OnOff[0]}">
                    <HR>
                    <input type="button" data-event="${name}" value="??????">
                    ${this.Temp("Close")}
                `;

            break;



            case "WallEdit":

                html = `
                    ????????????????????????<input type="number" id="grid"><hr>
                    <input type="button" data-event="wall_set" value="${this.config.msg.wall_set[0]}"> <input type="button" data-event="wall_color" value="${this.config.msg.wall_color[0]}"><br>(shift??????????????????????????????????????????????????????)
                    <HR>
                    <input type="button" data-event="${name}" value="??????">
                    ${this.Temp("Close")}
                
                `;

            break;


            
            


            //////////////////////////////////////
            case "Close":

                html = `
                    
                    <input type="button" data-event="CloseParent" value="??????">
                `;

            break;

            case "delete_unit":

                html = `
                
                    <input type="button" data-event="delete_unit" value="????????????">
                `;

            break;



            ///////////////////////////////////////////////////////

            case "BreakoutClone":

                html = `
                    
                    ??????????????????(???????????????)<BR><textarea id="memo">https://www.youtube.com/watch?v=i1EQhrNZLKY</textarea><HR>
                    

                    ?????????????????????<input type="text" id="url" value="https://img.youtube.com/vi/i1EQhrNZLKY/maxresdefault.jpg"><BR>

                    <hr>
                    ???????????????<input type="number" id="grid" value="${this.config.info.background.img_list.wall.grid}"><BR>

                    ???????????????<input id="wall_color" type="color" value=${this.config.info.background.img_list.wall.color}><BR>

                    ?????????????????????<input id="wall_src" type="text" value=${this.config.info.background.img_list.wall.src}><BR>

                    

                    

                    <hr>
                    ????????????<input id="bullet_color" type="color" value=${this.config.info.BreakoutClonePlayer.img_list.bullet.color}><BR>

                    ??????????????????<input type="text" id="bullet_src" value="${this.config.info.BreakoutClonePlayer.img_list.bullet.src}"><BR>

                    ????????????<input type="number" id="bullet_h" value="${this.config.info.BreakoutClonePlayer.bullet.h}"><BR>

                    ????????????<input type="number" id="bullet_speed" value="${this.config.info.BreakoutClonePlayer.bullet.speed}"><BR>

                    ????????????<input type="number" id="life" value="${this.config.info.BreakoutClone.life}"><BR>
                    <hr>

                    

                    ???????????????<input id="player_color" type="color" value=${this.config.info.BreakoutClonePlayer.img_list.self.color}><BR>

                    ???????????????<input type="text" id="player_src" value="${this.config.info.BreakoutClonePlayer.img_list.self.src}"><BR>


                    ???????????????<input type="number" id="player_h" value="${this.config.info.BreakoutClonePlayer.h}"><BR>

                    ???????????????<input type="number" id="player_w" value="${this.config.info.BreakoutClonePlayer.w}"><BR>

                    ???????????????<input type="number" id="speed" value="${this.config.info.BreakoutClonePlayer.speed}"><BR>

          

                    <HR>
                    <input type="button" data-event="${name}" value="??????">
                    ${this.Temp("Close")}
                `;

            break;

            case "BreakoutCloneWallEdit":

                html = `
                    ???????????????<input type="number" id="grid"><hr>
                    <input type="button" data-event="wall_set" value="${this.config.msg.wall_set[0]}">
                    <input type="button" data-event="wall_clear" value="??????????????????">
                    <hr>
                    ???????????????<input id="wall_color" type="color" value=${this.config.info.background.img_list.wall.color}><BR>
                    <br>(shift???????????????????????????????????????????????????<BR>???????????????????????????????????????)
                    <HR>
                    <input type="button" data-event="${name}" value="??????">
                    ${this.Temp("Close")}
                
                `;

            break;


            case "BreakoutCloneContinue":


                html = `
                    ???????????????${Ex.BreakoutCloneClass.flag.life}
                    <HR>
                    <input type="button" data-event="GameRestart" value="????????????">
                    <input type="button" data-event="BreakoutCloneContinue" value="${Ex.config.msg.game_pause[1]}">
                `;

            break;  

            case "BreakoutCloneOver":

                html = `
                    ???????????????${Ex.BreakoutCloneClass.flag.life}
                    <HR>
                    <input type="button" data-event="GameRestart" value="????????????">
                `;

            break;

            case "BreakoutClonePass":

                html = `
                    
                    <div id="memo">
                        <input type="button" value="????????????">
                     
                            <hr>
                                <textarea>${Ex.canvas.background.memo}</textarea>
                            <hr>
                      
                        
                        <input type="button" data-event="ShowImg" value="????????????">
                        <input type="button" data-event="GameRestart" value="????????????">
                    </div>
                `;


            break;









        }


        return html;

    }
}