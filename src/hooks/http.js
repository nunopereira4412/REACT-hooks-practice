import {useCallback, useReducer} from 'react';

const initialState = {
    loading:       false, 
    error:         null, 
    responseData:  null,
    extraReq:      null,
    reqIdentifier: null
}

const httpReducer = (curHttpState, action) => {
    switch(action.type) {
      case("SEND"):
        return {...curHttpState, loading: true, reqIdentifier: action.reqIdentifier};
      case("RESPONSE"):
        return {...curHttpState, loading: false, responseData: action.responseData, extraReq: action.extraReq};
      case("ERROR"):
        return {...curHttpState, loading: false, error: action.error.message}; 
      case("CLEAR"):
        return initialState;
      default:
        throw new Error("Should not reach here");
    }
  }

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => dispatchHttp({type: "CLEAR"}), []);

    const sendRequest = useCallback((url, method, body, extraReq, reqIdentifier) => {
        dispatchHttp({type: "SEND", reqIdentifier: reqIdentifier});
        fetch(url, {
            method: method,
            body: body,
            headers: {"Content-type": "application/json"}
        })
            .then(response     => response.json())
            .then(responseData => dispatchHttp(
                {
                    type: "RESPONSE", 
                    responseData: responseData, 
                    extraReq: extraReq
                }
            ))
            .catch(error       => dispatchHttp(
                {
                    type: "ERROR", 
                    error: error
                }
            ));
    }, []);

    return {
        loading:       httpState.loading,
        error:         httpState.error,
        responseData:  httpState.responseData,
        extraReq:      httpState.extraReq,
        reqIdentifier: httpState.reqIdentifier  ,
        sendRequest:   sendRequest,
        clear:         clear
    };
};

export default useHttp;