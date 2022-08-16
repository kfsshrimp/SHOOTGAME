class CanvasClass{

    constructor(opt = {}){

        for(var key in opt) this[key] = opt[key];

        this.c = document.createElement("canvas");
        this.c2d = this.c.getContext("2d");
        this.unit = this.unit||{};
        this.point = this.point||{};
        this.map = this.map||{};

        this.config = {
            msg:{
                height_width_error:"高寬設定錯",
                canvas_exist:"地圖已存在"
            },
            hw:{
                hp:{w:50,h:5}
            },
            color:{
                background:"#fff",
                point:"#f00",
                unit:"#00f",
                dir:"#f003",
                hp:["#fff9","#0f09"],
            }
        };
        this.flag = {
            background:'img'
        }

        for(var key in opt.c_config)
        {
            this.c[key] = opt.c_config[key];
        }

        for(var key in opt.c2d_config)
        {
            this.c2d[key] = opt.c2d_config[key];
        }

        this.background.img = new Image();


        this.ImgLoad(this.background.img,
            ()=>{

                this.c.width = this.background.img.width;
                this.c.height = this.background.img.height;
            
                document.body.appendChild(this.c);
                this.Ref();

            },
            ()=>{

                this.background.img_error = true;

                this.c.width = this.background.width;
                this.c.height = this.background.height;
                this.c.color = "#fff";
    
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

       


        this.background.img.src = this.background.url;


    }

    Ref = ()=>{

        try{


            this.Draw({
                img:this.background.img,
                img_error:this.background.img_error,
                x:0,
                y:0,
                w:this.c.width,
                h:this.c.height,
                c:this.config.color.background
            });



            for(var key in this.map)
            {
                var unit = this.map[key];

                this.Draw({
                    x:unit.x,
                    y:unit.y,
                    w:unit.w,
                    h:unit.h,
                    c:unit.color
                });
            }

            for(var key in this.point)
            {
                var point = this.point[key];

                this.Draw({
                    img:this.unit[point.unit].img_list.shoot.img,
                    img_error:this.unit[point.unit].img_list.shoot.img_error,
                    x:point.x,
                    y:point.y,
                    w:point.w,
                    h:point.h,
                    c:this.config.color.point
                });
            }
    
            for(var key in this.unit)
            {
                var unit = this.unit[key];

                unit.w = 20;
                unit.h = 20;

                this.Draw({
                    img:unit.img_list.self.img,
                    img_error:unit.img_list.self.img_error,
                    x:unit.x,
                    y:unit.y,
                    w:unit.w,
                    h:unit.h,
                    c:this.config.color.unit
                });

              

                if(unit.control.dir!==undefined)
                {
                    this.Draw({
                        x:unit.x + unit.w * unit.control.dir.x,
                        y:unit.y + unit.h * unit.control.dir.y,
                        w:unit.w,
                        h:unit.h,
                        c:this.config.color.dir
                    });
                }

                if(unit.hp!==undefined)
                {
                    unit._hp = unit._hp||unit.hp;

                    this.Draw({
                        x:unit.x ,
                        y:unit.y - Math.floor(unit.h/2),
                        w:this.config.hw.hp.w,
                        h:this.config.hw.hp.h,
                        c:this.config.color.hp[0]
                    });
    
                    this.Draw({
                        x:unit.x ,
                        y:unit.y - Math.floor(unit.h/2),
                        w:Math.floor(unit.hp/unit._hp * this.config.hw.hp.w),
                        h:this.config.hw.hp.h,
                        c:this.config.color.hp[1]
                    });

                }
            }

            this.anima_timer = requestAnimationFrame(this.Ref);

        }catch(e){
            console.log(e);
            return;
        }
        
    }


    Draw = (arg)=>{

        if(arg.img!==undefined && !arg.img_error)
        {
            this.c2d.drawImage(
                arg.img,
                arg.x,
                arg.y,
                arg.w||arg.img.width,
                arg.h||arg.img.height
                );
        }
        else
        {
            this.c2d.beginPath();

            this.c2d.fillStyle = arg.c;
            //this.c2d.arc(unit.x,unit.y,unit.r,0,360);
            this.c2d.fillRect(
                arg.x,
                arg.y,
                arg.w,
                arg.h
                );
            
            this.c2d.fill();
    
            this.c2d.closePath();
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

    
    


}