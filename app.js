var fs = require('fs');
var mongoose = require('mongoose');

//Conexion con la BD
mongoose.connect('mongodb://localhost:27017/unapecDB', { useNewUrlParser: true });

//Creando Schemas
let EmpleadoSchema = new mongoose.Schema({
	NoCuenta: String,
	Cedula: String,
	Sueldo: Number
});

let InfoApecSchema = new mongoose.Schema(
	{
		Rnc: String,
		NoCuenta: String
	},
	{ collection: 'infoApec' }
);

//Creando Modelos
var Empleado = mongoose.model('empleados', EmpleadoSchema);
var InfoApec = mongoose.model('InfoApec', InfoApecSchema);

//Variables
var textoCabecera = '';
var textoDetalle = '';
var d = new Date();
var Fecha = d.toLocaleDateString('es-ES');
var MontoTotal = 0;
var CantEmpleados = 0;

//Buscando datos de la cabecera
InfoApec.find(function(err, info) {
	if (err) return console.error(err);

	//Buscando datos de los empleados
	Empleado.find(function(err, empleados) {
		if (err) return console.error(err);

		for (var i in empleados) {
			textoDetalle += `\n${empleados[i].NoCuenta}\t${empleados[i].Cedula}\t${empleados[i].Sueldo}`;
			MontoTotal += empleados[i].Sueldo;
			CantEmpleados++;
		}

		textoCabecera = `${info[0].Rnc}\t${info[0].NoCuenta}\t${Fecha}\t${Fecha}\t${MontoTotal}`;

		fs.writeFile('./../../Nomina.txt', `${textoCabecera}${textoDetalle}\n${CantEmpleados} Empleados`, function(
			err
		) {
			if (err) throw err;
			console.log(`${textoCabecera}  ${textoDetalle} \n${CantEmpleados} Empleados`);
		});
	});
});
