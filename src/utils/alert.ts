import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Toast de éxito discreto
export const showSuccess = (title: string, text?: string) =>
  MySwal.fire({
    icon: 'success',
    title,
    text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

// Toast de error discreto
export const showError = (title: string, text?: string) =>
  MySwal.fire({
    icon: 'error',
    title,
    text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

// Carga discreta tipo toast (en lugar de modal grande centrado)
export const showLoading = (title: string = 'Cargando...') =>
  MySwal.fire({
    title,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
    allowOutsideClick: false,
  });

  export const showConfirm = async (
  title: string,
  text?: string,
  confirmText = 'Sí',
  cancelText = 'Cancelar'
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    buttonsStyling: false,
    background: '#fff',
    customClass: {
      popup: 'rounded-2xl',
      title: 'text-lg font-semibold',
      htmlContainer: 'text-sm text-gray-700',
      confirmButton:
        'bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-xl mr-2',
      cancelButton:
        'border border-gray-300 text-gray-800 hover:bg-gray-100 font-medium px-4 py-2 rounded-xl',
    },
  });

  return result.isConfirmed;
};

// Cerrar la alerta actual
export const closeLoading = () => Swal.close();
