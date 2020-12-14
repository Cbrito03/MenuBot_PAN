/*var colas = {
  "cotizar" : "PA_WA_Ventas",
  "asistencia" : "PA_Wa_Movil"
};*/

var colas = {
  "cotizar" : {
      "timeout" : 960000,
      "acd" : "PA_WA_Ventas"
  },
  "asistencia" : {
      "timeout" : 960000,
      "acd" : "PA_Wa_Movil"
  }
};

var mensaje_df = "Nuestro número de WhatsApp ha cambiado, ahora puedes contactarnos ingresando aquí 👉 https://bit.ly/WhatsAppClaroPA";
    
var mjs_horario = '¡Hola, gracias por comunicarte a Claro, te informamos nuestros horarios de atención!  \n \n ';
    mjs_horario += '⌚Facebook y Twitter  \n \n ';
    mjs_horario += 'Lunes a Domingo  \n \n ';
    mjs_horario += '6:00 am a 22:00 horas  \n \n \n';
    mjs_horario += 'Whatsapp disponible 24/7  \n \n \n';
    mjs_horario += 'Te invitamos a ingresar a https://miclaro.com.pa/pa/ disponible 24/7 para que puedas hacer tus autogestiones.  \n \n';
    mjs_horario += '¡Claro que sí!';

var msj_ayuda = "Ingresa aquí 👉🏼  https://miclaro.com.pa/ si deseas realizar alguna de las siguientes gestiones: \n \n ";
    msj_ayuda += "Pagos de factura \n";
    msj_ayuda += "Consulta de saldo \n";
    msj_ayuda += "Recargas \n";
    msj_ayuda += "Paquetes prepago  \n";
    msj_ayuda += "Horarios y ubicaciones de nuestras tiendas \n";
    msj_ayuda += "Promociones Vigentes  \n";

var msj_club = "Si eres Claro 😉 eres parte del club con beneficios y descuentos. \n \n ";
    msj_club += "¡Descarga la App! 👇 \n \n ";
    msj_club += "Android: http://bit.ly/ClaroClub-Android \n \n ";
    msj_club += "IOS: http://bit.ly/ClaroClubiOS \n \n ";

var palabras = {
  "cotizar": {
    "action" : {
      "type" : "transfer",
      "queue" : colas.cotizar["acd"],
      "timeoutInactivity" : colas.cotizar["timeout"]
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  "*¡Hola!🤗 Bienvenido a nuestro servicio de ventas Claro.*  En un momento uno de nuestros representantes te atenderá",
        "mediaURL" : ""
      }
    ]
  },
  "tienda": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  "Te invitamos a conocer nuestros horarios de atención ingresando aquí 👉🏼 \n https://www.claro.com.pa/personas/cacs/",
        "mediaURL" : ""
      }
    ]
  },
  "ayuda": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  msj_ayuda,
        "mediaURL" : ""
      }
    ]
  },
  "asistencia": {
   "action" : {
      "type" : "transfer",
      "queue" : colas.asistencia["acd"],
      "timeoutInactivity" : colas.asistencia["timeout"]
    },
    "messages" : []
  },
  "pagar": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  " Para conocer el saldo, fecha de vencimiento y también poder pagar tu factura móvil y residencial, puedes ingresar al siguiente portal: https://pa.mipagoclaro.com/ 💳🧾",
        "mediaURL" : ""
      }
    ]
  },
  "recarga": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  "Recarga fácil y rápido visitando nuestro portal: https://paquetes.miclaro.com.pa/ 😎",
        "mediaURL" : ""
      }
    ]
  },
  "Paquete": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  "Compra el paquete que prefieras ingresando a https://paquetes.miclaro.com.pa",
        "mediaURL" : ""
      }
    ]
  },
  "club": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  msj_club,
        "mediaURL" : ""
      }
    ]
  }
};

var contenedor = {
  "action" : {
    "type" : "",
    "queue" : ""
  },
  "messages" : [
    {
      "type" : "",
      "text" :  "",
      "mediaURL" : ""
    }
  ]
};

var msj_factura_asesor = {
  "action" : {
    "type" : "transfer",
    "queue" : colas.factura
  },
  "messages" : []
};

var msj_default = 
{
  "action" : {
    "type" : "end",
    "queue" : ""
  },
  "messages" : [
    {
      "type" : "text",
      "text" :  mensaje_df,
      "mediaURL" : ""
    }
  ]
}

var msj_fuera_horario =
{
  "action" : {
    "type" : "end", // "transfer",
    "queue" : ""
  },
  "messages" : [
    {
      "type" : "text",
      "text" :  mjs_horario,
      "mediaURL" : ""
    }
  ]
}

exports.palabras = palabras;

exports.msj_default = msj_default;

exports.mjs_horario = mjs_horario;

exports.msj_fuera_horario = msj_fuera_horario;

exports.msj_factura_asesor = msj_factura_asesor;

exports.contenedor = contenedor;

exports.colas = colas;