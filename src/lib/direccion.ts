// Dirección del último deslizamiento: 1 = hacia la derecha (siguiente), -1 = izquierda.
let direccion = 1;

export function setDireccion(d: 1 | -1) {
  direccion = d;
}

export function getDireccion() {
  return direccion;
}
