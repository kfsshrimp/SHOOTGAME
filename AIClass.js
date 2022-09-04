class AIClass{

    constructor(Ex,unit){
        this.Ex = Ex;

        this.up = ()=>{ 
            Ex.flag.key[ unit.control.up ] = true;
            Ex.flag.key[ unit.control.down ] = false;
        }
        this.down = ()=>{ 
            Ex.flag.key[ unit.control.down ] = true;
            Ex.flag.key[ unit.control.up ] = false;
        }
        this.right = ()=>{ 
            Ex.flag.key[ unit.control.right ] = true;
            Ex.flag.key[ unit.control.left ] = false;
        }
        this.left = ()=>{ 
            Ex.flag.key[ unit.control.left ] = true;
            Ex.flag.key[ unit.control.right ] = false;
        }

        unit.AI_config = Ex.config.info.AI_config;


        this.unit = unit;
        this.timer = 1;
        this.config = {};


        this.Ref();
    }

    Ref = ()=>{
        var Ex = this.Ex;
        try{

            if(Ex.flag.game_start && this.unit.AI_config.enabled)
            {
                Ex.func.UnitControl(this.unit.type);

                this.AI_Move();
                this.AI_MoveCheck();
            }
            

            this.anima_timer = requestAnimationFrame(this.Ref);

        }catch(e){

            console.log(e);
        }
    }

    AI_MoveCheck = ()=>{
        var Ex = this.Ex;

        var u = this.unit;

        if(u.x+u.w>=Math.floor(Ex.canvas.c.width*Ex.canvas[u.type][u.id].AI_config.w_max) && Ex.flag.key[ u.control.right ]===true)
        {
            Object.values( u.control ).forEach(v=>{
                Ex.flag.key[ v ] = false;
            });
        }

        if(u.x<=Math.floor(Ex.canvas.c.width*Ex.canvas[u.type][u.id].AI_config.w_min) && Ex.flag.key[ u.control.left ]===true)
        {
            Object.values( u.control ).forEach(v=>{
                Ex.flag.key[ v ] = false;
            });
        }

        if(u.y+u.h>=Math.floor(Ex.canvas.c.height*Ex.canvas[u.type][u.id].AI_config.h_max) && Ex.flag.key[ u.control.down ]===true)
        {
            Object.values( u.control ).forEach(v=>{
                Ex.flag.key[ v ] = false;
            });
        }

        if(u.y<=Math.floor(Ex.canvas.c.height*Ex.canvas[u.type][u.id].AI_config.h_min) && Ex.flag.key[ u.control.up ]===true)
        {
            Object.values( u.control ).forEach(v=>{
                Ex.flag.key[ v ] = false;
            });
        }
        

    }


    AI_Move = ()=>{
        var Ex = this.Ex;

        var u = this.unit;

        u.AI_config = u.AI_config||Ex.config.info.AI_config;

        u.AI_config._frequency = u.AI_config._frequency||0;
        
        u.AI_config._frequency++;

        if(u.AI_config._frequency<u.AI_config.frequency*60) return;

        u.AI_config._frequency = 0;


        Object.values( u.control ).forEach(v=>{
            Ex.flag.key[ v ] = false;
        });

        var ary = Object.keys( u.control );
        

        /*
        if(this.enemy.x+this.enemy.w>Math.floor(Ex.canvas.c.width*Ex.canvas.enemy.enemy.AI_config.w_max)) 
            ary.forEach( (v,k)=>{if(v==="right") ary.splice(k,1)});

        if(this.enemy.x<Math.floor(Ex.canvas.c.width*Ex.canvas.enemy.enemy.AI_config.w_min)) 
            ary.forEach( (v,k)=>{if(v==="left") ary.splice(k,1)});

        if(this.enemy.y+this.enemy.h>Math.floor(Ex.canvas.c.height*Ex.canvas.enemy.enemy.AI_config.h_max)) 
            ary.forEach( (v,k)=>{if(v==="down") ary.splice(k,1)});

        if(this.enemy.y<Math.floor(Ex.canvas.c.height*Ex.canvas.enemy.enemy.AI_config.h_min)) 
            ary.forEach( (v,k)=>{if(v==="up") ary.splice(k,1)});
        */


        var move_ary = [];

        for(var key of ary)
        {
            for(var i=1;i<=Ex.canvas[u.type][u.id].AI_config[key];i++) move_ary.push(key);
            for(var i=1;i<=Ex.canvas[u.type][u.id].AI_config[key];i++) move_ary.push(key);
            for(var i=1;i<=Ex.canvas[u.type][u.id].AI_config[key];i++) move_ary.push(key);
            for(var i=1;i<=Ex.canvas[u.type][u.id].AI_config[key];i++) move_ary.push(key);
        }
            
        if(move_ary.length!==0)
        {
            var move = this.Rand(move_ary);
            
            this[move]();

            var move = this.Rand(move_ary);
            
            this[move]();
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


}

