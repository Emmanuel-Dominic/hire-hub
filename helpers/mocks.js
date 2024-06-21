export const mockRequest = () => {
    return {
      body: {},
      params: {},
    };
};
  
export const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
  
export const mockNext = () => jest.fn();
  