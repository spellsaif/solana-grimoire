import {create} from "zustand";

interface IDLState {
    idlData: any;
    setIdlData: (data:any) => void;
}

export const useIDLStore = create<IDLState>((set) => ({
    idlData: null,
    setIdlData: (data) => set({idlData: data})
}))