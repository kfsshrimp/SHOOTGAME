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
        this.opt = {};


        this.Ref();
    }

    Ref = ()=>{
        try{

            if(Ex.flag.game_start)
            {
                Ex.func.UnitControl('enemy');

                this.AI_Move();
            }
            

            this.anima_timer = requestAnimationFrame(this.Ref);

        }catch(e){

            console.log(e);
        }
    }

    AI_Move = ()=>{

        this.enemy.move_last_time = this.enemy.move_last_time||new Date().getTime();

        if(new Date().getTime() - this.enemy.move_last_time < 500)
        {
            return;
        }

        this.enemy.move_last_time = new Date().getTime();

       

        Ex.flag.key[ "AI_UP" ] = false;
        Ex.flag.key[ "AI_DOWN" ] = false;
        Ex.flag.key[ "AI_RIGHT" ] = false;
        Ex.flag.key[ "AI_LEFT" ] = false;

        var ary = ["up","down","right","left"];

        if(this.enemy.x>Math.floor(Ex.canvas.c.width*0.8)) 
            ary.forEach( (v,k)=>{if(v==="right") ary.splice(k,1)});

        if(this.enemy.x<Math.floor(Ex.canvas.c.width*0.2)) 
            ary.forEach( (v,k)=>{if(v==="left") ary.splice(k,1)});

        if(this.enemy.y>Math.floor(Ex.canvas.c.height*0.8)) 
            ary.forEach( (v,k)=>{if(v==="down") ary.splice(k,1)});

        if(this.enemy.y<Math.floor(Ex.canvas.c.height*0.2)) 
            ary.forEach( (v,k)=>{if(v==="up") ary.splice(k,1)});

            

        var move = this.Rand(ary);
        
        this[move]();

        var move = this.Rand(ary);
        
        this[move]();
        
        
    }

   
   

 



    Rand = (array)=>{

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


}

