//加载完毕事件
window.onload = function(){
	//1.顶部通栏滚动效果
	headerScroll();
	//2.轮播图效果
	banner();
	//3.倒计时效果
	cutDownTime();
}
//通栏方法
/*
	获取导航栏的高度
	在onscroll事件中修改透明度
	透明度=滚动距离/导航栏  大于1直接取1	
	为了保证子元素能够正常显示 用rgba()修改透明度 hsla()
 */
function headerScroll(){	
	//1.获取参数
	/*
		导航栏的高度
		顶部通栏
	*/
	var navDom = document.querySelector(".jd_nav");
	//导航栏距顶部的距离+自身的高度
	var maxDistance = navDom.offsetTop+navDom.offsetHeight;	
	var headerDom = document.querySelector(".jd_header");
	//初始化透明度为0
	headerDom.style.backgroundColor = 'rgba(201,21,35,0)';
	//2.注册onscoll事件
	window.onscroll = function () {
		// 获取滚动距离
		var scrollDistance = window.document.body.scrollTop;		
		// 计算透明度 透明度=滚动距离/导航栏
		var percent =  scrollDistance/maxDistance;
		if(percent>1){
			percent=1;
		}
		// 设置通栏透明度
		headerDom.style.backgroundColor = 'rgba(201,21,35,'+percent+')';
	}
}

// 轮播图

/*
	添加过渡结束监听事件 需要加私有前缀 webkitTransition
	修改ul位置时，会使用过渡
	当注册了 过渡结束事件后 每次过渡完毕后 都会调用该事件
	将判断index是否越界 以及修改索引的代码 写在 过渡结束事件中
	使用touch事件实现手指滑动
	touchstart  记录开始值 关闭定时器 关闭过渡效果
	touchmove   计算移动值，修改ul位置(在原始值的基础上修改 没有过渡效果)
	touchend    记录移动的距离 开启定时器
 */
function banner(){
	//屏幕的宽度
	var width = document.body.offsetWidth;
	//轮播图ul
	var img = document.querySelector('.jd_banner .banner_img');
	//添加过渡 定时器中添加了过渡  此时不需要添加了
	// img.style.transition = 'all 0.3s';
	//索引li
	var indexArr = document.querySelectorAll('.jd_banner .banner_index li');
	//定义index记录当前索引值
	//由于为了动画效果轮播，在首尾增加了图片 所以index=1时为第一张图片
	var index = 1;
	//开启定时器
	var timer = setInterval(function(){
		index++;
		//开启过渡
		img.style.transition = 'all 0.3s';
		//修改ul位置
		img.style.transform = 'translateX('+index*width*-1+'px)';
		
	},2000)
	//添加过渡结束事件  修改index的值 
	img.addEventListener('webkitTransitionEnd',function(){
		// index=9时过渡结束 也就是过渡到index=9 关闭过渡 马上跳到index=1处
		if(index>8){
			index= 1 ;
			img.style.transition = '';
			img.style.transform = 'translateX('+index*width*-1+'px)';
		}else if(index<1){
			index = 8;
			img.style.transition = '';
			img.style.transform = 'translateX('+index*width*-1+'px)';
		}
		for(var i=0;i<indexArr.length;i++){
			indexArr[i].className = "";
		}
		
			indexArr[index-1].className = "current";
		
		
	})
	//注册三个touch事件
	
	//定义变量 记录开始在X上的位置
	var startX = 0;
	//定义变量 记录移动的值
	var moveX = 0;
	////定义变量 记录总共移动的值
	var distanceX = 0;
	img.addEventListener('touchstart',function(evevt){
		//关闭定时器
		clearInterval(timer);
		//关闭过渡效果
		img.style.transition = '';
		//记录开始值
		startX = event.touches[0].clientX;

	})
	img.addEventListener('touchmove',function(event){
		//计算移动的值
		moveX = event.touches[0].clientX-startX;		
		//移动img  当前位置（-index*width）移动
		img.style.transform = 'translateX('+(-index*width+moveX)+'px)';
	})
	/*
		手指松开的时候 判断 移动的距离 进行是否吸附
		      吸附回的值是index*-1*width
		      如果移动 的距离较大
		      		判断正负（左移右移）
		      		 index++
		      		 index--
	 */
	img.addEventListener('touchend',function(){
		//记录结束值
		distanceX+=moveX;
		if(Math.abs(moveX)>width/2){
			if(moveX>0){
				//手指右滑
				index--;
			}else{
				//手指左滑
				index++;
			}
			//开启过渡
			img.style.transition = 'all 0.3s';
			//
			img.style.transform = 'translateX('+(-index*width)+'px)';
		}else{
			//开启过渡
			img.style.transition = 'all 0.3s';
			//吸附回来
			img.style.transform = 'translateX('+(-index*width)+'px)';
		}
		//开启定时器
		timer = setInterval(function(){		
			index++;	
			//开启过渡
			img.style.transition = 'all 0.3s';
			//修改ul位置
			img.style.transform = 'translateX('+index*width*-1+'px)';
		
		},2000)
	})
}
//倒计时
/*
	倒计时的总时间
	获取修改的元素
	开启定时器 递减时间
	修改元素中的内容显示
 */
function cutDownTime() {
	//每晚8(20)点
	var nowTime = new Date();
	var nowHour = nowTime.getHours();
	var nowMinute = nowTime.getMinutes();
	var nowSecond = nowTime.getSeconds();
	var totalHour = 20-nowHour;
	var totalSeconds = totalHour>0?(totalHour*60*60-nowMinute*60-nowSecond):(-totalHour*60*60-nowMinute*60-nowSecond);
	var liArr = document.querySelectorAll('.main_content .content_top ul li');
	inner(totalSeconds,liArr);
	//定义定时器
	var time = setInterval(function(){
		totalSeconds--;
		inner(totalSeconds,liArr);
	},1000)
	
}
function inner(totalSeconds,liArr){
	var hour = Math.floor(totalSeconds/3600);
	var minutes = Math.floor((totalSeconds%3600)/60);
	var seconds = totalSeconds%60;		
	liArr[0].innerHTML = Math.floor(hour/10); 
	liArr[1].innerHTML = hour%10;
	liArr[3].innerHTML = Math.floor(minutes/10);
	liArr[4].innerHTML = minutes%10;
	liArr[6].innerHTML = Math.floor(seconds/10);
	liArr[7].innerHTML = seconds%10;
}


// 无动画效果
function banner_01(){
	//屏幕的宽度
	var width = document.body.offsetWidth;
	//轮播图ul
	var img = document.querySelector('.jd_banner .banner_img');
	//
	//索引li
	var indexArr = document.querySelectorAll('.jd_banner .banner_index li');
	//定义index记录当前索引值
	//由于为了动画效果轮播，在首尾增加了图片 所以index=1时为第一张图片
	var index = 1;
	var timer = setInterval(function(){
		index++;
		if(index>=9){
			index = 1;
		}
		//修改ul的位置
		//x正方向是向右，而图片向左，所以负值
		img.style.transform = 'translateX('+index*width*-1+'px)'
		for(var i=0;i<indexArr.length;i++){
			indexArr[i].className = "";
		}
		indexArr[index-1].className = "current";
	},2000)
}
/*有动画过渡效果 使用css3中transition
	当轮播到最后一张index=9时 瞬间切换到index=1 关闭过渡	
	当index=2时开启过渡
	
*/
function banner_02(){
	//屏幕的宽度
	var width = document.body.offsetWidth;
	//轮播图ul
	var img = document.querySelector('.jd_banner .banner_img');
	//添加过渡
	img.style.transition = 'all 0.3s';
	//索引li
	var indexArr = document.querySelectorAll('.jd_banner .banner_index li');
	//定义index记录当前索引值
	//由于为了动画效果轮播，在首尾增加了图片 所以index=1时为第一张图片
	var index = 1;
	var timer = setInterval(function(){
		index++;
		if(index>9){
			index = 1;
			//关闭过渡
			img.style.transition = '';
		}
		if(index === 2){
			img.style.transition = 'all 0.3s';
		}
		//修改ul的位置
		//x正方向是向右，而图片向左，所以负值
		img.style.transform = 'translateX('+index*width*-1+'px)'
		for(var i=0;i<indexArr.length;i++){
			indexArr[i].className = "";
		}
		if(index === 9){
			indexArr[0].className = "current";
		}else{
			indexArr[index-1].className = "current";
		}
	},2000)
}
