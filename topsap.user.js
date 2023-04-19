// ==UserScript==
// @name         天融信 VPN AUTO LOGIN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  天融信 VPN自动登录
// @author       Sajor
// @match        https://111.33.112.66:10443/*
// @include        https://111.33.112.66:10443/*

// @match        https://111.33.112.66:10443/portal_default/index.html

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_download

// ==/UserScript==

(function () {
    var auto_code_url = "http://101.43.221.4:5000/login_base";

    function image2Base64(img) {

        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    };

    function erp_auto(res, auto_code_url) {
        var base64 = "";
        var img = new Image();
        img.src = res;
        img.setAttribute("crossOrigin", 'Anonymous');

        img.onload = function () {
            base64 = image2Base64(img);
            GM_xmlhttpRequest({
                method: "POST",
                url: auto_code_url,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "base64": base64,
                    "name": "erp",
                    "threshold": 0,
                    "count": 0
                }),
                onload: function (response) {
                    console.log("AutoLogin请求成功");
                    console.log(response.responseText);

                    $("#validate_1").val(response.responseText);

                    setTimeout(function () {
                        $("#submitLogin").click();
                    }, 0);

                    setTimeout(function () {
                        // code to be executed after 1 second delay
                        console.log($('#showMsgCountent').text())
                        if ($('#showMsgCountent').text() == '验证码输入错误') {
                            $('.closeWin').click();
                            console.log("验证码输入错误")
                            login();
                        } else {
                            console.log("未找到验证码输入错误")
                        }
                    }, 2000);

                },
                onerror: function (response) {
                    console.log("AutoLogin请求失败");
                    console.log(response);
                }
            });
        }
    }

    function login() {
        var res = $("#identifying_code")[0].src;
        console.log(res);
        erp_auto(res, auto_code_url);
        return false;
    }

    $(document).ready(function () {

// ERP
        $("#submitLogin").after("<button id='auto' >Auto Login</button>")
        $("#auto").click(function () {
            login();
        });

    });
})();


