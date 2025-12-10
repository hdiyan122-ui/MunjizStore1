function Email(){
    let emailsParms ={
        name: document.getElementById('name').value,
        name: document.getElementById('email').value,
        name: document.getElementById('message').value,
    }
    const service_ID ='service_hjaklhd';
    const temp_ID ='template_vqsdq3a';

    emailjs.send(service_ID,temp_ID,emailsParms).then(
    (res)=>{
        document.getElementById('name').value ='';
        document.getElementById('email').value ='';
        document.getElementById('message').value ='';
        console.log(res);
        alert('message sent successfully');
    }
    ).catch((err)=>console.log(err));
}