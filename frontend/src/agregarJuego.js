import { Formulario } from "./form.js";
import { IGDBHandler } from "./igdbHandler.js";
import { API_URL } from "../globales.js";

class AgregarJuego extends Formulario {
	igdb = new IGDBHandler(`.formInput`);
	constructor() {
		const endpoint = `${API_URL}/juegos.php`;
		const btnAgregarJuego = document.querySelector(".btnAgregarJuego");
		const aggJuegoForm = document.querySelector(".agregarJuego");
		const aggJuegoClaseInputs = ".formInput";

		super(endpoint, btnAgregarJuego, aggJuegoForm, aggJuegoClaseInputs);

		this.btnAutoLlenarJuego = document.querySelector(".btnAutoLlenar");
		this.token = localStorage.getItem("token");
		this.dialogAggJuego = document.querySelector(".dialogAggJuego ");
	}

	init() {
		this.btnSubmit.addEventListener("click", () => this.eventoSubmit());
		this.btnAutoLlenarJuego.addEventListener("click", () => {
			const nombreJuego = document.querySelector("#nombre").value;
			this.igdb.autoLlenar(nombreJuego);
		});
	}

	async eventoSubmit() {
		if (!this.token) {
			return;
		}
		try {
			if (!this.form.reportValidity()) {
				return;
			}
			const datos = this.utils.getFormDatos(this.claseInputs);
			const respuesta = await fetch(this.submitEndpoint, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
				body: JSON.stringify(datos),
			});
			const resultado = await respuesta.json();
			if (resultado.codigo === "EXITO") {
				this.dialogAggJuego.close();
				alert("Juego guardado");
				window.location.reload();
			} else if (resultado.codigo === "MYSQL_ERR") {
				alert("Datos de juego invalidos");
			}
		} catch (error) {
			throw error;
		}
	}
}

export { AgregarJuego };
