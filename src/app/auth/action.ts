import axios from 'axios';

// signin

interface SigninData {
  username: string;
  password: string;
}

interface SignupData {
  username: string;
  password: string;
  email: string;
}

interface ResponseData {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface Dispatch {
  (action: { type: string; payload: ResponseData }): void;
}

export const signin = (data: SigninData) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post<ResponseData>('/auth/signin', data);
      dispatch({
        type: 'SIGNIN',
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};

// signup
interface SignupResponseData {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const signup = (data: SignupData) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post<SignupResponseData>('/auth/signup', data);
      dispatch({
        type: 'SIGNUP',
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
};