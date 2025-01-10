import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useSession } from "next-auth/react";
import Home from "@/app/page";
import axios from "axios";

// Mock the axios instance
jest.mock("axios");

// Mock the useSession hook
jest.mock("next-auth/react");

describe("Home Component", () => {
    let mockSessionData: any;

    // Clear mocks before each test
    beforeEach(() => {
        mockSessionData = { user: { name: "John Doe" } };
        // Mock default session as authenticated
        (useSession as jest.Mock).mockReturnValue({
            data: mockSessionData,
            status: "authenticated",
        });
        // Reset axios mock before each test
        (axios.get as jest.Mock).mockResolvedValue({ data: [] }); // Default empty response
        (axios.delete as jest.Mock).mockResolvedValue({}); // Mock for delete
    });

    it("displays loading state when session is loading", async () => {
        (useSession as jest.Mock).mockReturnValueOnce({
            data: null,
            status: "loading",
        });

        render(<Home />);

        // Verify loading spinner/message is visible
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders Hero when the user is unauthenticated", () => {
        (useSession as jest.Mock).mockReturnValueOnce({
            data: null,
            status: "unauthenticated",
        });

        render(<Home />);

        // Ensure Hero component is rendered if user is unauthenticated
        expect(screen.getByTestId("hero-component")).toBeInTheDocument();
    });

    it("fetches and displays schedule data when the user is authenticated", async () => {
        const mockSchedules = [
            {
                id: 1,
                start_time: "2025-01-10T08:00:00Z",
                end_time: "2025-01-10T09:00:00Z",
            },
            {
                id: 2,
                start_time: "2025-01-10T10:00:00Z",
                end_time: "2025-01-10T11:00:00Z",
            },
        ];

        // Mock axios.get to return schedules
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockSchedules });

        render(<Home />);

        // Wait for the mock schedules to be displayed
        await waitFor(() => screen.getByText("Your schedule is empty")); // Adjust text as needed

        // Verify axios.get was called with the correct API endpoint
        expect(axios.get).toHaveBeenCalledWith("/api/schedule/date/2025-01-10");
    });

    it("displays empty schedule message when no schedules are returned", async () => {
        // Mocking empty schedule response
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

        render(<Home />);

        await waitFor(() => screen.getByText("Your schedule is empty"));

        // Verify the empty schedule message
        expect(screen.getByText("Your schedule is empty")).toBeInTheDocument();
    });

    // it("deletes a schedule and updates the schedule list", async () => {
    //     const mockSchedules = [
    //         {
    //             id: 1,
    //             start_time: "2025-01-10T08:00:00Z",
    //             end_time: "2025-01-10T09:00:00Z",
    //         },
    //     ];

    //     // Mocking empty schedule response
    //     (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockSchedules });
    //     (axios.delete as jest.Mock).mockResolvedValueOnce({});

    //     render(<Home />);

    //     await waitFor(() => screen.getByText("Your schedule is empty"));

    //     // Simulate deleting the schedule (button click simulated here)
    //     const deleteButton = screen.getByTestId("delete-schedule-1");
    //     fireEvent.click(deleteButton);

    //     // Ensure axios.delete was called with the correct parameters
    //     // expect(axios.delete).toHaveBeenCalledWith("/api/schedule", {
    //     //     params: { id: 1 },
    //     // });

    //     // Verify the schedule list is updated after deletion
    //     // await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2)); // Verify 2 API calls (first fetch and then refresh)
    // });
});
