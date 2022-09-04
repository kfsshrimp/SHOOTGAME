(()=>{
    Ex = {
        id:"SHOOTGAME",
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
                "AIClass.js",
                "BreakoutCloneClass.js"
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

                Ex.func.UnitControl('player');
                
            },
            BulletTrack:(obj)=>{

                obj._track_sec = obj._track_sec||0;

                if(obj._track_sec/60>obj.track_sec) return;

                obj._track_sec++;


                obj.ox = obj._x;
                obj.oy = obj._y;

                if(obj.unit.type==="player")
                {
                    obj.x2 = Ex.flag.mousemove.offsetX||Ex.canvas.c.width;
                    obj.y2 = Ex.flag.mousemove.offsetY||Math.floor(Ex.canvas.c.height/2);
                }

                if(obj.unit.type==="enemy")
                {
                    obj.x2 = 0;
                    obj.y2 = Math.floor(Ex.canvas.c.height/2);
        
                    for(var name in Ex.canvas.player)
                    {
                        obj.x2 = Ex.canvas.player[name].x;
                        obj.y2 = Ex.canvas.player[name].y;
                    }
                }


            },
            BulletReflex:(obj,wall)=>{

                if(obj.reflex_count<0)
                {
                    delete Ex.canvas.bullet[obj.id];
                    return;
                }

                var max_w = Ex.canvas.c.width,
                    min_w = 0,
                    max_h = Ex.canvas.c.height,
                    min_h = 0;



                if(wall!==undefined)
                {
                    var collision_x = (obj.x - wall.x - Math.floor(wall.w/2));
                    var collision_y = (obj.y - wall.y - Math.floor(wall.h/2));


           
                    if(collision_x>0) obj.ox = obj.x2-obj.x_p;
                    if(collision_x<=0) obj.ox = obj.x2+obj.x_p;

                    if(collision_y>0) obj.oy = obj.y2-obj.y_p;
                    if(collision_y<=0) obj.oy = obj.y2+obj.y_p;
                    
                    obj.reflex_count-=1;

                    /*
                    if(obj.x_d===-1) obj.ox = obj.x2-obj.x_p;
                    if(obj.x_d===1) obj.ox = obj.x2+obj.x_p;

                    if(obj.y_d===-1) obj.oy = obj.y2-obj.y_p;
                    if(obj.y_d===1) obj.oy = obj.y2+obj.y_p;
                    */

                    if(Ex.BreakoutCloneClass && wall.id==="BreakoutClonePlayer")
                    {
                        if( obj.x - wall.x >(wall.w/2) )
                        {
                            obj.ox = obj.x2 - 1 * (obj.x - wall.x)/wall.w*1;
                        }
                        else if(obj.x - wall.x<(wall.w/2))
                        {
                            obj.ox = obj.x2 + 1 * (wall.w - (obj.x - wall.x))/wall.w*1;
                        }
                    }

                    return;
                }


                if(obj._x+obj.w>=max_w){
                    obj.ox = obj.x2+obj.x_p;
                    if(obj.y_d===1)
                    {
                        obj.oy = obj.y2-obj.y_p; 
                    }
                    else if(obj.y_d===-1)
                    {
                        obj.oy = obj.y2+obj.y_p;
                    }
                }
                if(obj._y+obj.h>=max_h)
                {
                    obj.oy = obj.y2+obj.y_p;
                    if(obj.x_d===1)
                    {
                        obj.ox = obj.x2-obj.x_p; 
                    }
                    else if(obj.x_d===-1)
                    {
                        obj.ox = obj.x2+obj.x_p;
                    }
                }

                if(obj._x<=min_w)
                {
                    obj.ox = obj.x2-obj.x_p;
                    if(obj.y_d===1)
                    {
                        obj.oy = obj.y2-obj.y_p; 
                    }
                    else if(obj.y_d===-1)
                    {
                        obj.oy = obj.y2+obj.y_p;
                    }
                }
                if(obj._y<=min_h)
                {
                    obj.oy = obj.y2-obj.y_p;
                    if(obj.x_d===1)
                    {
                        obj.ox = obj.x2-obj.x_p; 
                    }
                    else if(obj.x_d===-1)
                    {
                        obj.ox = obj.x2+obj.x_p;
                    }
                }



                if(obj._x+obj.w>=max_w || 
                obj._y+obj.h>=max_h || 
                obj._x<=min_w ||
                obj._y<=min_h) obj.reflex_count-=1;
                


            },
            BulletMove:()=>{


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


                    if(Ex.BreakoutCloneClass) obj.reflex_count = 999;

                    
                    if( hit_obj!==false )
                    {
                        if(obj.mode==="reflex")
                        {
                            Ex.func.BulletReflex(obj,hit_obj);
                            //if(hit_obj.type==="wall") continue;
                        }


                        if(hit_obj.hp>obj.hp)
                        {
                            hit_obj.hp-=obj.hp;
                            delete Ex.canvas.bullet[i];
                        }
                        else if(hit_obj.hp<obj.hp)
                        {
                            obj.hp-=hit_obj.hp;

                            if(hit_obj.type!=="bullet")
                            {
                                Ex.canvas[hit_obj.type+'_bk'] = Ex.canvas[hit_obj.type+'_bk']||{};
                                Ex.canvas[hit_obj.type+'_bk'][hit_obj.id] = Ex.canvas[hit_obj.type][hit_obj.id];

                                if(Ex.BreakoutCloneClass)
                                    Ex.canvas[hit_obj.type][hit_obj.id].mode = "broke";
                                else
                                    delete Ex.canvas[hit_obj.type][hit_obj.id];
                            }
                            else
                            {
                                if(Ex.BreakoutCloneClass)
                                    Ex.canvas[hit_obj.type][hit_obj.id].mode = "broke";
                                else
                                    delete Ex.canvas[hit_obj.type][hit_obj.id];
                            }

                        }
                        else if(hit_obj.hp===obj.hp)
                        {
                            console.log("===")
                            delete Ex.canvas.bullet[i];

                            if(hit_obj.type!=="bullet")
                            {
                                Ex.canvas[hit_obj.type+'_bk'] = Ex.canvas[hit_obj.type+'_bk']||{};
                                Ex.canvas[hit_obj.type+'_bk'][hit_obj.id] = Ex.canvas[hit_obj.type][hit_obj.id];

                                if(Ex.BreakoutCloneClass)
                                    Ex.canvas[hit_obj.type][hit_obj.id].mode = "broke";
                                else
                                    delete Ex.canvas[hit_obj.type][hit_obj.id];
                            }
                            else
                            {
                                if(Ex.BreakoutCloneClass)
                                    Ex.canvas[hit_obj.type][hit_obj.id].mode = "broke";
                                else
                                    delete Ex.canvas[hit_obj.type][hit_obj.id];
                            }
                        }

                    }
                    else
                    {
                        obj.x = parseInt(obj._x);
                        obj.y = parseInt(obj._y);
    
                        obj.speed = obj._speed;


                        if(obj.mode==="reflex")
                        {
                            Ex.func.BulletReflex(obj);
                        }

                        if(obj.mode==="track")
                        {
                            Ex.func.BulletTrack(obj);
                        }
                    }


                    if(Ex.BreakoutCloneClass)
                    {   
                        if(obj._y+obj.h>=Ex.canvas.c.height)
                        {
                            delete Ex.canvas.bullet[i];
                            Ex.BreakoutCloneClass.flag.life-=1;
                        }
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
            UnitControl:(type)=>{


                for(var name in Ex.canvas[type])
                {
                    let obj = Ex.canvas[type][name];
                    let control = obj.control;

                    
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

                        if(Ex.func.UnitCollision(obj)!==false)
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

                    if(Ex.BreakoutCloneClass===undefined)
                        Ex.func.UnitShoot(obj);
                }

            },
            CollisionImg:(obj)=>{

                if(obj.img_list.collision===undefined) return;
                
                obj.img_list._self = obj.img_list._self||obj.img_list.self;

                setTimeout(()=>{
                    obj.img_list.self = obj.img_list._self;
                },500);

                obj.img_list.self = obj.img_list.collision;


            },
            BulletCollision:(obj)=>{

                var _r = false;

                
                Object.values(Ex.canvas.enemy).concat(Object.values(Ex.canvas.player)).forEach(hit_obj=>{

                    
                    if(hit_obj.id!=="BreakoutClonePlayer" && hit_obj.id===obj.unit.id) return;

                    if(
                        obj._x       <= hit_obj.x+hit_obj.w && 
                        obj._y       <= hit_obj.y+hit_obj.h && 
                        obj._x+obj.w >= hit_obj.x && 
                        obj._y+obj.h >= hit_obj.y 
                    )
                    {
                        _r = hit_obj;
                        Ex.func.CollisionImg(hit_obj);
                    }

                });

                Object.values(Ex.canvas.wall).forEach(hit_obj=>{
                    
                    if(
                        obj._x       <= hit_obj.x+hit_obj.w && 
                        obj._y       <= hit_obj.y+hit_obj.h && 
                        obj._x+obj.w >= hit_obj.x && 
                        obj._y+obj.h >= hit_obj.y 
                    )
                    {
                        if(obj.mode==="through")
                        {
                            hit_obj.mode = "broke";
                            return;
                        }
                        if(hit_obj.mode==="broke") return;

                        _r = hit_obj;
                    }
                    

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
            UnitCollision:(obj)=>{

                var _r = false;

                if(
                    (
                        obj._x<=0 || obj._x+obj.w>=Ex.canvas.c.width || 
                        obj._y<=0 || obj._y+obj.h>=Ex.canvas.c.height
                    )
                ) _r = true;

                var all_obj = Object.values(Ex.canvas.player).concat(
                                Object.values(Ex.canvas.enemy)
                            ).concat( 
                                Object.values(Ex.canvas.wall)
                            );


                all_obj.forEach(hit_obj=>{

                    if(hit_obj.id===obj.id) return;
                    if(hit_obj.mode==="broke") return;


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
            UnitShoot:(obj)=>{


                obj._speed_shoot = obj._speed_shoot||0;

                
                obj._speed_shoot++;

                if(obj._speed_shoot < 60/obj.speed_shoot) return;

                obj._speed_shoot = 0;
                


                var x2,y2;


                if(obj.type==="player")
                {
                    x2 = Ex.canvas.c.width;
                    y2 = Math.floor(Ex.canvas.c.height/2);
        
                    /*
                    for(var name in Ex.canvas.enemy)
                    {
                        x2 = Ex.canvas.enemy[name].x;
                        y2 = Ex.canvas.enemy[name].y;
                    }
                    */

                    x2 = Ex.flag.mousemove.offsetX;
                    y2 = Ex.flag.mousemove.offsetY;
                }
                
                if(obj.type==="enemy")
                {
                    x2 = 0;
                    y2 = Math.floor(Ex.canvas.c.height/2);
        
                    for(var name in Ex.canvas.player)
                    {
                        x2 = Ex.canvas.player[name].x;
                        y2 = Ex.canvas.player[name].y;
                    }
                }
            
                

                

                //obj.shoot_last_time = new Date().getTime();

                var id = `${obj.id}_${new Date().getTime()}`;


                for(let i=0;i<obj.bullet.count;i++)
                {
                    let x_r = Ex.func.Rand( Math.floor(obj.bullet.w*obj.bullet.rand) );
                    let y_r = Ex.func.Rand( Math.floor(obj.bullet.h*obj.bullet.rand) ) ;

                    let plus_minus = Ex.func.Rand( [0,1,-1] );


                    Ex.canvas.bullet[ id + i ] = {
                        id:id + i,
                        unit:{
                            id:obj.id,
                            type:obj.type
                        },
                        type:"bullet",
                        mode:obj.bullet.mode,
                        reflex_count:obj.bullet.reflex_count,
                        track_sec:obj.bullet.track_sec,
                        x:obj.x,
                        y:obj.y,
                        x2:x2 + x_r*plus_minus,
                        y2:y2 + y_r*plus_minus,
                        w:obj.bullet.w,
                        h:obj.bullet.h,
                        hp:obj.bullet.hp,
                        speed:obj.bullet.speed
                    }
                }

            },
            Rand:(array)=>{

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

                if(document.querySelector("#TimerSec"))
                document.querySelector("#TimerSec").value = new Date().getSeconds();

                if(Ex.flag.game_start)
                {
                    Ex.func.KeyEvent();

                    Ex.func.BulletMove();

                    Ex.BreakoutCloneClass.flag.MoveBall = false;
                }


                if(Ex.BreakoutCloneClass && !Ex.flag.game_start)
                {
                    Ex.func.KeyEvent();
                    Ex.BreakoutCloneClass.MoveBall();
                }




                Ex.anima_timer = requestAnimationFrame(Ex.Ref);


                Ex.EditClass.GameCheck();

            }catch(e){

                console.log(e);
            }
        }

        var _class = [
            "CanvasClass",
            "EditClass",
            "ConfigClass",
            "AIClass",
            "BreakoutCloneClass",
            "firebase"
        ];

        var _t = setInterval(()=>{

            try{

                
                _class.forEach(o=>eval(o));

                
                
                Ex.config = new ConfigClass();

                


                Ex.DB = firebase;
                Ex.DB.initializeApp({databaseURL:Ex.config.DB.url});
                Ex.DB = Ex.DB.database();
             
                
                

                Ex.EditClass = new EditClass(Ex);
                Ex.EditClass.config = Ex.config;

                

                Ex.Ref();


                clearInterval(_t);

                
            }catch(e){

                //console.log(e);
                console.log('Load Class');
            }      

        },100);


        

        window.addEventListener("mousemove",Ex.func.MouseMove);
        window.addEventListener("keydown",Ex.func.KeyDown);
        window.addEventListener("keyup",Ex.func.KeyUp);
        window.addEventListener("click",Ex.func.ClickEvent)

        //window.addEventListener("blur",()=>{Ex.EditClass.GamePause('pause');});
    }













})();




