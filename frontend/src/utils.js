class Utils {
	getFormDatos(inputClass) {
		const datosForm = {};
		document
			.querySelectorAll(inputClass)
			.forEach((entrada) => (datosForm[`${entrada.name}`] = entrada.value));
		return datosForm;
	}

	formatearFecha(fecha) {
		return new Date(fecha).toLocaleDateString("en-GB");
	}
}

export { Utils };
