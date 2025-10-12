
const matchSlice = createSlice({
  name: 'match',
  initialState: {
    roomId: null,
    host: null,
    players: [],
    invisiblePieces: false,
    increasedGravity: false,
  },
  reducers: {
    setRoomInfo: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setRoomInfo } = matchSlice.actions;
export default matchSlice.reducer;
