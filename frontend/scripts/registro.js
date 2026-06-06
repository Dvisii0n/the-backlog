import { API_URL } from "../globales.js";
import { Utils } from "./utils.js";

class Registro {
	utils = new Utils();
	btnRegistro = document.querySelector(".btn-registro");
	form = document.querySelector(".registro");

	init() {
		this.#delegarEventos();
	}

	#delegarEventos() {
		this.btnRegistro.addEventListener("click", () => this.#registrarUsuario());
	}

	async #registrarUsuario() {
		try {
			if (!this.form.reportValidity()) {
				return;
			}
			const datos = this.utils.getFormDatos(".formInput");
			const respuesta = await fetch(`${API_URL}/usuarios.php`, {
				method: "POST",
				body: JSON.stringify(datos),
			});
			const msg = await respuesta.json();
			console.log(msg);
			if (msg.codigo !== "EXITO") {
				window.location.href = "login";
			}
		} catch (error) {
			throw error;
		}
	}
}

const registro = new Registro();
registro.init();
