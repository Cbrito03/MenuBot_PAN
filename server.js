var express = require('express')
var http = require('http')
var app = express()
var request = require('request')
var async = require('async')
var bodyParser = require('body-parser');
var localStorage = require('localStorage');
let fs = require('fs');
var util = require('util');
var config = require('./controllers/config.js');
var msj_wa = require('./controllers/msj_WA.js');
var msj_fb = require('./controllers/msj_FB.js');
var msj_tw = require('./controllers/msj_TW.js');
var horario = require('./controllers/validar_horario.js');
var moment = require('moment');
var moment_timezone = require('moment-timezone');
const axios = require('axios');

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

app.post('/wa/message', async (req, res) => {

	console.log("[Brito] :: [Peticion POST PAN /wa/message]");
	
	var horarios = horario.validarHorario_WA();
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
								cadena = cadena.text.toLowerCase(); // minusculas
								cadena = cadena.trim();
								msj_buscar_opcion = cadena;
								cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,""); // borramos ,;.:
								cadena = cadena.split(" "); // lo convertimo en array mediante los espacios

								for(var i = 0; i < cadena.length; i++)
								{
									for(var atr in msj_wa.palabras)
									{
										if(atr.toLowerCase() === cadena[i])
										{
											opcion = cadena[i];
											//msj_buscar = cadena[i];
											if(msj_wa.palabras[atr].action.queue === "" && msj_wa.palabras[atr].action.type !== "transfer")
											{
												result_action = msj_wa.palabras[atr].action;
												result_messages = msj_wa.palabras[atr].messages;
											}
											else if(msj_wa.palabras[atr].action.queue !== "" && msj_wa.palabras[atr].action.type === "transfer")
											{
												if(horarios)
												{
													result_action = msj_wa.palabras[atr].action;
													result_messages = msj_wa.palabras[atr].messages;												
													bandera_tranferido = true;										
												}
												else
												{	
													console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);												
													
													result_messages = msj_wa.msj_fuera_horario.messages;
													result_action = msj_wa.msj_fuera_horario.action;
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
									result_messages = msj_wa.msj_default.messages;
									result_action = msj_wa.msj_default.action;
								}		

								var options = {
									method : 'post',
									url : config.url_estd,
									headers : { 'Content-Type': 'application/json'},
									data: JSON.stringify({
										"conversacion_id" : conversationID,
										"pais" : config.info.pais,
										"app" : config.info.nomApp,
										"opcion" : opcion,
										"rrss" : "WA",
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
							else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT")
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

app.post('/tw/message', async (req, res) => {

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
							else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT")
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

app.post('/fb/message', async (req, res) => {

	console.log("[Brito] :: [Peticion POST PAN /fb/message]");
	
	var horarios = horario.validarHorario_FB();
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
								cadena = cadena.text.toLowerCase(); // minusculas
								cadena = cadena.trim();
								msj_buscar_opcion = cadena;
								cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,""); // borramos ,;.:
								cadena = cadena.split(" "); // lo convertimo en array mediante los espacios

								for(var i = 0; i < cadena.length; i++)
								{
									for(var atr in msj_fb.palabras)
									{
										if(atr.toLowerCase() === cadena[i])
										{
											opcion = cadena[i];
											//msj_buscar = cadena[i];
											if(msj_fb.palabras[atr].action.queue === "" && msj_fb.palabras[atr].action.type !== "transfer")
											{
												result_action = msj_fb.palabras[atr].action;
												result_messages = msj_fb.palabras[atr].messages;
											}
											else if(msj_fb.palabras[atr].action.queue !== "" && msj_fb.palabras[atr].action.type === "transfer")
											{
												if(horarios)
												{
													result_action = msj_fb.palabras[atr].action;
													result_messages = msj_fb.palabras[atr].messages;												
													bandera_tranferido = true;										
												}
												else
												{	
													console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);												
													
													result_messages = msj_fb.msj_fuera_horario.messages;
													result_action = msj_fb.msj_fuera_horario.action;
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
									result_messages = msj_fb.msj_default.messages;
									result_action = msj_fb.msj_default.action;
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
										"rrss" : "FB",
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
							else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT")
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

http.createServer(app).listen(config.puerto, () => {
  console.log('Server started MenutBot_PAN at http://localhost:' + config.puerto);
});