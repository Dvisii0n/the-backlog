import { AgregarJuego } from "./agregarJuego.js";
import { API_URL } from "../globales.js";
import { Utils } from "./utils.js";

class Libreria {
	utils = new Utils();
	constructor() {
		this.contenedorJuegos = document.querySelector(".juegos");
		this.infoJuegos = document.querySelector(".infoJuegos");
		this.btnMostrarAggJuego = document.querySelector(".btnMostrarAggJuego");
		this.btnCerrarAggJuego = document.querySelector(".btnCerrarAggJuego");
		this.token = localStorage.getItem("token");
		this.juegosEndpoint = `${API_URL}/juegos.php`;
		if (!this.token) {
			window.location.href = "login";
		}
	}

	async init() {
		this.btnMostrarAggJuego.addEventListener("click", () =>
			this.mostrarDialog("dialogAggJuego"),
		);
		this.btnCerrarAggJuego.addEventListener("click", () =>
			this.cerrarDialog("dialogAggJuego"),
		);

		const juegos = await this.getJuegos();
		this.mostrarJuegos(juegos);
	}

	async getJuegos() {
		if (!this.token) {
			return;
		}

		try {
			const respuesta = await fetch(this.juegosEndpoint, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			});
			const resultado = await respuesta.json();
			if (resultado.codigo === "EXITO") {
				const { juegos } = resultado;
				return juegos;
			}
		} catch (error) {
			throw error;
		}
	}

	mostrarJuegos(juegos) {
		juegos.forEach((juego) => {
			const tarjetaJuego = this.crearTarjetaJuego(juego);
			this.contenedorJuegos.appendChild(tarjetaJuego);
			tarjetaJuego.addEventListener("click", () => {
				this.mostrarInfoJuego(juego);
			});
		});
	}

	mostrarDialog(claseDialog) {
		const dialog = document.querySelector(`.${claseDialog}`);
		dialog.showModal();
	}

	cerrarDialog(claseDialog) {
		const dialog = document.querySelector(`.${claseDialog}`);
		dialog.close();
	}

	crearTarjetaJuego(juego) {
		const tarjeta = document.createElement("div");
		tarjeta.className = "tarjetaJuego";
		tarjeta.setAttribute("data-id", juego.id);
		const portada = document.createElement("img");
		portada.className = "portadaJuego";
		portada.src = juego.portada_url;
		tarjeta.appendChild(portada);
		return tarjeta;
	}

	crearInfoJuego(juego) {
		const infoJuego = document.createElement("div");
		infoJuego.setAttribute("data-id", juego.id);

		const keyMatchTitle = {
			nombre: "Nombre",
			genero: "Genero",
			estado: "Estado",
			hrs_finalizacion: "Tiempo para completar",
			calificacion_igdb: "Calificacion IGDB",
			calificacion_personal: "Calificacion Personal",
			clasificacion: "Clasificacion ESRB",
			steam_url: "Link Steam",
			fecha_lanzamiento: "Fecha De Lanzamiento",
			fecha_agregado: "Fecha Agregado",
			portada_url: "URL Portada",
		};

		infoJuego.className = "infoJuego";
		for (let key of Object.keys(juego)) {
			if (key === "id" || key === "id_propietario") {
				continue;
			}
			const infoSub = document.createElement("p");
			infoSub.textContent = keyMatchTitle[key];
			infoSub.className = "infoSub";
			infoJuego.appendChild(infoSub);

			if (key.includes("url")) {
				const infoA = document.createElement("a");
				infoA.href = juego[key];
				infoA.textContent = juego[key];
				infoA.className = "infoLink";
				infoJuego.appendChild(infoA);
			} else {
				const infoP = document.createElement("p");
				infoP.textContent = key.startsWith("fecha")
					? this.utils.formatearFecha(juego[key])
					: juego[key];
				infoP.className = "infoP";

				infoJuego.appendChild(infoP);
			}
		}

		return infoJuego;
	}

	mostrarInfoJuego(juego) {
		const infoJuegosExistentes = document.querySelectorAll(".infoJuego");
		infoJuegosExistentes.forEach((el) => this.infoJuegos.removeChild(el));
		const infoJuego = this.crearInfoJuego(juego);
		this.infoJuegos.appendChild(infoJuego);
	}
}

const libreria = new Libreria();
const aggJuegoForm = new AgregarJuego();
libreria.init();
aggJuegoForm.init();
