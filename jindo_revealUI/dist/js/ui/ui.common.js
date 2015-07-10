var EmartMO = EmartMO || {};
EmartMO.util = EmartMO.util || {};
EmartMO.Event = EmartMO.Event || {};
EmartMO.view = EmartMO.view || {};
EmartMO.util = {
    getUrlVars: function() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name) {
        return EmartMO.util.getUrlVars()[name];
    },
	wait: function (e) {
        var t = $.Deferred();
        setTimeout(t.resolve, e);
        return t.promise();
    }
};


EmartMO.Event.emitter = {
    subscribers: {},
    on: function (e, t, n) {
        this.subscribers[e] = this.subscribers[e] || [];
        this.subscribers[e].push({
            callback: t,
            context: n
        });
    },
    off: function (e, t, n) {
        var r, i = this.subscribers[e],
            s;
        if (i) {
            r = i.length - 1;
            while (r >= 0) {
                s = i[r];
                if (s.callback === t && (!n || s.context === n)) {
                    i.splice(r, 1);
                    break;
                }
                r--;
            }
        }
    },
    emit: function (e) {
        var t = this.subscribers[e],
            n = 0,
            r = Array.prototype.slice.call(arguments, 1),
            i;
        if (t) {
            while (n < t.length) {
                i = t[n];
                i.callback.apply(i.context || this, r);
                n++;
            }
        }
    }
};



EmartMO.view.global = function() {
    this.init();
};
EmartMO.view.global.prototype = {
    htSize: jindo.$Document().clientSize(),
    oReveal: null,
    oScrollNav: null,
    oScrollNavHeight: null,
    nDelay: jindo.m.getDeviceInfo().android ? 0 : 0,
    oScroll: null,
	oLoading : null,
	oScrollPopup: null,
	dDatapicker : null,
	dRangepicker1 : null,
	dRangepicker2 : null,
	sDevice : jindo.m.getDeviceInfo().ipad || jindo.m.getDeviceInfo().galaxyTab || jindo.m.getDeviceInfo().galaxyTab2 ? 650 : 45,
	nGap : 100,
    htOtherFlick: {
        header: function(){
			if ($(".jmc-header").length > 0 ) {
				return jindo.$Element(jindo.$$.getSingle(".jmc-header")).height()
			} else {
				return false
			}
		},
        footer: function(){
			if ($(".jmc-footer").length > 0 ) {
				return jindo.$Element(jindo.$$.getSingle(".jmc-footer")).height()
			} else {
				return false
			}
		}
    },
    init: function() {
        console.log('■ import Global');
        this._assignElements();
        this._attachEventHandlers();
        this._setJindoReveal();
		this._initLoading();
		this._setSearchMenu();
		this._setFooterLinkMenu();
		this._setTextInput();
		this._setDialog();
		this._setDatepicker();
		this._setRangepicker1();
		this._setRangepicker2();
		//this._setMainGnb();
        this.ready();
    },
    _assignElements: function() {
        this.welDoc = $(document.body);
        this.welHeader = $('.reveal-header');
    },
    _attachEventHandlers: function() {
        this.welDoc.on('click', 'a[href="#"]', $.proxy(this._onClickEventPrevent, this));
		// disable
        this.welDoc.on('click', '._revealToggle', $.proxy(this._toggleReveal, this));
		this.welDoc.on('click', '.nav-mask', $.proxy(this._toggleReveal, this));
        this.welDoc.on('click', '.reveal_dim', $.proxy(this._toggleReveal, this));

		this.welDoc.on('click', '.rs-nav .menu li', $.proxy(this._onClickNavMenu, this));

		this.welDoc.on('click', '._imgGallery', $.proxy(this._onClickGallery, this));
		this.welDoc.on('click', '#_btnSearch', $.proxy(this._onClickSearchMenu, this));
		this.welDoc.on('click', '#_btnLink', $.proxy(this._onClickFooterLinkMenu, this));
		this.welDoc.on('click', '._popupClose', $.proxy(this.offPopupScroll, this));
		//this.welDoc.on('click', '._gnb li', $.proxy(this._onClickGnb, this));
		this.welDoc.on('click', '._gnb li', $.proxy(this._onClickGnb, this));

		this.welDoc.on('click', '#accordion_panel dt', $.proxy(this._onClickAccordion, this));


		this.welDoc.on('click', '#_accordion li .btn-toggle', $.proxy(this._onClickAccordionList, this));
		//inputPosition
		this.welDoc.on('focus', '#inputPosition input', $.proxy(this._onFocusInputPosition, this));
		this.welDoc.on('blur', '#inputPosition input', $.proxy(this._onBlurInputPosition, this));
		//품질불량 이미지 삭제
		//this.welDoc.on('click', '._imgList li .del-img', $.proxy(this._onClickClaimDelIgm, this));

		//폰트 사이즈 변경
		this.welDoc.on('click', '._changeFont ._fontsizeplus', $.proxy(this._onClickFontPlus, this));
		this.welDoc.on('click', '._changeFont ._fontsizeminus', $.proxy(this._onClickFontMinus, this));

		//말줄임표
		this.welDoc.on('click', $.proxy(this._onClickRemoveEllipsis, this));
		this.welDoc.on('click', '.func-ellipsis .pro-status', $.proxy(this._onClickEllipsis, this));



    },
	_initLoading : function(){
		this.oLoading = new jindo.m.Loading(null, {
			bActivateOnload : true,
			nWidth : 31,
			nHeight : 31,
			sDefaultForeground : "transparent",
			sDefaultBackground : "transparent",
			sLoadingText : "",
			bUseFoggy : true,
			sFoggyColor : "#000",
			nFoggyOpacity : 0.75
		});
	},
    _toggleReveal: function(event) {
		if ( !$(event.currentTarget).hasClass('disable') && jindo.$Document().clientSize().height >= 400) {
			console.log('%c Alert : 사이드 메뉴 설정 완료', "color: #00f;");
			this.oReveal.toggle();
		}
    },
    _setJindoReveal: function() {
		if(!$('.rs-body').length){ return false; }
		console.log('%c Alert : 메인 가상 스크롤 완료', "color: #00f;");
		console.log(this.sDevice);
        var oThis = this;
		jindo.$Element(jindo.$$.getSingle(".rs-contents")).height(oThis.htSize.height);
		setTimeout(function() {
			if(!$('.jmc_scrolldisable').length){
				oThis.oScroll = new jindo.m.Scroll("contents", {
					bUseHScroll: false,
					bUseVScroll: true,
					bUseBounce : false,
					nHeight: oThis.htSize.height - oThis.htOtherFlick.header() - oThis.htOtherFlick.footer()
				});
				//console.log(oThis.htSize.height)
				//console.log(oThis.htOtherFlick.header)
				//console.log(oThis.htOtherFlick.footer)
			}

			oThis.oReveal = new jindo.m.SlideReveal({
					"sClassPrefix": "rs-",
					"nDuration": 300,
					"nMargin": oThis.sDevice,
					"sDirection": "left"
				})
			.attach({
				"beforeShow": function() {
					jindo.$Element(jindo.$$.getSingle(".rs-nav")).show();
					if (!oThis.oScrollNav) {
						oThis.oScrollNavHeight = parseInt(jindo.$Element(jindo.$$.getSingle(".nav_title")).height());
						oThis.oScrollNav = new jindo.m.Scroll("celeblist_scroll", {
							bUseHScroll: false,
							bUseVScroll: true,
							bUseBounce : false,
							nHeight: oThis.htSize.height - oThis.oScrollNavHeight
						});
						oThis._onScrollMenu();
					}

				},
				"show": function() {
					var nBottom = oThis.htSize.height - oThis.oScrollNavHeight -$('.menu-tree').last().height();
					$('.menu-tree-wrap').css('padding-bottom', nBottom);

					// 화면에 보여지고 난 이후 wraper 영역 (overflow:hidden) 처리를 위한 높이값 재정의 필요.
					if (oThis.oScrollNav) {
						oThis.oScrollNav.height(oThis.htSize.height - oThis.oScrollNavHeight);
					}
					if( !$('.nav-mask').length ){
						$('.rs-body').append('<div class="nav-mask"></div>');
					}
					console.log('%c Alert : 페이지 활성화 스크롤', "color: #00f;");

					//전역함수
					//nativeBackBtnCloseAllMenu();//개발 적용하면 안됨
					//var nIdx = getPageDepth();//개발 적용하면 안됨
					var nIdx = 3; //테스트용
					oThis.goNavScroll(nIdx);

				},
				"beforeHide": function() {
					var mask = $('.nav-mask');
					if( mask.length ){
						mask.remove();
					}
				},
				"hide": function(oCustomEvent) {
					//touchAllMenu();//개발 적용하면 안됨
				},
				"rotate": function() {
					//if (oThis.oScroll) {
					//	oThis.oScroll.height(jindo.$Document().clientSize().height - oThis.htOtherFlick.header() - oThis.htOtherFlick.footer());
					//	$('.rs-contents').height(jindo.$Document().clientSize().height);
					//}
				}
			});
		}, this.nDelay);

		// 아이폰 rotate 이벤트 발생 안함 : resize이벤트로 대체 : 대체후 refresh() 이벤트 필요함
		$(window).on('resize', function(){

			//메뉴 나왔을경우 회전시 닫힘
			oThis.oReveal.hide();

			if (oEmartMO.oScroll) {
				oEmartMO.oScroll.height(jindo.$Document().clientSize().height - oEmartMO.htOtherFlick.header() - oEmartMO.htOtherFlick.footer());
				$('.rs-contents').height(jindo.$Document().clientSize().height);
			}
			if (oEmartMO.oScrollPopup) {
				oEmartMO.oScrollPopup.height(jindo.$Document().clientSize().height - $('._PopupGlobal ._popupHeader').outerHeight(true) - $('._PopupGlobal ._popupFooter').outerHeight(true));
			}
		})
    },

	_setSearchMenu : function(){
		if(!$('#_searchMenu').length){ return false; }
		this.oSearchMenu = new jindo.m.LayerManager("_searchMenu").link("_searchMenu", "_btnSearch")
			.attach("beforeShow", function(we) {
				console.log(we.sType );
			})
			.attach("show", function(we) {
				console.log(we.sType );
			})
			.attach("beforeHide", function(we) {
				console.log(we.sType );
			})
			.attach("hide", function(we) {
				console.log(we.sType );
			})
			.attach("ignore", function(we) {
				console.log(we.sType );
			});
	},
	_setFooterLinkMenu : function(){
		if(!$('#_linkMenu').length){ return false; }
		this.oLinkMenu = new jindo.m.LayerManager("_linkMenu").link("_linkMenu", "_btnLink")
			.attach("beforeShow", function(we) {
				console.log(we.sType );
				$('#_btnLink').addClass('on')
			})
			.attach("show", function(we) {
				//console.log(we.sType );
			})
			.attach("beforeHide", function(we) {
				$('#_btnLink').removeClass('on');
				console.log(we.sType );
			})
			.attach("hide", function(we) {
				//console.log(we.sType );
			})
			.attach("ignore", function(we) {
				console.log(we.sType );
			});
	},
	_setTextInput : function(){
		if(!$('#form_base').length){ return false; }
		console.log('%c Alert : 텍스트 인풋 셋팅 완료', "color: #00f;");
		this.oTextInput = new jindo.m.TextInput("form_base");
	},
	_setTextInputPopup : function(){
		if(!$('#form_popup').length){ return false; }
		console.log('%c Alert : 텍스트 인풋 팝업 셋팅 완료', "color: #00f;");
		this.oTextInputPopup = new jindo.m.TextInput("form_popup");
	},
	_setDialog : function(){
		this.oDialog = new jindo.m.Dialog({
			sClassPrefix : "alert-",
			sPosition : "center",
			bUseEffect : false,
			bAutoClose : false,
			bAutoReposition : true,
			nFoggyOpacity : 0.75,
			sFoggyColor : "#000"
		});
	},

	_setDatepicker : function(){
		if(!$('#datepicker').length){ return false }
		console.log('%c Alert : 날자 선택창 셋팅완료', "color: #00f;");
		this.oDate = new Date();
		this.oDatepicker = new jindo.m.Datepicker(null,{bUseEffect : true});

		var oInput = this.oDatepicker;
		var sInputName = 'datepicker';
		var sBtnName = 'datepicker_btn';

		oInput.addDatePickerSet(sInputName,{
		    elButton : jindo.$(sBtnName),
			sPosition: "bottomLeft"
		});
		var oThis = this;
		oInput.attach({
			"beforeShowCalendar" : function(){
				//console.log("달력 beforeShowCalendar 이벤트");
				var oClientSize = jindo.$Document(document).clientSize();
				var oElementOffset = jindo.$Element(sInputName).offset();
				var nCalandarHeight = 310;
				//console.log(oClientSize.height);
				//console.log(oElementOffset.top);
				if (oClientSize.height - oElementOffset.top < nCalandarHeight+30 && jindo.$Document().clientSize().height >= 400){
					oThis.oDatepicker.setPosition(sInputName,'topLeft');
					var nTop = nCalandarHeight - oElementOffset.top;
					var nScrollPos = oThis.oScroll._nTop;
					var nSetPos = nScrollPos + nTop;
					//console.log(nTop);
					//console.log(nScrollPos);
					//console.log("nSetPos : " + nSetPos);
					oThis.oScroll.scrollTo(0,nSetPos, 500 )
				} else {
					oThis.oDatepicker.setPosition(sInputName,'bottomLeft')
				}
			},
			"selectDate" : function(we){
				console.log(we.oSelectDate);
				console.log("["+we.oSelectDate.nYear+"-"+we.oSelectDate.nMonth+"-"+we.oSelectDate.nDate+"]날짜 선택 selectDate 이벤트 발생.");
				oThis.dDatapicker = we.oSelectDate;
			}
		});
	},
	_setDatepicker2 : function(){
		if(!$('#datepicker').length){ return false }
		console.log('%c Alert : 날자 선택창 셋팅완료', "color: #00f;");
		this.oDate = new Date();
		this.oDatepicker2 = new jindo.m.Datepicker(null,{bUseEffect : true});

		var oInput = this.oDatepicker2;
		var sInputName = 'datepicker2';
		var sBtnName = 'datepicker_btn2';

		oInput.addDatePickerSet(sInputName,{
			elButton : jindo.$(sBtnName),
			sPosition: "bottomLeft"
		});
		var oThis = this;
		oInput.attach({
			"beforeShowCalendar" : function(){
				//console.log("달력 beforeShowCalendar 이벤트");
				var oClientSize = jindo.$Document(document).clientSize();
				var oElementOffset = jindo.$Element(sInputName).offset();
				var nCalandarHeight = 310;
				//console.log(oClientSize.height);
				//console.log(oElementOffset.top);
				if (oClientSize.height - oElementOffset.top < nCalandarHeight+30 && jindo.$Document().clientSize().height >= 400){
					oThis.oDatepicker2.setPosition(sInputName,'topLeft');
					var nTop = nCalandarHeight - oElementOffset.top;
					var nScrollPos = oThis.oScroll._nTop;
					var nSetPos = nScrollPos + nTop;
					//console.log(nTop);
					//console.log(nScrollPos);
					//console.log("nSetPos : " + nSetPos);
					oThis.oScroll.scrollTo(0,nSetPos, 500 )
				} else {
					oThis.oDatepicker2.setPosition(sInputName,'bottomLeft')
				}
			},
			"selectDate" : function(we){
				console.log(we.oSelectDate);
				console.log("["+we.oSelectDate.nYear+"-"+we.oSelectDate.nMonth+"-"+we.oSelectDate.nDate+"]날짜 선택 selectDate 이벤트 발생.");
				oThis.dDatapicker = we.oSelectDate;
			}
		});
	},

	_setRangepicker1 : function(){
		if(!$('#rangepicker1').length){ return false }
		console.log('%c Alert : 범위 날짜 앞 셋팅완료', "color: #00f;");
		this.oDate = new Date();
		this.oRangepicker1 = new jindo.m.Datepicker(null,{bUseEffect : true});

		var oInput = this.oRangepicker1;
		var sInputName = 'rangepicker1';
		var sBtnName = 'rangepicker_btn1';

		oInput.addDatePickerSet(sInputName,{
		    elButton : jindo.$(sBtnName),
			sPosition: "bottomLeft"
		});
		var oThis = this;
		oInput.attach({
			"beforeShowCalendar" : function(){
				var oClientSize = jindo.$Document(document).clientSize();
				var oElementOffset = jindo.$Element(sInputName).offset();
				if (oClientSize.height -oElementOffset.top < 350  ){
					oThis.oRangepicker1.setPosition(sInputName,'topLeft')
				} else {
					oThis.oRangepicker1.setPosition(sInputName,'bottomLeft')
				}
			},
			"selectDate" : function(we){
				console.log(we.oSelectDate);
				console.log("["+we.oSelectDate.nYear+"-"+we.oSelectDate.nMonth+"-"+we.oSelectDate.nDate+"]날짜 선택 selectDate 이벤트 발생.");
				oThis.dRangepicker1 = we.oSelectDate;
			}
		});
	},


	_setRangepicker2 : function(){
		if(!$('#rangepicker2').length){ return false }
		console.log('%c Alert : 범위 날짜 뒤 셋팅완료', "color: #00f;");
		this.oDate = new Date();
		this.oRangepicker2 = new jindo.m.Datepicker(null,{bUseEffect : true});

		var oInput = this.oRangepicker2;
		var sInputName = 'rangepicker2';
		var sBtnName = 'rangepicker_btn2';

		oInput.addDatePickerSet(sInputName,{
		    elButton : jindo.$(sBtnName),
			sPosition: "bottomLeft"
		});
		var oThis = this;
		oInput.attach({
			"beforeShowCalendar" : function(){
				var oClientSize = jindo.$Document(document).clientSize();
				var oElementOffset = jindo.$Element(sInputName).offset();
				if (oClientSize.height -oElementOffset.top < 350  ){
					oThis.oRangepicker2.setPosition(sInputName,'topLeft')
				} else {
					oThis.oRangepicker2.setPosition(sInputName,'bottomLeft')
				}
			},
			"selectDate" : function(we){
				console.log(we.oSelectDate);
				console.log("["+we.oSelectDate.nYear+"-"+we.oSelectDate.nMonth+"-"+we.oSelectDate.nDate+"]날짜 선택 selectDate 이벤트 발생.");
				oThis.dRangepicker2 = we.oSelectDate;
			}
		});
	},

	_setMainGnb : function(){
		if(!$('._gnb').length){ return false; }
		console.log('%c Alert : 메인 페이지 플립 셋팅 완료', "color: #00f;");
		$("._gnb li").flip();
	},


	_onClickAccordion : function(event){
		var target = $(event.currentTarget);
		this.welDoc.find('#accordion_panel dd').removeClass('show');
		target.next('dd').toggleClass('show');
	},
	_onClickEventPrevent: function(event) {
        event.preventDefault();
    },

	_onClickGallery : function() {
       	$.fancybox.open([
	        {
	            href : 'http://fancyapps.com/fancybox/demo/1_b.jpg',
	            title : '1st title'
	        },
	        {
	            href : 'http://fancyapps.com/fancybox/demo/2_b.jpg',
	            title : '#'
	        },
	        {
	            href : '',
	            title : ''
	        }
	    ], {
	        padding : 0
	    });
    	return false;
    },
	_onClickSearchMenu : function(){
		oEmartMO.oSearchMenu.toggle()
	},

	_onClickFooterLinkMenu : function(){
		this.oLinkMenu.toggle()
	},
	// 전체메뉴 클릭시 이벤트
	_onClickNavMenu : function(event){
		var target = $(event.currentTarget);
		var nIdx = target.index();
		target.addClass('on').siblings().removeClass('on');
		//console.log(this.aMenuOffset[nIdx])
		if ( !target.is('.exit')){
			this.oScrollNav.scrollTo(0,this.aMenuOffset[nIdx], 500);
		}
	},
	goNavScroll : function(nIdx){
		this.oScrollNav.scrollTo(0,this.aMenuOffset[nIdx], 500);
	},
	// 전체메뉴 스크롤시 이벤트
	_onScrollMenu : function(){
		var oThis = this;
		// 각 메뉴 position.top 값을 배열에 설정
		this.aMenuOffset = [];
		this.welDoc.find('.r-tree .menu-tree').each(function(){
			oThis.aMenuOffset.push ( $(this).position().top );
		});
		console.log(oThis.aMenuOffset);

		// 스크롤이 끝난경우 네비게이터 이동
		this.oScrollNav.attach({
			"afterScroll": function(we) {
				var nTop = we.nTop * -1;
				var nSize = oThis.welDoc.find('.r-tree .menu-tree').length +1 ;
				for (i=0; i < nSize; i ++ ){
					if (nTop >= oThis.aMenuOffset[i]){
						//console.log('패스')
					} else {
						//console.log('당첨번호 : ' + i)
						oThis.welDoc.find('.l-depth-mark .menu li').removeClass('on').eq(i-1).addClass('on');
						return false;
					}
				}

			}
		})
	},
	showLoading : function(){
		if (jindo.m.getDeviceInfo().android && jindo.m.getDeviceInfo().version.substring(0,1) == "5" ){
			//앱 로딩바 호출 : 롤리팝 떄문에 네이티브 호출
			window.MobileOffice.showLoadingBar();
			//callNativeLoading();
		} else {
			this.oLoading.show();
		}
	},
	hideLoading : function(){
		if (jindo.m.getDeviceInfo().android && jindo.m.getDeviceInfo().version.substring(0,1) == "5" ){
			//앱 로딩바 비호출 : 롤리팝 떄문에 네이티브 호출
			window.MobileOffice.hideLoadingBar();
			//callNativeLoadingClose();
		} else {
			this.oLoading.hide();
		}

	},
	setPopupScroll : function() {
		if(!$('#_popupScroll').length){
			console.log('%c Alert : setPopupScroll 실패', "color: #f00;");
			return false;
		} else {
			console.log('%c Alert : setPopupScroll 성공', "color: #00f;")
		}
		this.oScrollPopup = new jindo.m.Scroll("_popupScroll", {
			bUseHScroll: false,
			bUseVScroll: true,
			bUseBounce : false,
			bUseTimingFunction : false,
			bAutoResize : true,
			nHeight: this.htSize.height - $('._PopupGlobal ._popupHeader').outerHeight(true) - $('._PopupGlobal ._popupFooter').outerHeight(true) //- $('._PopupGlobal ._popupSearchArea').outerHeight(true)
		});
		//console.log(this.oScrollPopup);
	},

	/* 전체 팝업 페이지 닫기 & 스크롤 제거 */
	offPopupScroll : function() {
		//console.log(this.oScrollPopup)
		oEmartMO.oScrollPopup.detachAll();
		//this.oScrollPopup.destroy();

		//nativeClosePopup();//개발 적용하면 안됨
		if(oEmartMO.oSearchMenu){ oEmartMO.oSearchMenu.hide(); }
		$('._layerFullPopup').remove();


		console.log('%c Alert : setPopupScroll 제거', "color: #00f;")
	},
	/* 최상단으로 스크롤 이동 */
	oScrollToTop : function(){
		console.log(this.oScroll);
		oEmartMO.oScroll.scrollTo(0, 0)
	},
	/* 최하단으로 스크롤 이동 */
	oScrollToBottom : function(){
		oEmartMO.oScroll.scrollTo(0, oEmartMO.oScroll.nScrollH)
	},
	/* 최하단으로 스크롤 이동 */
	oScrollToBottomPopup : function(){
		oEmartMO.oScrollPopup.scrollTo(0, oEmartMO.oScroll.nScrollH)
	},
	/* 메인 스크롤 하단 키패드 On */
	/* oEmartMO.OnScrollKeypad() */
	OnScrollKeypad : function(){
		console.log('%c Alert : Number 키패드 올라옴', "color: #00f;");
		$('.jmc-content > div').css({'padding-bottom' : '200px'});
		this.oScroll.refresh();
		//this.oScrollToBottom();
	},
	/* 메인 스크롤 하단 키패드 Off */
	/* oEmartMO.OffScrollKeypad() */
	OffScrollKeypad : function(){
		console.log('%c Alert : Number 키패드 내려감', "color: #00f;");
		$('.jmc-content > div').css({'padding-bottom' : '1rem'});
		this.oScroll.refresh();
	},

	/* 메인 스크롤 하단 키패드 On */
	/* oEmartMO.OnScrollKeypad() */
	OnScrollKeypadPopup : function(){
		console.log('%c Alert : 팝업에서 Number 키패드 올라옴', "color: #00f;");
		$('#_popupScroll > div').css({'padding-bottom' : '200px'});
		this.oScrollPopup.refresh();
		//this.oScrollToBottom();
	},
	/* 메인 스크롤 하단 키패드 Off */
	/* oEmartMO.OffScrollKeypad() */
	OffScrollKeypadPopup : function(){
		console.log('%c Alert : 팝업에서 Number 키패드 내려감', "color: #00f;");
		$('#_popupScroll > div').css({'padding-bottom' : '1rem'});
		this.oScrollPopup.refresh();
	},
	setBarcodePostion : function(data){
		//var num = "8801114101834";
		var num = data;
		var txt ="strong:contains(" + num +")";
		//색상 변경
		$('.list-prod li').removeClass('focus');
		$( txt).parents('li').addClass('focus');
		//스크롤 이동
		var nTop = $( txt).parents('li').position().top;
		//console.log(nTop);
		oEmartMO.oScroll.scrollTo(0, nTop)
	},
	// 스크롤 위치를 인풋에 맞게 이동
	_onFocusInputPosition : function(event) {
		var target = $(event.currentTarget);
		var oElementOffset = target.offset();
		var nPos = 280;

		this.OnScrollKeypad();
		if (oElementOffset.top > nPos) {
			var nScrollPos = this.oScroll._nTop;
			var nSetPos = this.oScroll._nTop - oElementOffset.top + nPos;

			console.log('nScrollPos : ' + this.oScroll._nTop);
			console.log('oElementOffset : ' + oElementOffset.top);
			console.log('nSetPos : ' + (this.oScroll._nTop - oElementOffset.top + nPos));

			this.oScroll.scrollTo(0, nSetPos, 500)
		}

	},
	_onBlurInputPosition : function(event){
		 this.OffScrollKeypad();
	},

	/* gnb 처리 */
	_onClickGnb : function(event) {
		// 토글 GNB
		var target = $(event.currentTarget);
		if ( target.hasClass('on') ) {
			target.removeClass('on');
			var sSubName= "#sub" + Number(target.index('._gnb li') + 1);
			$(sSubName).hide();
		} else {
			$('._gnb li').removeClass('on');
			target.addClass('on');
			var sSubName= "#sub" + Number(target.index('._gnb li') + 1);

			//console.log(sSubName);
			$('.link-wrap').hide();
			$(sSubName).show();

		}
		// 스크롤 위치 처리
		this.oScroll.refresh();
		if ( this.oScroll.nMaxScrollTop < 0 && target.index('._gnb li') > 1 ){
			this.oScroll.scrollTo(0, this.oScroll.nScrollH, 500)
		}
	},
	// 가공발주 등록
	_onClickAccordionList : function(event){
		var target = $(event.currentTarget);
		if (target.parent().is('.on')){
			target.parent().removeClass('on');
		} else {
			target.parent().addClass('on').siblings().removeClass('on');
		}
		oEmartMO.oScroll.refresh();
	},

	// 품질불량 이미지 삭제
	_onClickClaimDelIgm : function(event){
		var target = $(event.currentTarget);
		target.parent().remove();
	},

	//폰트 사이즈 변경
	_onClickFontPlus : function(event){
		var target = $(event.currentTarget);
		var sElementId = $('.board-wrap').attr('id');
		console.log(sElementId);
		if ( sElementId == "f-14" ||   sElementId == undefined){
			$('.board-wrap').attr('id','f-16');
		} else if ( sElementId == "f-16" ){
			$('.board-wrap').attr('id','f-18');
		} else if ( sElementId == "f-18"  ){
			return false;
		}
		console.log('this.oScoll');
		oEmartMO.oScroll.refresh()

	},
	_onClickFontMinus : function(event){
		var target = $(event.currentTarget);
		var sElementId = $('.board-wrap').attr('id');
		//console.log(sElementId)
		if ( sElementId == "f-18" ){
			$('.board-wrap').attr('id','f-16');
		} else if ( sElementId == "f-16" ){
			$('.board-wrap').attr('id','f-14');
		} else if ( sElementId == ""  ){
			return false;
		}
		console.log('this.oScoll');
		oEmartMO.oScroll.refresh()
	},
	_onClickEllipsis:function(event){
		var target = $(event.currentTarget);
		setTimeout(function(){
			target.next().addClass('on');
			//console.log('_onClickEllipsis')
		},200)

	},
	_onClickRemoveEllipsis:function(event){
		$('.ellipsis-txt').removeClass('on');
		//console.log('_onClickRemoveEllipsis')
	},
    ready: function() {
		$(function(){


		})
	}
};


var oEmartMO = new EmartMO.view.global();