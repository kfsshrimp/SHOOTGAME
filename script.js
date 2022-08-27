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


                            if(hit_obj.type!=="bullet")
                            {
                                Ex.canvas[hit_obj.type+'_bk'] = Ex.canvas[hit_obj.type+'_bk']||{};
                                Ex.canvas[hit_obj.type+'_bk'][hit_obj.id] = Ex.canvas[hit_obj.type][hit_obj.id];

                                delete Ex.canvas[hit_obj.type][hit_obj.id];
                            }
                            else
                            {
                                delete Ex.canvas[hit_obj.type][hit_obj.id];
                            }

                        }
                        else if(hit_obj.hp===obj.hp)
                        {
                            delete Ex.canvas.bullet[i];

                            if(hit_obj.type!=="bullet")
                            {
                                Ex.canvas[hit_obj.type+'_bk'] = Ex.canvas[hit_obj.type+'_bk']||{};
                                Ex.canvas[hit_obj.type+'_bk'][hit_obj.id] = Ex.canvas[hit_obj.type][hit_obj.id];

                                delete Ex.canvas[hit_obj.type][hit_obj.id];
                            }
                            else
                            {
                                delete Ex.canvas[hit_obj.type][hit_obj.id];
                            }
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
                    let obj = Ex.canvas.player[name];
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
            EnemyControl:()=>{

                for(let name in Ex.canvas.enemy)
                {
                    let obj = Ex.canvas.enemy[name];
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
        
                        if(Ex.func.EnemyCollision(obj)!==false)
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

                    var x = 0,y = Math.floor(Ex.canvas.c.height/2);
        
                    for(let p_name in Ex.canvas.player)
                    {
                        x = Ex.canvas.player[p_name].x;
                        y = Ex.canvas.player[p_name].y;
                    }
                    
                    Ex.func.EnemyShoot(Ex.canvas.enemy[name],x,y);


                }
            },
            EnemyAI:()=>{
                

                for(let name in Ex.canvas.enemy)
                {
                    let obj = Ex.canvas.enemy[name];
                    let control = obj.control;

                    obj.move_last_time = obj.move_last_time||new Date().getTime();

                    if(new Date().getTime() - obj.move_last_time < 500)
                    {
                        return;
                    }

                    obj.move_last_time = new Date().getTime();

                    var ary = [];
                    for(var key in control){
                        Ex.flag.key[ control[key] ] = false;
                        ary.push(key);
                    }
                    /*
                    Ex.flag.key[ "AI_UP" ] = false;
                    Ex.flag.key[ "AI_DOWN" ] = false;
                    Ex.flag.key[ "AI_RIGHT" ] = false;
                    Ex.flag.key[ "AI_LEFT" ] = false;
                    var ary = ["up","down","right","left"];
                    */

                    if(obj.x>Math.floor(Ex.canvas.c.width*0.8)) 
                        ary.forEach( (v,k)=>{if(v==="right") ary.splice(k,1)});

                    if(obj.x<Math.floor(Ex.canvas.c.width*0.2)) 
                        ary.forEach( (v,k)=>{if(v==="left") ary.splice(k,1)});

                    if(obj.y>Math.floor(Ex.canvas.c.height*0.8)) 
                        ary.forEach( (v,k)=>{if(v==="down") ary.splice(k,1)});

                    if(obj.y<Math.floor(Ex.canvas.c.height*0.2)) 
                        ary.forEach( (v,k)=>{if(v==="up") ary.splice(k,1)});


                    var move = Ex.func.Rand(ary);
                    
                    obj.AI[move]();

                    var move = Ex.func.Rand(ary);
                    
                    obj.AI[move]();

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
            EnemyCollision:(obj)=>{

                var _r = false;
        
                if(
                    (
                        obj._x<=0 || obj._x+obj.w>=Ex.canvas.c.width || 
                        obj._y<=0 || obj._y+obj.h>=Ex.canvas.c.height
                    )
                ) _r = true;
        
        
                Object.values(Ex.canvas.player).forEach(hit_obj=>{
        
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
                        x:obj.x,
                        y:obj.y,
                        x2:x + x_r*plus_minus,
                        y2:y + y_r*plus_minus,
                        w:obj.bullet.w,
                        h:obj.bullet.h,
                        hp:obj.bullet.hp,
                        speed:obj.bullet.speed
                    }
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
                        x:obj.x,
                        y:obj.y,
                        x2:x + x_r*plus_minus,
                        y2:y + y_r*plus_minus,
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
                    for(var i=1;i<=array;i++ ) _array.push(i);
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


                if(Ex.flag.game_start)
                {
                    Ex.func.KeyEvent();
                    //Ex.func.EnemyControl();
                    //Ex.func.EnemyAI();

                    Ex.func.BulletShoot();
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


                Ex.Ref();


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




