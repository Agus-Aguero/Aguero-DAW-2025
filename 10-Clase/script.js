document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('form-suscripcion'); // este es el ID real del formulario

  // Validadores para cada campo
  var fields = {
  nombre: {
    validator: function (value) {
      return value.length > 6 && value.includes(' ');
    },
    message: 'Debe tener más de 6 letras y al menos un espacio.'
  },
  email: {
    validator: function (value) {
      var atIndex = value.indexOf('@');
      var dotIndex = value.lastIndexOf('.');
      return (
        atIndex > 0 &&
        dotIndex > atIndex + 1 &&
        dotIndex < value.length - 1 &&
        !value.includes(' ')
      );
    },
    message: 'Debe ingresar un email válido.'
  },
  password: {
    validator: function (value) {
      if (value.length < 8) return false;
      var hasLetter = false;
      var hasDigit = false;
      for (var i = 0; i < value.length; i++) {
        var char = value[i];
        if (isNaN(char)) {
          hasLetter = true;
        } else {
          hasDigit = true;
        }
      }
      return hasLetter && hasDigit;
    },
    message: 'Debe tener al menos 8 caracteres, con letras y números.'
  },
  'repetir-password': {
    validator: function (value) {
      return value === document.getElementById('password').value;
    },
    message: 'Las contraseñas no coinciden.'
  },
  edad: {
    validator: function (value) {
      return !isNaN(value) && parseInt(value) >= 18;
    },
    message: 'Debe ser mayor o igual a 18.'
  },
  telefono: {
    validator: function (value) {
      if (value.length < 7) return false;
      for (var i = 0; i < value.length; i++) {
        if (isNaN(value[i]) || value[i] === ' ') return false;
      }
      return true;
    },
    message: 'Debe tener al menos 7 dígitos sin espacios ni símbolos.'
  },
  direccion: {
    validator: function (value) {
      return value.length >= 5 && value.includes(' ');
    },
    message: 'Debe tener al menos 5 caracteres y un espacio.'
  },
  ciudad: {
    validator: function (value) {
      return value.length >= 3;
    },
    message: 'Debe tener al menos 3 caracteres.'
  },
  'codigo-postal': {
    validator: function (value) {
      return value.length >= 3;
    },
    message: 'Debe tener al menos 3 caracteres.'
  },
  dni: {
    validator: function (value) {
      if (value.length < 7 || value.length > 8) return false;
      for (var i = 0; i < value.length; i++) {
        if (isNaN(value[i]) || value[i] === ' ') return false;
      }
      return true;
    },
    message: 'Debe ser un número de 7 u 8 dígitos.'
  }
};


  // Agregar eventos blur y focus
  for (var fieldId in fields) {
    if (fields.hasOwnProperty(fieldId)) {
      (function (fieldId) {
        var input = document.getElementById(fieldId);
        var error = document.getElementById('error-' + fieldId);
        var validator = fields[fieldId].validator;
        var message = fields[fieldId].message;

        input.addEventListener('blur', function () {
          if (!validator(input.value.trim())) {
            error.textContent = message;
          }
        });

        input.addEventListener('focus', function () {
          error.textContent = '';
        });
      })(fieldId);
    }
  }

  // Esto es lo nuevo para el enunciado de la práctica
  // Validación al enviar
 form.addEventListener('submit', function (e) {
  e.preventDefault();
  var allValid = true;
  var formData = {};
  var errors = '';

  for (var fieldId in fields) {
    if (fields.hasOwnProperty(fieldId)) {
      var input = document.getElementById(fieldId);
      var error = document.getElementById('error-' + fieldId);
      var value = input.value.trim();
      var validator = fields[fieldId].validator;
      var message = fields[fieldId].message;

      if (!validator(value)) {
        error.textContent = message;
        errors += fieldId + ': ' + message + '\n';
        allValid = false;
      } else {
        error.textContent = '';
        formData[fieldId] = value;
      }
    }
  }

  if (!allValid) {
    alert('Errores en el formulario:\n\n' + errors);
    return;
  }

  // Armar URL con query params
  var queryParams = new URLSearchParams(formData).toString();
  var url = 'https://jsonplaceholder.typicode.com/posts?' + queryParams;

  // Enviar petición GET
  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Error en el servidor. Código: ' + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      onSuccess(data, formData);
    })
    .then(function (data) {
  // Mostrar modal con los datos recibidos
  mostrarModal('Suscripción exitosa. Datos recibidos:\n' + JSON.stringify(data, null, 2));

  // Guardar los datos del formulario en LocalStorage
  for (var fieldId in fields) {
    if (fields.hasOwnProperty(fieldId)) {
      var input = document.getElementById(fieldId);
      localStorage.setItem(fieldId, input.value.trim());
    }
  }
})

    .catch(function (error) {
      onError(error);
    });
    

    
});

function onSuccess(data, originalData) {
  // Guardar en LocalStorage
  localStorage.setItem('suscripcionData', JSON.stringify(originalData));

  // Mostrar modal con éxito
  mostrarModal('Suscripción exitosa!', JSON.stringify(data, null, 2));
}

function onError(error) {
  mostrarModal('Error en la suscripción', error.message);
}

function mostrarModal(mensaje) {
  var modal = document.getElementById('modal');
  var modalMensaje = document.getElementById('modal-mensaje');
  modalMensaje.textContent = mensaje;
  modal.classList.remove('oculto');
}

document.getElementById('cerrar-modal').addEventListener('click', function () {
  document.getElementById('modal').classList.add('oculto');
});

window.addEventListener('load', function () {
  for (var fieldId in fields) {
    if (fields.hasOwnProperty(fieldId)) {
      var input = document.getElementById(fieldId);
      var savedValue = localStorage.getItem(fieldId);
      if (savedValue) {
        input.value = savedValue;
      }
    }
  }
});

});
