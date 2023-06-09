const recaudacionForm = document.querySelector("#recaudacionForm");

let recaudaciones = [];
let editing = false;
let recaudacion_id = null;

window.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/recaudacion");
  const data = await response.json();
  recaudaciones = data;
  renderRecaudaciones(recaudaciones);
});

recaudacionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id_transaccion  = recaudacionForm["id_transaccion"].value;
  const id_cuenta  = recaudacionForm["id_cuenta"].value;
  const id_mant_recibo  = recaudacionForm["id_mant_recibo"].value;
  const n_operacion  = recaudacionForm["n_operacion"].value;
  const fecha_operacion  = recaudacionForm["fecha_operacion"].value;
  const moneda  = recaudacionForm["moneda"].value;
  const importe  = recaudacionForm["importe"].value;
  const id_recaudacion_estado  = recaudacionForm["id_recaudacion_estado"].value;
  const id_cuenta_predio  = recaudacionForm["id_cuenta_predio"].value;
  const observacion  = recaudacionForm["observacion"].value;


  if (!editing) {
    // send user to backend
    const response = await fetch("/api/recaudacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_transaccion,
        id_cuenta ,
        id_mant_recibo ,
        n_operacion ,
        fecha_operacion  ,
        moneda  ,
        importe ,
        id_recaudacion_estado  ,
        id_cuenta_predio  ,
        observacion  ,
      }),
    });

    const data = await response.json();
    recaudaciones.push(data);
    renderRecaudaciones(recaudaciones);
  } else {
    const response = await fetch(`/api/recaudacion/${recaudacion_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //id_transaccion,
        id_cuenta ,
        id_mant_recibo ,
        n_operacion ,
        fecha_operacion  ,
        moneda  ,
        importe ,
        id_recaudacion_estado  ,
        id_cuenta_predio  ,
        observacion  ,
      }),
    });
    const updatedRecaudacion = await response.json();

    recaudaciones = recaudaciones.map((recaudacion) =>
    recaudacion.id_transaccion === updatedRecaudacion.id_transaccion ? updatedRecaudacion : recaudacion
    );
    console.log(recaudaciones)
    renderRecaudaciones(recaudaciones);

    editing = false;
    recaudacion_id = null;
  }
  recaudacionForm.reset();
});

function renderRecaudaciones(recaudaciones) {
  const recaudacionesList=document.querySelector("#recaudacionesList");
  recaudacionesList.innerHTML  = "";
  recaudaciones.forEach((recaudacion) => {
    const recaudacionItem = document.createElement("li");
    recaudacionItem.classList = "list-group-item list-group-item-dark my-2";
    recaudacionItem.innerHTML = `
        <header class="d-flex justify-content-between align-items-center">
          <h3>ID TRANSACCION : ${recaudacion.id_transaccion}</h3>
          <div>
            <button data-id="${recaudacion.id_transaccion}" class="btn-delete btn btn-danger btn-sm">Delete</button>
            <button data-id="${recaudacion.id_transaccion}" class="btn-edit btn btn-secondary btn-sm">Edit</button>
          </div>
        </header>
        <p>Id de cuenta : ${recaudacion.id_cuenta}</p>
        <p>Id de mantenimiento del recibo : ${recaudacion.id_mant_recibo}</p>
        <p>N° de operación : ${recaudacion.n_operacion}</p>
        <p>Fecha de operacion : ${recaudacion.fecha_operacion}</p>
        <p>Tipo de moneda : ${recaudacion.moneda}</p>
        <p>Importe : ${recaudacion.importe}</p>
        <p>Id del estado de recaudacion : ${recaudacion.id_recaudacion_estado}</p>
        <p>Id del predio de cuenta : ${recaudacion.id_cuenta_predio}</p>
        <p>Observación : ${recaudacion.observacion}</p>
    `;

    // Handle delete button
    const btnDelete = recaudacionItem.querySelector(".btn-delete");

    btnDelete.addEventListener("click", async (e) => {
      const response = await fetch(`/api/recaudacion/${recaudacion.id_transaccion}`, {
        method: "DELETE",
      });

      const data = await response.json();

      recaudaciones  = recaudaciones.filter((recaudacion) => recaudacion.id_transaccion !== data.id_transaccion);
      renderRecaudaciones(recaudaciones);
    });

    recaudacionesList.appendChild(recaudacionItem);

    // Handle edit button
    const btnEdit = recaudacionItem.querySelector(".btn-edit");

    btnEdit.addEventListener("click", async (e) => {
      const response = await fetch(`/api/recaudacion/${recaudacion.id_transaccion}`);
      const data = await response.json();

      recaudacionForm["id_cuenta"].value = data.id_cuenta;
      recaudacionForm["id_mant_recibo"].value = data.id_mant_recibo;
      recaudacionForm["n_operacion"].value = data.n_operacion;
      recaudacionForm["fecha_operacion"].value = data.fecha_operacion;
      recaudacionForm["moneda"].value = data.moneda;
      recaudacionForm["importe"].value = data.importe;
      recaudacionForm["id_recaudacion_estado"].value = data.id_recaudacion_estado;
      recaudacionForm["id_cuenta_predio"].value = data.id_cuenta_predio;
      recaudacionForm["observacion"].value = data.observacion;

      editing = true;
      recaudacion_id = recaudacion.id_transaccion;
    });
  });
}
