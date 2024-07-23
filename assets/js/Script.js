$(document).ready(function () {
    $("#loginForm").submit(function (event) {
      event.preventDefault();
  
      var usuario = $("#txtUsuario").val();
      var clave = $("#txtClave").val();
  
      console.log("Datos a enviar:", { usuario: usuario, clave: clave });
  
      // Realizar la solicitud Ajax al servidor Express
      $.ajax({
        url: "http://localhost:3000/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ usuario: usuario, clave: clave }),
        success: function (response) {
          console.log("Respuesta del servidor Express:", response);
          window.location.href = "plataforma.html";
        },
        error: function (xhr, status, error) {
          console.error("Error al enviar datos al servidor Express:", xhr.status, error);
          $("#mensaje").html('<div class="alert alert-danger" role="alert">Error Usuario o Clave incorrecta.</div>');
        },
      });
    });
  
    // Inicialización de DataTable
    let table = $("#myTable").DataTable({
      responsive: true,
    });
  
    // Configuración inicial de los selectores Chosen
    $("#cbSelectRecursos, #cbAsistencia, #cbPeriodo, #cbTurno, #cbTipo, #cbDias").chosen({
      placeholder_text_multiple: "Seleccione una opción",
      width: "100%",
    });
  
    $("#input_from_desde, #input_to_hasta").pickadate({
      format: "yyyy-mm-dd",
      selectYears: false,
      selectMonths: false,
    });
  
    $("#rowCbAsistencia, #rowCbPerido, #rowCbTurno, #rowCbTipo, #rowCbDesc, #rowCbDias, #btnRevisarAsistencia, #tablaResultados").hide();
  
    $("#cbSelectRecursos").change(function () {
      let selectedValue = $(this).val();
  
      // Ocultar todos los elementos antes de mostrar el seleccionado
      $("#rowCbAsistencia, #rowCbPerido, #rowCbTurno, #rowCbTipo, #rowCbDesc, #rowCbDias, #btnRevisarAsistencia, #tablaResultados").hide();
  
      if (selectedValue === "1") {
        $("#rowCbAsistencia, #tablaResultados, #rowCbFecha, #btnRevisarAsistencia").show();
        $("#input_from_desde, #input_to_hasta").val("");
      } else if (selectedValue === "2") {
        $("#rowCbFecha, #btnRevisarAsistencia").show();
        $("#input_from_desde, #input_to_hasta").val("");
      } else if (selectedValue === "3") {
        $("#rowCbPerido, #btnRevisarAsistencia").show();
        $("#input_from_desde, #input_to_hasta").val("");
      } else if (selectedValue === "4") {
        $("#rowCbTurno, #btnRevisarAsistencia").show();
        $("#input_from_desde, #input_to_hasta").val("");
      } else if (selectedValue === "5") {
        $("#rowCbTipo, #rowCbDesc, #rowCbDias, #btnRevisarAsistencia").show();
        $("#input_from_desde, #input_to_hasta").val("");
      }
  
      updateButtonText(selectedValue);
    });
  
    $("#btnRevisarAsistencia").click(function (event) {
      event.preventDefault(); 
  
      let selectedValue1 = $("#cbSelectRecursos").val();
      let selectedValue = $("#cbAsistencia").val();
      let selectedValueTurno = $("#cbTurno").val();
      let selectedValueTipo = $("#cbTipo").val();
      let selectedValueDias = $("#cbDias").val();
      let selectedValueComent = $("#cbComent").val();
      let selectedValueProyeccion = $("#cbPeriodo").val();
      let fechaInicio = $("#input_from_desde").val();
      let fechaFin = $("#input_to_hasta").val();
  
      if (selectedValue1 === "1") {
        let datosTabla = generateRandomDatesInRange(fechaInicio, fechaFin);
        displayAsistenciaTable(datosTabla, fechaInicio, fechaFin);
      } else if (selectedValue1 === "2") {
        calcularExtraTiempo(fechaInicio, fechaFin);
      } else if (selectedValue1 === "3") {
        recibirProyeccion(selectedValue1, fechaInicio, selectedValueProyeccion);
      } else if (selectedValue1 === "4") {
        recibirEspecial(selectedValue1, fechaInicio, selectedValueTurno);
      } else if (selectedValue1 === "5") {
        ReporteInasistencia(selectedValue1, fechaInicio, selectedValueTipo, selectedValueDias, selectedValueComent);
      }
  
      updateButtonText(selectedValue1);
    });
  
    function generateRandomDatesInRange(startDate, endDate) {
      let dateArray = [];
      let currentDate = new Date(startDate);
      endDate = new Date(endDate);
  
      while (currentDate <= endDate) {
        let randomHours = Math.floor(Math.random() * 24); 
        let randomMinutes = Math.floor(Math.random() * 60); 
  
        let formattedHours = ('0' + randomHours).slice(-2);
        let formattedMinutes = ('0' + randomMinutes).slice(-2);
  
        let randomDate = new Date(currentDate);
        randomDate.setHours(randomHours);
        randomDate.setMinutes(randomMinutes);
  
        dateArray.push({
          fecha: formatDate(currentDate),
          entrada: formattedHours + ':' + formattedMinutes,
          salida: '' 
        });
  
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return dateArray;
    }
  
    // Función para formatear la fecha
    function formatDate(date) {
      let day = ('0' + date.getDate()).slice(-2);
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
  
    // Función para mostrar la tabla de asistencia
    function displayAsistenciaTable(datosTabla, fechaInicio, fechaFin) {
      let tablaHTML = `<table class="table table-bordered">
                          <thead>
                            <tr>
                              <th>Fecha Solicitada: ${fechaInicio} hasta ${fechaFin}</th>
                              <th>Hora de Entrada</th>
                              <th>Hora de Salida</th>
                            </tr>
                          </thead>
                          <tbody>`;
  
      datosTabla.forEach(function (item, index) {
        if (index > 0) {
          tablaHTML += `<tr><td>${item.fecha}</td><td>${item.entrada}</td><td>${item.salida}</td></tr>`;
        }
      });
      tablaHTML += "</tbody></table>";
      $("#tablaResultados").html(tablaHTML).show();
    }
  
    // Función para calcular el costo de horas extras
    function calcularExtraTiempo(fechaInicio, fechaFin) {
      let tarifaHoraNormal = 3000;
      let tarifaHoraExtra = 4500;
  
      let start = new Date(fechaInicio);
      let end = new Date(fechaFin);
      let diffMs = end - start;
      let diffHours = diffMs / (1000 * 60 * 60);
      let costoExtra = Math.max(diffHours - 8, 0) * tarifaHoraExtra;
  
      let modalContent = `
        <p>Fecha Solicitada: ${fechaInicio} hasta ${fechaFin}</p>
        <p>Tiempo Total: ${diffHours.toFixed(2)} horas</p>
        <p>Costo Extra: $${costoExtra.toFixed(2)}</p>
      `;
  
      $("#extraTiempoContent").html(modalContent);
      $("#modalExtraTiempo").modal("show");
    }
  
    // Función para recibir la proyección de turno
    function recibirProyeccion(selectedValue1, fechaInicio, selectedValueProyeccion) {
      let selectionName = getSelectionName(selectedValueProyeccion);
      let proyeccionName = getProyeccionName(selectedValue1);
  
      $("#modalSelectedValue").text(selectionName);
      $("#modalFechaInicio").text(fechaInicio);
      $("#modalSelectedProyeccion").text(proyeccionName);
  
      $("#modalMensajeExito").modal("show");
    }
  
    // Función para recibir solicitud de turno especial
    function recibirEspecial(selectedValue1, fechaInicio, selectedValueTurno) {
      let selectionName = getSelectionName1(selectedValueTurno);
      let proyeccionName = getProyeccionName1(selectedValue1);
  
      $("#modalSelectedValueTurno").text(selectionName);
      $("#modalFechaInicioTurno").text(fechaInicio);
      $("#modalSelectedTurno").text(proyeccionName);
  
      $("#modalEspecialTurno").modal("show");
    }
  
    // Función para reportar inasistencia
    function ReporteInasistencia(selectedValue1, fechaInicio, selectedValueTipo, selectedValueDias, selectedValueComent) {
      let selectionNameTipo = getSelectionNameTipo(selectedValueTipo);
      let InasistenciaName = getInasistenciaName(selectedValue1);
  
      $("#modalSelected").text(InasistenciaName);
      $("#modalFechaInicioInasistencia").text(fechaInicio);
      $("#modalSelectedValueTipo").text(selectionNameTipo);
      $("#modalSelectedValueDias").text(selectedValueDias);
      $("#modalComentario").text(selectedValueComent);
  
      $("#modalEspecialInasistecia").modal("show");
    }
  
    // Función para obtener el nombre de la selección
    function getSelectionName(value) {
      if (value === "1") {
        return "Mensual";
      } else if (value === "2") {
        return "Trimestral";
      } else if (value === "3") {
        return "Semanal";
      } else if (value === "0") {
        return "Seleccione..";
      } else {
        return "Selección Desconocida";
      }
    }
  
    // Función para obtener el nombre de la proyección
    function getProyeccionName(value) {
      if (value === "1") {
        return "Registro de Asistencia";
      } else if (value === "2") {
        return "Extra - Tiempo";
      } else if (value === "3") {
        return "Proyección de Turnos";
      } else if (value === "4") {
        return "Solicitud de Turnos Especiales";
      } else if (value === "5") {
        return "Reporte de Inasistencia";
      } else {
        return "Proyección Desconocida";
      }
    }
  
    // Función para obtener el nombre de la selección de turno
    function getSelectionName1(value) {
      if (value === "1") {
        return "Diurno";
      } else if (value === "2") {
        return "Vespertino";
      } else if (value === "3") {
        return "Fin de Semana";
      } else if (value === "0") {
        return "Seleccione..";
      } else {
        return "Selección Desconocida";
      }
    }
  
    // Función para obtener el nombre de la proyección de turno
    function getProyeccionName1(value) {
      if (value === "1") {
        return "Registro de Asistencia";
      } else if (value === "2") {
        return "Extra - Tiempo";
      } else if (value === "3") {
        return "Proyección de Turnos";
      } else if (value === "4") {
        return "Solicitud de Turnos Especiales";
      } else if (value === "5") {
        return "Reporte de Inasistencia";
      } else {
        return "Proyección Desconocida";
      }
    }
  
    // Función para obtener el nombre del tipo de inasistencia
    function getSelectionNameTipo(value) {
      if (value === "1") {
        return "Con Licencia Manual";
      } else if (value === "2") {
        return "Con Licencia Electronica";
      } else if (value === "3") {
        return "Sin Licencia";
      } else if (value === "0") {
        return "Seleccione..";
      } else {
        return "Selección Desconocida";
      }
    }
  
    // Función para obtener el nombre de la categoría de inasistencia
    function getInasistenciaName(value) {
      if (value === "1") {
        return "Registro de Asistencia";
      } else if (value === "2") {
        return "Extra - Tiempo";
      } else if (value === "3") {
        return "Proyección de Turnos";
      } else if (value === "4") {
        return "Solicitud de Turnos Especiales";
      } else if (value === "5") {
        return "Reporte de Inasistencia";
      } else {
        return "Proyección Desconocida";
      }
    }
  
    // Función para actualizar el texto del botón
    function updateButtonText(selectedValue) {
      let buttonText = "";
      switch (selectedValue) {
        case "1":
          buttonText = "Revisar Asistencia";
          break;
        case "2":
          buttonText = "Calcular Extra Tiempo";
          break;
        case "3":
          buttonText = "Entregar Proyecto de Turno";
          break;
        case "4":
          buttonText = "Solicitar Turnos Especial";
          break;
        case "5":
          buttonText = "Reportar Ingreso Licencia Manual";
          break;
        default:
          $("#btnRevisarAsistencia").hide();
          break;
      }
      $("#btnRevisarAsistencia").text(buttonText).show();
    }
  });
  