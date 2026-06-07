import { API_URL } from "../globales.js";
import { Formulario } from "./form.js";

class Registro extends Formulario {
	constructor() {
		const endpoint = `${API_URL}/usuarios.php`;
		const btnRegistro = document.querySelector(".btnRegistro");
		const registroForm = document.querySelector(".registro");
		const registroErrores = document.querySelector(".registroErrores");
		const registroClaseInputs = ".formInput";

		super(
			endpoint,
			btnRegistro,
			registroForm,
			registroClaseInputs,
			registroErrores,
		);
	}
}

const registro = new Registro();
registro.setExitoRedirectTo("login");
registro.init();
