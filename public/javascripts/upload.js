 ( function( window, undefined ) {
    'use strict'
    var form = document.forms['uploads']
    var status = document.getElementById('status')
    var fileList = []
    var event = new Event('uploaded')

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
        data.files = (files != undefined) ? files : []
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
            }else if(xhr.status == 400){
                status.innerHTML = xhr.response.error
            }else {
                status.innerHTML = "Internal Server Error"
            }
            console.log(xhr.response)
        }
    }

    function uploadImage (self, file) {
        var xhr = new XMLHttpRequest()
        var data = new FormData()
        status.innerHTML = 'Cargando...'
        data.append('file', file)
        xhr.open('POST', '/files')
        xhr.responseType = 'json'
        xhr.send(data)
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            console.log(xhr.response)
            if (xhr.status == 200) {
                fileList.push(xhr.response)
                form.dispatchEvent(event)
            } else {
                status.innerHTML = xhr.response.error 
            }
            
        }
    }

    function upload (evt) {
        console.log('uploadPost')
        fileList = []
        evt.preventDefault()
        if (validateInputs()) { 
            console.log('submit file')
            if (this['file'].files.length > 0) {
                for (var i = 0; i < this['file'].files.length; i++)
                    uploadImage(this, this['file'].files[i])
            }else{
                uploadPost(this)
            }
        }else{
            status.innerHTML = 'Campos requeridos'
        }
    }

    function submitPost (event) {
        if (fileList.length == this['file'].files.length) uploadPost(form, fileList)
    }

    form.addEventListener('uploaded', submitPost)
    form.addEventListener('submit', upload)
} )( this )