(()=>{
    Ex = {
        config:{
            map:{
                w:20,
                h:20
            }
        },
        anima_timer:{},
        flag:{
            key:{
                speed:1
            },
            ControlDirSet:null
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
                setTimeout(()=>{
                    var js = document.createElement("script");
                    js.src = `${url_ary[i]}?s=${new Date().getTime()}`;
                    document.head.appendChild(js);
                },i*200);
            }
        },
        init:()=>{

            Ex.js(
                [
                    'https://kfs-plurk-default-rtdb.firebaseio.com/',
                    "CanvasClass.js",
                    "EditClass.js"
                ]
            );

            Ex.css(
                ["style.css"]
            );
            
        },
        func:{
            
            canvas:()=>{

                if(Ex.canvas.c!==undefined) return;

                Ex.canvas = new CanvasClass({
                    
                    background:{
                        url:'https://truth.bahamut.com.tw/s01/201401/86d7f4e508d07fc7a38a99688213e327.JPG',
                        
                    },
                    config:{

                    },
                    c_config:{
                        
                    },
                    c2d_config:{
                        
                    },
                    map:{

                    },
                    point:{
                        /*
                        bullet:{
                            x:200,
                            y:500,
                            w:10,
                            h:10,
                            color:"#f50",
                            control:{
                                speed:3,
                                dir:{
                                    x:0,
                                    y:-1
                                }
                            }
                        }*/

                    },
                    unit:{
                        /*
                        img:{
                            type:"unit",
                            id:"img",
                            src:'https://avatars.plurk.com/14556765-big9788529.jpg',
                            x:200,
                            y:200,
                            hp:100,
                            atk:5,
                            control:{
                                up:'Keyw'.toString().toUpperCase(),
                                down:'Keys'.toString().toUpperCase(),
                                right:'Keyd'.toString().toUpperCase(),
                                left:'KeyA'.toString().toUpperCase(),
                                shoot:'KeyZ'.toString().toUpperCase(),
                                speed:3
                            }
                        },
                        player:{
                            type:"unit",
                            id:"player",
                            x:100,
                            y:200,
                            w:20,
                            h:20,
                            hp:100,
                            atk:1000,
                            color:"#f00",
                            control:{
                                up:'ArrowUp'.toString().toUpperCase(),
                                down:'ArrowDown'.toString().toUpperCase(),
                                right:'ArrowRight'.toString().toUpperCase(),
                                left:'ArrowLeft'.toString().toUpperCase(),
                                shoot:'Numpad0'.toString().toUpperCase(),
                                speed:5,
                                
                            }
                        },
                        enemy:{
                            id:"enemy",
                            x:300,
                            y:300,
                            w:20,
                            h:20,
                            color:"#0f0",
                            control:{
                                up:'Numpad8'.toString().toUpperCase(),
                                down:'Numpad2'.toString().toUpperCase(),
                                right:'Numpad6'.toString().toUpperCase(),
                                left:'Numpad4'.toString().toUpperCase(),
                                speed:3
                                
                            }
                        }*/
                        
                    }
                    
                });


                Ex.canvas.c.addEventListener("mousedown",(e)=>{

                    var idx = Object.keys(Ex.canvas.map).length;
                    

                    Ex.canvas.map["map"+idx] = 
                    {
                        type:"map",
                        x:e.x - e.x%Ex.config.map.w,
                        y:e.y - e.y%Ex.config.map.h,
                        w:Ex.config.map.w,
                        h:Ex.config.map.h,
                        hp:999,
                        color:"#000"
                    };
                });

            },
            KeyDown:(e)=>{

                Ex.flag.key[e.code.toString().toUpperCase()] = true;

            },
            KeyUp:(e)=>{

                Ex.flag.key[e.code.toString().toUpperCase()] = false;

                for(var name in Ex.canvas.unit)
                {
                    var obj = Ex.canvas.unit[name];
                    var control = obj.control;

                    if(control.shoot===e.code.toString().toUpperCase()) Ex.func.Shoot(obj);
                }

            },
            KeyEvent:()=>{

                Ex.func.UserControl();
                
                
            },
            ClickEvent:(e)=>{

                if(e.target.dataset.event!==undefined)
                {
                    switch (e.target.dataset.event){


                    }
                }
                
            },
            Shoot:(obj)=>{
                
                var x = obj.x + obj.w * obj.control.dir.x;
                var y = obj.y + obj.h * obj.control.dir.y;

                /*
                if(Ex.flag.shoot[ obj.id ]!==undefined)
                {
                    if(new Date().getTime() - Ex.flag.shoot[ obj.id ]<=obj.control.shoot_speed)
                    {
                        return;
                    }
                }
                Ex.flag.shoot[ obj.id ] = new Date().getTime();
                */


                Ex.canvas.point[ new Date().getTime() ] = {
                    unit:obj.id,
                    type:"point",
                    x:x,
                    y:y,
                    w:20,
                    h:20,
                    hp:obj.atk||1,
                    control:{
                        speed:5,
                        dir:{
                            x:obj.control.dir.x,
                            y:obj.control.dir.y
                        }
                    }
                }


            },
            AutoControl:()=>{

                for(let name in Ex.canvas.point)
                {
                    let obj = Ex.canvas.point[name];
                    let control = obj.control;

                    obj._x = obj._x||obj.x;
                    obj._y = obj._y||obj.y;

                    control.speed = control.speed||Ex.flag.key.speed;
                    control._speed = control._speed||control.speed;


                    obj._x+=parseFloat(control.speed)*control.dir.x;
                    obj._y+=parseFloat(control.speed)*control.dir.y;

                    var hit_obj = Ex.func.CollisionCheck(obj);

                    if(hit_obj)
                    {
                        var hit_obj_key;

                        Object.keys(Ex.canvas.unit).concat(Object.keys(Ex.canvas.map)).concat(Object.keys(Ex.canvas.point)).forEach(k=>{

                            let o = Ex.canvas.unit[k]||Ex.canvas.map[k]||Ex.canvas.point[k];

                            if(o===hit_obj)
                            {
                                hit_obj_key = k;
                            }
                        });

                        hit_obj.hp-=obj.hp;

                        if(hit_obj.hp<=0)
                        {
                            delete Ex.canvas[hit_obj.type][hit_obj_key];
                        }
                        else
                        {
                            delete Ex.canvas.point[name];
                        }

                        

                        obj._x = obj.x;
                        obj._y = obj.y;
                    }
                    else
                    {
                        obj.x = parseInt(obj._x);
                        obj.y = parseInt(obj._y);

                        control.speed = control._speed;
                    }


                    if(
                        obj._x+obj.w<=0 || obj._x>=Ex.canvas.c.width || 
                        obj._y+obj.h<=0 || obj._y>=Ex.canvas.c.height
                    )
                    {
                        delete Ex.canvas.point[name];
                    }


                }

            },
            UserControl:()=>{

                for(var name in Ex.canvas.unit)
                {
                    var obj = Ex.canvas.unit[name];
                    var control = obj.control;
                    
                    obj._x = obj._x||obj.x;
                    obj._y = obj._y||obj.y;

                    control.speed = control.speed||Ex.flag.key.speed;
                    control._speed = control._speed||control.speed;

                    control.dir = control.dir||{};

                    control.dir.x = (control.dir.x===undefined)?1:control.dir.x;
                    control.dir.y = (control.dir.y===undefined)?0:control.dir.y;


                    if(Ex.flag.key[control.left])obj._x-=parseFloat(control.speed);
                    if(Ex.flag.key[control.right])obj._x+=parseFloat(control.speed);
                    if(Ex.flag.key[control.up])obj._y-=parseFloat(control.speed);
                    if(Ex.flag.key[control.down])obj._y+=parseFloat(control.speed);

                    if(Ex.flag.key[control.left] || 
                    Ex.flag.key[control.right] ||
                    Ex.flag.key[control.up] || 
                    Ex.flag.key[control.down])
                    {
                        if(Ex.func.CollisionCheck(obj))
                        {
                            obj._x = obj.x;
                            obj._y = obj.y;
                            
                            control.speed-=1;
                        }
                        else
                        {
                            obj.x = parseInt(obj._x);
                            obj.y = parseInt(obj._y);

                            Ex.func.DirCheck(obj);
                            
                            control.speed = control._speed;
                        }
                    }
                    

                    //if(Ex.flag.key[control.shoot]) Ex.func.Shoot(obj);

                }

            },
            DirCheck:(obj)=>{

                var control = obj.control;

                control.dir = control.dir||{};

                control.dir.x = control.dir.x||1;
                control.dir.y = control.dir.y||0;


                if(Ex.flag.key[control.left]) control.dir.x = -1;
                if(Ex.flag.key[control.right]) control.dir.x = 1;
                if(Ex.flag.key[control.up]) control.dir.y = -1;
                if(Ex.flag.key[control.down]) control.dir.y = 1;


                if((Ex.flag.key[control.left] || Ex.flag.key[control.right]) && 
                    (!Ex.flag.key[control.down] && !Ex.flag.key[control.up]))
                {
                    control.dir.y = 0;
                }

                if((Ex.flag.key[control.down] || Ex.flag.key[control.up]) && 
                    (!Ex.flag.key[control.left] && !Ex.flag.key[control.right]))
                {
                    control.dir.x = 0;
                }



            },
            CollisionCheck:(obj)=>{

                var _return = false;

                if(
                    (
                        obj._x<=0 || obj._x+obj.w>=Ex.canvas.c.width || 
                        obj._y<=0 || obj._y+obj.h>=Ex.canvas.c.height
                    ) && 
                    !Object.values(Ex.canvas.point).includes(obj)

                ) _return = true;

                
                Object.keys(Ex.canvas.unit).concat(Object.keys(Ex.canvas.map)).concat(Object.keys(Ex.canvas.point)).forEach(k=>{

                    let o = Ex.canvas.unit[k]||Ex.canvas.map[k]||Ex.canvas.point[k];

                    if(o===obj) return;
                    if(o.unit!==undefined && obj.unit!==undefined && o.unit===obj.unit) return;

                    if(
                        obj._x+obj.w>=o.x && 
                        obj._x<=o.x+o.w && 
                        obj._y+obj.h>=o.y && 
                        obj._y<=o.y+o.h
                    )
                    {
                        _return = o;
                    }

                });

                return _return;
            }
        }
    };


    window.onload = ()=>{

        Ex.init();
        
        Ex.anima_timer = ()=>{
            try{

                Ex.func.KeyEvent();

                Ex.func.AutoControl()

                requestAnimationFrame(Ex.anima_timer);

            }catch(e){

                console.log(e);
            }
        }
        
        Ex.anima_timer();
        

        var _t = setInterval(()=>{
            
            if( typeof(EditClass)!=="undefined" )
            {
                Ex.EditMode = new EditClass();
                //Ex.func.canvas();
                clearInterval(_t);
            }
        },1);

  
        

        window.addEventListener("keydown",Ex.func.KeyDown);
        window.addEventListener("keyup",Ex.func.KeyUp);
        window.addEventListener("click",Ex.func.ClickEvent)


    }

})();



//https://yt3.ggpht.com/im_UdJB08y9LAIcLGQLYl4NbAiPx_Er7X2flr_VdB0xoavcIbD343Xmjdf79GZQy3xXNiNY1Dw=s48-c-k-c0x00ffffff-no-rj




/*
var x,y,_x,_y,_t,p,s = 2;
window.onload = ()=>{
    

    p = document.querySelector("div");

    _x = true;
    _y = true;

    requestAnimationFrame(F);

    _t = setInterval(()=>{
        return;
        x = parseInt(p.style.left);
        y = parseInt(p.style.top);


        (x>=window.innerWidth-10)? _x = false:"";
        (y>=window.innerHeight-10)? _y = false:"";

        (x<=0)? _x = true:"";
        (y<=0)? _y = true:"";


        (_x)?p.style.left = x+1:p.style.left = x-1;
        (_y)?p.style.top = y+1:p.style.top = y-1;
        


    },2);


}


F = ()=>{
    x = parseInt(p.style.left);
    y = parseInt(p.style.top);


    (x>=window.innerWidth-10)? _x = false:"";
    (y>=window.innerHeight-10)? _y = false:"";

    (x<=0)? _x = true:"";
    (y<=0)? _y = true:"";


    (_x)?p.style.left = x+s:p.style.left = x-s;
    (_y)?p.style.top = y+s:p.style.top = y-s;

    requestAnimationFrame(F);
}
*/