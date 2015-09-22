 ( function( window, undefined ) {
    'use strict'

    function loginFacebook (evt) {
        evt.preventDefault()
        FB.login(function (response){
            console.log('Login')
            statusChangeCallback(response)
        }, {scope: 'email'})
    }

    function logoutFacebook (evt) {
        evt.preventDefault()
        FB.logout(function (response) {
            console.log('Logout')
            statusChangeCallback(response)
        });
    }

    function statusChangeCallback(response) {
        console.log('statusChangeCallback')
        console.log(response)
        var facebook = document.getElementById('login-facebook')       
        if (response.status === 'connected') {
            facebook.innerHTML = 'Logout Facebook'
            facebook.removeEventListener('click', loginFacebook)
            facebook.addEventListener('click', logoutFacebook)
            if (!docCookies.hasItem('NESSION')) {
                console.log('setcookie')
                docCookies.setItem('NESSION', window.btoa('fb:'+response.authResponse.userID + ':' + response.authResponse.accessToken + ':1'))
                login()
            }
            // // testAPI()
        // } else if (response.status === 'not_authorized') {
        //     facebook.innerHTML = 'Login Facebook'
        //     facebook.removeEventListener('click', logoutFacebook)
        //     facebook.addEventListener('click', loginFacebook)
        } else {
            if (docCookies.hasItem('NESSION')) logout()
            facebook.innerHTML = 'Login Facebook'
            facebook.removeEventListener('click', logoutFacebook)
            facebook.addEventListener('click', loginFacebook)
        }
    }


    function login(){
        // FB.api('/me?fields=id,name,email', function(response){
        var xhr = new XMLHttpRequest()
        // response
        // response.social = 'fb'
        
        xhr.open('POST', '/auth/session')
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.responseType = 'json'
        xhr.send()
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4 || xhr.status != 200) return;
            console.log(xhr.response)
        }
        // })
    }

    function logout () {
        var xhr = new XMLHttpRequest()
        // response
        // response.social = 'fb'
        
        xhr.open('DELETE', '/auth/session')
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.responseType = 'json'
        xhr.send()
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4 || xhr.status != 200) return;
            console.log(xhr.response)
        }
                

    }

    function testAPI() {
        console.log('Welcome!  Fetching your information.... ')
        FB.api('/me', function(response) {
            console.log('Successful login for: ' + response.name)
            document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!'
        })
    }


    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1783102368583469',
            cookie     : true,  // enable cookies to allow the server to access 
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.4' // use version 2.2
        })
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response)
        })
    }
} )( this )