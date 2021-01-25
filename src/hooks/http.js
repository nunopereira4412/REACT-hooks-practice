import {useCallback, useReducer} from 'react';

const httpReducer = (curHttpState, action) => {
    switch(action.type) {
      case("SEND"):
        return {loading: true, error: null, responseData: null, extraReq: null, reqIdentifier: action.reqIdentifier};
      case("RESPONSE"):
        return {...curHttpState, loading: false, responseData: action.responseData, extraReq: action.extraReq};
      case("ERROR"):
        return {loading: false, error: action.error.message};
      case("CLEAR"):
        return {...curHttpState, error: null};
      default:
        throw new Error("Should not reach here");
    }
  }

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, 
        {
            loading:       false, 
            error:         null, 
            responseData:  null,
            extraReq:      null,
            reqIdentifier: null
        }
    );

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
        sendRequest:   sendRequest,
        extraReq:      httpState.extraReq,
        reqIdentifier: httpState.reqIdentifier  
    };
};

export default useHttp;