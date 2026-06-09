import { Formulario } from "./form.js";
import { API_URL } from "../globales.js";
import { IGDBHandler } from "./igdbHandler.js";

class EditarJuego extends Formulario {
	igdb = new IGDBHandler(`.formInputEdit`);
	constructor() {
		const endpoint = `${API_URL}/juegos.php`;
		const btnEditarJuego = document.querySelector(".btnEditarJuego");
		const editarJuegoForm = document.querySelector(".editarJuego");
		const editarJuegoClaseInputs = ".formInputEdit";

		super(endpoint, btnEditarJuego, editarJuegoForm, editarJuegoClaseInputs);

		this.btnAutoLlenarJuego = document.querySelector(".btnAutoLlenarEdit");
		this.token = localStorage.getItem("token");
		this.dialogEditarJuego = document.querySelector(".dialogEditarJuego ");
		this.idJuego = "";
	}

	setIdJuego(idJuego) {
		this.idJuego = idJuego;
	}

	init() {
		this.btnSubmit.addEventListener("click", () => this.eventoSubmit());
		this.btnAutoLlenarJuego.addEventListener("click", () => {
			const nombreJuego = document.querySelector("#nombre-edit").value;
			this.igdb.autoLlenar(nombreJuego);
		});
	}

	async llenarCamposInfoJuego() {
		const juego = await this.getInfoJuego();

		for (let key of Object.keys(juego)) {
			const input = document.querySelector(`.formInputEdit[name="${key}"]`);

			if (input) {
				if (key.includes("fecha")) {
					const date = new Date(juego[key]);
					const formateada = date.toISOString().split("T")[0];
					input.value = formateada;
				} else {
					input.value = juego[key];
				}
			}
		}
	}

	async getInfoJuego() {
		if (!this.token) {
			return;
		}

		try {
			const respuesta = await fetch(
				this.submitEndpoint + `?id=${this.idJuego}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				},
			);
			const resultado = await respuesta.json();
			if (resultado.codigo === "EXITO") {
				const { juegos } = resultado;
				return juegos;
			}
		} catch (error) {
			throw error;
		}
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
			const respuesta = await fetch(
				this.submitEndpoint + `?id=${this.idJuego}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
					body: JSON.stringify(datos),
				},
			);
			const resultado = await respuesta.json();
			if (resultado.codigo === "EXITO") {
				this.dialogEditarJuego.close();
				alert("Juego actualizado");
				window.location.reload();
			} else if (resultado.codigo === "MYSQL_ERR") {
				alert("Datos de juego invalidos");
			}
		} catch (error) {
			throw error;
		}
	}
}

export { EditarJuego };
