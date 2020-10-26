const horario = require('../controllers/validar_horario.js');
const moment_timezone = require('moment-timezone');
const msj_tw = require('../controllers/msj_TW.js');
const config = require('../controllers/config.js');
const localStorage = require('localStorage');
const express = require('express');
const moment = require('moment');
const axios = require('axios');
const async = require('async');

const router = express.Router();

router.post('/tw/message', async (req, res) => {

  console.log("[Brito] :: [Peticion POST PAN /tw/message]");
  
  var horarios = horario.validarHorario_TW();
  var resultado;
  var bandera = false , estatus = 200;
  var msj_buscar = "", msj_buscar_opcion = "";

  var result_messages, result_action;

  var apiVersion = req.body.apiVersion;
  var conversationID = req.body.conversationId;
  var authToken = req.body.authToken;
  var channel = req.body.channel;
  var user = req.body.user;
  var context = req.body.context;
  var cadena = req.body.message;

  var bandera_tranferido = false;
  var bandera_fueraHorario = false;
  var opcion = "";
  var bandera_opt = false;

  var bandera_TIMEOUT = false;

  var now = moment();
  var fechaStamp = moment(context.lastInteractionFinishTime).format("YYYY-MM-DD HH:mm:ss");
  var fecha_actual = now.tz("America/Costa_Rica").format("YYYY-MM-DD HH:mm:ss");
  var fecha2 = moment(fecha_actual, "YYYY-MM-DD HH:mm:ss");

  console.log("fechaStamp :: " + fechaStamp);

  var diff = fecha2.diff(fechaStamp, 'h'); 
  console.log("diff :: " + diff);
  console.log(typeof diff);

  if(apiVersion !== '' && typeof apiVersion !== "undefined") 
  {
    if(authToken !== '' && typeof authToken !== "undefined") 
    {
      if(channel !== '' && typeof channel !== "undefined") 
      {
        if(user !== '' && typeof user !== "undefined") 
        {
          if(context !== '' && typeof context !== "undefined") 
          {
            if(cadena !== '' && typeof cadena !== "undefined") 
            {
              if(context.lastInteractionFinishType !== "CLIENT_TIMEOUT")
              {             
                bandera_TIMEOUT = true;
              }             
              else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT" && diff <= 24)
              {
                bandera_TIMEOUT = false;
              }
              else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT" && diff > 24)
              {
                bandera_TIMEOUT = true;
              }

              if(bandera_TIMEOUT)
              {
                cadena = cadena.text.toLowerCase(); // minusculas
                cadena = cadena.trim();
                msj_buscar_opcion = cadena;
                cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,""); // borramos ,;.:
                cadena = cadena.split(" "); // lo convertimo en array mediante los espacios

                for(var i = 0; i < cadena.length; i++)
                {
                  for(var atr in msj_tw.palabras)
                  {
                    if(atr.toLowerCase() === cadena[i])
                    {
                      opcion = cadena[i];
                      //msj_buscar = cadena[i];
                      if(msj_tw.palabras[atr].action.queue === "" && msj_tw.palabras[atr].action.type !== "transfer")
                      {
                        result_action = msj_tw.palabras[atr].action;
                        result_messages = msj_tw.palabras[atr].messages;
                      }
                      else if(msj_tw.palabras[atr].action.queue !== "" && msj_tw.palabras[atr].action.type === "transfer")
                      {
                        if(horarios)
                        {
                          result_action = msj_tw.palabras[atr].action;
                          result_messages = msj_tw.palabras[atr].messages;                        
                          bandera_tranferido = true;                    
                        }
                        else
                        { 
                          console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);                       
                          
                          result_messages = msj_tw.msj_fuera_horario.messages;
                          result_action = msj_tw.msj_fuera_horario.action;
                          bandera_fueraHorario = true;                                                                
                        }
                      }
                      
                      bandera = true;
                      bandera_opt = true;
                      break;
                    }
                  }      
                  if(bandera){ break; }
                }

                if(!bandera)
                {
                  result_messages = msj_tw.msj_default.messages;
                  result_action = msj_tw.msj_default.action;
                }

                console.log("[Brito] :: [message] :: [msj_buscar_opcion] :: " + msj_buscar_opcion); 

                var options = {
                  method : 'post',
                  url : config.url_estd,
                  headers : { 'Content-Type': 'application/json'},
                  data: JSON.stringify({
                    "conversacion_id" : conversationID,
                    "pais" : config.info.pais,
                    "app" : config.info.nomApp,
                    "opcion" : opcion,
                    "rrss" : "TW",
                    "transferencia" : bandera_tranferido,
                    "fueraHorario" : bandera_fueraHorario,
                    "grupoACD" : result_action.queue        
                  })
                };          

                if(bandera == true)
                {
                  if(bandera_opt)
                  {
                    console.log(options);
                    var resultado_axios = await axios(options);
                    console.log("[Resultado AXIOS] :: ");
                    console.log(resultado_axios);
                  }                 
                }             

                console.log("[Brito] :: [channel] :: ", channel, " :: [opcion] :: ", opcion);                     

                resultado = {
                  "context": context,
                  "action": result_action,
                  "messages": result_messages,
                  "additionalInfo": {
                    "key":"RUT",
                    "RUT":"1-9"
                  }
                }
              }
              else
              {
                resultado = {
                  "context": context,
                  "action": {
                    "type" : "transfer",
                      "queue" : context.lastInteractionQueue,
                  },
                  "messages": [],
                  "additionalInfo": {
                    "key":"RUT",
                    "RUT":"1-9"
                  }
                }
              }

              console.log("[Brito] :: [RESULTADO] :: [resultado] :: ", resultado);
                    console.log("[Brito] :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: [Brito]");
                  }
                  else
                  {
                    estatus = 400;
                    resultado = {
                      "estado": "El valor de mensaje es requerido"
                    }
                  } 
          }
          else
          {
            estatus = 400;
            resultado = {
              "estado": "El valor de contexto es requerido"
            }
          } 
        }
        else
        {
          estatus = 400;
          resultado = {
            "estado": "El valor de user es requerido"
          }
        }        
      }
      else
      {
        estatus = 400;
        resultado = {
          "estado": "El valor de channel es requerido"
        }
      } 
    }
    else
    {
      estatus = 400;
      resultado = {
        "estado": "El valor de authToken es requerido"
      }
    }
  }
  else
  {
    estatus = 400;
    resultado = {
      "estado": "El valor de apiVersion es requerido"
    }
  }

  res.status(estatus).json(resultado);
});

module.exports = router