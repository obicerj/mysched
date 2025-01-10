import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Hero } from "@/components/hero/hero";
import { signIn } from "next-auth/react";

jest.mock("next-auth/react", () => ({
    signIn: jest.fn(), // mock the signIn function
}));

describe("Hero Component", () => {
    it('renders the "Get Started" button', () => {
        render(<Hero />);
        const button = screen.getByTestId("login-button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Get Started");
    });

    it('calls signIn when the "Get Started" button is clicked', () => {
        render(<Hero />);
        const button = screen.getByTestId("login-button");

        fireEvent.click(button); // simulate button click

        expect(signIn).toHaveBeenCalledTimes(1); // check that signIn was called
    });
});
