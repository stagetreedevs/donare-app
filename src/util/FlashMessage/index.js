import { showMessage } from "react-native-flash-message";

export function customToast(message, type) {
  switch (type) {
    case 'success':
      showMessage({ message: "SUCESSO", description: message, type: "success", icon: type, duration: 6000, floating: true, });
      break;
    case 'error':
      showMessage({ message: "ERRO", description: message, type: "danger", icon: type, duration: 6000, floating: true, });
      break;
    case 'info':
      showMessage({ message: message, type: "info", icon: type, duration: 6000, floating: true, });
      break;
    default:
      break;
  }
}

export function customErrorMessage({message, description, statusCode}){
  if (!description)
    if (statusCode)
      switch (statusCode) {
        case 401:
          description = 'usuário não permitido';
          break;
        case 404:
          description = 'recurso não encontrado';
          break;
        case 409:
          description = 'recurso já existente.';
          break;
        case 500:
          description = 'erro interno do servidor.';
          break;
        default:
          description = 'erro inesperado.';
          break;
      }
    else description = 'falha na comunicação com servidor';

  customToast(`${(message)}: ${description}`, 'error');
}
