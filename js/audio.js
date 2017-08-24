/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2017-06-11 20:04:56
 * @version $Id$
 */
function toDou(n){
	return n>9?n:'0'+n;
}
function tim(t){
	var m=Math.floor(t/60);
	var s=Math.floor(t%60);
	return toDou(m)+':'+toDou(s);
}
document.addEventListener('DOMContentLoaded',function (){
	// 创建歌曲列表
	var music=document.querySelector('#music'),
		box=document.querySelector('#music ul');
	
	for(var i=0; i<arr.length; i++){
		var oLi=document.createElement('li');
		oLi.innerHTML='<div><a class="mu-play" href="javascript:;"></a></div>'+
                        '<div class="mu-name">'+
                            '<a class="song-name" href="#">'+arr[i].name+'</a>'+
                            '<a class="song-mv" href="#"></a></div>'+
                        '<div class="mu-ctrl">'+
                            '<a class="song-add" href="javascript:;"></a>'+
                            '<a class="song-fav tw" href="javascript:;"></a>'+
                            '<a class="song-share tw" href="javascript:;"></a>'+
                            '<a class="song-dl tw" href="javascript:;"></a></div>'+
                        '<div class="mu-singer">'+
                            '<a href="#">'+arr[i].singer+'</a></div>'+
                        '<div class="mu-album">'+
                        '<a href="#">'+arr[i].album+'</a></div>'+
                        '<div class="mu-time">'+arr[i].time+'</div>';
        box.appendChild(oLi);
	}

	var oA=new Audio(),
		play=document.querySelector('#play'),
		prev=document.querySelector('#prev'),
		next=document.querySelector('#next'),
		curT=document.querySelector('.me-time i'),
		durT=document.querySelector('.me-time b'),
		s_name=document.querySelector('.mu-text .song'),
		s_ser=document.querySelector('.mu-text .singer');
	oA.src='mp3/'+arr[0].name+'.mp3';
	s_name.innerHTML=arr[0].name;
	s_ser.innerHTML=arr[0].singer;
	// 点击音乐列表里的播放按钮播放音乐
	var iNow=0;
	box.onclick=function (ev){
		var aLi=box.children;
		var s=ev.srcElement||ev.target;
		if(s.className=='mu-play'){
			for(var i=0; i<aLi.length; i++){
				if(s.parentNode.parentNode==aLi[i]){
					iNow=i;
				}
			}
			tabMusic(iNow);
		}
	};
	function onPlay(){
		oA.play();
		play.classList.remove('btn-play');
		play.classList.add('btn-pause');
	}
	function tabMusic(index){
		oA.src='mp3/'+arr[index].name+'.mp3';
		s_name.innerHTML=arr[index].name;
		s_ser.innerHTML=arr[index].singer;
		durT.innerHTML=arr[index].time;
		onPlay();
		n=1;
	}
	
	// 播放暂停
	var n=0;
	play.onclick=function (){
		if(n%2==0){
			onPlay();
			durT.innerHTML=tim(oA.duration);
		}else{
			oA.pause();
			play.classList.remove('btn-pause');
			play.classList.add('btn-play');
		}
		n++;
	}
	// 进度条
	var oM=document.querySelector('.meter .cur');
	oA.ontimeupdate=function (){
		curT.innerHTML=tim(oA.currentTime);
		var scale=oA.currentTime/oA.duration;
		oM.style.width=(scale*100)+'%';
		x=scale*493;
	};
	//点击进度条
	var oBg=document.querySelector('.meter .me-bg');
	oBg.onclick=function (ev){
		var oX=ev.clientX-oBg.getBoundingClientRect().left,
			scale=oX/493;
		oM.style.width=(scale*100)+"%";
		oA.currentTime=scale*oA.duration;
		durT.innerHTML=tim(oA.duration);
		onPlay();
		n=1;
	};
	// 拖拽进度按钮
	var pBtn=document.querySelector('.meter .cur-btn'),
		x=0;
	pBtn.onmousedown=function (ev){
		var oldX=ev.clientX-x;
		document.onmousemove=function (ev){
			x=ev.clientX-oldX;
			var scale=x/493;
			if(scale>1){
				scale=1;
			}else if(scale<0){
				scale=0;
			}
			oM.style.width=(scale*100)+"%";
			oA.currentTime=scale*oA.duration;
		};
		document.onmouseup=function (){
			document.onmousemove=null;
			document.onmouseup=null;
		};
		return false;
	};
	//音量
	var vol=document.querySelector('.ctrl .volume'),
		vol_bar=document.querySelector('.ctrl .vol-bar'),
		m=0;
	vol.onclick=function (){
		if(m%2==0){
			vol_bar.style.visibility='visible';
		}else{
			vol_bar.style.visibility='hidden';
		}
		m++;
	};
	
	// 拖拽音量
	var vol_btn=document.querySelector('.ctrl .vol-btn'),
		vol_cur=document.querySelector('.ctrl .vol-cur'),
		vol_bg=document.querySelector('.ctrl .vol-bg'),
		y=46;
	vol_bg.onclick=function (ev){
		var oY=vol_cur.getBoundingClientRect().bottom-ev.clientY,
			scale=oY/92;
		vol_cur.style.height=(scale*100)+'%';
		oA.volume=scale;
		y=oY;
	};
	vol_btn.onmousedown=function (ev){
		var oldY=ev.clientY+y;
		document.onmousemove=function (ev){
			y=oldY-ev.clientY;
			var scale=y/92;
			if(scale>1){
				scale=1
			}else if(scale<0){
				scale=0;
			}
			vol_cur.style.height=(scale*100)+'%';
			oA.volume=scale;
		};
		document.onmouseup=function (){
			document.onmousemove=null;
			document.onmouseup=null;
		};
		return false;
	};
	//播放器锁定
	var lock=document.querySelector('.playbar .lock'),
		playBar=document.querySelector('.btmbar .playbar'),
		openBar=document.querySelector('.playbar .openbar'),
		bOK=true, is='';
	lock.onclick=function (){
		if(bOK){
			this.style.backgroundPosition='-80px -400px';
			is='down';
		}else{
			this.style.backgroundPosition='-100px -380px';
			is='up';
		}
		bOK=!bOK;
	};
	playBar.onmouseleave=function (){
		if(is=='down'){
			setTimeout(function (){
				playBar.style.top='-7px';
			},800);
		}
	};
	// var ti=null;	定时器快速划过不显示
	lock.onmouseenter=openBar.onmouseenter=function (){
		// clearTimeout(ti);
		// ti=setTimeout(function (){
			playBar.style.top='-53px';
		// },300);
	};
	/*lock.onmouseleave=openBar.onmouseleave=function (){
		clearTimeout(ti);
	};*/
	//点击循环按钮
	var loop=document.querySelector('.ctrl .tab-play'),
		loop_tip=document.querySelector('.ctrl .loop-tip'),
		loop_str='loop';
	loop.onclick=function (){
		switch (loop_str) {
			case 'loop':
				loop_tip.innerHTML='随机';
				loop.className='bg5 tab-paly rand';
				loop_tip.style.display='block';
				loop_str='rand';
				break;
			case 'rand':
				loop_tip.innerHTML='单曲循环';
				loop.className='bg5 tab-paly single';
				loop_tip.style.display='block';
				loop_str='single';
				break;
			case 'single':
				loop_tip.innerHTML='循环';
				loop.className='bg5 tab-paly loop';
				loop_tip.style.display='block';
				loop_str='loop';
				break;
		}
		setTimeout(function (){
			loop_tip.style.display='none';
		},2000);
	};
	//歌曲播放完后事件
	oA.onended=function (){
		var i=iNow;
		switch (loop_str) {
			case 'loop':
				net();
				break;
			case 'rand':
				iNow=Math.floor(Math.random()*arr.length);
				if(iNow==i){
					prv();
					return;
				}
				tabMusic(iNow);
				break;
			case 'single':
				iNow=iNow;
				tabMusic(iNow);
				break;
		}
		x=0;
	};
	//上一首下一首
	function net(){
		iNow++;
		if(iNow==arr.length){
			iNow=0;
		}
		tabMusic(iNow);
	}
	function prv(){
		iNow--;
		if(iNow==-1){
			iNow=arr.length-1;
		}
		tabMusic(iNow);
	}
	next.onclick=function (){
		net();
	};
	prev.onclick=function (){
		prv();
	};
},false);
