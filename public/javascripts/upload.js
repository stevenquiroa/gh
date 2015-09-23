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

    function uploadPost (self, files) {
        status.innerHTML = 'Ya casi...'
        var xhr = new XMLHttpRequest()
        var data = {}    

        data.files = files
        data.title = self['title'].value
        data.source = self['source'].value
        data.social = self['social'].value
        xhr.open('POST', '/posts')
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.responseType = 'json'
        xhr.send(JSON.stringify(data))
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4 || xhr.status != 200) return;
            console.log(xhr.response)
            status.innerHTML = "Listo :)"
        }
    }

    function uploadImage (self, callback) {
        console.log(self['file'].files)
        if (!self['file'].files.length) callback(self, []);
        var xhr = new XMLHttpRequest()
        var data = new FormData()
        status.innerHTML = 'Cargando...'
        data.append('file', self['file'].files[0])
        xhr.open('POST', '/files')
        xhr.responseType = 'json'
        xhr.send(data)
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4 || xhr.status != 200) return;
            console.log(xhr.response)
            if (typeof callback == 'function') callback(self, [xhr.response])
        }
    }

    function upload (evt) {
        console.log('uploadPost')
        evt.preventDefault()
        if (validateInputs()) {
            console.log('submit file')
            // uploadImage(this)
            uploadImage(this, uploadPost)
        }else{
            status.innerHTML = 'Campos requeridos'
        }
    }

    form.addEventListener('submit', upload)
} )( this )