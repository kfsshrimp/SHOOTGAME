class EditClass{

    constructor(opt = {}){

        this.opt = opt;
        this.config = {
            msg:{
                height_width_error:"高寬設定錯",
                canvas_exist:"地圖已存在",
                canvas_no_exist:"地圖未存在",
                player_exist:"單位已存在"
            }
        };
        this.flag = {
            ControlDirSet:null

        };

        var ControlMenu = document.createElement("div");
        this.ControlMenu = ControlMenu;

        ControlMenu.id = "ControlMenu";
        ControlMenu.innerHTML = this.Temp('default');

        ControlMenu.addEventListener("click",this.ClickEvent);
        window.addEventListener("keydown",this.KeyDown);


        document.body.appendChild(ControlMenu);
    }

    KeyDown = (e)=>{

        if(this.flag.ControlDirSet!==null)
        {
            this.flag.ControlDirSet.nextElementSibling.innerHTML = e.code;
            this.flag.ControlDirSet.dataset.value = e.code;
            this.flag.ControlDirSet = null;
        }


    }


    ClickEvent = (e)=>{

        switch (e.target.dataset.event){
                
            case "CreateCanvas":

                if(document.querySelector("canvas")!==null)
                {
                    alert(this.config.msg.canvas_exist);
                    return;
                }

                if(document.querySelector("#CreateForm")!==null)
                {
                    var form = document.querySelector("#CreateForm");
                    
                    Ex.canvas = new CanvasClass({
        
                        background:{
                            url:form.querySelector("#url").value,
                            height:form.querySelector("#height").value,
                            width:form.querySelector("#width").value,
                        },

                    });

                    form.remove();

                    return;
                }


                var div = document.createElement("div");
                div.id = "CreateForm";

                div.innerHTML = this.Temp("CreateCanvas");

                this.ControlMenu.appendChild(div);

            break;


            case "CreateUnit":

                if(Ex.canvas.unit===undefined)
                {
                    alert(this.config.msg.canvas_no_exist);
                    return;
                }

                if(Ex.canvas.unit.player!==undefined)
                {
                    alert(this.config.msg.player_exist);
                    return;
                }

                if(document.querySelector("#CreateForm")!==null)
                {
                    var form = document.querySelector("#CreateForm");
                    var unit = {
                        type:"unit",
                        id:"player",
                        img_list:{
                            self:{
                                src:form.querySelector("#img_self").value
                            },
                            shoot:{
                                src:form.querySelector("#img_shoot").value
                            }
                        },
                        x:10,
                        y:10,
                        lv:1,
                        hp:form.querySelector("#hp").value,
                        atk:form.querySelector("#atk").value,
                        control:{
                            up:form.querySelector("#up").dataset.value.toString().toUpperCase(),
                            down:form.querySelector("#down").dataset.value.toString().toUpperCase(),
                            right:form.querySelector("#right").dataset.value.toString().toUpperCase(),
                            left:form.querySelector("#left").dataset.value.toString().toUpperCase(),
                            shoot:form.querySelector("#shoot").dataset.value.toString().toUpperCase(),
                            speed:3
                        }
                    };

                    form.remove();

                    
                    unit.img_list.self.img = new Image();

                    Ex.canvas.ImgLoad(unit.img_list.self.img,
                        ()=>{
                            
                            Ex.canvas.unit[unit.id] = unit;

                            this.ImgLoadLoop(unit);
                        },
                        ()=>{
                            unit.img_list.self.img_error = true;

                            Ex.canvas.unit[unit.id] = unit;

                            this.ImgLoadLoop(unit);
                            
                        }
                    );
                    unit.img_list.self.img.src = unit.img_list.self.src;


                    

                    
                    return;
                }

                


                var div = document.createElement("div");
                div.id = "CreateForm";

                div.innerHTML = this.Temp('CreateUnit');

                this.ControlMenu.appendChild(div);

            break;


            case "ControlDirSet":

                this.flag.ControlDirSet = e.target;
                e.target.nextElementSibling.innerHTML += '(按任意鍵設定)'


            break;

            case "CloseParent":

                e.target.parentElement.remove();

            break;

            case "EXIT":

                cancelAnimationFrame(Ex.anima_timer);
                cancelAnimationFrame(Ex.canvas.anima_timer);

            break;


        }
    }



    ImgLoadLoop = (unit)=>{

        for(let k in unit.img_list){

            unit.img_list[k].img = new Image();

            Ex.canvas.ImgLoad(unit.img_list[k].img,
                ()=>{
                    
                    Ex.canvas.unit[unit.id].img_list[k].img = unit.img_list[k].img;
                },
                ()=>{
                    Ex.canvas.unit[unit.id].img_list[k].img_error = true;
                }
            );
            unit.img_list[k].img.src = unit.img_list[k].src;
        }

    }

    



    Temp = (name)=>{

        var html = ``;
        switch (name){

            case "default":

                html = `
                    <input type="button" data-event="EXIT" value="EXIT">

                    <input type="button" data-event="CreateCanvas" value="載入背景">
                    <input type="button" data-event="CreateUnit" value="建立單位">
                `;

            break;

            case "CreateCanvas":

                html = `
                    背景圖片網址：<input type="text" id="url" value="https://truth.bahamut.com.tw/s01/201401/86d7f4e508d07fc7a38a99688213e327.JPG"><BR>

                    
                    高：<input id="height" type="number" value="600"><BR>
                    寬：<input id="width" type="number" value="800"><BR>

                `;

            break;

            case "CreateUnit":

                html =`
                    單位圖片網址：<input type="text" id="img_self" value="https://avatars.plurk.com/14556765-big9788529.jpg"><BR>
                    子彈圖片網址：<input type="text" id="img_shoot" value="https://avatars.plurk.com/14556765-big9788529.jpg"><BR>
                    HP：<input type="number" id="hp" value="100"><BR>
                    ATK：<input type="number" id="atk" value="3"><BR>
                    SPEED：<input type="number" id="speed" value="5"><BR>
                    高：<input disabled type="number" value="20"><BR>
                    寬：<input disabled type="number" value="20"><BR>

                    <input id="up" data-value="ArrowUp" value="上" 
                    data-event="ControlDirSet" type="button">：<span>ArrowUp</span><BR>

                    <input id="right" data-value="ArrowRight" value="右" 
                    data-event="ControlDirSet" type="button">：<span>ArrowRight</span><BR>

                    <input id="down" data-value="ArrowDown" value="下" 
                    data-event="ControlDirSet" type="button">：<span>ArrowDown</span><BR>

                    <input id="left" data-value="ArrowLeft" value="左" 
                    data-event="ControlDirSet" type="button">：<span>ArrowLeft</span><BR>

                    <input id="shoot" data-value="KeyZ" value="射擊" 
                    data-event="ControlDirSet" type="button">：<span>KeyZ</span><BR>


                    
                `;
            break;
        }

        if(name!=="default"){

            html += `
                <HR>
                <input type="button" data-event="${name}" value="送出">
                <input type="button" data-event="CloseParent" value="取消">
            `;
            
        }


        return html;

    }
}