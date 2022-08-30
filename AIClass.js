class AIClass{

    constructor(enemy){

        this.up = ()=>{ 
            Ex.flag.key[ "AI_UP" ] = true;
            Ex.flag.key[ "AI_DOWN" ] = false;
        }
        this.down = ()=>{ 
            Ex.flag.key[ "AI_DOWN" ] = true;
            Ex.flag.key[ "AI_UP" ] = false;
        }
        this.right = ()=>{ 
            Ex.flag.key[ "AI_RIGHT" ] = true;
            Ex.flag.key[ "AI_LEFT" ] = false;
        }
        this.left = ()=>{ 
            Ex.flag.key[ "AI_LEFT" ] = true;
            Ex.flag.key[ "AI_RIGHT" ] = false;
        }

        this.enemy = enemy;
        this.timer = 1;
        this.config = {};


        this.Ref();
    }

    Ref = ()=>{
        try{

            if(Ex.flag.game_start)
            {
                Ex.func.UnitControl('enemy');

                this.AI_Move();
                this.AI_MoveCheck();
            }
            

            this.anima_timer = requestAnimationFrame(this.Ref);

        }catch(e){

            console.log(e);
        }
    }

    AI_MoveCheck = ()=>{

        if(this.enemy.x+this.enemy.w>=Math.floor(Ex.canvas.c.width*Ex.canvas.enemy.enemy.AI_config.w_max) && Ex.flag.key[ "AI_RIGHT" ]===true)
        {
            Ex.flag.key[ "AI_UP" ] = false;
            Ex.flag.key[ "AI_DOWN" ] = false;
            Ex.flag.key[ "AI_RIGHT" ] = false;
            Ex.flag.key[ "AI_LEFT" ] = false;
        }

        if(this.enemy.x<=Math.floor(Ex.canvas.c.width*Ex.canvas.enemy.enemy.AI_config.w_min) && Ex.flag.key[ "AI_LEFT" ]===true)
        {
            Ex.flag.key[ "AI_UP" ] = false;
            Ex.flag.key[ "AI_DOWN" ] = false;
            Ex.flag.key[ "AI_RIGHT" ] = false;
            Ex.flag.key[ "AI_LEFT" ] = false;
        }

        if(this.enemy.y+this.enemy.h>=Math.floor(Ex.canvas.c.height*Ex.canvas.enemy.enemy.AI_config.h_max) && Ex.flag.key[ "AI_DOWN" ]===true)
        {
            Ex.flag.key[ "AI_UP" ] = false;
            Ex.flag.key[ "AI_DOWN" ] = false;
            Ex.flag.key[ "AI_RIGHT" ] = false;
            Ex.flag.key[ "AI_LEFT" ] = false;
        }

        if(this.enemy.y<=Math.floor(Ex.canvas.c.height*Ex.canvas.enemy.enemy.AI_config.h_min) && Ex.flag.key[ "AI_UP" ]===true)
        {
            Ex.flag.key[ "AI_UP" ] = false;
            Ex.flag.key[ "AI_DOWN" ] = false;
            Ex.flag.key[ "AI_RIGHT" ] = false;
            Ex.flag.key[ "AI_LEFT" ] = false;
        }
        

    }


    AI_Move = ()=>{

        this.enemy.AI_config._frequency = this.enemy.AI_config._frequency||0;
        
        this.enemy.AI_config._frequency++;

        if(this.enemy.AI_config._frequency<this.enemy.AI_config.frequency*60) return;

        this.enemy.AI_config._frequency = 0;


        Ex.flag.key[ "AI_UP" ] = false;
        Ex.flag.key[ "AI_DOWN" ] = false;
        Ex.flag.key[ "AI_RIGHT" ] = false;
        Ex.flag.key[ "AI_LEFT" ] = false;

        var ary = ["up","down","right","left"];
        

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
            for(var i=1;i<=Ex.canvas.enemy.enemy.AI_config[key];i++) move_ary.push(key);
            for(var i=1;i<=Ex.canvas.enemy.enemy.AI_config[key];i++) move_ary.push(key);
            for(var i=1;i<=Ex.canvas.enemy.enemy.AI_config[key];i++) move_ary.push(key);
            for(var i=1;i<=Ex.canvas.enemy.enemy.AI_config[key];i++) move_ary.push(key);
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

