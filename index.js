var express = require('express')
var http = require('http')
var app = express()
var request = require('request')
var async = require('async')
var bodyParser = require('body-parser');
var localStorage = require('localStorage')
let fs = require('fs');
var util = require('util');
var config = require('./controllers/config.js');
var msj_fb = require('./controllers/msj_FB.js');
var msj_tw = require('./controllers/msj_TW.js');
var msj_wa = require('./controllers/msj_WA.js');
var horario = require('./controllers/validar_horario.js');
var moment = require('moment');
var moment_timezone = require('moment-timezone');
var port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('img'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

var mjs_horario = config.mjs_horario;
var contenedor = config.contenedor;

app.post('/wa/message', (req, res) => {
	console.log("[Brito] :: [Peticion POST PA /wa/message]");
	
	var horarios = horario.validarHorario_WA();

	var result, resultado;
	var bandera = false , estatus = 200;
	var msj_buscar = "", msj_buscar_opcion = "", opcion = "";

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
	var nom_grupoACD = "", accion = "";
	var bandera_opt = false;

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
							cadena = cadena.text.toLowerCase(); // minusculas
							cadena = cadena.trim();
							msj_buscar_opcion = cadena;
							cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,""); // borramos ,;.:
		
							console.log("Brito ::  Cadena :: ", cadena );
							cadena =  cadena;

							if(localStorage.getItem("msj_"+conversationID) == null && ( cadena != "1" || cadena != "2")) // No existe
							{
								console.log('[Brito] :: [message] :: [Crea Storage] :: ' + localStorage.getItem("msj_"+conversationID));

								localStorage.setItem("msj_"+conversationID, "PAN");
								result_messages = msj_wa.msj_default.messages;
								result_action = msj_wa.msj_default.action;
								bandera = true;
							}
							else // Existe localStorage
							{
								console.log('[Brito] :: [message] :: [Borra Storage] :: ' + localStorage.getItem("msj_"+conversationID));
								opcion = "opcion - " + cadena;

								if((cadena == "1" || cadena == "2") && localStorage.getItem("msj_"+conversationID) == "PAN")
								{
									localStorage.removeItem("msj_"+conversationID);
									result_messages = msj_wa.msj_opcion["opcion_"+cadena].messages;
									result_action = msj_wa.msj_opcion["opcion_"+cadena].action;
									bandera_tranferido = true;
									bandera_opt = true;
								}
								else
								{
									//localStorage.removeItem("msj_"+conversationID);
									result_messages = msj_wa.msj_default.messages;
									result_action = msj_wa.msj_default.action;
								}

								bandera = true;
							}              

							var options = {
								'method': 'POST',
								'url': 'https://estadisticasmenubot.mybluemix.net/opcion/insert',
								'headers': {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(
							{
								"conversacion_id": conversationID,
								"pais": config.info.pais,
								"app": config.info.nomApp,
								"opcion": opcion,
								"transferencia": bandera_tranferido,
								"fueraHorario": bandera_fueraHorario,
								"grupoACD": result_action.queue
							})
							};

							if(bandera_opt)
							{
								console.log("[Brito] :: [options] :: ", options);
								/*request(options, function (error, response)
								{ 
									if (error) throw new Error(error);
									console.log(response.body);
								});*/
							}

							estatus = 200;

							resultado = {
								"context" : {
									"agent" : false,
									"callback" : false,
									"video" : false
								},
								"action" : result_action,
								"messages" : result_messages,
								"additionalInfo" : {
									"key" : "RUT",
									"RUT"  :"1-9"
								}
							};

							console.log("[Brito] :: [resultado] :: ", resultado);

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

app.post('/fb/message', (req, res) => {
	console.log("[Brito] :: [Peticion POST PA /fb/message]");
	
	var horarios = horario.validarHorario_WA();

	var result, resultado;
	var bandera = false , estatus = 200;
	var msj_buscar = "", msj_buscar_opcion = "", opcion = "";

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
	var nom_grupoACD = "", accion = "";
	var bandera_opt = false;

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
							cadena = cadena.text.toLowerCase(); // minusculas
							cadena = cadena.trim();
							msj_buscar_opcion = cadena;
							cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,""); // borramos ,;.:
		
							console.log("Brito ::  Cadena :: ", cadena );
							cadena =  cadena;

							if(localStorage.getItem("msj_"+conversationID) == null && ( cadena != "1" || cadena != "2")) // No existe
							{
								console.log('[Brito] :: [message] :: [Crea Storage] :: ' + localStorage.getItem("msj_"+conversationID));

								localStorage.setItem("msj_"+conversationID, "PAN");
								result_messages = msj_fb.msj_default.messages;
								result_action = msj_fb.msj_default.action;
								bandera = true;
							}
							else // Existe localStorage
							{
								console.log('[Brito] :: [message] :: [Borra Storage] :: ' + localStorage.getItem("msj_"+conversationID));
								opcion = "opcion - " + cadena;

								if((cadena == "1" || cadena == "2") && localStorage.getItem("msj_"+conversationID) == "PAN")
								{
									localStorage.removeItem("msj_"+conversationID);
									result_messages = msj_fb.msj_opcion["opcion_"+cadena].messages;
									result_action = msj_fb.msj_opcion["opcion_"+cadena].action;
									bandera_tranferido = true;
									bandera_opt = true;
								}
								else
								{
									//localStorage.removeItem("msj_"+conversationID);
									result_messages = msj_fb.msj_default.messages;
									result_action = msj_fb.msj_default.action;
								}

								bandera = true;
							}              

							var options = {
								'method': 'POST',
								'url': 'https://estadisticasmenubot.mybluemix.net/opcion/insert',
								'headers': {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(
							{
								"conversacion_id": conversationID,
								"pais": config.info.pais,
								"app": config.info.nomApp,
								"opcion": opcion,
								"transferencia": bandera_tranferido,
								"fueraHorario": bandera_fueraHorario,
								"grupoACD": result_action.queue
							})
							};

							if(bandera_opt)
							{
								console.log("[Brito] :: [options] :: ", options);
								/*request(options, function (error, response)
								{ 
									if (error) throw new Error(error);
									console.log(response.body);
								});*/
							}

							resultado = {
								"context" : {
									"agent" : false,
									"callback" : false,
									"video" : false
								},
								"action" : result_action,
								"messages" : result_messages,
								"additionalInfo" : {
									"key" : "RUT",
									"RUT"  :"1-9"
								}
							};

							console.log("[Brito] :: [resultado] :: ", resultado);

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

app.post('/tw/message', (req, res) => {
	console.log("[Brito] :: [Peticion POST PA /tw/message]");
	
	var horarios = horario.validarHorario_WA();

	var result, resultado;
	var bandera = false , estatus = 200;
	var msj_buscar = "", msj_buscar_opcion = "", opcion = "";

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
	var nom_grupoACD = "", accion = "";
	var bandera_opt = false;

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
							cadena = cadena.text.toLowerCase(); // minusculas
							cadena = cadena.trim();
							msj_buscar_opcion = cadena;
							cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,""); // borramos ,;.:
		
							console.log("Brito ::  Cadena :: ", cadena );
							cadena =  cadena;

							if(localStorage.getItem("msj_"+conversationID) == null && ( cadena != "1" || cadena != "2")) // No existe
							{
								console.log('[Brito] :: [message] :: [Crea Storage] :: ' + localStorage.getItem("msj_"+conversationID));

								localStorage.setItem("msj_"+conversationID, "PAN");
								result_messages = msj_tw.msj_default.messages;
								result_action = msj_tw.msj_default.action;
								bandera = true;
							}
							else // Existe localStorage
							{
								console.log('[Brito] :: [message] :: [Borra Storage] :: ' + localStorage.getItem("msj_"+conversationID));
								opcion = "opcion - " + cadena;

								if((cadena == "1" || cadena == "2") && localStorage.getItem("msj_"+conversationID) == "PAN")
								{
									localStorage.removeItem("msj_"+conversationID);
									result_messages = msj_tw.msj_opcion["opcion_"+cadena].messages;
									result_action = msj_tw.msj_opcion["opcion_"+cadena].action;
									bandera_tranferido = true;
									bandera_opt = true;
								}
								else
								{
									//localStorage.removeItem("msj_"+conversationID);
									result_messages = msj_tw.msj_default.messages;
									result_action = msj_tw.msj_default.action;
								}

								bandera = true;
							}              

							var options = {
								'method': 'POST',
								'url': 'https://estadisticasmenubot.mybluemix.net/opcion/insert',
								'headers': {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(
							{
								"conversacion_id": conversationID,
								"pais": config.info.pais,
								"app": config.info.nomApp,
								"opcion": opcion,
								"transferencia": bandera_tranferido,
								"fueraHorario": bandera_fueraHorario,
								"grupoACD": result_action.queue
							})
							};

							if(bandera_opt)
							{
								console.log("[Brito] :: [options] :: ", options);
								/*request(options, function (error, response)
								{ 
									if (error) throw new Error(error);
									console.log(response.body);
								});*/
							}

							resultado = {
								"context" : {
									"agent" : false,
									"callback" : false,
									"video" : false
								},
								"action" : result_action,
								"messages" : result_messages,
								"additionalInfo" : {
									"key" : "RUT",
									"RUT"  :"1-9"
								}
							};

							console.log("[Brito] :: [resultado] :: ", resultado);

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

app.post('/terminate', (req, res) => {
	var result, resultado;
	var bandera = false , estatus = 200;

	var conversationID = req.body.conversationId;
	var RRSS = req.body.RRSS;
	var canal = req.body.channel;
	var contexto = req.body.context;

	if(RRSS !== '' && typeof RRSS !== "undefined") 
	{
	    if(canal !== '' && typeof canal !== "undefined") 
	    {
	      if(contexto !== '' && typeof contexto !== "undefined") 
	      {
	        estatus = 200;
	        resultado = {
	          "estado": "OK"
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
	        "estado": "El valor de canal es requerido"
	      }
	    } 
	}
	else
	{
		estatus = 400;
	    resultado = {
	      "estado": "El valor de RRSS es requerido"
	    }
	} 

  res.status(estatus).json(resultado);
});

app.get('/', (req, res) => {
	var horario_WA = horario.validarHorario_WA();
	var horario_FB = horario.validarHorario_FB();
	var horario_TW = horario.validarHorario_TW();

	console.log("[Brito] :: [Raiz] :: [Respuesta de horarios_WA] :: " + horario_WA);
	console.log("[Brito] :: [Raiz] :: [Respuesta de horarios_FB] :: " + horario_FB);
	console.log("[Brito] :: [Raiz] :: [Respuesta de horarios_TW] :: " + horario_TW);

	// create Date object for current location
	var now = moment();
	var fecha_actual = now.tz("America/Panama").format("YYYY-MM-DD HH:mm:ss");
	var anio = now.tz("America/Panama").format("YYYY");

	var respuesta = "Bienvenido al menú Bot de <strong>Panamá</strong>, las opciones disponibles son: <br>";
		respuesta += '<ul> <li> <strong> WhastApp: "/wa/message" </strong> </li>';
		respuesta += '<li> <strong> Facebbok MSS: "/fb/message" </strong> </li>';
		respuesta += '<li> <strong> Twitter DM: "/tw/message" </strong> </li> </ul>';
		respuesta += "Horario de atención para <strong>WhastApp</strong> es: <br> ";
		respuesta += "Hora inicio: " + config.horario_WA.OPEN_HOUR + " - Hora Fin: " + config.horario_WA.CLOSE_HOUR + " <br> ";
		respuesta += "Respuesta del Horario: " + horario_WA + " <br> <br> ";
		respuesta += "Horario de atención para <strong>Facebook Messenger</strong> es: <br> ";		
		respuesta += "Hora inicio: " + config.horario_FB.OPEN_HOUR + " - Hora Fin: " + config.horario_FB.CLOSE_HOUR + " <br> ";
		respuesta += "Respuesta del Horario: " + horario_FB + " <br> <br> ";
		respuesta += "Horario de atención para <strong>Twitter DM</strong> es: <br> ";		
		respuesta += "Hora inicio: " + config.horario_TW.OPEN_HOUR + " - Hora Fin: " + config.horario_TW.CLOSE_HOUR + " <br> ";
		respuesta += "Respuesta del Horario: " + horario_TW + " <br> <br> ";
		respuesta += "Hora actual de <strong>Panamá</strong>:  " + fecha_actual +" <br>";
		respuesta += "<strong> Sixbell "+anio+" - Versión: "+config.info.version+" </strong><br>";

	res.status(200).send(respuesta);
});

http.createServer(app).listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});