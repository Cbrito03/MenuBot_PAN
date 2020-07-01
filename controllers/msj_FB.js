
var colas = {
  "opcion_1" : "PA_FB_MSS_SAC",
  "opcion_2" : "PA_FB_MSS_VENTAS"
};

var mensaje_df = "Bienvenido a Claro, te invitamos a registrarte en https://miclaro.com.pa/wps/portal/pan/ ";
    mensaje_df +="dónde podrás realizar de inmediato las siguientes autogestiones: $cr $cr ";
    mensaje_df +="Pagos de factura $cr ";
    mensaje_df +="Consulta de saldo $cr ";
    mensaje_df +="Recargas y paquetes prepagos $cr ";
    mensaje_df +="Horarios y ubicación de nuestras tiendas $cr ";
    mensaje_df +="Promociones Vigentes $cr ";
    mensaje_df +="Atención en Canales Digitales $cr $cr ";
    mensaje_df +="En un momento serás atendido por uno de nuestros asesores 🤓 💻 $cr $cr ";

var mensaje_df_2 ="👋¡Hola! gracias por comunicarte al Facebook Claro, nuestro compromiso es mantenerte ";
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