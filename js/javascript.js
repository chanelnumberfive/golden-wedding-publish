//javascript
$("#second-section").hide();
$("#last-section").hide();
//导航条
$("#nav a").click(function () {
    var $index = $(this).index();
    $(this).find("span").addClass("span-red");
    $(this).siblings().find("span").removeClass();
	$('.blz-50-link').hide().data('blz-dismiss',0);
    if ($index == 2) {
        $(".danmuqu,.pinglunqu,.videoqu").hide();
    } else {
        $(".danmuqu,.pinglunqu,.videoqu").show();
    }
	if($index===0){$('.blz-50-link').show().data('blz-dismiss',1);}
    $("#nav-section section").eq($index).show().siblings().hide();
})

//打开红包
$("#separate-btn").click(function () {
    $(this).parent().hide().siblings().show();
})

//发送弹幕
/*$("#send").click(function () {
    var oTxt = $("#txt-danmu").val();
    console.log(oTxt)
    var newWord = {
        name: '客户',
        url: 'images/1.jpg',
        words: oTxt
    };
    if ($("#txt-danmu").val() != "") {
        mergeJson(newWord, $json);
    }

    console.log($json)
    $("#txt-danmu").val("")
})*/

$(function () {
    $("#nav-flex").scroll(function () {
        if ($(this).scrollTop() > 50) {

            $("#danmuqu").slideUp(function () {
                $("#nav").addClass("nav-fixed");
            });

            $("#nav-section").addClass("nav-marT");
        }
        if ($(this).scrollTop() == 0) {
            $("#danmuqu").slideDown();
            $("#nav").removeClass("nav-fixed");
            $("#nav-section").removeClass("nav-marT");
        }
    })
});

//弹幕开始
+ function ($) {
   'use strict';
   
	//弹幕构造函数	
    function Danmu(obj){
		obj=obj||{};
		this.elem=obj.elem||null;
		this.clear=[];
		this.index=obj.index||0;
		this.newIndex=obj.newIndex||0;
		this.time=obj.time||16;
		this.displacement=obj.displacement||$(window).width();
		this.data=obj.data||[{name:111,words:222,url:'images/1.jpg'}];
		this.spacing=obj.spacing||$(window).width()/6;
		this.parallax=obj.parallax||5;
		this.isOpen=true;
	}
	
	//发送弹幕消息
    Danmu.prototype.sendWish=function(data) {
		this.newIndex=this.newIndex+1;
        this.data.splice(this.newIndex,0, data);
    };
	
    //为每个弹幕盒子分配一条消息
    function assignMessage($target, data) {
        var name = data.name;
        var dl = document.createElement('dl');
        $(dl).html('<dt class="blz-dial-title" aria-label="' + name + '"><img src="' + data.url + '" alt="' + name + '" title="' + name + '"></dt><dd class="blz-dial-para">' +name+':“'+ data.words + '”</dd>');
        $target.append($(dl));
        return $(dl);
    }

    //为元素添加偏移量,运行完毕后清除该元素
    function addAnimate($target, cssObject, t) {
        setTimeout(function () {
			$target.css(cssObject);
			setTimeout(function () {
				$target.remove();
			}, t);
        }, 30);//原设置时间为0，经测试效果不理想，改为30后，效果正常
    }

    //计算动画过渡时间
    function getTimes(w,data) {
       	var t = data.time * (data.displacement + w) / data.displacement;
        return t;
    }
	
	//添加弹幕消息
	function addDanmu(data,elem){
		if (data.data.length !== 0&&data.isOpen===false) {
			if(data.index >= data.data.length){data.newIndex=data.index = 0;}
			data.newIndex = data.newIndex>data.index?data.newIndex:data.index;
			var $target = assignMessage($(elem), data.data[data.index++]);
			var w=$target.width()+data.spacing;
			var t = getTimes(w,data);
			var l=data.clear.length;
			addAnimate($target, {
				'-webkit-transform': 'translate(' + (-data.displacement - w) + 'px)',
				'-webkit-transition-duration': t - data.parallax + 's',
				'transform': 'translate(' + (-data.displacement - w) + 'px)',
				'transition-duration': t - data.parallax + 's'
			}, (t - data.parallax) * 1000);
			data.clear[l]=setTimeout(function () {
				data.clear.splice(l,1);
				addDanmu(data,elem);
			}, 1000 * (t - data.parallax) * w / (data.displacement + w));
		}
	}
	
    //弹幕初始化
	$.fn.initDanmu=function(obj){
		return this.each(function(index,elem){
			$(elem).data('blz-danmu',new Danmu(obj));
		});
	};
	$('[data-blz-danmu]').initDanmu();
	
	//发送弹幕消息
	$.fn.sendWish=function(data){
		return this.each(function(index,elem){
			$(elem).data('blz-danmu').sendWish(data);
		});
	};
	//开始弹幕
    $.fn.danmuOpen=function() {
        return this.each(function(index,elem){
			var $elem=$(elem);
			var data=$elem.data('blz-danmu');
			var $danmu=$elem.children('li');
			if(data.isOpen===false){return false;}//防止重复开启弹幕及花屏
			data.isOpen=false;
			$danmu.each(function(index, eleme) {
				addDanmu(data,eleme);
            });
		});
    };
	$.fn.danmuClose=function(){
		return this.each(function(index,elem){
			var $elem=$(elem);
			var data=$elem.data('blz-danmu');
			if(data.isOpen===true){return false;}
			data.isOpen=true;
			$elem.find('li').html('');
			data.clear.forEach(function(a){
				clearTimeout(a);
			});
			data.clear=[];
		});
	};
	$('[data-blz-danmu]').initDanmu({time:8});
	$('[data-blz-danmu]').danmuOpen();
}(window.Zepto||window.jQuery);
//弹幕初始化

//金婚动画
+function ($) {
    'use strict';
	var $target=$('[data-blz-goldenwedding]');
    var $BPW = $('.blz-photo-wisher');
	var $alert=$('.blz-bk');
	var $SYA=$('.blz-see-you-again');
    var a = [
		2, 3, 4, 5, 6, 11, 13, 15, 16, 17, 18, 19,
		21, 22, 26, 27, 31, 33, 35, 38,
		41, 47, 51, 53, 55, 56, 57, 58, 59,
		60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 74, 75, 78,
		80, 84, 88, 91, 93, 95, 96, 98, 99,
		104, 111, 113,
		121, 122, 123, 124, 125, 126, 127, 131, 133, 135, 136, 137, 138, 139,
		144, 151, 153, 155, 159,
		161, 164, 167, 171, 173, 175, 176, 177, 178, 179,
		181, 182, 183, 184, 185, 186, 187, 191, 192, 193, 194, 195, 199,
		204, 213, 215, 219,
		220, 221, 222, 223, 224, 225, 226, 227, 228, 230, 231, 232, 233, 235, 236, 237, 238, 239
	];
	//金婚动画构造函数
	function GoldenWedding(font,a2){
		this.font=font||a;
		this.html=matrix(a2[0]||12,a2[1]||20);
		this.cachingData=[];
		this.copyFont=this.font.slice();
	}
	//矩阵
	function matrix(n,m){
		var frag=document.createDocumentFragment();
		for(var i=n*m;i>=1;i--){
			frag.appendChild(document.createElement('li'));
		}
		return frag;
	}
    
	//摆字
	function makeFont(a,lis){
		for (var i=a.length-1; i>=0; i--) {
        	lis.childNodes[a[i]].className+=' active';
    	}
	}
	
	//金婚初始化 
	function initmodule(fontApperance,matrix,$elem){//参数1为画字体所需要的方格位置的数组，参数2为画板的宽高的列数,参数三为被初始化的元素；
		var customData=new GoldenWedding(fontApperance||null,matrix||[12,20]);
		makeFont(customData.font,customData.html);
		$elem.data('blz-goldenwedding',customData).html(customData.html);
		customData.html=$elem.find('li');
	}
    //制作随机数
    function makeRandom(n) { //参数n为随机数的上限
        return Math.floor(Math.random() * n);
    }

    //数组自减
    function arrayDecrement(a, index) { //a为目标数组，index为要删除的数组值得索引
        return a.splice(index, 1);
    }
	
	//在加载之前对已经存在的数据进行初始化
	function initBeforeLoad($elem,data){
		var img = new Image();
		var data1=$elem.data('blz-goldenwedding');
		var a1=data1.copyFont;
		var $lis=data1.html;
		var aRandom = makeRandom(a1.length);
		img.src = data.url;
		$lis.eq(a1[aRandom]).html('<div style="display:block"><img src="' + img.src + '"></div>');
		arrayDecrement(a1, aRandom);
	}
	
	//图片点击效果
	function seeYouAgain(img,$target){
	    $target.html('<img src="' + img.src + '"><p>' + img.title + '</p><span>刚刚为Ta们购买</span>');
		$alert.fadeIn(300);
	}
	//初始化金婚动画模块
	$.fn.initGoldWedding=function(fontApperance,matrix,data){//参数三为在页面加载之前就已经存在的动画数据
		this.each(function(index,elem){
			initmodule(fontApperance||null,matrix||null,$(elem));
			for(var i=data.length-1;i>=0;i--){
				initBeforeLoad($(elem),data[i]);
			}
		});
		return this;
	};
	//插入图片函数
    $.fn.insertImage=function(data,callback) {
		return this.each(function(inde,elem){
			var _this=$(elem);
			var index=_this.data('index');
			var img = new Image();
			var div=document.createElement('div');
			var data1=_this.data('blz-goldenwedding');
			var a1=data1.copyFont;
			var $lis=data1.html;
			if(a1.length===0){return false;}//当金婚二字被填满时暂且退出动画！
			if($BPW.eq(index).is('.preparing')){//当动画正在执行的时候，如果再次执行动画，则会将传入的数据缓存到该dom元素的data-goldenwedding中
				data1.cachingData.push(data);
				return true;
			}
			$BPW.eq(index).addClass('preparing');
			img.src = data.url;
			img.title=data.name;
			$(img).attr('data-blz-img','1');
			img.onload = function () {
				var aRandom = makeRandom(a1.length);
				div.appendChild(this);
				$lis.eq(a1[aRandom]).append(div);
				$BPW.eq(index).html('<img src="' + this.src + '"><p>' + this.title + '</p><span>刚刚为Ta们购买</span>');
				setTimeout(function () {
					$lis.eq(a1[aRandom]).find('div').fadeIn(1000);
					$BPW.eq(index).addClass('animate');
					arrayDecrement(a1, aRandom);
					if(callback){callback();}
				}, 100);
				setTimeout(function () {
					$BPW.eq(index).removeClass('animate preparing');
					if(data1.cachingData.length!==0){
						_this.insertImage(data1.cachingData[0],callback);
						data1.cachingData.shift();
					}
				}, 5000);
			};
		});
    };
	$(document).on('click.blz.alert','[data-blz-img="1"]',function(event){
		var $elem=$(event.target);
		seeYouAgain(event.target,$SYA);
	});
	//对已经标有blz-data-goldenwedding的dom元素进行金婚动画初始化;
	$target.initGoldWedding(null,null,[]);
}(window.jQuery);

//关闭功能插件
+function($){
	'use strict';
	function closeWindow($target){
	    $target.fadeOut();   
	}
	$(document).on('touchend','.blz-bk',function(){
		closeWindow($(this));
	});
}(window.jQuery);

//金婚动画数据请求
+function($){
	'use strict';
	var tip={
		value:0,
		tip:0,
		$targets:$('.blz-photo-wall'),
		$target:$('.blz-bigger.blz-red')
	};
	
	//每次执行动画时对金额数进行更改
	function increatMoney(){
		tip.value+=1;
		tip.$target.html(tip.value);
	}
	//每间隔一秒从服务器获取数据
	function getData(){
		$.ajax({
			url:'../danmu-copy2/json/data.json',
			success:function(data){
				for(var i=data.length-1;i>=0;i--){
					tip.tip=tip.tip>=data[i].index?tip.tip:data[i].index;
					tip.$targets.insertImage(data[i],increatMoney);
				}
			},
			error:function(){
				throw new Error('请求失败');
			}
		});
	}
	getData();
	setInterval(getData,10000);
}(window.jQuery);
//金婚动画
//底部99元bug修复5-19
+function($){
	//输入框聚焦时关闭底部导航条
	function hide(){
		if($('.blz-50-link').data('blz-dismiss')===0){return false;}
		$('.blz-50-link').hide();
	}
	function show(){
		if($('.blz-50-link').data('blz-dismiss')===1){$('.blz-50-link').show();}
	}
    $(document).on('focus','#talkInputId',hide);
	$(document).on('blur','#talkInputId',show);
}(window.jQuery);