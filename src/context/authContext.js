import React, {useState} from 'react';

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
})

const AuthContextProvider = props => {
  
    const [authState, setAuthState] = useState(false);

    const loginHandler = () => setAuthState(true);

    return (
        <AuthContext.Provider 
            value={{
                isAuth: authState, 
                login: loginHandler
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;