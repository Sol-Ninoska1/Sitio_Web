$('#cbReunion').chosen({
    placeholder_text_multiple: 'Seleccione una opción',
    width: '100%'
});
$("#btnEstado2").click(function(event) {
    event.preventDefault();
    window.location.href = "plataforma.html";
  });
$(document).ready(function () {

    $('#input_from_desde').pickadate({
        format: 'yyyy-mm-dd',
        selectYears: false,
        selectMonths: false,
    });
});


$("#btnProyectos").click(function (event) {
    event.preventDefault(); 
    event.stopPropagation();
    let selectedValue1 = $("#cbReunion").val();
    let fechaInicio = $("#input_from_desde").val();

    if (selectedValue1 === "1" || selectedValue1 === "2") {
        solicitaReunion(selectedValue1, fechaInicio);
    }
});

function solicitaReunion(selectedValue1, fechaInicio) {
    console.log("selectedValue1:", selectedValue1);
    console.log("fechaInicio:", fechaInicio);

    let reunionName = getReunionName(selectedValue1); 

    console.log("reunionName:", reunionName);

    $("#modalSelectedValue").text(reunionName);
    $("#modalFechaInicio").text(fechaInicio);

    $("#modalMensajeExito").modal("show");
}

function getReunionName(value) {
    if (value === "1") {
        return "Gerencia General";
    } else if (value === "2") {
        return "Jefatura Departamento";
    } else if (value === "0") {
        return "Seleccione..";
    } else {
        return "Reunión Desconocida"; 
    }
}

  
 