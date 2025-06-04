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

  // Validación al enviar
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var allValid = true;
    var formData = '';

    for (var fieldId in fields) {
      if (fields.hasOwnProperty(fieldId)) {
        var input = document.getElementById(fieldId);
        var error = document.getElementById('error-' + fieldId);
        var value = input.value.trim();
        var validator = fields[fieldId].validator;
        var message = fields[fieldId].message;

        if (!validator(value)) {
          error.textContent = message;
          allValid = false;
          formData += '❌ ' + fieldId + ': ' + message + '\n';
        } else {
          formData += '✅ ' + fieldId + ': ' + value + '\n';
        }
      }
    }

    if (allValid) {
      alert('Formulario enviado correctamente:\n\n' + formData);
    } else {
      alert('Errores en el formulario:\n\n' + formData);
    }
  });
});
