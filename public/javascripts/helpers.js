var helpers = {
	tempNoti : function (message, element, color, time) {
		if (!color || color != '') color = 'auto';			
		if (!time) time = 3;			
		var e = document.getElementById(element);
		e.innerHTML = message;
		e.style.color = color;
		e.style.display = 'inline-block';	 			 		
		setTimeout(function(){
			e.style.display = 'none';
		}, time * 1000);
	}
}