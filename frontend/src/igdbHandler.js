import { API_URL } from "../globales.js";

class IGDBHandler {
	constructor(selectorCampos) {
		this.igdbProxyEndpoint = `${API_URL}/igdbProxy.php`;
		this.token = localStorage.getItem("token");
		this.dialogResultados = document.querySelector(".resultadosDialog");
		this.selectorCampos = selectorCampos;
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

	async autoLlenar(nombreJuego) {
		if (!this.token) {
			return;
		}

		if (!nombreJuego) {
			alert("Introduce un nombre");
			return;
		}

		const resultados = await this.buscarJuegos(nombreJuego);
		this.mostrarResultados(resultados);
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
				(this.dialogResultados.close(),
					await this.llenarCampos(juego, this.selectorCampos));
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
			const input = document.querySelector(
				`${this.selectorCampos}[name="${key}"]`,
			);

			if (input) {
				input.value = datosJuego[key];
			}
		}
	}
}

export { IGDBHandler };
