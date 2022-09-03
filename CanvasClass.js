class CanvasClass{

    constructor(opt = {}){

        for(var key in opt) this[key] = opt[key];

        this.c = document.createElement("canvas");
        this.c2d = this.c.getContext("2d");
        this.player = this.player||{};
        this.enemy = this.enemy||{};
        this.bullet = this.bullet||{};
        this.wall = this.wall||{};
        this.other_back = this.other_back||{};
        this.func = this.func||{};

        this.flag = {};
        

        this.c.addEventListener("mousedown",this.func.mousedown);
        this.c.addEventListener("mousemove",this.func.mousemove);



        for(var key in opt.c_config)
        {
            this.c[key] = opt.c_config[key];
        }

        for(var key in opt.c2d_config)
        {
            this.c2d[key] = opt.c2d_config[key];
        }

        this.background.img_list.self.img = new Image();


        this.ImgLoad(this.background.img_list.self.img,
            ()=>{

                this.c.width = this.background.img_list.self.img.width;
                this.c.height = this.background.img_list.self.img.height;
                

                var wh = this.Resize(this.c.width,this.c.height);

                this.c.width = wh[0];
                this.c.height = wh[1];
                


                document.body.appendChild(this.c);
                this.Ref();

            },
            ()=>{

                this.background.img_list.self.img_error = true;

                this.c.width = this.background.width;
                this.c.height = this.background.height;
    
                if(
                    parseInt(this.background.width).toString()==='NaN' || 
                    parseInt(this.background.height).toString()==='NaN'
                )
                {
                    alert(this.config.msg.height_width_error);
                    return;
                }
                
                document.body.appendChild(this.c);
                this.Ref();

            }
        );
        
        this.background.img_list.self.img.src = this.background.img_list.self.src;


        this.ImgLoadLoop( this.background.img_list );
    }

    Ref = ()=>{

        try{


            this.Draw({
                img:this.background.img_list.self.img,
                img_error:this.background.img_list.self.img_error,
                x:0,
                y:0,
                w:this.c.width,
                h:this.c.height,
                c:this.background.img_list.self.color
            });
            



            for(var key in this.wall)
            {
                var wall = this.wall[key];

                if(wall.mode==="broke")
                {
                    this.Draw({
                        x:wall.x,
                        y:wall.y,
                        w:wall.w,
                        h:wall.h,
                        c:wall.broke
                    });
                }
                else
                {
                    this.Draw({
                        img:this.background.img_list.wall.img,
                        img_error:this.background.img_list.wall.img_error,
                        x:wall.x,
                        y:wall.y,
                        w:wall.w,
                        h:wall.h,
                        c:wall.color
                    });
                }
            }

            for(var key in this.bullet)
            {
                var bullet = this.bullet[key];

                if(this[bullet.unit.type][bullet.unit.id]===undefined)
                {
                    delete this.bullet[key];
                    continue;
                }

                this.Draw({
                    img:this[bullet.unit.type][bullet.unit.id].img_list.bullet.img,
                    img_error:this[bullet.unit.type][bullet.unit.id].img_list.bullet.img_error,
                    x:bullet.x,
                    y:bullet.y,
                    w:bullet.w,
                    h:bullet.h,
                    c:this[bullet.unit.type][bullet.unit.id].img_list.bullet.color
                });
            }


            for(var type of ["player","enemy"])
            {
                for(var key in this[type])
                {
                    var unit = this[type][key];
                    
                    this.Draw({
                        img:unit.img_list.self.img,
                        img_error:unit.img_list.self.img_error,
                        x:unit.x,
                        y:unit.y,
                        w:unit.w,
                        h:unit.h,
                        c:unit.img_list.self.color
                    });

                    if(unit.hp!==undefined) this.HpShow(unit);
                }
            }



            
            for(var key in this.other_back)
            {
                this.Draw( this.other_back[key] );
            }


            this.anima_timer = requestAnimationFrame(this.Ref);

        }catch(e){

            console.log(e);

            return;
        }
    }



    HpShow = (obj)=>{

        obj._hp = obj._hp||obj.hp;

        if(obj.id==="BreakoutClonePlayer") return;

        this.Draw({
            x:obj.x ,
            y:obj.y - Math.floor(obj.h/2),
            w:obj.w*2,
            h:this.config.info[obj.type].hp.h,
            c:this.config.info[obj.type].hp.color[0]
        });

        this.Draw({
            x:obj.x ,
            y:obj.y - Math.floor(obj.h/2),
            w:Math.floor(obj.hp/obj._hp * obj.w)*2,
            h:this.config.info[obj.type].hp.h,
            c:this.config.info[obj.type].hp.color[1]
        });

    }


    UnitArcRange = (unit)=>{


        let start = -0.5,end = 1.5;
        unit.x_d = (unit.x_d===undefined)?0:unit.x_d;
        unit.y_d = (unit.y_d===undefined)?0:unit.y_d;

     
        if(unit.x_d===0 && unit.y_d===-1) {start = 0.3;end = -1.3;}
        if(unit.x_d===0 && unit.y_d===1) {start = 1.3;end = 1.7;}

        if(unit.y_d===0 && unit.x_d===1) {start = -0.2;end = 0.2;}
        if(unit.y_d===0 && unit.x_d===-1) {start = 0.8;end = -0.8;}
        

        if(unit.x_d===1 && unit.y_d===1){start = -0.5;end = 0;}
        if(unit.x_d===1 && unit.y_d===-1){start = 0;end = 0.5;}

        if(unit.x_d===-1 && unit.y_d===-1){start = 0.5;end = 1;}
        if(unit.x_d===-1 && unit.y_d===1){start = 1;end = 1.5;}
     

        this.Draw({
            x:unit.x + Math.floor(unit.w/2),
            y:unit.y + Math.floor(unit.h/2),
            r:Math.floor(unit.w),
            start:start,
            end:end,
            lineWidth:this.config.hw.dir.w,
            strokeStyle:this.config.color.dir
        });

    }


    Draw = (arg)=>{

        if(this.c2d.drawImage===undefined) return;

        if(arg.img!==undefined && !arg.img_error)
        {
            this.c2d.drawImage(
                arg.img,
                arg.x,
                arg.y,
                arg.w,
                arg.h,
            );
        }
        else
        {
            if(arg.r!==undefined)
            {
                this.c2d.beginPath();

                this.c2d.strokeStyle = arg.strokeStyle;
                this.c2d.lineWidth = arg.lineWidth;
                this.c2d.arc(
                    arg.x,
                    arg.y,
                    arg.r,
                    arg.start*Math.PI,
                    arg.end*Math.PI
                    );

                this.c2d.stroke();
        
                this.c2d.closePath();

            }
            else
            {
                this.c2d.beginPath();


                this.c2d.fillStyle = arg.c;
                this.c2d.fillRect(
                    arg.x,
                    arg.y,
                    arg.w,
                    arg.h
                    );

                this.c2d.fill();
        
                this.c2d.closePath();

                if(arg.border!==undefined)
                {
                    this.c2d.beginPath();
                    this.c2d.strokeStyle = arg.border;
                    this.c2d.lineWidth = 1;
                    this.c2d.strokeRect(
                        arg.x,
                        arg.y,
                        arg.w,
                        arg.h
                    );
                    this.c2d.stroke();
                    this.c2d.closePath();
                }
            }            
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


    Resize = (w,h)=>{

        if(w>window.innerWidth)
        {
            h = Math.floor( (window.innerWidth/w) * h );
            w = window.innerWidth;

            if(h>window.innerHeight)
            {
                return this.Resize(w,h);
            }
        }

        if(h>window.innerHeight)
        {
            w = Math.floor( (window.innerHeight/h) * w );
            h = window.innerHeight;

            if(w>window.innerWidth)
            {
                return this.Resize(w,h);
            }
        }


        return [w,h];

    }
    
    


}