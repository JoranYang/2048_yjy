var game={
	data:null,//保存游戏的数据:二维数组
  RN:4,CN:4,//总行数,总列数
  aData:[],//单一行或列数据
  isChange:false,//是否更新页面
  isGameOver:0,//是否游戏结束0,进行中,1,结束
  score:0,//保存当前得分
  topScore:0,//保存最高分
  init:function(){
    /*动态生成gridPanel中的div*/
    //r从0开始，到<RN结束，同时创建空数组arr
    for(var r=0,arr=[];r<this.RN;r++){
      //c从0开始，到<CN结束
      for(var c=0;c<this.CN;c++){
        //向arr中压入:""+r+c
        arr.push(""+r+c);
      }
    }
    var strGrid='<div id="g'+
      arr.join('" class="grid"></div><div id="g')
      +'" class="grid"></div>';
    var strCell='<div id="c'+
      arr.join('" class="cell"></div> <div id="c')
      +'" class="cell"></div>';
    //设置id为gridPanel的内容为strGrid+strCell
    gridPanel.innerHTML=strGrid+strCell;
    //计算gridPanel的宽
    var width=this.CN*116+16+"px";
    var height=this.RN*116+16+"px";
    //设置gridPanel的宽和高
    gridPanel.style.width=width;
    gridPanel.style.height=height;
    gameOver.style.display="none";
  },
  isGameOver:function(){//判断游戏是否结束
    for(var r=0;r<this.RN;r++){
      for(var c=0;c<this.CN;c++){
        //如果当前元素是0
        if(this.data[r][c]==0){
          return false;//返回false
        }
        //如果c<CN-1,且当前元素等于右侧元素
        if(c<this.CN-1
          &&this.data[r][c]
          ==this.data[r][c+1]){
          return false;//返回false
        }
        //如果r<RN-1,且当前元素等于下方元素
        if(r<this.RN-1
          &&this.data[r][c]
          ==this.data[r+1][c]){
          return false;//返回false
        }
      }
    }
    return true;//返回true
  },
  start:function(){
    this.init();
    //从cookie中读取出最高分
    this.topScore=this.getCookie("topScore");
    this.topScore==""&&(this.topScore=0);
    topScore.innerHTML=this.topScore;
    this.score=0;//分数归零
   /*初始化data为RNxCN的二维数组*/
    this.data=[];
    for(var r=0;r<this.RN;r++){
      this.data[r]=[];
      for(var c=0;c<this.CN;c++){
        this.data[r][c]=0;
      }
    }
    //调用2次randomNum方法，生成2个随机数
    this.randomNum();
    this.randomNum();
    this.updateView();//更新界面
    //绑定键盘事件:
    document.onkeydown=function(e){
      console.log(this);
      //this->start方法的this->game
      switch(e.keyCode){
        case 37:this.moveAll(37);break;
        case 38:this.moveAll(38);break;
        case 39:this.moveAll(39);break;
        case 40:this.moveAll(40);break;
      }
    }.bind(this);
  },
  moveAll:function(type){//移动所有行或列
    for(var i=0;i<this.RN;i++){//i从0开始，到<RN结束，所有行或列
      switch(type){
        case 37:this.moveOne(37,i);break;
        case 38:this.moveOne(38,i);break;
        case 39:this.moveOne(39,i);break;
        case 40:this.moveOne(40,i);break;
      }
    }
    if(this.isChange){
      this.randomNum();//随机生成新数
      this.updateView();//更新页面
      if(this.isGameOver()){
        finalScore.innerHTML=this.score;
        gameOver.style.display="block";//找到id为gameOver的div，设置其显示
        if(this.score>this.topScore){
          this.setCookie(//向cookie中写入最高分
            "topScore",
            this.score,
            new Date("2099/1/1")
          );
        }
      }
      this.isChange=false;
    }
  },
  moveOne:function(type,i){//移动第i行或列
    var me=this;
    //根据type给aData赋值
    switch(type){
      case 37:
        (function (i) {
          for(var j=0;j<4;j++){
            me.aData[j]=me.data[i][j]
          }
        }(i));
        this.changeArr();
        this.changeData(type,i);
        break;//引用地址
      case 38:
        (function (i) {
          for(var j=0;j<4;j++){
            me.aData[j]=me.data[j][i]
          }
        }(i));
        this.changeArr();
        this.changeData(type,i);
        break;//引用地址
      case 39:
        (function (i) {
          for(var j=0;j<4;j++){
            me.aData[j]=me.data[i][j]
          }
          me.aData.reverse();
        }(i));
        this.changeArr();
        this.changeData(type,i);
        break;//引用地址
      case 40:
        (function (i) {
          for(var j=0;j<4;j++){
            me.aData[j]=me.data[j][i]
          }
          me.aData.reverse();
        }(i));
        this.changeArr();
        this.changeData(type,i);
        break;//引用地址
    }
  },
  changeArr:function(){//重组数组
    //j从0开始，到<CN-1结束,aData中每个元素
    for(var j=0;j<this.CN-1;j++){
      var next=this.getNextNotZero(j,this.aData);
      if(next==-1){//如果next等于-1，退出循环
        return;
      }else{
        if(this.aData[j]==0){//如果是0,则两数交换
          this.aData[j]=this.aData[next];
          this.aData[next]=0;
          j--;
        }else if(this.aData[j]==this.aData[next]){//如果相等,则相加
          this.aData[j]*=2;
          this.aData[next]=0;
          this.score+=this.aData[j];
        }
      }
    }
  },
  getNextNotZero:function(j,arr){
    /*查找aData下一个不为0的位置*/
    for(var next=j+1;next<this.CN;next++){//next从j+1开始，next到<CN结束
      if(arr[next]!=0){
        return next;//返回next
      }
    }
    return -1;//返回-1
  },
  changeData:function(type,i){
    switch(type){
      case 37:
        for(var j=0;j<4;j++){
          if(!this.isChange&&this.data[i][j]!=this.aData[j]){
            this.isChange=true;
          }
          this.data[i][j]=this.aData[j];
        };break;//引用地址
      case 38:
        for(var j=0;j<4;j++){
          if(!this.isChange&&this.data[j][i]!=this.aData[j]){
            this.isChange=true;
          }
          this.data[j][i]=this.aData[j];
        };break;//引用地址
      case 39:
        this.aData.reverse();
        for(var j=0;j<4;j++){
          if(!this.isChange&&this.data[i][j]!=this.aData[j]){
            this.isChange=true;
          }
          this.data[i][j]=this.aData[j];
        };break;//引用地址
      case 40:
        this.aData.reverse();
        for(var j=0;j<4;j++){
          if(!this.isChange&&this.data[j][i]!=this.aData[j]){
            this.isChange=true;
          }
          this.data[j][i]=this.aData[j];
        };break;//引用地址
    }
  },
  updateView:function(){
    /*将data中的数据更新到页面对应的div中*/
    for(var r=0;r<this.RN;r++){//遍历data中每个元素
      for(var c=0;c<this.CN;c++){
        var div=document.getElementById("c"+r+c);//找到id等于id的元素，保存在变量div
        if(this.data[r][c]!=0){//如果data中r行c列不等于0,设置其对应值以及class样式
          div.innerHTML=this.data[r][c];
          div.className="cell n"+this.data[r][c];
        }else{//否则,清除div的内容,设置div的className属性为:"cell"
          div.innerHTML="";
          div.className="cell";
        }
      }
    }
    score.innerHTML=this.score;

  },
  randomNum:function(){
   /*在随机的空白位置生成一个2或4*/
   while(true){
    var r=parseInt(Math.random()*this.RN);//在0~RN-1之间生成一个随机整数，保存在变量r中
    var c=parseInt(Math.random()*this.CN);//在0~CN-1之间生成一个随机整数，保存在变量c中
    console.log(r,c);
    if(this.data[r][c]==0){//如果data中r行c列等于0,也就是生成位置没有冲突
      this.data[r][c]=Math.random()>0.5?4:2;//调用Math.random(),如果>0.5，值为4，否则值为2;
      break;
    }
   }
  },
  setCookie: function (name,value,expires) {
    document.cookie=name+"="+value+";expires="+expires.toGMTString();
  },
  getCookie: function (name) {
    var cookies=document.cookie;
    var namei=cookies.indexOf(name);
    if(namei!=-1){
      var starti=namei+name.length+1;
      var spi=cookies.indexOf(";",starti);
      var value=
        spi!=-1?cookies.slice(starti,spi):
          cookies.slice(starti);
      return value;
    }else{
      return "";
    }
  }
}
//页面加载后，启动游戏
window.onload=function(){game.start()}

console.log('测试')