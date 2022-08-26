class AIClass{

    constructor(id){

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

        this.enemy_id = id;
        this.timer = 1;
        this.opt = {};


        this.Ref();
    }

    Ref = ()=>{
        try{
            
            this.EnemyControl();


            if(Ex.flag.game_start)
            {
                this.AI_Shoot();

                this.AI_Move();

            }

            this.anima_timer = requestAnimationFrame(this.Ref);

        }catch(e){

            console.log(e);
        }
    }

    AI_Move = ()=>{

        Ex.canvas.enemy[this.enemy_id].move_last_time = Ex.canvas.enemy[this.enemy_id].move_last_time||new Date().getTime();

        if(new Date().getTime() - Ex.canvas.enemy[this.enemy_id].move_last_time < 500)
        {
            return;
        }

        Ex.canvas.enemy[this.enemy_id].move_last_time = new Date().getTime();

       


        Ex.flag.key[ "AI_UP" ] = false;
        Ex.flag.key[ "AI_DOWN" ] = false;
        Ex.flag.key[ "AI_RIGHT" ] = false;
        Ex.flag.key[ "AI_LEFT" ] = false;

        var ary = ["up","down","right","left"];

        if(Ex.canvas.enemy[this.enemy_id].x>Math.floor(Ex.canvas.c.width*0.8)) 
            ary.forEach( (v,k)=>{if(v==="right") ary.splice(k,1)});

        if(Ex.canvas.enemy[this.enemy_id].x<Math.floor(Ex.canvas.c.width*0.2)) 
            ary.forEach( (v,k)=>{if(v==="left") ary.splice(k,1)});

        if(Ex.canvas.enemy[this.enemy_id].y>Math.floor(Ex.canvas.c.height*0.8)) 
            ary.forEach( (v,k)=>{if(v==="down") ary.splice(k,1)});

        if(Ex.canvas.enemy[this.enemy_id].y<Math.floor(Ex.canvas.c.height*0.2)) 
            ary.forEach( (v,k)=>{if(v==="up") ary.splice(k,1)});

            

        var move = this.Rand(ary);
        
        this[move]();

        var move = this.Rand(ary);
        
        this[move]();
        
        
    }


    AI_Shoot = ()=>{

        var x = 0,y = Math.floor(Ex.canvas.c.height/2);
        
        for(var name in Ex.canvas.player)
        {
            x = Ex.canvas.player[name].x;
            y = Ex.canvas.player[name].y;
        }
        
        
        Ex.func.EnemyShoot(Ex.canvas.enemy[this.enemy_id],x,y);
    }


    EnemyControl = ()=>{

        for(var name in Ex.canvas.enemy)
        {
            var obj = Ex.canvas.enemy[name];
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

                if(this.EnemyCollision(obj)!==false)
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
        }
    }

    EnemyCollision = (obj)=>{

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

