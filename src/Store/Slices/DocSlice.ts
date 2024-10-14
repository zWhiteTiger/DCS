import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import { httpClient } from "../../Components/Pages/Utility/HttpClient";

type Document = {
    _id?: string;
    docName?: string;
    userId?: string;
    docsPath?: string;
    public?: boolean;
};

type State = {
    result: Document | undefined;
    documentId: string | null; // Add documentId to state
    isPending: boolean;
    error: string | undefined;
    isError: boolean;
};

const initialState: State = {
    result: undefined,
    documentId: null, // Initialize documentId
    isPending: true,
    error: undefined,
    isError: false,
};

export const docAsync = createAsyncThunk('docAsync', async (docsPath: string) => {
    const response = await httpClient.get(`/doc/${docsPath}`);
    return response.data;
});

const docsSlice = createSlice({
    name: 'doc',
    initialState,
    reducers: {
        setDocPath: (state: State, actions: PayloadAction<string>) => {
            state.result = {
                docsPath: actions.payload,
            };
        },
        setDocumentId: (state: State, actions: PayloadAction<string | null>) => {
            state.documentId = actions.payload; // Set document ID
        },
        clearDocumentId: (state: State) => {
            state.documentId = null; // Clear document ID
        },
    },
    extraReducers(builder) {
        builder.addCase(docAsync.fulfilled, (state: State, action: PayloadAction<Document>) => {
            state.isPending = false;
            state.isError = false;
            state.error = undefined;
            state.result = action.payload;

            // Set the document ID if it exists
            if (action.payload._id) {
                state.documentId = action.payload._id;
            }
        });
        builder.addCase(docAsync.pending, (state: State) => {
            state.isPending = true; // Set isPending to true when pending
            state.isError = false;
            state.error = undefined;
            state.result = undefined;
            state.documentId = null; // Reset document ID when fetching
        });
        builder.addCase(docAsync.rejected, (state: State, action: PayloadAction<any>) => {
            state.isPending = false;
            state.isError = true; // Set isError to true on rejection
            state.error = action.payload.message;
            state.result = undefined;
            state.documentId = null; // Clear document ID on error
        });
    },
});

export const { setDocPath, setDocumentId, clearDocumentId } = docsSlice.actions;
export const docSelector = (state: RootState) => state.docsReducer;
export default docsSlice.reducer;



// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { RootState } from "../Store";
// import { httpClient } from "../../Components/Pages/Utility/HttpClient";

// type Document = {
//     _id?: string;
//     docName?: string;
//     userId?: string;
//     docsPath?: string;
//     public?: boolean;
// }

// type State = {
//     result: Document | undefined
//     isPending: boolean
//     error: string | undefined;
//     isError: boolean;
// }

// const initialState: State = {
//     result: undefined,
//     isPending: true,
//     error: undefined,
//     isError: false,
// }

// export const docAsync = createAsyncThunk('docAsync', async (docsPath: string) => {
//     const response = await httpClient.get(`/doc/${docsPath}`)
//     return response.data
// })

// const docsSlice = createSlice({
//     name: 'doc',
//     initialState,
//     reducers: {
//         setDocPath: (state: State, actions: PayloadAction<string>) => {
//             state.result = {
//                 docsPath: actions.payload,
//             }
//         },
//     },
//     extraReducers(builder) {
//         builder.addCase(docAsync.fulfilled, (state: State, action: PayloadAction<Document>) => {
//             state.isPending = false
//             state.isError = false
//             state.error = undefined
//             state.result = action.payload
//         })
//         builder.addCase(docAsync.pending, (state: State) => {
//             state.isPending = false
//             state.isError = false
//             state.error = undefined
//             state.result = undefined
//         })
//         builder.addCase(docAsync.rejected, (state: State, action: PayloadAction<any>) => {
//             state.isPending = false
//             state.isError = false
//             state.error = action.payload.message
//             state.result = undefined
//         })
//     },
// });

// export const {setDocPath } = docsSlice.actions;
// export const docSelector = (state: RootState) => state.docsReducer;
// export default docsSlice.reducer;
