import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";

type State = {
    result: string | undefined
}

const initialState: State = {
    result: undefined,
}

const pathSlice = createSlice({
    name: 'docpath',
    initialState,
    reducers: {
        setPath: (state: State, actions: PayloadAction<string>) => {
            state.result = actions.payload
        },
    }
})

export const { setPath } = pathSlice.actions
export const pathSelector = (store: RootState) => store.pathReducer
export default pathSlice.reducer