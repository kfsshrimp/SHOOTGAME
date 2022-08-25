(()=>{
    Ex = {
        id:"act_game",
        config:{},
        anima_timer:{},
        flag:{
            key:{
                
            },
            mousemove:{

            },
            Storage:{
                local:{},
                session:{}
            },
            game_start:false
        },
        canvas:{},
        css:(url_ary)=>{

            for(var src of url_ary)
            {
                var link = document.createElement('link');
                link.href = `${src}?s=${new Date().getTime()}`;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                document.head.appendChild(link);
            }

        },
        js:(url_ary)=>{

            for(let i in url_ary)
            {
                var js = document.createElement("script");
                js.src = `${url_ary[i]}?s=${new Date().getTime()}`;
                document.head.appendChild(js);
            }
        },
        init:()=>{

            Ex.js([
                "https://www.gstatic.com/firebasejs/5.5.6/firebase.js",
                "CanvasClass.js",
                "EditClass.js",
                "ConfigClass.js",
                "AIClass.js"
            ]);

            Ex.css(
                ["style.css"]
            );
            
        },
        func:{

            StorageUpd:(set)=>{
                
                if(set)
                {
                    Ex.flag.Storage.local = JSON.parse(localStorage[Ex.id]||`{}`);
                    Ex.flag.Storage.session = JSON.parse(sessionStorage[Ex.id]||`{}`);
                }
                else
                {
                    localStorage[Ex.id] = JSON.stringify(Ex.flag.Storage.local);
                    sessionStorage[Ex.id] = JSON.stringify(Ex.flag.Storage.session);
                }

            },
            
            MouseMove:(e)=>{

                if(e.target===Ex.canvas.c) Ex.flag.mousemove = e;

            },
            KeyDown:(e)=>{

                Ex.flag.key[e.code.toString().toUpperCase()] = true;

            },
            KeyUp:(e)=>{

                Ex.flag.key[e.code.toString().toUpperCase()] = false;

            },
            KeyEvent:()=>{

                if(Ex.flag.game_start)
                    Ex.func.PlayerControl();
                
            },
            BulletShoot:()=>{


                for(let i in Ex.canvas.bullet)
                {
                    let obj = Ex.canvas.bullet[i];


                    obj._x = obj._x||obj.x;
                    obj._y = obj._y||obj.y;

                    obj.ox = obj.ox||obj.x;
                    obj.oy = obj.oy||obj.y;

                    obj._speed = obj._speed||obj.speed;

                    if(obj.ox>obj.x2) obj.x_d = -1;
                    if(obj.ox<obj.x2) obj.x_d = 1;
                    if(obj.ox===obj.x2) obj.x_d = 0;

                    if(obj.oy>obj.y2) obj.y_d = -1;
                    if(obj.oy<obj.y2) obj.y_d = 1;
                    if(obj.oy===obj.y2) obj.y_d = 0;

                    
                    obj.x_l = Math.abs(obj.ox-obj.x2);
                    obj.y_l = Math.abs(obj.oy-obj.y2);

                    obj.x_p = (obj.x_l/obj.y_l>1)?1:(obj.x_l/obj.y_l);
                    obj.y_p = (obj.y_l/obj.x_l>1)?1:(obj.y_l/obj.x_l);


                    obj._x+=parseFloat(obj.speed)*obj.x_d*obj.x_p;
                    obj._y+=parseFloat(obj.speed)*obj.y_d*obj.y_p;


                    var hit_obj = Ex.func.BulletCollision(obj);

                    if( hit_obj!==false )
                    {


                        if(hit_obj.hp>obj.hp)
                        {
                            hit_obj.hp-=obj.hp;
                            delete Ex.canvas.bullet[i];
                        }
                        else if(hit_obj.hp<obj.hp)
                        {
                            obj.hp-=hit_obj.hp;

                            delete Ex.canvas[hit_obj.type][hit_obj.id];
                        }
                        else if(hit_obj.hp===obj.hp)
                        {
                            delete Ex.canvas.bullet[i];
                            delete Ex.canvas[hit_obj.type][hit_obj.id];
                        }

                    }
                    else
                    {
                        obj.x = parseInt(obj._x);
                        obj.y = parseInt(obj._y);
    
                        obj.speed = obj._speed;
                    }


                    if(
                        obj._x+obj.w<=0 || obj._x>=Ex.canvas.c.width || 
                        obj._y+obj.h<=0 || obj._y>=Ex.canvas.c.height
                    )
                    {
                        delete Ex.canvas.bullet[i];
                    }
                    
                }

            },
            PlayerControl:()=>{

                for(var name in Ex.canvas.player)
                {
                    var obj = Ex.canvas.player[name];
                    var control = obj.control;
                    
                    obj._x = obj._x||obj.x;
                    obj._y = obj._y||obj.y;

                    obj._speed = obj._speed||obj.speed;

                    if(Ex.flag.key[control.left])obj._x-=parseFloat(obj.speed);
                    if(Ex.flag.key[control.right])obj._x+=parseFloat(obj.speed);
                    if(Ex.flag.key[control.up])obj._y-=parseFloat(obj.speed);
                    if(Ex.flag.key[control.down])obj._y+=parseFloat(obj.speed);

                    if(Ex.flag.key[control.left] || 
                    Ex.flag.key[control.right] ||
                    Ex.flag.key[control.up] || 
                    Ex.flag.key[control.down])
                    {

                        if(Ex.func.PlayerCollision(obj)!==false)
                        {
                            obj._x = obj.x;
                            obj._y = obj.y;
                            
                            obj.speed-=1;
                        }
                        else
                        {
                            obj.x = parseInt(obj._x);
                            obj.y = parseInt(obj._y);
                            
                            obj.speed = obj._speed;
                        }

                    }


                    
                    Ex.func.PlayerShoot(obj);
                }

            },
            BulletCollision:(obj)=>{

                var _r = false;

                
                Object.values(Ex.canvas.enemy).concat(Object.values(Ex.canvas.player)).forEach(hit_obj=>{

                    if(hit_obj.id===obj.unit.id) return;

                    if(
                        obj._x       <= hit_obj.x+hit_obj.w && 
                        obj._y       <= hit_obj.y+hit_obj.h && 
                        obj._x+obj.w >= hit_obj.x && 
                        obj._y+obj.h >= hit_obj.y 
                    ) 
                    _r = hit_obj;

                });

                Object.values(Ex.canvas.wall).forEach(hit_obj=>{

                    
                    if(
                        obj._x       <= hit_obj.x+hit_obj.w && 
                        obj._y       <= hit_obj.y+hit_obj.h && 
                        obj._x+obj.w >= hit_obj.x && 
                        obj._y+obj.h >= hit_obj.y 
                    ) 
                    _r = hit_obj;

                });

                Object.values(Ex.canvas.bullet).forEach(hit_obj=>{

                    if(obj===hit_obj) return;
                    if(obj.unit.id===hit_obj.unit.id) return;
                    
                    if(
                        obj._x       <= hit_obj.x+hit_obj.w && 
                        obj._y       <= hit_obj.y+hit_obj.h && 
                        obj._x+obj.w >= hit_obj.x && 
                        obj._y+obj.h >= hit_obj.y 
                    ) 
                    _r = hit_obj;

                });


                

                return _r;


            },
            PlayerCollision:(obj)=>{

                var _r = false;

                if(
                    (
                        obj._x<=0 || obj._x+obj.w>=Ex.canvas.c.width || 
                        obj._y<=0 || obj._y+obj.h>=Ex.canvas.c.height
                    )
                ) _r = true;


                Object.values(Ex.canvas.enemy).forEach(hit_obj=>{

                    if(
                        obj._x       <= hit_obj.x+hit_obj.w && 
                        obj._y       <= hit_obj.y+hit_obj.h && 
                        obj._x+obj.w >= hit_obj.x && 
                        obj._y+obj.h >= hit_obj.y 
                    ) 
                    _r = hit_obj;

                });

                Object.values(Ex.canvas.wall).forEach(hit_obj=>{

                    
                    if(
                        obj._x       <= hit_obj.x+hit_obj.w && 
                        obj._y       <= hit_obj.y+hit_obj.h && 
                        obj._x+obj.w >= hit_obj.x && 
                        obj._y+obj.h >= hit_obj.y 
                    ) 
                    _r = hit_obj;

                });

                Object.values(Ex.canvas.bullet).forEach(hit_obj=>{

                    if(hit_obj.unit.id===obj.id) return;
                    
                    if(
                        obj._x       <= hit_obj.x+hit_obj.w && 
                        obj._y       <= hit_obj.y+hit_obj.h && 
                        obj._x+obj.w >= hit_obj.x && 
                        obj._y+obj.h >= hit_obj.y 
                    ) 
                    _r = hit_obj;

                });

                return _r;
            },
            PlayerShoot:(obj)=>{

                var shoot_limit =  1000 * (1-obj.speed_shoot*0.01);

                if(new Date().getTime() - obj.shoot_last_time < shoot_limit )
                {
                    return;
                }

                var x = Ex.flag.mousemove.offsetX||Ex.canvas.c.width;
                var y = Ex.flag.mousemove.offsetY||Math.floor(Ex.canvas.c.height/2);

                obj.shoot_last_time = new Date().getTime();

                var id = `${obj.id}_${new Date().getTime()}`;

                Ex.canvas.bullet[ id ] = {
                    id:id,
                    unit:{
                        id:obj.id,
                        type:obj.type
                    },
                    type:"bullet",
                    x:obj.x,
                    y:obj.y,
                    x2:x,
                    y2:y,
                    w:obj.bullet.w,
                    h:obj.bullet.h,
                    hp:obj.bullet.hp,
                    speed:obj.bullet.speed
                }
            },
            EnemyShoot:(obj,x,y)=>{


                var shoot_limit =  1000 * (1-obj.speed_shoot*0.01);

                if(new Date().getTime() - obj.shoot_last_time < shoot_limit )
                {
                    return;
                }


                obj.shoot_last_time = new Date().getTime();

                var id = `${obj.id}_${new Date().getTime()}`;

                for(var i=0;i<x.length;i++)
                {
                    Ex.canvas.bullet[ id + i ] = {
                        id:id + i,
                        unit:{
                            id:obj.id,
                            type:obj.type
                        },
                        type:"bullet",
                        x:obj.x,
                        y:obj.y,
                        x2:x[i],
                        y2:y[i],
                        w:obj.bullet.w,
                        h:obj.bullet.h,
                        hp:obj.bullet.hp,
                        speed:obj.bullet.speed
                    }
                }


            }
            
        },
        CheckMobi:()=>{
            if(
                /Mobi|Android|iPhone/i.test(navigator.userAgent) ||
                window.screen.width < 500 ||
                ('ontouchstart' in document.documentElement) || 
                window.matchMedia("only screen and (max-width: 760px)").matches ||
                window.matchMedia("(pointer:coarse)").matches
            ){
                return true;
            }

            return false;
        }
    };


    window.onload = ()=>{


        if( Ex.CheckMobi() )
        {
            alert("程式不支援手機版");
            return;
        }


        Ex.func.StorageUpd( true );



        Ex.init();
        
        Ex.Ref = ()=>{
            try{

                Ex.func.KeyEvent();

                Ex.func.BulletShoot();
                

                Ex.anima_timer = requestAnimationFrame(Ex.Ref);

            }catch(e){

                console.log(e);
            }
        }
        
        Ex.Ref();


        var _class = [
            "CanvasClass",
            "EditClass",
            "ConfigClass",
            "AIClass",
            "firebase"
        ];

        var _t = setInterval(()=>{

            try{
                _class.forEach(o=>eval(o));


                Ex.config = new ConfigClass();

                Ex.DB = firebase;
                Ex.DB.initializeApp({databaseURL:Ex.config.DB.url});
                Ex.DB = Ex.DB.database();


                
                Ex.EditClass = new EditClass();
                Ex.EditClass.config = Ex.config;


                

                

                clearInterval(_t);

                

            }catch(e){

                console.log('Load Class');
            }      

        },1);


        

        window.addEventListener("mousemove",Ex.func.MouseMove);
        window.addEventListener("keydown",Ex.func.KeyDown);
        window.addEventListener("keyup",Ex.func.KeyUp);
        window.addEventListener("click",Ex.func.ClickEvent)

        //window.addEventListener("blur",()=>{Ex.EditClass.GamePause('pause');});
    }













})();




