 ( function( window, undefined ) {
    'use strict'
    var form = document.forms['uploads']
    var status = document.getElementById('status')

    function validateInputs () {
        console.log('validateInputs')
        var required = ['title', 'source']
        for (var i = required.length - 1; i >= 0; i--) {
            var input = document.getElementById(required[i])
            if (input.value == '') {
                input.style.borderColor = 'red'
                return false
            } 
        }
        return true
    }

    function uploadPost (evt) {
        console.log('uploadPost')
        evt.preventDefault()
        self = this

        if (validateInputs()) {
            console.log('submit file')
            var xhr = new XMLHttpRequest()
            var data = new FormData()
            status.innerHTML = 'Cargando...'
            data.append('file', self['file'].files[0])
            xhr.open('POST', '/files')
            xhr.responseType = 'json'
            xhr.send(data)
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4 || xhr.status != 200) return;
                console.log(xhr.response)
                status.innerHTML = 'Ya casi...'
                var post = new XMLHttpRequest()
                var postData = {}    

                postData.files = [xhr.response]
                postData.title = self['title'].value
                postData.source = self['source'].value
                postData.social = self['social'].value
                post.open('POST', '/posts')
                post.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                post.responseType = 'json'
                post.send(JSON.stringify(postData))
                post.onreadystatechange = function() {
                    if (post.readyState != 4 || post.status != 200) return;
                    console.log(post.response)
                    status.innerHTML = "Listo :)"
                }
            }
        }else{
            status.innerHTML = 'Campos requeridos'
        }
    }

    form.addEventListener('submit', uploadPost)
} )( this )