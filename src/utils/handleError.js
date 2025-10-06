import { toast } from "sonner";

export const handleError = (error) => {
  // mensagem padrão
  let errorMessage = "Erro ao cadastrar cliente.";

  if (error.response?.data) {
    const { message, data } = error.response.data;

    // usa a mensagem principal do backend se existir
    errorMessage = message || errorMessage;

    // helper para montar os erros do Zod
    const extractErrors = (fields) =>
      Object.entries(fields).flatMap(([field, info]) =>
        info?._errors?.map((err) => `${field}: ${err}`) || []
      );

    let allErrors = [];

    if (data?.body) {
      allErrors.push(...extractErrors(data.body));
    }

    if (data?.params) {
      allErrors.push(...extractErrors(data.params));
    }

    if (data?.query) {
      allErrors.push(...extractErrors(data.query));
    }

    if (allErrors.length > 0) {
      allErrors.forEach((err) => toast.error(err));
      return;
    }
  }

  toast.error(errorMessage);
  console.error(error);
};
