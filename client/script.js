import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval;

function loader(element){
  element.textContent = ''

  loadInterval = setInterval(()=>{
      element.textContent += '.';
      
      if(element.textContent === '....'){
        element.textContent = '';
      }
  },300)
}

function typeText(element,text){
  let index = 0;
  let interval = setInterval(()=>{
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval);
    }
  },20)
  
}

function generateUID(){
  const date = Date.now();
  const randomNumber = Math.random();
  const randomString = randomNumber.toString(16);
  
  return `id-${date}-${randomString}`;
  
}

function chatStripe(isAi, value , uniqueId){
 return( `
  <div class='wrapper ${isAi && 'ai'}'>
      <div class='chat'>
      <div class='profile'>
        <img
          src ="${isAi ? bot : user}"
          alt="${isAi  ? 'bot' : 'user'}"
        />
      </div>
      <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>

  `)
}

const handelSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
 
  //user's chat stripe
  chatContainer.innerHTML += chatStripe(false,data.get('prompt'));

  form.reset();

  //bot's chat stripe
  const uniqueId = generateUID();
  chatContainer.innerHTML += chatStripe(true," ",uniqueId);
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
 
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  const response = await fetch('https://shubhamcodex.onrender.com',{
    method: 'POST',
    headers:{
      'content-type' : 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })

  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv,parsedData);

  }else{
    const err = await response.text();

    messageDiv.innerHTML = "something went wrong";
    alert(err);
  }

}

form.addEventListener('submit',handelSubmit);
form.addEventListener('keyup',(e)=>{
  if(e.keyCode === 13){
    handelSubmit(e);
  }
})


// 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