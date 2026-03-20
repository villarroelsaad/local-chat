import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "./page";
import { register } from "@/app/services/register";
import "@testing-library/jest-dom";

// Mock del servicio de registro
jest.mock("@/app/services/register", () => ({
  register: jest.fn(),
}));

describe("RegisterPage - Formulario y Estado de Carga", () => {
  
  it("debe renderizar todos los campos vinculados a sus etiquetas", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  it("debe deshabilitar el botón y mostrar 'Procesando...' durante el registro", async () => {
    // Simulamos una respuesta lenta
    (register as jest.Mock).mockReturnValue(new Promise((resolve) => setTimeout(resolve, 100)));

    render(<RegisterPage />);

    const emailInput = screen.getByLabelText(/Correo Electrónico/i);
    const userInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole("button", { name: /Registrarse/i });

    // Llenar campos
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(userInput, { target: { value: "admin" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    
    // Enviar
    fireEvent.click(submitButton);

    // Verificación de estado cargando
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Procesando.../i);

    // Verificación de fin de carga
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent(/Registrarse/i);
      expect(register).toHaveBeenCalledWith("test@gmail.com", "admin", "12345678");
    });
  });
});