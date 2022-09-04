class BreakoutCloneClass {

    constructor(Ex,config,_canvas,_player){
        this.Ex = Ex;
        this.player = _player;

        this.config = config;
        this.flag = {
            life:_canvas.background.BreakoutClone.life,
            _life:_canvas.background.BreakoutClone.life,
            MoveBall:true
        };

        Ex.canvas = new CanvasClass(Ex,_canvas);


        this.SetUnit();

        
    }

    Update = (form)=>{
        var Ex = this.Ex;

        var background_cfg = Ex.canvas.background;
        var player_cfg = Ex.canvas.player.BreakoutClonePlayer;
        var q = "querySelector";
        


        if(background_cfg.img_list.wall.grid !== parseInt(form[q]("#grid").value))
        {
            if( confirm("更改磚塊大小會消除目前所有磚塊確定要繼續嗎?")===false )
            {
                _return = false;
            }
            else
            {
                Ex.canvas.wall = {};
            }
            
        }

        if(
            background_cfg.img_list.wall.src!==(form[q]("#wall_src").value) || 
            player_cfg.img_list.bullet.src!==(form[q]("#bullet_src").value) || 
            player_cfg.img_list.self.src!==(form[q]("#player_src").value)
        )
        {

            background_cfg.img_list.wall.src = (form[q]("#wall_src").value);
            player_cfg.img_list.bullet.src = (form[q]("#bullet_src").value);
            player_cfg.img_list.self.src = (form[q]("#player_src").value);


            Ex.EditClass.ImgLoadLoop(background_cfg.img_list);
            Ex.EditClass.ImgLoadLoop(player_cfg.img_list);
        }

        if(
            player_cfg.bullet.h!==parseInt(form[q]("#bullet_h").value) || 
            player_cfg.bullet.speed!==parseInt(form[q]("#bullet_speed").value)
        )
        {
            Ex.canvas.bullet = {};

            player_cfg.bullet.h = parseInt(form[q]("#bullet_h").value);
            player_cfg.bullet.w = parseInt(form[q]("#bullet_h").value);
            player_cfg.bullet.speed = parseInt(form[q]("#bullet_speed").value);

            Ex.BreakoutCloneClass.SetBullet();
        }

        if(player_cfg.w !== parseInt(form[q]("#player_w").value))
        {
            player_cfg.w = parseInt(form[q]("#player_w").value);

            this.player = player_cfg;
            this.SetUnit();
        }

        Ex.BreakoutCloneClass.flag.life = parseInt(form[q]("#life").value);
        
        player_cfg.speed = parseInt(form[q]("#speed").value);
        player_cfg.h = parseInt(form[q]("#player_h").value);

        background_cfg.memo = (form[q]("#memo").value);

        background_cfg.img_list.wall.color = (form[q]("#wall_color").value) + 'FF';
        player_cfg.img_list.bullet.color = (form[q]("#bullet_color").value) + 'FF';
        player_cfg.img_list.self.color = (form[q]("#player_color").value) + 'FF';



    }




    SetUnit = ()=>{
        var Ex = this.Ex;
        var _player = this.player;


        if(Ex.canvas.anima_timer===undefined)
        {
            setTimeout(()=>{
                this.SetUnit(_player);
            },0);
            return;
        }

        var unit = JSON.parse(JSON.stringify(Ex.config.info.BreakoutClonePlayer));


        if(Ex.canvas[unit.type][unit.id]===undefined)
        {
            Ex.EditClass.CreateUnit(unit);

            for(var key in Ex.canvas[unit.type][unit.id]) unit[key] = Ex.canvas[unit.type][unit.id][key];

        }

        for(var key in _player) unit[key] = _player[key];

        for(var key in unit.control) unit.control[key] = unit.control[key].toString().toUpperCase();


        

        unit.x = Math.floor(Ex.canvas.c.width * this.config.info.BreakoutClonePlayer.x)-Math.floor(unit.w/2);
        unit.y = Math.floor(Ex.canvas.c.height * this.config.info.BreakoutClonePlayer.y);
        unit._x = unit.x;
        unit._y = unit.y;


        unit.bullet.mode = "reflex";

        this.unit = unit;
        Ex.canvas[unit.type][unit.id] = unit;


        if( Object.keys(Ex.canvas.bullet).length===0 ) this.SetBullet();
    }

    SetBullet = ()=>{
        var Ex = this.Ex;

        var unit = this.unit;
        var obj = this.unit;

        var id = `${unit.id}_${new Date().getTime()}`;


        var x2 = [];
        for(var i=Math.floor(Ex.canvas.c.width*0.3);
        i<=Math.floor(Ex.canvas.c.width*0.7);
        i++)
        {
            x2.push(i);
        }

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
            x2:Ex.func.Rand(x2),
            y2:0,
            w:obj.bullet.w,
            h:obj.bullet.h,
            hp:obj.bullet.hp,
            speed:obj.bullet.speed
        }
    }

    MoveBall = ()=>{
        var Ex = this.Ex;

        if(!this.flag.MoveBall) return;

        for(let id in Ex.canvas.bullet)
        {
            let bullet = Ex.canvas.bullet[id];
            let unit = Ex.canvas[bullet.unit.type][bullet.unit.id];

            bullet.x = unit.x + Math.floor(unit.w/2) - Math.floor(bullet.w/2);
            bullet.y = unit.y - bullet.h - 5;
        }

    }



    GameRestart = (_continue)=>{
        var Ex = this.Ex;

        Ex.flag.game_start = false;
        this.flag.MoveBall = true;


        if(_continue!==true)
        {
            this.flag.life = this.flag._life;
            for(var key in Ex.canvas.wall) Ex.canvas.wall[key].mode = '';
        }
        
        document.querySelector(`[data-event="GameStart"]`).removeAttribute("disabled");

        document.querySelector(`[data-event="GamePause"]`).setAttribute("disabled","disabled");

        Ex.canvas.bullet = {};
        Ex.canvas.other_back = {};

        for(var name in Ex.canvas.player)
        {
            let unit = Ex.canvas.player[name];

            this.SetUnit(unit);
        }

        
        if(document.querySelector("#CreateFormPlayMenu")!==null)
            document.querySelector("#CreateFormPlayMenu").remove();

        if(document.querySelector(".ImgShow")!==null)
            document.querySelector(".ImgShow").remove();
    }


    ShowImg = ()=>{
        var Ex = this.Ex;

        var div = document.createElement("div");
        div.className = `ImgShow`;
        Ex.EditClass.DragendRegister(div);

        div.innerHTML = `<a target="_blank" href="${Ex.canvas.background.img_list.self.src}"><img src="${Ex.canvas.background.img_list.self.src}"></a>`;

        Ex.EditClass.ControlMenu.appendChild(div);

    }

    GameCheck = ()=>{
        var Ex = this.Ex;

        if(this.flag.life<=0)
        {
            console.log("GAME OVER");

            Ex.flag.game_start = false;

            var div = document.createElement("div");
            div.id = `CreateFormPlayMenu`;
            Ex.EditClass.DragendRegister(div);

            div.innerHTML = Ex.EditClass.Temp("BreakoutCloneOver");

            Ex.EditClass.ControlMenu.appendChild(div);
            
            return;
        }


        if( Object.values(Ex.canvas.wall).every(o=>o.mode==="broke") )
        {
            console.log("GAME PASS");

            Ex.flag.game_start = false;

            var div = document.createElement("div");
            div.id = `CreateFormPlayMenu`;
            Ex.EditClass.DragendRegister(div);

            div.innerHTML = Ex.EditClass.Temp("BreakoutClonePass");

            Ex.EditClass.ControlMenu.appendChild(div);

            return;
        }


        if( Object.values(Ex.canvas.bullet).length === 0)
        {
            console.log("GAME PASS");

            Ex.flag.game_start = false;

            var div = document.createElement("div");
            div.id = `CreateFormPlayMenu`;
            Ex.EditClass.DragendRegister(div);

            div.innerHTML = Ex.EditClass.Temp("BreakoutCloneContinue");

            Ex.EditClass.ControlMenu.appendChild(div);
        }



    }


}

