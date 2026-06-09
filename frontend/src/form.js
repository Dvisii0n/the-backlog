import { Utils } from "./utils.js";

//formulario reusable que envia datos y muestra errores de validacion, nunca volver a hacer esta estupidez, no sirve para nada y sobrecomplica el codigo
class Formulario {
	utils = new Utils();
	exitoRedirigirA = null;
	exitoCode = "EXITO";
	propiedadCodigo = "codigo";
	proiedadMsg = "msg";
	cajaErrores = null;

	constructor(submitEndpoint, btnSubmit, form, claseInputs, cajaErrores) {
		this.submitEndpoint = submitEndpoint;
		this.btnSubmit = btnSubmit;
		this.form = form;
		this.claseInputs = claseInputs;
		if (cajaErrores) {
			this.cajaErrores = cajaErrores;
		}
	}

	setExitoRedirectTo(paginaHTML) {
		this.exitoRedirigirA = paginaHTML;
	}

	init() {
		this.#delegarEventos();
	}

	#delegarEventos() {
		this.btnSubmit.addEventListener("click", () => this.eventoSubmit());
	}

	async eventoSubmit() {
		try {
			if (!this.form.reportValidity()) {
				return;
			}
			const datos = this.utils.getFormDatos(this.claseInputs);
			const respuesta = await fetch(this.submitEndpoint, {
				method: "POST",
				body: JSON.stringify(datos),
			});
			const resultado = await respuesta.json();
			if (resultado[`${this.propiedadCodigo}`] === this.exitoCode) {
				if (this.exitoRedirigirA) {
					window.location.href = this.exitoRedirigirA;
				}
			} else {
				if (this.cajaErrores) {
					this.mostrarErrores([resultado[`${this.proiedadMsg}`]]);
				} else {
					console.log(resultado);
				}
			}
		} catch (error) {
			throw error;
		}
	}

	mostrarErrores(erroresMsgs) {
		erroresMsgs.forEach((errMsg) => {
			const errLi = document.createElement("li");
			errLi.className = "formError";
			errLi.textContent = errMsg;
			this.cajaErrores.appendChild(errLi);
		});
	}
}

export { Formulario };
