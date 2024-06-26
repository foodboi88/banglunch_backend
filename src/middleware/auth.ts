import * as express from "express";
import * as jwt from "jsonwebtoken";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {

  if (securityName === "jwt") {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
      }
      jwt.verify(token, 'dqPyPxJnDS4e2iU0815m', function (err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          // Check if JWT contains all required scopes
          for (let scope of scopes) {
            if (!decoded.scopes.includes(scope)) {
              reject(new Error("JWT does not contain required scope."));
            }
          }
          resolve(decoded);
        }
      });
    });
  }
}
