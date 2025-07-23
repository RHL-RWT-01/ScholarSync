// "use client";

// import { useAppContext } from "@/context/app-context";
// import { fetchScholarData } from "@/lib/fetchScholarData";
// import { Dispatch } from "react";

// export interface Publication {
//   title: string;
//   year: number;
//   citations: number;
// }

// export interface ScholarData {
//   name: string;
//   affiliation: string;
//   totalCitations: number;
//   hIndex: number;
//   publications: Publication[];
// }

// // App Context State and Actions
// export interface AppState {
//   isLoading: boolean;
//   error: string | null;
//   scholarData: ScholarData | null;
// }

// export type AppAction =
//   | { type: "SET_LOADING"; payload: boolean }
//   | { type: "SET_SCHOLAR_DATA"; payload: ScholarData }
//   | { type: "CLEAR_ERROR" }
//   | { type: "SET_ERROR"; payload: string };

// export const useScholarData = (): {
//   getScholarData: (name: string) => Promise<void>;
// } => {
//   const { dispatch }: { dispatch: Dispatch<AppAction> } = useAppContext();

//   const getScholarData = async (name: string): Promise<void> => {
//     dispatch({ type: "SET_LOADING", payload: true });

//     try {
//       const data: ScholarData = await fetchScholarData(name);
//       dispatch({ type: "SET_SCHOLAR_DATA", payload: data });
//       dispatch({ type: "CLEAR_ERROR" });
//     } catch (err: any) {
//       console.error("Error fetching scholar data:", err);
//       dispatch({
//         type: "SET_ERROR",
//         payload:
//           err?.response?.data?.error ||
//           err.message ||
//           "Failed to fetch scholar data",
//       });
//     } finally {
//       dispatch({ type: "SET_LOADING", payload: false });
//     }
//   };

//   return { getScholarData };
// };
