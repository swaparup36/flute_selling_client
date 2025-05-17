"use client";

import { Dispatch, ReactNode, SetStateAction, useContext, useState, createContext } from "react";


interface ProfileContextType {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}

const ProfileContext = createContext<ProfileContextType>({
    activeTab: "profile",
    setActiveTab: () => {}
});

export const GetProfileContext = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({children}: {children: ReactNode}) => {
    const [activeTab, setActiveTab] = useState<string>("profile");

    return (
        <ProfileContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </ProfileContext.Provider>
    );
};