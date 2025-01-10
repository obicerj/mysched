import '@testing-library/jest-dom';

jest.spyOn(console, 'error').mockImplementation((message) => {
    if (typeof message === 'string' && !message.includes('act(...)')) {
        console.error(message); // let other error messages pass through
    }
});
