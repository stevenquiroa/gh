( function( window, undefined ) {
    'use strict'

    var page = 2

    function buildLi(p, n){
    	var li = document.createElement('li')
    	li.innerHTML = '<li><a href="/posts/' + p.id + '">' + p.title + '</a> - ' + n.name + '</li>'
    	return li
    }

    function getMore (evt) {
    	evt.preventDefault()
    	console.log('getMore')

    	var xhr = new XMLHttpRequest()
    	var url = '/posts/?page=' + page
    	xhr.open('GET', url)
    	xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    	xhr.responseType = 'json'
    	xhr.send()
    	xhr.onreadystatechange = function () {
    		if (xhr.readyState != 4) return;
    		if (xhr.status == 200) {
    			if (xhr.response.length) {
    				var ul = document.getElementById('posts')
	    			for (var i = 0; i < xhr.response.length; i++) {
	    				ul.appendChild(buildLi(xhr.response[i].p, xhr.response[i].n))
	    			}
	    			page++
    			}else{
    				helpers.tempNoti('No hay más publicaciones', 'status')
    				evt.target.parentNode.removeChild(evt.target)
    			}
    		}else{
    			helpers.tempNoti('Error: ' + xhr.response.error, 'status')
    		}
    		console.log(xhr.response)
    	}
    }

    var loadMore = document.getElementById('load-more')
    loadMore.addEventListener('click', getMore)
} )( this )