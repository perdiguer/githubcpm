'use strict'; 

// Esquelto defensivo
function initializeI18n() { 
    const translatableElements = document.querySelectorAll('[data-i18n]'); 

    const languageSwitcher = document.querySelector('#language-switcher'); 

    if (translatableElements.length === 0 && !languageSwitcher) { 
    console.log('Esta página todavía no está preparada para i18n.'); 

    return; 
    }

    const initialLocale = getSavedLocale(); 
    applyTranslations(initialLocale); 
    updateDynamicContent(initialLocale); 
    initializeLanguageSwitcher(initialLocale); 
} 
initializeI18n(); 

'use strict'; 
 
function applyTranslations(locale) { 
    const translatableElements = document.querySelectorAll('[data-i18n]'); 
    const labelElements = document.querySelectorAll('[data-i18n-label]'); 
    const dict = window.translations?.[locale]; 
 
    for (let i = 0; i < translatableElements.length; i++) { 
        const element = translatableElements[i]; 
        const key = element.dataset.i18n; 
        const translatedText = dict[key]; 
 
        if (translatedText) { 
            element.textContent = translatedText; 
        } 
    } 
 
for (let i = 0; i < labelElements.length; i++) { 
        const element = labelElements[i]; 
        const key = element.dataset.i18nLabel; 
        const translatedLabel = dict[key]; 
 
        if (translatedLabel) { 
            element.setAttribute('label', translatedLabel); 
        } 
    } 

    // Si tambien quisiera traducir placeholders, habria que marcarlos con otro atributo, por ejemplo,
    // data-i18n-placeholder, y recorrerlos en un segundo bucle para actualizar el atributo,
    // element.setAttribute('placehodler', translatePlaceholder)
    
    document.documentElement.lang = locale; 
} 

// Almacena en el localStorage del navegador la preferencia de locale del usuario
// Permite recuperar ese valor
function setLocale(locale) { 
    const selectedLocale = window.translations[locale] ? locale : 'es'; 
    localStorage.setItem('preferredLanguage', selectedLocale); 
    applyTranslations(selectedLocale); 
    updateDynamicContent(selectedLocale); 
    initializeLanguageSwitcher(selectedLocale); 
} 

// FUncion para restaurar el idioma del localStorage
function getSavedLocale() { 
    const savedLocale = localStorage.getItem('preferredLanguage'); 
    return translations[savedLocale] ? savedLocale : 'es'; 
} 

function initializeLanguageSwitcher(locale) { 
    const languageSwitcher = document.querySelector('#language-switcher'); 
    if (languageSwitcher) { 
        languageSwitcher.value = locale; 
    }  
} 

// Nos aseguramos de que setLocale sea global. 
window.setLocale = setLocale;
window.getSavedLocale = getSavedLocale;
window.initializeLanguageSwitcher = initializeLanguageSwitcher;

// Funcion para traducir fechas
function formatDate(dateValue, locale) { 
    const resolvedLocale = locale === 'en' ? 'en-US' : 'es-ES'; 
    return new Intl.DateTimeFormat(resolvedLocale, { dateStyle: 'long', timeStyle: 'short' }).format(dateValue); 
}

// Funcion para traducir numeros
function formatCurrency(amount, locale) { 
    const resolvedLocale = locale === 'en' ? 'en-US' : 'es-ES'; 
    const currency = locale === 'en' ? 'USD' : 'EUR'; 
 
    return new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency: currency }).format(amount); 
} 

function updateDynamicContent(locale) { 
    const meetingDateBox = document.querySelector('#monthly-meeting-date'); 
    const meetingFeeBox = document.querySelector('#monthly-meeting-fee'); 
     const meetingSummary = document.querySelector('#meeting-summary'); 
 
    if (meetingDateBox) { 
        const rawDate = meetingDateBox.dataset.date; 
        const meetingDate = new Date(rawDate); 
        meetingDateBox.textContent = formatDate(meetingDate, locale); 
    } 
 
    if (meetingFeeBox) { 
        const rawFee = Number(meetingFeeBox.dataset.fee); 
        meetingFeeBox.textContent = formatCurrency(rawFee, locale); 
    }

    // Modificamos el contenido textual de un elemento de forma dinamica desde JS
    if (meetingSummary) { 
        meetingSummary.textContent = buildMeetingSummary(locale); 
    } 
}

function buildMeetingSummary(locale) { 
    const meetingDateBox = document.querySelector('#monthly-meeting-date'); 
    const meetingFeeBox = document.querySelector('#monthly-meeting-fee'); 
    const meetingPlaceBox = document.querySelector('[data-i18n="events.monthlyMeeting.locationValue"]'); 
    const bookTitleBox = document.querySelector('[data-i18n="events.monthlyMeeting.bookTitle"]'); 
 
    const formattedDate = meetingDateBox ? meetingDateBox.textContent : ''; 
    const formattedFee = meetingFeeBox ? meetingFeeBox.textContent : ''; 
    const place = meetingPlaceBox ? meetingPlaceBox.textContent : ''; 
    const bookTitle = bookTitleBox ? bookTitleBox.textContent : ''; 
 
    if (locale === 'en') { 
        return `Our next monthly meeting will take place on ${formattedDate} at ${place}. 
        We will discuss ${bookTitle}, and the current fee is ${formattedFee}.`; 
    } 

    return `Nuestro próximo encuentro mensual será el ${formattedDate} en ${place}. 
    Hablaremos sobre ${bookTitle} y la cuota actual es ${formattedFee}.`; 
}
