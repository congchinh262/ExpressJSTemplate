import { Request, Response } from 'express';

import jsonwebtoken from 'jsonwebtoken';
import HttpStatusCodes from '../constants/HttpStatusCode';
import { JWT_CONFIGS, CookieProps } from '../config';



// **** Variables **** //

// Errors
const Errors = {
  ParamFalsey: 'Param is falsey',
  Validation: 'JSON-web-token validation failed.',
} as const;

// Options
const Options = {
  expiresIn: JWT_CONFIGS.EXP,
};


// **** Functions **** //

/**
 * Get session data from request object (i.e. ISessionUser)
 */
function getSessionData<T>(req: Request): Promise<string | T | undefined> {

  const { Key } = CookieProps,
    jwt = req.signedCookies[Key];
  return _decode(jwt);
}

/**
 * Add a JWT to the response 
 */
async function addSessionData(
  res: Response,
  data: string | object,
): Promise<Response> {
  if (!res || !data) {

    throw new Error(`${HttpStatusCodes.BAD_REQUEST}:${Errors.ParamFalsey}`);
  }
  // Setup JWT
  const jwt = await _sign(data),
    { Key, Options } = CookieProps;
  // Return
  return res.cookie(Key, jwt, Options);
}

/**
 * Remove cookie
 */
function clearCookie(res: Response): Response {
  const { Key, Options } = CookieProps;
  return res.clearCookie(Key, Options);
}


// **** Helper Functions **** //

/**
 * Encrypt data and return jwt.
 */
function _sign(data: string | object | Buffer): Promise<string> {
  return new Promise((res, rej) => {
    jsonwebtoken.sign(data, JWT_CONFIGS.SECRET, Options, (err, token) => {
      return err ? rej(err) : res(token || '');
    });
  });
}

/**
 * Decrypt JWT and extract client data.
 */
function _decode<T>(jwt: string): Promise<string | undefined | T> {
  return new Promise((res, rej) => {
    jsonwebtoken.verify(jwt, JWT_CONFIGS.SECRET, (err, decoded) => {
      return err ? rej(Errors.Validation) : res(decoded as T);
    });
  });
}


// **** Export default **** //

export default {
  addSessionData,
  getSessionData,
  clearCookie,
} as const;
