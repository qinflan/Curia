import { createContext, useState, useEffect } from "react";
import { 
    registerUser,
    loginUser,
    getUser,
    updateUser,
    logoutUser,
    refreshAccessToken,
} from "@/api/authHandler";


export type User = {
    email: string,
    id: string,
    firstName: string,
    lastName: string,
    setupComplete: boolean,
    city?: string,
    state?: string,
    dateOfBirth?: Date,
    preferences?: {
        interests: [string],
        subscription: boolean,
        notifications: boolean,
        theme: { 
            type: String, 
            enum: ['light', 'dark'], 
            default: 'light' 
            }
    }
}

type AuthContextType = {
    user: User | null,
    accessToken: string | null,
    loading: boolean,
    login: () => Promise<void>,
    register: () => Promise<void>,
    getUser: () => Promise<void>,
    logout: () => Promise<void>,
    update: () => Promise<void>,
    refresh: () => Promise<void>
}


const AuthContext = createContext<AuthContextType | null>(null);






