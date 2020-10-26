var info = 
{
  "pais" : "PAN",
  "nomApp" : "MenuBot_PAN",
  "version" : "4.0.0"
};

var url_estd = 'https://estadisticasmenubot.mybluemix.net/opcion/insert';

var puerto = 8080;

var horario_WA = {
  "OPEN_HOUR" : 0,
  "OPEN_MINUTE" : 0,
  "CLOSE_HOUR" : 23,
  "CLOSE_MINUTE" : 59,
  dias : {
    "0" : ["domingo",true],
    "1" : ["lunes",true],
    "2" : ["martes",true],
    "3" : ["miercoles",true],
    "4" : ["jeves",true],
    "5" : ["viernes",true],
    "6" : ["sabado",true]
  }
};

var horario_TW = {
  "OPEN_HOUR" : 6,
  "OPEN_MINUTE" : 0,
  "CLOSE_HOUR" : 22,
  "CLOSE_MINUTE" : 0,
  dias : {
    "0" : ["domingo",true],
    "1" : ["lunes",true],
    "2" : ["martes",true],
    "3" : ["miercoles",true],
    "4" : ["jeves",true],
    "5" : ["viernes",true],
    "6" : ["sabado",true]
  }
};

var horario_FB = {
  "OPEN_HOUR" : 6,
  "OPEN_MINUTE" : 0,
  "CLOSE_HOUR" : 22,
  "CLOSE_MINUTE" : 0,
  dias : {
    "0" : ["domingo",true],
    "1" : ["lunes",true],
    "2" : ["martes",true],
    "3" : ["miercoles",true],
    "4" : ["jeves",true],
    "5" : ["viernes",true],
    "6" : ["sabado",true]
  }
};

exports.horario_WA = horario_WA;
exports.horario_TW = horario_TW;
exports.horario_FB = horario_FB;
exports.puerto = puerto;
exports.info = info;
exports.url_estd = url_estd;
