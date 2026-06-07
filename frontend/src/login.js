import { API_URL } from "../globales.js";
import { Formulario } from "./form.js";

class Login extends Formulario {
	constructor() {
		const endpoint = `${API_URL}/login.php`;
		const btnLogin = document.querySelector(".btnLogin");
		const loginForm = document.querySelector(".login");
		const loginErrores = document.querySelector(".loginErrores");
		const loginClaseInputs = ".formInput";

		super(endpoint, btnLogin, loginForm, loginClaseInputs, loginErrores);
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
				localStorage.setItem("token", resultado["token"]);
				window.location.href = "libreria";
			} else {
				this.mostrarErrores([resultado[`${this.proiedadMsg}`]]);
			}
		} catch (error) {
			throw error;
		}
	}
}

const login = new Login();
login.init();
