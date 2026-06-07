import { Formulario } from "./form.js";
import { API_URL } from "../globales.js";

class AgregarJuego extends Formulario {
	constructor() {
		const endpoint = `${API_URL}/juegos.php`;
		const btnAgregarJuego = document.querySelector(".btnAgregarJuego");
		const aggJuegoForm = document.querySelector(".agregarJuego");
		const aggJuegoClaseInputs = ".formInput";

		super(endpoint, btnAgregarJuego, aggJuegoForm, aggJuegoClaseInputs);

		this.btnAutoLlenarJuego = document.querySelector(".btnAutoLlenar");
		this.igdbProxyEndpoint = `${API_URL}/igdbProxy.php`;
		this.token = localStorage.getItem("token");
		this.dialogResultados = document.querySelector(".resultadosDialog");
		this.dialogAggJuego = document.querySelector(".dialogAggJuego ");
	}

	init() {
		this.btnSubmit.addEventListener("click", () => this.eventoSubmit());
		this.btnAutoLlenarJuego.addEventListener("click", () => this.autoLlenar());
	}

	async autoLlenar() {
		if (!this.token) {
			return;
		}

		const nombreJuego = document.querySelector("#nombre").value;
		if (!nombreJuego) {
			alert("Introduce un nombre");
			return;
		}

		const resultados = await this.buscarJuegos(nombreJuego);
		this.mostrarResultados(resultados);
	}

	async buscarJuegos(nombreJuego) {
		try {
			const respuesta = await fetch(
				`${this.igdbProxyEndpoint}?nombre=${nombreJuego}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				},
			);
			const resultados = await respuesta.json();
			return resultados.juegos;
		} catch (error) {
			throw error;
		}
	}

	mostrarResultados(resultados) {
		if (!this.dialogResultados.open) {
			const resultados = document.querySelectorAll(".resultadoJuego");
			resultados.forEach((res) => res.remove());
		}

		const resultadosContainer = document.querySelector(".resultados");
		resultados.forEach((juego) => {
			const resElement = document.createElement("div");
			resElement.setAttribute("data-id", juego.id);
			resElement.className = "resultadoJuego";

			resElement.addEventListener("click", async () => {
				(this.dialogResultados.close(), this.llenarCampos(juego));
			});
			const nombreP = document.createElement("p");
			nombreP.textContent = juego.nombre;
			resElement.appendChild(nombreP);
			resultadosContainer.appendChild(resElement);
		});

		this.dialogResultados.showModal();
	}

	async llenarCampos(datosJuego) {
		const tiempoFin = await this.obtenerTiempoFin(datosJuego.id);
		datosJuego["hrs_finalizacion"] = tiempoFin;
		for (let key of Object.keys(datosJuego)) {
			const input = document.querySelector(`.formInput[name="${key}"]`);
			if (input) {
				input.value = datosJuego[key];
			}
		}
	}

	async obtenerTiempoFin(idJuego) {
		try {
			const respuesta = await fetch(`${this.igdbProxyEndpoint}?id=${idJuego}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			});
			const { tiempo } = await respuesta.json();
			return tiempo;
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
