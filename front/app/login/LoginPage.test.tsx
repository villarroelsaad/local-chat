import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./page";
import { login } from "@/app/services/log";
import "@testing-library/jest-dom";

jest.mock("@/app/services/log", () => ({
  login: jest.fn(),
}));



describe("LoginPage - Estado de Carga", () => {
  it("debe deshabilitar el botón y mostrar 'Cargando...' mientras se procesa el login", async () => {
    (login as jest.Mock).mockReturnValue(new Promise((resolve) => setTimeout(resolve, 100)));

    render(<LoginPage />);

    const userInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole("button", { name: /Entrar/i });

    fireEvent.change(userInput, { target: { value: "admin" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent(/Cargando.../i);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent(/Entrar/i);
    });
  });
});