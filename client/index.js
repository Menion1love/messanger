let usName = "";
let tf = 0;
let html = '<table id="mytable" class="mytable"><tbody>'

function initCom() {
  let socket = new WebSocket("ws://localhost:8000")

  socket.onopen = (event) => {
    document.getElementById('msg_table').innerHTML = html + event.data + '/tbody></table>';
  } 
  socket.onmessage = (event) => {
    document.getElementById('msg_table').innerHTML = html + event.data + '</tbody></table>';
  } 
  document.getElementById("namb").onclick = () => {
    let v = document.getElementById("name").value;
    if (v != "" && v.indexOf(' ') == -1)
      usName = v
  } 

  document.getElementById("message").addEventListener("keydown", function(e) {
    if (e.which === 13)
    {
      let v = document.getElementById("message").value
      if (usName == "")
        usName = retUz()
      if (v != "" && usName != "")
        {
          let now = new Date();;
          let m = '<tr><td class="mytd">' + `${usName}: ${v}` + `<br><td class="time">${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}<td/><br><td/><tr/>` 
          document.getElementById("message").value = ""
          socket.send(m.toString())
          tf = 0;
      } 
    }
      else {
        if (usName != "" && !tf && e.which !== 9 && e.which !== 8 && e.which !== 20 && e.which !== 16 && e.which !== 17 && e.which !== 18){
          tf = 1;
          let m = '<tr><td class="ttdk">' + `${usName} is typing...` + '<td/><tr/>'
          socket.send(m.toString())
        }      
    }});

    document.getElementById("message").addEventListener("keyup", function(e) {
      if (e.which != 9 && document.getElementById("message").value == '' && tf == 1){
        tf = 0
        socket.send('no')
      }
    })
}

initCom()

