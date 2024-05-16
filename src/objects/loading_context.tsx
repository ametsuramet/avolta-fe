import { createContext } from "react";

export const LoadingContext = createContext<LoadingContextType>({
    isLoading: true,
    setIsLoading: (val) => false
});

export type LoadingContextType = {
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
};