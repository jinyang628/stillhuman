import { z } from "zod";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const createPersistedStore = <T, K extends string, S extends string>(
  storeName: string,
  defaultState: T,
  stateSchema: z.ZodSchema<T>,
  stateKey: K,
  setStateKey: S,
) => {
  type StoreType = {
    [key in K]: T;
  } & {
    [key in S]: (newState: Partial<T>) => void;
  };

  return create<StoreType>()(
    persist(
      (set) =>
        ({
          [stateKey]: defaultState,
          [setStateKey]: (newState: Partial<T>) =>
            set((store) => {
              const updatedState = { ...store[stateKey], ...newState };
              const result = stateSchema.safeParse(updatedState);
              if (!result.success) {
                return store; // Return the original store if validation fails
              }
              console.log(
                "Validation succeeded, updating state:",
                updatedState,
              );
              console.log(stateKey);
              return { ...store, [stateKey]: updatedState };
            }),
        }) as StoreType,
      {
        name: storeName,
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          console.log("Rehydrating state:", state);
          if (state && stateKey in state) {
            const result = stateSchema.safeParse(state[stateKey]);
            console.log("Validation result:", result);
            if (!result.success) {
              console.log("Validation failed, using default state");
              return { [stateKey]: defaultState };
            }
            console.log("Validation succeeded, using stored state");
            return { [stateKey]: result.data };
          }
          console.log("No stored state found, using default state");
          return { [stateKey]: defaultState };
        },
        partialize: (state) => {
          return { [stateKey]: state[stateKey] };
        },
      },
    ),
  );
};
