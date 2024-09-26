import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import axios from "axios";
import { httpClient } from "../../Components/Pages/Utility/HttpClient";

type Document = {
    _id: string;
    docName: string;
    userId: string;
    docsPath: string;
    public: boolean;
}

type State = {
    result: Document | undefined
    isPending: boolean
    error: string | undefined;
    isError: boolean;
}

const initialState: State = {
    result: undefined,
    isPending: true,
    error: undefined,
    isError: false,
}

export const docAsync = createAsyncThunk('docAsync', async (docsPath: string) => {
    const response = await httpClient.get(`doc/${docsPath}`)
    return response.data
})

const docsSlice = createSlice({
    name: 'doc',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(docAsync.fulfilled, (state: State, action: PayloadAction<Document>) => {
            state.isPending = false
            state.isError = false
            state.error = undefined
            state.result = action.payload
        })
        builder.addCase(docAsync.pending, (state: State) => {
            state.isPending = false
            state.isError = false
            state.error = undefined
            state.result = undefined
        })
        builder.addCase(docAsync.rejected, (state: State, action: PayloadAction<any>) => {
            state.isPending = false
            state.isError = false
            state.error = action.payload.message
            state.result = undefined
        })
    },
});

export const { } = docsSlice.actions;
export const docSelector = (state: RootState) => state.docsReducer;
export default docsSlice.reducer;
