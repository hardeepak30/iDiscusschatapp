const socket=io();
const form =document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container')
var audio=new Audio('/frontend/ting.mp3')
const append=(message,position)=>{
    
    const messageElement=document.createElement('div')
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    if (position === 'left' ||position==='right') {
        const colonIndex = message.indexOf(':');
        if (colonIndex !== -1) {
            const boldName = document.createElement('strong');
            boldName.textContent = message.substring(0, colonIndex); // Extract the name before the colon
            messageElement.appendChild(boldName);

            const messageContent = document.createElement('span');
            messageContent.textContent = message.substring(colonIndex); // Extract the message content after the colon
            messageElement.appendChild(messageContent);
        } else {
            messageElement.textContent = message;
        }
    } 

    messageContainer.appendChild(messageElement);
    if(position =='left'){
    audio.play();
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=messageInput.value;
    append(`You: ${message}`,'right')
    socket.emit('send',message)
    messageInput.value=''
})


fetch('/api/names')
    .then(response => response.json())
    .then(data => {
        
            const user = data; 
            const fullname = `${user.firstname} ${user.lastname}`;
            socket.emit('new-user-joined', fullname); 

    })
    .catch(error => console.error('Error fetching user name:', error));

socket.on('user-joined',name=>{
append(`${name} joined the chat`,'right')
})

socket.on('receive',data=>{
    append(`${data.name}: ${data.message}`,'left')
})

socket.on('left',name=>{
    append(`${name}  left the chat`,'right')
})