const form = document.querySelector('form');
const supabaseUr1 = 'https://jgufrobnnfxqcnfnpies.supabase.co';
const supabaseKey = 'sb_publishable_As7V2DPGP864JQzQCjL14Q_DUZBMJoP';
const db = supabase.createClient(supabaseUr1,supabaseKey);

if (!form) {
    throw new Error('No form found on this page.');
}

function updatePreview() {
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const message = document.querySelector('#message').value;

    const preview = document.querySelector('#preview');

    preview.innerHTML = `
        <h3>Vista previa de contacto</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo electrónico:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
    `;
}

function checkValidityState(field) {
    // quitar estados previos
    field.classList.remove('valid', 'invalid');

    // verificar validez HTML5 incorporada
    if (field.checkValidity()) {
        field.classList.add('valid');
    } else {
        field.classList.add('invalid');
    }
}

function validateForm() {
    if(event){
        event.preventDefault();
    }
    // Limpiar el contenedor de errores
    const errorBox = document.getElementById('error-box');
    errorBox.textContent = '';
    sendSupabaseForm(errorBox);

    return true; //permitir envio
}

async function sendSupabaseForm(errorBox) { 
 const name = document.getElementById('name').value.trim(); 
 const phone = document.getElementById('phone').value.trim(); 
 const email = document.getElementById('email').value.trim(); 
 const category = document.getElementById('category').value; 
 const message = document.getElementById('message').value.trim(); 
 const discoverySelected = document.querySelector('input[name="discovery"]:checked'); 
 const discovery = discoverySelected ? discoverySelected.value : null; 
 const interests = Array.from( document.querySelectorAll('input[name="interests"]:checked') )
     .map(item => item.value).join(', '); 
 const { error } = await db.from('contact_messages')
     .insert([ { 
         name: name, 
         phone: phone, 
         email: email, 
         discovery: discovery, 
         interests: interests, 
         category: category, 
         message: message 
     }]); 
    
 errorBox.classList.add('visible'); 
 if (error) { errorBox.textContent = 'Error al guardar el mensaje: '+ error.message; 
         return; 
     } 
 errorBox.style.color = 'green'; 
 errorBox.textContent = 'Mensaje enviado y guardado correctamente.'; 
 form.reset(); 
    
 const preview = document.getElementById('preview'); 
 if (preview) { 
    preview.innerHTML = '';
 }
}
function checkCustomRules() {
    // Validación personalizada: si selecciona "Amigo o conocido", el mensaje debe incluir "amigo"
    const friendSelected = document.querySelector('#friend').checked;
    const message = document.querySelector('#message').value.toLowerCase();

    if (friendSelected && !message.includes('amigo')) {
        // Gestión del foco: movemos el cursor al campo de texto
        document.querySelector('#message').focus();
        return 'Si selecciona "Amigo o conocido", por favor mencione "amigo" en el mensaje.';
    }

    return null; // sin errores
}

// Evento de teclado: resaltar botón de envío cuando se presiona Enter
function handleKeydown(event) {
    if (event.key === 'Enter') {
        document.getElementById('submit-btn').classList.add('highlight');
    }
}

// Eventos de ratón: resaltar campos al pasar el ratón
function handleMouseOver(element) {
    element.classList.add('highlight');
}

function handleMouseOut(element) {
    element.classList.remove('highlight');
}
