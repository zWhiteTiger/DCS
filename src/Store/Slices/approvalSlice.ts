import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";
import { httpClient } from "../../Components/Pages/Utility/HttpClient";

export type Position = {
    _id?: string
    x: number;
    y: number;
    firstName: string;
    lastName: string;
    signature?: string;
    page: number;
}

type Approval = {
    _id: string;
    email: string;
    doc_id: string;
    position: Position[];
}

type State = {
    result: Approval | undefined
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

export const approveAsync = createAsyncThunk('approveAsync', async (id: string, {  }) => {
    const response = await httpClient.get(`approval/${id}`)
    return response.data
})

const approveSlice = createSlice({
    name: 'approve',
    initialState,
    reducers: {
        setAddApprove: (state: State, actions: PayloadAction<Position>) => {
            state.result?.position.push(actions.payload)
        },
        setupdateApprove: (state: State, action: PayloadAction<{ id: string; x: number; y: number }>) => {
            const index = state.result?.position.findIndex((i) => i._id === action.payload.id);
            if (index !== -1) {
                // Only update the x and y coordinates of the matched position      
                state.result!.position[index!].x = action.payload.x;
                state.result!.position[index!].y = action.payload.y;
            }
        },
        setDeleteApprove: (state: State, action: PayloadAction<string>) => {
            if (state.result) {
                state.result.position = state.result?.position.filter((i) => i._id !== action.payload);
            }
        }
    },
    // extraReducers(builder) {
    //     builder.addCase(approveAsync.fulfilled, (state: State, action: PayloadAction<Approval[]>) => {
    //         state.isPending = false
    //         state.isError = false
    //         state.error = undefined
    //         state.result = action.payload
    //     })
    //     builder.addCase(approveAsync.pending, (state: State) => {
    //         state.isPending = false
    //         state.isError = false
    //         state.error = undefined
    //         state.result = []
    //     })
    //     builder.addCase(approveAsync.rejected, (state: State, action: PayloadAction<any>) => {
    //         state.isPending = false
    //         state.isError = false
    //         state.error = action.payload.message
    //         state.result = []
    //     })
    // },
});

export const { setAddApprove, setupdateApprove, setDeleteApprove } = approveSlice.actions;
export const approveSelector = (state: RootState) => state.approveReducer;
export default approveSlice.reducer;


