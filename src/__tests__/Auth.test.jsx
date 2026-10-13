import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";

describe("Authentication Pages", () => {
  it("renders the Login form with email and password fields", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: /Welcome Back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In/i })).toBeInTheDocument();
  });

  it("renders the Register form with name, email, password, confirm password, and goal fields", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: /Begin Your Practice/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Sarah Davis/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/sarah@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Min 6 characters/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Re-enter password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account & Start/i })).toBeInTheDocument();
  });

  it("displays validation error when passwords do not match on registration", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Sarah Davis/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/sarah@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Min 6 characters/i), {
      target: { value: "Password123" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Re-enter password/i), {
      target: { value: "MismatchPassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Account & Start/i }));

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });
});
