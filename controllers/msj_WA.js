var colas = {
  "opcion_1" : "PA_Wa_Ventas",
  "opcion_2" : "PA_Wa_Movil"
};

var mensaje_df = "Estimado cliente queremos informarte que debido a la situación actual presentada con COVID-19 ";
    mensaje_df +="estamos tomando medidas de prevención para salvaguardar la salud de nuestros clientes y ";
    mensaje_df +="colaboradores. Reiteramos nuestro compromiso y estamos realizando todo el esfuerzo para mantener nuestra atención. ";
    mensaje_df +="Sin embargo debido a esta situación los tiempos de respuesta pueden verse afectados. Ofrecemos disculpas por los ";
    mensaje_df +="inconvenientes que esto pueda ocasionar y agradecemos su comprensión. Recuerda que también puedes realizar tus ";
    mensaje_df +="consultas por medio de Facebook y Twitter Atentamente, Claro Panamá $cr $cr ";
    
var mensaje_df_2 ="👋¡Hola! gracias por comunicarte al WhatsApp Claro, nuestro compromiso es mantenerte ";
    mensaje_df_2 +="conectado. Escoge la opción que necesitas y con gusto te atenderemos $cr $cr ";
    mensaje_df_2 +="1. Atención al Cliente $cr ";
    mensaje_df_2 +="2. Ventas $cr ";

var mjs_horario = "";

var msj_opcion = {
  "opcion_1" : {
    "action" : {
      "type" : "transfer",
      "queue" : colas.opcion_1
    },
    "messages" : []
  },
  "opcion_2" : {
    "action" : {
      "type" : "transfer",
      "queue" : colas.opcion_2
    },
    "messages" : []
  }
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
    },
     {
      "type" : "text",
      "text" :  mensaje_df_2,
      "mediaURL" : ""
    }
  ]
};

var msj_fuera_horario =
{
  "action" : {
    "type" : "end",
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

exports.msj_opcion = msj_opcion;

exports.msj_default = msj_default;

exports.msj_fuera_horario = msj_fuera_horario;

exports.contenedor = contenedor;