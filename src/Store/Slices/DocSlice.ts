import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import { httpClient } from "../../Components/Pages/Utility/HttpClient";

// Define your document type
type Document = {
    _id?: string;
    docName?: string;
    userId?: string;
    docsPath?: string;
    public?: boolean;
};

// Define the initial state structure
type State = {
    result: Document | undefined;
    documentId: string | null;
    isPending: boolean;
    error: string | undefined;
    isError: boolean;
};

const initialState: State = {
    result: undefined,
    documentId: null,
    isPending: true,
    error: undefined,
    isError: false,
};

// Create an asynchronous thunk to fetch document data
export const docAsync = createAsyncThunk('docAsync', async (docsPath: string, { rejectWithValue }) => {
    try {
        const response = await httpClient.get(`/doc/${docsPath}`);
        return response.data; // This should be your Document type
    } catch (err: any) {
        return rejectWithValue(err.response?.data || err.message); // Better error handling
    }
});

// Create the document slice
const docsSlice = createSlice({
    name: 'doc',
    initialState,
    reducers: {
        setDocPath: (state, action: PayloadAction<string>) => {
            state.result = {
                docsPath: action.payload,
            };
        },
        setDocumentId: (state, action: PayloadAction<string | null>) => {
            state.documentId = action.payload; // Set document ID
        },
        clearDocumentId: (state) => {
            state.documentId = null; // Clear document ID
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(docAsync.pending, (state) => {
                state.isPending = true;
                state.isError = false;
                state.error = undefined;
                state.result = undefined;
                state.documentId = null; // Reset state while loading
            })
            .addCase(docAsync.fulfilled, (state, action: PayloadAction<Document>) => {
                state.isPending = false;
                state.result = action.payload;
                state.isError = false;
                state.error = undefined;

                // Set the document ID if it exists
                if (action.payload._id) {
                    state.documentId = action.payload._id;
                }
            })
            .addCase(docAsync.rejected, (state, action: PayloadAction<any>) => {
                state.isPending = false;
                state.isError = true;
                state.error = action.payload; // Set error message from payload
                state.result = undefined;
                state.documentId = null; // Clear document ID on error
            });
    },
});

// Export the reducers and selectors
export const { setDocPath, setDocumentId, clearDocumentId } = docsSlice.actions;

// Selector to access the document slice
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
