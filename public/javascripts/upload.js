 ( function( window, undefined ) {
    'use strict'
    var form = document.forms['uploads']
    var status = document.getElementById('status')
    var fileList = []

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
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                status.innerHTML = "Listo :)"
            }else{
                status.innerHTML = ""
                for (var i = 0; i < xhr.response.error.length; i++) {
                    status.innerHTML +=  xhr.response.error[i] + '<br>'
                }
            }
            console.log(xhr.response)
        }
    }

    function uploadImage (self, files, callback) {
        console.log(fileList)
        if (fileList.length == 0) {
            uploadPost(self, files) 
            return;
        }
        var xhr = new XMLHttpRequest()
        var data = new FormData()
        status.innerHTML = 'Cargando...'
        data.append('file', fileList.shift())
        xhr.open('POST', '/files')
        xhr.responseType = 'json'
        xhr.send(data)
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            console.log(xhr.response)

            if (xhr.status == 200 && typeof callback == 'function') {
                files.push(xhr.response)
                callback(self, files, uploadImage)
            } else {
                status.innerHTML = xhr.response.error 
            }
            
        }
    }

    function upload (evt) {
        console.log('uploadPost')
        evt.preventDefault()
        if (validateInputs()) { 
            console.log('submit file')
            for (var i = 0; i < this['file'].files.length; i++)
                fileList.push(this['file'].files[i])
            uploadImage(this, [], uploadImage)
        }else{
            status.innerHTML = 'Campos requeridos'
        }
    }

    form.addEventListener('submit', upload)
} )( this )