$(document).ready(function() {
    // Configuración del gráfico
    const data = {
      labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
      datasets: [
        {
          label: "Estado de mis Objetivos",
          data: [12, 19, 3, 5, 2],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  
    const config = {
      type: "bar",
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  
    // Crear el gráfico
    var myChart = new Chart(document.getElementById("myChart"), config);
  
    $("#btnRendimiento").click(function(event) {
      event.preventDefault();
      window.location.href = "indicadores.html";
    });
  
    $("#btnEstado").click(function(event) {
      event.preventDefault();
      window.location.href = "Estado.html";
    });
  
    $("#btnProyectos").click(function(event) {
      event.preventDefault();
      window.location.href = "Proyecto.html";
    });
  
    $("#btnAmbiente").click(function(event) {
      event.preventDefault();
      window.location.href = "AmbienteLaboral.html";
    });
  
    $("#btnOIRS").click(function(event) {
      event.preventDefault();
      window.location.href = "OIRS.html";
    });
  
    $("#btnEstado2").click(function(event) {
      event.preventDefault();
      window.location.href = "plataforma.html";
    });
  
    $("#btnReunion").click(function(event) {
      event.preventDefault();
      window.location.href = "Reunion.html";
    });
    $("#CerrarMensaje").click(function(event) {
        event.preventDefault();
        $('#modalMensaje').modal('hide');
      });
      $("#Cerrarb").click(function(event) {
        event.preventDefault();
        $('#modalFormulario').modal('hide');
      });
    
    // Mostrar modal de Newsletter
    $("#btnNewsLetter").click(function(event) {
      event.preventDefault();
      $("#modalNewsLetter").modal("show");
    });
    
    $("#btnPaginaNewsLetter").click(function(event) {
        event.preventDefault();
        window.location.href = "NewsLetter.html";
      });
    // Mostrar modal de Formulario
    $("#btnFormulario").click(function(event) {
      event.preventDefault();
      $("#modalFormulario").modal("show");
    });

    $(document).ready(function() {
        $('#btnArchivo').click(function() {
          $('#inputArchivo').click();
        });
    
        $('#inputArchivo').change(function() {
          var archivo = $(this).prop('files')[0];
          if (archivo) {
            $('#nombreArchivoSeleccionado').text(archivo.name);
            $('#nombreArchivoSeleccionado').show(); 
            console.log('Archivo seleccionado:', archivo);
          }
        });
      });
      
      
    // Configuración del formulario de retroalimentación
    $(document).ready(function() {
        var form = document.getElementById('feedbackForm');
        var nombreInput = document.getElementById('nombre');
        var correoInput = document.getElementById('correo');
        var mensajeTextarea = document.getElementById('mensaje');
        
        document.getElementById('enviarBtn').addEventListener('click', function() {
          if (form.checkValidity()) {
            enviarFormularioExitoso();
          }
          return false;
        });
      
        function enviarFormularioExitoso() {
            $('#modalMensaje').modal('show');
            $('#mensajeExito').removeClass('d-none').text('Formulario enviado con éxito.');
        
            nombreInput.value = '';
            correoInput.value = '';
            mensajeTextarea.value = '';
          
            // Ocultar el modal principal
            $('#modalFormulario').modal('hide');
           
          }
          
      });
    });