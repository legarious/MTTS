  var socket = io('http://localhost:3000');
            // receive data through road A
            socket.on('a',function(data){
                console.log(data);
            });
            socket.on('c',function(data){
                console.log(data);
                console.log(data.x);
                console.log(data.y);

            });
            socket.on('e',function(ack)
                    {
                        $('#ack').html(ack);
                        alert(ack);
                    });

