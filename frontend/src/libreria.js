import { AgregarJuego } from "./agregarJuego.js";
import { EditarJuego } from "./editarJuego.js";
import { API_URL } from "../globales.js";
import { Utils } from "./utils.js";

class Libreria {
	utils = new Utils();
	aggJuego = new AgregarJuego();
	editarJuego = new EditarJuego();
	constructor() {
		this.contenedorJuegos = document.querySelector(".juegos");
		this.infoJuegos = document.querySelector(".infoJuegos");
		this.btnMostrarAggJuego = document.querySelector(".btnMostrarAggJuego");
		this.btnCerrarAggJuego = document.querySelector(".btnCerrarAggJuego");
		this.btnCerrarEditarJuego = document.querySelector(".btnCerrarEditarJuego");
		this.token = localStorage.getItem("token");
		this.juegosEndpoint = `${API_URL}/juegos.php`;

		if (!this.token) {
			window.location.href = "login";
		}
		this.aggJuego.init();
		this.editarJuego.init();
	}

	async init() {
		this.btnMostrarAggJuego.addEventListener("click", () => {
			this.mostrarDialog("dialogAggJuego");

			const form = document.querySelector(".agregarJuego");
			form.reset();
		});
		this.btnCerrarAggJuego.addEventListener("click", () =>
			this.cerrarDialog("dialogAggJuego"),
		);

		this.btnCerrarEditarJuego.addEventListener("click", () => {
			this.cerrarDialog("dialogEditarJuego");
		});

		const juegos = await this.getJuegos();
		this.mostrarJuegos(juegos);

		const botonesEditar = document.querySelectorAll(".btnMostrarEditarJuego");
		botonesEditar.forEach((btn) =>
			btn.addEventListener("click", (e) => {
				const idJuego = btn.parentNode.parentNode.getAttribute("data-id");
				this.editarJuego.setIdJuego(idJuego);

				this.mostrarDialog("dialogEditarJuego");
				this.editarJuego.llenarCamposInfoJuego();
			}),
		);

		const botonesBorrar = document.querySelectorAll(".btnBorrarJuego");
		botonesBorrar.forEach((btn) =>
			btn.addEventListener("click", async () => {
				const confirmar = confirm("Seguro que quieres borrar el juego?");
				if (confirmar) {
					const idJuego = btn.parentNode.parentNode.getAttribute("data-id");
					await this.borrarJuego(idJuego);
				}
			}),
		);
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
		const botonesOverlay = document.createElement("div");
		botonesOverlay.className = "botonesOverlay";
		const btnMostrarEditarJuego = document.createElement("button");
		btnMostrarEditarJuego.className = "btnMostrarEditarJuego";
		btnMostrarEditarJuego.textContent = "editar";
		botonesOverlay.appendChild(btnMostrarEditarJuego);

		const btnBorrarJuego = document.createElement("button");
		btnBorrarJuego.className = "btnBorrarJuego";
		btnBorrarJuego.textContent = "borrar";
		botonesOverlay.appendChild(btnBorrarJuego);
		const tarjeta = document.createElement("div");
		tarjeta.className = "tarjetaJuego";
		tarjeta.setAttribute("data-id", juego.id);
		const portada = document.createElement("img");
		portada.className = "portadaJuego";
		portada.src = juego.portada_url;
		tarjeta.appendChild(portada);
		tarjeta.appendChild(botonesOverlay);
		return tarjeta;
	}

	async borrarJuego(idJuego) {
		if (!this.token) {
			return;
		}

		try {
			const respuesta = await fetch(this.juegosEndpoint + `?id=${idJuego}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			});
			const resultado = await respuesta.json();
			console.log(resultado);
			if (resultado.codigo === "EXITO") {
				alert("Juego borrado");
				window.location.reload();
			}
		} catch (error) {
			throw error;
		}
	}

	crearInfoJuego(juego) {
		const infoJuego = document.createElement("div");
		infoJuego.setAttribute("data-id", juego.id);

		const keyMatchTitle = {
			nombre: "Nombre",
			genero: "Genero",
			estado: "Estado",
			hrs_finalizacion: "Tiempo para completar (Horas)",
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
			} else if (key === "estado") {
				const infoP = document.createElement("p");
				infoP.textContent =
					juego[key] === "POR_JUGAR" ? "Por Jugar" : "Completado";
				infoP.className = "infoP";

				infoJuego.appendChild(infoP);
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
libreria.init();
