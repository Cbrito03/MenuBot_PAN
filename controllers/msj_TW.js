var colas = {
  "cotizar" : "PA_TW_DM_Ventas",
  "asistencia" : "PA_TW_DM_SAC"
};

var mensaje_df = "¡Hola! $cr Soy *Avi*, tu asistente virtual 🤖 de Claro $cr ";
    mensaje_df +="¡Este es el nuevo menú de opciones con las que te puedo apoyar más rápido!  Solo envía una de las palabras que aparecen resaltadas según tu consulta. $cr $cr ";
    mensaje_df +="➡️ Envía *cotizar* para conocer nuestros planes móviles y residenciales si deseas renovar o contratar nuevos servicios. 😎  😎 $cr $cr ";
    mensaje_df +="➡️ Envía *pagar* para ver el saldo, fecha de vencimiento y pagar tu factura móvil y residencial. 💳 $cr $cr ";
    mensaje_df +="➡️ Envía *recarga* para hacer una recarga.  $cr $cr ";
    mensaje_df +="➡️ Envía *paquete* para compra de paquete. $cr $cr ";
    mensaje_df +="➡️ Envía *ayuda* para conocer todo lo que puedes hacer en un mismo lugar. $cr $cr ";
    mensaje_df +="➡️ Envía *asistencia* si necesitas ayuda con tus servicios móviles o fijos 📱 💻 📺. $cr $cr ";
    mensaje_df +="➡️ Envía *Tienda* si deseas conocer los horarios de nuestras sucursales $cr $cr ";
    mensaje_df +="➡️ Envía *club* para conocer los establecimientos con promociones especiales solo por ser cliente Claro. 😎 💰  $cr $cr ";
    //mensaje_df +="➡️ Envía *asesor* si aún deseas ser atendido por uno de nuestros agentes de servicio al cliente o ventas. 👩💻👨💻 $cr $cr ";

var mjs_horario = '¡Hola, gracias por comunicarte a Claro, te informamos nuestros horarios de atención!  $cr $cr ';
    mjs_horario += '⌚Facebook y Twitter  $cr $cr ';
    mjs_horario += 'Lunes a Domingo  $cr $cr ';
    mjs_horario += '6:00 am a 22:00 horas  $cr $cr $cr';
    mjs_horario += 'Whatsapp disponible 24/7  $cr $cr $cr';
    mjs_horario += 'Te invitamos a ingresar a https://miclaro.com.pa/pa/ disponible 24/7 para que puedas hacer tus autogestiones.  $cr $cr';
    mjs_horario += '¡Claro que sí!';
   
var msj_ayuda = "Ingresa aquí 👉🏼  https://miclaro.com.pa/ si deseas realizar alguna de las siguientes gestiones: $cr $cr ";
    msj_ayuda += "Pagos de factura $cr";
    msj_ayuda += "Consulta de saldo $cr";
    msj_ayuda += "Recargas $cr";
    msj_ayuda += "Paquetes prepago  $cr";
    msj_ayuda += "Horarios y ubicaciones de nuestras tiendas $cr";
    msj_ayuda += "Promociones Vigentes  $cr";

var msj_club = "Si eres Claro 😉 eres parte del club con beneficios y descuentos. $cr $cr ";
    msj_club += "¡Descarga la App! 👇 $cr $cr ";
    msj_club += "Android: http://bit.ly/ClaroClub-Android $cr $cr ";
    msj_club += "IOS: http://bit.ly/ClaroClubiOS $cr $cr ";

var palabras = {
  "cotizar": {
    "action" : {
      "type" : "transfer",
      "queue" : colas.cotizar
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
        "text" :  "Te invitamos a conocer nuestros horarios de atención ingresando aquí 👉🏼 $cr https://www.claro.com.pa/personas/cacs/",
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
      "queue" : colas.asistencia
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
    "type" : "continue",
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