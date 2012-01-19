var flag=false
	, node = {}
	, socket = io.connect('', {
		'reconnect': true,
		'reconnection delay': 500,
		'max reconnection attempts': 5
	});

socket.on('sign', function (data) {
	if(data.state==0) {
		$('#user').addClass('rounded_error');
		node.err($('.box_login'), node.vals.e2);
	} else {
		$('#alert').hide('slow');
		flag=true;
		$('#container').hide('slow', function(){
				$('#container').remove();
		});
	}
	$('#loading').hide();
});

socket.on('update', function (data) {
	if(flag) {
		$('#users').empty();
		$.each(data, function (key, value) {
			$('#users').append('<div class="user">' + key + '</div>');
		});
	}
});

socket.on('handle', function (data) {
	$('#'+data.obj[0]).css({ 'left': data.obj[1]+'px', 'top': data.obj[2]+'px'});
});

socket.on('objects', function (data) {

	data.forEach(function (doc) {
		var content='';
		if(doc.type=='0')
			content='<img src="'+node.vals.urlimg+doc.value+node.vals.extimg+'">';
		if(doc.type=='1')
			content=doc.value;
		$('#board').append('<div id="'+doc._id+'" class="letter" style="left: '+doc.x+'px; top: '+doc.y+'px;">' + content + '</div>');
	});

	$(".letter").draggable({
		drag: function (e, ui) {
			var obj = [
				$(this).attr('id'),
				$(this).position().left,
				$(this).position().top
			];
			socket.emit('handle', { obj: obj });
		}
	});
});

node = {

	vals: {
			e1 : 'Nick taken :(',
			e2 : '¬¬"',
			urlimg : '/img/objects/',
			extimg : '.png'
	},

	init: function () {
		$(".drag").draggable();
		$("h1").draggable();
		$("p").draggable();

		$('#buttom').on('click', function (e) {
			e.preventDefault();
			$('#loading').show();
			if($('#user').val().trim() == '') {
				$('#user').addClass('rounded_error');
				node.err($('.box_login'), node.vals.e2);
				$('#loading').hide();
			} else {
				$('#alert').hide('slow');
				$('#user').removeClass('rounded_error');
				socket.emit('adduser', $('#user').val());
			}
		});		
	},

	err: function (obj, msg) {
		$('#alert').html('<img src="/img/error.png" />'+msg);
		$('#alert').show();
		for(var i=0; i<5; i++) {
			obj.animate({"left": '+=12'}, 80).animate({"left": '-=12'}, 80);
		}
	}
}

$(function(){
	node.init();
});