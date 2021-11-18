import React, { createContext, useState } from "react";

export const GameContext = createContext(null);
export const GameProvider = (props) => {
    const [client, setClient] = useState(null);
    const [room, setRoom] = useState({ id: "" });

    return (
        <GameContext.Provider value={{ client, setClient, room, setRoom }}>
            {props.children}
        </GameContext.Provider>
    );
};
